import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type LineSpec = {
  yPct?: number;                 // 0..1 vertical position of the straight segment
  duration?: number;             // seconds per cycle
  bendAt?: number;               // 0..1 where the bend occurs across width
  bendDepth?: number;            // 0..1 diagonal depth relative to height
  strokeWidth?: number;
  color?: string;
  direction?: "down" | "up";
  delay?: number;                // initial delay
};

type Props = {
  lines?: LineSpec[];
  count?: number;
  duration?: number;
  bendAt?: number;
  bendDepth?: number;
  strokeWidth?: number;
  color?: string;
  direction?: "down" | "up";
};

export default function SeamlessSweep({
  lines,
  count = 4,
  duration = 2.8,
  bendAt = 0.72,
  bendDepth = 0.8,
  strokeWidth = 6,
  color = "var(--r4-yellow)",
  direction = "down",
}: Props) {
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);

  useEffect(() => {
    const onResize = () => {
      setW(window.innerWidth);
      setH(window.innerHeight);
    };
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const specs: LineSpec[] =
    lines ??
    Array.from({ length: count }).map((_, i) => {
      const t = count > 1 ? i / (count - 1) : 0;
      return {
        yPct: 0.2 + t * 0.6,                        // spread vertically
        duration: duration * (0.75 + t * 0.7),      // varied speed
        bendAt,
        bendDepth: 0.65 + t * 0.35,                 // slightly different diagonals
        strokeWidth,
        color,
        direction: i % 2 ? "up" : direction,        // alternate up/down
        delay: i * (duration / count) * 0.6,        // slight stagger
      };
    });

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "var(--bg, transparent)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${Math.max(w, 1)} ${Math.max(h, 1)}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {specs.map((s, i) => {
          const yp = Math.min(1, Math.max(0, s.yPct ?? 0.5));
          const y0 = Math.round(h * yp);
          const xBend = Math.round(w * (s.bendAt ?? bendAt));
          const diag = Math.round(h * (s.bendDepth ?? bendDepth));
          const dir = (s.direction ?? direction) === "down" ? 1 : -1;
          const d = `M 0 ${y0} H ${xBend} L ${xBend + diag} ${y0 + dir * diag}`;
          return (
            <motion.path
              key={i}
              d={d}
              stroke={s.color ?? color}
              strokeWidth={s.strokeWidth ?? strokeWidth}
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
              transition={{
                duration: s.duration ?? duration,
                ease: "easeOut",
                repeat: Infinity,
                delay: s.delay ?? 0,
                times: [0, 0.15, 0.8, 1],
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
