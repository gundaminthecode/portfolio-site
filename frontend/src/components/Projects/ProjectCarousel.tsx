import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProjectSlide from "./ProjectSlide";
import type { Repo } from "./ProjectCard";
import "../../styles/project-carousel.css";

type Props = {
  repos: Repo[];
  loop?: boolean;
  autoplayMs?: number;       // e.g., 3500
  startIndex?: number;
};

const SLIDES_PER_VIEW = 3;

export default function ProjectCarousel({
  repos,
  loop = true,
  autoplayMs = 3500,
  startIndex = 0,
}: Props) {
  const n = repos.length;
  const [index, setIndex] = useState(Math.min(Math.max(startIndex, 0), Math.max(0, n - 1)));
  const [paused, setPaused] = useState(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const deltaX = useRef(0);

  // For <3 repos, fall back to 1-per-view
  const perView = n >= SLIDES_PER_VIEW ? SLIDES_PER_VIEW : 1;
  const stepPct = 100 / perView; // 33.333 for 3-per-view

  const slideTo = useCallback((i: number) => {
    if (n === 0) return;
    setIndex(loop ? (i + n) % n : Math.max(0, Math.min(i, n - 1)));
  }, [n, loop]);

  const prev = useCallback(() => slideTo(index - 1), [index, slideTo]);
  const next = useCallback(() => slideTo(index + 1), [index, slideTo]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { setPaused(true); prev(); }
      if (e.key === "ArrowRight") { setPaused(true); next(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Autoplay (pause on hover/focus/drag, resume on leave)
  useEffect(() => {
    if (!autoplayMs || n <= 1) return;
    const id = setInterval(() => {
      if (!paused) next();
    }, autoplayMs);
    return () => clearInterval(id);
  }, [autoplayMs, paused, next, n]);

  // Update transform when index or width changes
  const applyTransform = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    // We want the current index to be CENTERED -> translate so (index-1) is left edge when 3-per-view
    const centerOffset = perView === 3 ? (index - 1) : index;
    const offsetPct = -centerOffset * stepPct;
    vp.style.transform = `translateX(${offsetPct}%)`;
  }, [index, perView, stepPct]);

  useEffect(() => {
    applyTransform();
  }, [applyTransform]);

  useEffect(() => {
    const onResize = () => applyTransform();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyTransform]);

  // Pointer handlers (swipe)
  const onPointerDown = (e: React.PointerEvent) => {
    const vp = viewportRef.current;
    if (!vp) return;
    isDragging.current = true;
    startX.current = e.clientX;
    deltaX.current = 0;
    setPaused(true);
    vp.setPointerCapture(e.pointerId);
    vp.style.transition = "none";
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const vp = viewportRef.current;
    if (!isDragging.current || !vp) return;
    deltaX.current = e.clientX - startX.current;

    // Convert px delta to percent of viewport width
    const pxToPct = (deltaX.current / vp.clientWidth) * 100;
    const centerOffset = perView === 3 ? (index - 1) : index;
    const basePct = -centerOffset * stepPct;
    vp.style.transform = `translateX(${basePct + pxToPct}%)`;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const vp = viewportRef.current;
    if (!vp) return;
    vp.releasePointerCapture(e.pointerId);
    vp.style.transition = ""; // restore css transition
    isDragging.current = false;

    const threshold = vp.clientWidth * 0.15;
    if (deltaX.current > threshold) prev();
    else if (deltaX.current < -threshold) next();
    else applyTransform(); // snap back

    deltaX.current = 0;
  };

  // Class helpers for scale/opacity
  const classes = useMemo(() => {
    return repos.map((_, i) => {
      const left = (index - 1 + n) % n;
      const right = (index + 1) % n;
      if (i === index) return "carousel__slide carousel__slide--center";
      if (i === left || i === right) return "carousel__slide carousel__slide--side";
      return "carousel__slide";
    });
  }, [repos, index, n]);

  if (n === 0) return null;

  return (
    <div
      className="carousel"
      aria-roledescription="carousel"
      aria-label="GitHub projects"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <button
        className="carousel__navBtn carousel__navBtn--prev"
        onClick={() => { setPaused(true); prev(); }}
        aria-label="Previous project"
      >‹</button>

      <div
        className="carousel__viewport"
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="group"
        aria-live="polite"
      >
        {repos.map((repo, i) => (
          <div className={classes[i]} key={repo.id}>
            <ProjectSlide repo={repo} />
          </div>
        ))}
      </div>

      <button
        className="carousel__navBtn carousel__navBtn--next"
        onClick={() => { setPaused(true); next(); }}
        aria-label="Next project"
      >›</button>

      <div className="carousel__dots" role="tablist" aria-label="Slides">
        {repos.map((_, i) => (
          <button
            key={i}
            className="carousel__dot"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={index === i}
            onClick={() => { setPaused(true); slideTo(i); }}
          />
        ))}
      </div>
    </div>
  );
}
