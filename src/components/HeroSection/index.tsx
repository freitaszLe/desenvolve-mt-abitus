import SearchForm from '../SearchForm';
import type { FiltrosBusca } from '../../services/api';
import { useState } from 'react';

interface HeroSectionProps {
  onSearch: (filtros: FiltrosBusca) => void;
}

const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const [showFilters, setShowFilters] = useState(true);

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <section className="relative text-center py-16 md:py-24 overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-neon-red drop-shadow-[0_0_15px_rgba(229,0,0,0.8)] mb-4 animate-pulse-slow">
          SISTEMA DE BUSCA
        </h1>
        <p className="text-lg md:text-xl text-text-light mb-8">
          Polícia Judiciária Civil - Divisão de Pessoas Desaparecidas
        </p>

        <div className="max-w-4xl mx-auto px-4"> 
          <button
            onClick={handleToggleFilters}
            className="mb-4 inline-flex items-center px-6 py-3 border border-dark-border rounded-lg text-text-muted hover:text-text-light hover:border-neon-red/50 bg-dark-card/70 backdrop-blur-sm transition-all duration-300 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 mr-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : 'rotate-0'}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
            {showFilters ? 'Fechar Filtros' : 'Abrir Filtros'}
          </button>

          {showFilters && (
            <SearchForm onSearch={onSearch} />
          )}
        </div>
      </div>
      
      <div className="absolute inset-0 z-0 opacity-10">
      </div>
    </section>
  );
};

export default HeroSection;