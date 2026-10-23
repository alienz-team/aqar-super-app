"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, Search } from "lucide-react";
import { inputStyles } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  /** Present on sortable columns. */
  sortValue?: (row: T) => string | number;
  align?: "start" | "end";
  /** Hidden below this breakpoint to keep phones readable. */
  hideBelow?: "sm" | "md" | "lg";
}

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  /** Text matched by the search box. */
  searchText: (row: T) => string;
  searchLabel: string;
  empty: React.ReactNode;
}

const hide = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell" };

export function DataTable<T>({ rows, columns, rowKey, searchText, searchLabel, empty }: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? rows.filter((r) => searchText(r).toLowerCase().includes(q)) : rows;
    if (!sort) return filtered;
    const column = columns.find((c) => c.key === sort.key);
    if (!column?.sortValue) return filtered;
    const value = column.sortValue;
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = value(a);
      const vb = value(b);
      return (typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb))) * factor;
    });
  }, [rows, columns, query, sort, searchText]);

  function toggleSort(key: string) {
    setSort((s) => (s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null));
  }

  if (rows.length === 0) return <>{empty}</>;

  return (
    <div>
      <label className="relative mb-4 block max-w-sm">
        <span className="sr-only">{searchLabel}</span>
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchLabel}
          className={cn(inputStyles, "ps-9")}
        />
      </label>

      <div className="overflow-x-auto rounded-sm border border-line">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-surface text-xs text-muted">
            <tr>
              {columns.map((c) => {
                const active = sort?.key === c.key;
                const SortIcon = !active ? ChevronsUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                    className={cn("px-4 py-3 font-medium", c.align === "end" ? "text-end" : "text-start", c.hideBelow && hide[c.hideBelow])}
                  >
                    {c.sortValue ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(c.key)}
                        className={cn("inline-flex items-center gap-1 hover:text-ink", active && "text-ink")}
                      >
                        {c.header}
                        <SortIcon className="size-3.5" aria-hidden />
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visible.map((row) => (
              <tr key={rowKey(row)} className="transition-colors hover:bg-surface">
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn("px-4 py-3.5 align-middle", c.align === "end" && "text-end", c.hideBelow && hide[c.hideBelow])}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <p className="px-4 py-10 text-center text-sm text-muted">Nothing matches “{query}”.</p>}
      </div>
      <p className="tabular mt-3 text-xs text-muted" aria-live="polite">
        Showing {visible.length} of {rows.length}
      </p>
    </div>
  );
}
