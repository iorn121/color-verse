import { useEffect, useRef, useState } from 'react';
import type Webcam from 'react-webcam';

import type { Hsl, Rgb } from '../lib/color';
import { rgbToHex, rgbToHsl } from '../lib/color';

export type UseCameraSamplerState = {
  active: boolean;
  error: string | null;
  rgb: Rgb | null;
  hsl: Hsl | null;
  hex: string;
  locked: boolean;
  lockedRgb: Rgb | null;
  lockedHsl: Hsl | null;
  lockedHex: string | null;
};

export function useCameraSampler() {
  const webcamRef = useRef<Webcam>(null!);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [state, setState] = useState<UseCameraSamplerState>({
    active: false,
    error: null,
    rgb: null,
    hsl: null,
    hex: '#000000',
    locked: false,
    lockedRgb: null,
    lockedHsl: null,
    lockedHex: null,
  });

  // Sampling loop
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
      const hslVal = rgbToHsl(current);
      const hexVal = rgbToHex(current);
      setState((s) => ({ ...s, rgb: current, hsl: hslVal, hex: hexVal }));
      rafRef.current = requestAnimationFrame(tick);
    };

    if (state.active) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [state.active]);

  const stopStreamTracks = () => {
    const video = (webcamRef.current as unknown as { video?: HTMLVideoElement })?.video ?? null;
    const stream = (video?.srcObject as MediaStream | null) ?? null;
    if (stream) {
      stream.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {
          // no-op
        }
      });
    }
  };

  const start = () => setState((s) => ({ ...s, error: null, active: true }));
  const stop = () => {
    setState((s) => ({ ...s, active: false }));
    stopStreamTracks();
  };
  const setError = (msg: string | null) => setState((s) => ({ ...s, error: msg }));

  const lock = () => {
    if (!state.rgb || !state.hsl || !state.hex) return;
    setState((s) => ({
      ...s,
      locked: true,
      lockedRgb: s.rgb,
      lockedHsl: s.hsl,
      lockedHex: s.hex,
    }));
    stop();
  };

  const videoConstraints: MediaStreamConstraints['video'] = {
    facingMode: { ideal: 'environment' },
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  return {
    webcamRef,
    canvasRef,
    state,
    start,
    stop,
    lock,
    setError,
    videoConstraints,
  };
}
