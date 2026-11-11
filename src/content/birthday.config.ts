/**
 * THE personalization file. Everything personal lives here.
 *
 * mode: 'preview'    uses neutral placeholders (bracketed values) and builds fine.
 * mode: 'production' fails `npm run build` while any placeholder or required field is unresolved.
 *
 * Keep the dash rule in mind: avoid the long dash character. It is converted to " - " at render time.
 */
import type { BirthdayConfig } from './types';

export const config: BirthdayConfig = {
  mode: 'preview',
  recipient: {
    name: 'Ma',
    nickname: 'Ma',
    birthdayLabel: undefined, // e.g. '12 March'. Leave undefined to hide.
    age: undefined, // Omitted by default.
  },
  sender: { name: 'Mg' },
  locale: 'en',

  // Photos live in public/assets/photos/. allowShare=false keeps a photo off the exported card.
  // focalPoint (0 to 1) keeps faces inside the crop.
  photos: [
    { id: 'selfie-1', src: 'assets/photos/selfie-1.jpg', alt: 'A close selfie of the two of you smiling, cheek to cheek, with floral wallpaper behind.', allowShare: false, width: 1000, height: 1333, focalPoint: { x: 0.5, y: 0.4 } },
    { id: 'selfie-2', src: 'assets/photos/selfie-2.jpg', alt: 'A mirror selfie of the two of you in a softly lit hallway, with a phone covering part of your faces.', allowShare: false, width: 933, height: 1400, focalPoint: { x: 0.52, y: 0.4 } },
    { id: 'selfie-3', src: 'assets/photos/selfie-3.jpg', alt: 'A smiling selfie of the two of you in front of a colourful painted mural.', allowShare: false, width: 1000, height: 1333, focalPoint: { x: 0.45, y: 0.4 } },
  ],
  // The envelope now shows a rose bouquet instead of a photo, so no hero photo is set.
  heroPhotoId: undefined,
  // Set to one of the photo ids (and its allowShare to true) only if the client agrees to a photo on the shareable card.
  sharePhotoId: undefined,

  // Flip cards, in order. The cover shows the romantic teaser line; the back shows just the whole selfie, with no text.
  memories: [
    { id: 'm1', photoId: 'selfie-1', teaser: 'Every moment with you is my favourite.' },
    { id: 'm2', photoId: 'selfie-2', teaser: 'You make ordinary days feel like magic.' },
    { id: 'm3', photoId: 'selfie-3', teaser: 'Still falling for you, every single day.' },
  ],

  // Approved message from the client.
  letter: {
    paragraphs: [
      'Happy Birthday, my love',
      'This is the first time I get to celebrate your birthday with you, and I hope it will be the first of many more birthdays together.',
      'I may not be able to give you everything in the world, but I promise to give you my love, care, and support every single day. I wish to be by your side, making you smile, holding your hand, and celebrating every birthday with you until the end of our lives.',
      'May all your wishes come true, and may your life always be filled with happiness and love.',
    ],
    signOff: 'Love, Mg',
  },

  // Only add if there is a real, confirmed surprise. Otherwise leave undefined.
  surprise: undefined,
  // surprise: { confirmed: true, title: '...', description: '...', dateLabel: '...', timeLabel: '...', locationLabel: '...' },

  // Files go in public/assets/audio and public/assets/video. Provide a transcript for voice notes.
  media: { musicSrc: 'assets/audio/romantic-piano.mp3' },

  features: { music: true },
};
