import { useCallback, useEffect, useState, type ComponentType } from 'react';
import { Bouquet } from './Bouquet';

const load3D = () => import('./Bouquet3D');

/** Start downloading the 3D bouquet early (called while the opening questions are answered). */
export function prefetchBouquet3D() {
  if (webglAvailable()) void load3D().catch(() => undefined);
}

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * The real 3D bouquet when WebGL works, the SVG bouquet otherwise (no WebGL, load failure).
 * The wrapper keeps the same rise-from-the-envelope animation either way.
 */
export function BouquetAuto() {
  const [GL, setGL] = useState<ComponentType<{ onFail: () => void }> | null>(null);
  const [failed, setFailed] = useState(() => !webglAvailable());
  const onFail = useCallback(() => setFailed(true), []);

  useEffect(() => {
    if (failed) return;
    let on = true;
    load3D().then((m) => on && setGL(() => m.Bouquet3D), () => on && setFailed(true));
    return () => {
      on = false;
    };
  }, [failed]);

  if (failed) return <Bouquet />;
  if (!GL) return null;
  return (
    <div className="bq3d bq-gl-wrap">
      <GL onFail={onFail} />
      <span className="petal p1" /><span className="petal p2" /><span className="petal p3" /><span className="petal p4" />
    </div>
  );
}
