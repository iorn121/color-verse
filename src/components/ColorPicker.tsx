import { useMemo, useState } from "react";
import { Hsl, Rgb, hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from "../lib/color";

export default function ColorPicker() {
  const [hex, setHex] = useState("#4F46E5");

  const rgb: Rgb | null = useMemo(() => hexToRgb(hex), [hex]);
  const hsl: Hsl | null = useMemo(() => (rgb ? rgbToHsl(rgb) : null), [rgb]);

  const updateFromHsl = (next: Partial<Hsl>) => {
    if (!hsl) return;
    const merged: Hsl = {
      h: next.h ?? hsl.h,
      s: next.s ?? hsl.s,
      l: next.l ?? hsl.l,
    };
    const toRgb = hslToRgb(merged);
    setHex(rgbToHex(toRgb));
  };

  return (
    <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 680 }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          rowGap: 8,
          minWidth: 0,
        }}
      >
        <input
          type="color"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          aria-label="color"
          style={{
            width: 48,
            height: 48,
            border: "none",
            padding: 0,
            background: "transparent",
          }}
        />
        <input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          aria-label="hex"
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            padding: "8px 10px",
            width: 140,
            minWidth: 120,
          }}
        />
        <div
          style={{
            padding: "4px 8px",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "invalid"}
        </div>
        <div
          style={{
            padding: "4px 8px",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "invalid"}
        </div>
      </div>

      {hsl && (
        <div style={{ display: "grid", gap: 8, width: "100%" }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Hue: {hsl.h}°</span>
            <input
              type="range"
              min={0}
              max={360}
              value={hsl.h}
              onChange={(e) => updateFromHsl({ h: Number(e.target.value) })}
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Saturation: {hsl.s}%</span>
            <input
              type="range"
              min={0}
              max={100}
              value={hsl.s}
              onChange={(e) => updateFromHsl({ s: Number(e.target.value) })}
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Lightness: {hsl.l}%</span>
            <input
              type="range"
              min={0}
              max={100}
              value={hsl.l}
              onChange={(e) => updateFromHsl({ l: Number(e.target.value) })}
            />
          </label>
        </div>
      )}
    </div>
  );
}
