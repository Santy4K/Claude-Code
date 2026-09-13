import { useEffect, useRef, useState } from 'react';
import type { QteQuality } from '../../game/engine/combat';

interface QteBarProps {
  label: string;
  zoneWidth?: number;
  durationMs?: number;
  onResolve: (quality: QteQuality) => void;
}

export function QteBar({ label, zoneWidth = 0.24, durationMs = 1000, onResolve }: QteBarProps) {
  const centerRef = useRef(0.25 + Math.random() * 0.5);
  const [position, setPosition] = useState(0);
  const positionRef = useRef(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const resolvedRef = useRef(false);

  useEffect(() => {
    function tick(t: number) {
      if (startRef.current === null) startRef.current = t;
      const elapsed = t - startRef.current;
      const phase = (elapsed % durationMs) / durationMs;
      const pos = phase < 0.5 ? phase * 2 : 2 - phase * 2;
      positionRef.current = pos;
      setPosition(pos);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    const timeout = setTimeout(() => {
      if (!resolvedRef.current) {
        resolvedRef.current = true;
        onResolve('miss');
      }
    }, durationMs * 2.4);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTap() {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const goodHalf = zoneWidth / 2;
    const perfectHalf = goodHalf * 0.4;
    const distance = Math.abs(positionRef.current - centerRef.current);

    let quality: QteQuality;
    if (distance <= perfectHalf) quality = 'perfect';
    else if (distance <= goodHalf) quality = 'good';
    else quality = 'miss';

    onResolve(quality);
  }

  const center = centerRef.current;

  return (
    <div className="qte">
      <p className="qte-label">{label}</p>
      <div className="qte-track" onClick={handleTap} role="presentation">
        <div
          className="qte-zone"
          style={{ left: `${(center - zoneWidth / 2) * 100}%`, width: `${zoneWidth * 100}%` }}
        />
        <div className="qte-marker" style={{ left: `${position * 100}%` }} />
      </div>
      <button className="btn btn-primary" onClick={handleTap}>
        ¡Ahora!
      </button>
    </div>
  );
}
