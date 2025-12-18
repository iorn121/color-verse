import PageTitle from '../components/common/PageTitle';
import Description from '../components/common/Description';

export default function TheoryPage() {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 840 }}>
      <PageTitle title="基本的な色彩理論（概要）" />
      <Description>
        ここでは色相環、補色、類似色、三原色、RGB/CMYK
        の違い、色温度などの基礎を順次掲載していきます
      </Description>
    </div>
  );
}
