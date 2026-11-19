"use client";

import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  HandCoins,
  Home,
  Landmark,
  RotateCcw,
  Scale,
  ShieldCheck,
  Shuffle,
  TrendingUp,
  Users,
  Vote,
} from "lucide-react";
import {
  GameSimulationState,
  OriginType,
  PolicyOptionId,
  RoleId,
} from "@/types";
import {
  castPlayerVote,
  closeYearAndAdvance,
  createInitialSimulation,
  ORIGIN_INFO,
  reshuffleMinister,
  resolvePublicScandal,
  ROLE_CATALOG,
  runLobbyAction,
  runSectoralTask,
} from "@/lib/cabinetEngine";

const STORAGE_KEY = "m_kabinet_sim_v2";

type MobileNavTab = "BERANDA" | "AKSI" | "KABINET" | "MUTASI";

function loadSavedSimulation(): GameSimulationState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameSimulationState;
    if (
      !parsed ||
      typeof parsed.countryName !== "string" ||
      typeof parsed.year !== "number" ||
      !parsed.metrics ||
      !parsed.currentIssue ||
      !Array.isArray(parsed.members) ||
      parsed.members.length === 0
    ) {
      return null;
    }
    return {
      ...parsed,
      reshuffleDoneYear:
        typeof parsed.reshuffleDoneYear === "number"
          ? parsed.reshuffleDoneYear
          : 0,
      activeScandal: parsed.activeScandal ?? null,
    };
  } catch {
    return null;
  }
}

export const CabinetSimApp: React.FC = () => {
  const [countryName, setCountryName] = useState("Republik Nusantara");
  const [presidentName, setPresidentName] = useState("Budi Santoso");
  const [playerRoleId, setPlayerRoleId] = useState<RoleId>("PRESIDEN");
  const [playerOrigin, setPlayerOrigin] = useState<OriginType>("PARTAI");
  const [sim, setSim] = useState<GameSimulationState | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<MobileNavTab>("BERANDA");
  const [hideBalance, setHideBalance] = useState(false);

  const [lobbyTargetId, setLobbyTargetId] = useState<string>("");
  const [reshuffleTargetId, setReshuffleTargetId] = useState<string>("");
  const [reshuffleOrigin, setReshuffleOrigin] =
    useState<OriginType>("TEKNOKRAT");

  useEffect(() => {
    const saved = loadSavedSimulation();
    if (saved) {
      setSim(saved);
      const others = saved.members.filter((m) => m.id !== saved.playerId);
      setLobbyTargetId(others[0]?.id ?? "");
      setReshuffleTargetId(others[0]?.id ?? "");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      if (sim) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sim));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Abaikan jika storage diblokir
    }
  }, [sim, hydrated]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createInitialSimulation({
      countryName,
      presidentName,
      playerRoleId,
      playerOrigin,
    });
    const others = created.members.filter((m) => m.id !== created.playerId);
    setLobbyTargetId(others[0]?.id ?? "");
    setReshuffleTargetId(others[0]?.id ?? "");
    setReshuffleOrigin("TEKNOKRAT");
    setActiveTab("BERANDA");
    setSim(created);
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Abaikan error storage
      }
    }
    setSim(null);
  };

  if (!hydrated) {
    return (
      <main className="min-h-dvh bg-[#003366] flex items-center justify-center px-4">
        <div className="rounded-2xl bg-white px-6 py-4 shadow-lg text-xs font-extrabold text-[#0056A4]">
          Menghubungkan ke m-Kabinet...
        </div>
      </main>
    );
  }

  // Layar Login / Aktivasi Ala m-BCA
  if (!sim) {
    return (
      <main className="min-h-dvh bg-gradient-to-b from-[#002952] via-[#004A8F] to-[#E6EEF8] px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-blue-200">
          <div className="bg-gradient-to-r from-[#002952] via-[#004A8F] to-[#0066B3] px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span className="font-black tracking-wider text-lg">
                  m-KABINET
                </span>
              </div>
              <span className="rounded-full bg-white/15 border border-white/25 px-2.5 py-0.5 text-[10px] font-bold text-amber-200">
                PERIODE 5 TAHUN
              </span>
            </div>
            <p className="mt-1 text-xs text-blue-100">
              Otorisasi Pejabat & Manajemen Kas APBN
            </p>
          </div>

          <form onSubmit={handleStart} className="p-6 space-y-4">
            <label className="block space-y-1 text-xs font-bold text-slate-700">
              <span>Nama Pemerintahan / Negara</span>
              <input
                type="text"
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#0056A4] focus:bg-white focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-xs font-bold text-slate-700">
              <span>Nama Pejabat Anda</span>
              <input
                type="text"
                value={presidentName}
                onChange={(e) => setPresidentName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#0056A4] focus:bg-white focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-xs font-bold text-slate-700">
              <span>Posisi di Kabinet</span>
              <select
                value={playerRoleId}
                onChange={(e) => {
                  const nextRole = e.target.value as RoleId;
                  setPlayerRoleId(nextRole);
                  const found = ROLE_CATALOG.find((r) => r.roleId === nextRole);
                  if (found) setPlayerOrigin(found.defaultOrigin);
                }}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#0056A4] focus:bg-white focus:outline-none"
              >
                {ROLE_CATALOG.map((r) => (
                  <option key={r.roleId} value={r.roleId}>
                    {r.roleTitle}
                  </option>
                ))}
              </select>
            </label>

            <div className="space-y-1.5">
              <span className="block text-xs font-bold text-slate-700">
                Latar Belakang Tokoh
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(["TEKNOKRAT", "PARTAI", "PENGUSAHA"] as OriginType[]).map(
                  (orig) => {
                    const active = playerOrigin === orig;
                    return (
                      <button
                        key={orig}
                        type="button"
                        onClick={() => setPlayerOrigin(orig)}
                        className={`rounded-xl border px-2 py-2.5 text-xs font-extrabold transition ${
                          active
                            ? "border-[#0056A4] bg-[#0056A4] text-white shadow-sm"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-blue-50"
                        }`}
                      >
                        {ORIGIN_INFO[orig].label}
                      </button>
                    );
                  }
                )}
              </div>
              <p className="text-[11px] text-slate-500 pt-0.5 leading-relaxed">
                {ORIGIN_INFO[playerOrigin].note}
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[#004A8F] to-[#0066B3] py-3 text-sm font-extrabold text-white shadow-md hover:opacity-95 transition"
            >
              Masuk ke m-Kabinet
            </button>
          </form>
        </div>
      </main>
    );
  }

  const player =
    sim.members.find((m) => m.id === sim.playerId) ?? sim.members[0];
  const playerRoleMeta =
    ROLE_CATALOG.find((r) => r.roleId === player.roleId) ?? ROLE_CATALOG[0];
  const playerOriginMeta = ORIGIN_INFO[player.origin];
  const sectorCost = Math.max(
    10,
    Math.round(
      playerRoleMeta.sectorCostTrillion * playerOriginMeta.budgetEfficiency
    )
  );
  const taskDone = player.taskDoneYear === sim.year;
  const isPresident = player.roleId === "PRESIDEN";
  const reshuffleUsedThisYear = sim.reshuffleDoneYear === sim.year;

  const voteCounts: Record<PolicyOptionId, number> = { A: 0, B: 0, C: 0 };
  sim.members.forEach((m) => {
    const v = m.votedOption ?? "A";
    voteCounts[v] += 1;
  });

  const otherMembers = sim.members.filter((m) => m.id !== player.id);
  const activeLobbyTargetId =
    otherMembers.find((m) => m.id === lobbyTargetId)?.id ??
    otherMembers[0]?.id ??
    "";
  const activeReshuffleTargetId =
    otherMembers.find((m) => m.id === reshuffleTargetId)?.id ??
    otherMembers[0]?.id ??
    "";

  return (
    <main className="min-h-dvh bg-[#DCE6F2] text-[#0F294A]">
      <div className="mx-auto max-w-md min-h-dvh bg-[#F2F6FC] shadow-2xl flex flex-col">
        {/* Top Bar Biru Khas Mobile BCA */}
        <header className="bg-gradient-to-r from-[#002952] via-[#004A8F] to-[#0066B3] px-4 pt-4 pb-16 text-white rounded-b-3xl">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                <span className="font-black tracking-wider text-base">
                  m-KABINET
                </span>
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-200">
                  Tahun {sim.year}/{sim.maxYears}
                </span>
              </div>
              <p className="text-[11px] text-blue-100 mt-0.5 truncate max-w-[235px]">
                {sim.countryName} • {player.name}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 rounded-full bg-white/15 hover:bg-white/25 px-3 py-1.5 text-[11px] font-bold text-white transition"
            >
              <RotateCcw size={12} />
              Keluar
            </button>
          </div>
        </header>

        {/* Area Konten Utama */}
        <div className="px-4 -mt-12 space-y-3.5 flex-1 pb-24">
          {/* Kartu Rekening APBN */}
          <section className="rounded-2xl bg-gradient-to-br from-[#003870] via-[#00529B] to-[#0070C9] p-4 text-white shadow-lg border border-blue-300/30">
            <div className="flex items-center justify-between text-[11px] text-blue-100">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Landmark size={13} className="text-amber-300" />
                Rekening Kas APBN
              </span>
              <span className="font-mono text-[10px] text-blue-200">
                0826-2026-RI
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="text-2xl font-black tracking-tight text-amber-300">
                {hideBalance
                  ? "Rp •••••• T"
                  : `Rp ${sim.metrics.budgetTrillion}.000 T`}
              </div>
              <button
                type="button"
                onClick={() => setHideBalance((prev) => !prev)}
                className="inline-flex items-center gap-1 rounded-lg bg-white/15 hover:bg-white/25 px-2.5 py-1 text-[10px] font-bold text-white"
              >
                {hideBalance ? <Eye size={12} /> : <EyeOff size={12} />}
                {hideBalance ? "Lihat" : "Tutup"}
              </button>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-100">
              <span className="truncate font-semibold">
                {player.roleTitle} ({playerOriginMeta.label})
              </span>
              <span className="inline-flex items-center gap-1 text-amber-200 font-bold shrink-0">
                Dana Taktis: {player.tacticalFund}M
              </span>
            </div>
          </section>

          {/* Notifikasi Alert Skandal Publik */}
          {sim.activeScandal && sim.status === "ACTIVE" && (
            <section className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-3.5 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-red-700">
                  <AlertTriangle size={14} className="shrink-0" />
                  m-Alert Skandal • {sim.activeScandal.severity}
                </span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-extrabold text-red-800">
                  WAJIB TINDAK
                </span>
              </div>

              <div>
                <h2 className="text-xs font-black text-slate-900">
                  {sim.activeScandal.headline}
                </h2>
                <p className="mt-0.5 text-[11px] text-slate-700 leading-relaxed">
                  {sim.activeScandal.detail}
                </p>
              </div>

              <div className="space-y-1.5">
                {sim.activeScandal.responses.map((res) => (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() =>
                      setSim(
                        (prev) => prev && resolvePublicScandal(prev, res.id)
                      )
                    }
                    className="w-full rounded-xl border border-amber-300 bg-white hover:bg-blue-50 p-2.5 text-left transition"
                  >
                    <div className="text-[11px] font-extrabold text-[#0056A4]">
                      {res.id}. {res.label}
                    </div>
                    <div className="text-[10px] text-slate-600 mt-0.5">
                      {res.note}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* 4 Indikator Negara */}
          <section className="grid grid-cols-4 gap-2">
            <div className="rounded-xl bg-white p-2.5 border border-slate-200/80 shadow-sm text-center">
              <Users size={14} className="mx-auto text-[#0056A4]" />
              <div className="mt-1 text-[10px] font-semibold text-slate-500">
                Publik
              </div>
              <div className="text-xs font-black text-slate-900">
                {sim.metrics.publicTrust}%
              </div>
            </div>

            <div className="rounded-xl bg-white p-2.5 border border-slate-200/80 shadow-sm text-center">
              <Building2 size={14} className="mx-auto text-[#0056A4]" />
              <div className="mt-1 text-[10px] font-semibold text-slate-500">
                DPR
              </div>
              <div className="text-xs font-black text-slate-900">
                {sim.metrics.dprSupport}%
              </div>
            </div>

            <div className="rounded-xl bg-white p-2.5 border border-slate-200/80 shadow-sm text-center">
              <TrendingUp size={14} className="mx-auto text-[#0056A4]" />
              <div className="mt-1 text-[10px] font-semibold text-slate-500">
                Pasar
              </div>
              <div className="text-xs font-black text-slate-900">
                {sim.metrics.economicStability}%
              </div>
            </div>

            <div className="rounded-xl bg-white p-2.5 border border-slate-200/80 shadow-sm text-center">
              <Scale size={14} className="mx-auto text-[#0056A4]" />
              <div className="mt-1 text-[10px] font-semibold text-slate-500">
                Audit
              </div>
              <div className="text-xs font-black text-slate-900">
                {sim.metrics.auditScore}%
              </div>
            </div>
          </section>

          {/* Grid Menu Cepat Ala Mobile Banking */}
          <section className="rounded-2xl bg-white p-3 border border-slate-200/80 shadow-sm">
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <button
                type="button"
                onClick={() => setActiveTab("BERANDA")}
                className="flex flex-col items-center gap-1 rounded-xl p-2 hover:bg-blue-50 transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-[#0056A4]">
                  <Vote size={18} />
                </div>
                <span className="text-[11px] font-bold text-slate-700">
                  Sidang
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("AKSI")}
                className="flex flex-col items-center gap-1 rounded-xl p-2 hover:bg-blue-50 transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-[#0056A4]">
                  <Briefcase size={18} />
                </div>
                <span className="text-[11px] font-bold text-slate-700">
                  Program
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("KABINET")}
                className="flex flex-col items-center gap-1 rounded-xl p-2 hover:bg-blue-50 transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-[#0056A4]">
                  <Users size={18} />
                </div>
                <span className="text-[11px] font-bold text-slate-700">
                  Kabinet
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("MUTASI")}
                className="flex flex-col items-center gap-1 rounded-xl p-2 hover:bg-blue-50 transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-[#0056A4]">
                  <FileText size={18} />
                </div>
                <span className="text-[11px] font-bold text-slate-700">
                  Mutasi
                </span>
              </button>
            </div>
          </section>

          {/* Konten Per Tab */}
          {activeTab === "BERANDA" && (
            <div className="space-y-3.5">
              {sim.status === "ENDED" ? (
                <section className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm space-y-3">
                  <h2 className="text-sm font-black text-slate-900">
                    Masa Jabatan Selesai
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sim.endSummary}
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full rounded-xl bg-[#0056A4] py-2.5 text-xs font-extrabold text-white"
                  >
                    Mulai Periode Baru
                  </button>
                </section>
              ) : (
                <section className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-blue-50 text-[#0056A4] px-2.5 py-0.5 text-[10px] font-extrabold">
                      SIDANG • {sim.currentIssue.ministry}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      A:{voteCounts.A} • B:{voteCounts.B} • C:{voteCounts.C}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-sm font-black text-slate-900">
                      {sim.currentIssue.title}
                    </h2>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {sim.currentIssue.context}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {sim.currentIssue.options.map((opt) => {
                      const chosen = player.votedOption === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setSim(
                              (prev) => prev && castPlayerVote(prev, opt.id)
                            )
                          }
                          className={`w-full rounded-xl border p-3 text-left transition ${
                            chosen
                              ? "border-[#0056A4] bg-[#0056A4] text-white"
                              : "border-slate-200 bg-slate-50 text-slate-900 hover:bg-blue-50/60"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-extrabold">
                              {opt.id}. {opt.title}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                chosen
                                  ? "bg-amber-300 text-slate-950"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {voteCounts[opt.id]} suara
                            </span>
                          </div>
                          <p
                            className={`mt-1 text-[11px] ${
                              chosen ? "text-blue-50" : "text-slate-600"
                            }`}
                          >
                            {opt.summary}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    disabled={Boolean(sim.activeScandal)}
                    onClick={() =>
                      setSim((prev) => prev && closeYearAndAdvance(prev))
                    }
                    className="w-full rounded-xl bg-[#0056A4] py-2.5 text-xs font-extrabold text-white hover:bg-[#004282] transition disabled:opacity-45"
                  >
                    {sim.activeScandal
                      ? "Selesaikan m-Alert Skandal Dulu"
                      : `Sahkan Keputusan & Lanjut Tahun ${Math.min(
                          sim.maxYears,
                          sim.year + 1
                        )}`}
                  </button>
                </section>
              )}

              <section className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-900">
                    Mutasi Kebijakan Terbaru
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("MUTASI")}
                    className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#0056A4]"
                  >
                    Lihat Semua <ArrowUpRight size={12} />
                  </button>
                </div>
                <div className="space-y-2">
                  {sim.feed.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#0056A4]">
                        <span>{item.tag}</span>
                        <span>THN {item.year}</span>
                      </div>
                      <p className="mt-0.5 text-slate-700 leading-snug">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === "AKSI" && (
            <div className="space-y-3.5">
              <section className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-slate-900">
                    <Briefcase size={15} className="text-[#0056A4]" />
                    Program Sektoral
                  </span>
                  <span className="text-[11px] font-bold text-[#0056A4]">
                    Rp {sectorCost}T
                  </span>
                </div>
                <div className="text-xs font-extrabold text-slate-800">
                  {playerRoleMeta.sectorTaskTitle}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {playerRoleMeta.sectorTaskDesc}
                </p>
                <button
                  type="button"
                  disabled={taskDone || sim.status !== "ACTIVE"}
                  onClick={() => setSim((prev) => prev && runSectoralTask(prev))}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0056A4] py-2.5 text-xs font-extrabold text-white disabled:opacity-45"
                >
                  {taskDone && <CheckCircle2 size={14} />}
                  {taskDone
                    ? `Selesai di Tahun ke-${sim.year}`
                    : `Jalankan Program (Rp ${sectorCost}T)`}
                </button>
              </section>

              <section className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-slate-900">
                    <HandCoins size={15} className="text-[#0056A4]" />
                    Lobi Koalisi & Pejabat
                  </span>
                  <span className="text-[11px] font-bold text-slate-600">
                    Saldo: {player.tacticalFund}M
                  </span>
                </div>

                <select
                  value={activeLobbyTargetId}
                  onChange={(e) => setLobbyTargetId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold"
                >
                  {otherMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.roleTitle} ({ORIGIN_INFO[m.origin].label})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={
                    sim.status !== "ACTIVE" ||
                    player.tacticalFund < 15 ||
                    !activeLobbyTargetId
                  }
                  onClick={() =>
                    setSim(
                      (prev) => prev && runLobbyAction(prev, activeLobbyTargetId)
                    )
                  }
                  className="w-full rounded-xl bg-[#0056A4] py-2.5 text-xs font-extrabold text-white disabled:opacity-40"
                >
                  Transfer Lobi Politik (15M)
                </button>
              </section>

              {isPresident && (
                <section className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-black text-slate-900">
                      <Shuffle size={15} className="text-[#0056A4]" />
                      Reshuffle Kabinet
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {reshuffleUsedThisYear ? "Terpakai" : "1x / Tahun"}
                    </span>
                  </div>

                  <select
                    value={activeReshuffleTargetId}
                    onChange={(e) => setReshuffleTargetId(e.target.value)}
                    disabled={sim.status !== "ACTIVE" || reshuffleUsedThisYear}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold disabled:opacity-50"
                  >
                    {otherMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.roleTitle} — {ORIGIN_INFO[m.origin].label}
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-3 gap-1.5">
                    {(["TEKNOKRAT", "PARTAI", "PENGUSAHA"] as OriginType[]).map(
                      (orig) => {
                        const active = reshuffleOrigin === orig;
                        return (
                          <button
                            key={orig}
                            type="button"
                            disabled={
                              sim.status !== "ACTIVE" || reshuffleUsedThisYear
                            }
                            onClick={() => setReshuffleOrigin(orig)}
                            className={`rounded-xl border py-2 text-[11px] font-bold transition disabled:opacity-50 ${
                              active
                                ? "border-[#0056A4] bg-[#0056A4] text-white"
                                : "border-slate-200 bg-slate-50 text-slate-700"
                            }`}
                          >
                            {ORIGIN_INFO[orig].label}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={
                      sim.status !== "ACTIVE" ||
                      reshuffleUsedThisYear ||
                      !activeReshuffleTargetId
                    }
                    onClick={() =>
                      setSim(
                        (prev) =>
                          prev &&
                          reshuffleMinister(
                            prev,
                            activeReshuffleTargetId,
                            reshuffleOrigin
                          )
                      )
                    }
                    className="w-full rounded-xl bg-[#0056A4] py-2.5 text-xs font-extrabold text-white disabled:opacity-40"
                  >
                    {reshuffleUsedThisYear
                      ? "Reshuffle Tahun Ini Selesai"
                      : "Otorisasi Reshuffle"}
                  </button>
                </section>
              )}
            </div>
          )}

          {activeTab === "KABINET" && (
            <section className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black text-slate-900">
                  Susunan Kabinet ({sim.members.length}/8)
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <ShieldCheck size={12} /> Aktif
                </span>
              </div>

              <div className="space-y-2">
                {sim.members.map((member) => {
                  const isMe = member.id === player.id;
                  const doneThisYear = member.taskDoneYear === sim.year;
                  return (
                    <div
                      key={member.id}
                      className={`rounded-xl border p-3 space-y-1.5 ${
                        isMe
                          ? "border-[#0056A4] bg-blue-50/70"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-xs font-black text-slate-900 truncate">
                            {member.roleTitle}
                          </div>
                          <div className="text-[11px] text-slate-600 truncate">
                            {member.name} • {ORIGIN_INFO[member.origin].label}
                          </div>
                        </div>
                        <span className="rounded-full bg-white border border-slate-300 px-2 py-0.5 text-[10px] font-bold text-slate-800 shrink-0">
                          {member.votedOption
                            ? `Opsi ${member.votedOption}`
                            : "Menunggu"}
                        </span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-500">
                        Program Sektoral:{" "}
                        <span
                          className={
                            doneThisYear ? "text-emerald-700" : "text-slate-600"
                          }
                        >
                          {doneThisYear ? "Selesai" : "Belum"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {activeTab === "MUTASI" && (
            <section className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm space-y-2.5">
              <h2 className="text-xs font-black text-slate-900">
                Mutasi Rekening & Catatan Sidang
              </h2>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {sim.feed.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#0056A4]">
                      <span>{item.tag}</span>
                      <span>Tahun {item.year}</span>
                    </div>
                    <p className="mt-1 text-slate-700 leading-snug">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Bottom Navigation Bar Ala m-BCA */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-20 w-full max-w-md border-t border-slate-200 bg-white px-2 py-1.5 grid grid-cols-4 gap-1 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          {(
            [
              { id: "BERANDA", label: "Beranda", icon: Home },
              { id: "AKSI", label: "Aksi", icon: Vote },
              { id: "KABINET", label: "Kabinet", icon: Users },
              { id: "MUTASI", label: "Mutasi", icon: FileText },
            ] as const
          ).map((nav) => {
            const Icon = nav.icon;
            const active = activeTab === nav.id;
            return (
              <button
                key={nav.id}
                type="button"
                onClick={() => setActiveTab(nav.id)}
                className={`flex flex-col items-center justify-center rounded-xl py-1.5 text-[10px] font-bold transition ${
                  active
                    ? "bg-blue-50 text-[#0056A4]"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Icon size={16} />
                <span className="mt-0.5">{nav.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </main>
  );
};
