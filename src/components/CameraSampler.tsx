import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

import { Hsl, Rgb, rgbToHex, rgbToHsl } from '../lib/color';

export default function CameraSampler() {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rgb, setRgb] = useState<Rgb | null>(null);
  const [hsl, setHsl] = useState<Hsl | null>(null);
  const [hex, setHex] = useState<string>('#000000');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tick = () => {
      const video = (webcamRef.current as unknown as { video?: HTMLVideoElement })?.video ?? null;
      if (!video || !video.videoWidth || !video.videoHeight) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const cx = Math.floor(canvas.width / 2);
      const cy = Math.floor(canvas.height / 2);
      const data = ctx.getImageData(cx, cy, 1, 1).data;
      const current: Rgb = { r: data[0], g: data[1], b: data[2] };
      setRgb(current);
      const hslVal = rgbToHsl(current);
      setHsl(hslVal);
      setHex(rgbToHex(current));
      rafRef.current = requestAnimationFrame(tick);
    };

    if (active) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  const videoConstraints: MediaStreamConstraints['video'] = {
    facingMode: { ideal: 'environment' },
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {!active ? (
          <button
            className="btn btn-primary"
            onClick={() => {
              setError(null);
              setActive(true);
            }}
          >
            カメラ開始
          </button>
        ) : (
          <button className="btn" onClick={() => setActive(false)}>
            停止
          </button>
        )}
      </div>

      {error && (
        <div className="card" style={{ borderColor: '#fca5a5', color: '#b91c1c' }}>
          カメラエラー: {error}
        </div>
      )}

      <div style={{ position: 'relative', width: '100%', maxWidth: 640 }}>
        {active && (
          <Webcam
            ref={webcamRef}
            audio={false}
            videoConstraints={videoConstraints}
            onUserMedia={() => setError(null)}
            onUserMediaError={(e) => setError((e as Error).message ?? 'camera error')}
            mirrored={false}
            forceScreenshotSourceSize
            style={{
              width: '100%',
              borderRadius: 8,
              background: '#000',
              aspectRatio: '16 / 9',
              objectFit: 'cover',
              zIndex: 1,
            }}
          />
        )}
        {active && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: '2px solid #fff',
              boxShadow: '0 0 0 2px rgba(0,0,0,0.5)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="card" style={{ display: 'grid', gap: 8, maxWidth: 640 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: hex,
            }}
          />
          <div style={{ display: 'grid', gap: 4 }}>
            <div>
              Hex: <code>{hex}</code>
            </div>
            <div>
              RGB: <code>{rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '-'}</code>
            </div>
            <div>
              HSL: <code>{hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '-'}</code>
            </div>
          </div>
        </div>
        <small style={{ color: 'var(--color-text-tertiary)' }}>
          中心の白い丸の位置のピクセル色をリアルタイムで採取しています。
        </small>
      </div>
    </div>
  );
}
