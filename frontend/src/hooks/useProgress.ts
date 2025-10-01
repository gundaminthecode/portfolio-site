// src/hooks/useProgress.ts
import { useEffect, useMemo, useState } from "react"

export type Commit = {
  sha: string
  html_url: string
  message: string
  author: { name: string; date: string }
}

const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "")

async function fetchAllCommits(owner: string, repo: string, sinceISO: string, signal?: AbortSignal) {
  const url = `${API_BASE}/api/commits?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&since=${encodeURIComponent(sinceISO)}`
  const res = await fetch(url, { signal })              // removed cache: "no-store"
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as Commit[]
}

async function fetchProgressMd(owner: string, repo: string, signal?: AbortSignal): Promise<string | null> {
  const url = `${API_BASE}/api/progress-md?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`
  const res = await fetch(url, { signal })              // removed cache: "no-store"
  if (res.status === 404) return null
  if (!res.ok) throw new Error(await res.text())
  const data = (await res.json()) as { path: string | null; content: string }
  return data.content || null
}

function startOfDayUTC(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}
function fmt(d: Date) { return startOfDayUTC(d).toISOString().slice(0, 10) }

function parseBlurbs(md: string | null): Record<string, string> {
  if (!md) return {}
  const lines = md.split(/\r?\n/)
  const map: Record<string, string> = {}
  const shaLine = /^\s*\[([0-9a-f]{7,40})\]\s*[-:]\s*(.+)\s*$/i
  const shaHeader = /^\s{0,3}#{2,6}\s*\[([0-9a-f]{7,40})\]\s*$/i
  const shaHeaderParen = /^\s{0,3}#{1,6}\s+.*\(([0-9a-f]{7,40})\)\s*$/i
  let current: string | null = null
  let buf: string[] = []
  const flush = () => { if (current) { const t = buf.join("\n").trim(); if (t) map[current.toLowerCase()] = t } current = null; buf = [] }
  for (const line of lines) {
    const m1 = line.match(shaLine); const m2 = line.match(shaHeader); const m3 = line.match(shaHeaderParen)
    if (m1) { flush(); current = m1[1]; buf.push(m1[2]); continue }
    if (m2) { flush(); current = m2[1]; continue }
    if (m3) { flush(); current = m3[1]; continue }
    if (current) buf.push(line)
  }
  flush()
  return map
}

export default function useProgress(owner: string, repo: string, lookbackDays = 365) {
  const [commits, setCommits] = useState<Commit[]>([])
  const [blurbs, setBlurbs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)        // start false; set true only when we actually fetch
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    const controller = new AbortController()
    let alive = true

    async function run() {
      if (!owner || !repo) { if (alive) setLoading(false); return }
      setLoading(true)
      setError(undefined)
      try {
        const since = startOfDayUTC(new Date())
        since.setUTCDate(since.getUTCDate() - lookbackDays)
        const sinceISO = since.toISOString()

        const [commitsRes, progressRes] = await Promise.allSettled([
          fetchAllCommits(owner, repo, sinceISO, controller.signal),
          fetchProgressMd(owner, repo, controller.signal),
        ])

        if (!alive) return

        if (commitsRes.status === "fulfilled") {
          setCommits(commitsRes.value)
        } else {
          setError(commitsRes.reason?.message || "Failed to load commits")
          setCommits([])
        }

        const md = progressRes.status === "fulfilled" ? progressRes.value : null
        setBlurbs(parseBlurbs(md))
      } catch (e: any) {
        if (alive) setError(e?.message || "Failed to load progress")
      } finally {
        if (alive) setLoading(false)
      }
    }

    run()
    return () => { alive = false; controller.abort() }
  }, [owner, repo, lookbackDays])

  const commitsByDate = useMemo(() => {
    const map: Record<string, Commit[]> = {}
    for (const c of commits) {
      const d = fmt(new Date(c.author.date))
      ;(map[d] ||= []).push(c)
    }
    for (const d of Object.keys(map)) map[d].sort((a, b) => (a.author.date > b.author.date ? -1 : 1))
    return map
  }, [commits])

  const countsByDate = useMemo(() => {
    const m: Record<string, number> = {}
    for (const [d, list] of Object.entries(commitsByDate)) m[d] = list.length
    return m
  }, [commitsByDate])

  return { commitsByDate, countsByDate, blurbsBySha: blurbs, loading, error }
}