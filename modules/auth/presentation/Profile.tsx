import React, { useState } from 'react';
import { User, LANGUAGES, AppTheme, AppLanguage } from '../../../shared/types/types';
import { authService } from '../infrastructure/authService';

interface ProfileProps {
  user: User;
  onBack: () => void;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  t: any;
  appTheme: AppTheme;
  onAppThemeChange: (theme: AppTheme) => void;
  appLang: AppLanguage;
  onAppLangChange: (lang: AppLanguage) => void;
}

interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

const Profile: React.FC<ProfileProps> = ({ 
    user, 
    onBack, 
    onLogout, 
    onUpdateUser, 
    t,
    appTheme,
    onAppThemeChange,
    appLang,
    onAppLangChange
}) => {
  const [modal, setModal] = useState<ModalConfig>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [notifications, setNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [transcriptions, setTranscriptions] = useState(true);

  // Mock Stats - In a real app this would come from a userStats service
  const stats = {
    conversations: 42,
    messages: 1250,
    time: 14
  };

  const handleLanguageClick = () => {
    // Just cycle for now, or could show a modal
    const langs: AppLanguage[] = ['es', 'en', 'hu', 'fr', 'de', 'it', 'pt'];
    const currentIndex = langs.indexOf(appLang);
    const nextIndex = (currentIndex + 1) % langs.length;
    onAppLangChange(langs[nextIndex]);
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setModal({ isOpen: true, title, message, onConfirm });
  };

  const confirmAction = () => {
    modal.onConfirm();
    setModal({ ...modal, isOpen: false });
  };

  const handleClearData = () => {
    showConfirm(
      t.clearData,
      'Se eliminarán todas las preferencias, historial y estadísticas. Esta acción no se puede deshacer.',
      () => {
        // Logic to clear local data
        alert("Datos eliminados correctamente");
      }
    );
  };

  const handleLogoutClick = () => {
    showConfirm(
      t.logout,
      'Se cerrará tu sesión actual.',
      onLogout
    );
  };

  const userLang = LANGUAGES.find(l => l.code === appLang) || LANGUAGES[0];

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-y-auto no-scrollbar bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
      <div className="max-w-2xl w-full mx-auto pb-8">
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0"></div>
        
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6 pt-8">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
                <span className="font-medium">{t.back}</span>
            </button>
            <button onClick={handleLogoutClick} className="flex items-center justify-center size-10 rounded-full hover:bg-slate-200 dark:hover:bg-surface-dark transition-colors text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400">
                <span className="material-symbols-outlined">logout</span>
            </button>
        </div>

        {/* Main Content */}
        <main className="relative z-10 flex flex-1 flex-col px-6 w-full">
            
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-primary-dark/30 flex items-center justify-center ring-4 ring-white dark:ring-white/10 shadow-2xl shadow-primary/20 backdrop-blur-sm">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.4876 3.36093 14.891 4 16.1272L3 21L7.8728 20C9.10898 20.6391 10.5124 21 12 21Z" stroke="#627bea" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 12H8.01M12 12H12.01M16 12H16.01" stroke="#627bea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <button className="absolute bottom-0 right-0 size-8 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg transition-colors flex items-center justify-center border border-white dark:border-background-dark">
                        <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                </div>
                
                <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{t.memberSince} Dec 2025</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-white dark:bg-surface-dark/50 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-center hover:bg-slate-50 dark:hover:bg-surface-dark/80 transition-colors shadow-sm dark:shadow-none">
                    <div className="text-2xl font-bold text-primary mb-1">{stats.conversations}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t.conversations}</div>
                </div>
                <div className="bg-white dark:bg-surface-dark/50 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-center hover:bg-slate-50 dark:hover:bg-surface-dark/80 transition-colors shadow-sm dark:shadow-none">
                    <div className="text-2xl font-bold text-primary mb-1">{stats.messages}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t.messages}</div>
                </div>
                <div className="bg-white dark:bg-surface-dark/50 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-center hover:bg-slate-50 dark:hover:bg-surface-dark/80 transition-colors shadow-sm dark:shadow-none">
                    <div className="text-2xl font-bold text-primary mb-1">{stats.time}h</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t.time}</div>
                </div>
            </div>

            {/* Language Section */}
            <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">{t.preferredLanguage}</h2>
                <div className="bg-white dark:bg-surface-dark/50 border border-slate-200 dark:border-white/5 rounded-2xl p-1 shadow-sm dark:shadow-none">
                    <button 
                        onClick={handleLanguageClick}
                        className="w-full flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center border border-slate-200 dark:border-white/10 text-2xl">
                                {userLang.flag}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-bold text-slate-900 dark:text-white">{userLang.name}</span>
                                <span className="text-xs text-slate-500">{t.nativeLanguage}</span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">chevron_right</span>
                    </button>
                </div>
            </div>

             {/* Theme Section */}
             <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">Theme</h2>
                <div className="flex bg-white dark:bg-surface-dark/50 border border-slate-200 dark:border-white/5 rounded-2xl p-1 shadow-sm dark:shadow-none">
                     <button onClick={() => onAppThemeChange('light')} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${appTheme === 'light' ? 'bg-slate-100 dark:bg-white/10 font-bold text-primary' : 'text-slate-500'}`}>
                        <span className="material-symbols-outlined">light_mode</span>
                        <span className="text-sm">Light</span>
                     </button>
                     <button onClick={() => onAppThemeChange('system')} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${appTheme === 'system' ? 'bg-slate-100 dark:bg-white/10 font-bold text-primary' : 'text-slate-500'}`}>
                        <span className="material-symbols-outlined">settings_brightness</span>
                        <span className="text-sm">System</span>
                     </button>
                     <button onClick={() => onAppThemeChange('dark')} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${appTheme === 'dark' ? 'bg-slate-100 dark:bg-white/10 font-bold text-primary' : 'text-slate-500'}`}>
                        <span className="material-symbols-outlined">dark_mode</span>
                        <span className="text-sm">Dark</span>
                     </button>
                </div>
            </div>


            {/* Preferences */}
            <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">{t.preferences}</h2>
                <div className="bg-white dark:bg-surface-dark/50 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-white/5 shadow-sm dark:shadow-none">
                    
                    {/* Toggle Item */}
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400">notifications</span>
                            <div>
                                <div className="font-medium text-sm text-slate-900 dark:text-white">{t.notifications}</div>
                                <div className="text-xs text-slate-500">{t.notificationsDesc}</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setNotifications(!notifications)}
                            className={`w-11 h-6 rounded-full relative transition-colors ${notifications ? 'bg-primary' : 'bg-slate-200 dark:bg-gray-700'}`}
                        >
                            <div className={`absolute top-[2px] left-[2px] bg-white rounded-full size-5 transition-transform ${notifications ? 'translate-x-5' : ''}`}></div>
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400">volume_up</span>
                            <div>
                                <div className="font-medium text-sm text-slate-900 dark:text-white">{t.autoPlay}</div>
                                <div className="text-xs text-slate-500">{t.autoPlayDesc}</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setAutoPlay(!autoPlay)}
                            className={`w-11 h-6 rounded-full relative transition-colors ${autoPlay ? 'bg-primary' : 'bg-slate-200 dark:bg-gray-700'}`}
                        >
                            <div className={`absolute top-[2px] left-[2px] bg-white rounded-full size-5 transition-transform ${autoPlay ? 'translate-x-5' : ''}`}></div>
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400">closed_caption</span>
                            <div>
                                <div className="font-medium text-sm text-slate-900 dark:text-white">{t.transcriptions}</div>
                                <div className="text-xs text-slate-500">{t.transcriptionsDesc}</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setTranscriptions(!transcriptions)}
                            className={`w-11 h-6 rounded-full relative transition-colors ${transcriptions ? 'bg-primary' : 'bg-slate-200 dark:bg-gray-700'}`}
                        >
                            <div className={`absolute top-[2px] left-[2px] bg-white rounded-full size-5 transition-transform ${transcriptions ? 'translate-x-5' : ''}`}></div>
                        </button>
                    </div>

                </div>
            </div>

            {/* Information Links */}
            <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">{t.info}</h2>
                <div className="bg-white dark:bg-surface-dark/50 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-white/5 shadow-sm dark:shadow-none">
                    <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400">info</span>
                            <span className="font-medium text-sm text-slate-900 dark:text-white">{t.about}</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">chevron_right</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400">help</span>
                            <span className="font-medium text-sm text-slate-900 dark:text-white">{t.help}</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">chevron_right</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400">shield</span>
                            <span className="font-medium text-sm text-slate-900 dark:text-white">{t.privacy}</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">chevron_right</span>
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="mb-8">
                <h2 className="text-sm font-semibold text-red-500 dark:text-red-400 uppercase tracking-wider mb-3 ml-1">{t.dangerZone}</h2>
                <div className="bg-white dark:bg-surface-dark/50 border border-red-100 dark:border-red-500/20 rounded-2xl overflow-hidden divide-y divide-red-50 dark:divide-red-500/10 shadow-sm dark:shadow-none">
                    <button 
                        onClick={handleClearData}
                        className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left"
                    >
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-red-500 dark:text-red-400">delete</span>
                            <div>
                                <div className="font-medium text-red-500 dark:text-red-400 text-sm">{t.clearData}</div>
                                <div className="text-xs text-slate-500">{t.clearDataDesc}</div>
                            </div>
                        </div>
                    </button>
                    <button 
                        onClick={handleLogoutClick}
                        className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left"
                    >
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-red-500 dark:text-red-400">logout</span>
                            <span className="font-medium text-red-500 dark:text-red-400 text-sm">{t.logout}</span>
                        </div>
                    </button>
                </div>
            </div>

            <div className="text-center text-xs text-slate-400 dark:text-slate-600 pb-8">
                <p>Lingvo v1.0.0</p>
                <p>Powered by Google Gemini</p>
            </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-100">
                <div className="flex items-start gap-4 mb-4">
                    <div className="size-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-red-500 dark:text-red-400">warning</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">{modal.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{modal.message}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setModal({ ...modal, isOpen: false })}
                        className="flex-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 transition-colors font-medium text-sm text-slate-700 dark:text-slate-200"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={confirmAction}
                        className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition-colors font-medium text-sm text-white"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Profile;