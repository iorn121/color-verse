import { useMemo } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

import Description from '../components/common/Description';
import JisColorLabel from '../components/common/JisColorLabel';
import PageTitle from '../components/common/PageTitle';
import { hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from '../lib/color';
import type { JisColor } from '../lib/jisColors';

function getComplementaryHex(hex: string): string | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const hsl = rgbToHsl(rgb);
  const comp = { ...hsl, h: (hsl.h + 180) % 360 };
  return rgbToHex(hslToRgb(comp));
}

export default function ColorDetailPage() {
  const color = useLoaderData() as JisColor | null;

  const complementary = useMemo(() => (color ? getComplementaryHex(color.hex) : null), [color]);

  if (!color) {
    return (
      <div className="container animate-fade-in" style={{ display: 'grid', gap: 12 }}>
        <PageTitle title="色が見つかりません" />
        <Description>指定されたIDの色は存在しないか、参照できません。</Description>
        <Link to="/colors" className="btn" style={{ width: 'fit-content' }}>
          図鑑へ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ display: 'grid', gap: 16 }}>
      <PageTitle title="色の詳細" />
      <Description>JIS慣用色の詳細情報と補色を表示します。</Description>

      <div className="card" style={{ padding: 16, display: 'grid', gap: 12 }}>
        <div className="flex items-center justify-between">
          <JisColorLabel color={color} showSwatch />
          <div style={{ opacity: 0.7, fontSize: 12 }}>{color.group}</div>
        </div>
        {color.reading && (
          <div style={{ opacity: 0.9 }}>
            読み: <span style={{ fontFamily: 'ui-sans-serif, system-ui' }}>{color.reading}</span>
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
          }}
        >
          <div className="card" style={{ padding: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>プレビュー</div>
            <div
              aria-hidden
              style={{
                width: '100%',
                height: 160,
                borderRadius: 8,
                background: color.hex,
                border: '1px solid var(--color-border)',
              }}
            />
          </div>

          <div className="card" style={{ padding: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>数値情報</div>
            <div style={{ display: 'grid', gap: 6, fontFamily: 'monospace' }}>
              <div>Hex: {color.hex}</div>
              {(() => {
                const rgb = hexToRgb(color.hex);
                if (!rgb) return null;
                return (
                  <div>
                    RGB: {rgb.r}, {rgb.g}, {rgb.b}
                  </div>
                );
              })()}
              {(() => {
                const rgb = hexToRgb(color.hex);
                if (!rgb) return null;
                const hsl = rgbToHsl(rgb);
                return (
                  <div>
                    HSL: {hsl.h}°, {hsl.s}%, {hsl.l}%
                  </div>
                );
              })()}
              {color.h !== undefined && color.s !== undefined && color.b !== undefined && (
                <div>
                  HSB: {color.h}°, {color.s}%, {color.b}%
                </div>
              )}
              {color.munsell && <div>マンセル値: {color.munsell}</div>}
              {color.systemName && <div>系統色名: {color.systemName}</div>}
            </div>
          </div>

          <div className="card" style={{ padding: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>補色</div>
            {complementary ? (
              <div style={{ display: 'grid', gap: 8 }}>
                <div
                  aria-hidden
                  style={{
                    width: '100%',
                    height: 84,
                    borderRadius: 8,
                    background: complementary,
                    border: '1px solid var(--color-border)',
                  }}
                />
                <div style={{ fontFamily: 'monospace' }}>{complementary}</div>
              </div>
            ) : (
              <div style={{ opacity: 0.7 }}>計算できませんでした</div>
            )}
          </div>
        </div>
      </div>

      <div>
        <Link to="/colors" className="btn">
          図鑑へ戻る
        </Link>
      </div>
    </div>
  );
}
