
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { GitGraph, ArrowLeft } from 'lucide-react';

interface ArchitectureViewProps {
  onBack: () => void;
}

const DIAGRAM_DEFINITION = `
usecaseDiagram
    actor "User" as U
    actor "Google Gemini API" as AI
    actor "Local Storage" as LS

    package "NutriScan AI System" {
        
        package "Authentication" {
            usecase "Login / Sign Up" as UC1
            usecase "Logout" as UC2
        }

        package "Profile Management" {
            usecase "Manage Health Profile" as UC3
            usecase "Select Base Lifestyle" as UC3a
            usecase "Define Custom Conditions" as UC3b
        }

        package "Analysis Engine" {
            usecase "Scan Food Label" as UC4
            usecase "Upload/Take Photo" as UC4a
            usecase "Analyze Image" as UC5
            usecase "View Safety Verdict" as UC6
            usecase "View Ingredient Breakdown" as UC7
        }

        package "History System" {
            usecase "View Scan History" as UC8
            usecase "Load Past Result" as UC9
        }
    }

    %% Relationships
    U --> UC1
    U --> UC2
    UC1 ..> LS : read/write

    U --> UC3
    UC3 ..> UC3a : include
    UC3 ..> UC3b : include
    UC3 ..> LS : persist

    U --> UC4
    UC4 ..> UC4a : include
    UC4 ..> UC5 : include
    UC5 --> AI : send image + prompt
    UC5 ..> LS : read profile
    UC5 ..> LS : save result
    U --> UC6
    U --> UC7
    UC6 ..> UC7 : extend

    U --> UC8
    UC8 --> UC9
    UC8 ..> LS : read history
`;

const ArchitectureView: React.FC<ArchitectureViewProps> = ({ onBack }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({ 
      startOnLoad: false, 
      theme: 'neutral',
      fontFamily: 'Inter',
      securityLevel: 'loose',
    });

    // Render the diagram
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
            System Architecture
        </h1>
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to App
        </button>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-slate-100 mb-4">
            <p className="text-sm text-slate-500">
                This diagram illustrates the functional flow of NutriScan AI, showing how user actions interact with the Profile System, Gemini API, and Local Storage.
            </p>
        </div>
        <div className="overflow-x-auto flex justify-center p-4 bg-white min-h-[500px]">
            <div className="mermaid" ref={chartRef}>
                {DIAGRAM_DEFINITION}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureView;
