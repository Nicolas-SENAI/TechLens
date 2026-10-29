import React, { useRef, useState, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Info,
  HelpCircle,
  VideoOff,
  Loader2
} from 'lucide-react';
import { Device, ScreenId } from '../types';
import { MOCK_DEVICES, SAMPLE_SEARCH_TERMS } from '../data/mockDevices';
import { recordPrivacyConsent } from '../services/api';

interface Screen21HomeProps {
  onStartAnalysis: (imageSrc: string, selectedDevice?: Device) => void;
  onDirectSearch: (query: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const Screen21Home: React.FC<Screen21HomeProps> = ({
  onStartAnalysis,
  onDirectSearch,
  onNavigate,
}) => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'search'>('camera');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isConnectingCamera, setIsConnectingCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraErrorType, setCameraErrorType] = useState<'not_found' | 'permission_denied' | 'in_use' | 'other' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check 1st use privacy consent (RF-02)
  useEffect(() => {
    const hasConsented = localStorage.getItem('techlens_privacy_consent_v1');
    if (!hasConsented) {
      setShowPrivacyModal(true);
    }
  }, []);

  const handleConsentAccept = () => {
    localStorage.setItem('techlens_privacy_consent_v1', 'true');
    recordPrivacyConsent().catch(err => {
      console.warn('Registro de aceite de privacidade em segundo plano falhou:', err);
    });
    setShowPrivacyModal(false);
  };

  // Camera Management com detecção inteligente de hardware e permissões
  const startCamera = async () => {
    setIsConnectingCamera(true);
    setCameraError(null);
    setCameraErrorType(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Navegador sem suporte a acesso direto à câmera.');
      }

      let stream: MediaStream;
      try {
        // Tenta câmera traseira em celulares, mas com fallback suave para webcam normal de desktop
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch {
        // Se a restrição específica falhar, tenta qualquer dispositivo de vídeo conectado
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setIsCameraActive(false);

      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraErrorType('not_found');
        setCameraError('Nenhuma câmera ou webcam física foi encontrada conectada neste computador. Como você está usando um computador de mesa (desktop), é necessário plugar uma webcam USB. Você pode enviar uma foto pelo botão ao lado ou testar com os exemplos prontos!');
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraErrorType('permission_denied');
        setCameraError('Permissão negada: o navegador ou as políticas do Windows bloquearam o acesso à câmera. Clique no ícone de cadeado na barra de endereços para liberar o acesso.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraErrorType('in_use');
        setCameraError('A câmera está sendo utilizada por outro aplicativo no computador (como Teams, Meet ou Zoom). Feche o outro programa e tente novamente.');
      } else {
        setCameraErrorType('other');
        setCameraError('Não foi possível iniciar a câmera neste momento. Você pode enviar uma foto da sua galeria ou usar os exemplos prontos abaixo!');
      }
    } finally {
      setIsConnectingCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  // Capture frame from video
  const capturePhoto = () => {
    if (videoRef.current && isCameraActive) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        stopCamera();
        onStartAnalysis(dataUrl);
      }
    } else {
      // Se a webcam física não estiver ativa, direciona para envio de foto ou abre seletor
      const fileInput = document.getElementById('file-upload') as HTMLInputElement | null;
      if (fileInput) {
        fileInput.click();
      } else {
        setActiveTab('upload');
      }
    }
  };

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onStartAnalysis(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.includes('image') || file.name.match(/\.(jpg|jpeg|png|webp)$/i))) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onStartAnalysis(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Direct manual search (RF-03)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onDirectSearch(searchQuery.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      
      {/* Friendly Header Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-brand-blue text-xs font-bold tracking-wide">
          <Sparkles className="w-4 h-4 text-brand-purple" />
          <span>Inteligência Artificial Feita para Pessoas Reais</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Aponte a câmera e entenda qualquer aparelho
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Descubra para que serve, como ligar e onde encaixar sem termos em inglês e sem medo de quebrar.
        </p>
      </div>

      {/* Main Action Card with Tabs */}
      <div className="bg-white rounded-2xl shadow-elevated border border-slate-200/80 overflow-hidden">
        
        {/* Navigation Selector: Câmera vs Galeria vs Digitar */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-3 px-3 rounded-lg font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition min-h-[48px] ${
              activeTab === 'camera'
                ? 'bg-white text-brand-blue shadow-soft'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Camera className="w-5 h-5 text-brand-blue" />
            <span>Usar Câmera</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 px-3 rounded-lg font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition min-h-[48px] ${
              activeTab === 'upload'
                ? 'bg-white text-brand-blue shadow-soft'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Upload className="w-5 h-5 text-brand-purple" />
            <span>Enviar Foto</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 px-3 rounded-lg font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition min-h-[48px] ${
              activeTab === 'search'
                ? 'bg-white text-brand-blue shadow-soft'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Search className="w-5 h-5 text-brand-green-dark" />
            <span>Digitar Nome</span>
          </button>
        </div>

        {/* Tab 1: Live Camera View */}
        {activeTab === 'camera' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="relative bg-slate-950 rounded-xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] max-h-[400px] flex items-center justify-center border-2 border-slate-800">
              
              {isCameraActive ? (
                <>
                  <video 
                    ref={videoRef} 
                    playsInline 
                    autoPlay 
                    muted 
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle viewfinder guides */}
                  <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-white/60 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-white/90 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded self-start">
                      Enquadre o aparelho ou conector aqui
                    </span>
                    <span className="text-xs text-white/90 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded self-center">
                      Mantenha a mão firme com boa luz
                    </span>
                  </div>
                </>
              ) : isConnectingCamera ? (
                <div className="p-6 text-center text-slate-300 space-y-3 max-w-md animate-pulse">
                  <Loader2 className="w-12 h-12 text-brand-blue animate-spin mx-auto" />
                  <h3 className="text-lg font-bold text-white">Conectando à câmera...</h3>
                  <p className="text-xs text-slate-400">Verificando dispositivos de vídeo e permissões do sistema.</p>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-300 space-y-4 max-w-lg">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    {cameraErrorType === 'not_found' ? (
                      <VideoOff className="w-8 h-8 text-amber-400" />
                    ) : (
                      <Camera className="w-8 h-8" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">
                      {cameraErrorType === 'not_found'
                        ? 'Nenhuma Webcam Encontrada'
                        : cameraErrorType === 'permission_denied'
                        ? 'Permissão de Câmera Bloqueada'
                        : 'Visualização da Câmera'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {cameraError || 'Clique no botão abaixo para ligar a câmera do seu celular ou computador.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                    <button
                      onClick={startCamera}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs inline-flex items-center gap-2 border border-slate-700 min-h-[44px]"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Tentar Novamente</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-4 py-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-lg font-bold text-xs inline-flex items-center gap-2 shadow min-h-[44px]"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Enviar Foto do PC</span>
                    </button>

                    <button
                      onClick={() => onStartAnalysis(MOCK_DEVICES[0].imageUrl, MOCK_DEVICES[0])}
                      className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-lg font-bold text-xs inline-flex items-center gap-2 shadow min-h-[44px]"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Testar com Exemplo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Big Action Button for Seniors (WCAG AAA Touch Target) */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-brand-green" />
                <span>Foto analisada com privacidade e sem guardar rostos</span>
              </div>

              <button
                onClick={capturePhoto}
                className="w-full sm:w-auto px-8 py-4 bg-brand-blue hover:bg-brand-blue-hover text-white text-lg font-extrabold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 min-h-[56px] active:scale-95"
              >
                <Camera className="w-6 h-6" />
                <span>{isCameraActive ? 'Fotografar Aparelho' : 'Enviar Foto do Aparelho'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Upload Image */}
        {activeTab === 'upload' && (
          <div 
            className={`p-8 sm:p-12 text-center transition-colors ${
              dragActive ? 'bg-blue-50/60' : 'bg-white'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              id="file-upload" 
              accept=".jpg,.jpeg,.png,.webp,image/*" 
              onChange={handleFileUpload}
              className="hidden" 
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-brand-blue rounded-2xl p-8 sm:p-12 transition group"
            >
              <div className="w-18 h-18 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Toque aqui para escolher uma foto
              </h3>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                Ou arraste um arquivo de imagem (.jpg, .png ou .webp) direto para dentro deste espaço.
              </p>
              <span className="mt-6 px-6 py-3 bg-brand-purple hover:bg-brand-purple-dark text-white rounded-lg font-bold text-sm inline-flex items-center gap-2 shadow min-h-[48px]">
                <Upload className="w-4 h-4" />
                <span>Selecionar da Galeria / Arquivos</span>
              </span>
            </label>
          </div>
        )}

        {/* Tab 3: Direct Search by Name (RF-03) */}
        {activeTab === 'search' && (
          <div className="p-6 sm:p-10 space-y-6">
            <div className="max-w-xl mx-auto space-y-2 text-center">
              <h3 className="text-xl font-bold text-slate-900">
                Prefere não tirar foto? Sem problemas!
              </h3>
              <p className="text-sm text-slate-600">
                Digite o que está escrito no aparelho ou o tipo de cabo que você quer entender:
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: Fone Bluetooth, Cabo HDMI, Carregador USB-C..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 text-slate-900 text-base font-medium outline-none min-h-[50px]"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold text-base shadow-md transition flex items-center justify-center gap-2 min-h-[50px]"
              >
                <span>Pesquisar</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Quick Testing Examples - Great for instantaneous demo! */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-purple" />
            <span>Ou teste imediatamente com estes exemplos populares:</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {MOCK_DEVICES.map((device) => (
            <button
              key={device.id}
              onClick={() => onStartAnalysis(device.imageUrl, device)}
              className="bg-white hover:bg-blue-50/50 p-3 rounded-xl border border-slate-200/90 shadow-soft hover:shadow-md transition text-left group flex flex-col justify-between min-h-[140px]"
            >
              <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-100 mb-2 relative">
                <img 
                  src={device.imageUrl} 
                  alt={device.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                />
                <span className="absolute top-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {device.category}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-brand-blue line-clamp-1">
                  {device.name}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {device.popularName}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trust & Transparency Banner (PRD Section 1.2 & 2.2) */}
      <div className="bg-gradient-to-r from-blue-50/70 to-purple-50/70 rounded-xl p-5 border border-blue-100 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-blue shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1 flex-1">
          <h4 className="font-bold text-slate-900 text-sm">
            Privacidade em Primeiro Lugar (Em conformidade com a LGPD)
          </h4>
          <p className="text-xs text-slate-600">
            Suas fotos são processadas em memória temporária apenas para detectar formatos de conectores. Não guardamos fotos de pessoas nem vendemos informações.
          </p>
        </div>
        <button
          onClick={() => onNavigate('SCREEN_5')}
          className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shrink-0 shadow-xs min-h-[44px]"
        >
          Saiba Mais
        </button>
      </div>

      {/* First-Use Privacy Consent Modal (RF-02) */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-brand-blue flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Sua Privacidade é Muito Importante
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                O <strong>TechLens</strong> usa inteligência artificial para reconhecer formatos de cabos e aparelhos eletrônicos.
              </p>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-amber-900 text-xs sm:text-sm space-y-1 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Atenção ao fotografar:</strong> Evite fotografar rostos de pessoas, documentos, cartões de crédito ou contas pessoais. Fotografe apenas o aparelho ou cabo.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  handleConsentAccept();
                  onNavigate('SCREEN_5');
                }}
                className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm min-h-[48px]"
              >
                Saiba Mais (LGPD)
              </button>
              <button
                onClick={handleConsentAccept}
                className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-sm shadow-md min-h-[48px]"
              >
                Entendi e Concordo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

