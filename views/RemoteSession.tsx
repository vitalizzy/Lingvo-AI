import React, { useState, useEffect, useRef } from 'react';
import { User, Message, LANGUAGES } from '../types';
import { geminiService } from '../services/geminiService';

interface RemoteSessionProps {
  user: User;
  sessionId: string;
  onBack: () => void;
  t: any;
  errorT: any;
}

const RemoteSession: React.FC<RemoteSessionProps> = ({ user, sessionId, onBack, t, errorT }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [peerName, setPeerName] = useState(t.waiting);
  const [peerLang, setPeerLang] = useState('en'); // Simulated peer language
  const [myLang, setMyLang] = useState(user.preferredLanguage || 'es');
  const [textInput, setTextInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Session Simulation
  useEffect(() => {
    // Simulate connection
    const timer = setTimeout(() => {
      setConnectionStatus('connected');
      setPeerName('Sarah Connor');
      // Welcome message
      addMessage({
        id: 'sys-1',
        text: "Hello! I'm speaking English.",
        senderId: 'peer',
        timestamp: Date.now(),
        language: peerLang
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Auto scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      const langConfig = LANGUAGES.find(l => l.code === myLang);
      recognitionRef.current.lang = langConfig?.voiceCode || 'es-ES';

      recognitionRef.current.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        await handleSendMessage(text);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error", event.error);
        setIsRecording(false);
        
        let errorMessage = errorT.generic;
        if (event.error === 'not-allowed') errorMessage = errorT.permissionDenied;
        if (event.error === 'no-speech') errorMessage = errorT.noSpeech;
        if (event.error === 'audio-capture') errorMessage = errorT.audioCapture;
        if (event.error === 'network') errorMessage = errorT.network;
        
        setError(errorMessage);
        setTimeout(() => setError(null), 4000);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    } else {
        // Browser not supported for speech
    }
  }, [myLang]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
        setError(errorT.browserNotSupported);
        setTimeout(() => setError(null), 4000);
        return;
    }
    
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
        setError(null);
      } catch(e) {
          console.error(e);
          setError(errorT.generic);
      }
    }
  };

  const addMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    setError(null);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      text: text,
      senderId: 'me',
      timestamp: Date.now(),
      language: myLang
    };
    addMessage(userMsg);

    try {
        // UI Feedback for peer typing
        setTimeout(async () => {
            try {
                // Get AI response as peer
                const peerResponseText = await geminiService.simulatePeerResponse(text, peerLang);
                
                // Translate Peer Response to My Language for display (Lingvo feature)
                const translation = await geminiService.translate(peerResponseText, peerLang, myLang);
                
                const peerMsg: Message = {
                    id: crypto.randomUUID(),
                    text: peerResponseText, // The original text spoken by peer
                    translation: translation, // Translated for me
                    senderId: 'peer',
                    timestamp: Date.now(),
                    language: peerLang
                };
                
                addMessage(peerMsg);
                
                // Auto Speak (TTS) the translation
                speakText(translation, myLang);
            } catch (e: any) {
                console.error("Gemini Error:", e);
                let errMsg = errorT.generic;
                if (e.message?.includes('API Key')) errMsg = errorT.apiKeyInvalid;
                if (e.message?.includes('quota')) errMsg = errorT.quotaExceeded;
                setError(errMsg);
                setTimeout(() => setError(null), 5000);
            }
        }, 1500);
    } catch (e) {
        // Immediate send error
        setError(errorT.network);
    }
  };

  const speakText = (text: string, langCode: string) => {
     if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        const langConfig = LANGUAGES.find(l => l.code === langCode);
        utterance.lang = langConfig?.voiceCode || 'en-US';
        window.speechSynthesis.speak(utterance);
     }
  };

  const currentLangObj = LANGUAGES.find(l => l.code === myLang);

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto bg-background-light dark:bg-background-dark font-display relative">
      
      {/* Error Toast */}
      {error && (
        <div className="absolute top-20 left-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
            <div className="bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined">error</span>
                     <span className="text-sm font-medium">{error}</span>
                </div>
                <button onClick={() => setError(null)} className="hover:bg-white/20 rounded-full p-1">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
            </div>
        </div>
      )}

      {/* Header */}
      <header className="shrink-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 transition-colors">
                <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
            <div className="relative">
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-800/20 rounded-full size-10 border border-slate-200 dark:border-gray-700 flex items-center justify-center text-xl text-purple-600 dark:text-purple-400">
                    {connectionStatus === 'connected' ? 'SC' : '...'}
                </div>
                <div className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white dark:border-background-dark ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
            </div>
            <div>
                <h2 className="font-bold leading-tight text-slate-900 dark:text-white">{peerName}</h2>
                <p className="text-xs text-slate-500">
                    {connectionStatus === 'connected' ? t.online : t.connecting}
                </p>
            </div>
        </div>
        <div className="bg-slate-100 dark:bg-surface-dark px-3 py-1 rounded-full border border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 font-mono">
            #{sessionId.slice(0, 4)}
        </div>
      </header>

      {/* Chat Area */}
      <main 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-6"
      >
        <div className="text-center py-4">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-gray-800/50 text-xs font-medium text-slate-500 dark:text-slate-400">
                {t.today} {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
        </div>

        {messages.map((msg) => {
            const isMe = msg.senderId === 'me';
            return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} message-fade-in`}>
                    <div className={`flex flex-col max-w-[85%] ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed ${
                            isMe 
                            ? 'bg-gradient-to-r from-primary to-primary-dark text-white rounded-tr-sm' 
                            : 'bg-white dark:bg-surface-dark text-slate-700 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-white/5'
                        }`}>
                            <p>{msg.text}</p>
                            {msg.translation && (
                                <div className="mt-2 pt-2 border-t border-white/10 text-primary-dark/80 dark:text-primary/80 italic text-sm">
                                    {msg.translation}
                                </div>
                            )}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 mx-1">
                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                </div>
            );
        })}
        
        {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-40 opacity-50 mt-10">
                <span className="material-symbols-outlined text-4xl mb-2 text-primary">graphic_eq</span>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t.startTalking}</p>
             </div>
        )}
      </main>

      {/* Footer */}
      <footer className="shrink-0 bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-gray-800 p-3 pb-6 transition-colors">
        <div className="flex items-end gap-2">
            <button 
                className="shrink-0 size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-2xl"
                onClick={() => {
                   const idx = LANGUAGES.findIndex(l => l.code === myLang);
                   const next = LANGUAGES[(idx + 1) % LANGUAGES.length];
                   setMyLang(next.code);
                }}
            >
                {currentLangObj?.flag}
            </button>

            <div className="flex-1 relative">
                <textarea
                    rows={1}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(textInput);
                            setTextInput('');
                        }
                    }}
                    placeholder={`${t.writeOrSpeak} ${currentLangObj?.name}...`}
                    className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-gray-700 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary resize-none no-scrollbar text-sm text-slate-900 dark:text-white"
                    style={{minHeight: '46px'}}
                />
            </div>

            <button 
                id="micBtn"
                onClick={textInput.trim() ? () => { handleSendMessage(textInput); setTextInput(''); } : toggleRecording}
                className={`shrink-0 size-11 flex items-center justify-center rounded-full shadow-lg transition-all active:scale-95 ${
                    textInput.trim() 
                    ? 'bg-primary text-white'
                    : isRecording 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-gradient-to-r from-primary to-primary-dark text-white'
                }`}
            >
                 <span className={`material-symbols-outlined ${isRecording ? 'filled' : ''}`}>
                    {textInput.trim() ? 'send' : 'mic'}
                 </span>
            </button>
        </div>
      </footer>
    </div>
  );
};

export default RemoteSession;