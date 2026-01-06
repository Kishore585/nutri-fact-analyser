import React from 'react';
import { UserProfile } from '../types';
import { PROFILES } from '../constants';
import { Heart, Activity, Dumbbell, WheatOff, Leaf, ShieldAlert, ChevronRight } from 'lucide-react';

interface ProfileSelectorProps {
  onSelect: (profile: UserProfile) => void;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({ onSelect }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'heart': return <Heart className="w-6 h-6" />;
      case 'activity': return <Activity className="w-6 h-6" />;
      case 'dumbbell': return <Dumbbell className="w-6 h-6" />;
      case 'wheat-off': return <WheatOff className="w-6 h-6" />;
      case 'leaf': return <Leaf className="w-6 h-6" />;
      case 'shield-alert': return <ShieldAlert className="w-6 h-6" />;
      default: return <Heart className="w-6 h-6" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Select Your Health Goal
        </h1>
        <p className="text-slate-600 text-lg">
          Tell us what matters to you, and we'll analyze your food accordingly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROFILES.map((profile) => (
          <button
            key={profile.id}
            onClick={() => onSelect(profile)}
            className="group relative flex flex-col items-start p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-transparent hover:scale-[1.02] transition-all duration-300 text-left overflow-hidden"
          >
             <div className={`absolute top-0 left-0 w-2 h-full ${profile.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className={`p-3 rounded-full ${profile.color} bg-opacity-10 text-${profile.color.split('-')[1]}-600 mb-4 group-hover:bg-opacity-20 transition-colors`}>
               {/* Use a slight hack to get dynamic text color based on bg string, usually easier to hardcode or use map, but here we rely on opacity */}
               <div className="text-slate-700">
                 {getIcon(profile.icon)}
               </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-slate-900">
              {profile.name}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              {profile.description}
            </p>

            <div className="mt-auto flex items-center text-sm font-semibold text-slate-400 group-hover:text-slate-800 transition-colors">
              Select Profile <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileSelector;
