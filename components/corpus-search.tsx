"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Database,
  FileText,
  FlaskConical,
  Grid2X2,
  List,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { Study } from "@/lib/types";
import styles from "./corpus.module.css";

const PAGE_SIZE = 12;

export function CorpusSearch({
  studies,
  local,
  savedId,
}: {
  studies: Study[];
  local: string[];
  savedId: string;
}) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const [organism, setOrganism] = useState("all");
  const [sort, setSort] = useState("available");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const organisms = useMemo(
    () =>
      [
        ...new Set(
          studies
            .flatMap((s) => s.organism.split("|").map((o) => o.trim()))
            .filter((o) => o && o !== "Not Applicable"),
        ),
      ].sort(),
    [studies],
  );
  const filtered = useMemo(() => {
    const result = studies.filter(
      (s) =>
        (scope === "all" ||
          (scope === "local"
            ? local.includes(s.osd_id)
            : s.osd_id === savedId)) &&
        (organism === "all" ||
          s.organism.split("|").some((o) => o.trim() === organism)) &&
        [s.osd_id, s.title, s.organism, s.material, s.assay]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase().trim()),
    );
    return result.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "available") {
        const rank = (s: Study) =>
          s.osd_id === savedId ? 0 : local.includes(s.osd_id) ? 1 : 2;
        if (rank(a) !== rank(b)) return rank(a) - rank(b);
      }
      return (
        Number(a.osd_id.replace("OSD-", "")) -
        Number(b.osd_id.replace("OSD-", ""))
      );
    });
  }, [studies, local, savedId, query, scope, organism, sort]);
  const shown = filtered.slice(0, limit);
  const scopes = [
    { id: "all", label: "All studies", count: studies.length },
    {
      id: "local",
      label: "Local tables",
      count: studies.filter((s) => local.includes(s.osd_id)).length,
    },
    {
      id: "saved",
      label: "Saved run",
      count: studies.filter((s) => s.osd_id === savedId).length,
    },
  ];
  const hasFilters = query !== "" || scope !== "all" || organism !== "all";
  const reset = () => {
    setQuery("");
    setScope("all");
    setOrganism("all");
    setLimit(PAGE_SIZE);
  };
  const status = (s: Study) =>
    s.osd_id === savedId
      ? "Saved critic run"
      : local.includes(s.osd_id)
        ? "Local table"
        : "Metadata only";

  return (
    <section className={styles.catalog} aria-label="Browse saved catalog">
      <div className={styles.catalogHeading}>
        <div>
          <span className={styles.microLabel}>THE ARCHIVE</span>
          <h2>Find your next question.</h2>
        </div>
        <span className={styles.catalogStamp}>
          <Database size={13} /> Saved Helix catalog
        </span>
      </div>
      <div className={styles.searchBar}>
        <Search size={20} aria-hidden="true" />
        <input
          aria-label="Search corpus"
          placeholder="Search a gene study, tissue, organism or accession…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(PAGE_SIZE);
          }}
        />
        {query ? (
          <button
            aria-label="Clear corpus search"
            onClick={() => {
              setQuery("");
              setLimit(PAGE_SIZE);
            }}
          >
            <X size={16} />
          </button>
        ) : (
          <span className={styles.searchHint}>TRY “THYMUS”</span>
        )}
      </div>
      <div className={styles.filterBar}>
        <div className={styles.scopeTabs} aria-label="Catalog scope">
          {scopes.map((s) => (
            <button
              key={s.id}
              aria-pressed={scope === s.id}
              onClick={() => {
                setScope(s.id);
                setLimit(PAGE_SIZE);
              }}
            >
              {s.label}
              <span>{s.count}</span>
            </button>
          ))}
        </div>
        <div className={styles.selects}>
          <SlidersHorizontal size={13} aria-hidden="true" />
          <select
            aria-label="Filter by organism"
            value={organism}
            onChange={(e) => {
              setOrganism(e.target.value);
              setLimit(PAGE_SIZE);
            }}
          >
            <option value="all">All organisms</option>
            {organisms.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <select
            aria-label="Sort studies"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setLimit(PAGE_SIZE);
            }}
          >
            <option value="available">Available here first</option>
            <option value="accession">Accession</option>
            <option value="title">Study title</option>
          </select>
        </div>
      </div>
      <div className={styles.resultsBar}>
        <p aria-live="polite">
          <strong>{filtered.length}</strong> of {studies.length} studies
          {hasFilters && (
            <button onClick={reset}>
              Reset filters <X size={11} />
            </button>
          )}
        </p>
        <div className={styles.viewToggle} aria-label="Catalog view">
          <button
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
          >
            <Grid2X2 size={15} />
          </button>
          <button
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            <List size={17} />
          </button>
        </div>
      </div>
      {view === "grid" ? (
        <div className={styles.studyGrid}>
          {shown.map((s) => (
            <Link
              href={`/corpus/${s.osd_id}`}
              className={`${styles.studyCard} ${s.osd_id === savedId ? styles.savedCard : ""}`}
              key={s.osd_id}
            >
              <div className={styles.cardTop}>
                <span className={styles.studyIcon}>
                  {s.osd_id === savedId ? (
                    <FlaskConical size={20} />
                  ) : local.includes(s.osd_id) ? (
                    <Database size={20} />
                  ) : (
                    <FileText size={20} />
                  )}
                </span>
                <span className={styles.accession}>{s.osd_id}</span>
                <ArrowUpRight className={styles.cardArrow} size={17} />
              </div>
              <h3>{s.title}</h3>
              <p className={styles.tissue} title={s.material}>
                {s.material || "Tissue not specified"}
              </p>
              <div className={styles.cardMetadata}>
                <span title={s.organism}>{s.organism}</span>
                <span>{s.n_samples} samples</span>
              </div>
              <div className={styles.cardBottom}>
                <span
                  className={
                    s.osd_id === savedId
                      ? styles.readyStatus
                      : styles.recordStatus
                  }
                >
                  {s.osd_id === savedId ? (
                    <Check size={11} />
                  ) : (
                    <span className={styles.dot} />
                  )}{" "}
                  {status(s)}
                </span>
                <span className={styles.inspect}>
                  Inspect record <ArrowUpRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.listWrap}>
          <table className={styles.studyTable}>
            <thead>
              <tr>
                <th>ACCESSION</th>
                <th>STUDY / TISSUE</th>
                <th>ORGANISM</th>
                <th>AVAILABLE HERE</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((s) => (
                <tr key={s.osd_id}>
                  <td>
                    <Link
                      className={styles.accession}
                      href={`/corpus/${s.osd_id}`}
                    >
                      {s.osd_id} <ArrowUpRight size={12} />
                    </Link>
                  </td>
                  <td>
                    <Link href={`/corpus/${s.osd_id}`}>{s.title}</Link>
                    <small>{s.material}</small>
                  </td>
                  <td>{s.organism}</td>
                  <td>
                    <span
                      className={
                        s.osd_id === savedId
                          ? styles.readyStatus
                          : styles.recordStatus
                      }
                    >
                      {status(s)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!filtered.length && (
        <div className={styles.empty}>
          <Search size={28} />
          <h3>No studies in this orbit.</h3>
          <p>Try a broader search or clear your filters.</p>
          <button onClick={reset}>
            Reset search <ArrowUpRight size={14} />
          </button>
        </div>
      )}
      {filtered.length > shown.length && (
        <div className={styles.loadMore}>
          <button onClick={() => setLimit((n) => n + PAGE_SIZE)}>
            Load more studies <ArrowDown size={15} />
          </button>
          <p>
            Showing {shown.length} of {filtered.length}
          </p>
        </div>
      )}
    </section>
  );
}
