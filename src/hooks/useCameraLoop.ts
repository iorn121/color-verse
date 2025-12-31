import { useEffect, useRef, useState } from 'react';
import type Webcam from 'react-webcam';

type FrameParams = {
  ctx: CanvasRenderingContext2D;
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
};

export type UseCameraLoopOptions = {
  onFrame?: (params: FrameParams) => void;
  maxWidth?: number; // 描画時にこの幅に収める（アスペクト維持）
};

export function useCameraLoop(options?: UseCameraLoopOptions) {
  const { onFrame, maxWidth = 640 } = options ?? {};
  const onFrameRef = useRef<typeof onFrame>(onFrame);
  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  const webcamRef = useRef<Webcam>(null!);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const tick = () => {
      const video = (webcamRef.current as unknown as { video?: HTMLVideoElement })?.video ?? null;
      if (!video || !video.videoWidth || !video.videoHeight) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const scale = Math.min(1, maxWidth / video.videoWidth);
      const w = Math.round(video.videoWidth * scale);
      const h = Math.round(video.videoHeight * scale);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      // フレーム処理（呼び出し側に委譲）
      try {
        onFrameRef.current?.({ ctx, video, canvas });
      } catch {
        // no-op
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    if (active) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, maxWidth]);

  // Stop tracks on unmount
  useEffect(() => {
    const currentRef = webcamRef.current as unknown as { video?: HTMLVideoElement } | null;
    return () => {
      const video = currentRef?.video ?? null;
      const stream = (video?.srcObject as MediaStream | null) ?? null;
      stream?.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {
          // no-op
        }
      });
    };
  }, []);

  const videoConstraints: MediaStreamConstraints['video'] = {
    facingMode: { ideal: 'environment' },
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  return {
    webcamRef,
    canvasRef,
    state: { active, error },
    start: () => setActive(true),
    stop: () => setActive(false),
    setError,
    videoConstraints,
  };
}


