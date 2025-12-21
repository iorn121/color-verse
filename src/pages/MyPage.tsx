import { useMemo } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

import ColorSwatch from '../components/common/ColorSwatch';
import Description from '../components/common/Description';
import FavoriteButton from '../components/common/FavoriteButton';
import HomeLink from '../components/common/HomeLink';
import JisColorLabel from '../components/common/JisColorLabel';
import PageTitle from '../components/common/PageTitle';
import { useFavorites } from '../hooks/useFavorites';
import type { JisColor } from '../lib/jisColors';
import { JisColorModel } from '../lib/jisColors';

export default function MyPage() {
  const navigate = useNavigate();
  const { set } = useFavorites();
  const loaded = useLoaderData() as JisColor[] | null;
  const hexToColor = useMemo(() => {
    const list = loaded ?? [];
    const map = new Map<string, JisColor>();
    for (const c of list) {
      if (!map.has(c.hex)) map.set(c.hex, c);
    }
    return map;
  }, [loaded]);

  const list = useMemo(() => Array.from(set).sort(), [set]);

  return (
    <div className="container animate-fade-in" style={{ display: 'grid', gap: 16 }}>
      <PageTitle title="マイページ" />
      <Description>あなたの設定やお気に入りをまとめて確認できます。</Description>

      <section className="card" style={{ padding: 12, display: 'grid', gap: 12 }}>
        <div style={{ fontWeight: 700 }}>お気に入り</div>
        {list.length === 0 ? (
          <div style={{ color: 'var(--color-text-secondary)' }}>
            まだお気に入りがありません。各ページのハートから登録できます。
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: 12,
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
            }}
          >
            {list.map((hex) => {
              const c = hexToColor.get(hex);
              return (
                <div
                  key={hex}
                  className="card"
                  style={{
                    padding: 12,
                    display: 'grid',
                    gap: 8,
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{hex}</div>
                    <FavoriteButton hex={hex} />
                  </div>
                  <ColorSwatch color={hex} height={80} />
                  {c ? (
                    <button
                      className="btn"
                      onClick={() => navigate(`/colors/${JisColorModel.makeId(c)}`)}
                      style={{ width: 'fit-content' }}
                    >
                      <JisColorLabel color={c} />
                    </button>
                  ) : (
                    <div style={{ opacity: 0.7, fontSize: 12 }}>JISに対応する色名はありません</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <HomeLink fixed />
    </div>
  );
}
