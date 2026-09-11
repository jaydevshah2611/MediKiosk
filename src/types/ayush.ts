export type AyushSystem = 
  | "ayurveda"
  | "yoga_naturopathy"
  | "unani"
  | "siddha"
  | "homoeopathy"
  | "sowa_rigpa"
  | "other";

export type Prakriti = 
  | "vata"
  | "pitta"
  | "kapha"
  | "vata_pitta"
  | "pitta_kapha"
  | "kapha_vata"
  | "vata_pitta_kapha"
  | "sama";

export type Vikriti = Prakriti;

export type Agni = 
  | "tikshna"
  | "mandagni"
  | "vishamagni"
  | "samagni";

export type Koshtha = 
  | "krura"
  | "mridu"
  | "madhya";

export type AharaVihara = {
  diet: {
    type: "vegetarian" | "non_vegetarian" | "mixed";
    frequency: string;
    preferences: string[];
    restrictions: string[];
  };
  sleep: {
    duration: string;
    quality: "good" | "fair" | "poor";
    pattern: "regular" | "irregular";
  };
  exercise: {
    frequency: string;
    type: string[];
    duration: string;
  };
  lifestyle: {
    stressLevel: "low" | "moderate" | "high";
    workPattern: "sedentary" | "active" | "mixed";
    addiction: {
      tobacco: boolean;
      alcohol: boolean;
      other: string;
    };
  };
};

export type DashavidhaPariksha = {
  prakriti: Prakriti;
  vikriti: Vikriti;
  Sara: {
    dhatus: string[];
    quality: "good" | "moderate" | "poor";
  };
  Samhanana: {
    bodyBuild: "lean" | "moderate" | "heavy";
    constitution: string;
  };
  Purush: {
    height: string;
    weight: string;
    bodyFrame: "small" | "medium" | "large";
  };
  Pramana: {
    measurements: Record<string, string>;
  };
  Satmya: {
    adaptability: string;
    compatibility: string[];
  };
  Sattva: {
    mentalState: "calm" | "agitated" | "balanced";
    emotionalStability: string;
  };
  AharaShakti: {
    appetite: "good" | "moderate" | "poor";
    digestion: "good" | "moderate" | "poor";
  };
  VyayamaShakti: {
    physicalStrength: "good" | "moderate" | "poor";
    exerciseCapacity: string;
  };
  Vaya: {
    age: number;
    lifeStage: "childhood" | "adolescence" | "adulthood" | "middle_age" | "old_age";
  };
  Agni: Agni;
  Koshtha: Koshtha;
};

export type AyushAssessment = {
  system: AyushSystem;
  dashavidhaPariksha: DashavidhaPariksha;
  aharaVihara: AharaVihara;
  chiefComplaint: string;
  nidanPanchaka: {
    nidana: string; // etiology
    purvarupa: string; // prodromal symptoms
    rupa: string; // clinical features
    samprapti: string; // pathogenesis
    upashaya: string; // diagnostic/therapeutic measures
  };
  recommendedTherapies: string[];
  lifestyleRecommendations: string[];
  dietaryRecommendations: string[];
  prognosis: "good" | "fair" | "poor";
  notes?: string;
};