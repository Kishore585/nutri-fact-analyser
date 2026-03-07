
import React, { useState } from 'react';
import { User } from '../types';
import { PROFILES } from '../constants';
import { Save, Target, Check } from 'lucide-react';

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
    <div className="w-full max-w-5xl mx-auto p-4 animate-slide-up flex flex-col items-center">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="p-2.5 bg-primary-container dark:bg-dark-primary-container rounded-xl mb-3">
          <Target className="w-5 h-5 text-primary dark:text-dark-primary" />
        </div>
        <h1 className="text-3xl font-bold text-on-surface dark:text-dark-text tracking-tight mb-1">Select Analysis Strategy</h1>
        <p className="text-on-surface-variant dark:text-dark-text-secondary text-sm max-w-lg">
          Choose a nutritional lens for your AI scans.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-5">
        {/* Large Strategy Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROFILES.map((profile) => {
            const isActive = selectedProfileId === profile.id;
            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => setSelectedProfileId(profile.id)}
                className={`group relative flex flex-col rounded-2xl overflow-hidden border-2 text-left transition-all duration-300 bg-white dark:bg-dark-surface shadow-elevation-1 dark:shadow-dark-elevation-1 hover:shadow-elevation-3 dark:hover:shadow-dark-elevation-3 hover:-translate-y-1 ${isActive
                    ? 'border-primary dark:border-dark-primary ring-2 ring-primary/20 dark:ring-dark-primary/20 shadow-elevation-3 dark:shadow-dark-elevation-3'
                    : 'border-outline-variant dark:border-dark-border hover:border-outline dark:hover:border-dark-border'
                  }`}
              >
                {/* Large Thumbnail */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-container dark:bg-dark-surface-container">
                  <img
                    src={profile.thumbnailUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    alt={profile.name}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                  {isActive && (
                    <div className="absolute top-3 right-3 bg-primary dark:bg-dark-primary text-white dark:text-dark-bg w-7 h-7 rounded-full flex items-center justify-center shadow-elevation-2 animate-scale-in">
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </div>
                  )}

                  {isActive && (
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm text-primary dark:text-dark-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm animate-fade-in">
                      Selected
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <h3 className={`text-sm font-bold mb-1 transition-colors ${isActive ? 'text-primary dark:text-dark-primary' : 'text-on-surface dark:text-dark-text'
                    }`}>
                    {profile.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant dark:text-dark-text-secondary leading-relaxed line-clamp-2">
                    {profile.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tip + Save */}
        <div className="flex flex-col md:flex-row items-center gap-3 bg-on-surface dark:bg-dark-surface-container-high p-4 rounded-2xl">
          <div className="flex-grow flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
              💡
            </div>
            <p className="text-[11px] text-white/70 dark:text-dark-text-secondary leading-snug text-left">
              Your medical restrictions are <span className="text-white dark:text-dark-text font-semibold">applied automatically</span>. Update them in <span className="text-primary-container dark:text-dark-primary font-semibold">Account Settings</span>.
            </p>
          </div>

          <button
            type="submit"
            className="flex-shrink-0 flex items-center gap-2 bg-primary dark:bg-dark-primary text-white dark:text-dark-bg px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider shadow-elevation-1 hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            <Save className="w-3.5 h-3.5" />
            Activate Goal
          </button>
        </div>
      </form>

      <p className="mt-4 text-[9px] font-medium text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-widest">
        Scan results will be calibrated to your selected strategy
      </p>
    </div>
  );
};

export default UserProfileEditor;
