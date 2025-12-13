import ColorPicker from '../components/ColorPicker';

export default function PickerPage() {
	return (
		<div style={{ display: 'grid', gap: 12 }}>
			<h2 style={{ margin: 0 }}>カラーピッカー</h2>
			<ColorPicker />
		</div>
	);
}


