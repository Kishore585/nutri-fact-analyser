
import React from 'react';
import { ScanResult, SafetyStatus, HistoryItem } from '../types';
import { Printer, Share2, ArrowLeft, ShieldCheck, ShieldAlert, Shield, FileText, Youtube, ExternalLink } from 'lucide-react';

interface ProductReportProps {
  result: ScanResult;
  profileName: string;
  userName: string;
  onBack: () => void;
}

const ProductReport: React.FC<ProductReportProps> = ({ result, profileName, userName, onBack }) => {
  const historyItem = result as Partial<HistoryItem>;
  const date = historyItem.timestamp ? new Date(historyItem.timestamp) : new Date();
  const reportId = historyItem.id || Math.random().toString(36).substr(2, 9).toUpperCase();

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `NutriAI Report\nVerdict: ${result.verdict}\nSummary: ${result.summary}\nProfile: ${profileName}`;
    navigator.clipboard.writeText(text);
    alert('Summary copied to clipboard!');
  };

  const getStatusIcon = (status: SafetyStatus) => {
    switch (status) {
      case SafetyStatus.SAFE: return <ShieldCheck className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />;
      case SafetyStatus.UNSAFE: return <ShieldAlert className="w-10 h-10 text-red-600 dark:text-red-400" />;
      default: return <Shield className="w-10 h-10 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 animate-fade-in print:p-0">
      {/* UI Controls */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant dark:text-dark-text-secondary hover:text-on-surface dark:hover:text-dark-text transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Analysis
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-dark-surface border border-outline-variant dark:border-dark-border rounded-xl text-on-surface dark:text-dark-text hover:bg-surface-container dark:hover:bg-dark-surface-container transition-all text-sm font-medium"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 bg-on-surface dark:bg-dark-text text-white dark:text-dark-bg rounded-xl hover:bg-on-surface/90 transition-all text-sm font-medium"
          >
            <Printer className="w-3.5 h-3.5" /> Print PDF
          </button>
        </div>
      </div>

      {/* Report Document */}
      <div className="bg-white dark:bg-dark-surface shadow-elevation-3 dark:shadow-dark-elevation-3 rounded-3xl overflow-hidden border border-outline-variant dark:border-dark-border print:shadow-none print:border-none print:rounded-none transition-colors">
        {/* Header Ribbon */}
        <div className={`h-1.5 w-full ${result.verdict === SafetyStatus.SAFE ? 'bg-emerald-500' :
          result.verdict === SafetyStatus.UNSAFE ? 'bg-red-500' : 'bg-amber-500'
          }`} />

        <div className="p-6 md:p-10">
          {/* Document Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 pb-10 border-b border-outline-variant dark:border-dark-border">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-5 h-5 text-primary dark:text-dark-primary" />
                <h1 className="text-lg font-bold tracking-tight text-on-surface dark:text-dark-text uppercase">Nutritional Analysis Report</h1>
              </div>
              <p className="text-on-surface-variant dark:text-dark-text-secondary text-xs font-mono uppercase tracking-widest">ID: {reportId}</p>
            </div>
            <div className="text-right md:text-right text-on-surface-variant dark:text-dark-text-secondary text-sm">
              <p>Prepared for: <span className="text-on-surface dark:text-dark-text font-semibold">{userName}</span></p>
              <p>Profile: <span className="text-on-surface dark:text-dark-text font-semibold">{profileName}</span></p>
              <p>Date: <span className="text-on-surface dark:text-dark-text font-semibold">{date.toLocaleDateString()} {date.toLocaleTimeString()}</span></p>
            </div>
          </div>

          {/* Verdict Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className={`col-span-1 rounded-2xl p-6 flex flex-col items-center justify-center text-center border ${result.verdict === SafetyStatus.SAFE ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300' :
              result.verdict === SafetyStatus.UNSAFE ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-300' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300'
              }`}>
              <div className="mb-3">{getStatusIcon(result.verdict)}</div>
              <h2 className="text-xl font-bold uppercase tracking-tight mb-1">{result.verdict}</h2>
              <p className="text-sm font-medium opacity-70">Safety Verdict</p>
            </div>

            <div className="col-span-2 space-y-3">
              <h3 className="text-base font-bold text-on-surface dark:text-dark-text">Executive Summary</h3>
              <p className="text-on-surface-variant dark:text-dark-text-secondary leading-relaxed text-base italic">
                "{result.summary}"
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.nutritionalHighlights.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 bg-surface-container dark:bg-dark-surface-container text-on-surface-variant dark:text-dark-text-secondary text-xs font-medium rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Ingredients Table */}
          <div>
            <h3 className="text-base font-bold text-on-surface dark:text-dark-text mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-surface-container dark:bg-dark-surface-container flex items-center justify-center text-xs font-semibold text-on-surface-variant dark:text-dark-text-secondary">01</span>
              Ingredient Composition Analysis
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container dark:bg-dark-surface-container border-y border-outline-variant dark:border-dark-border text-on-surface-variant dark:text-dark-text-secondary text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Ingredient Name</th>
                    <th className="py-3 px-4">Classification</th>
                    <th className="py-3 px-4">Health Implication</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant dark:divide-dark-border">
                  {result.ingredients.map((ing, i) => (
                    <tr key={i} className="hover:bg-surface dark:hover:bg-dark-surface-dim transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-on-surface dark:text-dark-text text-sm">{ing.commonName}</p>
                        <p className="text-xs text-on-surface-variant dark:text-dark-text-secondary font-mono">{ing.name}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-on-surface-variant dark:text-dark-text-secondary">{ing.description}</td>
                      <td className="py-3 px-4 text-sm text-on-surface-variant dark:text-dark-text-secondary leading-snug">{ing.reason}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${ing.status === SafetyStatus.SAFE ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                          ing.status === SafetyStatus.UNSAFE ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          }`}>
                          {ing.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Consumption Guidance Section */}
          {result.consumptionGuidance && (
            <div className="mt-10">
              <h3 className="text-base font-bold text-on-surface dark:text-dark-text mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-surface-container dark:bg-dark-surface-container flex items-center justify-center text-xs font-semibold text-on-surface-variant dark:text-dark-text-secondary">02</span>
                {result.consumptionGuidance.title}
              </h3>
              <p className="text-on-surface-variant dark:text-dark-text-secondary text-sm leading-relaxed mb-4">{result.consumptionGuidance.advice}</p>

              {result.consumptionGuidance.type === 'recipe' && result.consumptionGuidance.recipes && (
                <div className="space-y-3">
                  {result.consumptionGuidance.recipes.map((recipe, idx) => (
                    <div key={idx} className="bg-surface-container dark:bg-dark-surface-container rounded-xl p-4 border border-outline-variant/50 dark:border-dark-border/50">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold text-on-surface dark:text-dark-text mb-1">{recipe.name}</h4>
                          <p className="text-xs text-on-surface-variant dark:text-dark-text-secondary leading-relaxed">{recipe.description}</p>
                        </div>
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.youtubeSearchQuery)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-[10px] font-semibold print:hidden"
                        >
                          <Youtube className="w-3.5 h-3.5" /> Watch
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.consumptionGuidance.type === 'portion' && result.consumptionGuidance.dailyAmount && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4 text-center">
                  <p className="text-[10px] font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-1">Recommended Daily Amount</p>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{result.consumptionGuidance.dailyAmount}</p>
                </div>
              )}

              {result.consumptionGuidance.type === 'moderation' && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4">
                  <p className="text-amber-800 dark:text-amber-300 text-sm font-medium leading-relaxed">
                    ⚡ This is a processed food item. Consume in minimal quantities and consider healthier alternatives.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer Disclaimer */}
          <div className="mt-12 pt-6 border-t border-outline-variant dark:border-dark-border">
            <div className="flex items-start gap-3 text-on-surface-variant/50 dark:text-dark-text-secondary/50 text-[10px] leading-relaxed">
              <ShieldCheck className="w-6 h-6 opacity-30 flex-shrink-0 mt-0.5" />
              <p>
                DISCLAIMER: This report is generated by an artificial intelligence (NutriAI) and is for informational purposes only.
                It does not constitute medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional
                before making dietary changes or if you have severe food allergies. AI interpretations may occasionally be inaccurate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReport;
