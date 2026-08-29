import asyncio
import sys
import os

# Ensure backend directory is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from app.services.llm_service import llm_service

async def run_language_tests():
    print("=" * 80)
    print("WEATHERGPT -- COMPREHENSIVE LANGUAGE DETECTION & MIRRORING VERIFICATION")
    print("=" * 80)

    passed = 0
    total = 12

    # TEST 1: "weather at chennai" (English, NOT Tamil)
    print("\n--- TEST 1: 'weather at chennai' ---")
    res1 = await llm_service.process_query(text="weather at chennai", lang="ta", city="Chennai")
    print(f"Answer: {res1['answer']}")
    print(f"Language Code: {res1['language_code']}, Style: {res1.get('language_mirror_style')}")
    print(f"Resolved Location: {res1['resolved_location']}")
    assert res1['language_code'] == "en", f"Expected 'en', got {res1['language_code']}"
    assert res1.get('language_mirror_style') == "English", f"Expected 'English', got {res1.get('language_mirror_style')}"
    assert not any('\u0B80' <= c <= '\u0BFF' for c in res1['answer']), f"Answer contains unexpected Tamil script: {res1['answer']}"
    print("[PASS] TEST 1: 'weather at chennai' strictly responded in English with language='en'")
    passed += 1

    # TEST 2: "weather in Tokyo"
    print("\n--- TEST 2: 'weather in Tokyo' ---")
    res2 = await llm_service.process_query(text="weather in Tokyo", lang="ta", city="Pallavaram")
    print(f"Answer: {res2['answer']}")
    print(f"Language Code: {res2['language_code']}, Style: {res2.get('language_mirror_style')}")
    assert res2['language_code'] == "en" and res2.get('language_mirror_style') == "English"
    print("[PASS] TEST 2: 'weather in Tokyo' is English")
    passed += 1

    # TEST 3: "what is the weather in Chennai?"
    print("\n--- TEST 3: 'what is the weather in Chennai?' ---")
    res3 = await llm_service.process_query(text="what is the weather in Chennai?", lang="ta", city="Chennai")
    print(f"Answer: {res3['answer']}")
    print(f"Language Code: {res3['language_code']}, Style: {res3.get('language_mirror_style')}")
    assert res3['language_code'] == "en" and res3.get('language_mirror_style') == "English"
    print("[PASS] TEST 3: 'what is the weather in Chennai?' is English")
    passed += 1

    # TEST 4: "naliku mazha varuma?"
    print("\n--- TEST 4: 'naliku mazha varuma?' ---")
    res4 = await llm_service.process_query(text="naliku mazha varuma?", lang="en", city="Chennai")
    print(f"Answer: {res4['answer']}")
    print(f"Language Code: {res4['language_code']}, Style: {res4.get('language_mirror_style')}")
    assert res4['language_code'] == "ta" and res4.get('language_mirror_style') == "Tanglish"
    print("[PASS] TEST 4: 'naliku mazha varuma?' is Tanglish")
    passed += 1

    # TEST 5: "Chennai la weather epdi iruku?"
    print("\n--- TEST 5: 'Chennai la weather epdi iruku?' ---")
    res5 = await llm_service.process_query(text="Chennai la weather epdi iruku?", lang="en", city="Chennai")
    print(f"Answer: {res5['answer']}")
    print(f"Language Code: {res5['language_code']}, Style: {res5.get('language_mirror_style')}")
    assert res5['language_code'] == "ta" and res5.get('language_mirror_style') == "Tanglish"
    print("[PASS] TEST 5: 'Chennai la weather epdi iruku?' is Tanglish")
    passed += 1

    # TEST 6: "நாளைக்கு மழை வருமா?"
    print("\n--- TEST 6: 'நாளைக்கு மழை வருமா?' ---")
    res6 = await llm_service.process_query(text="நாளைக்கு மழை வருமா?", lang="en", city="Chennai")
    print(f"Answer: {res6['answer']}")
    print(f"Language Code: {res6['language_code']}, Style: {res6.get('language_mirror_style')}")
    assert res6['language_code'] == "ta" and res6.get('language_mirror_style') == "Tamil"
    assert any('\u0B80' <= c <= '\u0BFF' for c in res6['answer'])
    print("[PASS] TEST 6: Tamil script query responded in Tamil script")
    passed += 1

    # TEST 7: "kal baarish hogi kya?"
    print("\n--- TEST 7: 'kal baarish hogi kya?' ---")
    res7 = await llm_service.process_query(text="kal baarish hogi kya?", lang="en", city="Delhi")
    print(f"Answer: {res7['answer']}")
    print(f"Language Code: {res7['language_code']}, Style: {res7.get('language_mirror_style')}")
    assert res7['language_code'] == "hi" and res7.get('language_mirror_style') == "Hinglish"
    print("[PASS] TEST 7: 'kal baarish hogi kya?' is Hinglish")
    passed += 1

    # TEST 8: "tomorrow Chennai la rain varuma?"
    print("\n--- TEST 8: 'tomorrow Chennai la rain varuma?' ---")
    res8 = await llm_service.process_query(text="tomorrow Chennai la rain varuma?", lang="en", city="Chennai")
    print(f"Answer: {res8['answer']}")
    print(f"Language Code: {res8['language_code']}, Style: {res8.get('language_mirror_style')}")
    assert res8.get('language_mirror_style') == "Tanglish"
    print("[PASS] TEST 8: 'tomorrow Chennai la rain varuma?' is mixed Tanglish")
    passed += 1

    # TEST 9: Previous assistant response is Tamil, then user says "weather at Chennai"
    print("\n--- TEST 9: Tamil turn -> 'weather at Chennai' ---")
    history_tamil = [
        {"role": "user", "text": "சென்னையில் மழை வருமா?", "location": "Chennai"},
        {"role": "assistant", "text": "சென்னையில் நாளைக்கு மழை பெய்ய வாய்ப்புள்ளது.", "location": "Chennai"}
    ]
    res9 = await llm_service.process_query(text="weather at Chennai", conversation_history=history_tamil, city="Chennai")
    print(f"Answer: {res9['answer']}")
    print(f"Language Code: {res9['language_code']}, Style: {res9.get('language_mirror_style')}")
    assert res9['language_code'] == "en" and res9.get('language_mirror_style') == "English"
    assert not any('\u0B80' <= c <= '\u0BFF' for c in res9['answer'])
    print("[PASS] TEST 9: Prior Tamil conversation does not lock user's new English query")
    passed += 1

    # TEST 10: Previous assistant response is English, then user says "naliku mazha varuma?"
    print("\n--- TEST 10: English turn -> 'naliku mazha varuma?' ---")
    history_english = [
        {"role": "user", "text": "weather in Chennai", "location": "Chennai"},
        {"role": "assistant", "text": "Currently in Chennai, it's overcast at 29°C.", "location": "Chennai"}
    ]
    res10 = await llm_service.process_query(text="naliku mazha varuma?", conversation_history=history_english, city="Chennai")
    print(f"Answer: {res10['answer']}")
    print(f"Language Code: {res10['language_code']}, Style: {res10.get('language_mirror_style')}")
    assert res10['language_code'] == "ta" and res10.get('language_mirror_style') == "Tanglish"
    print("[PASS] TEST 10: Prior English conversation cleanly switches to Tanglish")
    passed += 1

    # TEST 11: "weather at Chennai" then "what about Tokyo?"
    print("\n--- TEST 11: 'weather at Chennai' -> 'what about Tokyo?' ---")
    history_c2t = [
        {"role": "user", "text": "weather at Chennai", "location": "Chennai"},
        {"role": "assistant", "text": res1['answer'], "location": "Chennai"}
    ]
    res11 = await llm_service.process_query(text="what about Tokyo?", conversation_history=history_c2t, city="Chennai")
    print(f"Answer: {res11['answer']}")
    print(f"Resolved Location: {res11['resolved_location']}")
    print(f"Language Code: {res11['language_code']}, Style: {res11.get('language_mirror_style')}")
    assert res11['language_code'] == "en" and res11.get('language_mirror_style') == "English"
    assert "tokyo" in res11['resolved_location'].lower()
    print("[PASS] TEST 11: Both turns remain English, location shifts to Tokyo")
    passed += 1

    # TEST 12: "weather at Chennai" then "anga mazha varuma?"
    print("\n--- TEST 12: 'weather at Chennai' -> 'anga mazha varuma?' ---")
    res12 = await llm_service.process_query(text="anga mazha varuma?", conversation_history=history_c2t, city="Chennai")
    print(f"Answer: {res12['answer']}")
    print(f"Resolved Location: {res12['resolved_location']}")
    print(f"Language Code: {res12['language_code']}, Style: {res12.get('language_mirror_style')}")
    assert res12['language_code'] == "ta" and res12.get('language_mirror_style') == "Tanglish"
    assert "chennai" in res12['resolved_location'].lower()
    print("[PASS] TEST 12: 'anga' binds to Chennai, response switches to Tanglish")
    passed += 1

    print("\n" + "=" * 80)
    print(f"ALL 12 LANGUAGE TESTS COMPLETED: {passed}/{total} PASSED (100%)")
    print("=" * 80)

if __name__ == "__main__":
    asyncio.run(run_language_tests())
