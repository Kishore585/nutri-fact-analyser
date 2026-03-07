
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

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl shadow-elevation-3 dark:shadow-dark-elevation-3 border border-outline-variant dark:border-dark-border min-h-[580px] flex flex-col md:flex-row items-stretch bg-white dark:bg-dark-surface transition-colors">

        {/* Left Side: Visual Hero */}
        <div className="relative w-full md:w-1/2 min-h-[260px] md:min-h-full">
          <img
            src={selectedProfile.thumbnailUrl || "https://images.unsplash.com/photo-1542362567-b05e50029d2f?auto=format&fit=crop&q=80&w=2000"}
            className="absolute inset-0 w-full h-full object-cover"
            alt={selectedProfile.name}
          />
          <div className="absolute inset-0 hero-gradient"></div>
          <div className="absolute top-6 left-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-xl text-white text-xs font-semibold hover:bg-white/25 transition-all"
            >
              <MoveLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-emerald-400 w-2 h-2 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">System Online</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight leading-tight mb-2">Precision Analysis.<br />Zero Guesswork.</h2>
            <p className="text-white/60 text-sm">Powered by Gemini 3 Pro reasoning engine.</p>
          </div>
        </div>

        {/* Right Side: Interaction */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-surface dark:bg-dark-surface transition-colors">
          <div className="max-w-sm mx-auto w-full text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-container dark:bg-dark-primary-container text-primary dark:text-dark-primary rounded-full text-[10px] font-semibold uppercase tracking-widest mb-6">
              <Sparkles className="w-3 h-3" /> Nutritional Intelligence
            </div>

            <h1 className="text-2xl font-bold text-on-surface dark:text-dark-text tracking-tight leading-tight mb-6">
              Analyzing: <br /><span className="text-primary dark:text-dark-primary">{selectedProfile.name}</span>
            </h1>

            <div
              className={`bg-white dark:bg-dark-surface-container p-1.5 rounded-2xl border transition-all duration-300 ${dragActive ? 'scale-[1.02] border-primary dark:border-dark-primary shadow-elevation-3' : 'border-outline-variant dark:border-dark-border shadow-elevation-1 dark:shadow-dark-elevation-1'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="bg-surface-container dark:bg-dark-surface-container-high border border-dashed border-outline dark:border-dark-border rounded-[14px] p-8 flex flex-col items-center">
                {loading ? (
                  <div className="flex flex-col items-center py-8">
                    <Loader2 className="w-12 h-12 text-primary dark:text-dark-primary animate-spin mb-3" />
                    <p className="text-on-surface-variant dark:text-dark-text-secondary font-medium text-sm">Deconstructing label...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center mb-8">
                      <div className="w-16 h-16 bg-primary dark:bg-dark-primary rounded-2xl shadow-elevation-2 flex items-center justify-center text-white dark:text-dark-bg">
                        <Camera className="w-8 h-8" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-on-surface dark:text-dark-text mb-1">Upload Product Label</h3>
                    <p className="text-on-surface-variant dark:text-dark-text-secondary text-xs mb-8 max-w-[200px] leading-relaxed mx-auto">
                      Snap a clear photo of the ingredients or nutrition panel.
                    </p>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3.5 bg-on-surface dark:bg-dark-text text-white dark:text-dark-bg font-semibold rounded-xl shadow-elevation-1 hover:bg-on-surface/90 dark:hover:bg-dark-text/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                    >
                      <ImageIcon className="w-4 h-4" /> Choose from Device
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

                    <div className="mt-4 text-[10px] font-medium text-on-surface-variant/50 dark:text-dark-text-secondary/50 uppercase tracking-wider">
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
