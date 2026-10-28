import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  MessageSquare, 
  Tag, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  ShieldCheck,
  Lightbulb
} from 'lucide-react';
import { Device } from '../types';

interface Screen09FetchingInfoProps {
  device: Device;
  onFinishFetching: () => void;
}

export const Screen09FetchingInfo: React.FC<Screen09FetchingInfoProps> = ({
  device,
  onFinishFetching,
}) => {
  const [progress, setProgress] = useState(15);
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);
  const [stage1Done, setStage1Done] = useState(false);
  const [stage2Done, setStage2Done] = useState(false);
  const [stage3Done, setStage3Done] = useState(false);

  useEffect(() => {
    // Stage 1: Translated Specs
    const t1 = setTimeout(() => {
      setProgress(45);
      setStage1Done(true);
      setActiveStage(2);
    }, 1100);

    // Stage 2: Reviews
    const t2 = setTimeout(() => {
      setProgress(80);
      setStage2Done(true);
      setActiveStage(3);
    }, 2200);

    // Stage 3: Prices & Finishing
    const t3 = setTimeout(() => {
      setProgress(100);
      setStage3Done(true);
    }, 3200);

    // Transition to Screen 15
    const t4 = setTimeout(() => {
      onFinishFetching();
    }, 3700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onFinishFetching]);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-14 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-brand-blue text-xs font-bold">
          <Sparkles className="w-4 h-4 text-brand-purple" />
          <span>Montando seu Guia Personalizado</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Traduzindo tudo para você...
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          Consultando os manuais e descomplicando as palavras difíceis sobre o <strong>{device.name}</strong>.
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="bg-white rounded-2xl p-6 shadow-elevated border border-slate-200/80 space-y-4">
        
        {/* Animated Visual Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>Progresso da busca</span>
            <span className="text-brand-blue">{progress}%</span>
          </div>
          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div 
              className="h-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 3 Step List with Dynamic Checkmarks (PRD SCREEN_9) */}
        <div className="space-y-3 pt-3">
          
          {/* Step 1 */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
            stage1Done 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold' 
              : activeStage === 1 
              ? 'bg-blue-50/70 border-brand-blue text-slate-900 font-bold' 
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                stage1Done ? 'bg-emerald-200 text-brand-green-dark' : 'bg-blue-100 text-brand-blue'
              }`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs uppercase tracking-wider block text-slate-500">
                  Etapa 1
                </span>
                <span className="text-sm">
                  Especificações traduzidas (sem jargões técnicos)
                </span>
              </div>
            </div>
            {stage1Done ? (
              <CheckCircle2 className="w-6 h-6 text-brand-green shrink-0" />
            ) : activeStage === 1 ? (
              <Loader2 className="w-5 h-5 animate-spin text-brand-blue shrink-0" />
            ) : null}
          </div>

          {/* Step 2 */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
            stage2Done 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold' 
              : activeStage === 2 
              ? 'bg-purple-50/70 border-brand-purple text-slate-900 font-bold' 
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                stage2Done ? 'bg-emerald-200 text-brand-green-dark' : 'bg-purple-100 text-brand-purple'
              }`}>
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs uppercase tracking-wider block text-slate-500">
                  Etapa 2
                </span>
                <span className="text-sm">
                  Resumo de avaliações de consumidores reais
                </span>
              </div>
            </div>
            {stage2Done ? (
              <CheckCircle2 className="w-6 h-6 text-brand-green shrink-0" />
            ) : activeStage === 2 ? (
              <Loader2 className="w-5 h-5 animate-spin text-brand-purple shrink-0" />
            ) : null}
          </div>

          {/* Step 3 */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
            stage3Done 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold' 
              : activeStage === 3 
              ? 'bg-emerald-50/70 border-brand-green text-slate-900 font-bold' 
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                stage3Done ? 'bg-emerald-200 text-brand-green-dark' : 'bg-emerald-100 text-brand-green'
              }`}>
                <Tag className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs uppercase tracking-wider block text-slate-500">
                  Etapa 3
                </span>
                <span className="text-sm">
                  Comparativo de preços em lojas confiáveis
                </span>
              </div>
            </div>
            {stage3Done ? (
              <CheckCircle2 className="w-6 h-6 text-brand-green shrink-0" />
            ) : activeStage === 3 ? (
              <Loader2 className="w-5 h-5 animate-spin text-brand-green shrink-0" />
            ) : null}
          </div>

        </div>
      </div>

      {/* Helpful Did-You-Know Tip while loading */}
      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-900">
          <strong>Dica do TechLens:</strong> Sabia que cabos não estragam fácil se você nunca puxar pelo fio na hora de tirar da tomada? Puxe sempre segurando na parte plástica da ponta!
        </div>
      </div>

    </div>
  );
};

