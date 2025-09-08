import { useState } from 'react';
import type { FiltrosBusca } from '../../services/api';

type StatusOption = 'DESAPARECIDO' | 'LOCALIZADO' | '';
type SexoOption = 'MASCULINO' | 'FEMININO' | '';

interface SearchFormProps {
  onSearch: (filtros: FiltrosBusca) => void;
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [nome, setNome] = useState('');
  const [status, setStatus] = useState<StatusOption>('');
  const [sexo, setSexo] = useState<SexoOption>('');
  const [idadeMin, setIdadeMin] = useState<number | ''>('');
  const [idadeMax, setIdadeMax] = useState<number | ''>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch({ 
      nome, 
      status, 
      sexo, 
      faixaIdadeInicial: idadeMin === '' ? undefined : idadeMin, 
      faixaIdadeFinal: idadeMax === '' ? undefined : idadeMax 
    });
  };

  return (
    <div className="bg-dark-card p-6 rounded-lg shadow-xl mb-8 border border-dark-border">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

        <div className="flex flex-col lg:col-span-2">
          <label htmlFor="nome" className="mb-1 text-sm font-semibold text-text-muted">Nome</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome..."
            className="bg-gray-cyber border border-dark-border rounded-md p-2 text-text-light focus:outline-none focus:ring-2 focus:ring-neon-red focus:border-transparent"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-semibold text-text-muted">Faixa Etária</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={idadeMin} 
              onChange={(e) => setIdadeMin(e.target.value === '' ? '' : Number(e.target.value))} 
              placeholder="Mín." 
              className="w-full bg-gray-cyber border border-dark-border rounded-md p-2 text-text-light focus:outline-none focus:ring-2 focus:ring-neon-red focus:border-transparent"
            />
            <input 
              type="number" 
              value={idadeMax} 
              onChange={(e) => setIdadeMax(e.target.value === '' ? '' : Number(e.target.value))} 
              placeholder="Máx." 
              className="w-full bg-gray-cyber border border-dark-border rounded-md p-2 text-text-light focus:outline-none focus:ring-2 focus:ring-neon-red focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="status" className="mb-1 text-sm font-semibold text-text-muted">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusOption)}
            className="bg-gray-cyber border border-dark-border rounded-md p-2 text-text-light focus:outline-none focus:ring-2 focus:ring-neon-red focus:border-transparent h-full"
          >
            <option value="">Todos</option>
            <option value="DESAPARECIDO">Desaparecido</option>
            <option value="LOCALIZADO">Localizado</option>
          </select>
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="sexo" className="mb-1 text-sm font-semibold text-text-muted">Sexo</label>
          <select 
            id="sexo" 
            value={sexo} 
            onChange={(e) => setSexo(e.target.value as SexoOption)} 
            className="bg-gray-cyber border border-dark-border rounded-md p-2 text-text-light focus:outline-none focus:ring-2 focus:ring-neon-red focus:border-transparent h-full"
          >
            <option value="">Ambos</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
          </select>
        </div>

        <div className="flex items-end md:col-start-auto lg:col-start-5">
          <button
            type="submit"
            className="w-full bg-neon-red hover:bg-neon-red-dark text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-neon-red focus:ring-opacity-75 h-full"
          >
            Buscar
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;