import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Maximize2,
  X,
  CloudRain,
  Wind,
  Thermometer,
  CloudLightning,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  MapPin,
  Compass,
  ArrowLeft,
  Info
} from 'lucide-react';
import { getTranslation } from '../i18n/translations';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapRadarPreviewProps {
  lat: number;
  lon: number;
  city: string;
  language?: string;
}

// Major Regional Observation Hubs across India
const REGIONAL_HUBS = [
  { name: 'Chennai', lat: 13.0827, lon: 80.2707, temp: 34, cond: 'Partly Cloudy', rain: 0 },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, temp: 28, cond: 'Pleasant', rain: 0 },
  { name: 'Coimbatore', lat: 11.0168, lon: 76.9558, temp: 31, cond: 'Breezy', rain: 0 },
  { name: 'Madurai', lat: 9.9252, lon: 78.1198, temp: 36, cond: 'Sunny', rain: 0 },
  { name: 'Kochi', lat: 9.9312, lon: 76.2673, temp: 30, cond: 'Light Rain', rain: 2.5 },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, temp: 32, cond: 'Clear', rain: 0 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777, temp: 31, cond: 'Humid', rain: 0.8 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567, temp: 29, cond: 'Partly Cloudy', rain: 0 },
  { name: 'New Delhi', lat: 28.6139, lon: 77.2090, temp: 36, cond: 'Overcast', rain: 0 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639, temp: 33, cond: 'Scattered Rain', rain: 1.2 },
  { name: 'Visakhapatnam', lat: 17.6868, lon: 83.2185, temp: 32, cond: 'Coastal Wind', rain: 0 },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873, temp: 37, cond: 'Clear', rain: 0 },
];

export const MapRadarPreview: React.FC<MapRadarPreviewProps> = ({
  lat,
  lon,
  city,
  language = 'en',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'rainfall' | 'infrared' | 'thermal' | 'wind'>('rainfall');
  const [radarTimestamps, setRadarTimestamps] = useState<{ time: number; path: string }[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Map refs
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewMapRef = useRef<L.Map | null>(null);
  const previewMarkerRef = useRef<L.Marker | null>(null);
  const previewOverlayRef = useRef<L.TileLayer | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewAnimRef = useRef<number | null>(null);
  const previewHubsGroupRef = useRef<L.LayerGroup | null>(null);

  const modalContainerRef = useRef<HTMLDivElement>(null);
  const modalMapRef = useRef<L.Map | null>(null);
  const modalMarkerRef = useRef<L.Marker | null>(null);
  const modalOverlayRef = useRef<L.TileLayer | null>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const modalAnimRef = useRef<number | null>(null);
  const modalHubsGroupRef = useRef<L.LayerGroup | null>(null);

  // Fetch real-time precipitation frames from RainViewer API
  useEffect(() => {
    const fetchRadarFrames = async () => {
      try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        const data = await res.json();
        const pastFrames = data?.radar?.past || [];
        if (pastFrames.length > 0) {
          setRadarTimestamps(pastFrames);
          setCurrentFrameIndex(pastFrames.length - 1);
        }
      } catch (err) {
        console.error('Precipitation timestamp fetch:', err);
      }
    };
    fetchRadarFrames();
  }, []);

  const createCustomIcon = (cityName: string) => {
    return L.divIcon({
      className: 'custom-weather-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <div style="position: relative;">
            <div style="width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #0284c7, #06b6d4); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(2,132,199,0.8); border: 2.5px solid #ffffff;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div style="position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid #0284c7;"></div>
          </div>
          <div style="margin-top: 3px; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(4px); color: #ffffff; padding: 2px 7px; border-radius: 6px; font-size: 11px; font-weight: bold; border: 1px solid rgba(255,255,255,0.2); white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
            ${cityName}
          </div>
        </div>
      `,
      iconSize: [34, 42],
      iconAnchor: [17, 42],
    });
  };

  const createHubIcon = (hub: typeof REGIONAL_HUBS[0]) => {
    return L.divIcon({
      className: 'custom-hub-pin',
      html: `
        <div style="transform: translate(-50%, -50%); cursor: pointer; text-align: center;">
          <div style="background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.25); border-radius: 8px; padding: 2px 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 3px;">
            <div style="width: 6px; height: 6px; border-radius: 50%; background: ${hub.rain > 0 ? '#38bdf8' : '#fbbf24'};"></div>
            <span style="color: #ffffff; font-size: 9px; font-weight: 800; line-height: 1;">${hub.temp}°</span>
          </div>
          <div style="color: rgba(255,255,255,0.8); font-size: 8px; font-weight: 600; text-shadow: 0 1px 2px #000; margin-top: 1px;">${hub.name}</div>
        </div>
      `,
      iconSize: [40, 24],
      iconAnchor: [20, 12],
    });
  };

  // Synchronize dynamic Map location & hubs
  useEffect(() => {
    const updateMapCenter = (map: L.Map | null, markerRef: React.MutableRefObject<L.Marker | null>, hubsGroupRef: React.MutableRefObject<L.LayerGroup | null>) => {
      if (!map) return;
      map.setView([lat, lon], map.getZoom() || 8);
      
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lon]);
        markerRef.current.setIcon(createCustomIcon(city));
      } else {
        const marker = L.marker([lat, lon], {
          icon: createCustomIcon(city),
          zIndexOffset: 1000
        }).addTo(map);
        markerRef.current = marker;
      }

      if (!hubsGroupRef.current) {
        const group = L.layerGroup().addTo(map);
        hubsGroupRef.current = group;
        REGIONAL_HUBS.forEach((hub) => {
          if (hub.name.toLowerCase() !== city.toLowerCase()) {
            L.marker([hub.lat, hub.lon], { icon: createHubIcon(hub) })
              .bindPopup(`<b>${hub.name}</b><br/>${hub.temp}°C • ${hub.cond}`)
              .addTo(group);
          }
        });
      }
    };

    updateMapCenter(previewMapRef.current, previewMarkerRef, previewHubsGroupRef);
    if (isModalOpen) {
      updateMapCenter(modalMapRef.current, modalMarkerRef, modalHubsGroupRef);
    }
  }, [lat, lon, city, isModalOpen]);

  // Initialize Embedded Map
  useEffect(() => {
    if (!previewContainerRef.current || previewMapRef.current) return;

    const map = L.map(previewContainerRef.current, {
      center: [lat, lon],
      zoom: 8,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    const marker = L.marker([lat, lon], {
      icon: createCustomIcon(city),
      zIndexOffset: 1000
    }).addTo(map);
    previewMarkerRef.current = marker;

    const group = L.layerGroup().addTo(map);
    previewHubsGroupRef.current = group;
    REGIONAL_HUBS.forEach((hub) => {
      if (hub.name.toLowerCase() !== city.toLowerCase()) {
        L.marker([hub.lat, hub.lon], { icon: createHubIcon(hub) })
          .bindPopup(`<b>${hub.name}</b><br/>${hub.temp}°C • ${hub.cond}`)
          .addTo(group);
      }
    });

    previewMapRef.current = map;

    return () => {
      map.remove();
      previewMapRef.current = null;
    };
  }, []);

  // Initialize Fullscreen Modal Map
  useEffect(() => {
    if (!isModalOpen || !modalContainerRef.current || modalMapRef.current) return;

    const timer = setTimeout(() => {
      if (!modalContainerRef.current) return;
      const map = L.map(modalContainerRef.current, {
        center: [lat, lon],
        zoom: 9,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      const marker = L.marker([lat, lon], {
        icon: createCustomIcon(city),
        zIndexOffset: 1000
      }).addTo(map);
      modalMarkerRef.current = marker;

      const group = L.layerGroup().addTo(map);
      modalHubsGroupRef.current = group;
      REGIONAL_HUBS.forEach((hub) => {
        if (hub.name.toLowerCase() !== city.toLowerCase()) {
          L.marker([hub.lat, hub.lon], { icon: createHubIcon(hub) })
            .bindPopup(`<b>${hub.name}</b><br/>${hub.temp}°C • ${hub.cond}`)
            .addTo(group);
        }
      });

      modalMapRef.current = map;
      updateLayerTiles(map, modalOverlayRef, modalCanvasRef, modalAnimRef);
    }, 150);

    return () => {
      clearTimeout(timer);
      if (modalMapRef.current) {
        modalMapRef.current.remove();
        modalMapRef.current = null;
      }
    };
  }, [isModalOpen]);

  // Sync active layer overlay
  useEffect(() => {
    if (previewMapRef.current) {
      updateLayerTiles(previewMapRef.current, previewOverlayRef, previewCanvasRef, previewAnimRef);
    }
    if (modalMapRef.current && isModalOpen) {
      updateLayerTiles(modalMapRef.current, modalOverlayRef, modalCanvasRef, modalAnimRef);
    }
  }, [activeLayer, radarTimestamps, currentFrameIndex, isModalOpen]);

  const updateLayerTiles = (
    map: L.Map,
    overlayRef: React.MutableRefObject<L.TileLayer | null>,
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
    animRef: React.MutableRefObject<number | null>
  ) => {
    if (overlayRef.current) {
      map.removeLayer(overlayRef.current);
      overlayRef.current = null;
    }
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    const latestFrame = radarTimestamps[currentFrameIndex] || radarTimestamps[radarTimestamps.length - 1];

    if (activeLayer === 'rainfall') {
      if (latestFrame) {
        const radarTileUrl = `https://tilecache.rainviewer.com${latestFrame.path}/256/{z}/{x}/{y}/2/1_1.png`;
        const layer = L.tileLayer(radarTileUrl, { opacity: 0.85 }).addTo(map);
        overlayRef.current = layer;
      }
    } else if (activeLayer === 'infrared') {
      if (latestFrame) {
        const irTileUrl = `https://tilecache.rainviewer.com${latestFrame.path}/256/{z}/{x}/{y}/4/1_1.png`;
        const layer = L.tileLayer(irTileUrl, { opacity: 0.9 }).addTo(map);
        overlayRef.current = layer;
      }
    } else if (activeLayer === 'thermal') {
      const thermalTileUrl = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Land_Surface_Temp_Day/default/2024-05-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png';
      const layer = L.tileLayer(thermalTileUrl, { opacity: 0.75, maxZoom: 9 }).addTo(map);
      overlayRef.current = layer;
    } else if (activeLayer === 'wind') {
      startWindAnimation(canvasRef, animRef);
    }
  };

  const startWindAnimation = (
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
    animRef: React.MutableRefObject<number | null>
  ) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = canvas.parentElement?.clientHeight || 300;

    const particles: any[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: Math.random() * 2 + 1,
      vy: Math.random() * 1 - 0.5,
      life: Math.random() * 100
    }));

    const animate = () => {
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#0284c7';
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life < 0) { p.x = 0; p.life = 100; }
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + 5, p.y + 2); ctx.stroke();
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  useEffect(() => {
    let interval: any = null;
    if (isPlaying && radarTimestamps.length > 0 && (activeLayer === 'rainfall' || activeLayer === 'infrared')) {
      interval = setInterval(() => {
        setCurrentFrameIndex((prev) => (prev + 1) % radarTimestamps.length);
      }, 750);
    }
    return () => clearInterval(interval);
  }, [isPlaying, radarTimestamps, activeLayer]);

  const handleZoom = (delta: number, isModal: boolean) => {
    const map = isModal ? modalMapRef.current : previewMapRef.current;
    if (map) {
      if (delta > 0) map.zoomIn();
      else map.zoomOut();
    }
  };

  const formatFrameTime = (timestamp?: number) => {
    if (!timestamp) return 'Live Map';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="px-4 pt-4 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Live Precipitation Map & Satellite Overlay
          </h3>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatFrameTime(radarTimestamps[currentFrameIndex]?.time)}
          </span>
        </div>
      </div>

      {/* --- Inline Preview Card --- */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl h-64 w-full bg-slate-100 dark:bg-slate-900 z-10">
        {/* Layer Selector */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl">
          <button
            onClick={() => setActiveLayer('rainfall')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all ${
              activeLayer === 'rainfall' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Rainfall Map</span>
          </button>

          <button
            onClick={() => setActiveLayer('infrared')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all ${
              activeLayer === 'infrared' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <CloudLightning className="w-3.5 h-3.5" />
            <span>Cyclone/IR</span>
          </button>

          <button
            onClick={() => setActiveLayer('thermal')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all ${
              activeLayer === 'thermal' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Thermal Heatmap</span>
          </button>

          <button
            onClick={() => setActiveLayer('wind')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all ${
              activeLayer === 'wind' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind Flow</span>
          </button>
        </div>

        {/* Expand & Zoom Buttons */}
        <div className="absolute top-3 right-3 z-10 flex flex-col space-y-1.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-sky-500 hover:text-white transition-all shadow-md"
            title="Open Fullscreen Interactive Panel"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleZoom(1, false)}
            className="p-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-all shadow-md"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleZoom(-1, false)}
            className="p-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-all shadow-md"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Leaflet Map Preview Container */}
        <div ref={previewContainerRef} className="w-full h-full relative z-0" />

        {/* Transparent Wind Canvas overlay */}
        {activeLayer === 'wind' && (
          <canvas ref={previewCanvasRef} className="absolute inset-0 z-10 pointer-events-none w-full h-full" />
        )}

        {/* Legend strip */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] shadow-lg">
          {activeLayer === 'rainfall' && (
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">Precipitation Layer:</span>
              <div className="flex items-center space-x-1">
                <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">0-10mm (Light)</span>
                <span className="px-1.5 py-0.5 rounded bg-sky-500 text-white font-bold">10-25mm</span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-700 text-white font-bold">&gt;50mm (Heavy)</span>
              </div>
            </div>
          )}

          {activeLayer === 'infrared' && (
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">IR Cloud Tops:</span>
              <div className="flex items-center space-x-1">
                <span className="px-1.5 py-0.5 rounded bg-cyan-400 text-slate-900 font-bold">Rainband</span>
                <span className="px-1.5 py-0.5 rounded bg-yellow-400 text-slate-900 font-bold">Intense</span>
                <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold">Deep Convection</span>
              </div>
            </div>
          )}

          {activeLayer === 'thermal' && (
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-200">Surface Heat (NASA GIBS):</span>
              <span className="px-2 py-0.5 rounded bg-gradient-to-r from-yellow-400 via-orange-500 to-rose-600 text-white font-bold">
                22°C — 46°C
              </span>
            </div>
          )}

          {activeLayer === 'wind' && (
            <div className="flex items-center space-x-1.5 font-bold text-sky-600">
              <Wind className="w-3.5 h-3.5 animate-pulse" />
              <span>South-Westerly Streamlines: 10 - 45 km/h</span>
            </div>
          )}
        </div>
      </div>

      {/* --- ENLARGED FULLSCREEN EXPANDED MODAL PANEL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex flex-col p-2 md:p-6 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex-1 flex flex-col overflow-hidden relative">
            {/* Modal Top Bar */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-sky-500 hover:text-white transition-colors"
                  title="Return to Dashboard"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-sm md:text-base font-black text-slate-900 dark:text-white">
                    {activeLayer === 'rainfall'
                      ? 'Monsoon Rainfall & Precipitation Overlay'
                      : activeLayer === 'infrared'
                      ? 'Severe Cyclone & Storm Infrared Satellite'
                      : activeLayer === 'thermal'
                      ? 'Indian Peninsula Surface Temperature Heatmap'
                      : 'Atmospheric Wind Streamlines & Monsoon Pathway'}
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    Live Telemetry for {city} & Surrounding Districts (RainViewer Mosaic & NASA GIBS)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSetIndiaView(true)}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 hover:bg-sky-100 text-xs font-bold border border-sky-200 dark:border-slate-700 flex items-center space-x-1.5 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>All-India View</span>
                </button>

                <button
                  onClick={() => handleResetCity(true)}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 hover:bg-sky-100 text-xs font-bold border border-sky-200 dark:border-slate-700 flex items-center space-x-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-500" />
                  <span>{city} View</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-rose-500 hover:text-white transition-colors"
                  title="Close Map Panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Controls Toolbar */}
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
              {/* Layer Selection */}
              <div className="flex space-x-1.5">
                <button
                  onClick={() => setActiveLayer('rainfall')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    activeLayer === 'rainfall'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-50'
                  }`}
                >
                  <CloudRain className="w-4 h-4" />
                  <span>Rainfall Precipitation Map</span>
                </button>

                <button
                  onClick={() => setActiveLayer('infrared')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    activeLayer === 'infrared'
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50'
                  }`}
                >
                  <CloudLightning className="w-4 h-4" />
                  <span>Cyclone / IR Satellite</span>
                </button>

                <button
                  onClick={() => setActiveLayer('thermal')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    activeLayer === 'thermal'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50'
                  }`}
                >
                  <Thermometer className="w-4 h-4" />
                  <span>Surface Thermal</span>
                </button>

                <button
                  onClick={() => setActiveLayer('wind')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    activeLayer === 'wind'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50'
                  }`}
                >
                  <Wind className="w-4 h-4" />
                  <span>Wind Streamlines</span>
                </button>
              </div>

              {/* Playback Controls */}
              {(activeLayer === 'rainfall' || activeLayer === 'infrared') && radarTimestamps.length > 0 && (
                <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-all"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Sweep Time: {formatFrameTime(radarTimestamps[currentFrameIndex]?.time)}
                  </span>
                </div>
              )}
            </div>

            {/* Modal Leaflet Canvas */}
            <div className="flex-1 relative w-full h-full bg-slate-100 dark:bg-slate-950">
              <div ref={modalContainerRef} className="w-full h-full relative z-0" />

              {activeLayer === 'wind' && (
                <canvas ref={modalCanvasRef} className="absolute inset-0 z-10 pointer-events-none w-full h-full" />
              )}

              {/* Floating Zoom controls inside modal */}
              <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
                <button
                  onClick={() => handleZoom(1, true)}
                  className="p-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-sky-500 hover:text-white shadow-xl transition-all"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleZoom(-1, true)}
                  className="p-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-sky-500 hover:text-white shadow-xl transition-all"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
              </div>

              {/* Rich Legend Box inside Modal with explicit Provider Attribution */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
                {activeLayer === 'rainfall' && (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                      <span>Monsoon Rainfall Intensity Scale (mm/hr):</span>
                      <span className="text-sky-600 dark:text-sky-400">RainViewer Satellite/Radar Mosaic</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-black">
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">0 mm (No Rain)</div>
                      <div className="p-1.5 rounded-lg bg-sky-200 text-sky-900">0.1 - 10 mm (Light)</div>
                      <div className="p-1.5 rounded-lg bg-sky-500 text-white">10 - 25 mm (Moderate)</div>
                      <div className="p-1.5 rounded-lg bg-indigo-700 text-white">&gt; 50 mm (Heavy Storm)</div>
                    </div>
                  </div>
                )}

                {activeLayer === 'infrared' && (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                      <span>Cloud Top Brightness Temperature (Infrared Spectrum):</span>
                      <span className="text-rose-600 dark:text-rose-400">RainViewer Convective Overlay</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-black">
                      <div className="p-1.5 rounded-lg bg-blue-900 text-white">Warm Cirrus</div>
                      <div className="p-1.5 rounded-lg bg-cyan-400 text-slate-900">Moderate Cloud</div>
                      <div className="p-1.5 rounded-lg bg-emerald-500 text-white">Thunderhead</div>
                      <div className="p-1.5 rounded-lg bg-yellow-400 text-slate-900">Deep Convective</div>
                      <div className="p-1.5 rounded-lg bg-rose-600 text-white">Severe Convective Core</div>
                    </div>
                  </div>
                )}

                {activeLayer === 'thermal' && (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                      <span>Indian Subcontinent Land Surface Temperature (MODIS Sensor):</span>
                      <span className="text-amber-600 dark:text-amber-400">NASA GIBS Satellite Feed</span>
                    </div>
                    <div className="w-full h-4 rounded-lg bg-gradient-to-r from-blue-500 via-yellow-400 via-orange-500 to-rose-700" />
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 px-1">
                      <span>15°C (Himalayan Freezing Level)</span>
                      <span>28°C (Pleasant)</span>
                      <span>38°C (Hot)</span>
                      <span>46°C+ (Severe Heatwave)</span>
                    </div>
                  </div>
                )}

                {activeLayer === 'wind' && (
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center space-x-2">
                      <Wind className="w-4 h-4 text-sky-500" />
                      <span>Monsoon Flow: Arabian Sea & Bay of Bengal Streamlines</span>
                    </div>
                    <span className="text-sky-600 dark:text-sky-400">Open-Meteo Wind Vector: 15 — 48 km/h</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
