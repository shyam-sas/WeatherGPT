import React from 'react';
import { AlertTriangle, Info, BellRing, ChevronRight } from 'lucide-react';
import { AlertItem } from '../types';
import { getTranslation } from '../i18n/translations';

interface StatusBannerProps {
  alerts: AlertItem[];
  isStale?: boolean;
  language?: string;
  onNavigateToDisaster: () => void;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  alerts,
  isStale,
  language = 'en',
  onNavigateToDisaster,
}) => {
  const activeAlert = alerts.find(a => a.severity === 'warning' || a.severity === 'watch') || alerts[0];

  if (!activeAlert && !isStale) return null;

  const isSevere = activeAlert?.severity === 'warning' || activeAlert?.severity === 'watch';

  return (
    <div className="px-4 pt-3">
      {isStale && (
        <div className="mb-2 px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center space-x-2 text-xs font-medium text-amber-800 dark:text-amber-300 shadow-sm">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{getTranslation(language, 'stale_notice')}</span>
        </div>
      )}

      {activeAlert && (
        <button
          onClick={onNavigateToDisaster}
          className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between text-left transition-all shadow-md group ${
            isSevere
              ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200 hover:bg-rose-100/80 shadow-rose-500/5'
              : 'bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-sky-950 dark:text-sky-200 hover:bg-sky-100/80 shadow-sky-500/5'
          }`}
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className={`p-2 rounded-xl flex-shrink-0 ${isSevere ? 'bg-rose-500 text-white shadow-sm' : 'bg-sky-500 text-white shadow-sm'}`}>
              {isSevere ? <AlertTriangle className="w-4 h-4 animate-bounce" /> : <BellRing className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  activeAlert.severity === 'warning' ? 'bg-rose-600 text-white' :
                  activeAlert.severity === 'watch' ? 'bg-amber-500 text-white' : 'bg-sky-600 text-white'
                }`}>
                  {activeAlert.severity}
                </span>
                <span className="text-xs font-bold truncate text-slate-900 dark:text-white">{activeAlert.title}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">{activeAlert.description}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-2" />
        </button>
      )}
    </div>
  );
};
