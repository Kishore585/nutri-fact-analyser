
import React, { useState, useEffect } from 'react';
import { UserProfile, AppState, ScanResult, FoodScanResult, User, HistoryItem } from './types';
import ImageUploader from './components/ImageUploader';
import AnalysisView from './components/AnalysisView';
import FoodScanView from './components/FoodScanView';
import AuthScreen from './components/AuthScreen';
import HistoryView from './components/HistoryView';
import UserProfileEditor from './components/UserProfileEditor';
import AccountSettingsView from './components/AccountSettingsView';
import ProductReport from './components/ProductReport';
import { analyzeImage, analyzeFoodImage } from './services/geminiService';
import { storageService } from './services/storageService';
import { PROFILES } from './constants';
import { History, LogOut, Settings, Loader2, User as UserIcon, Maximize, Minimize, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('AUTH');
  const [user, setUser] = useState<User | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [foodResult, setFoodResult] = useState<FoodScanResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('nutriscan_theme');
    return saved === 'dark';
  });

  // Apply dark class on mount and changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('nutriscan_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(prev => !prev);

  // Apply color theme from user preferences
  useEffect(() => {
    const theme = user?.preferences?.theme || 'emerald';
    document.documentElement.setAttribute('data-theme', theme);
  }, [user?.preferences?.theme]);

  const getProfileObject = (id?: string) => PROFILES.find(p => p.id === id) || PROFILES[0];

  useEffect(() => {
    const initApp = async () => {
      const storedUser = localStorage.getItem('nutriscan_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        const localHistory = await storageService.getHistory(parsedUser.id);
        setHistory(localHistory);
        setState(parsedUser.preferences ? 'UPLOAD' : 'PROFILE_EDITOR');
      } else {
        setState('AUTH');
      }
      setLoading(false);
    };

    initApp();

    const handleFsChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);

    return () => {
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

  const handleLogin = async (userData: User) => {
    const syncedUser = await storageService.syncUser(userData);
    if (syncedUser) {
      setUser(syncedUser);
      const localHistory = await storageService.getHistory(syncedUser.id);
      setHistory(localHistory);
      setState(syncedUser.preferences ? 'UPLOAD' : 'PROFILE_EDITOR');
    }
  };

  const handleLogout = async () => {
    if (confirm("Log out of your account? Your data will be cleared from this device.")) {
      await storageService.clearAllData();
      setUser(null);
      setHistory([]);
      setState('AUTH');
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

  const handleFileUpload = async (file: File, scanMode: 'label' | 'food' = 'label') => {
    if (!user) return;
    setScanning(true);
    setError(null);
    const baseProfile = getProfileObject(user.preferences?.baseProfileId);
    try {
      if (scanMode === 'food') {
        const foodData = await analyzeFoodImage(file, baseProfile.promptContext, user.preferences?.customConditions);
        if (foodData.isFoodImage === false) {
          setError("No food detected in this image. Please upload a photo of actual food (a plate, dish, meal, or snack).");
          return;
        }
        setFoodResult(foodData);
        // Save as a label-compatible history item
        const historyCompatible: ScanResult = {
          verdict: foodData.verdict,
          summary: foodData.summary,
          ingredients: [],
          nutritionalHighlights: foodData.nutritionalHighlights,
          consumptionGuidance: foodData.consumptionGuidance,
        };
        await storageService.saveScan(user.id, historyCompatible, baseProfile);
        const updatedHistory = await storageService.getHistory(user.id);
        setHistory(updatedHistory);
        setState('FOOD_RESULTS');
      } else {
        const analysisData = await analyzeImage(file, baseProfile.promptContext, user.preferences?.customConditions);
        if (analysisData.isNutritionLabel === false) {
          setError("No nutrition label or ingredient list found in this image. Please upload a clear photo of a food product label.");
          return;
        }
        setResult(analysisData);
        await storageService.saveScan(user.id, analysisData, baseProfile);
        const updatedHistory = await storageService.getHistory(user.id);
        setHistory(updatedHistory);
        setState('RESULTS');
      }
    } catch (err: any) {
      setError(err.message || "Failed to process image.");
    } finally {
      setScanning(false);
    }
  };

  const reset = () => {
    setResult(null);
    setFoodResult(null);
    setError(null);
    setState('UPLOAD');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-dark-bg">
        <Loader2 className="w-8 h-8 text-primary dark:text-dark-primary animate-spin" />
      </div>
    );
  }

  const activeProfile = getProfileObject(user?.preferences?.baseProfileId);

  return (
    <div className="min-h-screen flex flex-col font-sans dark:bg-dark-bg transition-colors duration-300">

      <header className="px-4 md:px-6 pt-4 sticky top-0 z-50 print:hidden">
        <div className="max-w-[1400px] mx-auto h-16 bg-white/80 dark:bg-dark-surface/90 backdrop-blur-xl rounded-2xl px-6 flex items-center justify-between border border-outline-variant dark:border-dark-border shadow-elevation-1 dark:shadow-dark-elevation-1 transition-colors">
          <button
            onClick={() => user ? reset() : null}
            className="flex items-center gap-2.5 group disabled:opacity-50"
            disabled={state === 'AUTH'}
          >
            <div className="bg-primary p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                <path d="M12 6c-2 2-3 4.5-3 6.5 0 2.5 1.5 4 3 4.5" />
                <path d="M12 6c2 2 3 4.5 3 6.5 0 2.5-1.5 4-3 4.5" />
                <line x1="12" y1="2" x2="12" y2="6" />
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight text-on-surface dark:text-dark-text">Nutri<span className="text-primary dark:text-dark-primary">AI</span></span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 text-on-surface-variant dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary hover:bg-primary-light dark:hover:bg-dark-surface-container rounded-xl transition-all"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>
            <button
              onClick={toggleFullScreen}
              className="p-2.5 text-on-surface-variant dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary hover:bg-primary-light dark:hover:bg-dark-surface-container rounded-xl transition-all"
            >
              {isFullScreen ? <Minimize className="w-[18px] h-[18px]" /> : <Maximize className="w-[18px] h-[18px]" />}
            </button>

            {user && state !== 'AUTH' && (
              <>
                <button onClick={() => setState('HISTORY')} className="p-2.5 text-on-surface-variant dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary hover:bg-primary-light dark:hover:bg-dark-surface-container rounded-xl transition-all">
                  <History className="w-[18px] h-[18px]" />
                </button>
                <button onClick={() => setState('PROFILE_EDITOR')} className="p-2.5 text-on-surface-variant dark:text-dark-text-secondary hover:text-primary dark:hover:text-dark-primary hover:bg-primary-light dark:hover:bg-dark-surface-container rounded-xl transition-all">
                  <Settings className="w-[18px] h-[18px]" />
                </button>
                <div className="h-6 w-px bg-outline-variant dark:bg-dark-border mx-2"></div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setState('ACCOUNT_SETTINGS')}
                    className="w-8 h-8 rounded-full bg-primary-container dark:bg-dark-primary-container flex items-center justify-center text-primary dark:text-dark-primary hover:scale-105 transition-all overflow-hidden"
                  >
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" /> : <UserIcon className="w-4 h-4" />}
                  </button>
                  <button onClick={handleLogout} className="p-2 text-on-surface-variant dark:text-dark-text-secondary hover:text-accent-rose transition-colors">
                    <LogOut className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center pt-8 pb-20 px-4 md:px-6 min-h-[calc(100vh-140px)] transition-colors">
        {error && (
          <div className="w-full max-w-lg mx-auto bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-2xl mb-8 flex items-center justify-between animate-fade-in">
            <span className="font-medium text-sm">{error}</span>
            <button onClick={() => setError(null)} className="text-xs font-semibold uppercase tracking-wide hover:underline ml-4">Dismiss</button>
          </div>
        )}

        <div className="w-full flex items-center justify-center">
          {state === 'AUTH' && <AuthScreen onLogin={handleLogin} />}
          {state === 'PROFILE_EDITOR' && user && <UserProfileEditor user={user} onSave={handleProfileUpdate} />}
          {state === 'ACCOUNT_SETTINGS' && user && <AccountSettingsView user={user} onSave={handleAccountUpdate} onBack={() => setState('UPLOAD')} />}
          {state === 'UPLOAD' && user && <ImageUploader selectedProfile={activeProfile} onUpload={handleFileUpload} onBack={() => setState('PROFILE_EDITOR')} loading={scanning} />}
          {state === 'RESULTS' && result && <AnalysisView result={result} onViewReport={() => setState('REPORT')} userProfileName={(result as HistoryItem).profileName || activeProfile.name} onReset={reset} />}
          {state === 'FOOD_RESULTS' && foodResult && <FoodScanView result={foodResult} onReset={reset} userProfileName={activeProfile.name} />}
          {state === 'REPORT' && result && user && <ProductReport result={result} profileName={(result as HistoryItem).profileName || activeProfile.name} userName={user.name} onBack={() => setState('RESULTS')} />}
          {state === 'HISTORY' && <HistoryView history={history} onDelete={handleDeleteHistoryItem} onSelect={(item) => { setResult(item); setState('RESULTS'); }} onBack={reset} />}
        </div>
      </main>

      {state !== 'PROFILE_EDITOR' && (
        <footer className="px-4 md:px-6 pb-4 print:hidden">
          <div className="max-w-3xl mx-auto text-center py-3">
            <p className="text-xs text-on-surface-variant/60 dark:text-dark-text-secondary/60 font-medium tracking-wide">
              © {new Date().getFullYear()} NutriAI · Nutritional Intelligence
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
