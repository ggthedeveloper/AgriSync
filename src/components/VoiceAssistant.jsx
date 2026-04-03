import { useState, useRef, useEffect } from "react";

const LANG_CODES = { en:"en-IN", te:"te-IN", hi:"hi-IN", mr:"mr-IN", ta:"ta-IN" };

const RESPONSES = {
  en: {
    weather:  (wt,farm) => `Current weather in ${farm.loc}: ${wt.t}°C, ${wt.c}. Humidity ${wt.h}%, wind ${wt.w} km/h. Rain chance is ${wt.r}%.${wt.r>40?" Consider delaying any spraying activity today.":""}`,
    market:   () => `Current MSP rates: Paddy ₹2,183 per quintal, Wheat ₹2,275, Cotton ₹7,020. Visit the Market tab to see live mandi prices near you and transport costs.`,
    diagnose: () => `To diagnose a crop disease, go to the Diagnose tab and upload a clear photo of the affected plant. Our AI will identify the disease and recommend treatment within seconds.`,
    schemes:  () => `Active government schemes: PM-KISAN gives ₹6,000 per year. PMFBY provides crop insurance. Kisan Credit Card offers credit at 4% interest. Check the Market tab for full details and application links.`,
    health:   () => `Health reminder: Drink at least 3 litres of water during field work. Wear PPE when applying pesticides. Your last recorded BP was 118/76 and sugar 102 mg/dL — both normal.`,
    advisor:  (wt,farm,crops) => `For ${farm.loc} with ${farm.soil} soil in ${farm.season||"Kharif"} season, top recommended crops are: ${crops.slice(0,3).map(c=>c.name).join(", ")}. Visit the Advisor tab for full AI-powered recommendations.`,
    soil:     () => `Soil health tips: Test your soil pH, NPK, and organic matter annually. For clay soil, add compost and sand. For sandy soil, add organic matter. Crop rotation improves soil naturally. Avoid waterlogging as it reduces fertility.`,
    pest:     () => `Common pest management: Use neem oil spray for soft-bodied insects. For hard pests, use approved insecticides during early morning or evening. Intercropping with marigold or garlic prevents major pests. Check crops weekly for early detection.`,
    irrigation: () => `Right irrigation timing: Heavy soils need watering once a week, light soils every 3-4 days. Drip irrigation saves 40% water. Schedule watering early morning to reduce evaporation. During monsoon, ensure proper drainage to prevent root rot.`,
    fertilizer: () => `Fertilizer guide: Use NPK ratio 1:0.5:0.5 for most crops. Apply organic manure at sowing. Split chemical fertilizers into 2-3 doses during growing season. Avoid excess nitrogen or leaves will grow instead of fruit. Foliar spray boosts productivity.`,
    seeds:    () => `Seed selection tips: Buy certified seeds from authorized dealers only. Check germination rate and expiry date. Store seeds in cool, dry place below 50% humidity. Treat seeds with fungicide before sowing to prevent diseases.`,
    harvest:  () => `Harvest timing: Pick fruits when ripe but firm. Early morning harvesting reduces wilting. For grains, harvest when moisture is 14-15%. Cure crops properly before storage. Use clean, dry containers to prevent pest infestation during storage.`,
    planting: () => `Planting guide: Follow recommended spacing—rice 20×15 cm, cotton 90×60 cm, corn 60×20 cm. Sow seeds at depth of 2-3 times their size. Sow during proper season based on your location and water availability. Use good quality seeds.`,
    cost:     () => `Cost management: Record all expenses daily. Compare seed costs from local dealers. Bulk purchase of fertilizer saves 10-15%. Hire labor during peak seasons only. Sell directly to buyers to avoid middlemen markup and increase profit margin.`,
    rotation: () => `Crop rotation benefits: Alternate rice with pulse crops to restore nitrogen. Rotate to break pest cycles. Legumes fix soil nitrogen naturally. Rotate every 2-3 seasons. Avoid growing same crop repeatedly as it depletes specific nutrients and increases pests.`,
    hello:    () => `Hello! I'm your AgriSync voice assistant. Ask me about weather, market prices, crop diseases, government schemes, health tips, soil care, pest management, irrigation, fertilizers, seeds, harvest, planting, or cost management!`,
  },
  te: {
    weather:  (wt,farm) => `${farm.loc}లో నేటి వాతావరణం: ${wt.t}°C, ${wt.c}. తేమ ${wt.h}%, గాలి ${wt.w} km/h. వర్షం అవకాశం ${wt.r}%.${wt.r>40?" నేడు స్ప్రే వాయిదా వేయండి.":""}`,
    market:   () => `ప్రస్తుత MSP రేట్లు: వడ్లు ₹2,183, గోధుమ ₹2,275, పత్తి ₹7,020 ప్రతి క్వింటాల్. మీ దగ్గర మండి ధరలు చూడడానికి మార్కెట్ ట్యాబ్ తెరవండి.`,
    diagnose: () => `రోగ నిర్ధారణ కోసం, రోగ నిర్ధారణ ట్యాబ్‌కు వెళ్ళి, ప్రభావిత మొక్క యొక్క స్పష్టమైన ఫోటో అప్‌లోడ్ చేయండి. మా AI వ్యాధిని గుర్తించి సెకన్లలో చికిత్స సిఫార్సు చేస్తుంది.`,
    schemes:  () => `PM-KISAN: సంవత్సరానికి ₹6,000. PMFBY: పంట బీమా. కిసాన్ క్రెడిట్ కార్డ్: 4% వడ్డీతో రుణం. వివరాలకు మార్కెట్ ట్యాబ్ చూడండి.`,
    health:   () => `ఆరోగ్య రిమైండర్: పొలం పనిలో కనీసం 3 లీటర్లు నీళ్ళు తాగండి. పురుగుమందు స్ప్రే చేసేటప్పుడు PPE ధరించండి. మీ చివరి BP 118/76, చక్కెర 102 — రెండూ సాధారణం.`,
    advisor:  (wt,farm,crops) => `${farm.loc}లో ${farm.soil} నేలపై ${farm.season||"ఖరీఫ్"} సీజన్‌లో మంచి పంటలు: ${crops.slice(0,3).map(c=>c.name).join(", ")}. సలహాదారు ట్యాబ్‌లో పూర్తి సిఫార్సులు చూడండి.`,
    soil:     () => `నేల సంరక్షణ చిట్కాలు: సంవత్సరానికి ఒకసారి నేల pH, NPK, సేంద్రీయ పదార్థాలను పరీక్షించండి. దట్టమైన నేలకు ఎరువు, ఇసుక జోడించండి. రేపి నేలకు సేంద్రీయ పదార్థాలు జోడించండి. పంటల భ్రమణ సహజంగా నేల సమృద్ధిని మెరుగుపరుస్తుంది.`,
    pest:     () => `సాధారణ పీడ నిర్వహణ: మృదువైన పురుగులకు నీమ్ నూనె స్ప్రే ఉపయోగించండి. కఠిన పీడలకు ఆమోదించిన కీటకనాశకాలు ఉపయోగించండి. గోధుమ లేదా వెల్లుల్లితో పంట చేయడం పీడలను నిరోధిస్తుంది.`,
    irrigation: () => `సరైన నీటిపోత సమయం: భారీ నేలకు వారానికి ఒకసారి నీటిపోతన. తేలికైన నేలకు 3-4 రోజులకు ఒకసారి. చుక్కల నీటిపోత 40% నీటిని ఆదా చేస్తుంది. తెల్లవారుజామున నీటిపోతన. రీతాకాలంలో సరిగ్గా నీటిని బయటకు పంపండి.`,
    fertilizer: () => `ఎరువుల గైడ్: చాలా పంటలకు NPK నిష్పత్తి 1:0.5:0.5 ఉపయోగించండి. సేంద్రీయ సారాన్ని విత్తన సమయంలో వర్తింపజేయండి. రసాయన ఎరువులను 2-3 విభాగాలుగా విభజించండి. అధిక నత్రజనీ నివారించండి.`,
    seeds:    () => `గింజ ఎంపిక చిట్కాలు: ఆధికారిక వ్యాపారుల నుండి ధృవీకృత విత్తనాలు కొనండి. జరણ రేటు, గడువు తేదీ తనిఖీ చేయండి. గింజలను చల్లని, ఎండిన స్థానంలో నిల్వవుంచండి. కవకనాశకంతో గీటలను చికిత్స చేయండి.`,
    harvest:  () => `పంట గాని సమయం: పండ్లు పక్కపక్కనా ఉన్నప్పుడు తీయండి. తెల్లవారుజాములో పంట తోడండి. ధాన్యាలు 14-15% తేమ ఉన్నప్పుడు పంట తోడండి. ఉంచుకునే ముందు పంటలను సరిగ్గా చేయండి.`,
    planting: () => `నాటిక గైడ్: సిఫార్సు చేసిన దూరాన్ని అనుసరించండి. విత్తన లోతు 2-3 రెట్లు గింజ పరిమాణం. సరైన సంసర్గ సమయానికి విత్తనాలను నాటండి. మంచి నాణ్యత విత్తనాలు ఉపయోగించండి.`,
    cost:     () => `ఖర్చు నిర్వహణ: రోజూ ఖర్చులన్నీ నోట్ చేయండి. స్థానిక వ్యాపారుల నుండి విత్తన ఖర్చులను పోల్చండి. ఎరువుల సమూహ ఖరీదు 10-15% ఆదా చేస్తుంది. శిఖర సీజనుల్లో ఇష్టపడిన కూలీలను నియమించండి.`,
    rotation: () => `పంట భ్రమణ ప్రయోజనాలు: బియ్యం అక్షర పంటలతో ప్రత్యామ్నాయం. చేపల చక్రాన్ని విచ్ఛిన్నం చేయడానికి భ్రమణ. కూరగడ్డలు సహజంగా నత్రజనీని పరిష్కరిస్తాయి. 2-3 సీజనుల నుండి భ్రమణ చేయండి.`,
    hello:    () => `నమస్కారం! నేను మీ అగ్రిసింక్ వాయిస్ అసిస్టెంట్. వాతావరణం, ధరలు, పంట వ్యాధులు, నేల, పీడలు, నీటిపోత, ఎరువులు, గింజలు, పంట, ఖర్చు గురించి అడగండి!`,
  },
  hi: {
    weather:  (wt,farm) => `${farm.loc} में आज का मौसम: ${wt.t}°C, ${wt.c}। नमी ${wt.h}%, हवा ${wt.w} km/h। बारिश की संभावना ${wt.r}%.${wt.r>40?" आज स्प्रे करने से बचें।":""}`,
    market:   () => `वर्तमान MSP: धान ₹2,183, गेहूं ₹2,275, कपास ₹7,020 प्रति क्विंटल। अपने नजदीकी मंडी भाव देखने के लिए मार्केट टैब खोलें।`,
    diagnose: () => `फसल रोग की पहचान के लिए, डायग्नोज टैब में जाएं और प्रभावित पौधे की स्पष्ट फोटो अपलोड करें। हमारा AI सेकंडों में बीमारी पहचानकर इलाज बताएगा।`,
    schemes:  () => `PM-KISAN: सालाना ₹6,000। PMFBY: फसल बीमा। KCC: 4% ब्याज पर कर्ज। पूरी जानकारी के लिए मार्केट टैब देखें।`,
    health:   () => `स्वास्थ्य अनुस्मारक: खेत में काम के दौरान कम से कम 3 लीटर पानी पिएं। कीटनाशक छिड़काव में PPE पहनें। आपकी आखिरी BP 118/76, शुगर 102 — दोनों सामान्य।`,
    advisor:  (wt,farm,crops) => `${farm.loc} में ${farm.soil} मिट्टी पर ${farm.season||"खरीफ"} सीजन में अच्छी फसलें: ${crops.slice(0,3).map(c=>c.name).join(", ")}। पूरी सिफारिश के लिए सलाहकार टैब देखें।`,
    soil:     () => `मिट्टी स्वास्थ्य टिप्स: साल में एक बार मिट्टी का pH, NPK और जैव पदार्थ परीक्षण करवाएं। चिकनी मिट्टी में खाद और बालू मिलाएं। रेतीली मिट्टी में जैव पदार्थ मिलाएं। फसल चक्र से प्राकृतिक रूप से मिट्टी की उर्वरता बढ़ती है।`,
    pest:     () => `सामान्य कीट प्रबंधन: नरम कीटों के लिए नीम तेल का छिड़काव करें। कठोर कीटों के लिए अनुमोदित कीटनाशकों का उपयोग करें। गेंदे या लहसुन की अंतरफसल से कीट नियंत्रण होता है। साप्ताहिक निरीक्षण करें।`,
    irrigation: () => `सही सिंचाई समय: भारी मिट्टी को साप्ताहिक सिंचाई की जरूरत है। हल्की मिट्टी को 3-4 दिन में सिंचाई करें। ड्रिप सिंचाई से 40% पानी बचता है। सुबह जल्दी सिंचाई करें। बारिश में जलभराव से बचें।`,
    fertilizer: () => `खाद मार्गदर्शन: अधिकांश फसलों के लिए NPK अनुपात 1:0.5:0.5 रखें। बुवाई के समय जैव खाद डालें। रासायनिक खाद को 2-3 बार में बांटें। अधिक नाइट्रोजन से बचें। पत्तियों पर खाद छिड़कने से उपज बढ़ता है।`,
    seeds:    () => `बीज चयन सुझाव: अधिकृत विक्रेताओं से प्रमाणित बीज खरीदें। अंकुरण दर और समाप्ति तिथि जांचें। बीजों को ठंडे, सूखे स्थान पर रखें। बुवाई से पहले बीजों को कवकनाशी से उपचारित करें।`,
    harvest:  () => `कटाई का समय: फल पके होने पर तोड़ें। सुबह जल्दी कटाई करें। अनाज की नमी 14-15% हो तो कटें। भंडारण से पहले अनाज को ठीक से सुखाएं। सूखे, स्वच्छ डिब्बों में रखें।`,
    planting: () => `बुवाई गाइड: सुझाई गई दूरी का पालन करें। बीज को 2-3 गुना गहरा बोएं। सही मौसम में बोएं। अच्छी गुणवत्ता के बीज लें। पर्याप्त पानी सुनिश्चित करें।`,
    cost:     () => `लागत प्रबंधन: रोजाना सभी खर्च नोट करें। स्थानीय विक्रेताओं से बीज की कीमत तुलना करें। खाद बड़ी मात्रा में खरीदने से 10-15% बचत होती है। व्यस्त सीजन में ही मजदूर रखें।`,
    rotation: () => `फसल चक्र लाभ: चावल के बाद दाल लगाएं। कीटों का चक्र तोड़ें। दलहन फसलें प्राकृतिक नाइट्रोजन देती हैं। 2-3 सीजन बाद बदलाव करें। एक ही फसल बार-बार न लगाएं।`,
    hello:    () => `नमस्ते! मैं आपका AgriSync वॉइस असिस्टेंट हूं। मौसम, भाव, रोग, मिट्टी, कीट, सिंचाई, खाद, बीज, कटाई, लागत और फसल चक्र के बारे में पूछें!`,
  },
  mr: {
    weather:  (wt,farm) => `${farm.loc} मध्ये आजचे हवामान: ${wt.t}°C, ${wt.c}। आर्द्रता ${wt.h}%, वारा ${wt.w} km/h। पाऊस शक्यता ${wt.r}%.`,
    market:   () => `सध्याचे MSP: धान ₹2,183, गहू ₹2,275, कापूस ₹7,020 प्रति क्विंटल। बाजार टॅबमध्ये मंडी भाव पहा।`,
    diagnose: () => `पीक रोग निदानासाठी निदान टॅबमध्ये जा आणि प्रभावित झाडाचा फोटो अपलोड करा।`,
    schemes:  () => `PM-KISAN: वर्षाला ₹6,000। PMFBY: पीक विमा। KCC: 4% व्याजावर कर्ज। बाजार टॅबमध्ये संपूर्ण माहिती पहा।`,
    health:   () => `आरोग्य स्मरणपत्र: शेतात काम करताना किमान 3 लीटर पाणी प्या। कीटकनाशक फवारणी करताना PPE घाला।`,
    advisor:  (wt,farm,crops) => `${farm.loc} मध्ये ${farm.soil} मातीवर शिफारस केलेली पिके: ${crops.slice(0,3).map(c=>c.name).join(", ")}.`,
    soil:     () => `मातीचे आरोग्य टिप्स: वर्षाला एकदा मातीचे pH, NPK तपास करा। घाण मातीत खते, वाळूचे मिश्रण घालवे. रेती मातीत सेंद्रिय पदार्थ घालवे.`,
    pest:     () => `साधारण कीट व्यवस्थापन: मऊ कीटांसाठी नीम तेल वापरा। कठोर कीटांसाठी कीटकनाशक वापरा। गोलमोहर किंवा लसूण लावल्याने कीट नियंत्रण होते।`,
    irrigation: () => `योग्य सिंचन वेळ: जास्त वजन असलेल्या मातीला साप्ताहिक सिंचन हवे. हलक्या मातीला 3-4 दिवसांनी सिंचन. ड्रिप सिंचन 40% पाणी वाचवते.`,
    fertilizer: () => `खतांचे मार्गदर्शन: NPK प्रमाण 1:0.5:0.5 रखवा. गोवंशीय खते बीज काळात घालवे. रसायनिक खते तीन वेळा वापरा.`,
    seeds:    () => `बीज निवड टिप्स: प्रमाणित बीज खरेदी करा. अंकुरण दर तपास करा. बीज थंड, कोरड्या ठिकाणी ठेवा.`,
    harvest:  () => `कापणी वेळ: पके पीक तोडा. सकाळी लवकर कापणी करा. धान्य 14-15% ओलावा असल्यावर कापणी करा.`,
    planting: () => `बीज रोपण मार्गदर्शन: निर्देशित अंतर कायम ठेवा. बीज 2-3 गुणा खोलवर रोपवा. योग्य ऋतुमध्ये रोपवा.`,
    cost:     () => `खर्च व्यवस्थापन: दैनिक खर्च नोट करा. बीज खर्चांची तुलना करा. मोठ्या प्रमाणात खते खरेदी करून 10-15% वाचवा.`,
    rotation: () => `पीक चक्र फायदे: तांदळानंतर डाळ घाला. कीटांचे चक्र तोडा. दलिल पिके नैसर्गिक नायट्रोजन देतात.`,
    hello:    () => `नमस्कार! मी तुमचा AgriSync व्हॉइस असिस्टंट. हवामान, भाव, रोग, माती, कीट, सिंचन, खते पूछा!`,
  },
  ta: {
    weather:  (wt,farm) => `${farm.loc}ல் இன்றைய வானிலை: ${wt.t}°C, ${wt.c}. ஈரப்பதம் ${wt.h}%, காற்று ${wt.w} km/h. மழை வாய்ப்பு ${wt.r}%.`,
    market:   () => `தற்போதைய MSP: நெல் ₹2,183, கோதுமை ₹2,275, பருத்தி ₹7,020 ஒரு குவிண்டாலுக்கு. சந்தை தாவிலில் மண்டி விலை பாருங்கள்.`,
    diagnose: () => `பயிர் நோயை கண்டறிய நோய் கண்டறிதல் தாவிலில் பாதிக்கப்பட்ட தாவரத்தின் புகைப்படம் பதிவேற்றுங்கள்.`,
    schemes:  () => `PM-KISAN: ஆண்டுக்கு ₹6,000. PMFBY: பயிர் காப்பீடு. KCC: 4% வட்டியில் கடன். சந்தை தாவிலில் முழு விவரம் பாருங்கள்.`,
    health:   () => `சுகாதார நினைவூட்டல்: வயலில் வேலை செய்யும்போது குறைந்தது 3 லிட்டர் தண்ணீர் குடியுங்கள். பூச்சிக்கொல்லி தெளிக்கும்போது PPE அணியுங்கள்.`,
    advisor:  (wt,farm,crops) => `${farm.loc}ல் ${farm.soil} மண்ணில் பரிந்துரைக்கப்பட்ட பயிர்கள்: ${crops.slice(0,3).map(c=>c.name).join(", ")}.`,
    soil:     () => `மண் ஆரோக்கியம் டிப்ஸ்: வருடத்திற்கு ஒருமுறை மண்ணின் pH, NPK, கரிம பொருட்களை பரிசோதிக்கவும். களிமண் மண்ணுக்கு உரம் மற்றும் மணல் சேர்க்கவும். மணல் மண்ணுக்கு கரிம பொருட்கள் சேர்க்கவும். பயிர் சுழற்சி நிலத்தின் வளத்தை இயல்பாகவே மேம்படுத்தும்.`,
    pest:     () => `பொதுவான பூச்சி மேலாண்மை: மென்மையான பூச்சிக்கு நீம் எண்ணெய் அடிக்கவும். கடினமான பூச்சிக்கு அனுமதிக்கப்பட்ட பூச்சிக்கொல்லி பயன்படுத்தவும். பூஃபூவிலை அல்லது பூண்டுடன் பயிர் செய்வது பூச்சிகளைத் தடுக்கும்.`,
    irrigation: () => `சரியான நீர்ப்பாசன நேரம்: கனமான மண் வாரந்தோறும் நீர்ப்பாசனம் தேவை. இலகுவான மண் 3-4 நாட்களுக்கு ஒருமுறை. சொட்டு நீர்ப்பாசனம் 40% தண்ணீரைச் சேமிக்கும். காலை வேளையில் நீர்ப்பாசனம் செய்யவும். மழைக்காலத்தில் நீர்ப்பாசனம் தவிர்க்கவும்.`,
    fertilizer: () => `உரம் வழிகாட்டுதல்: பெரும்பாலான பயிர்களுக்கு NPK விகிதம் 1:0.5:0.5 பயன்படுத்தவும். விதைத்தல் கால நீர் உரம் வைக்கவும். வேதிய உரம் 2-3 முறை பிரிக்கவும். அதிக நைட்ரஜன் தவிர்க்கவும்.`,
    seeds:    () => `விதை தேர்வு குறிப்புகள்: அங்கீகாரிக்கப்பட்ட விற்பனையாளர்களிடம் இருந்து சான்றளிக்கப்பட்ட விதைகளை வாங்கவும். முளைக்கும் விகிதம் மற்றும் காலாவதி தேதி சரிபார்க்கவும். விதைகளை குளிர்ந்த, உலர்ந்த இடத்தில் சேமிக்கவும்.`,
    harvest:  () => `அறுவடை நேரம்: பழங்கள் பழுப்பாக இருக்கும்போது பறிக்கவும். காலை வேளையில் அறுவடை செய்யவும். கிரேன்களின் ஈரப்பதம் 14-15% இருக்கும்போது அறுவடை செய்யவும்.`,
    planting: () => `நடும் வழிகாட்டுதல்: பரிந்துரைக்கப்பட்ட இடைவெளிப் பாடுபடுங்கள். விதை ஆழத்தை 2-3 மடங்கு செய்யவும். சரியான பருவத்தில் விதைக்கவும். தரமான விதைகளை பயன்படுத்தவும்.`,
    cost:     () => `செலவு மேலாண்மை: அனைத்து செலவுகளையும் பதிவுசெய்யவும். விதை செலவுகளை ஒப்பிடுக. வெகுஜன உர ক்রயம் 10-15% சேமிக்கும்.`,
    rotation: () => `பயிர் சுழற்சி நன்மைகள்: நெல்லுக்குப் பிறகு பருப்பு நடவும். பூச்சி சுழற்சியை உடைக்கவும். பருப்புப் பயிர்கள் இயல்பாக நைட்ரஜனை சரிசெய்யும்.`,
    hello:    () => `வணக்கம்! நான் உங்கள் AgriSync குரல் உதவியாளர். வானிலை, விலைகள், நோய், மண், பூச்சி, நீர்ப்பாசனம், உரம் பற்றி கேளுங்கள்!`,
  },
};

function matchCategory(text, lang) {
  const t = text.toLowerCase();
  const cats = {
    weather:  { en:["weather","rain","temperature","forecast","humid","wind","climate"],
                te:["వాతావరణం","వర్షం","ఉష్ణోగ్రత","తేమ","గాలి"],
                hi:["मौसम","बारिश","तापमान","नमी","हवा"],
                mr:["हवामान","पाऊस","तापमान","आर्द्रता"],
                ta:["வானிலை","மழை","வெப்பம","ஈரப்பதம்"] },
    market:   { en:["market","price","msp","mandi","rate","sell","buy"],
                te:["మార్కెట్","ధర","మండి","అమ్మకం"],
                hi:["बाज़ार","भाव","मंडी","दर"],
                mr:["बाजार","भाव","मंडी","दर"],
                ta:["சந்தை","விலை","மண்டி"] },
    diagnose: { en:["diagnose","disease","pest","sick","problem","blight","rust","aphid","crop issue"],
                te:["నిర్ధారణ","వ్యాధి","పురుగు","సమస్య"],
                hi:["निदान","बीमारी","कीट","समस्या"],
                mr:["निदान","रोग","कीड","समस्या"],
                ta:["நோய்","கண்டறி","பூச்சி"] },
    schemes:  { en:["scheme","government","benefit","subsidy","pm-kisan","kcc","pension","insurance"],
                te:["పథకం","ప్రభుత్వం","సహాయం","రుణం","బీమా"],
                hi:["योजना","सरकार","सहायता","बीमा","ऋण"],
                mr:["योजना","सरकार","विमा","कर्ज"],
                ta:["திட்டம்","அரசு","காப்பீடு"] },
    health:   { en:["health","blood","pressure","sugar","doctor","checkup","medicine"],
                te:["ఆరోగ్యం","రక్తపోటు","వైద్యుడు"],
                hi:["स्वास्थ्य","रक्तचाप","डॉक्टर"],
                mr:["आरोग्य","रक्तदाब","डॉक्टर"],
                ta:["சுகாதாரம்","இரத்தம்","மருத்துவர்"] },
    advisor:  { en:["crop","advisor","recommend","plant","sow","grow","best","what to grow"],
                te:["పంట","సలహా","నాటు","పెంచు"],
                hi:["फसल","सलाह","बोएं","उगाएं"],
                mr:["पीक","सल्ला","पेरणी"],
                ta:["பயிர்","ஆலோசனை","விதை"] },
    soil:     { en:["soil","earth","clay","sand","ph","nutrient","fertility","organic"],
                te:["నేల","మట్టి","ఆర్ద్రత","సమృద్ధి"],
                hi:["मिट्टी","मृदा","पोषक","जैव"],
                mr:["माती","मिश्रण","पोषक"],
                ta:["மண்","தரம்","கரிம"] },
    pest:     { en:["bug","insect","worm","aphid","mite","beetle","caterpillar","pest control"],
                te:["కీటకం","పరుగు","సంక్రమణ"],
                hi:["कीट","सूंडी","कीटनाशक","नियंत्रण"],
                mr:["कीड","संक्रमण","नियंत्रण"],
                ta:["பூச்சி","புழு","கட்டுப்பாடு"] },
    irrigation: { en:["water","irrigate","drip","channel","wet","moisture","flooding"],
                  te:["నీరు","నీటిపోత","తేమ","వరద"],
                  hi:["पानी","सिंचाई","बाढ़"],
                  mr:["पाणी","पाणीपोत","ओलावा"],
                  ta:["தண்ணீர்","பாசனம்","ஈரப்பதம்"] },
    fertilizer: { en:["fertilizer","manure","nitrogen","npk","phosphate","potash","compost"],
                  te:["ఎరువు","సారాయిత్వం","నత్రజని"],
                  hi:["खाद","उर्वरक","नाइट्रोजन","पोटेशियम"],
                  mr:["खते","उर्वरक","नायट्रोजन"],
                  ta:["உரம்","நிலக்கோ","தழை"] },
    seeds:    { en:["seed","seedlings","germination","sowing","quality","storage"],
                te:["విత్తనం","జరణ","నిల్వవుంచు"],
                hi:["बीज","अंकुरण","भंडारण"],
                mr:["बीज","अंकुरण","साठवण"],
                ta:["விதை","மொட்டு","சேமிப்பு"] },
    harvest:  { en:["harvest","reap","pick","ripe","gather","yield","storage"],
                te:["పంట","సేకర్","కట్టు"],
                hi:["कटाई","पकना","उपज"],
                mr:["कापणी","पके","उपज"],
                ta:["அறுவடை","பக்குவம்","சேகரण"] },
    planting: { en:["plant","sow","spacing","depth","timing","season","row"],
                te:["నాటు","వరుసలు","దూరం"],
                hi:["बोयें","पंक्ति","समय"],
                mr:["रोपण","रांग","समय"],
                ta:["நட","இ, விளைமருஞ்சு","கால"] },
    cost:     { en:["cost","price","expense","profit","budget","income","saving"],
                te:["ఖర్చు","ధర","ఆదాయం"],
                hi:["लागत","खर्च","नुकसान","मुनाफा"],
                mr:["खर्च","दर","नफा","तोटा"],
                ta:["செலவு","விலை","லாபம்"] },
    rotation: { en:["rotation","crop rotation","rotate","next","sequence"],
                te:["భ్రమణ","పంట-భ్రమణ"],
                hi:["चक्र","अगली फसल"],
                mr:["भ्रमण","पीक-भ्रमण"],
                ta:["சுழற்சி","தொடர్"] },
  };
  for (const [cat, langs] of Object.entries(cats)) {
    const words = langs[lang] || langs.en;
    if (words.some(w => t.includes(w))) return cat;
  }
  return "hello";
}

export default function VoiceAssistant({ th, L, lang, farm, WT, crops, onNavigate, dark }) {
  const [open, setOpen]     = useState(false);
  const [listen, setListen] = useState(false);
  const [transcript, setTr] = useState("");
  const [history, setHist]  = useState([]);
  const [supported, setSupp]= useState(true);
  const recRef  = useRef(null);
  const synthRef= useRef(window.speechSynthesis);
  const endRef  = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupp(false); return; }
    const r = new SR();
    r.continuous = false; r.interimResults = true;
    r.lang = LANG_CODES[lang] || "en-IN";
    r.onresult = e => {
      const t = Array.from(e.results).map(x => x[0].transcript).join("");
      setTr(t);
      if (e.results[e.results.length-1].isFinal) respond(t);
    };
    r.onend = () => setListen(false);
    r.onerror = () => setListen(false);
    recRef.current = r;
  }, [lang, farm, WT, crops]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [history]);

  const respond = (text) => {
    const cat = matchCategory(text, lang);
    const rb = RESPONSES[lang] || RESPONSES.en;
    const fn = rb[cat] || rb.hello;
    const reply = fn(WT, farm, crops);
    setHist(h => [...h.slice(-6), { q:text, a:reply }]);
    setTr("");
    synthRef.current?.cancel();
    const utt = new SpeechSynthesisUtterance(reply);
    utt.lang = LANG_CODES[lang] || "en-IN";
    utt.rate = 0.92;
    synthRef.current?.speak(utt);
    const navMap = { market:"market", diagnose:"diagnose", advisor:"advisor", health:"health" };
    if (navMap[cat] && onNavigate) setTimeout(() => onNavigate(navMap[cat]), 2500);
  };

  const startListen = () => {
    if (!recRef.current) return;
    setTr(""); setListen(true);
    try { recRef.current.start(); } catch {}
  };
  const stopListen = () => {
    try { recRef.current?.stop(); } catch {}
    setListen(false);
  };

  const quickAsk = (q) => respond(q);

  // Floating button
  if (!open) return (
    <button onClick={() => setOpen(true)} title={L.voiceTitle} className="as-fab" style={{
      position:"fixed", bottom:24, right:20, zIndex:1000,
      width:60, height:60, borderRadius:"50%",
      background:"linear-gradient(135deg,#16a34a,#0d9488)",
      border:"none", cursor:"pointer",
      boxShadow:"0 4px 24px rgba(22,163,74,0.55)",
      display:"flex", alignItems:"center", justifyContent:"center",
      animation:"voicePulse 2.5s ease-in-out infinite",
    }}>
      <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2}>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8"  y1="23" x2="16" y2="23"/>
      </svg>
      <style>{`@keyframes voicePulse{0%,100%{box-shadow:0 4px 24px rgba(22,163,74,0.55)}50%{box-shadow:0 4px 36px rgba(22,163,74,0.8),0 0 0 10px rgba(22,163,74,0.12)}}`}</style>
    </button>
  );

  return (
    <div style={{ position:"fixed", bottom:0, right:0, zIndex:2000, width:"min(390px,100vw)", maxHeight:"85vh", background:th.card, borderRadius:"22px 22px 0 0", boxShadow:"0 -8px 48px rgba(0,0,0,0.4)", border:`1px solid ${th.br}`, borderBottom:"none", display:"flex", flexDirection:"column", fontFamily:"inherit" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#0a4a1f,#16a34a)", borderRadius:"22px 22px 0 0", padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,255,255,0.18)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </div>
          <div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:15 }}>{L.voiceTitle}</div>
            <div style={{ color:"rgba(255,255,255,0.65)", fontSize:11 }}>AgriSync AI · {lang.toUpperCase()}</div>
          </div>
        </div>
        <button onClick={() => { setOpen(false); synthRef.current?.cancel(); }} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:10, width:34, height:34, cursor:"pointer", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>✕</button>
      </div>

      {/* Chat */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 16px", minHeight:140 }}>
        {history.length === 0 && (
          <div style={{ textAlign:"center", padding:"24px 12px", color:th.mt }}>
            <div style={{ fontSize:36, marginBottom:10 }}>🌾</div>
            <div style={{ fontSize:14, fontWeight:700, color:th.sub, marginBottom:6 }}>{L.voiceHint}</div>
          </div>
        )}
        {history.map((h, i) => (
          <div key={i} style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:6 }}>
              <div style={{ background:th.as, borderRadius:"14px 14px 2px 14px", padding:"9px 13px", maxWidth:"80%", fontSize:14, color:th.ac, fontWeight:600 }}>{h.q}</div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#16a34a,#0d9488)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:14 }}>🌱</div>
              <div style={{ background:th.sa, borderRadius:"2px 14px 14px 14px", padding:"9px 13px", maxWidth:"84%", fontSize:13, color:th.tx, lineHeight:1.65, border:`1px solid ${th.br}` }}>{h.a}</div>
            </div>
          </div>
        ))}
        {transcript && (
          <div style={{ display:"flex", justifyContent:"flex-end" }}>
            <div style={{ background:th.al, borderRadius:"14px 14px 2px 14px", padding:"9px 13px", maxWidth:"80%", fontSize:14, color:th.mt, fontStyle:"italic", border:`1px dashed ${th.ac}` }}>{transcript}</div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Controls */}
      <div style={{ padding:"12px 16px 22px", borderTop:`1px solid ${th.br}` }}>
        {!supported ? (
          <div style={{ textAlign:"center", color:th.dg, fontSize:13 }}>{L.voiceNotSupported}</div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
            <button
              onMouseDown={startListen} onMouseUp={stopListen}
              onTouchStart={e => { e.preventDefault(); startListen(); }}
              onTouchEnd={e => { e.preventDefault(); stopListen(); }}
              style={{ width:72, height:72, borderRadius:"50%", background: listen ? "linear-gradient(135deg,#dc2626,#b91c1c)" : "linear-gradient(135deg,#16a34a,#0a4a1f)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow: listen ? "0 0 0 10px rgba(220,38,38,0.18),0 4px 24px rgba(220,38,38,0.4)" : "0 4px 24px rgba(22,163,74,0.45)", transition:"all 0.2s", animation: listen ? "voiceListen 1s ease-in-out infinite" : "none" }}>
              <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2}>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8"  y1="23" x2="16" y2="23"/>
              </svg>
            </button>
            <div style={{ fontSize:12, color: listen ? th.dg : th.mt, fontWeight:600 }}>{listen ? L.voiceListening : L.voiceSpeak}</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center" }}>
              {[L.voiceQ1, L.voiceQ2, L.voiceQ3].map((q,i) => (
                <button key={i} onClick={() => quickAsk(q)} style={{ padding:"6px 13px", borderRadius:20, background:th.al, border:`1px solid ${th.br}`, color:th.ac, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{q}</button>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes voiceListen{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}`}</style>
    </div>
  );
}
