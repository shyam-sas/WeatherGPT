import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Globe2,
  Bell,
  Thermometer,
  MapPin,
  Moon,
  Sun,
  Laptop,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Info,
  Award,
  ChevronRight
} from 'lucide-react';
import { api, setStoredLanguage } from '../api/client';
import { UserSettings } from '../types';
import { LANGUAGES, getTranslation } from '../i18n/translations';

interface SettingsScreenProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  currentLanguage: string;
  onUpdateLanguage: (lang: string) => void;
  currentProfession: string;
  onUpdateProfession: (prof: string) => void;
  onResetOnboarding: () => void;
  onOpenJudgeDemo?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  currentLanguage,
  onUpdateLanguage,
  onResetOnboarding,
  onOpenJudgeDemo,
}) => {
  const [locations, setLocations] = useState<any[]>([]);
  const [newCityName, setNewCityName] = useState('');
  const [newCityLat, setNewCityLat] = useState(28.6139);
  const [newCityLon, setNewCityLon] = useState(77.2090);
  const [showAddCity, setShowAddCity] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Hidden Developer / Judge mode flag (activated via 5-tap on version or url ?dev=true)
  const [devModeUnlocked, setDevModeUnlocked] = useState(
    () => localStorage.getItem('weathergpt_dev_mode') === 'true' || window.location.search.includes('dev=true')
  );
  const [versionTapCount, setVersionTapCount] = useState(0);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const locs = await api.getLocations();
      setLocations(locs || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async (key: keyof UserSettings) => {
    const updated = {
      ...settings,
      [key]: !settings[key],
    };
    onUpdateSettings(updated);
    try {
      await api.updateSettings(updated);
      triggerSuccess();
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangeTheme = async (themeVal: string) => {
    const updated = {
      ...settings,
      theme: themeVal,
    };
    onUpdateSettings(updated);
    try {
      await api.updateSettings(updated);
      triggerSuccess();
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangeUnit = async (key: keyof UserSettings, value: string) => {
    const updated = {
      ...settings,
      [key]: value,
    };
    onUpdateSettings(updated);
    try {
      await api.updateSettings(updated);
      triggerSuccess();
    } catch (e) {
      console.error(e);
    }
  };

  const triggerSuccess = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddLocation = async () => {
    if (!newCityName.trim()) return;
    try {
      await api.addLocation({
        label: newCityName.trim(),
        lat: newCityLat,
        lon: newCityLon,
        is_default: false,
      });
      setNewCityName('');
      setShowAddCity(false);
      fetchLocations();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    try {
      await api.deleteLocation(id);
      fetchLocations();
    } catch (e) {
      console.error(e);
    }
  };

  const handleVersionTap = () => {
    const nextCount = versionTapCount + 1;
    setVersionTapCount(nextCount);
    if (nextCount >= 5) {
      setDevModeUnlocked(true);
      localStorage.setItem('weathergpt_dev_mode', 'true');
      alert('Developer / Judge Evaluation Mode Unlocked.');
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 p-4 max-w-md mx-auto pb-24 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pt-2 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {getTranslation(currentLanguage, 'settings_title')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {getTranslation(currentLanguage, 'settings_subtitle')}
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Saved</span>
          </span>
        )}
      </div>

      <div className="space-y-3.5">
        {/* 1. Theme Preference */}
        <div className="p-4 rounded-3xl glass-surface border border-white/40 dark:border-white/10 shadow-xs">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-3">
            <Sun className="w-4 h-4" />
            <span>{getTranslation(currentLanguage, 'theme_display')}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'system', label: 'System', icon: Laptop },
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
            ].map((t) => {
              const isSelected = (settings.theme || 'system') === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => handleChangeTheme(t.id)}
                  className={`p-2.5 rounded-2xl text-center border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    isSelected
                      ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                      : 'bg-white/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px]">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Language Switcher (13 Indian Languages) */}
        <div className="p-4 rounded-3xl glass-surface border border-white/40 dark:border-white/10 shadow-xs">
          <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400 font-bold text-xs mb-3">
            <Globe2 className="w-4 h-4" />
            <span>Display & Assistant Language</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
            {LANGUAGES.map((l) => {
              const isSelected = currentLanguage === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => {
                    onUpdateLanguage(l.code);
                    setStoredLanguage(l.code);
                    triggerSuccess();
                  }}
                  className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                      : 'bg-white/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="text-xs">{l.native}</div>
                  <div className="text-[9px] opacity-75">{l.code.toUpperCase()}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Measurement Units */}
        <div className="p-4 rounded-3xl glass-surface border border-white/40 dark:border-white/10 shadow-xs">
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold text-xs mb-3">
            <Thermometer className="w-4 h-4" />
            <span>{getTranslation(currentLanguage, 'measurement_units')}</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Temperature */}
            <div className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">{getTranslation(currentLanguage, 'temp_unit')}</span>
              <div className="flex space-x-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl">
                <button
                  onClick={() => handleChangeUnit('unit_temp', 'celsius')}
                  className={`px-3 py-1 rounded-lg font-bold ${
                    settings.unit_temp === 'celsius' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  °C
                </button>
                <button
                  onClick={() => handleChangeUnit('unit_temp', 'fahrenheit')}
                  className={`px-3 py-1 rounded-lg font-bold ${
                    settings.unit_temp === 'fahrenheit' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  °F
                </button>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">{getTranslation(currentLanguage, 'wind_unit')}</span>
              <div className="flex space-x-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl">
                {['kmh', 'ms', 'kn'].map((w) => (
                  <button
                    key={w}
                    onClick={() => handleChangeUnit('unit_wind', w)}
                    className={`px-2.5 py-1 rounded-lg font-bold ${
                      settings.unit_wind === w ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {w.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Saved Cities */}
        <div className="p-4 rounded-3xl glass-surface border border-white/40 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              <MapPin className="w-4 h-4" />
              <span>{getTranslation(currentLanguage, 'saved_cities')}</span>
            </div>
            <button
              onClick={() => setShowAddCity(!showAddCity)}
              className="p-1 rounded-lg bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 hover:bg-sky-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showAddCity && (
            <div className="mb-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 space-y-2 animate-in fade-in">
              <input
                type="text"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                placeholder="Enter Indian city (e.g. Pune, Jaipur)..."
                className="w-full bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-sky-500 shadow-xs"
              />
              <button
                onClick={handleAddLocation}
                className="w-full py-2 rounded-xl bg-sky-500 text-white text-xs font-bold hover:bg-sky-600 transition-colors shadow-xs"
              >
                {getTranslation(currentLanguage, 'add_favorites')}
              </button>
            </div>
          )}

          <div className="space-y-1.5">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="px-3.5 py-2 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{loc.label}</span>
                  {loc.is_default && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      Default
                    </span>
                  )}
                </div>
                {!loc.is_default && (
                  <button
                    onClick={() => handleDeleteLocation(loc.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 5. Notifications & Alerts */}
        <div className="p-4 rounded-3xl glass-surface border border-white/40 dark:border-white/10 shadow-xs">
          <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-bold text-xs mb-3">
            <Bell className="w-4 h-4" />
            <span>{getTranslation(currentLanguage, 'notifications_alerts')}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{getTranslation(currentLanguage, 'severe_alerts_toggle')}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{getTranslation(currentLanguage, 'severe_alerts_desc')}</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notif_severe}
                onChange={() => handleToggle('notif_severe')}
                className="w-4 h-4 accent-sky-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{getTranslation(currentLanguage, 'daily_digest_toggle')}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{getTranslation(currentLanguage, 'daily_digest_desc')}</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notif_daily_digest}
                onChange={() => handleToggle('notif_daily_digest')}
                className="w-4 h-4 accent-sky-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 6. About WeatherGPT */}
        <div className="p-4 rounded-3xl glass-surface border border-white/40 dark:border-white/10 shadow-xs">
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 font-bold text-xs mb-2">
            <Info className="w-4 h-4" />
            <span>About WeatherGPT</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            WeatherGPT is an atmospheric intelligence platform providing grounded forecasting, conversational reasoning in 13 Indian languages, and disaster resilience.
          </div>
          <div
            onClick={handleVersionTap}
            className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 cursor-pointer select-none font-mono"
            title="Version 2.0.4 — SIH26068"
          >
            Version 2.0.4 • Smart India Hackathon 2026 (SIH26068)
          </div>
        </div>

        {/* 7. Hidden Developer / Judge Tools (Only shown when explicitly unlocked) */}
        {devModeUnlocked && onOpenJudgeDemo && (
          <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 shadow-sm animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-xs">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Developer & Judge Evaluation Tools</span>
              </div>
              <button
                onClick={onOpenJudgeDemo}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors flex items-center space-x-1"
              >
                <span>Launch Scenarios</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Reset Walkthrough */}
        <button
          onClick={onResetOnboarding}
          className="w-full p-3 rounded-2xl glass-card-subtle text-slate-600 dark:text-slate-300 hover:text-sky-600 flex items-center justify-center space-x-2 text-xs font-bold transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{getTranslation(currentLanguage, 'relaunch_onboarding')}</span>
        </button>
      </div>
    </div>
  );
};
