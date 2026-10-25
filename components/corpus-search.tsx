"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Study } from "@/lib/types";
import { Badge } from "./ui";
export function CorpusSearch({
  studies,
  local,
}: {
  studies: Study[];
  local: string[];
}) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const filtered = useMemo(
    () =>
      studies.filter(
        (s) =>
          (scope !== "local" || local.includes(s.osd_id)) &&
          [s.osd_id, s.title, s.organism, s.material, s.assay]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase().trim()),
      ),
    [studies, local, query, scope],
  );
  return (
    <>
      <div className="toolbar">
        <label className="search-box">
          <Search size={17} />
          <input
            aria-label="Search corpus"
            placeholder="Search accession, tissue, organism…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label="Catalog scope"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
        >
          <option value="all">All catalog studies</option>
          <option value="local">Local tables only</option>
        </select>
      </div>
      <div className="table-meta" aria-live="polite">
        <span>
          {filtered.length} of {studies.length} studies
        </span>
        <span>{local.length} local tables / OSD-421 saved run</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ACCESSION</th>
              <th>STUDY / TISSUE</th>
              <th>ORGANISM</th>
              <th>AVAILABLE HERE</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.osd_id}>
                <td className="mono">
                  <Link href={`/corpus/${s.osd_id}`}>{s.osd_id} ↗</Link>
                </td>
                <td className="title-cell">
                  <Link href={`/corpus/${s.osd_id}`}>{s.title}</Link>
                  <small>{s.material}</small>
                </td>
                <td>{s.organism}</td>
                <td>
                  <Badge tone={s.osd_id === "OSD-421" ? "good" : "neutral"}>
                    {s.osd_id === "OSD-421"
                      ? "Saved critic run"
                      : local.includes(s.osd_id)
                        ? "Local table"
                        : "Metadata only"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <div className="notice">
            No studies match. Try “thymus” or an accession.
          </div>
        )}
      </div>
    </>
  );
}
