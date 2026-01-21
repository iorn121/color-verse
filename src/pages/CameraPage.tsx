import { useTranslation } from 'react-i18next';

import CameraSampler from '../components/CameraSampler';
import Description from '../components/common/Description';
import HomeLink from '../components/common/HomeLink';
import PageTitle from '../components/common/PageTitle';

export default function CameraPage() {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PageTitle title={t('pages.camera.title')} />
      <Description>{t('pages.camera.desc')}</Description>
      <CameraSampler />
      <HomeLink fixed />
    </div>
  );
}
