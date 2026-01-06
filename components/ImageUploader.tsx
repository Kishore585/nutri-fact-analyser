
import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
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
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
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
    <div className="w-full max-w-2xl mx-auto p-6 animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Scan Food Label</h2>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
           <span>Analyzing for:</span>
           <span className={`px-2 py-0.5 rounded-md font-medium text-slate-700 bg-slate-100 border border-slate-200`}>
             {selectedProfile.name}
           </span>
        </div>
      </div>

      <div 
        className={`relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-3xl transition-all duration-300 ${
          dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-white hover:bg-slate-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {loading ? (
          <div className="flex flex-col items-center animate-pulse">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
            <h3 className="text-lg font-semibold text-slate-800">Analyzing...</h3>
            <p className="text-slate-500 text-sm mt-2">Checking your health requirements</p>
          </div>
        ) : (
          <>
            <div className="p-4 rounded-full bg-slate-100 mb-4 group-hover:scale-110 transition-transform">
               <Camera className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-lg font-medium text-slate-800 mb-2">
              Tap to Take Photo
            </p>
            <p className="text-sm text-slate-400 mb-6 max-w-xs text-center">
              Upload Nutrition Facts or Ingredients list for instant analysis.
            </p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Select Image
            </button>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="hidden" 
            />
          </>
        )}
      </div>
      
      <div className="mt-8 flex gap-4 justify-center">
         <div className="flex items-center gap-2 text-slate-400 text-xs">
             <ImageIcon className="w-3 h-3" /> Supports JPG, PNG, WEBP
         </div>
      </div>
    </div>
  );
};

export default ImageUploader;
