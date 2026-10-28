import React, { useState } from 'react';
import { 
  AlertCircle, 
  Sun, 
  Coffee, 
  HelpCircle, 
  WifiOff, 
  ServerCrash, 
  Camera, 
  Search, 
  History, 
  RefreshCw, 
  ArrowLeft,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { DiagnosticScenario, ScreenId } from '../types';

interface Screen07DiagnosticsProps {
  initialScenario?: DiagnosticScenario;
  onNavigate: (screen: ScreenId) => void;
  onRetryCamera: () => void;
  onManualSearch: () => void;
}

export const Screen07Diagnostics: React.FC<Screen07DiagnosticsProps> = ({
  initialScenario = 'dark_photo',
  onNavigate,
  onRetryCamera,
  onManualSearch,
}) => {
  const [currentScenario, setCurrentScenario] = useState<DiagnosticScenario>(initialScenario);

  const scenarios: { id: DiagnosticScenario; label: string; icon: any }[] = [
    { id: 'dark_photo', label: '1. Foto Escura / Embaçada', icon: Sun },
    { id: 'non_electronic', label: '2. Objeto Não Eletrônico', icon: Coffee },
    { id: 'not_identified', label: '3. Aparelho Desconhecido', icon: HelpCircle },
    { id: 'no_internet', label: '4. Sem Internet', icon: WifiOff },
    { id: 'service_down', label: '5. Instabilidade no Servidor', icon: ServerCrash },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-brand-blue text-xs font-bold">
          <AlertCircle className="w-4 h-4 text-brand-blue" />
          <span>Central de Diagnóstico & Apoio Humanizado</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Algo não saiu como esperado? Nós ajudamos você!
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Sem códigos complicados como "Erro 404" ou "Timeout". Veja as soluções simples para cada caso:
        </p>
      </div>

      {/* Interactive Scenario Selector Pills */}
      <div className="bg-white rounded-2xl p-2 shadow-soft border border-slate-200">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
          Simulador de Cenários de Diagnóstico (PRD RF-04 & SCREEN_7):
        </span>
        <div className="flex flex-wrap gap-1.5 p-1">
          {scenarios.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentScenario(s.id)}
                className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 min-h-[44px] ${
                  currentScenario === s.id
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenario Content Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-elevated border-2 border-slate-200 space-y-6">
        
        {/* Scenario 1: Dark or Blurry Photo */}
        {currentScenario === 'dark_photo' && (
          <div className="text-center space-y-5 animate-in fade-in">
            <div className="w-18 h-18 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
              <Sun className="w-9 h-9" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-black text-slate-900">
                A foto ficou um pouquinho escura ou fora de foco
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Para identificar os pequenos furinhos e letras dos cabos, nossa inteligência artificial precisa de um pouco mais de luz natural ou lâmpada acesa.
              </p>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-left max-w-md mx-auto text-xs sm:text-sm text-amber-950 space-y-2">
              <strong className="block text-amber-900">Como acertar de primeira:</strong>
              <ul className="list-disc list-inside space-y-1">
                <li>Acenda a luz do cômodo ou chegue perto da janela</li>
                <li>Apoie o cabo ou aparelho sobre uma mesa fixa</li>
                <li>Segure o celular com as duas mãos por 2 segundos antes de tirar a foto</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={onRetryCamera}
                className="px-6 py-3.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Camera className="w-5 h-5" />
                <span>Tirar Outra Foto Mais Clara</span>
              </button>
              <button
                onClick={onManualSearch}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Search className="w-5 h-5" />
                <span>Digitar o Nome</span>
              </button>
            </div>
          </div>
        )}

        {/* Scenario 2: Non Electronic Item */}
        {currentScenario === 'non_electronic' && (
          <div className="text-center space-y-5 animate-in fade-in">
            <div className="w-18 h-18 rounded-3xl bg-purple-100 text-brand-purple flex items-center justify-center mx-auto shadow-sm">
              <Coffee className="w-9 h-9" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-black text-slate-900">
                Ops! Isso não parece ser um aparelho eletrônico
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Nossa visão computacional identificou que este objeto parece uma xícara, caderno ou utensílio doméstico. O TechLens é especialista em cabos, carregadores e eletrônicos!
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 text-left max-w-md mx-auto text-xs sm:text-sm text-purple-950 space-y-1.5">
              <strong className="block text-brand-purple">O que o TechLens reconhece melhor:</strong>
              <p>Cabos HDMI, fones de ouvido Bluetooth, carregadores de celular, controles remotos, adaptadores e receptores de TV.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={onRetryCamera}
                className="px-6 py-3.5 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Camera className="w-5 h-5" />
                <span>Fotografar um Eletrônico</span>
              </button>
            </div>
          </div>
        )}

        {/* Scenario 3: Not Identified / Rare device */}
        {currentScenario === 'not_identified' && (
          <div className="text-center space-y-5 animate-in fade-in">
            <div className="w-18 h-18 rounded-3xl bg-blue-100 text-brand-blue flex items-center justify-center mx-auto shadow-sm">
              <HelpCircle className="w-9 h-9" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-black text-slate-900">
                Não conseguimos ter certeza sobre este modelo
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Pode ser um aparelho muito antigo ou um modelo importado pouco comum no Brasil. Mas não desista, nós podemos achar juntos!
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left max-w-md mx-auto text-xs sm:text-sm text-slate-800 space-y-2">
              <strong className="block text-slate-900">Dica prática:</strong>
              <p>Olhe embaixo ou atrás do aparelho. Quase sempre existe uma etiqueta pequena com o nome da marca (ex: Samsung, Multilaser, Philips) ou código de modelo.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={onManualSearch}
                className="px-6 py-3.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Search className="w-5 h-5" />
                <span>Digitar o que está escrito na etiqueta</span>
              </button>
            </div>
          </div>
        )}

        {/* Scenario 4: No Internet */}
        {currentScenario === 'no_internet' && (
          <div className="text-center space-y-5 animate-in fade-in">
            <div className="w-18 h-18 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
              <WifiOff className="w-9 h-9" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-black text-slate-900">
                Parece que sua conexão caiu no momento
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Não se preocupe: você ainda pode consultar todos os manuais e guias que já pesquisou antes no seu histórico local sem gastar internet.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => onNavigate('SCREEN_13')}
                className="px-6 py-3.5 bg-brand-green hover:bg-brand-green-dark text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 min-h-[48px]"
              >
                <History className="w-5 h-5" />
                <span>Acessar Histórico Offline</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 min-h-[48px]"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Testar Conexão Novamente</span>
              </button>
            </div>
          </div>
        )}

        {/* Scenario 5: Service instability */}
        {currentScenario === 'service_down' && (
          <div className="text-center space-y-5 animate-in fade-in">
            <div className="w-18 h-18 rounded-3xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-sm">
              <ServerCrash className="w-9 h-9" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-black text-slate-900">
                Nosso assistente está um pouco sobrecarregado
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Muitas pessoas estão consultando aparelhos neste instante. Aguarde alguns segundinhos e tente clicar de novo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={onRetryCamera}
                className="px-6 py-3.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 min-h-[48px]"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Tentar Novamente Agora</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
