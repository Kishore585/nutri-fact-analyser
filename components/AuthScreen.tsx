
import React, { useState } from 'react';
import { ShieldCheck, Loader2, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleLocalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    
    setLoading(true);
    
    const user: User = {
      id: Math.random().toString(36).substring(2, 15),
      email: email,
      name: name,
    };

    // Simulate a small delay for better UX
    setTimeout(() => {
      onLogin(user);
      setLoading(false);
    }, 800);
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
        <p className="text-slate-500 mb-10 font-medium tracking-tight">Your Health Profile, Locally Stored.</p>

        <form onSubmit={handleLocalLogin} className="space-y-6">
            <div className="bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl mb-6 border border-blue-100 flex items-center justify-center gap-2">
                Local Storage Mode
            </div>

            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Your Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all font-medium"
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all font-medium"
              />
            </div>

            <button 
                type="submit"
                disabled={loading || !name || !email}
                className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-bold py-5 px-4 rounded-[2rem] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95 disabled:opacity-70"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <UserIcon className="w-5 h-5" />
                    Get Started
                  </>
                )}
            </button>
            
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose mt-8">
                Your data is stored locally in your browser and never leaves your device.
            </p>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;
