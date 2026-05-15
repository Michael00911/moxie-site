import { describe, it, expect } from 'vitest';
import { toolsTable } from '@/lib/supabase/server';
import { hasSupabaseCreds } from './helpers/clients';

/**
 * 模拟 Server Component 在 build 时拉数据
 * - 走的是和 app/tools/page.tsx 里同一个 client
 * - 受 anon RLS 约束（只能拿 approved）
 *
 * 这个测试同时验证：
 * 1. env 是否在 build 阶段可见
 * 2. .schema('tools').from('tools') 链式是否正常
 * 3. 拿到的数据形态符合 Tool 类型
 */
describe.skipIf(!hasSupabaseCreds)('06 - Next.js Server 端拉 tools', () => {
  it('能拉到列表，且字段形态正确', async () => {
    const { data, error } = await toolsTable()
      .select('*')
      .eq('status', 'approved')
      .limit(5);

    expect(error, JSON.stringify(error)).toBeNull();
    expect(Array.isArray(data)).toBe(true);

    if ((data?.length ?? 0) === 0) {
      console.warn('[06] 目标库 approved tools 为空，跳过形态断言');
      return;
    }

    const t = data![0];
    expect(typeof t.id).toBe('number');
    expect(typeof t.source).toBe('string');
    expect(typeof t.source_slug).toBe('string');
    expect(typeof t.name_en).toBe('string');
    expect(typeof t.tagline).toBe('string');
    expect(Array.isArray(t.list_slugs)).toBe(true);
    expect(Array.isArray(t.tags)).toBe(true);
    expect(t.status).toBe('approved');
  });

  it('详情页查询 by (source, source_slug) 能命中', async () => {
    // 先拿一个 approved 的样本，再用 (source, slug) 反查，确认能匹配
    const { data: sample } = await toolsTable()
      .select('source, source_slug')
      .eq('status', 'approved')
      .limit(1);

    if (!sample || sample.length === 0) {
      console.warn('[06] approved tools 为空，跳过详情页查询');
      return;
    }
    const { source, source_slug } = sample[0];

    const { data: detail, error } = await toolsTable()
      .select('*')
      .eq('source', source)
      .eq('source_slug', source_slug)
      .eq('status', 'approved')
      .maybeSingle();
    expect(error).toBeNull();
    expect(detail).toBeTruthy();
    expect(detail?.source).toBe(source);
    expect(detail?.source_slug).toBe(source_slug);
  });
});
