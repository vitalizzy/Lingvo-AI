import React, { useState } from 'react';
import { User } from '../../../shared/types/types';

interface DashboardProps {
  user: User;
  onOpenProfile: () => void;
  onStartRemote: (id: string) => void;
  onStartFaceToFace: () => void;
  t: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onOpenProfile, onStartRemote, onStartFaceToFace, t }) => {
  const [joinId, setJoinId] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinId.trim()) {
      onStartRemote(joinId);
    }
  };

  const handleCreateNew = () => {
    const newId = crypto.randomUUID().slice(0, 8);
    onStartRemote(newId);
  };

  return (
    <div className="h-full flex flex-col max-w-lg mx-auto p-6 font-display">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 pt-4">
        <div>
          <h1 className="text-2xl font-bold">{t.greeting}, {user.name}</h1>
          <p className="text-slate-400 text-sm">{t.howToTranslate}</p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={onOpenProfile}
                className="size-10 rounded-full border border-white/10 overflow-hidden hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
            >
                {user.photoUrl ? (
                    <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center font-bold text-lg text-white">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}
            </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-6">
        
        {/* Face to Face Card */}
        <button 
            onClick={onStartFaceToFace}
            className="group relative overflow-hidden bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-3xl p-6 text-left hover:border-primary/50 transition-all active:scale-[0.98] shadow-sm dark:shadow-none"
        >
            <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-20 group-hover:opacity-10 dark:group-hover:opacity-40 transition-opacity">
                <span className="material-symbols-outlined text-8xl text-slate-900 dark:text-white">splitscreen</span>
            </div>
            <div className="relative z-10">
                <div className="size-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-2xl">translate</span>
                </div>
                <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">{t.faceToFace}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{t.faceToFaceDesc}</p>
            </div>
        </button>

        <div className="flex items-center gap-4 my-2">
            <div className="h-[1px] bg-slate-200 dark:bg-white/10 flex-1"></div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">{t.remoteLabel}</span>
            <div className="h-[1px] bg-slate-200 dark:bg-white/10 flex-1"></div>
        </div>

        {/* Remote Options */}
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-4 mb-6">
                 <div className="size-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">wifi_tethering</span>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.remote}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t.remoteDesc}</p>
                </div>
            </div>

            <button 
                onClick={handleCreateNew}
                className="w-full bg-primary hover:bg-primary-dark h-12 rounded-xl font-medium mb-4 transition-colors flex items-center justify-center gap-2 text-white shadow-lg shadow-primary/25"
            >
                <span className="material-symbols-outlined text-xl">add</span>
                {t.createRoom}
            </button>

            <form onSubmit={handleJoin} className="relative">
                <input 
                    type="text" 
                    placeholder={t.joinRoomPlaceholder}
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value)}
                    className="w-full h-12 bg-white dark:bg-background-dark border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-12 focus:outline-none focus:border-primary transition-colors text-sm text-slate-900 dark:text-white"
                />
                <button 
                    type="submit"
                    disabled={!joinId.trim()}
                    className="absolute right-1 top-1 size-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-primary disabled:opacity-50 hover:text-white transition-colors text-slate-500 dark:text-slate-400"
                >
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </button>
            </form>
        </div>
      </main>

      <footer className="py-6 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-600">Lingvo AI Translator v1.0.0</p>
      </footer>
    </div>
  );
};

export default Dashboard;