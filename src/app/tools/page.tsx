import { Suspense } from "react";
import type { Metadata } from "next";
import { tools } from "@/lib/data";
import { ToolsList } from "./tools-list";

export const metadata: Metadata = {
  title: "全部工具",
  description: "Moxie收录的全部 AI 工具，按分类、等级、关键词筛选",
};

export default function ToolsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">全部工具</h1>
        <p className="text-muted mt-2">
          共 <span className="font-medium text-foreground">{tools.length}</span> 个工具，按子墨亲测程度分级
        </p>
      </header>
      <Suspense fallback={<div className="text-muted text-sm py-10 text-center">加载中…</div>}>
        <ToolsList />
      </Suspense>
    </div>
  );
}
