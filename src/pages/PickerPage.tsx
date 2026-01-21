import { useTranslation } from 'react-i18next';

import ColorPicker from '../components/ColorPicker';
import HomeLink from '../components/common/HomeLink';
import PageTitle from '../components/common/PageTitle';

export default function PickerPage() {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PageTitle title={t('pages.picker.title')} />
      <ColorPicker />
      <HomeLink fixed />
    </div>
  );
}
