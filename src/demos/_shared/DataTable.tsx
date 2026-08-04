// src/demos/_shared/DataTable.tsx
//
// Theme-aware table primitive. Sort indicators and row hover use theme
// variables so each demo's brand shows through.

import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortBy?: (row: T) => string | number;
  className?: string;
  align?: "left" | "right" | "center";
}

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  onRowClick,
  emptyTitle = "No results",
  emptyDescription,
  emptyAction,
  initialSort,
  selectable,
  selectedKeys,
  onSelectionChange,
  renderSelectionActions,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  initialSort?: { key: string; dir: "asc" | "desc" };
  selectable?: boolean;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  renderSelectionActions?: (count: number) => ReactNode;
}) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(
    initialSort ?? null,
  );

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortBy) return rows;
    const acc = col.sortBy;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = acc(a);
      const bv = acc(b);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [rows, sort, columns]);

  if (rows.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  const selected = selectable ? new Set(selectedKeys ?? []) : new Set<string>();
  const allSelected =
    selectable && rows.length > 0 && rows.every((r) => selected.has(rowKey(r)));
  const someSelected: boolean = !!(
    selectable && !allSelected && rows.some((r) => selected.has(rowKey(r)))
  );

  function toggleAll() {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(rows.map(rowKey));
    }
  }
  function toggleOne(row: T) {
    if (!onSelectionChange) return;
    const k = rowKey(row);
    const next = new Set(selected);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    onSelectionChange(Array.from(next));
  }

  return (
    <div
      className="overflow-hidden rounded-md border"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg)",
              }}
            >
              {selectable && (
                <th
                  className="h-9 w-10 px-3 text-left"
                  style={{ color: "var(--muted)" }}
                >
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleAll}
                    className="h-3.5 w-3.5 cursor-pointer accent-[var(--accent)]"
                  />
                </th>
              )}
              {columns.map((c) => {
                const sortable = !!c.sortBy;
                const active = sort?.key === c.key;
                return (
                  <th
                    key={c.key}
                    className={cn(
                      "h-9 px-3 text-[11px] font-medium uppercase tracking-widest",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                      !c.align && "text-left",
                      sortable && "cursor-pointer select-none",
                      c.className,
                    )}
                    style={{ color: "var(--muted)" }}
                    onClick={() => {
                      if (!sortable) return;
                      setSort((prev) => {
                        if (prev?.key !== c.key) return { key: c.key, dir: "asc" };
                        if (prev.dir === "asc") return { key: c.key, dir: "desc" };
                        return null;
                      });
                    }}
                  >
                    <span
                      className={cn(
                        "inline-flex items-center gap-1",
                        c.align === "right" && "flex-row-reverse",
                      )}
                    >
                      {c.header}
                      {sortable && (
                        <span style={{ color: "var(--muted)" }}>
                          {active ? (
                            sort?.dir === "asc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const k = rowKey(row);
              const isSel = selectable && selected.has(k);
              return (
                <tr
                  key={k}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-b last:border-b-0 transition-colors",
                    onRowClick && "cursor-pointer",
                    isSel && "bg-[var(--bg)]",
                  )}
                  style={{ borderColor: "var(--border)" }}
                >
                  {selectable && (
                    <td className="h-10 w-10 px-3 align-middle">
                      <input
                        type="checkbox"
                        aria-label="Select row"
                        checked={isSel}
                        onChange={() => toggleOne(row)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-3.5 w-3.5 cursor-pointer accent-[var(--accent)]"
                      />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        "h-10 px-3 align-middle",
                        c.align === "right" && "text-right tabular-nums",
                        c.align === "center" && "text-center",
                        c.className,
                      )}
                      style={{ color: "var(--fg)" }}
                    >
                      {c.cell(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectable && selectedKeys && selectedKeys.length > 0 && renderSelectionActions && (
        <div
          className="flex items-center gap-2 border-t px-3 py-2 text-xs"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          {renderSelectionActions(selectedKeys.length)}
        </div>
      )}
    </div>
  );
}
