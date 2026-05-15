import { describe, it, expect, afterAll } from 'vitest';
import { anonClient, serviceClient, hasSupabaseCreds } from './helpers/clients';

/**
 * submissions.submissions RLS
 * - anon: 仅 INSERT，且必须是 pending + 无审核字段
 * - anon: SELECT 拒绝（返回 0 行或权限错误）
 * - anon: UPDATE / DELETE 拒绝
 */
describe.skipIf(!hasSupabaseCreds)('07 - submissions RLS', () => {
  const probeEmail = '__vitest+rls@example.com';
  const probeUrl = 'https://example.com/__vitest_rls_probe__';

  afterAll(async () => {
    await serviceClient()
      .schema('submissions')
      .from('submissions')
      .delete()
      .eq('contact_email', probeEmail);
  });

  it('anon 可以 INSERT 一条合法的 pending 提交', async () => {
    // 先清理可能的残留
    await serviceClient()
      .schema('submissions')
      .from('submissions')
      .delete()
      .eq('contact_email', probeEmail);

    const { error } = await anonClient()
      .schema('submissions')
      .from('submissions')
      .insert({
        tool_name: 'rls-probe',
        website_url: probeUrl,
        tagline: 'rls probe',
        contact_email: probeEmail,
        category_slugs: ['效率工具'],
      });
    expect(error, JSON.stringify(error)).toBeNull();
  });

  it('anon 不能伪造 status=approved', async () => {
    const { error } = await anonClient()
      .schema('submissions')
      .from('submissions')
      .insert({
        tool_name: 'evil',
        website_url: 'https://example.com/evil',
        tagline: 'evil',
        contact_email: '__vitest+evil@example.com',
        category_slugs: ['效率工具'],
        status: 'approved', // 试图绕过审核
      });
    // RLS 的 WITH CHECK 会拒绝
    expect(error, '伪造 status=approved 应被 RLS 拒绝').not.toBeNull();

    // 兜底清理（如果意外插进去）
    await serviceClient()
      .schema('submissions')
      .from('submissions')
      .delete()
      .eq('contact_email', '__vitest+evil@example.com');
  });

  it('anon 不能伪造 tool_id', async () => {
    const { error } = await anonClient()
      .schema('submissions')
      .from('submissions')
      .insert({
        tool_name: 'evil2',
        website_url: 'https://example.com/evil2',
        tagline: 'evil2',
        contact_email: '__vitest+evil2@example.com',
        category_slugs: ['效率工具'],
        tool_id: 999999, // 试图直接关联到某个 tool
      });
    expect(error, '伪造 tool_id 应被 RLS 拒绝').not.toBeNull();

    await serviceClient()
      .schema('submissions')
      .from('submissions')
      .delete()
      .eq('contact_email', '__vitest+evil2@example.com');
  });

  it('anon SELECT 返回 0 行（不暴露任何提交）', async () => {
    const { data, error } = await anonClient()
      .schema('submissions')
      .from('submissions')
      .select('id')
      .eq('contact_email', probeEmail);
    // 两种实现都可接受：error 不为空 / 或 data 为空
    if (error) {
      expect(error).toBeTruthy();
    } else {
      expect(data?.length ?? 0).toBe(0);
    }
  });

  it('service_role 可以看到所有提交', async () => {
    const { data, error } = await serviceClient()
      .schema('submissions')
      .from('submissions')
      .select('id, status')
      .eq('contact_email', probeEmail);
    expect(error).toBeNull();
    expect(data?.length).toBeGreaterThan(0);
    expect(data?.[0].status).toBe('pending');
  });

  it('CHECK: tagline 超过 50 字被拒', async () => {
    const longTagline = '一'.repeat(51);
    const { error } = await anonClient()
      .schema('submissions')
      .from('submissions')
      .insert({
        tool_name: 'long-tagline',
        website_url: 'https://example.com/long',
        tagline: longTagline,
        contact_email: '__vitest+long@example.com',
        category_slugs: ['效率工具'],
      });
    expect(error, 'tagline > 50 字应被 CHECK 拒绝').not.toBeNull();
    expect(error?.code).toBe('23514');
  });

  it('CHECK: 不在枚举的分类被拒', async () => {
    const { error } = await anonClient()
      .schema('submissions')
      .from('submissions')
      .insert({
        tool_name: 'bad-cat',
        website_url: 'https://example.com/bad-cat',
        tagline: 'bad',
        contact_email: '__vitest+badcat@example.com',
        category_slugs: ['不存在的分类'],
      });
    expect(error, '非法分类应被 CHECK 拒绝').not.toBeNull();
    expect(error?.code).toBe('23514');
  });

  it('UNIQUE: 同 email + 同 URL 重复提交被拒', async () => {
    // 第一次依赖 it[0] 已插入的数据
    const { error } = await anonClient()
      .schema('submissions')
      .from('submissions')
      .insert({
        tool_name: 'rls-probe',
        website_url: probeUrl,
        tagline: 'duplicate',
        contact_email: probeEmail,
        category_slugs: ['效率工具'],
      });
    expect(error, '重复提交应被 UNIQUE 拒绝').not.toBeNull();
    expect(error?.code).toBe('23505');
  });
});
