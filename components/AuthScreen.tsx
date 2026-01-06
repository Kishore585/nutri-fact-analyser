import React, { useState } from 'react';
import { ShieldCheck, Mail, ArrowRight, Loader2 } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (email: string, isGoogle: boolean) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
        onLogin(email, false);
        setLoading(false);
    }, 800);
  };

  const handleGoogleLogin = () => {
      setLoading(true);
      setTimeout(() => {
          onLogin('user@gmail.com', true); // Simulated Google User
          setLoading(false);
      }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
            <div className="bg-emerald-100 p-4 rounded-full">
                <ShieldCheck className="w-10 h-10 text-emerald-600" />
            </div>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to NutriScan AI</h1>
        <p className="text-slate-500 mb-8">
          Your personal intelligent nutrition assistant. Sign in to save your history and preferences.
        </p>

        <div className="space-y-4">
            {/* Simulated Google Button */}
            <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-xl transition-all"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
            </button>

            <div className="flex items-center gap-4 my-4">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-slate-400 text-sm">OR</span>
                <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    <input 
                        type="email" 
                        required
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                </div>
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue with Email <ArrowRight className="w-4 h-4" /></>}
                </button>
            </form>
        </div>
        <p className="mt-6 text-xs text-slate-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
