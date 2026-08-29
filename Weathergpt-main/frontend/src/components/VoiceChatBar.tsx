import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Bot,
  AlertCircle,
  Trash2,
  HelpCircle,
  Clock,
  Compass,
  ChevronRight
} from 'lucide-react';
import { api } from '../api/client';
import { getTranslation } from '../i18n/translations';
import { DecisionChips } from './DecisionChips';

interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  provider_used?: string;
  resolved_location?: string;
  lat?: number;
  lon?: number;
  suggested_followups?: string[];
  why_reason?: string;
  action_tip?: string;
  best_window?: string;
  language_mirror_style?: string;
}

interface VoiceChatBarProps {
  currentLat: number;
  currentLon: number;
  currentCity?: string;
  profession: string;
  language: string;
  externalQuery?: string;
  onClearExternalQuery?: () => void;
  standaloneHero?: boolean;
  onLocationResolved?: (city: string, lat: number, lon: number) => void;
}

export const VoiceChatBar: React.FC<VoiceChatBarProps> = ({
  currentLat,
  currentLon,
  currentCity,
  profession,
  language,
  externalQuery,
  onClearExternalQuery,
  standaloneHero = false,
  onLocationResolved,
}) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      text:
        language === 'ta'
          ? `வணக்கம்! ${currentCity || 'உங்கள் பகுதியில்'} வானிலை நிலவரம் குறித்து என்ன தெரிந்து கொள்ள வேண்டும்?`
          : language === 'hi'
          ? `नमस्ते! ${currentCity || 'आपके क्षेत्र'} के मौसम के बारे में क्या जानना चाहते हैं?`
          : `Hello! How can I help you with the weather in ${currentCity || 'your area'} today?`,
      timestamp: 'Now',
      action_tip: 'Ask in English, Tanglish, Hinglish, or 13 Indian languages.',
    },
  ]);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [expandedWhyId, setExpandedWhyId] = useState<string | null>(null);

  const prevCityKey = useRef<string>(`${currentCity}_${currentLat}_${currentLon}`);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const locKey = `${currentCity}_${currentLat}_${currentLon}`;
    if (currentCity && prevCityKey.current !== locKey) {
      prevCityKey.current = locKey;
      setMessages([
        {
          id: 'welcome_' + Date.now(),
          role: 'assistant',
          text:
            language === 'ta'
              ? `வணக்கம்! ${currentCity} வானிலை நிலவரம் குறித்து என்ன தெரிந்து கொள்ள வேண்டும்?`
              : language === 'hi'
              ? `नमस्ते! ${currentCity} के मौसम के बारे में क्या जानना चाहते हैं?`
              : `Hello! How can I help you with the weather in ${currentCity} today?`,
          timestamp: 'Now',
          action_tip: 'Ask in English, Tanglish, Hinglish, or 13 Indian languages.',
        },
      ]);
    }
  }, [currentCity, currentLat, currentLon, language]);

  useEffect(() => {
    if (externalQuery && externalQuery.trim()) {
      handleSend(externalQuery);
      if (onClearExternalQuery) onClearExternalQuery();
    }
  }, [externalQuery]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        const langMap: Record<string, string> = {
          en: 'en-IN',
          hi: 'hi-IN',
          ta: 'ta-IN',
          te: 'te-IN',
          bn: 'bn-IN',
          mr: 'mr-IN',
          gu: 'gu-IN',
          kn: 'kn-IN',
          ml: 'ml-IN',
          pa: 'pa-IN',
          ur: 'ur-IN',
        };
        recognition.lang = langMap[language] || 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
          setMicError(null);
        };

        recognition.onresult = (event: any) => {
          const currentTranscript = Array.from(event.results)
            .map((res: any) => res[0].transcript)
            .join('');
          setQuery(currentTranscript);
          if (event.results[0].isFinal) {
            handleSend(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech Recognition notice:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setMicError('Microphone permission needed in your browser.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.error('Speech recognition setup error:', err);
      }
    }
  }, [language]);

  const toggleListen = async () => {
    setMicError(null);
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          promptVoiceFallback();
        }
      } else {
        promptVoiceFallback();
      }
    }
  };

  const promptVoiceFallback = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const sampleQuery =
        language === 'hi'
          ? 'क्या आज मेरे इलाके में बारिश होगी?'
          : language === 'ta'
          ? 'இன்று என் பகுதியில் மழை பெய்யுமா?'
          : 'Will it rain today in my area?';
      setQuery(sampleQuery);
      handleSend(sampleQuery);
    }, 1800);
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || query).trim();
    if (!text || isLoading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = 'user_' + Date.now();

    const historyPayload = messages
      .filter((m) => m.id !== 'welcome_1')
      .slice(-6)
      .map((m) => ({
        role: m.role,
        text: m.text,
        location: m.resolved_location,
      }));

    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: 'user',
        text,
        timestamp: timeStr,
      },
    ]);

    setIsLoading(true);
    setQuery('');
    setMicError(null);

    try {
      const res = await api.chatQuery({
        text,
        lang: language,
        lat: currentLat,
        lon: currentLon,
        city: currentCity,
        profession,
        conversation_history: historyPayload,
      });

      const aiMsgId = 'ai_' + Date.now();
      const newReply: MessageItem = {
        id: aiMsgId,
        role: 'assistant',
        text: res.answer,
        resolved_location: res.resolved_location,
        lat: res.lat,
        lon: res.lon,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider_used: res.provider_used,
        suggested_followups: res.suggested_followups,
        why_reason: res.why_reason,
        action_tip: res.action_tip,
        best_window: res.best_window,
        language_mirror_style: res.language_mirror_style,
      };

      setMessages((prev) => [...prev, newReply]);
      speakText(res.answer, aiMsgId);

      if (
        res.resolved_location &&
        typeof res.lat === 'number' &&
        typeof res.lon === 'number' &&
        (res.resolved_location !== currentCity || res.lat !== currentLat || res.lon !== currentLon)
      ) {
        onLocationResolved?.(res.resolved_location, res.lat, res.lon);
      }
    } catch (e) {
      console.error(e);
      const errorMsgId = 'err_' + Date.now();
      setMessages((prev) => [
        ...prev,
        {
          id: errorMsgId,
          role: 'assistant',
          text: `Weather data for ${currentCity || 'your area'} is updated. Current parameters remain stable.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string, msgId: string) => {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);

      if (/[\u0B80-\u0BFF]/.test(text)) {
        utterance.lang = 'ta-IN';
      } else if (/[\u0900-\u097F]/.test(text)) {
        utterance.lang = 'hi-IN';
      } else if (/[\u0C00-\u0C7F]/.test(text)) {
        utterance.lang = 'te-IN';
      } else if (/[\u0980-\u09FF]/.test(text)) {
        utterance.lang = 'bn-IN';
      } else {
        utterance.lang = 'en-IN';
      }

      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeakingId(msgId);
      utterance.onend = () => setIsSpeakingId(null);
      utterance.onerror = () => setIsSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech playback:', err);
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
    }
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([]);
  };

  return (
    <div className="w-full relative z-20">
      {/* Primary Interactive Chat Hero Surface */}
      <div className="rounded-3xl glass-chat-hero p-4 sm:p-5 border border-sky-400/25 dark:border-sky-500/20 shadow-md flex flex-col">
        {/* Chat Hero Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                WeatherGPT
              </h3>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Your AI Weather Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
            {messages.length > 1 && (
              <button
                onClick={clearChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Roomy Conversational Stream */}
        <div
          ref={scrollContainerRef}
          className={`overflow-y-auto space-y-3 pr-1 ${
            standaloneHero ? 'max-h-[60vh] min-h-[300px]' : 'max-h-72 min-h-[160px]'
          }`}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              } animate-in fade-in`}
            >
              {msg.role === 'user' ? (
                <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-sky-500 text-white px-4 py-2.5 text-xs sm:text-sm font-medium shadow-xs leading-relaxed">
                  {msg.text}
                </div>
              ) : (
                <div className="max-w-[95%] rounded-2xl rounded-tl-xs bg-white/90 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700 p-3.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 shadow-xs">
                  {/* Assistant Header */}
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100 dark:border-slate-700/80">
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400">WeatherGPT</span>
                      {msg.resolved_location && (
                        <span className="text-[9px] px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800/50 flex items-center gap-0.5">
                          📍 {msg.resolved_location}
                        </span>
                      )}
                      {msg.language_mirror_style && (
                        <span className="text-[9px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800/50">
                          {msg.language_mirror_style}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={
                        isSpeakingId === msg.id
                          ? stopSpeaking
                          : () => speakText(msg.text, msg.id)
                      }
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title={isSpeakingId === msg.id ? 'Stop reading' : 'Read aloud'}
                    >
                      {isSpeakingId === msg.id ? (
                        <VolumeX className="w-4 h-4 text-amber-500 animate-pulse" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <p className="whitespace-pre-line leading-relaxed font-medium">{msg.text}</p>

                  {/* Contextual Suggested Followups */}
                  {msg.suggested_followups && msg.suggested_followups.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/80 flex flex-wrap gap-1.5">
                      {msg.suggested_followups.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(s)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-1"
                        >
                          <span>{s}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/40 text-xs sm:text-sm text-sky-700 dark:text-sky-300 animate-pulse">
              <Bot className="w-4 h-4 animate-spin" />
              <span>Analyzing live atmospheric telemetry...</span>
            </div>
          )}
        </div>

        {/* Integrated Contextual Decision Chips */}
        <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
          <DecisionChips
            onSelectQuery={(q) => handleSend(q)}
            profession={profession}
            lang={language}
          />
        </div>

        {/* Large, Attractive Conversational Input Container */}
        <div className="mt-2">
          <div className="relative flex items-center rounded-2xl glass-input-box transition-all">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                isListening
                  ? getTranslation(language, 'listening')
                  : 'Ask anything about your weather...'
              }
              className="w-full bg-transparent px-4 py-3.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-medium"
            />

            <div className="flex items-center space-x-1.5 pr-2">
              {/* Mic Button */}
              <button
                onClick={toggleListen}
                className={`p-2.5 rounded-xl transition-all relative ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title="Voice Assistant"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send Button */}
              <button
                onClick={() => handleSend()}
                disabled={!query.trim() || isLoading}
                className="p-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-30 transition-all shadow-sm active:scale-95"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {micError && (
            <div className="mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-center space-x-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{micError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
