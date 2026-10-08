import Link from "next/link";
import type { WorkspaceSectionGroup } from "@/config/routes";

/**
 * CatalogIndex — grouped directory of a workspace's sections (design direction).
 * Editorial index rows (number / title / hint / arrow) that mirror the
 * sidebar groups, so owners see what each module does and where to act.
 */
export function CatalogIndex({ groups }: { groups: WorkspaceSectionGroup[] }) {
  let n = 0;
  return (
    <div className="overflow-hidden rounded-sm border border-hansan-line bg-hansan-surface-raised">
      {groups.map((group) => (
        <div key={group.id} className="border-b border-hansan-line last:border-b-0">
          <div className="flex items-baseline justify-between gap-3 bg-hansan-surface-soft px-5 py-2.5">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-hansan-ink">{group.label}</p>
            <p className="text-xs text-hansan-ink-muted">{group.hint}</p>
          </div>
          <ul>
            {group.sections.map((section) => {
              n += 1;
              const num = String(n).padStart(2, "0");
              return (
                <li key={section.path} className="border-t border-hansan-line first:border-t-0">
                  <Link
                    href={section.path}
                    className="group flex items-center gap-4 px-5 py-3.5 transition hover:bg-hansan-surface-soft focus-visible:outline-none focus-visible:[box-shadow:inset_var(--focus-ring)]"
                  >
                    <span aria-hidden className="font-mono text-xs text-hansan-ink-muted">
                      {num}
                    </span>
                    <span className="flex-1 text-sm font-bold text-hansan-ink group-hover:underline group-hover:decoration-hansan-orange group-hover:underline-offset-4">
                      {section.label}
                    </span>
                    <span aria-hidden className="text-hansan-ink-muted transition group-hover:translate-x-0.5 group-hover:text-hansan-orange">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
