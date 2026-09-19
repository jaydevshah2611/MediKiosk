import { Token, TokenQueue, TokenStatus, Department, TokenStatistics } from "@/types/token";

export const departments: { id: Department; name: string; icon: string }[] = [
  { id: "general_medicine", name: "General Medicine", icon: "🫀" },
  { id: "orthopedics", name: "Orthopedics", icon: "🦴" },
  { id: "ayurveda", name: "Ayurveda", icon: "🌿" },
  { id: "ophthalmology", name: "Ophthalmology", icon: "👁️" },
  { id: "ent", name: "ENT", icon: "👂" },
  { id: "neurology", name: "Neurology", icon: "🧠" },
  { id: "dermatology", name: "Dermatology", icon: "🧴" },
  { id: "dental", name: "Dental", icon: "🦷" },
  { id: "cardiology", name: "Cardiology", icon: "❤️" },
  { id: "pediatrics", name: "Pediatrics", icon: "👶" },
  { id: "gynecology", name: "Gynecology", icon: "👩" },
  { id: "other", name: "Other", icon: "🏥" },
];

export class TokenManager {
  private storageKey = "hospitalTokens";

  private getInitialSeedQueues(): Record<string, TokenQueue> {
    const now = Date.now();
    const queues: Record<string, TokenQueue> = {};

    departments.forEach(dept => {
      queues[dept.id] = {
        department: dept.id,
        tokens: [],
        averageWaitTime: 12,
        doctorsAvailable: 2,
      };
    });

    // Seed realistic initial tokens in OPD
    queues.general_medicine.tokens = [
      {
        id: "seed-tok-1",
        tokenNumber: "G-001",
        patientId: "pat-101",
        patientName: "Aarav Sharma",
        department: "general_medicine",
        status: "in_consultation",
        priority: false,
        issuedAt: new Date(now - 35 * 60 * 1000).toISOString(),
        consultationStartTime: new Date(now - 10 * 60 * 1000).toISOString(),
        estimatedWaitTime: 5,
        symptoms: ["Cough", "Mild Fever"]
      },
      {
        id: "seed-tok-2",
        tokenNumber: "G-002",
        patientId: "pat-102",
        patientName: "Meera Patel",
        department: "general_medicine",
        status: "waiting",
        priority: true,
        issuedAt: new Date(now - 25 * 60 * 1000).toISOString(),
        estimatedWaitTime: 8,
        symptoms: ["Acute Wheezing", "Chest Tightness"]
      },
      {
        id: "seed-tok-3",
        tokenNumber: "G-003",
        patientId: "pat-103",
        patientName: "Jayesh Shah",
        department: "general_medicine",
        status: "waiting",
        priority: false,
        issuedAt: new Date(now - 15 * 60 * 1000).toISOString(),
        estimatedWaitTime: 18,
        symptoms: ["Acid Reflux", "Epigastric Discomfort"]
      },
      {
        id: "seed-tok-4",
        tokenNumber: "G-004",
        patientId: "pat-104",
        patientName: "Sunita Joshi",
        department: "general_medicine",
        status: "completed",
        priority: false,
        issuedAt: new Date(now - 65 * 60 * 1000).toISOString(),
        consultationStartTime: new Date(now - 45 * 60 * 1000).toISOString(),
        consultationEndTime: new Date(now - 30 * 60 * 1000).toISOString(),
        actualWaitTime: 20,
        symptoms: ["Seasonal Allergy", "Sneezing"]
      }
    ];

    queues.orthopedics.tokens = [
      {
        id: "seed-tok-5",
        tokenNumber: "O-001",
        patientId: "pat-105",
        patientName: "Kavita Desai",
        department: "orthopedics",
        status: "in_consultation",
        priority: false,
        issuedAt: new Date(now - 40 * 60 * 1000).toISOString(),
        consultationStartTime: new Date(now - 8 * 60 * 1000).toISOString(),
        estimatedWaitTime: 6,
        symptoms: ["Lumbar Back Pain"]
      },
      {
        id: "seed-tok-6",
        tokenNumber: "O-002",
        patientId: "pat-106",
        patientName: "Dinesh Solanki",
        department: "orthopedics",
        status: "waiting",
        priority: false,
        issuedAt: new Date(now - 20 * 60 * 1000).toISOString(),
        estimatedWaitTime: 15,
        symptoms: ["Right Knee Swelling"]
      }
    ];

    queues.ayurveda.tokens = [
      {
        id: "seed-tok-7",
        tokenNumber: "A-001",
        patientId: "pat-107",
        patientName: "Pooja Trivedi",
        department: "ayurveda",
        status: "in_consultation",
        priority: false,
        issuedAt: new Date(now - 30 * 60 * 1000).toISOString(),
        consultationStartTime: new Date(now - 5 * 60 * 1000).toISOString(),
        estimatedWaitTime: 10,
        symptoms: ["Vata Imbalance", "Chronic Joint Stiffness"]
      },
      {
        id: "seed-tok-8",
        tokenNumber: "A-002",
        patientId: "pat-108",
        patientName: "Mukesh Parmar",
        department: "ayurveda",
        status: "waiting",
        priority: false,
        issuedAt: new Date(now - 12 * 60 * 1000).toISOString(),
        estimatedWaitTime: 22,
        symptoms: ["Pitta Flare", "Hyperacidity"]
      }
    ];

    queues.cardiology.tokens = [
      {
        id: "seed-tok-9",
        tokenNumber: "C-001",
        patientId: "pat-109",
        patientName: "Harshil Dave",
        department: "cardiology",
        status: "waiting",
        priority: true,
        issuedAt: new Date(now - 18 * 60 * 1000).toISOString(),
        estimatedWaitTime: 5,
        symptoms: ["Palpitations", "High Blood Pressure 155/95"]
      },
      {
        id: "seed-tok-10",
        tokenNumber: "C-002",
        patientId: "pat-110",
        patientName: "Bhavna Vora",
        department: "cardiology",
        status: "waiting",
        priority: false,
        issuedAt: new Date(now - 10 * 60 * 1000).toISOString(),
        estimatedWaitTime: 20,
        symptoms: ["Routine Lipid & ECG Follow-up"]
      }
    ];

    queues.pediatrics.tokens = [
      {
        id: "seed-tok-11",
        tokenNumber: "P-001",
        patientId: "pat-111",
        patientName: "Baby Ananya",
        department: "pediatrics",
        status: "waiting",
        priority: false,
        issuedAt: new Date(now - 14 * 60 * 1000).toISOString(),
        estimatedWaitTime: 12,
        symptoms: ["Immunization Booster", "Growth Checkup"]
      }
    ];

    queues.ophthalmology.tokens = [
      {
        id: "seed-tok-12",
        tokenNumber: "E-001",
        patientId: "pat-112",
        patientName: "Ramesh Makwana",
        department: "ophthalmology",
        status: "waiting",
        priority: false,
        issuedAt: new Date(now - 8 * 60 * 1000).toISOString(),
        estimatedWaitTime: 25,
        symptoms: ["Blurred Vision", "Refraction Testing"]
      }
    ];

    return queues;
  }

  generateTokenNumber(department: Department, sequence: number): string {
    const prefix = department.substring(0, 1).toUpperCase();
    return `${prefix}-${String(sequence).padStart(3, '0')}`;
  }

  getDepartmentQueue(department: Department): TokenQueue {
    if (typeof window === "undefined") {
      return {
        department,
        tokens: [],
        averageWaitTime: 0,
        doctorsAvailable: 1,
      };
    }

    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      const initialQueues = this.getInitialSeedQueues();
      localStorage.setItem(this.storageKey, JSON.stringify(initialQueues));
      return initialQueues[department] || {
        department,
        tokens: [],
        averageWaitTime: 12,
        doctorsAvailable: 1,
      };
    }

    try {
      const allQueues = JSON.parse(data);
      if (!allQueues[department]) {
        allQueues[department] = {
          department,
          tokens: [],
          averageWaitTime: 12,
          doctorsAvailable: 1,
        };
        localStorage.setItem(this.storageKey, JSON.stringify(allQueues));
      }
      return allQueues[department];
    } catch {
      const initialQueues = this.getInitialSeedQueues();
      localStorage.setItem(this.storageKey, JSON.stringify(initialQueues));
      return initialQueues[department];
    }
  }

  saveDepartmentQueue(queue: TokenQueue): void {
    if (typeof window === "undefined") return;

    const data = localStorage.getItem(this.storageKey) || "{}";
    let allQueues: Record<string, TokenQueue> = {};
    try {
      allQueues = JSON.parse(data);
    } catch {
      allQueues = this.getInitialSeedQueues();
    }
    allQueues[queue.department] = queue;
    localStorage.setItem(this.storageKey, JSON.stringify(allQueues));
  }

  issueToken(
    patientId: string,
    patientName: string,
    department: Department,
    priority: boolean = false,
    symptoms?: string[],
    extras?: { severityScore?: number; hospitalName?: string; phone?: string }
  ): Token {
    const queue = this.getDepartmentQueue(department);
    const sequence = queue.tokens.length + 1;
    const tokenNumber = this.generateTokenNumber(department, sequence);
    const severityScore = extras?.severityScore ?? (priority ? 8 : 4);

    const token: Token = {
      id: `token-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tokenNumber,
      patientId,
      patientName,
      department,
      status: priority || severityScore >= 8 ? "priority" : "waiting",
      priority: priority || severityScore >= 8,
      issuedAt: new Date().toISOString(),
      estimatedWaitTime: this.calculateEstimatedWaitTime(queue),
      symptoms,
      severityScore,
      hospitalName: extras?.hospitalName,
      phone: extras?.phone,
    };

    if (token.priority) {
      queue.tokens.unshift(token);
    } else {
      queue.tokens.push(token);
    }

    this.saveDepartmentQueue(queue);
    void import("./liveClient").then((m) => m.upsertLive({ tokens: [token] })).catch(() => {});
    return token;
  }

  updateTokenStatus(tokenId: string, status: TokenStatus): Token | null {
    // Find token across all departments
    for (const dept of departments) {
      const queue = this.getDepartmentQueue(dept.id);
      const tokenIndex = queue.tokens.findIndex(t => t.id === tokenId);

      if (tokenIndex !== -1) {
        const token = queue.tokens[tokenIndex];
        token.status = status;

        if (status === "in_consultation") {
          token.consultationStartTime = new Date().toISOString();
          queue.currentToken = token.tokenNumber;
        } else if (status === "completed") {
          token.consultationEndTime = new Date().toISOString();
          if (token.consultationStartTime) {
            const start = new Date(token.consultationStartTime);
            const end = new Date(token.consultationEndTime);
            token.actualWaitTime = Math.floor((start.getTime() - new Date(token.issuedAt).getTime()) / 60000);
          }
          queue.currentToken = undefined;
        }

        this.saveDepartmentQueue(queue);
        void import("./liveClient").then((m) => m.patchLiveTokenStatus(tokenId, status)).catch(() => {});
        return token;
      }
    }

    return null;
  }

  getAllTokens(): Token[] {
    const list: Token[] = [];
    for (const dept of departments) {
      list.push(...this.getDepartmentQueue(dept.id).tokens);
    }
    return list;
  }

  upsertTokens(tokens: Token[]): void {
    for (const token of tokens) {
      const dept = token.department || "general_medicine";
      const queue = this.getDepartmentQueue(dept);
      const normalized = { ...token, department: dept };
      const idx = queue.tokens.findIndex((t) => t.id === token.id);
      if (idx >= 0) {
        queue.tokens[idx] = { ...queue.tokens[idx], ...normalized };
      } else {
        queue.tokens.push(normalized);
      }
      this.saveDepartmentQueue(queue);
    }
  }

  deleteToken(tokenId: string): boolean {
    let deleted = false;
    for (const dept of departments) {
      const queue = this.getDepartmentQueue(dept.id);
      const initialCount = queue.tokens.length;
      queue.tokens = queue.tokens.filter(t => t.id !== tokenId);

      if (queue.tokens.length < initialCount) {
        if (queue.currentToken && queue.tokens.every(t => t.tokenNumber !== queue.currentToken)) {
          queue.currentToken = undefined;
        }
        this.saveDepartmentQueue(queue);
        deleted = true;
      }
    }
    return deleted;
  }

  assignDoctorToToken(tokenId: string, doctorId: string, doctorName: string): Token | null {
    for (const dept of departments) {
      const queue = this.getDepartmentQueue(dept.id);
      const tokenIndex = queue.tokens.findIndex(t => t.id === tokenId);

      if (tokenIndex !== -1) {
        queue.tokens[tokenIndex].doctorId = doctorId;
        queue.tokens[tokenIndex].doctorName = doctorName;
        this.saveDepartmentQueue(queue);
        return queue.tokens[tokenIndex];
      }
    }
    return null;
  }

  calculateEstimatedWaitTime(queue: TokenQueue): number {
    const waitingTokens = queue.tokens.filter(t => t.status === "waiting" || t.status === "priority");
    const doctorsAvailable = queue.doctorsAvailable || 1;
    const avgConsultationTime = 15; // minutes

    return Math.ceil((waitingTokens.length * avgConsultationTime) / doctorsAvailable);
  }

  getStatistics(): TokenStatistics {
    if (typeof window === "undefined") {
      return {
        totalIssued: 0,
        totalCompleted: 0,
        averageWaitTime: 0,
        averageConsultationTime: 0,
        priorityCases: 0,
        skippedCases: 0,
        byDepartment: {} as any,
      };
    }

    const data = localStorage.getItem(this.storageKey);
    let allQueues: Record<string, TokenQueue> = {};
    if (!data) {
      allQueues = this.getInitialSeedQueues();
    } else {
      try {
        allQueues = JSON.parse(data);
      } catch {
        allQueues = this.getInitialSeedQueues();
      }
    }

    let totalIssued = 0;
    let totalCompleted = 0;
    let totalWaitTime = 0;
    let completedWithWaitTime = 0;
    let priorityCases = 0;
    let skippedCases = 0;
    const byDepartment: Record<Department, { issued: number; completed: number; averageWaitTime: number }> = {} as Record<Department, { issued: number; completed: number; averageWaitTime: number }>;

    for (const dept of departments) {
      const queue = allQueues[dept.id];
      if (!queue) continue;

      const deptIssued = queue.tokens.length;
      const deptCompleted = queue.tokens.filter((t: Token) => t.status === "completed").length;
      const deptWaitTime = queue.tokens
        .filter((t: Token) => t.status === "completed" && t.actualWaitTime)
        .reduce((sum: number, t: Token) => sum + (t.actualWaitTime || 0), 0);
      const deptCompletedWithWait = queue.tokens.filter((t: Token) => t.status === "completed" && t.actualWaitTime).length;
      const deptPriority = queue.tokens.filter((t: Token) => t.priority).length;
      const deptSkipped = queue.tokens.filter((t: Token) => t.status === "skipped").length;

      totalIssued += deptIssued;
      totalCompleted += deptCompleted;
      totalWaitTime += deptWaitTime;
      completedWithWaitTime += deptCompletedWithWait;
      priorityCases += deptPriority;
      skippedCases += deptSkipped;

      byDepartment[dept.id] = {
        issued: deptIssued,
        completed: deptCompleted,
        averageWaitTime: deptCompletedWithWait > 0 ? Math.round(deptWaitTime / deptCompletedWithWait) : 0,
      };
    }

    return {
      totalIssued,
      totalCompleted,
      averageWaitTime: completedWithWaitTime > 0 ? Math.round(totalWaitTime / completedWithWaitTime) : 12,
      averageConsultationTime: 15,
      priorityCases,
      skippedCases,
      byDepartment,
    };
  }

  getNextToken(department: Department): Token | null {
    const queue = this.getDepartmentQueue(department);
    const nextToken = queue.tokens.find(t => t.status === "waiting" || t.status === "priority");
    return nextToken || null;
  }

  getCurrentToken(department: Department): Token | null {
    const queue = this.getDepartmentQueue(department);
    if (!queue.currentToken) return null;
    return queue.tokens.find(t => t.tokenNumber === queue.currentToken) || null;
  }

  getTokensByPatient(patientId: string): Token[] {
    const patientTokens: Token[] = [];

    for (const dept of departments) {
      const queue = this.getDepartmentQueue(dept.id);
      const tokens = queue.tokens.filter((t: Token) => t.patientId === patientId);
      patientTokens.push(...tokens);
    }

    return patientTokens.sort((a, b) =>
      new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
    );
  }
}

export const tokenManager = new TokenManager();
