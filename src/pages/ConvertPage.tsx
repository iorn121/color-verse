import ConversionTool from '../components/ConversionTool';

export default function ConvertPage() {
	return (
		<div style={{ display: 'grid', gap: 12 }}>
			<h2 style={{ margin: 0 }}>Hex / RGB / HSL 変換</h2>
			<ConversionTool />
		</div>
	);
}


