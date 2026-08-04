// src/demos/kitchen-fresh/screens/Categories.tsx
// @ts-nocheck
//
// Production equivalent: not a standalone page in the production sidebar —
// this view aggregates the dish + stock category taxonomy so reviewers can
// see how the data is sliced. Each category tile shows the count, the
// average prep time, and a sample of dishes that fall into it.

import { useKitchenFresh } from "../context";
import {
  CATEGORIES,
  DISHES,
  PREP_ITEMS,
  STOCK_ROWS,
  getPrepCategoryMeta,
  type PrepCategory,
} from "../mocks";
import { Clock4, Boxes, Utensils, ChevronRight } from "lucide-react";

export function Categories() {
  const { activeOutletId } = useKitchenFresh();
  const dishesHere = DISHES; // catalog-level
  const prepHere = PREP_ITEMS.filter((p) => p.outletId === activeOutletId);
  const stockHere = STOCK_ROWS.filter((s) => s.outletId === activeOutletId);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header>
        <div
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--muted)" }}
        >
          Taxonomy
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Categories</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Prep and stock are sliced by category for filtering on Fresh Counter
          and Stocktake. Categories aggregate dish counts, stock SKUs, and
          average prep time.
        </p>
      </header>

      <ul
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
      >
        {CATEGORIES.map((cat) => {
          const meta = cat.category in getPrepCategoryMeta({} as PrepCategory)
            ? getPrepCategoryMeta(cat.category as PrepCategory)
            : null;
          const dishesInCat = dishesHere.filter((d) => d.category === cat.category);
          const stockInCat = stockHere.filter((s) => s.category === cat.category);
          const prepInCat = prepHere.filter((p) => p.category === cat.category);
          const tone = meta?.color ?? "#475569";

          return (
            <li
              key={String(cat.category)}
              className="flex flex-col gap-3 rounded-xl border p-4 transition-shadow hover:shadow-md"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              <header className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div
                    className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: tone }}
                  >
                    {meta?.label ?? cat.label}
                  </div>
                  <h3 className="mt-0.5 truncate text-base font-semibold">
                    {cat.label}
                  </h3>
                </div>
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                  style={{ backgroundColor: "var(--bg)", color: tone }}
                >
                  <ChevronRight className="h-4 w-4" />
                </span>
              </header>

              <dl className="grid grid-cols-3 gap-2 border-t pt-3 text-xs" style={{ borderColor: "var(--border)" }}>
                <CountCell
                  icon={<Utensils className="h-3 w-3" />}
                  label="Dishes"
                  value={dishesInCat.length || cat.dishCount}
                />
                <CountCell
                  icon={<Boxes className="h-3 w-3" />}
                  label="Stock SKUs"
                  value={stockInCat.length || cat.stockCount}
                />
                <CountCell
                  icon={<Clock4 className="h-3 w-3" />}
                  label="Avg prep"
                  value={`${cat.avgPrepMin}m`}
                />
              </dl>

              {(dishesInCat.length > 0 || prepInCat.length > 0) && (
                <div className="border-t pt-3 text-xs" style={{ borderColor: "var(--border)" }}>
                  <div className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                    Sample dishes
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {(dishesInCat.length ? dishesInCat : []).slice(0, 4).map((d) => (
                      <li
                        key={d.id}
                        className="flex items-center justify-between truncate"
                        style={{ color: "var(--fg)" }}
                      >
                        <span className="truncate">{d.name}</span>
                        <span className="ml-2 font-mono text-[10px]" style={{ color: "var(--muted)" }}>
                          {d.prepMinutes}m
                        </span>
                      </li>
                    ))}
                    {dishesInCat.length === 0 && prepInCat.slice(0, 4).map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between truncate"
                        style={{ color: "var(--fg)" }}
                      >
                        <span className="truncate">{p.name}</span>
                        <span className="ml-2 font-mono text-[10px]" style={{ color: "var(--muted)" }}>
                          {p.id}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CountCell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
        {icon}
        {label}
      </dt>
      <dd className="mt-0.5 font-mono text-sm font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
