import React from "react";

import "../../styles/index.css"

type Vec2 = { x0: number; y0: number; phx: number; phy: number; fx: number; fy: number; };

type Cfg = {
  cols: number;
  rows: number;
  amp: number;
  speed: number;
  stroke: number;
  blend: string;
  colors: string[];
};

export class BrokenShape extends HTMLElement {
  // fields
  private svg!: SVGSVGElement;
  private layer!: SVGGElement;

  private W: number = 800;
  private H: number = 800;

private cfg: Cfg = {
    cols: 18, rows: 18,
    amp: 26, speed: 0.9,
    stroke: 1.2,
    blend: "normal",
    colors: ["var(--bs-col-1)", "var(--bs-col-2)", "var(--bs-col-3)", "var(--bs-col-4)"]
};

  private _pts: Vec2[] = [];
  private _tris: number[][] = [];
  private _px?: Float32Array;
  private _py?: Float32Array;

  private _running = false;
  private _ro: ResizeObserver;
  private _t0 = 0;

  static get observedAttributes() { return ["cols", "rows", "amp", "speed", "stroke", "blend", "colors"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
  :host{
    display:block;
    inline-size:100%;
    block-size:100%;
    contain: layout size;   /* was: contain: layout paint size */
    overflow: visible;      /* allow drawing outside host box */
  }
  svg{
    inline-size:100%;
    block-size:100%;
    display:block;
    overflow: visible;      /* disable SVG viewport clipping */
  }
  .shard{
    vector-effect: non-scaling-stroke;
    mix-blend-mode: var(--blend, normal);
    stroke: var(--bs-col-stroke);
    stroke-width: var(--stroke-width, 1.2);
  }
    `;
    this.shadowRoot!.append(style);

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGSVGElement;
    this.svg.setAttribute("viewBox", "0 0 800 800");
    this.svg.setAttribute("preserveAspectRatio", "xMidYMid slice"); // fill container like before
    this.layer = document.createElementNS("http://www.w3.org/2000/svg", "g") as SVGGElement;
    this.svg.appendChild(this.layer);
    this.shadowRoot!.append(this.svg);

    this._ro = new ResizeObserver(() => this._resize());
  }

  connectedCallback() {
    this._applyAttributes();
    this.style.setProperty("--stroke-width", String(this.cfg.stroke));
    this.style.setProperty("--blend", this.cfg.blend);
    this.style.setProperty("--stroke-color", "#111");
    this._build();
    this._ro.observe(this);
    this._running = true;
    this._t0 = performance.now();
    requestAnimationFrame(this._tick.bind(this));
  }
  disconnectedCallback() { this._running = false; this._ro.disconnect(); }
  attributeChangedCallback() { this._applyAttributes(); this._build(); }

  private _applyAttributes() {
    const num = (n: string, f: number) => (this.hasAttribute(n) ? Number(this.getAttribute(n)) : f);
    const str = (n: string, f: string) => (this.getAttribute(n) ?? f);
    this.cfg.cols = Math.max(6, num("cols", this.cfg.cols));
    this.cfg.rows = Math.max(6, num("rows", this.cfg.rows));
    this.cfg.amp = num("amp", this.cfg.amp);
    this.cfg.speed = num("speed", this.cfg.speed);
    this.cfg.stroke = num("stroke", this.cfg.stroke);
    this.cfg.blend = str("blend", this.cfg.blend);
    if (this.hasAttribute("colors")) {
      const list = this.getAttribute("colors")!.split(/[,\s]+/).filter(Boolean);
      if (list.length) this.cfg.colors = list;
    }
  }

  private _resize() {
    // If you want dynamic sizing, uncomment below to match the host’s content box.
    // const rect = this.getBoundingClientRect();
    // this.W = Math.max(1, Math.floor(rect.width));
    // this.H = Math.max(1, Math.floor(rect.height));
    this.svg.setAttribute("viewBox", `0 0 ${this.W} ${this.H}`);
  }

  private _rand(a = 1, b = 0) { return Math.random() * (a - b) + b; }

  private _makeGrid() {
    const { cols, rows } = this.cfg;
    const jitter = Math.max(6, (this.W / cols) * 0.12);
    this._pts.length = 0;
    for (let y = 0; y <= rows; y++) {
      for (let x = 0; x <= cols; x++) {
        const gx = (x / cols) * this.W, gy = (y / rows) * this.H;
        const flip = ((x + y) & 1) ? 1 : -1;
        this._pts.push({
          x0: gx + flip * this._rand(jitter),
          y0: gy - flip * this._rand(jitter),
          phx: this._rand(Math.PI * 2), phy: this._rand(Math.PI * 2),
          fx: this._rand(0.55, 0.18), fy: this._rand(0.55, 0.18)
        });
      }
    }
  }

  private _makeTris() {
    const { cols, rows } = this.cfg; const idx = (x: number, y: number) => y * (cols + 1) + x;
    this._tris.length = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const a = idx(x, y), b = idx(x + 1, y), c = idx(x, y + 1), d = idx(x + 1, y + 1);
        if (((x + y) & 1) === 0) { this._tris.push([a, b, c]); this._tris.push([b, d, c]); }
        else { this._tris.push([a, d, c]); this._tris.push([a, b, d]); }
      }
    }
  }

  private _build() {
    this._makeGrid(); this._makeTris();
    this.layer.replaceChildren();
    const frag = document.createDocumentFragment();
    for (const tri of this._tris) {
      const p = document.createElementNS("http://www.w3.org/2000/svg", "polygon") as SVGPolygonElement & {
        __tri?: number[];
        __ci?: number;
      };
      p.setAttribute("class", "shard");
      (p as any).__tri = tri;
      (p as any).__ci = (Math.random() * this.cfg.colors.length) | 0;
      p.setAttribute("fill", this.cfg.colors[(p as any).__ci]);
      p.setAttribute("fill-opacity", (0.78 + Math.random() * 0.2).toFixed(3));
      frag.appendChild(p);
    }
    this.layer.appendChild(frag);
    this._draw(0); // first paint
  }

  private _draw(t: number) {
    const { amp } = this.cfg; const n = this._pts.length;
    if (!this._px || this._px.length !== n) { this._px = new Float32Array(n); this._py = new Float32Array(n); }
    for (let i = 0; i < n; i++) {
      const p = this._pts[i];
      this._px[i] = p.x0 + Math.sin(p.phx + t * p.fx * 2.2) * amp;
      this._py[i] = p.y0 + Math.cos(p.phy + t * p.fy * 1.9) * amp;
    }
    const kids = this.layer.children;
    for (let i = 0; i < kids.length; i++) {
      const poly = kids[i] as (SVGPolygonElement & any);
      const [a, b, c] = poly.__tri as number[];
      poly.setAttribute("points", `${this._px![a]} ${this._py![a]} ${this._px![b]} ${this._py![b]} ${this._px![c]} ${this._py![c]}`);
      if ((i & 7) === 0 && Math.random() < 0.02) {
        poly.__ci = (poly.__ci + 1) % this.cfg.colors.length;
        poly.setAttribute("fill", this.cfg.colors[poly.__ci]);
      }
    }
  }

  private _tick(now: number) {
    if (!this._running) return;
    const t = (now - this._t0) / 1000 * this.cfg.speed;
    this._draw(t);
    requestAnimationFrame(this._tick.bind(this));
  }
}

// Safe, one-time registration
export function registerBrokenShape() {
  if (typeof window !== "undefined" && !customElements.get("broken-shape")) {
    customElements.define("broken-shape", BrokenShape);
  }
}
registerBrokenShape();

// React wrapper for easy import/use (no custom JSX needed)
export type BrokenShapeProps = React.HTMLAttributes<HTMLElement> & {
  cols?: number | string;
  rows?: number | string;
  amp?: number | string;
  speed?: number | string;
  stroke?: number | string;
  blend?: string;
  colors?: string; // comma or space separated
};

export function BrokenShapeEl(props: BrokenShapeProps) {
  registerBrokenShape();
  return React.createElement("broken-shape", props as any);
}

export default BrokenShapeEl;

// Optional: enable <broken-shape> in TSX app-wide by adding this to a .d.ts:
// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       "broken-shape": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
//         cols?: number | string;
//         rows?: number | string;
//         amp?: number | string;
//         speed?: number | string;
//         stroke?: number | string;
//         blend?: string;
//         colors?: string;
//       };
//     }
//   }
// }