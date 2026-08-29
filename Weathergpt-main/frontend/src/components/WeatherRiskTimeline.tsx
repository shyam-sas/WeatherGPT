import React from 'react';
import { Clock, Sun, CloudSun, CloudRain, Moon, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';
import { RiskTimelineData } from '../types';

interface WeatherRiskTimelineProps {
  timeline?: RiskTimelineData;
  lang?: string;
}

export const WeatherRiskTimeline: React.FC<WeatherRiskTimelineProps> = ({ timeline, lang = 'en' }) => {
  if (!timeline || !timeline.slots || timeline.slots.length === 0) return null;

  const getSlotIcon = (label: string, code: number) => {
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95].includes(code)) {
      return <CloudRain className="w-5 h-5 text-cyan-500" />;
    }
    if (label.toLowerCase() === 'morning') return <Sun className="w-5 h-5 text-amber-400" />;
    if (label.toLowerCase() === 'afternoon') return <CloudSun className="w-5 h-5 text-amber-500" />;
    if (label.toLowerCase() === 'evening') return <CloudSun className="w-5 h-5 text-indigo-400" />;
    return <Moon className="w-5 h-5 text-indigo-300" />;
  };

  const getRiskBadge = (risk: string) => {
    const rLower = (risk || '').toLowerCase();
    if (rLower.includes('severe') || rLower.includes('alert')) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 shrink-0">
          <AlertCircle className="w-2.5 h-2.5" />
          <span>Severe</span>
        </span>
      );
    }
    if (rLower.includes('high')) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 shrink-0">
          <AlertTriangle className="w-2.5 h-2.5" />
          <span>High</span>
        </span>
      );
    }
    if (rLower.includes('caution')) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 shrink-0">
          <span>Caution</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
        <ShieldCheck className="w-2.5 h-2.5" />
        <span>Low</span>
      </span>
    );
  };

  return (
    <div className="w-full rounded-3xl glass-surface p-4 sm:p-5 border border-white/40 dark:border-white/10 shadow-xs">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500 dark:text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {lang === 'ta' ? 'இன்றைய காலவரிசை' : lang === 'hi' ? 'आज की समयरेखा' : "Today's Timeline"}
          </h3>
        </div>
        {timeline.recommendation && (
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 max-w-[55%] truncate text-right">
            {timeline.recommendation}
          </div>
        )}
      </div>

      {/* Spacious 4-Part Carousel / Grid */}
      <div className="flex space-x-2.5 overflow-x-auto pb-1 no-scrollbar">
        {timeline.slots.map((slot, index) => (
          <div
            key={index}
            className="flex-1 min-w-[95px] sm:min-w-[100px] flex flex-col justify-between p-3 rounded-2xl bg-white/70 dark:bg-slate-850/70 border border-slate-200/60 dark:border-slate-800 shadow-xs"
          >
            {/* Slot Header: Label & Risk Badge */}
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {slot.label}
              </span>
              {getRiskBadge(slot.risk_level)}
            </div>

            {/* Time Window */}
            <div className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mb-2">
              {slot.time_range}
            </div>

            {/* Icon + Temperature */}
            <div className="flex items-center space-x-2 my-1">
              <div className="p-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 shrink-0">
                {getSlotIcon(slot.label, slot.condition_code)}
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                  {Math.round(slot.temperature)}°
                </div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate">
                  {slot.summary}
                </div>
              </div>
            </div>

            {/* Rain Chance Progress Bar */}
            <div className="mt-2.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 mb-1">
                <span>Rain</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {Math.round(slot.rain_probability)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    slot.rain_probability >= 60
                      ? 'bg-rose-500'
                      : slot.rain_probability >= 30
                      ? 'bg-cyan-500'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.max(4, Math.min(100, slot.rain_probability))}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
