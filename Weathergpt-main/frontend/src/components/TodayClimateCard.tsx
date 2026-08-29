import React, { useState } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Compass,
  SlidersHorizontal,
  Umbrella
} from 'lucide-react';
import { CurrentWeather } from '../types';
import { getTranslation, getConditionTranslation } from '../i18n/translations';

interface TodayClimateCardProps {
  weather: CurrentWeather;
  unitTemp?: string;
  unitWind?: string;
  language?: string;
  onOpenExplainer?: (termKey: string) => void;
}

export const TodayClimateCard: React.FC<TodayClimateCardProps> = ({
  weather,
  unitTemp = 'celsius',
  unitWind = 'kmh',
  language = 'en',
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isWhyOpen, setIsWhyOpen] = useState(false);

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) {
      return <Sun className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 drop-shadow-sm animate-subtle-drift" />;
    } else if (code === 2 || code === 3) {
      return <Cloud className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300 drop-shadow-sm animate-subtle-drift" />;
    } else if (code >= 51 && code <= 82) {
      return <CloudRain className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 drop-shadow-sm" />;
    } else if (code >= 95) {
      return <CloudLightning className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 drop-shadow-sm" />;
    }
    return <Sun className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 drop-shadow-sm animate-subtle-drift" />;
  };

  const formatTemp = (val: number) => {
    if (unitTemp === 'fahrenheit') {
      return Math.round((val * 9) / 5 + 32);
    }
    return Math.round(val);
  };

  const translatedCondition = getConditionTranslation(weather.condition, language);
  const rainChance = Math.round(
    weather.risk_timeline?.slots?.[1]?.rain_probability || (weather.precipitation > 0 ? 50 : 15)
  );

  return (
    <div className="w-full">
      {/* Compact Weather Summary Card */}
      <div className="relative rounded-3xl glass-surface p-4 sm:p-5 border border-white/40 dark:border-white/10 shadow-xs overflow-hidden">
        {/* Top Header: NOW label & Location */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 text-[10px] font-extrabold tracking-wider uppercase border border-cyan-500/25">
              NOW
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
              {weather.city}
            </span>
          </div>

          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {translatedCondition}
          </div>
        </div>

        {/* Hero Temp & Icon Row */}
        <div className="flex items-center justify-between my-1">
          <div className="flex items-baseline space-x-3">
            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
              {formatTemp(weather.temperature)}°
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {getTranslation(language, 'feels_like')} {formatTemp(weather.feels_like)}°{unitTemp === 'fahrenheit' ? 'F' : 'C'}
            </div>
          </div>

          <div className="p-1">
            {getWeatherIcon(weather.condition_code)}
          </div>
        </div>

        {/* Rain Chance & Wind Speed Row */}
        <div className="flex items-center space-x-2 mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-xs">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold">
            <Droplets className="w-3.5 h-3.5 text-cyan-500" />
            <span>Rain {rainChance}%</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
            <Wind className="w-3.5 h-3.5 text-slate-500" />
            <span>Wind {Math.round(weather.wind_speed)} {unitWind}</span>
          </div>

          <div className="flex-1" />

          {/* Quick Details & Why Triggers */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 transition-colors"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{isAdvancedOpen ? 'Less' : 'Details'}</span>
              {isAdvancedOpen ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
            </button>

            <button
              onClick={() => setIsWhyOpen(!isWhyOpen)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:underline transition-colors"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Why?</span>
            </button>
          </div>
        </div>

        {/* Compact Practical Advice Pill */}
        {weather.daily_briefing?.action_tip && (
          <div className="mt-2.5 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-800 dark:text-cyan-200">
            <Umbrella className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span className="truncate">{weather.daily_briefing.action_tip}</span>
          </div>
        )}

        {/* Advanced NWP Diagnostics Drawer (Progressive Disclosure) */}
        {isAdvancedOpen && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2.5 mt-2.5 border-t border-slate-200/40 dark:border-slate-800/40 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-850/50 border border-slate-200/50 dark:border-slate-800">
              <div className="text-[9px] uppercase font-semibold text-slate-400">Humidity</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{Math.round(weather.humidity ?? 0)}%</div>
            </div>

            <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-850/50 border border-slate-200/50 dark:border-slate-800">
              <div className="text-[9px] uppercase font-semibold text-slate-400">Pressure</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{Math.round(weather.pressure ?? 1013)} hPa</div>
            </div>

            <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-850/50 border border-slate-200/50 dark:border-slate-800">
              <div className="text-[9px] uppercase font-semibold text-slate-400">UV Index</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{(weather.uv_index ?? 0).toFixed(1)}</div>
            </div>

            <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-850/50 border border-slate-200/50 dark:border-slate-800">
              <div className="text-[9px] uppercase font-semibold text-slate-400">Air Quality</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{weather.aqi ?? 50} • {weather.aqi_label || 'Moderate'}</div>
            </div>

            <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-850/50 border border-slate-200/50 dark:border-slate-800">
              <div className="text-[9px] uppercase font-semibold text-slate-400">Visibility</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{weather.visibility ?? 10} km</div>
            </div>

            <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-850/50 border border-slate-200/50 dark:border-slate-800">
              <div className="text-[9px] uppercase font-semibold text-slate-400">Wind Heading</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                <Compass className="w-2.5 h-2.5 text-cyan-500" />
                <span>{Math.round(weather.wind_direction ?? 0)}°</span>
              </div>
            </div>
          </div>
        )}

        {/* Meteorological Explainability Basis Drawer */}
        {isWhyOpen && (
          <div className="mt-2.5 p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 leading-relaxed animate-in fade-in duration-200">
            <div className="font-semibold text-amber-700 dark:text-amber-400 mb-1">
              Atmospheric Diagnostic Basis:
            </div>
            <p>
              {weather.why_reason ||
                `Current temperature of ${weather.temperature}°C driven by surface solar insolation, with ${Math.round(
                  weather.humidity
                )}% relative humidity and barometric pressure at ${Math.round(weather.pressure)} hPa.`}
            </p>
            <div className="mt-1.5 text-[10px] text-amber-600/80 dark:text-amber-400/60">
              Source: {weather.data_source || 'Open-Meteo & IMD High-Resolution Numerical Grid'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
