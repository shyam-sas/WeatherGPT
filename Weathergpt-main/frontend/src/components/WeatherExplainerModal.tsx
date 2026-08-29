import React, { useState } from 'react';
import { X, BookOpen, Atom, HelpCircle, Check, ArrowRight } from 'lucide-react';

export interface ExplainerItem {
  key: string;
  name: string;
  plain: string;
  technical: string;
  idealRange: string;
  iconText: string;
}

export const EXPLAINER_GLOSSARY: Record<string, ExplainerItem> = {
  humidity: {
    key: 'humidity',
    name: 'Relative Humidity',
    iconText: '💧',
    plain: 'How much water vapor is floating in the air compared to the maximum it could hold. Above 70%, sweat does not evaporate easily, making hot days feel much hotter.',
    technical: 'The ratio of actual vapor pressure to saturation vapor pressure at the current dry-bulb temperature, expressed as a percentage.',
    idealRange: '40% – 60% for human comfort; 60% – 80% for paddy crops.'
  },
  dew_point: {
    key: 'dew_point',
    name: 'Dew Point Temperature',
    iconText: '🌡️',
    plain: 'The exact temperature the air must cool down to before dew or fog forms on grass and surfaces.',
    technical: 'Temperature at which air reaches 100% relative humidity at constant barometric pressure.',
    idealRange: '10°C – 18°C (Comfortable); >22°C (Muggy/Tropical).'
  },
  uv_index: {
    key: 'uv_index',
    name: 'Ultraviolet (UV) Index',
    iconText: '☀️',
    plain: 'Measures sunburn risk from solar ultraviolet rays. Values above 6 mean you should wear sunglasses, a hat, and sunscreen.',
    technical: 'Erythemally weighted solar irradiance integrated across 290nm–400nm wavelengths under WHO/WMO standards.',
    idealRange: '0 – 2 (Low); 3 – 5 (Moderate); 6 – 7 (High); 8+ (Very High).'
  },
  pressure: {
    key: 'pressure',
    name: 'Surface Barometric Pressure',
    iconText: '⏲️',
    plain: 'The weight of the atmosphere above us. A sudden sharp drop usually warns of approaching storm clouds or cyclones.',
    technical: 'Atmospheric force per unit area adjusted to Mean Sea Level (MSL / QNH) in hectopascals (hPa).',
    idealRange: '1010 hPa – 1016 hPa at sea level.'
  },
  aqi: {
    key: 'aqi',
    name: 'Air Quality Index (AQI)',
    iconText: '🍃',
    plain: 'A standardized scale measuring pollution levels (PM2.5, smoke, dust). Under 50 is pure; over 150 is unhealthy for outdoor exercise.',
    technical: 'Composite pollution index calculated based on 24-hr rolling concentrations of PM2.5, PM10, NO2, and SO2 under CPCB India norms.',
    idealRange: '0 – 50 (Good); 51 – 100 (Satisfactory).'
  },
  visibility: {
    key: 'visibility',
    name: 'Horizontal Visibility',
    iconText: '👁️',
    plain: 'How far in kilometers you can clearly see ahead without fog, smog, or heavy downpours blocking your sight.',
    technical: 'Meteorological Optical Range (MOR) distance where light beam contrast drops to 5% of initial value.',
    idealRange: '>10 km (Clear VFR Aviation Safe).'
  },
  air_density: {
    key: 'air_density',
    name: 'Air Density (ρ)',
    iconText: '⚖️',
    plain: 'How closely packed air molecules are. Affects aircraft takeoff lift and wind turbine electricity generation.',
    technical: 'Atmospheric mass per unit volume computed via ideal gas equation ρ = P / (R_spec * T) in kg/m³.',
    idealRange: '1.18 – 1.25 kg/m³ at Indian surface altitudes.'
  }
};

interface WeatherExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTerm?: string;
}

export const WeatherExplainerModal: React.FC<WeatherExplainerModalProps> = ({
  isOpen,
  onClose,
  initialTerm = 'humidity'
}) => {
  const [selectedKey, setSelectedKey] = useState<string>(initialTerm);
  const [viewMode, setViewMode] = useState<'plain' | 'technical'>('plain');

  if (!isOpen) return null;

  const currentItem = EXPLAINER_GLOSSARY[selectedKey] || EXPLAINER_GLOSSARY['humidity'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shadow-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Atmospheric Meteorological Explainer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Understand weather metrics in plain language or scientific rigor
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Terms List Sidebar */}
          <div className="space-y-1.5 md:border-r md:border-slate-100 md:dark:border-slate-800 md:pr-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Parameter
            </div>
            {Object.values(EXPLAINER_GLOSSARY).map((item) => (
              <button
                key={item.key}
                onClick={() => setSelectedKey(item.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all ${
                  selectedKey === item.key
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{item.iconText}</span>
                <span className="truncate">{item.name}</span>
              </button>
            ))}
          </div>

          {/* Term Detailed View */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl mr-2">{currentItem.iconText}</span>
                <h3 className="inline text-lg font-bold text-slate-800 dark:text-slate-100">
                  {currentItem.name}
                </h3>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <button
                  onClick={() => setViewMode('plain')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    viewMode === 'plain'
                      ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  Plain Language
                </button>
                <button
                  onClick={() => setViewMode('technical')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    viewMode === 'technical'
                      ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  Technical
                </button>
              </div>
            </div>

            {/* Explanation Content Box */}
            <div className="p-4 rounded-xl bg-sky-50/50 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {viewMode === 'plain' ? (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400 mb-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>In Simple Terms:</span>
                  </div>
                  <p>{currentItem.plain}</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-1.5">
                    <Atom className="w-3.5 h-3.5" />
                    <span>Scientific Definition:</span>
                  </div>
                  <p className="font-mono text-xs leading-relaxed">{currentItem.technical}</p>
                </div>
              )}
            </div>

            {/* Optimal Range Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs">
              <div className="font-bold text-slate-500 dark:text-slate-400 mb-1">
                Optimal & Reference Range:
              </div>
              <div className="text-slate-800 dark:text-slate-200 font-semibold">
                {currentItem.idealRange}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-700 dark:hover:bg-white transition-all shadow-xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
