export type Option = { id: string; label: string; reaction: string };

export type GateQuestion = {
  id: string;
  question: string;
  yesLabel: string;
  noLabel: string;
  /** What the runaway No says each time it escapes. Its length is how many escapes it makes. */
  taunts: string[];
  /** Label on the No once it gives up. Pressing it counts as yes. */
  giveUpLabel: string;
  yesReaction: string;
  caughtReaction: string;
};

/** The playful opening checks. There is no wrong answer: both buttons lead on. */
export const gateQuestions: GateQuestion[] = [
  {
    id: 'birthday-girl',
    question: 'Are you the birthday girl?',
    yesLabel: "Yes, that's me",
    noLabel: 'No',
    taunts: ['Nice try.', 'Too slow!', 'Wrong answer, birthday girl.'],
    giveUpLabel: 'Okay, fine. Yes.',
    yesReaction: 'There she is. The reason for this entire app.',
    caughtReaction: 'Identity confirmed. Confidence also confirmed.',
  },
  {
    id: 'licence',
    question: 'Your Favourite Person licence is valid until: forever. Renew it?',
    yesLabel: 'Renew it',
    noLabel: 'No',
    taunts: ['Renewal is not optional.', 'I have the forms right here.', 'That button is not for you.'],
    giveUpLabel: 'Fine, renew it',
    yesReaction: 'Licence renewed. No refunds.',
    caughtReaction: 'Licence renewed. Still no refunds.',
  },
  {
    id: 'ready',
    question: 'Are you ready for a suspiciously large amount of love?',
    yesLabel: "I'm ready",
    noLabel: 'Not ready',
    taunts: ['Too late, it is already loaded.', 'The love is non-refundable.', 'Bold of you to try.'],
    giveUpLabel: "Okay, I'm ready",
    yesReaction: 'Excellent. Handing it over now.',
    caughtReaction: 'Wise decision. Handing it over now.',
  },
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

export type StyleId = 'romantic' | 'funny' | 'minimal';
export const cardStyles: Array<{ id: StyleId; label: string; hint: string }> = [
  { id: 'romantic', label: 'Soft and romantic', hint: 'Dreamy and tender' },
  { id: 'funny', label: 'Playful and chic', hint: 'Witty and bold' },
  { id: 'minimal', label: 'Minimal and elegant', hint: 'Quiet and classic' },
];
