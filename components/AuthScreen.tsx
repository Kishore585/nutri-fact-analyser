
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

    setTimeout(() => {
      onLogin(user);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full animate-slide-up">
      <div className="bg-white dark:bg-dark-surface p-10 rounded-3xl w-full max-w-sm text-center border border-outline-variant dark:border-dark-border shadow-elevation-2 dark:shadow-dark-elevation-2 transition-colors">
        <div className="flex justify-center mb-8">
          <div className="bg-primary dark:bg-dark-primary p-4 rounded-2xl shadow-elevation-1">
            <ShieldCheck className="w-7 h-7 text-white dark:text-dark-bg" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-on-surface dark:text-dark-text mb-1 tracking-tight">NutriScan AI</h1>
        <p className="text-on-surface-variant dark:text-dark-text-secondary text-sm mb-8">Your Health Profile, Locally Stored.</p>

        <form onSubmit={handleLocalLogin} className="space-y-4">
          <div className="bg-primary-light dark:bg-dark-primary-light text-primary dark:text-dark-primary text-[11px] font-semibold uppercase tracking-widest p-3 rounded-xl flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-dark-primary"></div>
            Local Storage Mode
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-surface-container dark:bg-dark-surface-container border border-outline-variant dark:border-dark-border focus:border-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm font-medium text-on-surface dark:text-dark-text placeholder:text-on-surface-variant/50 dark:placeholder:text-dark-text-secondary/50"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-surface-container dark:bg-dark-surface-container border border-outline-variant dark:border-dark-border focus:border-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm font-medium text-on-surface dark:text-dark-text placeholder:text-on-surface-variant/50 dark:placeholder:text-dark-text-secondary/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name || !email}
            className="w-full flex items-center justify-center gap-2.5 bg-primary dark:bg-dark-primary text-white dark:text-dark-bg font-semibold py-3.5 px-4 rounded-xl hover:bg-primary/90 transition-all shadow-elevation-1 active:scale-[0.98] disabled:opacity-60 text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <UserIcon className="w-4 h-4" />
                Get Started
              </>
            )}
          </button>

          <p className="text-[10px] text-on-surface-variant/60 dark:text-dark-text-secondary/60 font-medium leading-relaxed mt-6 px-2">
            Your data is stored locally in your browser and never leaves your device.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;
