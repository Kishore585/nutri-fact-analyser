
import React, { useState, useEffect } from 'react';
import { UserProfile, AppState, ScanResult, User, HistoryItem } from './types';
import ImageUploader from './components/ImageUploader';
import AnalysisView from './components/AnalysisView';
import AuthScreen from './components/AuthScreen';
import HistoryView from './components/HistoryView';
import UserProfileEditor from './components/UserProfileEditor';
import ArchitectureView from './components/ArchitectureView';
import { analyzeImage } from './services/geminiService';
import { storageService } from './services/storageService';
import { PROFILES } from './constants';
import { ShieldCheck, History, LogOut, Settings, GitGraph } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('AUTH');
  const [user, setUser] = useState<User | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to get actual profile object from ID
  const getProfileObject = (id?: string) => {
      return PROFILES.find(p => p.id === id) || PROFILES[0];
  };

  // Check for existing session on mount
  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadHistory(currentUser);
      
      // If user has no preferences set, force them to editor, otherwise go to upload
      if (currentUser.preferences) {
          setState('UPLOAD');
      } else {
          setState('PROFILE_EDITOR');
      }
    } else {
      setState('AUTH');
    }
  }, []);

  const loadHistory = (currentUser: User) => {
    setHistory(storageService.getHistory(currentUser));
  };

  const handleLogin = (email: string, isGoogle: boolean) => {
    const newUser = storageService.login(email, isGoogle ? 'Google User' : undefined);
    setUser(newUser);
    loadHistory(newUser);
    
    if (newUser.preferences) {
        setState('UPLOAD');
    } else {
        setState('PROFILE_EDITOR');
    }
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setResult(null);
    setState('AUTH');
  };

  const handleProfileUpdate = (updatedUser: User) => {
      setUser(updatedUser);
      storageService.updateUser(updatedUser);
      setState('UPLOAD');
  };

  const handleFileUpload = async (file: File) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    // Get preferences
    const baseProfile = getProfileObject(user.preferences?.baseProfileId);
    const customConditions = user.preferences?.customConditions;

    await new Promise(r => setTimeout(r, 300));

    try {
      // Pass both base context and custom conditions
      const analysisData = await analyzeImage(file, baseProfile.promptContext, customConditions);
      setResult(analysisData);
      
      // Save to History
      storageService.saveScan(user, analysisData, baseProfile);
      // Refresh history list
      loadHistory(user);

      setState('RESULTS');
    } catch (err: any) {
      setError(err.message || "Something went wrong during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setState('UPLOAD');
  };

  const openHistory = () => {
      if (user) {
          loadHistory(user);
          setState('HISTORY');
      }
  };

  const openSettings = () => {
      if (user) {
          setState('PROFILE_EDITOR');
      }
  };

  const openArchitecture = () => {
      setState('ARCHITECTURE');
  };

  const handleHistorySelect = (item: HistoryItem) => {
      setResult(item);
      setState('RESULTS');
  };

  const activeProfile = getProfileObject(user?.preferences?.baseProfileId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => user ? reset() : null} 
            className="flex items-center gap-2 group disabled:opacity-50"
            disabled={state === 'AUTH'}
          >
             <div className="bg-emerald-500 p-1.5 rounded-lg text-white group-hover:bg-emerald-600 transition-colors">
               <ShieldCheck className="w-5 h-5" />
             </div>
             <span className="font-bold text-xl tracking-tight text-slate-800">NutriScan<span className="text-emerald-500">AI</span></span>
          </button>
          
          {user && state !== 'AUTH' && (
             <div className="flex items-center gap-2 md:gap-4">
                {state !== 'HISTORY' && state !== 'ARCHITECTURE' && (
                    <button 
                        onClick={openHistory}
                        className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                        title="View History"
                    >
                        <History className="w-5 h-5" />
                    </button>
                )}

                {state !== 'PROFILE_EDITOR' && state !== 'ARCHITECTURE' && (
                     <button 
                     onClick={openSettings}
                     className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                     title="Edit Profile"
                 >
                     <Settings className="w-5 h-5" />
                 </button>
                )}
                
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full border border-slate-200 hidden md:block" />
                    <button 
                        onClick={handleLogout}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
             </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-start pt-8 pb-12 px-4">
        
        {error && (
          <div className="w-full max-w-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center justify-between animate-fade-in">
             <span>{error}</span>
             <button onClick={() => setError(null)} className="font-bold hover:underline">Dismiss</button>
          </div>
        )}

        {state === 'AUTH' && (
            <AuthScreen onLogin={handleLogin} />
        )}

        {state === 'PROFILE_EDITOR' && user && (
          <UserProfileEditor user={user} onSave={handleProfileUpdate} />
        )}

        {state === 'UPLOAD' && user && (
          <ImageUploader 
            selectedProfile={activeProfile}
            onUpload={handleFileUpload}
            onBack={openSettings}
            loading={loading}
          />
        )}

        {state === 'RESULTS' && result && (
          <div className="w-full flex flex-col items-center">
            <AnalysisView 
              result={result} 
              userProfileName={(result as HistoryItem).profileName || activeProfile.name}
              onReset={reset}
            />
          </div>
        )}

        {state === 'HISTORY' && (
            <HistoryView 
                history={history}
                onSelect={handleHistorySelect}
                onBack={reset}
            />
        )}

        {state === 'ARCHITECTURE' && (
            <ArchitectureView onBack={() => user ? reset() : setState('AUTH')} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm flex flex-col md:flex-row items-center justify-center gap-4">
          <p>© {new Date().getFullYear()} NutriScan AI. Not medical advice.</p>
          <span className="hidden md:inline">•</span>
          <button onClick={openArchitecture} className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
             <GitGraph className="w-3 h-3" /> System Diagram
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
