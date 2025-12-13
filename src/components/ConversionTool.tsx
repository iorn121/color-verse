import { useMemo, useState } from 'react';
import { Hsl, Rgb, hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from '../lib/color';

export default function ConversionTool() {
	const [hex, setHex] = useState('#0EA5E9');
	const rgb: Rgb | null = useMemo(() => hexToRgb(hex), [hex]);
	const hsl: Hsl | null = useMemo(() => (rgb ? rgbToHsl(rgb) : null), [rgb]);

	const [r, setR] = useState(14);
	const [g, setG] = useState(165);
	const [b, setB] = useState(233);
	const rgbHex = useMemo(() => rgbToHex({ r, g, b }), [r, g, b]);
	const rgbHsl = useMemo(() => rgbToHsl({ r, g, b }), [r, g, b]);

	return (
		<div style={{ display: 'grid', gap: 20, maxWidth: 720 }}>
			<section style={{ display: 'grid', gap: 8 }}>
				<h3 style={{ margin: 0 }}>Hex → RGB/HSL</h3>
				<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
					<input value={hex} onChange={(e) => setHex(e.target.value)} style={{ fontFamily: 'ui-monospace, Menlo, monospace', padding: '8px 10px', width: 160 }} />
					<div style={{ width: 24, height: 24, border: '1px solid #e5e7eb', background: hex }} />
				</div>
				<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
					<div style={{ padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: 6 }}>{rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : 'invalid'}</div>
					<div style={{ padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: 6 }}>{hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : 'invalid'}</div>
				</div>
			</section>

			<section style={{ display: 'grid', gap: 8 }}>
				<h3 style={{ margin: 0 }}>RGB → Hex/HSL</h3>
				<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
					<input type="number" min={0} max={255} value={r} onChange={(e) => setR(Number(e.target.value))} style={{ width: 80 }} />
					<input type="number" min={0} max={255} value={g} onChange={(e) => setG(Number(e.target.value))} style={{ width: 80 }} />
					<input type="number" min={0} max={255} value={b} onChange={(e) => setB(Number(e.target.value))} style={{ width: 80 }} />
					<div style={{ width: 24, height: 24, border: '1px solid #e5e7eb', background: rgbHex }} />
				</div>
				<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
					<div style={{ padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: 6 }}>{rgbHex}</div>
					<div style={{ padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: 6 }}>{`hsl(${rgbHsl.h}, ${rgbHsl.s}%, ${rgbHsl.l}%)`}</div>
				</div>
			</section>
		</div>
	);
}


