# Test report

Date: 2026-11-11. Mode: preview (placeholder content).

## Actually tested
- `npm test`: 30 automated tests pass (state reducer, config validation, keepsake content and privacy, text wrapping, forbidden U+2014 rule on src/tests, full click-through of the app in jsdom including Back and Replay).
- `npm run build`: passes. JS is 174.7 kB raw, 56.6 kB gzip (budget 250 kB). Fonts and CSS are separate.
- Desktop Chrome (headless, via Playwright) at 320 px wide: full 7-scene journey by clicks only, no console errors, no horizontal scroll on scenes 1, 3, 5, 6, 7.
- All three styles produced real downloads named birthday-card-romantic/funny/minimal.png, verified as PNG, 1080 by 1920. Romantic, funny and minimal outputs were viewed (photo-free layout).
- Memory flip shows the caption face; with reduced motion on, flip is a plain swap and no confetti element is rendered.

## Cross-browser matrix (added)
Full click-through plus horizontal-overflow check on all seven scenes, using Playwright engines on macOS: Chromium (Chrome), WebKit (Safari engine) and Firefox, at 320x568, 375x667, 390x844, 412x915, 768x1024, 1024x768, 1440x900 and 667x375 (landscape phone). PNG download was verified (1080x1920) on Chromium at every size, WebKit at 390, and Firefox as listed in the run output. These are desktop engines emulating phone sizes, not real devices.

## Candle slider (added)
Drag-to-blow slider checked with a real mouse drag in Chromium and WebKit: letting go at 50 percent springs back to 0, a full drag blows the candles out once, and the smoke loops afterwards. Touch dragging on a real phone and keyboard (End, Enter, Space) are implemented but not tested on devices.

## Music (added)
The Sound toggle was checked in Chromium and WebKit: audio starts only after the tap, loops, plays at volume 0.45, and pauses when toggled off. Music pausing during voice note or video playback is implemented but untested (no media supplied). Listening quality was not assessed by me.

## Opening questions and motion (added)
Scene 1 is now three playful checks with a "No" that dodges three times, then gives up and counts as yes (a deliberate change from the PRD's "no runaway buttons"; it never blocks, and keyboard or reduced-motion users get a still button that cycles the same lines). Heartbeat, ambient hearts, staggered entrances and button pulses were added; all are removed under reduced motion.
Checked with Playwright device profiles using real touch taps through the whole journey: iPhone SE (320x568), iPhone 13, Pixel 5, Galaxy S9+, iPad Mini (WebKit/Chromium) and desktop Chrome. Results: no horizontal overflow on any scene, every button at least 44 px, keyboard focus preserved after answering, 1080x1920 PNG export on all, no console errors. Mouse dodging also checked in Chromium and WebKit. These are emulated devices, not physical ones.

## Six scenes, photo flip cards, rose bouquet (added)
Scene 5 (the application) was removed, so the journey has six scenes. The flip cards are photo-only, with a decorative cover. The three selfies were resized to under 1000 px wide and re-saved without EXIF or GPS data. The envelope now releases a layered 3D rose bouquet (CSS 3D parallax, sway, falling petals; static under reduced motion). Visual checks were by screenshot in Chromium only; the bouquet in WebKit and Firefox was not viewed.

## 3D bouquet and candles (added)
Both were rendered with three.js in desktop Chrome (software WebGL) and checked by screenshot: the bouquet after opening, and the cake lit, mid-blow and after the candles are out (flames bend and shrink, then smoke rises). Phone-size fit was re-measured with the 3D scenes enabled (all steps fit on 320x568 to 412x780). The GL path was not checked on real phone GPUs or in WebKit/Firefox; those fall back to the SVG art only when WebGL is missing. Performance on low-end phones is untested. Initial JavaScript is about 61 KB compressed; the three.js chunk (about 133 KB) loads on demand.

## Full-height layout (added)
The card now fills the screen on phones, with the picture centred in the free space and the main button at the bottom. Memory cards and the step 6 card preview are sized from the measured free space, so any photo shape fits without scrolling. Measured on the production build at 390x844, 390x664, 375x667, 360x640, 412x780 and 320x568: every step, all three flipped memory cards and the last step fit without scrolling (after the entrance animation settles). Emulated viewports, not physical devices.

## Decision card, self-fitting art, yellow roses (added)
Step 2 uses icon tiles in a pink decision card that shares the available height; the cake, gift and envelope art scale themselves to the free space (no empty bands, no overlap). Re-measured after these changes at 390x844, 390x664, 375x667, 360x640, 412x780 and 320x568: no step scrolls. Screens were also reviewed by screenshot at 570x880. The bouquet roses are now golden yellow (3D and the SVG fallback); colour checked by screenshot only.

## Not verified
- Real iOS Safari, real Android Chrome, messaging-app browsers, and real download behaviour on mobile devices (the fallback "press and hold to save" path is implemented but untested).
- Export with a real share photo (none supplied), long names/captions on the card (layout logic is unit-tested, not visually checked).
- 200 percent zoom; screen reader (VoiceOver/TalkBack) behaviour; keyboard-only run in a real browser (focus handling is implemented, jsdom journey is click-based).
- Audio/video playback, music pause/resume, and blocked-autoplay handling (code present, no media supplied).
- Colour contrast was designed from the PRD tokens but not measured with a tool.
- Production mode build (blocked by design until placeholders are replaced).
