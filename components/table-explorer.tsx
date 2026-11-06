"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  Search,
} from "lucide-react";
import type { TablePage } from "@/lib/tables";
import styles from "./table.module.css";

export function TableExplorer({ initial }: { initial: TablePage }) {
  const [data, setData] = useState(initial);
  const [query, setQuery] = useState("");
  const [contrast, setContrast] = useState(initial.contrast.key);
  const [sort, setSort] = useState("adjustedP");
  const [significant, setSignificant] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          q: query,
          contrast,
          sort,
          significant: String(significant),
          page: String(page),
        });
        const response = await fetch(`/api/tables/${initial.osd}?${params}`, {
          signal: controller.signal,
        });
        const body = await response.json();
        if (!response.ok)
          throw new Error(body.error || "The table could not be loaded.");
        if (!controller.signal.aborted) setData(body);
      } catch (failure) {
        if (!controller.signal.aborted)
          setError(
            failure instanceof Error
              ? failure.message
              : "The table could not be loaded.",
          );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [initial.osd, query, contrast, sort, significant, page, retry]);
  function download() {
    const csv = [
      "ensembl,symbol,name,log2fc,adjusted_p,contrast,source_file",
      ...data.rows.map((row) =>
        [
          row.id,
          row.symbol,
          row.name,
          row.effect ?? "",
          row.adjustedP ?? "",
          data.contrast.label,
          data.sourceFile,
        ]
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      ),
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.osd}-table-page-${data.page}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section
      className={styles.explorer}
      id="table"
      aria-labelledby="table-title"
    >
      <header className={styles.heading}>
        <div>
          <p className="eyebrow">BROWSE THE SOURCE / COMPUTED FROM CSV</p>
          <h2 id="table-title">Look up the gene. Check the numbers.</h2>
        </div>
        <a className="button" href={`/evidence/table-${initial.osd.slice(4)}`}>
          <ArrowDownToLine size={14} /> Original CSV
        </a>
      </header>
      <p className={styles.explanation}>
        These are original table values, separate from the saved critic payload.
        Positive log₂ fold change means higher in{" "}
        <strong>{data.contrast.positive}</strong>. “Adjusted p &lt; 0.05” is a
        browsing filter, not a validation label.
      </p>
      <div className={styles.summary}>
        <span>
          <strong>{data.total.toLocaleString("en-US")}</strong> gene rows
        </span>
        <span>
          <strong>{data.withStatistics.toLocaleString("en-US")}</strong> with
          finite effect and adjusted p
        </span>
        <span>
          <strong>{data.significant.toLocaleString("en-US")}</strong> meet
          adjusted p &lt; 0.05
        </span>
      </div>
      <div className={styles.controls}>
        <label className={styles.search}>
          <Search size={16} />
          <input
            aria-label="Search gene table"
            placeholder="Gene symbol, Ensembl ID or annotation…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </label>
        <label className={styles.select}>
          <span>Contrast</span>
          <select
            aria-label="Table contrast"
            value={contrast}
            onChange={(e) => {
              setContrast(e.target.value);
              setPage(1);
            }}
          >
            {initial.contrasts.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.filters}>
        <label>
          <input
            type="checkbox"
            checked={significant}
            onChange={(e) => {
              setSignificant(e.target.checked);
              setPage(1);
            }}
          />{" "}
          Adjusted p &lt; 0.05 only
        </label>
        <select
          aria-label="Sort gene rows"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
        >
          <option value="adjustedP">Lowest adjusted p</option>
          <option value="magnitude">Largest absolute effect</option>
          <option value="symbol">Gene symbol</option>
        </select>
        <button
          className="button"
          disabled={loading || !!error || !data.rows.length}
          onClick={download}
        >
          <ArrowDownToLine size={13} /> Export this page
        </button>
      </div>
      <div className={styles.resultStatus} role="status">
        {loading ? (
          <>
            <LoaderCircle size={13} className={styles.spin} /> Updating table…
          </>
        ) : error ? (
          "Table unavailable"
        ) : (
          `${data.matched.toLocaleString("en-US")} matching rows · page ${data.page} of ${data.pages}`
        )}
      </div>
      {error ? (
        <div className="notice" role="alert">
          {error}{" "}
          <button className="button" onClick={() => setRetry((n) => n + 1)}>
            Try again
          </button>
        </div>
      ) : (
        <div
          className="table-wrap"
          aria-busy={loading}
          style={{ opacity: loading ? 0.5 : 1 }}
        >
          <table>
            <thead>
              <tr>
                <th>GENE / ENSEMBL</th>
                <th>ANNOTATION</th>
                <th>LOG₂ FOLD CHANGE</th>
                <th>ADJUSTED P</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.symbol || "Unannotated"}</strong>
                    <small className="mono">{row.id}</small>
                  </td>
                  <td className={styles.annotation}>
                    {row.name || "Not supplied"}
                  </td>
                  <td className="mono">
                    {row.effect === null
                      ? "Unavailable"
                      : row.effect.toPrecision(7)}
                  </td>
                  <td className="mono">
                    {row.adjustedP === null
                      ? "Unavailable"
                      : row.adjustedP.toExponential(6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data.rows.length && (
            <p className="notice">
              No rows match. Clear the search or turn off the significance
              filter.
            </p>
          )}
        </div>
      )}
      <div className={styles.pagination}>
        <button
          className="button"
          disabled={loading || !!error || data.page <= 1}
          onClick={() => setPage(data.page - 1)}
        >
          <ArrowLeft size={14} /> Previous
        </button>
        <span>
          {data.page} / {data.pages}
        </span>
        <button
          className="button"
          disabled={loading || !!error || data.page >= data.pages}
          onClick={() => setPage(data.page + 1)}
        >
          Next <ArrowRight size={14} />
        </button>
      </div>
      <p className="fineprint">
        Page exports contain displayed rows only. The original CSV download
        preserves full precision and all columns.
      </p>
    </section>
  );
}
