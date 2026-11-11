import { useEffect, useMemo, useRef, useState } from 'react';
import { SceneHeading } from '../components/ui';
import { cardStyles } from '../content/copy';
import { buildCardContent, cardFileName, resolveSharePhoto } from '../export/cardContent';
import { canvasToBlob, loadCardFonts, loadCardPhoto, renderBirthdayCard, type CardPhoto } from '../export/renderBirthdayCard';
import { complimentsEnabled } from '../validation/validate';
import type { SceneProps } from './types';

type Props = SceneProps & { onReplay: () => void };
type ExportStatus = 'idle' | 'preparing' | 'done' | 'shown' | 'error';

const IN_APP = /FBAN|FBAV|Instagram|Line\/|MicroMessenger|Messenger|Viber|Telegram/i;

export function Scene7({ state, dispatch, config, onReplay }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<CardPhoto | undefined>();
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<ExportStatus>('idle');
  const [shownUrl, setShownUrl] = useState<string>();
  const [complimentIdx, setComplimentIdx] = useState(-1);
  const urlRef = useRef<string>();

  const style = state.cardStyle;
  const content = useMemo(() => buildCardContent(config, style, state.prefs.need), [config, style, state.prefs.need]);
  const share = resolveSharePhoto(config);

  // Wait for fonts and the share photo to be decoded before enabling export.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadCardFonts();
      } catch {
        /* fall back to system fonts */
      }
      let p: CardPhoto | undefined;
      if (share) {
        try {
          p = await loadCardPhoto(share.src, share.focalPoint);
        } catch {
          p = undefined; // photo-free card
        }
      }
      if (!cancelled) {
        setPhoto(p);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [share?.src, share?.focalPoint]);

  useEffect(() => {
    if (ready && canvasRef.current) {
      try {
        renderBirthdayCard(canvasRef.current, content, photo);
      } catch {
        setStatus('error');
      }
    }
  }, [ready, content, photo]);

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  const save = async () => {
    if (status === 'preparing' || !canvasRef.current) return;
    setStatus('preparing');
    try {
      renderBirthdayCard(canvasRef.current, content, photo);
      const blob = await canvasToBlob(canvasRef.current);
      const url = URL.createObjectURL(blob);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = url;
      const canDownload = 'download' in HTMLAnchorElement.prototype && !IN_APP.test(navigator.userAgent);
      if (canDownload) {
        const a = document.createElement('a');
        a.href = url;
        a.download = cardFileName(style);
        document.body.appendChild(a);
        a.click();
        a.remove();
        setShownUrl(undefined);
        setStatus('done');
      } else {
        setShownUrl(url);
        setStatus('shown');
      }
    } catch {
      setStatus('error');
    }
  };

  const canShareFiles = typeof navigator !== 'undefined' && typeof navigator.canShare === 'function' && typeof navigator.share === 'function';
  const shareCard = async () => {
    if (!canvasRef.current) return;
    try {
      const blob = await canvasToBlob(canvasRef.current);
      const file = new File([blob], cardFileName(style), { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) await navigator.share({ files: [file] });
    } catch {
      /* cancelled or unsupported: download remains available */
    }
  };

  const compliments = config.compliments.filter((c) => c.trim());
  const showCompliments = complimentsEnabled(config);
  const nextCompliment = () =>
    setComplimentIdx((i) => {
      if (compliments.length === 0) return -1;
      return (i + 1) % compliments.length; // finite list, wraps, never an immediate repeat
    });

  return (
    <section className="scene wide" aria-label="Your birthday card">
      <SceneHeading>Made for you. Worth showing off.</SceneHeading>
      <div className="card-preview">
        <canvas ref={canvasRef} width={1080} height={1920} role="img" aria-label={`Birthday card preview. ${content.altText}`} />
      </div>
      <div role="group" aria-label="Card style" className="style-picker">
        {cardStyles.map((s) => (
          <button key={s.id} type="button" className="chip" aria-pressed={style === s.id} onClick={() => dispatch({ type: 'setStyle', style: s.id })}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="btn-stack">
        <button type="button" className="btn primary" onClick={save} disabled={!ready || status === 'preparing'}>
          {status === 'preparing' ? 'Preparing your card...' : status === 'error' ? 'Try saving again' : 'Save my birthday card'}
        </button>
        {canShareFiles && ready && (
          <button type="button" className="btn secondary" onClick={shareCard}>
            Share my card
          </button>
        )}
        <button type="button" className="btn secondary" onClick={onReplay}>
          Replay my surprise
        </button>
        {showCompliments && (
          <button type="button" className="btn quiet" onClick={nextCompliment}>
            Emergency compliments
          </button>
        )}
      </div>
      <div role="status" aria-live="polite" className="status">
        {status === 'done' && <p>Your card download has started as {cardFileName(style)}. Look in your downloads.</p>}
        {status === 'shown' && <p>Press and hold the image below, then choose to save it.</p>}
        {status === 'error' && <p>Something went wrong making the card. Your surprise is safe. Please try again.</p>}
      </div>
      {shownUrl && <img className="export-img" src={shownUrl} alt={`Your birthday card. ${content.altText}`} />}
      {showCompliments && complimentIdx >= 0 && (
        <div role="status" aria-live="polite" className="compliment">
          <p key={complimentIdx}>{compliments[complimentIdx]}</p>
        </div>
      )}
    </section>
  );
}
