import React from 'react';
import { HistoryItem, SafetyStatus } from '../types';
import { Clock, ChevronRight, SearchX } from 'lucide-react';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect, onBack }) => {
  const getStatusColor = (status: SafetyStatus) => {
    switch (status) {
      case SafetyStatus.SAFE: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case SafetyStatus.CAUTION: return 'bg-amber-100 text-amber-700 border-amber-200';
      case SafetyStatus.UNSAFE: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-slate-400" />
            Scan History
        </h1>
        <button 
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          Close
        </button>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-slate-100 p-6 rounded-full mb-4">
                <SearchX className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No History Yet</h3>
            <p className="text-slate-500 max-w-xs mt-2">
                Scans you perform will appear here automatically.
            </p>
            <button 
                onClick={onBack}
                className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
                Start Scanning
            </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full group bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-200 transition-all text-left flex items-start gap-4"
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border ${getStatusColor(item.verdict)}`}>
                  <span className="font-bold text-xs">{item.verdict[0]}</span>
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {new Date(item.timestamp).toLocaleDateString()} • {item.profileName}
                    </span>
                </div>
                <h4 className="font-medium text-slate-800 line-clamp-1 mb-1 group-hover:text-emerald-700 transition-colors">
                    {item.summary}
                </h4>
                <div className="flex gap-2 mt-2">
                    {item.nutritionalHighlights.slice(0, 2).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-500 text-xs rounded-md border border-slate-100">
                            {tag}
                        </span>
                    ))}
                    {item.nutritionalHighlights.length > 2 && (
                        <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-xs rounded-md">
                            +{item.nutritionalHighlights.length - 2}
                        </span>
                    )}
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 mt-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
