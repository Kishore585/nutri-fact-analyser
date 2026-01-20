
import React, { useState } from 'react';
import { ShieldCheck, Mail, ArrowRight, Loader2, Lock } from 'lucide-react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface AuthScreenProps {
  onLogin: (user: any) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin(result.user);
    } catch (err: any) {
      setError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError(null);
    try {
      try {
        // Try sign in
        const result = await signInWithEmailAndPassword(auth, email, password);
        onLogin(result.user);
      } catch (signInErr: any) {
        // If user doesn't exist, try create (simplified flow)
        if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            onLogin(result.user);
        } else {
            throw signInErr;
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-fade-in">
      <div className="glass p-12 rounded-[3rem] w-full max-w-md text-center">
        <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-sky-500 p-6 rounded-3xl shadow-xl shadow-indigo-200">
                <ShieldCheck className="w-10 h-10 text-white" />
            </div>
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">NutriScan AI</h1>
        <p className="text-slate-500 mb-10 font-medium tracking-tight">Cloud-Secured Nutrition Intelligence</p>

        {error && (
            <div className="bg-rose-50 text-rose-600 text-xs font-bold p-4 rounded-2xl mb-6 border border-rose-100 animate-pulse">
                {error}
            </div>
        )}

        <div className="space-y-6">
            <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-bold py-5 px-4 rounded-3xl transition-all shadow-sm active:scale-95 border border-white disabled:opacity-50"
            >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5 opacity-70" alt="Google" />
                Continue with Google
            </button>

            <div className="flex items-center gap-4 my-8">
                <div className="h-px bg-slate-200/60 flex-1"></div>
                <span className="text-slate-400 text-[10px] font-black tracking-[0.2em]">OR</span>
                <div className="h-px bg-slate-200/60 flex-1"></div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
                <div className="relative">
                    <Mail className="absolute left-5 top-5 w-5 h-5 text-slate-400" />
                    <input 
                        type="email" 
                        required
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white/50 border border-white rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-slate-800 placeholder-slate-300 font-medium"
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-5 top-5 w-5 h-5 text-slate-400" />
                    <input 
                        type="password" 
                        required
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white/50 border border-white rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-slate-800 placeholder-slate-300 font-medium"
                    />
                </div>
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-5 px-4 rounded-[2rem] hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-900/10 active:scale-95 disabled:opacity-70 mt-4"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In / Create Account <ArrowRight className="w-5 h-5" /></>}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
