from typing import Dict, Any, List

SUPPORTED_LANGUAGES: Dict[str, Dict[str, str]] = {
    "en": {"name": "English", "native": "English", "script": "Latn"},
    "hi": {"name": "Hindi", "native": "हिन्दी", "script": "Deva"},
    "bn": {"name": "Bengali", "native": "বাংলা", "script": "Beng"},
    "te": {"name": "Telugu", "native": "తెలుగు", "script": "Telu"},
    "mr": {"name": "Marathi", "native": "मराठी", "script": "Deva"},
    "ta": {"name": "Tamil", "native": "தமிழ்", "script": "Taml"},
    "ur": {"name": "Urdu", "native": "اردو", "script": "Arab"},
    "gu": {"name": "Gujarati", "native": "ગુજરાતી", "script": "Gujr"},
    "kn": {"name": "Kannada", "native": "ಕನ್ನಡ", "script": "Knda"},
    "or": {"name": "Odia", "native": "ଓଡ଼ିଆ", "script": "Orya"},
    "ml": {"name": "Malayalam", "native": "മലയാളം", "script": "Mlym"},
    "pa": {"name": "Punjabi", "native": "ਪੰਜਾਬੀ", "script": "Guru"},
    "as": {"name": "Assamese", "native": "অসমীয়া", "script": "Beng"},
}

PRECAUTIONS_BY_TYPE: Dict[str, Dict[str, Any]] = {
    "cyclone": {
        "dos": [
            "Keep emergency battery lights, first-aid kit, and canned food handy.",
            "Stay tuned to official IMD/NDMA weather bulletins.",
            "Board up glass windows or put tape cross marks.",
            "Fishermen must stay ashore and anchor boats safely.",
            "Move to higher ground if living in low-lying coastal zones."
        ],
        "donts": [
            "Do not venture out into the sea or near coastal waters.",
            "Do not touch fallen electric wires or poles.",
            "Avoid driving through flooded underpasses or causeways.",
            "Do not spread unverified rumors on social messaging."
        ],
        "emergency_contacts": [
            {"label": "NDMA Disaster Helpline", "number": "1078"},
            {"label": "State Disaster Control", "number": "1070"},
            {"label": "Coast Guard Distress", "number": "1554"},
            {"label": "Ambulance / Emergency", "number": "112"}
        ]
    },
    "heat": {
        "dos": [
            "Drink plenty of water and oral rehydration fluids (ORS, lassi, coconut water).",
            "Wear lightweight, loose-fitting, light-colored cotton clothes.",
            "Cover your head with a hat, umbrella, or cloth when outside.",
            "Keep livestock in shaded areas and provide ample drinking water.",
            "Schedule heavy farm/field activities during early morning or late evening."
        ],
        "donts": [
            "Do not step out directly into peak sun between 12:00 PM and 3:30 PM.",
            "Avoid alcohol, tea, coffee, and carbonated beverages which dehydrate.",
            "Never leave children or pets locked in closed vehicles.",
            "Avoid high-protein and spicy street food during severe heat waves."
        ],
        "emergency_contacts": [
            {"label": "National Health Helpline", "number": "1075"},
            {"label": "Heat Stroke Emergency / Ambulance", "number": "108"}
        ]
    },
    "flood": {
        "dos": [
            "Switch off electricity mains and gas supply before evacuating.",
            "Drink boiled or chlorine-tablet-treated water.",
            "Keep emergency documents, cash, and medications in waterproof pouches.",
            "Follow designated local evacuation routes to flood shelters."
        ],
        "donts": [
            "Do not walk or drive through moving flood water.",
            "Do not consume food items that came in direct contact with flood water.",
            "Do not allow children to play near drainage canals or open manholes."
        ],
        "emergency_contacts": [
            {"label": "NDRF Rescue Helpline", "number": "9711077372"},
            {"label": "Disaster Response Unit", "number": "1070"}
        ]
    },
    "storm": {
        "dos": [
            "Seek shelter inside a sturdy building or enclosed metal vehicle.",
            "Unplug sensitive electronic appliances and televisions.",
            "Stay away from tall isolated trees, tin sheds, and metal fences."
        ],
        "donts": [
            "Never stand under tall trees during lightning activity.",
            "Do not use corded landline phones or shower during electrical storms."
        ],
        "emergency_contacts": [
            {"label": "Emergency Services", "number": "112"},
            {"label": "Fire & Rescue", "number": "101"}
        ]
    },
    "cold": {
        "dos": [
            "Wear multiple layers of loose, warm clothing instead of one thick layer.",
            "Protect elderly persons, young infants, and livestock from chilly winds.",
            "Consume warm soups, herbal tea, and nutritious calorie-dense meals."
        ],
        "donts": [
            "Do not keep coal/wood braziers (angithi) burning in closed rooms without ventilation.",
            "Avoid prolonged outdoor exposure during early morning dense fog."
        ],
        "emergency_contacts": [
            {"label": "Citizen Helpline", "number": "112"}
        ]
    },
    "general": {
        "dos": [
            "Monitor live weather updates on WeatherGPT before planning travel.",
            "Carry an umbrella or rain poncho during monsoon conditions.",
            "Keep local emergency numbers saved on speed dial."
        ],
        "donts": [
            "Do not ignore severe weather color codes (Orange / Red alert).",
            "Avoid panic buying; keep moderate essential reserves."
        ],
        "emergency_contacts": [
            {"label": "National Emergency Helpline", "number": "112"}
        ]
    }
}

TRANSLATIONS: Dict[str, Dict[str, str]] = {
    "hi": {
        "weather_intelligence": "मौसम बुद्धिमत्ता",
        "feels_like": "महसूस",
        "humidity": "आर्द्रता",
        "wind": "हवा की गति",
        "uv_index": "यूवी सूचकांक",
        "aqi": "वायु गुणवत्ता",
        "forecast_7day": "7-दिवसीय पूर्वानुमान",
        "profession_advisory": "व्यावसायिक सलाह",
        "disaster_alerts": "आपदा चेतावनी",
        "research_metrics": "जलवायु अनुसंधान",
        "search_placeholder": "मौसम या फसल के बारे में कुछ भी पूछें...",
        "stale_notice": "पिछला ज्ञात डेटा दिखाया जा रहा है",
        "daily_briefing": "दैनिक मौसम ब्रीफिंग",
        "risk_timeline": "मौसम जोखिम समयरेखा",
        "what_should_i_do": "मुझे क्या करना चाहिए?",
        "why": "कारण क्यों?",
        "simple_mode": "सरल मोड",
        "advanced_mode": "उन्नत विवरण",
        "umbrella_yes": "हाँ, छाता साथ रखें",
        "umbrella_no": "छाते की आवश्यकता नहीं",
        "travel_safe": "यात्रा के लिए अनुकूल",
        "travel_caution": "सावधानीपूर्वक यात्रा करें",
    },
    "ta": {
        "weather_intelligence": "வானிலை நுண்ணறிவு",
        "feels_like": "உணர்வது",
        "humidity": "ஈரப்பதம்",
        "wind": "காற்றின் வேகம்",
        "uv_index": "UV குறியீடு",
        "aqi": "காற்று தரம்",
        "forecast_7day": "7 நாள் முன்னறிவிப்பு",
        "profession_advisory": "தொழில்சார் ஆலோசனை",
        "disaster_alerts": "பேரிடர் எச்சரிக்கைகள்",
        "research_metrics": "காலநிலை ஆராய்ச்சி",
        "search_placeholder": "வானிலை அல்லது பயிர்கள் பற்றி கேளுங்கள்...",
        "stale_notice": "கடைசியாக அறியப்பட்ட தரவு காட்டப்படுகிறது",
        "daily_briefing": "தினசரி வானிலை சுருக்கம்",
        "risk_timeline": "வானிலை இடர் காலவரிசை",
        "what_should_i_do": "நான் என்ன செய்ய வேண்டும்?",
        "why": "ஏன்?",
        "simple_mode": "எளிய முறை",
        "advanced_mode": "விரிவான விவரங்கள்",
        "umbrella_yes": "ஆம், குடை எடுத்துச் செல்லுங்கள்",
        "umbrella_no": "குடை தேவையில்லை",
        "travel_safe": "பயணம் செய்ய பாதுகாப்பானது",
        "travel_caution": "எச்சரிக்கையுடன் செல்லுங்கள்",
    },
    "te": {
        "weather_intelligence": "వాతావరణ మేధస్సు",
        "feels_like": "అనిపిస్తుంది",
        "humidity": "తేమ",
        "wind": "గాలి వేగం",
        "uv_index": "UV సూచిక",
        "aqi": "గాలి నాణ్యత",
        "forecast_7day": "7 రోజుల సూచన",
        "profession_advisory": "వృత్తి సలహా",
        "disaster_alerts": "విపత్తు హెచ్చరికలు",
        "research_metrics": "వాతావరణ పరిశోధన",
        "search_placeholder": "వాతావరణం లేదా పంటల గురించి అడగండి...",
        "stale_notice": "చివరి తెలిసిన డేటా చూపబడుతోంది",
        "daily_briefing": "రోజువారీ వాతావరణ బులెటిన్",
        "risk_timeline": "వాతావరణ రిస్క్ టైమ్‌లైన్",
        "what_should_i_do": "నేను ఏమి చేయాలి?",
        "why": "ఎందుకు?",
        "simple_mode": "సాధారణ మోడ్",
        "advanced_mode": "ఉన్నత వివరాలు",
        "umbrella_yes": "అవును, గొడుగు తీసుకెళ్లండి",
        "umbrella_no": "గొడుగు అవసరం లేదు",
        "travel_safe": "ప్రయాణానికి సురక్షితం",
        "travel_caution": "జాగ్రత్తగా ప్రయాణించండి",
    },
    "bn": {
        "weather_intelligence": "আবহাওয়া গোয়েন্দা",
        "feels_like": "অনুভূত",
        "humidity": "আর্দ্রতা",
        "wind": "বাতাসের গতি",
        "uv_index": "ইউভি সূচক",
        "aqi": "বায়ুর মান",
        "forecast_7day": "৭ দিনের পূর্বাভাস",
        "profession_advisory": "পেশাগত পরামর্শ",
        "disaster_alerts": "দুর্যোগ সতর্কতা",
        "research_metrics": "জলবায়ু গবেষণা",
        "search_placeholder": "আবহাওয়া বা ফসল সম্পর্কে জিজ্ঞাসা করুন...",
        "stale_notice": "সর্বশেষ পরিচিত তথ্য প্রদর্শিত হচ্ছে",
        "daily_briefing": "দৈনিক আবহাওয়া ব্রিফিং",
        "risk_timeline": "আবহাওয়া ঝুঁকি টাইমলাইন",
        "what_should_i_do": "আমার কী করা উচিত?",
        "why": "কেন?",
        "simple_mode": "সহজ মোড",
        "advanced_mode": "উন্নত বিবরণ",
        "umbrella_yes": "হ্যাঁ, ছাতা সাথে রাখুন",
        "umbrella_no": "ছাতার প্রয়োজন নেই",
        "travel_safe": "ভ্রমণের জন্য নিরাপদ",
        "travel_caution": "সতর্কতার সাথে ভ্রমণ করুন",
    },
    "mr": {
        "weather_intelligence": "हवामान बुद्धिमत्ता",
        "feels_like": "जाणवणारे तापमान",
        "humidity": "आर्द्रता",
        "wind": "वाऱ्याचा वेग",
        "uv_index": "यूव्ही निर्देशांक",
        "aqi": "हवेची गुणवत्ता",
        "forecast_7day": "७ दिवसांचा अंदाज",
        "profession_advisory": "व्यावसायिक सल्ला",
        "disaster_alerts": "आपत्ती सूचना",
        "research_metrics": "हवामान संशोधन",
        "search_placeholder": "हवामान किंवा पिकांबद्दल विचारा...",
        "stale_notice": "शेवटचा उपलब्ध डेटा दाखवत आहे",
        "daily_briefing": "दैनिक हवामान माहिती",
        "risk_timeline": "हवामान जोखीम टाइमलाइन",
        "what_should_i_do": "मी काय करावे?",
        "why": "का?",
        "simple_mode": "साधा मोड",
        "advanced_mode": "प्रगत तपशील",
        "umbrella_yes": "होय, छत्री सोबत ठेवा",
        "umbrella_no": "छत्रीची गरज नाही",
        "travel_safe": "प्रवासासाठी सुरक्षित",
        "travel_caution": "काळजीपूर्वक प्रवास करा",
    },
    "gu": {
        "weather_intelligence": "હવામાન બુદ્ધિ",
        "feels_like": "અનુભવાય છે",
        "humidity": "ભેજ",
        "wind": "પવનની ગતિ",
        "uv_index": "યુવી ઇન્ડેક્સ",
        "aqi": "હવાની ગુણવત્તા",
        "forecast_7day": "૭ દિવસની આગાહી",
        "profession_advisory": "વ્યવસાયિક સલાહ",
        "disaster_alerts": "હોનારત ચેતવણી",
        "research_metrics": "હવામાન સંશોધન",
        "search_placeholder": "હવામાન અથવા પાક વિશે પૂછો...",
        "stale_notice": "છેલ્લો ઉપલબ્ધ ડેટા બતાવી રહ્યું છે",
        "daily_briefing": "દૈનિક હવામાન બ્રીફિંગ",
        "risk_timeline": "હવામાન જોખમ સમયરેખા",
        "what_should_i_do": "મારે શું કરવું જોઈએ?",
        "why": "શા માટે?",
        "simple_mode": "સરળ મોડ",
        "advanced_mode": "અદ્યતન વિગતો",
        "umbrella_yes": "હા, છત્રી સાથે રાખો",
        "umbrella_no": "છત્રીની જરૂર નથી",
        "travel_safe": "મુસાફરી માટે સલામત",
        "travel_caution": "સાવધાનીપૂર્વક મુસાફરી કરો",
    },
    "kn": {
        "weather_intelligence": "ಹವಾಮಾನ ಬುದ್ಧಿಮತ್ತೆ",
        "feels_like": "ಅನಿಸುತ್ತದೆ",
        "humidity": "ತೇವಾಂಶ",
        "wind": "ಗಾಳಿಯ ವೇಗ",
        "uv_index": "ಯುವಿ ಸೂಚ್ಯಂಕ",
        "aqi": "ಗಾಳಿಯ ಗುಣಮಟ್ಟ",
        "forecast_7day": "೭ ದಿನಗಳ ಮುನ್ಸೂಚನೆ",
        "profession_advisory": "ವೃತ್ತಿ ಸಲಹೆ",
        "disaster_alerts": "ವಿಪತ್ತು ಎಚ್ಚರಿಕೆಗಳು",
        "research_metrics": "ಹವಾಮಾನ ಸಂಶೋಧನೆ",
        "search_placeholder": "ಹವಾಮಾನ ಅಥವಾ ಬೆಳೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
        "stale_notice": "ಕೊನೆಯ ತಿಳಿದಿರುವ ಡೇಟಾ ತೋರಿಸಲಾಗುತ್ತಿದೆ",
        "daily_briefing": "ದೈನಂದಿನ ಹವಾಮಾನ ವಿವರಣೆ",
        "risk_timeline": "ಹವಾಮಾನ ಅಪಾಯ ಟೈಮ್‌ಲೈನ್",
        "what_should_i_do": "ನಾನು ಏನು ಮಾಡಬೇಕು?",
        "why": "ಏಕೆ?",
        "simple_mode": "ಸರಳ ಮೋಡ್",
        "advanced_mode": "ಸುಧಾರಿತ ವಿವರಗಳು",
        "umbrella_yes": "ಹೌದು, ಕೊಡೆ ಜೊತೆಗಿಡಿ",
        "umbrella_no": "ಕೊಡೆ ಅಗತ್ಯವಿಲ್ಲ",
        "travel_safe": "ಪ್ರಯಾಣಕ್ಕೆ ಸುರಕ್ಷಿತ",
        "travel_caution": "ಎಚ್ಚರಿಕೆಯಿಂದ ಪ್ರಯಾಣಿಸಿ",
    },
    "ml": {
        "weather_intelligence": "കാലാവസ്ഥാ ബുദ്ധി",
        "feels_like": "അനുഭവപ്പെടുന്നത്",
        "humidity": "ഈർപ്പം",
        "wind": "കാറ്റിന്റെ വേഗത",
        "uv_index": "യുവി സൂചിക",
        "aqi": "വായുവിന്റെ ഗുണനിലവാരം",
        "forecast_7day": "7 ദിവസത്തെ പ്രവചനം",
        "profession_advisory": "തൊഴിൽ ഉപദേശം",
        "disaster_alerts": "ദുരന്ത മുന്നറിയിപ്പുകൾ",
        "research_metrics": "കാലാവസ്ഥാ ഗവേഷണം",
        "search_placeholder": "കാലാവസ്ഥയെക്കുറിച്ചോ വിളകളെക്കുറിച്ചോ ചോദിക്കുക...",
        "stale_notice": "അവസാനം ലഭ്യമായ വിവരങ്ങൾ കാണിക്കുന്നു",
        "daily_briefing": "പ്രതിദിന കാലാവസ്ഥാ വിവരങ്ങൾ",
        "risk_timeline": "കാലാവസ്ഥാ റിസ്ക് ടൈംലൈൻ",
        "what_should_i_do": "ഞാൻ എന്താണ് ചെയ്യേണ്ടത്?",
        "why": "എന്തുകൊണ്ട്?",
        "simple_mode": "ലളിതമായ മോഡ്",
        "advanced_mode": "വിശദമായ വിവരങ്ങൾ",
        "umbrella_yes": "അതെ, കുട കരുതുക",
        "umbrella_no": "കുട ആവശ്യമില്ല",
        "travel_safe": "യാത്ര സുരക്ഷിതം",
        "travel_caution": "ജാഗ്രതയോടെ യാത്ര ചെയ്യുക",
    },
    "pa": {
        "weather_intelligence": "ਮੌਸਮ ਬੁੱਧੀਮਤਾ",
        "feels_like": "ਮਹਿਸੂਸ ਹੁੰਦਾ ਹੈ",
        "humidity": "ਨਮੀ",
        "wind": "ਹਵਾ ਦੀ ਰਫ਼ਤਾਰ",
        "uv_index": "ਯੂਵੀ ਇੰਡੈਕਸ",
        "aqi": "ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ",
        "forecast_7day": "7-ਦਿਨਾਂ ਦਾ ਪੂਰਵ ਅਨੁਮਾਨ",
        "profession_advisory": "ਕਿੱਤਾਮੁਖੀ ਸਲਾਹ",
        "disaster_alerts": "ਆਫ਼ਤ ਚੇਤਾਵਨੀਆਂ",
        "research_metrics": "ਜਲਵਾਯੂ ਖੋਜ",
        "search_placeholder": "ਮੌਸਮ ਜਾਂ ਫ਼ਸਲਾਂ ਬਾਰੇ ਪੁੱਛੋ...",
        "stale_notice": "ਆਖ਼ਰੀ ਜਾਣਿਆ ਡੇਟਾ ਦਿਖਾਇਆ ਜਾ ਰਿਹਾ ਹੈ",
        "daily_briefing": "ਰੋਜ਼ਾਨਾ ਮੌਸਮ ਜਾਣਕਾਰੀ",
        "risk_timeline": "ਮੌਸਮ ਜੋਖਮ ਸਮਾਂਰੇਖਾ",
        "what_should_i_do": "ਮੈਨੂੰ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        "why": "ਕਿਉਂ?",
        "simple_mode": "ਸਧਾਰਨ ਮੋਡ",
        "advanced_mode": "ਵਿਸਤ੍ਰਿਤ ਜਾਣਕਾਰੀ",
        "umbrella_yes": "ਹਾਂ, ਛਤਰੀ ਨਾਲ ਰੱਖੋ",
        "umbrella_no": "ਛਤਰੀ ਦੀ ਲੋੜ ਨਹੀਂ",
        "travel_safe": "ਯਾਤਰਾ ਲਈ ਸੁਰੱਖਿਅਤ",
        "travel_caution": "ਸਾਵਧਾਨੀ ਨਾਲ ਯਾਤਰਾ ਕਰੋ",
    },
    "or": {
        "weather_intelligence": "ପାଣିପାଗ ବୁଦ୍ଧିମତ୍ତା",
        "feels_like": "ଅନୁଭୂତ",
        "humidity": "ଆର୍ଦ୍ରତା",
        "wind": "ପବନର ବେଗ",
        "uv_index": "ୟୁଭି ସୂଚକାଙ୍କ",
        "aqi": "ବାୟୁ ମାନ",
        "forecast_7day": "୭-ଦିନର ପୂର୍ବାନୁମାନ",
        "profession_advisory": "ବୃତ୍ତିଗତ ପରାମର୍ଶ",
        "disaster_alerts": "ବିପର୍ଯ୍ୟୟ ଚେତାବନୀ",
        "research_metrics": "ଜଳବାୟୁ ଗବେଷଣା",
        "search_placeholder": "ପାଣିପାଗ କିମ୍ବା ଫସଲ ବିଷୟରେ ପଚାରନ୍ତୁ...",
        "stale_notice": "ଶେଷ ଉପଲବ୍ଧ ତଥ୍ୟ ପ୍ରଦର୍ଶିତ ହେଉଛି",
        "daily_briefing": "ଦୈନିକ ପାଣିପାଗ ସୂଚନା",
        "risk_timeline": "ପାଣିପାଗ ବିପଦ ଟାଇମଲାଇନ",
        "what_should_i_do": "ମୁଁ କଣ କରିବା ଉଚିତ?",
        "why": "କାହିଁକି?",
        "simple_mode": "ସରଳ ମୋଡ",
        "advanced_mode": "ବିସ୍ତୃତ ବିବରଣୀ",
        "umbrella_yes": "ହଁ, ଛତା ସାଙ୍ଗରେ ରଖନ୍ତୁ",
        "umbrella_no": "ଛତାର ଆବଶ୍ୟକତା ନାହିଁ",
        "travel_safe": "ଯାତ୍ରା ପାଇଁ ସୁରକ୍ଷିତ",
        "travel_caution": "ସାବଧାନତା ପୂର୍ବକ ଯାତ୍ରା କରନ୍ତୁ",
    },
    "as": {
        "weather_intelligence": "বতৰ বুদ্ধিমত্তা",
        "feels_like": "অনুভৱ হোৱা",
        "humidity": "আৰ্দ্ৰতা",
        "wind": "বতাহৰ গতি",
        "uv_index": "ইউভি সূচক",
        "aqi": "বায়ুৰ গুণমান",
        "forecast_7day": "৭ দিনৰ পূৰ্বাভাস",
        "profession_advisory": "পেছাদাৰী পৰামৰ্শ",
        "disaster_alerts": "দুৰ্যোগৰ সতৰ্কবাৰ্তা",
        "research_metrics": "জলবায়ু গৱেষণা",
        "search_placeholder": "বতৰ বা শস্যৰ বিষয়ে সোধক...",
        "stale_notice": "সৰ্বশেষ উপলব্ধ তথ্য প্ৰদৰ্শন কৰা হৈছে",
        "daily_briefing": "দৈনিক বতৰ ব্ৰিফিং",
        "risk_timeline": "বতৰৰ বিপদ সময়ৰেখা",
        "what_should_i_do": "মই কি কৰা উচিত?",
        "why": "কিয়?",
        "simple_mode": "সৰল মোড",
        "advanced_mode": "উন্নত বিৱৰণ",
        "umbrella_yes": "হয়, ছাতি লগত ৰাখক",
        "umbrella_no": "ছাতিৰ প্ৰয়োজন নাই",
        "travel_safe": "ভ্ৰমণৰ বাবে সুৰক্ষিত",
        "travel_caution": "সাৱধানে ভ্ৰমণ কৰক",
    },
    "ur": {
        "weather_intelligence": "موسمیاتی ذہانت",
        "feels_like": "محسوس ہوتا ہے",
        "humidity": "نمی",
        "wind": "ہوا کی رفتار",
        "uv_index": "یو وی انڈیکس",
        "aqi": "ہوا کا معیار",
        "forecast_7day": "7 دن کی پیشین گوئی",
        "profession_advisory": "پیشہ ورانہ مشورہ",
        "disaster_alerts": "آفات کی وارننگ",
        "research_metrics": "آب و ہوا کی تحقیق",
        "search_placeholder": "موسم یا فصلوں کے بارے میں پوچھیں...",
        "stale_notice": "آخری دستیاب ڈیٹا دکھایا جا رہا ہے",
        "daily_briefing": "روزانہ موسمی بریفنگ",
        "risk_timeline": "موسمی خطرے کا ٹائم لائن",
        "what_should_i_do": "مجھے کیا کرنا چاہیے؟",
        "why": "کیوں؟",
        "simple_mode": "سادہ موڈ",
        "advanced_mode": "تفصیلی معلومات",
        "umbrella_yes": "ہاں، چھتری ساتھ رکھیں",
        "umbrella_no": "چھتری کی ضرورت نہیں",
        "travel_safe": "سفر کے لیے محفوظ",
        "travel_caution": "احتیاط سے سفر کریں",
    },
    "en": {
        "weather_intelligence": "Weather Intelligence",
        "feels_like": "Feels Like",
        "humidity": "Humidity",
        "wind": "Wind Speed",
        "uv_index": "UV Index",
        "aqi": "Air Quality",
        "forecast_7day": "7-Day Forecast",
        "profession_advisory": "Profession Advisory",
        "disaster_alerts": "Disaster Alerts",
        "research_metrics": "Climate Research",
        "search_placeholder": "Ask anything about weather, crops, or sea conditions...",
        "stale_notice": "Showing last known data",
        "daily_briefing": "Daily Weather Briefing",
        "risk_timeline": "Weather Risk Timeline",
        "what_should_i_do": "What Should I Do?",
        "why": "Why?",
        "simple_mode": "Simple",
        "advanced_mode": "Advanced",
        "umbrella_yes": "Yes, carry an umbrella",
        "umbrella_no": "No umbrella needed",
        "travel_safe": "Favorable for travel",
        "travel_caution": "Travel with caution",
    }
}

WEATHER_TERMS_EXPLAINER: Dict[str, Dict[str, str]] = {
    "humidity": {
        "name": "Relative Humidity",
        "plain": "The amount of moisture in the air. High humidity (>70%) makes heat feel more intense and makes sweat evaporate slowly.",
        "technical": "The ratio of partial pressure of water vapor in air to the equilibrium vapor pressure of water at a given temperature."
    },
    "dew_point": {
        "name": "Dew Point",
        "plain": "The exact temperature to which air must cool for water droplets (fog/dew) to condense.",
        "technical": "The saturation temperature at constant pressure where vapor content equals saturation vapor pressure."
    },
    "uv_index": {
        "name": "UV Index",
        "plain": "Measures sunburn risk from solar ultraviolet rays. Values above 6 require sunglasses, sunscreen, and shaded cover.",
        "technical": "International standard measurement of erythemal action spectrum integrated over 290–400 nm wavelengths."
    },
    "pressure": {
        "name": "Surface Air Pressure",
        "plain": "Weight of the air above us. A sharp sudden drop indicates approaching thunderstorms, rain clouds, or cyclones.",
        "technical": "Force per unit area exerted by atmospheric column, adjusted to Mean Sea Level (QNH) in hectopascals (hPa)."
    },
    "aqi": {
        "name": "Air Quality Index (AQI)",
        "plain": "A scale from 0 to 500 measuring air pollution (dust, PM2.5, smoke). Under 50 is Good; over 150 is Unhealthy.",
        "technical": "Composite index calculated from dominant pollutants (PM2.5, PM10, NO2, SO2, CO, O3) under CPCB guidelines."
    },
    "visibility": {
        "name": "Horizontal Visibility",
        "plain": "How far in kilometers you can clearly see ahead without fog, smog, or heavy rain obscuring your view.",
        "technical": "Meteorological Optical Range (MOR) representing the distance where visual contrast drops to 5% of its initial value."
    },
    "wind_gust": {
        "name": "Wind Gust",
        "plain": "Sudden brief surges in wind speed lasting a few seconds, which can rattle windows, sway trees, or affect boats.",
        "technical": "Peak 3-second moving average wind velocity exceeding the 10-minute mean speed by at least 10 knots."
    },
    "air_density": {
        "name": "Air Density",
        "plain": "How heavy and packed the air is. Affects flight takeoff lift, engine combustion, and wind turbine power.",
        "technical": "Mass per unit volume (rho = P / (R * T)) in kg/m3 computed from ambient temperature and barometric pressure."
    }
}

class TranslationService:
    @staticmethod
    def get_supported_languages() -> List[Dict[str, str]]:
        return [{"code": k, **v} for k, v in SUPPORTED_LANGUAGES.items()]

    @staticmethod
    def get_language_name(code: str) -> str:
        return SUPPORTED_LANGUAGES.get(code, SUPPORTED_LANGUAGES["en"])["name"]

    @staticmethod
    def get_precautions(alert_type: str) -> Dict[str, Any]:
        return PRECAUTIONS_BY_TYPE.get(alert_type.lower(), PRECAUTIONS_BY_TYPE["general"])

    @staticmethod
    def get_ui_text(lang_code: str, key: str, default: str = "") -> str:
        lang_dict = TRANSLATIONS.get(lang_code, TRANSLATIONS["en"])
        return lang_dict.get(key, TRANSLATIONS["en"].get(key, default))

    @staticmethod
    def get_greeting(lang_code: str) -> str:
        greetings = {
            "hi": "नमस्ते",
            "ta": "வணக்கம்",
            "te": "నమస్కారం",
            "bn": "নমস্কার",
            "mr": "नमस्कार",
            "gu": "નમસ્તે",
            "kn": "ನಮಸ್ಕಾರ",
            "ml": "നമസ്കാരം",
            "pa": "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ",
            "or": "ନମସ୍କାର",
            "as": "নমস্কাৰ",
            "ur": "آداب",
            "en": "Good Day"
        }
        return greetings.get(lang_code, "Hello")

    @staticmethod
    def get_term_explainer(term_key: str) -> Dict[str, str]:
        return WEATHER_TERMS_EXPLAINER.get(term_key, {
            "name": term_key.replace("_", " ").title(),
            "plain": "Key meteorological metric indicating ambient atmospheric conditions.",
            "technical": "Standard physical parameter recorded by automated weather observation stations."
        })

translation_service = TranslationService()
