import { useEffect } from 'react';
import { Bear, GiftBox } from '../components/Art';
import { Photo } from '../components/Photo';
import { SceneHeading } from '../components/ui';
import { surpriseIsValid } from '../validation/validate';
import type { SceneProps } from './types';

type Props = SceneProps & { onMediaPlaying: (playing: boolean) => void };

export function Scene6({ state, dispatch, config, onMediaPlaying }: Props) {
  const m = config.media;
  const s = config.surprise;
  // If this scene unmounts mid-playback, make sure background music is released.
  useEffect(() => () => onMediaPlaying(false), [onMediaPlaying]);
  const mediaEvents = {
    onPlay: () => onMediaPlaying(true),
    onPause: () => onMediaPlaying(false),
    onEnded: () => onMediaPlaying(false),
  };
  return (
    <section className="scene" aria-label="A gift from me">
      <div className="hero-art">
        <Bear size={72} className="bear-bob" />
        <GiftBox open={state.giftOpen} />
      </div>
      <SceneHeading>Okay. This part is from me.</SceneHeading>
      {!state.giftOpen ? (
        <button type="button" className="btn primary" onClick={() => dispatch({ type: 'openGift' })}>
          Open your surprise
        </button>
      ) : (
        <>
          {config.heroPhotoId && <div className="polaroid"><Photo config={config} photoId={config.heroPhotoId} /></div>}
          <article className="letter" tabIndex={0} autoFocus aria-label="Your birthday message">
            {config.letter.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="script signoff">{config.letter.signOff}</p>
          </article>
          {m?.voiceNoteSrc && (
            <div className="media">
              <p className="eyebrow">A voice note</p>
              <audio controls preload="none" src={m.voiceNoteSrc} {...mediaEvents}>
                Your browser cannot play this audio.
              </audio>
              {m.transcript && (
                <details>
                  <summary>Read the transcript</summary>
                  <p>{m.transcript}</p>
                </details>
              )}
            </div>
          )}
          {m?.videoSrc && (
            <div className="media">
              <p className="eyebrow">A little video</p>
              <video controls preload="none" playsInline src={m.videoSrc} {...mediaEvents}>
                {m.captionsSrc && <track kind="captions" src={m.captionsSrc} srcLang={config.locale} label="Captions" default />}
              </video>
            </div>
          )}
          {surpriseIsValid(config) && s && (
            <aside className="surprise" aria-label="Your surprise">
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              {(s.dateLabel || s.timeLabel || s.locationLabel) && (
                <dl>
                  {s.dateLabel && (<><dt>Date</dt><dd>{s.dateLabel}</dd></>)}
                  {s.timeLabel && (<><dt>Time</dt><dd>{s.timeLabel}</dd></>)}
                  {s.locationLabel && (<><dt>Where</dt><dd>{s.locationLabel}</dd></>)}
                </dl>
              )}
            </aside>
          )}
          <button type="button" className="btn primary" onClick={() => dispatch({ type: 'next', from: 6 })}>
            There's one little keepsake left
          </button>
        </>
      )}
    </section>
  );
}
