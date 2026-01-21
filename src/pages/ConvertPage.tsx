import { useTranslation } from 'react-i18next';

import HomeLink from '../components/common/HomeLink';
import PageTitle from '../components/common/PageTitle';
import ConversionTool from '../components/ConversionTool';

export default function ConvertPage() {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PageTitle title={t('pages.convert.title')} />
      <ConversionTool />
      <HomeLink fixed />
    </div>
  );
}
