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
    { id: 'selfie-1', src: 'assets/photos/selfie-1.jpg', alt: 'A close selfie of the two of you smiling, cheek to cheek, with floral wallpaper behind.', allowShare: false, focalPoint: { x: 0.5, y: 0.4 } },
    { id: 'selfie-2', src: 'assets/photos/selfie-2.jpg', alt: 'A mirror selfie of the two of you in a softly lit hallway, with a phone covering part of your faces.', allowShare: false, focalPoint: { x: 0.52, y: 0.4 } },
    { id: 'selfie-3', src: 'assets/photos/selfie-3.jpg', alt: 'A smiling selfie of the two of you in front of a colourful painted mural.', allowShare: false, focalPoint: { x: 0.45, y: 0.4 } },
  ],
  // The envelope now shows a rose bouquet instead of a photo, so no hero photo is set.
  heroPhotoId: undefined,
  // Set to one of the photo ids (and its allowShare to true) only if the client agrees to a photo on the shareable card.
  sharePhotoId: undefined,

  // Photo-only flip cards, in order. The back shows just the selfie, with no text.
  memories: [
    { id: 'm1', photoId: 'selfie-1' },
    { id: 'm2', photoId: 'selfie-2' },
    { id: 'm3', photoId: 'selfie-3' },
  ],

  // Suggested draft, pending approval.
  letter: {
    paragraphs: [
      'Happy Birthday, my love.',
      "I love the big moments with you, but I think my favourites are the little ones. The random conversations, the silly jokes, and the days when we're not doing anything special, but I'm happy because you're there.",
      "I hope this year brings you things you've been quietly wishing for. I'll be here, cheering you on and finding new ways to make you smile.",
      "Today is yours. I'm just very lucky to be part of it.",
    ],
    signOff: 'Love, Mg',
  },

  // Only add if there is a real, confirmed surprise. Otherwise leave undefined.
  surprise: undefined,
  // surprise: { confirmed: true, title: '...', description: '...', dateLabel: '...', timeLabel: '...', locationLabel: '...' },

  // Files go in public/assets/audio and public/assets/video. Provide a transcript for voice notes.
  media: { musicSrc: 'assets/audio/romantic-piano.mp3' },

  // Need at least 3 to enable the Emergency compliments button.
  compliments: [
    'Yes, I made a whole app for you.',
    '[Add a specific, affectionate compliment.]',
    '[Add another specific, affectionate compliment.]',
  ],

  features: { emergencyCompliments: true, music: true },
};
