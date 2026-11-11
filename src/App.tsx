import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { config as rawConfig } from './content/birthday.config';
import { sanitizeDeep } from './validation/text';
import { validateConfig } from './validation/validate';
import { initialState, journeyReducer, TOTAL_SCENES, type Action } from './state/journey';
import { AmbientHearts } from './components/Art';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { Scene3 } from './scenes/Scene3';
import { Scene4 } from './scenes/Scene4';
import { Scene5 } from './scenes/Scene5';
import { Scene6 } from './scenes/Scene6';

export function App() {
  // Client content is rendered as text only, and the forbidden dash is converted before use.
  const config = useMemo(() => sanitizeDeep(rawConfig), []);
  const [state, rawDispatch] = useReducer(journeyReducer, initialState);
  const dispatch = useCallback((a: Action) => {
    document.body.dataset.navigated = '1';
    rawDispatch(a);
  }, []);

  // Owner-only config notes, shown in dev builds only. Messages never include personal content.
  const issues = useMemo(() => (import.meta.env.DEV ? validateConfig(config) : null), [config]);

  // Sound state lives here so it survives an in-session replay.
  const musicSrc = config.features.music ? config.media?.musicSrc : undefined;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicWanted, setMusicWanted] = useState(false);
  const [mediaPlaying, setMediaPlaying] = useState(false);
  const [musicBlocked, setMusicBlocked] = useState(false);
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.45; // quiet background level
    if (musicWanted && !mediaPlaying) {
      a.play().then(() => setMusicBlocked(false), () => setMusicBlocked(true));
    } else a.pause();
  }, [musicWanted, mediaPlaying]);

  const replay = () => {
    setMediaPlaying(false);
    rawDispatch({ type: 'replay' });
    window.scrollTo({ top: 0 });
  };

  const common = { state, dispatch, config };
  const scene = [
    <Scene1 key={1} {...common} />,
    <Scene2 key={2} {...common} />,
    <Scene3 key={3} {...common} />,
    <Scene4 key={4} {...common} />,
    <Scene5 key={5} {...common} onMediaPlaying={setMediaPlaying} />,
    <Scene6 key={6} {...common} onReplay={replay} />,
  ][state.scene - 1];

  useEffect(() => {
    if (document.body.dataset.navigated) window.scrollTo({ top: 0 });
  }, [state.scene]);

  return (
    <div className="app">
      <AmbientHearts />
      <header className="topbar">
        {state.scene > 1 && (
          <button type="button" className="back" onClick={() => dispatch({ type: 'back' })}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" /></svg>
            Back
          </button>
        )}
        <p className="progress"><span className="long">A little surprise, </span>{state.scene} of {TOTAL_SCENES}</p>
        <div className="progress-dots" aria-hidden="true">
          {Array.from({ length: TOTAL_SCENES }, (_, i) => (
            <span key={i} className={i < state.scene ? 'on' : ''} />
          ))}
        </div>
        {musicSrc && (
          <button type="button" className={`sound ${musicWanted ? 'on' : ''}`} aria-label="Music" aria-pressed={musicWanted} title={musicWanted ? 'Music on. Tap to mute' : 'Music off. Tap to play'} onClick={() => setMusicWanted((v) => !v)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M9 18V6l10-2v12" />
              <circle cx="6.5" cy="18" r="2.5" />
              <circle cx="16.5" cy="16" r="2.5" />
              {!musicWanted && <path d="M3 3l18 18" strokeWidth="2.6" />}
            </svg>
          </button>
        )}
      </header>
      {musicSrc && <audio ref={audioRef} src={musicSrc} loop preload="none" />}
      {musicBlocked && <p className="note" role="status">Your browser blocked the music. Tap the music button to try again.</p>}
      <main className="stage" key={state.scene}>
        {scene}
      </main>
      {issues && (issues.errors.length > 0 || issues.warnings.length > 0) && (
        <details className="owner-notes">
          <summary>Owner notes (dev only)</summary>
          <ul>
            {[...issues.errors, ...issues.warnings].map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
