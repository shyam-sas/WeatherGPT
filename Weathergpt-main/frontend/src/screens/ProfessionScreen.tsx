import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Tractor,
  Anchor,
  Plane,
  Ship,
  Building2,
  User,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ChevronDown,
  Clock,
  HelpCircle,
  ChevronUp
} from 'lucide-react';
import { api } from '../api/client';
import { AdvisoryResponse } from '../types';
import { PROFESSIONS, getTranslation } from '../i18n/translations';

interface ProfessionScreenProps {
  currentProfession: string;
  currentLat: number;
  currentLon: number;
  currentCity: string;
  language?: string;
  onUpdateProfession: (prof: string) => void;
}

export const ProfessionScreen: React.FC<ProfessionScreenProps> = ({
  currentProfession,
  currentLat,
  currentLon,
  currentCity,
  language = 'en',
  onUpdateProfession,
}) => {
  const [advisory, setAdvisory] = useState<AdvisoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedWhyIndices, setExpandedWhyIndices] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchAdvisory();
  }, [currentProfession, currentLat, currentLon, language]);

  const fetchAdvisory = async () => {
    setLoading(true);
    try {
      const data = await api.getAdvisory(currentProfession, currentLat, currentLon);
      setAdvisory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleWhy = (idx: number) => {
    setExpandedWhyIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            Action Required
          </span>
        );
      case 'attention':
        return (
          <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Advisory Caution
          </span>
        );
      default:
        return (
          <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Optimal Window
          </span>
        );
    }
  };

  const currentProfObj = PROFESSIONS.find((p) => p.id === currentProfession) || PROFESSIONS[0];

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 max-w-md mx-auto pb-24 transition-colors duration-200">
      {/* Screen Header */}
      <div className="flex items-center justify-between pt-2 pb-4">
        <div>
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            {getTranslation(language, 'operational_guidance')}
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {getTranslation(language, 'profession_advisory')}
          </h1>
        </div>

        <button
          onClick={fetchAdvisory}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-sky-600 shadow-sm active:scale-95"
          title="Refresh Advisory"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Profession Switcher Pill Card */}
      <div className="relative mb-4">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-sky-400 transition-all shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs text-slate-400 font-semibold">
                {getTranslation(language, 'active_profile')}
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {currentProfObj.name}
              </div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>

        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 mb-1">
                {getTranslation(language, 'switch_category')}
              </div>
              <div className="space-y-1">
                {PROFESSIONS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onUpdateProfession(p.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      currentProfession === p.id
                        ? 'bg-sky-500 text-white font-semibold shadow-sm'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-sky-600'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="text-[10px] opacity-70 truncate max-w-[150px]">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Summary Banner */}
      {advisory?.summary && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50/50 dark:from-sky-950/40 dark:to-slate-900 border border-sky-200 dark:border-sky-800/60 mb-4 flex items-start space-x-3 shadow-sm">
          <Sparkles className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-sky-900 dark:text-sky-200 leading-relaxed font-medium">
            {advisory.summary}
          </p>
        </div>
      )}

      {/* Topic-Grouped Actionable Guidance Cards */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
        ) : advisory?.topics && advisory.topics.length > 0 ? (
          advisory.topics.map((topic, idx) => {
            const isWhyOpen = expandedWhyIndices[idx] || false;

            return (
              <div
                key={idx}
                className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md shadow-slate-200/40 dark:shadow-none hover:border-sky-300 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {topic.category}
                  </span>
                  {getSeverityBadge(topic.severity)}
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1.5">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed font-medium">
                  {topic.summary}
                </p>

                {/* Best Operating Window Pill */}
                {topic.best_time_window && (
                  <div className="mb-3 flex items-center gap-1.5 text-[11px] font-bold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 px-3 py-1.5 rounded-xl border border-sky-200/60 dark:border-sky-800/40">
                    <Clock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>Operating Window: {topic.best_time_window}</span>
                  </div>
                )}

                {/* Recommendation Box */}
                <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-950 dark:text-emerald-200 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="leading-snug">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">
                      {getTranslation(language, 'action_plan')}:{' '}
                    </span>
                    {topic.recommendation}
                  </div>
                </div>

                {/* "Why?" Explainability Toggle */}
                {topic.why_reason && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => toggleWhy(idx)}
                      className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isWhyOpen ? 'Hide meteorological reasoning' : 'Why? (Meteorological basis)'}</span>
                      {isWhyOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {isWhyOpen && (
                      <div className="mt-2 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 leading-relaxed animate-in fade-in">
                        {topic.why_reason}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-xs text-slate-500 font-medium">
            Advisory engine is fetching operational field metrics...
          </div>
        )}
      </div>
    </div>
  );
};
