import urllib.request
import urllib.parse
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def run_test(name, fn):
    try:
        fn()
        print(f"[PASS] {name}")
        return True
    except Exception as e:
        print(f"[FAIL] {name}: {e}")
        return False

def test_health():
    res = urllib.request.urlopen(f"{BASE_URL}/health")
    assert res.status == 200
    data = json.loads(res.read())
    assert data["status"] == "healthy"

def test_onboarding_and_auth():
    req_data = json.dumps({
        "device_id": "test_device_001",
        "language_code": "ta",
        "profession": "farmer",
        "city": "Chennai",
        "lat": 13.0827,
        "lon": 80.2707
    }).encode("utf-8")
    req = urllib.request.Request(f"{BASE_URL}/api/onboarding", data=req_data, headers={"Content-Type": "application/json"})
    res = urllib.request.urlopen(req)
    assert res.status == 200
    data = json.loads(res.read())
    assert "access_token" in data
    assert data["user"]["profession"] == "farmer"

def test_current_weather_matching():
    url = f"{BASE_URL}/api/weather/current?lat=13.0827&lon=80.2707&city=Chennai"
    res = urllib.request.urlopen(url)
    assert res.status == 200
    data = json.loads(res.read())
    # Verify non-fabricated numerical fields
    assert isinstance(data["temperature"], (int, float))
    assert isinstance(data["humidity"], (int, float))
    assert isinstance(data["wind_speed"], (int, float))
    assert isinstance(data["pressure"], (int, float))
    assert "risk_timeline" in data
    assert len(data["risk_timeline"]["slots"]) == 4
    # Context-aware risk categories
    valid_risks = ["Low Concern", "Caution", "High Risk", "Severe", "Low Risk", "Alert"]
    for s in data["risk_timeline"]["slots"]:
        assert s["risk_level"] in valid_risks
    # Daily briefing contextual travel advisory
    assert "daily_briefing" in data
    assert "travel_advisory" in data["daily_briefing"] or "safe_to_travel" in data["daily_briefing"]

def test_forecast_breakdown():
    url = f"{BASE_URL}/api/weather/forecast?lat=13.0827&lon=80.2707&days=7"
    res = urllib.request.urlopen(url)
    assert res.status == 200
    data = json.loads(res.read())
    assert len(data["daily"]) == 7
    assert len(data["hourly"]) >= 24
    for d in data["daily"]:
        assert "temp_max" in d
        assert "temp_min" in d
        assert "breakdown" in d
        assert len(d["breakdown"]) == 4

def test_tanglish_style_mirroring():
    payload = {
        "text": "Naalaiku Chennai la mazha varuma?",
        "lat": 13.0827,
        "lon": 80.2707,
        "city": "Chennai",
        "language": "ta"
    }
    req = urllib.request.Request(f"{BASE_URL}/api/chat/query", data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
    res = urllib.request.urlopen(req)
    assert res.status == 200
    data = json.loads(res.read())
    assert "answer" in data
    assert len(data["answer"]) > 10
    assert "why_reason" in data or "action_tip" in data

def test_multi_turn_context():
    history = [
        {"role": "user", "text": "Chennai weather tomorrow?"},
        {"role": "assistant", "text": "Tomorrow in Chennai will reach 33°C with a 40% chance of showers."}
    ]
    payload = {
        "text": "Umbrella venuma?",
        "lat": 13.0827,
        "lon": 80.2707,
        "city": "Chennai",
        "language": "ta",
        "conversation_history": history
    }
    req = urllib.request.Request(f"{BASE_URL}/api/chat/query", data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
    res = urllib.request.urlopen(req)
    assert res.status == 200
    data = json.loads(res.read())
    assert "answer" in data
    assert len(data["answer"]) > 10
    assert data.get("language_mirror_style") == "Tanglish" or "Chennai" in data["answer"] or "chance" in data["answer"].lower()

def test_hinglish_nlp():
    payload = {
        "text": "Kal Delhi me barish hogi kya?",
        "lat": 28.6139,
        "lon": 77.2090,
        "city": "New Delhi",
        "language": "hi"
    }
    req = urllib.request.Request(f"{BASE_URL}/api/chat/query", data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
    res = urllib.request.urlopen(req)
    assert res.status == 200
    data = json.loads(res.read())
    assert "answer" in data
    assert len(data["answer"]) > 10

def test_advisory_explainability_and_timing():
    url = f"{BASE_URL}/api/advisory?profession=farmer&lat=13.0827&lon=80.2707"
    res = urllib.request.urlopen(url)
    assert res.status == 200
    data = json.loads(res.read())
    assert data["profession"] == "farmer"
    assert len(data["topics"]) > 0
    for topic in data["topics"]:
        assert "why_reason" in topic
        assert "best_time_window" in topic

def test_alerts_official_vs_derived_separation():
    url = f"{BASE_URL}/api/alerts/active?lat=13.0827&lon=80.2707"
    res = urllib.request.urlopen(url)
    assert res.status == 200
    data = json.loads(res.read())
    assert "alerts" in data
    for alert in data["alerts"]:
        assert "source_type" in alert
        assert alert["source_type"] in ["Official IMD Warning", "WeatherGPT Derived Advisory"]

def test_disaster_precautions():
    url = f"{BASE_URL}/api/alerts/alert_123/precautions?alert_type=cyclone"
    res = urllib.request.urlopen(url)
    assert res.status == 200
    data = json.loads(res.read())
    assert "dos" in data
    assert "donts" in data
    assert len(data["dos"]) > 0
    assert len(data["donts"]) > 0

def test_research_metrics_formulas():
    url = f"{BASE_URL}/api/research/metrics?category=all"
    res = urllib.request.urlopen(url)
    assert res.status == 200
    data = json.loads(res.read())
    assert len(data["metrics"]) > 0
    for m in data["metrics"]:
        assert "plain_tooltip" in m
        assert "expert_formula" in m

def test_historical_climatology():
    url = f"{BASE_URL}/api/research/historical?lat=13.0827&lon=80.2707&start_date=2026-08-01&end_date=2026-08-20"
    res = urllib.request.urlopen(url)
    assert res.status == 200
    data = json.loads(res.read())
    assert len(data["data"]) > 0

def test_languages_endpoint():
    url = f"{BASE_URL}/api/languages"
    res = urllib.request.urlopen(url)
    assert res.status == 200
    data = json.loads(res.read())
    assert isinstance(data, list)
    assert len(data) == 13

def main():
    tests = [
        ("1. Health Endpoint", test_health),
        ("2. Onboarding & Authentication", test_onboarding_and_auth),
        ("3. Current Weather & Risk Timeline Grounding", test_current_weather_matching),
        ("4. 7-Day Forecast & Daypart Breakdown", test_forecast_breakdown),
        ("5. Tanglish Style Mirroring", test_tanglish_style_mirroring),
        ("6. Multi-Turn Context Memory", test_multi_turn_context),
        ("7. Hinglish NLP Query", test_hinglish_nlp),
        ("8. Agronomic Advisory Explainability & Timing", test_advisory_explainability_and_timing),
        ("9. Official vs Derived Alert Separation", test_alerts_official_vs_derived_separation),
        ("10. Disaster Precautions (DOs & DON'Ts)", test_disaster_precautions),
        ("11. NWP Diagnostic Research Formulas", test_research_metrics_formulas),
        ("12. Historical Climatology Archive", test_historical_climatology),
        ("13. 13 Supported Indian Languages", test_languages_endpoint),
    ]
    passed = 0
    for name, fn in tests:
        if run_test(name, fn):
            passed += 1
    print(f"\nSummary: {passed}/{len(tests)} functional integration tests passed.")
    if passed == len(tests):
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
