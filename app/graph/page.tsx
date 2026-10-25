import { graph } from "@/lib/data";
import { PageHeading, SourceLink } from "@/components/ui";
import { GraphSearch } from "@/components/graph-search";
export const metadata = { title: "Graph" };
export default function GraphPage() {
  const g = graph();
  return (
    <>
      <PageHeading
        eyebrow="04 / RESEARCH GRAPH"
        title="A lead is part of a larger story."
      >
        <p>
          Search the saved finding nodes, then inspect their connected passages,
          claims and study checks. Literature agreement and cross-study
          concordance are distinct evidence types.
        </p>
      </PageHeading>
      <GraphSearch nodes={g.nodes} edges={g.edges} />
      <SourceLink href="/evidence/graph">
        Download complete graph and relation probabilities
      </SourceLink>
    </>
  );
}
