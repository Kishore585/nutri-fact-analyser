
import React, { useState, useEffect } from 'react';
import { UserProfile, AppState, ScanResult, User, HistoryItem } from './types';
import ImageUploader from './components/ImageUploader';
import AnalysisView from './components/AnalysisView';
import AuthScreen from './components/AuthScreen';
import HistoryView from './components/HistoryView';
import UserProfileEditor from './components/UserProfileEditor';
import AccountSettingsView from './components/AccountSettingsView';
import ProductReport from './components/ProductReport';
import { analyzeImage } from './services/geminiService';
import { storageService } from './services/storageService';
import { auth, onAuthStateChanged, signOut } from './services/firebase';
import { PROFILES } from './constants';
import { ShieldCheck, History, LogOut, Settings, Loader2, User as UserIcon, Maximize, Minimize } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('AUTH');
  const [user, setUser] = useState<User | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const getProfileObject = (id?: string) => PROFILES.find(p => p.id === id) || PROFILES[0];

  useEffect(() => {
    // Listen for Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const baseUser: User = {
          id: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || 'User',
          avatar: fbUser.photoURL || undefined
        };
        
        const syncedUser = await storageService.syncUser(baseUser);
        if (syncedUser) {
          setUser(syncedUser);
          const localHistory = await storageService.getHistory(syncedUser.id);
          setHistory(localHistory);
          setState(syncedUser.preferences ? 'UPLOAD' : 'PROFILE_EDITOR');
        }
      } else {
        setUser(null);
        setHistory([]);
        setState('AUTH');
      }
      setLoading(false);
    });

    const handleFsChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    
    return () => {
      unsubscribe();
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleLogin = (userData: User) => {
    // Handled by onAuthStateChanged
  };

  const handleLogout = async () => {
    if (confirm("Log out of your account? Your data will remain safely stored in the cloud.")) {
      await signOut(auth);
    }
  };

  const handleProfileUpdate = async (updatedUser: User) => {
    if (!user) return;
    setUser(updatedUser);
    await storageService.updateUserPreferences(user.id, updatedUser);
    setState('UPLOAD');
  };

  const handleAccountUpdate = async (updatedUser: User) => {
    if (!user) return;
    setUser(updatedUser);
    await storageService.updateUserPreferences(user.id, updatedUser);
    setState('UPLOAD');
  };

  const handleDeleteHistoryItem = async (scanId: string) => {
    if (!user) return;
    try {
      await storageService.deleteScan(user.id, scanId);
      setHistory(prev => prev.filter(item => item.id !== scanId));
    } catch (err: any) {
      setError("Failed to delete record.");
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!user) return;
    setScanning(true);
    setError(null);
    const baseProfile = getProfileObject(user.preferences?.baseProfileId);
    try {
      const analysisData = await analyzeImage(file, baseProfile.promptContext, user.preferences?.customConditions);
      setResult(analysisData);
      
      await storageService.saveScan(user.id, analysisData, baseProfile);
      
      const updatedHistory = await storageService.getHistory(user.id);
      setHistory(updatedHistory);
      
      setState('RESULTS');
    } catch (err: any) {
      setError(err.message || "Failed to process image.");
    } finally {
      setScanning(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setState('UPLOAD');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const activeProfile = getProfileObject(user?.preferences?.baseProfileId);
  const themeClass = user?.preferences?.theme ? `theme-${user.preferences.theme}` : 'theme-indigo';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${themeClass}`}>
      <style>{`
        .theme-indigo .text-indigo-600 { color: #4f46e5; }
        .theme-indigo .bg-indigo-600 { background-color: #4f46e5; }
        .theme-indigo .bg-indigo-50 { background-color: #eef2ff; }
        .theme-emerald .text-indigo-600 { color: #059669; }
        .theme-emerald .bg-indigo-600 { background-color: #059669; }
        .theme-emerald .bg-indigo-50 { background-color: #ecfdf5; }
        .theme-slate .text-indigo-600 { color: #334155; }
        .theme-slate .bg-indigo-600 { background-color: #334155; }
        .theme-slate .bg-indigo-50 { background-color: #f1f5f9; }
        .theme-rose .text-indigo-600 { color: #e11d48; }
        .theme-rose .bg-indigo-600 { background-color: #e11d48; }
        .theme-rose .bg-indigo-50 { background-color: #fff1f2; }
      `}</style>
      
      <header className="px-6 pt-8 sticky top-0 z-50 print:hidden">
        <div className="max-w-[1600px] mx-auto h-24 glass rounded-[2.5rem] px-10 flex items-center justify-between shadow-2xl">
          <button 
            onClick={() => user ? reset() : null} 
            className="flex items-center gap-4 group disabled:opacity-50"
            disabled={state === 'AUTH'}
          >
             <div className="bg-slate-900 p-3 rounded-2xl text-white group-hover:scale-110 transition-transform shadow-xl shadow-slate-900/10">
               <ShieldCheck className="w-6 h-6" />
             </div>
             <span className="font-black text-2xl tracking-tighter text-slate-900">NutriScan<span className="text-indigo-600">AI</span></span>
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleFullScreen} 
              className="p-4 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all"
            >
                {isFullScreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
            </button>

            {user && state !== 'AUTH' && (
               <>
                  <button onClick={() => setState('HISTORY')} className="p-4 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all">
                      <History className="w-6 h-6" />
                  </button>
                  <button onClick={() => setState('PROFILE_EDITOR')} className="p-4 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all">
                      <Settings className="w-6 h-6" />
                  </button>
                  <div className="h-10 w-px bg-slate-200/60 mx-4"></div>
                  <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setState('ACCOUNT_SETTINGS')}
                        className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shadow-md text-indigo-600 hover:scale-110 transition-all overflow-hidden"
                      >
                          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" /> : <UserIcon className="w-6 h-6" />}
                      </button>
                      <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 transition-colors p-2">
                          <LogOut className="w-6 h-6" />
                      </button>
                  </div>
               </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center pt-12 pb-24 px-6 min-h-[calc(100vh-180px)]">
        {error && (
          <div className="w-full max-w-lg mx-auto glass border-rose-200 text-rose-700 px-8 py-5 rounded-[2rem] mb-12 flex items-center justify-between animate-fade-in shadow-2xl">
             <span className="font-bold text-sm tracking-tight">{error}</span>
             <button onClick={() => setError(null)} className="text-[10px] font-black uppercase tracking-widest hover:underline">Dismiss</button>
          </div>
        )}

        <div className="w-full flex items-center justify-center">
          {state === 'AUTH' && <AuthScreen onLogin={handleLogin} />}
          {state === 'PROFILE_EDITOR' && user && <UserProfileEditor user={user} onSave={handleProfileUpdate} />}
          {state === 'ACCOUNT_SETTINGS' && user && <AccountSettingsView user={user} onSave={handleAccountUpdate} onBack={() => setState('UPLOAD')} />}
          {state === 'UPLOAD' && user && <ImageUploader selectedProfile={activeProfile} onUpload={handleFileUpload} onBack={() => setState('PROFILE_EDITOR')} loading={scanning} />}
          {state === 'RESULTS' && result && <AnalysisView result={result} onViewReport={() => setState('REPORT')} userProfileName={(result as HistoryItem).profileName || activeProfile.name} onReset={reset} />}
          {state === 'REPORT' && result && user && <ProductReport result={result} profileName={(result as HistoryItem).profileName || activeProfile.name} userName={user.name} onBack={() => setState('RESULTS')} />}
          {state === 'HISTORY' && <HistoryView history={history} onDelete={handleDeleteHistoryItem} onSelect={(item) => { setResult(item); setState('RESULTS'); }} onBack={reset} />}
        </div>
      </main>

      <footer className="px-6 pb-12 print:hidden">
        <div className="max-w-4xl mx-auto glass rounded-[3rem] p-8 text-center">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} NutriScan AI • Cloud Powered Nutritional Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
