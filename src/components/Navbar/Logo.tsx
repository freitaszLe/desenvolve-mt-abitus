// src/components/Navbar/Logo.tsx

export const Logo = () => {
  return (
    <a 
      href="https://www.pjc.mt.gov.br/" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-center gap-3 group text-white"
    >
      <img
        src="/Logo_pjc.png"
        alt="Brasão da Polícia Judiciária Civil de MT"
        className="h-20 w-auto filter drop-shadow-[0_0_8px_rgba(229,0,0,0.4)]" // ALTERADO DE h-16 PARA h-20
      />
      <div className="hidden sm:flex flex-col">
        <span className="font-bold leading-tight group-hover:text-neon-red transition-colors text-xl">
          Polícia Judiciária Civil
        </span>
        <p className="text-sm text-text-muted leading-tight"> 
          Estado de Mato Grosso
        </p>
      </div>
    </a>
  );
};