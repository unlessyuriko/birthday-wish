import type { BirthdayConfig } from '../content/types';
import { collectStrings, hasForbiddenDash } from './text';

export type ValidationResult = { errors: string[]; warnings: string[] };

const PLACEHOLDER_RE = /\[[^\]]+\]/;
const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

export function surpriseIsValid(c: BirthdayConfig): boolean {
  const s = c.surprise;
  return !!s && s.confirmed === true && s.title.trim().length > 0 && s.description.trim().length > 0;
}

/** Messages never include the content itself, only paths and rules, so they are safe to print. */
export function validateConfig(c: BirthdayConfig): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const prod = c.mode === 'production';
  const issue = (msg: string, hard = true) => (prod && hard ? errors : warnings).push(msg);

  if (!c.recipient.name.trim()) errors.push('recipient.name is required');
  if (!c.recipient.nickname.trim()) errors.push('recipient.nickname is required');
  if (!c.sender.name.trim()) errors.push('sender.name is required');
  if (c.recipient.nickname.length > 24) warnings.push('recipient.nickname is over 24 characters; layouts will shrink text');
  if (c.recipient.age !== undefined && !(Number.isInteger(c.recipient.age) && c.recipient.age >= 1 && c.recipient.age <= 120))
    errors.push('recipient.age must be a whole number from 1 to 120, or omitted');

  const ids = new Set<string>();
  for (const p of c.photos) {
    if (ids.has(p.id)) errors.push(`photos: duplicate id "${p.id}"`);
    ids.add(p.id);
    if (!p.alt.trim()) errors.push(`photos.${p.id}.alt is required`);
    if (p.focalPoint && (p.focalPoint.x < 0 || p.focalPoint.x > 1 || p.focalPoint.y < 0 || p.focalPoint.y > 1))
      errors.push(`photos.${p.id}.focalPoint must be between 0 and 1`);
  }
  if (c.heroPhotoId && !ids.has(c.heroPhotoId)) errors.push('heroPhotoId does not match any photo');
  if (c.sharePhotoId) {
    const sp = c.photos.find((p) => p.id === c.sharePhotoId);
    if (!sp) errors.push('sharePhotoId does not match any photo');
    else if (!sp.allowShare) errors.push('sharePhotoId points to a photo with allowShare=false; it will not be exported');
  }

  if (c.memories.length !== 3) errors.push('exactly 3 memories are required');
  for (const m of c.memories) {
    if (m.teaser && m.teaser.length > 70) warnings.push(`memories.${m.id}.teaser is over 70 characters`);
    if (!m.photoId) issue(`memories.${m.id}.photoId is missing (the flip cards are photo-only)`);
    else if (!ids.has(m.photoId)) errors.push(`memories.${m.id}.photoId does not match any photo`);
  }

  const words = wordCount(c.letter.paragraphs.join(' '));
  if (c.letter.paragraphs.length === 0) errors.push('letter.paragraphs is empty');
  if (words < 120 || words > 220) warnings.push(`letter is ${words} words; 120 to 220 is recommended (scrolling is allowed)`);

  if (c.surprise && !surpriseIsValid(c)) warnings.push('surprise is incomplete or unconfirmed; the panel will be hidden');
  if (c.media) {
    if (c.media.voiceNoteSrc && !c.media.transcript) issue('media.transcript is required with a voice note');
    if (c.media.videoSrc && !c.media.captionsSrc) issue('media.captionsSrc is recommended with a video', false);
  }
  if (c.features.music && !c.media?.musicSrc) warnings.push('features.music is on but media.musicSrc is missing; the sound toggle will be hidden');

  for (const [path, s] of collectStrings(c)) {
    if (hasForbiddenDash(s)) warnings.push(`${path} contains the forbidden long dash; it will be converted to a hyphen`);
    if (prod && PLACEHOLDER_RE.test(s)) errors.push(`${path} still contains a [placeholder]`);
  }
  return { errors, warnings };
}
