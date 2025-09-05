// src/config.ts
export const CONFIG = {
  GITHUB_USERNAME: import.meta.env.VITE_GITHUB_USERNAME || "gundaminthecode",
  API_BASE: (import.meta.env.VITE_API_BASE || "").replace(/\/$/, ""),
} as const;
