import { useMemo } from "react"

type Props = {
  countsByDate: Record<string, number>
  onSelect: (dateISO: string) => void
  start?: Date    // optional hard start
  end?: Date      // optional hard end (defaults to today)
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

export default function ProgressHeatmap({ countsByDate, onSelect, start, end }: Props) {
  const { weeks, max, monthLabels } = useMemo(() => {
    const today = end
      ? new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()))
      : new Date()
    const lastSunday = startOfWeekSun(today)

    // Find first commit date (min key in countsByDate) if available
    const keys = Object.keys(countsByDate).sort() // ISO sorts chronologically
    const firstCommitDate = keys.length
      ? startOfWeekSun(new Date(keys[0]))
      : null

    // Default to 52 weeks lookback, but never earlier than repo’s first commit week
    const defaultStart = (() => {
      const d = new Date(lastSunday)
      d.setUTCDate(d.getUTCDate() - 7 * 52)
      return d
    })()

    let startDate = start ? startOfWeekSun(start) : defaultStart
    if (firstCommitDate && firstCommitDate > startDate) startDate = firstCommitDate

    // Build columns of weeks
    const weeks: { startISO: string; days: { date: string; count: number }[]; isMonthStart: boolean }[] = []
    let cursor = new Date(startDate)
    let max = 0
    while (cursor <= lastSunday) {
      const colDays: { date: string; count: number }[] = []
      const colStart = new Date(cursor)
      const monthBefore = colStart.getUTCMonth()
      for (let i = 0; i < 7; i++) {
        const key = fmt(cursor)
        const count = countsByDate[key] || 0
        if (count > max) max = count
        colDays.push({ date: key, count })
        cursor.setUTCDate(cursor.getUTCDate() + 1)
      }
      const isMonthStart =
        weeks.length > 0
          ? new Date(fmt(colStart)).getUTCMonth() !== new Date(weeks[weeks.length - 1].startISO).getUTCMonth()
          : true
      weeks.push({ startISO: fmt(colStart), days: colDays, isMonthStart })
    }

    const monthLabels = weeks.map((w, i) => {
      const d = new Date(w.startISO)
      const label = d.toLocaleString(undefined, { month: "short" })
      if (i === 0) return label
      const prev = new Date(weeks[i - 1].startISO)
      return d.getUTCMonth() !== prev.getUTCMonth() ? label : ""
    })

    return { weeks, max, monthLabels }
  }, [countsByDate, start, end])

  const level = (n: number) => {
    if (n === 0) return 0
    if (n <= 1) return 1
    if (n <= 3) return 2
    if (n <= 6) return 3
    return 4
  }

  return (
    <div className="progress-heatmap" aria-label="Commit activity">
      <div className="months" aria-hidden>
        {monthLabels.map((m, i) => (
          <span key={i} className="label">{m}</span>
        ))}
      </div>
      <div className="weeks" role="grid">
        {weeks.map((w, i) => (
          <div
            key={i}
            className={`week${w.isMonthStart && i !== 0 ? " month-start" : ""}`}
            role="row"
          >
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