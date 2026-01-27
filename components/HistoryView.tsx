
import React, { useState } from 'react';
import { HistoryItem, SafetyStatus } from '../types';
import { Clock, ChevronRight, SearchX, Trash2, Loader2 } from 'lucide-react';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => Promise<void>;
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect, onDelete, onBack }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getStatusColor = (status: SafetyStatus) => {
    switch (status) {
      case SafetyStatus.SAFE: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case SafetyStatus.CAUTION: return 'bg-amber-100 text-amber-700 border-amber-200';
      case SafetyStatus.UNSAFE: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Remove this scan from your local history?')) {
      setDeletingId(id);
      await onDelete(id);
      setDeletingId(null);
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
          className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
        >
          Close
        </button>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-slate-100 p-8 rounded-[2rem] mb-6">
                <SearchX className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-black text-slate-900">No History Yet</h3>
            <p className="text-slate-500 max-w-xs mt-2 text-sm font-medium">
                Your analyzed food labels will be stored locally on this device.
            </p>
            <button 
                onClick={onBack}
                className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-black transition-all"
            >
                Start First Scan
            </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
             Scans are kept on this device only
          </div>
          {history.map((item) => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onSelect(item)}
                className="w-full glass p-5 rounded-[2.5rem] border border-white hover:shadow-xl hover:bg-white transition-all text-left flex items-start gap-4"
              >
                <div className={`flex-shrink-0 w-14 h-14 rounded-[1.25rem] flex items-center justify-center border-2 ${getStatusColor(item.verdict)}`}>
                    <span className="font-black text-xs">{item.verdict[0]}</span>
                </div>
                
                <div className="flex-grow min-w-0 pr-10">
                  <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                        {item.profileName}
                      </span>
                  </div>
                  <h4 className="font-bold text-slate-900 line-clamp-1 mb-2">
                      {item.summary}
                  </h4>
                  <div className="flex gap-2">
                      {item.nutritionalHighlights.slice(0, 2).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/50 text-slate-500 text-[9px] font-black uppercase tracking-tighter rounded-md border border-white">
                              {tag}
                          </span>
                      ))}
                      {item.nutritionalHighlights.length > 2 && (
                          <span className="px-2 py-0.5 bg-white/50 text-slate-300 text-[9px] font-black rounded-md">
                              +{item.nutritionalHighlights.length - 2}
                          </span>
                      )}
                  </div>
                </div>

                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                      onClick={(e) => handleDelete(e, item.id)}
                      disabled={deletingId === item.id}
                      className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                    >
                      {deletingId === item.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                   </button>
                   <ChevronRight className="w-5 h-5 text-slate-300" />
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
