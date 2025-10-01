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

const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "")

async function fetchAllCommits(owner: string, repo: string, sinceISO: string): Promise<Commit[]> {
  const url = `${API_BASE}/api/commits?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&since=${encodeURIComponent(sinceISO)}`
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

async function fetchProgressMd(owner: string, repo: string): Promise<string | null> {
  const url = `${API_BASE}/api/progress-md?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`
  const res = await fetch(url, { cache: "no-store" })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(await res.text())
  const data = (await res.json()) as { path: string; content: string }
  return data.content
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