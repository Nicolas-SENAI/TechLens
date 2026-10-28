import React from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck, 
  Layers,
  ChevronRight,
  Search
} from 'lucide-react';
import { Device, ScreenId } from '../types';

interface Screen17ConfirmHighProps {
  device: Device;
  onConfirm: () => void;
  onRejectToAlternatives: () => void;
  onRetake: () => void;
  onManualSearch: () => void;
}

export const Screen17ConfirmHigh: React.FC<Screen17ConfirmHighProps> = ({
  device,
  onConfirm,
  onRejectToAlternatives,
  onRetake,
  onManualSearch,
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Confidence Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold tracking-wide">
          <CheckCircle2 className="w-4 h-4 text-brand-green" />
          <span>Alta chance de ser este ({device.confidenceScore}% de certeza)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Encontramos o seu aparelho!
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          Dê uma olhadinha na foto e veja se é exatamente o que você tem em mãos:
        </p>
      </div>

      {/* Main Identified Card */}
      <div className="bg-white rounded-2xl shadow-elevated border-2 border-emerald-300 overflow-hidden">
        
        {/* Device Image */}
        <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
          <img 
            src={device.imageUrl} 
            alt={device.name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-3 left-3 bg-brand-green text-white font-extrabold text-xs px-3 py-1 rounded-full shadow flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Identificado por IA</span>
          </div>
          <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
            {device.category}
          </div>
        </div>

        {/* Device Details Body */}
        <div className="p-6 sm:p-8 space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
              Nome Comercial & Modelo
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              {device.name}
            </h3>
            <p className="text-base font-semibold text-brand-blue mt-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Conhecido popularmente como: {device.popularName}</span>
            </p>
          </div>

          {/* Plain Language Summary */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Para que serve:
            </h4>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              {device.shortSummary}
            </p>
          </div>

          {/* Safety Reassurance for Dona Maria */}
          <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-emerald-900 font-medium">
              <strong>Fique tranquilo(a):</strong> {device.safeToUseSummary}
            </p>
          </div>

          {/* Big Confirm Button (WCAG AAA) */}
          <div className="pt-3 space-y-3">
            <button
              onClick={onConfirm}
              className="w-full py-4 px-6 bg-brand-green hover:bg-brand-green-dark text-white text-lg font-black rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 min-h-[56px] active:scale-[0.99]"
            >
              <span>Sim, é exatamente este! Continuar</span>
              <ArrowRight className="w-6 h-6" />
            </button>

            {/* Secondary Option: Not this device -> SCREEN_3 */}
            <button
              onClick={onRejectToAlternatives}
              className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm sm:text-base rounded-xl transition flex items-center justify-center gap-2 min-h-[48px]"
            >
              <HelpCircle className="w-5 h-5 text-slate-500" />
              <span>Não parece com o meu / Ver opções parecidas</span>
            </button>
          </div>

        </div>
      </div>

      {/* Alternative actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 pt-1">
        <button
          onClick={onRetake}
          className="hover:text-slate-900 flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-slate-100 transition min-h-[40px]"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Tirar outra foto</span>
        </button>

        <span>•</span>

        <button
          onClick={onManualSearch}
          className="hover:text-slate-900 flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-slate-100 transition min-h-[40px]"
        >
          <Search className="w-4 h-4" />
          <span>Digitar nome ou marca</span>
        </button>
      </div>

    </div>
  );
};

