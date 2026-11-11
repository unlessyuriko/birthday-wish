# Product Requirements Document
# A Little Birthday Universe, Just for You

Version: 1.0
Status: Ready for implementation with configurable placeholder content
Deliverable: A mobile-first, click-only birthday gift website

## 1. Instructions for the AI coding tool

Build the complete working website described in this document, not just a landing page or static mockup. Implement all seven scenes, choice reactions, photo flips, candle interaction, heartfelt reveal, and downloadable birthday cards.

Use the requirements and copy below as the source of truth. Do not invent personal facts, real bookings, relationship memories, or gifts. Keep missing personal details in a clearly structured content configuration. Ask the project owner the questions in Section 4 before final personalization. If answers are unavailable, proceed with a working preview using explicit placeholders and neutral sample copy. Do not block the technical implementation on missing assets.

Mandatory writing rule: Do not use the em dash character, Unicode U+2014, anywhere in the UI. This includes visible text, accessible labels, error messages, image alternative text, generated cards, metadata, and dynamically generated content. Use periods, commas, colons, parentheses, or ordinary hyphens instead. Apply the same rule to supplied client content before rendering, without silently changing its meaning.

Do not add a login, text input, quiz score, microphone prompt, camera prompt, account creation, checkout, analytics, or backend unless explicitly requested later.

## 2. Product vision

Create a small interactive birthday gift from a boyfriend to his girlfriend. The recipient should feel that the experience was made specifically for her. The emotional journey is curiosity, laughter, recognition, affection, celebration, and a keepsake worth sharing.

The experience must feel like opening a thoughtful gift, not completing a questionnaire. Every choice leads to affection. There are no wrong answers, punishments, forced romantic commitments, or blocked paths.

### Success criteria

- The main journey takes approximately 2 to 3 minutes at a relaxed pace, excluding optional audio or video.
- The recipient never needs to type, sign in, grant permissions, or install an app.
- Every visible button performs its stated action.
- The experience includes specific personal content when supplied by the client.
- The final birthday card can be downloaded as an actual PNG image.
- Private messages and surprise plans never appear in the public keepsake unless explicitly approved.
- The website is usable on a 320 CSS pixel wide screen without horizontal scrolling.
- The complete journey works with sound disabled and reduced motion enabled.

## 3. Audience and scope

### Primary user

The birthday recipient opening a link on her phone, possibly through a messaging app's browser.

### Secondary users

- The boyfriend supplying content before launch.
- The project owner configuring, reviewing, and deploying the website.

### Included in version 1

- Seven connected scenes.
- Three playful identity choices.
- Three preference cards with unique reactions.
- Three memory cards with tap-to-flip behavior.
- Tap-based birthday candles.
- A playful application approval scene.
- Personal message and optional media or confirmed surprise.
- Three birthday keepsake styles with PNG export.
- Optional background music, off by default.
- Replay and back navigation.
- One optional post-finale emergency compliments feature.

### Not included

- User accounts or real authentication.
- A client content management system or admin dashboard.
- A database, tracking, or server-side choice collection.
- Real reservations, purchases, or gift fulfillment.
- Automatic social media posting.
- AI-generated personal messages at runtime.
- Required dragging, scratching, shaking, blowing, or device motion.
- An automatic birthday countdown or timed unlock.

## 4. Questions to ask the project owner

Ask these in one concise batch before final personalization. The recipient must never see this questionnaire.

1. What are her preferred name and nickname, his preferred name, and the birthday date? Is her age allowed to appear? Default: omit age.
2. Should the site be English only, Burmese only, or bilingual? Default: English. If bilingual, request approved translations and appropriate font assets.
3. Can you provide 3 to 6 approved photos, identify the hero photo, and specify which photos may appear on a shareable card?
4. What are three specific things he loves about her, one shared memory, and one inside joke? Do not fabricate answers.
5. What exact birthday message should appear? Should the suggested draft in this document be used as a starting point?
6. Is there a real gift, dinner, or other confirmed surprise? If yes, what exact details may be shown privately?
7. Will he provide a voice note, short video, or music file that he has permission to use? Default: no media and no music.
8. Is the relationship joke appropriate, and are there any sensitive jokes, nicknames, photos, or topics to avoid?
9. What hosting environment or existing codebase should be used? Is link-only access sufficient, or is genuine access control required?
10. Which visual direction does she prefer? Default: cream, strawberry pink, cherry red, and a handmade scrapbook feel.

If genuine access control is required, pause deployment and agree on an authentication approach. A hidden link, no-index setting, or playful identity screen is not security.

## 5. Creative and visual direction

### Concept

A Little Birthday Universe, Just for You.

A handmade digital scrapbook with a recurring tiny bear messenger. The bear carries the opening envelope, presents the cake, and delivers the gift. Use the mascot sparingly so it supports the couple's story rather than dominating it.

### Design language

- Warm cream paper backgrounds.
- Strawberry pink surfaces and cherry-red primary actions.
- Dark cocoa text with sufficient contrast.
- Small bows, heart stickers, paper edges, and photo corners.
- Soft shadows and gently tilted photo cards.
- Rounded buttons with clear pressed and focus states.
- A readable body font and a restrained handwritten accent font.
- Use local assets and local font files where possible.
- No generic corporate dashboard appearance, neon gradients, or excessive floating hearts.

### Suggested design tokens

- Background: #FFF8F0
- Surface: #FFFFFF
- Soft pink: #FCE4EC
- Primary: #B52346
- Primary pressed: #8F1836
- Text: #38252B
- Muted text: #70565F
- Decorative gold: #D9AA58, not for small body text
- Border radius: 20 to 28 pixels for cards, pill shape for primary buttons
- Body text: at least 16 pixels
- Tap targets: at least 44 by 44 pixels

Verify contrast for every actual foreground and background pairing. Do not assume decorative colors are suitable for text.

### Motion

- Scene transitions: subtle fade and small vertical movement.
- Card flips: short, readable, and reversible.
- Confetti: one short burst after candles, no endless animation.
- No automatic scene advancement or text disappearing before it can be read.
- Respect prefers-reduced-motion by removing flips, floating motion, and confetti while preserving state changes.

## 6. Navigation and interaction rules

- Show one main scene at a time.
- Provide a subtle progress indicator such as "A little surprise, 2 of 7".
- Use a clear primary action on every scene.
- Provide Back after the opening scene. Preserve earlier choices when navigating back.
- After a choice, show its reaction and a Continue button. Do not immediately skip past the reaction.
- Allow changing a choice before continuing.
- Memory cards are optional to open. Never require all cards to be flipped.
- The recipient controls the pace throughout.
- Move keyboard focus to the new scene heading after navigation.
- Announce choice reactions politely to screen readers.
- Keep all actions usable with touch, mouse, and keyboard.
- Avoid horizontal swipe-only interactions. Provide tap controls.

## 7. Scene-by-scene requirements and approved default copy

All bracketed values are configuration placeholders, not literal production UI. Hide optional lines when their content is missing.

### Scene 1: Special delivery

Visual: A sealed envelope with her nickname and a tiny bear messenger.

Heading: "Special delivery for the birthday girl"

Body:
"Someone asked me to deliver a suspicious amount of love today."
"Before I hand it over... who's opening this?"

Choices and reactions:

| Choice | Reaction |
| --- | --- |
| The birthday girl | There she is. The reason for this entire app. |
| The world's cutest girl | Identity confirmed. Confidence also confirmed. |
| Just a random visitor | Nice try, birthday girl. Your surprise is right here. |

All choices reveal the envelope-opening action. No choice verifies identity.

Button: "Open my envelope"

Inside the envelope:
"Happy Birthday, [Nickname]."
"I made you a little something."
"Okay... I may have got carried away."

Next button: "Let me see"

### Scene 2: Today's very important decisions

Show three preference cards one at a time, with a small indicator such as "Decision 1 of 3". These are preferences, not a scored quiz.

#### Card 1

Question: "Birthday date mood?"

| Choice | Reaction |
| --- | --- |
| A cosy dinner | Excellent. I'll bring the compliments. |
| A little adventure | You pick the direction. I'll be happy next to you. |

#### Card 2

Question: "What do you need right now?"

| Choice | Reaction |
| --- | --- |
| A hug | One extra-long hug has been added to your birthday. |
| A kiss | Very good choice. Possibly my favourite. |
| A present | I admire a woman who knows her priorities. |
| Cake | Finally. Someone taking this birthday seriously. |

#### Card 3

Question: "Who's getting spoiled today?"

| Choice | Reaction |
| --- | --- |
| Me | Correct. |
| Obviously me | Correct, with excellent confidence. |
| Is this even a question? | Honestly, no. |

Store selected IDs in local application state. Use the selected treat to personalize the keepsake. Do not imply that selecting dinner or adventure creates a booking or promises an unconfirmed gift.

### Scene 3: Evidence that you're my favourite person

Heading: "Evidence that you're my favourite person"

Instruction: "Tap a little memory."

Three cards:

1. "A moment I'd happily repeat."
2. "A tiny thing about you I love."
3. "My favourite kind of ordinary day."

Each card has an approved photo or a local illustrated keepsake on the front and a short client-supplied caption on the back. Tapping again reverses it. Keep captions to one or two sentences.

Do not invent memories. Preview mode may show a clearly labeled neutral placeholder. Production validation must flag missing personal captions.

Fallback if no photos are provided: use illustrated coffee cups, cinema tickets, or similar keepsakes only when relevant details are confirmed. Otherwise use neutral decorative stationery.

Continue button: "A birthday wish next"

### Scene 4: A tiny cake, a very big wish

Heading: "A tiny cake. A very big wish."

Body:
"Okay, birthday girl."
"Close your eyes for a moment."
"Make a wish. Keep it yours."

Button: "I made my wish"

After the button is clicked:
"Tap the candles when you're ready."

Provide one accessible candle action that extinguishes all candles. Do not require precise tapping of tiny flames.

After candle activation:
- Extinguish candles.
- Show one short confetti burst, unless reduced motion is enabled.
- Show the message below.

"I hope it comes true."
"And I hope this year gives you so many reasons to smile."

Next button: "There's a little more"

No microphone, countdown, forced delay, or typed wish.

### Scene 5: Birthday person application

Heading: "One more birthday with you?"

Question: "Can I apply to be your birthday person again next year?"

Buttons:
- "You're hired"
- "What are your qualifications?"

Qualifications reveal:
"Application attached:"
- "Enthusiastic about you"
- "Available for snack runs"
- "Will take approximately 47 photos until you like one"
- "Still very, very into you"

Approval button: "Application approved"

Approval reaction: "Best news I've had all day."

Provide a quiet "Keep opening my birthday gift" action that continues without approval. Do not make affection or access to the surprise conditional on agreeing to date him.

No runaway buttons in version 1.

If the client disables this scene's relationship joke, replace its content with a simple birthday privileges card and retain the same scene position.

### Scene 6: This part is from me

Heading: "Okay. This part is from me."

Visual: A small gift box with a clear "Open your surprise" button.

On opening, reveal the personal message. If optional audio or video exists, display explicit playback controls. Never autoplay a voice note or video.

Suggested draft message, pending client approval:

"Happy Birthday, my love.

I love the big moments with you, but I think my favourites are the little ones. The random conversations, the silly jokes, and the days when we're not doing anything special, but I'm happy because you're there.

I hope this year brings you things you've been quietly wishing for. I'll be here, cheering you on and finding new ways to make you smile.

Today is yours. I'm just very lucky to be part of it."

Sign-off: "Love, [His Name]"

Optional confirmed surprise panel:
- Title
- Description
- Date, time, and location only if supplied and approved
- No fabricated reservation confirmation

If no surprise details exist, the personal message is the surprise. Do not render an empty gift section.

Next button: "There's one little keepsake left"

### Scene 7: Made for you

Heading: "Made for you. Worth showing off."

Show a clean birthday card preview and three selectable styles. Changing styles updates the preview without losing selections.

#### Style A: Soft and romantic

Headline:
"The world got you."
"I got lucky."

Supporting copy:
"Happy Birthday, [Nickname]."
"Today's agenda: [Selected Treat], and being ridiculously loved."
"Made just for you, by [His Name]."

#### Style B: Cute and funny

Headline: "Birthday girl privileges: activated."

Details:
- "Cake: required"
- "Hugs: unlimited"
- "Being loved: ongoing"

Include the selected treat as a small decorative badge.

#### Style C: Minimal and elegant

Headline: "Happy Birthday, [Nickname]."

Supporting line: "My favourite person. Today and every day."

Sign-off: "Love, [His Name]"

Actions:
- "Save my birthday card"
- "Replay my surprise"
- "Emergency compliments", if enabled

The card itself must not include navigation, progress indicators, download controls, private letter text, private plans, or developer branding.

If no approved shareable photo exists, use a polished photo-free layout. Never reuse a private-only photo for export.

## 8. Optional delight: Emergency compliments

Available only after reaching the finale. Disabled until at least three approved compliments are configured.

Each click reveals the next compliment. Use a finite list and wrap around after the final item. Avoid immediate duplicates.

One allowed generic line: "Yes, I made a whole app for you."

Other compliments should come from the client and be specific, affectionate, and comfortable for the recipient. No appearance scoring or sensitive jokes by default.

## 9. Personalization configuration

Keep all content separate from components in one typed configuration module. Use stable IDs rather than visible labels as state values.

Suggested configuration shape:

```ts
type BirthdayConfig = {
  mode: 'preview' | 'production';
  recipient: {
    name: string;
    nickname: string;
    birthdayLabel?: string;
    age?: number;
  };
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
  memories: Array<{
    id: string;
    title: string;
    caption: string;
    photoId?: string;
  }>;
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
  features: {
    relationshipJoke: boolean;
    emergencyCompliments: boolean;
    music: boolean;
  };
};
```

Validate referenced photo IDs, required fields, text lengths, allowed age values if supplied, and forbidden punctuation. Render client content as text, not raw HTML.

Suggested content limits:
- Nickname: 24 characters before responsive handling is required.
- Memory caption: 220 characters recommended.
- Keepsake headline: 90 characters recommended.
- Letter: 120 to 220 words recommended, with scrolling allowed.

Never truncate meaningful content silently. Wrap long names and allow sensible font reduction within readable limits. Warn the project owner about overflow during validation.

## 10. Technical implementation defaults

These are implementation recommendations, not mandatory external service dependencies.

- Use React, TypeScript, and Vite for a new standalone project.
- If an existing codebase is provided, follow its conventions instead of replacing its stack.
- Use CSS variables for design tokens and lightweight CSS transitions.
- Use a small explicit state machine or reducer for scene navigation.
- Use local static assets and a static hosting deployment.
- No backend is needed for the default scope.
- Avoid heavy animation libraries unless already present and justified.
- Keep personal data out of analytics, console logs, URLs, and error telemetry.

Suggested structure:

```text
src/
  components/
  scenes/
  content/birthday.config.ts
  state/journey.ts
  export/renderBirthdayCard.ts
  styles/
  validation/
public/
  assets/photos/
  assets/illustrations/
  assets/audio/
  assets/video/
  assets/fonts/
tests/
README.md
```

### State

Track current scene, preference card index, selected choice IDs, opened memories, wish readiness, candle state, application state, gift reveal state, selected card style, and audio state.

Use in-memory state by default. Refresh restarts the journey. Do not persist private content or choices in browser storage unless explicitly approved.

Back navigation must not duplicate effects. Replay resets journey state and pauses media. Keep the user's current sound preference during an in-session replay. Stop any ongoing speech or video before replay.

### Audio and video

- Background music is off by default.
- Start playback only after an explicit user action.
- Show a persistent, labeled sound toggle if music is configured.
- Pause background music while voice or video plays.
- Resume music only if the user had enabled it.
- Handle blocked playback and missing media gracefully.
- Provide transcripts for voice notes and captions for meaningful video speech.
- Missing media must not prevent progression.

## 11. Keepsake export requirements

This is a core feature, not a decorative button.

- Export a real PNG at 1080 by 1920 pixels, a 9:16 portrait format.
- Use a dedicated card renderer rather than a screenshot of the full website.
- Keep critical text and faces comfortably inside the card, with approximately 120 pixels of top and bottom breathing room and at least 72 pixels at the sides.
- Use the selected style, approved share photo, recipient name, sender name, and selected treat.
- Render multiline text with proper wrapping and predictable typography.
- Use local or same-origin images and fonts to avoid export failures.
- Wait for image decoding and font readiness before enabling export.
- Use explicit photo focal points to avoid cropping faces.
- Avoid relying on emoji glyphs for essential exported artwork. Prefer bundled illustrations for predictable output.
- Generate the image with a canvas renderer or another reliable local export method.
- Ensure the exported card matches the preview in content and layout.
- Disable repeated export clicks while rendering and show "Preparing your card...".
- On success, download a safely named file such as birthday-card-romantic.png.
- Where browser download behavior is limited, show the generated image with instructions to save it. Do not claim it was saved to the photo library.
- An optional native share action may be added only when supported, and only after a user click. Download remains available.
- If export fails, show a clear retry action and preserve the journey state.
- Release generated object URLs after use when safe.

## 12. Privacy and content safety

- Default deployment is link-only, not authenticated.
- Explain to the project owner that deployed static assets can be accessed by anyone with the link or asset address.
- No-index metadata can discourage indexing but does not protect private content.
- Use generic social preview metadata by default, without private photos or relationship details.
- Do not include private messages or surprise plans in share cards or public metadata.
- Obtain permission for photos and media. Use only supplied or appropriately licensed assets.
- Do not collect the recipient's answers or send them anywhere.
- Do not add tracking pixels, third-party embeds, or external font calls by default.
- No API keys or secrets in frontend code.
- Provide an asset removal and deployment takedown note in the README.

## 13. Accessibility and responsive behavior

- Semantic headings, buttons, and grouped choices.
- Visible focus states and keyboard operation for all interactions.
- No meaning communicated by color alone.
- Readable text contrast and support for browser zoom.
- Accessible names for icon-only controls.
- Meaningful alternative text for photos, empty alternative text for purely decorative art.
- Use aria-pressed or equivalent state for selectable options.
- Announce reactions and export status without excessive screen-reader chatter.
- Avoid inaccessible 3D back-face content. Only the visible memory-card face should be exposed to assistive technology.
- Respect reduced motion and avoid flashing effects.
- Do not lock content into a fixed-height viewport. Allow vertical scrolling on small screens and with enlarged text.
- Account for mobile safe areas and browser chrome.
- On desktop, keep the experience intimate and centred rather than stretching cards across the full width.

## 14. Loading, performance, and failure states

- Load the opening scene first and lazy-load later media.
- Use responsive compressed photos with explicit dimensions.
- Aim for an initial compressed JavaScript budget below 250 KB, excluding optional media. Measure and report actual build size.
- Do not preload a large video on first load.
- Reserve image space to avoid layout jumps.
- Missing photos fall back to a polished stationery illustration.
- Missing music hides music controls.
- Missing voice or video hides its player.
- Invalid surprise configuration hides the surprise panel and reports a configuration warning to the project owner.
- Prevent rapid repeated clicks from advancing multiple scenes or duplicating confetti.
- Clean up timers, media listeners, and animations when scenes unmount.
- No fake loading delays or artificial waiting screens.

## 15. Acceptance tests

### Journey

- Each of the three identity choices reaches the same envelope with its own reaction.
- Every preference option shows the correct reaction.
- Changing a preference updates the selected state and later keepsake.
- Back navigation preserves previous selections.
- All memory cards flip using tap and keyboard.
- The recipient can continue without opening every memory.
- Candles cannot extinguish before the wish-ready action.
- Candle activation works without permissions and fires celebration only once.
- Both approval paths and the neutral continue path reach the gift.
- Missing optional media or surprise details do not create empty sections.
- Replay resets the journey and stops media.

### Export

- All three styles generate a valid 1080 by 1920 PNG.
- The exported card contains no navigation or private letter content.
- A private-only photo is never used for export.
- Long names and captions do not clip or overlap.
- Missing share photos produce a complete photo-free card.
- Export failure shows a retry option without losing state.
- Test actual downloads on desktop and mobile browsers, including at least one messaging app browser when available.

### Accessibility and quality

- Complete the journey using keyboard only.
- Complete the journey with sound off.
- Complete the journey with reduced motion enabled.
- Test at 320, 375, 390, 768, and 1440 CSS pixels wide.
- Test at 200 percent zoom without losing actions or content.
- Check current Safari on iOS, Chrome on Android, and desktop Chrome and Safari where available.
- Check that visible controls, exported card text, metadata, accessible labels, and configured content contain no Unicode U+2014 characters.
- Add an automated punctuation validation test using the escaped code point, not a literal forbidden character.
- Validate all production placeholders are resolved or intentionally hidden.
- Check for console errors, broken assets, duplicate event handlers, and horizontal overflow.

## 16. Implementation order

1. Inspect the existing project if supplied and ask the Section 4 questions.
2. Create the typed content configuration, validation, and preview mode.
3. Build the complete seven-scene functional flow.
4. Implement responsive styling and reusable visual components.
5. Implement photo cards, candle states, and optional media.
6. Implement all three keepsake previews and actual PNG export.
7. Add optional emergency compliments only after the core journey works.
8. Add automated tests and run manual accessibility and mobile checks.
9. Replace placeholders with approved client content.
10. Run production validation and document deployment and removal steps.

## 17. Required handover

Deliver:
- Complete runnable source code.
- Dependency lockfile and clear run/build commands.
- A README covering setup, content editing, asset replacement, deployment, privacy limitations, and takedown.
- A single clearly identified personalization configuration file.
- Automated tests for journey state, export content, configuration validation, and the forbidden punctuation rule.
- A short test report stating what was actually tested and what remains unverified.
- A production build without unresolved required placeholders.

Do not claim that a feature, browser, or download path has been tested unless it was actually tested.

## 18. Definition of done

The website is done when it feels personal, playful, and emotionally complete, all seven scenes work, the recipient never needs to type, all three keepsake styles export correctly, private content stays off the keepsake, the layout works on phones, and the no-em-dash rule passes across all user-facing surfaces.
