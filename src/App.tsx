import React, { useState, useEffect } from 'react';
import { ScreenId, Device, DiagnosticScenario } from './types';
import { MOCK_DEVICES } from './data/mockDevices';
import { Navbar } from './components/Navbar';
import { Screen21Home } from './components/Screen21Home';
import { Screen19Analyzing } from './components/Screen19Analyzing';
import { Screen17ConfirmHigh } from './components/Screen17ConfirmHigh';
import { Screen03ConfirmLow } from './components/Screen03ConfirmLow';
import { Screen09FetchingInfo } from './components/Screen09FetchingInfo';
import { Screen15Guide } from './components/Screen15Guide';
import { Screen11Chat } from './components/Screen11Chat';
import { Screen13History } from './components/Screen13History';
import { Screen05Privacy } from './components/Screen05Privacy';
import { Screen07Diagnostics } from './components/Screen07Diagnostics';
import { speechService } from './services/speechService';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('SCREEN_21');
  const [activeDevice, setActiveDevice] = useState<Device>(MOCK_DEVICES[0]);
  const [capturedImage, setCapturedImage] = useState<string>(MOCK_DEVICES[0].imageUrl);
  
  // Accessibility states (WCAG AAA)
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState<number>(1.0);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Monitor online/offline status (RF-11)
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitor Speech State
  useEffect(() => {
    const unsubscribe = speechService.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsubscribe();
  }, []);

  // Sync high contrast with body class
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Screen Transitions & Handlers
  const handleStartAnalysis = (imageSrc: string, selectedDevice?: Device) => {
    setCapturedImage(imageSrc);
    if (selectedDevice) {
      setActiveDevice(selectedDevice);
    } else {
      setActiveDevice(MOCK_DEVICES[0]);
    }
    setCurrentScreen('SCREEN_19');
  };

  const handleAnalysisComplete = (identifiedDevice: Device) => {
    setActiveDevice(identifiedDevice);
    if (identifiedDevice.confidenceLevel === 'high') {
      setCurrentScreen('SCREEN_17');
    } else {
      setCurrentScreen('SCREEN_3');
    }
  };

  const handleDirectSearch = (query: string) => {
    const lower = query.toLowerCase();
    const found = MOCK_DEVICES.find(d => 
      d.name.toLowerCase().includes(lower) || 
      d.popularName.toLowerCase().includes(lower) ||
      d.category.toLowerCase().includes(lower)
    ) || MOCK_DEVICES[0];

    setActiveDevice(found);
    setCapturedImage(found.imageUrl);
    setCurrentScreen('SCREEN_17');
  };

  const handleSelectHistoryDevice = (device: Device) => {
    setActiveDevice(device);
    setCapturedImage(device.imageUrl);
    setCurrentScreen('SCREEN_15');
  };

  return (
    <div 
      className="min-h-screen flex flex-col transition-all duration-150"
      style={{ fontSize: `${fontSizeMultiplier * 100}%` }}
    >
      {/* Top Accessible Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          speechService.stop();
          setCurrentScreen(screen);
        }}
        fontSizeMultiplier={fontSizeMultiplier}
        onFontSizeChange={setFontSizeMultiplier}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        isOnline={isOnline}
        isSpeaking={isSpeaking}
        onStopSpeaking={() => speechService.stop()}
      />

      {/* Main Screen Router */}
      <main className="flex-1">
        {/* SCREEN_21: Início e Captura de Imagem */}
        {currentScreen === 'SCREEN_21' && (
          <Screen21Home
            onStartAnalysis={handleStartAnalysis}
            onDirectSearch={handleDirectSearch}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {/* SCREEN_19: Analisando Aparelho com IA */}
        {currentScreen === 'SCREEN_19' && (
          <Screen19Analyzing
            imageSrc={capturedImage}
            targetDevice={activeDevice}
            onAnalysisComplete={handleAnalysisComplete}
            onCancel={() => setCurrentScreen('SCREEN_21')}
          />
        )}

        {/* SCREEN_17: Confirmação do Aparelho (Alta Certeza) */}
        {currentScreen === 'SCREEN_17' && (
          <Screen17ConfirmHigh
            device={activeDevice}
            onConfirm={() => setCurrentScreen('SCREEN_9')}
            onRejectToAlternatives={() => setCurrentScreen('SCREEN_3')}
            onRetake={() => setCurrentScreen('SCREEN_21')}
            onManualSearch={() => setCurrentScreen('SCREEN_21')}
          />
        )}

        {/* SCREEN_3: Confirmação (Baixa Certeza) */}
        {currentScreen === 'SCREEN_3' && (
          <Screen03ConfirmLow
            currentDevice={activeDevice}
            onSelectAlternative={(dev) => {
              setActiveDevice(dev);
              setCapturedImage(dev.imageUrl);
              setCurrentScreen('SCREEN_9');
            }}
            onManualSearch={() => setCurrentScreen('SCREEN_21')}
            onRetake={() => setCurrentScreen('SCREEN_21')}
          />
        )}

        {/* SCREEN_9: Buscando Informações do Aparelho */}
        {currentScreen === 'SCREEN_9' && (
          <Screen09FetchingInfo
            device={activeDevice}
            onFinishFetching={() => setCurrentScreen('SCREEN_15')}
          />
        )}

        {/* SCREEN_15: Guia Completo e Traduzido */}
        {currentScreen === 'SCREEN_15' && (
          <Screen15Guide
            device={activeDevice}
            onOpenChat={() => setCurrentScreen('SCREEN_11')}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {/* SCREEN_11: Tire suas Dúvidas (Chat IA) */}
        {currentScreen === 'SCREEN_11' && (
          <Screen11Chat
            device={activeDevice}
            onBackToGuide={() => setCurrentScreen('SCREEN_15')}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {/* SCREEN_13: Histórico de Pesquisas */}
        {currentScreen === 'SCREEN_13' && (
          <Screen13History
            onSelectDevice={handleSelectHistoryDevice}
            onNavigate={(screen) => setCurrentScreen(screen)}
            isOnline={isOnline}
          />
        )}

        {/* SCREEN_5: Privacidade e Proteção de Dados (LGPD) */}
        {currentScreen === 'SCREEN_5' && (
          <Screen05Privacy
            onBackToHome={() => setCurrentScreen('SCREEN_21')}
          />
        )}

        {/* SCREEN_7: Central de Diagnóstico & Erros */}
        {currentScreen === 'SCREEN_7' && (
          <Screen07Diagnostics
            onNavigate={(screen) => setCurrentScreen(screen)}
            onRetryCamera={() => setCurrentScreen('SCREEN_21')}
            onManualSearch={() => setCurrentScreen('SCREEN_21')}
          />
        )}
      </main>

      {/* Accessible Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">TechLens</span>
            <span>—</span>
            <span>Inteligência Artificial acessível e acolhedora</span>
          </div>

          <div className="flex items-center gap-4 font-semibold text-slate-600">
            <button 
              onClick={() => setCurrentScreen('SCREEN_5')} 
              className="hover:text-brand-blue"
            >
              Privacidade & LGPD
            </button>
            <span>•</span>
            <button 
              onClick={() => setCurrentScreen('SCREEN_7')} 
              className="hover:text-brand-blue"
            >
              Central de Ajuda
            </button>
            <span>•</span>
            <button 
              onClick={() => setCurrentScreen('SCREEN_13')} 
              className="hover:text-brand-blue"
            >
              Histórico Local
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
