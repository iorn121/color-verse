export default function TheoryPage() {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 840 }}>
      <h2 style={{ margin: 0 }} className="secondary-gradient-text">
        基本的な色彩理論（概要）
      </h2>
      <p style={{ margin: 0 }}>
        ここでは色相環、補色、類似色、三原色、RGB/CMYK
        の違い、色温度などの基礎を順次掲載していきます
      </p>
      <ul>
        <li>色相環とハーモニー: モノクロマティック、アナロガス、コンプリメンタリー</li>
        <li>RGB（加法混色）と CMYK（減法混色）の違い</li>
        <li>色温度（暖色・寒色）と印象</li>
      </ul>
    </div>
  );
}
