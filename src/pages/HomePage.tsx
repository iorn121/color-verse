import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <h1 className="gradient-text">ColorVerse</h1>
      <p style={{ margin: 0 }}>色の学習・ツール・分析を一体化したプラットフォーム</p>
      <ul style={{ display: 'grid', gap: 8 }}>
        <li>
          <Link to="/picker">カラーピッカー</Link>
        </li>
        <li>
          <Link to="/convert">Hex/RGB/HSL 変換</Link>
        </li>
        <li>
          <Link to="/theory">基本的な色彩理論</Link>
        </li>
        <li>
          <Link to="/image">画像の色調補正（明度・彩度・コントラスト）</Link>
        </li>
        <li>
          <Link to="/camera">カメラ連携色ピッカー</Link>
        </li>
        <li>
          <Link to="/color-quiz">JIS慣用色クイズ</Link>
        </li>
      </ul>
    </div>
  );
}
