export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  preferredLanguage: string;
}

export interface Message {
  id: string;
  text: string;
  translation?: string;
  senderId: string; // 'me' or 'peer'
  timestamp: number;
  language: string;
}

export type AppMode = 'home' | 'remote' | 'face-to-face' | 'settings' | 'profile';

export type AppTheme = 'light' | 'dark' | 'system';
export type AppLanguage = 'es' | 'en' | 'hu' | 'fr' | 'de' | 'it' | 'pt';

export interface Language {
  code: string;
  name: string;
  flag: string;
  voiceCode: string; // For SpeechSynthesis
}

export const LANGUAGES: Language[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸', voiceCode: 'es-ES' },
  { code: 'en', name: 'English', flag: '🇺🇸', voiceCode: 'en-US' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', voiceCode: 'fr-FR' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', voiceCode: 'de-DE' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', voiceCode: 'it-IT' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', voiceCode: 'pt-BR' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', voiceCode: 'ja-JP' },
  { code: 'zh', name: '中文', flag: '🇨🇳', voiceCode: 'zh-CN' }
];