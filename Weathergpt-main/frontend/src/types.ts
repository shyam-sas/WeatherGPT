export interface UserSettings {
  unit_temp: string;
  unit_wind: string;
  unit_pressure: string;
  unit_precip: string;
  unit_distance: string;
  theme: string;
  notif_severe: boolean;
  notif_daily_digest: boolean;
  notif_realtime_precip: boolean;
  notif_status_bar: boolean;
  location_permission: boolean;
}

export interface LocationItem {
  id?: string;
  label: string;
  lat: number;
  lon: number;
  is_default?: boolean;
}

export interface TimeOfDaySlot {
  label: string; // Morning, Afternoon, Evening, Night
  time_range: string;
  temperature: number;
  rain_probability: number;
  condition: string;
  condition_code: number;
  risk_level: 'Low Concern' | 'Caution' | 'High Risk' | 'Severe' | string;
  summary: string;
}

export interface RiskTimelineData {
  slots: TimeOfDaySlot[];
  overall_risk: string;
  recommendation: string;
}

export interface DailyBriefingData {
  greeting: string;
  headline: string;
  summary: string;
  action_tip: string;
  best_time_to_go_out: string;
  umbrella_needed: boolean;
  safe_to_travel: boolean;
  travel_advisory?: string;
}

export interface CurrentWeather {
  lat: number;
  lon: number;
  city: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  condition: string;
  condition_code: number;
  uv_index: number;
  aqi: number;
  aqi_label: string;
  pressure: number;
  precipitation: number;
  visibility: number;
  is_day: number;
  updated_at: string;
  stale?: boolean;
  human_explanation?: string;
  why_reason?: string;
  data_source?: string;
  freshness_minutes?: number;
  risk_timeline?: RiskTimelineData;
  daily_briefing?: DailyBriefingData;
}

export interface DailyForecastItem {
  date: string;
  temp_max: number;
  temp_min: number;
  condition: string;
  condition_code: number;
  precip_probability: number;
  precip_sum: number;
  wind_speed_max: number;
  uv_index_max: number;
  explanation?: string;
  breakdown?: TimeOfDaySlot[];
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  condition: string;
  condition_code: number;
  precipitation: number;
  wind_speed: number;
}

export interface ForecastResponse {
  lat: number;
  lon: number;
  daily: DailyForecastItem[];
  hourly: HourlyForecastItem[];
  stale?: boolean;
  data_source?: string;
}

export interface AlertItem {
  id: string;
  lat: number;
  lon: number;
  region_name: string;
  alert_type: string;
  severity: string;
  source: string;
  source_type?: string; // "Official IMD Warning" | "WeatherGPT Derived Advisory"
  title: string;
  description: string;
  precautions: string[];
  valid_from: string;
  valid_to: string;
  emergency_action?: string;
}

export interface ActiveAlertsResponse {
  has_active_alerts: boolean;
  count: number;
  alerts: AlertItem[];
  stale?: boolean;
  official_disclaimer?: string;
}

export interface AdvisoryTopic {
  title: string;
  category: string;
  summary: string;
  recommendation: string;
  severity: 'normal' | 'attention' | 'critical';
  why_reason?: string;
  best_time_window?: string;
}

export interface AdvisoryResponse {
  profession: string;
  lat: number;
  lon: number;
  summary: string;
  topics: AdvisoryTopic[];
  generated_at: string;
  stale?: boolean;
  data_source?: string;
}

export interface ResearchMetricItem {
  name: string;
  code: string;
  value: any;
  unit: string;
  description: string;
  plain_tooltip: string;
  trend?: string;
  expert_formula?: string;
}

export interface ResearchMetricsResponse {
  category: string;
  metrics: ResearchMetricItem[];
  stale?: boolean;
  data_source?: string;
}

export interface HistoricalPoint {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation: number;
  wind_speed?: number;
}

export interface HistoricalResponse {
  lat: number;
  lon: number;
  start_date: string;
  end_date: string;
  data: HistoricalPoint[];
  stale?: boolean;
  data_source?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  intent?: string;
  provider_used?: string;
  suggested_followups?: string[];
  why_reason?: string;
  action_tip?: string;
  best_window?: string;
  language_mirror_style?: string;
}

export interface WeatherExplainerItem {
  key: string;
  name: string;
  plain: string;
  technical: string;
  ideal_range?: string;
}
