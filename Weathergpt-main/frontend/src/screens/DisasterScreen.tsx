import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Clock,
  ShieldCheck,
  Flame,
  CloudLightning,
  Wind,
  AlertTriangle,
  Radio,
  FileText
} from 'lucide-react';
import { api } from '../api/client';
import { AlertItem } from '../types';
import { getTranslation } from '../i18n/translations';

interface DisasterScreenProps {
  currentLat: number;
  currentLon: number;
  currentCity: string;
  language?: string;
}

export const DisasterScreen: React.FC<DisasterScreenProps> = ({
  currentLat,
  currentLon,
  currentCity,
  language = 'en',
}) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [precautions, setPrecautions] = useState<{
    dos: string[];
    donts: string[];
    emergency_contacts: { label: string; number: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, [currentLat, currentLon, language]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.getActiveAlerts(currentLat, currentLon);
      setAlerts(res.alerts || []);
      if (res.alerts && res.alerts.length > 0) {
        setSelectedAlert(res.alerts[0]);
        loadPrecautions(res.alerts[0]);
      } else {
        loadGeneralPrecautions();
      }
    } catch (e) {
      console.error(e);
      loadGeneralPrecautions();
    } finally {
      setLoading(false);
    }
  };

  const loadPrecautions = async (alert: AlertItem) => {
    try {
      const p = await api.getAlertPrecautions(alert.id, alert.alert_type, alert.severity);
      setPrecautions(p);
    } catch (e) {
      console.error(e);
    }
  };

  const loadGeneralPrecautions = async () => {
    try {
      const p = await api.getAlertPrecautions('general', 'general', 'advisory');
      setPrecautions(p);
    } catch (e) {
      console.error(e);
    }
  };

  const formatTimeWindow = (fromStr: string, toStr: string) => {
    try {
      const f = new Date(fromStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const t = new Date(toStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${f} — ${t}`;
    } catch {
      return 'Next 12 Hours';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cyclone':
        return <Wind className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
      case 'heat':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'storm':
        return <CloudLightning className="w-5 h-5 text-yellow-500" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 max-w-md mx-auto pb-24 transition-colors duration-200">
      {/* Screen Header */}
      <div className="pt-2 pb-4">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {getTranslation(language, 'active_alerts')}
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Official IMD Warnings & WeatherGPT High-Resolution Derived Advisories for {currentCity}.
        </p>
      </div>

      {/* Official vs Derived Advisory Clarity Banner */}
      <div className="mb-4 p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
        <Radio className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed">
          <strong>Official vs Derived Intelligence:</strong> Official disaster warnings originate from IMD / NDMA. WeatherGPT Derived Advisories provide localized hyper-local guidance.
        </div>
      </div>

      {/* Active Alerts List */}
      <div className="space-y-3 mb-6">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          {getTranslation(language, 'bulletins')}
        </h3>

        {alerts.length > 0 ? (
          alerts.map((a) => {
            const isSelected = selectedAlert?.id === a.id;
            const isSevere = a.severity === 'warning' || a.severity === 'watch';
            const isOfficial = a.source.toLowerCase() === 'imd' || (a.source_type && a.source_type.includes('Official'));

            return (
              <div
                key={a.id}
                onClick={() => {
                  setSelectedAlert(a);
                  loadPrecautions(a);
                }}
                className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-md ${
                  isSelected
                    ? isSevere
                      ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 ring-2 ring-rose-500/20'
                      : 'bg-sky-50/90 dark:bg-sky-950/40 border-sky-400 dark:border-sky-700 ring-2 ring-sky-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {/* Header with Source Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getAlertIcon(a.alert_type)}
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {a.title}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      a.severity === 'warning'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : a.severity === 'watch'
                        ? 'bg-amber-500 text-white'
                        : 'bg-sky-600 text-white'
                    }`}
                  >
                    {a.severity}
                  </span>
                </div>

                {/* Source Identifier Pill */}
                <div className="mb-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isOfficial
                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                        : 'bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700'
                    }`}
                  >
                    <FileText className="w-2.5 h-2.5" />
                    {a.source_type || (isOfficial ? 'Official IMD Warning' : 'WeatherGPT Derived Advisory')}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium mb-3">
                  {a.description}
                </p>

                {/* Emergency Action */}
                {a.emergency_action && (
                  <div className="mb-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-[11px] font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Action: {a.emergency_action}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatTimeWindow(a.valid_from, a.valid_to)}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Source: {a.source.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center space-x-3 text-xs text-emerald-900 dark:text-emerald-200 font-medium">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>{getTranslation(language, 'no_active_alerts')}</span>
          </div>
        )}
      </div>

      {/* Precautions: Do's and Don'ts Checklist */}
      <div className="space-y-4 mb-6">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          {getTranslation(language, 'emergency_checklist')}
        </h3>

        {/* DO's */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md shadow-slate-200/40 dark:shadow-none">
          <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{getTranslation(language, 'dos')}</span>
          </div>
          <div className="space-y-2">
            {precautions?.dos.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300 font-medium"
              >
                <span className="text-emerald-500 font-black">•</span>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DON'TS */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md shadow-slate-200/40 dark:shadow-none">
          <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 font-bold text-xs mb-3">
            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>{getTranslation(language, 'donts')}</span>
          </div>
          <div className="space-y-2">
            {precautions?.donts.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300 font-medium"
              >
                <span className="text-rose-500 font-black">•</span>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Helplines Speed Dial */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md shadow-slate-200/40 dark:shadow-none">
        <div className="flex items-center space-x-2 text-sky-700 dark:text-sky-400 font-bold text-xs mb-3">
          <PhoneCall className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>{getTranslation(language, 'emergency_helplines')}</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {precautions?.emergency_contacts.map((c, idx) => (
            <a
              key={idx}
              href={`tel:${c.number}`}
              className="p-3 rounded-2xl bg-sky-50/60 dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-500 flex flex-col justify-between transition-colors shadow-sm active:scale-95"
            >
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate">
                {c.label}
              </span>
              <span className="text-base font-black text-sky-700 dark:text-sky-400 mt-1">
                {c.number}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
