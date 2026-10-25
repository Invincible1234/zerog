import { manifest, totals } from "@/lib/data";
import { PageHeading, SourceLink } from "@/components/ui";
export const metadata = { title: "Methods & sources" };
export default function Method() {
  const m = manifest(),
    t = totals();
  return (
    <>
      <PageHeading
        eyebrow="METHOD / LIMITS / PROVENANCE"
        title="Know what you are looking at."
      >
        <p>
          A browser interface over a fixed Helix snapshot. Nothing on this
          website runs the original inference pipeline.
        </p>
      </PageHeading>
      <section className="prose">
        <h2>What is real in this demo</h2>
        <p>
          The catalog has {t.studies} records. The four bundled CSV tables
          contain {t.rows.toLocaleString("en-US")} gene rows in total, not
          unique genes or human participants. OSD-421 has {t.survivors} saved
          survivors. The graph has {t.findings} finding nodes. Counts are
          calculated from bundled data, not generated for display.
        </p>
        <p>
          The Python engine proposes leads and attaches table statistics in
          code, then applies a separate critic. This Next.js demo reads the
          saved outputs. Playback only reveals them over time.
        </p>
        <p>
          The graph export contains Python non-finite numeric tokens. The
          adapter treats these as unavailable in memory, never zero. Original
          source files and downloads remain unchanged.
        </p>
        <h2>Three layers, three meanings</h2>
        <ul>
          <li>
            <strong>Table numbers:</strong> saved code-attached effect sizes,
            adjusted p-values and carrier counts. These retain the upstream
            payload’s rounding and definitions.
          </li>
          <li>
            <strong>Critic label:</strong> a saved model judgment against a
            rulebook. “ok” means passed that screening, not a validated
            biological finding.
          </li>
          <li>
            <strong>Replication check:</strong> a separate saved comparison. Its
            verdict is an upstream claim, not an independent verification by
            this website.
          </li>
        </ul>
        <h2>Known sample-count discrepancy</h2>
        <p>
          The OSD-421 product summary says 11 Space Flight and 9 Ground Control
          samples, while the original CSV header contains 10 flight and 10
          ground sample columns. Carrier fractions also come from the upstream
          saved payload. Both artifacts are preserved byte-for-byte. Do not
          interpret those group denominators as independently verified. An
          independent scientist should resolve the sample mapping before
          scientific reuse.
        </p>
        <h2>Labels and evaluation</h2>
        <p>
          The saved training/holdout labels originate from the repo’s LLM jury,
          even where the JSON metric keys use “human.” They are not an
          Inspiration4 human golden set. The NASA paper-claim files are
          test-only fixtures and never enter training or playback. The rulebooks
          and evaluations are readable on Loop; the demo pins v2 and cannot
          promote rules.
        </p>
        <h2>Human data is a separate adapter</h2>
        <p>
          Inspiration4 entries are a directory sourced from the published
          data-access paper. No human differential-expression tables or critic
          runs are bundled for that mission. Public metadata does not guarantee
          public access to every assay file. No raw human sequence data are
          fetched.
        </p>
        <h2>What this cannot say</h2>
        <p>
          Leads are not experimental validation, clinical advice, causal
          evidence, or countermeasure recommendations. There is no NASA or
          SpaceX affiliation or endorsement. No model confidence score is
          presented as a calibrated probability that biology is true.
        </p>
        <h2>Frozen source</h2>
        <p>
          <a href={m.source}>{m.source}</a>
          <br />
          Commit <code>{m.commit}</code>. Source JSON, CSV and rulebook files
          are copied unchanged. A manifest records hashes and the row-count
          derivation.
        </p>
        <p>
          <SourceLink href="/evidence/provenance">
            Download checksum manifest
          </SourceLink>
        </p>
        <p>
          <SourceLink href="https://www.nature.com/articles/s41526-024-00393-5">
            Inspiration4 data-access paper
          </SourceLink>
        </p>
        <p>
          <SourceLink href="https://www.nasa.gov/reference/osdr-tutorials-requesting-controlled-access-datasets/">
            NASA file-access guidance
          </SourceLink>
        </p>
      </section>
    </>
  );
}
