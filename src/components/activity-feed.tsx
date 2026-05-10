import Link from "next/link";
import { activityFeed, type Activity } from "@/lib/feed";

export function ActivityFeed({ limit = 10 }: { limit?: number }) {
  const items = activityFeed.slice(0, limit);
  return (
    <ul className="space-y-3">
      {items.map((a) => (
        <li key={a.id}>
          <Link
            href={a.href}
            className="block group -mx-2 p-2 rounded-md hover:bg-muted-bg/70"
          >
            <div className="flex items-start gap-2.5">
              <span className="text-base shrink-0 mt-0.5">{a.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {a.badge && (
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${a.badgeColor ?? "bg-muted-bg text-muted"}`}
                    >
                      {a.badge}
                    </span>
                  )}
                  <span className="text-[10px] text-muted">{a.time}</span>
                </div>
                <div className="text-sm leading-snug group-hover:underline line-clamp-2">
                  {a.title}
                </div>
                {a.desc && (
                  <div className="text-xs text-muted mt-0.5 line-clamp-1">{a.desc}</div>
                )}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
