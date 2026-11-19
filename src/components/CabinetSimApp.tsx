"use client";

import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  FileWarning,
  Gavel,
  Landmark,
  RotateCcw,
  Scale,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import {
  CabinetSeat,
  FactionType,
  GameMode,
  PlengerGameState,
  RoleId,
} from "@/types";
import {
  CABINET_ROLES,
  castDebateVote,
  createPlengerGame,
  enactPolicyCard,
  selectExecutorAndDiscard,
} from "@/lib/cabinetEngine";

const STORAGE_KEY = "kabinet_plenger_save_v1";

export const CabinetSimApp: React.FC = () => {
  const [mode, setMode] = useState<GameMode>("SOLO");
  const [cabinetName, setCabinetName] = useState("Kabinet Plenger Bersatu");
  const [soloName, setSoloName] = useState("Budi Santoso");
  const [soloRole, setSoloRole] = useState<RoleId>("PRESIDEN");
  const [soloFaction, setSoloFaction] = useState<FactionType | "RANDOM">(
    "RANDOM"
  );
  const [multiNames, setMultiNames] = useState<string[]>([
    "Andi",
    "Sinta",
    "Rian",
    "Dina",
  ]);

  const [game, setGame] = useState<PlengerGameState | null>(null);
  const [showSecretBanner, setShowSecretBanner] = useState(false);

  // State pilihan Presiden saat SELECT_EXECUTOR + PRESIDENT_DISCARD
  const [pickedExecutorId, setPickedExecutorId] = useState<string>("");
  const [pickedDiscardId, setPickedDiscardId] = useState<string>("");

  // State pilihan Menteri saat MINISTER_ENACT
  const [pickedEnactId, setPickedEnactId] = useState<string>("");

  // State pilihan Vote saat DEBATE_VOTE
  const [selectedVote, setSelectedVote] = useState<string>("AMAN");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PlengerGameState;
      if (parsed && Array.isArray(parsed.seats) && parsed.metrics) {
        setGame(parsed);
      }
    } catch {
      // Abaikan error storage
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (game) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Abaikan
    }
  }, [game]);

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createPlengerGame({
      mode,
      cabinetName,
      humanNames: mode === "SOLO" ? [soloName] : multiNames,
      soloPreferredRole: soloRole,
      soloPreferredFaction: soloFaction,
    });
    setPickedExecutorId("");
    setPickedDiscardId("");
    setPickedEnactId("");
    setSelectedVote("AMAN");
    setShowSecretBanner(false);
    setGame(created);
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Abaikan
      }
    }
    setGame(null);
  };

  // ==================== LAYAR LOBBY / SETUP ====================
  if (!game) {
    return (
      <main
        style={{
          minHeight: "100dvh",
          background:
            "radial-gradient(circle at top, #292524 0%, #141210 100%)",
          color: "#f5f5f4",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "20px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form
          onSubmit={handleStartGame}
          style={{
            width: "100%",
            maxWidth: "500px",
            backgroundColor: "#faf7f0",
            color: "#1c1917",
            borderRadius: "18px",
            border: "3px solid #d97706",
            padding: "22px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                backgroundColor: "#991b1b",
                color: "#fef2f2",
                fontSize: "11px",
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: "999px",
                letterSpacing: "0.5px",
              }}
            >
              SOCIAL DEDUCTION • SIDANG KABINET
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: "#78350f",
              }}
            >
              5 REFORMIS vs 3 OPORTUNIS
            </span>
          </div>

          <h1
            style={{
              fontSize: "26px",
              fontWeight: 900,
              margin: "0 0 6px",
              letterSpacing: "-0.5px",
            }}
          >
            KABINET PLENGER
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#57534e",
              margin: "0 0 18px",
              lineHeight: 1.45,
            }}
          >
            Kelola APBN dan krisis nasional selama 5 tahun, sembari membongkar
            siapa menteri yang diam-diam menyelipkan pasal titipan!
          </p>

          {/* Pilih Mode Solo / Multiplayer */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              marginBottom: "14px",
            }}
          >
            {(["SOLO", "MULTIPLAYER"] as GameMode[]).map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  style={{
                    padding: "10px",
                    borderRadius: "12px",
                    border: active
                      ? "2px solid #b45309"
                      : "2px solid #d6d3d1",
                    backgroundColor: active ? "#fef3c7" : "#ffffff",
                    color: "#1c1917",
                    fontWeight: 800,
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  {m === "SOLO"
                    ? "SOLO (vs 7 Bot AI)"
                    : "MULTIPLAYER (Pass & Play)"}
                </button>
              );
            })}
          </div>

          <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
            <label style={{ fontSize: "12px", fontWeight: 700 }}>
              Nama Kabinet Pemerintahan
              <input
                type="text"
                value={cabinetName}
                onChange={(e) => setCabinetName(e.target.value)}
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  marginTop: "4px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1.5px solid #a8a29e",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              />
            </label>

            {mode === "SOLO" ? (
              <>
                <label style={{ fontSize: "12px", fontWeight: 700 }}>
                  Nama Tokoh Anda
                  <input
                    type="text"
                    value={soloName}
                    onChange={(e) => setSoloName(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      marginTop: "4px",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1.5px solid #a8a29e",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  />
                </label>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                  }}
                >
                  <label style={{ fontSize: "12px", fontWeight: 700 }}>
                    Jabatan Kabinet
                    <select
                      value={soloRole}
                      onChange={(e) => setSoloRole(e.target.value as RoleId)}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        marginTop: "4px",
                        padding: "10px",
                        borderRadius: "10px",
                        border: "1.5px solid #a8a29e",
                        fontSize: "13px",
                        fontWeight: 600,
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {CABINET_ROLES.map((r) => (
                        <option key={r.roleId} value={r.roleId}>
                          {r.roleTitle}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label style={{ fontSize: "12px", fontWeight: 700 }}>
                    Agenda Rahasia
                    <select
                      value={soloFaction}
                      onChange={(e) =>
                        setSoloFaction(
                          e.target.value as FactionType | "RANDOM"
                        )
                      }
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        marginTop: "4px",
                        padding: "10px",
                        borderRadius: "10px",
                        border: "1.5px solid #a8a29e",
                        fontSize: "13px",
                        fontWeight: 600,
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <option value="RANDOM">Acak (Misteri)</option>
                      <option value="REFORMIS">Reformis (Bersih)</option>
                      <option value="OPORTUNIS">Oportunis (Plenger)</option>
                    </select>
                  </label>
                </div>
              </>
            ) : (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span style={{ fontSize: "12px", fontWeight: 700 }}>
                    Daftar Pemain (2–8 Orang, Sisanya Bot)
                  </span>
                  {multiNames.length < 8 && (
                    <button
                      type="button"
                      onClick={() =>
                        setMultiNames((prev) => [
                          ...prev,
                          `Pemain ${prev.length + 1}`,
                        ])
                      }
                      style={{
                        fontSize: "11px",
                        fontWeight: 800,
                        padding: "4px 8px",
                        borderRadius: "6px",
                        border: "1px solid #78350f",
                        backgroundColor: "#fef3c7",
                        cursor: "pointer",
                      }}
                    >
                      + Tambah Kursi
                    </button>
                  )}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px",
                  }}
                >
                  {multiNames.map((n, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "4px" }}>
                      <input
                        type="text"
                        value={n}
                        onChange={(e) => {
                          const copy = [...multiNames];
                          copy[idx] = e.target.value;
                          setMultiNames(copy);
                        }}
                        required
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          padding: "7px 10px",
                          borderRadius: "8px",
                          border: "1px solid #a8a29e",
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                      />
                      {multiNames.length > 2 && (
                        <button
                          type="button"
                          onClick={() =>
                            setMultiNames((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          style={{
                            padding: "0 8px",
                            borderRadius: "8px",
                            border: "1px solid #dc2626",
                            backgroundColor: "#fee2e2",
                            color: "#991b1b",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#1c1917",
              color: "#fbbf24",
              fontSize: "14px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            LANTIK KABINET &amp; MULAI SIDANG
          </button>
        </form>
      </main>
    );
  }

  // ==================== LOGIKA TAMPILAN DALAM GAME ====================
  const president =
    game.seats.find((s) => s.id === game.presidentSeatId) ?? game.seats[0];
  const executor = game.seats.find((s) => s.id === game.executorSeatId);
  const soloPlayer =
    game.mode === "SOLO"
      ? game.seats.find((s) => s.isHuman) ?? game.seats[0]
      : null;

  const activeHumans = game.seats.filter((s) => s.isHuman && !s.eliminated);
  const currentMultiHuman: CabinetSeat | undefined =
    activeHumans[game.activeHumanIndex] ?? activeHumans[0];

  // Tentukan siapa pemain yang sedang memegang kendali layar saat ini
  let activeTurnSeat: CabinetSeat | undefined = undefined;
  if (game.phase === "ROLE_REVEAL" || game.phase === "DEBATE_VOTE") {
    activeTurnSeat = currentMultiHuman;
  } else if (game.phase === "SELECT_EXECUTOR") {
    activeTurnSeat = president;
  } else if (game.phase === "MINISTER_ENACT") {
    activeTurnSeat = executor;
  }

  const needsPrivacyCurtain =
    game.mode === "MULTIPLAYER" &&
    game.phase !== "ENDED" &&
    activeTurnSeat &&
    !game.privacyCurtainOpen;

  const eligibleExecutors = game.seats.filter(
    (s) =>
      !s.eliminated &&
      s.id !== president.id &&
      s.id !== game.lastExecutorSeatId
  );

  const effectiveExecutorId =
    eligibleExecutors.find((s) => s.id === pickedExecutorId)?.id ??
    eligibleExecutors[0]?.id ??
    "";
  const effectiveDiscardId =
    game.drawnCards.find((c) => c.id === pickedDiscardId)?.id ??
    game.drawnCards[0]?.id ??
    "";
  const effectiveEnactId =
    game.passedCards.find((c) => c.id === pickedEnactId)?.id ??
    game.passedCards[0]?.id ??
    "";

  return (
    <main
      style={{
        minHeight: "100dvh",
        backgroundColor: "#141210",
        color: "#f5f5f4",
        fontFamily: "system-ui, -apple-system, sans-serif",
        paddingBottom: "32px",
      }}
    >
      {/* HEADER BAROMETER NEGARA */}
      <header
        style={{
          backgroundColor: "#1c1917",
          borderBottom: "2px solid #d97706",
          padding: "12px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "880px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  backgroundColor: "#b45309",
                  color: "#fef3c7",
                  fontSize: "11px",
                  fontWeight: 900,
                  padding: "2px 8px",
                  borderRadius: "6px",
                }}
              >
                TAHUN {game.year} / {game.maxYears}
              </span>
              <span style={{ fontSize: "12px", color: "#a8a29e" }}>
                {game.mode === "SOLO"
                  ? "Mode Solo"
                  : `Multiplayer (${activeHumans.length} Pemain)`}
              </span>
            </div>
            <h1 style={{ fontSize: "18px", fontWeight: 900, margin: "4px 0 0" }}>
              {game.cabinetName}
            </h1>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {soloPlayer && (
              <button
                type="button"
                onClick={() => setShowSecretBanner((prev) => !prev)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d97706",
                  backgroundColor: "#292524",
                  color: "#fbbf24",
                  fontSize: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {showSecretBanner ? <EyeOff size={14} /> : <Eye size={14} />}
                {showSecretBanner ? "Tutup Identitas" : "Cek Identitas Rahasia"}
              </button>
            )}

            <button
              type="button"
              onClick={handleReset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "7px 12px",
                borderRadius: "8px",
                border: "1px solid #57534e",
                backgroundColor: "#292524",
                color: "#e7e5e4",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={13} />
              Ulang
            </button>
          </div>
        </div>

        {/* Kartu Identitas Rahasia Solo */}
        {soloPlayer && showSecretBanner && (
          <div
            style={{
              maxWidth: "880px",
              margin: "10px auto 0",
              padding: "10px 14px",
              borderRadius: "10px",
              backgroundColor:
                soloPlayer.faction === "OPORTUNIS" ? "#7f1d1d" : "#064e3b",
              border: "1px solid rgba(255,255,255,0.25)",
              fontSize: "12px",
            }}
          >
            <strong>
              {soloPlayer.name} ({soloPlayer.roleTitle}) — Kubu{" "}
              {soloPlayer.faction === "OPORTUNIS"
                ? "OPORTUNIS (PLENGER)"
                : "REFORMIS (BERSIH)"}
            </strong>
            <div style={{ marginTop: "3px", opacity: 0.9 }}>
              {soloPlayer.faction === "OPORTUNIS"
                ? `Rekan satu jaringan Anda: ${game.seats
                    .filter(
                      (s) =>
                        s.faction === "OPORTUNIS" && s.id !== soloPlayer.id
                    )
                    .map((s) => `${s.name} (${s.roleTitle})`)
                    .join(", ")}. Loloskan pasal titipan hingga Audit <= 15% atau kuasai mayoritas kursi!`
                : "Tugas Anda: jaga APBN & Audit tetap sehat selama 5 tahun dan reshuffle menteri yang menyelipkan pasal titipan!"}
            </div>
          </div>
        )}

        {/* 4 Barometer Utama (Reigns Style) */}
        <div
          style={{
            maxWidth: "880px",
            margin: "12px auto 0",
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "8px",
          }}
        >
          <div
            style={{
              backgroundColor: "#292524",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #44403c",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11px",
                color: "#fcd34d",
                fontWeight: 700,
              }}
            >
              <Landmark size={13} /> KAS APBN
            </div>
            <div style={{ fontSize: "16px", fontWeight: 900, marginTop: "2px" }}>
              Rp {game.metrics.budgetTrillion}T
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#292524",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #44403c",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11px",
                color: "#6ee7b7",
                fontWeight: 700,
              }}
            >
              <Users size={13} /> PUBLIK
            </div>
            <div style={{ fontSize: "16px", fontWeight: 900, marginTop: "2px" }}>
              {game.metrics.publicTrust}%
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#292524",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #44403c",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11px",
                color: "#93c5fd",
                fontWeight: 700,
              }}
            >
              <Gavel size={13} /> KOALISI DPR
            </div>
            <div style={{ fontSize: "16px", fontWeight: 900, marginTop: "2px" }}>
              {game.metrics.dprSupport}%
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#292524",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #44403c",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11px",
                color: "#fca5a5",
                fontWeight: 700,
              }}
            >
              <Scale size={13} /> SKOR AUDIT
            </div>
            <div style={{ fontSize: "16px", fontWeight: 900, marginTop: "2px" }}>
              {game.metrics.auditScore}%
            </div>
          </div>
        </div>
      </header>

      {/* KONTEN UTAMA */}
      <div
        style={{
          maxWidth: "880px",
          margin: "16px auto 0",
          padding: "0 16px",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "16px",
        }}
      >
        {/* TIRAI PRIVASI PASS-AND-PLAY MULTIPLAYER */}
        {needsPrivacyCurtain && activeTurnSeat ? (
          <section
            style={{
              backgroundColor: "#1c1917",
              border: "3px solid #f59e0b",
              borderRadius: "16px",
              padding: "28px 20px",
              textAlign: "center",
            }}
          >
            <Shield
              size={36}
              color="#fbbf24"
              style={{ margin: "0 auto 10px" }}
            />
            <div
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: "#fbbf24",
                letterSpacing: "1px",
              }}
            >
              BERKAS RAHASIA NEGARA • GILIRAN PEMAIN
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 900, margin: "8px 0" }}>
              Serahkan Perangkat ke {activeTurnSeat.name}
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "#a8a29e",
                maxWidth: "420px",
                margin: "0 auto 18px",
              }}
            >
              Pastikan pemain lain tidak mengintip layar sebelum membuka berkas{" "}
              <strong>{activeTurnSeat.roleTitle}</strong>.
            </p>
            <button
              type="button"
              onClick={() =>
                setGame((prev) =>
                  prev ? { ...prev, privacyCurtainOpen: true } : prev
                )
              }
              style={{
                padding: "12px 22px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#f59e0b",
                color: "#1c1917",
                fontSize: "14px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Saya {activeTurnSeat.name}, Buka Berkas
            </button>
          </section>
        ) : (
          <>
            {/* FASE 0: PEMBAGIAN PERAN RAHASIA (MULTIPLAYER) */}
            {game.phase === "ROLE_REVEAL" && currentMultiHuman && (
              <section
                style={{
                  backgroundColor: "#faf7f0",
                  color: "#1c1917",
                  borderRadius: "16px",
                  border: "3px solid #d97706",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#b45309",
                  }}
                >
                  DOKUMEN PENGANGKATAN RAHASIA
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: 900, margin: "4px 0" }}>
                  {currentMultiHuman.name} — {currentMultiHuman.roleTitle}
                </h2>
                <div
                  style={{
                    marginTop: "12px",
                    padding: "12px",
                    borderRadius: "10px",
                    backgroundColor:
                      currentMultiHuman.faction === "OPORTUNIS"
                        ? "#fee2e2"
                        : "#d1fae5",
                    border:
                      currentMultiHuman.faction === "OPORTUNIS"
                        ? "2px solid #dc2626"
                        : "2px solid #059669",
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: "14px" }}>
                    Kubu Anda:{" "}
                    {currentMultiHuman.faction === "OPORTUNIS"
                      ? "OPORTUNIS (PLENGER)"
                      : "REFORMIS (BERSIH)"}
                  </div>
                  <p style={{ fontSize: "12px", margin: "6px 0 0" }}>
                    {currentMultiHuman.faction === "OPORTUNIS"
                      ? `Rekan Oportunis Anda: ${game.seats
                          .filter(
                            (s) =>
                              s.faction === "OPORTUNIS" &&
                              s.id !== currentMultiHuman.id
                          )
                          .map((s) => `${s.name} (${s.roleTitle})`)
                          .join(", ")}.`
                      : "Jaga APBN dan Skor Audit tetap bersih, serta reshuffle menteri Oportunis!"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = game.activeHumanIndex + 1;
                    if (nextIdx < activeHumans.length) {
                      setGame({
                        ...game,
                        activeHumanIndex: nextIdx,
                        privacyCurtainOpen: false,
                      });
                    } else {
                      setGame({
                        ...game,
                        phase: "SELECT_EXECUTOR",
                        activeHumanIndex: 0,
                        privacyCurtainOpen: false,
                      });
                    }
                  }}
                  style={{
                    marginTop: "14px",
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#1c1917",
                    color: "#fbbf24",
                    fontWeight: 900,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Tutup Dokumen &amp; Lanjutkan
                </button>
              </section>
            )}

            {/* FASE 1: PRESIDEN MEMILIH MENTERI & MEMBUANG 1 KARTU */}
            {game.phase === "SELECT_EXECUTOR" && (
              <section
                style={{
                  backgroundColor: "#faf7f0",
                  color: "#1c1917",
                  borderRadius: "16px",
                  border: "3px solid #d97706",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#b45309",
                  }}
                >
                  TAHAP 1: HAK PREROGATIF PRESIDEN ({president.name})
                </div>
                <h2 style={{ fontSize: "18px", fontWeight: 900, margin: "4px 0" }}>
                  Krisis: {game.currentCrisis.headline}
                </h2>
                <p style={{ fontSize: "13px", color: "#57534e", margin: "0 0 14px" }}>
                  {game.currentCrisis.context}
                </p>

                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 800,
                    marginBottom: "12px",
                  }}
                >
                  1. Tunjuk Menteri Pelaksana Kebijakan:
                  <select
                    value={effectiveExecutorId}
                    onChange={(e) => setPickedExecutorId(e.target.value)}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      marginTop: "4px",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1.5px solid #78716c",
                      fontSize: "13px",
                      fontWeight: 700,
                      backgroundColor: "#ffffff",
                    }}
                  >
                    {eligibleExecutors.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.roleTitle} — {m.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    marginBottom: "6px",
                  }}
                >
                  2. Dari 3 Draf Kebijakan Ini, Pilih 1 untuk DIBUANG DIAM-DIAM
                  (2 sisanya diserahkan ke Menteri):
                </div>

                <div style={{ display: "grid", gap: "8px" }}>
                  {game.drawnCards.map((card) => {
                    const isDiscarded = effectiveDiscardId === card.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setPickedDiscardId(card.id)}
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          borderRadius: "10px",
                          border: isDiscarded
                            ? "2px solid #dc2626"
                            : "1.5px solid #d6d3d1",
                          backgroundColor: isDiscarded ? "#fee2e2" : "#ffffff",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "11px",
                            fontWeight: 900,
                            color:
                              card.alignment === "TITIPAN"
                                ? "#b91c1c"
                                : card.alignment === "BERSIH"
                                ? "#047857"
                                : "#1d4ed8",
                          }}
                        >
                          <span>DRAF {card.alignment}</span>
                          <span>
                            {isDiscarded
                              ? "✕ AKAN DIBUANG"
                              : "✓ AKAN DITERUSKAN"}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 800,
                            marginTop: "2px",
                          }}
                        >
                          {card.title}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#57534e",
                            marginTop: "2px",
                          }}
                        >
                          {card.tradeoffNote}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setGame((prev) =>
                      prev
                        ? selectExecutorAndDiscard(
                            prev,
                            effectiveExecutorId,
                            effectiveDiscardId
                          )
                        : prev
                    )
                  }
                  style={{
                    marginTop: "14px",
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#1c1917",
                    color: "#fbbf24",
                    fontWeight: 900,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Serahkan 2 Berkas ke Menteri Pelaksana
                </button>
              </section>
            )}

            {/* FASE 2: MENTERI PELAKSANA MEMILIH 1 DARI 2 KARTU */}
            {game.phase === "MINISTER_ENACT" && executor && (
              <section
                style={{
                  backgroundColor: "#faf7f0",
                  color: "#1c1917",
                  borderRadius: "16px",
                  border: "3px solid #2563eb",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#1d4ed8",
                  }}
                >
                  TAHAP 2: KEPUTUSAN MENTERI ({executor.roleTitle} —{" "}
                  {executor.name})
                </div>
                <h2 style={{ fontSize: "18px", fontWeight: 900, margin: "4px 0" }}>
                  {game.currentCrisis.headline}
                </h2>
                <p style={{ fontSize: "12px", color: "#57534e", margin: "0 0 12px" }}>
                  Presiden {president.name} menyerahkan 2 berkas berikut kepada
                  Anda. Pilih 1 untuk disahkan sebagai kebijakan resmi!
                </p>

                <div style={{ display: "grid", gap: "8px" }}>
                  {game.passedCards.map((card) => {
                    const selected = effectiveEnactId === card.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setPickedEnactId(card.id)}
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          borderRadius: "10px",
                          border: selected
                            ? "2.5px solid #1d4ed8"
                            : "1.5px solid #d6d3d1",
                          backgroundColor: selected ? "#dbeafe" : "#ffffff",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 900,
                            color:
                              card.alignment === "TITIPAN"
                                ? "#b91c1c"
                                : card.alignment === "BERSIH"
                                ? "#047857"
                                : "#1d4ed8",
                          }}
                        >
                          BERKAS {card.alignment}
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 800,
                            marginTop: "2px",
                          }}
                        >
                          {card.title}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#44403c",
                            marginTop: "3px",
                          }}
                        >
                          {card.summary}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#78350f",
                            marginTop: "4px",
                          }}
                        >
                          Dampak: {card.tradeoffNote}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setGame((prev) =>
                      prev ? enactPolicyCard(prev, effectiveEnactId) : prev
                    )
                  }
                  style={{
                    marginTop: "14px",
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#1d4ed8",
                    color: "#ffffff",
                    fontWeight: 900,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Ketok Palu &amp; Sahkan Kebijakan
                </button>
              </section>
            )}

            {/* FASE 3: SIDANG EVALUASI, DEBAT & VOTING RESHUFFLE */}
            {game.phase === "DEBATE_VOTE" && currentMultiHuman && (
              <section
                style={{
                  backgroundColor: "#faf7f0",
                  color: "#1c1917",
                  borderRadius: "16px",
                  border: "3px solid #d97706",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#b45309",
                  }}
                >
                  TAHAP 3: SIDANG EVALUASI &amp; VOTING RESHUFFLE
                </div>

                {game.lastEnactedCard && executor && (
                  <div
                    style={{
                      marginTop: "8px",
                      marginBottom: "14px",
                      padding: "12px",
                      borderRadius: "10px",
                      backgroundColor:
                        game.lastEnactedCard.alignment === "TITIPAN"
                          ? "#fee2e2"
                          : "#ecfdf5",
                      border:
                        game.lastEnactedCard.alignment === "TITIPAN"
                          ? "2px solid #dc2626"
                          : "2px solid #059669",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12px",
                        fontWeight: 900,
                        color:
                          game.lastEnactedCard.alignment === "TITIPAN"
                            ? "#991b1b"
                            : "#065f46",
                      }}
                    >
                      {game.lastEnactedCard.alignment === "TITIPAN" ? (
                        <FileWarning size={16} />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      KEBIJAKAN DISAHKAN: {game.lastEnactedCard.alignment}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 800, marginTop: "4px" }}>
                      {game.lastEnactedCard.title}
                    </div>
                    <div style={{ fontSize: "12px", marginTop: "4px" }}>
                      Diusulkan Presiden <strong>{president.name}</strong> &amp;
                      dieksekusi <strong>{executor.roleTitle}</strong> (
                      {executor.name}).{" "}
                      {game.lastEnactedCard.alignment === "TITIPAN"
                        ? "Salah satu atau keduanya bermain mata menyelipkan pasal titipan!"
                        : "Kebijakan berjalan sesuai jalur bersih."}
                    </div>
                  </div>
                )}

                <div style={{ fontSize: "13px", fontWeight: 800, marginBottom: "8px" }}>
                  Suara {currentMultiHuman.name} ({currentMultiHuman.roleTitle}):
                </div>

                <div style={{ display: "grid", gap: "6px", marginBottom: "14px" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedVote("AMAN")}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border:
                        selectedVote === "AMAN"
                          ? "2px solid #059669"
                          : "1.5px solid #d6d3d1",
                      backgroundColor:
                        selectedVote === "AMAN" ? "#d1fae5" : "#ffffff",
                      fontWeight: 800,
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    ✓ Pertahankan Formasi Kabinet (Jangan Reshuffle Dulu)
                  </button>

                  {game.seats
                    .filter(
                      (s) =>
                        !s.eliminated &&
                        s.id !== currentMultiHuman.id &&
                        s.roleId !== "PRESIDEN"
                    )
                    .map((target) => {
                      const val = `RESHUFFLE:${target.id}`;
                      const active = selectedVote === val;
                      return (
                        <button
                          key={target.id}
                          type="button"
                          onClick={() => setSelectedVote(val)}
                          style={{
                            textAlign: "left",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: active
                              ? "2px solid #dc2626"
                              : "1.5px solid #d6d3d1",
                            backgroundColor: active ? "#fee2e2" : "#ffffff",
                            fontWeight: 700,
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          <AlertTriangle
                            size={13}
                            color="#dc2626"
                            style={{
                              display: "inline",
                              marginRight: "6px",
                              verticalAlign: "text-bottom",
                            }}
                          />
                          Tuntut Reshuffle: <strong>{target.roleTitle}</strong>{" "}
                          ({target.name})
                        </button>
                      );
                    })}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const voteToSend = selectedVote;
                    setSelectedVote("AMAN");
                    setGame((prev) =>
                      prev
                        ? castDebateVote(
                            prev,
                            currentMultiHuman.id,
                            voteToSend
                          )
                        : prev
                    );
                  }}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#1c1917",
                    color: "#fbbf24",
                    fontWeight: 900,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Kunci Suara &amp; Lanjutkan Sidang
                </button>
              </section>
            )}

            {/* FASE AKHIR: GAME OVER / VICTORY */}
            {game.phase === "ENDED" && (
              <section
                style={{
                  backgroundColor: "#faf7f0",
                  color: "#1c1917",
                  borderRadius: "16px",
                  border: "4px solid #f59e0b",
                  padding: "22px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: "999px",
                    backgroundColor:
                      game.winnerFaction === "REFORMIS"
                        ? "#059669"
                        : game.winnerFaction === "OPORTUNIS"
                        ? "#dc2626"
                        : "#57534e",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 900,
                  }}
                >
                  HASIL AKHIR MASA JABATAN
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: 900, margin: "10px 0 6px" }}>
                  {game.endReason}
                </h2>

                {/* Bongkar Semua Identitas Kabinet */}
                <div
                  style={{
                    marginTop: "16px",
                    textAlign: "left",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px",
                  }}
                >
                  {game.seats.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "8px",
                        backgroundColor:
                          s.faction === "OPORTUNIS" ? "#fee2e2" : "#d1fae5",
                        border: "1px solid #a8a29e",
                        fontSize: "11px",
                      }}
                    >
                      <div style={{ fontWeight: 800 }}>
                        {s.roleTitle} ({s.name})
                      </div>
                      <div style={{ fontWeight: 900 }}>
                        Kubu: {s.faction} {s.eliminated ? "• DI-RESHUFFLE" : ""}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    marginTop: "18px",
                    padding: "12px 24px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#1c1917",
                    color: "#fbbf24",
                    fontWeight: 900,
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Mainkan Periode Baru
                </button>
              </section>
            )}
          </>
        )}

        {/* SUSUNAN KURSI KABINET & NOTULENSI SIDANG */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "14px",
          }}
        >
          <section
            style={{
              backgroundColor: "#1c1917",
              borderRadius: "14px",
              border: "1px solid #44403c",
              padding: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 900,
                color: "#fbbf24",
                marginBottom: "10px",
              }}
            >
              <UserCheck size={15} /> FORMASI 8 KURSI KABINET PLENGER
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
              }}
            >
              {game.seats.map((seat) => (
                <div
                  key={seat.id}
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    backgroundColor: seat.eliminated ? "#292524" : "#262220",
                    border:
                      seat.id === game.executorSeatId
                        ? "1.5px solid #3b82f6"
                        : "1px solid #44403c",
                    opacity: seat.eliminated ? 0.55 : 1,
                    fontSize: "11px",
                  }}
                >
                  <div style={{ fontWeight: 800, color: "#f5f5f4" }}>
                    {seat.roleTitle}
                  </div>
                  <div style={{ color: "#a8a29e", marginTop: "2px" }}>
                    {seat.name} {seat.isHuman ? "(Pemain)" : ""}
                  </div>
                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "10px",
                      fontWeight: 800,
                      color: seat.eliminated
                        ? "#fca5a5"
                        : seat.id === game.executorSeatId
                        ? "#93c5fd"
                        : "#a8a29e",
                    }}
                  >
                    {seat.eliminated
                      ? `DICOPOT (${seat.faction})`
                      : seat.id === game.executorSeatId
                      ? "PELAKSANA BERKAS"
                      : "AKTIF"}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            style={{
              backgroundColor: "#1c1917",
              borderRadius: "14px",
              border: "1px solid #44403c",
              padding: "14px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 900,
                color: "#fbbf24",
                marginBottom: "10px",
              }}
            >
              NOTULENSI &amp; REKAM JEJAK SIDANG
            </div>
            <div
              style={{
                maxHeight: "230px",
                overflowY: "auto",
                display: "grid",
                gap: "6px",
              }}
            >
              {game.logs.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "8px",
                    backgroundColor: "#262220",
                    border: "1px solid #3f3b38",
                    fontSize: "11px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "10px",
                      fontWeight: 800,
                      color: "#fbbf24",
                    }}
                  >
                    <span>{item.tag}</span>
                    <span>TAHUN {item.year}</span>
                  </div>
                  <div style={{ marginTop: "3px", color: "#e7e5e4", lineHeight: 1.4 }}>
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
