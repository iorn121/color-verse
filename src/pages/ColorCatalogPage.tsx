import { useLoaderData, useNavigate } from 'react-router-dom';

import ColorSwatch from '../components/common/ColorSwatch';
import Description from '../components/common/Description';
import JisColorLabel from '../components/common/JisColorLabel';
import PageTitle from '../components/common/PageTitle';
import { GroupFilter, useColorSearch } from '../hooks/useColorSearch';
import type { JisColor } from '../lib/jisColors';
import { JisColorModel } from '../lib/jisColors';

export default function ColorCatalogPage() {
  const allColors = useLoaderData() as JisColor[];
  const navigate = useNavigate();
  const { filtered: colors, total, query, setQuery, group, setGroup } = useColorSearch(allColors);

  return (
    <div className="container animate-fade-in" style={{ display: 'grid', gap: 16 }}>
      <PageTitle title="色図鑑（JIS慣用色）" />
      <Description>検索やカテゴリで絞り込み、色の詳細と補色を確認できます。</Description>

      <div className="card" style={{ display: 'grid', gap: 12, padding: 12 }}>
        <div className="flex items-center gap-sm">
          <input
            aria-label="色名・Hex検索"
            placeholder="色名・Hexで検索…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input"
            style={{ flex: 1, minWidth: 160 }}
          />
          <select
            aria-label="分類フィルター"
            value={group}
            onChange={(e) => setGroup(e.target.value as GroupFilter)}
            className="input"
          >
            <option value="all">すべて</option>
            <option value="和色名">和色名</option>
            <option value="外来色名">外来色名</option>
          </select>
        </div>
        <div style={{ opacity: 0.7, fontSize: 12 }}>
          該当件数: {colors.length} / {total}
        </div>
      </div>

      <section style={{ display: 'grid', gap: 16 }}>
        <div
          style={{
            display: 'grid',
            gap: 8,
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
          }}
        >
          {colors.map((c) => (
            <button
              key={`${c.hex}|${c.name}`}
              onClick={() => navigate(`/colors/${JisColorModel.makeId(c)}`)}
              className="card"
              style={{
                display: 'grid',
                gap: 8,
                textAlign: 'left',
                padding: 12,
                border: '1px solid var(--color-border)',
              }}
              aria-pressed={undefined}
            >
              <ColorSwatch color={c.hex} />
              <JisColorLabel color={c} />
              <div style={{ opacity: 0.7, fontSize: 12 }}>{c.group}</div>
            </button>
          ))}
        </div>

        {/* 詳細は /colors/:id に遷移して表示 */}
      </section>
    </div>
  );
}
