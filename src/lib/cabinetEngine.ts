import {
  CabinetStateMetrics,
  FeedEntry,
  GameSimulationState,
  MinisterMember,
  NationalIssue,
  OriginType,
  PolicyOptionId,
  PublicScandal,
  RoleId,
} from "@/types";

export const ROLE_CATALOG: {
  roleId: RoleId;
  roleTitle: string;
  defaultOrigin: OriginType;
  suitColor: string;
  sectorTaskTitle: string;
  sectorTaskDesc: string;
  sectorCostTrillion: number;
  sectorDelta: Partial<CabinetStateMetrics>;
}[] = [
  {
    roleId: "PRESIDEN",
    roleTitle: "Presiden Republik",
    defaultOrigin: "PARTAI",
    suitColor: "#dc2626",
    sectorTaskTitle: "Konsolidasi Koalisi & Arahan Istana",
    sectorTaskDesc:
      "Menyatukan sikap fraksi koalisi dan meredam friksi antar-kementerian.",
    sectorCostTrillion: 40,
    sectorDelta: { dprSupport: 8, publicTrust: 4 },
  },
  {
    roleId: "MENKEU",
    roleTitle: "Menteri Keuangan",
    defaultOrigin: "TEKNOKRAT",
    suitColor: "#1d4ed8",
    sectorTaskTitle: "Penyesuaian Belanja & Insentif Fiskal",
    sectorTaskDesc:
      "Menjaga napas kas negara dan meredam gejolak biaya hidup lewat penataan APBN.",
    sectorCostTrillion: 30,
    sectorDelta: { budgetTrillion: 80, economicStability: 6, auditScore: 4 },
  },
  {
    roleId: "MENDAGRI",
    roleTitle: "Menteri Dalam Negeri",
    defaultOrigin: "PARTAI",
    suitColor: "#b45309",
    sectorTaskTitle: "Sinkronisasi Kepala Daerah & Kamtibmas",
    sectorTaskDesc:
      "Mengkoordinasikan gubernur dan bupati agar stabilitas daerah terjaga.",
    sectorCostTrillion: 35,
    sectorDelta: { publicTrust: 6, dprSupport: 5, economicStability: 3 },
  },
  {
    roleId: "MENKOMDIGI",
    roleTitle: "Menteri Komunikasi & Digital",
    defaultOrigin: "PENGUSAHA",
    suitColor: "#0f766e",
    sectorTaskTitle: "Klarifikasi Publik & Keamanan Digital",
    sectorTaskDesc:
      "Menjawab hoaks yang viral di medsos dan menjaga layanan data publik.",
    sectorCostTrillion: 25,
    sectorDelta: { publicTrust: 7, auditScore: 3 },
  },
  {
    roleId: "MENSOS",
    roleTitle: "Menteri Sosial",
    defaultOrigin: "PARTAI",
    suitColor: "#be123c",
    sectorTaskTitle: "Penyaluran Bantuan Sosial Tepat Sasaran",
    sectorTaskDesc:
      "Menahan tekanan daya beli warga rentan, sembari diawasi akurasi data.",
    sectorCostTrillion: 70,
    sectorDelta: { publicTrust: 11, dprSupport: 4, auditScore: -4 },
  },
  {
    roleId: "MENHUB",
    roleTitle: "Menteri Perhubungan",
    defaultOrigin: "TEKNOKRAT",
    suitColor: "#0369a1",
    sectorTaskTitle: "Kelancaran Logistik & Angkutan Publik",
    sectorTaskDesc:
      "Mengurai antrean pelabuhan dan menekan ongkos kirim bahan pokok.",
    sectorCostTrillion: 55,
    sectorDelta: { economicStability: 8, publicTrust: 4 },
  },
  {
    roleId: "MENKES",
    roleTitle: "Menteri Kesehatan",
    defaultOrigin: "TEKNOKRAT",
    suitColor: "#15803d",
    sectorTaskTitle: "Penguatan Layanan Puskesmas & BPJS",
    sectorTaskDesc:
      "Menjaga ketersediaan obat dan kelancaran klaim layanan kesehatan.",
    sectorCostTrillion: 50,
    sectorDelta: { publicTrust: 8, auditScore: 3 },
  },
  {
    roleId: "MENHUKUM",
    roleTitle: "Menteri Hukum & Reformasi Birokrasi",
    defaultOrigin: "TEKNOKRAT",
    suitColor: "#4338ca",
    sectorTaskTitle: "Pembenahan Regulasi & Pengawasan Internal",
    sectorTaskDesc:
      "Merapikan tumpang tindih aturan dan memperketat audit anggaran.",
    sectorCostTrillion: 25,
    sectorDelta: { auditScore: 10, economicStability: 3 },
  },
];

export const ORIGIN_INFO: Record<
  OriginType,
  { label: string; note: string; dprBonus: number; budgetEfficiency: number }
> = {
  TEKNOKRAT: {
    label: "Teknokrat",
    note: "Hemat anggaran & kuat di audit, namun perlu lobi ekstra di parlemen.",
    dprBonus: 0,
    budgetEfficiency: 0.85,
  },
  PARTAI: {
    label: "Kader Partai",
    note: "Dukungan DPR tinggi sejak awal, cenderung mendorong belanja populis.",
    dprBonus: 8,
    budgetEfficiency: 1.0,
  },
  PENGUSAHA: {
    label: "Dunia Usaha",
    note: "Cepat membaca sentimen pasar, perlu menjaga transparansi pengadaan.",
    dprBonus: 4,
    budgetEfficiency: 0.95,
  },
};

export const WORLD_THEMES: {
  worldCode: string;
  stageName: string;
  skyTop: string;
  skyBottom: string;
  groundTop: string;
  groundBody: string;
  enemyLabels: [string, string, string];
}[] = [
  {
    worldCode: "1-1",
    stageName: "PASAR INDUK & PANGAN",
    skyTop: "#3b82f6",
    skyBottom: "#93c5fd",
    groundTop: "#16a34a",
    groundBody: "#b45309",
    enemyLabels: ["INFLASI", "SPEKULAN", "HOAKS"],
  },
  {
    worldCode: "1-2",
    stageName: "GEDUNG PARLEMEN & RUU",
    skyTop: "#1e3a8a",
    skyBottom: "#60a5fa",
    groundTop: "#0d9488",
    groundBody: "#78350f",
    enemyLabels: ["DEADLOCK", "PASAL TITIPAN", "HOAKS"],
  },
  {
    worldCode: "1-3",
    stageName: "AUDIT BANSOS & DAERAH",
    skyTop: "#0369a1",
    skyBottom: "#7dd3fc",
    groundTop: "#15803d",
    groundBody: "#92400e",
    enemyLabels: ["DATA GANDA", "MARKUP", "CALO"],
  },
  {
    worldCode: "1-4",
    stageName: "PASAR KEUANGAN & KURS",
    skyTop: "#312e81",
    skyBottom: "#818cf8",
    groundTop: "#059669",
    groundBody: "#713f12",
    enemyLabels: ["CAPITAL OUTFLOW", "DEFISIT", "PANIK"],
  },
  {
    worldCode: "1-5",
    stageName: "ISTANA MERDEKA • AKHIR PERIODE",
    skyTop: "#991b1b",
    skyBottom: "#fca5a5",
    groundTop: "#16a34a",
    groundBody: "#78350f",
    enemyLabels: ["KRISIS", "SKANDAL", "HOAKS"],
  },
];

export const NATIONAL_ISSUES: NationalIssue[] = [
  {
    id: "ISS_BBM_PANGAN",
    ministry: "Kemenkeu & Kemendag",
    title: "Harga Pangan & Energi Naik Menjelang Musim Panen",
    context:
      "Harga beras, cabai, dan ongkos angkut naik. Media sosial ramai membandingkan harga pasar dengan janji stabilitas.",
    options: [
      {
        id: "A",
        title: "Operasi Pasar & Subsidi Terarah",
        summary: "Gelar pasar murah serentak dan tahan tarif dasar 6 bulan.",
        realWorldTradeoff: "APBN tergerus (-120T), kepercayaan publik naik.",
        delta: {
          budgetTrillion: -120,
          publicTrust: 10,
          economicStability: 7,
          dprSupport: 3,
        },
      },
      {
        id: "B",
        title: "Relaksasi Impor & Perbaikan Rantai Pasok",
        summary: "Buka kuota impor komoditas tertentu dan percepat logistik.",
        realWorldTradeoff: "Pasar stabil, sebagian fraksi dan petani protes.",
        delta: {
          budgetTrillion: -40,
          economicStability: 8,
          publicTrust: -3,
          dprSupport: -5,
        },
      },
      {
        id: "C",
        title: "Jaga Defisit Ketat & Imbauan Hemat",
        summary: "Batasi belanja tambahan dan dorong kampanye belanja bijak.",
        realWorldTradeoff: "Kas APBN aman (+20T), tekanan biaya hidup terasa.",
        delta: {
          budgetTrillion: 20,
          publicTrust: -9,
          economicStability: 2,
          auditScore: 5,
        },
      },
    ],
  },
  {
    id: "ISS_RUU_DPR",
    ministry: "Kemenkum & Parlemen",
    title: "Pembahasan RUU Strategis Memicu Protes Mahasiswa & Sipil",
    context:
      "Draf aturan mendesak dikebut di parlemen. Fraksi koalisi mendesak pengesahan, sementara masyarakat sipil turun ke jalan.",
    options: [
      {
        id: "A",
        title: "Tunda Pengesahan & Buka Uji Publik",
        summary: "Tarik draf sementara untuk menampung masukan publik.",
        realWorldTradeoff: "Meredam aksi jalanan, fraksi koalisi kesal.",
        delta: {
          publicTrust: 9,
          dprSupport: -9,
          economicStability: 2,
        },
      },
      {
        id: "B",
        title: "Sahkan dengan Catatan Revisi Bertahap",
        summary: "Ketok palu sesuai jadwal koalisi dengan aturan turunan.",
        realWorldTradeoff: "Koalisi solid, kritik publik memanas.",
        delta: {
          dprSupport: 8,
          publicTrust: -11,
          economicStability: -3,
        },
      },
      {
        id: "C",
        title: "Pangkas Pasal Kontroversial & Kompromi Fraksi",
        summary: "Hapus poin paling sensitif agar kompromi diterima dua sisi.",
        realWorldTradeoff: "Kompromi jalan tengah dengan skor audit positif.",
        delta: {
          publicTrust: 4,
          dprSupport: 3,
          auditScore: 4,
        },
      },
    ],
  },
  {
    id: "ISS_AUDIT_BANSOS",
    ministry: "Kemensos & Pengawasan",
    title: "Temuan Ganda Data Penerima Bantuan & Proyek Daerah",
    context:
      "Laporan audit internal menyoroti data penerima bansos yang belum mutakhir serta keterlambatan proyek daerah.",
    options: [
      {
        id: "A",
        title: "Audit Menyeluruh & Pemutakhiran Data NIK",
        summary: "Bekukan pencairan bermasalah dan verifikasi ulang data.",
        realWorldTradeoff: "Skor audit melonjak (+12%), pencairan agak lambat.",
        delta: {
          auditScore: 12,
          publicTrust: -4,
          budgetTrillion: 50,
        },
      },
      {
        id: "B",
        title: "Cairkan Dulu, Evaluasi Belakangan",
        summary: "Prioritaskan daya beli warga dulu dan audit akhir tahun.",
        realWorldTradeoff: "Warga puas, catatan audit turun (-11%).",
        delta: {
          publicTrust: 8,
          auditScore: -11,
          budgetTrillion: -90,
        },
      },
      {
        id: "C",
        title: "Bentuk Satgas Lintas Kementerian",
        summary: "Libatkan inspektorat, pemda, dan auditor merapikan sistem.",
        realWorldTradeoff: "Langkah moderat dengan biaya koordinasi.",
        delta: {
          auditScore: 6,
          publicTrust: 3,
          budgetTrillion: -35,
          dprSupport: 2,
        },
      },
    ],
  },
  {
    id: "ISS_RUPIAH_INVESTASI",
    ministry: "Kemenkeu & Ekonomi",
    title: "Gejolak Nilai Tukar & Arus Modal Asing",
    context:
      "Sentimen global membuat kurs melemah tipis dan pelaku pasar memantau arah disiplin fiskal serta kepastian izin.",
    options: [
      {
        id: "A",
        title: "Paket Insentif Industri & Kepastian Izin",
        summary: "Pangkas hambatan perizinan dan beri kepastian iklim usaha.",
        realWorldTradeoff: "Pasar menguat (+10%), insentif memakan APBN.",
        delta: {
          economicStability: 10,
          budgetTrillion: -65,
          dprSupport: -3,
        },
      },
      {
        id: "B",
        title: "Efisiensi Belanja Non-Prioritas Kabinet",
        summary: "Pangkas perjalanan dinas, seremoni, dan rapat luar kota.",
        realWorldTradeoff: "APBN hemat (+75T) & citra positif, menteri mengeluh.",
        delta: {
          budgetTrillion: 75,
          publicTrust: 6,
          auditScore: 6,
          dprSupport: -4,
        },
      },
      {
        id: "C",
        title: "Stabilisasi Harga Kebutuhan Pokok",
        summary: "Fokus menjaga inflasi domestik agar daya beli terjaga.",
        realWorldTradeoff: "Stabil di dalam negeri, reaksi pasar moderat.",
        delta: {
          economicStability: 5,
          publicTrust: 5,
          budgetTrillion: -50,
        },
      },
    ],
  },
  {
    id: "ISS_WARISAN_AKHIR",
    ministry: "Istana & Lintas Kementerian",
    title: "Evaluasi Akhir Masa Jabatan & Transisi Anggaran",
    context:
      "Menjelang akhir periode 5 tahun, publik dan parlemen menilai warisan pembangunan serta kesehatan kas negara.",
    options: [
      {
        id: "A",
        title: "Tuntaskan Proyek Layanan Dasar Daerah",
        summary: "Alokasikan sisa anggaran untuk puskesmas, sekolah, dan jalan.",
        realWorldTradeoff: "Kepuasan publik tinggi (+12%), saldo APBN menipis.",
        delta: {
          budgetTrillion: -95,
          publicTrust: 12,
          economicStability: 5,
        },
      },
      {
        id: "B",
        title: "Amankan Cadangan Fiskal & Audit Transisi",
        summary: "Serahkan kas negara yang sehat dengan laporan WTP penuh.",
        realWorldTradeoff: "Skor audit & pasar sangat kuat, kurang populis.",
        delta: {
          budgetTrillion: 45,
          auditScore: 10,
          economicStability: 8,
          publicTrust: -3,
        },
      },
      {
        id: "C",
        title: "Konsolidasi Lintas Fraksi & Rekonsiliasi",
        summary: "Pastikan stabilitas politik nasional hingga serah terima.",
        realWorldTradeoff: "Dukungan DPR solid, dampak ekonomi moderat.",
        delta: {
          dprSupport: 10,
          publicTrust: 5,
          auditScore: 3,
        },
      },
    ],
  },
];

export const PUBLIC_SCANDALS: PublicScandal[] = [
  {
    id: "SC_BOCOR_DATA",
    headline: "Dugaan Kebocoran Data Layanan Publik Viral di Medsos",
    detail:
      "Potongan basis data diklaim beredar daring. Warganet menuntut audit keamanan siber dan pertanggungjawaban.",
    severity: "TINGGI",
    responses: [
      {
        id: "A",
        label: "Buka Hasil Forensik & Ganti Pejabat Teknis",
        note: "Publik melihat ketegasan (+6% Publik, +4% Pasar).",
        delta: { publicTrust: 6, economicStability: 4, dprSupport: -4 },
      },
      {
        id: "B",
        label: "Bantah Keras & Klaim Sistem Aman",
        note: "Memicu perdebatan panjang (-8% Publik, -6% Audit).",
        delta: { publicTrust: -8, auditScore: -6 },
      },
      {
        id: "C",
        label: "Audit Siber Mandiri & Anggaran Keamanan",
        note: "Biaya -30T keluar, skor audit naik (+8%).",
        delta: { budgetTrillion: -30, auditScore: 8, publicTrust: 2 },
      },
    ],
  },
  {
    id: "SC_MARKUP_PROYEK",
    headline: "Sorotan Selisih Harga Pengadaan Barang Pemerintah",
    detail:
      "Pengamat membandingkan spesifikasi pengadaan daerah dengan harga pasar wajar sehingga memicu desakan audit.",
    severity: "KRITIS",
    responses: [
      {
        id: "A",
        label: "Serahkan Berkas ke Auditor & Hentikan Kontrak",
        note: "Skor audit melonjak (+10%), sebagian rekanan tertekan.",
        delta: { auditScore: 10, dprSupport: -6, publicTrust: 4 },
      },
      {
        id: "B",
        label: "Revisi Harga Satuan Secara Diam-Diam",
        note: "Kegaduhan mereda sesaat, tapi rawan temuan (-9% Audit).",
        delta: { budgetTrillion: 25, auditScore: -9, publicTrust: -4 },
      },
      {
        id: "C",
        label: "Klarifikasi Terbuka & E-Katalog Ketat",
        note: "Menjaga kepercayaan publik dengan biaya penataan (-20T).",
        delta: { budgetTrillion: -20, publicTrust: 5, auditScore: 5 },
      },
    ],
  },
];

function clampStat(val: number): number {
  return Math.max(0, Math.min(100, Math.round(val)));
}

export function applyMetricsDelta(
  current: CabinetStateMetrics,
  delta: Partial<CabinetStateMetrics>
): CabinetStateMetrics {
  return {
    budgetTrillion: Math.max(
      0,
      Math.round(current.budgetTrillion + (delta.budgetTrillion ?? 0))
    ),
    publicTrust: clampStat(current.publicTrust + (delta.publicTrust ?? 0)),
    dprSupport: clampStat(current.dprSupport + (delta.dprSupport ?? 0)),
    economicStability: clampStat(
      current.economicStability + (delta.economicStability ?? 0)
    ),
    auditScore: clampStat(current.auditScore + (delta.auditScore ?? 0)),
  };
}

function createBotCabinet(playerRoleId: RoleId): MinisterMember[] {
  return ROLE_CATALOG.filter((r) => r.roleId !== playerRoleId).map(
    (item, idx) => ({
      id: `bot_${item.roleId}_${idx}`,
      name: `Pejabat ${item.roleTitle.split(" ")[0]}`,
      roleId: item.roleId,
      roleTitle: item.roleTitle,
      origin: item.defaultOrigin,
      isPlayer: false,
      isBot: true,
      tacticalFund: 45,
      taskDoneYear: 0,
    })
  );
}

function assignBotVotes(
  members: MinisterMember[],
  issue: NationalIssue
): MinisterMember[] {
  return members.map((m) => {
    if (m.isPlayer) return m;
    let pick: PolicyOptionId = "A";
    if (m.origin === "TEKNOKRAT") {
      pick =
        issue.options.find((o) => (o.delta.auditScore ?? 0) > 0)?.id ??
        issue.options[0].id;
    } else if (m.origin === "PARTAI") {
      pick =
        issue.options.find((o) => (o.delta.dprSupport ?? 0) > 0)?.id ??
        issue.options[0].id;
    } else {
      pick =
        issue.options.find((o) => (o.delta.economicStability ?? 0) > 0)?.id ??
        issue.options[0].id;
    }
    return { ...m, votedOption: pick };
  });
}

export function createInitialSimulation(params: {
  countryName: string;
  presidentName: string;
  playerRoleId: RoleId;
  playerOrigin: OriginType;
}): GameSimulationState {
  const roleMeta =
    ROLE_CATALOG.find((r) => r.roleId === params.playerRoleId) ??
    ROLE_CATALOG[0];
  const originMeta = ORIGIN_INFO[params.playerOrigin];

  const playerMember: MinisterMember = {
    id: "player_1",
    name: params.presidentName.trim() || "Budi Santoso",
    roleId: params.playerRoleId,
    roleTitle: roleMeta.roleTitle,
    origin: params.playerOrigin,
    isPlayer: true,
    isBot: false,
    tacticalFund: 60,
    taskDoneYear: 0,
  };

  const bots = createBotCabinet(params.playerRoleId);
  const firstIssue = NATIONAL_ISSUES[0];
  const allMembers = assignBotVotes([playerMember, ...bots], firstIssue);

  return {
    countryName: params.countryName.trim() || "Republik Nusantara",
    presidentName:
      params.playerRoleId === "PRESIDEN"
        ? playerMember.name
        : "Kepala Pemerintahan",
    year: 1,
    maxYears: 5,
    status: "ACTIVE",
    endSummary: "",
    reshuffleDoneYear: 0,
    activeScandal: PUBLIC_SCANDALS[0],
    metrics: {
      budgetTrillion: 650,
      publicTrust: 58,
      dprSupport: Math.min(95, 55 + originMeta.dprBonus),
      economicStability: 60,
      auditScore: 62,
    },
    currentIssue: firstIssue,
    usedIssueIds: [firstIssue.id],
    members: allMembers,
    playerId: playerMember.id,
    feed: [
      {
        id: "feed_1",
        year: 1,
        tag: "SIDANG",
        text: `World 1-1 dimulai: ${playerMember.name} bertugas sebagai ${roleMeta.roleTitle} (${originMeta.label}).`,
      },
    ],
  };
}

export function resolvePublicScandal(
  state: GameSimulationState,
  responseId: PolicyOptionId
): GameSimulationState {
  if (!state.activeScandal) return state;
  const chosen =
    state.activeScandal.responses.find((r) => r.id === responseId) ??
    state.activeScandal.responses[0];

  const nextMetrics = applyMetricsDelta(state.metrics, chosen.delta);
  const entry: FeedEntry = {
    id: `scandal_${Date.now()}`,
    year: state.year,
    tag: "SKANDAL",
    text: `Blok Skandal "${state.activeScandal.headline}" dijawab: ${chosen.label}.`,
  };

  return {
    ...state,
    activeScandal: null,
    metrics: nextMetrics,
    feed: [entry, ...state.feed].slice(0, 30),
  };
}

export function runSectoralTask(
  state: GameSimulationState
): GameSimulationState {
  if (state.status !== "ACTIVE") return state;
  const player = state.members.find((m) => m.id === state.playerId);
  if (!player || player.taskDoneYear === state.year) return state;

  const roleMeta =
    ROLE_CATALOG.find((r) => r.roleId === player.roleId) ?? ROLE_CATALOG[0];
  const originMeta = ORIGIN_INFO[player.origin];
  const realCost = Math.max(
    10,
    Math.round(roleMeta.sectorCostTrillion * originMeta.budgetEfficiency)
  );

  const nextMetrics = applyMetricsDelta(state.metrics, {
    ...roleMeta.sectorDelta,
    budgetTrillion: (roleMeta.sectorDelta.budgetTrillion ?? 0) - realCost,
  });

  const updatedMembers = state.members.map((m) =>
    m.id === player.id ? { ...m, taskDoneYear: state.year } : m
  );

  const entry: FeedEntry = {
    id: `task_${Date.now()}`,
    year: state.year,
    tag: "SEKTORAL",
    text: `Program "${roleMeta.sectorTaskTitle}" dijalankan (-Rp ${realCost}T).`,
  };

  return {
    ...state,
    metrics: nextMetrics,
    members: updatedMembers,
    feed: [entry, ...state.feed].slice(0, 30),
  };
}

export function castPlayerVote(
  state: GameSimulationState,
  optionId: PolicyOptionId
): GameSimulationState {
  if (state.status !== "ACTIVE") return state;
  const updatedMembers = state.members.map((m) =>
    m.id === state.playerId ? { ...m, votedOption: optionId } : m
  );
  return {
    ...state,
    members: updatedMembers,
  };
}

export function runLobbyAction(
  state: GameSimulationState,
  targetMemberId: string
): GameSimulationState {
  if (state.status !== "ACTIVE") return state;
  const player = state.members.find((m) => m.id === state.playerId);
  const target = state.members.find((m) => m.id === targetMemberId);
  if (!player || !target || target.id === player.id) return state;
  if (player.tacticalFund < 15) return state;

  const playerOption = player.votedOption ?? "A";
  const nextMetrics = applyMetricsDelta(state.metrics, {
    dprSupport: 5,
    auditScore: -4,
  });

  const updatedMembers = state.members.map((m) => {
    if (m.id === player.id) {
      return { ...m, tacticalFund: m.tacticalFund - 15 };
    }
    if (m.id === target.id) {
      return {
        ...m,
        tacticalFund: m.tacticalFund + 15,
        votedOption: playerOption,
      };
    }
    return m;
  });

  const entry: FeedEntry = {
    id: `lobby_${Date.now()}`,
    year: state.year,
    tag: "LOBI",
    text: `Lobi politik ke ${target.roleTitle} (15M); suara mengikuti opsi Anda.`,
  };

  return {
    ...state,
    metrics: nextMetrics,
    members: updatedMembers,
    feed: [entry, ...state.feed].slice(0, 30),
  };
}

export function reshuffleMinister(
  state: GameSimulationState,
  targetMemberId: string,
  newOrigin: OriginType
): GameSimulationState {
  if (state.status !== "ACTIVE") return state;
  const player = state.members.find((m) => m.id === state.playerId);
  if (!player || player.roleId !== "PRESIDEN") return state;
  if (state.reshuffleDoneYear === state.year) return state;

  const target = state.members.find(
    (m) => m.id === targetMemberId && m.id !== player.id
  );
  if (!target) return state;

  const originMeta = ORIGIN_INFO[newOrigin];
  const updatedMembers = state.members.map((m) =>
    m.id === target.id
      ? {
          ...m,
          origin: newOrigin,
          name: `${originMeta.label} ${m.roleTitle.split(" ")[0]}`,
          votedOption: player.votedOption ?? m.votedOption,
        }
      : m
  );

  const nextMetrics = applyMetricsDelta(state.metrics, {
    dprSupport: newOrigin === "PARTAI" ? 4 : -5,
    publicTrust: 3,
    auditScore: newOrigin === "TEKNOKRAT" ? 4 : -2,
  });

  const entry: FeedEntry = {
    id: `reshuffle_${Date.now()}`,
    year: state.year,
    tag: "RESHUFFLE",
    text: `Presiden me-reshuffle ${target.roleTitle} ke ${originMeta.label}.`,
  };

  return {
    ...state,
    reshuffleDoneYear: state.year,
    metrics: nextMetrics,
    members: updatedMembers,
    feed: [entry, ...state.feed].slice(0, 30),
  };
}

export function closeYearAndAdvance(
  state: GameSimulationState
): GameSimulationState {
  if (state.status !== "ACTIVE") return state;

  const counts: Record<PolicyOptionId, number> = { A: 0, B: 0, C: 0 };
  state.members.forEach((m) => {
    const opt = m.votedOption ?? "A";
    counts[opt] += 1;
  });

  const winningId: PolicyOptionId =
    counts.B > counts.A && counts.B >= counts.C
      ? "B"
      : counts.C > counts.A && counts.C > counts.B
      ? "C"
      : "A";

  const chosenOption =
    state.currentIssue.options.find((o) => o.id === winningId) ??
    state.currentIssue.options[0];

  const nextMetrics = applyMetricsDelta(state.metrics, chosenOption.delta);

  const decisionFeed: FeedEntry = {
    id: `dec_${Date.now()}`,
    year: state.year,
    tag: "SIDANG",
    text: `Stage Clear Tahun ${state.year}: "${chosenOption.title}" disahkan (${counts.A}A/${counts.B}B/${counts.C}C).`,
  };

  const collapsed =
    nextMetrics.publicTrust <= 10 ||
    nextMetrics.dprSupport <= 10 ||
    nextMetrics.economicStability <= 10;

  if (collapsed) {
    return {
      ...state,
      metrics: nextMetrics,
      activeScandal: null,
      status: "ENDED",
      endSummary:
        "GAME OVER! Pemerintahan goyah akibat krisis kepercayaan publik, dukungan DPR, atau stabilitas pasar.",
      feed: [decisionFeed, ...state.feed].slice(0, 30),
    };
  }

  if (state.year >= state.maxYears) {
    return {
      ...state,
      metrics: nextMetrics,
      activeScandal: null,
      status: "ENDED",
      endSummary: `VICTORY! Masa jabatan 5 tahun tuntas! APBN tersisa Rp ${nextMetrics.budgetTrillion}T • Publik ${nextMetrics.publicTrust}% • DPR ${nextMetrics.dprSupport}% • Audit ${nextMetrics.auditScore}%.`,
      feed: [decisionFeed, ...state.feed].slice(0, 30),
    };
  }

  const nextYear = state.year + 1;
  const unused = NATIONAL_ISSUES.filter(
    (iss) => !state.usedIssueIds.includes(iss.id)
  );
  const nextIssue =
    unused[0] ?? NATIONAL_ISSUES[(nextYear - 1) % NATIONAL_ISSUES.length];

  const nextMembers = assignBotVotes(
    state.members.map((m) => ({ ...m, votedOption: undefined })),
    nextIssue
  );

  const nextScandal = PUBLIC_SCANDALS[(nextYear - 1) % PUBLIC_SCANDALS.length];

  return {
    ...state,
    year: nextYear,
    metrics: nextMetrics,
    activeScandal: nextScandal,
    currentIssue: nextIssue,
    usedIssueIds: [...state.usedIssueIds, nextIssue.id],
    members: nextMembers,
    feed: [
      {
        id: `yr_${Date.now()}`,
        year: nextYear,
        tag: "BERITA",
        text: `Memasuki World 1-${nextYear} (Tahun ke-${nextYear}): "${nextIssue.title}".`,
      },
      decisionFeed,
      ...state.feed,
    ].slice(0, 30),
  };
}
