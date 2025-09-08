// Importamos os tipos do arquivo da API real para garantir 100% de consistência
import type { Pessoa, PaginatedResponse, FiltrosBusca } from './api';

// Uma base de dados falsa, mas realista, para nossos testes e desenvolvimento offline
const allMockPessoas: Pessoa[] = [
  { 
    id: 1, nome: 'João da Silva', idade: 32, sexo: 'MASCULINO', vivo: true, urlFoto: 'https://i.pravatar.cc/150?img=1', 
    ultimaOcorrencia: { 
      dtDesaparecimento: '2024-05-10', dataLocalizacao: null, encontradoVivo: false, ocoId: 101,
      localDesaparecimentoConcat: 'Centro - Cuiabá/MT',
      ocorrenciaEntrevDesapDTO: { informacao: 'Visto pela última vez perto do mercado municipal, aparentava estar desorientado.', vestimentasDesaparecido: 'Camiseta azul e calça jeans' },
      listaCartaz: [{ urlCartaz: '#', tipoCartaz: 'PDF_DESAPARECIDO' }, { urlCartaz: '#', tipoCartaz: 'IMAGEM_DESAPARECIDO' }]
    } 
  },
  { 
    id: 3, nome: 'Pedro Martins', idade: 45, sexo: 'MASCULINO', vivo: true, urlFoto: 'https://i.pravatar.cc/150?img=3', 
    ultimaOcorrencia: { 
      dtDesaparecimento: '2024-01-01', dataLocalizacao: '2024-02-15', encontradoVivo: true, ocoId: 103,
      localDesaparecimentoConcat: 'Jardim das Américas - Cuiabá/MT',
      ocorrenciaEntrevDesapDTO: { informacao: 'Encontrado em bom estado na casa de parentes.', vestimentasDesaparecido: 'Não informado' },
      listaCartaz: [] 
    } 
  },
  // Adicionei mais alguns exemplos ricos em detalhes...
  { 
    id: 4, nome: 'Ana Souza', idade: 19, sexo: 'FEMININO', vivo: true, urlFoto: 'https://i.pravatar.cc/150?img=4', 
    ultimaOcorrencia: { 
      dtDesaparecimento: '2024-07-11', dataLocalizacao: null, encontradoVivo: false, ocoId: 104,
      localDesaparecimentoConcat: 'Rodoviária - Várzea Grande/MT',
      ocorrenciaEntrevDesapDTO: { informacao: 'Pode estar tentando viajar para outro estado.', vestimentasDesaparecido: 'Moletom cinza e tênis branco' },
      listaCartaz: [{ urlCartaz: '#', tipoCartaz: 'PDF_DESAPARECIDO' }]
    } 
  },
  { 
    id: 2029, nome: 'JOÃO DA SILVA E SOUZA', idade: 35, sexo: 'MASCULINO', vivo: false, urlFoto: 'https://i.pravatar.cc/150?img=5', 
    ultimaOcorrencia: { 
      dtDesaparecimento: '2025-02-17', dataLocalizacao: '2025-03-01', encontradoVivo: false, ocoId: 105,
      localDesaparecimentoConcat: 'Jardim das Acácias - Brasiléia/SP',
      ocorrenciaEntrevDesapDTO: { informacao: 'Encontrado sem vida.', vestimentasDesaparecido: 'Camisa branca e jeans' },
      listaCartaz: []
    } 
  },
];


// Função que simula a API de lista
export const getPessoas = async (filtros: FiltrosBusca): Promise<PaginatedResponse<Pessoa>> => {
  console.log("CHAMANDO MOCK API com filtros:", filtros);
  const pagina = filtros.pagina || 0;
  const porPagina = filtros.porPagina || 12;

  // Lógica de filtragem no lado do cliente
  const dadosFiltrados = allMockPessoas.filter(pessoa => {
    const nomeMatch = !filtros.nome || pessoa.nome.toLowerCase().includes(filtros.nome.toLowerCase());

    if (!filtros.status) {
      return nomeMatch;
    }

    const statusReal = pessoa.ultimaOcorrencia.dataLocalizacao || pessoa.ultimaOcorrencia.encontradoVivo 
      ? 'LOCALIZADO' 
      : 'DESAPARECIDO';

    const statusMatch = statusReal === filtros.status;

    return nomeMatch && statusMatch;
  });

  // Lógica de paginação
  const inicio = pagina * porPagina;
  const fim = inicio + porPagina;
  const dadosPaginados = dadosFiltrados.slice(inicio, fim);

  const resposta: PaginatedResponse<Pessoa> = {
    content: dadosPaginados,
    totalPages: Math.ceil(dadosFiltrados.length / porPagina),
    totalElements: dadosFiltrados.length,
    number: pagina,
    size: porPagina,
  };

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(resposta);
    }, 500); // Atraso de 0.5 segundos para simular a rede
  });
};

// Função que simula a busca por um ID específico
export const getPersonById = async (id: number): Promise<Pessoa | undefined> => {
  console.log(`MOCK: Buscando pessoa com ID: ${id}`);
  const pessoa = allMockPessoas.find(p => p.id === id);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(pessoa);
    }, 300);
  });
};

interface OcorrenciaEntrevDesapDTO {
  informacao: string | null;
  vestimentasDesaparecido: string | null;
}

interface OcorrenciaCartazDTO {
  urlCartaz: string;
  tipoCartaz: string;
}

interface UltimaOcorrencia {
  dtDesaparecimento: string;
  dataLocalizacao: string | null;
  encontradoVivo: boolean;
  localDesaparecimentoConcat: string | null;
  ocorrenciaEntrevDesapDTO: OcorrenciaEntrevDesapDTO | null;
  listaCartaz: OcorrenciaCartazDTO[] | null;
  ocoId: number;
  status?: 'DESAPARECIDO' | 'LOCALIZADO'; 
}

export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
  sexo: 'MASCULINO' | 'FEMININO';
  vivo: boolean;
  urlFoto: string;
  ultimaOcorrencia: UltimaOcorrencia;
}