import React, { useState, useEffect, useMemo } from 'react';
import { User, AppMode, LANGUAGES, AppTheme, AppLanguage } from './shared/types/types';
import { authService } from './modules/auth/infrastructure/authService';
import { translations } from './shared/utils/translations';
import Login from './modules/auth/presentation/Login';
import Dashboard from './modules/session/presentation/Dashboard';
import RemoteSession from './modules/session/presentation/RemoteSession';
import FaceToFace from './modules/session/presentation/FaceToFace';
import Profile from './modules/auth/presentation/Profile';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<AppMode>('home');
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Settings State
  const [appTheme, setAppTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('lingvo_theme') as AppTheme) || 'system';
  });
  const [appLanguage, setAppLanguage] = useState<AppLanguage>(() => {
    return (localStorage.getItem('lingvo_lang') as AppLanguage) || 'es';
  });

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = appTheme === 'dark' || (appTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('lingvo_theme', appTheme);
  }, [appTheme]);

  // Persist Language
  useEffect(() => {
    localStorage.setItem('lingvo_lang', appLanguage);
  }, [appLanguage]);

  // Get current translations
  const t = useMemo(() => translations[appLanguage] || translations['es'], [appLanguage]);

  // Auth Check on Mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = authService.getUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (e) {
        console.error("Auth check failed", e);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setMode('home');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setMode('home');
  };

  const startRemoteSession = (id: string) => {
    setSessionId(id);
    setMode('remote');
  };

  const startFaceToFace = () => {
    setMode('face-to-face');
  };

  const openProfile = () => {
    setMode('profile');
  };

  const goBack = () => {
    setMode('home');
    setSessionId(null);
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-background-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Lingvo AI</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Login 
        onLogin={handleLogin} 
        t={t.login}
        errorT={t.errors}
        currentLang={appLanguage}
        onLangChange={setAppLanguage}
        currentTheme={appTheme}
        onThemeChange={setAppTheme}
      />
    );
  }

  return (
    <div className="h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
      {mode === 'home' && (
        <Dashboard 
          user={user} 
          t={t.dashboard}
          onOpenProfile={openProfile}
          onStartRemote={(id) => startRemoteSession(id)}
          onStartFaceToFace={startFaceToFace}
        />
      )}

      {mode === 'remote' && (
        <RemoteSession 
          user={user} 
          t={t.session}
          errorT={t.errors}
          sessionId={sessionId!} 
          onBack={goBack} 
        />
      )}

      {mode === 'face-to-face' && (
        <FaceToFace 
          user={user} 
          t={t.session}
          errorT={t.errors}
          onBack={goBack} 
        />
      )}

      {mode === 'profile' && (
        <Profile 
          user={user} 
          t={t.profile}
          onBack={goBack}
          onLogout={handleLogout}
          onUpdateUser={setUser}
          appTheme={appTheme}
          onAppThemeChange={setAppTheme}
          appLang={appLanguage}
          onAppLangChange={setAppLanguage}
        />
      )}
    </div>
  );
};

export default App;