// src/components/Projects/CaseStudy.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type Props = {
  markdown: string;
  title?: string;
  hero?: string;
  frontmatter?: Record<string, any> | null;
};

export default function CaseStudy({ markdown, title = "Case Study", hero, frontmatter }: Props) {
  if (!markdown) return null;

  const fm = frontmatter ?? {};
  const liveUrl = fm.links?.live ?? fm.live ?? null;
  const stack = Array.isArray(fm.stack) ? fm.stack.join(", ") : fm.stack;

  return (
    <section className="case-study app-divs">
      <h3 className="hud" style={{ marginBottom: ".5rem" }}>
        {fm.title ?? title}
      </h3>

      {hero && (
        <div style={{ marginBottom: ".5rem" }}>
          <img src={hero} alt="" style={{ width: "100%", height: "auto", borderRadius: 8, display: "block" }} loading="lazy" />
        </div>
      )}

      {/* front-matter summary table */}
      {frontmatter && (
        <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
          <table className="md-table">
            <thead>
              <tr>
                <th>title</th>
                <th>summary</th>
                <th>stage</th>
                <th>stack</th>
                <th>started</th>
                <th>links</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{fm.title ?? "—"}</td>
                <td>{fm.summary ?? "—"}</td>
                <td>{fm.stage ?? "—"}</td>
                <td>{stack ?? "—"}</td>
                <td>{fm.started ?? "—"}</td>
                <td>{liveUrl ? <a href={liveUrl} target="_blank" rel="noreferrer">live</a> : "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="prose" style={{ lineHeight: 1.6 }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </section>
  );
}
