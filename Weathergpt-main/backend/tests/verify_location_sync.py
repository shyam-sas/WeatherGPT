import asyncio
import httpx
import sys

# Ensure UTF-8 output encoding for Windows terminal
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000"

async def test_location_synchronization():
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=12.0) as client:
        # 1. Register test session
        auth_res = await client.post("/api/onboarding", json={
            "device_id": "test_loc_sync_device_999",
            "language_code": "en",
            "profession": "general",
            "lat": 12.9675,
            "lon": 80.1491,
            "city": "Pallavaram"
        })
        assert auth_res.status_code == 200, f"Auth failed: {auth_res.text}"
        token = auth_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. Test 1: Query for Pallavaram
        print("\n--- TEST 1: Query for Pallavaram ---")
        chat_p = await client.post("/api/chat/query", json={
            "text": "Naalaiku mazha varuma?",
            "lang": "en",
            "lat": 12.9675,
            "lon": 80.1491,
            "city": "Pallavaram",
            "profession": "general"
        }, headers=headers)
        assert chat_p.status_code == 200
        ans_p = chat_p.json()["answer"]
        print(f"Pallavaram Response:\n{ans_p}")
        assert "New York" not in ans_p, "Error: Stale New York mentioned in Pallavaram query!"
        assert "New Delhi" not in ans_p, "Error: Stale New Delhi mentioned in Pallavaram query!"
        assert len(ans_p) > 10, "Error: Empty response for Pallavaram"
        print("[PASS] Test 1: Pallavaram query returned correct location context.")

        # 3. Test 2: Switch to New York
        print("\n--- TEST 2: Query for New York ---")
        chat_ny = await client.post("/api/chat/query", json={
            "text": "Will it rain tomorrow?",
            "lang": "en",
            "lat": 40.7128,
            "lon": -74.0060,
            "city": "New York",
            "profession": "general"
        }, headers=headers)
        assert chat_ny.status_code == 200
        ans_ny = chat_ny.json()["answer"]
        print(f"New York Response:\n{ans_ny}")
        assert "Pallavaram" not in ans_ny, "Error: Stale Pallavaram mentioned in New York query!"
        assert "New Delhi" not in ans_ny, "Error: Stale New Delhi mentioned in New York query!"
        assert len(ans_ny) > 10, "Error: Empty response for New York"
        print("[PASS] Test 2: New York query returned correct location context.")

        # 4. Test 3: Switch back to Pallavaram multi-turn
        print("\n--- TEST 3: Switch back to Pallavaram (Multi-turn follow-up) ---")
        chat_p2 = await client.post("/api/chat/query", json={
            "text": "Morning ah?",
            "lang": "en",
            "lat": 12.9675,
            "lon": 80.1491,
            "city": "Pallavaram",
            "profession": "general",
            "conversation_history": [
                {"role": "user", "text": "Naalaiku mazha varuma?"},
                {"role": "assistant", "text": ans_p}
            ]
        }, headers=headers)
        assert chat_p2.status_code == 200
        ans_p2 = chat_p2.json()["answer"]
        print(f"Pallavaram Multi-turn Response:\n{ans_p2}")
        assert "New York" not in ans_p2, "Error: Stale New York mentioned in Pallavaram multi-turn!"
        assert "New Delhi" not in ans_p2, "Error: Stale New Delhi mentioned in Pallavaram multi-turn!"
        print("[PASS] Test 3: Pallavaram multi-turn maintained clean active location context.")

        print("\n==========================================")
        print("ALL LOCATION CONTEXT SYNCHRONIZATION TESTS PASSED!")
        print("==========================================")

if __name__ == "__main__":
    asyncio.run(test_location_synchronization())
