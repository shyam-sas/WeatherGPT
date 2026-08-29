import React, { useState, useEffect } from 'react';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MoreScreen } from './screens/MoreScreen';
import { ProfessionScreen } from './screens/ProfessionScreen';
import { ResearchScreen } from './screens/ResearchScreen';
import { DisasterScreen } from './screens/DisasterScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { BottomNav, TabType } from './components/BottomNav';
import { WeatherBackground } from './components/WeatherBackground';
import { VoiceChatBar } from './components/VoiceChatBar';
import { DecisionChips } from './components/DecisionChips';
import { ForecastStrip } from './components/ForecastStrip';
import { MapRadarPreview } from './components/MapRadarPreview';
import { JudgeDemoModal, DemoScenario } from './components/JudgeDemoModal';
import { ArrowLeft, MessageSquare, Calendar, Map as MapIcon } from 'lucide-react';
import {
  api,
  isOnboardingCompleted,
  getStoredLanguage,
  getStoredProfession,
  setStoredProfession,
  setStoredLanguage,
  setOnboardingCompleted
} from './api/client';
import { CurrentWeather, ForecastResponse, AlertItem, UserSettings } from './types';

export const App: React.FC = () => {
  const [onboarded, setOnboarded] = useState<boolean>(isOnboardingCompleted());
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isJudgeDemoOpen, setIsJudgeDemoOpen] = useState(false);
  const [demoQueryToExecute, setDemoQueryToExecute] = useState<string | undefined>(undefined);
  
  // Stored or auto-detected live location
  const [city, setCity] = useState<string>(localStorage.getItem('weathergpt_city') || 'Detecting Location...');
  const [lat, setLat] = useState<number>(Number(localStorage.getItem('weathergpt_lat')) || 13.0827);
  const [lon, setLon] = useState<number>(Number(localStorage.getItem('weathergpt_lon')) || 80.2707);

  const [language, setLanguage] = useState<string>(getStoredLanguage());
  const [profession, setProfession] = useState<string>(getStoredProfession());

  const [messages, setMessages] = useState<any[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      text:
        getStoredLanguage() === 'ta'
          ? `வணக்கம்! ${localStorage.getItem('weathergpt_city') || 'உங்கள் பகுதியில்'} வானிலை நிலவரம் குறித்து என்ன தெரிந்து கொள்ள வேண்டும்?`
          : getStoredLanguage() === 'hi'
          ? `नमस्ते! ${localStorage.getItem('weathergpt_city') || 'आपके क्षेत्र'} के मौसम के बारे में क्या जानना चाहते हैं?`
          : `Hello! How can I help you with the weather in ${localStorage.getItem('weathergpt_city') || 'your area'} today?`,
      timestamp: 'Now',
      action_tip: 'Ask in English, Tanglish, Hinglish, or 13 Indian languages.',
    },
  ]);

  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    unit_temp: 'celsius',
    unit_wind: 'kmh',
    unit_pressure: 'hPa',
    unit_precip: 'mm',
    unit_distance: 'km',
    theme: localStorage.getItem('weathergpt_theme') || 'system',
    notif_severe: true,
    notif_daily_digest: true,
    notif_realtime_precip: true,
    notif_status_bar: true,
    location_permission: true,
  });

  // --- High-Speed Multi-Tier Live Location Resolver ---
  const detectLiveLocation = async () => {
    let resolved = false;

    try {
      const ipRes = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
      const ipData = await ipRes.json();
      if (ipData && (ipData.city || ipData.locality || ipData.principalSubdivision)) {
        const detectedCity = ipData.city || ipData.locality || ipData.principalSubdivision;
        const detectedLat = ipData.latitude || 13.0827;
        const detectedLon = ipData.longitude || 80.2707;
        
        setCity(detectedCity);
        setLat(detectedLat);
        setLon(detectedLon);
        localStorage.setItem('weathergpt_city', detectedCity);
        localStorage.setItem('weathergpt_lat', String(detectedLat));
        localStorage.setItem('weathergpt_lon', String(detectedLon));
        loadAllWeatherData(detectedLat, detectedLon, detectedCity);
        resolved = true;
      }
    } catch (e) {
      console.log('IP location fallback check:', e);
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const userLat = pos.coords.latitude;
          const userLon = pos.coords.longitude;
          setLat(userLat);
          setLon(userLon);
          localStorage.setItem('weathergpt_lat', String(userLat));
          localStorage.setItem('weathergpt_lon', String(userLon));

          try {
            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${userLat}&longitude=${userLon}&localityLanguage=en`);
            const geoData = await geoRes.json();
            const detectedName = geoData.city || geoData.locality || geoData.principalSubdivision || 'My Area';
            setCity(detectedName);
            localStorage.setItem('weathergpt_city', detectedName);
            loadAllWeatherData(userLat, userLon, detectedName);
          } catch {
            const fallbackCity = 'My Area';
            setCity(fallbackCity);
            localStorage.setItem('weathergpt_city', fallbackCity);
            loadAllWeatherData(userLat, userLon, fallbackCity);
          }
        },
        (err) => {
          if (!resolved) {
            console.log('GPS skipped:', err.message);
            if (city === 'Detecting Location...') {
              setCity('Chennai');
              setLat(13.0827);
              setLon(80.2707);
              loadAllWeatherData(13.0827, 80.2707, 'Chennai');
            }
          }
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else if (!resolved) {
      setCity('Chennai');
      setLat(13.0827);
      setLon(80.2707);
      loadAllWeatherData(13.0827, 80.2707, 'Chennai');
    }
  };

  useEffect(() => {
    detectLiveLocation();
  }, []);

  // --- Dynamic Theme Manager (System / Light / Dark) ---
  useEffect(() => {
    const applyTheme = () => {
      const selectedTheme = settings.theme || 'system';
      const root = document.documentElement;

      if (selectedTheme === 'dark') {
        root.classList.add('dark');
        document.body.className = 'bg-slate-950 text-slate-100 antialiased min-h-screen';
      } else if (selectedTheme === 'light') {
        root.classList.remove('dark');
        document.body.className = 'bg-slate-50 text-slate-900 antialiased min-h-screen';
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
          document.body.className = 'bg-slate-950 text-slate-100 antialiased min-h-screen';
        } else {
          root.classList.remove('dark');
          document.body.className = 'bg-slate-50 text-slate-900 antialiased min-h-screen';
        }
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if ((settings.theme || 'system') === 'system') {
        applyTheme();
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [settings.theme]);

  useEffect(() => {
    if (onboarded && lat && lon) {
      loadAllWeatherData(lat, lon, city);
      loadUserSettings();
    }
  }, [onboarded]);

  const loadAllWeatherData = async (latitude: number, longitude: number, cityName: string) => {
    try {
      const [currentRes, forecastRes, alertsRes] = await Promise.allSettled([
        api.getCurrentWeather(latitude, longitude, cityName),
        api.getForecast(latitude, longitude, 7),
        api.getActiveAlerts(latitude, longitude),
      ]);

      if (currentRes.status === 'fulfilled') {
        setWeather({ ...currentRes.value, city: cityName });
      }
      if (forecastRes.status === 'fulfilled') {
        setForecast(forecastRes.value);
      }
      if (alertsRes.status === 'fulfilled') {
        setAlerts(alertsRes.value.alerts || []);
      }
    } catch (e) {
      console.error('Error fetching weather data:', e);
    }
  };

  const loadUserSettings = async () => {
    try {
      const s = await api.getSettings();
      if (s) {
        setSettings((prev) => ({ ...prev, ...s }));
        if (s.theme) {
          localStorage.setItem('weathergpt_theme', s.theme);
        }
      }
    } catch (e) {
      console.error('Error loading settings:', e);
    }
  };

  const handleSelectCity = (newCity: string, newLat: number, newLon: number) => {
    setCity(newCity);
    setLat(newLat);
    setLon(newLon);
    localStorage.setItem('weathergpt_city', newCity);
    localStorage.setItem('weathergpt_lat', String(newLat));
    localStorage.setItem('weathergpt_lon', String(newLon));
    loadAllWeatherData(newLat, newLon, newCity);
  };

  const handleUpdateLanguage = (newLang: string) => {
    setLanguage(newLang);
    setStoredLanguage(newLang);
  };

  const handleUpdateProfession = (newProf: string) => {
    setProfession(newProf);
    setStoredProfession(newProf);
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    if (newSettings.theme) {
      localStorage.setItem('weathergpt_theme', newSettings.theme);
    }
  };

  const handleResetOnboarding = () => {
    setOnboardingCompleted(false);
    setOnboarded(false);
    setActiveTab('home');
  };

  const handleExecuteScenario = (scenario: DemoScenario) => {
    if (scenario.lang) {
      handleUpdateLanguage(scenario.lang);
    }
    if (scenario.profession) {
      handleUpdateProfession(scenario.profession);
    }
    setActiveTab('chat');
    setDemoQueryToExecute(scenario.query);
  };

  if (!onboarded) {
    return (
      <OnboardingScreen
        onComplete={() => {
          setOnboarded(true);
          setLanguage(getStoredLanguage());
          setProfession(getStoredProfession());
          detectLiveLocation();
        }}
      />
    );
  }

  const hasSevereAlerts = alerts.some((a) => a.severity === 'warning' || a.severity === 'watch');

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 selection:bg-sky-500 selection:text-white relative">
      {/* Centralized Atmosphere System */}
      {weather && (
        <WeatherBackground
          conditionCode={weather.condition_code}
          isDay={weather.is_day}
          temperature={weather.temperature}
          lat={lat}
          lon={lon}
          updatedAt={weather.updated_at}
        />
      )}

      {/* Main Viewport */}
      <main className="flex-1 relative z-10">
        {/* 1. Home Tab */}
        {activeTab === 'home' && (
          <HomeScreen
            currentCity={city}
            currentLat={lat}
            currentLon={lon}
            profession={profession}
            language={language}
            weather={weather}
            forecast={forecast}
            alerts={alerts}
            settings={settings}
            messages={messages}
            onUpdateMessages={setMessages}
            onSelectCity={handleSelectCity}
            onTriggerGPS={detectLiveLocation}
            onNavigateToDisaster={() => setActiveTab('disaster')}
          />
        )}

        {/* 2. WeatherGPT Dedicated Chat Tab */}
        {activeTab === 'chat' && (
          <div className="min-h-screen p-4 max-w-md mx-auto pb-24 animate-in fade-in">
            <div className="pt-2 pb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-sky-500 text-white shadow-xs">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    WeatherGPT Assistant
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Conversational intelligence for {city}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <VoiceChatBar
                currentLat={lat}
                currentLon={lon}
                currentCity={city}
                profession={profession}
                language={language}
                externalQuery={demoQueryToExecute}
                onClearExternalQuery={() => setDemoQueryToExecute(undefined)}
                onLocationResolved={handleSelectCity}
                messages={messages}
                onUpdateMessages={setMessages}
              />

              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Suggested Questions
                </span>
                <DecisionChips
                  onSelectQuery={(q) => setDemoQueryToExecute(q)}
                  profession={profession}
                  lang={language}
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. Dedicated Forecast Tab */}
        {activeTab === 'forecast' && (
          <div className="min-h-screen p-4 max-w-md mx-auto pb-24 animate-in fade-in">
            <div className="pt-2 pb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-sky-500 text-white shadow-xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    7-Day Forecast
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Multi-model NWP atmospheric ensemble for {city}
                  </p>
                </div>
              </div>
            </div>

            {forecast ? (
              <ForecastStrip
                daily={forecast.daily}
                unitTemp={settings.unit_temp}
                language={language}
              />
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">
                Loading forecast telemetry...
              </div>
            )}
          </div>
        )}

        {/* 4. Dedicated Full-Bleed Map Tab */}
        {activeTab === 'map' && (
          <div className="min-h-screen max-w-md mx-auto pb-24 animate-in fade-in">
            <MapRadarPreview
              lat={lat}
              lon={lon}
              city={city}
              language={language}
            />
          </div>
        )}

        {/* 5. More Services Hub Tab */}
        {activeTab === 'more' && (
          <MoreScreen
            onNavigate={(subTab) => setActiveTab(subTab)}
            hasActiveAlerts={hasSevereAlerts}
            language={language}
          />
        )}

        {/* Sub-Screens with Clean Back Buttons */}
        {activeTab === 'disaster' && (
          <div>
            <div className="p-4 pb-0 max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('more')}
                className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-sky-600 dark:text-slate-400 mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to More Services</span>
              </button>
            </div>
            <DisasterScreen
              currentLat={lat}
              currentLon={lon}
              currentCity={city}
              language={language}
            />
          </div>
        )}

        {activeTab === 'profession' && (
          <div>
            <div className="p-4 pb-0 max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('more')}
                className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-sky-600 dark:text-slate-400 mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to More Services</span>
              </button>
            </div>
            <ProfessionScreen
              currentProfession={profession}
              currentLat={lat}
              currentLon={lon}
              currentCity={city}
              language={language}
              onUpdateProfession={handleUpdateProfession}
            />
          </div>
        )}

        {activeTab === 'research' && (
          <div>
            <div className="p-4 pb-0 max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('more')}
                className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-sky-600 dark:text-slate-400 mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to More Services</span>
              </button>
            </div>
            <ResearchScreen
              currentLat={lat}
              currentLon={lon}
              currentCity={city}
              language={language}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <div className="p-4 pb-0 max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('more')}
                className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-sky-600 dark:text-slate-400 mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to More Services</span>
              </button>
            </div>
            <SettingsScreen
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              currentLanguage={language}
              onUpdateLanguage={handleUpdateLanguage}
              currentProfession={profession}
              onUpdateProfession={handleUpdateProfession}
              onResetOnboarding={handleResetOnboarding}
              onOpenJudgeDemo={() => setIsJudgeDemoOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Persistent 5-Tab Bottom Navigator */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasActiveAlerts={hasSevereAlerts}
        language={language}
      />

      {/* Hidden Developer/Judge Modal (Triggered only when developer mode unlocked) */}
      <JudgeDemoModal
        isOpen={isJudgeDemoOpen}
        onClose={() => setIsJudgeDemoOpen(false)}
        onExecuteScenario={handleExecuteScenario}
      />
    </div>
  );
};
