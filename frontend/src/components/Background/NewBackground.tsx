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
  colors?: string[];
  direction?: "down" | "up";
};

export default function SeamlessSweep({
  lines,
  count = 20,
  duration = 6,
  bendAt = 0.72,
  bendDepth = 0.8,
  strokeWidth = 6,
  colors = [
    "var(--r4-yellow)",
    "var(--colour-1)",
    "var(--colour-2)",
    "var(--colour-3)",
  ],
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
        yPct: 0.05 + t * 0.9,                       // spread across more of the width
        duration: duration * (0.75 + t * 0.7),      // varied speed
        bendAt,
        bendDepth: 0.65 + t * 0.35,                 // slightly different diagonals
        strokeWidth,
        color: colors[i % colors.length],           // cycle through colors
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
          const xp = Math.min(1, Math.max(0, s.yPct ?? 0.5));
          const x0 = Math.round(w * xp);
          const yBend = Math.round(h * (s.bendAt ?? bendAt));
          const diag = Math.round(Math.min(w, h) * (s.bendDepth ?? bendDepth) * 0.35);
          const dir = (s.direction ?? direction) === "down" ? 1 : -1;
          const d = `M ${x0} 0 V ${yBend} L ${x0 + dir * diag} ${yBend + diag}`;
          return (
            <motion.path
              key={i}
              d={d}
              stroke={s.color ?? colors[i % colors.length]}
              strokeWidth={s.strokeWidth ?? strokeWidth}
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.3, 0.3, 0] }}
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
