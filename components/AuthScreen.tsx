import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Loader2, User as UserIcon, Smartphone } from 'lucide-react';
import { User } from '../types';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    
    // Create a local-only user object
    const guestUser: User = {
      id: 'local-user-' + Math.random().toString(36).substr(2, 9),
      email: 'local@device.internal',
      name: name.trim(),
    };

    setTimeout(() => {
      onLogin(guestUser);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
      <div className="glass p-12 rounded-[3.5rem] w-full max-w-md text-center">
        <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-sky-500 p-6 rounded-3xl shadow-xl shadow-indigo-200">
                <ShieldCheck className="w-10 h-10 text-white" />
            </div>
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">NutriScan AI</h1>
        <p className="text-slate-500 mb-10 font-medium tracking-tight">AI Nutritional Intelligence</p>

        <div className="space-y-6">
            <div className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl mb-6 border border-indigo-100 flex items-center justify-center gap-2">
                <Smartphone className="w-4 h-4" /> Local Storage Data Only
            </div>

            <form onSubmit={handleStart} className="space-y-4 text-left">
                <div className="relative">
                    <UserIcon className="absolute left-5 top-5 w-5 h-5 text-slate-400" />
                    <input 
                        type="text" 
                        required
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white/50 border border-white rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-slate-800 placeholder-slate-300 font-medium"
                    />
                </div>
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-5 px-4 rounded-[2rem] hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-900/10 active:scale-95 disabled:opacity-70 mt-4"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Start Analysis <ArrowRight className="w-5 h-5" /></>}
                </button>
            </form>
            
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
                No account needed. Your privacy is prioritized by keeping data on your device.
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;