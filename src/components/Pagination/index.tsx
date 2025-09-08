interface PaginationProps {
  paginaAtual: number;
  totalPaginas: number;
  onPageChange: (novaPagina: number) => void;
}

const Pagination = ({ paginaAtual, totalPaginas, onPageChange }: PaginationProps) => {

  if (totalPaginas <= 1) {
    return null; 
  }

  const irParaPaginaAnterior = () => {
    if (paginaAtual > 0) {
      onPageChange(paginaAtual - 1);
    }
  };

  const irParaProximaPagina = () => {
    if (paginaAtual < totalPaginas - 1) {
      onPageChange(paginaAtual + 1);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 my-8">
      <button
          onClick={irParaPaginaAnterior}
          disabled={paginaAtual === 0}
          className="bg-dark-card hover:bg-gray-cyber text-neon-red font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed border border-dark-border hover:border-neon-red/50"
      >
          Anterior
      </button>

      <span className="text-text-muted text-lg">
          Página {paginaAtual + 1} de {totalPaginas}
      </span>

      <button
          onClick={irParaProximaPagina}
          disabled={paginaAtual >= totalPaginas - 1}
          className="bg-dark-card hover:bg-gray-cyber text-neon-red font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed border border-dark-border hover:border-neon-red/50"
      >
          Próximo
      </button>
    </div>
  );
};

export default Pagination;