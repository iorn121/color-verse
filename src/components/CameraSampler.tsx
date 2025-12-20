import {} from 'react';

import { useCameraSampler } from '../hooks/useCameraSampler';
import CameraControls from './camera/CameraControls';
import CameraPreview from './camera/CameraPreview';

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
        <div className="card" style={{ display: 'grid', gap: 8, maxWidth: 640 }}>
          <div style={{ fontWeight: 700 }}>現在の色</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: state.hex ?? '#000',
              }}
            />
            <div style={{ display: 'grid', gap: 4 }}>
              <div>
                Hex: <code>{state.hex ?? '-'}</code>
              </div>
              <div>
                RGB:{' '}
                <code>
                  {state.rgb ? `rgb(${state.rgb.r}, ${state.rgb.g}, ${state.rgb.b})` : '-'}
                </code>
              </div>
              <div>
                HSL:{' '}
                <code>
                  {state.hsl ? `hsl(${state.hsl.h}, ${state.hsl.s}%, ${state.hsl.l}%)` : '-'}
                </code>
              </div>
            </div>
          </div>
          <small style={{ color: 'var(--color-text-tertiary)' }}>
            中心の白い丸の位置のピクセル色をリアルタイムで採取しています。
          </small>
        </div>
      ) : state.locked ? (
        <div className="card" style={{ display: 'grid', gap: 8, maxWidth: 640 }}>
          <div style={{ fontWeight: 700 }}>確定した色</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: state.lockedHex ?? '#000',
              }}
            />
            <div style={{ display: 'grid', gap: 4 }}>
              <div>
                Hex: <code>{state.lockedHex ?? '-'}</code>
              </div>
              <div>
                RGB:{' '}
                <code>
                  {state.lockedRgb
                    ? `rgb(${state.lockedRgb.r}, ${state.lockedRgb.g}, ${state.lockedRgb.b})`
                    : '-'}
                </code>
              </div>
              <div>
                HSL:{' '}
                <code>
                  {state.lockedHsl
                    ? `hsl(${state.lockedHsl.h}, ${state.lockedHsl.s}%, ${state.lockedHsl.l}%)`
                    : '-'}
                </code>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
