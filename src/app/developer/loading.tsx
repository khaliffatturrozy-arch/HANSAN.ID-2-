import { SkeletonList } from "@/components/ui/skeleton";

/** Route-transition loading state — skeleton only, no fake content (§4). */
export default function DeveloperLoading() {
  return (
    <div aria-busy="true" aria-label="Loading Developer page">
      <SkeletonList rows={4} />
    </div>
  );
}
