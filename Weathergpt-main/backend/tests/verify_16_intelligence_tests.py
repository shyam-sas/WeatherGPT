import asyncio
import sys
import os

# Ensure backend directory is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from app.services.llm_service import llm_service
from app.services.weather_service import weather_service

async def run_16_tests():
    print("=" * 80)
    print("WEATHERGPT -- 16 COMPREHENSIVE INTELLIGENCE & REASONING TESTS")
    print("=" * 80)

    passed = 0
    total = 16

    # TEST 1: "weather in Tokyo"
    print("\n--- TEST 1: 'weather in Tokyo' ---")
    res1 = await llm_service.process_query(text="weather in Tokyo", city="Pallavaram")
    print(f"Answer: {res1['answer']}")
    print(f"Resolved Location: {res1['resolved_location']} ({res1['lat']}, {res1['lon']})")
    assert "tokyo" in res1['resolved_location'].lower() and abs(res1['lat'] - 35.67) < 1.0
    print("[PASS] TEST 1: Tokyo resolved independently")
    passed += 1

    # TEST 2: "weather in Chennai"
    print("\n--- TEST 2: 'weather in Chennai' ---")
    res2 = await llm_service.process_query(text="weather in Chennai", city="Tokyo")
    print(f"Answer: {res2['answer']}")
    print(f"Resolved Location: {res2['resolved_location']} ({res2['lat']}, {res2['lon']})")
    assert "chennai" in res2['resolved_location'].lower() and abs(res2['lat'] - 13.08) < 0.5
    print("[PASS] TEST 2: Chennai resolved independently")
    passed += 1

    # TEST 3: "weather in Tiruppur"
    print("\n--- TEST 3: 'weather in Tiruppur' ---")
    res3 = await llm_service.process_query(text="weather in Tiruppur", city="Pallavaram")
    print(f"Answer: {res3['answer']}")
    print(f"Resolved Location: {res3['resolved_location']} ({res3['lat']}, {res3['lon']})")
    assert "tiruppur" in res3['resolved_location'].lower() or "tirupur" in res3['resolved_location'].lower()
    assert abs(res3['lat'] - 11.1) < 0.5
    print("[PASS] TEST 3: Tiruppur resolved independently")
    passed += 1

    # TEST 4: "naliku adyar la weather epdi irukum" (Adyar, Tomorrow, Tanglish, NOT Tiruppur)
    print("\n--- TEST 4: 'naliku adyar la weather epdi irukum' ---")
    res4 = await llm_service.process_query(text="naliku adyar la weather epdi irukum", city="Tiruppur")
    print(f"Answer: {res4['answer']}")
    print(f"Resolved Location: {res4['resolved_location']} ({res4['lat']}, {res4['lon']})")
    print(f"Intent: {res4['intent']}, Style: {res4.get('language_mirror_style')}")
    assert "adyar" in res4['resolved_location'].lower()
    assert "tiruppur" not in res4['resolved_location'].lower()
    assert abs(res4['lat'] - 13.00) < 0.2
    assert res4.get('language_mirror_style') == "Tanglish"
    print("[PASS] TEST 4: Adyar extracted, resolved to Adyar coords, not Tiruppur")
    passed += 1

    # TEST 5: "shall I go for a walk now" (Activity Recommendation)
    print("\n--- TEST 5: 'shall I go for a walk now' ---")
    res5 = await llm_service.process_query(text="shall I go for a walk now", city="Chennai")
    print(f"Answer: {res5['answer']}")
    print(f"Intent: {res5['intent']}")
    assert res5['intent'] == "OUTDOOR_ACTIVITY"
    assert "Current Weather in" not in res5['answer']
    assert any(w in res5['answer'].lower() for w in ["walk", "go", "weather", "comfortable", "rain", "hot", "wait", "yes", "yeah"])
    print("[PASS] TEST 5: Activity recommendation provided instead of generic weather report")
    passed += 1

    # TEST 6: "walk polaama ippo?" (Tanglish Activity Recommendation)
    print("\n--- TEST 6: 'walk polaama ippo?' ---")
    res6 = await llm_service.process_query(text="walk polaama ippo?", city="Chennai")
    print(f"Answer: {res6['answer']}")
    print(f"Intent: {res6['intent']}, Style: {res6.get('language_mirror_style')}")
    assert res6['intent'] == "OUTDOOR_ACTIVITY"
    assert res6.get('language_mirror_style') == "Tanglish"
    assert any(w in res6['answer'].lower() for w in ["polaam", "weather", "iruku", "wait", "hot", "rain", "comfortable"])
    print("[PASS] TEST 6: Tanglish walk recommendation provided")
    passed += 1

    # TEST 7: "naliku mazha varuma?" (Tanglish Rain Forecast)
    print("\n--- TEST 7: 'naliku mazha varuma?' ---")
    res7 = await llm_service.process_query(text="naliku mazha varuma?", city="Chennai")
    print(f"Answer: {res7['answer']}")
    print(f"Intent: {res7['intent']}, Style: {res7.get('language_mirror_style')}")
    assert res7['intent'] == "RAIN_FORECAST"
    assert res7.get('language_mirror_style') == "Tanglish"
    print("[PASS] TEST 7: Tanglish rain forecast verified")
    passed += 1

    # TEST 8: "umbrella eduthutu poganuma?" (Umbrella Advice)
    print("\n--- TEST 8: 'umbrella eduthutu poganuma?' ---")
    res8 = await llm_service.process_query(text="umbrella eduthutu poganuma?", city="Chennai")
    print(f"Answer: {res8['answer']}")
    print(f"Intent: {res8['intent']}, Style: {res8.get('language_mirror_style')}")
    assert res8['intent'] == "UMBRELLA_ADVICE"
    assert any(w in res8['answer'].lower() for w in ["umbrella", "rain", "better", "theva", "chance"])
    print("[PASS] TEST 8: Grounded umbrella recommendation verified")
    passed += 1

    # TEST 9: "நாளைக்கு மழை வருமா?" (Tamil script)
    print("\n--- TEST 9: 'நாளைக்கு மழை வருமா?' ---")
    res9 = await llm_service.process_query(text="நாளைக்கு மழை வருமா?", city="Chennai")
    print(f"Answer: {res9['answer']}")
    print(f"Language: {res9['language_code']}, Style: {res9.get('language_mirror_style')}")
    assert res9['language_code'] == "ta"
    assert any('\u0B80' <= c <= '\u0BFF' for c in res9['answer'])
    print("[PASS] TEST 9: Tamil script response verified")
    passed += 1

    # TEST 10: "kal baarish hogi kya?" (Hinglish)
    print("\n--- TEST 10: 'kal baarish hogi kya?' ---")
    res10 = await llm_service.process_query(text="kal baarish hogi kya?", city="Delhi")
    print(f"Answer: {res10['answer']}")
    print(f"Style: {res10.get('language_mirror_style')}")
    assert res10.get('language_mirror_style') == "Hinglish"
    assert any(w in res10['answer'].lower() for w in ["kal", "baarish", "chances", "hain", "kam", "hogi"])
    print("[PASS] TEST 10: Hinglish response verified")
    passed += 1

    # TEST 11: "Will it rain tomorrow?" (English)
    print("\n--- TEST 11: 'Will it rain tomorrow?' ---")
    res11 = await llm_service.process_query(text="Will it rain tomorrow?", city="Chennai")
    print(f"Answer: {res11['answer']}")
    print(f"Style: {res11.get('language_mirror_style')}")
    assert res11.get('language_mirror_style') == "English"
    print("[PASS] TEST 11: English response verified")
    passed += 1

    # TEST 12: Context follow-up: "weather in Tokyo" -> "will it rain there?"
    print("\n--- TEST 12: Tokyo -> 'will it rain there?' ---")
    hist_tokyo = [
        {"role": "user", "text": "weather in Tokyo", "location": "Tokyo"},
        {"role": "assistant", "text": res1['answer'], "location": "Tokyo"}
    ]
    res12 = await llm_service.process_query(text="will it rain there?", conversation_history=hist_tokyo, city="Pallavaram")
    print(f"Answer: {res12['answer']}")
    print(f"Resolved Location: {res12['resolved_location']} ({res12['lat']}, {res12['lon']})")
    assert "tokyo" in res12['resolved_location'].lower() or abs(res12['lat'] - 35.67) < 1.0
    print("[PASS] TEST 12: 'there' correctly resolved to Tokyo from conversation history")
    passed += 1

    # TEST 13: Context shift: "what about Chennai?" after Tokyo
    print("\n--- TEST 13: 'what about Chennai?' after Tokyo context ---")
    hist_after_tokyo = hist_tokyo + [
        {"role": "user", "text": "will it rain there?", "location": "Tokyo"},
        {"role": "assistant", "text": res12['answer'], "location": "Tokyo"}
    ]
    res13 = await llm_service.process_query(text="what about Chennai?", conversation_history=hist_after_tokyo, city="Tokyo")
    print(f"Answer: {res13['answer']}")
    print(f"Resolved Location: {res13['resolved_location']} ({res13['lat']}, {res13['lon']})")
    assert "chennai" in res13['resolved_location'].lower() and abs(res13['lat'] - 13.08) < 0.5
    print("[PASS] TEST 13: 'what about Chennai?' strictly overrides Tokyo context")
    passed += 1

    # TEST 14: Short query: "weather in Chennai" -> "tomorrow?"
    print("\n--- TEST 14: Chennai -> 'tomorrow?' ---")
    hist_chennai = [
        {"role": "user", "text": "weather in Chennai", "location": "Chennai"},
        {"role": "assistant", "text": res2['answer'], "location": "Chennai"}
    ]
    res14 = await llm_service.process_query(text="tomorrow?", conversation_history=hist_chennai, city="Tokyo")
    print(f"Answer: {res14['answer']}")
    print(f"Resolved Location: {res14['resolved_location']} ({res14['lat']}, {res14['lon']})")
    print(f"Intent: {res14['intent']}")
    assert "chennai" in res14['resolved_location'].lower() and abs(res14['lat'] - 13.08) < 0.5
    assert res14['intent'] in ["FORECAST", "CURRENT_WEATHER"]
    print("[PASS] TEST 14: 'tomorrow?' inherits Chennai and retrieves forecast")
    passed += 1

    # TEST 15: Short query: "weather in Chennai" -> "mazha?"
    print("\n--- TEST 15: Chennai -> 'mazha?' ---")
    res15 = await llm_service.process_query(text="mazha?", conversation_history=hist_chennai, city="Tokyo")
    print(f"Answer: {res15['answer']}")
    print(f"Resolved Location: {res15['resolved_location']} ({res15['lat']}, {res15['lon']})")
    print(f"Intent: {res15['intent']}")
    assert "chennai" in res15['resolved_location'].lower() and abs(res15['lat'] - 13.08) < 0.5
    assert res15['intent'] == "RAIN_FORECAST"
    print("[PASS] TEST 15: 'mazha?' inherits Chennai and retrieves rain info")
    passed += 1

    # TEST 16: "weather at Prince Shri Venkateshwara Padmavathy Engineering College"
    print("\n--- TEST 16: 'weather at Prince Shri Venkateshwara Padmavathy Engineering College' ---")
    res16 = await llm_service.process_query(text="weather at Prince Shri Venkateshwara Padmavathy Engineering College", city="Pallavaram")
    print(f"Answer: {res16['answer']}")
    print(f"Resolved Location: {res16['resolved_location']} ({res16['lat']}, {res16['lon']})")
    assert "prince" in res16['resolved_location'].lower() or "padmavathy" in res16['resolved_location'].lower() or abs(res16['lat'] - 12.85) < 0.2
    print("[PASS] TEST 16: College institution POI resolved accurately")
    passed += 1

    print("\n" + "=" * 80)
    print(f"ALL 16 INTELLIGENCE & REASONING TESTS COMPLETED: {passed}/{total} PASSED (100%)")
    print("=" * 80)

if __name__ == "__main__":
    asyncio.run(run_16_tests())
