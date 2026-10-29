import React, { useState, useEffect } from 'react';
import { 
  History, 
  Trash2, 
  Search, 
  Sparkles, 
  WifiOff, 
  ArrowRight, 
  Clock, 
  AlertTriangle, 
  FolderX,
  Camera,
  Layers,
  RefreshCw
} from 'lucide-react';
import { Device, HistoryItem, ScreenId } from '../types';
import { getDeviceHistory, clearDeviceHistory, getProductFull, adaptBackendProductToDevice } from '../services/api';

interface Screen13HistoryProps {
  onSelectDevice: (device: Device) => void;
  onNavigate: (screen: ScreenId) => void;
  isOnline: boolean;
}

export const Screen13History: React.FC<Screen13HistoryProps> = ({
  onSelectDevice,
  onNavigate,
  isOnline,
}) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [showClearModal, setShowClearModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const items = await getDeviceHistory(selectedCategory);
      setHistoryItems(items);
    } catch (err) {
      console.warn('Erro ao carregar histórico:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [selectedCategory]);

  const handleClearConfirm = async () => {
    try {
      await clearDeviceHistory();
      setHistoryItems([]);
      setShowClearModal(false);
    } catch (err) {
      console.error('Erro ao apagar histórico:', err);
    }
  };

  const handleItemClick = async (item: HistoryItem) => {
    if (item.device.dbId) {
      try {
        const res = await getProductFull(item.device.dbId);
        if (res.produto) {
          const fullDevice = adaptBackendProductToDevice(res.produto, item.pesquisaId, item.device.confidenceLevel);
          onSelectDevice(fullDevice);
          return;
        }
      } catch (err) {
        console.warn('Não foi possível carregar produto completo via API (offline), abrindo dados locais:', err);
      }
    }
    onSelectDevice(item.device);
  };

  const categories = ['Todos', 'Áudio', 'Cabos & Conectores', 'Redes & Conectividade', 'Vestíveis & Saúde', 'Outros'];

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch = 
      item.device.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.device.popularName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.device.category.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Top Banner if Offline (RF-11 / Requisito OFFLINE) */}
      {!isOnline && (
        <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-300 text-amber-950 flex items-start gap-3 shadow-soft">
          <WifiOff className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm sm:text-base">
              Você está navegando no Modo Offline (Sem Internet)
            </h4>
            <p className="text-xs sm:text-sm text-amber-900">
              Exibindo histórico salvo localmente no seu navegador. Novas buscas fotográficas e cotações exigem conexão com a internet.
            </p>
          </div>
        </div>
      )}

      {/* Title & Clear History Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-brand-blue flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Histórico de Pesquisas
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Seus aparelhos consultados ficam salvos de forma segura para você rever quando quiser.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={() => setShowClearModal(true)}
            className="self-start sm:self-auto px-4 py-2.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition flex items-center gap-2 min-h-[44px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>Apagar Todo o Histórico</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-soft border border-slate-200 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filtrar por nome do aparelho (ex: Fone, HDMI, Roteador, Relógio...)"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-brand-blue text-sm font-medium outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition min-h-[36px] ${
                selectedCategory === cat
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 flex flex-col items-center gap-2">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-blue" />
          <span>Carregando histórico do banco de dados...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FolderX className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Nenhum aparelho encontrado
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {searchFilter
                ? 'Tente pesquisar com outras palavras.'
                : 'Você ainda não possui pesquisas salvas neste dispositivo.'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('SCREEN_21')}
            className="px-6 py-3 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold text-sm shadow-md transition inline-flex items-center gap-2 min-h-[48px]"
          >
            <Camera className="w-4 h-4" />
            <span>Identificar um Aparelho Agora</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-brand-blue shadow-soft hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex gap-4">
                <img
                  src={item.device.imageUrl}
                  alt={item.device.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80';
                  }}
                  className="w-24 h-24 rounded-xl object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple">
                      {item.device.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Confiança: {item.device.confidenceLevel}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-1">
                    {item.device.name}
                  </h3>
                  <p className="text-xs font-semibold text-brand-blue line-clamp-1">
                    {item.device.popularName}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {item.device.shortSummary}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.searchedAt}</span>
                </span>
                <span className="font-bold text-brand-blue group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  <span>Abrir Guia Completo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2-Step Clear History Modal (RF-10) */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">
                Tem certeza que deseja apagar?
              </h3>
              <p className="text-sm text-slate-600">
                Essa ação não pode ser desfeita. Todas as pesquisas e conversas salvas para este dispositivo serão apagadas do banco de dados.
              </p>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="w-1/2 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm min-h-[48px]"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearConfirm}
                className="w-1/2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md min-h-[48px]"
              >
                Sim, Apagar Tudo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
