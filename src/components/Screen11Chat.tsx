import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  PhoneCall, 
  ArrowLeft, 
  User, 
  Bot, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { Device, ScreenId } from '../types';
import { speechService } from '../services/speechService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface Screen11ChatProps {
  device: Device;
  onBackToGuide: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const Screen11Chat: React.FC<Screen11ChatProps> = ({
  device,
  onBackToGuide,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Olá! Sou o assistente do TechLens. Estou pronto para tirar qualquer dúvida sobre o ${device.name} (${device.popularName}). Pode perguntar do seu jeito, sem medo!`,
      timestamp: 'Agora'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Simulate intelligent, warm contextual response
    setTimeout(() => {
      let responseText = '';
      const lower = text.toLowerCase();

      // Check common questions first
      const matched = device.commonQuestions?.find(q => 
        lower.includes(q.question.toLowerCase().slice(0, 15)) ||
        (lower.includes('bateria') && q.question.toLowerCase().includes('bateria')) ||
        (lower.includes('choque') && q.question.toLowerCase().includes('choque'))
      );

      if (matched) {
        responseText = matched.answer;
      } else if (lower.includes('carreg') || lower.includes('bateria') || lower.includes('tomada')) {
        responseText = `Sobre o carregamento do ${device.popularName}: você pode ligar na tomada tranquilamente. O aparelho tem proteção interna contra sobrecarga e não estraga se você esquecer na tomada.`;
      } else if (lower.includes('molh') || lower.includes('água') || lower.includes('chuveiro') || lower.includes('banho')) {
        responseText = `Atenção: não é recomendado molhar nem mergulhar este aparelho! Respingos leves de suor não estragam, mas se cair na água da pia ou vaso, desligue imediatamente e seque com um pano macio sem ligar na tomada.`;
      } else if (lower.includes('celular') || lower.includes('conectar') || lower.includes('ligar')) {
        responseText = `Para conectar ao seu celular, ative o Bluetooth nas configurações do telefone e procure pelo nome "${device.name}". Basta tocar uma vez e confirmar. Não precisa digitar senhas na maioria dos casos!`;
      } else if (lower.includes('quebrar') || lower.includes('medo') || lower.includes('estragar')) {
        responseText = `Não tenha medo de apertar os botões! Aparelhos modernos são feitos para aguentar toques e testes normais. Se algo travar, basta desligar e ligar de novo para voltar ao normal.`;
      } else {
        responseText = `Ótima pergunta sobre o ${device.name}! Na prática, este aparelho foi feito para facilitar o seu dia a dia. Você não precisa se preocupar com configurações difíceis: se seguir o passo a passo ilustrado no Guia, tudo vai funcionar perfeitamente. Posso te ajudar com mais algum detalhe?`;
      }

      const assistantMsg: ChatMessage = {
        id: 'ast-' + Date.now(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleReadAloud = (id: string, text: string) => {
    if (speakingId === id) {
      speechService.stop();
      setSpeakingId(null);
    } else {
      setSpeakingId(id);
      speechService.speak(text, () => {
        setSpeakingId(null);
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-soft border border-slate-200">
        <button
          onClick={onBackToGuide}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-bold text-sm px-3 py-2 rounded-lg hover:bg-slate-100 transition min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5 text-brand-blue" />
          <span>Voltar ao Guia</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-bold text-brand-purple uppercase tracking-wider block">
            Conversando sobre:
          </span>
          <span className="text-sm font-extrabold text-slate-900 line-clamp-1">
            {device.popularName}
          </span>
        </div>
      </div>

      {/* Mandatory Safety Notice about AI (PRD Section 3.1 SCREEN_11) */}
      <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Aviso de Segurança:</strong> Respostas geradas por IA. Em caso de dúvidas sobre fumaça ou fiação desencapada, consulte um eletricista.
          </span>
        </div>

        {/* Free Telephone Support Shortcut (PRD) */}
        {device.officialSupportPhone && (
          <a
            href={`tel:${device.officialSupportPhone.replace(/\D/g, '')}`}
            className="shrink-0 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-brand-green" />
            <span className="hidden sm:inline">SAC Gratuito:</span>
            <span>{device.officialSupportPhone.split(' ')[0]}</span>
          </a>
        )}
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-soft border border-slate-200 min-h-[420px] max-h-[550px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Bot className="w-5 h-5" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-brand-blue text-white rounded-tr-xs shadow-sm'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-xs'
              }`}
            >
              <p className="text-sm sm:text-base leading-relaxed font-medium">
                {msg.text}
              </p>

              <div
                className={`flex items-center justify-between text-[11px] pt-1 border-t ${
                  msg.sender === 'user'
                    ? 'border-blue-400/40 text-blue-100'
                    : 'border-slate-200 text-slate-400'
                }`}
              >
                <span>{msg.timestamp}</span>

                {/* Text-to-Speech button for assistant reply */}
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => handleReadAloud(msg.id, msg.text)}
                    className="hover:text-brand-purple font-bold flex items-center gap-1 transition"
                    title="Ouvir esta resposta em voz alta"
                  >
                    {speakingId === msg.id ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-brand-purple" />
                        <span className="text-brand-purple font-bold">Pausar</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Ouvir</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-purple text-white flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-slate-100 rounded-2xl px-4 py-3 border border-slate-200 flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2">TechLens está formulando a explicação simples...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Questions Pills */}
      {device.commonQuestions && device.commonQuestions.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-brand-purple" />
            <span>Perguntas frequentes para clicar e enviar direto:</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {device.commonQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.question)}
                className="text-xs font-semibold bg-white hover:bg-blue-50 text-slate-700 hover:text-brand-blue px-3.5 py-2 rounded-xl border border-slate-200 transition shadow-xs text-left min-h-[38px]"
              >
                "{q.question}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2 bg-white p-2 rounded-2xl shadow-elevated border border-slate-200"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ex: Como eu sei se está carregado? Posso ligar na tomada?"
          className="flex-1 px-4 py-3 text-base text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="px-5 py-3 bg-brand-purple hover:bg-brand-purple-dark disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 min-h-[48px]"
        >
          <span>Perguntar</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
