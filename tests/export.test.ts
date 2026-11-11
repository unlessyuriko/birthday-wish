import { describe, expect, it } from 'vitest';
import { config as base } from '../src/content/birthday.config';
import type { BirthdayConfig } from '../src/content/types';
import { buildCardContent, cardFileName, resolveSharePhoto } from '../src/export/cardContent';
import { fitText, wrapText } from '../src/export/layout';
import { hasForbiddenDash } from '../src/validation/text';
import { CARD_H, CARD_W } from '../src/export/renderBirthdayCard';

const cfg = (): BirthdayConfig => structuredClone(base);
const styles = ['romantic', 'funny', 'minimal'] as const;

describe('keepsake content', () => {
  it('is 1080 by 1920', () => {
    expect([CARD_W, CARD_H]).toEqual([1080, 1920]);
  });
  it('never contains private letter, memory or surprise text', () => {
    const c = cfg();
    c.letter.paragraphs = ['SECRET-LETTER-TEXT'];
    c.memories[0].caption = 'SECRET-MEMORY';
    c.surprise = { confirmed: true, title: 'SECRET-PLAN', description: 'SECRET-DESC', locationLabel: 'SECRET-PLACE' };
    for (const s of styles) {
      const text = JSON.stringify(buildCardContent(c, s, 'cake'));
      expect(text).not.toMatch(/SECRET/);
      expect(hasForbiddenDash(text)).toBe(false);
    }
  });
  it('uses the selected treat and names', () => {
    const c = cfg();
    c.recipient.nickname = 'Nick';
    c.sender.name = 'Sam';
    const a = buildCardContent(c, 'romantic', 'hug');
    expect(a.supporting).toContain("Today's agenda: a hug, and being ridiculously loved.");
    expect(a.supporting).toContain('Happy Birthday, Nick.');
    expect(a.supporting).toContain('Made just for you, by Sam.');
    expect(buildCardContent(c, 'funny', 'present').badge).toBe('A present');
    expect(buildCardContent(c, 'minimal').signoff).toBe('Love, Sam');
  });
  it('only exports a photo that is selected and allowShare', () => {
    const c = cfg();
    c.photos = [
      { id: 'private', src: 'a.jpg', alt: 'a', allowShare: false },
      { id: 'ok', src: 'b.jpg', alt: 'b', allowShare: true },
    ];
    expect(resolveSharePhoto(c)).toBeUndefined();
    c.sharePhotoId = 'private';
    expect(resolveSharePhoto(c)).toBeUndefined();
    c.sharePhotoId = 'ok';
    expect(resolveSharePhoto(c)?.id).toBe('ok');
  });
  it('names files safely', () => {
    expect(cardFileName('romantic')).toBe('birthday-card-romantic.png');
  });
});

describe('text layout', () => {
  const measure = (s: string, size: number) => s.length * size * 0.5;
  it('wraps without exceeding width', () => {
    const lines = wrapText(measure, 'one two three four five six', 20, 100);
    expect(lines.every((l) => measure(l, 20) <= 100)).toBe(true);
    expect(lines.join(' ')).toBe('one two three four five six');
  });
  it('splits a single very long word', () => {
    const lines = wrapText(measure, 'Supercalifragilisticexpialidocious', 20, 100);
    expect(lines.length).toBeGreaterThan(1);
    expect(lines.every((l) => measure(l, 20) <= 100)).toBe(true);
  });
  it('shrinks to fit but never truncates', () => {
    const r = fitText(measure, 'a fairly long headline that needs room', 200, 60, 20, 2);
    expect(r.size).toBeLessThan(60);
    expect(r.lines.join(' ')).toBe('a fairly long headline that needs room');
  });
});
