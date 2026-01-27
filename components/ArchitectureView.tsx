import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { GitGraph, ArrowLeft, Layout } from 'lucide-react';

interface ArchitectureViewProps {
  onBack: () => void;
}

const DIAGRAM_DEFINITION = `
flowchart TD
    U[User] --> UI[React Frontend]
    UI --> LS[(LocalStorage)]
    UI --> AI[Gemini 3 Pro API]

    subgraph "Client Side (Local-First)"
        UI
        LS
    end

    subgraph "External Logic"
        AI
    end

    UI -- "1. Uploads Label" --> UI
    UI -- "2. Reads Profile" --> LS
    UI -- "3. Prompt + Image" --> AI
    AI -- "4. JSON Analysis" --> UI
    UI -- "5. Store History" --> LS
    UI -- "6. Render Report" --> UI
`;

const ArchitectureView: React.FC<ArchitectureViewProps> = ({ onBack }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: false, 
      theme: 'neutral',
      fontFamily: 'Plus Jakarta Sans',
      securityLevel: 'loose',
    });

    if (chartRef.current) {
        mermaid.run({
            nodes: [chartRef.current]
        });
    }
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GitGraph className="w-6 h-6 text-slate-400" />
            System Infrastructure
        </h1>
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to App
        </button>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 p-6 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-3 mb-2 text-indigo-600">
                <Layout className="w-5 h-5" />
                <h2 className="font-bold">Zero-Cloud Architecture</h2>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
                NutriScan AI is now 100% cloud-agnostic for user data. Personal health profiles and scan history are managed exclusively through the <strong>Web Storage API</strong> (LocalStorage), ensuring that sensitive data never leaves your browser's private storage.
            </p>
        </div>
        <div className="overflow-x-auto flex justify-center p-8 bg-white min-h-[400px]">
            <div className="mermaid scale-125 origin-top" ref={chartRef}>
                {DIAGRAM_DEFINITION}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureView;