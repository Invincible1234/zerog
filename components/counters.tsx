import { totals, number } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
export function Counters() {
  const t = totals();
  return (
    <dl className="counters reveal-section">
      {[
        [
          t.studies,
          "Studies in saved catalog",
          "Metadata, not downloaded tables",
        ],
        [t.rows, "Gene rows on disk", "Across the bundled expression tables"],
        [
          t.survivors,
          "OSD-421 survivors",
          "Passed the saved critic · not validation",
        ],
      ].map(([value, label, note]) => (
        <div key={String(label)} data-spotlight>
          <dt>{label}</dt>
          <dd>{number(Number(value))}</dd>
          <p>{note}</p>
          <Link
            className="counter-link"
            href={label === "OSD-421 survivors" ? "/corpus/OSD-421" : "/corpus"}
            aria-label={`Explore ${label}`}
          >
            <ArrowUpRight size={17} />
          </Link>
        </div>
      ))}
    </dl>
  );
}
