import { useEffect } from "react";

export default function useScrollReveal(selector = ".content-slice .slice-content") {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (els.length === 0) return;

    // Initial class
    els.forEach((el) => el.classList.add("reveal-init"));

    let lastY = window.scrollY;
    let dir: "down" | "up" = "down";

    const onScroll = () => {
      const y = window.scrollY;
      dir = y > lastY ? "down" : "up";
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            el.classList.remove("leaving-top", "leaving-bottom", "from-top", "from-bottom");
            el.classList.add(dir === "down" ? "from-bottom" : "from-top");
            // next frame to ensure transition
            requestAnimationFrame(() => el.classList.add("is-revealed"));
          } else {
            el.classList.remove("is-revealed");
            el.classList.add(dir === "down" ? "leaving-top" : "leaving-bottom");
          }
        }
      },
      { root: null, threshold: 0.06 }
    );

    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [selector]);
}