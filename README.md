# 🏥 MediKiosk — AI Smart OPD Triage & Multi-System Health Kiosk

> **Next-Generation National Health Portal & Smart Triage Kiosk**  
> Integrated with **Ayushman Bharat Digital Mission (ABDM)**, **National Medical Commission (NMC)**, **AYUSH Holistic Healthcare**, **On-Device Clinical OCR**, and **All-India Hospital OPD Queues**.

---

## 🌟 Key Features & Capabilities

### 1. 🩺 Patient Smart OPD Triage & Multi-System Routing
- **Anatomical Body System Exploration**: 10 distinct body systems (Cardiovascular, Respiratory, Gastrointestinal, Neurological, Musculoskeletal, Dermatology, ENT, Endocrine, Renal/Urinary, Mental Health).
- **Red-Flag & Triage Prioritization**: Automatic detection of emergency symptoms (chest pain, acute breathlessness, high fever) with immediate emergency alerts and priority level assignment (Emergency / Urgent / Routine).
- **Granular Step-by-Step Back Navigation**: Navigate freely back and forth across every step of the triage journey without losing entered information.

### 2. 🌿 Dynamic Multi-System AYUSH Consultation
- **6 AYUSH Systems Supported**:
  - **Ayurveda**: Tridosha analysis (Vata, Pitta, Kapha), Prakriti evaluation, Agni, Dhatu, and personalized Panchakarma recommendations.
  - **Yoga & Naturopathy**: Pancha Mahabhuta (Five Elements), Prana assessment, Gunas (Sattva/Rajas/Tamas), Hydrotherapy, and tailored Asana/Pranayama regimens.
  - **Unani**: Akhlat balance (Dam/Blood, Balgham/Phlegm, Safra/Yellow Bile, Sauda/Black Bile), Mizaj (Temperament), and Ilaj-bil-Tadbir (Regimenal Therapies).
  - **Siddha**: Mukkuttram balance (Vali, Azhal, Iyyam), Envagai Thervu (8 Classical Diagnostic Methods), and herbal formulation recommendations.
  - **Homoeopathy**: Miasmatic tendencies (Psora, Sycosis, Syphilis), constitutional physical & mental modalities, and individualized remedy guidance.
  - **Sowa-Rigpa**: Traditional Himalayan medicine evaluation of rLung (Air), mKhris-pa (Fire), and Bad-kan (Water/Earth) bio-energies.

### 3. 🧪 On-Device AI Clinical Document Analysis & OCR
- **Tesseract.js Client-Side OCR**: Instant digitization of prescriptions, lab reports, discharge summaries, and test results right in the browser.
- **Biomarker Clinical Engine**:
  - 🟢 **Good & Healthy Findings**: Identifies optimal biomarkers and controlled parameters.
  - 🔴 **Deficient / Low Parameters**: Detects anemia (low Hb), leukopenia (low WBC), thrombocytopenia (low platelets), etc.
  - 🟠 **Elevated / High Markers**: Detects hyperglycemia (high fasting sugar), elevated serum creatinine, hypercholesterolemia, etc.
  - 🥗 **Actionable Dietary & Lifestyle Advice**: Food remedies and nutritional adjustments matched to detected deficiencies.
  - 👨‍⚕️ **Clinical Follow-up Guidelines & Health Score**: 0–100 Health Wellness Index score.
- **Original Document Copy Viewer**: Zoomable visual preview of the uploaded document, multi-tab modal with entity extractions, raw OCR transcript, and one-click downloads.
- **Storage-Optimized**: In-browser image compression to avoid LocalStorage quota constraints.

### 4. 🏥 Pan-India Connected Hospitals & Real-Time OPD Queues
- **All-India Coverage**: Pre-loaded hospitals across North, South, East, and West India (AIIMS New Delhi, CMC Vellore, PGIMER Chandigarh, NIMHANS Bengaluru, Tata Memorial Mumbai, SSKM Kolkata, NIA Jaipur, etc.).
- **Live OPD Metrics**: Real-time estimated wait times, on-duty doctor counts, total bed occupancy, and ICU availability.
- **Direct Triage Handoff**: One-click transition from hospital directory into the triage desk with automatic token allocation.

### 5. 👨‍⚕️ Verified Doctor Clinical Station
- **NMC & State Medical Council Authentication**: Login via National Medical Commission (NMC) registration numbers or verified institutional emails.
- **Prescription Desk & Patient Queue**: Manage triage waitlists, review AI-generated triage summaries, and issue digital prescriptions.

### 6. 🏛️ Hospital Administration & OPD Node Gateway
- **Institutional ABDM Authentication**: Login via Hospital ABDM/ROHINI Facility Codes and Administrative Station Roles (Medical Superintendent, OPD Nodal Officer, Triage Desk Lead).
- **Bed & Resource Management**: Live control over bed counts, ICU units, and department doctor allocations.

---

## 🔑 Demo Login Credentials

### 👨‍⚕️ Doctor Clinical Station (`/auth/doctor/login`)
| Doctor Profile | Specialty & Hospital | NMC License ID | Institutional Email | Password |
|---|---|---|---|---|
| **Dr. Rajesh Mehta** | General Medicine (AIIMS New Delhi) | `NMC-MCI-48921/2014` | `dr.rajesh.mehta@aiims.edu.in` | `Doctor@NMC2026` |
| **Dr. Ananya Iyer** | Cardiology (CMC Vellore) | `TNMC-84210/2016` | `dr.ananya.iyer@cmc.edu.in` | `Doctor@NMC2026` |
| **Dr. Vikramaditya Sharma** | Ayurveda (NIA Jaipur) | `AYUSH-RA-55912/2018` | `dr.vikram.sharma@nia.gov.in` | `Doctor@NMC2026` |
| **Dr. Sarah Verma** | Pediatrics (Safdarjung Hospital Delhi) | `DMC-91024/2019` | `dr.sarah.verma@safdarjung.nic.in` | `Doctor@NMC2026` |

*Or choose **"Select Verified Doctor Profile"** on the login screen for 1-click instant login.*

---

### 🏥 Hospital Administration Portal (`/auth/hospital/login`)
| Hospital Facility | Location & Type | Facility Code | Admin ID | Password |
|---|---|---|---|---|
| **AIIMS New Delhi** | New Delhi (Apex / Govt) | `AIIMS-ND-NDHM-9021` | `admin.aiims` | `Hospital@2026` |
| **CMC Vellore** | Tamil Nadu (Super Specialty) | `CMC-TN-NDHM-4102` | `admin.cmc` | `Hospital@2026` |
| **NIMHANS Bengaluru** | Karnataka (Mental Health & Neuro) | `NIMHANS-KA-NDHM-8812` | `admin.nimhans` | `Hospital@2026` |
| **National Institute of Ayurveda** | Jaipur, Rajasthan (AYUSH Apex) | `NIA-RJ-AYUSH-5510` | `admin.nia` | `Hospital@2026` |

*Or switch to **"Select Connected Hospital"** to pick any facility across India with pre-filled credentials.*

---

### 👤 Patient Portal (`/auth/patient/login`)
- **Demo Patient Mobile**: `9876543210`
- **Default Verification Code (OTP)**: `123456`
- **Demo ABHA ID**: `91-4829-1029-4819`

---

## 📁 Project Architecture & Directory Structure

```
medikiosk/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── doctor/login/page.tsx      # NMC Doctor verification login
│   │   │   ├── hospital/login/page.tsx    # ABDM Hospital institutional login
│   │   │   └── patient/login/page.tsx     # ABHA Patient OTP login
│   │   ├── doctor/
│   │   │   └── dashboard/page.tsx         # Doctor clinical queue & e-Rx
│   │   ├── hospital/
│   │   │   └── dashboard/page.tsx         # Hospital bed & OPD management
│   │   ├── patient/
│   │   │   ├── dashboard/page.tsx        # Patient home portal
│   │   │   ├── new-visit/page.tsx        # Multi-step OPD triage with back navigation
│   │   │   ├── ayush/page.tsx            # Dynamic 6-system AYUSH consultation
│   │   │   ├── documents/page.tsx        # Document upload, OCR & Good/Bad analysis
│   │   │   ├── visits/page.tsx           # Past visits & token tracker
│   │   │   ├── timeline/page.tsx         # Interactive health journey timeline
│   │   │   ├── hospitals/page.tsx        # All-India connected hospitals directory
│   │   │   ├── profile/page.tsx          # ABHA profile & medical records
│   │   │   └── settings/page.tsx         # Preferences, theme, language & data export
│   │   └── page.tsx                      # Landing home screen
│   ├── components/
│   │   ├── patient/
│   │   │   ├── PatientHeader.tsx         # Standardized patient header & quick stats
│   │   │   └── PatientNav.tsx            # Full responsive navigation bar
│   │   └── ui/                           # UI buttons, cards, badges & tabs
│   ├── lib/
│   │   ├── ayushDatabase.ts              # 6-system AYUSH diagnostic question engine
│   │   ├── documentProcessor.ts          # OCR & biomarker Good/Deficient/Elevated analysis
│   │   ├── hospitalsDatabase.ts          # Pan-India connected hospitals registry
│   │   ├── tokenManager.ts               # ABDM queue token issuing & wait estimation
│   │   ├── visitManager.ts               # LocalStorage visit history manager
│   │   └── languages.ts                  # Multilingual support (12 Indian languages)
│   └── types/
│       ├── document.ts                   # Document & BiomarkerEvaluation types
│       └── patient.ts                    # Patient profile types
├── public/                               # Static assets & icons
├── package.json
└── README.md
```

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
- **Node.js**: v18.17.0 or higher
- **npm** or **pnpm** / **yarn**

### 2. Installation
```bash
# Navigate to project directory
cd medikiosk

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

### 4. Production Build
```bash
npm run build
npm run start
```

---

## 🌐 Multilingual Accessibility
MediKiosk supports instant switching between **12 Indian Languages**:
- English (`en`)
- Hindi (`hi`)
- Bengali (`bn`)
- Telugu (`te`)
- Marathi (`mr`)
- Tamil (`ta`)
- Gujarati (`gu`)
- Kannada (`kn`)
- Malayalam (`ml`)
- Odia (`or`)
- Punjabi (`pa`)
- Assamese (`as`)

---

## 🔒 Security & Data Privacy
- **Client-Side AI Processing**: Tesseract.js runs OCR locally within the browser sandbox.
- **Local Storage Management**: Automated thumbnail compression and memory pruning safeguard against browser storage overflows.
- **ABHA / ABDM Architecture**: Structured to align with national digital health standards and National Medical Commission compliance guidelines.
