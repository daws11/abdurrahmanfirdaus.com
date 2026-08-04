// src/demos/kitchen-fresh/screens/FoodItems.tsx
// @ts-nocheck
//
// Production equivalent: DishesPage → DishManager.tsx. Lists every dish
// in the active outlet with prep-time, default duration, and category.
// Tiles match the production dish card layout.

import { useMemo, useState } from "react";
import { Search, Utensils, Clock4, Tag } from "lucide-react";
import { useKitchenFresh } from "../context";
import { findOutlet } from "../mocks";
import { DISHES, getPrepCategoryMeta, type DishDefinition } from "../mocks";

type CategoryFilter = "all" | DishDefinition["category"];

export function FoodItems() {
  const { activeOutletId } = useKitchenFresh();
  const outlet = findOutlet(activeOutletId);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filtered = useMemo(() => {
    let list = DISHES;
    if (category !== "all") list = list.filter((d) => d.category === category);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          String(d.posCode ?? "").includes(q),
      );
    }
    return list;
  }, [category, query]);

  const totalPrep = filtered.reduce((sum, d) => sum + d.prepMinutes, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Dish Manager
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Dishes</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Every dish sold at{" "}
            <strong style={{ color: "var(--fg)" }}>{outlet?.name}</strong> ({outlet?.code}).
            Default shelf life and prep time drive the Fresh Counter timer grid.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className="rounded-md border px-2 py-1"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Dishes
            </span>{" "}
            <span className="font-mono font-semibold tabular-nums" style={{ color: "var(--fg)" }}>
              {filtered.length}
            </span>
          </span>
          <span
            className="rounded-md border px-2 py-1"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Avg prep
            </span>{" "}
            <span className="font-mono font-semibold tabular-nums" style={{ color: "var(--fg)" }}>
              {filtered.length ? Math.round(totalPrep / filtered.length) : 0}m
            </span>
          </span>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex flex-wrap items-center gap-1 rounded-md border p-1 text-xs"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <Tag className="ml-1 h-3 w-3" style={{ color: "var(--muted)" }} />
          {(["all", "base", "beverage", "sauce", "garnish"] as CategoryFilter[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className="rounded-md px-3 py-1.5 font-medium capitalize transition-colors"
              style={{
                backgroundColor: category === c ? "var(--bg)" : "transparent",
                color: category === c ? "var(--fg)" : "var(--muted)",
                boxShadow: category === c ? "inset 0 0 0 1px var(--border)" : "none",
              }}
            >
              {c === "all" ? "All" : getPrepCategoryMeta(c).label}
            </button>
          ))}
        </div>

        <label
          className="flex h-9 items-center gap-2 rounded-md border px-2 text-sm"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <Search className="h-3.5 w-3.5" style={{ color: "var(--muted)" }} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find dish…"
            className="w-44 bg-transparent text-sm focus:outline-none"
            style={{ color: "var(--fg)" }}
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <div
          className="rounded-md border border-dashed px-6 py-12 text-center text-sm"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          No dishes match this filter.
        </div>
      ) : (
        <ul
          className="grid gap-3"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
        >
          {filtered.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </ul>
      )}
    </div>
  );
}

function DishCard({ dish }: { dish: DishDefinition }) {
  const meta = getPrepCategoryMeta(dish.category);
  return (
    <li
      className="relative flex flex-col gap-3 rounded-xl border p-4 transition-shadow hover:shadow-md"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
      }}
      data-testid={`dish-${dish.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: meta.color }}
          >
            {meta.label}
          </div>
          <h3 className="mt-0.5 truncate text-base font-semibold">{dish.name}</h3>
          <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px]" style={{ color: "var(--muted)" }}>
            <span>{dish.id}</span>
            {dish.posCode && (
              <>
                <span aria-hidden>·</span>
                <span>POS {dish.posCode}</span>
              </>
            )}
          </div>
        </div>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: "var(--bg)", color: meta.color }}
        >
          <Utensils className="h-4 w-4" />
        </span>
      </div>

      <dl
        className="grid grid-cols-2 gap-2 border-t pt-3 text-xs"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            Prep time
          </dt>
          <dd className="mt-0.5 flex items-center gap-1 font-mono font-semibold tabular-nums">
            <Clock4 className="h-3 w-3" style={{ color: "var(--muted)" }} />
            {dish.prepMinutes}m
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            Shelf life
          </dt>
          <dd className="mt-0.5 flex items-center gap-1 font-mono font-semibold tabular-nums">
            <Clock4 className="h-3 w-3" style={{ color: "var(--muted)" }} />
            {dish.defaultDurationMinutes}m
          </dd>
        </div>
      </dl>
    </li>
  );
}
