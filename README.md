# A Little Birthday Universe, Just for You

A mobile-first, click-only birthday gift site. Six scenes, three keepsake styles, real PNG export. No backend, login, analytics or tracking.

## Run

```bash
npm install
npm run dev        # local dev server
npm test           # unit + journey tests
npm run build      # validates config, type-checks, builds to dist/
npm run preview    # serve dist/ locally
```

## Edit the content

Everything personal is in **one file: `src/content/birthday.config.ts`**.

- `mode: 'preview'` allows bracketed placeholders and builds fine.
- `mode: 'production'` makes `npm run build` fail while any placeholder, missing caption, bad photo reference, or missing voice-note transcript remains.
- The three flip cards are photo-only (a decorative cover, then the selfie, no text). Each `memories` entry just needs a `photoId`.
- Replace the letter with the approved message. Do not invent memories.
- `surprise` is hidden unless `confirmed: true` with a title and description. Leave it `undefined` if there is no real surprise.
- The long dash character (U+2014) is converted to " - " at render time, and flagged as a validation warning.

## Replace assets

1. Put photos in `public/assets/photos/` (compressed, about 1200px wide) and list them in `photos` with alt text.
2. The envelope shows a 3D rose bouquet. `heroPhotoId` (optional) only adds a polaroid in the gift scene. `sharePhotoId` is optional.
3. **Only a photo with `allowShare: true` that is also `sharePhotoId` is ever drawn on the exported card.** Otherwise the card is photo-free.
4. Use `focalPoint` (0 to 1) so faces are not cropped.
5. Audio goes in `public/assets/audio/`, video in `public/assets/video/`. Music is off by default and only starts after the sound toggle is pressed. Voice notes need a `transcript`; videos should have a captions file.

## Background music

`public/assets/audio/romantic-piano.mp3` is an original 90 second instrumental (soft piano and strings) generated with ElevenLabs Music v2.5 through Higgsfield, so there are no third-party song rights to clear. It is off by default, starts only when she taps **Sound: off**, loops quietly, and pauses while a voice note or video plays. To swap it, replace the file (keep it under about 3 MB) or change `media.musicSrc`. To remove music, set `features.music: false`.

## Deploy on Vercel

`vercel.json` is already set up (Vite preset, `dist` output, noindex and security headers, long caching for hashed assets). `public/robots.txt` disallows crawlers.

1. Put this folder in its own Git repository and push it to GitHub, GitLab or Bitbucket (the folder currently sits inside a larger repo; run `git init` inside it, or copy it out).
2. On vercel.com choose **Add New, Project**, import the repository, and keep the detected settings: Framework **Vite**, Build command `npm run build`, Output directory `dist`. No environment variables are needed.
3. Click **Deploy**. You get a `*.vercel.app` link to send her.
4. Optional: in **Project Settings, Deployment Protection** you can add Vercel Authentication or a password (Pro plan). Leave it off for the recipient to open the link without signing in.
5. Optional: add a custom domain under **Settings, Domains**.

Alternative without Git: `npm i -g vercel`, then run `vercel` and later `vercel --prod` in this folder.

Before sharing: swap in photos and captions, set `mode: 'production'`, and confirm `npm run build` passes locally. Preview deployments (non-main branches) get their own links; delete them if they hold private photos.

## Privacy limits

- This is **link-only, not secure**. Anyone with the link, or the address of an asset, can open it. `noindex` only discourages search engines.
- The identity screen is playful, not authentication. If real access control is needed, add it before deploying.
- Choices live in memory only. A refresh restarts the journey. Nothing is stored, sent or logged.
- The keepsake card never contains the letter, memories, surprise details or navigation.
- Social preview metadata is generic (no photos or names).
- No external fonts or scripts. Fonts are bundled locally via Fontsource.

## Takedown

Delete the files from `public/assets/` (and `dist/assets/` on the host), then redeploy or unpublish the site. Cached copies may persist briefly on CDNs and in browsers, so purge the CDN cache if the host has one.

## Structure

```
src/content/birthday.config.ts   personalization (the one file to edit)
src/content/copy.ts              approved scene copy and choice reactions
src/state/journey.ts             reducer / state machine
src/scenes/                      the seven scenes
src/export/                      card content, text layout, canvas renderer
src/validation/                  config validation and dash rule
tests/                           vitest suites
```
