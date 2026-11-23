import type { ComponentType } from 'react';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';

import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';

type PageModule = { default: ComponentType };

function lazyPage(load: () => Promise<PageModule>) {
  return () => load().then((module) => ({ Component: module.default }));
}

function lazyColorPage(load: () => Promise<PageModule>, withId = false) {
  return async () => {
    const [{ default: Component }, { JisColorModel }] = await Promise.all([
      load(),
      import('./lib/jisColors'),
    ]);
    if (!withId) {
      return { Component, loader: () => JisColorModel.loadAll() };
    }
    return {
      Component,
      loader: async ({ params }: { params: { id?: string } }) => {
        const colors = await JisColorModel.loadAll();
        const id = params.id ?? '';
        return colors.find((color) => JisColorModel.makeId(color) === id) || null;
      },
    };
  };
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />} />
      <Route path="picker" lazy={lazyPage(() => import('./pages/PickerPage'))} />
      <Route path="convert" lazy={lazyPage(() => import('./pages/ConvertPage'))} />
      <Route path="compare" lazy={lazyPage(() => import('./pages/ComparePage'))} />
      <Route path="theory" lazy={lazyPage(() => import('./pages/TheoryPage'))} />
      <Route path="image" lazy={lazyPage(() => import('./pages/ImageAdjustPage'))} />
      <Route path="color-analysis" lazy={lazyPage(() => import('./pages/ColorAnalysisPage'))} />
      <Route path="camera" lazy={lazyPage(() => import('./pages/CameraPage'))} />
      <Route path="camera-cvd" lazy={lazyPage(() => import('./pages/CameraCvdPage'))} />
      <Route path="color-quiz" lazy={lazyColorPage(() => import('./pages/ColorQuizPage'))} />
      <Route path="prismatrix" lazy={lazyPage(() => import('./pages/PrismatrixPage'))} />
      <Route path="filter-tiles" element={<Navigate to="/prismatrix" replace />} />
      <Route path="colors" lazy={lazyColorPage(() => import('./pages/ColorCatalogPage'))} />
      <Route path="me" lazy={lazyColorPage(() => import('./pages/MyPage'))} />
      <Route
        path="colors/:id"
        lazy={lazyColorPage(() => import('./pages/ColorDetailPage'), true)}
      />
    </Route>,
  ),
  { basename: import.meta.env.BASE_URL },
);
