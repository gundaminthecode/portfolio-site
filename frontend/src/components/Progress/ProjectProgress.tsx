import { useMemo, useState } from "react"
import useProgress from "../../hooks/useProgress"
import ProgressHeatmap from "./ProgressHeatmap"
import "../../styles/progress.css"
import "../../styles/project-cards.css" // for typography vars

type Props = { owner: string; repo: string }

export default function ProjectProgress({ owner, repo }: Props) {
  const { commitsByDate, countsByDate, blurbsBySha, loading, error } = useProgress(owner, repo, 365)
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const commits = useMemo(() => commitsByDate[selectedDate] || [], [commitsByDate, selectedDate])

  if (loading) return <div className="hud">Loading progress…</div>
  if (error) return <div className="hud">Error: {error}</div>

  return (
    <div className="projects-content">
        <div className="heatmap">
            <ProgressHeatmap countsByDate={countsByDate} onSelect={setSelectedDate} />
        </div>
      
      <div className="commit-list" aria-live="polite">
        {commits.length === 0 ? (
          <div className="hud">No commits on {selectedDate}</div>
        ) : (
          commits.map((c) => {
            const sha = c.sha.toLowerCase()
            const blurb =
              blurbsBySha[sha] ||
              blurbsBySha[sha.slice(0, 7)] ||   // 7-char short SHAs in PROGRESS.md
              blurbsBySha[sha.slice(0, 8)]
            return (
              <article key={c.sha} className="commit">
                <h4>{c.message.split("\n")[0]}</h4>
                <div className="meta">
                  <a href={c.html_url} target="_blank" rel="noreferrer">[{c.sha.slice(0, 7)}]</a>
                  {" · "}
                  {new Date(c.author.date).toLocaleString()}
                  {" · "}
                  {c.author.name}
                </div>
                {blurb && <div className="blurb">{blurb}</div>}
              </article>
            )
          })
        )}
      </div>
    </div>
  )
}