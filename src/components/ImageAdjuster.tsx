import { useCallback, useRef, useState } from 'react';

export default function ImageAdjuster() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const drawWith = useCallback((b: number, c: number, s: number) => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
    ctx.drawImage(img, 0, 0);
  }, []);

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
            <input
              type="range"
              min={0}
              max={200}
              value={brightness}
              onChange={(e) => {
                const v = Number(e.target.value);
                setBrightness(v);
                if (imageRef.current?.complete) drawWith(v, contrast, saturate);
              }}
            />
          </label>
          <label style={{ display: 'grid', gap: 4 }}>
            <span>Contrast: {contrast}%</span>
            <input
              type="range"
              min={0}
              max={200}
              value={contrast}
              onChange={(e) => {
                const v = Number(e.target.value);
                setContrast(v);
                if (imageRef.current?.complete) drawWith(brightness, v, saturate);
              }}
            />
          </label>
          <label style={{ display: 'grid', gap: 4 }}>
            <span>Saturation: {saturate}%</span>
            <input
              type="range"
              min={0}
              max={200}
              value={saturate}
              onChange={(e) => {
                const v = Number(e.target.value);
                setSaturate(v);
                if (imageRef.current?.complete) drawWith(brightness, contrast, v);
              }}
            />
          </label>
        </div>
      )}
      {imageUrl && (
        <div style={{ display: 'grid', gap: 8 }}>
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: '100%',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
            }}
          />
          <img
            ref={imageRef}
            src={imageUrl}
            alt="source"
            style={{ display: 'none' }}
            onLoad={() => drawWith(brightness, contrast, saturate)}
          />
        </div>
      )}
    </div>
  );
}
