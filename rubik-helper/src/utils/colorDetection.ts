// src/utils/colorDetection.ts
export type Region = { x: number; y: number; width: number; height: number };
export type CubeColor = "white" | "yellow" | "red" | "orange" | "blue" | "green";

type RGB = { r: number; g: number; b: number };
type HSV = { h: number; s: number; v: number };

function rgbToHsv({ r, g, b }: RGB): HSV {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return { h, s, v };
}

export function hexToRgb(hexStr: string): RGB {
  const h = hexStr.replace("#", "");
  return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) };
}

function avgHex(canvas: HTMLCanvasElement, x: number, y: number, w: number, h: number) {
  const ctx = canvas.getContext("2d")!;
  const data = ctx.getImageData(x, y, w, h).data;
  let r=0,g=0,b=0,c=0;
  for (let i = 0; i < data.length; i += 16) { 
    r += data[i]; g += data[i+1]; b += data[i+2]; c++;
  }
  const toHex = (n:number)=>Math.round(n).toString(16).padStart(2,"0");
  return `#${toHex(r/c)}${toHex(g/c)}${toHex(b/c)}`;
}

const CENTROIDS: Record<CubeColor, HSV> = {
  white:  { h: 0,   s: 0.05, v: 0.98 },
  yellow: { h: 56,  s: 0.8,  v: 0.95 },
  orange: { h: 26,  s: 0.85, v: 0.9  },
  red:    { h: 2,   s: 0.9,  v: 0.8  },
  green:  { h: 130, s: 0.85, v: 0.7  },
  blue:   { h: 210, s: 0.85, v: 0.75 },
};

// distancia en HSV (peso fuerte al tono)
function hsvDist(a: HSV, b: HSV) {
  const dh = Math.min(Math.abs(a.h - b.h), 360 - Math.abs(a.h - b.h)) / 180; // 0..1
  const ds = Math.abs(a.s - b.s);
  const dv = Math.abs(a.v - b.v);
  return 3*dh + 1.2*ds + 0.7*dv;
}

export function mapHexToCubeColor(hex: string): CubeColor {
  const hsv = rgbToHsv(hexToRgb(hex));

  // blancos por baja saturación + alto valor
  if (hsv.s < 0.18 && hsv.v > 0.82) return "white";

  // elegir el centroide más cercano
  let best: { c: CubeColor; d: number } = { c: "red", d: 9e9 };
  (Object.keys(CENTROIDS) as CubeColor[]).forEach((c) => {
    const d = hsvDist(hsv, CENTROIDS[c]);
    if (d < best.d) best = { c, d };
  });

  return best.c;
}

export type DetectionResult = {
  present: boolean;
  cubeHex: string[][];
  avgSaturation: number;
};

export function sampleFaceHex(
  canvas: HTMLCanvasElement,
  gridRect: Region
): DetectionResult {
  const { x, y, width, height } = gridRect;
  const cw = width / 3, ch = height / 3;

  const hexGrid: string[][] = [];
  let sSum = 0, sCount = 0;

  for (let r = 0; r < 3; r++) {
    const row: string[] = [];
    for (let c = 0; c < 3; c++) {
      const cx = x + c*cw + cw*0.25;
      const cy = y + r*ch + ch*0.25;
      const w = cw*0.5, h = ch*0.5;
      const hxx = avgHex(canvas, cx, cy, w, h);
      row.push(hxx);
      const hsv = rgbToHsv(hexToRgb(hxx));
      sSum += hsv.s; sCount++;
    }
    hexGrid.push(row);
  }

  const avgS = sCount ? sSum / sCount : 0;
  const distinct = new Set(hexGrid.flat().map((h)=>h.toLowerCase()));
  const present = avgS >= 0.22 && distinct.size >= 2;

  return { present, cubeHex: hexGrid, avgSaturation: avgS };
}
