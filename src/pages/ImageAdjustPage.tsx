import ImageAdjuster from '../components/ImageAdjuster';
import PageTitle from '../components/common/PageTitle';
import Description from '../components/common/Description';

export default function ImageAdjustPage() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PageTitle title="画像の色調補正" />
      <Description>明度・コントラスト・彩度を調整できます</Description>
      <ImageAdjuster />
    </div>
  );
}
