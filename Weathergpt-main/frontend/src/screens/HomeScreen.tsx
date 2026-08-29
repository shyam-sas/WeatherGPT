import React, { useState } from 'react';
import { Header } from '../components/Header';
import { StatusBanner } from '../components/StatusBanner';
import { VoiceChatBar } from '../components/VoiceChatBar';
import { TodayClimateCard } from '../components/TodayClimateCard';
import { WeatherRiskTimeline } from '../components/WeatherRiskTimeline';
import { ForecastStrip } from '../components/ForecastStrip';
import { WeatherExplainerModal } from '../components/WeatherExplainerModal';
import { CurrentWeather, ForecastResponse, AlertItem, UserSettings } from '../types';

interface HomeScreenProps {
  currentCity: string;
  currentLat: number;
  currentLon: number;
  profession: string;
  language: string;
  weather: CurrentWeather | null;
  forecast: ForecastResponse | null;
  alerts: AlertItem[];
  messages?: any[];
  onUpdateMessages?: React.Dispatch<React.SetStateAction<any[]>>;
  onSelectCity: (city: string, lat: number, lon: number) => void;
  onTriggerGPS?: () => void;
  onNavigateToDisaster: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentCity,
  currentLat,
  currentLon,
  profession,
  language,
  weather,
  forecast,
  alerts,
  settings,
  messages,
  onUpdateMessages,
  onSelectCity,
  onTriggerGPS,
  onNavigateToDisaster,
}) => {
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [selectedExplainerTerm, setSelectedExplainerTerm] = useState('humidity');
  const [activeQueryToChat, setActiveQueryToChat] = useState<string | undefined>(undefined);

  const handleOpenExplainer = (termKey: string) => {
    setSelectedExplainerTerm(termKey);
    setExplainerOpen(true);
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 flex flex-col max-w-md mx-auto relative pb-24 transition-colors duration-200">
      {/* 1. Clean Consumer Header */}
      <Header
        currentCity={currentCity}
        onSelectCity={onSelectCity}
        onTriggerGPS={onTriggerGPS}
      />

      {/* 2. Critical Status Banner (if active alert or stale) */}
      <StatusBanner
        alerts={alerts}
        isStale={weather?.stale}
        language={language}
        onNavigateToDisaster={onNavigateToDisaster}
      />

      {/* Main Streamlined Flow */}
      {weather ? (
        <div className="space-y-3 px-4 pt-2">
          {/* 3. Compact Weather Summary Card */}
          <TodayClimateCard
            weather={weather}
            unitTemp={settings.unit_temp}
            unitWind={settings.unit_wind}
            language={language}
            onOpenExplainer={handleOpenExplainer}
          />

          {/* 4. WeatherGPT Interactive Hero Area (with Integrated Decision Chips & Large Input) */}
          <VoiceChatBar
            currentLat={currentLat}
            currentLon={currentLon}
            currentCity={currentCity}
            profession={profession}
            language={language}
            externalQuery={activeQueryToChat}
            onClearExternalQuery={() => setActiveQueryToChat(undefined)}
            onLocationResolved={onSelectCity}
            messages={messages}
            onUpdateMessages={onUpdateMessages}
          />

          {/* 5. Today's Calm 4-Part Risk Timeline */}
          <WeatherRiskTimeline
            timeline={weather.risk_timeline}
            lang={language}
          />

          {/* 6. Minimal 7-Day Forecast Strip */}
          {forecast && (
            <ForecastStrip
              daily={forecast.daily}
              unitTemp={settings.unit_temp}
              language={language}
            />
          )}
        </div>
      ) : (
        /* Skeleton Placeholder */
        <div className="px-4 py-4 space-y-3 animate-pulse">
          <div className="h-28 rounded-3xl bg-slate-200/60 dark:bg-slate-800/60" />
          <div className="h-64 rounded-3xl bg-slate-200/60 dark:bg-slate-800/60" />
          <div className="h-28 rounded-3xl bg-slate-200/60 dark:bg-slate-800/60" />
        </div>
      )}

      {/* Meteorological Explainer Glossary Modal */}
      <WeatherExplainerModal
        isOpen={explainerOpen}
        onClose={() => setExplainerOpen(false)}
        initialTerm={selectedExplainerTerm}
      />
    </div>
  );
};
