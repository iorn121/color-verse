import { useTranslation } from 'react-i18next';

import ColorCompareTool from '../components/color/ColorCompareTool';
import Description from '../components/common/Description';
import HomeLink from '../components/common/HomeLink';
import PageTitle from '../components/common/PageTitle';

export default function ComparePage() {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PageTitle title={t('pages.compare.title')} />
      <Description>{t('pages.compare.desc')}</Description>
      <ColorCompareTool />
      <HomeLink fixed />
    </div>
  );
}
