
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
    <div className="w-full max-w-2xl mx-auto p-4 animate-fade-in pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-full">
              <UserIcon className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
              <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
              <p className="text-slate-500 text-sm">Manage your identity and permanent health constraints.</p>
          </div>
        </div>
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-8">
          
          {/* Personal Info */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block ml-1">Basic Information</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (optional)"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="number" 
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800 appearance-none cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Persistent Health Conditions */}
          <div className="pt-4 border-t border-slate-100">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block ml-1">Specific Conditions & Allergies</label>
            <p className="text-[11px] text-slate-500 mb-4 font-medium leading-relaxed">
              These restrictions are applied to every analysis, regardless of your selected lifestyle goal.
            </p>
            <textarea
              value={customConditions}
              onChange={(e) => setCustomConditions(e.target.value)}
              placeholder="e.g. Peanut allergy, gluten sensitivity, lactose intolerant..."
              className="w-full h-28 p-5 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none bg-slate-50 text-slate-800 placeholder-slate-400 mb-4 transition-all"
            />
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_CONDITIONS.map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => addCondition(cond)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-[10px] font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1 active:scale-95"
                >
                  <Plus className="w-3 h-3" /> {cond}
                </button>
              ))}
              <button 
                type="button" 
                onClick={() => setCustomConditions('')}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-400 text-[10px] font-bold hover:text-rose-500 hover:border-rose-200 transition-all"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="pt-4 border-t border-slate-100">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block ml-1">App Theme</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedTheme(theme.id as any)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 relative ${
                    selectedTheme === theme.id 
                      ? 'border-slate-900 bg-slate-50' 
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${theme.color} shadow-lg`} />
                  <span className="text-[10px] font-bold text-slate-600">{theme.name}</span>
                  {selectedTheme === theme.id && <Check className="w-3 h-3 text-slate-900 absolute top-2 right-2" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:text-slate-900 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettingsView;
