
import React, { useState } from 'react';
import { ShieldCheck, Loader2, LogIn } from 'lucide-react';
import { User } from '../types';
import { auth, googleProvider, signInWithPopup } from '../services/firebase';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      const user: User = {
        id: fbUser.uid,
        email: fbUser.email || '',
        name: fbUser.displayName || 'Guest User',
        avatar: fbUser.photoURL || undefined
      };

      onLogin(user);
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full animate-fade-in">
      <div className="glass p-12 rounded-[3.5rem] w-full max-w-md text-center shadow-2xl">
        <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-sky-500 p-6 rounded-3xl shadow-xl shadow-indigo-200">
                <ShieldCheck className="w-10 h-10 text-white" />
            </div>
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">NutriScan AI</h1>
        <p className="text-slate-500 mb-10 font-medium tracking-tight">Your Health Profile, Everywhere.</p>

        <div className="space-y-6">
            <div className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl mb-6 border border-emerald-100 flex items-center justify-center gap-2">
                Cloud Sync Enabled
            </div>

            {error && <p className="text-rose-500 text-xs font-bold mb-4">{error}</p>}

            <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold py-5 px-4 rounded-[2rem] border-2 border-slate-100 hover:border-indigo-500 hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/50 active:scale-95 disabled:opacity-70"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5" alt="Google" />
                    Sign in with Google
                  </>
                )}
            </button>
            
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose mt-8">
                By signing in, your allergies and scan history will stay synced across all your devices.
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
