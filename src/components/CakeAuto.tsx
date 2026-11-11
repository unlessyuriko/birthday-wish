import { useCallback, useEffect, useState, type ComponentType } from 'react';
import { Cake } from './Art';
import { webglAvailable } from './BouquetAuto';

const loadCake3D = () => import('./CakeCandles3D');

/** Start downloading the 3D candles early. */
export function prefetchCake3D() {
  if (webglAvailable()) void loadCake3D().catch(() => undefined);
}

type GLProps = { level: number; out: boolean; onFail: () => void };

/** The real 3D cake and candles when WebGL works; the SVG cake otherwise. */
export function CakeAuto({ out, level }: { out: boolean; level: number }) {
  const [GL, setGL] = useState<ComponentType<GLProps> | null>(null);
  const [failed, setFailed] = useState(() => !webglAvailable());
  const onFail = useCallback(() => setFailed(true), []);

  useEffect(() => {
    if (failed) return;
    let on = true;
    loadCake3D().then((m) => on && setGL(() => m.CakeCandles3D), () => on && setFailed(true));
    return () => {
      on = false;
    };
  }, [failed]);

  if (failed) return <Cake out={out} level={level * 100} />;
  if (!GL) return <div className="cake-gl cake-gl-loading" aria-hidden="true" />;
  return <GL level={level} out={out} onFail={onFail} />;
}
