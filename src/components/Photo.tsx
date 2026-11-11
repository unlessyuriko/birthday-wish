import { useState } from 'react';
import type { BirthdayConfig } from '../content/types';
import { Stationery } from './Art';

export function Photo({ config, photoId, variant = 0 }: { config: BirthdayConfig; photoId?: string; variant?: number }) {
  const [failed, setFailed] = useState(false);
  const p = photoId ? config.photos.find((x) => x.id === photoId) : undefined;
  if (!p || failed) return <Stationery variant={variant} />;
  const fp = p.focalPoint ?? { x: 0.5, y: 0.5 };
  return (
    <img
      src={p.src}
      alt={p.alt}
      loading="lazy"
      decoding="async"
      width={300}
      height={400}
      style={{ objectPosition: `${fp.x * 100}% ${fp.y * 100}%` }}
      onError={() => setFailed(true)}
    />
  );
}
