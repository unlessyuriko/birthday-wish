export type Option = { id: string; label: string; reaction: string };

export const identityOptions: Option[] = [
  { id: 'birthday-girl', label: 'The birthday girl', reaction: 'There she is. The reason for this entire app.' },
  { id: 'cutest-girl', label: "The world's cutest girl", reaction: 'Identity confirmed. Confidence also confirmed.' },
  { id: 'random-visitor', label: 'Just a random visitor', reaction: 'Nice try, birthday girl. Your surprise is right here.' },
];

export type Decision = { id: 'dateMood' | 'need' | 'spoiled'; question: string; options: Option[] };

export const decisions: Decision[] = [
  {
    id: 'dateMood',
    question: 'Birthday date mood?',
    options: [
      { id: 'dinner', label: 'A cosy dinner', reaction: "Excellent. I'll bring the compliments." },
      { id: 'adventure', label: 'A little adventure', reaction: "You pick the direction. I'll be happy next to you." },
    ],
  },
  {
    id: 'need',
    question: 'What do you need right now?',
    options: [
      { id: 'hug', label: 'A hug', reaction: 'One extra-long hug has been added to your birthday.' },
      { id: 'kiss', label: 'A kiss', reaction: 'Very good choice. Possibly my favourite.' },
      { id: 'present', label: 'A present', reaction: 'I admire a woman who knows her priorities.' },
      { id: 'cake', label: 'Cake', reaction: 'Finally. Someone taking this birthday seriously.' },
    ],
  },
  {
    id: 'spoiled',
    question: "Who's getting spoiled today?",
    options: [
      { id: 'me', label: 'Me', reaction: 'Correct.' },
      { id: 'obviously-me', label: 'Obviously me', reaction: 'Correct, with excellent confidence.' },
      { id: 'is-this-a-question', label: 'Is this even a question?', reaction: 'Honestly, no.' },
    ],
  },
];

/** The treat chosen on decision 2, as used in the keepsake agenda line and badge. */
export const treats: Record<string, { badge: string; agenda: string }> = {
  hug: { badge: 'A hug', agenda: 'a hug' },
  kiss: { badge: 'A kiss', agenda: 'a kiss' },
  present: { badge: 'A present', agenda: 'a present' },
  cake: { badge: 'Cake', agenda: 'cake' },
};
export const defaultTreat = treats.cake;

export const qualifications = [
  'Enthusiastic about you',
  'Available for snack runs',
  'Will take approximately 47 photos until you like one',
  'Still very, very into you',
];

export const privileges = ['Cake: required', 'Hugs: unlimited', 'Being loved: ongoing', 'Choosing the music: granted'];

export type StyleId = 'romantic' | 'funny' | 'minimal';
export const cardStyles: Array<{ id: StyleId; label: string; hint: string }> = [
  { id: 'romantic', label: 'Soft and romantic', hint: 'Dreamy and tender' },
  { id: 'funny', label: 'Cute and funny', hint: 'Playful privileges' },
  { id: 'minimal', label: 'Minimal and elegant', hint: 'Quiet and classic' },
];
