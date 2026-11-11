export type BirthdayConfig = {
  mode: 'preview' | 'production';
  recipient: { name: string; nickname: string; birthdayLabel?: string; age?: number };
  sender: { name: string };
  locale: string;
  photos: Array<{
    id: string;
    src: string;
    alt: string;
    allowShare: boolean;
    focalPoint?: { x: number; y: number };
  }>;
  heroPhotoId?: string;
  sharePhotoId?: string;
  memories: Array<{ id: string; title: string; caption: string; photoId?: string }>;
  letter: { paragraphs: string[]; signOff: string };
  surprise?: {
    confirmed: boolean;
    title: string;
    description: string;
    dateLabel?: string;
    timeLabel?: string;
    locationLabel?: string;
  };
  media?: {
    musicSrc?: string;
    voiceNoteSrc?: string;
    videoSrc?: string;
    transcript?: string;
    captionsSrc?: string;
  };
  compliments: string[];
  features: { relationshipJoke: boolean; emergencyCompliments: boolean; music: boolean };
};
