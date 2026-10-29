export type ScreenId =
  | 'SCREEN_21' // Início e Captura de Imagem
  | 'SCREEN_19' // Analisando Aparelho com IA
  | 'SCREEN_17' // Confirmação do Aparelho (Alta Certeza)
  | 'SCREEN_3'  // Confirmação (Baixa Certeza)
  | 'SCREEN_9'  // Buscando Informações do Aparelho
  | 'SCREEN_15' // Guia Completo e Traduzido
  | 'SCREEN_11' // Tire suas Dúvidas (Chat IA)
  | 'SCREEN_13' // Histórico de Pesquisas
  | 'SCREEN_5'  // Privacidade e Proteção de Dados
  | 'SCREEN_7'; // Central de Diagnóstico & Erros

export type ConfidenceLevel = 'alta' | 'media' | 'baixa';

export interface BackendEspecificacao {
  id: number;
  termo: string;
  valor: string;
  explicacao_simples: string;
}

export interface BackendAvaliacaoResumo {
  id: number;
  pontos_positivos: string[];
  pontos_atencao: string[];
  gerado_em: string;
}

export interface BackendFonte {
  id: number;
  tipo: 'avaliacao' | 'especificacao';
  nome: string;
  url: string;
}

export interface BackendComparacao {
  id: number;
  produto_comparado_nome: string;
  preco_referencia: number;
  diferencas: string;
  resumo: string;
}

export interface BackendPreco {
  id: number;
  loja: string;
  valor: number | string;
  url: string;
  consultado_em: string;
}

export interface BackendProduct {
  id: number;
  nome: string;
  marca: string;
  modelo: string | null;
  categoria: string;
  imagem_url: string;
  resumo_simples: string;
  especificacoes?: BackendEspecificacao[];
  avaliacao_resumo?: BackendAvaliacaoResumo | null;
  fontes?: BackendFonte[];
  comparacoes?: BackendComparacao[];
  precos?: BackendPreco[];
  criado_em?: string;
}

export interface BackendPesquisa {
  id: number;
  dispositivo_id: string;
  produto_id: number | null;
  tipo_entrada: 'foto' | 'texto';
  termo_digitado: string | null;
  confianca: ConfidenceLevel;
  status: 'identificado' | 'confirmado' | 'nao_identificado' | 'erro';
  criado_em: string;
  produto_nome?: string;
  produto_marca?: string;
  produto_categoria?: string;
  produto_imagem_url?: string;
  produto_resumo_simples?: string;
}

export interface BackendChatMessage {
  id: number;
  pesquisa_id: number;
  autor: 'usuario' | 'ia';
  conteudo: string;
  criado_em: string;
}

export interface SimplifiedSpec {
  label: string;
  techJargon: string;
  humanExplanation: string;
  iconName: string;
  safetyTip?: string;
}

export interface HowToUseStep {
  step: number;
  title: string;
  description: string;
  highlightTip?: string;
}

export interface ReviewSource {
  sourceName: string;
  verdict: string;
  isEditorial: boolean;
}

export interface StorePrice {
  storeName: string;
  price: number;
  currency: string;
  condition: 'Novo' | 'Reembalado';
  inStock: boolean;
  trustedBadge: boolean;
  storeUrl?: string;
  consultadoEm?: string;
}

export interface AlternativeDevice {
  id: string;
  name: string;
  category: string;
  brand?: string;
  imageUrl: string;
  differenceNote: string;
  confidenceScore?: number;
}

export interface Device {
  id: string;
  dbId?: number;
  pesquisaId?: number;
  name: string;
  popularName: string;
  category: string;
  brand: string;
  imageUrl: string;
  confidenceLevel: ConfidenceLevel;
  confidenceScore?: number;
  shortSummary: string;
  safeToUseSummary: string;
  simplifiedSpecs: SimplifiedSpec[];
  howToUseSteps: HowToUseStep[];
  reviewsSummary: {
    averageRating: number;
    satisfactionRate: number;
    totalAnalyzed: number;
    sources: ReviewSource[];
    pros: string[];
    cons: string[];
  };
  priceData: {
    minPrice: number;
    maxPrice: number;
    lastUpdated: string;
    stores: StorePrice[];
  };
  alternatives: AlternativeDevice[];
  commonQuestions: {
    question: string;
    answer: string;
  }[];
  officialSupportPhone?: string;
}

export interface HistoryItem {
  id: string;
  pesquisaId?: number;
  searchedAt: string;
  device: Device;
  thumbnailUrl?: string;
  searchMethod: 'camera' | 'upload' | 'manual';
}

export type DiagnosticScenario =
  | 'dark_photo'
  | 'non_electronic'
  | 'not_identified'
  | 'no_internet'
  | 'service_down';
