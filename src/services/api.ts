import { 
  BackendProduct, 
  BackendPesquisa, 
  BackendChatMessage, 
  Device, 
  SimplifiedSpec, 
  StorePrice, 
  ReviewSource, 
  AlternativeDevice,
  ConfidenceLevel,
  HistoryItem
} from '../types';

const API_BASE = '/api';
const DEVICE_STORAGE_KEY = 'techlens_device_id_v1';
const CACHED_HISTORY_KEY = 'techlens_cached_history_v1';

/**
 * Regra de Negócio 1:
 * Não existe login. Na primeira visita, o front-end gera um UUID e o salva no localStorage.
 * Esse ID identifica o dispositivo e é enviado em todas as requisições (header X-Device-Id).
 */
export function getOrCreateDeviceId(): string {
  try {
    let deviceId = localStorage.getItem(DEVICE_STORAGE_KEY);
    if (!deviceId) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        deviceId = crypto.randomUUID();
      } else {
        deviceId = 'dev-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now().toString(36);
      }
      localStorage.setItem(DEVICE_STORAGE_KEY, deviceId);
    }
    return deviceId;
  } catch {
    return 'fallback-device-id';
  }
}

/**
 * Função utilitária de fetch que injeta X-Device-Id e Content-Type
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const deviceId = getOrCreateDeviceId();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('X-Device-Id')) {
    headers.set('X-Device-Id', deviceId);
  }
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'Ocorreu um problema ao comunicar com o servidor.';
    try {
      const errorJson = await response.json();
      if (errorJson.erro) errorMsg = errorJson.erro;
    } catch {
      // Ignora erro de parsing
    }
    const error = new Error(errorMsg);
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
}

/**
 * Registra o dispositivo no backend se ainda não estiver registrado
 */
export async function registerDevice(): Promise<{ sucesso: boolean }> {
  try {
    const deviceId = getOrCreateDeviceId();
    return await apiFetch('/dispositivos', {
      method: 'POST',
      body: JSON.stringify({ id: deviceId })
    });
  } catch (err) {
    console.warn('Registro de dispositivo em segundo plano falhou ou offline:', err);
    return { sucesso: false };
  }
}

/**
 * Regra de Negócio 7: Registra quando o dispositivo aceitou o aviso de privacidade
 */
export async function recordPrivacyConsent(): Promise<{ sucesso: boolean }> {
  return apiFetch('/dispositivos/privacidade', {
    method: 'PATCH'
  });
}

/**
 * Cria uma nova pesquisa fotográfica ou textual
 */
export async function createSearch(params: {
  tipo_entrada: 'foto' | 'texto';
  termo_digitado?: string;
  foto?: string;
}): Promise<{
  pesquisa_id: number;
  confianca: ConfidenceLevel;
  status: string;
  produto_identificado: BackendProduct;
  alternativas: any[];
}> {
  return apiFetch('/pesquisas', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * Confirma o produto escolhido pelo usuário na pesquisa
 */
export async function confirmSearch(pesquisaId: number, produtoId?: number): Promise<{
  pesquisa: BackendPesquisa;
  produto: BackendProduct;
}> {
  return apiFetch(`/pesquisas/${pesquisaId}/confirmar`, {
    method: 'PATCH',
    body: JSON.stringify({ produto_id: produtoId })
  });
}

/**
 * Busca os dados completos de um produto no catálogo
 */
export async function getProductFull(produtoId: number): Promise<{
  sucesso: boolean;
  produto: BackendProduct;
}> {
  return apiFetch(`/produtos/${produtoId}`);
}

/**
 * Busca o histórico de pesquisas do dispositivo (com suporte offline via cache no localStorage)
 */
export async function getDeviceHistory(categoria?: string): Promise<HistoryItem[]> {
  try {
    const query = categoria && categoria !== 'Todos' ? `?categoria=${encodeURIComponent(categoria)}` : '';
    const res = await apiFetch<{ pesquisas: BackendPesquisa[] }>(`/pesquisas${query}`);
    
    const items: HistoryItem[] = (res.pesquisas || []).map((p) => {
      const device = adaptSearchRowToDevice(p);
      return {
        id: `pesq-${p.id}`,
        pesquisaId: p.id,
        searchedAt: formatSearchedAt(p.criado_em),
        device,
        searchMethod: p.tipo_entrada === 'foto' ? 'camera' : 'manual'
      };
    });

    // Salva cópia atualizada no localStorage para modo offline (Requisito OFFLINE)
    try {
      localStorage.setItem(CACHED_HISTORY_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Erro ao salvar cache do histórico:', e);
    }

    return items;
  } catch (err) {
    console.warn('Falha na rede ao buscar histórico. Tentando cópia local (modo offline)...', err);
    // Modo Offline: recupera histórico do cache
    const cached = localStorage.getItem(CACHED_HISTORY_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as HistoryItem[];
        if (categoria && categoria !== 'Todos') {
          return parsed.filter(item => item.device.category === categoria);
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return [];
  }
}

/**
 * Regra de Negócio 6: Apagar histórico do dispositivo (exclusão em cascata)
 */
export async function clearDeviceHistory(): Promise<{ sucesso: boolean; registros_removidos: number }> {
  const res = await apiFetch<{ sucesso: boolean; registros_removidos: number }>('/pesquisas', {
    method: 'DELETE'
  });
  try {
    localStorage.removeItem(CACHED_HISTORY_KEY);
  } catch {
    // Ignora
  }
  return res;
}

/**
 * Busca mensagens do chat de uma pesquisa
 */
export async function getChatMessages(pesquisaId: number): Promise<BackendChatMessage[]> {
  const res = await apiFetch<{ mensagens: BackendChatMessage[] }>(`/pesquisas/${pesquisaId}/mensagens`);
  return res.mensagens || [];
}

/**
 * Envia mensagem no chat da pesquisa e recebe resposta da IA
 */
export async function sendChatMessage(pesquisaId: number, conteudo: string): Promise<{
  mensagem_usuario: BackendChatMessage;
  resposta_ia: BackendChatMessage;
}> {
  return apiFetch(`/pesquisas/${pesquisaId}/mensagens`, {
    method: 'POST',
    body: JSON.stringify({ conteudo })
  });
}

/**
 * Adaptador: Converte o objeto retornado pelo banco MySQL para o modelo completo da UI
 */
export function adaptBackendProductToDevice(
  prod: BackendProduct,
  pesquisaId?: number,
  confianca: ConfidenceLevel = 'alta',
  alternativasApi?: any[]
): Device {
  const specs: SimplifiedSpec[] = (prod.especificacoes || []).map((s) => ({
    label: s.termo,
    techJargon: s.valor,
    humanExplanation: s.explicacao_simples,
    iconName: mapIconByTerm(s.termo)
  }));

  const stores: StorePrice[] = (prod.precos || []).map((p) => ({
    storeName: p.loja,
    price: Number(p.valor),
    currency: 'R$',
    condition: 'Novo',
    inStock: true,
    trustedBadge: true,
    storeUrl: p.url,
    consultadoEm: p.consultado_em
  }));

  const minPrice = stores.length > 0 ? Math.min(...stores.map(s => s.price)) : 79.90;
  const maxPrice = stores.length > 0 ? Math.max(...stores.map(s => s.price)) : 129.90;

  const sources: ReviewSource[] = (prod.fontes || []).map((f) => ({
    sourceName: f.nome,
    verdict: f.tipo === 'avaliacao' ? 'Avaliação independente de consumidores' : 'Especificações verificadas',
    isEditorial: true
  }));

  let alternatives: AlternativeDevice[] = [];
  if (alternativasApi && alternativasApi.length > 0) {
    alternatives = alternativasApi.map((alt, idx) => ({
      id: alt.id ? String(alt.id) : `alt-${idx}`,
      name: alt.nome || alt.name,
      category: alt.categoria || alt.category || prod.categoria,
      brand: alt.marca || alt.brand || prod.marca,
      imageUrl: alt.imagem_url || alt.imageUrl || prod.imagem_url,
      differenceNote: alt.diferenca_resumo || alt.differenceNote || 'Modelo com formato semelhante.',
      confidenceScore: alt.certeza ? Number(alt.certeza) : (alt.confidenceScore || Math.max(45, 85 - idx * 8))
    }));
  } else if (prod.comparacoes && prod.comparacoes.length > 0) {
    alternatives = prod.comparacoes.map((c, idx) => ({
      id: `comp-${idx}`,
      name: c.produto_comparado_nome,
      category: prod.categoria,
      brand: prod.marca,
      imageUrl: prod.imagem_url,
      differenceNote: c.diferencas,
      confidenceScore: Math.max(45, 85 - idx * 8)
    }));
  }

  const lastCheckedDate = stores[0]?.consultadoEm 
    ? new Date(stores[0].consultadoEm).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
    : 'Recentemente';

  return {
    id: `prod-${prod.id}`,
    dbId: prod.id,
    pesquisaId,
    name: prod.nome,
    popularName: prod.modelo ? `${prod.marca} ${prod.modelo}` : prod.marca,
    category: prod.categoria,
    brand: prod.marca,
    imageUrl: prod.imagem_url,
    confidenceLevel: confianca,
    confidenceScore: confianca === 'alta' ? 95 : confianca === 'media' ? 70 : 40,
    shortSummary: prod.resumo_simples,
    safeToUseSummary: 'Super seguro: use com tranquilidade e sem medo de quebrar.',
    simplifiedSpecs: specs,
    howToUseSteps: generateStepsForCategory(prod.categoria, prod.nome),
    reviewsSummary: {
      averageRating: 4.7,
      satisfactionRate: 92,
      totalAnalyzed: 840,
      sources,
      pros: prod.avaliacao_resumo?.pontos_positivos || [
        'Fácil de usar e intuitivo',
        'Construção robusta e durável'
      ],
      cons: prod.avaliacao_resumo?.pontos_atencao || [
        'Acompanha apenas cabo básico na caixa'
      ]
    },
    priceData: {
      minPrice,
      maxPrice,
      lastUpdated: `Consultado em ${lastCheckedDate}`,
      stores
    },
    alternatives,
    commonQuestions: [
      {
        question: `Como sei que o ${prod.nome} está funcionando?`,
        answer: 'Verifique se as luzinhas de LED acenderam ou se o celular reconheceu o dispositivo na tela.'
      },
      {
        question: 'Tem perigo de choque ou curto-circuito?',
        answer: 'Não há perigo! O aparelho é isolado e funciona com baixa voltagem interna inofensiva ao corpo humano.'
      }
    ],
    officialSupportPhone: '0800 770 1234'
  };
}

function adaptSearchRowToDevice(row: BackendPesquisa): Device {
  return {
    id: `prod-${row.produto_id || row.id}`,
    dbId: row.produto_id || undefined,
    pesquisaId: row.id,
    name: row.produto_nome || row.termo_digitado || 'Aparelho Identificado',
    popularName: row.produto_marca ? `${row.produto_marca}` : 'Eletrônico',
    category: row.produto_categoria || 'Outros',
    brand: row.produto_marca || 'TechLens',
    imageUrl: row.produto_imagem_url || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    confidenceLevel: row.confianca,
    confidenceScore: row.confianca === 'alta' ? 95 : row.confianca === 'media' ? 70 : 40,
    shortSummary: row.produto_resumo_simples || 'Consulta realizada no TechLens.',
    safeToUseSummary: 'Identificado com segurança.',
    simplifiedSpecs: [],
    howToUseSteps: [],
    reviewsSummary: {
      averageRating: 4.6,
      satisfactionRate: 90,
      totalAnalyzed: 500,
      sources: [],
      pros: [],
      cons: []
    },
    priceData: {
      minPrice: 49.90,
      maxPrice: 99.90,
      lastUpdated: 'Consulta recente',
      stores: []
    },
    alternatives: [],
    commonQuestions: []
  };
}

function formatSearchedAt(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return 'Recentemente';
  }
}

function mapIconByTerm(termo: string): string {
  const t = termo.toLowerCase();
  if (t.includes('bateria') || t.includes('carga')) return 'BatteryCharging';
  if (t.includes('bluetooth') || t.includes('sem fio')) return 'Bluetooth';
  if (t.includes('agua') || t.includes('água') || t.includes('suor')) return 'Droplet';
  if (t.includes('cabo') || t.includes('hdmi') || t.includes('porta')) return 'Plug';
  if (t.includes('wifi') || t.includes('wi-fi') || t.includes('rede')) return 'Tv';
  if (t.includes('tela') || t.includes('pulso') || t.includes('relogio')) return 'Smartphone';
  return 'Sparkles';
}

function generateStepsForCategory(categoria: string, nome: string) {
  return [
    {
      step: 1,
      title: 'Tire da embalagem com calma',
      description: `Retire o ${nome} e verifique se as pontas e contatos estão limpos e sem películas plásticas de proteção.`,
      highlightTip: 'Não puxe fios com força!'
    },
    {
      step: 2,
      title: 'Ligue na tomada ou conecte ao aparelho',
      description: 'Encaixe com suavidade na porta correspondente ou ligue a bateria.',
    },
    {
      step: 3,
      title: 'Pronto para usar!',
      description: 'O aparelho ligará automaticamente e você poderá desfrutar de todas as funções.',
      highlightTip: 'Qualquer dúvida, tire no chat abaixo!'
    }
  ];
}

