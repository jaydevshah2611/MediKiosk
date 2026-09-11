export interface ConnectedHospital {
  id: string;
  name: string;
  category: "Government / Apex" | "District Hospital" | "AYUSH Institute" | "Community Health Center" | "State Medical College" | "Super Specialty";
  state: string;
  city: string;
  address: string;
  distance: string;
  contact: string;
  emergency: string;
  abhaCertified: boolean;
  departmentsAvailable: string[];
  activeDoctorCount: number;
  currentWaitEstimate: number;
  bedOccupancy: string;
  totalBeds: number;
  availableBeds: number;
  icuAvailable: number;
}

export const allIndiaHospitals: ConnectedHospital[] = [
  // 1. Ahmedabad - Civil Hospital & BJ Medical College (Apex)
  {
    id: "hosp-civil-ahmedabad",
    name: "Civil Hospital & B.J. Medical College (Asarwa MediCity)",
    category: "Government / Apex",
    state: "Gujarat",
    city: "Ahmedabad",
    address: "Asarwa, Near Haripura, Ahmedabad, Gujarat - 380016",
    distance: "1.5 km away",
    contact: "+91 79 2268 0074",
    emergency: "108 / 102",
    abhaCertified: true,
    departmentsAvailable: ["General Medicine", "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "ENT", "Ophthalmology", "Dermatology", "Emergency Trauma"],
    activeDoctorCount: 65,
    currentWaitEstimate: 10,
    bedOccupancy: "82%",
    totalBeds: 2800,
    availableBeds: 450,
    icuAvailable: 48
  },

  // 2. Rajkot - AIIMS Rajkot (Apex Central Institute)
  {
    id: "hosp-aiims-rajkot",
    name: "AIIMS (All India Institute of Medical Sciences) Rajkot",
    category: "Government / Apex",
    state: "Gujarat",
    city: "Rajkot",
    address: "Khandheri, Para Pipaliya, Rajkot, Gujarat - 360006",
    distance: "3.2 km away",
    contact: "+91 281 299 1004",
    emergency: "108",
    abhaCertified: true,
    departmentsAvailable: ["General Medicine", "Cardiology", "Pulmonology", "Orthopedics", "Pediatrics", "Endocrinology", "AYUSH Integrated Wing"],
    activeDoctorCount: 48,
    currentWaitEstimate: 8,
    bedOccupancy: "71%",
    totalBeds: 750,
    availableBeds: 195,
    icuAvailable: 32
  },

  // 3. Jamnagar - Institute of Teaching and Research in Ayurveda (ITRA Jamnagar - National AYUSH Apex)
  {
    id: "hosp-itra-jamnagar",
    name: "Institute of Teaching and Research in Ayurveda (ITRA Jamnagar)",
    category: "AYUSH Institute",
    state: "Gujarat",
    city: "Jamnagar",
    address: "Opp. B-Division Police Station, Gurudwara Road, Jamnagar, Gujarat - 361008",
    distance: "2.4 km away",
    contact: "+91 288 255 2014",
    emergency: "+91 288 267 6852",
    abhaCertified: true,
    departmentsAvailable: ["Ayurveda & Panchakarma", "Kayachikitsa", "Shalya Tantra", "Kaumarbhritya (Pediatrics)", "Rasayana & Vajikarana", "Yoga & Naturopathy"],
    activeDoctorCount: 34,
    currentWaitEstimate: 6,
    bedOccupancy: "58%",
    totalBeds: 350,
    availableBeds: 140,
    icuAvailable: 12
  },

  // 4. Vadodara - SSG Hospital & Medical College Baroda
  {
    id: "hosp-ssg-vadodara",
    name: "Sir Sayajirao General (SSG) Hospital & Baroda Medical College",
    category: "State Medical College",
    state: "Gujarat",
    city: "Vadodara",
    address: "Jail Road, Anandpura, Vadodara, Gujarat - 390001",
    distance: "2.8 km away",
    contact: "+91 265 242 4848",
    emergency: "108",
    abhaCertified: true,
    departmentsAvailable: ["General Medicine", "Surgery", "Cardiology", "Neurology", "Pediatrics", "Gynecology & Obstetrics", "Orthopedics"],
    activeDoctorCount: 52,
    currentWaitEstimate: 12,
    bedOccupancy: "85%",
    totalBeds: 1550,
    availableBeds: 210,
    icuAvailable: 26
  },

  // 5. Surat - New Civil Hospital & Government Medical College (GMC Surat)
  {
    id: "hosp-civil-surat",
    name: "New Civil Hospital & Government Medical College Surat",
    category: "State Medical College",
    state: "Gujarat",
    city: "Surat",
    address: "Majura Gate, Ring Road, Surat, Gujarat - 395001",
    distance: "3.0 km away",
    contact: "+91 261 224 4175",
    emergency: "108",
    abhaCertified: true,
    departmentsAvailable: ["General Medicine", "Pulmonology", "Orthopedics", "Pediatrics", "Dermatology", "Emergency Trauma", "Nephrology"],
    activeDoctorCount: 46,
    currentWaitEstimate: 14,
    bedOccupancy: "89%",
    totalBeds: 1250,
    availableBeds: 130,
    icuAvailable: 24
  },

  // 6. Bhavnagar - Sir T. Hospital & Government Medical College
  {
    id: "hosp-sirt-bhavnagar",
    name: "Sir Takhtasinhji (Sir T.) Hospital & GMC Bhavnagar",
    category: "District Hospital",
    state: "Gujarat",
    city: "Bhavnagar",
    address: "Kalanala, Bhavnagar, Gujarat - 364001",
    distance: "2.1 km away",
    contact: "+91 278 251 1511",
    emergency: "108",
    abhaCertified: true,
    departmentsAvailable: ["General Medicine", "General Surgery", "Pediatrics", "ENT", "Ophthalmology", "Orthopedics"],
    activeDoctorCount: 28,
    currentWaitEstimate: 9,
    bedOccupancy: "74%",
    totalBeds: 800,
    availableBeds: 180,
    icuAvailable: 16
  },

  // 7. Gandhinagar - GMERS Medical College & Civil Hospital Gandhinagar
  {
    id: "hosp-civil-gandhinagar",
    name: "GMERS Civil Hospital & Medical College Gandhinagar",
    category: "District Hospital",
    state: "Gujarat",
    city: "Gandhinagar",
    address: "Sector 12, Gandhinagar, Gujarat - 382012",
    distance: "1.8 km away",
    contact: "+91 79 2322 1931",
    emergency: "108",
    abhaCertified: true,
    departmentsAvailable: ["General Medicine", "Cardiology", "Pediatrics", "Gynecology", "Dermatology", "AYUSH Wellness Unit"],
    activeDoctorCount: 32,
    currentWaitEstimate: 7,
    bedOccupancy: "68%",
    totalBeds: 650,
    availableBeds: 190,
    icuAvailable: 18
  },

  // 8. UN Mehta Institute of Cardiology & Research Centre (Ahmedabad)
  {
    id: "hosp-un-mehta-ahmedabad",
    name: "U.N. Mehta Institute of Cardiology & Research Centre",
    category: "Super Specialty",
    state: "Gujarat",
    city: "Ahmedabad",
    address: "Civil Hospital Campus, Asarwa, Ahmedabad, Gujarat - 380016",
    distance: "1.6 km away",
    contact: "+91 79 2268 4200",
    emergency: "+91 79 2268 4222",
    abhaCertified: true,
    departmentsAvailable: ["Cardiology", "Cardiovascular Surgery", "Pediatric Cardiology", "Cardiac Electrophysiology", "Cardiac ICU"],
    activeDoctorCount: 40,
    currentWaitEstimate: 11,
    bedOccupancy: "86%",
    totalBeds: 1251,
    availableBeds: 160,
    icuAvailable: 45
  },

  // 9. Gujarat Cancer & Research Institute (GCRI M.P. Shah Cancer Hospital)
  {
    id: "hosp-gcri-ahmedabad",
    name: "Gujarat Cancer & Research Institute (M.P. Shah Cancer Hospital)",
    category: "Super Specialty",
    state: "Gujarat",
    city: "Ahmedabad",
    address: "Civil Hospital Compound, Asarwa, Ahmedabad, Gujarat - 380016",
    distance: "1.6 km away",
    contact: "+91 79 2268 8000",
    emergency: "108",
    abhaCertified: true,
    departmentsAvailable: ["Medical Oncology", "Surgical Oncology", "Radiation Oncology", "Palliative Care", "Preventive Oncology"],
    activeDoctorCount: 36,
    currentWaitEstimate: 15,
    bedOccupancy: "90%",
    totalBeds: 900,
    availableBeds: 85,
    icuAvailable: 28
  },

  // 10. Rajkot - P.D.U. Government Medical College & Hospital
  {
    id: "hosp-pdu-rajkot",
    name: "Pandit Deendayal Upadhyay (P.D.U.) Civil Hospital & Medical College",
    category: "State Medical College",
    state: "Gujarat",
    city: "Rajkot",
    address: "Jamnagar Road, Near Jubilee Garden, Rajkot, Gujarat - 360001",
    distance: "2.0 km away",
    contact: "+91 281 245 4235",
    emergency: "108",
    abhaCertified: true,
    departmentsAvailable: ["General Medicine", "General Surgery", "Orthopedics", "Pediatrics", "ENT", "Psychiatry", "Chest & TB"],
    activeDoctorCount: 38,
    currentWaitEstimate: 10,
    bedOccupancy: "76%",
    totalBeds: 1000,
    availableBeds: 210,
    icuAvailable: 22
  },

  // 11. Surat - SMIMER Hospital (Surat Municipal Institute of Medical Education and Research)
  {
    id: "hosp-smimer-surat",
    name: "SMIMER Hospital & Municipal Medical College Surat",
    category: "State Medical College",
    state: "Gujarat",
    city: "Surat",
    address: "Opp. Bombay Market, Umarwada, Surat, Gujarat - 395010",
    distance: "2.5 km away",
    contact: "+91 261 236 8040",
    emergency: "108",
    abhaCertified: true,
    departmentsAvailable: ["General Medicine", "Emergency Medicine", "Pediatrics", "Orthopedics", "Ophthalmology", "Dermatology"],
    activeDoctorCount: 35,
    currentWaitEstimate: 11,
    bedOccupancy: "80%",
    totalBeds: 1100,
    availableBeds: 210,
    icuAvailable: 20
  },

  // 12. Junagadh - GMERS Medical College & General Hospital
  {
    id: "hosp-gmers-junagadh",
    name: "GMERS General Hospital & Medical College Junagadh",
    category: "District Hospital",
    state: "Gujarat",
    city: "Junagadh",
    address: "Majiwadi Gate, Junagadh, Gujarat - 362001",
    distance: "3.1 km away",
    contact: "+91 285 265 1400",
    emergency: "108",
    abhaCertified: true,
    departmentsAvailable: ["General Medicine", "Pediatrics", "General Surgery", "Orthopedics", "Gynecology"],
    activeDoctorCount: 24,
    currentWaitEstimate: 8,
    bedOccupancy: "65%",
    totalBeds: 500,
    availableBeds: 165,
    icuAvailable: 14
  },

  // 13. Mehsana - General District Civil Hospital Mehsana
  {
    id: "hosp-civil-mehsana",
    name: "Civil District Hospital & Community Health Outpost Mehsana",
    category: "District Hospital",
    state: "Gujarat",
    city: "Mehsana",
    address: "Near Radhanpur Road, Mehsana, Gujarat - 384002",
    distance: "1.9 km away",
    contact: "+91 2762 252 055",
    emergency: "108",
    abhaCertified: true,
    departmentsAvailable: ["General Medicine", "Pediatrics", "Orthopedics", "Gynecology", "ENT", "AYUSH Clinic"],
    activeDoctorCount: 20,
    currentWaitEstimate: 7,
    bedOccupancy: "60%",
    totalBeds: 400,
    availableBeds: 150,
    icuAvailable: 10
  },

  // 14. Bhuj - Gujarat Adani Institute of Medical Sciences (GAIMS) GK General Hospital
  {
    id: "hosp-gk-general-bhuj",
    name: "G.K. General Hospital & GAIMS Medical College Bhuj",
    category: "District Hospital",
    state: "Gujarat",
    city: "Bhuj",
    address: "Lotus Colony, Bhuj, Kutch, Gujarat - 370001",
    distance: "2.3 km away",
    contact: "+91 2832 246 417",
    emergency: "108",
    abhaCertified: true,
    departmentsAvailable: ["General Medicine", "Trauma Care", "Pediatrics", "Orthopedics", "Ophthalmology", "Dermatology"],
    activeDoctorCount: 30,
    currentWaitEstimate: 9,
    bedOccupancy: "70%",
    totalBeds: 750,
    availableBeds: 210,
    icuAvailable: 18
  },

  // 15. Anand - Pramukhswami Medical College & Shree Krishna Hospital
  {
    id: "hosp-shree-krishna-karamsad",
    name: "Shree Krishna Hospital & Pramukhswami Medical College",
    category: "Super Specialty",
    state: "Gujarat",
    city: "Anand",
    address: "Gokal Nagar, Karamsad, Anand, Gujarat - 388325",
    distance: "3.4 km away",
    contact: "+91 2692 228 411",
    emergency: "+91 2692 228 100",
    abhaCertified: true,
    departmentsAvailable: ["General Medicine", "Cardiology", "Neurology", "Cancer Center", "Orthopedics", "Critical Care"],
    activeDoctorCount: 42,
    currentWaitEstimate: 10,
    bedOccupancy: "79%",
    totalBeds: 900,
    availableBeds: 180,
    icuAvailable: 25
  },

  // 16. Valsad - GMERS Medical College & Hospital Valsad
  {
    id: "hosp-gmers-valsad",
    name: "GMERS Medical College & Civil Hospital Valsad",
    category: "District Hospital",
    state: "Gujarat",
    city: "Valsad",
    address: "Halar Road, Nanakwada, Valsad, Gujarat - 396001",
    distance: "2.2 km away",
    contact: "+91 2632 250 520",
    emergency: "108",
    abhaCertified: true,
    departmentsAvailable: ["General Medicine", "Pediatrics", "Gynecology", "Orthopedics", "ENT", "General Surgery"],
    activeDoctorCount: 22,
    currentWaitEstimate: 8,
    bedOccupancy: "64%",
    totalBeds: 500,
    availableBeds: 170,
    icuAvailable: 12
  },

  // 17. Himatnagar - GMERS Medical College & General Hospital Sabarkantha
  {
    id: "hosp-gmers-himatnagar",
    name: "GMERS General Hospital & Medical College Himatnagar",
    category: "District Hospital",
    state: "Gujarat",
    city: "Himatnagar",
    address: "Near Motipura Circle, Himatnagar, Sabarkantha, Gujarat - 383001",
    distance: "2.0 km away",
    contact: "+91 2772 229 100",
    emergency: "108",
    abhaCertified: true,
    departmentsAvailable: ["General Medicine", "Pediatrics", "Orthopedics", "Gynecology", "Ophthalmology"],
    activeDoctorCount: 20,
    currentWaitEstimate: 7,
    bedOccupancy: "62%",
    totalBeds: 500,
    availableBeds: 180,
    icuAvailable: 12
  },

  // 18. Surat - Seventh-day Adventist & Community Health Hospital
  {
    id: "hosp-sda-surat",
    name: "Community Multi-Specialty Health Center & SDA Hospital",
    category: "Community Health Center",
    state: "Gujarat",
    city: "Surat",
    address: "Athwa Lines, Near Chopati, Surat, Gujarat - 395001",
    distance: "1.7 km away",
    contact: "+91 261 266 9101",
    emergency: "108",
    abhaCertified: true,
    departmentsAvailable: ["General Medicine", "Pediatrics", "Orthopedics", "Dermatology", "Dental", "ENT"],
    activeDoctorCount: 18,
    currentWaitEstimate: 6,
    bedOccupancy: "55%",
    totalBeds: 250,
    availableBeds: 105,
    icuAvailable: 8
  }
];
