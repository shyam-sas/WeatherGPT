import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

def run_test_suite():
    client = TestClient(app)
    tests = []

    print("=" * 60)
    print("WEATHERGPT BACKEND IN-PROCESS TEST SUITE (SIH26068)")
    print("=" * 60)

    # 1. Health
    r = client.get("/health")
    tests.append(("1. Health Check", r.status_code == 200, str(r.json())))

    # 2. Onboarding & Token
    r = client.post("/api/onboarding", json={
        "device_id": "test_device_sih",
        "language_code": "ta",
        "profession": "farmer",
        "city": "Chennai",
        "lat": 13.0827,
        "lon": 80.2707
    })
    token = r.json().get("access_token", "")
    headers = {"Authorization": f"Bearer {token}"}
    tests.append(("2. Onboarding & JWT Auth", r.status_code == 200 and len(token) > 10, f"Token: {token[:16]}..."))

    # 3. Current Weather (with Human Explanation & Risk Timeline)
    r = client.get("/api/weather/current?lat=13.0827&lon=80.2707&city=Chennai", headers=headers)
    data = r.json()
    has_expl = bool(data.get("human_explanation"))
    has_briefing = bool(data.get("daily_briefing"))
    has_timeline = bool(data.get("risk_timeline"))
    tests.append(("3. Current Weather API + Intelligence", r.status_code == 200 and has_expl and has_timeline, f"Temp: {data.get('temperature')}C | Briefing: {has_briefing} | Expl: {has_expl}"))

    # 4. Forecast 7 Days (with day breakdowns)
    r = client.get("/api/weather/forecast?lat=13.0827&lon=80.2707&days=7", headers=headers)
    data = r.json()
    daily_items = data.get("daily", [])
    has_breakdown = len(daily_items) > 0 and bool(daily_items[0].get("breakdown"))
    tests.append(("4. 7-Day Forecast API + Breakdowns", r.status_code == 200 and len(daily_items) == 7 and has_breakdown, f"Days: {len(daily_items)} | Breakdown: {has_breakdown}"))

    # 5. Map Radar Metadata
    r = client.get("/api/weather/map?lat=13.0827&lon=80.2707", headers=headers)
    data = r.json()
    tests.append(("5. Weather Map Layers API", r.status_code == 200, f"Precip Rate: {data.get('precipitation_rate')} mm"))

    # 6. Geocoding Search
    r = client.get("/api/weather/search?query=Chennai")
    data = r.json()
    tests.append(("6. Geocoding Location Search", r.status_code == 200 and len(data) > 0, f"{len(data)} locations matched"))

    # 7. AI Chat Query (English)
    r = client.post("/api/chat/query", json={
        "text": "Will it rain tomorrow in Chennai?",
        "city": "Chennai",
        "lat": 13.0827,
        "lon": 80.2707,
        "lang": "en",
        "profession": "farmer"
    }, headers=headers)
    data = r.json()
    answer_preview = data.get("answer", "")[:50].encode("ascii", "replace").decode("ascii")
    tests.append(("7. AI Chat Query (English)", r.status_code == 200 and len(data.get("answer", "")) > 5, f"Answer: {answer_preview}..."))

    # 8. AI Chat Query (Code-mixed Tanglish)
    r = client.post("/api/chat/query", json={
        "text": "Nalaiku Chennai la malai varuma?",
        "city": "Chennai",
        "lat": 13.0827,
        "lon": 80.2707,
        "lang": "ta",
        "profession": "farmer"
    }, headers=headers)
    data = r.json()
    tests.append(("8. AI Code-Mixed Tanglish Mirroring", r.status_code == 200 and len(data.get("answer", "")) > 5, f"Lang: {data.get('language_code')} | Style: {data.get('language_mirror_style')}"))

    # 9. AI Chat Multi-turn with Conversation History
    r = client.post("/api/chat/query", json={
        "text": "Umbrella venuma?",
        "city": "Chennai",
        "lat": 13.0827,
        "lon": 80.2707,
        "lang": "ta",
        "profession": "farmer",
        "conversation_history": [
            {"role": "user", "text": "Nalaiku malai varuma?"},
            {"role": "assistant", "text": "Naalai Chennaiyil malai peiyya vaaipu ullathu."}
        ]
    }, headers=headers)
    data = r.json()
    tests.append(("9. Conversational Multi-Turn Context", r.status_code == 200 and bool(data.get("action_tip")), f"ActionTip: {bool(data.get('action_tip'))}"))

    # 10. Farmer Profession Advisory
    r = client.get("/api/advisory?profession=farmer&lat=13.0827&lon=80.2707", headers=headers)
    data = r.json()
    topics = data.get("topics", [])
    has_why = len(topics) > 0 and bool(topics[0].get("why_reason"))
    tests.append(("10. Farmer Advisory + Explainability", r.status_code == 200 and len(topics) >= 2 and has_why, f"{len(topics)} topics | WhyReason: {has_why}"))

    # 11. Fisherman Advisory
    r = client.get("/api/advisory?profession=fisherman&lat=13.0827&lon=80.2707", headers=headers)
    data = r.json()
    tests.append(("11. Fisherman Marine Advisory", r.status_code == 200 and len(data.get("topics", [])) >= 2, f"{len(data.get('topics', []))} marine topics"))

    # 12. Disaster Active Alerts
    r = client.get("/api/alerts/active?lat=13.0827&lon=80.2707", headers=headers)
    data = r.json()
    alerts = data.get("alerts", [])
    has_source_type = len(alerts) > 0 and bool(alerts[0].get("source_type"))
    tests.append(("12. Active Disaster Alerts API", r.status_code == 200 and has_source_type, f"Count: {data.get('count')} | SourceType: {alerts[0].get('source_type') if alerts else 'None'}"))

    # 13. Alert Precautions (DOs / DONTs)
    r = client.get("/api/alerts/alert_123/precautions?alert_type=cyclone", headers=headers)
    data = r.json()
    tests.append(("13. Disaster DOs & DONTs API", r.status_code == 200 and len(data.get("dos", [])) > 0, f"DOs: {len(data.get('dos', []))}, DONTs: {len(data.get('donts', []))}"))

    # 14. Climate Research Metrics
    r = client.get("/api/research/metrics?category=all", headers=headers)
    data = r.json()
    tests.append(("14. Climate Research Metrics API", r.status_code == 200 and len(data.get("metrics", [])) > 0, f"{len(data.get('metrics', []))} NWP metrics"))

    # 15. Historical Trends
    r = client.get("/api/research/historical?lat=13.0827&lon=80.2707&start_date=2026-08-01&end_date=2026-08-20", headers=headers)
    data = r.json()
    tests.append(("15. Historical Climatology API", r.status_code == 200 and len(data.get("data", [])) > 0, f"{len(data.get('data', []))} historical records"))

    # 16. Supported Languages
    r = client.get("/api/languages")
    data = r.json()
    tests.append(("16. 13 Supported Indian Languages API", r.status_code == 200 and len(data) >= 13, f"{len(data)} languages configured"))

    all_passed = True
    for name, passed, detail in tests:
        mark = "[PASS]" if passed else "[FAIL]"
        if not passed:
            all_passed = False
        print(f"{mark} {name:<42} | {detail}")

    print("=" * 60)
    print(f"OVERALL RESULT: {'ALL 16 TESTS PASSED' if all_passed else 'SOME TESTS FAILED'}")
    print("=" * 60)
    return all_passed

if __name__ == "__main__":
    success = run_test_suite()
    sys.exit(0 if success else 1)
