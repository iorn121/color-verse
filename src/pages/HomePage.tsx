import { useTranslation } from 'react-i18next';

import MainTitle from '../components/common/MainTitle';
import MyPageHighlight from '../components/common/MyPageHighlight';
import PaletteListItem from '../components/common/PaletteListItem';

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="animate-fade-in">
      <MainTitle title="ColorVerse" />

      <div style={{ display: 'grid', gap: 24, marginTop: 16 }}>
        <MyPageHighlight />

        <section>
          <h2 style={{ margin: '8px 0' }}>{t('pages.home.sections.learn')}</h2>
          <ul className="list-disc list-inside" style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            <PaletteListItem
              to="/camera-cvd"
              title={t('pages.home.items.cameraCvd.title')}
              description={t('pages.home.items.cameraCvd.desc')}
            />
            <PaletteListItem
              to="/theory"
              title={t('pages.home.items.theory.title')}
              description={t('pages.home.items.theory.desc')}
            />
          </ul>
        </section>

        <section>
          <h2 style={{ margin: '8px 0' }}>{t('pages.home.sections.play')}</h2>
          <ul className="list-disc list-inside" style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            <PaletteListItem
              to="/color-quiz"
              title={t('pages.home.items.quiz.title')}
              description={t('pages.home.items.quiz.desc')}
            />
            <PaletteListItem
              to="/prismatrix"
              title={t('pages.home.items.prismatrix.title')}
              description={t('pages.home.items.prismatrix.desc')}
            />
          </ul>
        </section>

        <section>
          <h2 style={{ margin: '8px 0' }}>{t('pages.home.sections.search')}</h2>
          <ul className="list-disc list-inside" style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            <PaletteListItem
              to="/camera"
              title={t('pages.home.items.camera.title')}
              description={t('pages.home.items.camera.desc')}
            />
            <PaletteListItem
              to="/colors"
              title={t('pages.home.items.colors.title')}
              description={t('pages.home.items.colors.desc')}
            />
          </ul>
        </section>

        <section>
          <h2 style={{ margin: '8px 0' }}>{t('pages.home.sections.tools')}</h2>
          <ul className="list-disc list-inside" style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            <PaletteListItem
              to="/picker"
              title={t('pages.home.items.picker.title')}
              description={t('pages.home.items.picker.desc')}
            />
            <PaletteListItem
              to="/convert"
              title={t('pages.home.items.convert.title')}
              description={t('pages.home.items.convert.desc')}
            />
            <PaletteListItem
              to="/image"
              title={t('pages.home.items.image.title')}
              description={t('pages.home.items.image.desc')}
            />
          </ul>
        </section>
      </div>
    </div>
  );
}
