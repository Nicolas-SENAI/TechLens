import React from 'react';
import { 
  Sparkles, 
  History, 
  ShieldCheck, 
  AlertCircle, 
  Type, 
  Eye, 
  Volume2, 
  Wifi, 
  WifiOff,
  Menu,
  X,
  Camera
} from 'lucide-react';
import { ScreenId } from '../types';

interface NavbarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  fontSizeMultiplier: number;
  onFontSizeChange: (scale: number) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  isOnline: boolean;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  fontSizeMultiplier,
  onFontSizeChange,
  highContrast,
  onToggleHighContrast,
  isOnline,
  isSpeaking,
  onStopSpeaking,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [screensMenuOpen, setScreensMenuOpen] = React.useState(false);

  const screenLabels: { id: ScreenId; label: string; num: string }[] = [
    { id: 'SCREEN_21', label: 'Início & Captura', num: '01' },
    { id: 'SCREEN_19', label: 'Analisando Imagem', num: '02' },
    { id: 'SCREEN_17', label: 'Confirmação (Alta Certeza)', num: '03' },
    { id: 'SCREEN_3', label: 'Confirmação (Baixa Certeza)', num: '03B' },
    { id: 'SCREEN_9', label: 'Buscando Informações', num: '04' },
    { id: 'SCREEN_15', label: 'Guia do Produto', num: '05' },
    { id: 'SCREEN_11', label: 'Chat IA de Dúvidas', num: '06' },
    { id: 'SCREEN_13', label: 'Histórico Local', num: '07' },
    { id: 'SCREEN_5', label: 'Privacidade & LGPD', num: '08' },
    { id: 'SCREEN_7', label: 'Central de Diagnóstico', num: '09' },
  ];

  const handleDecreaseFont = () => {
    if (fontSizeMultiplier > 0.9) {
      onFontSizeChange(Number((fontSizeMultiplier - 0.1).toFixed(2)));
    }
  };

  const handleIncreaseFont = () => {
    if (fontSizeMultiplier < 1.4) {
      onFontSizeChange(Number((fontSizeMultiplier + 0.1).toFixed(2)));
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-soft">
      {/* Top Banner if Speaking */}
      {isSpeaking && (
        <div className="bg-brand-purple text-white px-4 py-2 flex items-center justify-between text-sm animate-pulse">
          <div className="flex items-center gap-2 font-medium">
            <Volume2 className="w-5 h-5 animate-bounce" />
            <span>TechLens lendo em voz alta para você...</span>
          </div>
          <button 
            onClick={onStopSpeaking}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-bold uppercase tracking-wider"
          >
            Pausar Voz
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Logo & Slogan */}
          <button 
            onClick={() => onNavigate('SCREEN_21')}
            className="flex items-center gap-3 text-left focus:outline-none group"
            aria-label="Página Inicial do TechLens"
          >
            <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Tech<span className="text-brand-blue">Lens</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                  IA Acessível
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Entenda aparelhos e cabos sem complicação
              </p>
            </div>
          </button>

          {/* Center Navigation Shortcuts */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-600">
            <button
              onClick={() => onNavigate('SCREEN_21')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 min-h-[44px] ${
                currentScreen === 'SCREEN_21'
                  ? 'text-brand-blue bg-blue-50 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Identificar</span>
            </button>

            <button
              onClick={() => onNavigate('SCREEN_13')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 min-h-[44px] ${
                currentScreen === 'SCREEN_13'
                  ? 'text-brand-blue bg-blue-50 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Histórico</span>
            </button>

            <button
              onClick={() => onNavigate('SCREEN_5')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 min-h-[44px] ${
                currentScreen === 'SCREEN_5'
                  ? 'text-brand-blue bg-blue-50 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Privacidade</span>
            </button>

            <button
              onClick={() => onNavigate('SCREEN_7')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 min-h-[44px] ${
                currentScreen === 'SCREEN_7'
                  ? 'text-brand-blue bg-blue-50 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Ajuda / Diagnóstico</span>
            </button>
          </nav>

          {/* Accessibility Controls & Screen Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Font Size A- / A+ Controls (WCAG AAA) */}
            <div className="flex items-center border border-slate-300 rounded-md bg-slate-50 p-0.5" title="Ajuste de tamanho da letra">
              <button
                onClick={handleDecreaseFont}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-white text-slate-700 font-bold text-xs transition"
                aria-label="Diminuir tamanho da fonte"
                disabled={fontSizeMultiplier <= 0.9}
              >
                A-
              </button>
              <span className="text-[11px] font-semibold text-slate-500 px-1 select-none">
                {Math.round(fontSizeMultiplier * 100)}%
              </span>
              <button
                onClick={handleIncreaseFont}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-white text-slate-700 font-bold text-xs transition"
                aria-label="Aumentar tamanho da fonte"
                disabled={fontSizeMultiplier >= 1.4}
              >
                A+
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={onToggleHighContrast}
              className={`p-2 rounded-md border min-h-[40px] min-w-[40px] flex items-center justify-center transition ${
                highContrast
                  ? 'bg-black text-yellow-300 border-yellow-300'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
              title="Alternar Alto Contraste"
              aria-label="Alternar Alto Contraste para leitura facilitada"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Connection Status Badge */}
            <div 
              className={`hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                isOnline 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
              title={isOnline ? 'Conexão ativa' : 'Modo Offline: acessando histórico local'}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Modo Offline</span>
                </>
              )}
            </div>

            {/* PRD Screen Selector Button */}
            <div className="relative">
              <button
                onClick={() => setScreensMenuOpen(!screensMenuOpen)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-bold flex items-center gap-1.5 border border-slate-300 min-h-[40px]"
                aria-label="Abrir seletor de telas do PRD"
              >
                <span className="hidden sm:inline">Navegar Telas</span>
                <span className="bg-brand-blue text-white rounded px-1.5 py-0.5 text-[10px]">
                  10 Telas
                </span>
              </button>

              {/* Screens Dropdown Menu */}
              {screensMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Mapeamento de Telas (PRD)
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {screenLabels.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          onNavigate(s.id);
                          setScreensMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition ${
                          currentScreen === s.id ? 'bg-blue-50/80 font-bold text-brand-blue' : 'text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                            {s.num}
                          </span>
                          <span>{s.label}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {s.id}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Abrir menu principal"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => { onNavigate('SCREEN_21'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-3 rounded-md text-base font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-3"
          >
            <Camera className="w-5 h-5 text-brand-blue" />
            <span>Identificar Aparelho</span>
          </button>
          <button
            onClick={() => { onNavigate('SCREEN_13'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-3 rounded-md text-base font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-3"
          >
            <History className="w-5 h-5 text-brand-blue" />
            <span>Histórico Local</span>
          </button>
          <button
            onClick={() => { onNavigate('SCREEN_5'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-3 rounded-md text-base font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-3"
          >
            <ShieldCheck className="w-5 h-5 text-brand-blue" />
            <span>Privacidade & LGPD</span>
          </button>
          <button
            onClick={() => { onNavigate('SCREEN_7'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-3 rounded-md text-base font-semibold text-slate-800 hover:bg-slate-100 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-brand-blue" />
            <span>Central de Diagnóstico & Ajuda</span>
          </button>
        </div>
      )}
    </header>
  );
};
