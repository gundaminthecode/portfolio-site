// DiagonalHexBackground.tsx
import React, { useMemo } from "react";

type Route = "TL_BR" | "BL_TR" | "TR_BL" | "BR_TL";

type Props = {
  count?: number;
  mainColor?: string;
  ghostColor?: string;
  durationRangeSec?: [number, number];
  strokeWidth?: number;
  route?: Route;          // spawn/target corners
  spawnPad?: number;      // how far offscreen to start/end (% of container)
  lanes?: number;         // how many diagonal “tracks” to use
  laneSpread?: number;    // max perpendicular offset in %
  zIndex?: number;
};

const DiagonalHexBackground: React.FC<Props> = ({
  count = 6,
  mainColor = "#fff",
  ghostColor = "#fff",
  durationRangeSec = [10, 18],
  strokeWidth = 10,
  route = "BL_TR",
  spawnPad = 12,
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
      case "TL_BR": return [corners.TL, corners.BR, 45];    // ↘
      case "BL_TR": return [corners.BL, corners.TR, -45];   // ↗
      case "TR_BL": return [corners.TR, corners.BL, 135];   // ↙
      case "BR_TL": return [corners.BR, corners.TL, -145];  // ↖
    }
  })();

  // Precompute hex items with lane assignments and timings
  const hexes = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const isMain = i === 0;
      const scale = isMain ? rnd(1.0, 1.25) : rnd(0.6, 0.95);
      const dur = rnd(durationRangeSec[0], durationRangeSec[1]);
      const negDelay = -rnd(0, dur);
      const lane = Math.floor(rnd(0, Math.max(1, lanes)));
      const laneOffset = ((lane / Math.max(1, lanes - 1)) - 0.5) * 2 * laneSpread;
      const alpha = isMain ? 1 : rnd(0.35, 0.85);
      const rotDir = Math.random() < 0.5 ? 1 : -1; // cw/ccw
      const spinDur = dur * rnd(1.6, 2.4);         // slower than travel

      return { isMain, scale, dur, negDelay, laneOffset, alpha, rotDir, spinDur };
    });
  }, [count, durationRangeSec, lanes, laneSpread]);

  // Perpendicular offset axis
  const offsetAxis: "x" | "y" = route === "BL_TR" || route === "TR_BL" ? "x" : "y";

  return (
    <div
      aria-hidden
      style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none", zIndex }} // Ensure overflow is visible
    >
      <style>
        {`@keyframes hex-spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}
      </style>

      <svg width="0" height="0" viewBox="0 0 280 360" style={{ position: "absolute" }}>
        <defs>
          <symbol id="uiHex" viewBox="0 0 280 360">
            <polygon
              points={`150,15 258,77 258,202 150,265 42,202 42,77`}
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </symbol>
        </defs>
      </svg>

      {hexes.map((h, idx) => {
        const color = h.isMain ? mainColor : ghostColor;
        const sw = h.isMain ? strokeWidth : Math.max(2, strokeWidth * 0.6);

        // Adjust the starting position to allow for a vertical range of 40% to 100% of the parent container
        const start = {
          left: `${from.x + (offsetAxis === "x" ? h.laneOffset : 0)}%`,
          top: `${rnd(40, 100)}%`, // Spawn between 40% and 100% of the height
        };

        // Adjust the end position to float off the left side of the viewport
        const end = {
          left: `${to.x + (offsetAxis === "x" ? h.laneOffset : 0) - 150}vw`, // Move left by 150vw to go off-screen
          top: `${to.y + (offsetAxis === "y" ? h.laneOffset : 0)}%`,
        };

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
                left: start.left,
                top: start.top,
                animation: `move-${idx} ${h.dur}s linear infinite`,
                animationDelay: `${h.negDelay}s`,
                willChange: "left, top",
              }}
            >
              {/* Travel direction orientation */}
              <div
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: "center",
                }}
              >
                {/* Spin + scale */}
                <div
                  style={{
                    transform: `scale(${h.scale})`,
                    transformOrigin: "center",
                    animation: `hex-spin ${h.spinDur}s linear infinite`,
                    animationDirection: h.rotDir < 0 ? "reverse" : "normal",
                  }}
                >
                  <svg
                    width="160"
                    height="160"
                    viewBox="0 0 100 100"
                    style={{ display: "block", overflow: "visible" }}
                  >
                    <use
                      href="#uiHex"
                      style={{
                        color,
                        strokeWidth: sw,
                        opacity: h.alpha,
                      } as React.CSSProperties}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default DiagonalHexBackground;
