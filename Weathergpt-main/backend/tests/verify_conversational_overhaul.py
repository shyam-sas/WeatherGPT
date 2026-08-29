import asyncio
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from app.services.llm_service import llm_service

async def run_conversational_tests():
    print("=" * 80)
    print("WEATHERGPT -- CONVERSATIONAL INTELLIGENCE & MULTI-TURN MEMORY OVERHAUL")
    print("=" * 80)

    passed = 0
    total = 21

    # =========================================================================
    # PART 1: 7-TURN CHAT MEMORY SEQUENCE (SECTION 30)
    # =========================================================================
    history = []

    # Turn 1: "weather at Chennai"
    print("\n--- TURN 1: 'weather at Chennai' ---")
    t1 = await llm_service.process_query(text="weather at Chennai", conversation_history=history, city="Chennai")
    print(f"Answer: {t1['answer']}")
    print(f"Resolved Location: {t1['resolved_location']}, Language: {t1['language_code']}, Style: {t1.get('language_mirror_style')}")
    assert t1['resolved_location'] == "Chennai" and t1['language_code'] == "en"
    history.append({"role": "user", "text": "weather at Chennai", "location": t1['resolved_location']})
    history.append({"role": "assistant", "text": t1['answer'], "location": t1['resolved_location']})
    passed += 1
    print("[PASS] Turn 1: Chennai weather in English")

    # Turn 2: "tomorrow?"
    print("\n--- TURN 2: 'tomorrow?' ---")
    t2 = await llm_service.process_query(text="tomorrow?", conversation_history=history, city="Chennai")
    print(f"Answer: {t2['answer']}")
    print(f"Resolved Location: {t2['resolved_location']}, Intent: {t2['intent']}, Language: {t2['language_code']}")
    assert t2['resolved_location'] == "Chennai" and t2['intent'] == "FORECAST" and t2['language_code'] == "en"
    history.append({"role": "user", "text": "tomorrow?", "location": t2['resolved_location']})
    history.append({"role": "assistant", "text": t2['answer'], "location": t2['resolved_location']})
    passed += 1
    print("[PASS] Turn 2: Tomorrow forecast for Chennai")

    # Turn 3: "morning?"
    print("\n--- TURN 3: 'morning?' ---")
    t3 = await llm_service.process_query(text="morning?", conversation_history=history, city="Chennai")
    print(f"Answer: {t3['answer']}")
    print(f"Resolved Location: {t3['resolved_location']}, Language: {t3['language_code']}")
    assert t3['resolved_location'] == "Chennai" and t3['language_code'] == "en"
    history.append({"role": "user", "text": "morning?", "location": t3['resolved_location']})
    history.append({"role": "assistant", "text": t3['answer'], "location": t3['resolved_location']})
    passed += 1
    print("[PASS] Turn 3: Tomorrow morning in Chennai")

    # Turn 4: "picnic polaama?"
    print("\n--- TURN 4: 'picnic polaama?' ---")
    t4 = await llm_service.process_query(text="picnic polaama?", conversation_history=history, city="Chennai")
    print(f"Answer: {t4['answer']}")
    print(f"Resolved Location: {t4['resolved_location']}, Intent: {t4['intent']}, Style: {t4.get('language_mirror_style')}")
    assert t4['resolved_location'] == "Chennai" and t4['intent'] == "PICNIC_RECOMMENDATION" and t4.get('language_mirror_style') == "Tanglish"
    history.append({"role": "user", "text": "picnic polaama?", "location": t4['resolved_location']})
    history.append({"role": "assistant", "text": t4['answer'], "location": t4['resolved_location']})
    passed += 1
    print("[PASS] Turn 4: Tanglish picnic recommendation for Chennai tomorrow morning")

    # Turn 5: "what about Tokyo?"
    print("\n--- TURN 5: 'what about Tokyo?' ---")
    t5 = await llm_service.process_query(text="what about Tokyo?", conversation_history=history, city="Chennai")
    print(f"Answer: {t5['answer']}")
    print(f"Resolved Location: {t5['resolved_location']}, Language: {t5['language_code']}, Style: {t5.get('language_mirror_style')}")
    assert "tokyo" in t5['resolved_location'].lower() and t5['language_code'] == "en"
    history.append({"role": "user", "text": "what about Tokyo?", "location": t5['resolved_location']})
    history.append({"role": "assistant", "text": t5['answer'], "location": t5['resolved_location']})
    passed += 1
    print("[PASS] Turn 5: Tokyo weather overrides Chennai context")

    # Turn 6: "tomorrow?"
    print("\n--- TURN 6: 'tomorrow?' (Tokyo context) ---")
    t6 = await llm_service.process_query(text="tomorrow?", conversation_history=history, city="Tokyo")
    print(f"Answer: {t6['answer']}")
    print(f"Resolved Location: {t6['resolved_location']}, Intent: {t6['intent']}")
    assert "tokyo" in t6['resolved_location'].lower() and t6['intent'] == "FORECAST"
    history.append({"role": "user", "text": "tomorrow?", "location": t6['resolved_location']})
    history.append({"role": "assistant", "text": t6['answer'], "location": t6['resolved_location']})
    passed += 1
    print("[PASS] Turn 6: Tokyo tomorrow forecast retained")

    # Turn 7: "anga mazha varuma?"
    print("\n--- TURN 7: 'anga mazha varuma?' (Tokyo context) ---")
    t7 = await llm_service.process_query(text="anga mazha varuma?", conversation_history=history, city="Tokyo")
    print(f"Answer: {t7['answer']}")
    print(f"Resolved Location: {t7['resolved_location']}, Style: {t7.get('language_mirror_style')}")
    assert "tokyo" in t7['resolved_location'].lower() and t7.get('language_mirror_style') == "Tanglish"
    passed += 1
    print("[PASS] Turn 7: 'anga' binds to Tokyo and answers in Tanglish")

    # =========================================================================
    # PART 2: ACTIVITY & REASONING QUERIES (SECTION 32 & 33)
    # =========================================================================
    print("\n--- TEST 8: 'shall I go for a walk now?' ---")
    r8 = await llm_service.process_query(text="shall I go for a walk now?", city="Chennai")
    print(f"Answer: {r8['answer']}")
    assert r8['intent'] == "OUTDOOR_ACTIVITY" and ("walk" in r8['answer'].lower() or "wait" in r8['answer'].lower())
    passed += 1
    print("[PASS] Test 8: English walk recommendation")

    print("\n--- TEST 9: 'can I go outside now?' ---")
    r9 = await llm_service.process_query(text="can I go outside now?", city="Chennai")
    print(f"Answer: {r9['answer']}")
    assert r9['intent'] == "OUTDOOR_ACTIVITY"
    passed += 1
    print("[PASS] Test 9: Outdoor recommendation")

    print("\n--- TEST 10: 'is today good for a picnic?' ---")
    r10 = await llm_service.process_query(text="is today good for a picnic?", city="Chennai")
    print(f"Answer: {r10['answer']}")
    assert r10['intent'] == "PICNIC_RECOMMENDATION"
    passed += 1
    print("[PASS] Test 10: Picnic recommendation")

    print("\n--- TEST 11: 'should I play cricket this evening?' ---")
    r11 = await llm_service.process_query(text="should I play cricket this evening?", city="Chennai")
    print(f"Answer: {r11['answer']}")
    assert r11['intent'] == "OUTDOOR_ACTIVITY"
    passed += 1
    print("[PASS] Test 11: Sports recommendation")

    print("\n--- TEST 12: 'umbrella venuma?' ---")
    r12 = await llm_service.process_query(text="umbrella venuma?", city="Chennai")
    print(f"Answer: {r12['answer']}")
    assert r12['intent'] == "UMBRELLA_ADVICE" and r12.get('language_mirror_style') == "Tanglish"
    passed += 1
    print("[PASS] Test 12: Tanglish umbrella advice")

    print("\n--- TEST 13: 'naliku outing polaama?' ---")
    r13 = await llm_service.process_query(text="naliku outing polaama?", city="Chennai")
    print(f"Answer: {r13['answer']}")
    assert r13['intent'] == "PICNIC_RECOMMENDATION" and r13.get('language_mirror_style') == "Tanglish"
    passed += 1
    print("[PASS] Test 13: Tanglish outing recommendation")

    print("\n--- TEST 14: 'tomorrow beach pogalama?' ---")
    r14 = await llm_service.process_query(text="tomorrow beach pogalama?", city="Chennai")
    print(f"Answer: {r14['answer']}")
    assert r14['intent'] == "PICNIC_RECOMMENDATION" and r14.get('language_mirror_style') == "Tanglish"
    passed += 1
    print("[PASS] Test 14: Tanglish beach recommendation")

    print("\n--- TEST 15: 'what time?' (time recommendation) ---")
    r15 = await llm_service.process_query(text="what time?", city="Chennai")
    print(f"Answer: {r15['answer']}")
    assert r15['intent'] == "TIME_RECOMMENDATION" and ("8–11" in r15['answer'] or "morning" in r15['answer'].lower())
    passed += 1
    print("[PASS] Test 15: Time-of-day recommendation")

    print("\n--- TEST 16: 'what should I wear?' ---")
    r16 = await llm_service.process_query(text="what should I wear?", city="Chennai")
    print(f"Answer: {r16['answer']}")
    assert r16['intent'] == "CLOTHING_ADVICE"
    passed += 1
    print("[PASS] Test 16: Clothing advice")

    # =========================================================================
    # PART 3: LANGUAGE SWITCHING SEQUENCE (SECTION 31)
    # =========================================================================
    print("\n--- TEST 17: 'weather at Chennai' -> English ---")
    s17 = await llm_service.process_query(text="weather at Chennai", city="Chennai")
    assert s17['language_code'] == "en" and s17.get('language_mirror_style') == "English"
    passed += 1
    print("[PASS] Test 17: English")

    print("\n--- TEST 18: 'naliku mazha varuma?' -> Tanglish ---")
    s18 = await llm_service.process_query(text="naliku mazha varuma?", city="Chennai")
    assert s18['language_code'] == "ta" and s18.get('language_mirror_style') == "Tanglish"
    passed += 1
    print("[PASS] Test 18: Tanglish")

    print("\n--- TEST 19: 'நாளைக்கு எப்படி இருக்கும்?' -> Tamil ---")
    s19 = await llm_service.process_query(text="நாளைக்கு எப்படி இருக்கும்?", city="Chennai")
    assert s19['language_code'] == "ta" and s19.get('language_mirror_style') == "Tamil"
    assert any('\u0B80' <= c <= '\u0BFF' for c in s19['answer'])
    passed += 1
    print("[PASS] Test 19: Tamil script")

    print("\n--- TEST 20: 'what about Tokyo?' -> English ---")
    s20 = await llm_service.process_query(text="what about Tokyo?", city="Tokyo")
    assert s20['language_code'] == "en" and s20.get('language_mirror_style') == "English"
    passed += 1
    print("[PASS] Test 20: English")

    print("\n--- TEST 21: 'kal baarish hogi kya?' -> Hinglish ---")
    s21 = await llm_service.process_query(text="kal baarish hogi kya?", city="Delhi")
    assert s21['language_code'] == "hi" and s21.get('language_mirror_style') == "Hinglish"
    passed += 1
    print("[PASS] Test 21: Hinglish")

    print("\n" + "=" * 80)
    print(f"ALL 21 CONVERSATIONAL OVERHAUL TESTS COMPLETED: {passed}/{total} PASSED (100%)")
    print("=" * 80)

if __name__ == "__main__":
    asyncio.run(run_conversational_tests())
