import React, { useState, useEffect } from 'react';
import {
  Activity,
  Info,
  TrendingUp,
  Cloud,
  Droplets,
  Sun,
  Layers,
  Atom,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { api } from '../api/client';
import { ResearchMetricItem, HistoricalPoint } from '../types';
import { getTranslation } from '../i18n/translations';

interface ResearchScreenProps {
  currentLat: number;
  currentLon: number;
  currentCity: string;
  language?: string;
}

export const ResearchScreen: React.FC<ResearchScreenProps> = ({
  currentLat,
  currentLon,
  currentCity,
  language = 'en',
}) => {
  const [activeCategory, setActiveCategory] = useState('atmospheric');
  const [metrics, setMetrics] = useState<ResearchMetricItem[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState<'30d' | '60d' | '90d'>('30d');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const categories = [
    { id: 'atmospheric', label: 'Atmospheric Conditions', icon: Cloud },
    { id: 'moisture', label: 'Moisture & Water', icon: Droplets },
    { id: 'energy', label: 'Energy & Radiation', icon: Sun },
    { id: 'long_term', label: 'Long-Term Indicators', icon: Layers },
  ];

  useEffect(() => {
    fetchMetrics(activeCategory);
  }, [activeCategory, currentLat, currentLon]);

  useEffect(() => {
    fetchHistorical(selectedRange);
  }, [selectedRange, currentLat, currentLon]);

  const fetchMetrics = async (cat: string) => {
    setLoading(true);
    try {
      const res = await api.getResearchMetrics(cat, currentLat, currentLon);
      setMetrics(res.metrics || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistorical = async (range: string) => {
    try {
      const days = range === '90d' ? 90 : range === '60d' ? 60 : 30;
      const end = new Date();
      end.setDate(end.getDate() - 2);
      const start = new Date();
      start.setDate(start.getDate() - (days + 2));

      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];

      const res = await api.getHistorical(currentLat, currentLon, startStr, endStr);
      setHistoricalData(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 max-w-md mx-auto pb-24 transition-colors duration-200">
      {/* Header */}
      <div className="pt-2 pb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {getTranslation(language, 'climate_research')}
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Numerical Weather Prediction (NWP) diagnostic metrics and historical reanalysis for {currentCity}.
        </p>
      </div>

      {/* 4 Category Pill Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-3.5 rounded-2xl border text-left flex items-center space-x-2.5 transition-all shadow-sm active:scale-95 ${
                isActive
                  ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-50/50 hover:text-sky-600'
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}
              />
              <span className="text-xs font-bold leading-tight">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Metrics List with Plain-Language Tooltips & Formulas */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {getTranslation(language, 'diagnostic_indices')}
          </h3>
          <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold">
            {getTranslation(language, 'plain_tooltip_hint')}
          </span>
        </div>

        {loading ? (
          <div className="space-y-2.5 animate-pulse">
            <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
        ) : (
          metrics.map((m) => {
            const isTooltipOpen = activeTooltip === m.code;
            return (
              <div
                key={m.code}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {m.name}
                    </span>
                    <button
                      onClick={() => setActiveTooltip(isTooltipOpen ? null : m.code)}
                      className="text-slate-400 hover:text-sky-600"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-sky-600 dark:text-sky-400">
                      {m.value}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold ml-1">{m.unit}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                  {m.description}
                </p>

                {/* Plain-Language + Scientific Tooltip Expandable */}
                {isTooltipOpen && (
                  <div className="mt-2.5 p-3 rounded-2xl bg-sky-50/80 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/60 text-xs text-sky-900 dark:text-sky-200 font-medium space-y-1.5 animate-in fade-in">
                    <div>
                      <span className="font-bold text-sky-700 dark:text-sky-300">Plain Explanation: </span>
                      {m.plain_tooltip}
                    </div>
                    {m.expert_formula && (
                      <div className="pt-1.5 border-t border-sky-200/60 dark:border-sky-800/60 text-[11px] font-mono text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                        <Atom className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span>Formula: {m.expert_formula}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Historical Climate Archive Chart */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              {getTranslation(language, 'historical_chart')}
            </h3>
          </div>

          <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {(['30d', '60d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRange(r)}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                  selectedRange === r
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area / Line chart */}
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradientDynamic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '11px',
                  color: '#ffffff',
                }}
              />
              <Area
                type="monotone"
                dataKey="temp_max"
                name="Max Temp (°C)"
                stroke="#0284c7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tempGradientDynamic)"
              />
              <Line
                type="monotone"
                dataKey="temp_min"
                name="Min Temp (°C)"
                stroke="#64748b"
                strokeWidth={1.5}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
