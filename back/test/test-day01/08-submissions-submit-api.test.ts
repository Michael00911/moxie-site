import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * /api/submissions 提交接口
 *
 * 测试关注点：
 * 1. 入参校验（空字段、邮箱格式、URL 格式、tagline 长度、分类合法性）
 * 2. 成功路径走通
 * 3. DB 错误码正确映射到 HTTP 错误
 *
 * 通过 mock supabase 客户端避免真实网络依赖
 */

const insertMock = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: () => ({
    schema: () => ({
      from: () => ({
        insert: (...args: unknown[]) => insertMock(...args),
      }),
    }),
  }),
  toolsTable: () => ({}),
  submissionsTable: () => ({}),
}));

vi.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) =>
      new Response(JSON.stringify(body), {
        ...init,
        headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
      }),
  },
}));

beforeEach(() => {
  insertMock.mockReset();
  insertMock.mockResolvedValue({ error: null });
});

async function importRoute() {
  return import('@/app/api/submissions/route');
}

function makeReq(body: unknown) {
  return new Request('http://localhost/api/submissions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '1.2.3.4' },
    body: JSON.stringify(body),
  });
}

const validBody = {
  tool_name: 'Claude Code',
  website_url: 'https://claude.com/code',
  tagline: '在终端用 Claude 编程的官方工具',
  contact_email: 'dev@example.com',
  category_slugs: ['编程开发', 'AI Agent'],
};

describe('08 - /api/submissions', () => {
  it('合法提交：200 + 调用 insert，且不包含 status/tool_id 等敏感字段', async () => {
    const { POST } = await importRoute();
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(200);

    expect(insertMock).toHaveBeenCalledTimes(1);
    const payload = insertMock.mock.calls[0][0];
    expect(payload).toMatchObject({
      tool_name: 'Claude Code',
      website_url: 'https://claude.com/code',
      tagline: '在终端用 Claude 编程的官方工具',
      contact_email: 'dev@example.com',
      category_slugs: ['编程开发', 'AI Agent'],
      ip_address: '1.2.3.4',
    });
    // 关键：API 不能自己塞 status / tool_id
    expect('status' in payload).toBe(false);
    expect('tool_id' in payload).toBe(false);
    expect('reviewed_at' in payload).toBe(false);
  });

  it('空 tool_name → 400', async () => {
    const { POST } = await importRoute();
    const res = await POST(makeReq({ ...validBody, tool_name: '   ' }));
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error: { field: string } };
    expect(json.error.field).toBe('tool_name');
  });

  it('非 http(s) URL → 400', async () => {
    const { POST } = await importRoute();
    const res = await POST(makeReq({ ...validBody, website_url: 'ftp://x' }));
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error: { field: string } };
    expect(json.error.field).toBe('website_url');
  });

  it('邮箱格式错误 → 400', async () => {
    const { POST } = await importRoute();
    const res = await POST(makeReq({ ...validBody, contact_email: 'not-an-email' }));
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error: { field: string } };
    expect(json.error.field).toBe('contact_email');
  });

  it('tagline 超过 50 字 → 400', async () => {
    const { POST } = await importRoute();
    const res = await POST(makeReq({ ...validBody, tagline: '一'.repeat(51) }));
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error: { field: string } };
    expect(json.error.field).toBe('tagline');
  });

  it('分类不在枚举里 → 400', async () => {
    const { POST } = await importRoute();
    const res = await POST(makeReq({ ...validBody, category_slugs: ['不存在的分类'] }));
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error: { field: string } };
    expect(json.error.field).toBe('category_slugs');
  });

  it('空分类数组 → 400', async () => {
    const { POST } = await importRoute();
    const res = await POST(makeReq({ ...validBody, category_slugs: [] }));
    expect(res.status).toBe(400);
  });

  it('重复提交 (DB 23505) → 409 DUPLICATE', async () => {
    insertMock.mockResolvedValueOnce({
      error: { code: '23505', message: 'duplicate key value' },
    });
    const { POST } = await importRoute();
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(409);
    const json = (await res.json()) as { error: { code: string } };
    expect(json.error.code).toBe('DUPLICATE');
  });

  it('CHECK 违反 (DB 23514) → 400 VALIDATION_ERROR', async () => {
    insertMock.mockResolvedValueOnce({
      error: { code: '23514', message: 'check constraint failed' },
    });
    const { POST } = await importRoute();
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(400);
  });

  it('其他 DB 错 → 500 DB_ERROR', async () => {
    insertMock.mockResolvedValueOnce({
      error: { code: '08000', message: 'connection failure' },
    });
    const { POST } = await importRoute();
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(500);
  });

  it('请求体不是合法 JSON → 400', async () => {
    const { POST } = await importRoute();
    const req = new Request('http://localhost/api/submissions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{not json',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('category_slugs 自动去重', async () => {
    const { POST } = await importRoute();
    await POST(
      makeReq({ ...validBody, category_slugs: ['编程开发', '编程开发', 'AI Agent'] }),
    );
    const payload = insertMock.mock.calls[0][0];
    expect(payload.category_slugs).toEqual(['编程开发', 'AI Agent']);
  });
});
