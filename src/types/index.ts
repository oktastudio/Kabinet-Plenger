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
  | "MINISTER_ENACT"
  | "DEBATE_VOTE"
  | "ENDED";

export type AvatarMood = "NORMAL" | "SWEAT" | "SMIRK" | "SHOCK";

export interface CabinetMetrics {
  budgetTrillion: number;
  publicTrust: number;
  dprSupport: number;
  auditScore: number;
}

export interface PolicyCard {
  id: string;
  alignment: PolicyAlignment;
  title: string;
  tagLine: string;
  delta: Partial<CabinetMetrics>;
}

export interface CrisisScenario {
  id: string;
  headline: string;
  cards: [PolicyCard, PolicyCard, PolicyCard];
}

export interface CabinetSeat {
  id: string;
  name: string;
  roleId: RoleId;
  shortTitle: string;
  roleTitle: string;
  suitColor: string;
  hasGlasses: boolean;
  hasMustache: boolean;
  isHuman: boolean;
  faction: FactionType;
  eliminated: boolean;
  suspicion: number;
  mood: AvatarMood;
  chatter: string;
  voteChoice?: string; // "AMAN" atau "RESHUFFLE:<seatId>"
}

export interface StampOverlay {
  id: number;
  text: string;
  color: string;
  subtext: string;
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
  drawnCards: PolicyCard[];
  passedCards: PolicyCard[];
  lastEnactedCard: PolicyCard | null;
  activeHumanIndex: number;
  privacyCurtainOpen: boolean;
  tickerText: string;
  lastStamp: StampOverlay | null;
  winnerFaction: FactionType | "NONE" | null;
  endReason: string;
}
