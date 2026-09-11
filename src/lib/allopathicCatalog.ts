import { BodySystem, Symptom } from "@/types/symptoms";

export interface SystemSymptomItem {
  id: string;
  name: string;
  translations: Record<string, string>;
  severityLevel?: number;
  duration?: string;
  description?: string;
}

export const allopathicSymptomCatalog: Record<BodySystem, SystemSymptomItem[]> = {
  general: [
    {
      id: "gen_fever",
      name: "Fever & Chills",
      translations: {
        en: "Fever & Chills",
        hi: "बुखार और ठंड लगना",
        gu: "તાવ અને ઠંડી લાગવી",
        mr: "ताप आणि थंडी",
        bn: "জ্বর এবং ঠান্ডা লাগা",
        ta: "காய்ச்சல் மற்றும் குளிர்",
        te: "జ్వరం మరియు చలి",
        kn: "ಜ್ವರ ಮತ್ತು ಚಳಿ",
        ml: "പനിയും വിറയലും"
      }
    },
    {
      id: "gen_fatigue",
      name: "Extreme Fatigue & Lethargy",
      translations: {
        en: "Extreme Fatigue & Lethargy",
        hi: "अत्यधिक थकान और सुस्ती",
        gu: "અતિશય થાક અને અશક્તિ",
        mr: "अति थकवा आणि अशक्तपणा",
        bn: "অতিরিক্ত ক্লান্তি",
        ta: "அதிக சோர்வு",
        te: "తీవ్రమైన అలసట",
        kn: "ವಿಪರೀತ ಆಯಾಸ",
        ml: "കഠിനമായ ക്ഷീണം"
      }
    },
    {
      id: "gen_weightloss",
      name: "Unexplained Weight Loss",
      translations: {
        en: "Unexplained Weight Loss",
        hi: "अचानक वजन कम होना",
        gu: "અચાનક વજન ઘટવું",
        mr: "वजन कमी होणे",
        bn: "ওজন কমে যাওয়া",
        ta: "எடை குறைவு",
        te: "బరువు తగ్గడం",
        kn: "ತೂಕ ಇಳಿಕೆ",
        ml: "ഭാരക്കുറവ്"
      }
    },
    {
      id: "gen_bodyache",
      name: "Generalized Body Pain",
      translations: {
        en: "Generalized Body Pain",
        hi: "पूरे शरीर में दर्द",
        gu: "આખા શરીરમાં દુખાવો",
        mr: "सर्व अंगदुखी",
        bn: "সারা শরীরে ব্যথা",
        ta: "உடல் வலி",
        te: "ఒంటి నొప్పులు",
        kn: "ಮೈ ಕೈ ನೋವು",
        ml: "ശരീരവേദന"
      }
    }
  ],
  head_neurological: [
    {
      id: "head_headache",
      name: "Throbbing Headache / Migraine",
      translations: {
        en: "Throbbing Headache / Migraine",
        hi: "तेज सिरदर्द / माइग्रेन",
        gu: "તીવ્ર માથાનો દુખાવો / આધાશીશી",
        mr: "तीव्र डोकेदुखी / मायग्रेन",
        bn: "তীব্র মাথাব্যথা",
        ta: "கடுமையான தலைவலி",
        te: "తీవ్రమైన తలనొప్పి",
        kn: "ತೀವ್ರ ತಲೆನೋವು",
        ml: "കഠിനമായ തലവേദന"
      }
    },
    {
      id: "head_dizziness",
      name: "Dizziness, Vertigo & Loss of Balance",
      translations: {
        en: "Dizziness, Vertigo & Loss of Balance",
        hi: "चक्कर आना और संतुलन बिगड़ना",
        gu: "ચક્કર આવવા અને સંતુલન ગુમાવવું",
        mr: "चक्कर येणे आणि तोल जाणे",
        bn: "মাথা ঘোরা ও ভারসাম্যহীনতা",
        ta: "தலைச்சுற்றல்",
        te: "తలతిరగడం",
        kn: "ತಲೆಸುತ್ತು",
        ml: "തലകറക്കം"
      }
    },
    {
      id: "head_numbness",
      name: "Numbness or Tingling in Limbs",
      translations: {
        en: "Numbness or Tingling in Limbs",
        hi: "हाथ-पैरों में सुन्नपन या झनझनाहट",
        gu: "હાથ-પગમાં બહેરાશ કે ઝણઝણાટી",
        mr: "हात-पायात मुंग्या येणे",
        bn: "অঙ্গ অসাড় হওয়া বা ঝিনঝিন করা",
        ta: "மரத்துப்போதல்",
        te: "తిమ్మిర్లు",
        kn: "ಮರಗಟ್ಟುವುದು",
        ml: "മരവിപ്പ്"
      }
    }
  ],
  respiratory: [
    {
      id: "resp_cough",
      name: "Persistent Cough with Phlegm",
      translations: {
        en: "Persistent Cough with Phlegm",
        hi: "बलगम वाली लगातार खांसी",
        gu: "કફ સાથે સતત ઉધરસ",
        mr: "कफासह सतत खोकला",
        bn: "কফযুক্ত দীর্ঘস্থায়ী কাশি",
        ta: "சளியுடன் கூடிய இருமல்",
        te: "కఫంతో కూడిన దగ్గు",
        kn: "ಕಫದ ಕೆಮ್ಮು",
        ml: "കഫക്കെട്ടോടെയുള്ള ചുമ"
      }
    },
    {
      id: "resp_sob",
      name: "Shortness of Breath / Wheezing",
      translations: {
        en: "Shortness of Breath / Wheezing",
        hi: "सांस फूलना या घरघराहट",
        gu: "શ્વાસ લેવામાં તકલીફ / ઘરઘરાહટ",
        mr: "श्वास घेण्यास त्रास / धाप लागणे",
        bn: "শ্বাসকষ্ট ও হাঁপ ধরা",
        ta: "மூச்சுத் திணறல்",
        te: "శ్వాస ఆడకపోవడం",
        kn: "ಉಸಿರಾಟದ ತೊಂದರೆ",
        ml: "ശ്വാസതടസ്സം"
      }
    },
    {
      id: "resp_chest_tight",
      name: "Chest Tightness on Breathing",
      translations: {
        en: "Chest Tightness on Breathing",
        hi: "सांस लेते समय सीने में जकड़न",
        gu: "શ્વાસ લેતી વખતે છાતીમાં જકડાઈ જવું",
        mr: "छातीत आवळल्यासारखे वाटणे",
        bn: "বুকে চাপ লাগা",
        ta: "மார்பு இறுக்கம்",
        te: "ఛాతీ బిగుతు",
        kn: "ಎದೆ ಬಿಗಿತ",
        ml: "നെഞ്ചിൽ ഭാരം"
      }
    }
  ],
  cardiovascular: [
    {
      id: "cardio_chest_pain",
      name: "Chest Pain / Pressure (Radiating to Left Arm/Jaw)",
      translations: {
        en: "Chest Pain / Pressure (Radiating to Left Arm/Jaw)",
        hi: "सीने में दर्द या भारीपन (बाएं हाथ/जबड़े में फैलना)",
        gu: "છાતીમાં દુખાવો કે દબાણ (ડાબા હાથ/જડબા સુધી જતો)",
        mr: "छातीत दुखणे व डाव्या हाताकडे पसरणे",
        bn: "বুকে ব্যথা বা চাপ",
        ta: "மார்பு வலி (இடது கைக்கு பரவுதல்)",
        te: "ఛాతీ నొప్పి (ఎడమ చేతికి వ్యాపించడం)",
        kn: "ಎದೆ ನೋವು",
        ml: "നെഞ്ചുവേദന (ഇടതു കൈയിലേക്ക് പടരുന്നത്)"
      }
    },
    {
      id: "cardio_palpitations",
      name: "Rapid or Irregular Heartbeat (Palpitations)",
      translations: {
        en: "Rapid or Irregular Heartbeat (Palpitations)",
        hi: "दिल की धड़कन तेज या अनियमित होना",
        gu: "હૃદયના ધબકારા ઝડપી કે અનિયમિત થવા (ઘબકારો)",
        mr: "हृदयाचे ठोके जलद किंवा अनियमित पडणे",
        bn: "বুক ধড়ফড় করা",
        ta: "படபடப்பு",
        te: "గుండె దడ",
        kn: "ಎದೆಬಡಿತ ಹೆಚ್ಚಾಗುವುದು",
        ml: "നെഞ്ചിടിപ്പ് കൂടുക"
      }
    },
    {
      id: "cardio_swelling",
      name: "Swelling in Feet or Ankles (Edema)",
      translations: {
        en: "Swelling in Feet or Ankles (Edema)",
        hi: "पैरों या टखनों में सूजन",
        gu: "પગ અથવા ઘૂંટીમાં સોજો",
        mr: "पायांवर व घोट्यांवर सूज",
        bn: "পা বা গোড়ালিতে ফোলাভাব",
        ta: "கால் வீக்கம்",
        te: "కాళ్ల వాపు",
        kn: "ಪಾದಗಳಲ್ಲಿ ಊತ",
        ml: "കാലുകളിൽ വീക്കം"
      }
    }
  ],
  gastrointestinal: [
    {
      id: "gi_acid",
      name: "Acidity, Heartburn & Sour Belching",
      translations: {
        en: "Acidity, Heartburn & Sour Belching",
        hi: "एसिडिटी, सीने में जलन और खट्टी डकारें",
        gu: "એસિડિટી, છાતીમાં બળતરા અને ખાટા ઓડકાર",
        mr: "पित्त, छातीत जळजळ आणि आंबट ढेकर",
        bn: "গ্যাস, বুকজ্বালা এবং টক ঢেকুর",
        ta: "நெஞ்செரிச்சல் மற்றும் அசிடிட்டி",
        te: "ఎసిడిటీ మరియు గుండెల్లో మంట",
        kn: "ಅಸಿಡಿಟಿ ಮತ್ತು ಎದೆ ಉರಿ",
        ml: "അസിഡിറ്റി, നെഞ്ചെരിച്ചിൽ"
      }
    },
    {
      id: "gi_abdopain",
      name: "Abdominal Cramping & Stomach Pain",
      translations: {
        en: "Abdominal Cramping & Stomach Pain",
        hi: "पेट में ऐंठन और मरोड़ वाला दर्द",
        gu: "પેટમાં ચૂંક અને દુખાવો",
        mr: "पोटात मुरडा आणि वेदना",
        bn: "পেটে তীব্র ব্যথা",
        ta: "வயிற்று வலி",
        te: "కడుపు నొప్పి",
        kn: "ಹೊಟ್ಟೆ ನೋವು",
        ml: "വയറുവേദന"
      }
    },
    {
      id: "gi_bowel",
      name: "Chronic Constipation / Watery Diarrhea",
      translations: {
        en: "Chronic Constipation / Watery Diarrhea",
        hi: "कब्ज या दस्त की समस्या",
        gu: "કબજિયાત અથવા ઝાડાની તકલીફ",
        mr: "बद्धकोष्ठता किंवा जुलाब",
        bn: "কোষ্ঠকাঠিন্য বা ডায়রিয়া",
        ta: "மலச்சிக்கல் அல்லது வயிற்றுப்போக்கு",
        te: "మలబద్ధకం లేదా విరేచనాలు",
        kn: "ಮಲಬದ್ಧತೆ ಅಥವಾ ಭೇದಿ",
        ml: "മലബന്ധം അല്ലെങ്കിൽ വയറിളക്കം"
      }
    }
  ],
  musculoskeletal: [
    {
      id: "msk_jointpain",
      name: "Joint Pain, Stiffness & Swelling (Knees/Back)",
      translations: {
        en: "Joint Pain, Stiffness & Swelling (Knees/Back)",
        hi: "जोड़ों में दर्द, अकड़न और सूजन (घुटने/कमर)",
        gu: "સાંધાનો દુખાવો, જકડાઈ જવું અને સોજો (ઘૂંટણ/કમર)",
        mr: "सांधेदुखी आणि कडकपणा",
        bn: "জয়েন্টে ব্যথা ও শক্ত হয়ে যাওয়া",
        ta: "மூட்டு வலி மற்றும் இறுக்கம்",
        te: "కీళ్ల నొప్పులు మరియు బిగుతు",
        kn: "ಕೀಲು ನೋವು ಮತ್ತು ಬಿಗಿತ",
        ml: "സന്ധിവേദന"
      }
    },
    {
      id: "msk_backpain",
      name: "Lower Back Strain & Sciatic Radiation",
      translations: {
        en: "Lower Back Strain & Sciatic Radiation",
        hi: "कमर के निचले हिस्से में दर्द और साइटिका",
        gu: "કમરનો દુખાવો અને સાયટિકા",
        mr: "कंबरदुखी आणि सायटिका",
        bn: "কোমরে তীব্র ব্যথা",
        ta: "இடுப்பு வலி",
        te: "నడుము నొప్పి",
        kn: "ಬೆನ್ನು ನೋವು",
        ml: "നടുവേദന"
      }
    }
  ],
  eyes: [
    {
      id: "eye_vision",
      name: "Blurry Vision or Eye Strain",
      translations: {
        en: "Blurry Vision or Eye Strain",
        hi: "धुंधला दिखाई देना या आंखों में तनाव",
        gu: "ઝાંખું દેખાવું અથવા આંખોમાં ખેંચાણ",
        mr: "अस्पष्ट दृष्टी आणि डोळ्यांवर ताण",
        bn: "ঝাপসা দৃষ্টি",
        ta: "மங்கலான பார்வை",
        te: "మసక చూపు",
        kn: "ಮಬ್ಬು ದೃಷ್ಟಿ",
        ml: "കാഴ്ച മങ്ങൽ"
      }
    },
    {
      id: "eye_redness",
      name: "Redness, Itching & Watery Discharge",
      translations: {
        en: "Redness, Itching & Watery Discharge",
        hi: "आंखों में लाली, खुजली और पानी आना",
        gu: "આંખો લાલ થવી, ખંજવાળ અને પાણી નીકળવું",
        mr: "डोळे लाल होणे व खाज सुटणे",
        bn: "চোখ লাল হওয়া ও জল পড়া",
        ta: "கண் சிவப்பு மற்றும் அரிப்பு",
        te: "కళ్ళు ఎర్రబడటం మరియు దురద",
        kn: "ಕಣ್ಣು ಕೆಂಪಾಗುವುದು",
        ml: "കണ്ണിൽ ചുവപ്പ്"
      }
    }
  ],
  ent: [
    {
      id: "ent_throat",
      name: "Sore Throat & Difficulty Swallowing",
      translations: {
        en: "Sore Throat & Difficulty Swallowing",
        hi: "गले में खराश और निगलने में कठिनाई",
        gu: "ગળામાં ખરાશ અને ગળવામાં તકલીફ",
        mr: "घसा खवखवणे व गिळताना त्रास",
        bn: "গলা ব্যথা ও গিলতে কষ্ট",
        ta: "தொண்டை வலி",
        te: "గొంతు నొప్పి",
        kn: "ಗಂಟಲು ನೋವು",
        ml: "തൊണ്ടവേദന"
      }
    },
    {
      id: "ent_earache",
      name: "Earache & Ringing Sounds (Tinnitus)",
      translations: {
        en: "Earache & Ringing Sounds (Tinnitus)",
        hi: "कान में दर्द और सीटी की आवाज आना",
        gu: "કાનમાં દુખાવો અને અવાજ આવવો",
        mr: "कानदुखी",
        bn: "কানে ব্যথা",
        ta: "காது வலி",
        te: "చెవి నొప్పి",
        kn: "ಕಿವಿ ನೋವು",
        ml: "ചെവിവേദന"
      }
    }
  ],
  skin: [
    {
      id: "skin_rash",
      name: "Itchy Skin Rash / Eczema / Hives",
      translations: {
        en: "Itchy Skin Rash / Eczema / Hives",
        hi: "त्वचा पर खुजली वाले दाने या लाल चकत्ते",
        gu: "ચામડી પર ખંજવાળવાળા દાણા કે ચકામા",
        mr: "त्वचेवर पुरळ व खाज",
        bn: "ত্বকে চুলকানি ও ফুসকুড়ি",
        ta: "தோல் அரிப்பு மற்றும் தடிப்பு",
        te: "చర్మం దురద మరియు దద్దుర్లు",
        kn: "ಚರ್ಮದ ತುರಿಕೆ",
        ml: "ത്വക്കിലെ ചൊറിച്ചിൽ"
      }
    },
    {
      id: "skin_acne",
      name: "Severe Acne or Boil Formation",
      translations: {
        en: "Severe Acne or Boil Formation",
        hi: "गंभीर मुंहासे या फोड़े-फुंसी",
        gu: "ખીલ અથવા ગૂમડાં થવા",
        mr: "पिंपल्स किंवा फोड",
        bn: "তীব্র ব্রণ বা ফোড়া",
        ta: "பருக்கள்",
        te: "మొటిమలు",
        kn: "ಮೊಡವೆಗಳು",
        ml: "മുഖക്കുരു"
      }
    }
  ],
  urinary: [
    {
      id: "uri_burning",
      name: "Burning Sensation During Urination",
      translations: {
        en: "Burning Sensation During Urination",
        hi: "पेशाब में जलन",
        gu: "પેશાબમાં બળતરા થવી",
        mr: "लघवी करताना जळजळ",
        bn: "প্রস্রাবে জ্বালাপোড়া",
        ta: "சிறுநீர் கழிக்கும் போது எரிச்சல்",
        te: "మూత్రంలో మంట",
        kn: "ಮೂತ್ರ ವಿಸರ್ಜನೆಯಲ್ಲಿ ಉರಿ",
        ml: "മൂത്രമൊഴിക്കുമ്പോൾ പുകച്ചിൽ"
      }
    },
    {
      id: "uri_freq",
      name: "Frequent Urination / Difficulty Passing Urine",
      translations: {
        en: "Frequent Urination / Difficulty Passing Urine",
        hi: "बार-बार पेशाब आना या रुक-रुक कर आना",
        gu: "વારંવાર પેશાબ જવું અથવા અટકવું",
        mr: "वारंवार लघवी होणे",
        bn: "ঘন ঘন প্রস্রাব হওয়া",
        ta: "அடிக்கடி சிறுநீர் கழித்தல்",
        te: "తరచుగా మూత్రవిసర్జన",
        kn: "ಪದೇ ಪದೇ ಮೂತ್ರ",
        ml: "ഇടയ്ക്കിടെ മൂത്രമൊഴിക്കൽ"
      }
    }
  ],
  reproductive: [
    {
      id: "rep_irregular",
      name: "Menstrual Irregularity / Pelvic Cramps",
      translations: {
        en: "Menstrual Irregularity / Pelvic Cramps",
        hi: "अनियमित मासिक धर्म या पेडू में दर्द",
        gu: "અનિયમિત માસિક ધર્મ અથવા પેલ્વિક દુખાવો",
        mr: "मासिक पाळीच्या तक्रारी व ओटीपोटात दुखणे",
        bn: "মাসিকের অনিয়ম ও তলপেটে ব্যথা",
        ta: "மாதவிடாய் கோளாறு",
        te: "రుతుక్రమ సమస్యలు",
        kn: "ಮುಟ್ಟಿನ ತೊಂದರೆ",
        ml: "ആർത്തവ സംബന്ധമായ പ്രശ്നങ്ങൾ"
      }
    }
  ],
  mental_behavioral: [
    {
      id: "men_anxiety",
      name: "Anxiety, Restlessness & Panic Episodes",
      translations: {
        en: "Anxiety, Restlessness & Panic Episodes",
        hi: "घबराहट, बेचैनी और पैनिक अटैक",
        gu: "ગભરામણ, બેચેની અને અજંપો",
        mr: "घबराट, अस्वस्थता आणि चिंता",
        bn: "উদ্বেগ ও অস্থিরতা",
        ta: "பதட்டம் மற்றும் அமைதியின்மை",
        te: "ఆందోళన మరియు అశాంతి",
        kn: "ಆತಂಕ ಮತ್ತು ಅಸ್ಥಿರತೆ",
        ml: "ആകുലതയും പരിഭ്രാന്തിയും"
      }
    },
    {
      id: "men_insomnia",
      name: "Insomnia & Disturbed Sleep Cycle",
      translations: {
        en: "Insomnia & Disturbed Sleep Cycle",
        hi: "अनिद्रा और नींद न आने की समस्या",
        gu: "અનિદ્રા અને ઊંઘ ન આવવી",
        mr: "निद्रानाश",
        bn: "অনিদ্রা",
        ta: "தூக்கமின்மை",
        te: "నిద్రలేమి",
        kn: "ನಿದ್ರಾಹೀನತೆ",
        ml: "ഉറക്കമില്ലായ്മ"
      }
    }
  ],
  endocrine_metabolic: [
    {
      id: "endo_thirst",
      name: "Excessive Thirst & High Blood Sugar Fluctuation",
      translations: {
        en: "Excessive Thirst & High Blood Sugar Fluctuation",
        hi: "अधिक प्यास लगना और ब्लड शुगर में उतार-चढ़ाव",
        gu: "વધારે તરસ લાગવી અને બ્લડ સુગરમાં વધઘટ",
        mr: "अति तहान लागणे",
        bn: "অতিরিক্ত তৃষ্ণা ও সুগার উঠানামা",
        ta: "அதிக தாகம்",
        te: "ఎక్కువ దాహం",
        kn: "ಅತಿಯಾದ ಬಾಯಾರಿಕೆ",
        ml: "അമിതമായ ദാഹം"
      }
    }
  ],
  dental_oral: [
    {
      id: "dent_toothache",
      name: "Severe Toothache & Bleeding Gums",
      translations: {
        en: "Severe Toothache & Bleeding Gums",
        hi: "दांत में तेज दर्द और मसूड़ों से खून आना",
        gu: "દાંતમાં તીવ્ર દુખાવો અને પેઢામાંથી લોહી નીકળવું",
        mr: "दातदुखी व हिरड्यांमधून रक्त येणे",
        bn: "দাঁতে তীব্র ব্যথা ও মাড়ি থেকে রক্ত পড়া",
        ta: "பல் வலி மற்றும் ஈறுகளில் ரத்தம்",
        te: "పంటి నొప్పి",
        kn: "ಹಲ್ಲು ನೋವು",
        ml: "പല്ലുവേദന"
      }
    }
  ],
  other: [
    {
      id: "other_general_consult",
      name: "Routine Health Checkup & Physician Review",
      translations: {
        en: "Routine Health Checkup & Physician Review",
        hi: "सामान्य स्वास्थ्य जांच और परामर्श",
        gu: "સામાન્ય સ્વાસ્થ્ય તપાસ અને ડૉક્ટર સલાહ",
        mr: "नियमित आरोग्य तपासणी",
        bn: "নিয়মিত স্বাস্থ্য পরীক্ষা",
        ta: "பொது மருத்துவ பரிசோதனை",
        te: "సాధారణ ఆరోగ్య పరీక్ష",
        kn: "ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ತಪಾಸಣೆ",
        ml: "പതിവ് ആരോഗ്യ പരിശോധന"
      }
    }
  ]
};
