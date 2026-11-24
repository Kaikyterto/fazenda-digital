import React from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AnimaisPage } from './pages/AnimaisPage';
import { OrdenhasPage } from './pages/OrdenhasPage'; 
import { Logo } from './components/Logo';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 pb-12">
      <nav className="bg-white border-b-2 border-zinc-900 px-6 py-4 mb-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo clicável usando onClick para evitar conflitos de tag <a> aninhada */}
          <div onClick={() => navigate('/animais')} className="cursor-pointer inline-flex items-center">
            <Logo size="lg" />
          </div>
          
          <div className="flex gap-3">
            <Link 
              to="/animais" 
              className={`px-4 py-2 font-bold text-sm border-2 border-zinc-900 rounded-lg shadow-[2px_2px_0px_0px_#18181b] ${
                location.pathname === '/animais' ? 'bg-emerald-600 text-white' : 'bg-white text-zinc-900'
              }`}
            >
              Animais
            </Link>
            <Link 
              to="/ordenhas" 
              className={`px-4 py-2 font-bold text-sm border-2 border-zinc-900 rounded-lg shadow-[2px_2px_0px_0px_#18181b] ${
                location.pathname === '/ordenhas' ? 'bg-emerald-600 text-white' : 'bg-white text-zinc-900'
              }`}
            >
              Ordenhas
            </Link>
          </div>
        </div>
      </nav>

      {/* Definição das Rotas */}
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/animais" replace />} />
          <Route path="/animais" element={<AnimaisPage />} />
          <Route path="/ordenhas" element={<OrdenhasPage />} />
        </Routes>
      </main>
    </div>
  );
}