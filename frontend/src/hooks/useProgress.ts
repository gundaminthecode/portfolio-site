// hooks/useProgress.ts

// Custom React hook to fetch and organize GitHub commit history and associated progress blurbs from a repository progress .md file

import { useEffect, useState, useRef } from "react"

export type Commit = {
  sha: string
  html_url: string
  message: string
  author: { name: string; date: string }
}

const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "")

async function fetchAllCommits(owner: string, repo: string, sinceISO: string, signal?: AbortSignal) {
  const url = `${API_BASE}/api/commits?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&since=${encodeURIComponent(sinceISO)}`
  const res = await fetch(url, { signal, cache: "no-store" }) // prevent HTTP cache bleed
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as Commit[]
}

async function fetchProgressMd(owner: string, repo: string, signal?: AbortSignal): Promise<string | null> {
  const url = `${API_BASE}/api/progress-md?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`
  const res = await fetch(url, { signal, cache: "no-store" }) // prevent HTTP cache bleed
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

// Module-level cache keyed per owner/repo/window so results don't bleed between projects
const PROGRESS_CACHE = new Map<string, {
  commitsByDate: Record<string, Commit[]>;
  countsByDate: Record<string, number>;
  blurbsBySha: Record<string, string>;
}>()

export default function useProgress(owner: string, repo: string, days = 3650) { // was 365
  const [commitsByDate, setCommitsByDate] = useState<Record<string, Commit[]>>({})
  const [countsByDate, setCountsByDate] = useState<Record<string, number>>({})
  const [blurbsBySha, setBlurbsBySha] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)        // start false; set true only when we actually fetch
  const [error, setError] = useState<string | undefined>()
  const reqId = useRef(0) // guards late responses

  // normalize for cache key so "Nick/Repo" and "nick/repo" share the same entry
  const oKey = (owner || "").toLowerCase().trim()
  const rKey = (repo || "").toLowerCase().trim()
  const cacheKey = `${oKey}/${rKey}/${days}`

  useEffect(() => {
    let aborted = false
    const ac = new AbortController()
    const myId = ++reqId.current

    setLoading(true)
    setError(undefined)
    setCommitsByDate({})
    setCountsByDate({})
    setBlurbsBySha({})

    const cached = PROGRESS_CACHE.get(cacheKey)
    if (cached) {
      if (!aborted && reqId.current === myId) {
        setCommitsByDate(cached.commitsByDate)
        setCountsByDate(cached.countsByDate)
        setBlurbsBySha(cached.blurbsBySha)
        setLoading(false)
      }
      return () => { aborted = true; ac.abort() }
    }

    ;(async () => {
      try {
        if (!owner || !repo) { if (!aborted && reqId.current === myId) setLoading(false); return }

        const since = startOfDayUTC(new Date())
        since.setUTCDate(since.getUTCDate() - days)
        const sinceISO = since.toISOString()

        const [commitsRes, progressRes] = await Promise.allSettled([
          fetchAllCommits(owner, repo, sinceISO, ac.signal),
          fetchProgressMd(owner, repo, ac.signal),
        ])

        if (aborted || reqId.current !== myId) return

        let nextCommitsByDate: Record<string, Commit[]> = {}
        let nextCountsByDate: Record<string, number> = {}

        if (commitsRes.status === "fulfilled") {
          const commits = commitsRes.value
          for (const c of commits) {
            const d = fmt(new Date(c.author.date))
            ;(nextCommitsByDate[d] ||= []).push(c)
            nextCountsByDate[d] = (nextCountsByDate[d] || 0) + 1
          }
        } else {
          setError(commitsRes.reason?.message || "Failed to load commits")
        }

        const md = progressRes.status === "fulfilled" ? progressRes.value : null
        const nextBlurbsBySha = parseBlurbs(md)

        const result = {
          commitsByDate: nextCommitsByDate,
          countsByDate: nextCountsByDate,
          blurbsBySha: nextBlurbsBySha,
        }

        // cache and set if still latest
        if (!aborted && reqId.current === myId) {
          PROGRESS_CACHE.set(cacheKey, result)
          setCommitsByDate(result.commitsByDate)
          setCountsByDate(result.countsByDate)
          setBlurbsBySha(result.blurbsBySha)
          setLoading(false)
        }
      } catch (e: any) {
        if (aborted || e?.name === "AbortError") return
        setError(e?.message || "Failed to load progress")
        setLoading(false)
      }
    })()

    return () => { aborted = true; ac.abort() }
  }, [owner, repo, days])

  return { commitsByDate, countsByDate, blurbsBySha, loading, error }
}