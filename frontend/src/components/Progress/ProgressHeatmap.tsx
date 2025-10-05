import { useMemo } from "react"

type Props = {
  countsByDate: Record<string, number>
  onSelect: (dateISO: string) => void
  start?: Date               // optional hard start
  end?: Date                 // optional hard end (defaults to last commit or today)
  monthsWindow?: number      // NEW: limit to last N months
}

function startOfWeekSun(d: Date) {
  const nd = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const day = nd.getUTCDay()
  nd.setUTCDate(nd.getUTCDate() - day) // Sunday
  return nd
}
function fmt(d: Date) {
  return d.toISOString().slice(0, 10)
}
function subMonthsUTC(d: Date, months: number) {
  const nd = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
  nd.setUTCMonth(nd.getUTCMonth() - months)
  return nd
}

export default function ProgressHeatmap({ countsByDate, onSelect, start, end, monthsWindow }: Props) {
  const { weeks, monthSegments, yearSegments } = useMemo(() => {
    const today = end
      ? new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()))
      : new Date()

    const keys = Object.keys(countsByDate).sort()
    const firstCommitDate = keys.length ? startOfWeekSun(new Date(keys[0])) : null
    const lastCommitDate = keys.length ? startOfWeekSun(new Date(keys[keys.length - 1])) : null

    // End of grid: last commit if earlier than today (prevents trailing empty months)
    let gridEnd = startOfWeekSun(today)
    if (lastCommitDate && lastCommitDate < gridEnd) gridEnd = lastCommitDate

    // DEFAULT START: from first commit if present, otherwise 52 weeks before the gridEnd
    const fallbackStart = (() => {
      const d = new Date(gridEnd)
      d.setUTCDate(d.getUTCDate() - 7 * 52)
      return d
    })()
    let startDate = start ? startOfWeekSun(start) : (firstCommitDate ? new Date(firstCommitDate) : fallbackStart)

    // Optional: limit to the last N months relative to gridEnd
    if (monthsWindow && monthsWindow > 0) {
      const windowStart = startOfWeekSun(subMonthsUTC(gridEnd, monthsWindow - 1))
      if (windowStart > startDate) startDate = windowStart
    }

    // Never start after the end
    if (startDate > gridEnd) startDate = gridEnd

    const weeks: {
      startISO: string
      days: { date: string; count: number }[]
      isMonthStart: boolean
    }[] = []

    let cursor = new Date(startDate)
    while (cursor <= gridEnd) {
      const colDays: { date: string; count: number }[] = []
      const colStart = new Date(cursor)
      for (let i = 0; i < 7; i++) {
        const key = fmt(cursor)
        const count = countsByDate[key] || 0
        colDays.push({ date: key, count })
        cursor.setUTCDate(cursor.getUTCDate() + 1)
      }
      const prev = weeks[weeks.length - 1]
      const isMonthStart = prev
        ? new Date(colStart).getUTCMonth() !== new Date(prev.startISO).getUTCMonth()
        : true
      weeks.push({ startISO: fmt(colStart), days: colDays, isMonthStart })
    }

    // Helpers for month segmentation
    const weekHasFirst = (w: typeof weeks[number]) =>
      w.days.some(d => new Date(d.date).getUTCDate() === 1)

    const monthLabelForWeek = (w: typeof weeks[number]) => {
      const firstIdx = w.days.findIndex(d => new Date(d.date).getUTCDate() === 1)
      const d = new Date(firstIdx >= 0 ? w.days[firstIdx].date : w.days[0].date)
      return d.toLocaleString(undefined, { month: "long" })
    }
    const yearForWeek = (w: typeof weeks[number]) => {
      const firstIdx = w.days.findIndex(d => new Date(d.date).getUTCDate() === 1)
      const d = new Date(firstIdx >= 0 ? w.days[firstIdx].date : w.days[0].date)
      return d.getUTCFullYear()
    }

    // Build month segments spanning weeks; mark whether the month has any commits
    type MonthSeg = { label: string; span: number; year: number; hasCommits: boolean }
    const monthSegments: MonthSeg[] = []
    if (weeks.length) {
      let segStart = 0
      let segLabel = monthLabelForWeek(weeks[0])
      let segYear = yearForWeek(weeks[0])

      const monthHasCommits = (startIdx: number, endIdx: number) => {
        for (let i = startIdx; i < endIdx; i++) {
          if (weeks[i].days.some(d => d.count > 0)) return true
        }
        return false
      }

      for (let i = 1; i < weeks.length; i++) {
        if (weekHasFirst(weeks[i])) {
          monthSegments.push({
            label: segLabel,
            span: i - segStart,
            year: segYear,
            hasCommits: monthHasCommits(segStart, i),
          })
          segStart = i
          segLabel = monthLabelForWeek(weeks[i])
          segYear = yearForWeek(weeks[i])
        }
      }
      // final segment
      monthSegments.push({
        label: segLabel,
        span: weeks.length - segStart,
        year: segYear,
        hasCommits: monthHasCommits(segStart, weeks.length),
      })
    }

    // Build year segments based on month segments
    const yearSegments: { year: number; span: number; hasCommits: boolean }[] = []
    if (monthSegments.length) {
      let segStart = 0
      let currentYear = monthSegments[0].year
      for (let i = 1; i < monthSegments.length; i++) {
        if (monthSegments[i].year !== currentYear) {
          const span = monthSegments.slice(segStart, i).reduce((s, m) => s + m.span, 0)
          const hasCommits = monthSegments.slice(segStart, i).some(m => m.hasCommits)
          yearSegments.push({ year: currentYear, span, hasCommits })
          segStart = i
          currentYear = monthSegments[i].year
        }
      }
      const span = monthSegments.slice(segStart).reduce((s, m) => s + m.span, 0)
      const hasCommits = monthSegments.slice(segStart).some(m => m.hasCommits)
      yearSegments.push({ year: currentYear, span, hasCommits })
    }

    return { weeks, monthSegments, yearSegments }
  }, [countsByDate, start, end, monthsWindow])

  const level = (n: number) => (n === 0 ? 0 : n <= 1 ? 1 : n <= 3 ? 2 : n <= 6 ? 3 : 4)

  return (
    <div className="progress-heatmap" aria-label="Commit activity">
      {/* Year labels row */}
      <div className="years" aria-hidden>
        {yearSegments.map((seg, i) => (
          <span
            key={i}
            className="label year"
            style={{
              width: `calc(var(--cell) * ${seg.span} + var(--gap) * ${Math.max(seg.span - 1, 0)})`,
            }}
          >
            {seg.hasCommits ? seg.year : ""}
          </span>
        ))}
      </div>

      {/* Month labels row (only show labels for months with commits) */}
      <div className="months" aria-hidden>
        {monthSegments.map((seg, i) => (
          <span
            key={i}
            className="label month"
            style={{
              width: `calc(var(--cell) * ${seg.span} + var(--gap) * ${Math.max(seg.span - 1, 0)})`,
            }}
          >
            {seg.hasCommits ? seg.label : ""}
          </span>
        ))}
      </div>

      <div className="weeks" role="grid">
        {weeks.map((w, i) => (
          <div key={i} className={`week${w.isMonthStart && i !== 0 ? " month-start" : ""}`} role="row">
            {w.days.map((d) => (
              <button
                key={d.date}
                type="button"
                className={`day lvl-${level(d.count)}`}
                aria-label={`${d.date}: ${d.count} commit(s)`}
                onClick={() => onSelect(d.date)}
                title={`${d.date}: ${d.count} commit(s)`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="legend" aria-hidden>
        <span>Less</span>
        <i className="lvl-0" /><i className="lvl-1" /><i className="lvl-2" /><i className="lvl-3" /><i className="lvl-4" />
        <span>More</span>
      </div>
    </div>
  )
}