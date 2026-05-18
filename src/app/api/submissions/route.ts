import { NextResponse } from 'next/server';
import { submissionsTable } from '@/lib/supabase-server';

// 允许的分类枚举
const ALLOWED_CATEGORIES = [
  '编程开发',
  '视频制作',
  '图像生成',
  '写作助手',
  '音频语音',
  'AI Agent',
  '研究分析',
  '效率工具',
  '营销增长'
];

// 验证函数
function validateSubmission(data: any) {
  const errors: { field: string; message: string }[] = [];

  // tool_name: 非空
  if (!data.tool_name || typeof data.tool_name !== 'string' || data.tool_name.trim().length === 0) {
    errors.push({ field: 'tool_name', message: '工具名称不能为空' });
  }

  // website_url: 必须是 http/https 开头
  if (!data.website_url || typeof data.website_url !== 'string' || !/^https?:\/\//.test(data.website_url)) {
    errors.push({ field: 'website_url', message: '网站链接必须是有效的 http/https 链接' });
  }

  // tagline: 不超过50字
  if (!data.tagline || typeof data.tagline !== 'string' || data.tagline.length > 50) {
    errors.push({ field: 'tagline', message: '一句话描述不能超过50字' });
  }

  // contact_email: 有效的邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.contact_email || typeof data.contact_email !== 'string' || !emailRegex.test(data.contact_email)) {
    errors.push({ field: 'contact_email', message: '联系邮箱格式不正确' });
  }

  // category_slugs: 必须在允许的分类中，至少一个
  if (!Array.isArray(data.category_slugs) || data.category_slugs.length === 0) {
    errors.push({ field: 'category_slugs', message: '至少需要选择一个分类' });
  } else {
    const invalidCategories = data.category_slugs.filter((cat: string) => !ALLOWED_CATEGORIES.includes(cat));
    if (invalidCategories.length > 0) {
      errors.push({ field: 'category_slugs', message: `包含无效的分类: ${invalidCategories.join(', ')}` });
    }
  }

  return errors;
}

export async function POST(request: Request) {
  try {
    // 解析请求体
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: { field: 'body', message: '请求体必须是有效的 JSON' } },
        { status: 400 }
      );
    }

    // 验证数据
    const validationErrors = validateSubmission(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors[0] },
        { status: 400 }
      );
    }

    // 获取客户端IP
    const ipAddress = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    // 准备插入数据
    const submissionData = {
      tool_name: body.tool_name.trim(),
      website_url: body.website_url.trim(),
      tagline: body.tagline.trim(),
      contact_email: body.contact_email.trim().toLowerCase(),
      category_slugs: [...new Set(body.category_slugs)], // 去重
      ip_address: ipAddress,
      user_agent: request.headers.get('user-agent') || undefined,
    };

    // 插入数据库
    const { error } = await submissionsTable().insert(submissionData);

    if (error) {
      // 处理数据库错误
      if (error.code === '23505') {
        // 唯一约束违反（重复提交）
        return NextResponse.json(
          { error: { code: 'DUPLICATE', message: '该工具已被提交，请勿重复提交' } },
          { status: 409 }
        );
      } else if (error.code === '23514') {
        // 检查约束违反
        return NextResponse.json(
          { error: { code: 'VALIDATION_ERROR', message: '数据验证失败' } },
          { status: 400 }
        );
      } else {
        // 其他数据库错误
        console.error('Database error:', error);
        return NextResponse.json(
          { error: { code: 'DB_ERROR', message: '数据库操作失败' } },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, message: '提交成功，我们会尽快审核' });
  } catch (error) {
    console.error('Submissions API error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' } },
      { status: 500 }
    );
  }
}