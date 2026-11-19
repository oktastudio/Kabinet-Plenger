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
  sectorTaskTitle: string;
  sectorTaskDesc: string;
  sectorCostTrillion: number;
  sectorDelta: Partial<CabinetStateMetrics>;
}[] = [
  {
    roleId: "PRESIDEN",
    roleTitle: "Presiden Republik",
    defaultOrigin: "PARTAI",
    sectorTaskTitle: "Konsolidasi Pimpinan Koalisi & Arahan Istana",
    sectorTaskDesc:
      "Menyatukan sikap fraksi koalisi dan meredam friksi antar-kementerian sebelum rapat kabinet.",
    sectorCostTrillion: 40,
    sectorDelta: { dprSupport: 8, publicTrust: 4 },
  },
  {
    roleId: "MENKEU",
    roleTitle: "Menteri Keuangan",
    defaultOrigin: "TEKNOKRAT",
    sectorTaskTitle: "Penyesuaian Belanja & Insentif Fiskal",
    sectorTaskDesc:
      "Menjaga napas kas negara dan meredam gejolak biaya hidup lewat penataan pos anggaran.",
    sectorCostTrillion: 30,
    sectorDelta: { budgetTrillion: 80, economicStability: 6, auditScore: 4 },
  },
  {
    roleId: "MENDAGRI",
    roleTitle: "Menteri Dalam Negeri",
    defaultOrigin: "PARTAI",
    sectorTaskTitle: "Sinkronisasi Kepala Daerah & Kamtibmas",
    sectorTaskDesc:
      "Mengkoordinasikan gubernur/bupati dan mengawal stabilitas daerah agar tidak meluas.",
    sectorCostTrillion: 35,
    sectorDelta: { publicTrust: 6, dprSupport: 5, economicStability: 3 },
  },
  {
    roleId: "MENKOMDIGI",
    roleTitle: "Menteri Komunikasi & Digital",
    defaultOrigin: "PENGUSAHA",
    sectorTaskTitle: "Klarifikasi Publik & Keamanan Layanan Digital",
    sectorTaskDesc:
      "Menjawab hoaks yang viral di medsos dan menjaga keandalan sistem data layanan publik.",
    sectorCostTrillion: 25,
    sectorDelta: { publicTrust: 7, auditScore: 3 },
  },
  {
    roleId: "MENSOS",
    roleTitle: "Menteri Sosial",
    defaultOrigin: "PARTAI",
    sectorTaskTitle: "Penyaluran Bantuan Sosial Tepat Sasaran",
    sectorTaskDesc:
      "Menahan tekanan daya beli warga rentan, sembari diawasi akurasi data penerima.",
    sectorCostTrillion: 70,
    sectorDelta: { publicTrust: 11, dprSupport: 4, auditScore: -4 },
  },
  {
    roleId: "MENHUB",
    roleTitle: "Menteri Perhubungan",
    defaultOrigin: "TEKNOKRAT",
    sectorTaskTitle: "Kelancaran Logistik & Angkutan Publik",
    sectorTaskDesc:
      "Mengurai antrean pelabuhan dan menekan ongkos kirim bahan pokok antar-pulau.",
    sectorCostTrillion: 55,
    sectorDelta: { economicStability: 8, publicTrust: 4 },
  },
  {
    roleId: "MENKES",
    roleTitle: "Menteri Kesehatan",
    defaultOrigin: "TEKNOKRAT",
    sectorTaskTitle: "Penguatan Layanan Puskesmas & BPJS",
    sectorTaskDesc:
      "Menjaga ketersediaan obat dan kelancaran klaim layanan kesehatan di daerah.",
    sectorCostTrillion: 50,
    sectorDelta: { publicTrust: 8, auditScore: 3 },
  },
  {
    roleId: "MENHUKUM",
    roleTitle: "Menteri Hukum & Reformasi Birokrasi",
    defaultOrigin: "TEKNOKRAT",
    sectorTaskTitle: "Pembenahan Regulasi & Pengawasan Internal",
    sectorTaskDesc:
      "Merapikan tumpang tindih aturan dan memperketat kepatuhan administrasi anggaran.",
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
    note: "Mengutamakan hitungan fiskal, aturan, dan efisiensi sistem; rawan kurang populer secara politis.",
    dprBonus: 0,
    budgetEfficiency: 0.85,
  },
  PARTAI: {
    label: "Kader Partai",
    note: "Kuat di lobi DPR dan dukungan massa akar rumput; cenderung mendorong belanja populis.",
    dprBonus: 8,
    budgetEfficiency: 1.0,
  },
  PENGUSAHA: {
    label: "Dunia Usaha",
    note: "Cepat membaca sentimen pasar dan jejaring proyek; perlu diawasi agar tidak memicu konflik kepentingan.",
    dprBonus: 4,
    budgetEfficiency: 0.95,
  },
};

export const NATIONAL_ISSUES: NationalIssue[] = [
  {
    id: "ISS_BBM_PANGAN",
    ministry: "Kemenkeu & Kemendag",
    title: "Harga Pangan & Energi Naik Menjelang Musim Panen",
    context:
      "Harga beras, cabai, dan tarif distribusi merangkak naik. Media sosial ramai membandingkan harga di pasar induk dengan janji stabilitas.",
    options: [
      {
        id: "A",
        title: "Operasi Pasar & Subsidi Terarah",
        summary: "Gelar pasar murah serentak dan tahan tarif dasar selama 6 bulan.",
        realWorldTradeoff:
          "Kas APBN tergerus, tetapi kepercayaan publik cepat pulih.",
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
        summary: "Buka kuota impor komoditas tertentu dan percepat bongkar muat.",
        realWorldTradeoff:
          "Pasar lega, namun sebagian fraksi dan petani memprotes.",
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
        realWorldTradeoff:
          "Anggaran aman, tapi tekanan biaya hidup warga masih terasa.",
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
      "Draf aturan mendesak dikebut di parlemen. Sebagian fraksi mendesak segera disahkan, sementara kelompok masyarakat sipil turun ke jalan.",
    options: [
      {
        id: "A",
        title: "Tunda Pengesahan & Buka Uji Publik",
        summary:
          "Tarik draf sementara untuk menampung masukan akademisi dan publik.",
        realWorldTradeoff:
          "Merendam gelombang protes, namun membuat fraksi koalisi kesal.",
        delta: {
          publicTrust: 9,
          dprSupport: -9,
          economicStability: 2,
        },
      },
      {
        id: "B",
        title: "Sahkan dengan Catatan Revisi Bertahap",
        summary:
          "Ketok palu sesuai jadwal koalisi sambil menjanjikan aturan turunan.",
        realWorldTradeoff:
          "Soliditas koalisi terjaga, tapi kritik publik memanas.",
        delta: {
          dprSupport: 8,
          publicTrust: -11,
          economicStability: -3,
        },
      },
      {
        id: "C",
        title: "Pangkas Pasal Kontroversial & Kompromi Fraksi",
        summary:
          "Hapus poin paling sensitif agar kompromi bisa diterima dua sisi.",
        realWorldTradeoff:
          "Kompromi jalan di tengah, meski tidak memuaskan semua pihak.",
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
      "Laporan audit internal menyoroti data penerima bantuan yang belum mutakhir serta keterlambatan pertanggungjawaban beberapa proyek daerah.",
    options: [
      {
        id: "A",
        title: "Audit Menyeluruh & Pemutakhiran Data",
        summary:
          "Bekukan pencairan bermasalah sementara dan verifikasi ulang NIK.",
        realWorldTradeoff:
          "Skor tata kelola naik, tetapi sebagian penerima mengeluh telat cair.",
        delta: {
          auditScore: 12,
          publicTrust: -4,
          budgetTrillion: 50,
        },
      },
      {
        id: "B",
        title: "Cairkan Dulu, Evaluasi Belakangan",
        summary:
          "Prioritaskan daya beli warga dulu dan audit menyusul akhir tahun.",
        realWorldTradeoff:
          "Warga puas, namun catatan audit memburuk dan rawan temuan.",
        delta: {
          publicTrust: 8,
          auditScore: -11,
          budgetTrillion: -90,
        },
      },
      {
        id: "C",
        title: "Bentuk Satgas Lintas Kementerian",
        summary:
          "Libatkan inspektorat, pemda, dan auditor untuk merapikan sistem.",
        realWorldTradeoff: "Langkah moderat dengan biaya koordinasi rutin.",
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
      "Sentimen global membuat mata uang melemah tipis dan investor memantau arah kebijakan fiskal serta kepastian regulasi.",
    options: [
      {
        id: "A",
        title: "Paket Insentif Industri & Kepastian Izin",
        summary: "Pangkas hambatan perizinan dan beri kepastian iklim usaha.",
        realWorldTradeoff:
          "Kepercayaan pasar menguat, namun oposisi menyoroti insentif besar.",
        delta: {
          economicStability: 10,
          budgetTrillion: -65,
          dprSupport: -3,
        },
      },
      {
        id: "B",
        title: "Efisiensi Belanja Non-Prioritas",
        summary:
          "Pangkas perjalanan dinas, seremoni, dan rapat luar kota kabinet.",
        realWorldTradeoff:
          "Kas negara dan citra hemat membaik, tetapi menteri mengeluh.",
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
        summary:
          "Fokus menjaga inflasi domestik agar daya beli tidak ikut tergerus.",
        realWorldTradeoff: "Stabil di dalam negeri, reaksi pasar moderat.",
        delta: {
          economicStability: 5,
          publicTrust: 5,
          budgetTrillion: -50,
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
      "Potongan basis data diklaim beredar di forum daring. Publik menuntut kejelasan keamanan siber dan pertanggungjawaban instansi terkait.",
    severity: "TINGGI",
    responses: [
      {
        id: "A",
        label: "Buka Hasil Forensik & Ganti Pejabat Teknis",
        note: "Publik melihat ketegasan, pasar merespons positif.",
        delta: { publicTrust: 6, economicStability: 4, dprSupport: -4 },
      },
      {
        id: "B",
        label: "Bantah Keras & Klaim Sistem Aman",
        note: "Memicu perdebatan panjang di media sosial.",
        delta: { publicTrust: -8, auditScore: -6 },
      },
      {
        id: "C",
        label: "Audit Siber Mandiri & Anggaran Keamanan",
        note: "Biaya tambahan keluar, tata kelola membaik.",
        delta: { budgetTrillion: -30, auditScore: 8, publicTrust: 2 },
      },
    ],
  },
  {
    id: "SC_MARKUP_PROYEK",
    headline: "Sorotan Selisih Harga Pengadaan Barang Pemerintah",
    detail:
      "Warganet dan pengamat membandingkan spesifikasi pengadaan di daerah dengan harga pasar wajar sehingga memicu desakan audit.",
    severity: "KRITIS",
    responses: [
      {
        id: "A",
        label: "Serahkan Berkas ke Auditor & Hentikan Kontrak",
        note: "Skor audit melonjak, sebagian rekanan & fraksi tertekan.",
        delta: { auditScore: 10, dprSupport: -6, publicTrust: 4 },
      },
      {
        id: "B",
        label: "Revisi Harga Satuan Secara Diam-Diam",
        note: "Kegaduhan mereda sesaat, tapi rawan bocor lagi.",
        delta: { budgetTrillion: 25, auditScore: -9, publicTrust: -4 },
      },
      {
        id: "C",
        label: "Klarifikasi Terbuka & E-Katalog Ketat",
        note: "Menjaga kepercayaan publik dengan biaya penataan.",
        delta: { budgetTrillion: -20, publicTrust: 5, auditScore: 5 },
      },
    ],
  },
  {
    id: "SC_ANTREAN_LAYANAN",
    headline: "Antrean Panjang & Keluhan Layanan Publik di Daerah",
    detail:
      "Video antrean panjang warga di loket layanan dan fasilitas kesehatan menyebar luas menjelang jam sibuk.",
    severity: "TINGGI",
    responses: [
      {
        id: "A",
        label: "Inspeksi Mendadak & Tambah Loket Darurat",
        note: "Sentimen warga membaik, kas terpakai untuk operasional.",
        delta: { publicTrust: 7, budgetTrillion: -25 },
      },
      {
        id: "B",
        label: "Salurkan lewat Antrean Daring Bertahap",
        note: "Mengurangi antrean fisik, butuh penyesuaian warga.",
        delta: { economicStability: 4, publicTrust: 3, auditScore: 3 },
      },
      {
        id: "C",
        label: "Minta Pemda Menangani Sendiri",
        note: "Pusat hemat anggaran, tapi warga merasa abai.",
        delta: { publicTrust: -7, dprSupport: -3 },
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

function pickScandalForYear(nextYear: number): PublicScandal {
  return PUBLIC_SCANDALS[(nextYear - 1) % PUBLIC_SCANDALS.length];
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

  const startingMetrics: CabinetStateMetrics = {
    budgetTrillion: 650,
    publicTrust: 58,
    dprSupport: Math.min(95, 55 + originMeta.dprBonus),
    economicStability: 60,
    auditScore: 62,
  };

  const initialFeed: FeedEntry[] = [
    {
      id: "feed_1",
      year: 1,
      tag: "SIDANG",
      text: `Kabinet ${params.countryName.trim() || "Nusantara"} resmi bekerja. ${playerMember.name} menjabat sebagai ${roleMeta.roleTitle} (${originMeta.label}).`,
    },
    {
      id: "feed_2",
      year: 1,
      tag: "BERITA",
      text: `Agenda prioritas Tahun ke-1: "${firstIssue.title}".`,
    },
  ];

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
    activeScandal: null,
    metrics: startingMetrics,
    currentIssue: firstIssue,
    usedIssueIds: [firstIssue.id],
    members: allMembers,
    playerId: playerMember.id,
    feed: initialFeed,
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
    text: `Respons isu "${state.activeScandal.headline}": ${chosen.label}.`,
  };

  const collapsed =
    nextMetrics.publicTrust <= 10 ||
    nextMetrics.dprSupport <= 10 ||
    nextMetrics.economicStability <= 10;

  return {
    ...state,
    activeScandal: null,
    metrics: nextMetrics,
    status: collapsed ? "ENDED" : state.status,
    endSummary: collapsed
      ? "Pemerintahan goyah akibat tekanan skandal publik dan melemahnya dukungan politik."
      : state.endSummary,
    feed: [entry, ...state.feed].slice(0, 35),
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
    text: `${player.name} menjalankan "${roleMeta.sectorTaskTitle}" (Biaya efektif Rp ${realCost}T).`,
  };

  return {
    ...state,
    metrics: nextMetrics,
    members: updatedMembers,
    feed: [entry, ...state.feed].slice(0, 35),
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
    text: `Lobi politik dilakukan ke ${target.roleTitle} (dana taktis 15M); dukungan DPR naik namun skor audit sedikit tertekan.`,
  };

  return {
    ...state,
    metrics: nextMetrics,
    members: updatedMembers,
    feed: [entry, ...state.feed].slice(0, 35),
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
    text: `Tahun ke-${state.year}: Keputusan "${chosenOption.title}" disahkan (${counts.A}A / ${counts.B}B / ${counts.C}C).`,
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
        "Pemerintahan goyah di tengah jalan akibat tekanan politik, pasar, atau turunnya kepercayaan publik secara drastis.",
      feed: [decisionFeed, ...state.feed].slice(0, 35),
    };
  }

  if (state.year >= state.maxYears) {
    return {
      ...state,
      metrics: nextMetrics,
      activeScandal: null,
      status: "ENDED",
      endSummary: `Masa jabatan 5 tahun tuntas! Kas APBN tersisa Rp ${nextMetrics.budgetTrillion}T, kepercayaan publik ${nextMetrics.publicTrust}%, dukungan DPR ${nextMetrics.dprSupport}%, dan skor audit ${nextMetrics.auditScore}%.`,
      feed: [decisionFeed, ...state.feed].slice(0, 35),
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

  const shouldTriggerScandal =
    nextYear % 2 === 0 ||
    nextMetrics.auditScore < 50 ||
    nextMetrics.publicTrust < 48;
  const spawnedScandal = shouldTriggerScandal
    ? pickScandalForYear(nextYear)
    : null;

  const nextYearFeed: FeedEntry = {
    id: `yr_${Date.now()}`,
    year: nextYear,
    tag: spawnedScandal ? "SKANDAL" : "BERITA",
    text: spawnedScandal
      ? `ALERT PUBLIK Tahun ke-${nextYear}: ${spawnedScandal.headline}!`
      : `Memasuki Tahun ke-${nextYear}: Isu baru muncul — "${nextIssue.title}".`,
  };

  return {
    ...state,
    year: nextYear,
    metrics: nextMetrics,
    activeScandal: spawnedScandal,
    currentIssue: nextIssue,
    usedIssueIds: [...state.usedIssueIds, nextIssue.id],
    members: nextMembers,
    feed: [nextYearFeed, decisionFeed, ...state.feed].slice(0, 35),
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
    text: `Presiden me-reshuffle ${target.roleTitle} ke latar belakang ${originMeta.label}.`,
  };

  return {
    ...state,
    reshuffleDoneYear: state.year,
    metrics: nextMetrics,
    members: updatedMembers,
    feed: [entry, ...state.feed].slice(0, 35),
  };
}
