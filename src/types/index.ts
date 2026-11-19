export type RoleId =
  | "PRESIDEN"
  | "MENKEU"
  | "MENDAGRI"
  | "MENKOMDIGI"
  | "MENSOS"
  | "MENHUB"
  | "MENKES"
  | "MENHUKUM";

export type OriginType = "TEKNOKRAT" | "PARTAI" | "PENGUSAHA";

export type PolicyOptionId = "A" | "B" | "C";

export interface CabinetStateMetrics {
  budgetTrillion: number;
  publicTrust: number;
  dprSupport: number;
  economicStability: number;
  auditScore: number;
}

export interface PolicyOption {
  id: PolicyOptionId;
  title: string;
  summary: string;
  realWorldTradeoff: string;
  delta: Partial<CabinetStateMetrics>;
}

export interface NationalIssue {
  id: string;
  ministry: string;
  title: string;
  context: string;
  options: PolicyOption[];
}

export interface PublicScandal {
  id: string;
  headline: string;
  detail: string;
  severity: "TINGGI" | "KRITIS";
  responses: {
    id: PolicyOptionId;
    label: string;
    note: string;
    delta: Partial<CabinetStateMetrics>;
  }[];
}

export interface MinisterMember {
  id: string;
  name: string;
  roleId: RoleId;
  roleTitle: string;
  origin: OriginType;
  isPlayer: boolean;
  isBot: boolean;
  tacticalFund: number;
  taskDoneYear: number;
  votedOption?: PolicyOptionId;
}

export interface FeedEntry {
  id: string;
  year: number;
  tag: "SIDANG" | "BERITA" | "SEKTORAL" | "LOBI" | "RESHUFFLE" | "SKANDAL";
  text: string;
}

export interface GameSimulationState {
  countryName: string;
  presidentName: string;
  year: number;
  maxYears: number;
  status: "ACTIVE" | "ENDED";
  endSummary: string;
  reshuffleDoneYear: number;
  activeScandal: PublicScandal | null;
  metrics: CabinetStateMetrics;
  currentIssue: NationalIssue;
  usedIssueIds: string[];
  members: MinisterMember[];
  playerId: string;
  feed: FeedEntry[];
}
