import { useEffect, useRef } from 'react';
import {
  AdditiveBlending, CanvasTexture, Color, CylinderGeometry, DirectionalLight, Group, HemisphereLight, LatheGeometry, Mesh,
  MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, PointLight, RepeatWrapping, Scene, SphereGeometry, Sprite,
  SpriteMaterial, SRGBColorSpace, TorusGeometry, Vector2, WebGLRenderer,
} from 'three';

const W = 200;
const H = 214;

type Props = {
  /** 0 to 1: how hard the candles are being blown. */
  level: number;
  /** True once the candles are out. */
  out: boolean;
  onFail: () => void;
};

const radial = (stops: Array<[number, string]>) => {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  stops.forEach(([o, col]) => grad.addColorStop(o, col));
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
};

/**
 * A real 3D birthday cake with three striped candles. Flames flicker, bend away and shrink as
 * `level` rises, go out when `out` is true, and then thin curls of smoke keep rising from the wicks.
 */
export function CakeCandles3D({ level, out, onFail }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const live = useRef({ level, out });
  const poke = useRef<() => void>(() => undefined);
  live.current = { level, out };

  useEffect(() => {
    poke.current(); // re-render a still frame when props change (reduced motion)
  }, [level, out]);

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
    const camera = new PerspectiveCamera(30, W / H, 0.1, 50);
    camera.position.set(0, 2.7, 8.4);
    camera.lookAt(0, 1.38, 0);

    const hemi = new HemisphereLight(0xffffff, 0xf0b8c8, 1.35);
    scene.add(hemi);
    const sun = new DirectionalLight(0xfff0e0, 1.5);
    sun.position.set(-3, 5, 4);
    scene.add(sun);

    const dispose: Array<{ dispose: () => void }> = [];
    const std = (color: string, rough = 0.6) => {
      const m = new MeshStandardMaterial({ color: new Color(color), roughness: rough, emissive: new Color(color), emissiveIntensity: 0.28 });
      dispose.push(m);
      return m;
    };
    const geo = <T extends { dispose: () => void }>(g: T) => {
      dispose.push(g);
      return g;
    };

    // --- Cake
    const cake = new Group();
    scene.add(cake);
    const add = (g: Mesh) => {
      cake.add(g);
      return g;
    };
    add(new Mesh(geo(new CylinderGeometry(1.95, 1.95, 0.09, 56)), std('#FFFFFF', 0.35))).position.y = 0.045;
    add(new Mesh(geo(new CylinderGeometry(1.5, 1.5, 0.85, 56)), std('#F6B8CB', 0.55))).position.y = 0.52;
    add(new Mesh(geo(new CylinderGeometry(1.02, 1.02, 0.68, 56)), std('#FFF4EA', 0.55))).position.y = 1.28;
    const icing = std('#FFFFFF', 0.4);
    const t1 = add(new Mesh(geo(new TorusGeometry(1.5, 0.1, 12, 64)), icing));
    t1.rotation.x = Math.PI / 2;
    t1.position.y = 0.95;
    const t2 = add(new Mesh(geo(new TorusGeometry(1.02, 0.09, 12, 56)), icing));
    t2.rotation.x = Math.PI / 2;
    t2.position.y = 1.62;
    const berry = std('#B52346', 0.35);
    const pearl = geo(new SphereGeometry(0.075, 10, 8));
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      const p = add(new Mesh(pearl, berry));
      p.position.set(Math.cos(a) * 1.52, 0.2, Math.sin(a) * 1.52);
    }
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      const p = add(new Mesh(pearl, i % 2 ? std('#F6B8CB', 0.4) : berry));
      p.scale.setScalar(0.85);
      p.position.set(Math.cos(a) * 1.03, 0.98, Math.sin(a) * 1.03);
    }

    // --- Candles
    const stripe = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const g = c.getContext('2d')!;
      g.fillStyle = '#FFF6EE';
      g.fillRect(0, 0, 64, 64);
      g.fillStyle = '#F29BB5';
      for (let i = -2; i < 6; i++) {
        g.beginPath();
        g.moveTo(i * 16, 0);
        g.lineTo(i * 16 + 8, 0);
        g.lineTo(i * 16 + 40, 64);
        g.lineTo(i * 16 + 32, 64);
        g.fill();
      }
      const t = new CanvasTexture(c);
      t.wrapS = t.wrapT = RepeatWrapping;
      t.repeat.set(1, 2.2);
      t.colorSpace = SRGBColorSpace;
      return t;
    })();
    dispose.push(stripe);
    const candleMat = new MeshStandardMaterial({ map: stripe, roughness: 0.5 });
    dispose.push(candleMat);
    const wickMat = std('#2a1a14', 0.8);
    const candleGeo = geo(new CylinderGeometry(0.075, 0.075, 0.95, 20));
    const dollopGeo = geo(new TorusGeometry(0.1, 0.04, 8, 20));
    const wickGeo = geo(new CylinderGeometry(0.012, 0.012, 0.12, 6));

    // Flame: teardrop lathe with a colour gradient from blue base to orange tip.
    const profile = [
      [0, 0], [0.05, 0.02], [0.095, 0.1], [0.105, 0.2], [0.085, 0.32], [0.05, 0.44], [0.02, 0.54], [0, 0.6],
    ].map(([x, y]) => new Vector2(x, y));
    const flameGeo = geo(new LatheGeometry(profile, 18));
    const cols: number[] = [];
    const pos = flameGeo.attributes.position;
    const base = new Color('#5aa0ff');
    const mid = new Color('#ffe38a');
    const tipC = new Color('#ff9a3c');
    const tmp = new Color();
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i) / 0.6;
      if (y < 0.22) tmp.lerpColors(base, mid, y / 0.22);
      else tmp.lerpColors(mid, tipC, Math.min(1, (y - 0.22) / 0.78));
      cols.push(tmp.r, tmp.g, tmp.b);
    }
    flameGeo.setAttribute('color', new (pos.constructor as new (a: number[], n: number) => typeof pos)(cols, 3));
    const flameMat = new MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.96, toneMapped: false });
    dispose.push(flameMat);
    const glowTex = radial([[0, 'rgba(255,214,120,0.95)'], [0.35, 'rgba(255,170,70,0.38)'], [1, 'rgba(255,150,60,0)']]);
    dispose.push(glowTex);
    const smokeTex = radial([[0, 'rgba(95,88,95,0.7)'], [0.6, 'rgba(130,122,128,0.3)'], [1, 'rgba(160,150,155,0)']]);
    dispose.push(smokeTex);

    type Cd = { flame: Mesh; glow: Sprite; light: PointLight; ember: Mesh; smoke: Sprite[]; seed: number };
    const candles: Cd[] = [];
    const emberMat = new MeshBasicMaterial({ color: 0xff7a2a, transparent: true, toneMapped: false });
    dispose.push(emberMat);
    const emberGeo = geo(new SphereGeometry(0.03, 8, 6));
    [[-0.5, 0.05], [0, -0.12], [0.5, 0.05]].forEach(([x, z], i) => {
      const g = new Group();
      g.position.set(x, 1.6, z); // sunk slightly into the top tier so the candle stands on the cake
      scene.add(g);
      const body = new Mesh(candleGeo, candleMat);
      body.position.y = 0.475;
      g.add(body);
      const dollop = new Mesh(dollopGeo, icing);
      dollop.rotation.x = Math.PI / 2;
      dollop.position.y = 0.035;
      g.add(dollop);
      const wick = new Mesh(wickGeo, wickMat);
      wick.position.y = 0.99;
      g.add(wick);
      const flame = new Mesh(flameGeo, flameMat);
      flame.position.y = 1.03;
      g.add(flame);
      const glow = new Sprite(new SpriteMaterial({ map: glowTex, blending: AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false }));
      glow.position.y = 1.3;
      glow.scale.setScalar(1.25);
      dispose.push(glow.material);
      g.add(glow);
      const light = new PointLight(0xffb866, 6, 3.2, 2);
      light.position.set(0, 1.35, 0.1);
      g.add(light);
      const ember = new Mesh(emberGeo, emberMat);
      ember.position.y = 1.04;
      ember.visible = false;
      g.add(ember);
      const smoke: Sprite[] = [];
      for (let k = 0; k < 4; k++) {
        const s = new Sprite(new SpriteMaterial({ map: smokeTex, transparent: true, depthWrite: false, opacity: 0 }));
        dispose.push(s.material);
        s.visible = false;
        g.add(s);
        smoke.push(s);
      }
      candles.push({ flame, glow, light, ember, smoke, seed: i * 1.7 });
    });

    const st = { lvl: live.current.level, puff: live.current.out ? 1 : 0, outAt: live.current.out ? -10 : 0, wasOut: live.current.out };
    let last = performance.now();
    let tAcc = 0;
    let raf = 0;

    const draw = (dt: number, still: boolean) => {
      const { level: target, out: isOut } = live.current;
      tAcc += dt;
      const t = tAcc;
      if (isOut && !st.wasOut) {
        st.wasOut = true;
        st.outAt = t;
      }
      if (!isOut) st.wasOut = false;
      st.lvl += (target - st.lvl) * (still ? 1 : 1 - Math.exp(-dt * 9));
      const L = st.lvl;
      const puffT = isOut ? Math.min(1, (t - st.outAt) / 0.28) : 0;
      let lit = 0;
      candles.forEach((c, i) => {
        const wob = still ? 0 : Math.sin(t * 13 + c.seed) * 0.5 + Math.sin(t * 7.3 + c.seed * 2) * 0.5;
        const strength = (0.2 + L * 1.1) * (still ? 0.3 : 1);
        const alive = 1 - puffT;
        const s = Math.max(0.0001, (1 - 0.62 * L) * (1 + wob * 0.07 * (1 + L * 3)) * alive);
        c.flame.visible = alive > 0.02;
        c.flame.scale.set(s * (1 - 0.15 * L), s * (1 + (still ? 0 : wob * 0.05)), s * (1 - 0.15 * L));
        c.flame.rotation.z = -(L * 0.95 + wob * 0.05 * strength);
        c.flame.rotation.x = still ? 0 : Math.sin(t * 5 + c.seed) * 0.05 * strength;
        const glowK = alive * (1 - 0.7 * L) * (0.92 + wob * 0.08);
        c.glow.material.opacity = Math.max(0, glowK);
        c.glow.scale.setScalar(1.25 * (0.6 + 0.4 * alive));
        c.glow.position.x = -c.flame.rotation.z * 0.18;
        c.light.intensity = 6.5 * glowK;
        lit += glowK;

        // Ember and smoke after the flame is out
        const since = isOut ? t - st.outAt : 0;
        c.ember.visible = isOut && since < 3.2;
        emberMat.opacity = Math.max(0, 1 - since / 3.2);
        c.smoke.forEach((sp, k) => {
          if (!isOut) {
            sp.visible = false;
            return;
          }
          const age = still ? (k + 1) / 5 : (((since - 0.15 - k * 0.7 - i * 0.22) % 2.8) + 2.8) % 2.8 / 2.8;
          sp.visible = still || since > 0.15 + k * 0.7 * 0.3;
          sp.position.set(Math.sin(age * 7 + c.seed + k) * 0.06 * age + age * 0.12, 1.04 + age * 0.8, 0.02);
          sp.scale.setScalar(0.1 + age * 0.26);
          sp.material.opacity = Math.sin(Math.min(1, age) * Math.PI) * 0.62;
        });
      });
      hemi.intensity = 0.9 + 0.1 * (1 - lit / 3);
      renderer.render(scene, camera);
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(dt, false);
      raf = requestAnimationFrame(frame);
    };
    if (reduced) {
      poke.current = () => draw(0.016, true);
      draw(0.016, true);
    } else {
      raf = requestAnimationFrame(frame);
    }
    const onVis = () => {
      if (reduced) return;
      if (document.hidden) cancelAnimationFrame(raf);
      else {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      poke.current = () => undefined;
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
      dispose.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [onFail]);

  return <div ref={mount} className="cake-gl" role="img" aria-label={out ? 'A birthday cake with the candles blown out' : 'A birthday cake with three lit candles'} />;
}
