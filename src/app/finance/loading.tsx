import { SkeletonList } from "@/components/ui/skeleton";

/** Route-transition loading state — skeleton only, no fake content (§4). */
export default function FinanceLoading() {
  return (
    <div aria-busy="true" aria-label="Loading Finance page">
      <SkeletonList rows={4} />
    </div>
  );
}
