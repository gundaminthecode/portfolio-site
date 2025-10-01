// src/hooks/useProgress.ts
import { useEffect, useMemo, useState } from "react"

export type Commit = {
  sha: string
  html_url: string
  message: string
  author: { name: string; date: string }
}

export type ProgressData = {
  commitsByDate: Record<string, Commit[]>
  countsByDate: Record<string, number>
  blurbsBySha: Record<string, string>
  loading: boolean
  error?: string
}

const GITHUB_API = "https://api.github.com"

function authHeaders(): Record<string, string> {
  const token = import.meta.env.VITE_GITHUB_TOKEN
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function fetchAllCommits(owner: string, repo: string, sinceISO: string): Promise<Commit[]> {
  const per_page = 100
  let page = 1
  const all: Commit[] = []

  // stop after 1000 commits safeguard
  while (page <= 10) {
    const url = `${GITHUB_API}/repos/${owner}/${repo}/commits?since=${encodeURIComponent(
      sinceISO
    )}&per_page=${per_page}&page=${page}`
    const res = await fetch(url, { headers: { ...authHeaders() } })
    if (!res.ok) break
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) break

    for (const c of data) {
      all.push({
        sha: c.sha,
        html_url: c.html_url,
        message: c.commit?.message ?? "",
        author: {
          name: c.commit?.author?.name ?? c.author?.login ?? "unknown",
          date: c.commit?.author?.date ?? c.committer?.date ?? "",
        },
      })
    }
    if (data.length < per_page) break
    page++
  }
  return all
}

async function fetchProgressMd(owner: string, repo: string): Promise<string | null> {
  const candidates = ["progress.md", "Progress.md", "docs/progress.md"]
  for (const path of candidates) {
    const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`
    const res = await fetch(url, { headers: { Accept: "application/vnd.github.v3.raw", ...authHeaders() } })
    if (res.ok) {
      return await res.text()
    }
  }
  return null
}

function parseBlurbs(md: string | null): Record<string, string> {
  if (!md) return {}
  const lines = md.split(/\r?\n/)
  const map: Record<string, string> = {}
  // Pattern A: [sha] - text
  // Pattern B: ## [sha] ...paragraph...
  const shaLine = /^\s*\[([0-9a-f]{7,40})\]\s*[-:]\s*(.+)\s*$/i
  const shaHeader = /^\s{0,3}#{2,6}\s*\[([0-9a-f]{7,40})\]\s*$/i

  let currentSha: string | null = null
  let buf: string[] = []
  const flush = () => {
    if (currentSha) {
      const k = currentSha.toLowerCase()
      const text = buf.join("\n").trim()
      if (text) map[k] = text
    }
    currentSha = null
    buf = []
  }

  for (const line of lines) {
    const m1 = line.match(shaLine)
    const m2 = line.match(shaHeader)
    if (m1) {
      flush()
      currentSha = m1[1]
      buf.push(m1[2])
      continue
    }
    if (m2) {
      flush()
      currentSha = m2[1]
      continue
    }
    if (currentSha) buf.push(line)
  }
  flush()
  return map
}

function startOfDayUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}
function fmt(d: Date) {
  return startOfDayUTC(d).toISOString().slice(0, 10)
}

export default function useProgress(owner: string, repo: string, lookbackDays = 365): ProgressData {
  const [commits, setCommits] = useState<Commit[]>([])
  const [blurbs, setBlurbs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        setError(undefined)
        const since = new Date()
        since.setUTCDate(since.getUTCDate() - lookbackDays)
        const commits = await fetchAllCommits(owner, repo, since.toISOString())
        const progressMd = await fetchProgressMd(owner, repo)
        const blurbsMap = parseBlurbs(progressMd)
        if (!alive) return
        setCommits(commits)
        setBlurbs(blurbsMap)
      } catch (e: any) {
        if (!alive) return
        setError(e?.message || "Failed to load progress")
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [owner, repo, lookbackDays])

  const commitsByDate = useMemo(() => {
    const map: Record<string, Commit[]> = {}
    for (const c of commits) {
      const d = fmt(new Date(c.author.date))
      ;(map[d] ||= []).push(c)
    }
    // sort newest first within the day
    for (const d of Object.keys(map)) {
      map[d].sort((a, b) => (a.author.date > b.author.date ? -1 : 1))
    }
    return map
  }, [commits])

  const countsByDate = useMemo(() => {
    const m: Record<string, number> = {}
    for (const [d, list] of Object.entries(commitsByDate)) m[d] = list.length
    return m
  }, [commitsByDate])

  return { commitsByDate, countsByDate, blurbsBySha: blurbs, loading, error }
}