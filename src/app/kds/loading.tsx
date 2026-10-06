import { SkeletonList } from "@/components/ui/skeleton";

/** Route-transition loading state — skeleton only, no fake content (§4). */
export default function KdsLoading() {
  return (
    <div aria-busy="true" aria-label="Loading KDS page">
      <SkeletonList rows={3} />
    </div>
  );
}
