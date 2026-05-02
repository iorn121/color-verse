import { useTranslation } from 'react-i18next';

import ImagePaletteAnalyzer from '../components/color/ImagePaletteAnalyzer';
import Description from '../components/common/Description';
import HomeLink from '../components/common/HomeLink';
import PageTitle from '../components/common/PageTitle';

export default function ColorAnalysisPage() {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PageTitle title={t('pages.colorAnalysis.title')} />
      <Description>{t('pages.colorAnalysis.desc')}</Description>
      <ImagePaletteAnalyzer />
      <HomeLink fixed />
    </div>
  );
}
