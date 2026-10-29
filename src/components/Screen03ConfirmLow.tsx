import React from 'react';
import { 
  AlertTriangle, 
  Search, 
  Camera, 
  ArrowRight, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';
import { Device, AlternativeDevice } from '../types';
import { MOCK_DEVICES } from '../data/mockDevices';

interface Screen03ConfirmLowProps {
  currentDevice: Device;
  onSelectAlternative: (device: AlternativeDevice | Device) => void;
  onManualSearch: () => void;
  onRetake: () => void;
}

export const Screen03ConfirmLow: React.FC<Screen03ConfirmLowProps> = ({
  currentDevice,
  onSelectAlternative,
  onManualSearch,
  onRetake,
}) => {
  // Puxa as alternativas reais geradas pela IA (4 a 5 modelos parecidos) ou fallback inteligente
  const candidateList: AlternativeDevice[] = (currentDevice.alternatives && currentDevice.alternatives.length > 0)
    ? currentDevice.alternatives
    : MOCK_DEVICES.filter(d => d.id !== currentDevice.id).map((m, idx) => ({
        id: m.id,
        name: m.name,
        category: m.category,
        brand: m.brand,
        imageUrl: m.imageUrl,
        differenceNote: m.shortSummary,
        confidenceScore: Math.max(45, 80 - idx * 8)
      }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Friendly Caution Banner (PRD Section 3.1 & RF-04) */}
      <div className="bg-amber-50 rounded-2xl p-5 sm:p-6 border-2 border-amber-300 text-amber-950 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950">
              Aparelhos parecidos podem ter funções diferentes!
            </h2>
            <p className="text-xs sm:text-sm text-amber-800 font-semibold mt-0.5">
              Não se preocupe: muitos aparelhos e teclados são quase idênticos por fora.
            </p>
          </div>
        </div>

        <p className="text-sm text-amber-900 leading-relaxed font-medium">
          Identificamos que o seu aparelho tem formato parecido com alguns modelos abaixo. 
          Toque no que tiver o mesmo conector, tamanho ou marca que você tem em mãos:
        </p>
      </div>

      {/* Primary Suspect (Opção sugerida pela IA) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Opção principal sugerida pela foto inicial:
          </span>
          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
            {currentDevice.confidenceScore ? `${currentDevice.confidenceScore}% de Certeza` : 'Média Certeza'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <img 
            src={currentDevice.imageUrl} 
            alt={currentDevice.name}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80';
            }}
            className="w-full sm:w-36 h-28 object-cover rounded-xl border border-slate-200 bg-slate-100" 
          />
          <div className="space-y-1 text-center sm:text-left flex-1">
            <h3 className="text-lg font-black text-slate-900">
              {currentDevice.name}
            </h3>
            <p className="text-xs text-brand-blue font-bold">
              {currentDevice.popularName}
            </p>
            <p className="text-xs text-slate-600 line-clamp-2">
              {currentDevice.shortSummary}
            </p>
          </div>
          <button
            onClick={() => onSelectAlternative(currentDevice)}
            className="w-full sm:w-auto px-5 py-3 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 min-h-[48px]"
          >
            <Check className="w-4 h-4" />
            <span>É esse mesmo!</span>
          </button>
        </div>
      </div>

      {/* Real Alternative Candidates Grid (4 a 5 modelos parecidos) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-purple" />
            <span>Outras opções de modelos parecidos ({candidateList.length} encontrados):</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {candidateList.map((candidate) => {
            const certeza = candidate.confidenceScore || 70;
            const badgeColor = certeza >= 80 
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
              : certeza >= 65 
              ? 'bg-amber-100 text-amber-900 border-amber-300' 
              : 'bg-slate-100 text-slate-700 border-slate-300';

            return (
              <div
                key={candidate.id}
                className="bg-white rounded-2xl p-4 border-2 border-slate-200 hover:border-brand-purple transition-all shadow-soft hover:shadow-md flex flex-col justify-between group"
              >
                <div className="flex gap-3">
                  <img 
                    src={candidate.imageUrl} 
                    alt={candidate.name} 
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80';
                    }}
                    className="w-24 h-24 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100" 
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {candidate.brand || candidate.category}
                      </span>
                      <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                        {certeza}% de Certeza
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-brand-purple transition-colors leading-snug">
                      {candidate.name}
                    </h4>

                    {candidate.differenceNote && (
                      <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100 mt-1">
                        <strong className="text-brand-purple font-semibold">Diferença: </strong>
                        {candidate.differenceNote}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Categoria: {candidate.category}
                  </span>
                  <button
                    onClick={() => onSelectAlternative(candidate)}
                    className="px-4 py-2 bg-purple-50 hover:bg-brand-purple text-brand-purple hover:text-white rounded-lg font-bold text-xs transition flex items-center gap-1.5 min-h-[40px]"
                  >
                    <span>Escolher este</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Option: None of these? Manual search shortcut */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center space-y-3">
        <h4 className="font-bold text-slate-900 text-base">
          Nenhum dos aparelhos acima é o seu?
        </h4>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Você pode tirar outra foto mais de perto com a luz acesa, ou simplesmente digitar o nome ou marca que está gravado na carcaça.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onRetake}
            className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-bold text-sm text-slate-700 flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Camera className="w-4 h-4 text-brand-blue" />
            <span>Tirar outra foto</span>
          </button>
          <button
            onClick={onManualSearch}
            className="w-full sm:w-auto px-5 py-3 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Search className="w-4 h-4" />
            <span>Digitar o nome do aparelho</span>
          </button>
        </div>
      </div>

    </div>
  );
};
