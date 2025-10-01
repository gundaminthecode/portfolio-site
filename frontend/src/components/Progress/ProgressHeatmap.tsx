import { useMemo } from "react"

type Props = {
  countsByDate: Record<string, number>
  onSelect: (dateISO: string) => void
  start?: Date    // defaults to 52 weeks ago (Sunday)
  end?: Date      // defaults to today
}

function startOfWeekSun(d: Date) {
  const nd = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const day = nd.getUTCDay()
  nd.setUTCDate(nd.getUTCDate() - day) // back to Sunday
  return nd
}
function fmt(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function ProgressHeatmap({ countsByDate, onSelect, start, end }: Props) {
  const { weeks, max } = useMemo(() => {
    const today = end ? new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate())) : new Date()
    const lastSunday = startOfWeekSun(today)
    const startDate = start ? startOfWeekSun(start) : (() => {
      const d = new Date(lastSunday); d.setUTCDate(d.getUTCDate() - 7 * 52); return d
    })()

    const weeks: { days: { date: string; count: number }[] }[] = []
    let cursor = new Date(startDate)
    let max = 0
    while (cursor <= lastSunday) {
      const col: { days: { date: string; count: number }[] } = { days: [] }
      for (let i = 0; i < 7; i++) {
        const key = fmt(cursor)
        const count = countsByDate[key] || 0
        if (count > max) max = count
        col.days.push({ date: key, count })
        cursor.setUTCDate(cursor.getUTCDate() + 1)
      }
      weeks.push(col)
    }
    return { weeks, max }
  }, [countsByDate, start, end])

  const level = (n: number) => {
    if (n === 0) return 0
    if (n <= 1) return 1
    if (n <= 3) return 2
    if (n <= 6) return 3
    return 4
  }

  return (
    <div className="progress-heatmap" role="grid" aria-label="Commit activity">
      {weeks.map((w, i) => (
        <div key={i} className="week" role="row">
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
      <div className="legend" aria-hidden>
        <span>Less</span>
        <i className="lvl-0" /><i className="lvl-1" /><i className="lvl-2" /><i className="lvl-3" /><i className="lvl-4" />
        <span>More</span>
      </div>
    </div>
  )
}