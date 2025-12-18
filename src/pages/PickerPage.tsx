import ColorPicker from '../components/ColorPicker';
import PageTitle from '../components/common/PageTitle';

export default function PickerPage() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PageTitle title="カラーピッカー" />
      <ColorPicker />
    </div>
  );
}
