import React, { useState } from 'react';
import { User, AppTheme, AppLanguage } from '../../../shared/types/types';
import { authService } from '../infrastructure/authService';

interface LoginProps {
  onLogin: (user: User) => void;
  t: any;
  errorT: any;
  currentLang: AppLanguage;
  onLangChange: (lang: AppLanguage) => void;
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}

const Login: React.FC<LoginProps> = ({ 
  onLogin, 
  t, 
  errorT,
  currentLang, 
  onLangChange,
  currentTheme,
  onThemeChange
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      const user = await authService.login('google');
      onLogin(user);
    } catch (e) {
      console.error(e);
      setError(errorT.loginFailed || "Login failed");
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      const user = await authService.login('email');
      onLogin(user);
    } catch (e) {
      console.error(e);
      setError(errorT.loginFailed || "Login failed");
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white transition-colors duration-300">
        
        {/* Error Notification */}
        {error && (
            <div className="absolute top-20 left-0 right-0 z-30 flex justify-center px-4">
                <div className="bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-pulse">
                    <span className="material-symbols-outlined">error</span>
                    <span className="text-sm font-medium">{error}</span>
                    <button onClick={() => setError(null)} className="ml-2 hover:bg-white/20 rounded-full p-1">
                        <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                </div>
            </div>
        )}

        {/* Settings Bar */}
        <div className="absolute top-0 right-0 z-20 p-4 flex items-center gap-3">
            {/* Theme Selector */}
            <div className="flex bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-full p-1 border border-slate-200 dark:border-white/10">
                <button 
                    onClick={() => onThemeChange('light')}
                    className={`size-8 rounded-full flex items-center justify-center transition-colors ${currentTheme === 'light' ? 'bg-white shadow-sm text-yellow-500' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    <span className="material-symbols-outlined text-[18px]">light_mode</span>
                </button>
                <button 
                    onClick={() => onThemeChange('system')}
                    className={`size-8 rounded-full flex items-center justify-center transition-colors ${currentTheme === 'system' ? 'bg-white dark:bg-white/10 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    <span className="material-symbols-outlined text-[18px]">settings_brightness</span>
                </button>
                <button 
                    onClick={() => onThemeChange('dark')}
                    className={`size-8 rounded-full flex items-center justify-center transition-colors ${currentTheme === 'dark' ? 'bg-white/10 shadow-sm text-blue-300' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                </button>
            </div>

            {/* Language Selector */}
            <div className="relative group">
                <select 
                    value={currentLang}
                    onChange={(e) => onLangChange(e.target.value as AppLanguage)}
                    className="appearance-none bg-white/50 dark:bg-black/20 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white py-2 pl-4 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer font-medium text-sm"
                >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="hu">Magyar</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                    <option value="pt">Português</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
            </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-center p-6 pt-8 z-10">
            <div className="flex items-center gap-2.5">
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/30">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.4876 3.36093 14.891 4 16.1272L3 21L7.8728 20C9.10898 20.6391 10.5124 21 12 21Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 12H8.01M12 12H12.01M16 12H16.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h2 className="text-xl font-bold leading-tight tracking-tight font-display">Lingvo</h2>
            </div>
        </div>

        {/* Hero Graphic */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 z-10">
            {/* Abstract decorative element */}
            <div className="relative mb-10 h-56 w-full max-w-[300px] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-blue-500/5 shadow-inner ring-1 ring-black/5 dark:ring-white/10">
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Simulated Abstract Art */}
                    <div className="w-[150%] h-[150%] bg-gradient-to-tr from-primary/30 via-purple-500/20 to-transparent blur-3xl absolute -top-10 -right-10 rounded-full animate-pulse-fast"></div>
                    <div className="w-[120%] h-[120%] bg-gradient-to-bl from-blue-400/20 via-transparent to-primary/10 blur-2xl absolute -bottom-10 -left-10 rounded-full"></div>
                </div>
                {/* Floating central icon */}
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center gap-3">
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-purple-600 shadow-2xl ring-4 ring-white/20 backdrop-blur-sm">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.4876 3.36093 14.891 4 16.1272L3 21L7.8728 20C9.10898 20.6391 10.5124 21 12 21Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 12H8.01M12 12H12.01M16 12H16.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Text Content */}
            <div className="w-full max-w-md text-center">
                <h1 className="mb-3 text-[32px] font-bold leading-tight tracking-tight font-display">{t.welcome}</h1>
                <p className="mb-10 text-base font-normal leading-normal text-slate-500 dark:text-slate-400">
                    {t.subtitle}
                </p>
            </div>

            {/* Actions */}
            <div className="w-full max-w-sm space-y-3.5 pb-8">
                {/* Google Button */}
                <button 
                    onClick={handleGoogleLogin}
                    disabled={isLoggingIn}
                    className="relative flex h-14 w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full bg-white px-5 text-base font-bold leading-normal tracking-[0.015em] text-slate-900 shadow-sm ring-1 ring-slate-200 transition-transform active:scale-95 dark:ring-transparent disabled:opacity-70 hover:bg-slate-50"
                >
                    {isLoggingIn ? (
                         <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                    ) : (
                        <>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            <span>{t.continueGoogle}</span>
                        </>
                    )}
                </button>

                {/* Apple Button */}
                <button 
                    disabled={isLoggingIn}
                    className="relative flex h-14 w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full bg-[#1c1c1e] dark:bg-[#292c38] px-5 text-base font-bold leading-normal tracking-[0.015em] text-white shadow-sm transition-transform active:scale-95 hover:bg-black dark:hover:bg-[#34384b]"
                >
                    <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 12.6c0-2.4 2-3.6 2.1-3.7-.1-.3-.6-2.1-2.7-2.2-1.1-.1-2.2.7-2.8.7-.6 0-1.8-.7-2.9-.7-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.7 2.2 1.1-.1 1.5-.7 2.8-.7 1.3 0 1.7.7 2.8.7 1.1 0 1.9-1.1 2.6-2.2.8-1.2 1.1-2.3 1.2-2.4-.1 0-2.3-.9-2.3-3.1M15 5.3c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.7-.9 1.8-.8 2.7 1 0 1.9-.6 2.4-1.3"/>
                    </svg>
                    <span>{t.continueApple}</span>
                </button>

                {/* Divider */}
                <div className="flex w-full items-center gap-3 py-2">
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/10"></div>
                    <span className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">{t.or}</span>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/10"></div>
                </div>

                {/* Email Button */}
                <button 
                    onClick={handleEmailLogin}
                    disabled={isLoggingIn}
                    className="relative flex h-14 w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full bg-primary px-5 text-base font-bold leading-normal tracking-[0.015em] text-white shadow-lg shadow-primary/25 transition-transform active:scale-95 hover:bg-primary-dark"
                >
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                    <span>{t.continueEmail}</span>
                </button>
            </div>
        </div>

        {/* Footer */}
        <div className="pb-8 text-center z-10">
            <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.noAccount} 
                <a className="font-bold text-primary hover:text-blue-600 dark:hover:text-blue-400 ml-1 cursor-pointer">{t.register}</a>
            </p>
        </div>
        
        {/* Abstract shapes in background */}
        <div className="fixed top-[-20%] right-[-10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl z-0 pointer-events-none"></div>
        <div className="fixed bottom-[-10%] left-[-10%] w-[200px] h-[200px] bg-purple-500/5 rounded-full blur-3xl z-0 pointer-events-none"></div>
    </div>
  );
};

export default Login;