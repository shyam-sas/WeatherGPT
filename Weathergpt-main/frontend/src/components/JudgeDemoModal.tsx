import React from 'react';
import { X, Award, Play, CheckCircle, Sparkles } from 'lucide-react';

export interface DemoScenario {
  id: string;
  title: string;
  category: string;
  query: string;
  lang: string;
  profession?: string;
  description: string;
  badge: string;
}

export const JUDGE_DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 's1_tanglish',
    title: '1. Code-Mixed Tanglish Weather Query',
    category: 'Conversational NLP',
    query: 'Nalaiku Chennai la malai varuma?',
    lang: 'ta',
    profession: 'general',
    description: 'Tests speech style mirroring and grounded rainfall probability in conversational Tanglish.',
    badge: 'Code-Mixing'
  },
  {
    id: 's2_multiturn',
    title: '2. Multi-Turn Context Follow-Up',
    category: 'Memory & State',
    query: 'Umbrella venuma?',
    lang: 'ta',
    profession: 'general',
    description: 'Tests conversational context preservation resolving previous turn without repeating city.',
    badge: 'Multi-Turn Memory'
  },
  {
    id: 's3_hinglish',
    title: '3. Code-Mixed Hinglish Query',
    category: 'Conversational NLP',
    query: 'Kal Delhi me barish hogi kya?',
    lang: 'hi',
    profession: 'general',
    description: 'Tests natural Hinglish parsing and numerical forecast grounding in Hindi.',
    badge: 'Hinglish NLP'
  },
  {
    id: 's4_yesterday',
    title: '4. Grounded Past/Yesterday Rain Verification',
    category: 'Anti-Hallucination',
    query: 'Did it rain yesterday in Chennai? Tell me exact mm.',
    lang: 'en',
    profession: 'general',
    description: 'Queries verified ERA5 historical archive without LLM hallucination.',
    badge: 'Climatology Grounding'
  },
  {
    id: 's5_farmer',
    title: '5. Farmer Agro-Meteorology & Spray Window',
    category: 'Profession Intelligence',
    query: 'Can I spray pesticides on cotton crops today?',
    lang: 'en',
    profession: 'farmer',
    description: 'Evaluates surface wind threshold (<15 km/h) and relative humidity for agronomic safety.',
    badge: 'Agro Intelligence'
  },
  {
    id: 's6_fisherman',
    title: '6. Fisherman Coastal Marine & Swell Safety',
    category: 'Maritime Operations',
    query: 'Is the sea state safe for mechanised boats today?',
    lang: 'en',
    profession: 'fisherman',
    description: 'Checks coastal wind squall and wave swell threshold (<2.5m) for craft navigation.',
    badge: 'Marine Safety'
  },
  {
    id: 's7_aviation',
    title: '7. Aviation VFR Visibility & Cloud Ceiling',
    category: 'Aviation METAR',
    query: 'What is the surface visibility and VFR ceiling at Chennai airport?',
    lang: 'en',
    profession: 'aviation',
    description: 'Calculates Optical Range (MOR) in km and boundary layer turbulence.',
    badge: 'Aviation METAR'
  },
  {
    id: 's8_disaster',
    title: '8. Disaster Severe Alert & DOs/DONTs',
    category: 'Disaster Management',
    query: 'Show active cyclone warning protocols and emergency helplines.',
    lang: 'en',
    profession: 'general',
    description: 'Displays Official IMD vs Derived Advisory distinction with NDMA action checklists.',
    badge: 'Disaster Resilience'
  },
  {
    id: 's9_urban',
    title: '9. Urban Planning Storm Drainage & Heat Island',
    category: 'Urban Infrastructure',
    query: 'What is the urban runoff risk and heat index in the metro area?',
    lang: 'en',
    profession: 'urban_planning',
    description: 'Evaluates rainfall intensity per hour vs stormwater capacity.',
    badge: 'Urban Planning'
  },
  {
    id: 's10_languages',
    title: '10. 13 Indian Languages Multi-Lingual Engine',
    category: 'Accessibility',
    query: 'What is the 3-day forecast in Bengali, Telugu, and Marathi?',
    lang: 'en',
    profession: 'general',
    description: 'Tests seamless localization across 13 major Eighth Schedule Indian languages.',
    badge: '13 Languages'
  }
];

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteScenario: (scenario: DemoScenario) => void;
}

export const JudgeDemoModal: React.FC<JudgeDemoModalProps> = ({
  isOpen,
  onClose,
  onExecuteScenario
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-teal-500/10 dark:bg-slate-850/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  SIH 2026 Judge & Evaluator Demo Panel
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700">
                  SIH26068
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                1-Click Quick Launchers for all 10 evaluation test scenarios
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Scenarios List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {JUDGE_DEMO_SCENARIOS.map((scenario) => (
            <div
              key={scenario.id}
              className="p-4 rounded-xl glass-card glass-card-hover border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {scenario.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {scenario.badge}
                  </span>
                </div>
                <div className="text-xs font-mono text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-2 py-1 rounded inline-block">
                  &ldquo;{scenario.query}&rdquo;
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              <button
                onClick={() => {
                  onExecuteScenario(scenario);
                  onClose();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-bold shadow-md hover:from-sky-600 hover:to-indigo-700 active:scale-95 transition-all shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Scenario</span>
              </button>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>All responses grounded in verified Open-Meteo & IMD numerical datasets</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
