import React from 'react';
import { Wifi, WifiOff } from './Icons';

interface Props {
  isOnline: boolean;
  toggleOnline: () => void;
}

export const OfflineIndicator: React.FC<Props> = ({ isOnline, toggleOnline }) => {
  return (
    <button
      onClick={toggleOnline}
      className={`fixed bottom-8 right-6 z-40 p-3 rounded-full shadow-lg transition-colors border-2 ${
        isOnline ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'
      }`}
      title={isOnline ? "Online (Simulated)" : "Offline (Simulated)"}
    >
      {isOnline ? <Wifi size={24} /> : <WifiOff size={24} />}
    </button>
  );
};