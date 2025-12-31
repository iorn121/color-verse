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
              to="/theory"
              title="基本的な色彩理論"
              description="色相・補色・トーンなど色の基礎をハンズオンで理解"
              colors={['#ef4444', '#22c55e', '#3b82f6', '#f97316']}
            />
          </ul>
        </section>

        <section>
          <h2 style={{ margin: '8px 0' }}>遊ぶ</h2>
          <ul className="list-disc list-inside" style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            <PaletteListItem
              to="/color-quiz"
              title="JIS慣用色クイズ"
              description="色名→色、色→色名を当てるクイズで知識を深める"
              colors={['#f472b6', '#fb923c', '#60a5fa', '#22c55e']}
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
              colors={['#4ade80', '#22c55e', '#16a34a', '#65a30d']}
            />
            <PaletteListItem
              to="/colors"
              title="色図鑑"
              description="JIS 慣用色を一覧・検索し、詳細情報を確認"
              colors={[
                '#ef4444',
                '#f59e0b',
                '#eab308',
                '#22c55e',
                '#06b6d4',
                '#3b82f6',
                '#8b5cf6',
                '#ec4899',
              ]}
            />
          </ul>
        </section>

        <section>
          <h2 style={{ margin: '8px 0' }}>ツール</h2>
          <ul className="list-disc list-inside" style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            <PaletteListItem
              to="/picker"
              title="カラーピッカー"
              description="直感的に色を選択し、HEX/RGB/HSL を取得"
              colors={[
                '#ef4444',
                '#f59e0b',
                '#eab308',
                '#22c55e',
                '#06b6d4',
                '#3b82f6',
                '#8b5cf6',
                '#ec4899',
              ]}
            />
            <PaletteListItem
              to="/convert"
              title="Hex/RGB/HSL 変換"
              description="HEX・RGB・HSL を相互に素早く変換"
              colors={['#0ea5e9', '#22d3ee', '#818cf8', '#64748b']}
            />
            <PaletteListItem
              to="/image"
              title="画像の色調補正"
              description="明度・彩度・コントラストを調整して仕上がりを確認"
              colors={['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa']}
            />
          </ul>
        </section>
      </div>
    </div>
  );
}
