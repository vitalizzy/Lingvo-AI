import React, { useState, useEffect, useRef } from 'react';
import { User, LANGUAGES, Language } from '../../../shared/types/types';
import { geminiService } from '../../translation/infrastructure/geminiService';

interface FaceToFaceProps {
  user: User;
  onBack: () => void;
  t: any;
  errorT: any;
}

const SpeakerSection = ({ 
  side, 
  langCode, 
  text, 
  status, 
  isListening, 
  onMicClick, 
  onChangeLang,
  translatedText,
  t
}: {
  side: 'A' | 'B';
  langCode: string;
  text: string;
  status: string;
  isListening: boolean;
  onMicClick: () => void;
  onChangeLang: () => void;
  translatedText?: string;
  t: any;
}) => {
  const lang = LANGUAGES.find(l => l.code === langCode);
  const isTop = side === 'A'; // Top is A, Bottom is B

  return (
    <div className={`flex-1 relative flex flex-col w-full transition-colors duration-300 ${
        isTop ? 'bg-primary/5 dark:bg-primary/10 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5' : 'bg-white dark:bg-background-dark'
    }`}>
      {/* Content Container - Rotated for mobile top speaker */}
      <div className={`absolute inset-0 flex flex-col p-6 pb-20 md:pb-6 justify-between ${
          isTop ? 'rotate-180 md:rotate-0' : ''
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between opacity-70">
            <button 
                onClick={onChangeLang}
                className="flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/10 px-3 py-1 rounded-full transition-colors text-slate-900 dark:text-white"
            >
                <span className="text-2xl">{lang?.flag}</span>
                <span className="text-sm font-bold tracking-wide uppercase">{lang?.name}</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-900 dark:text-white">
                <span className="material-symbols-outlined">more_horiz</span>
            </button>
        </div>

        {/* Display Text */}
        <div className="flex-1 flex flex-col justify-center items-center text-center overflow-y-auto no-scrollbar py-4">
             {isListening && (
                 <div className="flex items-center gap-1 h-8 mb-4">
                    <div className="w-1 h-3 bg-primary animate-wave"></div>
                    <div className="w-1 h-5 bg-primary animate-wave animation-delay-100"></div>
                    <div className="w-1 h-8 bg-primary animate-wave animation-delay-200"></div>
                    <div className="w-1 h-5 bg-primary animate-wave animation-delay-100"></div>
                    <div className="w-1 h-3 bg-primary animate-wave"></div>
                 </div>
             )}
             
             <h1 className={`text-3xl md:text-4xl font-extrabold leading-tight transition-all duration-300 font-display ${
                 text ? (isTop ? 'text-primary' : 'text-slate-900 dark:text-white') : 'text-slate-400 dark:text-slate-600'
             }`}>
                {text || t.touchToSpeak}
             </h1>

             {translatedText && (
                <p className="mt-4 text-xl text-slate-500 dark:text-slate-400 font-medium italic animate-fadeIn">
                    {translatedText}
                </p>
             )}

             <p className="mt-6 text-slate-400 dark:text-slate-500 font-medium text-sm uppercase tracking-widest">
                {status}
             </p>
        </div>
      </div>
    </div>
  );
};

const FaceToFace: React.FC<FaceToFaceProps> = ({ user, onBack, t, errorT }) => {
  // State
  const [langA, setLangA] = useState('es');
  const [langB, setLangB] = useState('en');
  
  const [textA, setTextA] = useState('');
  const [transA, setTransA] = useState(''); // A translated to B's language
  const [statusA, setStatusA] = useState(t.ready);
  const [listeningA, setListeningA] = useState(false);

  const [textB, setTextB] = useState('');
  const [transB, setTransB] = useState(''); // B translated to A's language
  const [statusB, setStatusB] = useState(t.ready);
  const [listeningB, setListeningB] = useState(false);
  
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
    }
  }, []);

  const handleMicClick = (side: 'A' | 'B') => {
    setError(null);
    const isA = side === 'A';
    
    // Stop any current listening
    if (listeningA || listeningB) {
        recognitionRef.current?.stop();
        setListeningA(false);
        setListeningB(false);
        setStatusA(t.ready);
        setStatusB(t.ready);
        // If we clicked the one that was already listening, just return (toggle off)
        if ((isA && listeningA) || (!isA && listeningB)) return;
    }

    // Start listening for the selected side
    const langCode = isA ? langA : langB;
    const langConfig = LANGUAGES.find(l => l.code === langCode);
    
    if (recognitionRef.current) {
        recognitionRef.current.lang = langConfig?.voiceCode || 'en-US';
        
        recognitionRef.current.onstart = () => {
             if (isA) {
                 setListeningA(true);
                 setStatusA(t.listening);
                 setTextA(''); setTransA('');
             } else {
                 setListeningB(true);
                 setStatusB(t.listening);
                 setTextB(''); setTransB('');
             }
        };

        recognitionRef.current.onresult = async (event: any) => {
            const transcript = event.results[0][0].transcript;
            
            try {
                if (isA) {
                    setTextA(transcript);
                    setStatusA(t.processing);
                    const translation = await geminiService.translate(transcript, langA, langB);
                    setTransA(translation);
                    setStatusA(t.completed);
                    speak(translation, langB);
                } else {
                    setTextB(transcript);
                    setStatusB(t.processing);
                    const translation = await geminiService.translate(transcript, langB, langA);
                    setTransB(translation);
                    setStatusB(t.completed);
                    speak(translation, langA);
                }
            } catch(e: any) {
                console.error("Gemini Error", e);
                let errMsg = errorT.generic;
                if (e.message?.includes('API Key')) errMsg = errorT.apiKeyInvalid;
                if (e.message?.includes('quota')) errMsg = errorT.quotaExceeded;
                setError(errMsg);
                if(isA) setStatusA("Error"); else setStatusB("Error");
                setTimeout(() => setError(null), 5000);
            }
            
            setListeningA(false);
            setListeningB(false);
        };

        recognitionRef.current.onerror = (e: any) => {
            console.error("Speech Error", e);
            setListeningA(false);
            setListeningB(false);
            if(isA) setStatusA('Error'); else setStatusB('Error');

            let errorMessage = errorT.generic;
            if (e.error === 'not-allowed') errorMessage = errorT.permissionDenied;
            if (e.error === 'no-speech') errorMessage = errorT.noSpeech;
            if (e.error === 'audio-capture') errorMessage = errorT.audioCapture;
            if (e.error === 'network') errorMessage = errorT.network;
            
            setError(errorMessage);
            setTimeout(() => setError(null), 5000);
        };

        recognitionRef.current.onend = () => {
             if (listeningA) setListeningA(false);
             if (listeningB) setListeningB(false);
        };

        try {
            recognitionRef.current.start();
        } catch(e) {
            console.error("Start Error", e);
            setError(errorT.generic);
        }
    } else {
        setError(errorT.browserNotSupported);
        setTimeout(() => setError(null), 5000);
    }
  };

  const speak = (text: string, langCode: string) => {
    if ('speechSynthesis' in window) {
       const utterance = new SpeechSynthesisUtterance(text);
       const langConfig = LANGUAGES.find(l => l.code === langCode);
       utterance.lang = langConfig?.voiceCode || 'en-US';
       window.speechSynthesis.speak(utterance);
    }
  };

  const cycleLang = (side: 'A' | 'B') => {
      const current = side === 'A' ? langA : langB;
      const idx = LANGUAGES.findIndex(l => l.code === current);
      const next = LANGUAGES[(idx + 1) % LANGUAGES.length].code;
      if (side === 'A') setLangA(next);
      else setLangB(next);
  };

  return (
    <div className="h-full w-full flex flex-col md:flex-row relative overflow-hidden bg-background-light dark:bg-background-dark font-display">
        
        {/* Error Toast */}
        {error && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 w-full max-w-sm px-4">
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

        {/* Floating Controls (Center) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <div className="bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-2xl shadow-black/10 dark:shadow-black/50 rounded-full p-2 flex md:flex-col items-center gap-2 pointer-events-auto">
                {/* Mic A */}
                <button 
                    onClick={() => handleMicClick('A')}
                    className={`size-16 rounded-full flex flex-col items-center justify-center transition-all active:scale-95 ${
                        listeningA 
                        ? 'bg-primary text-white shadow-lg shadow-primary/40' 
                        : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300'
                    }`}
                >
                    <span className={`material-symbols-outlined text-3xl ${listeningA ? 'filled' : ''}`}>
                        {listeningA ? 'graphic_eq' : 'mic_none'}
                    </span>
                    <span className="text-[10px] font-bold mt-[-2px]">{langA.toUpperCase()}</span>
                </button>

                {/* Divider */}
                <div className="w-[1px] h-8 md:w-8 md:h-[1px] bg-slate-300 dark:bg-white/10"></div>

                {/* Mic B */}
                <button 
                    onClick={() => handleMicClick('B')}
                    className={`size-16 rounded-full flex flex-col items-center justify-center transition-all active:scale-95 ${
                        listeningB 
                        ? 'bg-primary text-white shadow-lg shadow-primary/40' 
                        : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300'
                    }`}
                >
                    <span className={`material-symbols-outlined text-3xl ${listeningB ? 'filled' : ''}`}>
                        {listeningB ? 'graphic_eq' : 'mic_none'}
                    </span>
                     <span className="text-[10px] font-bold mt-[-2px]">{langB.toUpperCase()}</span>
                </button>
            </div>
        </div>

        {/* Back Button (Absolute) */}
        <button 
            onClick={onBack}
            className="absolute top-4 right-4 z-40 size-10 flex items-center justify-center rounded-full bg-white/20 dark:bg-black/20 text-slate-900 dark:text-white hover:bg-white/40 dark:hover:bg-black/40 transition-colors backdrop-blur-sm shadow-sm"
        >
            <span className="material-symbols-outlined">close</span>
        </button>

        <SpeakerSection 
            side="A" 
            langCode={langA} 
            text={textA} 
            status={statusA} 
            isListening={listeningA}
            onMicClick={() => handleMicClick('A')}
            onChangeLang={() => cycleLang('A')}
            translatedText={transA}
            t={t}
        />
        <SpeakerSection 
            side="B" 
            langCode={langB} 
            text={textB} 
            status={statusB} 
            isListening={listeningB}
            onMicClick={() => handleMicClick('B')}
            onChangeLang={() => cycleLang('B')}
            translatedText={transB}
            t={t}
        />
    </div>
  );
};

export default FaceToFace;