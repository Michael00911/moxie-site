/**
 * 插入 crawler 来源的测试工具数据
 * 运行：npx tsx scripts/seed-crawler-tools.ts
 */

/// <reference types="node" />
import { loadEnv, httpFetch } from './lib/http'

loadEnv('.env.local')

const SUPABASE_URL     = process.env.SUPABASE_URL ?? ''
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ 缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const headers = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation,resolution=ignore-duplicates',
}

// ── 工具数据 ───────────────────────────────────────────────────
const tools = [
  {
    slug: 'perplexity',
    name: 'Perplexity AI',
    name_en: 'Perplexity AI',
    tagline: '带来源引用的 AI 实时问答搜索',
    description: 'Perplexity 是一款 AI 驱动的搜索引擎，每条回答都附带可溯源的网页引用，适合快速调研和事实核查。支持 Pro Search 深度模式，可联网检索最新信息。',
    level: 'L3',
    rating: 4,
    category: 'research',
    tags: ['搜索', 'AI问答', '引用溯源', '实时信息', '调研'],
    pricing: 'freemium',
    price_note: '免费版每天 5 次 Pro 搜索；Pro $20/月无限次',
    website_url: 'https://www.perplexity.ai',
    published_at: '2026-05-01',
    status: 'approved',
    source: 'crawler',
    saves: 0,
    views: 0,
  },
  {
    slug: 'runway',
    name: 'Runway Gen-3 Alpha',
    name_en: 'Runway Gen-3 Alpha',
    tagline: '好莱坞级别的 AI 文生视频',
    description: 'Runway Gen-3 Alpha 支持文字、图片生成高质量短视频，运动流畅、画面一致性高，已被多个商业项目采用。提供 Motion Brush 精确控制运动区域。',
    level: 'L3',
    rating: 4,
    category: 'video',
    tags: ['文生视频', '图生视频', '运动控制', '商业创作'],
    pricing: 'paid',
    price_note: '按积分计费，Standard $12/月起',
    website_url: 'https://runwayml.com',
    published_at: '2026-04-15',
    status: 'approved',
    source: 'crawler',
    saves: 0,
    views: 0,
  },
  {
    slug: 'adobe-firefly',
    name: 'Adobe Firefly',
    name_en: 'Adobe Firefly',
    tagline: '商业安全的 Adobe 官方 AI 图像生成',
    description: 'Adobe Firefly 仅使用 Adobe Stock、授权内容和公共领域素材训练，生成内容具有商业使用授权保障。深度集成 Photoshop、Illustrator，支持生成填充、文字效果。',
    level: 'L3',
    rating: 4,
    category: 'image',
    tags: ['文生图', '商业授权', 'Photoshop集成', '生成填充'],
    pricing: 'freemium',
    price_note: '免费版每月 25 积分；Creative Cloud 订阅包含更多积分',
    website_url: 'https://firefly.adobe.com',
    published_at: '2026-04-10',
    status: 'approved',
    source: 'crawler',
    saves: 0,
    views: 0,
  },
  {
    slug: 'bolt-new',
    name: 'Bolt.new',
    name_en: 'Bolt.new',
    tagline: '浏览器内一句话生成可运行的全栈应用',
    description: 'Bolt.new 由 StackBlitz 出品，在浏览器沙箱中运行完整 Node.js 环境，支持安装 npm 包、读写文件系统。一个 prompt 可生成 React/Next.js/Vite 项目并即时预览。',
    level: 'L3',
    rating: 4,
    category: 'coding',
    tags: ['全栈生成', '浏览器IDE', 'Next.js', 'React', '零配置'],
    pricing: 'freemium',
    price_note: '免费版有 token 限额；Pro $20/月',
    website_url: 'https://bolt.new',
    published_at: '2026-03-20',
    status: 'approved',
    source: 'crawler',
    saves: 0,
    views: 0,
  },
  {
    slug: 'copy-ai',
    name: 'Copy.ai',
    name_en: 'Copy.ai',
    tagline: '营销文案批量生成，内置 GTM 工作流',
    description: 'Copy.ai 专注营销场景，提供 GTM（Go-to-Market）Workflows 可自动化完成竞品分析、ICP 画像、邮件序列等任务。支持多语言输出，内置品牌声音锁定。',
    level: 'L3',
    rating: 3,
    category: 'writing',
    tags: ['营销文案', 'GTM工作流', '批量生成', '邮件序列', '多语言'],
    pricing: 'freemium',
    price_note: '免费版有字数限制；Pro $49/月',
    website_url: 'https://www.copy.ai',
    published_at: '2026-03-05',
    status: 'approved',
    source: 'crawler',
    saves: 0,
    views: 0,
  },
  {
    slug: 'n8n',
    name: 'n8n',
    name_en: 'n8n',
    tagline: '可自托管的开源 AI 工作流自动化平台',
    description: 'n8n 是开源工作流自动化工具，支持 400+ 应用集成，内置 AI Agent 节点可调用 OpenAI/Claude 等模型。可完全自托管，数据不出境，适合有隐私要求的企业。',
    level: 'L3',
    rating: 4,
    category: 'agent',
    tags: ['工作流', '自动化', '开源', '自托管', 'AI Agent', '集成'],
    pricing: 'freemium',
    price_note: '自托管免费；云托管 $20/月起',
    website_url: 'https://n8n.io',
    published_at: '2026-02-01',
    status: 'approved',
    source: 'crawler',
    saves: 0,
    views: 0,
  },
]

// ── 执行插入 ───────────────────────────────────────────────────
async function main() {
  console.log('='.repeat(64))
  console.log('开始插入（共 %d 条）...', tools.length)
  console.log('='.repeat(64))

  let ok = 0, skip = 0, fail = 0

  for (const t of tools) {
    try {
      const { status, body } = await httpFetch(
        `${SUPABASE_URL}/rest/v1/tools`,
        { method: 'POST', headers, body: JSON.stringify(t), timeoutMs: 15_000 }
      )

      if (status === 201) {
        console.log(`  ✅ 插入成功：${t.slug}`)
        ok++
      } else if (status === 200) {
        console.log(`  ⏭️  已存在跳过：${t.slug}`)
        skip++
      } else {
        console.log(`  ❌ 失败 HTTP ${status}：${t.slug}`)
        console.log(`     ${body.slice(0, 200)}`)
        fail++
      }
    } catch (e) {
      console.log(`  ❌ 网络错误：${t.slug} — ${e}`)
      fail++
    }
  }

  console.log('\n' + '─'.repeat(64))
  console.log(`完成：${ok} 插入  ${skip} 跳过  ${fail} 失败`)
}

main().catch(e => { console.error('脚本异常：', e); process.exit(1) })
