import { versions } from "@/lib/data";
import { PageHeading, Badge, SourceLink } from "@/components/ui";
export const metadata = { title: "Loop" };
export default function Loop() {
  const data = versions();
  const best = data.reduce((a, b) => (b.holdout > a.holdout ? b : a));
  return (
    <>
      <PageHeading
        eyebrow="03 / RULEBOOK EVALUATION"
        title="Better on train. Worse in the field."
      >
        <p>
          The saved evaluation selects v{best.version} on holdout reason
          accuracy. A higher training score alone does not justify shipping a
          rule change.
        </p>
      </PageHeading>
      <div className="notice">
        Saved upstream evaluation, not a live optimiser. These lead labels came
        from an LLM jury; metric keys saying “human” in the source files do not
        establish human review. Paper-claim files are separate, test-only
        fixtures.
      </div>
      <div className="version-grid">
        {data.map((v) => (
          <article
            className={`version-card ${v.version === best.version ? "shipped" : ""}`}
            key={v.version}
          >
            <header>
              <h2>v{v.version}</h2>
              <Badge tone={v.version === best.version ? "good" : "neutral"}>
                {v.version === best.version
                  ? "Ships on holdout"
                  : "Saved candidate"}
              </Badge>
            </header>
            <dl>
              <dt>Train reason accuracy</dt>
              <dd>{(v.train * 100).toFixed(1)}%</dd>
              <dt>Holdout reason accuracy</dt>
              <dd>{(v.holdout * 100).toFixed(1)}%</dd>
              <dt>Holdout false kills</dt>
              <dd>
                {v.falseKills} / {v.n}
              </dd>
            </dl>
            <div className="metric-bar" aria-hidden="true">
              <span style={{ width: `${v.holdout * 100}%` }} />
            </div>
            <p className="fineprint">
              False kills = supported labels rejected by the critic.
            </p>
            <SourceLink href={`/evidence/holdout-v${v.version}`}>
              Original evaluation JSON
            </SourceLink>
          </article>
        ))}
      </div>
      <section className="prose">
        <h2>Train rises, holdout falls: retain v{best.version}.</h2>
        <p>
          v4’s training gain comes with worse held-out reason accuracy and more
          false kills than v2. This demo pins the saved product to v2. It never
          rewrites or promotes rules.
        </p>
        <h2>What a researcher does here</h2>
        <p>
          Compare the saved scores, inspect each rulebook, and trace the
          evaluation to its source file. The live labelling and approval
          workflow is future work, not an enabled control disguised as a demo.
        </p>
        <h2>The gate for a future Inspiration4 loop</h2>
        <p>
          <strong>
            Proposed minimum: 120 adjudicated human-labelled leads
          </strong>
          , split into 60 training, 30 development, and 30 sealed holdout
          examples. This is a pilot policy, not an achieved dataset or a
          validation claim. Group related claims across splits to prevent
          leakage.
        </p>
        <p>
          Start with assay-matched published claims as candidates, then have two
          qualified humans independently label against the exact data;
          adjudicate disagreements and add reviewed negative and ambiguous
          candidates. An LLM jury is not the golden set. Paper claims remain
          test-only and outside training.
        </p>
        <p>
          Optimise on training/development, freeze the candidate, then evaluate
          on sealed holdout. If training improves while holdout falls, reject
          promotion and retain approved rules. Do not use holdout errors for
          another rewrite without retiring that holdout. A scientific lead
          approves scientific changes; the technical maintainer approves
          deployment. No automatic promotion.
        </p>
        <p>
          <strong>Show a saved run in a demo.</strong> Inspiration4 currently
          has directory records only, so there is no Inspiration4 training run
          to show.
        </p>
      </section>
      <section className="rules">
        <p className="eyebrow">READ THE ACTUAL RULEBOOKS</p>
        {data.map((v) => (
          <details key={v.version}>
            <summary>
              Rules v{v.version}
              {v.version === best.version ? " · selected for saved demo" : ""}
            </summary>
            <pre>{v.rules}</pre>
            <SourceLink href={`/evidence/rules-v${v.version}`}>
              Download Markdown
            </SourceLink>
          </details>
        ))}
      </section>
    </>
  );
}
