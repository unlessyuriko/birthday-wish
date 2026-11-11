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

## Not verified
- Real iOS Safari, real Android Chrome, messaging-app browsers, and real download behaviour on mobile devices (the fallback "press and hold to save" path is implemented but untested).
- Export with a real share photo (none supplied), long names/captions on the card (layout logic is unit-tested, not visually checked).
- 200 percent zoom; screen reader (VoiceOver/TalkBack) behaviour; keyboard-only run in a real browser (focus handling is implemented, jsdom journey is click-based).
- Audio/video playback, music pause/resume, and blocked-autoplay handling (code present, no media supplied).
- Colour contrast was designed from the PRD tokens but not measured with a tool.
- Production mode build (blocked by design until placeholders are replaced).
