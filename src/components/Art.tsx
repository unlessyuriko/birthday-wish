/** Small bundled illustrations. All decorative (aria-hidden). */
export function Bear({ size = 120, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <circle cx="30" cy="28" r="15" fill="#D9A27A" />
      <circle cx="90" cy="28" r="15" fill="#D9A27A" />
      <circle cx="30" cy="28" r="8" fill="#F4C9B0" />
      <circle cx="90" cy="28" r="8" fill="#F4C9B0" />
      <circle cx="60" cy="58" r="40" fill="#D9A27A" />
      <ellipse cx="60" cy="72" rx="18" ry="14" fill="#F4D9C0" />
      <circle cx="46" cy="52" r="4" fill="#38252B" />
      <circle cx="74" cy="52" r="4" fill="#38252B" />
      <ellipse cx="60" cy="64" rx="5.5" ry="4" fill="#38252B" />
      <path d="M53 71 Q60 78 67 71" stroke="#38252B" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="36" cy="66" r="5" fill="#F6B8CB" />
      <circle cx="84" cy="66" r="5" fill="#F6B8CB" />
      <path d="M60 102 C48 90 38 98 42 106 C46 112 56 108 60 102Z M60 102 C72 90 82 98 78 106 C74 112 64 108 60 102Z" fill="#B52346" />
      <circle cx="60" cy="102" r="4" fill="#8F1836" />
    </svg>
  );
}

export function Heart({ size = 20, color = '#B52346' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 21s-8-5.4-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.6-8 11-8 11z" fill={color} />
    </svg>
  );
}

/** Neutral stationery fallback used when a photo is missing. */
export function Stationery({ variant = 0 }: { variant?: number }) {
  const hues = ['#FCE4EC', '#FFF0D9', '#F6D5DF'];
  return (
    <svg className="stationery" viewBox="0 0 200 150" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="150" fill={hues[variant % 3]} />
      <g stroke="#E8B4C4" strokeWidth="1.5" opacity="0.7">
        {[40, 60, 80, 100, 120].map((y) => (
          <line key={y} x1="20" x2="180" y1={y} y2={y} />
        ))}
      </g>
      <path d="M100 52 C88 36 66 44 72 60 C78 74 100 84 100 84 C100 84 122 74 128 60 C134 44 112 36 100 52Z" fill="#B52346" opacity="0.85" />
    </svg>
  );
}

export function Envelope({ open, children }: { open: boolean; children?: React.ReactNode }) {
  return (
    <div className={`envelope ${open ? 'is-open' : ''}`} aria-hidden={children ? undefined : true}>
      <div className="env-back" />
      <div className="env-letter">{children}</div>
      <div className="env-front" />
      <div className="env-flap" />
      <div className="env-seal"><Heart size={22} color="#fff" /></div>
    </div>
  );
}

export function Cake({ out, level = 0 }: { out: boolean; level?: number }) {
  const xs = [58, 90, 122];
  const squash = 1 - Math.min(level, 100) / 100;
  return (
    <svg className="cake" viewBox="0 0 180 170" aria-hidden="true" focusable="false">
      <rect x="22" y="110" width="136" height="44" rx="10" fill="#F6B8CB" />
      <rect x="34" y="78" width="112" height="38" rx="10" fill="#FFF8F0" stroke="#E8B4C4" strokeWidth="2" />
      <path d="M34 92 q9 14 18 0 t18 0 t18 0 t18 0 t18 0 t18 0" fill="none" stroke="#B52346" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="90" cy="156" rx="84" ry="7" fill="#38252B" opacity="0.12" />
      {xs.map((x, i) => (
        <g key={x}>
          <rect x={x - 4} y="50" width="8" height="30" rx="2" fill="#D9AA58" />
          {!out && (
            <g
              style={{
                transformOrigin: `${x}px 48px`,
                transform: `scale(${1 - 0.3 * (1 - squash)}, ${0.12 + 0.88 * squash})`,
                opacity: 0.3 + 0.7 * squash,
              }}
            >
              <path
                className="flame"
                d={`M${x} 28 C${x - 8} 38 ${x - 6} 48 ${x} 48 C${x + 6} 48 ${x + 8} 38 ${x} 28Z`}
                fill="#FF9F43"
              />
            </g>
          )}
          {out && (
            <g className="smoke-group" style={{ animationDelay: `${i * 0.5}s` }}>
              <path className="smoke" d={`M${x} 46 q-7 -8 0 -15 q7 -8 0 -16 q-6 -7 0 -13`} fill="none" stroke="#70565F" strokeWidth="2.4" strokeLinecap="round" />
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

export function GiftBox({ open }: { open: boolean }) {
  return (
    <svg className={`giftbox ${open ? 'is-open' : ''}`} viewBox="0 0 160 150" aria-hidden="true" focusable="false">
      <rect x="22" y="64" width="116" height="76" rx="8" fill="#F6B8CB" />
      <rect x="72" y="64" width="16" height="76" fill="#B52346" />
      <g className="lid">
        <rect x="14" y="44" width="132" height="26" rx="8" fill="#FCE4EC" stroke="#E8B4C4" strokeWidth="2" />
        <rect x="72" y="44" width="16" height="26" fill="#B52346" />
        <path d="M80 44 C62 18 40 30 56 44Z M80 44 C98 18 120 30 104 44Z" fill="#B52346" />
      </g>
    </svg>
  );
}
