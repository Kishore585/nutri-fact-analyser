import React, { useState } from 'react';
import { ScanResult, SafetyStatus, IngredientAnalysis } from '../types';
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp, RefreshCw, Info } from 'lucide-react';

interface AnalysisViewProps {
  result: ScanResult;
  onReset: () => void;
  userProfileName: string;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onReset, userProfileName }) => {
  
  const getVerdictStyles = (status: SafetyStatus) => {
    switch (status) {
      case SafetyStatus.SAFE:
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          icon: <CheckCircle className="w-12 h-12 text-emerald-500" />,
          label: 'Safe to Eat'
        };
      case SafetyStatus.CAUTION:
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          icon: <AlertTriangle className="w-12 h-12 text-amber-500" />,
          label: 'Consume with Caution'
        };
      case SafetyStatus.UNSAFE:
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: <XCircle className="w-12 h-12 text-red-500" />,
          label: 'Avoid This Item'
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-800',
          icon: <Info className="w-12 h-12 text-slate-500" />,
          label: 'Unknown Status'
        };
    }
  };

  const styles = getVerdictStyles(result.verdict);

  return (
    <div className="w-full max-w-3xl mx-auto pb-20 animate-fade-in-up">
      {/* Verdict Card */}
      <div className={`rounded-3xl p-8 mb-8 text-center border-2 ${styles.bg} ${styles.border}`}>
        <div className="flex justify-center mb-4">{styles.icon}</div>
        <h2 className={`text-4xl font-bold mb-2 ${styles.text}`}>{styles.label}</h2>
        <p className="text-slate-600 font-medium">For your {userProfileName} profile</p>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-3">Analysis Summary</h3>
        <p className="text-slate-600 leading-relaxed mb-4">
          {result.summary}
        </p>
        <div className="flex flex-wrap gap-2">
          {result.nutritionalHighlights.map((highlight, idx) => (
             <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg">
               {highlight}
             </span>
          ))}
        </div>
      </div>

      {/* Ingredients Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Ingredient Breakdown</h3>
        </div>
        <div>
          {result.ingredients.map((ing, index) => (
            <IngredientRow key={index} ingredient={ing} />
          ))}
        </div>
      </div>

      {/* Floating Action Button for Mobile / Sticky Button */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-10 px-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl hover:bg-slate-800 hover:scale-105 transition-all font-semibold"
        >
          <RefreshCw className="w-5 h-5" />
          Scan Another Label
        </button>
      </div>
    </div>
  );
};

const IngredientRow: React.FC<{ ingredient: IngredientAnalysis }> = ({ ingredient }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (s: SafetyStatus) => {
    switch (s) {
      case SafetyStatus.SAFE: return 'bg-emerald-100 text-emerald-700';
      case SafetyStatus.CAUTION: return 'bg-amber-100 text-amber-700';
      case SafetyStatus.UNSAFE: return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className={`border-b border-slate-50 last:border-0 transition-colors ${expanded ? 'bg-slate-50' : 'bg-white'}`}>
      <div 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50"
      >
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">{ingredient.commonName}</span>
          <span className="text-xs text-slate-400">{ingredient.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(ingredient.status)}`}>
            {ingredient.status}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 text-sm animate-fade-in">
           <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
              <p className="text-slate-600 mb-2"><strong>What is it?</strong> {ingredient.description}</p>
              <p className={`${ingredient.status === SafetyStatus.SAFE ? 'text-emerald-700' : ingredient.status === SafetyStatus.UNSAFE ? 'text-red-700' : 'text-amber-700'}`}>
                <strong>Why it matters:</strong> {ingredient.reason}
              </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
