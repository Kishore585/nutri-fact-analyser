
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
              <span>VERSION 1.0.0</span>
              <span>•</span>
              <span>EST. 2024</span>
              <span>•</span>
              <span>SYSTEMS ARCHITECTURE</span>
            </div>
          </div>

          {/* Table of Contents / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            <section className="space-y-4">
              <h2 className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-4 h-4" /> 01. Executive Summary
              </h2>
              <div className="prose prose-slate text-slate-600 leading-relaxed">
                NutriScan AI addresses the critical gap between complex food labeling and consumer safety. In an era where "hidden sugars" and cryptic additives are standard, this application uses Google's Gemini AI to provide real-time, context-aware ingredient analysis tailored to individual health profiles such as Celiac disease, Diabetes, and specific food allergies.
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <Cpu className="w-4 h-4" /> 02. AI Methodology
              </h2>
              <div className="prose prose-slate text-slate-600 leading-relaxed">
                {/* Updated model name to gemini-3-pro-preview to match the complexity of the task */}
                The core intelligence utilizes the <strong>gemini-3-pro-preview</strong> model. Unlike traditional OCR which simply extracts text, NutriScan performs <strong>multimodal semantic analysis</strong>. It recognizes the visual structure of a label and cross-references identified ingredients against a database of health implications, strictly adhering to user-defined "custom conditions."
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <Code className="w-4 h-4" /> 03. Technical Implementation
              </h2>
              <div className="prose prose-slate text-slate-600 leading-relaxed">
                The system is architected as a modern Single Page Application (SPA):
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>React 19:</strong> Utilizing the latest concurrent rendering features.</li>
                  <li><strong>TypeScript:</strong> For strict type-safety across the analysis engine.</li>
                  <li><strong>Tailwind CSS:</strong> A utility-first design system for a responsive UI.</li>
                  <li><strong>Firebase:</strong> Providing secure authentication, cloud storage, and database persistence.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <Database className="w-4 h-4" /> 04. Data Persistence
              </h2>
              <div className="prose prose-slate text-slate-600 leading-relaxed">
                {/* Corrected persistence info to match Firebase implementation */}
                Privacy and data integrity are ensured via <strong>Firebase Cloud Infrastructure</strong>. User health profiles, encrypted scan histories, and analyzed images are securely stored in Firestore and Cloud Storage, allowing for seamless synchronization across devices while keeping personal health data protected.
              </div>
            </section>

          </div>

          {/* Full Width Section */}
          <div className="mt-16 bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Functional Use Cases</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-bold text-slate-800 text-sm mb-1">OCR Processing</h4>
                    <p className="text-xs text-slate-500">Multimodal extraction of raw ingredient text from complex label images.</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Safety Mapping</h4>
                    <p className="text-xs text-slate-500">Dynamic mapping of ingredients to SafetyStatus based on medical constraints.</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Report Synthesis</h4>
                    <p className="text-xs text-slate-500">Generating detailed nutritional analysis reports for medical or personal reference.</p>
                </div>
            </div>
          </div>

          {/* Footer Sign-off */}
          <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col items-center">
            <p className="text-slate-400 text-xs text-center max-w-md">
                This project report was automatically generated by the NutriScan AI documentation engine. 
                All system metrics and architectural details are accurate to build v1.0.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectReportView;
