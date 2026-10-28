import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, ArrowLeft, Shield } from 'lucide-react';
import { Device } from '../types';

interface Screen19AnalyzingProps {
  imageSrc: string;
  targetDevice: Device;
  onAnalysisComplete: (device: Device) => void;
  onCancel: () => void;
}

export const Screen19Analyzing: React.FC<Screen19AnalyzingProps> = ({
  imageSrc,
  targetDevice,
  onAnalysisComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [scanMessage, setScanMessage] = useState('Verificando iluminação e nitidez da imagem...');

  useEffect(() => {
    // Step 1: Quality & Sharpness
    const timer1 = setTimeout(() => {
      setStep1Done(true);
      setCurrentStep(2);
      setScanMessage('Analisando contornos, botões e pinos de conexão...');
    }, 1500);

    // Step 2: Visual Recognition
    const timer2 = setTimeout(() => {
      setStep2Done(true);
      setScanMessage('Identificação concluída com sucesso!');
    }, 3000);

    // Final Transition
    const timer3 = setTimeout(() => {
      onAnalysisComplete(targetDevice);
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [targetDevice, onAnalysisComplete]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-14 space-y-8">
      
      {/* Reassuring Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-brand-purple text-xs font-bold">
          <Sparkles className="w-4 h-4 animate-spin text-brand-purple" />
          <span>Visão Computacional em Andamento</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Analisando seu aparelho com calma...
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          Nossa IA está examinando o formato sem pressa. Não precisa clicar em nada.
        </p>
      </div>

      {/* Image with Bio-Tech Laser Scanner */}
      <div className="relative mx-auto max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-elevated border-2 border-brand-purple/30 bg-slate-900">
        <img 
          src={imageSrc} 
          alt="Aparelho sendo analisado" 
          className="w-full h-full object-cover opacity-85"
        />

        {/* Bio-Tech Smooth Laser Scan Line (PRD: sem bounding boxes confusas) */}
        <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-brand-purple to-brand-blue animate-laser-sweep shadow-purple-glow">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-brand-purple text-white text-[10px] font-bold uppercase tracking-wider shadow">
            Escaneando Conectores
          </div>
        </div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(124,58,237,0.1)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Bottom Current Action Badge */}
        <div className="absolute bottom-3 inset-x-4 bg-slate-950/85 backdrop-blur-md rounded-xl p-3 border border-slate-700 text-white flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-brand-purple shrink-0" />
          <span className="text-xs sm:text-sm font-semibold truncate">
            {scanMessage}
          </span>
        </div>
      </div>

      {/* 2-Step Progress Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
        
        {/* Step 1 */}
        <div className={`p-4 rounded-xl border transition-all ${
          step1Done 
            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
            : currentStep === 1 
            ? 'bg-white border-brand-blue shadow-md' 
            : 'bg-slate-50 border-slate-200 opacity-60'
        }`}>
          <div className="flex items-center gap-3">
            {step1Done ? (
              <CheckCircle2 className="w-6 h-6 text-brand-green shrink-0" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center shrink-0">
                1
              </div>
            )}
            <div>
              <h4 className="font-bold text-xs sm:text-sm">
                1. Nitidez & Luz
              </h4>
              <p className="text-[11px] text-slate-500">
                {step1Done ? 'Foto aprovada e bem legível' : 'Verificando foco e detalhes...'}
              </p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className={`p-4 rounded-xl border transition-all ${
          step2Done 
            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
            : currentStep === 2 
            ? 'bg-white border-brand-purple shadow-md' 
            : 'bg-slate-50 border-slate-200 opacity-60'
        }`}>
          <div className="flex items-center gap-3">
            {step2Done ? (
              <CheckCircle2 className="w-6 h-6 text-brand-green shrink-0" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-brand-purple text-white text-xs font-bold flex items-center justify-center shrink-0">
                2
              </div>
            )}
            <div>
              <h4 className="font-bold text-xs sm:text-sm">
                2. Formato do Aparelho
              </h4>
              <p className="text-[11px] text-slate-500">
                {step2Done ? 'Modelo identificado!' : 'Cruzando dados visuais...'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Safety Notice & Cancel */}
      <div className="text-center space-y-3 pt-2">
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-brand-green" />
          <span>A imagem é descartada da memória assim que o guia for gerado.</span>
        </p>

        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-sm font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancelar e voltar</span>
        </button>
      </div>

    </div>
  );
};

