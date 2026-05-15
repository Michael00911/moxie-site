import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { anonClient, serviceClient, hasSupabaseCreds } from './helpers/clients';

/**
 * RLS 策略：
 * - tools: anon 只能读 status='approved' 的行；写操作全部拒绝
 * - service_role: 完全放行
 */
describe.skipIf(!hasSupabaseCreds)('03 - tools.tools RLS', () => {
  const probeApproved = {
    source: '__vitest_rls__',
    source_slug: 'approved-one',
    source_url: 'http://example.com/a',
    name_en: 'rls-probe-approved',
    tagline: 'approved',
    website_url: 'http://example.com/a',
    crawled_at: new Date().toISOString(),
    status: 'approved' as const,
  };
  const probePending = {
    source: '__vitest_rls__',
    source_slug: 'pending-one',
    source_url: 'http://example.com/p',
    name_en: 'rls-probe-pending',
    tagline: 'pending',
    website_url: 'http://example.com/p',
    crawled_at: new Date().toISOString(),
    status: 'pending' as const,
  };

  beforeAll(async () => {
    const sb = serviceClient();
    await sb.schema('tools').from('tools').delete().eq('source', '__vitest_rls__');
    const { error } = await sb
      .schema('tools')
      .from('tools')
      .insert([probeApproved, probePending]);
    expect(error, '准备 RLS 测试数据失败').toBeNull();
  });

  afterAll(async () => {
    await serviceClient()
      .schema('tools')
      .from('tools')
      .delete()
      .eq('source', '__vitest_rls__');
  });

  it('anon 能读到 approved 行', async () => {
    const { data, error } = await anonClient()
      .schema('tools')
      .from('tools')
      .select('source_slug, status')
      .eq('source', '__vitest_rls__')
      .eq('status', 'approved');
    expect(error).toBeNull();
    expect(data?.length).toBe(1);
    expect(data?.[0].source_slug).toBe('approved-one');
  });

  it('anon 读不到 pending 行（被 RLS 过滤）', async () => {
    const { data, error } = await anonClient()
      .schema('tools')
      .from('tools')
      .select('source_slug, status')
      .eq('source', '__vitest_rls__')
      .eq('status', 'pending');
    expect(error).toBeNull();
    expect(data?.length).toBe(0);
  });

  it('anon 不能 INSERT', async () => {
    const { error } = await anonClient()
      .schema('tools')
      .from('tools')
      .insert({
        source: '__vitest_rls__',
        source_slug: 'anon-attempt',
        source_url: 'x',
        name_en: 'x',
        tagline: 'x',
        website_url: 'x',
        crawled_at: new Date().toISOString(),
      });
    expect(error, 'anon 写入应被 RLS 拒绝').not.toBeNull();
  });

  it('anon 不能 DELETE', async () => {
    const { error } = await anonClient()
      .schema('tools')
      .from('tools')
      .delete()
      .eq('source', '__vitest_rls__');
    // 注意：Supabase 在 RLS 拒绝写操作时通常返回 error 或 0 行受影响
    // 这里只断言"数据没被删"
    const { data: after } = await serviceClient()
      .schema('tools')
      .from('tools')
      .select('id')
      .eq('source', '__vitest_rls__');
    expect(after?.length).toBe(2);
    // error 也常见，不强断言
    void error;
  });
});
