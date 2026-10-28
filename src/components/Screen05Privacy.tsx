import React from 'react';
import { 
  ShieldCheck, 
  EyeOff, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Camera, 
  HelpCircle, 
  FileCheck, 
  ArrowLeft 
} from 'lucide-react';
import { ScreenId } from '../types';

interface Screen05PrivacyProps {
  onBackToHome: () => void;
}

export const Screen05Privacy: React.FC<Screen05PrivacyProps> = ({
  onBackToHome,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-brand-green" />
            <span>Conformidade com a LGPD (Lei Geral de Proteção de Dados)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Privacidade e Segurança das suas Fotos
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Entenda com transparência total como a inteligência artificial analisa seus aparelhos e por que suas fotos nunca são expostas.
          </p>
        </div>

        <button
          onClick={onBackToHome}
          className="self-start sm:self-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition flex items-center gap-2 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Início</span>
        </button>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-brand-blue flex items-center justify-center">
            <EyeOff className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900">
            1. Olhamos Apenas Conectores
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            O algoritmo foi treinado exclusivamente para reconhecer pinos metálicos, botões, formatos de conectores e carcaças de eletrônicos.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-brand-purple flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900">
            2. Memória Temporária Efêmera
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            A imagem permanece na memória apenas durante os segundos da análise. Assim que o guia é gerado, o arquivo da imagem é descartado.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-brand-green flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900">
            3. Sem Venda de Dados
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Nunca compartilhamos ou vendemos suas fotos para anunciantes, e seu histórico fica guardado estritamente no seu próprio navegador.
          </p>
        </div>

      </div>

      {/* What to Photograph vs What NOT to Photograph Guide */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-200 space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Guia de Fotografia Segura
          </h2>
          <p className="text-sm text-slate-600">
            Para sua máxima proteção e para ajudar a IA a acertar de primeira:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Allowed / Recommended */}
          <div className="bg-emerald-50/70 rounded-2xl p-5 border-2 border-emerald-300 space-y-4">
            <div className="flex items-center gap-2 text-brand-green-dark font-extrabold text-base">
              <CheckCircle2 className="w-5 h-5 text-brand-green" />
              <span>O que você DEVE fotografar:</span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-800 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                <span>A ponta do cabo ou o conector de frente (onde ficam os furinhos ou pinos).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                <span>O aparelho sobre uma mesa limpa e bem iluminada.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                <span>A etiqueta de marca ou modelo impressa na carcaça do aparelho.</span>
              </li>
            </ul>
          </div>

          {/* Strictly Forbidden / Avoid */}
          <div className="bg-red-50/70 rounded-2xl p-5 border-2 border-red-300 space-y-4">
            <div className="flex items-center gap-2 text-red-700 font-extrabold text-base">
              <XCircle className="w-5 h-5 text-red-600" />
              <span>O que você NUNCA deve fotografar:</span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-800 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-red-200 text-red-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✕</span>
                <span>Rostos de pessoas, familiares ou crianças.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-red-200 text-red-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✕</span>
                <span>Documentos pessoais (RG, CPF, CNH ou Título de Eleitor).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-red-200 text-red-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✕</span>
                <span>Cartões de crédito, dinheiro, comprovantes bancários ou contas de água/luz.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Frequently Asked Questions about Privacy */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-200 space-y-4">
        <h3 className="text-xl font-extrabold text-slate-900">
          Dúvidas Frequentes sobre seus Dados
        </h3>

        <div className="space-y-3 pt-2">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1">
            <h4 className="font-bold text-sm text-slate-900">
              Minha foto é usada para treinar inteligência artificial?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Não. As inferências são executadas em instâncias sem retenção de dados, em cumprimento com os princípios de minimização e segurança da LGPD (Lei 13.709/2018).
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1">
            <h4 className="font-bold text-sm text-slate-900">
              Como apagar tudo o que o TechLens sabe sobre mim?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              O TechLens não exige cadastro, e-mail ou senha. Todos os aparelhos que você consultou ficam salvos apenas na memória do seu próprio navegador. Basta ir na aba <strong>Histórico</strong> e clicar em <strong>"Apagar Todo o Histórico"</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center pt-2">
        <button
          onClick={onBackToHome}
          className="px-8 py-4 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-extrabold text-base shadow-md transition inline-flex items-center gap-2 min-h-[50px]"
        >
          <Camera className="w-5 h-5" />
          <span>Voltar e Tirar uma Foto com Segurança</span>
        </button>
      </div>

    </div>
  );
};
