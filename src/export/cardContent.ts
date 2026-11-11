import type { BirthdayConfig } from '../content/types';
import { defaultTreat, treats, type StyleId } from '../content/copy';

export type CardContent = {
  style: StyleId;
  headline: string[];
  supporting: string[];
  details: string[];
  badge?: string;
  signoff?: string;
  /** Plain description for assistive tech. */
  altText: string;
};

/**
 * Everything the keepsake may say. It deliberately reads only names and the selected treat:
 * never the letter, memories, surprise or media.
 */
export function buildCardContent(config: BirthdayConfig, style: StyleId, treatId?: string): CardContent {
  const nick = config.recipient.nickname;
  const him = config.sender.name;
  const treat = (treatId && treats[treatId]) || defaultTreat;
  let c: CardContent;
  if (style === 'romantic') {
    c = {
      style,
      headline: ['The world got you.', 'I got lucky.'],
      supporting: [
        `Happy Birthday, ${nick}.`,
        `Here's to ${treat.agenda}, and everything this year has waiting for you.`,
        `With all my love, ${him}.`,
      ],
      details: [],
      altText: '',
    };
  } else if (style === 'funny') {
    c = {
      style,
      headline: ['Another year of being iconic.'],
      supporting: [`Happy Birthday, ${nick}.`],
      details: ['Cake: non-negotiable', 'Good company: guaranteed', 'Being loved: always'],
      badge: treat.badge,
      signoff: `With love, ${him}`,
      altText: '',
    };
  } else {
    c = {
      style,
      headline: [`Happy Birthday, ${nick}.`],
      supporting: ['My favourite person, today and always.'],
      details: [],
      signoff: `Love, ${him}`,
      altText: '',
    };
  }
  c.altText = [...c.headline, ...c.supporting, ...c.details, c.badge ? `Treat: ${c.badge}` : '', c.signoff ?? '']
    .filter(Boolean)
    .join(' ');
  return c;
}

/** Only a photo explicitly marked allowShare and selected as the share photo may be exported. */
export function resolveSharePhoto(config: BirthdayConfig) {
  if (!config.sharePhotoId) return undefined;
  const p = config.photos.find((x) => x.id === config.sharePhotoId);
  return p && p.allowShare ? p : undefined;
}

export function cardFileName(style: StyleId): string {
  return `birthday-card-${style}.png`;
}
