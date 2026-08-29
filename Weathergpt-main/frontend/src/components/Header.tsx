import React, { useState, useEffect } from 'react';
import { CloudSun, MapPin, ChevronDown, Navigation, Crosshair, Search, Loader2 } from 'lucide-react';
import { api } from '../api/client';

interface HeaderProps {
  currentCity: string;
  onSelectCity: (city: string, lat: number, lon: number) => void;
  onTriggerGPS?: () => void;
}

const POPULAR_CITIES = [
  { name: 'Pallavaram', lat: 12.9675, lon: 80.1491, state: 'Tamil Nadu' },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707, state: 'Tamil Nadu' },
  { name: 'New Delhi', lat: 28.6139, lon: 77.2090, state: 'Delhi' },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777, state: 'Maharashtra' },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, state: 'Karnataka' },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, state: 'Telangana' },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639, state: 'West Bengal' },
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, state: 'Gujarat' },
  { name: 'Kochi', lat: 9.9312, lon: 76.2673, state: 'Kerala' },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873, state: 'Rajasthan' },
  { name: 'Guwahati', lat: 26.1445, lon: 91.7362, state: 'Assam' },
  { name: 'New York', lat: 40.7128, lon: -74.0060, state: 'United States' },
  { name: 'London', lat: 51.5074, lon: -0.1278, state: 'United Kingdom' },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, state: 'Japan' },
];

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSelectCity,
  onTriggerGPS
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleGPSClick = () => {
    setIsLocating(true);
    setDropdownOpen(false);
    if (onTriggerGPS) {
      onTriggerGPS();
    }
    setTimeout(() => setIsLocating(false), 2000);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await api.searchLocation(searchQuery);
        setSearchResults(results || []);
      } catch (e) {
        console.error('Location search error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-30 px-4 py-3 bg-white/70 dark:bg-slate-900/75 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between transition-colors duration-200">
      {/* Brand Identity */}
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-sm">
          <CloudSun className="w-4 h-4" />
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="font-bold text-base tracking-tight text-slate-800 dark:text-slate-100">
            WeatherGPT
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Live Telemetry Active" />
        </div>
      </div>

      {/* Location Selector & GPS Auto-Detect */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={handleGPSClick}
          className={`p-2 rounded-full border transition-all ${
            isLocating
              ? 'bg-cyan-500 text-white border-cyan-500 animate-spin'
              : 'bg-white/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-cyan-600 hover:border-cyan-300'
          }`}
          title="Detect Current GPS Location"
          aria-label="Detect GPS Location"
        >
          <Crosshair className="w-3.5 h-3.5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-cyan-400 transition-all shadow-xs"
            aria-expanded={dropdownOpen}
          >
            <MapPin className="w-3 h-3 text-cyan-500 shrink-0" />
            <span className="max-w-[110px] sm:max-w-[150px] truncate">{currentCity}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                {/* Location Search Bar */}
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search any city or town..."
                    className="w-full pl-8 pr-7 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-cyan-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    autoFocus
                  />
                  {isSearching && (
                    <Loader2 className="w-3.5 h-3.5 text-cyan-500 animate-spin absolute right-2.5 top-2.5" />
                  )}
                </div>

                {/* Live GPS Action */}
                <button
                  onClick={handleGPSClick}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 flex items-center space-x-2 transition-colors mb-2 border border-cyan-200/70 dark:border-cyan-800/60"
                >
                  <Navigation className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                  <span>Use Live GPS Location</span>
                </button>

                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
                  {searchResults.length > 0 ? 'Search Results' : 'Popular Stations'}
                </div>

                <div className="max-h-56 overflow-y-auto space-y-0.5">
                  {(searchResults.length > 0 ? searchResults : POPULAR_CITIES).map((c: any) => (
                    <button
                      key={`${c.name}_${c.lat}_${c.lon}`}
                      onClick={() => {
                        onSelectCity(c.name, c.lat, c.lon);
                        setDropdownOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        currentCity === c.name
                          ? 'bg-cyan-500 text-white font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      <span className="text-[10px] opacity-70 ml-2 shrink-0">{c.admin1 || c.country || c.state}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
