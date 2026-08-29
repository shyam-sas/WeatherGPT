import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, Umbrella, Compass, CheckCircle2, AlertTriangle, Navigation } from 'lucide-react';
import { DailyBriefingData } from '../types';

interface DailyBriefingCardProps {
  briefing?: DailyBriefingData;
  humanExplanation?: string;
  lang?: string;
  cityName?: string;
}

export const DailyBriefingCard: React.FC<DailyBriefingCardProps> = ({
  briefing,
  humanExplanation,
  lang = 'en',
  cityName = 'Your Area'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!briefing && !humanExplanation) return null;

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const textToSpeak = briefing
      ? `${briefing.greeting}. ${briefing.headline}. ${briefing.summary} ${briefing.action_tip}`
      : humanExplanation || '';

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Choose speech synthesis language code
    if (lang === 'hi') utterance.lang = 'hi-IN';
    else if (lang === 'ta') utterance.lang = 'ta-IN';
    else if (lang === 'te') utterance.lang = 'te-IN';
    else if (lang === 'bn') utterance.lang = 'bn-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-5 border border-sky-200/60 dark:border-sky-500/20 shadow-md">
      {/* Decorative Top Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-teal-400 to-indigo-500" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 tracking-wider uppercase">
              {briefing?.greeting || 'Daily Briefing'} • {cityName}
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {briefing?.headline || 'Atmospheric Intelligence Summary'}
            </h3>
          </div>
        </div>

        {/* Audio TTS Button */}
        <button
          onClick={handleSpeak}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            isPlaying
              ? 'bg-sky-500 text-white shadow-md animate-pulse'
              : 'bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-slate-700 border border-sky-200 dark:border-slate-700'
          }`}
          title="Listen to Weather Briefing"
        >
          {isPlaying ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-sky-500" />
              <span>Listen</span>
            </>
          )}
        </button>
      </div>

      {/* Plain Language Human Explanation */}
      <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium mb-4 bg-sky-50/50 dark:bg-slate-900/40 rounded-xl p-3.5 border border-sky-100 dark:border-slate-800">
        {humanExplanation || briefing?.summary}
      </div>

      {/* Quick Action Badges */}
      {briefing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* Umbrella Indicator */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60">
            <div className={`p-2 rounded-lg ${briefing.umbrella_needed ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300' : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300'}`}>
              <Umbrella className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-400">Umbrella Status</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {briefing.umbrella_needed ? 'Carry an Umbrella' : 'No Umbrella Needed'}
              </div>
            </div>
          </div>

          {/* Commute & Travel Advisory */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60">
            <div className={`p-2 rounded-lg ${briefing.safe_to_travel ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300'}`}>
              {briefing.safe_to_travel ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-400">Commute Outlook</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {briefing.travel_advisory || (briefing.safe_to_travel ? 'Conditions look favorable' : 'Travel may be affected')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Tip */}
      {briefing?.action_tip && (
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-sky-800 dark:text-sky-300 bg-sky-100/60 dark:bg-sky-950/50 px-3 py-2 rounded-lg">
          <Compass className="w-4 h-4 text-sky-500 shrink-0" />
          <span>Tip: {briefing.action_tip}</span>
        </div>
      )}
    </div>
  );
};
