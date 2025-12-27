import React from 'react';
import { CloudLightning, CheckCircle } from './Icons';

interface Props {
  isSyncing: boolean;
  progress: number;
}

export const SyncStatus: React.FC<Props> = ({ isSyncing, progress }) => {
  if (!isSyncing && progress === 0) return null;

  const isComplete = progress === 100;

  return (
    <div className={`fixed bottom-0 left-0 w-full z-50 transition-transform duration-500 ${isSyncing || isComplete ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="bg-stone-900 text-stone-100 p-4 shadow-2xl border-t border-stone-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
             {isComplete ? (
                 <CheckCircle className="text-leaf animate-bounce" />
             ) : (
                 <CloudLightning className="text-clay animate-pulse" />
             )}
             <div>
                <h4 className="font-bold text-sm">
                    {isComplete ? 'Export Complete' : 'Syncing to Global Market'}
                </h4>
                <p className="text-xs text-stone-400">
                    {isComplete ? 'All data is secure.' : 'Do not close the app...'}
                </p>
             </div>
          </div>
          <span className="font-mono text-sm font-bold">{progress}%</span>
        </div>
        
        {/* Progress Bar Track */}
        <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
          {/* Progress Bar Fill */}
          <div 
            className="h-full bg-gradient-to-r from-clay to-leaf transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};