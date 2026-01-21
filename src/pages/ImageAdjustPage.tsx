import { useTranslation } from 'react-i18next';

import Description from '../components/common/Description';
import HomeLink from '../components/common/HomeLink';
import PageTitle from '../components/common/PageTitle';
import ImageAdjuster from '../components/ImageAdjuster';

export default function ImageAdjustPage() {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PageTitle title={t('pages.imageAdjust.title')} />
      <Description>{t('pages.imageAdjust.desc')}</Description>
      <ImageAdjuster />
      <HomeLink fixed />
    </div>
  );
}
