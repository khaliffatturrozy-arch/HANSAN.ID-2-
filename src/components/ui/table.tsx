import * as React from "react";

export interface TableColumn<T> {
  key: string;
  header: string;
  /** Cell renderer — structural only; rows come from caller state. */
  render: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  width?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Required: honest empty state — never invent rows (§4). */
  emptyMessage: string;
  caption?: string;
  className?: string;
}

/**
 * Flat/dense table (§10: flat for dense tables / content-heavy areas).
 * Rows are caller-owned — this component never fabricates data.
 */
export function Table<T>({ columns, rows, rowKey, emptyMessage, caption, className = "" }: TableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto rounded-neu border border-hansan-line bg-hansan-surface-raised shadow-neu-flat ${className}`.trim()}>
      <table className="w-full border-collapse text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-hansan-line">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                style={c.width ? { width: c.width } : undefined}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-hansan-ink-muted ${
                  c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"
                }`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-hansan-ink-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-hansan-line last:border-0 hover:bg-hansan-surface-soft">
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`px-4 py-3 text-hansan-ink ${
                      c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"
                    }`}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
