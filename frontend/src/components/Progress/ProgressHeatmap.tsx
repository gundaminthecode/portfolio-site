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
  const { weeks, monthSegments } = useMemo(() => {
    const today = end
      ? new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()))
      : new Date()
    const lastSunday = startOfWeekSun(today)

    const keys = Object.keys(countsByDate).sort()
    const firstCommitDate = keys.length ? startOfWeekSun(new Date(keys[0])) : null

    const defaultStart = (() => {
      const d = new Date(lastSunday)
      d.setUTCDate(d.getUTCDate() - 7 * 52)
      return d
    })()

    let startDate = start ? startOfWeekSun(start) : defaultStart
    if (firstCommitDate && firstCommitDate > startDate) startDate = firstCommitDate

    const weeks: {
      startISO: string
      days: { date: string; count: number }[]
      isMonthStart: boolean
    }[] = []

    let cursor = new Date(startDate)
    let max = 0
    while (cursor <= lastSunday) {
      const colDays: { date: string; count: number }[] = []
      const colStart = new Date(cursor)
      for (let i = 0; i < 7; i++) {
        const key = fmt(cursor)
        const count = countsByDate[key] || 0
        if (count > max) max = count
        colDays.push({ date: key, count })
        cursor.setUTCDate(cursor.getUTCDate() + 1)
      }
      const prev = weeks[weeks.length - 1]
      const isMonthStart = prev
        ? new Date(colStart).getUTCMonth() !== new Date(prev.startISO).getUTCMonth()
        : true
      weeks.push({ startISO: fmt(colStart), days: colDays, isMonthStart })
    }

    // Build month segments: label starts on the week that contains day=1
    const weekHasFirst = (w: typeof weeks[number]) =>
      w.days.some(d => new Date(d.date).getUTCDate() === 1)

    const labelForWeek = (w: typeof weeks[number]) => {
      const firstIdx = w.days.findIndex(d => new Date(d.date).getUTCDate() === 1)
      const d = new Date(firstIdx >= 0 ? w.days[firstIdx].date : w.days[0].date)
      return d.toLocaleString(undefined, { month: "long" }) // full month name
    }

    const monthSegments: { label: string; span: number }[] = []
    if (weeks.length) {
      let segStart = 0
      let segLabel = labelForWeek(weeks[0])
      for (let i = 1; i < weeks.length; i++) {
        if (weekHasFirst(weeks[i])) {
          monthSegments.push({ label: segLabel, span: i - segStart })
          segStart = i
          segLabel = labelForWeek(weeks[i])
        }
      }
      monthSegments.push({ label: segLabel, span: weeks.length - segStart })
    }

    return { weeks, max, monthSegments }
  }, [countsByDate, start, end])

  const level = (n: number) => (n === 0 ? 0 : n <= 1 ? 1 : n <= 3 ? 2 : n <= 6 ? 3 : 4)

  return (
    <div className="progress-heatmap" aria-label="Commit activity">
      <div className="months" aria-hidden>
        {monthSegments.map((seg, i) => (
          <span
            key={i}
            className="label"
            style={{
              width: `calc(var(--cell) * ${seg.span} + var(--gap) * ${Math.max(seg.span - 1, 0)})`,
            }}
          >
            {seg.label}
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