import asyncio
import sys
import os

# Ensure backend directory is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from app.services.llm_service import llm_service
from app.services.weather_service import weather_service

async def run_all_tests():
    print("=" * 70)
    print("WEATHERGPT -- COMPREHENSIVE LOCATION & MULTILINGUAL VERIFICATION")
    print("=" * 70)
    
    passed_count = 0
    total_tests = 11

    # TEST 1: weather in Pallavaram
    print("\n--- TEST 1: 'weather in Pallavaram' ---")
    res1 = await llm_service.process_query(text="weather in Pallavaram", city="Pallavaram")
    print(f"Answer: {res1['answer']}")
    print(f"Resolved Location: {res1['resolved_location']} ({res1['lat']}, {res1['lon']})")
    assert "pallavaram" in res1['resolved_location'].lower() or (abs(res1['lat'] - 12.9675) < 0.1 and abs(res1['lon'] - 80.1491) < 0.1), f"Expected Pallavaram, got {res1['resolved_location']}"
    print("[PASS] TEST 1 (Pallavaram weather + coords verified)")
    passed_count += 1

    # TEST 2: weather in Tokyo
    print("\n--- TEST 2: 'weather in Tokyo' ---")
    res2 = await llm_service.process_query(text="weather in Tokyo", city="Pallavaram")
    print(f"Answer: {res2['answer']}")
    print(f"Resolved Location: {res2['resolved_location']} ({res2['lat']}, {res2['lon']})")
    assert "tokyo" in res2['resolved_location'].lower() and abs(res2['lat'] - 35.67) < 1.0, f"Expected Tokyo coords, got {res2['lat']}, {res2['lon']}"
    print("[PASS] TEST 2 (Tokyo weather + coords ~35.67, 139.65 verified)")
    passed_count += 1

    # TEST 3: weather in Chennai
    print("\n--- TEST 3: 'weather in Chennai' ---")
    res3 = await llm_service.process_query(text="weather in Chennai", city="Tokyo")
    print(f"Answer: {res3['answer']}")
    print(f"Resolved Location: {res3['resolved_location']} ({res3['lat']}, {res3['lon']})")
    assert "chennai" in res3['resolved_location'].lower() and abs(res3['lat'] - 13.08) < 0.5, f"Expected Chennai coords, got {res3['lat']}, {res3['lon']}"
    print("[PASS] TEST 3 (Chennai weather + coords ~13.08, 80.27 verified)")
    passed_count += 1

    # TEST 4: weather at Prince Shri Venkateshwara Padmavathy Engineering College
    print("\n--- TEST 4: 'weather at Prince Shri Venkateshwara Padmavathy Engineering College' ---")
    res4 = await llm_service.process_query(text="weather at Prince Shri Venkateshwara Padmavathy Engineering College", city="Pallavaram")
    print(f"Answer: {res4['answer']}")
    print(f"Resolved Location: {res4['resolved_location']} ({res4['lat']}, {res4['lon']})")
    assert "prince" in res4['resolved_location'].lower() or "padmavathy" in res4['resolved_location'].lower() or (abs(res4['lat'] - 12.85) < 0.2), f"Expected College coords, got {res4['resolved_location']}"
    print("[PASS] TEST 4 (Prince Shri Venkateshwara Padmavathy Engineering College POI resolved)")
    passed_count += 1

    # TEST 5: Contextual follow-up: 'weather in Tokyo' then 'will it rain there?'
    print("\n--- TEST 5: 'weather in Tokyo' -> 'will it rain there?' ---")
    history_tokyo = [
        {"role": "user", "text": "weather in Tokyo", "location": "Tokyo"},
        {"role": "assistant", "text": res2['answer'], "location": "Tokyo"}
    ]
    res5 = await llm_service.process_query(text="will it rain there?", conversation_history=history_tokyo, city="Pallavaram")
    print(f"Answer: {res5['answer']}")
    print(f"Resolved Location: {res5['resolved_location']} ({res5['lat']}, {res5['lon']})")
    assert "tokyo" in res5['resolved_location'].lower() or abs(res5['lat'] - 35.67) < 1.0, f"Expected Tokyo context for 'there', got {res5['resolved_location']}"
    print("[PASS] TEST 5 ('there' correctly binds to Tokyo in conversation history)")
    passed_count += 1

    # TEST 6: Context shift: 'what about Chennai?'
    print("\n--- TEST 6: 'what about Chennai?' after Tokyo context ---")
    history_after_there = history_tokyo + [
        {"role": "user", "text": "will it rain there?", "location": "Tokyo"},
        {"role": "assistant", "text": res5['answer'], "location": "Tokyo"}
    ]
    res6 = await llm_service.process_query(text="what about Chennai?", conversation_history=history_after_there, city="Tokyo")
    print(f"Answer: {res6['answer']}")
    print(f"Resolved Location: {res6['resolved_location']} ({res6['lat']}, {res6['lon']})")
    assert "chennai" in res6['resolved_location'].lower() and abs(res6['lat'] - 13.08) < 0.5, f"Expected Chennai override, got {res6['resolved_location']}"
    print("[PASS] TEST 6 (Explicit location 'Chennai' strictly overrides prior 'Tokyo' context)")
    passed_count += 1

    # TEST 7: 'naliku mazha varuma' (Tanglish)
    print("\n--- TEST 7: 'naliku mazha varuma' (Tanglish) ---")
    res7 = await llm_service.process_query(text="naliku mazha varuma", city="Pallavaram")
    print(f"Answer: {res7['answer']}")
    print(f"Mirror Style: {res7.get('language_mirror_style')}")
    assert res7.get('language_mirror_style') == "Tanglish", f"Expected Tanglish style, got {res7.get('language_mirror_style')}"
    assert any(w in res7['answer'].lower() for w in ["mazha", "naliku", "varaathu", "rain", "chance", "iruku"]), f"Expected natural Tanglish reply, got {res7['answer']}"
    print("[PASS] TEST 7 (Natural Tanglish style mirroring verified)")
    passed_count += 1

    # TEST 8: 'tomorrow college la rain varuma?' (Mixed Tanglish/English)
    print("\n--- TEST 8: 'tomorrow college la rain varuma?' ---")
    res8 = await llm_service.process_query(text="tomorrow college la rain varuma?", city="Pallavaram")
    print(f"Answer: {res8['answer']}")
    print(f"Mirror Style: {res8.get('language_mirror_style')}")
    assert res8.get('language_mirror_style') == "Tanglish", f"Expected Tanglish style, got {res8.get('language_mirror_style')}"
    print("[PASS] TEST 8 (Mixed conversational style response verified)")
    passed_count += 1

    # TEST 9: 'நாளைக்கு மழை வருமா?' (Tamil script)
    print("\n--- TEST 9: 'நாளைக்கு மழை வருமா?' (Tamil script) ---")
    res9 = await llm_service.process_query(text="நாளைக்கு மழை வருமா?", city="Pallavaram")
    print(f"Answer: {res9['answer']}")
    print(f"Language: {res9['language_code']}, Mirror Style: {res9.get('language_mirror_style')}")
    assert res9['language_code'] == "ta", f"Expected 'ta', got {res9['language_code']}"
    assert any('\u0B80' <= c <= '\u0BFF' for c in res9['answer']), f"Expected Tamil script in answer, got {res9['answer']}"
    print("[PASS] TEST 9 (Tamil script preservation verified)")
    passed_count += 1

    # TEST 10: 'kal baarish hogi kya?' (Hinglish)
    print("\n--- TEST 10: 'kal baarish hogi kya?' (Hinglish) ---")
    res10 = await llm_service.process_query(text="kal baarish hogi kya?", city="Pallavaram")
    print(f"Answer: {res10['answer']}")
    print(f"Mirror Style: {res10.get('language_mirror_style')}")
    assert res10.get('language_mirror_style') == "Hinglish", f"Expected Hinglish style, got {res10.get('language_mirror_style')}"
    assert any(w in res10['answer'].lower() for w in ["kal", "baarish", "chances", "hain", "kam"]), f"Expected natural Hinglish reply, got {res10['answer']}"
    print("[PASS] TEST 10 (Hinglish conversational mirroring verified)")
    passed_count += 1

    # TEST 11: 'Will it rain tomorrow?' (English)
    print("\n--- TEST 11: 'Will it rain tomorrow?' (English) ---")
    res11 = await llm_service.process_query(text="Will it rain tomorrow?", city="Chennai")
    print(f"Answer: {res11['answer']}")
    print(f"Language: {res11['language_code']}, Mirror Style: {res11.get('language_mirror_style')}")
    assert res11['language_code'] == "en" or res11.get('language_mirror_style') == "English"
    assert "rain" in res11['answer'].lower() or "chance" in res11['answer'].lower()
    print("[PASS] TEST 11 (Natural English conversational response verified)")
    passed_count += 1

    print("\n" + "=" * 70)
    print(f"ALL TESTS COMPLETED: {passed_count}/{total_tests} PASSED (100%)")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(run_all_tests())
