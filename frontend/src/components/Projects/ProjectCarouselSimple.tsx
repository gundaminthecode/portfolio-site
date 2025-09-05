import { useEffect, useRef } from "react";
import ProjectSlide from "./ProjectSlide";
import type { Repo } from "./ProjectCard";
import "../../styles/project-carousel.css";

type Props = { repos: Repo[] };

export default function ProjectCarouselSimple({ repos }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const lastTsRef = useRef<number | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || repos.length === 0) return;

    const speedPxPerSec = 40; // tune me (e.g., 40–120)

    const loop = (ts: number) => {
      if (pausedRef.current) return; // stopped; will be resumed on mouseleave

      const last = lastTsRef.current ?? ts;
      const dt = ts - last;
      lastTsRef.current = ts;

      // With duplicated content, loop at half the scrollWidth:
      const loopWidth = viewport.scrollWidth / 2;
      const dx = (dt / 1000) * speedPxPerSec;

      viewport.scrollLeft += dx;
      if (viewport.scrollLeft >= loopWidth) {
        // keep it seamless
        viewport.scrollLeft -= loopWidth;
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    // start
    lastTsRef.current = null;
    frameRef.current = requestAnimationFrame(loop);

    const onEnter = () => {
      pausedRef.current = true;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
    const onLeave = () => {
      if (!pausedRef.current) return;
      pausedRef.current = false;
      lastTsRef.current = null; // reset delta so it doesn’t jump
      frameRef.current = requestAnimationFrame(loop);
    };

    viewport.addEventListener("mouseenter", onEnter);
    viewport.addEventListener("mouseleave", onLeave);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      viewport.removeEventListener("mouseenter", onEnter);
      viewport.removeEventListener("mouseleave", onLeave);
    };
  }, [repos.length]);

  if (!repos.length) return null;

  return (
    <div
      className="carousel__viewport"
      ref={viewportRef}
      style={{
        display: "flex",
        overflowX: "auto",
        gap: 0,
        scrollBehavior: "auto",
        whiteSpace: "nowrap",
        // Optional smoothness hints:
        willChange: "scroll-position"
      }}
      aria-roledescription="carousel"
      aria-label="GitHub projects"
    >
      <div className="carousel-slide" style={{ display: "flex" }}>
        {[...repos, ...repos].map((repo, i) => (
          <div key={repo.id + "-" + i} style={{ flex: "0 0 auto" }}>
            <ProjectSlide repo={repo} />
          </div>
        ))}
      </div>
    </div>
  );
}
