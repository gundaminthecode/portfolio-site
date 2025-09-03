import { useMemo } from "react";
import type { Repo } from "./ProjectCard";

// Types
export type SortBy = "updated" | "stars" | "name";
export type UpdatedWindow = "any" | "7" | "30" | "90" | "365";

export type FiltersState = {
  languages: Set<string>;     // empty = all
  updatedWithin: UpdatedWindow;
  sortBy: SortBy;
  sortDir: "desc" | "asc";
};

export const DEFAULT_FILTERS: FiltersState = {
  languages: new Set<string>(),
  updatedWithin: "any",
  sortBy: "updated",
  sortDir: "desc",
};

// Helpers
export function uniqueLanguages(repos: Repo[]): string[] {
  const s = new Set<string>();
  for (const r of repos) if (r.language) s.add(r.language);
  return Array.from(s).sort((a, b) => a.localeCompare(b));
}

function withinWindow(updatedISO: string, window: UpdatedWindow): boolean {
  if (window === "any") return true;
  const days = Number(window);
  const updated = new Date(updatedISO).getTime();
  const now = Date.now();
  const ms = days * 24 * 60 * 60 * 1000;
  return now - updated <= ms;
}

// Filtering & sorting
export function applyFiltersAndSort(repos: Repo[], f: FiltersState): Repo[] {
  let list = repos.filter((r) => {
    const langOk = f.languages.size === 0 || (r.language ? f.languages.has(r.language) : false);
    const timeOk = withinWindow(r.updated_at, f.updatedWithin);
    return langOk && timeOk;
  });

  list = list.sort((a, b) => {
    switch (f.sortBy) {
      case "stars": {
        const diff = a.stargazers_count - b.stargazers_count;
        return f.sortDir === "asc" ? diff : -diff;
      }
      case "name": {
        const diff = a.name.localeCompare(b.name);
        return f.sortDir === "asc" ? diff : -diff;
      }
      case "updated":
      default: {
        const diff = +new Date(a.updated_at) - +new Date(b.updated_at);
        return f.sortDir === "asc" ? diff : -diff;
      }
    }
  });

  return list;
}

// UI
type Props = {
  languages: string[];
  value: FiltersState;
  onChange: (v: FiltersState) => void;
  onReset: () => void;
};

export default function ProjectFilters({ languages, value, onChange, onReset }: Props) {
  const selectedLangs = useMemo(() => new Set(value.languages), [value.languages]);

  const toggleLang = (lang: string) => {
    const next = new Set(selectedLangs);
    next.has(lang) ? next.delete(lang) : next.add(lang);
    onChange({ ...value, languages: next });
  };

  return (
    <div className="filters">
      <h3 className="filters__title">Filter</h3>

      {/* Languages */}
      <div className="filters__group">
        <div className="filters__label">Language</div>
        {languages.length === 0 ? (
          <div className="filters__hint">No language data.</div>
        ) : (
          <ul className="filters__list">
            {languages.map((lang) => (
              <li key={lang}>
                <label className="filters__check">
                  <input
                    type="checkbox"
                    checked={selectedLangs.has(lang)}
                    onChange={() => toggleLang(lang)}
                  />
                  <span>{lang}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
        <button className="filters__chip" onClick={() => onChange({ ...value, languages: new Set() })}>
          All languages
        </button>
      </div>

      {/* Updated window */}
      <div className="filters__group">
        <div className="filters__label">Updated</div>
        <div className="filters__chips">
          {[
            { v: "any", t: "Any" },
            { v: "7", t: "7d" },
            { v: "30", t: "30d" },
            { v: "90", t: "90d" },
            { v: "365", t: "1y" },
          ].map(({ v, t }) => (
            <button
              key={v}
              className={`filters__chip ${value.updatedWithin === (v as UpdatedWindow) ? "is-active" : ""}`}
              onClick={() => onChange({ ...value, updatedWithin: v as UpdatedWindow })}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting */}
      <div className="filters__group">
        <div className="filters__label">Sort</div>
        <div className="filters__row">
          <select
            value={value.sortBy}
            onChange={(e) => onChange({ ...value, sortBy: e.target.value as FiltersState["sortBy"] })}
          >
            <option value="updated">Last updated</option>
            <option value="stars">Stars</option>
            <option value="name">Name</option>
          </select>

          <button
            className="filters__chip"
            onClick={() => onChange({ ...value, sortDir: value.sortDir === "asc" ? "desc" : "asc" })}
            title="Toggle sort direction"
          >
            {value.sortDir === "asc" ? "Asc ↑" : "Desc ↓"}
          </button>
        </div>
      </div>

      <button className="filters__reset" onClick={onReset}>Reset</button>
    </div>
  );
}
