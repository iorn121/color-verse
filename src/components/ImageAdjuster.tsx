import { useEffect, useRef, useState } from 'react';

export default function ImageAdjuster() {
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [brightness, setBrightness] = useState(100);
	const [contrast, setContrast] = useState(100);
	const [saturate, setSaturate] = useState(100);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const imageRef = useRef<HTMLImageElement | null>(null);

	useEffect(() => {
		const img = imageRef.current;
		const canvas = canvasRef.current;
		if (!img || !canvas) return;
		if (!img.complete) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		canvas.width = img.naturalWidth;
		canvas.height = img.naturalHeight;
		ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
		ctx.drawImage(img, 0, 0);
	}, [brightness, contrast, saturate, imageUrl]);

	return (
		<div style={{ display: 'grid', gap: 12 }}>
			<input
				type="file"
				accept="image/*"
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (!file) return;
					const url = URL.createObjectURL(file);
					setImageUrl(url);
				}}
			/>
			{imageUrl && (
				<div style={{ display: 'grid', gap: 8 }}>
					<label style={{ display: 'grid', gap: 4 }}>
						<span>Brightness: {brightness}%</span>
						<input type="range" min={0} max={200} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} />
					</label>
					<label style={{ display: 'grid', gap: 4 }}>
						<span>Contrast: {contrast}%</span>
						<input type="range" min={0} max={200} value={contrast} onChange={(e) => setContrast(Number(e.target.value))} />
					</label>
					<label style={{ display: 'grid', gap: 4 }}>
						<span>Saturation: {saturate}%</span>
						<input type="range" min={0} max={200} value={saturate} onChange={(e) => setSaturate(Number(e.target.value))} />
					</label>
				</div>
			)}
			{imageUrl && (
				<div style={{ display: 'grid', gap: 8 }}>
					<canvas ref={canvasRef} style={{ maxWidth: '100%', border: '1px solid #e5e7eb', borderRadius: 8 }} />
					<img
						ref={imageRef}
						src={imageUrl}
						alt="source"
						style={{ display: 'none' }}
						onLoad={() => {
							// trigger effect
							setBrightness((v) => v);
						}}
					/>
				</div>
			)}
		</div>
	);
}


