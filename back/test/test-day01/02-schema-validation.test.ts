import { describe, it, expect } from 'vitest';
import { serviceClient, hasSupabaseCreds } from './helpers/clients';

/**
 * 用 information_schema 反查目标库结构是否齐全
 * 通过 RPC 不太方便，这里直接用 service_role 拉一行真实数据，
 * 校验关键字段是否存在 + 类型形态正确
 */

const REQUIRED_COLUMNS: Array<keyof Record<string, unknown>> = [
  'id',
  'source',
  'source_slug',
  'source_url',
  'source_metrics',
  'name_en',
  'tagline',
  'website_url',
  'category_slug',
  'list_slugs',
  'tags',
  'pricing_model',
  'status',
  'crawled_at',
  'created_at',
  'updated_at',
];

describe.skipIf(!hasSupabaseCreds)('02 - tools.tools 表结构', () => {
  it('表存在且关键字段齐全', async () => {
    const sb = serviceClient();
    const { data, error } = await sb
      .schema('tools')
      .from('tools')
      .select('*')
      .limit(1);

    expect(error).toBeNull();
    expect(data).toBeDefined();
    // 表里有数据的话校验字段；空表用空对象代替，仅做最低限度类型断言
    const row = data?.[0] ?? null;
    if (row) {
      for (const col of REQUIRED_COLUMNS) {
        expect(Object.keys(row)).toContain(col);
      }
      expect(Array.isArray(row.list_slugs)).toBe(true);
      expect(Array.isArray(row.tags)).toBe(true);
      expect(typeof row.source_metrics).toBe('object');
    } else {
      console.warn('[02] tools.tools 表为空，跳过字段级断言');
    }
  });

  it('UNIQUE(source, source_slug) 起作用', async () => {
    const sb = serviceClient();
    const probe = {
      source: '__vitest__',
      source_slug: '__probe__',
      source_url: 'http://example.com',
      name_en: 'probe',
      tagline: 'probe',
      website_url: 'http://example.com',
      crawled_at: new Date().toISOString(),
      status: 'pending',
    };

    // 清理可能存在的旧数据
    await sb
      .schema('tools')
      .from('tools')
      .delete()
      .eq('source', '__vitest__');

    const { error: e1 } = await sb.schema('tools').from('tools').insert(probe);
    expect(e1, '首次插入应成功').toBeNull();

    const { error: e2 } = await sb.schema('tools').from('tools').insert(probe);
    expect(e2, '重复 (source, source_slug) 应被唯一约束拦下').not.toBeNull();
    expect(e2?.code).toBe('23505'); // unique_violation

    // 清理
    await sb.schema('tools').from('tools').delete().eq('source', '__vitest__');
  });
});
