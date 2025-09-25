// src/hooks/useCaseStudy.ts

import { useState, useEffect } from 'react';
import matter from 'gray-matter';
import type { Repo } from '../components/Projects/ProjectCard';

const CANDIDATES = [
    "CASESTUDY.md",
    "case-study.md",
    "docs/CASESTUDY.md",
    "docs/case-study.md",
    "documentation/CASESTUDY.md",
    "documentation/case-study.md"
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
            const owner = repo.owner?.login ?? "";
            const branch = repo.default_branch ?? "main";
            for (const p of CANDIDATES) {
                const raw = `https://raw.githubusercontent.com/${owner}/${repo.name}/${branch}/${p}`;
                const res = await fetch(raw, {cache: "no-store"});
                if (!res.ok) continue;
                let txt = await res.text();
                //fix relative image paths
                const baseDir = p.includes("/") ? p.slice(0, p.lastIndexOf("/") + 1) : "";
                const rawBase = `https://raw.githubusercontent.com/${owner}/${repo.name}/${branch}/${baseDir}`;
                txt = txt.replace(/!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g, (_m, alt, rel) =>`![${alt}](${rawBase}${rel})`);
                const parsed = matter(txt);
                if (!cancelled) {
                    setMarkdown(parsed.content);
                    setFrontmatter(parsed.data);
                    setLoading(false);
                }
                break;
            }
            if (!cancelled) setLoading(false);
        })();
        return () => { cancelled = true; };
    }, [repo?.id]);

    return { loading, markdown, frontmatter };
}