import React from 'react';
import {
  ShieldAlert,
  Briefcase,
  Activity,
  Settings as SettingsIcon,
  ChevronRight,
  Sparkles,
  CloudSun
} from 'lucide-react';
import { getTranslation } from '../i18n/translations';

interface MoreScreenProps {
  onNavigate: (tab: 'disaster' | 'profession' | 'research' | 'settings') => void;
  hasActiveAlerts?: boolean;
  language?: string;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({
  onNavigate,
  hasActiveAlerts = false,
  language = 'en',
}) => {
  const menuItems = [
    {
      id: 'disaster' as const,
      title: 'Disaster Safety & Alerts',
      subtitle: 'Official IMD warnings, NDMA emergency DOs/DON\'Ts & helplines',
      icon: ShieldAlert,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/50',
      badge: hasActiveAlerts ? 'Active' : undefined,
    },
    {
      id: 'profession' as const,
      title: 'Profession Guidance',
      subtitle: 'Targeted operational advice for farming, fishing, marine & aviation',
      icon: Briefcase,
      color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/50',
    },
    {
      id: 'research' as const,
      title: 'NWP Climate Research',
      subtitle: 'Atmospheric diagnostics, formulas, and historical reanalysis',
      icon: Activity,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50',
    },
    {
      id: 'settings' as const,
      title: 'Settings & Preferences',
      subtitle: 'Theme, 13 Indian languages, measurement units & favorites',
      icon: SettingsIcon,
      color: 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800',
    },
  ];

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 p-4 max-w-md mx-auto pb-24 transition-colors duration-200">
      {/* Header */}
      <div className="pt-2 pb-5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-xs">
            <CloudSun className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              More Services
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Advanced atmospheric intelligence & settings
            </p>
          </div>
        </div>
      </div>

      {/* Menu Cards */}
      <div className="space-y-2.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full p-4 rounded-3xl glass-surface border border-white/40 dark:border-white/10 hover:border-sky-300 dark:hover:border-sky-500/40 flex items-center justify-between text-left transition-all shadow-xs group cursor-pointer active:scale-98"
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className={`p-3 rounded-2xl ${item.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5 truncate">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
        WeatherGPT • Smart India Hackathon 2026 (SIH26068)
      </div>
    </div>
  );
};
