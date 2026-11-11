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
    <div className={`envelope ${open ? 'is-open' : ''}`} aria-hidden="true">
      <div className="env-back" />
      <div className="env-pop">{children}</div>
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
              <path className="smoke" d={`M${x} 46 c-9 -5 -9 -10 0 -14 s9 -9 0 -14 s-9 -8 0 -13`} fill="none" stroke="#70565F" strokeWidth="2.4" strokeLinecap="round" />
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

/** A softly beating heart with expanding rings. Decorative. */
export function Heartbeat({ size = 56 }: { size?: number }) {
  return (
    <span className="heartbeat" style={{ width: size, height: size }} aria-hidden="true">
      <span className="hb-ring" />
      <span className="hb-ring r2" />
      <span className="hb-heart"><Heart size={size * 0.72} color="#B52346" /></span>
    </span>
  );
}

/** A small burst of hearts. Re-mount with a new key to replay. */
export function HeartBurst() {
  return (
    <span className="burst" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} style={{ ['--a' as string]: `${i * 45 - 90}deg`, animationDelay: `${(i % 3) * 40}ms` }}>
          <Heart size={14 + (i % 3) * 3} color={i % 2 ? '#F6B8CB' : '#B52346'} />
        </span>
      ))}
    </span>
  );
}

/** Soft hearts drifting up the page, in front of the card so they show on phones too. Taps pass through. */
export function AmbientHearts() {
  const colors = ['#F6B8CB', '#E98BA8', '#F6B8CB', '#D9577A'];
  return (
    <div className="ambient" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          style={{
            left: `${4 + ((i * 8.3) % 92)}%`,
            animationDuration: `${13 + (i % 5) * 3}s`,
            animationDelay: `${-i * 2.3}s`,
            ['--s' as string]: `${12 + (i % 4) * 5}px`,
          }}
        >
          <Heart size={20} color={colors[i % colors.length]} />
        </span>
      ))}
    </div>
  );
}

/** Simple line icons for the decision tiles. Decorative (the label carries the meaning). */
export function ChoiceIcon({ id }: { id: string }) {
  const common = { width: 40, height: 40, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, focusable: false };
  switch (id) {
    case 'dinner':
      return (<svg {...common}><path d="M6 3v8a2 2 0 0 0 2 2v8M10 3v6M6 3v6M16 21V3c-2 1.5-3 4-3 7 0 2 1 3 3 3" /></svg>);
    case 'adventure':
      return (<svg {...common}><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></svg>);
    case 'hug':
      return (<svg {...common}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /><path d="M4 21c2-2 4-2 5-1M20 21c-2-2-4-2-5-1" /></svg>);
    case 'kiss':
      return (<svg {...common}><path d="M3 12c2-3 5-4 9-2 4-2 7-1 9 2-2 4-5 6-9 6s-7-2-9-6z" /><path d="M3 12h18" /></svg>);
    case 'present':
      return (<svg {...common}><rect x="3" y="9" width="18" height="12" rx="1.5" /><path d="M2 9h20v-3H2zM12 6v15M12 6C10 2 6 3 7.5 5.5S12 6 12 6zM12 6c2-4 6-3 4.5-.5S12 6 12 6z" /></svg>);
    case 'cake':
      return (<svg {...common}><path d="M4 21h16M5 21v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6M5 17c2 2 3-2 5 0s3-2 5 0 3-2 4 0M12 13V9M12 9c-1.4-1-1.4-2.4 0-4 1.4 1.6 1.4 3 0 4z" /></svg>);
    case 'me':
      return (<svg {...common}><path d="M4 18l-1-10 5 4 4-7 4 7 5-4-1 10zM4 21h16" /></svg>);
    case 'obviously-me':
      return (<svg {...common}><path d="M12 3l2.4 5.6L20 9.3l-4.4 3.8 1.4 5.9L12 15.8 7 19l1.4-5.9L4 9.3l5.6-.7z" /></svg>);
    case 'is-this-a-question':
      return (<svg {...common}><path d="M4 5h16v10H10l-4 4v-4H4z" /><path d="M10.3 8.6a1.9 1.9 0 1 1 2.6 1.8c-.6.3-.9.7-.9 1.3M12 13h.01" /></svg>);
    default:
      return (<svg {...common}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>);
  }
}
