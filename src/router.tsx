import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import RootLayout from './layouts/RootLayout';
import { JisColorModel } from './lib/jisColors';
import CameraCvdPage from './pages/CameraCvdPage';
import CameraPage from './pages/CameraPage';
import ColorCatalogPage from './pages/ColorCatalogPage';
import ColorDetailPage from './pages/ColorDetailPage';
import ColorQuizPage from './pages/ColorQuizPage';
import ConvertPage from './pages/ConvertPage';
import HomePage from './pages/HomePage';
import ImageAdjustPage from './pages/ImageAdjustPage';
import MyPage from './pages/MyPage';
import PickerPage from './pages/PickerPage';
import TheoryPage from './pages/TheoryPage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />} />
      <Route path="picker" element={<PickerPage />} />
      <Route path="convert" element={<ConvertPage />} />
      <Route path="theory" element={<TheoryPage />} />
      <Route path="image" element={<ImageAdjustPage />} />
      <Route path="camera" element={<CameraPage />} />
      <Route path="camera-cvd" element={<CameraCvdPage />} />
      <Route path="color-quiz" element={<ColorQuizPage />} loader={() => JisColorModel.loadAll()} />
      <Route path="colors" element={<ColorCatalogPage />} loader={() => JisColorModel.loadAll()} />
      <Route path="me" element={<MyPage />} loader={() => JisColorModel.loadAll()} />
      <Route
        path="colors/:id"
        element={<ColorDetailPage />}
        loader={async ({ params }) => {
          const colors = await JisColorModel.loadAll();
          const id = params.id ?? '';
          return colors.find((c) => JisColorModel.makeId(c) === id) || null;
        }}
      />
    </Route>,
  ),
  { basename: import.meta.env.BASE_URL },
);
