import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProjectSlide from "./ProjectSlide";
import type { Repo } from "./ProjectCard";
import "../../styles/project-carousel.css";

type Props = {
  repos: Repo[];
  autoplayMs?: number;     // autoplay interval
  startIndex?: number;     // which real slide to start on
};

const PER_VIEW = 3; // show 3 at a time

export default function ProjectCarouselInfinite({
  repos,
  autoplayMs = 3500,
  startIndex = 0,
}: Props) {
  const n = repos.length;
  // Fallback to simple single-slide if not enough items
  if (n === 0) return null;
  const useInfinite = n > 1;

  // How many clones we need at each end to smoothly cover 3-per view
  const CLONES = Math.max(PER_VIEW, 1);

  // Build the render list with clones [tail clones] + repos + [head clones]
  const renderList = useMemo(() => {
    if (!useInfinite) return repos;
    const head = repos.slice(0, CLONES);
    const tail = repos.slice(-CLONES);
    return [...tail, ...repos, ...head];
  }, [repos, useInfinite]);

  // Index in the renderList (start centered on the real startIndex)
  const initial = useInfinite ? startIndex + CLONES : startIndex;
  const [idx, setIdx] = useState(initial);
  const [paused, setPaused] = useState(false);
  const [anim, setAnim] = useState(true); // whether CSS transition is enabled

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const deltaX = useRef(0);

  const stepPct = 100 / PER_VIEW; // each slide width as percentage

  // Helpers to convert “real” index <0..n-1> to renderList index
  const toRenderIndex = useCallback((real: number) => {
    return useInfinite ? real + CLONES : real;
  }, [useInfinite]);

  const toRealIndex = useCallback((renderI: number) => {
    if (!useInfinite) return renderI;
    const real = (renderI - CLONES) % n;
    return (real + n) % n;
  }, [useInfinite, n]);

  const slideToRender = useCallback((renderI: number, enableAnim = true) => {
    setAnim(enableAnim);
    setIdx(renderI);
  }, []);

  const slideToReal = useCallback((realI: number, enableAnim = true) => {
    slideToRender(toRenderIndex(((realI % n) + n) % n), enableAnim);
  }, [slideToRender, toRenderIndex, n]);

  const next = useCallback(() => slideToRender(idx + 1, true), [idx, slideToRender]);
  const prev = useCallback(() => slideToRender(idx - 1, true), [idx, slideToRender]);

  // Keep the center slide visually larger
  const classNames = useMemo(() => {
    // center render index (middle card of the 3 in view)
    const center = idx;
    return renderList.map((_, i) => {
      const left = center - 1;
      const right = center + 1;
      if (i === center) return "carousel__slide carousel__slide--center";
      if (i === left || i === right) return "carousel__slide carousel__slide--side";
      return "carousel__slide";
    });
  }, [renderList, idx]);

  // Apply transform whenever index changes
  const applyTransform = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    // we want idx-centered (middle of 3-per view). The leftmost visible slide index is (idx - 1)
    const leftmost = idx - 1;
    const offsetPct = -(leftmost * stepPct);
    vp.style.transform = `translateX(${offsetPct}%)`;
    vp.style.transition = anim ? "transform 400ms ease" : "none";
  }, [idx, stepPct, anim]);

  useEffect(() => { applyTransform(); }, [applyTransform]);
  useEffect(() => {
    const onResize = () => applyTransform();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyTransform]);

  // Infinite “teleport” without visible jump:
  // When we move into the cloned head/tail zones, after the animated slide completes,
  // we jump to the equivalent real index with transitions disabled.
  useEffect(() => {
    if (!useInfinite) return;
    const vp = viewportRef.current;
    if (!vp) return;

    const onEnd = () => {
      const real = toRealIndex(idx);
      const atHeadCloneZone = idx >= n + CLONES; // crossed right clones
      const atTailCloneZone = idx < CLONES;      // crossed left clones
      if (atHeadCloneZone || atTailCloneZone) {
        // teleport to the same real slide inside the real zone
        const targetRenderIdx = toRenderIndex(real);
        setAnim(false);
        setIdx(targetRenderIdx);
        // after microtask, re-enable animation
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setAnim(true));
        });
      }
    };
    vp.addEventListener("transitionend", onEnd);
    return () => vp.removeEventListener("transitionend", onEnd);
  }, [idx, n, useInfinite, toRealIndex, toRenderIndex]);

  // Autoplay
  useEffect(() => {
    if (!autoplayMs || n <= 1) return;
    const id = setInterval(() => {
      if (!paused) next();
    }, autoplayMs);
    return () => clearInterval(id);
  }, [autoplayMs, paused, next, n]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { setPaused(true); prev(); }
      if (e.key === "ArrowRight") { setPaused(true); next(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Swipe / drag
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

    const pxToPct = (deltaX.current / vp.clientWidth) * 100;
    const leftmost = idx - 1;
    const base = -(leftmost * stepPct);
    vp.style.transform = `translateX(${base + pxToPct}%)`;
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
    else applyTransform();

    deltaX.current = 0;
  };

  // Dots should refer to REAL indices (0..n-1)
  const realCurrent = toRealIndex(idx);

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
        {renderList.map((repo, i) => (
          <div className={classNames[i]} key={`${repo.id}-${i}`}>
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
        {Array.from({ length: n }).map((_, real) => (
          <button
            key={real}
            className="carousel__dot"
            aria-label={`Go to slide ${real + 1}`}
            aria-current={realCurrent === real}
            onClick={() => {
              setPaused(true);
              slideToReal(real, true);
            }}
          />
        ))}
      </div>
    </div>
  );
}
