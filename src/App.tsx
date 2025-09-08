import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast'; 

const HomePage = lazy(() => import('./pages/Home'));
const DetalhesPage = lazy(() => import('./pages/Detalhes'));

const AppRoutes = () => {
  const location = useLocation(); 

  return (

    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/pessoa/:id" element={<DetalhesPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1C1C1C', 
            color: '#E0E0E0', 
            border: '1px solid #2F2F2F', 
          },

          success: {
            iconTheme: {
              primary: '#00CC00',
              secondary: '#1C1C1C',
            },
          },

          error: {
            iconTheme: {
              primary: '#E50000',
              secondary: '#1C1C1C',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;