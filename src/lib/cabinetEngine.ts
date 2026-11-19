import {
  AvatarMood,
  CabinetMetrics,
  CabinetSeat,
  CrisisScenario,
  FactionType,
  GameMode,
  PlengerGameState,
  PolicyCard,
  RoleId,
} from "@/types";

export const CABINET_ROLES: {
  roleId: RoleId;
  shortTitle: string;
  roleTitle: string;
  botDefaultName: string;
  suitColor: string;
  hasGlasses: boolean;
  hasMustache: boolean;
}[] = [
  {
    roleId: "PRESIDEN",
    shortTitle: "PRESIDEN",
    roleTitle: "Presiden Republik",
    botDefaultName: "Pak Surya",
    suitColor: "#dc2626",
    hasGlasses: false,
    hasMustache: true,
  },
  {
    roleId: "MENKEU",
    shortTitle: "MENKEU",
    roleTitle: "Menteri Keuangan",
    botDefaultName: "Bu Sri",
    suitColor: "#2563eb",
    hasGlasses: true,
    hasMustache: false,
  },
  {
    roleId: "MENDAGRI",
    shortTitle: "MENDAGRI",
    roleTitle: "Menteri Dalam Negeri",
    botDefaultName: "Pak Tito",
    suitColor: "#d97706",
    hasGlasses: false,
    hasMustache: true,
  },
  {
    roleId: "MENKOMDIGI",
    shortTitle: "KOMDIGI",
    roleTitle: "Menteri Komdigi",
    botDefaultName: "Bang Budi",
    suitColor: "#0d9488",
    hasGlasses: true,
    hasMustache: false,
  },
  {
    roleId: "MENSOS",
    shortTitle: "MENSOS",
    roleTitle: "Menteri Sosial",
    botDefaultName: "Bu Risma",
    suitColor: "#e11d48",
    hasGlasses: true,
    hasMustache: false,
  },
  {
    roleId: "MENHUB",
    shortTitle: "MENHUB",
    roleTitle: "Menteri Perhubungan",
    botDefaultName: "Pak Karya",
    suitColor: "#0284c7",
    hasGlasses: false,
    hasMustache: false,
  },
  {
    roleId: "MENKES",
    shortTitle: "MENKES",
    roleTitle: "Menteri Kesehatan",
    botDefaultName: "Pak Budi G.",
    suitColor: "#16a34a",
    hasGlasses: true,
    hasMustache: false,
  },
  {
    roleId: "MENHUKUM",
    shortTitle: "MENHUKUM",
    roleTitle: "Menteri Hukum",
    botDefaultName: "Prof. Yusril",
    suitColor: "#7c3aed",
    hasGlasses: false,
    hasMustache: true,
  },
];

export const CRISIS_DECK: CrisisScenario[] = [
  {
    id: "CR_PANGAN",
    headline: "HARGA BERAS & CABAI NAIK DRASTIS!",
    cards: [
      {
        id: "C_PANGAN_1",
        alignment: "BERSIH",
        title: "Operasi Pasar & Buka Data Gudang",
        tagLine: "APBN -65T • PUBLIK +9% • AUDIT +6%",
        delta: { budgetTrillion: -65, publicTrust: 9, auditScore: 6 },
      },
      {
        id: "C_PANGAN_2",
        alignment: "KOMPROMI",
        title: "Subsidi Ongkos Angkut BUMN",
        tagLine: "APBN -50T • PUBLIK +4% • DPR +6%",
        delta: { budgetTrillion: -50, publicTrust: 4, dprSupport: 6 },
      },
      {
        id: "C_PANGAN_3",
        alignment: "TITIPAN",
        title: "Kuota Impor Rekanan Tanpa Lelang",
        tagLine: "APBN -120T • DPR +10% • AUDIT -17%",
        delta: {
          budgetTrillion: -120,
          dprSupport: 10,
          auditScore: -17,
          publicTrust: -6,
        },
      },
    ],
  },
  {
    id: "CR_SERVER",
    headline: "SERVER LAYANAN PUBLIK DOWN & DATA BOCOR!",
    cards: [
      {
        id: "C_DATA_1",
        alignment: "BERSIH",
        title: "Audit Forensik & Buka Laporan",
        tagLine: "APBN -40T • AUDIT +11% • PUBLIK +6%",
        delta: { budgetTrillion: -40, auditScore: 11, publicTrust: 6 },
      },
      {
        id: "C_DATA_2",
        alignment: "KOMPROMI",
        title: "Bentuk Satgas Lintas Kementerian",
        tagLine: "APBN -30T • DPR +5% • PUBLIK +2%",
        delta: { budgetTrillion: -30, dprSupport: 5, publicTrust: 2 },
      },
      {
        id: "C_DATA_3",
        alignment: "TITIPAN",
        title: "Proyek Cloud Darurat Mark-Up 300%",
        tagLine: "APBN -135T • DPR +9% • AUDIT -18%",
        delta: {
          budgetTrillion: -135,
          dprSupport: 9,
          auditScore: -18,
          publicTrust: -7,
        },
      },
    ],
  },
  {
    id: "CR_BANSOS",
    headline: "TEMUAN DATA GANDA PENERIMA BANSOS!",
    cards: [
      {
        id: "C_BANSOS_1",
        alignment: "BERSIH",
        title: "Verifikasi NIK & Transfer Langsung",
        tagLine: "APBN -55T • AUDIT +12% • PUBLIK +5%",
        delta: { budgetTrillion: -55, auditScore: 12, publicTrust: 5 },
      },
      {
        id: "C_BANSOS_2",
        alignment: "KOMPROMI",
        title: "Cairkan Bertahap Bareng Pemda",
        tagLine: "APBN -75T • PUBLIK +7% • AUDIT -4%",
        delta: {
          budgetTrillion: -75,
          publicTrust: 7,
          dprSupport: 5,
          auditScore: -4,
        },
      },
      {
        id: "C_BANSOS_3",
        alignment: "TITIPAN",
        title: "Paket Sembako Stiker Konstituen",
        tagLine: "APBN -140T • DPR +12% • AUDIT -19%",
        delta: {
          budgetTrillion: -140,
          dprSupport: 12,
          auditScore: -19,
          publicTrust: -4,
        },
      },
    ],
  },
  {
    id: "CR_RUU",
    headline: "DEMO MAHASISWA TOLAK DRAF RUU KILAT!",
    cards: [
      {
        id: "C_RUU_1",
        alignment: "BERSIH",
        title: "Tunda Ketok Palu & Buka Uji Publik",
        tagLine: "PUBLIK +11% • AUDIT +7% • DPR -8%",
        delta: { publicTrust: 11, auditScore: 7, dprSupport: -8 },
      },
      {
        id: "C_RUU_2",
        alignment: "KOMPROMI",
        title: "Pangkas Pasal Karet & Lobi Fraksi",
        tagLine: "PUBLIK +4% • DPR +5% • AUDIT +2%",
        delta: { publicTrust: 4, dprSupport: 5, auditScore: 2 },
      },
      {
        id: "C_RUU_3",
        alignment: "TITIPAN",
        title: "Sahkan Dini Hari + Pasal Selundupan",
        tagLine: "DPR +14% • PUBLIK -14% • AUDIT -16%",
        delta: { dprSupport: 14, publicTrust: -14, auditScore: -16 },
      },
    ],
  },
  {
    id: "CR_AKHIR",
    headline: "TUTUP BUKU AKHIR MASA JABATAN!",
    cards: [
      {
        id: "C_END_1",
        alignment: "BERSIH",
        title: "Pangkas Rapat Hotel & Tutup WTP",
        tagLine: "APBN +60T • AUDIT +12% • DPR -5%",
        delta: {
          budgetTrillion: 60,
          auditScore: 12,
          publicTrust: 6,
          dprSupport: -5,
        },
      },
      {
        id: "C_END_2",
        alignment: "KOMPROMI",
        title: "Tuntaskan Puskesmas & Angkutan",
        tagLine: "APBN -65T • PUBLIK +9% • DPR +4%",
        delta: { budgetTrillion: -65, publicTrust: 9, dprSupport: 4 },
      },
      {
        id: "C_END_3",
        alignment: "TITIPAN",
        title: "Cairkan Proyek Mercusuar Akhir Tahun",
        tagLine: "APBN -150T • DPR +11% • AUDIT -18%",
        delta: {
          budgetTrillion: -150,
          dprSupport: 11,
          auditScore: -18,
          publicTrust: -6,
        },
      },
    ],
  },
];

const BANTER_BERSIH = [
  "Nah gitu dong, transparan!",
  "Aman buat laporan BPK!",
  "Rakyat tepuk tangan ini.",
  "Sesuai SOP, lanjut!",
  "Dompet negara terselamatkan.",
];

const BANTER_TITIPAN = [
  "Waduh, siapa nyelipin ini?!",
  "Cuma oknum ini mah...",
  "Kok angkanya bengkak ya?",
  "Bukan saya yang tanda tangan!",
  "Sstt, yang penting fraksi aman.",
];

const BANTER_IDLE = [
  "Kopi mana kopi...",
  "Siap laksanakan!",
  "Pantau terus medsos.",
  "Jangan sampai kena OTT.",
  "Koalisi solid (katanya).",
];

function clampPercent(val: number): number {
  return Math.max(0, Math.min(100, Math.round(val)));
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function applyMetricsDelta(
  current: CabinetMetrics,
  delta: Partial<CabinetMetrics>
): CabinetMetrics {
  return {
    budgetTrillion: Math.max(
      0,
      Math.round(current.budgetTrillion + (delta.budgetTrillion ?? 0))
    ),
    publicTrust: clampPercent(current.publicTrust + (delta.publicTrust ?? 0)),
    dprSupport: clampPercent(current.dprSupport + (delta.dprSupport ?? 0)),
    auditScore: clampPercent(current.auditScore + (delta.auditScore ?? 0)),
  };
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createPlengerGame(params: {
  mode: GameMode;
  cabinetName: string;
  humanNames: string[];
  soloPreferredRole?: RoleId;
  soloPreferredFaction?: FactionType | "RANDOM";
}): PlengerGameState {
  const cleanHumans =
    params.humanNames.map((n) => n.trim()).filter(Boolean).length > 0
      ? params.humanNames.map((n) => n.trim()).filter(Boolean)
      : ["Pemain 1"];

  const humanCount =
    params.mode === "SOLO" ? 1 : Math.min(8, Math.max(2, cleanHumans.length));

  let orderedRoles = [...CABINET_ROLES];
  if (params.mode === "SOLO" && params.soloPreferredRole) {
    const chosen = CABINET_ROLES.find(
      (r) => r.roleId === params.soloPreferredRole
    );
    const others = CABINET_ROLES.filter(
      (r) => r.roleId !== params.soloPreferredRole
    );
    if (chosen) {
      orderedRoles = [chosen, ...others];
    }
  } else if (params.mode === "MULTIPLAYER") {
    orderedRoles = shuffleArray(CABINET_ROLES);
  }

  const factionPool: FactionType[] = shuffleArray([
    "REFORMIS",
    "REFORMIS",
    "REFORMIS",
    "REFORMIS",
    "REFORMIS",
    "OPORTUNIS",
    "OPORTUNIS",
    "OPORTUNIS",
  ]);

  if (
    params.mode === "SOLO" &&
    params.soloPreferredFaction &&
    params.soloPreferredFaction !== "RANDOM"
  ) {
    const idx = factionPool.indexOf(params.soloPreferredFaction);
    if (idx > 0) {
      [factionPool[0], factionPool[idx]] = [factionPool[idx], factionPool[0]];
    }
  }

  const seats: CabinetSeat[] = orderedRoles.map((role, idx) => {
    const isHuman = idx < humanCount;
    return {
      id: `seat_${role.roleId}`,
      name: isHuman
        ? cleanHumans[idx] || `Pemain ${idx + 1}`
        : role.botDefaultName,
      roleId: role.roleId,
      shortTitle: role.shortTitle,
      roleTitle: role.roleTitle,
      suitColor: role.suitColor,
      hasGlasses: role.hasGlasses,
      hasMustache: role.hasMustache,
      isHuman,
      faction: factionPool[idx],
      eliminated: false,
      suspicion: 20,
      mood: "NORMAL",
      chatter: randomFrom(BANTER_IDLE),
    };
  });

  const presidentSeat =
    seats.find((s) => s.roleId === "PRESIDEN") ?? seats[0];
  const firstCrisis = CRISIS_DECK[0];
  const drawn = shuffleArray([...firstCrisis.cards]);

  const initialState: PlengerGameState = {
    mode: params.mode,
    cabinetName: params.cabinetName.trim() || "KABINET PLENGER",
    year: 1,
    maxYears: 5,
    phase: params.mode === "MULTIPLAYER" ? "ROLE_REVEAL" : "SELECT_EXECUTOR",
    metrics: {
      budgetTrillion: 600,
      publicTrust: 58,
      dprSupport: 56,
      auditScore: 60,
    },
    seats,
    presidentSeatId: presidentSeat.id,
    executorSeatId: null,
    lastExecutorSeatId: null,
    currentCrisis: firstCrisis,
    usedCrisisIds: [firstCrisis.id],
    drawnCards: drawn,
    passedCards: [],
    lastEnactedCard: null,
    activeHumanIndex: 0,
    privacyCurtainOpen: false,
    tickerText: `THN 1 • ${firstCrisis.headline}`,
    lastStamp: null,
    winnerFaction: null,
    endReason: "",
  };

  if (params.mode === "SOLO" && !presidentSeat.isHuman) {
    return runAiPresidentTurn(initialState);
  }

  return initialState;
}

export function runAiPresidentTurn(state: PlengerGameState): PlengerGameState {
  const pres = state.seats.find((s) => s.id === state.presidentSeatId);
  if (!pres || pres.isHuman) return state;

  const eligible = state.seats.filter(
    (s) =>
      !s.eliminated &&
      s.id !== pres.id &&
      s.id !== state.lastExecutorSeatId
  );
  const candidates =
    eligible.length > 0
      ? eligible
      : state.seats.filter((s) => !s.eliminated && s.id !== pres.id);

  const humanCandidate = candidates.find((c) => c.isHuman);
  const allyCandidate = candidates.find((c) => c.faction === pres.faction);
  const pickedExecutor =
    humanCandidate ?? allyCandidate ?? candidates[0];

  const sorted = [...state.drawnCards].sort((a, b) => {
    if (pres.faction === "OPORTUNIS") {
      const score = (c: PolicyCard) =>
        c.alignment === "TITIPAN" ? 3 : c.alignment === "KOMPROMI" ? 2 : 1;
      return score(b) - score(a);
    } else {
      const score = (c: PolicyCard) =>
        c.alignment === "BERSIH" ? 3 : c.alignment === "KOMPROMI" ? 2 : 1;
      return score(b) - score(a);
    }
  });

  const passedTwo = sorted.slice(0, 2);

  const updatedSeats = state.seats.map((s) => {
    if (s.id === pres.id) {
      return {
        ...s,
        chatter: `${pickedExecutor.shortTitle}, tolong beresin berkas ini!`,
      };
    }
    if (s.id === pickedExecutor.id) {
      return {
        ...s,
        chatter: "Siap Bos, saya cek dulu isinya!",
      };
    }
    return s;
  });

  const nextState: PlengerGameState = {
    ...state,
    seats: updatedSeats,
    executorSeatId: pickedExecutor.id,
    passedCards: passedTwo,
    phase: "MINISTER_ENACT",
    privacyCurtainOpen: false,
    tickerText: `Presiden menunjuk ${pickedExecutor.shortTitle} (${pickedExecutor.name})`,
  };

  if (!pickedExecutor.isHuman) {
    return runAiMinisterEnact(nextState);
  }

  return nextState;
}

export function selectExecutorAndDiscard(
  state: PlengerGameState,
  executorSeatId: string,
  discardCardId: string
): PlengerGameState {
  const pres = state.seats.find((s) => s.id === state.presidentSeatId);
  const exec = state.seats.find((s) => s.id === executorSeatId);
  if (!pres || !exec) return state;

  const remaining = state.drawnCards.filter((c) => c.id !== discardCardId);
  const passedTwo = remaining.slice(0, 2);

  const updatedSeats = state.seats.map((s) => {
    if (s.id === pres.id) {
      return {
        ...s,
        chatter: `${exec.shortTitle}, lanjutkan 2 draf ini!`,
      };
    }
    if (s.id === exec.id) {
      return {
        ...s,
        chatter: "Siap, berkas diterima!",
      };
    }
    return s;
  });

  const nextState: PlengerGameState = {
    ...state,
    seats: updatedSeats,
    executorSeatId: exec.id,
    passedCards: passedTwo,
    phase: "MINISTER_ENACT",
    privacyCurtainOpen: false,
    tickerText: `${exec.shortTitle} (${exec.name}) sedang meninjau berkas...`,
  };

  if (!exec.isHuman) {
    return runAiMinisterEnact(nextState);
  }

  return nextState;
}

export function runAiMinisterEnact(state: PlengerGameState): PlengerGameState {
  const exec = state.seats.find((s) => s.id === state.executorSeatId);
  if (!exec || state.passedCards.length === 0) return state;

  const sorted = [...state.passedCards].sort((a, b) => {
    if (exec.faction === "OPORTUNIS") {
      const score = (c: PolicyCard) =>
        c.alignment === "TITIPAN" ? 3 : c.alignment === "KOMPROMI" ? 2 : 1;
      return score(b) - score(a);
    } else {
      const score = (c: PolicyCard) =>
        c.alignment === "BERSIH" ? 3 : c.alignment === "KOMPROMI" ? 2 : 1;
      return score(b) - score(a);
    }
  });

  return enactPolicyCard(state, sorted[0].id);
}

export function enactPolicyCard(
  state: PlengerGameState,
  cardId: string
): PlengerGameState {
  const exec = state.seats.find((s) => s.id === state.executorSeatId);
  const pres = state.seats.find((s) => s.id === state.presidentSeatId);
  const chosen =
    state.passedCards.find((c) => c.id === cardId) ?? state.passedCards[0];
  if (!exec || !pres || !chosen) return state;

  const nextMetrics = applyMetricsDelta(state.metrics, chosen.delta);
  const isTitipan = chosen.alignment === "TITIPAN";

  const updatedSeats: CabinetSeat[] = state.seats.map((s) => {
    if (s.eliminated) return s;

    const isInvolved = s.id === exec.id || s.id === pres.id;
    const susDelta = isInvolved
      ? isTitipan
        ? 30
        : chosen.alignment === "BERSIH"
        ? -15
        : 0
      : 0;
    const nextSuspicion = clampPercent(s.suspicion + susDelta);

    let nextMood: AvatarMood = "NORMAL";
    if (isTitipan && isInvolved) {
      nextMood = s.faction === "OPORTUNIS" ? "SMIRK" : "SWEAT";
    } else if (isTitipan) {
      nextMood = "SHOCK";
    } else if (nextSuspicion >= 50) {
      nextMood = "SWEAT";
    }

    let nextChatter = s.chatter;
    if (s.id === exec.id) {
      nextChatter = isTitipan
        ? "Lho, itu draf dari atas kok!"
        : "Sudah saya ketok palu!";
    } else if (s.id === pres.id) {
      nextChatter = isTitipan
        ? "Waduh, kok yang itu lolos?!"
        : "Kerja bagus, lanjut!";
    } else {
      nextChatter = isTitipan
        ? randomFrom(BANTER_TITIPAN)
        : randomFrom(BANTER_BERSIH);
    }

    return {
      ...s,
      suspicion: nextSuspicion,
      mood: nextMood,
      chatter: nextChatter,
      voteChoice: undefined,
    };
  });

  const stamp = {
    id: Date.now(),
    text:
      chosen.alignment === "TITIPAN"
        ? "PASAL TITIPAN!"
        : chosen.alignment === "BERSIH"
        ? "SAH & BERSIH"
        : "KOMPROMI SAH",
    color:
      chosen.alignment === "TITIPAN"
        ? "#ef4444"
        : chosen.alignment === "BERSIH"
        ? "#10b981"
        : "#3b82f6",
    subtext: chosen.tagLine,
  };

  const immediateEnd = evaluateEndConditions(
    nextMetrics,
    updatedSeats,
    state.year,
    state.maxYears,
    false
  );

  if (immediateEnd) {
    return {
      ...state,
      metrics: nextMetrics,
      seats: updatedSeats,
      lastEnactedCard: chosen,
      lastExecutorSeatId: exec.id,
      phase: "ENDED",
      lastStamp: stamp,
      winnerFaction: immediateEnd.winner,
      endReason: immediateEnd.reason,
      tickerText: immediateEnd.reason,
    };
  }

  const activeHumans = updatedSeats.filter((s) => s.isHuman && !s.eliminated);

  return {
    ...state,
    metrics: nextMetrics,
    seats: updatedSeats,
    lastEnactedCard: chosen,
    lastExecutorSeatId: exec.id,
    phase: "DEBATE_VOTE",
    activeHumanIndex: 0,
    privacyCurtainOpen: activeHumans.length <= 1,
    lastStamp: stamp,
    tickerText: `${exec.shortTitle} mengesahkan: "${chosen.title}"`,
  };
}

export function castDebateVote(
  state: PlengerGameState,
  voterSeatId: string,
  voteChoice: string
): PlengerGameState {
  const updatedSeats = state.seats.map((s) =>
    s.id === voterSeatId ? { ...s, voteChoice } : s
  );

  const activeHumans = updatedSeats.filter((s) => s.isHuman && !s.eliminated);
  const nextHumanIdx = state.activeHumanIndex + 1;

  if (nextHumanIdx < activeHumans.length) {
    return {
      ...state,
      seats: updatedSeats,
      activeHumanIndex: nextHumanIdx,
      privacyCurtainOpen: false,
    };
  }

  return resolveDebateAndAdvanceYear({
    ...state,
    seats: updatedSeats,
  });
}

function resolveDebateAndAdvanceYear(
  state: PlengerGameState
): PlengerGameState {
  const seatsWithAiVotes = state.seats.map((s) => {
    if (s.eliminated || s.isHuman) return s;

    const suspects = state.seats.filter(
      (target) =>
        !target.eliminated &&
        target.id !== s.id &&
        target.roleId !== "PRESIDEN"
    );

    if (s.faction === "REFORMIS") {
      const topSuspect = [...suspects].sort(
        (a, b) => b.suspicion - a.suspicion
      )[0];
      if (topSuspect && topSuspect.suspicion >= 45) {
        return { ...s, voteChoice: `RESHUFFLE:${topSuspect.id}` };
      }
      return { ...s, voteChoice: "AMAN" };
    } else {
      const reformisTarget = suspects.find((t) => t.faction === "REFORMIS");
      if (
        state.lastEnactedCard?.alignment === "TITIPAN" &&
        reformisTarget &&
        Math.random() > 0.45
      ) {
        return { ...s, voteChoice: `RESHUFFLE:${reformisTarget.id}` };
      }
      return { ...s, voteChoice: "AMAN" };
    }
  });

  const tally: Record<string, number> = {};
  let amanCount = 0;

  seatsWithAiVotes.forEach((s) => {
    if (s.eliminated) return;
    const v = s.voteChoice ?? "AMAN";
    if (v.startsWith("RESHUFFLE:")) {
      const targetId = v.replace("RESHUFFLE:", "");
      tally[targetId] = (tally[targetId] ?? 0) + 1;
    } else {
      amanCount += 1;
    }
  });

  let topTargetId: string | null = null;
  let topTargetVotes = 0;
  Object.entries(tally).forEach(([targetId, count]) => {
    if (count > topTargetVotes) {
      topTargetId = targetId;
      topTargetVotes = count;
    }
  });

  let nextSeats = [...seatsWithAiVotes];
  let nextMetrics = { ...state.metrics };
  let roundHeadline = "Formasi kabinet bertahan tanpa reshuffle.";
  let stamp = state.lastStamp;

  if (topTargetId && topTargetVotes >= 3 && topTargetVotes > amanCount) {
    const ousted = nextSeats.find((s) => s.id === topTargetId);
    if (ousted) {
      nextSeats = nextSeats.map((s) =>
        s.id === ousted.id
          ? {
              ...s,
              eliminated: true,
              mood: "SHOCK",
              chatter: "Lho kok saya yang dicopot?!",
            }
          : s
      );

      nextMetrics = applyMetricsDelta(nextMetrics, {
        dprSupport: -7,
        publicTrust: ousted.faction === "OPORTUNIS" ? 8 : -6,
        auditScore: ousted.faction === "OPORTUNIS" ? 9 : -4,
      });

      roundHeadline = `RESHUFFLE! ${ousted.shortTitle} (${ousted.name}) dicopot — Ternyata ${ousted.faction}!`;
      stamp = {
        id: Date.now() + 1,
        text: "DI-RESHUFFLE!",
        color: "#f59e0b",
        subtext: `${ousted.shortTitle} TERNYATA ${ousted.faction}`,
      };
    }
  }

  const isFinalYear = state.year >= state.maxYears;
  const endCheck = evaluateEndConditions(
    nextMetrics,
    nextSeats,
    state.year,
    state.maxYears,
    isFinalYear
  );

  if (endCheck) {
    return {
      ...state,
      metrics: nextMetrics,
      seats: nextSeats,
      phase: "ENDED",
      lastStamp: stamp,
      winnerFaction: endCheck.winner,
      endReason: endCheck.reason,
      tickerText: endCheck.reason,
    };
  }

  const nextYear = state.year + 1;
  const unused = CRISIS_DECK.filter(
    (c) => !state.usedCrisisIds.includes(c.id)
  );
  const nextCrisis =
    unused[0] ?? CRISIS_DECK[(nextYear - 1) % CRISIS_DECK.length];
  const nextDrawn = shuffleArray([...nextCrisis.cards]);

  const advancedState: PlengerGameState = {
    ...state,
    year: nextYear,
    metrics: nextMetrics,
    seats: nextSeats,
    executorSeatId: null,
    currentCrisis: nextCrisis,
    usedCrisisIds: [...state.usedCrisisIds, nextCrisis.id],
    drawnCards: nextDrawn,
    passedCards: [],
    lastEnactedCard: null,
    phase: "SELECT_EXECUTOR",
    privacyCurtainOpen: false,
    lastStamp: stamp,
    tickerText: `${roundHeadline} • THN ${nextYear}: ${nextCrisis.headline}`,
  };

  const pres = advancedState.seats.find(
    (s) => s.id === advancedState.presidentSeatId
  );
  if (pres && !pres.isHuman) {
    return runAiPresidentTurn(advancedState);
  }

  return advancedState;
}

function evaluateEndConditions(
  metrics: CabinetMetrics,
  seats: CabinetSeat[],
  year: number,
  maxYears: number,
  isEndOfYear: boolean
): { winner: FactionType | "NONE"; reason: string } | null {
  const activeOportunis = seats.filter(
    (s) => !s.eliminated && s.faction === "OPORTUNIS"
  ).length;
  const activeReformis = seats.filter(
    (s) => !s.eliminated && s.faction === "REFORMIS"
  ).length;

  if (activeOportunis === 0) {
    return {
      winner: "REFORMIS",
      reason:
        "REFORMIS MENANG! Semua penyusup Plenger berhasil di-reshuffle!",
    };
  }

  if (metrics.auditScore <= 15) {
    return {
      winner: "OPORTUNIS",
      reason:
        "PLENGER MENANG! Skor Audit ambruk di bawah 15% akibat banjir pasal titipan!",
    };
  }

  if (metrics.budgetTrillion <= 50) {
    return {
      winner: "OPORTUNIS",
      reason:
        "PLENGER MENANG! Kas APBN terkuras habis hingga Rp 50T!",
    };
  }

  if (metrics.publicTrust <= 10 || metrics.dprSupport <= 10) {
    return {
      winner: "NONE",
      reason:
        "KABINET TUMBANG! Rakyat atau DPR mosi tidak percaya di tengah jalan!",
    };
  }

  if (isEndOfYear && year >= maxYears) {
    if (activeOportunis >= activeReformis) {
      return {
        winner: "OPORTUNIS",
        reason: `PLENGER MENANG! Kubu titipan menguasai meja kabinet (${activeOportunis} vs ${activeReformis})!`,
      };
    }
    return {
      winner: "REFORMIS",
      reason: `REFORMIS MENANG! Kabinet bertahan 5 tahun dengan Audit ${metrics.auditScore}% & APBN Rp ${metrics.budgetTrillion}T!`,
    };
  }

  return null;
}
