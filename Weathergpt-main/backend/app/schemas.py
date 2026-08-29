from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Onboarding & Auth ---
class OnboardingRequest(BaseModel):
    device_id: str
    language_code: str = "en"
    profession: str = "general"
    city: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None

class OnboardingResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

# --- Weather ---
class TimeOfDaySlot(BaseModel):
    label: str  # Morning, Afternoon, Evening, Night
    time_range: str
    temperature: float
    rain_probability: float
    condition: str
    condition_code: int
    risk_level: str  # Safe, Caution, Alert
    summary: str

class RiskTimelineData(BaseModel):
    slots: List[TimeOfDaySlot]
    overall_risk: str
    recommendation: str

class DailyBriefingData(BaseModel):
    greeting: str
    headline: str
    summary: str
    action_tip: str
    best_time_to_go_out: str
    umbrella_needed: bool
    safe_to_travel: bool

class CurrentWeatherResponse(BaseModel):
    lat: float
    lon: float
    city: Optional[str] = None
    temperature: float
    feels_like: float
    humidity: float
    wind_speed: float
    wind_direction: float
    condition: str
    condition_code: int
    uv_index: float
    aqi: Optional[int] = None
    aqi_label: Optional[str] = None
    pressure: float
    precipitation: float
    visibility: float
    is_day: int
    updated_at: datetime
    stale: bool = False
    human_explanation: Optional[str] = None
    why_reason: Optional[str] = None
    data_source: Optional[str] = "Open-Meteo & IMD High-Resolution Numerical Grid"
    freshness_minutes: Optional[int] = 1
    risk_timeline: Optional[RiskTimelineData] = None
    daily_briefing: Optional[DailyBriefingData] = None

class DailyForecastItem(BaseModel):
    date: str
    temp_max: float
    temp_min: float
    condition: str
    condition_code: int
    precip_probability: float
    precip_sum: float
    wind_speed_max: float
    uv_index_max: float
    explanation: Optional[str] = None
    breakdown: Optional[List[TimeOfDaySlot]] = None

class HourlyForecastItem(BaseModel):
    time: str
    temperature: float
    condition: str
    condition_code: int
    precipitation: float
    wind_speed: float

class ForecastResponse(BaseModel):
    lat: float
    lon: float
    daily: List[DailyForecastItem]
    hourly: List[HourlyForecastItem]
    stale: bool = False
    data_source: Optional[str] = "Open-Meteo NWP Multi-Model Ensemble"

class WeatherMapDataResponse(BaseModel):
    lat: float
    lon: float
    precipitation_rate: float
    cloud_cover: float
    surface_pressure: float
    wind_speed: float
    radar_layers: List[Dict[str, Any]]
    stale: bool = False

# --- Chat & NL Query ---
class ChatQueryRequest(BaseModel):
    text: str
    lang: Optional[str] = "en"
    lat: Optional[float] = None
    lon: Optional[float] = None
    city: Optional[str] = None
    profession: Optional[str] = None
    conversation_history: Optional[List[Dict[str, str]]] = None

class ChatQueryResponse(BaseModel):
    query: str
    answer: str
    language_code: str
    intent: str
    provider_used: str
    resolved_location: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    timezone: Optional[str] = None
    weather: Optional[Dict[str, Any]] = None
    grounded_data: Optional[Dict[str, Any]] = None
    suggested_followups: Optional[List[str]] = None
    why_reason: Optional[str] = None
    action_tip: Optional[str] = None
    best_window: Optional[str] = None
    language_mirror_style: Optional[str] = None

# --- Advisories ---
class AdvisoryTopic(BaseModel):
    title: str
    category: str
    summary: str
    recommendation: str
    severity: str = "normal"  # normal, attention, critical
    why_reason: Optional[str] = None
    best_time_window: Optional[str] = None

class AdvisoryResponse(BaseModel):
    profession: str
    lat: float
    lon: float
    summary: str
    topics: List[AdvisoryTopic]
    generated_at: datetime
    stale: bool = False
    data_source: Optional[str] = "WeatherGPT Agro-Maritime Intelligence Engine"

# --- Research Metrics & Historical ---
class ResearchMetricItem(BaseModel):
    name: str
    code: str
    value: Any
    unit: str
    description: str
    plain_tooltip: str
    trend: Optional[str] = None
    expert_formula: Optional[str] = None

class ResearchMetricsResponse(BaseModel):
    category: str
    metrics: List[ResearchMetricItem]
    stale: bool = False
    data_source: Optional[str] = "ECMWF & GFS Atmospheric Analysis Model"

class HistoricalDataPoint(BaseModel):
    date: str
    temp_max: float
    temp_min: float
    precipitation: float
    wind_speed: Optional[float] = None

class HistoricalResponse(BaseModel):
    lat: float
    lon: float
    start_date: str
    end_date: str
    data: List[HistoricalDataPoint]
    stale: bool = False
    data_source: Optional[str] = "ERA5 Climatological Reanalysis Archive"

# --- Alerts ---
class AlertResponseItem(BaseModel):
    id: str
    lat: float
    lon: float
    region_name: str
    alert_type: str
    severity: str
    source: str
    source_type: Optional[str] = "WeatherGPT Derived Advisory"
    title: str
    description: str
    precautions: List[str]
    valid_from: datetime
    valid_to: datetime
    emergency_action: Optional[str] = None

class ActiveAlertsResponse(BaseModel):
    has_active_alerts: bool
    count: int
    alerts: List[AlertResponseItem]
    stale: bool = False
    official_disclaimer: Optional[str] = "Official disaster warnings are issued by IMD & NDMA. WeatherGPT derived advisories provide high-resolution localized decision support."

class AlertPrecautionsResponse(BaseModel):
    alert_id: Optional[str] = None
    alert_type: str
    severity: str
    dos: List[str]
    donts: List[str]
    emergency_contacts: List[Dict[str, str]]

# --- Settings & Locations ---
class LocationCreateRequest(BaseModel):
    label: str
    lat: float
    lon: float
    is_default: bool = False

class GeocodeResultItem(BaseModel):
    name: str
    lat: float
    lon: float
    country: str
    admin1: Optional[str] = None

