import { useState } from 'react';

import type { Rgb } from '../lib/color';
import { clamp } from '../lib/color';
import { useCameraLoop } from './useCameraLoop';

export type CvdType = 'common' | 'deuteranopia' | 'protanopia' | 'tritanopia';

function transformRgbForCvd({ r, g, b }: Rgb, type: CvdType): Rgb {
  let m: [number, number, number, number, number, number, number, number, number];
  switch (type) {
    case 'protanopia':
      m = [0.56667, 0.43333, 0.0, 0.55833, 0.44167, 0.0, 0.0, 0.24167, 0.75833];
      break;
    case 'tritanopia':
      m = [0.95, 0.05, 0.0, 0.0, 0.43333, 0.56667, 0.0, 0.475, 0.525];
      break;
    case 'deuteranopia':
    default:
      m = [0.625, 0.375, 0.0, 0.7, 0.3, 0.0, 0.0, 0.3, 0.7];
      break;
  }
  const [m00, m01, m02, m10, m11, m12, m20, m21, m22] = m;
  const nr = m00 * r + m01 * g + m02 * b;
  const ng = m10 * r + m11 * g + m12 * b;
  const nb = m20 * r + m21 * g + m22 * b;
  return {
    r: clamp(Math.round(nr), 0, 255),
    g: clamp(Math.round(ng), 0, 255),
    b: clamp(Math.round(nb), 0, 255),
  };
}

function applyCvdToImageData(data: Uint8ClampedArray, type: CvdType) {
  if (type === 'common') {
    return;
  }
  for (let i = 0; i < data.length; i += 4) {
    const rgb = { r: data[i], g: data[i + 1], b: data[i + 2] };
    const t = transformRgbForCvd(rgb, type);
    data[i] = t.r;
    data[i + 1] = t.g;
    data[i + 2] = t.b;
  }
}

export function useCameraCvd() {
  const [cvd, setCvd] = useState<CvdType>('common');
  const loop = useCameraLoop({
    maxWidth: 640,
    onFrame: ({ ctx, video, canvas }) => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      applyCvdToImageData(img.data, cvd);
      ctx.putImageData(img, 0, 0);
    },
  });

  return {
    webcamRef: loop.webcamRef,
    canvasRef: loop.canvasRef,
    state: { ...loop.state, cvd },
    setCvd,
    start: loop.start,
    stop: loop.stop,
    setError: loop.setError,
  };
}
