import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import RootLayout from './layouts/RootLayout';
import ConvertPage from './pages/ConvertPage';
import HomePage from './pages/HomePage';
import ImageAdjustPage from './pages/ImageAdjustPage';
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
    </Route>,
  ),
);
