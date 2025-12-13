import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import PickerPage from "./pages/PickerPage";
import ConvertPage from "./pages/ConvertPage";
import TheoryPage from "./pages/TheoryPage";
import ImageAdjustPage from "./pages/ImageAdjustPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<HomePage />} />
      <Route path="picker" element={<PickerPage />} />
      <Route path="convert" element={<ConvertPage />} />
      <Route path="theory" element={<TheoryPage />} />
      <Route path="image" element={<ImageAdjustPage />} />
    </Route>
  )
);
