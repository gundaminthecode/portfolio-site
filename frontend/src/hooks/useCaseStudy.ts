// hooks/useCaseStudy.ts

// Fetch and parse a case study .md file from a GitHub repository, extracting frontmatter and content

import { useEffect, useState } from "react"

type Repo = { name: string; owner?: { login?: string } }

type FrontMatter = { [key: string]: string }

const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "")

// Simple YAML frontmatter parser
function parseFrontmatter(md: string): { frontmatter: FrontMatter; body: string } {
  if (!md.startsWith("---")) return { frontmatter: {}, body: md }
  const end = md.indexOf("\n---", 3)
  if (end === -1) return { frontmatter: {}, body: md }
  const raw = md.slice(3, end).trim()
  const body = md.slice(end + 4).replace(/^\s+/, "")
  const fm: FrontMatter = {}
  raw.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.+)\s*$/)
    if (m) fm[m[1]] = m[2].replace(/^["']|["']$/g, "")
  })
  return { frontmatter: fm, body }
}

// Hook to load and parse a case study from a given GitHub repo
export function useCaseStudy(repo?: Repo) {
  const [loading, setLoading] = useState(false)
  const [markdown, setMarkdown] = useState<string>("")
  const [frontmatter, setFrontmatter] = useState<FrontMatter>({})
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    let alive = true
    const owner = repo?.owner?.login
    const name = repo?.name
    if (!owner || !name || !API_BASE) return

    ;(async () => {
      try {
        setLoading(true)
        setError(undefined)
        const res = await fetch(
          `${API_BASE}/api/case-study?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(name)}`
        )
        if (res.status === 404) {
          if (alive) { setMarkdown(""); setFrontmatter({}); setLoading(false) }
          return
        }
        if (!res.ok) throw new Error(await res.text())
        const data = (await res.json()) as { path: string; content: string }
        const { frontmatter, body } = parseFrontmatter(data.content || "")
        if (!alive) return
        setMarkdown(body)
        setFrontmatter(frontmatter)
      } catch (e: any) {
        if (alive) setError(e?.message || "Failed to load case study")
      } finally {
        if (alive) setLoading(false)
      }
    })()

    return () => { alive = false }
  }, [repo?.owner?.login, repo?.name])

  return { markdown, frontmatter, loading, error }
}