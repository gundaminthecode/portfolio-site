// src/hooks/useCaseStudy.ts
import { useEffect, useState } from "react";
import fm from "front-matter";
import type { Repo } from "../components/Projects/ProjectCard";
import { deriveOwnerRepo } from "../utils/deriveOwnerRepo";

const CANDIDATES = [
    "docs/CASESTUDY.md",
    "docs/casestudy.md",
];

export function useCaseStudy(repo?: Repo) {
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [frontmatter, setFrontmatter] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    if (!repo) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      const { owner, name } = deriveOwnerRepo(repo);
      const branch = "main";

      for (const p of CANDIDATES) {
        const raw = `https://raw.githubusercontent.com/${owner}/${name}/refs/heads/${branch}/${p}`;
        const res = await fetch(raw, { cache: "no-store" });
        if (!res.ok) continue;

        let txt = await res.text();

        const baseDir = p.includes("/") ? p.slice(0, p.lastIndexOf("/") + 1) : "";
        const rawBase = `https://raw.githubusercontent.com/${owner}/${name}/refs/heads/${branch}/${baseDir}`;

        // fix relative images inside markdown
        txt = txt.replace(/!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g, (_m, alt, rel) => `![${alt}](${rawBase}${rel})`);

        const parsed = fm<Record<string, any>>(txt);
        const attrs = { ...(parsed.attributes ?? {}) };

        // fix hero if present and relative
        if (attrs.hero && !/^https?:\/\//.test(attrs.hero)) {
          attrs.hero = `${rawBase}${attrs.hero}`;
        }

        if (!cancelled) {
          setMarkdown(parsed.body);
          setFrontmatter(attrs);
        }
        break;
      }
      if (!cancelled) setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [repo?.id]);

  return { loading, markdown, frontmatter };
}