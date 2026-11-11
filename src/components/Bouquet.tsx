/**
 * A wrapped rose bouquet, drawn as layered SVG placed at different depths (CSS 3D) so it has
 * real parallax when it sways: tall pink paper panels and gold-trimmed white sheets behind,
 * a dense dome of red and peach roses, pink paper folds and a satin ribbon in front.
 * Decorative only (aria-hidden).
 */

type Tone = 'red' | 'pink';
const PETAL = 'M0 -40 C 22 -41 39 -21 31 4 C 23 27 -23 27 -31 4 C -39 -21 -22 -41 0 -40Z';

function Rose({ x, y, r, rot, tone, i }: { x: number; y: number; r: number; rot: number; tone: Tone; i: number }) {
  const ring = (n: number, scale: number, offset: number, fill: string) =>
    Array.from({ length: n }, (_, k) => (
      <g key={`${fill}${k}`} transform={`rotate(${offset + (360 / n) * k}) scale(${scale}) translate(0 -4)`}>
        <path d={PETAL} fill={`url(#${tone}-${fill})`} stroke="#5e0b22" strokeOpacity="0.4" strokeWidth="1.1" />
        <path d="M-20 -31 C -9 -38 9 -38 20 -31" fill="none" stroke="#fff" strokeOpacity="0.38" strokeWidth="3.4" strokeLinecap="round" />
      </g>
    ));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r / 40})`}>
      <g className="rose-pop" style={{ animationDelay: `${1.05 + (i % 9) * 0.07}s` }}>
        {ring(6, 1, 0, 'o')}
        {ring(5, 0.74, 30, 'm')}
        {ring(4, 0.5, 12, 'n')}
        <circle r="8" fill={`url(#${tone}-n)`} />
        <path d="M0 0 c 3 -5 10 -2 8 4 c -2 6 -11 4 -12 -3 c -1 -8 8 -11 14 -6" fill="none" stroke="#5e0b22" strokeOpacity="0.8" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </g>
  );
}

// [x, y, size, rotation, tone]. Back rows first, front rows last so lower roses overlap upper ones.
const BACK: Array<[number, number, number, number, Tone]> = [
  [80, 88, 17, -10, 'red'], [102, 80, 18, 6, 'pink'], [124, 86, 17, 12, 'red'], [64, 102, 16, -20, 'pink'],
  [91, 100, 18, 0, 'red'], [114, 99, 18, 15, 'red'], [138, 102, 16, -8, 'red'],
];
const FRONT: Array<[number, number, number, number, Tone]> = [
  [56, 118, 17, 8, 'red'], [78, 116, 19, -5, 'red'], [101, 115, 19, 12, 'red'], [124, 114, 19, -12, 'pink'], [146, 118, 17, 6, 'red'],
  [67, 136, 18, 10, 'red'], [90, 135, 19, -8, 'pink'], [113, 135, 19, 3, 'red'], [135, 136, 18, -14, 'red'],
  [79, 152, 16, -6, 'red'], [101, 153, 17, 20, 'red'], [123, 152, 16, 9, 'red'],
];

export function Bouquet() {
  return (
    <div className="bq3d" aria-hidden="true">
      <svg width="0" height="0" className="bq-defs" focusable="false">
        <defs>
          {/* red roses */}
          <radialGradient id="red-o" cx="50%" cy="60%" r="65%"><stop offset="0" stopColor="#E23B5B" /><stop offset="0.65" stopColor="#BE1E3F" /><stop offset="1" stopColor="#7E0F29" /></radialGradient>
          <radialGradient id="red-m" cx="50%" cy="55%" r="65%"><stop offset="0" stopColor="#EC4A68" /><stop offset="0.7" stopColor="#C9254A" /><stop offset="1" stopColor="#8C1230" /></radialGradient>
          <radialGradient id="red-n" cx="45%" cy="40%" r="70%"><stop offset="0" stopColor="#F26B84" /><stop offset="0.7" stopColor="#CF2F52" /><stop offset="1" stopColor="#9A1736" /></radialGradient>
          {/* pink-peach roses */}
          <radialGradient id="pink-o" cx="50%" cy="60%" r="65%"><stop offset="0" stopColor="#FFC2B3" /><stop offset="0.65" stopColor="#F59A98" /><stop offset="1" stopColor="#D9697A" /></radialGradient>
          <radialGradient id="pink-m" cx="50%" cy="55%" r="65%"><stop offset="0" stopColor="#FFD2C4" /><stop offset="0.7" stopColor="#F7A7A3" /><stop offset="1" stopColor="#DC7384" /></radialGradient>
          <radialGradient id="pink-n" cx="45%" cy="40%" r="70%"><stop offset="0" stopColor="#FFE3D8" /><stop offset="0.7" stopColor="#F9B3AE" /><stop offset="1" stopColor="#E0808F" /></radialGradient>
          {/* paper */}
          <linearGradient id="paperPink" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F8BCD0" /><stop offset="1" stopColor="#EE98B3" /></linearGradient>
          <linearGradient id="paperPink2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F4A9C0" /><stop offset="0.5" stopColor="#FAC9D9" /><stop offset="1" stopColor="#F0A0B8" /></linearGradient>
          <linearGradient id="paperWhite" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#FBE5EC" /></linearGradient>
          <linearGradient id="satin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FCD6E2" /><stop offset="0.5" stopColor="#F6B4C8" /><stop offset="1" stopColor="#EE9DB6" /></linearGradient>
        </defs>
      </svg>
      <div className="bq-sway">
        {/* Back: tall paper panels and trimmed sheets */}
        <svg className="bq-layer bq-back" viewBox="0 0 200 280" focusable="false">
          <path d="M20 100 L56 50 L86 68 L52 146Z" fill="url(#paperWhite)" stroke="#E9B84A" strokeWidth="3" strokeLinejoin="round" />
          <path d="M180 100 L144 50 L114 68 L148 146Z" fill="url(#paperWhite)" stroke="#E9B84A" strokeWidth="3" strokeLinejoin="round" />
          <path d="M52 58 L94 38 L98 156 L56 156Z" fill="url(#paperPink)" />
          <path d="M148 58 L106 38 L102 156 L144 156Z" fill="url(#paperPink)" />
          <path d="M90 22 L132 24 L136 156 L88 156Z" fill="url(#paperPink2)" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />
          <g fill="#fff" opacity="0.55">
            {[[70, 70], [78, 96], [60, 110], [118, 56], [124, 84], [112, 120], [136, 70], [144, 98], [100, 46]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i % 3 ? 1.6 : 2.4} />
            ))}
          </g>
        </svg>
        {/* Roses: two depths for parallax */}
        <svg className="bq-layer bq-roses-back" viewBox="0 0 200 280" focusable="false">
          {BACK.map(([x, y, r, rot, tone], i) => <Rose key={i} x={x} y={y} r={r} rot={rot} tone={tone} i={i} />)}
        </svg>
        <svg className="bq-layer bq-roses-front" viewBox="0 0 200 280" focusable="false">
          {FRONT.map(([x, y, r, rot, tone], i) => <Rose key={i} x={x} y={y} r={r} rot={rot} tone={tone} i={i + 3} />)}
        </svg>
        {/* Front: paper folds, trimmed sheet, handle and ribbon */}
        <svg className="bq-layer bq-front" viewBox="0 0 200 280" focusable="false">
          <path d="M26 122 C 42 112 64 132 82 164 L70 186 C 50 168 32 148 26 122Z" fill="url(#paperPink)" stroke="#E58AA8" strokeWidth="1.2" />
          <path d="M174 122 C 158 112 136 132 118 164 L130 186 C 150 168 168 148 174 122Z" fill="url(#paperPink)" stroke="#E58AA8" strokeWidth="1.2" />
          <path d="M62 156 C 84 170 116 170 138 156 L128 192 C 112 202 88 202 72 192Z" fill="url(#paperWhite)" stroke="#E9B84A" strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M70 192 C 88 204 112 204 130 192 L118 272 L82 272Z" fill="url(#paperPink2)" stroke="#E58AA8" strokeWidth="1.2" />
          <path d="M92 204 L88 268 M108 204 L112 268" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.5" />
          {/* satin ribbon bow */}
          <g transform="translate(100 214)">
            <path d="M0 0 C -30 -22 -44 6 -20 12 C -8 14 -2 6 0 0Z" fill="url(#satin)" stroke="#E58AA8" strokeWidth="1" />
            <path d="M0 0 C 30 -22 44 6 20 12 C 8 14 2 6 0 0Z" fill="url(#satin)" stroke="#E58AA8" strokeWidth="1" />
            <path d="M-2 4 C -14 22 -22 40 -26 58 L-14 56 C -10 40 -6 24 2 6Z" fill="url(#satin)" stroke="#E58AA8" strokeWidth="1" />
            <path d="M2 4 C 14 22 22 40 26 58 L14 56 C 10 40 6 24 -2 6Z" fill="url(#satin)" stroke="#E58AA8" strokeWidth="1" />
            <circle r="6" fill="#F4A6BE" stroke="#E58AA8" strokeWidth="1" />
          </g>
        </svg>
      </div>
      <span className="petal p1" /><span className="petal p2" /><span className="petal p3" /><span className="petal p4" />
    </div>
  );
}
