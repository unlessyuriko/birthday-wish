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
    /** Natural size in pixels. Lets the flip cards match each photo's proportions so nothing is cropped. */
    width?: number;
    height?: number;
    focalPoint?: { x: number; y: number };
  }>;
  heroPhotoId?: string;
  sharePhotoId?: string;
  /** Photo-only flip cards. Each needs a photo (the front is a decorative cover, no text on the back). */
  memories: Array<{ id: string; photoId?: string; /** Short romantic line on the card cover, shown before flipping. */ teaser?: string }>;
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
  features: { music: boolean };
};
