
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
      case SafetyStatus.SAFE: return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case SafetyStatus.CAUTION: return 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case SafetyStatus.UNSAFE: return 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-slate-50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700';
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
    <div className="w-full max-w-2xl mx-auto p-4 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-on-surface dark:text-dark-text flex items-center gap-2">
          <Clock className="w-5 h-5 text-on-surface-variant dark:text-dark-text-secondary" />
          Scan History
        </h1>
        <button
          onClick={onBack}
          className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-dark-text-secondary hover:text-on-surface dark:hover:text-dark-text transition-colors"
        >
          Close
        </button>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-surface-container dark:bg-dark-surface-container p-6 rounded-2xl mb-5">
            <SearchX className="w-8 h-8 text-on-surface-variant dark:text-dark-text-secondary" />
          </div>
          <h3 className="text-base font-bold text-on-surface dark:text-dark-text">No History Yet</h3>
          <p className="text-on-surface-variant dark:text-dark-text-secondary max-w-xs mt-2 text-sm">
            Your analyzed food labels will be stored locally on this device.
          </p>
          <button
            onClick={onBack}
            className="mt-6 px-6 py-3 bg-primary dark:bg-dark-primary text-white dark:text-dark-bg rounded-xl font-semibold shadow-elevation-1 hover:bg-primary/90 transition-all text-sm"
          >
            Start First Scan
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-surface-container dark:bg-dark-surface-container p-3 rounded-xl text-[10px] font-medium text-on-surface-variant dark:text-dark-text-secondary uppercase tracking-widest text-center">
            Scans are kept on this device only
          </div>
          {history.map((item) => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onSelect(item)}
                className="w-full bg-white dark:bg-dark-surface p-4 rounded-2xl border border-outline-variant dark:border-dark-border hover:shadow-elevation-2 dark:hover:shadow-dark-elevation-2 hover:border-primary/20 dark:hover:border-dark-primary/20 transition-all text-left flex items-start gap-3"
              >
                <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border ${getStatusColor(item.verdict)}`}>
                  <span className="font-bold text-xs">{item.verdict[0]}</span>
                </div>

                <div className="flex-grow min-w-0 pr-8">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-medium text-on-surface-variant dark:text-dark-text-secondary">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-outline dark:bg-dark-border"></span>
                    <span className="text-[10px] font-semibold text-primary dark:text-dark-primary">
                      {item.profileName}
                    </span>
                  </div>
                  <h4 className="font-medium text-on-surface dark:text-dark-text line-clamp-1 mb-1.5 text-sm">
                    {item.summary}
                  </h4>
                  <div className="flex gap-1.5">
                    {item.nutritionalHighlights.slice(0, 2).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-surface-container dark:bg-dark-surface-container text-on-surface-variant dark:text-dark-text-secondary text-[9px] font-medium rounded-md">
                        {tag}
                      </span>
                    ))}
                    {item.nutritionalHighlights.length > 2 && (
                      <span className="px-2 py-0.5 bg-surface-container dark:bg-dark-surface-container text-on-surface-variant/50 dark:text-dark-text-secondary/50 text-[9px] font-medium rounded-md">
                        +{item.nutritionalHighlights.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    disabled={deletingId === item.id}
                    className="p-2 text-on-surface-variant/40 dark:text-dark-text-secondary/40 hover:text-accent-rose hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                  >
                    {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                  <ChevronRight className="w-4 h-4 text-on-surface-variant/30 dark:text-dark-text-secondary/30" />
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
