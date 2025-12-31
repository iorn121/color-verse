import MainTitle from '../components/common/MainTitle';
import MyPageHighlight from '../components/common/MyPageHighlight';
import PaletteListItem from '../components/common/PaletteListItem';

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <MainTitle title="ColorVerse" />

      <div style={{ display: 'grid', gap: 24, marginTop: 16 }}>
        <MyPageHighlight />

        <section>
          <h2 style={{ margin: '8px 0' }}>学ぶ</h2>
          <ul className="list-disc list-inside" style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            <PaletteListItem
              to="/camera-cvd"
              title="色覚シミュレーション"
              description="カメラ映像で色覚特性を体験"
            />
            <PaletteListItem
              to="/theory"
              title="基本的な色彩理論"
              description="色相・補色・トーンをハンズオンで理解"
            />
          </ul>
        </section>

        <section>
          <h2 style={{ margin: '8px 0' }}>遊ぶ</h2>
          <ul className="list-disc list-inside" style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            <PaletteListItem
              to="/color-quiz"
              title="JIS慣用色クイズ"
              description="クイズで色の名前を覚えよう"
            />
          </ul>
        </section>

        <section>
          <h2 style={{ margin: '8px 0' }}>探す</h2>
          <ul className="list-disc list-inside" style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            <PaletteListItem
              to="/camera"
              title="カメラピッカー"
              description="カメラ映像から色をリアルタイムで採取"
            />
            <PaletteListItem to="/colors" title="色図鑑" description="JIS 慣用色を一覧・検索" />
          </ul>
        </section>

        <section>
          <h2 style={{ margin: '8px 0' }}>ツール</h2>
          <ul className="list-disc list-inside" style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            <PaletteListItem
              to="/picker"
              title="カラーピッカー"
              description="直感的に色を選択し、HEX/RGB/HSL を取得"
            />
            <PaletteListItem
              to="/convert"
              title="Hex/RGB/HSL 変換"
              description="HEX・RGB・HSL を相互に素早く変換"
            />
            <PaletteListItem
              to="/image"
              title="画像の色調補正"
              description="明度・彩度・コントラストを調整"
            />
          </ul>
        </section>
      </div>
    </div>
  );
}
