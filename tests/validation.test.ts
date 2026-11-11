import { describe, expect, it } from 'vitest';
import { config as base } from '../src/content/birthday.config';
import type { BirthdayConfig } from '../src/content/types';
import { FORBIDDEN_DASH, hasForbiddenDash, sanitizeDeep, stripForbiddenDash, collectStrings } from '../src/validation/text';
import { complimentsEnabled, surpriseIsValid, validateConfig } from '../src/validation/validate';
import { decisions, gateQuestions } from '../src/content/copy';

const clone = (): BirthdayConfig => structuredClone(base);

describe('forbidden punctuation (U+2014)', () => {
  it('uses the escaped code point', () => {
    expect(FORBIDDEN_DASH.codePointAt(0)).toBe(0x2014);
  });
  it('is converted to a hyphen, keeping meaning', () => {
    expect(stripForbiddenDash(`a \u2014 b`)).toBe('a - b');
    expect(stripForbiddenDash(`a\u2014b`)).toBe('a - b');
  });
  it('sanitizes nested client content', () => {
    const c = clone();
    c.letter.paragraphs[0] = `Hi \u2014 you`;
    expect(collectStrings(sanitizeDeep(c)).some(([, s]) => hasForbiddenDash(s))).toBe(false);
    expect(validateConfig(c).warnings.some((w) => w.includes('long dash'))).toBe(true);
  });
  it('built-in copy and config contain none', () => {
    const all = collectStrings([base, decisions, gateQuestions]);
    expect(all.filter(([, s]) => hasForbiddenDash(s))).toEqual([]);
  });
});

describe('config validation', () => {
  it('preview config builds with no errors', () => {
    expect(validateConfig(clone()).errors).toEqual([]);
  });
  it('production rejects unresolved placeholders', () => {
    const c = clone();
    c.mode = 'production';
    expect(validateConfig(c).errors.some((e) => e.includes('placeholder'))).toBe(true);
  });
  it('rejects unknown photo references and non-shareable share photo', () => {
    const c = clone();
    c.heroPhotoId = 'nope';
    c.photos = [{ id: 'a', src: 'x.jpg', alt: 'x', allowShare: false }];
    c.sharePhotoId = 'a';
    const e = validateConfig(c).errors;
    expect(e.some((m) => m.includes('heroPhotoId'))).toBe(true);
    expect(e.some((m) => m.includes('allowShare'))).toBe(true);
  });
  it('validates age', () => {
    const c = clone();
    c.recipient.age = 0;
    expect(validateConfig(c).errors.some((e) => e.includes('age'))).toBe(true);
  });
  it('hides unconfirmed or incomplete surprises', () => {
    const c = clone();
    c.surprise = { confirmed: false, title: 't', description: 'd' };
    expect(surpriseIsValid(c)).toBe(false);
    c.surprise = { confirmed: true, title: 't', description: 'd' };
    expect(surpriseIsValid(c)).toBe(true);
  });
  it('needs three compliments', () => {
    const c = clone();
    c.compliments = ['a', 'b'];
    expect(complimentsEnabled(c)).toBe(false);
    c.compliments = ['a', 'b', 'c'];
    expect(complimentsEnabled(c)).toBe(true);
  });
});
