import type { CSSProperties } from 'react';
import Webcam from 'react-webcam';

type CameraPreviewProps = {
  active: boolean;
  webcamRef: React.RefObject<Webcam>;
  videoConstraints: MediaStreamConstraints['video'];
  onReady: () => void;
  onError: (message: string) => void;
  containerStyle?: CSSProperties;
};

export default function CameraPreview({
  active,
  webcamRef,
  videoConstraints,
  onReady,
  onError,
  containerStyle,
}: CameraPreviewProps) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 640, ...(containerStyle ?? {}) }}>
      {active && (
        <Webcam
          ref={webcamRef}
          audio={false}
          videoConstraints={videoConstraints}
          onUserMedia={onReady}
          onUserMediaError={(e) => onError((e as Error).message ?? 'camera error')}
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
  );
}
