// components/Projects/LivePreview.tsx
import { useState } from "react";

type Props = { url: string; title?: string };

export default function LivePreview({ url, title = "Live Site Preview" }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [key, setKey] = useState(0);

  return (
    <section className="live-preview app-divs" aria-label={title}>
      <div className="live-preview__toolbar" style={{ display: "flex", gap: ".5rem", marginBottom: ".5rem" }}>
        <a className="btn btn--ghost" href={url} target="_blank" rel="noopener noreferrer">
          Open in new tab
        </a>
        <button className="btn" onClick={() => { setLoaded(false); setKey((k) => k + 1); }}>
          Reload preview
        </button>
      </div>

      <div
        className="live-preview__frame"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: "12px",
          overflow: "hidden",
          background: "var(--panel, #111)",
          boxShadow: "0 6px 20px rgba(0,0,0,.18)",
        }}
      >
        {!loaded && (
          <div
            className="live-preview__placeholder hud"
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              padding: "1rem",
              textAlign: "center",
              opacity: 0.8,
            }}
          >
            Loading preview… If nothing appears, the site likely blocks embedding.
          </div>
        )}

        <iframe
          key={key}
          src={url}
          title={title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          referrerPolicy="no-referrer"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          style={{ width: "100%", height: "100%", border: "0" }}
        />
      </div>
    </section>
  );
}
