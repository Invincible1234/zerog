"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Command,
  Search,
  X,
  Database,
  Play,
  GitBranch,
  Network,
  Home,
} from "lucide-react";

const pages = [
  {
    label: "Overview",
    detail: "Your research starting point",
    href: "/",
    icon: Home,
  },
  {
    label: "Corpus",
    detail: "Explore the saved study catalog",
    href: "/corpus",
    icon: Database,
  },
  {
    label: "Saved run",
    detail: "Replay the Helix critic",
    href: "/run",
    icon: Play,
  },
  {
    label: "Loop",
    detail: "Compare saved rulebooks",
    href: "/loop",
    icon: GitBranch,
  },
  {
    label: "Graph",
    detail: "Follow connected evidence",
    href: "/graph",
    icon: Network,
  },
];

export function CommandMenu({
  studies,
}: {
  studies: { id: string; title: string; tissue: string }[];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const open = useCallback(() => {
    setQuery("");
    dialog.current?.showModal();
    input.current?.focus();
  }, []);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else open();
      }
      if (
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) &&
        !target.isContentEditable
      ) {
        event.preventDefault();
        open();
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open]);
  const term = query.toLowerCase().trim();
  const matches = term
    ? studies
        .filter((s) =>
          `${s.id} ${s.title} ${s.tissue}`.toLowerCase().includes(term),
        )
        .slice(0, 7)
    : [];
  const pageMatches = pages.filter(
    (p) => !term || `${p.label} ${p.detail}`.toLowerCase().includes(term),
  );
  function go(href: string) {
    dialog.current?.close();
    router.push(href);
  }
  return (
    <>
      <button
        className="command-trigger"
        onClick={open}
        aria-label="Open search"
      >
        <Search size={16} />
        <span>Search</span>
        <kbd>Ctrl K</kbd>
      </button>
      <dialog
        ref={dialog}
        className="command-dialog"
        aria-labelledby="command-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="command-content">
          <div className="command-input">
            <Search size={20} />
            <input
              ref={input}
              aria-label="Search pages or studies"
              placeholder="Where will you explore?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              aria-label="Close search"
              onClick={() => dialog.current?.close()}
            >
              <X size={18} />
            </button>
          </div>
          <h2 id="command-title" className="small-label">
            {term ? "Search results" : "Jump to a workspace"}
          </h2>
          <div className="command-results">
            {pageMatches.map((p) => (
              <button key={p.href} onClick={() => go(p.href)}>
                <p.icon size={19} />
                <span>
                  <strong>{p.label}</strong>
                  <small>{p.detail}</small>
                </span>
                <ArrowUpRight size={16} />
              </button>
            ))}
            {matches.map((s) => (
              <button key={s.id} onClick={() => go(`/corpus/${s.id}`)}>
                <Database size={19} />
                <span>
                  <strong>{s.id}</strong>
                  <small>{s.title}</small>
                </span>
                <ArrowUpRight size={16} />
              </button>
            ))}
            {!pageMatches.length && !matches.length && (
              <p className="command-empty">
                No match. Try “thymus”, “OSD-421”, or a page name.
              </p>
            )}
          </div>
          <div className="command-footer">
            <span>
              <Command size={12} /> A shortcut to the evidence
            </span>
            <span>
              <kbd>esc</kbd> to close
            </span>
          </div>
        </div>
      </dialog>
    </>
  );
}
