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
    name: '[Her Name]',
    nickname: '[Her Nickname]',
    birthdayLabel: undefined, // e.g. '12 March'. Leave undefined to hide.
    age: undefined, // Omitted by default.
  },
  sender: { name: '[His Name]' },
  locale: 'en',

  // Add photos to public/assets/photos/ and list them here. allowShare=false keeps a photo off the exported card.
  photos: [
    // { id: 'p1', src: 'assets/photos/p1.jpg', alt: 'Describe the photo', allowShare: true, focalPoint: { x: 0.5, y: 0.4 } },
  ],
  heroPhotoId: undefined,
  sharePhotoId: undefined,

  memories: [
    { id: 'm1', title: "A moment I'd happily repeat.", caption: '[Add a real caption for this memory.]' },
    { id: 'm2', title: 'A tiny thing about you I love.', caption: '[Add a real caption for this memory.]' },
    { id: 'm3', title: 'My favourite kind of ordinary day.', caption: '[Add a real caption for this memory.]' },
  ],

  // Suggested draft, pending approval.
  letter: {
    paragraphs: [
      'Happy Birthday, my love.',
      "I love the big moments with you, but I think my favourites are the little ones. The random conversations, the silly jokes, and the days when we're not doing anything special, but I'm happy because you're there.",
      "I hope this year brings you things you've been quietly wishing for. I'll be here, cheering you on and finding new ways to make you smile.",
      "Today is yours. I'm just very lucky to be part of it.",
    ],
    signOff: 'Love, [His Name]',
  },

  // Only add if there is a real, confirmed surprise. Otherwise leave undefined.
  surprise: undefined,
  // surprise: { confirmed: true, title: '...', description: '...', dateLabel: '...', timeLabel: '...', locationLabel: '...' },

  // Files go in public/assets/audio and public/assets/video. Provide a transcript for voice notes.
  media: undefined,

  // Need at least 3 to enable the Emergency compliments button.
  compliments: [
    'Yes, I made a whole app for you.',
    '[Add a specific, affectionate compliment.]',
    '[Add another specific, affectionate compliment.]',
  ],

  features: { relationshipJoke: true, emergencyCompliments: true, music: false },
};
