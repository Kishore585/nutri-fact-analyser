
import React, { useState } from 'react';
import { User } from '../types';
import { User as UserIcon, Lock, Calendar, Users, Palette, Save, ArrowLeft, Check, Plus } from 'lucide-react';

interface AccountSettingsViewProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onBack: () => void;
}

const THEMES = [
  { id: 'indigo', name: 'Vibrant Blue', color: 'bg-indigo-600' },
  { id: 'emerald', name: 'Emerald Green', color: 'bg-emerald-600' },
  { id: 'slate', name: 'Midnight Slate', color: 'bg-slate-800' },
  { id: 'rose', name: 'Rose Quartz', color: 'bg-rose-500' },
];

const SUGGESTED_CONDITIONS = [
  "Peanut Allergy",
  "Tree Nut Allergy",
  "Lactose Intolerance",
  "Gluten Sensitivity",
  "Hypertension (Low Sodium)",
  "Type 2 Diabetes",
  "Vegetarian",
  "Low Carb"
];

const AccountSettingsView: React.FC<AccountSettingsViewProps> = ({ user, onSave, onBack }) => {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState(user.password || '');
  const [age, setAge] = useState(user.age?.toString() || '');
  const [gender, setGender] = useState(user.gender || 'prefer-not-to-say');
  const [selectedTheme, setSelectedTheme] = useState(user.preferences?.theme || 'indigo');
  const [customConditions, setCustomConditions] = useState(user.preferences?.customConditions || '');

  const addCondition = (condition: string) => {
    if (customConditions.includes(condition)) return;
    const separator = customConditions.length > 0 ? ', ' : '';
    setCustomConditions(`${customConditions}${separator}${condition}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...user,
      name,
      password,
      age: age ? parseInt(age) : undefined,
      gender: gender as any,
      preferences: {
        ...(user.preferences || { baseProfileId: 'general', customConditions: '' }),
        theme: selectedTheme as any,
        customConditions: customConditions
      }
    };
    onSave(updatedUser);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-slide-up pb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary-container dark:bg-dark-primary-container rounded-xl">
            <UserIcon className="w-5 h-5 text-primary dark:text-dark-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-on-surface dark:text-dark-text">Account Settings</h1>
            <p className="text-on-surface-variant dark:text-dark-text-secondary text-xs">Manage your identity and health constraints.</p>
          </div>
        </div>
        <button onClick={onBack} className="p-2 text-on-surface-variant dark:text-dark-text-secondary hover:text-on-surface dark:hover:text-dark-text transition-colors rounded-xl hover:bg-surface-container dark:hover:bg-dark-surface-container">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-outline-variant dark:border-dark-border shadow-elevation-1 dark:shadow-dark-elevation-1 space-y-6 transition-colors">

          {/* Personal Info */}
          <div>
            <label className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-widest mb-3 block">Basic Information</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant dark:text-dark-text-secondary" />
                <input
                  type="text"
                  placeholder="Username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface-container dark:bg-dark-surface-container rounded-xl border border-outline-variant dark:border-dark-border focus:border-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm text-on-surface dark:text-dark-text"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant dark:text-dark-text-secondary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (optional)"
                  className="w-full pl-10 pr-4 py-3 bg-surface-container dark:bg-dark-surface-container rounded-xl border border-outline-variant dark:border-dark-border focus:border-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm text-on-surface dark:text-dark-text"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant dark:text-dark-text-secondary" />
                <input
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface-container dark:bg-dark-surface-container rounded-xl border border-outline-variant dark:border-dark-border focus:border-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm text-on-surface dark:text-dark-text"
                />
              </div>

              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant dark:text-dark-text-secondary" />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full pl-10 pr-4 py-3 bg-surface-container dark:bg-dark-surface-container rounded-xl border border-outline-variant dark:border-dark-border focus:border-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm text-on-surface dark:text-dark-text appearance-none cursor-pointer"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Health Conditions */}
          <div className="pt-4 border-t border-outline-variant dark:border-dark-border">
            <label className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-widest mb-3 block">Specific Conditions & Allergies</label>
            <p className="text-[11px] text-on-surface-variant dark:text-dark-text-secondary mb-3 leading-relaxed">
              These restrictions are applied to every analysis, regardless of your selected lifestyle goal.
            </p>
            <textarea
              value={customConditions}
              onChange={(e) => setCustomConditions(e.target.value)}
              placeholder="e.g. Peanut allergy, gluten sensitivity, lactose intolerant..."
              className="w-full h-24 p-4 rounded-xl border border-outline-variant dark:border-dark-border focus:border-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none bg-surface-container dark:bg-dark-surface-container text-on-surface dark:text-dark-text placeholder:text-on-surface-variant/50 dark:placeholder:text-dark-text-secondary/50 mb-3 transition-all text-sm"
            />
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_CONDITIONS.map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => addCondition(cond)}
                  className="px-2.5 py-1.5 rounded-lg bg-surface-container dark:bg-dark-surface-container text-on-surface-variant dark:text-dark-text-secondary text-[10px] font-medium hover:bg-primary hover:text-white dark:hover:bg-dark-primary dark:hover:text-dark-bg transition-all flex items-center gap-1 active:scale-[0.98]"
                >
                  <Plus className="w-2.5 h-2.5" /> {cond}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCustomConditions('')}
                className="px-2.5 py-1.5 rounded-lg border border-outline-variant dark:border-dark-border text-on-surface-variant dark:text-dark-text-secondary text-[10px] font-medium hover:text-accent-rose hover:border-red-200 dark:hover:border-red-800 transition-all"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="pt-4 border-t border-outline-variant dark:border-dark-border">
            <label className="text-[10px] font-semibold text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-widest mb-3 block">App Theme</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedTheme(theme.id as any)}
                  className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 relative ${selectedTheme === theme.id
                    ? 'border-on-surface dark:border-dark-text bg-surface-container dark:bg-dark-surface-container'
                    : 'border-outline-variant dark:border-dark-border hover:border-outline dark:hover:border-dark-border'
                    }`}
                >
                  <div className={`w-6 h-6 rounded-full ${theme.color} shadow-sm`} />
                  <span className="text-[10px] font-medium text-on-surface-variant dark:text-dark-text-secondary">{theme.name}</span>
                  {selectedTheme === theme.id && <Check className="w-3 h-3 text-on-surface dark:text-dark-text absolute top-2 right-2" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded-xl font-medium text-on-surface-variant dark:text-dark-text-secondary hover:text-on-surface dark:hover:text-dark-text transition-all text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 bg-primary dark:bg-dark-primary text-white dark:text-dark-bg px-8 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider shadow-elevation-1 hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            <Save className="w-3.5 h-3.5" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettingsView;
