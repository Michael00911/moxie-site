// import { NextResponse } from 'next/server';
// import { revalidateTag, revalidatePath } from 'next/cache';
import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function POST(request: Request) {
  try {
    // 验证 webhook secret
    const secret = request.headers.get('x-webhook-secret');
    if (!secret || secret !== REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // 处理 tools 表的变更
    if (body.schema === 'tools' && body.table === 'tools') {
      revalidateTag('tools');

      // 重新验证工具列表页面
      revalidatePath('/tools');

      // 如果有记录信息，重新验证具体工具页面
      if (body.record) {
        const { source, source_slug } = body.record;
        if (source && source_slug) {
          revalidatePath(`/tools/${source}/${source_slug}`);
        }
      }

      // 如果是 UPDATE 操作且 slug 发生变化，重新验证旧路径
      if (body.type === 'UPDATE' && body.old_record) {
        const { source: oldSource, source_slug: oldSlug } = body.old_record;
        if (oldSource && oldSlug) {
          revalidatePath(`/tools/${oldSource}/${oldSlug}`);
        }
      }
    }

    // 处理 submissions 表的变更
    if (body.schema === 'submissions' && body.table === 'submissions') {
      revalidateTag('submissions');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Revalidate webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}