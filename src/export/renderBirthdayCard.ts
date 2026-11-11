import type { StyleId } from '../content/copy';
import type { CardContent } from './cardContent';
import { fitText, type Measure } from './layout';

export const CARD_W = 1080;
export const CARD_H = 1920;
const SAFE_X = 72;
const SAFE_Y = 120;
const CONTENT_W = CARD_W - SAFE_X * 2;

const BODY = '"Nunito", system-ui, sans-serif';
const SCRIPT = '"Caveat", "Brush Script MT", cursive';
const SERIF = 'Georgia, "Times New Roman", serif';

const C = {
  cream: '#FFF8F0',
  white: '#FFFFFF',
  pink: '#FCE4EC',
  pinkDeep: '#F6B8CB',
  red: '#B52346',
  text: '#38252B',
  muted: '#70565F',
  gold: '#D9AA58',
};

export type CardPhoto = { image: CanvasImageSource & { width: number; height: number }; focal?: { x: number; y: number } };

export async function loadCardFonts(): Promise<void> {
  if (!('fonts' in document)) return;
  await Promise.all([
    document.fonts.load('700 40px "Nunito"'),
    document.fonts.load('800 40px "Nunito"'),
    document.fonts.load('400 40px "Nunito"'),
    document.fonts.load('700 40px "Caveat"'),
  ]);
  await document.fonts.ready;
}

export async function loadCardPhoto(src: string, focal?: { x: number; y: number }): Promise<CardPhoto> {
  const img = new Image();
  img.src = src;
  await img.decode();
  return { image: img, focal };
}

type Item = { h: number; draw: (y: number) => void };

function heart(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, fill: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s / 100, s / 100);
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.bezierCurveTo(-90, -30, -45, -85, 0, -40);
  ctx.bezierCurveTo(45, -85, 90, -30, 0, 30);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();
}

function bear(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  const fur = '#D9A27A';
  const inner = '#F4C9B0';
  const circle = (x: number, y: number, rad: number, fill: string) => {
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  };
  circle(cx - r * 0.72, cy - r * 0.78, r * 0.34, fur);
  circle(cx + r * 0.72, cy - r * 0.78, r * 0.34, fur);
  circle(cx - r * 0.72, cy - r * 0.78, r * 0.18, inner);
  circle(cx + r * 0.72, cy - r * 0.78, r * 0.18, inner);
  circle(cx, cy, r, fur);
  circle(cx, cy + r * 0.28, r * 0.42, '#F4D9C0');
  circle(cx - r * 0.34, cy - r * 0.1, r * 0.09, C.text);
  circle(cx + r * 0.34, cy - r * 0.1, r * 0.09, C.text);
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.14, r * 0.12, r * 0.08, 0, 0, Math.PI * 2);
  ctx.fillStyle = C.text;
  ctx.fill();
  ctx.lineWidth = r * 0.04;
  ctx.strokeStyle = C.text;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy + r * 0.2, r * 0.13, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  circle(cx - r * 0.55, cy + r * 0.12, r * 0.1, '#F6B8CB');
  circle(cx + r * 0.55, cy + r * 0.12, r * 0.1, '#F6B8CB');
  // bow
  heart(ctx, cx - r * 0.3, cy + r * 1.05, r * 0.3, C.red);
  heart(ctx, cx + r * 0.3, cy + r * 1.05, r * 0.3, C.red);
  circle(cx, cy + r * 1.05, r * 0.09, '#8F1836');
}

/** A quiet emblem used when there is no photo: gold ring, soft disc, cherry heart. */
function emblem(ctx: CanvasRenderingContext2D, cx: number, cy: number, style: StyleId) {
  const ringColor = style === 'funny' ? C.red : C.gold;
  ctx.beginPath();
  ctx.arc(cx, cy, 128, 0, Math.PI * 2);
  ctx.fillStyle = style === 'minimal' ? C.cream : C.pink;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = ringColor;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 112, 0, Math.PI * 2);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  heart(ctx, cx, cy + 6, 110, C.red);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCover(ctx: CanvasRenderingContext2D, p: CardPhoto, x: number, y: number, w: number, h: number) {
  const iw = p.image.width;
  const ih = p.image.height;
  const scale = Math.max(w / iw, h / ih);
  const sw = w / scale;
  const sh = h / scale;
  const fx = p.focal?.x ?? 0.5;
  const fy = p.focal?.y ?? 0.5;
  const sx = Math.min(Math.max(fx * iw - sw / 2, 0), iw - sw);
  const sy = Math.min(Math.max(fy * ih - sh / 2, 0), ih - sh);
  ctx.drawImage(p.image, sx, sy, sw, sh, x, y, w, h);
}

function background(ctx: CanvasRenderingContext2D, style: StyleId) {
  if (style === 'romantic') {
    const g = ctx.createLinearGradient(0, 0, 0, CARD_H);
    g.addColorStop(0, C.pink);
    g.addColorStop(1, C.cream);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    ctx.save();
    ctx.shadowColor = 'rgba(56,37,43,0.16)';
    ctx.shadowBlur = 36;
    ctx.shadowOffsetY = 12;
    roundRect(ctx, 40, 60, CARD_W - 80, CARD_H - 120, 48);
    ctx.fillStyle = C.white;
    ctx.fill();
    ctx.restore();
    heart(ctx, 130, 130, 56, C.pinkDeep);
    heart(ctx, CARD_W - 120, CARD_H - 120, 70, C.pinkDeep);
    heart(ctx, CARD_W - 150, 150, 34, C.pink);
  } else if (style === 'funny') {
    ctx.fillStyle = C.red;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    roundRect(ctx, 44, 60, CARD_W - 88, CARD_H - 120, 56);
    ctx.fillStyle = C.cream;
    ctx.fill();
    ctx.setLineDash([18, 16]);
    ctx.lineWidth = 5;
    ctx.strokeStyle = C.pinkDeep;
    roundRect(ctx, 70, 86, CARD_W - 140, CARD_H - 172, 40);
    ctx.stroke();
    ctx.setLineDash([]);
  } else {
    ctx.fillStyle = C.cream;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    ctx.lineWidth = 3;
    ctx.strokeStyle = C.gold;
    roundRect(ctx, 48, 48, CARD_W - 96, CARD_H - 96, 8);
    ctx.stroke();
    roundRect(ctx, 64, 64, CARD_W - 128, CARD_H - 128, 4);
    ctx.stroke();
  }
}

export function renderBirthdayCard(canvas: HTMLCanvasElement, content: CardContent, photo?: CardPhoto): void {
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available');
  ctx.textBaseline = 'alphabetic';
  background(ctx, content.style);

  const style = content.style;
  const items: Item[] = [];
  const gap = (h: number) => items.push({ h, draw: () => {} });

  const text = (
    t: string,
    font: (size: number) => string,
    start: number,
    min: number,
    color: string,
    lineH: number,
    maxLines: number,
    width = CONTENT_W - 40,
  ) => {
    ctx.font = font(start);
    const measure: Measure = (s, size) => {
      ctx.font = font(size);
      return ctx.measureText(s).width;
    };
    const { size, lines } = fitText(measure, t, width, start, min, maxLines);
    const h = lines.length * size * lineH;
    items.push({
      h,
      draw: (y) => {
        ctx.font = font(size);
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        lines.forEach((l, i) => ctx.fillText(l, CARD_W / 2, y + size * lineH * i + size * (0.5 + lineH / 2) * 0.9));
      },
    });
  };

  // Text content per style.
  if (style === 'romantic') {
    content.headline.forEach((l) => text(l, (s) => `700 ${s}px ${SCRIPT}`, 130, 70, C.red, 1.05, 1));
    gap(40);
    content.supporting.forEach((l, i) => {
      text(l, (s) => `${i === 0 ? 800 : 400} ${s}px ${BODY}`, i === 0 ? 56 : 44, 30, i === 0 ? C.text : C.muted, 1.3, 4);
      gap(24);
    });
  } else if (style === 'funny') {
    if (content.badge) {
      const label = `Today's treat: ${content.badge}`;
      ctx.font = `800 40px ${BODY}`;
      const w = Math.min(ctx.measureText(label).width + 80, CONTENT_W - 40);
      items.push({
        h: 90,
        draw: (y) => {
          ctx.save();
          ctx.translate(CARD_W / 2, y + 45);
          ctx.rotate(-0.04);
          roundRect(ctx, -w / 2, -40, w, 80, 40);
          ctx.fillStyle = C.red;
          ctx.fill();
          ctx.font = `800 40px ${BODY}`;
          ctx.fillStyle = C.white;
          ctx.textAlign = 'center';
          ctx.fillText(label, 0, 14, w - 40);
          ctx.restore();
        },
      });
      gap(50);
    }
    content.supporting.forEach((l) => text(l, (s) => `800 ${s}px ${BODY}`, 46, 30, C.red, 1.2, 2));
    gap(24);
    content.headline.forEach((l) => text(l, (s) => `800 ${s}px ${BODY}`, 88, 48, C.text, 1.15, 5));
    gap(50);
    content.details.forEach((d) => {
      ctx.font = `700 46px ${BODY}`;
      const measure: Measure = (s, size) => {
        ctx.font = `700 ${size}px ${BODY}`;
        return ctx.measureText(s).width;
      };
      const { size, lines } = fitText(measure, d, CONTENT_W - 220, 46, 30, 2);
      const h = Math.max(120, lines.length * size * 1.25 + 50);
      items.push({
        h,
        draw: (y) => {
          roundRect(ctx, SAFE_X + 20, y, CONTENT_W - 40, h - 20, 30);
          ctx.fillStyle = C.pink;
          ctx.fill();
          roundRect(ctx, SAFE_X + 52, y + (h - 20) / 2 - 24, 48, 48, 12);
          ctx.fillStyle = C.red;
          ctx.fill();
          ctx.strokeStyle = C.white;
          ctx.lineWidth = 7;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(SAFE_X + 63, y + (h - 20) / 2 + 1);
          ctx.lineTo(SAFE_X + 74, y + (h - 20) / 2 + 12);
          ctx.lineTo(SAFE_X + 91, y + (h - 20) / 2 - 12);
          ctx.stroke();
          ctx.font = `700 ${size}px ${BODY}`;
          ctx.fillStyle = C.text;
          ctx.textAlign = 'left';
          lines.forEach((l, i) => ctx.fillText(l, SAFE_X + 128, y + (h - 20) / 2 - ((lines.length - 1) * size * 1.25) / 2 + i * size * 1.25 + size * 0.34));
        },
      });
    });
    if (content.signoff) {
      gap(30);
      text(content.signoff, (s) => `700 ${s}px ${SCRIPT}`, 80, 48, C.red, 1.1, 2);
    }
  } else {
    items.push({
      h: 4,
      draw: (y) => {
        ctx.fillStyle = C.gold;
        ctx.fillRect(CARD_W / 2 - 60, y, 120, 4);
      },
    });
    gap(60);
    content.headline.forEach((l) => text(l, (s) => `700 ${s}px ${SERIF}`, 104, 56, C.text, 1.15, 4));
    gap(40);
    content.supporting.forEach((l) => text(l, (s) => `italic 400 ${s}px ${SERIF}`, 48, 32, C.muted, 1.35, 4));
    if (content.signoff) {
      gap(60);
      text(content.signoff, (s) => `700 ${s}px ${SCRIPT}`, 84, 48, C.red, 1.1, 2);
    }
  }

  const textH = items.reduce((a, b) => a + b.h, 0);
  const SAFE_H = CARD_H - SAFE_Y * 2;
  const GAP = 70;
  // Top artwork: the share photo when it fits, otherwise a bundled bear illustration.
  let photoH = 0;
  if (photo) {
    photoH = Math.min(800, SAFE_H - textH - GAP);
    if (photoH < 380) photoH = 0;
  }
  const artH = photoH || 360;
  const total = artH + GAP + textH;
  let y = SAFE_Y + Math.max(0, (SAFE_H - total) / 2);

  if (photoH && photo) {
    const pw = Math.min(CONTENT_W - 40, 760);
    const px = (CARD_W - pw) / 2;
    ctx.save();
    ctx.translate(CARD_W / 2, y + photoH / 2);
    ctx.rotate(style === 'minimal' ? 0 : -0.025);
    ctx.translate(-CARD_W / 2, -(y + photoH / 2));
    ctx.shadowColor = 'rgba(56,37,43,0.25)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 10;
    const border = style === 'minimal' ? 0 : 18;
    roundRect(ctx, px - border, y - border, pw + border * 2, photoH + border * 2, style === 'minimal' ? 6 : 26);
    ctx.fillStyle = C.white;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.save();
    roundRect(ctx, px, y, pw, photoH, style === 'minimal' ? 4 : 14);
    ctx.clip();
    drawCover(ctx, photo, px, y, pw, photoH);
    ctx.restore();
    ctx.restore();
  } else {
    emblem(ctx, CARD_W / 2, y + 150, style);
  }
  y += artH + GAP;
  for (const it of items) {
    it.draw(y);
    y += it.h;
  }
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not create image'))), 'image/png'),
  );
}
