import { Link } from 'react-router-dom';

import Description from '../components/common/Description';
import MainTitle from '../components/common/MainTitle';

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <MainTitle title="ColorVerse" />
      <Description>色の学習・ツール・分析を一体化したプラットフォーム</Description>
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
        <li>
          <Link to="/colors">色図鑑</Link>
        </li>
      </ul>
    </div>
  );
}
