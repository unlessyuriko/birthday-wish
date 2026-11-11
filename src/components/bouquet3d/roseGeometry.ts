import { BufferGeometry, Color, Float32BufferAttribute } from 'three';

export type RoseTone = 'gold' | 'honey' | 'butter';

const PALETTE: Record<RoseTone, { base: string; mid: string; tip: string }> = {
  // Golden yellow roses (the main colour)
  gold: { base: '#c98d00', mid: '#fcc81c', tip: '#ffe866' },
  // Deeper honey-yellow, for variety
  honey: { base: '#d09400', mid: '#f7bd12', tip: '#ffdb52' },
  // Paler butter-yellow roses with creamy petal edges
  butter: { base: '#dcac32', mid: '#fbdf72', tip: '#fff7cf' },
};

const GOLDEN = 2.399963; // golden angle in radians
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * One rose head, built from a golden-angle spiral of curved, cupped petals: small tight petals in
 * the centre, larger flared petals with rolled lips outside. Axis is +Y. Vertex colours give depth
 * (dark at the base, lighter at the lips), so lighting looks like a real flower.
 */
export function buildRose(seed: number, tone: RoseTone, open = 0.5): BufferGeometry {
  const rnd = mulberry32(seed);
  const pal = PALETTE[tone];
  const cBase = new Color(pal.base);
  const cMid = new Color(pal.mid);
  const cTip = new Color(pal.tip);
  const tmp = new Color();
  const N = 22;
  const SU = 14;
  const SV = 14;
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  let vb = 0;

  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const tp = Math.pow(t, 0.85);
    const h = lerp(0.42, 1.08, tp) * (0.94 + rnd() * 0.12);
    const w = lerp(0.72, 1.35, tp) * (0.92 + rnd() * 0.16);
    const r0 = lerp(0.05, 0.14 + 0.07 * open, tp);
    const tilt = ((lerp(3, 28 + 52 * open, Math.pow(t, 1.1)) + (rnd() - 0.5) * 6) * Math.PI) / 180;
    const cup = lerp(0.62, 0.42, t);
    const flare = lerp(0.03, 0.12 + 0.5 * open, t);
    const lip = lerp(0.08, 0.35 + 0.6 * open, t);
    const az = i * GOLDEN + (rnd() - 0.5) * 0.3;
    const y0 = -0.1 * t;
    const ca = Math.cos(az);
    const sa = Math.sin(az);
    const cy = Math.cos(tilt);
    const sy = Math.sin(tilt);

    for (let iy = 0; iy <= SV; iy++) {
      const v = iy / SV;
      // Narrow at the base, widest near the top, rounded tip.
      const round = v > 0.8 ? Math.sqrt(Math.max(0, 1 - Math.pow((v - 0.8) / 0.2, 2) * 0.92)) : 1;
      const wp = (0.32 + 0.68 * smooth(0, 0.55, v)) * round;
      for (let ix = 0; ix <= SU; ix++) {
        const u = (ix / SU) * 2 - 1;
        const x = u * w * 0.5 * wp;
        const y = v * h;
        // z is "outward" from the flower axis: sides curl inward (cup), the body flares, the lip rolls back.
        let z = -cup * 0.34 * u * u * wp * w * (0.55 + 0.45 * (1 - v));
        z += flare * v * v * h;
        z += lip * Math.pow(Math.max(0, v - 0.72), 2) * h * 3.2;
        z += Math.sin(u * 2.6 + i * 1.7) * 0.014 * v * v * h;
        const yy = y * cy - z * sy;
        const zz = y * sy + z * cy;
        const px = x;
        const py = yy + y0;
        const pz = zz + r0;
        pos.push(px * ca + pz * sa, py, -px * sa + pz * ca);

        const shade = 0.8 + 0.2 * t; // inner petals sit in a soft shadow
        tmp.lerpColors(cBase, cMid, smooth(0, 0.55, v));
        const edge = Math.abs(u);
        const lightK = Math.min(1, smooth(0.55, 1, v) * 0.7 + edge * edge * 0.1 * v) * (0.25 + 0.6 * t);
        tmp.lerp(cTip, lightK);
        col.push(tmp.r * shade, tmp.g * shade, tmp.b * shade);
      }
    }
    for (let iy = 0; iy < SV; iy++) {
      for (let ix = 0; ix < SU; ix++) {
        const a = vb + iy * (SU + 1) + ix;
        const b = a + 1;
        const c = a + SU + 1;
        const d = c + 1;
        idx.push(a, c, b, b, c, d);
      }
    }
    vb += (SU + 1) * (SV + 1);
  }

  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
