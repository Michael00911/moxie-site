import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * 直接 import route handler 测，不需要起 Next.js server
 *
 * 关注三件事：
 * 1. 没带 secret 的请求被 401
 * 2. tools 表的 webhook 触发 revalidateTag('tools') + revalidatePath('/tools/:source/:slug')
 * 3. submissions 表的 webhook 触发 revalidateTag('submissions')
 */

const revalidateTag = vi.fn();
const revalidatePath = vi.fn();

vi.mock('next/cache', () => ({
  revalidateTag: (...args: unknown[]) => revalidateTag(...args),
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));

// 让 NextResponse.json 能跑（不依赖 Next 运行时）
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
  revalidateTag.mockClear();
  revalidatePath.mockClear();
  process.env.REVALIDATE_SECRET = 'test-secret';
});

async function importRoute() {
  // 动态 import，确保上面的 mock 先生效
  return import('@/app/api/revalidate/route');
}

function makeReq(body: unknown, opts: { secret?: string } = {}) {
  return new Request('http://localhost/api/revalidate', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(opts.secret !== undefined ? { 'x-webhook-secret': opts.secret } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe('05 - /api/revalidate', () => {
  it('没带 secret 返回 401', async () => {
    const { POST } = await importRoute();
    const res = await POST(makeReq({}, {}));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('secret 错误返回 401', async () => {
    const { POST } = await importRoute();
    const res = await POST(makeReq({}, { secret: 'wrong' }));
    expect(res.status).toBe(401);
  });

  it('tools 表更新触发 revalidateTag("tools") + 列表页 + 详情页', async () => {
    const { POST } = await importRoute();
    const res = await POST(
      makeReq(
        {
          type: 'UPDATE',
          schema: 'tools',
          table: 'tools',
          record: { id: 42, source: 'producthunt', source_slug: 'foo' },
        },
        { secret: 'test-secret' },
      ),
    );
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith('tools');
    expect(revalidatePath).toHaveBeenCalledWith('/tools/producthunt/foo');
    expect(revalidatePath).toHaveBeenCalledWith('/tools');
  });

  it('UPDATE 改 slug 时新旧路径都被刷新', async () => {
    const { POST } = await importRoute();
    await POST(
      makeReq(
        {
          type: 'UPDATE',
          schema: 'tools',
          table: 'tools',
          record: { id: 42, source: 'producthunt', source_slug: 'new-slug' },
          old_record: { id: 42, source: 'producthunt', source_slug: 'old-slug' },
        },
        { secret: 'test-secret' },
      ),
    );
    const paths = revalidatePath.mock.calls.map((c) => c[0]);
    expect(paths).toContain('/tools/producthunt/new-slug');
    expect(paths).toContain('/tools/producthunt/old-slug');
  });

  it('submissions 表只刷新 submissions tag', async () => {
    const { POST } = await importRoute();
    await POST(
      makeReq(
        { type: 'INSERT', schema: 'submissions', table: 'submissions', record: {} },
        { secret: 'test-secret' },
      ),
    );
    expect(revalidateTag).toHaveBeenCalledWith('submissions');
    expect(revalidateTag).not.toHaveBeenCalledWith('tools');
  });
});
