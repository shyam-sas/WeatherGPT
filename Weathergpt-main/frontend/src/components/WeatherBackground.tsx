import React, { useMemo, useState, useEffect } from 'react';

interface WeatherBackgroundProps {
  conditionCode: number;
  isDay: number;
  temperature?: number;
  lat?: number;
  lon?: number;
  updatedAt?: string;
}

// Realistic curated photography assets optimized for high performance & instant caching
const WEATHER_BACKGROUNDS: Record<string, string> = {
  // 1. Dawn / Early Morning (05:00 - 07:00)
  'dawn-clear': 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1400&q=80',
  'dawn-cloudy': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80',
  'dawn-rain': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1400&q=80',

  // 2. Morning (07:00 - 11:00)
  'morning-clear': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1400&q=80',
  'morning-cloudy': 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=1400&q=80',
  'morning-rain': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1400&q=80',

  // 3. Afternoon (11:00 - 16:00)
  'afternoon-clear': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
  'afternoon-cloudy': 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?auto=format&fit=crop&w=1400&q=80',
  'afternoon-heat': 'https://images.unsplash.com/photo-1504370805625-d32c54b16100?auto=format&fit=crop&w=1400&q=80',
  'afternoon-rain': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1400&q=80',

  // 4. Evening / Golden Hour (16:00 - 18:30)
  'evening-clear': 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1400&q=80',
  'evening-cloudy': 'https://images.unsplash.com/photo-1517483047-0902c79d2664?auto=format&fit=crop&w=1400&q=80',
  'evening-rain': 'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=1400&q=80',

  // 5. Sunset (18:30 - 19:30)
  'sunset-clear': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
  'sunset-cloudy': 'https://images.unsplash.com/photo-1509803874385-db7c23652552?auto=format&fit=crop&w=1400&q=80',
  'sunset-rain': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1400&q=80',

  // 6. Night (19:30 - 05:00)
  'night-clear': 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1400&q=80',
  'night-cloudy': 'https://images.unsplash.com/photo-1514897575457-c4db467cf78e?auto=format&fit=crop&w=1400&q=80',
  'night-rain': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1400&q=80',

  // 7. Special Severe Conditions
  'storm': 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=1400&q=80',
  'fog': 'https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=1400&q=80',
};

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
  conditionCode,
  temperature = 28,
  lat = 13.0827,
  lon = 80.2707,
  updatedAt,
}) => {
  const [activeImage, setActiveImage] = useState<string>('');
  const [prevImage, setPrevImage] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);

  // 1. Calculate local decimal hour for selected location
  const timePeriod = useMemo(() => {
    let localDecimalHour: number;

    if (updatedAt) {
      try {
        const d = new Date(updatedAt);
        localDecimalHour = d.getHours() + d.getMinutes() / 60;
      } catch {
        const now = new Date();
        const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
        const isIndia = lon >= 68 && lon <= 98 && lat >= 6 && lat <= 38;
        const offset = isIndia ? 5.5 : lon / 15;
        localDecimalHour = (utcHours + offset + 24) % 24;
      }
    } else {
      const now = new Date();
      const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
      const isIndia = lon >= 68 && lon <= 98 && lat >= 6 && lat <= 38;
      const offset = isIndia ? 5.5 : lon / 15;
      localDecimalHour = (utcHours + offset + 24) % 24;
    }

    if (localDecimalHour >= 5 && localDecimalHour < 7) return 'dawn';
    if (localDecimalHour >= 7 && localDecimalHour < 11) return 'morning';
    if (localDecimalHour >= 11 && localDecimalHour < 16) return 'afternoon';
    if (localDecimalHour >= 16 && localDecimalHour < 18.5) return 'evening';
    if (localDecimalHour >= 18.5 && localDecimalHour < 19.5) return 'sunset';
    return 'night';
  }, [lat, lon, updatedAt]);

  // 2. Determine exact atmosphere key based on Time + Weather
  const atmosphereKey = useMemo(() => {
    const isStorm = [95, 96, 99].includes(conditionCode);
    const isRain = [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(conditionCode);
    const isFog = [45, 48].includes(conditionCode);
    const isHeat = temperature >= 38;
    const isCloudy = [2, 3].includes(conditionCode);

    if (isStorm) return 'storm';
    if (isFog) return 'fog';

    if (timePeriod === 'dawn') {
      if (isRain) return 'dawn-rain';
      if (isCloudy) return 'dawn-cloudy';
      return 'dawn-clear';
    }

    if (timePeriod === 'morning') {
      if (isRain) return 'morning-rain';
      if (isCloudy) return 'morning-cloudy';
      return 'morning-clear';
    }

    if (timePeriod === 'afternoon') {
      if (isHeat) return 'afternoon-heat';
      if (isRain) return 'afternoon-rain';
      if (isCloudy) return 'afternoon-cloudy';
      return 'afternoon-clear';
    }

    if (timePeriod === 'evening') {
      if (isRain) return 'evening-rain';
      if (isCloudy) return 'evening-cloudy';
      return 'evening-clear';
    }

    if (timePeriod === 'sunset') {
      if (isRain) return 'sunset-rain';
      if (isCloudy) return 'sunset-cloudy';
      return 'sunset-clear';
    }

    // Night
    if (isRain) return 'night-rain';
    if (isCloudy) return 'night-cloudy';
    return 'night-clear';
  }, [timePeriod, conditionCode, temperature]);

  // 3. Double-buffered smooth image crossfade
  useEffect(() => {
    const targetUrl = WEATHER_BACKGROUNDS[atmosphereKey] || WEATHER_BACKGROUNDS['morning-clear'];
    if (targetUrl !== activeImage) {
      setPrevImage(activeImage);
      const img = new Image();
      img.src = targetUrl;
      img.onload = () => {
        setActiveImage(targetUrl);
        setImageLoaded(true);
      };
      img.onerror = () => {
        // Keep activeImage or use fallback gradient
        setActiveImage(targetUrl);
        setImageLoaded(false);
      };
    }
  }, [atmosphereKey]);

  const isNight = timePeriod === 'night';
  const isRainy = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(conditionCode);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Underlying Atmospheric CSS Gradient Fallback */}
      <div className={`absolute inset-0 atm-${atmosphereKey} transition-opacity duration-1000`} />

      {/* 2. Previous Photo Layer (Crossfade Buffer) */}
      {prevImage && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out opacity-0"
          style={{ backgroundImage: `url(${prevImage})` }}
        />
      )}

      {/* 3. Active Realistic Weather Photo Layer */}
      {activeImage && (
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            imageLoaded ? 'opacity-90 dark:opacity-75' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${activeImage})` }}
        />
      )}

      {/* 4. Rainy Environment: Subtle Animated Droplet Overlay */}
      {isRainy && (
        <div className="absolute inset-0 opacity-30">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 bg-gradient-to-b from-transparent via-cyan-200 to-sky-400 rounded-full animate-rain-drop"
              style={{
                height: `${35 + (i % 3) * 15}px`,
                left: `${10 + i * 11}%`,
                top: `${(i % 3) * -30}px`,
                animationDelay: `${(i * 0.25) % 1.5}s`,
                animationDuration: '1.2s'
              }}
            />
          ))}
        </div>
      )}

      {/* 5. Subtle Night Starfield Depth */}
      {isNight && (
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-12 right-20 w-1 h-1 bg-white rounded-full shadow-[0_0_4px_white]" />
          <div className="absolute top-32 left-1/4 w-1 h-1 bg-sky-200 rounded-full" />
          <div className="absolute top-20 left-2/3 w-1.5 h-1.5 bg-amber-100 rounded-full shadow-[0_0_6px_amber]" />
          <div className="absolute top-52 right-1/3 w-1 h-1 bg-white rounded-full" />
        </div>
      )}

      {/* 6. Subtle Adaptive Readability Wash (Preserves Vibrant Imagery while keeping Glass UI 100% Readable) */}
      <div className="absolute inset-0 bg-slate-900/15 dark:bg-slate-950/40 backdrop-blur-[0.5px]" />
    </div>
  );
};
