import * as React from "react";

export interface SkeletonProps {
  /** CSS width class, e.g. "w-40". */
  width?: string;
  /** CSS height class, e.g. "h-6". */
  height?: string;
  rounded?: string;
  className?: string;
}

/** Skeleton block — loading state only, never a stand-in for fake data (§4). */
export function Skeleton({ width = "w-full", height = "h-4", rounded = "rounded-md", className = "" }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={`block animate-pulse bg-hansan-line ${width} ${height} ${rounded} ${className}`.trim()}
    />
  );
}

/** Stacked skeleton rows for table/list placeholders. */
export function SkeletonList({ rows = 5, className = "" }: { rows?: number; className?: string }) {
  return (
    <div aria-hidden className={`flex flex-col gap-3 ${className}`.trim()}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-sm border border-hansan-line bg-hansan-surface-raised p-4">
          <Skeleton width="h-8 w-8" height="h-8" rounded="rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton width="w-1/3" />
            <Skeleton width="w-2/3" height="h-3" />
          </div>
        </div>
      ))}
    </div>
  );
}
