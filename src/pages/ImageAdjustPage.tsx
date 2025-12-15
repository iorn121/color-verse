import ImageAdjuster from '../components/ImageAdjuster';

export default function ImageAdjustPage() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0 }} className="secondary-gradient-text">
        画像の色調補正
      </h2>
      <p style={{ margin: 0, color: '#374151' }}>明度・コントラスト・彩度を調整できます</p>
      <ImageAdjuster />
    </div>
  );
}
