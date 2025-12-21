import CameraSampler from '../components/CameraSampler';
import Description from '../components/common/Description';
import HomeLink from '../components/common/HomeLink';
import PageTitle from '../components/common/PageTitle';

export default function CameraPage() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PageTitle title="カメラ連携色ピッカー" />
      <Description>カメラの中心ピクセルの色をリアルタイムで表示します</Description>
      <CameraSampler />
      <HomeLink fixed />
    </div>
  );
}
