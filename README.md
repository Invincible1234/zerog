# Zex / ZEROg

A Next.js 16, TypeScript and Tailwind CSS 4 demo that **plays a saved Helix critic run** over public NASA OSDR differential-expression tables. Visual direction follows gravityzero.space: dark lab-notebook surfaces, ruled evidence panels and restrained teal. A light paper theme persists under `zerog-theme`.

**No model calls, API keys, authentication, database or Python server.** Playback reveals saved records; Loop compares saved evaluations and cannot train or promote rules.

## Run

Node.js 22.13 or later (Node 22 LTS recommended).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:43123. Both `npm run dev` and `npm start` bind `0.0.0.0:43123`. `next.config.ts` allows development requests from `127.0.0.1` and `localhost`.

```sh
npm run verify:data
npm run typecheck
npm run build
npm start
```

Docker: `docker build -t zerog .` then `docker run --rm -p 43123:43123 zerog`.

## Pages

- `/` — server-rendered totals derived from data: 243 catalog studies, 92,959 local gene rows, 38 OSD-421 survivors.
- `/corpus` — searchable saved catalog plus the separate Inspiration4 directory.
- `/corpus/OSD-421` — original leads, table facts, critic labels and separate replication records.
- `/corpus/OSD-NOPE` — visible in-layout unknown-study page, not Next's `notFound()`.
- `/run` — play, pause, step, scrub and restart saved lead playback.
- `/loop` — original v0/v2/v4 rules and train/holdout metrics. v2 ships on saved holdout; jury labels are explicitly not human gold.
- `/graph` — search all 294 finding nodes (try `Drd4`) and inspect connected evidence.
- `/method` — sources, scope, limitations and the sample-count discrepancy.
- `/evidence/[file]` — allowlisted original evidence downloads; no arbitrary filesystem access.

## Data provenance and scientific limits

Source: https://github.com/Invincible1234/Coreweave_LangChain at commit `fae8e9f09a9d50f9892afed1b8537028aa4e1a54`.

The CSV, saved result JSON, paper-claim fixtures and rulebooks are copied **byte-for-byte** from that source. `data/provenance.json` records SHA-256 hashes and per-table row counts; `npm run verify:data` checks them. The four local tables are OSD-104, OSD-255, OSD-421 and OSD-467. A catalog entry is not a downloaded table. The 92,959 total counts records across tables, not unique genes.

`data/inspiration4.json` is a separately authored, source-linked metadata directory based on the published OSDR data-access paper. Those studies are **listed only**, not DE tables, and cannot enter playback or critic evaluation. Check file-level access requirements with NASA. No raw human sequence data are fetched.

`data/golden/nasa_*.json` are **test-only** published-claim fixtures. They are never read into training or the saved product run. The repo's training/holdout labels came from an LLM jury, despite some JSON keys using the word `human`.

Known discrepancy: the saved OSD-421 summary reports 11 flight / 9 ground samples; the CSV header contains 10 / 10 sample columns. Saved carrier denominators also come from the upstream payload. We preserve and disclose this mismatch rather than silently correcting saved science. Resolve sample mapping before scientific reuse.

The Python graph export contains bare `NaN` numeric tokens. The read adapter maps non-finite values to `null` (displayed as unavailable) in memory; original bytes and downloads are unchanged. It never converts missing statistics to zero.

**Leads are not experimental validation. Table numbers, the critic label, and the replication check stay separate.** Repo-reported replication is not independently verified by this app. No NASA or SpaceX affiliation or endorsement is implied. No SpaceX logos or branding are used.

## Checks before publishing

1. Run data verification, TypeScript and a production build.
2. Confirm home response HTML contains `92,959` and unknown-study HTML has the visible heading.
3. Click Light: `<html data-theme="light">`, `localStorage['zerog-theme'] === 'light'`, computed body background `rgb(244, 241, 234)`, button reads Dark. Reload, navigate, and toggle back.
4. Click Corpus, Saved run, Loop, Graph. Search `thymus` in Corpus and `Drd4` in Graph.
5. Check mobile layout, playback controls and evidence downloads.

This repository was rebuilt from scratch; the unavailable Cursor checkout and its uncommitted files were not imported.
