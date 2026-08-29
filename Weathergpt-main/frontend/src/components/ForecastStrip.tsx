import React, { useState } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Droplets, X } from 'lucide-react';
import { DailyForecastItem } from '../types';
import { getTranslation } from '../i18n/translations';

interface ForecastStripProps {
  daily: DailyForecastItem[];
  unitTemp?: string;
  language?: string;
}

export const ForecastStrip: React.FC<ForecastStripProps> = ({
  daily,
  unitTemp = 'celsius',
  language = 'en',
}) => {
  const [selectedDay, setSelectedDay] = useState<DailyForecastItem | null>(null);

  const formatTemp = (val: number) => {
    if (unitTemp === 'fahrenheit') {
      return Math.round((val * 9) / 5 + 32);
    }
    return Math.round(val);
  };

  const getDayName = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return getTranslation(language, 'today');
    }
    return d.toLocaleDateString(
      language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-US',
      {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }
    );
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) {
      return <Sun className="w-5 h-5 text-amber-400" />;
    } else if (code === 2 || code === 3) {
      return <Cloud className="w-5 h-5 text-slate-400 dark:text-slate-300" />;
    } else if (code >= 51 && code <= 82) {
      return <CloudRain className="w-5 h-5 text-sky-400" />;
    } else if (code >= 95) {
      return <CloudLightning className="w-5 h-5 text-amber-400" />;
    }
    return <Sun className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div className="w-full rounded-3xl glass-surface p-4 sm:p-5 border border-white/40 dark:border-white/10 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {getTranslation(language, 'forecast_7day')}
        </h3>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          7-Day Outlook
        </span>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex space-x-2.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
        {daily.map((item, idx) => (
          <button
            key={item.date || idx}
            onClick={() => setSelectedDay(item)}
            className="flex-shrink-0 w-24 sm:w-28 rounded-2xl bg-white/60 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800 p-2.5 flex flex-col items-center justify-between hover:border-sky-300 dark:hover:border-sky-500/40 transition-all text-left cursor-pointer"
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate w-full text-center">
              {getDayName(item.date)}
            </span>

            <div className="my-2 p-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/70">
              {getWeatherIcon(item.condition_code)}
            </div>

            <div className="w-full flex items-center justify-between text-xs px-0.5">
              <span className="font-extrabold text-slate-900 dark:text-white">
                {formatTemp(item.temp_max)}°
              </span>
              <span className="text-[11px] text-slate-400 font-medium">{formatTemp(item.temp_min)}°</span>
            </div>

            {item.precip_probability > 0 ? (
              <div className="mt-1.5 flex items-center space-x-1 text-[10px] text-sky-600 dark:text-sky-400 font-semibold bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-full">
                <Droplets className="w-2.5 h-2.5 text-sky-500" />
                <span>{Math.round(item.precip_probability)}%</span>
              </div>
            ) : (
              <div className="mt-1.5 text-[10px] text-slate-400 font-medium">
                0% rain
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Selected Day Daypart Breakdown Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-500">
                  {getWeatherIcon(selectedDay.condition_code)}
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {getDayName(selectedDay.date)} ({selectedDay.date})
                  </h4>
                  <div className="text-xs text-slate-500">
                    High {formatTemp(selectedDay.temp_max)}° / Low {formatTemp(selectedDay.temp_min)}° • {selectedDay.condition}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Natural Explanation */}
            {selectedDay.explanation && (
              <div className="p-3 rounded-2xl bg-sky-50/60 dark:bg-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300 mb-4 border border-sky-100 dark:border-slate-700">
                {selectedDay.explanation}
              </div>
            )}

            {/* 4 Daypart Breakdown Slots */}
            {selectedDay.breakdown && selectedDay.breakdown.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5">
                {selectedDay.breakdown.map((slot, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      <span>{slot.label}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{slot.time_range}</span>
                    </div>
                    <div className="text-base font-extrabold text-slate-900 dark:text-white">
                      {formatTemp(slot.temperature)}°
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Rain: <strong className="text-sky-600 dark:text-sky-400">{Math.round(slot.rain_probability)}%</strong> • {slot.summary}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="font-bold">Wind Speed</div>
                  <div>Up to {Math.round(selectedDay.wind_speed_max ?? 0)} km/h</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="font-bold">UV Max</div>
                  <div>{(selectedDay.uv_index_max ?? 0).toFixed(1)} Index</div>
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedDay(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
