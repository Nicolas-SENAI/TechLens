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

export type ConfidenceLevel = 'high' | 'medium' | 'low';

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
}

export interface AlternativeDevice {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  differenceNote: string;
}

export interface Device {
  id: string;
  name: string;
  popularName: string;
  category: 'Áudio' | 'Cabos & Conectores' | 'Carregadores & Energia' | 'TV & Vídeo' | 'Outros';
  brand: string;
  imageUrl: string;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number; // e.g. 94%
  shortSummary: string;
  safeToUseSummary: string;
  simplifiedSpecs: SimplifiedSpec[];
  howToUseSteps: HowToUseStep[];
  reviewsSummary: {
    averageRating: number;
    satisfactionRate: number; // e.g. 92%
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
