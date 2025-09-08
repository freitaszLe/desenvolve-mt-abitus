import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPersonById, getInformacoesAdicionais, type Pessoa, type InformacaoAdicional } from '../../services/api';
import Navbar from '../../components/Navbar';
import SubmissionForm from '../../components/SubmissionForm';
import AnimatedPage from '../../components/AnimatedPage';
import ImageModal from '../../components/ImageModal';
import CollapsibleSection from '../../components/CollapsibleSection';
import type { ReactElement } from "react";

const InfoField = ({ icon, label, value }: { icon: ReactElement; label: string; value: string | number | null | undefined }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-4">
      <div className="text-neon-red flex-shrink-0 w-6 h-6 mt-1">{icon}</div>
      <div>
        <p className="text-text-muted text-sm font-semibold tracking-wider uppercase">{label}</p>
        <p className="text-text-light text-lg break-words">{value}</p>
      </div>
    </div>
  );
};

const DetalhesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [informacoesAdicionais, setInformacoesAdicionais] = useState<InformacaoAdicional[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  const carregarInformacoesAdicionais = useCallback(async (ocorrenciaId: number) => {
    try {
      const dados = await getInformacoesAdicionais(ocorrenciaId);
      setInformacoesAdicionais(dados);
    } catch (err) {
      console.error("Falha ao carregar informações adicionais.", err);
    }
  }, []);

  useEffect(() => {
    if (!id) { setError("ID inválido."); setLoading(false); return; }
    const carregarDadosDaPessoa = async () => {
      try { setLoading(true); const pessoaId = parseInt(id, 10); const dados = await getPersonById(pessoaId); if (dados) { setPessoa(dados); carregarInformacoesAdicionais(dados.ultimaOcorrencia.ocoId); } else { setError("Pessoa não encontrada."); } } catch (err) { setError("Falha ao carregar os dados da pessoa."); } finally { setLoading(false); }
    };
    carregarDadosDaPessoa();
  }, [id, carregarInformacoesAdicionais]);

  const openGallery = (index: number) => {
    setGalleryInitialIndex(index);
    setIsGalleryOpen(true);
  };

  if (loading) { return ( <> <Navbar /> <AnimatedPage><div className="text-center mt-20">Carregando detalhes...</div></AnimatedPage> </> ) }
  if (error || !pessoa) { return ( <> <Navbar /> <AnimatedPage><div className="text-red-500 text-center mt-20"> <p>{error || "Ocorreu um erro."}</p> <button onClick={() => navigate('/')} className="mt-4 text-blue-400">Voltar</button> </div></AnimatedPage> </> ); }
  
  const status = pessoa.ultimaOcorrencia.dataLocalizacao || pessoa.ultimaOcorrencia.encontradoVivo ? 'LOCALIZADO' : 'DESAPARECIDO';
  const todasAsImagens = [pessoa.urlFoto, ...(pessoa.ultimaOcorrencia.listaCartaz?.map(cartaz => cartaz.urlCartaz) || [])].filter(Boolean) as string[];

  return (
    <AnimatedPage>
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-text-muted hover:text-text-light mb-8 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          Voltar para a Lista
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 flex-shrink-0">
            <div className="bg-dark-card border border-dark-border rounded-lg shadow-xl p-6 flex flex-col items-center text-center sticky top-24">
              <button onClick={() => openGallery(0)} className="w-full transition-transform hover:scale-105 duration-300">
                <img src={pessoa.urlFoto} alt={`Foto de ${pessoa.nome}`} className="w-full rounded-lg object-cover border-4 border-dark-border shadow-lg"/>
              </button>
              <h1 className="text-3xl font-bold text-white break-words mt-4">{pessoa.nome}</h1>
              <span className={`mt-4 w-full text-center px-4 py-2 rounded-md text-lg font-bold ${ status === 'DESAPARECIDO' ? 'bg-neon-red text-white drop-shadow-[0_0_8px_rgba(229,0,0,0.7)] animate-pulse' : 'bg-neon-green text-white drop-shadow-[0_0_8px_rgba(0,204,0,0.7)]' }`}>
                {status}
              </span>
            </div>
          </div>

          <div className="lg:w-2/3 flex flex-col space-y-6">
            <CollapsibleSection title="Detalhes da Ocorrência" defaultOpen={true}>
              <div className="space-y-6">
                <InfoField icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>} label="ID da Ocorrência" value={pessoa.ultimaOcorrencia.ocoId} />
                <InfoField icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>} label="Data do Desaparecimento" value={new Date(pessoa.ultimaOcorrencia.dtDesaparecimento).toLocaleDateString()} />
                {status === 'LOCALIZADO' && <InfoField icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>} label="Data da Localização" value={pessoa.ultimaOcorrencia.dataLocalizacao ? new Date(pessoa.ultimaOcorrencia.dataLocalizacao).toLocaleDateString() : 'N/A'} />}
                <InfoField icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>} label="Último Local Visto" value={pessoa.ultimaOcorrencia.localDesaparecimentoConcat} />
                <InfoField icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v-1h8v1zM4 8a2 2 0 11-4 0 2 2 0 014 0zM16 15a4 4 0 00-8 0v-1h8v1z" /></svg>} label="Vestimentas" value={pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.vestimentasDesaparecido} />
                <InfoField icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>} label="Observações da Ocorrência" value={pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.informacao} />
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Dados Pessoais" defaultOpen={false}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <InfoField icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>} label="Idade" value={`${pessoa.idade} anos`} />
                <InfoField icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015.5-4.93A5 5 0 0111 16v1a1 1 0 01-1 1H1a1 1 0 01-1-1v-1a5 5 0 016-5z" /></svg>} label="Sexo" value={pessoa.sexo ? pessoa.sexo.charAt(0).toUpperCase() + pessoa.sexo.slice(1).toLowerCase() : 'Não informado'}/>
                {status === 'LOCALIZADO' && ( <InfoField icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>} label="Status Vital" value={pessoa.vivo ? 'Encontrado(a) Vivo(a)' : 'Encontrado(a) sem vida'} /> )}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Cartazes Oficiais" defaultOpen={false}>
              {pessoa.ultimaOcorrencia.listaCartaz && pessoa.ultimaOcorrencia.listaCartaz.length > 0 ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  {pessoa.ultimaOcorrencia.listaCartaz.map((cartaz, index) => (
                    <a href={cartaz.urlCartaz} target="_blank" rel="noopener noreferrer" key={index} className="text-blue-400 hover:text-blue-300 hover:underline bg-gray-cyber/50 px-3 py-2 rounded-md transition-colors text-center">
                      Ver {cartaz.tipoCartaz.replace('_', ' ')}
                    </a>
                  ))}
                </div>
              ) : <p className="text-text-muted">Nenhum cartaz oficial disponível para esta ocorrência.</p>}
            </CollapsibleSection>
            
            <button onClick={() => setIsModalOpen(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-300">
              Registrar Nova Informação
            </button>

            {informacoesAdicionais.length > 0 && (
              <div className="mt-8">
                <CollapsibleSection title="Informações Adicionais Recebidas" defaultOpen={true}>
                  <div className="space-y-6">
                    {informacoesAdicionais.map((info) => (
                      <div key={info.id} className="bg-dark-bg border border-dark-border rounded-lg p-6 relative">
                        <span className="absolute top-3 right-4 text-xs font-mono text-text-muted bg-dark-card px-2 py-1 rounded-full border border-dark-border">
                          ID: {info.id}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <InfoField 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>}
                            label="Data do Registro"
                            value={new Date(info.data).toLocaleDateString()}
                          />
                        </div>
                        <div className="mt-6">
                          <InfoField 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>}
                            label="Informação Registrada"
                            value={info.informacao}
                          />
                        </div>
                        {info.anexos && info.anexos.length > 0 && (
                          <div className="mt-6">
                            <p className="text-text-muted text-sm font-semibold tracking-wider uppercase mb-2">Anexos Enviados</p>
                            <div className="flex flex-wrap gap-4">
                              {info.anexos.map((anexoUrl, index) => (
                                <a href={anexoUrl} target="_blank" rel="noopener noreferrer" key={index}>
                                  <img 
                                    src={anexoUrl} 
                                    alt={`Anexo ${index + 1}`} 
                                    className="w-28 h-28 rounded-md object-cover border-2 border-dark-border hover:border-neon-red transition-all" 
                                  />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              </div>
            )}
          </div>
        </div>
      </main>

      {isModalOpen && (<SubmissionForm personName={pessoa.nome} ocorrenciaId={pessoa.ultimaOcorrencia.ocoId} onClose={() => setIsModalOpen(false)} onSuccess={() => carregarInformacoesAdicionais(pessoa.ultimaOcorrencia.ocoId)} />)}
      {isGalleryOpen && (<ImageModal images={todasAsImagens} initialIndex={galleryInitialIndex} onClose={() => setIsGalleryOpen(false)} />)}
    </AnimatedPage>
  );
};

export default DetalhesPage;