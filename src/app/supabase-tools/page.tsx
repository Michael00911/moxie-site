import { toolsTable } from '@/lib/supabase-server';

export const revalidate = 60;

export const metadata = {
  title: 'Supabase 工具列表',
  description: '从 Supabase tools 表读取工具数据，并使用 ISR 每 60 秒重新验证。',
};

type ToolRecord = {
  id: number;
  name?: string;
  name_en?: string;
  tagline?: string;
  source?: string;
  source_slug?: string;
  status?: string;
  website_url?: string;
};

export default async function SupabaseToolsPage() {
  const { data, error } = await toolsTable().select('*');
  const tools = Array.isArray(data) ? data : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Supabase 工具列表</h1>
        <p className="mt-2 text-muted max-w-2xl">
          从 Supabase 的 <code className="rounded bg-slate-100 px-1 py-0.5">tools</code> 表读取全部数据，使用 ISR 每 60 秒重新验证。
        </p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
          <p className="font-semibold">无法读取 Supabase 数据</p>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-sm text-muted">{error.message ?? JSON.stringify(error)}</pre>
        </div>
      ) : tools.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted">
          <p className="text-lg font-medium">当前没有可用的工具数据。</p>
          <p className="mt-2">请检查 Supabase `tools` 表是否包含已审核的数据。</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted">数据来源</p>
              <p className="text-xl font-semibold">Supabase tools 表</p>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
              {tools.length} 条记录
            </div>
          </div>

          <ul className="grid gap-4">
            {tools.map((tool: ToolRecord) => (
              <li key={tool.id ?? `${tool.source}-${tool.source_slug}`} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight text-foreground truncate">
                      {tool.name ?? tool.name_en ?? `${tool.source ?? '未知来源'}`} 
                    </h2>
                    <p className="mt-2 text-sm text-muted leading-relaxed">
                      {tool.tagline ?? '暂无描述'}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-full border border-border bg-slate-100 px-3 py-1 text-xs uppercase tracking-wider text-slate-600">
                    {tool.status ?? 'unknown'}
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-muted">
                  <div>
                    <span className="font-medium text-foreground">来源：</span>
                    {tool.source ?? '未知'} / {tool.source_slug ?? 'unknown'}
                  </div>
                  {tool.website_url ? (
                    <div>
                      <span className="font-medium text-foreground">链接：</span>
                      <a
                        href={tool.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        {tool.website_url}
                      </a>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
