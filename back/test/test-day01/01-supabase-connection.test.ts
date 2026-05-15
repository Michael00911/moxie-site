import { describe, it, expect } from 'vitest';
import { anonClient, serviceClient, hasSupabaseCreds } from './helpers/clients';

describe.skipIf(!hasSupabaseCreds)('01 - Supabase 基础连通', () => {
  it('anon client 可以发起请求', async () => {
    const sb = anonClient();
    // ping 任意 tools 行（不一定能拿到数据，但 HTTP 通就行）
    const { error } = await sb
      .from('tools')
      .select('id', { head: true, count: 'exact' });

    // schema 没暴露会返回 PGRST106；表不存在会 42P01；都视为失败
    expect(error, JSON.stringify(error)).toBeNull();
  });

  it('service_role client 可以发起请求', async () => {
    const sb = serviceClient();
    const { error } = await sb
      .from('tools')
      .select('id', { head: true, count: 'exact' });
    expect(error, JSON.stringify(error)).toBeNull();
  });
});
