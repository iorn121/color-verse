import {} from 'react';

import { useCameraSampler } from '../hooks/useCameraSampler';
import CameraControls from './camera/CameraControls';
import CameraPreview from './camera/CameraPreview';
import ColorInfo from './common/ColorInfo';

export default function CameraSampler() {
  const { webcamRef, canvasRef, state, start, stop, lock, setError, videoConstraints } =
    useCameraSampler();

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <CameraControls
        active={state.active}
        canLock={!!state.rgb}
        onStart={start}
        onStop={stop}
        onLock={lock}
      />

      {state.error && (
        <div className="card" style={{ borderColor: '#fca5a5', color: '#b91c1c' }}>
          カメラエラー: {state.error}
        </div>
      )}

      <CameraPreview
        active={state.active}
        webcamRef={webcamRef}
        videoConstraints={videoConstraints}
        onReady={() => setError(null)}
        onError={(msg) => setError(msg)}
      />

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {state.active ? (
        <>
          <ColorInfo title="現在の色" hex={state.hex} rgb={state.rgb} hsl={state.hsl} />
          <small style={{ color: 'var(--color-text-tertiary)' }}>
            中心の白い丸の位置のピクセル色をリアルタイムで採取しています。
          </small>
        </>
      ) : state.locked ? (
        <ColorInfo
          title="確定した色"
          hex={state.lockedHex}
          rgb={state.lockedRgb}
          hsl={state.lockedHsl}
        />
      ) : null}
    </div>
  );
}
