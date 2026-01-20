
import React, { useState } from 'react';
import { ScanResult, SafetyStatus, IngredientAnalysis } from '../types';
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp, RefreshCw, Info, FileText, Share2 } from 'lucide-react';

interface AnalysisViewProps {
  result: ScanResult;
  onReset: () => void;
  onViewReport: () => void;
  userProfileName: string;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onReset, onViewReport, userProfileName }) => {
  
  const getVerdictStyles = (status: SafetyStatus) => {
    switch (status) {
      case SafetyStatus.SAFE:
        return {
          gradient: 'from-emerald-400 to-teal-500',
          shadow: 'shadow-emerald-200',
          text: 'text-emerald-900',
          icon: <CheckCircle className="w-20 h-20 text-white" />,
          label: 'Health Grade: A'
        };
      case SafetyStatus.CAUTION:
        return {
          gradient: 'from-amber-400 to-orange-500',
          shadow: 'shadow-amber-200',
          text: 'text-amber-900',
          icon: <AlertTriangle className="w-20 h-20 text-white" />,
          label: 'Moderate Risk'
        };
      case SafetyStatus.UNSAFE:
        return {
          gradient: 'from-rose-500 to-red-600',
          shadow: 'shadow-red-200',
          text: 'text-red-900',
          icon: <XCircle className="w-20 h-20 text-white" />,
          label: 'Danger Zone'
        };
      default:
        return {
          gradient: 'from-slate-400 to-slate-500',
          shadow: 'shadow-slate-200',
          text: 'text-slate-900',
          icon: <Info className="w-20 h-20 text-white" />,
          label: 'Inconclusive'
        };
    }
  };

  const styles = getVerdictStyles(result.verdict);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-20 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Big Gauge Card (Inspired by bottom-left circular chart) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass p-12 rounded-[4rem] text-center flex flex-col items-center">
            <div className="relative mb-10">
              <div className={`w-52 h-52 rounded-full bg-gradient-to-br ${styles.gradient} shadow-2xl ${styles.shadow} flex items-center justify-center relative z-10`}>
                <div className="absolute inset-2 border-4 border-white/20 rounded-full"></div>
                {styles.icon}
              </div>
              <div className="absolute inset-0 bg-white blur-3xl opacity-20 -z-10 animate-pulse"></div>
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">{styles.label}</h2>
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-10">{userProfileName} PROFILE</p>
            
            <div className="flex gap-4 w-full">
              <button onClick={onReset} className="flex-1 glass p-4 rounded-3xl hover:bg-white transition-all text-slate-600 flex justify-center active:scale-95">
                <RefreshCw className="w-6 h-6" />
              </button>
              <button className="flex-1 glass p-4 rounded-3xl hover:bg-white transition-all text-slate-600 flex justify-center active:scale-95">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="glass p-8 rounded-[3rem]">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Observations</h4>
             <div className="space-y-3">
                {result.nutritionalHighlights.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/50 p-3 rounded-2xl border border-white">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span className="text-xs font-bold text-slate-700">{h}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: Executive summary & Ingredients (Inspired by dashboard item list) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass p-12 rounded-[4rem]">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Analysis Brief</h3>
              <button onClick={onViewReport} className="glass px-6 py-3 rounded-2xl text-xs font-black text-indigo-600 uppercase tracking-widest hover:bg-white transition-all">
                Full Report
              </button>
            </div>
            <p className="text-slate-600 text-xl font-medium leading-relaxed italic border-l-4 border-indigo-400 pl-8 py-2">
              "{result.summary}"
            </p>
          </div>

          <div className="glass rounded-[4rem] overflow-hidden">
            <div className="p-10 border-b border-white flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Ingredient Composition</h3>
                <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter">
                  {result.ingredients.length} items
                </span>
            </div>
            <div className="divide-y divide-white">
              {result.ingredients.map((ing, index) => (
                <IngredientRow key={index} ingredient={ing} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const IngredientRow: React.FC<{ ingredient: IngredientAnalysis }> = ({ ingredient }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusBadge = (s: SafetyStatus) => {
    switch (s) {
      case SafetyStatus.SAFE: return 'text-emerald-600 bg-emerald-100/50 border-emerald-100';
      case SafetyStatus.CAUTION: return 'text-amber-600 bg-amber-100/50 border-amber-100';
      case SafetyStatus.UNSAFE: return 'text-rose-600 bg-rose-100/50 border-rose-100';
      default: return 'text-slate-400 bg-slate-100/50 border-slate-100';
    }
  };

  return (
    <div className={`transition-all duration-300 ${expanded ? 'bg-white/40' : 'hover:bg-white/20'}`}>
      <div onClick={() => setExpanded(!expanded)} className="flex items-center justify-between p-8 cursor-pointer">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-slate-900 tracking-tighter">{ingredient.commonName}</span>
          <span className="text-[10px] text-slate-400 font-mono italic uppercase tracking-widest">{ingredient.name}</span>
        </div>
        <div className="flex items-center gap-6">
          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-tighter ${getStatusBadge(ingredient.status)}`}>
            {ingredient.status}
          </span>
          <div className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform ${expanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="px-8 pb-10 animate-fade-in">
           <div className="p-8 bg-white/60 rounded-[2.5rem] border border-white shadow-sm">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">About</label>
                  <p className="text-slate-700 font-medium text-sm leading-relaxed">{ingredient.description}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Rationale</label>
                  <p className={`font-bold text-sm leading-relaxed ${ingredient.status === SafetyStatus.SAFE ? 'text-emerald-700' : ingredient.status === SafetyStatus.UNSAFE ? 'text-rose-700' : 'text-amber-700'}`}>
                     {ingredient.reason}
                  </p>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
