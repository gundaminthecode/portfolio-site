// components/Projects/ProjectFilters.tsx

// Project filters UI and logic for filtering & sorting GitHub repositories

import { useState } from 'react';
import type { Repo } from "./ProjectCard";

export type SortBy = "updated" | "stars" | "name";
export type UpdatedWindow = "any" | "7" | "30" | "90" | "365";

export type FiltersState = {
  languages: string[];
  updatedWithin: UpdatedWindow;
  sortBy: SortBy;
  sortDir: "desc" | "asc";
};

export const DEFAULT_FILTERS: FiltersState = {
  languages: [],
  updatedWithin: "any",
  sortBy: "updated",
  sortDir: "desc",
};
// Extract unique languages from repos
export function uniqueLanguages(repos: Repo[]): string[] {
  const s = new Set<string>();
  for (const r of repos) if (r.language) s.add(r.language);
  return Array.from(s).sort((a, b) => a.localeCompare(b));
}

// Check if a date is within the updated window
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
    const langOk =
      f.languages.length === 0 ||
      (r.language ? f.languages.includes(r.language) : false);
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
  const [isDropdownOpen, setDropdownOpen] = useState(true); // State for dropdown visibility

  const toggleLang = (lang: string) => {
    const has = value.languages.includes(lang);
    const next = has
      ? value.languages.filter((l) => l !== lang)
      : [...value.languages, lang];
    onChange({ ...value, languages: next });
  };

  return (
    <div className="filters">
      <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="filters__chip">
        {isDropdownOpen ? 'Hide Filters' : 'Show Filters'}
      </button>
      {isDropdownOpen && (
        <div className="filters__panel">
          <h3 className="filters__title">Filter</h3>

          {/* Languages */}
          <div className="filters__group">
            <div className="filters__label">Language</div>
            <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="filters__chip">
              {value.languages.length > 0 ? value.languages.join(', ') : 'Select Languages'}
            </button>
            <ul className="filters__list">
              {languages.map((lang) => (
                <li key={lang}>
                  <label className="filters__check hex-check">
                    <input
                      type="checkbox"
                      checked={value.languages.includes(lang)}
                      onChange={() => toggleLang(lang)}
                    />
                    <span>{lang}</span>
                  </label>
                </li>
              ))}
            </ul>
            <button className="filters__chip" onClick={() => onChange({ ...value, languages: [] })}>
              All languages
            </button>
          </div>

          {/* Window */}
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
      )}
    </div>
  );
}
