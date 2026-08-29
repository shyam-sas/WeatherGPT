import React from 'react';
import { Home, MessageSquare, Calendar, Map, MoreHorizontal } from 'lucide-react';

export type TabType = 'home' | 'chat' | 'forecast' | 'map' | 'more' | 'profession' | 'research' | 'disaster' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  hasActiveAlerts?: boolean;
  language?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  hasActiveAlerts = false,
}) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'WeatherGPT', icon: MessageSquare },
    { id: 'forecast', label: 'Forecast', icon: Calendar },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'more', label: 'More', icon: MoreHorizontal, hasBadge: hasActiveAlerts },
  ];

  // If one of the sub-screens is active, mark 'more' as active
  const isMoreActive = ['more', 'profession', 'research', 'disaster', 'settings'].includes(activeTab);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav-bar px-3 py-1.5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === 'more' ? isMoreActive : activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id as TabType)}
              className={`relative flex flex-col items-center py-1 px-3.5 rounded-2xl transition-all ${
                isActive
                  ? 'text-cyan-500 dark:text-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium'
              }`}
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {tab.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                )}
                {tab.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-cyan-500 dark:bg-cyan-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
