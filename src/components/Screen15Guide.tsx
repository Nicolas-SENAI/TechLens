import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  Store, 
  CheckCircle2, 
  ArrowRight,
  BatteryCharging,
  Bluetooth,
  Droplet,
  Mic,
  Tv,
  Plug,
  Zap,
  Gauge,
  Power,
  Headphones,
  Smartphone,
  Ruler,
  HelpCircle,
  Share2
} from 'lucide-react';
import { Device, ScreenId } from '../types';
import { speechService } from '../services/speechService';
import { saveHistory } from '../services/historyStorage';

interface Screen15GuideProps {
  device: Device;
  onOpenChat: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const Screen15Guide: React.FC<Screen15GuideProps> = ({
  device,
  onOpenChat,
  onNavigate,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'steps' | 'reviews' | 'prices'>('specs');

  // Save automatically to history upon opening the guide
  useEffect(() => {
    saveHistory(device, 'camera');
    setIsSaved(true);
  }, [device]);

  // Handle Speech Synthesis
  useEffect(() => {
    const unsubscribe = speechService.subscribe((speaking) => {
      setIsPlayingAudio(speaking);
    });
    return () => {
      unsubscribe();
      speechService.stop();
    };
  }, []);

  const toggleSpeech = () => {
    if (isPlayingAudio) {
      speechService.stop();
    } else {
      // Craft a warm, conversational spoken explanation
      const speechText = `
        Olá! Aqui está o guia simples do ${device.name}, conhecido como ${device.popularName}.
        Para que serve: ${device.shortSummary}.
        Dica de segurança: ${device.safeToUseSummary}.
        Primeiro passo de como usar: ${device.howToUseSteps[0]?.title}. ${device.howToUseSteps[0]?.description}.
        Se precisar tirar dúvidas, clique no botão do Chat com a Inteligência Artificial.
      `;
      speechService.speak(speechText);
    }
  };

  // Helper icon renderer
  const renderSpecIcon = (name: string) => {
    switch (name) {
      case 'BatteryCharging': return <BatteryCharging className="w-6 h-6 text-emerald-600" />;
      case 'Bluetooth': return <Bluetooth className="w-6 h-6 text-blue-600" />;
      case 'Droplet': return <Droplet className="w-6 h-6 text-cyan-600" />;
      case 'Mic': return <Mic className="w-6 h-6 text-purple-600" />;
      case 'Tv': return <Tv className="w-6 h-6 text-indigo-600" />;
      case 'Plug': return <Plug className="w-6 h-6 text-amber-600" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-500" />;
      case 'Gauge': return <Gauge className="w-6 h-6 text-red-500" />;
      case 'Power': return <Power className="w-6 h-6 text-slate-700" />;
      case 'Headphones': return <Headphones className="w-6 h-6 text-pink-600" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6 text-brand-blue" />;
      default: return <Sparkles className="w-6 h-6 text-brand-purple" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      
      {/* Device Header Card with Audio Reader */}
      <div className="bg-white rounded-2xl shadow-elevated border border-slate-200/90 overflow-hidden">
        
        <div className="flex flex-col md:flex-row">
          
          {/* Device Image */}
          <div className="md:w-5/12 relative aspect-[4/3] md:aspect-auto bg-slate-900">
            <img 
              src={device.imageUrl} 
              alt={device.name} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-3 left-3 bg-brand-green text-white text-xs font-black px-3 py-1 rounded-full shadow">
              {device.category}
            </div>
          </div>

          {/* Device Summary & Audio Button */}
          <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                Guia Explicativo Completo
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {device.name}
              </h1>
              <p className="text-sm sm:text-base font-semibold text-brand-blue mt-0.5">
                {device.popularName}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Fabricante / Família: {device.brand}
              </p>

              <p className="text-sm sm:text-base text-slate-700 mt-4 leading-relaxed font-medium">
                {device.shortSummary}
              </p>
            </div>

            {/* Audio Reader Button (RNF-01 Text-to-Speech) */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={toggleSpeech}
                className={`py-3.5 px-5 rounded-xl font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-3 shadow-md min-h-[50px] ${
                  isPlayingAudio
                    ? 'bg-brand-purple text-white hover:bg-brand-purple-dark ring-4 ring-brand-purple/20'
                    : 'bg-brand-blue hover:bg-brand-blue-hover text-white'
                }`}
                aria-label={isPlayingAudio ? 'Parar leitura por voz' : 'Ouvir explicação em voz alta'}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-5 h-5" />
                    <span>Pausar Leitura de Voz</span>
                    <div className="flex items-end gap-1 h-4">
                      <div className="w-1 bg-white animate-wave-1 rounded-full" />
                      <div className="w-1 bg-white animate-wave-2 rounded-full" />
                      <div className="w-1 bg-white animate-wave-3 rounded-full" />
                    </div>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" />
                    <span>Ouvir Explicação em Voz Alta</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onNavigate('SCREEN_11')}
                className="py-3.5 px-4 bg-purple-50 hover:bg-purple-100 text-brand-purple font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 border border-purple-200 min-h-[50px]"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Tirar Dúvida no Chat</span>
              </button>
            </div>

          </div>

        </div>

        {/* Safety Banner */}
        <div className="bg-emerald-50/80 px-6 py-3.5 border-t border-emerald-100 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-brand-green shrink-0" />
          <p className="text-xs sm:text-sm text-emerald-900 font-medium">
            <strong>Dica de segurança:</strong> {device.safeToUseSummary}
          </p>
        </div>

      </div>

      {/* Guide Tabs Navigation (Specs, How to use, Reviews, Prices) */}
      <div className="bg-white rounded-2xl p-1.5 shadow-soft border border-slate-200 flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('specs')}
          className={`flex-1 min-w-[120px] py-3 px-3 rounded-xl font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 min-h-[48px] ${
            activeTab === 'specs'
              ? 'bg-brand-blue text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>O que significa (Traduzido)</span>
        </button>

        <button
          onClick={() => setActiveTab('steps')}
          className={`flex-1 min-w-[120px] py-3 px-3 rounded-xl font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 min-h-[48px] ${
            activeTab === 'steps'
              ? 'bg-brand-blue text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Como Usar Passo a Passo</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 min-w-[120px] py-3 px-3 rounded-xl font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 min-h-[48px] ${
            activeTab === 'reviews'
              ? 'bg-brand-blue text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Opiniões Neutras</span>
        </button>

        <button
          onClick={() => setActiveTab('prices')}
          className={`flex-1 min-w-[120px] py-3 px-3 rounded-xl font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 min-h-[48px] ${
            activeTab === 'prices'
              ? 'bg-brand-blue text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Comparador de Preços</span>
        </button>
      </div>

      {/* Tab 1: Simplified Specifications (RF-06) */}
      {activeTab === 'specs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900">
              Dicionário do Aparelho: Do Técnico para o Português Claro
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {device.simplifiedSpecs.map((spec, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-soft hover:shadow-md transition space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    {renderSpecIcon(spec.iconName)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">
                      {spec.label}
                    </h4>
                    <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      No manual diz: {spec.techJargon}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  <strong>O que isso muda na sua vida:</strong> {spec.humanExplanation}
                </div>

                {spec.safetyTip && (
                  <div className="text-[11px] text-amber-800 bg-amber-50 rounded-lg p-2 border border-amber-200 flex items-center gap-1.5 font-semibold">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{spec.safetyTip}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Step-by-Step Usage Guide */}
      {activeTab === 'steps' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-200 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900">
              Como Ligar e Usar Pela Primeira Vez
            </h3>
            <p className="text-sm text-slate-600">
              Siga os passos na ordem. Você não vai quebrar nada!
            </p>
          </div>

          <div className="space-y-6">
            {device.howToUseSteps.map((step) => (
              <div key={step.step} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-brand-blue text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                  {step.step}
                </div>
                <div className="space-y-1.5 flex-1 pt-0.5">
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">
                    {step.title}
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {step.description}
                  </p>

                  {step.highlightTip && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple bg-purple-50 px-3 py-1 rounded-lg border border-purple-200">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{step.highlightTip}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Neutral Reviews Summary (RF-07) */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">
                O que as pessoas reais dizem sobre ele
              </h3>
              <p className="text-sm text-slate-600">
                Resumo baseado em {device.reviewsSummary.totalAnalyzed} avaliações públicas sem anúncios patrocinados.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-200 shrink-0">
              <div className="text-center">
                <span className="text-3xl font-black text-brand-green-dark">
                  {device.reviewsSummary.averageRating}
                </span>
                <span className="text-xs text-slate-500 block">de 5.0</span>
              </div>
              <div className="border-l border-emerald-300 pl-3 text-left">
                <span className="text-xs font-bold text-emerald-900 block">
                  {device.reviewsSummary.satisfactionRate}% de Aprovação
                </span>
                <span className="text-[11px] text-emerald-700">Compradores Satisfeitos</span>
              </div>
            </div>
          </div>

          {/* Independent Editorial Sources (PRD Section 4.3 & RF-07) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Opinião de Portais Independentes (Sem jabá ou anúncios)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {device.reviewsSummary.sources.map((s, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-brand-blue block">
                    {s.sourceName}
                  </span>
                  <p className="text-xs text-slate-700 font-medium">
                    "{s.verdict}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-brand-green font-bold text-base">
                <ThumbsUp className="w-5 h-5" />
                <span>Pontos Positivos</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-700 font-medium">
                {device.reviewsSummary.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-base">
                <ThumbsDown className="w-5 h-5" />
                <span>Pontos de Atenção</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-700 font-medium">
                {device.reviewsSummary.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Price Comparison (RF-08) */}
      {activeTab === 'prices' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Preços Encontrados na Internet
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <Clock className="w-4 h-4 text-brand-blue" />
                  <span>Última checagem: <strong>{device.priceData.lastUpdated}</strong></span>
                </div>
              </div>
              
              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-500 font-bold block">Faixa justa de preço:</span>
                <span className="text-xl font-extrabold text-brand-green-dark">
                  R$ {device.priceData.minPrice.toFixed(2)} — R$ {device.priceData.maxPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* List of Stores */}
            <div className="space-y-3 pt-2">
              {device.priceData.stores.map((store, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-50 hover:bg-blue-50/50 rounded-xl p-4 border border-slate-200 flex items-center justify-between gap-4 transition"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        {store.storeName}
                      </span>
                      {store.trustedBadge && (
                        <span className="text-[10px] font-bold text-brand-green bg-emerald-100 px-2 py-0.5 rounded-full">
                          Loja Confiável
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      Produto {store.condition} • Em Estoque
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-lg sm:text-xl font-black text-slate-900 block">
                      {store.currency} {store.price.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-brand-blue font-bold hover:underline cursor-pointer inline-flex items-center gap-1">
                      <span>Ver na loja</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Required RF-08 Price Caution Disclaimer */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>Aviso importante:</strong> Os preços podem mudar a qualquer momento. Confirme sempre o valor direto na loja antes de comprar.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Action Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-elevated border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <BookmarkCheck className="w-5 h-5 text-brand-green" />
          <span>Guia salvo automaticamente no seu <strong>Histórico Local</strong></span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('SCREEN_13')}
            className="flex-1 sm:flex-none px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs sm:text-sm transition min-h-[46px]"
          >
            Ver Histórico
          </button>
          <button
            onClick={onOpenChat}
            className="flex-1 sm:flex-none px-6 py-3 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 min-h-[46px]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Fazer uma Pergunta no Chat</span>
          </button>
        </div>
      </div>

    </div>
  );
};
