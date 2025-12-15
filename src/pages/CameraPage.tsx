import CameraSampler from '../components/CameraSampler';

export default function CameraPage() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0 }} className="secondary-gradient-text">
        カメラ連携色ピッカー
      </h2>
      <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
        カメラの中心ピクセルの色をリアルタイムで表示します
      </p>
      <CameraSampler />
    </div>
  );
}
