
import React, { useState } from 'react';
import { User } from '../types';
import { PROFILES } from '../constants';
import { Save, Target } from 'lucide-react';

interface UserProfileEditorProps {
  user: User;
  onSave: (user: User) => void;
}

const UserProfileEditor: React.FC<UserProfileEditorProps> = ({ user, onSave }) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    user.preferences?.baseProfileId || 'general'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...user,
      preferences: {
        ...(user.preferences || { customConditions: '' }),
        baseProfileId: selectedProfileId,
      }
    };
    onSave(updatedUser);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 animate-fade-in flex flex-col items-center">
      {/* Compact Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="p-3 bg-indigo-100 rounded-2xl mb-3 shadow-sm border border-white">
            <Target className="w-6 h-6 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">Select Analysis Strategy</h1>
        <p className="text-slate-500 text-sm max-w-xl font-medium">
          Choose a nutritional lens for your AI scans.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Compact Strategy Section */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PROFILES.map((profile) => {
              const isActive = selectedProfileId === profile.id;
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => setSelectedProfileId(profile.id)}
                  className={`group relative flex items-center gap-3 p-3 rounded-2xl text-left border-2 transition-all duration-300 ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-50/50 shadow-md'
                      : 'border-slate-50 hover:border-slate-200 bg-slate-50/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border-2 transition-all ${isActive ? 'border-white' : 'border-transparent'}`}>
                    <img 
                      src={profile.thumbnailUrl} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt={profile.name} 
                    />
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <div className={`text-sm font-black tracking-tight leading-none mb-1 truncate ${isActive ? 'text-indigo-600' : 'text-slate-900'}`}>
                      {profile.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold line-clamp-1">{profile.description}</div>
                  </div>
                  
                  {isActive && (
                    <div className="flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inline Tip and Save Section */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-900 p-4 rounded-[2rem] shadow-2xl">
          <div className="flex-grow flex items-center gap-3">
             <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                💡
             </div>
             <p className="text-[11px] text-slate-300 font-medium leading-snug text-left">
                Your medical restrictions are <span className="text-white font-bold">applied automatically</span>. Update them in <span className="text-indigo-400 font-bold">Account Settings</span>.
             </p>
          </div>

          <button
            type="submit"
            className="flex-shrink-0 flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Activate Goal
          </button>
        </div>
      </form>
      
      <p className="mt-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
        Scan results will be calibrated to your selected strategy
      </p>
    </div>
  );
};

export default UserProfileEditor;
