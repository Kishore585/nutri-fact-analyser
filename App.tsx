
import React, { useState, useEffect } from 'react';
import { UserProfile, AppState, ScanResult, User, HistoryItem } from './types';
import ImageUploader from './components/ImageUploader';
import AnalysisView from './components/AnalysisView';
import AuthScreen from './components/AuthScreen';
import HistoryView from './components/HistoryView';
import UserProfileEditor from './components/UserProfileEditor';
import ArchitectureView from './components/ArchitectureView';
import ProductReport from './components/ProductReport';
import ProjectReportView from './components/ProjectReportView';
import { analyzeImage } from './services/geminiService';
import { storageService } from './services/storageService';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { PROFILES } from './constants';
import { ShieldCheck, History, LogOut, Settings, GitGraph, BookOpen, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('AUTH');
  const [user, setUser] = useState<User | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfileObject = (id?: string) => PROFILES.find(p => p.id === id) || PROFILES[0];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const baseUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email}&background=10b981&color=fff`
        };
        
        const syncedUser = await storageService.syncUser(baseUser);
        setUser(syncedUser);
        
        const cloudHistory = await storageService.getHistory(syncedUser.id);
        setHistory(cloudHistory);
        
        setState(syncedUser.preferences ? 'UPLOAD' : 'PROFILE_EDITOR');
      } else {
        setUser(null);
        setState('AUTH');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setResult(null);
    setState('AUTH');
  };

  const handleProfileUpdate = async (updatedUser: User) => {
    if (!user) return;
    setUser(updatedUser);
    await storageService.updateUserPreferences(user.id, updatedUser.preferences);
    setState('UPLOAD');
  };

  const handleDeleteHistoryItem = async (scanId: string) => {
    if (!user) return;
    try {
      await storageService.deleteScan(user.id, scanId);
      setHistory(prev => prev.filter(item => item.id !== scanId));
    } catch (err: any) {
      setError("Failed to delete history item.");
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!user) return;
    setScanning(true);
    setError(null);
    const baseProfile = getProfileObject(user.preferences?.baseProfileId);
    try {
      // 1. Analyze with Gemini
      const analysisData = await analyzeImage(file, baseProfile.promptContext, user.preferences?.customConditions);
      setResult(analysisData);
      
      // 2. Save to Cloud Storage and Firestore
      await storageService.saveScan(user.id, analysisData, baseProfile, file);
      
      // 3. Refresh History
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

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="px-6 pt-8 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto h-24 glass rounded-[2.5rem] px-10 flex items-center justify-between shadow-2xl">
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
          
          {user && state !== 'AUTH' && (
             <div className="flex items-center gap-2">
                <button onClick={() => setState('HISTORY')} className="p-4 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all">
                    <History className="w-6 h-6" />
                </button>
                <button onClick={() => setState('PROFILE_EDITOR')} className="p-4 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all">
                    <Settings className="w-6 h-6" />
                </button>
                <div className="h-10 w-px bg-slate-200/60 mx-4"></div>
                <div className="flex items-center gap-4">
                    <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-md hidden sm:block" alt="Avatar" />
                    <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 transition-colors p-2">
                        <LogOut className="w-6 h-6" />
                    </button>
                </div>
             </div>
          )}
        </div>
      </header>

      <main className="flex-grow pt-12 pb-24 px-6">
        {error && (
          <div className="w-full max-w-lg mx-auto glass border-rose-200 text-rose-700 px-8 py-5 rounded-[2rem] mb-12 flex items-center justify-between animate-fade-in shadow-2xl">
             <span className="font-bold text-sm tracking-tight">{error}</span>
             <button onClick={() => setError(null)} className="text-[10px] font-black uppercase tracking-widest hover:underline">Dismiss</button>
          </div>
        )}

        {state === 'AUTH' && <AuthScreen onLogin={() => {}} />}
        {state === 'PROFILE_EDITOR' && user && <UserProfileEditor user={user} onSave={handleProfileUpdate} />}
        {state === 'UPLOAD' && user && <ImageUploader selectedProfile={activeProfile} onUpload={handleFileUpload} onBack={() => setState('PROFILE_EDITOR')} loading={scanning} />}
        {state === 'RESULTS' && result && <AnalysisView result={result} onViewReport={() => setState('REPORT')} userProfileName={(result as HistoryItem).profileName || activeProfile.name} onReset={reset} />}
        {state === 'REPORT' && result && user && <ProductReport result={result} profileName={(result as HistoryItem).profileName || activeProfile.name} userName={user.name} onBack={() => setState('RESULTS')} />}
        {state === 'HISTORY' && <HistoryView history={history} onDelete={handleDeleteHistoryItem} onSelect={(item) => { setResult(item); setState('RESULTS'); }} onBack={reset} />}
        {state === 'ARCHITECTURE' && <ArchitectureView onBack={() => user ? reset() : setState('AUTH')} />}
        {state === 'PROJECT_DOC' && <ProjectReportView onBack={() => user ? reset() : setState('AUTH')} />}
      </main>

      <footer className="px-6 pb-12 print:hidden">
        <div className="max-w-4xl mx-auto glass rounded-[3rem] p-12 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-10">
              <button onClick={() => setState('PROJECT_DOC')} className="flex items-center gap-3 text-slate-400 hover:text-indigo-600 font-bold tracking-tight transition-all">
                 <BookOpen className="w-5 h-5" /> Technical Report
              </button>
              <button onClick={() => setState('ARCHITECTURE')} className="flex items-center gap-3 text-slate-400 hover:text-indigo-600 font-bold tracking-tight transition-all">
                 <GitGraph className="w-5 h-5" /> Infrastructure
              </button>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-60">© {new Date().getFullYear()} NutriScan AI • Cloud Verified</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
