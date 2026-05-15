import { describe, it, expect } from 'vitest';
import { toolsTable } from '@/lib/supabase-server';
import { revalidate } from '@/app/supabase-tools/page';
import { hasSupabaseCreds } from './helpers/clients';

describe('09 - Supabase 工具列表页面', () => {
  it('应导出 ISR revalidate = 60', () => {
    expect(revalidate).toBe(60);
  });

  describe.skipIf(!hasSupabaseCreds)('Supabase 服务端查询', () => {
    it('能从 tools 表读取数据', async () => {
      const { data, error } = await toolsTable().select('*').limit(3);
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
  });
});
