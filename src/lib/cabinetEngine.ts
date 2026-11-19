import {
  CabinetMetrics,
  CabinetSeat,
  CrisisScenario,
  FactionType,
  GameMode,
  LogEntry,
  PlengerGameState,
  PolicyCard,
  RoleId,
} from "@/types";

export const CABINET_ROLES: {
  roleId: RoleId;
  roleTitle: string;
  shortTitle: string;
  botDefaultName: string;
}[] = [
  {
    roleId: "PRESIDEN",
    roleTitle: "Presiden Republik",
    shortTitle: "Presiden",
    botDefaultName: "Pak Surya",
  },
  {
    roleId: "MENKEU",
    roleTitle: "Menteri Keuangan",
    shortTitle: "Menkeu",
    botDefaultName: "Bu Sri",
  },
  {
    roleId: "MENDAGRI",
    roleTitle: "Menteri Dalam Negeri",
    shortTitle: "Mendagri",
    botDefaultName: "Pak Tito",
  },
  {
    roleId: "MENKOMDIGI",
    roleTitle: "Menteri Komunikasi & Digital",
    shortTitle: "Menkomdigi",
    botDefaultName: "Bang Budi",
  },
  {
    roleId: "MENSOS",
    roleTitle: "Menteri Sosial",
    shortTitle: "Mensos",
    botDefaultName: "Bu Risma",
  },
  {
    roleId: "MENHUB",
    roleTitle: "Menteri Perhubungan",
    shortTitle: "Menhub",
    botDefaultName: "Pak Karya",
  },
  {
    roleId: "MENKES",
    roleTitle: "Menteri Kesehatan",
    shortTitle: "Menkes",
    botDefaultName: "Pak Gunawan",
  },
  {
    roleId: "MENHUKUM",
    roleTitle: "Menteri Hukum & Reformasi",
    shortTitle: "Menhukum",
    botDefaultName: "Prof. Yusril",
  },
];

export const CRISIS_DECK: CrisisScenario[] = [
  {
    id: "CR_PANGAN",
    ministryHint: "Kemenkeu & Logistik Pangan",
    headline: "Harga Beras & Cabai Melonjak Jelang Musim Panen",
    context:
      "Warganet mengeluhkan harga sembako di pasar induk. Kabinet harus segera menentukan paket intervensi anggaran.",
    cards: [
      {
        id: "C_PANGAN_1",
        alignment: "BERSIH",
        title: "Operasi Pasar Terbuka & Audit Stok Gudang",
        summary: "Gelar pasar murah transparan dan buka data stok ke publik.",
        tradeoffNote: "APBN -65T • Publik +9% • Audit +6%",
        delta: { budgetTrillion: -65, publicTrust: 9, auditScore: 6 },
      },
      {
        id: "C_PANGAN_2",
        alignment: "KOMPROMI",
        title: "Subsidi Ongkos Angkut & Kompromi Fraksi",
        summary: "Tanggung biaya distribusi lewat BUMN pangan.",
        tradeoffNote: "APBN -50T • Publik +4% • DPR +6%",
        delta: { budgetTrillion: -50, publicTrust: 4, dprSupport: 6 },
      },
      {
        id: "C_PANGAN_3",
        alignment: "TITIPAN",
        title: "Kuota Impor Khusus Rekanan Tertutup",
        summary: "Tunjuk langsung importir tanpa lelang terbuka.",
        tradeoffNote: "APBN -115T • DPR +10% • Audit -16% • Publik -6%",
        delta: {
          budgetTrillion: -115,
          dprSupport: 10,
          auditScore: -16,
          publicTrust: -6,
        },
      },
    ],
  },
  {
    id: "CR_DATA_DIGITAL",
    ministryHint: "Kemenkomdigi & Layanan Publik",
    headline: "Server Layanan Publik Tumbang & Isu Kebocoran Data",
    context:
      "Aplikasi layanan warga mengalami gangguan seharian dan potongan data diklaim beredar di forum daring.",
    cards: [
      {
        id: "C_DATA_1",
        alignment: "BERSIH",
        title: "Audit Forensik Independen & Buka Laporan",
        summary: "Libatkan auditor keamanan independen dan perbaiki sistem.",
        tradeoffNote: "APBN -40T • Audit +11% • Publik +6%",
        delta: { budgetTrillion: -40, auditScore: 11, publicTrust: 6 },
      },
      {
        id: "C_DATA_2",
        alignment: "KOMPROMI",
        title: "Bentuk Satgas Internal Lintas Kementerian",
        summary: "Tangani pemulihan bertahap sambil meredam kegaduhan.",
        tradeoffNote: "APBN -30T • DPR +5% • Publik +2%",
        delta: { budgetTrillion: -30, dprSupport: 5, publicTrust: 2 },
      },
      {
        id: "C_DATA_3",
        alignment: "TITIPAN",
        title: "Proyek Pengadaan Cloud Darurat Mark-Up",
        summary: "Anggarkan pengadaan perangkat baru berbiaya fantastis.",
        tradeoffNote: "APBN -130T • DPR +8% • Audit -18% • Publik -7%",
        delta: {
          budgetTrillion: -130,
          dprSupport: 8,
          auditScore: -18,
          publicTrust: -7,
        },
      },
    ],
  },
  {
    id: "CR_BANSOS",
    ministryHint: "Kemensos & Pemerintah Daerah",
    headline: "Temuan Data Ganda Penerima Bantuan Sosial",
    context:
      "Inspektorat menemukan jutaan data penerima bansos belum mutakhir menjelang pencairan tahap berikutnya.",
    cards: [
      {
        id: "C_BANSOS_1",
        alignment: "BERSIH",
        title: "Pemutakhiran NIK & Penyaluran Non-Tunai",
        summary: "Verifikasi ulang data dan salurkan langsung ke rekening warga.",
        tradeoffNote: "APBN -55T • Audit +12% • Publik +5%",
        delta: { budgetTrillion: -55, auditScore: 12, publicTrust: 5 },
      },
      {
        id: "C_BANSOS_2",
        alignment: "KOMPROMI",
        title: "Cairkan Sebagian Sambil Verifikasi Pemda",
        summary: "Jaga daya beli warga sekaligus menggandeng kepala daerah.",
        tradeoffNote: "APBN -75T • Publik +7% • DPR +5% • Audit -4%",
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
        title: "Paket Sembako Titipan Konstituen Koalisi",
        summary: "Bagi-bagi paket pengadaan barang tanpa standar harga.",
        tradeoffNote: "APBN -140T • DPR +12% • Audit -19% • Publik -4%",
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
    id: "CR_RUU_PARLEMEN",
    ministryHint: "Kemenkum & Parlemen",
    headline: "Pembahasan RUU Strategis Memicu Aksi Mahasiswa",
    context:
      "Draf aturan mendesak dikebut di parlemen. Koalisi ingin segera ketok palu, sementara gelombang protes meluas.",
    cards: [
      {
        id: "C_RUU_1",
        alignment: "BERSIH",
        title: "Tunda Pengesahan & Buka Uji Publik Transparan",
        summary: "Tampung masukan akademisi dan hapus pasal bermasalah.",
        tradeoffNote: "Publik +11% • Audit +7% • DPR -8%",
        delta: { publicTrust: 11, auditScore: 7, dprSupport: -8 },
      },
      {
        id: "C_RUU_2",
        alignment: "KOMPROMI",
        title: "Revisi Terbatas & Kompromi Lintas Fraksi",
        summary: "Pangkas poin paling sensitif agar kedua sisi mereda.",
        tradeoffNote: "Publik +4% • DPR +5% • Audit +2%",
        delta: { publicTrust: 4, dprSupport: 5, auditScore: 2 },
      },
      {
        id: "C_RUU_3",
        alignment: "TITIPAN",
        title: "Ketok Palu Dini Hari dengan Pasal Titipan",
        summary: "Sahkan diam-diam beserta klausul kelonggaran izin usaha.",
        tradeoffNote: "DPR +14% • Publik -14% • Audit -15%",
        delta: { dprSupport: 14, publicTrust: -14, auditScore: -15 },
      },
    ],
  },
  {
    id: "CR_TRANSISI_APBN",
    ministryHint: "Istana & Lintas Kementerian",
    headline: "Laporan Akhir Periode & Proyek Strategis Nasional",
    context:
      "Tahun penentuan masa jabatan. Publik, auditor, dan parlemen menilai kesehatan APBN serta kebersihan warisan kabinet.",
    cards: [
      {
        id: "C_END_1",
        alignment: "BERSIH",
        title: "Efisiensi Seremoni & Tutup Buku WTP Penuh",
        summary: "Pangkas belanja rapat luar kota dan amankan saldo APBN.",
        tradeoffNote: "APBN +60T • Audit +12% • Publik +6% • DPR -5%",
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
        title: "Percepatan Layanan Kesehatan & Transportasi",
        summary: "Selesaikan fasilitas dasar yang langsung dipakai warga.",
        tradeoffNote: "APBN -65T • Publik +9% • DPR +4%",
        delta: { budgetTrillion: -65, publicTrust: 9, dprSupport: 4 },
      },
      {
        id: "C_END_3",
        alignment: "TITIPAN",
        title: "Pencairan Proyek Mercusuar Akhir Jabatan",
        summary: "Kuras sisa kas negara untuk proyek kontrak jangka panjang.",
        tradeoffNote: "APBN -150T • DPR +11% • Audit -18% • Publik -6%",
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

function clampPercent(val: number): number {
  return Math.max(0, Math.min(100, Math.round(val)));
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

  // Tentukan urutan jabatan 8 kursi
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

  // Pembagian Faksi Rahasia: 5 Reformis vs 3 Oportunis
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
    const targetFaction = params.soloPreferredFaction;
    const idx = factionPool.indexOf(targetFaction);
    if (idx > 0) {
      [factionPool[0], factionPool[idx]] = [factionPool[idx], factionPool[0]];
    }
  }

  const seats: CabinetSeat[] = orderedRoles.map((role, idx) => {
    const isHuman = idx < humanCount;
    return {
      id: `seat_${role.roleId}`,
      name: isHuman ? cleanHumans[idx] || `Pemain ${idx + 1}` : role.botDefaultName,
      roleId: role.roleId,
      roleTitle: role.roleTitle,
      isHuman,
      faction: factionPool[idx],
      eliminated: false,
      suspicion: 20,
    };
  });

  const presidentSeat =
    seats.find((s) => s.roleId === "PRESIDEN") ?? seats[0];
  const firstCrisis = CRISIS_DECK[0];
  const drawn = shuffleArray([...firstCrisis.cards]);

  const initialState: PlengerGameState = {
    mode: params.mode,
    cabinetName: params.cabinetName.trim() || "Kabinet Plenger Nusantara",
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
    winnerFaction: null,
    endReason: "",
    logs: [
      {
        id: "log_start",
        year: 1,
        tag: "SIDANG" as const,
        text: `${params.cabinetName.trim() || "Kabinet Plenger"} dilantik! 5 Reformis dan 3 Oportunis duduk di meja sidang.`,
      },
    ],
  };

  // Jika mode SOLO dan Presiden adalah AI, langsung jalankan langkah AI Presiden
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

  // Presiden AI cenderung memilih rekan sefaksi atau pemain manusia agar seru
  const humanCandidate = candidates.find((c) => c.isHuman);
  const allyCandidate = candidates.find((c) => c.faction === pres.faction);
  const pickedExecutor =
    humanCandidate ?? allyCandidate ?? candidates[0];

  // Presiden AI membuang 1 kartu yang paling bertentangan dengan faksinya
  const sorted = [...state.drawnCards].sort((a, b) => {
    if (pres.faction === "OPORTUNIS") {
      // Oportunis mempertahankan TITIPAN, membuang BERSIH
      const score = (c: PolicyCard) =>
        c.alignment === "TITIPAN" ? 3 : c.alignment === "KOMPROMI" ? 2 : 1;
      return score(b) - score(a);
    } else {
      // Reformis mempertahankan BERSIH, membuang TITIPAN
      const score = (c: PolicyCard) =>
        c.alignment === "BERSIH" ? 3 : c.alignment === "KOMPROMI" ? 2 : 1;
      return score(b) - score(a);
    }
  });

  const passedTwo = sorted.slice(0, 2);

  const nextState: PlengerGameState = {
    ...state,
    executorSeatId: pickedExecutor.id,
    passedCards: passedTwo,
    phase: "MINISTER_ENACT",
    privacyCurtainOpen: false,
    logs: [
      {
        id: `exec_${Date.now()}`,
        year: state.year,
        tag: "SIDANG" as const,
        text: `Presiden ${pres.name} menunjuk ${pickedExecutor.roleTitle} (${pickedExecutor.name}) mengeksekusi berkas krisis.`,
      },
      ...state.logs,
    ].slice(0, 30),
  };

  // Jika Menteri Pelaksana juga AI, langsung eksekusi kartu
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

  const nextState: PlengerGameState = {
    ...state,
    executorSeatId: exec.id,
    passedCards: passedTwo,
    phase: "MINISTER_ENACT",
    privacyCurtainOpen: false,
    logs: [
      {
        id: `exec_${Date.now()}`,
        year: state.year,
        tag: "SIDANG" as const,
        text: `Presiden ${pres.name} menyerahkan 2 berkas rahasia kepada ${exec.roleTitle} (${exec.name}).`,
      },
      ...state.logs,
    ].slice(0, 30),
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

  // Update kecurigaan AI jika kebijakan TITIPAN disahkan
  const updatedSeats = state.seats.map((s) => {
    if (s.id === exec.id || s.id === pres.id) {
      const susDelta =
        chosen.alignment === "TITIPAN"
          ? 28
          : chosen.alignment === "BERSIH"
          ? -15
          : 0;
      return {
        ...s,
        suspicion: clampPercent(s.suspicion + susDelta),
        voteChoice: undefined,
      };
    }
    return { ...s, voteChoice: undefined };
  });

  const enactLog: LogEntry = {
    id: `pol_${Date.now()}`,
    year: state.year,
    tag: "KEBIJAKAN" as const,
    text: `[${chosen.alignment}] ${exec.roleTitle} (${exec.name}) mengesahkan "${chosen.title}" (${chosen.tradeoffNote}).`,
  };

  // Cek kondisi menang/kalah seketika setelah kebijakan disahkan
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
      winnerFaction: immediateEnd.winner,
      endReason: immediateEnd.reason,
      logs: [
        {
          id: `end_${Date.now()}`,
          year: state.year,
          tag: "HASIL" as const,
          text: immediateEnd.reason,
        },
        enactLog,
        ...state.logs,
      ].slice(0, 30),
    };
  }

  // Siapkan giliran voting manusia pertama untuk tahap DEBATE_VOTE
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
    logs: [enactLog, ...state.logs].slice(0, 30),
  };
}

export function castDebateVote(
  state: PlengerGameState,
  voterSeatId: string,
  voteChoice: string // "AMAN" atau "RESHUFFLE:<seatId>"
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

  // Semua manusia sudah vote -> Bot AI ikut vote lalu hitung hasil sidang!
  return resolveDebateAndAdvanceYear({
    ...state,
    seats: updatedSeats,
  });
}

function resolveDebateAndAdvanceYear(
  state: PlengerGameState
): PlengerGameState {
  // Bot menentukan suara berdasarkan kecurigaan & faksi
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
      // Bot Oportunis mencoba mengkambinghitamkan Reformis jika kecurigaan tinggi
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

  // Hitung suara reshuffle
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
  const newLogs: LogEntry[] = [];

  // Reshuffle terjadi jika suara reshuffle minimal 3 dan lebih besar dari suara AMAN
  if (topTargetId && topTargetVotes >= 3 && topTargetVotes > amanCount) {
    const ousted = nextSeats.find((s) => s.id === topTargetId);
    if (ousted) {
      nextSeats = nextSeats.map((s) =>
        s.id === ousted.id ? { ...s, eliminated: true } : s
      );

      // Reshuffle mengguncang koalisi DPR, tapi jika yang dipecat OPORTUNIS, audit & publik naik!
      nextMetrics = applyMetricsDelta(nextMetrics, {
        dprSupport: -7,
        publicTrust: ousted.faction === "OPORTUNIS" ? 8 : -6,
        auditScore: ousted.faction === "OPORTUNIS" ? 9 : -4,
      });

      newLogs.push({
        id: `reshuffle_${Date.now()}`,
        year: state.year,
        tag: "RESHUFFLE" as const,
        text: `RESHUFFLE! ${ousted.roleTitle} (${ousted.name}) dicopot (${topTargetVotes} suara). Terungkap dia adalah kubu ${ousted.faction}!`,
      });
    }
  } else {
    newLogs.push({
      id: `aman_${Date.now()}`,
      year: state.year,
      tag: "SIDANG" as const,
      text: `Sidang Tahun ke-${state.year} ditutup tanpa reshuffle (${amanCount} suara mempertahankan formasi).`,
    });
  }

  // Cek kondisi menang/kalah setelah voting & potensi akhir Tahun ke-5
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
      winnerFaction: endCheck.winner,
      endReason: endCheck.reason,
      logs: [
        {
          id: `finish_${Date.now()}`,
          year: state.year,
          tag: "HASIL" as const,
          text: endCheck.reason,
        },
        ...newLogs,
        ...state.logs,
      ].slice(0, 30),
    };
  }

  // Lanjut ke Tahun Berikutnya
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
    logs: [
      {
        id: `yr_${Date.now()}`,
        year: nextYear,
        tag: "SIDANG" as const,
        text: `Memasuki Tahun ke-${nextYear}: Krisis baru — "${nextCrisis.headline}".`,
      },
      ...newLogs,
      ...state.logs,
    ].slice(0, 30),
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

  // 1. Semua Oportunis berhasil dibersihkan -> Reformis Menang!
  if (activeOportunis === 0) {
    return {
      winner: "REFORMIS",
      reason:
        "KUBU REFORMIS MENANG! Seluruh penyusup Oportunis berhasil terdeteksi dan di-reshuffle dari Kabinet Plenger.",
    };
  }

  // 2. Audit anjlok atau APBN terkuras -> Oportunis Menang!
  if (metrics.auditScore <= 15) {
    return {
      winner: "OPORTUNIS",
      reason:
        "KUBU OPORTUNIS (PLENGER) MENANG! Skor Audit jatuh di bawah 15% akibat banjir proyek dan pasal titipan.",
    };
  }
  if (metrics.budgetTrillion <= 50) {
    return {
      winner: "OPORTUNIS",
      reason:
        "KUBU OPORTUNIS (PLENGER) MENANG! Kas APBN terkuras habis hingga sisa Rp 50T tanpa kendali.",
    };
  }

  // 3. Rakyat atau DPR tumbang di tengah jalan -> Pemerintahan Runtuh!
  if (metrics.publicTrust <= 10 || metrics.dprSupport <= 10) {
    return {
      winner: "NONE",
      reason:
        "KABINET TUMBANG! Kepercayaan publik atau dukungan DPR menyentuh titik nol sebelum masa jabatan selesai.",
    };
  }

  // 4. Evaluasi Akhir Tahun ke-5
  if (isEndOfYear && year >= maxYears) {
    if (activeOportunis >= activeReformis) {
      return {
        winner: "OPORTUNIS",
        reason: `KUBU OPORTUNIS (PLENGER) MENANG DI AKHIR PERIODE! Kubu titipan menguasai mayoritas kursi kabinet (${activeOportunis} vs ${activeReformis}).`,
      };
    }
    return {
      winner: "REFORMIS",
      reason: `KUBU REFORMIS MENANG! Kabinet Plenger bertahan 5 tahun dengan APBN Rp ${metrics.budgetTrillion}T, Publik ${metrics.publicTrust}%, DPR ${metrics.dprSupport}%, dan Audit ${metrics.auditScore}%.`,
    };
  }

  return null;
}
