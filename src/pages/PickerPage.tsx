import ColorPicker from '../components/ColorPicker';
import HomeLink from '../components/common/HomeLink';
import PageTitle from '../components/common/PageTitle';

export default function PickerPage() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PageTitle title="カラーピッカー" />
      <ColorPicker />
      <HomeLink fixed />
    </div>
  );
}
