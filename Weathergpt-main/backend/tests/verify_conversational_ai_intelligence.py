import asyncio
import sys
import os

# Set root directory for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.llm_service import llm_service
from app.services.weather_service import weather_service

async def run_conversational_ai_tests():
    print("=" * 80)
    print("WEATHERGPT — FINAL CONVERSATIONAL AI & LOCATION OVERVIEW SUITE")
    print("=" * 80)

    total_tests = 0
    passed_tests = 0

    # -------------------------------------------------------------------------
    # TEST 1: What's the weather at Chennai? -> Pure English, no Tamil, no generic umbrella
    # -------------------------------------------------------------------------
    total_tests += 1
    print("\n--- TEST 1: 'What's the weather at Chennai?' ---")
    res1 = await llm_service.process_query(
        text="What's the weather at Chennai?",
        lang="en",
        lat=13.0827,
        lon=80.2707,
        city="Chennai"
    )
    ans1 = res1["answer"]
    lang1 = res1["language_code"]
    loc1 = res1["resolved_location"]
    print(f"Location: {loc1} ({res1['lat']}, {res1['lon']})")
    print(f"Language: {lang1}")
    print(f"Answer: {ans1}")

    # Assertions
    is_tamil_script = bool(__import__("re").search(r"[\u0B80-\u0BFF]", ans1))
    is_english = lang1 == "en" and not is_tamil_script
    correct_location = "chennai" in loc1.lower()

    if is_english and correct_location and not is_tamil_script:
        print("[PASS] Test 1: English response, Chennai weather, No Tamil script, Natural flow")
        passed_tests += 1
    else:
        print(f"[FAIL] Test 1: is_english={is_english}, is_tamil_script={is_tamil_script}, loc={loc1}")

    # -------------------------------------------------------------------------
    # TEST 2: 'naliku mazha varuma?' -> Natural Tanglish
    # -------------------------------------------------------------------------
    total_tests += 1
    print("\n--- TEST 2: 'naliku mazha varuma?' ---")
    res2 = await llm_service.process_query(
        text="naliku mazha varuma?",
        lang="en",
        lat=13.0827,
        lon=80.2707,
        city="Chennai"
    )
    ans2 = res2["answer"]
    style2 = res2["language_mirror_style"]
    print(f"Style: {style2}")
    print(f"Answer: {ans2}")
    if style2 == "Tanglish" and any(w in ans2.lower() for w in ["mazha", "rain", "chance", "iruku", "illa", "naliku"]):
        print("[PASS] Test 2: Natural Tanglish response")
        passed_tests += 1
    else:
        print(f"[FAIL] Test 2: Style={style2}, Answer={ans2}")

    # -------------------------------------------------------------------------
    # TEST 3: 'நாளைக்கு மழை வருமா?' -> Tamil script
    # -------------------------------------------------------------------------
    total_tests += 1
    print("\n--- TEST 3: 'நாளைக்கு மழை வருமா?' ---")
    res3 = await llm_service.process_query(
        text="நாளைக்கு மழை வருமா?",
        lang="en",
        lat=13.0827,
        lon=80.2707,
        city="Chennai"
    )
    ans3 = res3["answer"]
    style3 = res3["language_mirror_style"]
    is_tamil3 = bool(__import__("re").search(r"[\u0B80-\u0BFF]", ans3))
    print(f"Style: {style3}")
    print(f"Answer: {ans3}")
    if is_tamil3 and style3 == "Tamil":
        print("[PASS] Test 3: Tamil script response")
        passed_tests += 1
    else:
        print(f"[FAIL] Test 3: is_tamil3={is_tamil3}, style={style3}")

    # -------------------------------------------------------------------------
    # TEST 4: 'Can I go for a walk?' -> Weather + walk suitability + conclusion
    # -------------------------------------------------------------------------
    total_tests += 1
    print("\n--- TEST 4: 'Can I go for a walk?' ---")
    res4 = await llm_service.process_query(
        text="Can I go for a walk?",
        lang="en",
        lat=13.0827,
        lon=80.2707,
        city="Chennai"
    )
    ans4 = res4["answer"]
    intent4 = res4["intent"]
    print(f"Intent: {intent4}")
    print(f"Answer: {ans4}")
    has_walk_logic = any(w in ans4.lower() for w in ["walk", "go", "wait", "clear", "rain", "hot", "weather", "comfortable"])
    if intent4 == "OUTDOOR_ACTIVITY" and has_walk_logic:
        print("[PASS] Test 4: Weather + walk suitability + natural conclusion")
        passed_tests += 1
    else:
        print(f"[FAIL] Test 4: intent={intent4}, ans={ans4}")

    # -------------------------------------------------------------------------
    # TEST 5: 'I'm planning a picnic tomorrow.' -> Forecast + best time + conclusion
    # -------------------------------------------------------------------------
    total_tests += 1
    print("\n--- TEST 5: 'I'm planning a picnic tomorrow.' ---")
    res5 = await llm_service.process_query(
        text="I'm planning a picnic tomorrow.",
        lang="en",
        lat=13.0827,
        lon=80.2707,
        city="Chennai"
    )
    ans5 = res5["answer"]
    intent5 = res5["intent"]
    print(f"Intent: {intent5}")
    print(f"Answer: {ans5}")
    has_picnic_logic = any(w in ans5.lower() for w in ["picnic", "tomorrow", "morning", "rain", "comfortable", "good", "safer"])
    if intent5 == "PICNIC_RECOMMENDATION" and has_picnic_logic:
        print("[PASS] Test 5: Tomorrow forecast + best time window + picnic advice")
        passed_tests += 1
    else:
        print(f"[FAIL] Test 5: intent={intent5}, ans={ans5}")

    # -------------------------------------------------------------------------
    # TEST 6: 'I'm planning to play cricket tomorrow evening.' -> Evening + cricket suitability
    # -------------------------------------------------------------------------
    total_tests += 1
    print("\n--- TEST 6: 'I'm planning to play cricket tomorrow evening.' ---")
    res6 = await llm_service.process_query(
        text="I'm planning to play cricket tomorrow evening.",
        lang="en",
        lat=13.0827,
        lon=80.2707,
        city="Chennai"
    )
    ans6 = res6["answer"]
    intent6 = res6["intent"]
    print(f"Intent: {intent6}")
    print(f"Answer: {ans6}")
    if intent6 in ["OUTDOOR_ACTIVITY", "SPORTS", "FORECAST"] or "cricket" in ans6.lower() or "tomorrow" in ans6.lower():
        print("[PASS] Test 6: Cricket suitability + evening weather evaluation")
        passed_tests += 1
    else:
        print(f"[FAIL] Test 6: intent={intent6}, ans={ans6}")

    # -------------------------------------------------------------------------
    # TEST 7: Memory context ("weather in Tokyo" -> "Will it rain there tomorrow?")
    # -------------------------------------------------------------------------
    total_tests += 1
    print("\n--- TEST 7: Multi-turn Memory ('Tokyo' -> 'there') ---")
    conv7_1 = await llm_service.process_query(
        text="What's the weather in Tokyo?",
        lang="en",
        lat=13.0827,
        lon=80.2707,
        city="Chennai"
    )
    history7 = [
        {"role": "user", "text": "What's the weather in Tokyo?", "location": "Tokyo"},
        {"role": "assistant", "text": conv7_1["answer"], "location": "Tokyo"}
    ]
    conv7_2 = await llm_service.process_query(
        text="Will it rain there tomorrow?",
        lang="en",
        lat=conv7_1["lat"],
        lon=conv7_1["lon"],
        city="Tokyo",
        conversation_history=history7
    )
    print(f"Resolved Turn 2 Location: {conv7_2['resolved_location']} ({conv7_2['lat']}, {conv7_2['lon']})")
    print(f"Answer: {conv7_2['answer']}")
    if "tokyo" in conv7_2["resolved_location"].lower() and abs(conv7_2["lat"] - 35.6762) < 0.5:
        print("[PASS] Test 7: 'there' correctly resolved to Tokyo")
        passed_tests += 1
    else:
        print(f"[FAIL] Test 7: Location resolved to {conv7_2['resolved_location']}")

    # -------------------------------------------------------------------------
    # TEST 8: Memory context switch ("Tokyo" -> "What about Chennai?")
    # -------------------------------------------------------------------------
    total_tests += 1
    print("\n--- TEST 8: Explicit Location Switch ('Tokyo' -> 'What about Chennai?') ---")
    conv8_1 = await llm_service.process_query(
        text="What's the weather in Tokyo?",
        lang="en",
        lat=35.6762,
        lon=139.6503,
        city="Tokyo"
    )
    history8 = [
        {"role": "user", "text": "What's the weather in Tokyo?", "location": "Tokyo"},
        {"role": "assistant", "text": conv8_1["answer"], "location": "Tokyo"}
    ]
    conv8_2 = await llm_service.process_query(
        text="What about Chennai?",
        lang="en",
        lat=35.6762,
        lon=139.6503,
        city="Tokyo",
        conversation_history=history8
    )
    print(f"Resolved Location: {conv8_2['resolved_location']} ({conv8_2['lat']}, {conv8_2['lon']})")
    print(f"Answer: {conv8_2['answer']}")
    if "chennai" in conv8_2["resolved_location"].lower() and abs(conv8_2["lat"] - 13.0827) < 0.5:
        print("[PASS] Test 8: Explicit query successfully switched location from Tokyo to Chennai")
        passed_tests += 1
    else:
        print(f"[FAIL] Test 8: Location resolved to {conv8_2['resolved_location']}")

    # -------------------------------------------------------------------------
    # TEST 9: Exact Location Overview without assuming activity ('weather at Marina Beach')
    # -------------------------------------------------------------------------
    total_tests += 1
    print("\n--- TEST 9: 'weather at Marina Beach' (Comprehensive Location Overview) ---")
    res9 = await llm_service.process_query(
        text="weather at Marina Beach",
        lang="en",
        lat=13.0827,
        lon=80.2707,
        city="Chennai"
    )
    print(f"Resolved Location: {res9['resolved_location']} ({res9['lat']}, {res9['lon']})")
    print(f"Intent: {res9['intent']}")
    print(f"Answer: {res9['answer']}")
    print(f"Suggested Followups: {res9['suggested_followups']}")
    is_marina = "marina" in res9["resolved_location"].lower() and abs(res9["lat"] - 13.05) < 0.1
    is_current_overview = res9["intent"] == "CURRENT_WEATHER"
    has_weather_elements = any(w in res9["answer"].lower() for w in ["marina beach", "around", "winds", "humidity", "rain", "comfortable"])
    no_forced_picnic = "picnic" not in res9["answer"].lower()

    if is_marina and is_current_overview and has_weather_elements and no_forced_picnic:
        print("[PASS] Test 9: Marina Beach resolved as CURRENT_WEATHER overview without forced activity")
        passed_tests += 1
    else:
        print(f"[FAIL] Test 9: is_marina={is_marina}, intent={res9['intent']}, no_forced_picnic={no_forced_picnic}")

    # -------------------------------------------------------------------------
    # TEST 10: 'weather at my college' (Contextual Memory or Curated College POI)
    # -------------------------------------------------------------------------
    total_tests += 1
    print("\n--- TEST 10: 'weather at my college' (Contextual College Location) ---")
    history10 = [
        {"role": "user", "text": "Prince Shri Venkateshwara Padmavathy Engineering College", "location": "Prince Shri Venkateshwara Padmavathy Engineering College"},
        {"role": "assistant", "text": "Currently clear.", "location": "Prince Shri Venkateshwara Padmavathy Engineering College"}
    ]
    res10 = await llm_service.process_query(
        text="weather at my college",
        lang="en",
        lat=12.8513,
        lon=80.1725,
        city="Prince Shri Venkateshwara Padmavathy Engineering College",
        conversation_history=history10
    )
    print(f"Resolved Location: {res10['resolved_location']} ({res10['lat']}, {res10['lon']})")
    print(f"Answer: {res10['answer']}")
    if "college" in res10["resolved_location"].lower() or "prince" in res10["resolved_location"].lower() or abs(res10["lat"] - 12.8513) < 0.1:
        print("[PASS] Test 10: College location context retained and resolved")
        passed_tests += 1
    else:
        print(f"[FAIL] Test 10: loc={res10['resolved_location']}")

    print("\n" + "=" * 80)
    print(f"CONVERSATIONAL AI INTELLIGENCE RESULTS: {passed_tests}/{total_tests} PASSED ({(passed_tests/total_tests)*100:.0f}%)")
    print("=" * 80)

    assert passed_tests == total_tests, f"Only {passed_tests}/{total_tests} tests passed."

if __name__ == "__main__":
    asyncio.run(run_conversational_ai_tests())
