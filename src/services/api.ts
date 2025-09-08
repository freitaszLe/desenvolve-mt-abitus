import axios from 'axios';
import { type SubmissionFormData } from '../components/SubmissionForm';

const api = axios.create({
  baseURL: 'https://abitus-api.geia.vip/v1',
});

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
export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
export interface FiltrosBusca {
  pagina?: number;
  porPagina?: number;
  nome?: string;
  status?: 'DESAPARECIDO' | 'LOCALIZADO' | '';
  sexo?: 'MASCULINO' | 'FEMININO' | '';
  faixaIdadeInicial?: number;
  faixaIdadeFinal?: number;
}

export interface InformacaoAdicional {
  id: number;
  informacao: string;
  data: string;
  anexos: string[];
}

export const login = async () => {
  try {
    const response = await api.post('/login', {
      login: 'admin',
      password: 'admin'
    });
    const token = response.data.accessToken;
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return token;
  } catch (error) {
    console.error("FALHA NA AUTENTICAÇÃO:", error);

    delete api.defaults.headers.common['Authorization'];
    throw error;
  }
};

export const getPessoas = async (filtros: FiltrosBusca): Promise<PaginatedResponse<Pessoa>> => {
  const params = {
    pagina: filtros.pagina || 0,
    porPagina: filtros.porPagina || 12,
    nome: filtros.nome || '',
    status: filtros.status || '', 
    sexo: filtros.sexo || '',     
    faixaIdadeInicial: filtros.faixaIdadeInicial || 0,
    faixaIdadeFinal: filtros.faixaIdadeFinal || 120,
  };

  try {
    const response = await api.get('/pessoas/aberto/filtro', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pessoas na API:', error);
    throw error;
  }
};

export const getPersonById = async (id: number): Promise<Pessoa> => {
  try {
    const response = await api.get(`/pessoas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar pessoa com ID ${id}:`, error);
    throw error;
  }
};

export const getInformacoesAdicionais = async (ocorrenciaId: number): Promise<InformacaoAdicional[]> => {
  try {
    const response = await api.get('/ocorrencias/informacoes-desaparecido', {
      params: { ocorrenciaId }
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar informações para ocorrência ${ocorrenciaId}:`, error);
    throw error;
  }
};

export const postNovaInformacao = async (ocorrenciaId: number, data: SubmissionFormData, formData: FormData) => {
  try {
    const informacaoCompleta = `Local: ${data.localizacao}. Observações: ${data.observacoes}`;
    
    const params = {
      ocoId: ocorrenciaId,
      informacao: informacaoCompleta,
      data: data.dataAvistamento.split('/').reverse().join('-'),
      descricao: 'Anexo de cidadão',
    };

    // A chamada agora envia o formData que veio pronto do componente
    const response = await api.post('/ocorrencias/informacoes-desaparecido', formData, { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar nova informação:', error);
    throw error;
  }
};


export default api;