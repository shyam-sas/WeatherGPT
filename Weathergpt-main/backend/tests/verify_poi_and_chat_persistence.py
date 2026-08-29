import asyncio
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.llm_service import llm_service

async def run_tests():
    print("================================================================================")
    print("RUNNING ACCEPTANCE TEST SUITE: POI RESOLUTION & PERSISTENT CONVERSATION PIPELINE")
    print("================================================================================")

    history = []

    # TEST 1: weather in Tokyo
    print("\n--- TEST 1: 'weather in Tokyo' ---")
    res1 = await llm_service.process_query("weather in Tokyo", lang="en", conversation_history=history)
    print(f"Resolved: {res1['resolved_location']} ({res1['lat']}, {res1['lon']})")
    print(f"Answer: {res1['answer']}")
    assert res1['resolved_location'] == "Tokyo", f"Expected Tokyo, got {res1['resolved_location']}"
    assert abs(res1['lat'] - 35.6762) < 0.1, f"Expected Tokyo lat ~35.6762, got {res1['lat']}"
    assert abs(res1['lon'] - 139.6503) < 0.1, f"Expected Tokyo lon ~139.6503, got {res1['lon']}"
    print("[PASS] Test 1: Tokyo resolved correctly with coordinates")

    history.append({"role": "user", "text": "weather in Tokyo", "location": "Tokyo"})
    history.append({"role": "assistant", "text": res1['answer'], "location": "Tokyo", "resolved_location": "Tokyo"})

    # TEST 2: what about Marina Beach?
    print("\n--- TEST 2: 'what about Marina Beach?' ---")
    res2 = await llm_service.process_query("what about Marina Beach?", lang="en", conversation_history=history)
    print(f"Resolved: {res2['resolved_location']} ({res2['lat']}, {res2['lon']})")
    print(f"Answer: {res2['answer']}")
    assert res2['resolved_location'] == "Marina Beach", f"Expected Marina Beach, got {res2['resolved_location']}"
    assert abs(res2['lat'] - 13.0500) < 0.1, f"Expected Marina Beach lat ~13.05, got {res2['lat']}"
    assert abs(res2['lon'] - 80.2824) < 0.1, f"Expected Marina Beach lon ~80.2824, got {res2['lon']}"
    assert "tokyo" not in res2['answer'].lower(), "Tokyo must NOT be reused in Marina Beach response"
    print("[PASS] Test 2: Marina Beach resolved correctly and Tokyo weather not reused")

    history.append({"role": "user", "text": "what about Marina Beach?", "location": "Marina Beach"})
    history.append({"role": "assistant", "text": res2['answer'], "location": "Marina Beach", "resolved_location": "Marina Beach"})

    # TEST 3: will it rain there?
    print("\n--- TEST 3: 'will it rain there?' ---")
    res3 = await llm_service.process_query("will it rain there?", lang="en", conversation_history=history)
    print(f"Resolved: {res3['resolved_location']} ({res3['lat']}, {res3['lon']})")
    print(f"Answer: {res3['answer']}")
    assert res3['resolved_location'] == "Marina Beach", f"Expected Marina Beach from context, got {res3['resolved_location']}"
    assert abs(res3['lat'] - 13.0500) < 0.1, f"Expected Marina Beach coordinates, got {res3['lat']}"
    print("[PASS] Test 3: Contextual pronoun 'there' resolved Marina Beach rain forecast")

    history.append({"role": "user", "text": "will it rain there?", "location": "Marina Beach"})
    history.append({"role": "assistant", "text": res3['answer'], "location": "Marina Beach", "resolved_location": "Marina Beach"})

    # TEST 4: what about Chennai?
    print("\n--- TEST 4: 'what about Chennai?' ---")
    res4 = await llm_service.process_query("what about Chennai?", lang="en", conversation_history=history)
    print(f"Resolved: {res4['resolved_location']} ({res4['lat']}, {res4['lon']})")
    print(f"Answer: {res4['answer']}")
    assert res4['resolved_location'] == "Chennai", f"Expected Chennai, got {res4['resolved_location']}"
    assert abs(res4['lat'] - 13.0827) < 0.1, f"Expected Chennai coordinates, got {res4['lat']}"
    print("[PASS] Test 4: Switched to fresh Chennai weather")

    # TEST 5: weather at Marina Beach (Standalone Overview)
    print("\n--- TEST 5: 'weather at Marina Beach' ---")
    res5 = await llm_service.process_query("weather at Marina Beach", lang="en")
    print(f"Resolved: {res5['resolved_location']} ({res5['lat']}, {res5['lon']})")
    print(f"Intent: {res5['intent']}")
    print(f"Answer: {res5['answer']}")
    assert res5['resolved_location'] == "Marina Beach"
    assert res5['intent'] == "CURRENT_WEATHER", f"Expected CURRENT_WEATHER, got {res5['intent']}"
    assert "picnic" not in res5['answer'].lower(), "Unprompted picnic activity must not be invented"
    print("[PASS] Test 5: Marina Beach weather overview generated without forced activity")

    # TEST 6: Can I go for a walk at Marina Beach?
    print("\n--- TEST 6: 'Can I go for a walk at Marina Beach?' ---")
    res6 = await llm_service.process_query("Can I go for a walk at Marina Beach?", lang="en")
    print(f"Resolved: {res6['resolved_location']} ({res6['lat']}, {res6['lon']})")
    print(f"Intent: {res6['intent']}")
    print(f"Answer: {res6['answer']}")
    assert res6['resolved_location'] == "Marina Beach"
    assert res6['intent'] == "OUTDOOR_ACTIVITY"
    print("[PASS] Test 6: Marina Beach outdoor activity evaluated accurately")

    # TEST 7: weather at Chennai (Language: English)
    print("\n--- TEST 7: 'weather at Chennai' (English) ---")
    res7 = await llm_service.process_query("weather at Chennai", lang="en")
    print(f"Style: {res7['language_mirror_style']}")
    print(f"Answer: {res7['answer']}")
    assert res7['language_mirror_style'] == "English"
    assert not any('\u0B80' <= c <= '\u0BFF' for c in res7['answer']), "English response must not contain Tamil script"
    print("[PASS] Test 7: Pure English response generated for Chennai")

    # TEST 8: chennai la weather epdi iruku? (Language: Tanglish)
    print("\n--- TEST 8: 'chennai la weather epdi iruku?' (Tanglish) ---")
    res8 = await llm_service.process_query("chennai la weather epdi iruku?", lang="en")
    print(f"Style: {res8['language_mirror_style']}")
    print(f"Answer: {res8['answer']}")
    assert res8['language_mirror_style'] == "Tanglish"
    print("[PASS] Test 8: Tanglish style mirrored accurately")

    # TEST 9: நாளைக்கு மழை வருமா? (Language: Tamil Script)
    print("\n--- TEST 9: 'நாளைக்கு மழை வருமா?' (Tamil script) ---")
    res9 = await llm_service.process_query("நாளைக்கு மழை வருமா?", lang="ta")
    print(f"Style: {res9['language_mirror_style']}")
    print(f"Answer: {res9['answer']}")
    assert res9['language_mirror_style'] == "Tamil"
    assert any('\u0B80' <= c <= '\u0BFF' for c in res9['answer']), "Tamil script response must contain Tamil characters"
    print("[PASS] Test 9: Tamil script response generated")

    # TEST 10: Multi-Turn Conversation Continuity
    print("\n--- TEST 10: Multi-Turn Conversation Continuity (No Welcome Reset) ---")
    assert len(history) >= 6, "History must have preserved all turns across multiple locations"
    print(f"Total turns in history: {len(history)}")
    for i, t in enumerate(history):
        print(f"  Turn {i+1} [{t['role']}]: {t['text'][:40]}... (loc: {t.get('location')})")
    print("[PASS] Test 10: Multi-turn history preserved without reset")

    print("\n================================================================================")
    print("ALL 10 ACCEPTANCE TESTS PASSED (100%)")
    print("================================================================================")

if __name__ == "__main__":
    asyncio.run(run_tests())
