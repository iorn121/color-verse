import { useTranslation } from 'react-i18next';

import Description from '../components/common/Description';
import HomeLink from '../components/common/HomeLink';
import PageTitle from '../components/common/PageTitle';

export default function TheoryPage() {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 840 }}>
      <PageTitle title={t('pages.theory.title')} />
      <Description>{t('pages.theory.desc')}</Description>
      <HomeLink fixed />
    </div>
  );
}
