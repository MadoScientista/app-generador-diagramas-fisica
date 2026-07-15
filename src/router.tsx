import { Routes, Route } from 'react-router-dom';
import { PageLayout } from './ui/components/layout/PageLayout.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { MRUGeneratorPage } from './pages/MRUGeneratorPage.tsx';
import { MRUV2GeneratorPage } from './pages/MRUV2GeneratorPage.tsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="generador/mru" element={<MRUGeneratorPage />} />
        <Route path="generador/mru-v2" element={<MRUV2GeneratorPage />} />
      </Route>
    </Routes>
  );
}
