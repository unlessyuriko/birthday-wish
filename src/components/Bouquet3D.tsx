import { useEffect, useRef } from 'react';
import {
  BoxGeometry, Color, SphereGeometry, CylinderGeometry, DirectionalLight, DoubleSide, Group, HemisphereLight, MathUtils, Mesh,
  MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, Quaternion, Scene, TorusGeometry, Vector3, WebGLRenderer,
} from 'three';
import { buildRose, type RoseTone } from './bouquet3d/roseGeometry';

const W = 200;
const H = 280;

type Props = { onFail: () => void };

/**
 * A real 3D rose bouquet (three.js). Roses are procedural spiral-petal geometry, lit with soft
 * lights, arranged in a dense dome over pink paper panels, gold-trimmed sheets and a satin ribbon.
 * Loaded on demand; the SVG bouquet is the fallback when WebGL is unavailable.
 */
export function Bouquet3D({ onFail }: Props) {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      onFail();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new Scene();
    const camera = new PerspectiveCamera(30, W / H, 0.1, 60);
    camera.position.set(0, 2.2, 10.6);
    camera.lookAt(0, 0.15, 0);

    scene.add(new HemisphereLight(0xfff4f0, 0xb0607a, 1.25));
    const key = new DirectionalLight(0xfff1e6, 2.1);
    key.position.set(-3, 5, 5);
    scene.add(key);
    const rim = new DirectionalLight(0xffb6c8, 0.9);
    rim.position.set(4, 1.5, -2);
    scene.add(rim);

    const disposables: Array<{ dispose: () => void }> = [];
    const mat = (color: string, rough = 0.85) => {
      const m = new MeshStandardMaterial({ color: new Color(color), roughness: rough, metalness: 0, side: DoubleSide });
      disposables.push(m);
      return m;
    };
    const geo = <T extends { dispose: () => void }>(g: T) => {
      disposables.push(g);
      return g;
    };

    const bouquet = new Group();
    scene.add(bouquet);

    // --- Paper behind the roses
    const pinkA = mat('#F4A6BE');
    const pinkB = mat('#F9C3D4');
    // Paper is lit from within a little so no fold falls into a muddy shadow.
    for (const m of [pinkA, pinkB]) {
      m.emissive = m.color.clone();
      m.emissiveIntensity = 0.38;
    }
    const white = mat('#FFFFFF', 0.7);
    white.emissive = new Color('#ffffff');
    white.emissiveIntensity = 0.32;
    const gold = mat('#E3B23C', 0.4);
    const panel = (w: number, h: number, x: number, y: number, z: number, ry: number, m: MeshStandardMaterial) => {
      const p = new Mesh(geo(new PlaneGeometry(w, h, 1, 1)), m);
      p.position.set(x, y, z);
      p.rotation.y = ry;
      bouquet.add(p);
      return p;
    };
    panel(1.9, 3.7, 0, 1.0, -1.45, 0, pinkB);
    panel(1.5, 3.3, -1.3, 0.85, -1.1, 0.42, pinkA);
    panel(1.5, 3.3, 1.3, 0.85, -1.1, -0.42, pinkA);
    for (const s of [-1, 1]) {
      const sheet = panel(1.15, 3.1, s * 1.78, 0.7, -0.45, -s * 1.0, white);
      sheet.rotation.z = -s * 0.1;
      const edge = new Mesh(geo(new BoxGeometry(1.15, 0.06, 0.03)), gold);
      edge.position.set(0, 1.55, 0);
      sheet.add(edge);
    }

    // --- Roses: a dense dome of axes, outermost ring first so inner ones overlap
    const variants: Array<{ g: ReturnType<typeof buildRose>; m: MeshStandardMaterial }> = [];
    const redMat = new MeshStandardMaterial({ vertexColors: true, side: DoubleSide, roughness: 0.55, metalness: 0 });
    const peachMat = new MeshStandardMaterial({ vertexColors: true, side: DoubleSide, roughness: 0.6, metalness: 0 });
    disposables.push(redMat, peachMat);
    const tones: RoseTone[] = ['red', 'red', 'red', 'red', 'red', 'blush', 'blush'];
    tones.forEach((tone, i) => {
      const g = buildRose(13 + i * 7, tone, 0.42);
      disposables.push(g);
      variants.push({ g, m: tone === 'red' ? redMat : peachMat });
    });

    // A tight bud at the heart of each rose hides the gap where the inner petals meet.
    const coreGeo = new SphereGeometry(0.17, 14, 10);
    disposables.push(coreGeo);
    const coreRed = new MeshStandardMaterial({ color: new Color('#5a0715'), roughness: 0.6 });
    const corePeach = new MeshStandardMaterial({ color: new Color('#c8706f'), roughness: 0.6 });
    disposables.push(coreRed, corePeach);

    const dome: Array<{ theta: number; phi: number; s: number }> = [];
    dome.push({ theta: 0, phi: 0, s: 0.42 });
    for (let k = 0; k < 6; k++) dome.push({ theta: 0.34, phi: (k / 6) * Math.PI * 2 + 0.3, s: 0.41 });
    for (let k = 0; k < 12; k++) dome.push({ theta: 0.68, phi: (k / 12) * Math.PI * 2, s: 0.4 });
    const blushSlots = new Set([2, 9, 11, 15]);
    const roses: Array<{ g: Group; delay: number }> = [];
    const up = new Vector3(0, 1, 0);
    const R = 2.0;
    // The cap of roses faces the viewer, tilted up a little, like the bouquet in the reference.
    const axis = new Vector3(0, 0.55, 1).normalize();
    const e1 = new Vector3().crossVectors(up, axis).normalize();
    const e2 = new Vector3().crossVectors(axis, e1).normalize();
    dome.forEach((d, i) => {
      const dir = axis.clone().multiplyScalar(Math.cos(d.theta))
        .addScaledVector(e1, Math.sin(d.theta) * Math.cos(d.phi))
        .addScaledVector(e2, Math.sin(d.theta) * Math.sin(d.phi));
      const holder = new Group();
      holder.position.copy(dir.clone().multiplyScalar(R)).add(new Vector3(0, 0.1, -1.55));
      holder.quaternion.copy(new Quaternion().setFromUnitVectors(up, dir));
      const blush = blushSlots.has(i);
      const v = blush ? variants[5 + (i % 2)] : variants[i % 5];
      const rose = new Mesh(v.g, v.m);
      rose.rotation.y = i * 1.9;
      const core = new Mesh(coreGeo, blush ? corePeach : coreRed);
      core.position.y = 0.2;
      core.scale.set(1, 1.25, 1);
      rose.add(core);
      rose.scale.setScalar(d.s);
      holder.add(rose);
      bouquet.add(holder);
      roses.push({ g: holder, delay: 1.0 + d.theta * 0.5 + (i % 5) * 0.04 });
    });

    // --- Wrap: pink paper folds curling around the front, a gold-trimmed white sheet, satin ribbon
    const foldGeo = (start: number, len: number, rt: number, rb: number, h: number) => geo(new CylinderGeometry(rt, rb, h, 28, 1, true, start, len));
    const wrapBack = new Mesh(foldGeo(Math.PI - 1.9, 3.8, 1.9, 0.3, 2.0), pinkA);
    wrapBack.position.set(0, -0.9, -0.15);
    bouquet.add(wrapBack);
    const foldL = new Mesh(foldGeo(-1.55, 1.05, 2.05, 0.34, 1.6), pinkB);
    foldL.position.set(0, -0.55, -0.1);
    bouquet.add(foldL);
    const foldR = new Mesh(foldGeo(0.5, 1.05, 2.05, 0.34, 1.6), pinkB);
    foldR.position.set(0, -0.55, -0.1);
    bouquet.add(foldR);
    const front = new Mesh(foldGeo(-0.5, 1.0, 1.9, 0.3, 1.1), white);
    front.position.set(0, -0.62, -0.05);
    bouquet.add(front);
    const rimArc = new Mesh(geo(new TorusGeometry(1.9, 0.03, 8, 40, 1.0)), gold);
    rimArc.rotation.set(Math.PI / 2, 0, Math.PI / 2 - 0.5);
    rimArc.position.set(0, -0.07, -0.05);
    bouquet.add(rimArc);
    const satin = mat('#F6B4C8', 0.35);
    const band = new Mesh(geo(new TorusGeometry(0.52, 0.075, 10, 40)), satin);
    band.rotation.x = Math.PI / 2;
    band.position.set(0, -1.25, -0.15);
    bouquet.add(band);
    for (const s of [-1, 1]) {
      const loop = new Mesh(geo(new TorusGeometry(0.24, 0.05, 10, 24)), satin);
      loop.position.set(s * 0.26, -1.25, 0.4);
      loop.rotation.set(0, 0.2 * s, s * 0.5);
      bouquet.add(loop);
      const tail = new Mesh(geo(new BoxGeometry(0.1, 0.7, 0.02)), satin);
      tail.position.set(s * 0.12, -1.7, 0.42);
      tail.rotation.z = s * 0.2;
      bouquet.add(tail);
    }
    bouquet.position.y = 0.2;

    const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
    const overshoot = (x: number) => {
      const t = Math.min(1, Math.max(0, x));
      const c1 = 1.5;
      return 1 + (c1 + 1) * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    let raf = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = reduced ? 99 : (now - t0) / 1000;
      for (const r of roses) r.g.scale.setScalar(MathUtils.clamp(overshoot((t - r.delay) / 0.85), 0, 1.15) || 0.0001);
      const swayK = reduced ? 0 : ease((t - 2.0) / 1.2);
      bouquet.rotation.y = Math.sin(t * 0.85) * 0.42 * swayK;
      bouquet.rotation.x = Math.sin(t * 0.6) * 0.03 * swayK;
      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      if (reduced) return;
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(frame);
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [onFail]);

  return <div ref={mount} className="bq-gl" aria-hidden="true" />;
}
