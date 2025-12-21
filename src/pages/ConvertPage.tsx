import HomeLink from '../components/common/HomeLink';
import PageTitle from '../components/common/PageTitle';
import ConversionTool from '../components/ConversionTool';

export default function ConvertPage() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PageTitle title="Hex / RGB / HSL 変換" />
      <ConversionTool />
      <HomeLink fixed />
    </div>
  );
}
