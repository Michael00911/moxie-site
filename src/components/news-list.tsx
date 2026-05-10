import type { NewsItem } from "@/lib/data";

export function NewsList({ items }: { items: NewsItem[] }) {
  return (
    <ol className="space-y-3">
      {items.map((item, i) => (
        <li key={item.title} className="flex gap-3">
          <span
            className={`shrink-0 w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
              i < 3 ? "bg-amber-500 text-white" : "bg-muted-bg text-muted"
            }`}
          >
            {i + 1}
          </span>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm leading-snug hover:underline"
          >
            {item.title}
            {item.source && (
              <span className="block text-xs text-muted mt-0.5">
                {item.source} · {item.date}
              </span>
            )}
          </a>
        </li>
      ))}
    </ol>
  );
}
