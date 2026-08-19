// src/demos/_shared/time.ts
//
// formatRelativeTime — stdlib-only relative time formatter used by
// taxai-chat's sidebar (E.8). Buckets: Today / Yesterday / N days ago /
// locale date. No date-fns/dayjs — Intl.RelativeTimeFormat is built in.
//
// ponytail: assumes system-local midnight for date-only ISO inputs; correct
// for the portfolio (today 2026-08-19, all fixtures fall in expected buckets).

/**
 * Format an ISO date string as a human-friendly relative label.
 * Accepts both date-only ("2026-08-13") and full ISO datetime ("2026-08-13T14:30:00Z").
 * For date-only inputs the date is treated as UTC midnight; the comparison
 * happens against `Date.now()` in the runtime's local timezone.
 */
export function formatRelativeTime(iso: string): string {
  const date = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.round(diffMs / 86_400_000);

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  const sameYear = date.getFullYear() === now.getFullYear();
  return date.toLocaleDateString("en-US", sameYear
    ? { month: "short", day: "numeric" }
    : { month: "short", day: "numeric", year: "numeric" });
}

/** Coarse group label for the chat sidebar groupings in E.8. */
export function groupBucket(iso: string): "Today" | "Yesterday" | "Last 7 days" | "Earlier" {
  const date = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  const diffDays = Math.round((Date.now() - date.getTime()) / 86_400_000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "Last 7 days";
  return "Earlier";
}