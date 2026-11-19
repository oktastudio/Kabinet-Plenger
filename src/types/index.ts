export type RoleId =
  | "PRESIDEN"
  | "MENKEU"
  | "MENDAGRI"
  | "MENKOMDIGI"
  | "MENSOS"
  | "MENHUB"
  | "MENKES"
  | "MENHUKUM";

export type FactionType = "REFORMIS" | "OPORTUNIS";

export type PolicyAlignment = "BERSIH" | "KOMPROMI" | "TITIPAN";

export type GameMode = "SOLO" | "MULTIPLAYER";

export type TurnPhase =
  | "ROLE_REVEAL"
  | "SELECT_EXECUTOR"
  | "PRESIDENT_DISCARD"
  | "MINISTER_ENACT"
  | "DEBATE_VOTE"
  | "ENDED";

export interface CabinetMetrics {
  budgetTrillion: number; // Kas APBN (Rp Triliun)
  publicTrust: number; // Kepercayaan Publik (0-100)
  dprSupport: number; // Dukungan Koalisi DPR (0-100)
  auditScore: number; // Skor Audit & Tata Kelola (0-100)
}

export interface PolicyCard {
  id: string;
  alignment: PolicyAlignment;
  title: string;
  summary: string;
  tradeoffNote: string;
  delta: Partial<CabinetMetrics>;
}

export interface CrisisScenario {
  id: string;
  ministryHint: string;
  headline: string;
  context: string;
  cards: [PolicyCard, PolicyCard, PolicyCard];
}

export interface CabinetSeat {
  id: string;
  name: string;
  roleId: RoleId;
  roleTitle: string;
  isHuman: boolean;
  faction: FactionType;
  eliminated: boolean;
  suspicion: number; // Skor kecurigaan AI (0-100)
  voteChoice?: string; // "AMAN" atau "RESHUFFLE:<seatId>"
}

export interface LogEntry {
  id: string;
  year: number;
  tag: "SIDANG" | "KEBIJAKAN" | "RESHUFFLE" | "SKANDAL" | "HASIL";
  text: string;
}

export interface PlengerGameState {
  mode: GameMode;
  cabinetName: string;
  year: number;
  maxYears: number;
  phase: TurnPhase;
  metrics: CabinetMetrics;
  seats: CabinetSeat[];
  presidentSeatId: string;
  executorSeatId: string | null;
  lastExecutorSeatId: string | null;
  currentCrisis: CrisisScenario;
  usedCrisisIds: string[];
  drawnCards: PolicyCard[]; // 3 kartu awal Presiden
  passedCards: PolicyCard[]; // 2 kartu ke Menteri Pelaksana
  lastEnactedCard: PolicyCard | null;
  activeHumanIndex: number; // Untuk giliran Pass-and-Play Multiplayer
  privacyCurtainOpen: boolean;
  winnerFaction: FactionType | "NONE" | null;
  endReason: string;
  logs: LogEntry[];
}
