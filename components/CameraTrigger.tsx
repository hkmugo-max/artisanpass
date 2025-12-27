import React, { useRef, useState } from 'react';
import { Camera, Loader2 } from './Icons';

interface Props {
  onCapture: (file: File, base64: string) => void;
  label?: string;
  isLoading?: boolean;
}

export const CameraTrigger: React.FC<Props> = ({ onCapture, label = "Take Photo", isLoading = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center my-4">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={inputRef}
        onChange={handleFileChange}
        disabled={isLoading}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
        className="w-24 h-24 bg-clay rounded-full flex items-center justify-center shadow-xl border-4 border-stone-100 hover:bg-earth transition-colors active:scale-95"
      >
        {isLoading ? (
          <Loader2 className="text-white animate-spin" size={40} />
        ) : (
          <Camera className="text-white" size={40} />
        )}
      </button>
      <span className="mt-2 text-stone-600 font-medium text-sm uppercase tracking-wide">
        {isLoading ? "Processing..." : label}
      </span>
    </div>
  );
};