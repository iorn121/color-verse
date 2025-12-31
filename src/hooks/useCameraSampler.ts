import { useState } from 'react';

import type { Rgb } from '../lib/color';
import { useCameraLoop } from './useCameraLoop';

export type UseCameraSamplerState = {
  active: boolean;
  error: string | null;
  rgb: Rgb | null;
  locked: boolean;
  lockedRgb: Rgb | null;
};

export function useCameraSampler() {
  const [state, setState] = useState<UseCameraSamplerState>({
    active: false,
    error: null,
    rgb: null,
    locked: false,
    lockedRgb: null,
  });

  const loop = useCameraLoop({
    onFrame: ({ ctx, video, canvas }) => {
      // 動画フレームを描画し中心1pxをサンプリング
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const cx = Math.floor(canvas.width / 2);
      const cy = Math.floor(canvas.height / 2);
      const data = ctx.getImageData(cx, cy, 1, 1).data;
      const current: Rgb = { r: data[0], g: data[1], b: data[2] };
      setState((s) => ({ ...s, rgb: current }));
    },
  });

  const start = () => {
    loop.start();
    setState((s) => ({ ...s, error: null, active: true }));
  };
  const stop = () => {
    setState((s) => ({ ...s, active: false }));
    loop.stop();
  };
  const setError = (msg: string | null) => setState((s) => ({ ...s, error: msg }));

  const lock = () => {
    if (!state.rgb) return;
    setState((s) => ({
      ...s,
      locked: true,
      lockedRgb: s.rgb,
    }));
    stop();
  };

  const videoConstraints: MediaStreamConstraints['video'] = {
    ...loop.videoConstraints,
  };

  return {
    webcamRef: loop.webcamRef,
    canvasRef: loop.canvasRef,
    state,
    start,
    stop,
    lock,
    setError,
    videoConstraints,
  };
}
