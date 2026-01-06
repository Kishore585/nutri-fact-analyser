
import React, { useState } from 'react';
import { User, UserProfile } from '../types';
import { PROFILES } from '../constants';
import { Save, UserCircle, Plus, X } from 'lucide-react';

interface UserProfileEditorProps {
  user: User;
  onSave: (user: User) => void;
}

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

const UserProfileEditor: React.FC<UserProfileEditorProps> = ({ user, onSave }) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    user.preferences?.baseProfileId || 'general'
  );
  const [customConditions, setCustomConditions] = useState<string>(
    user.preferences?.customConditions || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...user,
      preferences: {
        baseProfileId: selectedProfileId,
        customConditions: customConditions
      }
    };
    onSave(updatedUser);
  };

  const addCondition = (condition: string) => {
    if (customConditions.includes(condition)) return;
    const separator = customConditions.length > 0 ? ', ' : '';
    setCustomConditions(`${customConditions}${separator}${condition}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-fade-in pb-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-100 rounded-full">
            <UserCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Your Health Profile</h1>
            <p className="text-slate-500">Customize how NutriScan analyzes your food.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Base Strategy */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">1. Base Lifestyle</h2>
          <p className="text-slate-500 text-sm mb-4">Choose a general category that fits you best.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROFILES.map((profile) => (
              <button
                key={profile.id}
                type="button"
                onClick={() => setSelectedProfileId(profile.id)}
                className={`p-4 rounded-xl text-left border-2 transition-all duration-200 ${
                  selectedProfileId === profile.id
                    ? `border-${profile.color.split('-')[1]}-500 bg-${profile.color.split('-')[1]}-50 ring-1 ring-${profile.color.split('-')[1]}-500`
                    : 'border-slate-100 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-semibold text-slate-800">{profile.name}</div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-2">{profile.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Custom Conditions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">2. Specific Conditions & Allergies</h2>
          <p className="text-slate-500 text-sm mb-4">
            Add any specific allergies, medications, or dietary restrictions. The AI will strictly check for these.
          </p>
          
          <textarea
            value={customConditions}
            onChange={(e) => setCustomConditions(e.target.value)}
            placeholder="e.g. Allergic to strawberries, avoiding high sodium due to hypertension, lactose intolerant..."
            className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none bg-slate-50 text-slate-800 placeholder-slate-400 mb-4"
          />

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Add</span>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_CONDITIONS.map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => addCondition(cond)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> {cond}
                </button>
              ))}
              <button 
                type="button" 
                onClick={() => setCustomConditions('')}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-400 text-sm hover:text-red-500 hover:border-red-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end sticky bottom-6">
          <button
            type="submit"
            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-slate-800 hover:scale-[1.02] transition-all"
          >
            <Save className="w-5 h-5" />
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileEditor;
