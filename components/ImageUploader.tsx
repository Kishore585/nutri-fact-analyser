import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Loader2, Sparkles, MoveLeft } from 'lucide-react';
import { UserProfile } from '../types';

interface ImageUploaderProps {
  selectedProfile: UserProfile;
  onUpload: (file: File) => void;
  onBack: () => void;
  loading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ selectedProfile, onUpload, onBack, loading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  // Select hero image based on profile
  const getHeroImage = () => {
    if (selectedProfile.id === 'muscle') {
      return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2000";
    }
    return "https://images.unsplash.com/photo-1542362567-b05e50029d2f?auto=format&fit=crop&q=80&w=2000";
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 animate-fade-in">
      <div className="relative overflow-hidden rounded-[3.5rem] shadow-2xl border border-white/60 min-h-[650px] flex flex-col md:flex-row items-stretch">
        
        {/* Left Side: Visual Hero */}
        <div className="relative w-full md:w-1/2 min-h-[300px] md:min-h-full">
          <img 
            src={getHeroImage()} 
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" 
            alt={selectedProfile.name}
          />
          <div className="absolute inset-0 hero-gradient"></div>
          <div className="absolute top-12 left-12">
             <button 
              onClick={onBack}
              className="flex items-center gap-2 glass px-6 py-3 rounded-2xl text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all"
             >
               <MoveLeft className="w-4 h-4" /> Back
             </button>
          </div>
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-emerald-500 w-3 h-3 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">System Online</span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter leading-none mb-4">Precision Analysis.<br/>Zero Guesswork.</h2>
            <p className="text-white/70 text-sm font-medium">Powered by Gemini 3 Pro reasoning engine.</p>
          </div>
        </div>

        {/* Right Side: Interaction */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white/30 backdrop-blur-3xl">
          <div className="max-w-md mx-auto w-full text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-8">
              <Sparkles className="w-3 h-3" /> Nutritional Intelligence
            </div>
            
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight mb-8">
              Analyzing: <br/><span className="text-indigo-600 underline decoration-indigo-200">{selectedProfile.name}</span>
            </h1>

            <div 
              className={`glass p-2 rounded-[2.5rem] transition-all duration-500 group ${
                dragActive ? 'scale-105 shadow-2xl ring-4 ring-indigo-500/10' : ''
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="bg-white/50 border border-white border-dashed rounded-[2.25rem] p-10 flex flex-col items-center relative">
                {loading ? (
                  <div className="flex flex-col items-center py-10">
                    <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-bold text-sm tracking-tight uppercase">Deconstructing label...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center mb-10">
                       <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] shadow-xl shadow-indigo-500/30 flex items-center justify-center text-white transition-transform group-hover:scale-110">
                          <Camera className="w-12 h-12" />
                       </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-2">Upload Product Label</h3>
                    <p className="text-slate-400 text-xs font-medium mb-10 max-w-[200px] leading-relaxed mx-auto">
                      Snap a clear photo of the ingredients or nutrition panel for instant analysis.
                    </p>
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <ImageIcon className="w-5 h-5" /> Choose from Device
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    
                    <div className="mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       Or drag and drop anywhere
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;