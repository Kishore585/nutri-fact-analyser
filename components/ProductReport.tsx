
import React from 'react';
import { ScanResult, SafetyStatus, HistoryItem } from '../types';
import { Printer, Share2, ArrowLeft, ShieldCheck, ShieldAlert, Shield, FileText } from 'lucide-react';

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
    const text = `NutriScan AI Report\nVerdict: ${result.verdict}\nSummary: ${result.summary}\nProfile: ${profileName}`;
    navigator.clipboard.writeText(text);
    alert('Summary copied to clipboard!');
  };

  const getStatusIcon = (status: SafetyStatus) => {
    switch (status) {
      case SafetyStatus.SAFE: return <ShieldCheck className="w-12 h-12 text-emerald-600" />;
      case SafetyStatus.UNSAFE: return <ShieldAlert className="w-12 h-12 text-red-600" />;
      default: return <Shield className="w-12 h-12 text-amber-600" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-fade-in print:p-0">
      {/* UI Controls - Hidden on Print */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Analysis
        </button>
        <div className="flex gap-3">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all font-medium shadow-sm"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-medium shadow-md"
          >
            <Printer className="w-4 h-4" /> Print PDF
          </button>
        </div>
      </div>

      {/* Actual Report Document */}
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200 print:shadow-none print:border-none print:rounded-none">
        {/* Header Ribbon */}
        <div className={`h-2 w-full ${
          result.verdict === SafetyStatus.SAFE ? 'bg-emerald-500' : 
          result.verdict === SafetyStatus.UNSAFE ? 'bg-red-500' : 'bg-amber-500'
        }`} />

        <div className="p-8 md:p-12">
          {/* Document Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12 pb-12 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-6 h-6 text-emerald-600" />
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Nutritional Analysis Report</h1>
              </div>
              <p className="text-slate-400 text-sm font-mono uppercase tracking-widest">ID: {reportId}</p>
            </div>
            <div className="text-right md:text-right text-slate-500 text-sm">
              <p>Prepared for: <span className="text-slate-900 font-semibold">{userName}</span></p>
              <p>Profile: <span className="text-slate-900 font-semibold">{profileName}</span></p>
              <p>Date: <span className="text-slate-900 font-semibold">{date.toLocaleDateString()} {date.toLocaleTimeString()}</span></p>
            </div>
          </div>

          {/* Verdict Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className={`col-span-1 rounded-2xl p-8 flex flex-col items-center justify-center text-center border-2 ${
              result.verdict === SafetyStatus.SAFE ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 
              result.verdict === SafetyStatus.UNSAFE ? 'bg-red-50 border-red-100 text-red-900' : 'bg-amber-50 border-amber-100 text-amber-900'
            }`}>
              <div className="mb-4">{getStatusIcon(result.verdict)}</div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-1">{result.verdict}</h2>
              <p className="text-sm font-medium opacity-70">Safety Verdict</p>
            </div>
            
            <div className="col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Executive Summary</h3>
              <p className="text-slate-600 leading-relaxed text-lg italic font-serif">
                "{result.summary}"
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {result.nutritionalHighlights.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full uppercase tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Ingredients Table */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm">01</span>
              Ingredient Composition Analysis
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-100 text-slate-400 text-xs uppercase tracking-widest font-bold">
                    <th className="py-4 px-4">Ingredient Name</th>
                    <th className="py-4 px-4">Classification</th>
                    <th className="py-4 px-4">Health Implication</th>
                    <th className="py-4 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {result.ingredients.map((ing, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-900">{ing.commonName}</p>
                        <p className="text-xs text-slate-400 font-mono italic">{ing.name}</p>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">{ing.description}</td>
                      <td className="py-4 px-4 text-sm text-slate-600 leading-snug">{ing.reason}</td>
                      <td className="py-4 px-4 text-right">
                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${
                          ing.status === SafetyStatus.SAFE ? 'bg-emerald-100 text-emerald-700' :
                          ing.status === SafetyStatus.UNSAFE ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
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

          {/* Footer Disclaimer */}
          <div className="mt-16 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4 text-slate-400 text-[10px] leading-relaxed">
              <ShieldCheck className="w-8 h-8 opacity-20" />
              <p>
                DISCLAIMER: This report is generated by an artificial intelligence (NutriScan AI) and is for informational purposes only. 
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
