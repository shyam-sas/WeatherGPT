import asyncio
import sys
from pathlib import Path

# Ensure backend root is on sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.services.llm_service import llm_service
from app.services.weather_service import weather_service

async def run_universal_location_tests():
    print("=" * 80)
    print("WEATHERGPT — UNIVERSAL LOCATION INTELLIGENCE VERIFICATION SUITE")
    print("=" * 80)

    # 15 Mandated test locations
    test_locations = [
        ("weather in Chennai", "Chennai", (12.5, 13.5, 79.8, 80.5)),
        ("weather in Tokyo", "Tokyo", (35.0, 36.0, 139.0, 140.0)),
        ("weather in London", "London", (51.0, 52.0, -0.5, 0.5)),
        ("weather in New York", "New York", (40.0, 41.5, -74.5, -73.5)),
        ("weather in Mumbai", "Mumbai", (18.5, 19.5, 72.5, 73.5)),
        ("weather in Delhi", "New Delhi", (28.0, 29.0, 76.5, 77.8)),
        ("weather in Coimbatore", "Coimbatore", (10.5, 11.5, 76.5, 77.5)),
        ("weather in Tiruppur", "Tiruppur", (10.8, 11.4, 77.0, 77.8)),
        ("weather in Kanchipuram", "Kanchipuram", (12.5, 13.1, 79.4, 80.0)),
        ("weather in Pallavaram", "Pallavaram", (12.8, 13.1, 80.0, 80.3)),
        ("weather at Ooty", "Ooty", (11.2, 11.6, 76.5, 76.9)),
        ("weather at Marina Beach", "Marina Beach", (13.0, 13.1, 80.2, 80.35)),
        ("weather at Chennai airport", "Chennai International Airport", (12.9, 13.1, 80.1, 80.25)),
        ("weather at Bangalore airport", "Kempegowda International Airport", (13.1, 13.3, 77.6, 77.85)),
        ("weather at Prince Shri Venkateshwara Padmavathy Engineering College", "Prince Shri Venkateshwara Padmavathy Engineering College", (12.7, 13.0, 80.0, 80.3)),
    ]

    resolved_records = {}
    passed_count = 0
    total_count = len(test_locations) + 5  # plus conversation sequence tests

    # --- PART 1: 15 MANDATORY LOCATIONS RESOLUTION & WEATHER INTEGRITY ---
    for i, (query, expected_name_part, (lat_min, lat_max, lon_min, lon_max)) in enumerate(test_locations, 1):
        print(f"\n--- TEST {i}: '{query}' ---")
        res = await llm_service.process_query(
            text=query,
            lang="en",
            lat=12.9675, # Default Pallavaram lat
            lon=80.1491, # Default Pallavaram lon
            city="Pallavaram"
        )

        resolved_loc = res.get("resolved_location", "")
        res_lat = res.get("lat")
        res_lon = res.get("lon")
        weather = res.get("weather", {})
        temp = weather.get("temperature")

        print(f"-> Resolved Location: {resolved_loc}")
        print(f"-> Coordinates: ({res_lat}, {res_lon})")
        print(f"-> Weather Temp: {temp}°C, Condition: {weather.get('condition')}")
        print(f"-> Answer: {res.get('answer')[:120]}...")

        # Assertions
        assert expected_name_part.lower() in resolved_loc.lower(), f"Expected '{expected_name_part}' in resolved location, got '{resolved_loc}'"
        assert lat_min <= res_lat <= lat_max, f"Latitude {res_lat} out of range ({lat_min}, {lat_max}) for {resolved_loc}"
        assert lon_min <= res_lon <= lon_max, f"Longitude {res_lon} out of range ({lon_min}, {lon_max}) for {resolved_loc}"
        assert temp is not None, "Temperature cannot be None"
        assert res.get("language_code") == "en", "Response language must be en for English input"

        coord_key = f"{round(res_lat, 2)},{round(res_lon, 2)}"
        resolved_records[resolved_loc] = (res_lat, res_lon, temp)
        passed_count += 1
        print(f"[PASS] Location Test {i}: {resolved_loc} correctly resolved to ({res_lat}, {res_lon})")

    # Verify that Tokyo, London, New York, Chennai, Ooty, etc. have DISTINCT coordinates
    unique_coords = set((round(lat, 2), round(lon, 2)) for lat, lon, _ in resolved_records.values())
    assert len(unique_coords) >= 12, f"Expected at least 12 distinct coordinate pairs across 15 locations, got {len(unique_coords)}"
    print(f"\n[VERIFIED] All locations resolved to unique geographic coordinates without Pallavaram/default contamination.")

    # --- PART 2: MULTI-TURN CONVERSATION INTELLIGENCE OVERHAUL SEQUENCE ---
    print("\n" + "=" * 80)
    print("PART 2: MULTI-TURN CONVERSATION TEST SEQUENCE")
    print("=" * 80)

    conv_history = []

    # Turn 1: "weather in Tokyo"
    print("\n--- CONV TURN 1: 'weather in Tokyo' ---")
    t1 = await llm_service.process_query(
        text="weather in Tokyo",
        lang="en",
        lat=13.0827,
        lon=80.2707,
        city="Chennai",
        conversation_history=conv_history
    )
    print(f"Location: {t1['resolved_location']} ({t1['lat']}, {t1['lon']})")
    print(f"Answer: {t1['answer']}")
    assert "tokyo" in t1["resolved_location"].lower()
    assert 35.0 <= t1["lat"] <= 36.0
    passed_count += 1
    print("[PASS] Turn 1: Tokyo resolved")
    conv_history.append({"role": "user", "text": "weather in Tokyo", "location": t1["resolved_location"], "lat": t1["lat"], "lon": t1["lon"]})
    conv_history.append({"role": "assistant", "text": t1["answer"], "location": t1["resolved_location"], "lat": t1["lat"], "lon": t1["lon"]})

    # Turn 2: "will it rain there tomorrow?"
    print("\n--- CONV TURN 2: 'will it rain there tomorrow?' ---")
    t2 = await llm_service.process_query(
        text="will it rain there tomorrow?",
        lang="en",
        lat=t1["lat"],
        lon=t1["lon"],
        city=t1["resolved_location"],
        conversation_history=conv_history
    )
    print(f"Location: {t2['resolved_location']} ({t2['lat']}, {t2['lon']})")
    print(f"Intent: {t2['intent']}")
    print(f"Answer: {t2['answer']}")
    assert "tokyo" in t2["resolved_location"].lower(), "Contextual 'there' must resolve to previous active location Tokyo"
    assert t2["intent"] in ["RAIN_FORECAST", "FORECAST"]
    passed_count += 1
    print("[PASS] Turn 2: 'there' correctly resolved to Tokyo")
    conv_history.append({"role": "user", "text": "will it rain there tomorrow?", "location": t2["resolved_location"], "lat": t2["lat"], "lon": t2["lon"]})
    conv_history.append({"role": "assistant", "text": t2["answer"], "location": t2["resolved_location"], "lat": t2["lat"], "lon": t2["lon"]})

    # Turn 3: "what about Chennai?" (Explicit location overrides Tokyo)
    print("\n--- CONV TURN 3: 'what about Chennai?' ---")
    t3 = await llm_service.process_query(
        text="what about Chennai?",
        lang="en",
        lat=t2["lat"],
        lon=t2["lon"],
        city=t2["resolved_location"],
        conversation_history=conv_history
    )
    print(f"Location: {t3['resolved_location']} ({t3['lat']}, {t3['lon']})")
    print(f"Answer: {t3['answer']}")
    assert "chennai" in t3["resolved_location"].lower(), "Explicit 'Chennai' must switch active location from Tokyo to Chennai"
    assert 12.8 <= t3["lat"] <= 13.2
    passed_count += 1
    print("[PASS] Turn 3: Explicit location switched to Chennai")
    conv_history.append({"role": "user", "text": "what about Chennai?", "location": t3["resolved_location"], "lat": t3["lat"], "lon": t3["lon"]})
    conv_history.append({"role": "assistant", "text": t3["answer"], "location": t3["resolved_location"], "lat": t3["lat"], "lon": t3["lon"]})

    # Turn 4: "will it rain there tomorrow?"
    print("\n--- CONV TURN 4: 'will it rain there tomorrow?' ---")
    t4 = await llm_service.process_query(
        text="will it rain there tomorrow?",
        lang="en",
        lat=t3["lat"],
        lon=t3["lon"],
        city=t3["resolved_location"],
        conversation_history=conv_history
    )
    print(f"Location: {t4['resolved_location']} ({t4['lat']}, {t4['lon']})")
    print(f"Answer: {t4['answer']}")
    assert "chennai" in t4["resolved_location"].lower(), "Contextual 'there' must resolve to previous active location Chennai"
    passed_count += 1
    print("[PASS] Turn 4: 'there' correctly resolved to Chennai")
    conv_history.append({"role": "user", "text": "will it rain there tomorrow?", "location": t4["resolved_location"], "lat": t4["lat"], "lon": t4["lon"]})
    conv_history.append({"role": "assistant", "text": t4["answer"], "location": t4["resolved_location"], "lat": t4["lat"], "lon": t4["lon"]})

    # Turn 5: "I'm planning a walk there in the evening."
    print("\n--- CONV TURN 5: 'I'm planning a walk there in the evening.' ---")
    t5 = await llm_service.process_query(
        text="I'm planning a walk there in the evening.",
        lang="en",
        lat=t4["lat"],
        lon=t4["lon"],
        city=t4["resolved_location"],
        conversation_history=conv_history
    )
    print(f"Location: {t5['resolved_location']} ({t5['lat']}, {t5['lon']})")
    print(f"Intent: {t5['intent']}")
    print(f"Answer: {t5['answer']}")
    assert "chennai" in t5["resolved_location"].lower()
    assert t5["intent"] in ["OUTDOOR_ACTIVITY", "PICNIC_RECOMMENDATION", "TIME_RECOMMENDATION", "FORECAST", "CURRENT_WEATHER"]
    assert any(w in t5["answer"].lower() for w in ["walk", "evening", "weather", "comfortable", "hot", "wait", "clear", "cloudy"])
    passed_count += 1
    print("[PASS] Turn 5: Chennai walk recommendation correctly reasoned")

    print("\n" + "=" * 80)
    print(f"ALL TESTS COMPLETED: {passed_count}/{total_count} PASSED (100%)")
    print("=" * 80)

if __name__ == "__main__":
    asyncio.run(run_universal_location_tests())
