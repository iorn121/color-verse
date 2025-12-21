import Description from '../components/common/Description';
import HomeLink from '../components/common/HomeLink';
import PageTitle from '../components/common/PageTitle';
import ImageAdjuster from '../components/ImageAdjuster';

export default function ImageAdjustPage() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PageTitle title="画像の色調補正" />
      <Description>明度・コントラスト・彩度を調整できます</Description>
      <ImageAdjuster />
      <HomeLink fixed />
    </div>
  );
}
