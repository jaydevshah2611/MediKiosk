import { AyushSystem, Prakriti, Agni, Koshtha, AyushAssessment } from "@/types/ayush";

export interface AyushSystemMeta {
  id: AyushSystem;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  corePrinciples: string[];
}

export const ayushSystems: AyushSystemMeta[] = [
  {
    id: "ayurveda",
    name: "Ayurveda",
    icon: "🌿",
    tagline: "Science of Life & Balance of Tridosha",
    description: "Holistic ancient Indian science harmonizing Vata, Pitta, and Kapha bio-energies.",
    corePrinciples: ["Tridosha Theory (Vata, Pitta, Kapha)", "Agni & Ama (Metabolic fire & toxins)", "Dhatus & Ojas (Tissues & Vitality)"]
  },
  {
    id: "yoga_naturopathy",
    name: "Yoga & Naturopathy",
    icon: "🧘",
    tagline: "Natural Healing & Mind-Body Integration",
    description: "Drugless healing utilizing 5 natural elements (Pancha Mahabhutas), Asanas, and Pranayama.",
    corePrinciples: ["Pancha Mahabhuta therapy (Earth, Water, Fire, Air, Ether)", "Pranayama & Mind Vitality", "Dietetics & Fasting"]
  },
  {
    id: "unani",
    name: "Unani Medicine",
    icon: "📜",
    tagline: "Equilibrium of Four Humors (Akhlat)",
    description: "Greco-Arabic medicine focusing on balancing Dam (Blood), Balgham (Phlegm), Safra (Yellow Bile), and Sauda (Black Bile).",
    corePrinciples: ["Arkan & Akhlat (4 Elements & 4 Humors)", "Mizaj (Temperament)", "Tabiyat (Inherent healing power)"]
  },
  {
    id: "siddha",
    name: "Siddha",
    icon: "🔮",
    tagline: "Ancient Tamil Science of Longevity (Kayakalpa)",
    description: "Traditional Tamil therapeutic system balancing Vali (Air), Azhal (Fire), and Iyyam (Water).",
    corePrinciples: ["Mukkuttram (3 Humors)", "Envagai Thervu (8 Diagnostic tools including Pulse/Nadi)", "Kayakalpa (Rejuvenation)"]
  },
  {
    id: "homoeopathy",
    name: "Homoeopathy",
    icon: "💊",
    tagline: "Similia Similibus Curentur (Like Cures Like)",
    description: "Gentle healing activating the body's innate vitality using ultra-diluted natural substances.",
    corePrinciples: ["Law of Similars", "Individualized Constitution", "Vital Force Stimulation"]
  },
  {
    id: "sowa_rigpa",
    name: "Sowa-Rigpa",
    icon: "🏔️",
    tagline: "Himalayan Buddhist Medicine of Mind & Body",
    description: "Tibetan traditional medicine balancing rLung (Wind), mKhris-pa (Bile), and Bad-kan (Phlegm).",
    corePrinciples: ["Three Nyepa balance", "Pulse & Urine diagnosis", "Herbal formulations & Mind calming"]
  }
];

export interface AyushQuestion {
  id: string;
  system: AyushSystem | "common";
  question: string;
  subtitle?: string;
  options: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
}

export const systemSpecificQuestions: Record<AyushSystem, AyushQuestion[]> = {
  ayurveda: [
    {
      id: "body_frame",
      system: "ayurveda",
      question: "Which best describes your physical frame and joints?",
      options: [
        { value: "vata", label: "Thin, slender, bones prominent, tendency for cold limbs" },
        { value: "pitta", label: "Medium build, warm skin, moderate muscular development" },
        { value: "kapha", label: "Broad, sturdy, well-developed musculature, gains weight easily" },
        { value: "sama", label: "Harmoniously proportioned, balanced weight" }
      ]
    },
    {
      id: "agni_digestion",
      system: "ayurveda",
      question: "How does your digestive fire (Agni) behave after meals?",
      options: [
        { value: "tikshna", label: "Very sharp, frequent hunger, burning sensation (Tikshnagni)" },
        { value: "mandagni", label: "Slow, heavy feeling for hours, sluggish digestion (Mandagni)" },
        { value: "vishamagni", label: "Irregular, sometimes fast, sometimes bloated (Vishamagni)" },
        { value: "samagni", label: "Balanced, steady appetite and effortless digestion (Samagni)" }
      ]
    },
    {
      id: "koshtha_bowel",
      system: "ayurveda",
      question: "What is your natural bowel habit (Koshtha)?",
      options: [
        { value: "krura", label: "Hard, prone to dryness/constipation (Krura Koshtha)" },
        { value: "mridu", label: "Soft, fast transit, sensitive to milk/spices (Mridu Koshtha)" },
        { value: "madhya", label: "Moderate, regular once or twice daily (Madhya Koshtha)" }
      ]
    },
    {
      id: "mental_tendency",
      system: "ayurveda",
      question: "Under stress, what is your primary mental reaction?",
      options: [
        { value: "vata", label: "Anxiety, restlessness, overthinking, disrupted sleep" },
        { value: "pitta", label: "Irritability, anger, frustration, perfectionism" },
        { value: "kapha", label: "Withdrawal, lethargy, procrastination, comfort eating" },
        { value: "sama", label: "Calm analysis, resilience, balanced reaction" }
      ]
    }
  ],

  yoga_naturopathy: [
    {
      id: "element_predominance",
      system: "yoga_naturopathy",
      question: "Which natural element feels most in need of balancing in your body?",
      options: [
        { value: "earth_water", label: "Earth & Water (Mucus, congestion, heavy sluggish limbs)" },
        { value: "fire", label: "Fire (Excess body heat, acidity, skin eruptions, inflammation)" },
        { value: "air_ether", label: "Air & Ether (Dry skin, gas/bloating, breathlessness, scattered mind)" },
        { value: "balanced", label: "Overall balanced vitality, seeking preventive toning" }
      ]
    },
    {
      id: "prana_vitality",
      system: "yoga_naturopathy",
      question: "How is your daily breath rhythm and vital energy (Prana)?",
      options: [
        { value: "shallow", label: "Shallow chest breathing, frequent fatigue by afternoon" },
        { value: "stressed", label: "Rapid breathing under pressure, feeling breathless with exertion" },
        { value: "congested", label: "Frequent nasal blockages, morning lethargy" },
        { value: "deep", label: "Deep rhythmic diaphragmatic breathing, high energy" }
      ]
    },
    {
      id: "sun_water_contact",
      system: "yoga_naturopathy",
      question: "How frequently do you get direct sunlight exposure and fresh outdoor air?",
      options: [
        { value: "rare", label: "Almost entirely indoor/air-conditioned environment (<15 mins/day)" },
        { value: "moderate", label: "Occasional morning sunlight 2-3 times a week" },
        { value: "adequate", label: "Daily natural sunlight and active outdoor mobility (30+ mins)" }
      ]
    },
    {
      id: "guna_state",
      system: "yoga_naturopathy",
      question: "Which mental quality (Guna) characterizes your current state of mind?",
      options: [
        { value: "rajas", label: "Rajasic: Constantly active, ambitious, restless, driven by desires" },
        { value: "tamas", label: "Tamasic: Dull, unmotivated, heavy, feeling tired even after sleep" },
        { value: "sattva", label: "Sattvic: Clear, peaceful, content, mindful" }
      ]
    }
  ],

  unani: [
    {
      id: "mizaj_temperament",
      system: "unani",
      question: "What is your primary Mizaj (Temperament & Thermal preference)?",
      options: [
        { value: "dam", label: "Damawi (Sanguine / Hot & Moist): Robust, reddish complexion, likes cool weather" },
        { value: "safra", label: "Safrawi (Choleric / Hot & Dry): Lean, active, sharp senses, dislikes extreme heat" },
        { value: "balgham", label: "Balghami (Phlegmatic / Cold & Moist): Fair, soft skin, calm, dislikes cold/damp" },
        { value: "sauda", label: "Saudawi (Melancholic / Cold & Dry): Thin, introspective, prone to insomnia/dryness" }
      ]
    },
    {
      id: "pulse_characteristics",
      system: "unani",
      question: "How is your pulse and body temperature regulation?",
      options: [
        { value: "fast_full", label: "Full, warm bounding pulse, warm palms and soles" },
        { value: "fast_thin", label: "Quick, thin pulse with sharp body heat flares" },
        { value: "slow_soft", label: "Slow, soft pulse with tendency for cold extremities" },
        { value: "hard_irregular", label: "Narrow, hard pulse with muscle tightness" }
      ]
    },
    {
      id: "sleep_and_wakefulness",
      system: "unani",
      question: "How is your sleep-wake balance (Naum-o-Yaqzah)?",
      options: [
        { value: "excess_sleep", label: "Excessive sleepiness, difficult morning waking" },
        { value: "interrupted", label: "Light, easily broken sleep with vivid dreams" },
        { value: "insomnia", label: "Difficulty falling asleep due to active thoughts" },
        { value: "refreshing", label: "6-8 hours of deep, refreshing rest" }
      ]
    }
  ],

  siddha: [
    {
      id: "mukkuttram_state",
      system: "siddha",
      question: "Which of the three Mukkuttram humors appears most dominant?",
      options: [
        { value: "vali", label: "Vali (Air/Wind): Body aches, joint cracking, dry skin, constipation" },
        { value: "azhal", label: "Azhal (Fire): Burning sensation, acidity, hyper-pigmentation, anger" },
        { value: "iyyam", label: "Iyyam (Water/Phlegm): Chest heaviness, sinus dripping, slow metabolic rate" },
        { value: "sama", label: "Sama Mukkuttram: Balanced, steady vitality" }
      ]
    },
    {
      id: "nadi_and_tongue",
      system: "siddha",
      question: "Observe your tongue and taste preference in the morning (Naa / Sparsam):",
      options: [
        { value: "dry_astringent", label: "Dry or astringent taste, coarse tongue coating" },
        { value: "sour_bitter", label: "Sour or bitter taste in mouth, yellowish coating" },
        { value: "sweet_slimy", label: "Sweetish, sticky coating with excessive salivation" },
        { value: "normal_pink", label: "Clear pink tongue, neutral taste" }
      ]
    },
    {
      id: "kayakalpa_focus",
      system: "siddha",
      question: "What is your primary goal from Siddha Kayakalpa (Rejuvenation)?",
      options: [
        { value: "vitality", label: "Restoring physical stamina and joint strength" },
        { value: "detox", label: "Purifying internal organs (Malam / Moothiram clearance)" },
        { value: "longevity", label: "Anti-aging, respiratory clarity, and immune boosting" }
      ]
    }
  ],

  homoeopathy: [
    {
      id: "modalities",
      system: "homoeopathy",
      question: "How do your general complaints react to temperature and environment (Modalities)?",
      options: [
        { value: "chilly", label: "Chilly patient: Worse from cold drafts, better with warmth & wrapping up" },
        { value: "hot", label: "Hot patient: Craves cool breeze/open air, suffocated in warm closed rooms" },
        { value: "damp_sensitive", label: "Worse in damp weather, rainy season, or change of weather" },
        { value: "variable", label: "Sensitive to both extreme heat and extreme cold" }
      ]
    },
    {
      id: "thirst_craving",
      system: "homoeopathy",
      question: "What are your constitutional thirst and food cravings?",
      options: [
        { value: "thirstless", label: "Thirstless even with dry mouth, craves sweets or pastries" },
        { value: "large_thirst", label: "Thirsty for large quantities of cold water at long intervals" },
        { value: "sip_thirst", label: "Thirsty for small sips of warm/room-temp water frequently" },
        { value: "salty_spicy", label: "Intense craving for salty, spicy, or sour foods" }
      ]
    },
    {
      id: "emotional_temperament",
      system: "homoeopathy",
      question: "Which best characterizes your emotional baseline?",
      options: [
        { value: "consolation_aversion", label: "Irritable, prefers solitude, dislikes sympathy/consolation" },
        { value: "consolation_better", label: "Mild, gentle, weeps easily, relieved by kind reassurance" },
        { value: "hurried_anxious", label: "Restless, hurried, anticipates anxiety before events" },
        { value: "calm_methodical", label: "Even-tempered, methodical, detail-oriented" }
      ]
    }
  ],

  sowa_rigpa: [
    {
      id: "nyepa_imbalance",
      system: "sowa_rigpa",
      question: "Which primary Sowa-Rigpa elemental energy (Nyepa) reflects your state?",
      options: [
        { value: "rlung", label: "rLung (Wind): Dizziness, tinnitus, sighing, insomnia, lower back stiffness" },
        { value: "mkhrispa", label: "mKhris-pa (Bile): Heat in upper body, bitter mouth taste, yellow urine, irritability" },
        { value: "badkan", label: "Bad-kan (Phlegm): Heaviness of head, dull appetite, cold limbs, swelling" },
        { value: "tri_nyepa", label: "Balanced combination of the three roots" }
      ]
    },
    {
      id: "dietary_reaction",
      system: "sowa_rigpa",
      question: "How does your body react to heavy or raw foods?",
      options: [
        { value: "gas_bloat", label: "Produces immediate gas, dry abdomen, rumbling" },
        { value: "acid_burning", label: "Produces sharp acid surge and warm perspiration" },
        { value: "mucus_heaviness", label: "Produces throat mucus and sluggish lethargy" },
        { value: "normal", label: "Processed comfortably without complaint" }
      ]
    },
    {
      id: "mind_spirit",
      system: "sowa_rigpa",
      question: "Which mental disturbance is most prominent?",
      options: [
        { value: "attachment", label: "Desire / restlessness / uncontrolled thoughts (Root of rLung)" },
        { value: "anger", label: "Frustration / impatience / heated judgment (Root of mKhris-pa)" },
        { value: "delusion", label: "Mental fog / confusion / lack of clarity (Root of Bad-kan)" },
        { value: "peaceful", label: "Mindful, serene, clear perception" }
      ]
    }
  ],

  other: [
    {
      id: "general_health",
      system: "other",
      question: "What is your main health concern for traditional medicine review?",
      options: [
        { value: "digestive", label: "Digestive & metabolic balance" },
        { value: "musculoskeletal", label: "Joint, muscle or chronic pain" },
        { value: "stress_sleep", label: "Stress, anxiety, and sleep disorder" },
        { value: "general_wellness", label: "Preventive vitality & immune boost" }
      ]
    }
  ]
};

export const prakritiTypes: { id: Prakriti; name: string; description: string; characteristics: string[] }[] = [
  {
    id: "vata",
    name: "Vata Predominant",
    description: "Air and Ether - Governs movement, respiration, and nervous transmission.",
    characteristics: [
      "Light, dry, and cold attributes",
      "Quick mental processing with tendency towards anxiety",
      "Irregular appetite and variable digestion (Vishamagni)",
      "Light or interrupted sleep patterns"
    ]
  },
  {
    id: "pitta",
    name: "Pitta Predominant",
    description: "Fire and Water - Governs digestion, metabolism, enzyme transformation, and intellect.",
    characteristics: [
      "Sharp, warm, slightly oily attributes",
      "Strong digestive fire (Tikshnagni) and hearty appetite",
      "Focused, decisive, leadership qualities",
      "Sensitive to heat with tendency for skin flushing"
    ]
  },
  {
    id: "kapha",
    name: "Kapha Predominant",
    description: "Earth and Water - Governs structural stability, lubrication, and endurance.",
    characteristics: [
      "Heavy, stable, slow, cool attributes",
      "Calm, forgiving, patient, steady personality",
      "Slow but steady digestion (Mandagni)",
      "Deep, sound sleep with high stamina"
    ]
  },
  {
    id: "vata_pitta",
    name: "Vata-Pitta Constitution",
    description: "Dual constitution combining the mobility of Vata with the intensity of Pitta.",
    characteristics: [
      "Moderate frame, active metabolism",
      "Creative and sharp-witted",
      "Prone to both stress-induced restlessness and heat sensations"
    ]
  },
  {
    id: "pitta_kapha",
    name: "Pitta-Kapha Constitution",
    description: "Dual constitution combining fiery metabolism with strong physical endurance.",
    characteristics: [
      "Strong physical frame and athletic capacity",
      "Steady appetite with good endurance",
      "Prone to inflammatory or congestive conditions when imbalanced"
    ]
  },
  {
    id: "kapha_vata",
    name: "Kapha-Vata Constitution",
    description: "Dual constitution combining stability with variability.",
    characteristics: [
      "Variable body weight and circulation",
      "Calm demeanor punctuated by periods of high creative drive"
    ]
  },
  {
    id: "sama",
    name: "Sama (Harmonious Equilibrium)",
    description: "Ideal constitution with balanced biological forces in perfect harmony.",
    characteristics: [
      "Optimal digestion and natural immunity",
      "Clear complexion, sound sleep, steady mental composure"
    ]
  }
];

export function determinePrakriti(responses: Record<string, string>): Prakriti {
  const values = Object.values(responses);
  const vataCount = values.filter(v => v.includes("vata") || v === "air_ether" || v === "krura" || v === "sauda" || v === "vali" || v === "rlung" || v === "chilly").length;
  const pittaCount = values.filter(v => v.includes("pitta") || v === "fire" || v === "tikshna" || v === "safra" || v === "azhal" || v === "mkhrispa" || v === "hot").length;
  const kaphaCount = values.filter(v => v.includes("kapha") || v === "earth_water" || v === "mandagni" || v === "balgham" || v === "iyyam" || v === "badkan" || v === "damp_sensitive").length;

  if (vataCount > pittaCount && vataCount > kaphaCount) {
    return pittaCount > 0 ? "vata_pitta" : "vata";
  } else if (pittaCount > vataCount && pittaCount > kaphaCount) {
    return kaphaCount > 0 ? "pitta_kapha" : "pitta";
  } else if (kaphaCount > vataCount && kaphaCount > pittaCount) {
    return vataCount > 0 ? "kapha_vata" : "kapha";
  }
  return "sama";
}

export function determineAgni(responses: Record<string, string>): Agni {
  const digestion = responses.agni_digestion || responses.element_predominance || "";
  if (digestion === "tikshna" || responses.mizaj_temperament === "safra") return "tikshna";
  if (digestion === "mandagni" || responses.mizaj_temperament === "balgham") return "mandagni";
  if (digestion === "vishamagni" || responses.mizaj_temperament === "sauda") return "vishamagni";
  return "samagni";
}

export function determineKoshtha(responses: Record<string, string>): Koshtha {
  const koshtha = responses.koshtha_bowel || responses.mukkuttram_state || "";
  if (koshtha === "krura" || koshtha === "vali") return "krura";
  if (koshtha === "mridu" || koshtha === "azhal") return "mridu";
  return "madhya";
}

export interface SystemConsultationSummary {
  primaryPatternTitle: string;
  primaryPatternDescription: string;
  diagnosisSummary: string;
  therapies: string[];
  lifestyleGuidelines: string[];
  dietaryGuidelines: string[];
  herbalRecommendations: string[];
}

export function generateSystemConsultation(
  system: AyushSystem,
  responses: Record<string, string>
): SystemConsultationSummary {
  switch (system) {
    case "yoga_naturopathy":
      return {
        primaryPatternTitle: "Pancha Mahabhuta & Pranic Imbalance",
        primaryPatternDescription: "Disruption in elemental harmony and pranic vitality due to indoor sedentary routine and shallow breath rhythm.",
        diagnosisSummary: "Naturopathic assessment reveals reduced Vital Economy with mild accumulation of metabolic morbid matter (Tamasic/Rajasic shift).",
        therapies: [
          "Jala Neti & Kunjal Kriya (Nasal and gastric cleansing)",
          "Hydrotherapy: Alternate Hot & Cold Compress / Hip Bath",
          "Sun Bathing (Atapa Sevana) 20 mins early morning",
          "Acupressure & Mud Therapy for abdominal tone"
        ],
        lifestyleGuidelines: [
          "Practice Anulom Vilom and Bhramari Pranayama 15 mins twice daily",
          "Surya Namaskar 6-12 cycles synchronized with deep breathing",
          "Mindful Digital Detox 1 hour prior to sleep"
        ],
        dietaryGuidelines: [
          "Adopt 50% raw living foods diet (sprouts, seasonal fruits, soaked nuts)",
          "Intermittent fasting (14-hour overnight fast once weekly)",
          "Warm lemon water with a pinch of rock salt upon waking",
          "Eliminate refined sugars and processed hydrogenated oils"
        ],
        herbalRecommendations: [
          "Fresh Tulsi & Wheatgrass juice 30ml on empty stomach",
          "Amla juice with warm water for natural antioxidant surge"
        ]
      };

    case "unani":
      return {
        primaryPatternTitle: "Ghalba-e-Khilt (Humoral Dysregulation)",
        primaryPatternDescription: "Mild disturbance in Akhlat (humors) influencing Mizaj (Temperament) with sluggish Tabiyat.",
        diagnosisSummary: "Diagnosis of Su-e-Mizaj (deranged temperament). Restoration of inherent vitality (Quwwat-e-Mudabbira) advised via Ilaj-bil-Tadbir.",
        therapies: [
          "Dalak (Therapeutic Medical Massage with Roghan-e-Badam)",
          "Riyazat (Targeted light aerobic physical exercise)",
          "Hammam (Medicated steam bath to open peripheral pores)",
          "Hijama (Cupping therapy under physician guidance if indicated)"
        ],
        lifestyleGuidelines: [
          "Adhere strictly to Asbab-e-Sittah Zarooriyyah (6 Essential lifestyle factors)",
          "Avoid cold drafts immediately after physical exertion",
          "Maintain regular meal rhythms and avoid late dinners"
        ],
        dietaryGuidelines: [
          "Favor easily digestible, temperate foods (Khamir/Broths)",
          "Include honey, figs (Injeer), almonds, and saffron in moderation",
          "Avoid excessive sour, excessively cold or heavy stale food combinations"
        ],
        herbalRecommendations: [
          "Sharbat-e-Bazoori Motadil 20ml in morning for urinary/metabolic cleanse",
          "Khamira Gaozaban Ambari Jawaharwala 5g at bedtime for calm & cardiac tone"
        ]
      };

    case "siddha":
      return {
        primaryPatternTitle: "Mukkuttram (Vali / Azhal / Iyyam) Derangement",
        primaryPatternDescription: "Disproportionate movement of Vali (Air) and Azhal (Heat) affecting tissue metabolic transformation (Dhatus).",
        diagnosisSummary: "Envagai Thervu (8-point Siddha examination) shows mild Nadi fluctuation and digestive sluggishness (Agni-Mandham).",
        therapies: [
          "Thokkanam (9 physical therapeutic manipulation techniques)",
          "Vedhu (Herbal steam inhalation with Nochi & Eucalyptus leaves)",
          "Kayakalpa therapeutic routine for cellular vitality",
          "Nasiyam (Herbal nasal oil drops for sensory clarity)"
        ],
        lifestyleGuidelines: [
          "Follow traditional Tamil seasonal regimen (Aruvakaimai)",
          "Perform Vasi Yogam (subtle Siddha breath control)",
          "Oil bath (Ennai Muzhukku) once weekly with Gingelly/Seeraga oil"
        ],
        dietaryGuidelines: [
          "Balance the 6 tastes (Aru Suvai) with focus on bitter and astringent",
          "Include Moringa leaves, Curry leaves, and Jeera water daily",
          "Avoid sour curd at night and excessively salty preserved foods"
        ],
        herbalRecommendations: [
          "Kaba Sura Kudineer / Nilavembu Kudineer decoction as immune shield",
          "Thiriphala Chooranam 1-2g with warm honey water at night"
        ]
      };

    case "homoeopathy":
      return {
        primaryPatternTitle: "Individualized Constitutional Dysregulation",
        primaryPatternDescription: "Vital force susceptibility triggered by emotional stress, climate sensitivity, and constitutional modalities.",
        diagnosisSummary: "Simillimum matching based on holistic mind-body constitutional symptoms, thermal reactivity, and modalities.",
        therapies: [
          "Constitutional Single Remedy potentization",
          "Supportive Biochemic Tissue Salts protocol",
          "Elimination of medicinal antidotes (camphor, raw strong mints)",
          "Gentle vital stimulation through individualized posology"
        ],
        lifestyleGuidelines: [
          "Keep symptom and modality diary (what aggravates vs ameliorates)",
          "Avoid strong aromatic essential oils during active remedy phase",
          "Engage in restorative walks in open fresh air"
        ],
        dietaryGuidelines: [
          "Avoid strong raw garlic or coffee 30 mins before/after doses",
          "Nutrient-dense natural whole food meals suited to thermal type",
          "Adequate structured hydration with ambient spring water"
        ],
        herbalRecommendations: [
          "Calcarea Phos / Ferrum Phos 6X biochemic support for cellular mineral balance",
          "Passiflora Incarnata Q (Mother Tincture) drops at bedtime if sleep is restless"
        ]
      };

    case "sowa_rigpa":
      return {
        primaryPatternTitle: "rLung & mKhris-pa Imbalance",
        primaryPatternDescription: "Fluctuation in subtle wind energy (rLung) and metabolic fire (mKhris-pa) causing mental restlessness and digestive inconsistency.",
        diagnosisSummary: "Himalayan medical assessment reveals mind-energy friction. Gentle grounding, warmth, and dietary harmonization indicated.",
        therapies: [
          "Hor-me (Warm herbal compress on vital energy points)",
          "Ku-Nye (Traditional Tibetan therapeutic herbal oil massage)",
          "Meditation on the Four Noble Truths for inner emotional equilibrium",
          "Medicinal mineral foot soak with Himalayan pink salt & ginger"
        ],
        lifestyleGuidelines: [
          "Keep lower back, head, and feet well insulated from harsh cold winds",
          "Engage in gentle mindful walking in serene mountain/greenery spaces",
          "Avoid contentious debates and anger-provoking environments in the evening"
        ],
        dietaryGuidelines: [
          "Favor warm, cooked, nourishing soups (Thukpa), boiled barley, and ghee",
          "Consume warm boiled water throughout the day",
          "Avoid iced drinks, uncooked raw salads, and overly pungent chili spices"
        ],
        herbalRecommendations: [
          "Agar-35 / Semde formulation for mental peace (under Sowa-Rigpa Amchi guidance)",
          "Zang-zhi decoction for gentle digestive harmonization"
        ]
      };

    case "ayurveda":
    default:
      return {
        primaryPatternTitle: "Tridosha & Agni Imbalance",
        primaryPatternDescription: "Prakriti/Vikriti divergence with mild Ama (toxin) accumulation and variable digestive fire.",
        diagnosisSummary: "Classical Dashavidha Pariksha indicates need for dosha pacification, Agni Deepana, and Srotas purification.",
        therapies: [
          "Abhyanga (Warm Sesame/Mahanarayan oil body massage)",
          "Shirodhara (Gentle medicated oil pouring for nervous stabilization)",
          "Swedana (Herbal steam bath to liquify localized doshas)",
          "Panchakarma consultation for seasonal detox"
        ],
        lifestyleGuidelines: [
          "Follow Dinacharya: wake at Brahma Muhurta, tongue scraping, oil pulling",
          "Practice Nadi Shodhana Pranayama 10 mins morning & evening",
          "Establish regular meal and sleep times without skipping"
        ],
        dietaryGuidelines: [
          "Eat warm, freshly cooked Satvik meals tailored to your dosha",
          "Incorporate cumin, coriander, fennel (CCF) digestive tea",
          "Avoid heavy dairy at night and incompatible combinations (Viruddha Ahara)"
        ],
        herbalRecommendations: [
          "Triphala Churna 3-5g at bedtime with lukewarm water",
          "Ashwagandha / Brahmi Rasayana for nervous stamina and peaceful sleep"
        ]
      };
  }
}
