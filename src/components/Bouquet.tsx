/**
 * A rose bouquet built from layered SVG parts placed at different depths (CSS 3D),
 * so it has real parallax when it sways. Decorative only (aria-hidden).
 */

const PETAL = 'M0 -40 C 22 -41 39 -21 31 4 C 23 27 -23 27 -31 4 C -39 -21 -22 -41 0 -40Z';

function Rose({ cls }: { cls: string }) {
  const ring = (n: number, scale: number, offset: number, fill: string, shade: number) =>
    Array.from({ length: n }, (_, i) => (
      <g key={`${fill}${i}`} transform={`rotate(${offset + (360 / n) * i}) scale(${scale}) translate(0 -4)`}>
        <path d={PETAL} fill={`url(#${fill})`} stroke="#6f0f2a" strokeOpacity={shade} strokeWidth="1" />
        <path d="M-22 -30 C -10 -38 10 -38 22 -30" fill="none" stroke="#fff" strokeOpacity="0.32" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    ));
  return (
    <svg className={`rose-svg ${cls}`} viewBox="-50 -50 100 100" focusable="false">
      <ellipse cx="0" cy="40" rx="30" ry="6" fill="#38252B" opacity="0.18" />
      {ring(6, 1, 0, 'roseOuter', 0.55)}
      {ring(5, 0.74, 30, 'roseMid', 0.5)}
      {ring(4, 0.5, 12, 'roseInner', 0.5)}
      <circle r="9" fill="url(#roseInner)" />
      <path d="M0 0 c 3 -5 10 -2 8 4 c -2 6 -11 4 -12 -3 c -1 -8 8 -11 14 -6" fill="none" stroke="#7d1230" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Bouquet() {
  return (
    <div className="bq3d" aria-hidden="true">
      {/* Shared gradients */}
      <svg width="0" height="0" className="bq-defs" focusable="false">
        <defs>
          <radialGradient id="roseOuter" cx="50%" cy="60%" r="65%">
            <stop offset="0" stopColor="#E9577A" />
            <stop offset="0.65" stopColor="#C42B52" />
            <stop offset="1" stopColor="#8F1836" />
          </radialGradient>
          <radialGradient id="roseMid" cx="50%" cy="55%" r="65%">
            <stop offset="0" stopColor="#F27A98" />
            <stop offset="0.7" stopColor="#D13A60" />
            <stop offset="1" stopColor="#A81F44" />
          </radialGradient>
          <radialGradient id="roseInner" cx="45%" cy="40%" r="70%">
            <stop offset="0" stopColor="#F9A0B5" />
            <stop offset="0.7" stopColor="#DB4D70" />
            <stop offset="1" stopColor="#B02448" />
          </radialGradient>
          <linearGradient id="leafG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7DB77A" />
            <stop offset="1" stopColor="#3F7A4A" />
          </linearGradient>
          <linearGradient id="paperG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#F9CBD9" />
            <stop offset="0.5" stopColor="#FFF0F4" />
            <stop offset="1" stopColor="#F2B4C6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="bq-sway">
        {/* Back layer: stems, leaves, baby's breath */}
        <svg className="bq-layer bq-back" viewBox="0 0 200 240" focusable="false">
          <g stroke="#3F7A4A" strokeWidth="3.2" strokeLinecap="round" fill="none">
            <path d="M100 220 C 100 170 100 120 100 78" />
            <path d="M96 220 C 80 170 62 130 54 100" />
            <path d="M104 220 C 120 170 140 130 148 100" />
          </g>
          <g fill="url(#leafG)">
            <path d="M100 150 C 70 142 52 150 40 168 C 66 176 90 168 100 150Z" />
            <path d="M102 140 C 132 130 152 138 164 156 C 138 164 112 158 102 140Z" />
            <path d="M92 108 C 72 96 56 98 44 110 C 60 120 80 120 92 108Z" />
            <path d="M110 104 C 130 94 148 96 158 108 C 142 118 122 118 110 104Z" />
          </g>
          <g fill="#fff" opacity="0.9">
            {[[30, 60], [38, 52], [24, 74], [172, 56], [166, 66], [178, 80], [62, 26], [138, 22], [150, 34]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i % 2 ? 2.4 : 3.2} />
            ))}
          </g>
        </svg>
        {/* Roses at different depths */}
        <div className="bq-rose r-left"><Rose cls="rot-a" /></div>
        <div className="bq-rose r-right"><Rose cls="rot-b" /></div>
        <div className="bq-rose r-mid"><Rose cls="rot-c" /></div>
        {/* Front layer: paper wrap and ribbon */}
        <svg className="bq-layer bq-front" viewBox="0 0 200 240" focusable="false">
          <path d="M52 150 L148 150 L116 236 L84 236Z" fill="url(#paperG)" stroke="#E8B4C4" strokeWidth="1.5" />
          <path d="M52 150 L100 168 L148 150" fill="none" stroke="#E8B4C4" strokeWidth="1.5" />
          <path d="M100 168 L100 236" stroke="#E8B4C4" strokeWidth="1" opacity="0.7" />
          <g transform="translate(100 176)">
            <path d="M0 0 C -14 -16 -30 -4 -22 8 C -16 16 -4 8 0 0Z M0 0 C 14 -16 30 -4 22 8 C 16 16 4 8 0 0Z" fill="#B52346" />
            <circle r="5" fill="#8F1836" />
          </g>
        </svg>
      </div>
      <span className="petal p1" /><span className="petal p2" /><span className="petal p3" /><span className="petal p4" />
    </div>
  );
}
