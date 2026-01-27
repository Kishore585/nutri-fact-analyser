import React from 'react';
import { ArrowLeft, BookOpen, Cpu, ShieldCheck, Globe, Database, Code, Printer } from 'lucide-react';

interface ProjectReportViewProps {
  onBack: () => void;
}

const ProjectReportView: React.FC<ProjectReportViewProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-fade-in print:p-0">
      {/* Header - Hidden on Print */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            Project Documentation
        </h1>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-medium"
          >
            <Printer className="w-4 h-4" /> Export PDF
          </button>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Close
          </button>
        </div>
      </div>

      {/* Report Document */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-3xl overflow-hidden print:border-none print:shadow-none">
        <div className="p-8 md:p-16">
          
          {/* Cover Section */}
          <div className="text-center mb-20 border-b border-slate-100 pb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-2xl text-white mb-6 shadow-xl">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase">NutriScan AI</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
              An intelligent nutrition assistant leveraging multimodal Large Language Models for personalized dietary analysis.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6 text-sm font-mono text-slate-400">
              <span>VERSION 1.1.0</span>
              <span>•</span>
              <span>EST. 2025</span>
              <span>•</span>
              <span>LOCAL-FIRST PERSISTENCE</span>
            </div>
          </div>

          {/* Table of Contents / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            <section className="space-y-4">
              <h2 className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-4 h-4" /> 01. Executive Summary
              </h2>
              <div className="prose prose-slate text-slate-600 leading-relaxed">
                NutriScan AI addresses the critical gap between complex food labeling and consumer safety. The application uses Google's Gemini 3 Pro AI to provide real-time, context-aware ingredient analysis tailored to individual health profiles.
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <Cpu className="w-4 h-4" /> 02. AI Methodology
              </h2>
              <div className="prose prose-slate text-slate-600 leading-relaxed">
                The core intelligence utilizes the <strong>gemini-3-pro-preview</strong> model. NutriScan performs <strong>multimodal semantic analysis</strong>, recognizing visual label structures and cross-referencing ingredients against a health implication knowledge base.
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <Code className="w-4 h-4" /> 03. Technical Implementation
              </h2>
              <div className="prose prose-slate text-slate-600 leading-relaxed">
                The system is architected as a privacy-centric SPA:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>React 19:</strong> Utilizing concurrent rendering for fluid UI.</li>
                  <li><strong>TypeScript:</strong> Type-safety for logical analysis engine.</li>
                  <li><strong>Tailwind CSS:</strong> Highly responsive utility-first design.</li>
                  <li><strong>LocalStorage:</strong> For non-cloud persistent health profiles.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <Database className="w-4 h-4" /> 04. Data Sovereignty
              </h2>
              <div className="prose prose-slate text-slate-600 leading-relaxed">
                Privacy is handled by keeping data on the edge. By removing third-party database dependencies (Firebase), user history and preferences remain entirely within the user's browser environment, providing absolute data sovereignty.
              </div>
            </section>

          </div>

          {/* Full Width Section */}
          <div className="mt-16 bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Functional Capabilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-bold text-slate-800 text-sm mb-1">OCR Analysis</h4>
                    <p className="text-xs text-slate-500">Multimodal extraction from complex or low-light label images.</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Safety Mapping</h4>
                    <p className="text-xs text-slate-500">Ingredient-to-Profile mapping based on medical constraints.</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-bold text-slate-800 text-sm mb-1">PDF Reporting</h4>
                    <p className="text-xs text-slate-500">Automated synthesis of nutritional analysis reports for medical use.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectReportView;