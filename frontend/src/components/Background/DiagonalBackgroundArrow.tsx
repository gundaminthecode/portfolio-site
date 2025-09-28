// DiagonalArrowBackground.tsx (fixed)
import React, { useMemo } from "react";

type Route = "TL_BR" | "BL_TR" | "TR_BL" | "BR_TL";

type Props = {
  count?: 3 | 4;
  mainColor?: string;
  ghostColor?: string;
  durationRangeSec?: [number, number];
  strokeWidth?: number;
  route?: Route;          // ← pick spawn/target corners
  spawnPad?: number;      // ← how far offscreen to start/end (% of container)
  lanes?: number;         // ← how many diagonal “tracks” to use
  laneSpread?: number;    // ← max perpendicular offset in %
  zIndex?: number;
};

const DiagonalArrowBackground: React.FC<Props> = ({
  count = 6,
  mainColor = "#fff",
  ghostColor = "rgba(255,255,255,.6)",
  durationRangeSec = [6, 11],
  strokeWidth = 10,
  route = "BL_TR",          // default ↗ like your reference
  spawnPad = 12,            // start/end slightly outside the box
  lanes = 3,
  laneSpread = 14,
  zIndex = 0,
}) => {
  const rnd = (min: number, max: number) => min + Math.random() * (max - min);

  // Corner coordinates in container percent space
  const corners = {
    TL: { x: -spawnPad, y: -spawnPad },
    TR: { x: 100 + spawnPad, y: -spawnPad },
    BL: { x: -spawnPad, y: 100 + spawnPad },
    BR: { x: 100 + spawnPad, y: 100 + spawnPad },
  };

  const [from, to, rotation] = (() => {
    switch (route) {
      case "TL_BR": return [corners.TL, corners.BR, 45];   // ↘
      case "BL_TR": return [corners.BL, corners.TR, -45];  // ↗
      case "TR_BL": return [corners.TR, corners.BL, 135];  // ↙
      case "BR_TL": return [corners.BR, corners.TL, -145]; // ↖
    }
  })();

  // Precompute arrows with lane assignments and timings
  const arrows = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const isMain = i === 0;
      const scale = isMain ? rnd(1.0, 1.25) : rnd(0.6, 0.95);
      const dur = rnd(durationRangeSec[0], durationRangeSec[1]);
      const negDelay = -rnd(0, dur);
      const lane = Math.floor(rnd(0, Math.max(1, lanes)));
      const laneOffset = ((lane / Math.max(1, lanes - 1)) - 0.5) * 2 * laneSpread; // -spread..+spread
      const opacity = isMain ? 0.95 : rnd(0.4, 0.75);
      return { isMain, scale, dur, negDelay, laneOffset, opacity };
    });
  }, [count, durationRangeSec, lanes, laneSpread]);

  // Perpendicular offset axis: for ↗ and ↙ (NE/SW) we offset in X; for ↘ and ↖ we offset in Y
  const offsetAxis: "x" | "y" =
    route === "BL_TR" || route === "TR_BL" ? "x" : "y";

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex,
      }}
    >
      <svg width="0" height="0" viewBox="0 0 100 100" style={{ position: "absolute" }}>
        <defs>
          <symbol id="uiLArrow" viewBox="0 0 100 100">
                {/* straight shaft */}
                <path
                    d="M10 50 H80"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />
                {/* V head at the right end */}
                <path
                    d="M80 50 L68 38 M80 50 L68 62"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />
            </symbol>
        </defs>
      </svg>

      {arrows.map((a, idx) => {
        const color = a.isMain ? mainColor : ghostColor;
        const sw = a.isMain ? strokeWidth : Math.max(2, strokeWidth * 0.6);

        // Start/end positions per-arrow (apply lane offset perpendicular to travel)
        const start = {
          left: `${from.x + (offsetAxis === "x" ? a.laneOffset : 0)}%`,
          top: `${from.y + (offsetAxis === "y" ? a.laneOffset : 0)}%`,
        };
        const end = {
          left: `${to.x + (offsetAxis === "x" ? a.laneOffset : 0)}%`,
          top: `${to.y + (offsetAxis === "y" ? a.laneOffset : 0)}%`,
        };

        // We animate absolute positions so movement is relative to the container.
        const keyframes = `
          @keyframes move-${idx} {
            from { left: ${start.left}; top: ${start.top}; }
            to   { left: ${end.left};   top: ${end.top}; }
          }
        `;

        return (
          <React.Fragment key={idx}>
            <style>{keyframes}</style>
            <div
              style={{
                position: "absolute",
                // initial position; animation will take over immediately
                left: start.left,
                top: start.top,
                animation: `move-${idx} ${a.dur}s linear infinite`,
                animationDelay: `${a.negDelay}s`,
                willChange: "left, top",
              }}
            >
              <div
                style={{
                  transform: `rotate(${rotation}deg) scale(${a.scale})`,
                  transformOrigin: "center",
                  opacity: a.opacity,
                }}
              >
                <svg width="160" height="160" viewBox="0 0 100 100" style={{ display: "block" }}>
                  <use
                    href="#uiLArrow"
                    style={{ color, strokeWidth: sw } as React.CSSProperties}
                  />
                </svg>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default DiagonalArrowBackground;
