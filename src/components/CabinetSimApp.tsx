"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Eye,
  EyeOff,
  Gavel,
  Landmark,
  RotateCcw,
  Scale,
  Shield,
  Users,
  Volume2,
  VolumeX,
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

const STORAGE_KEY = "kabinet_plenger_arcade_v2";

// Posisi 8 kursi melingkar di meja sidang (% koordinat arena)
const SEAT_COORDS: { top: string; left: string }[] = [
  { top: "13%", left: "50%" }, // 0: Atas Tengah (Presiden)
  { top: "22%", left: "82%" }, // 1: Kanan Atas
  { top: "50%", left: "89%" }, // 2: Kanan Tengah
  { top: "78%", left: "82%" }, // 3: Kanan Bawah
  { top: "86%", left: "50%" }, // 4: Bawah Tengah
  { top: "78%", left: "18%" }, // 5: Kiri Bawah
  { top: "50%", left: "11%" }, // 6: Kiri Tengah
  { top: "22%", left: "18%" }, // 7: Kiri Atas
];

function playGameSfx(
  enabled: boolean,
  type: "TAP" | "GAVEL" | "RIP" | "SIREN" | "CHIME" | "BOOT"
) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const t = ctx.currentTime;

    if (type === "TAP") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(520, t);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      osc.start(t);
      osc.stop(t + 0.07);
    } else if (type === "GAVEL") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(48, t + 0.18);
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.start(t);
      osc.stop(t + 0.21);
    } else if (type === "RIP") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + 0.14);
      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.start(t);
      osc.stop(t + 0.16);
    } else if (type === "SIREN") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.setValueAtTime(620, t + 0.12);
      osc.frequency.setValueAtTime(440, t + 0.24);
      gain.gain.setValueAtTime(0.11, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.36);
      osc.start(t);
      osc.stop(t + 0.37);
    } else if (type === "CHIME") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(587, t);
      osc.frequency.setValueAtTime(880, t + 0.09);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
      osc.start(t);
      osc.stop(t + 0.27);
    } else {
      osc.type = "square";
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(75, t + 0.3);
      gain.gain.setValueAtTime(0.11, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
      osc.start(t);
      osc.stop(t + 0.33);
    }
  } catch {
    // Abaikan jika browser memblokir audio
  }
}

// Karikatur SVG Pejabat Berpeci & Jas dengan Ekspresi Dinamis
const MinisterAvatar: React.FC<{ seat: CabinetSeat }> = ({ seat }) => {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      style={{ display: "block", margin: "0 auto" }}
    >
      {/* Bahu / Jas */}
      <path
        d="M8 46 C8 34, 40 34, 40 46 Z"
        fill={seat.eliminated ? "#57534e" : seat.suitColor}
        stroke="#0c0a09"
        strokeWidth="2.5"
      />
      {/* Kemeja & Dasi */}
      <polygon points="21,35 27,35 24,45" fill="#ffffff" />
      <polygon points="23,36 25,36 24,44" fill="#dc2626" />

      {/* Kepala */}
      <circle
        cx="24"
        cy="23"
        r="11"
        fill={seat.eliminated ? "#a8a29e" : "#fed7aa"}
        stroke="#0c0a09"
        strokeWidth="2.2"
      />

      {/* Peci Hitam Nasional */}
      <path
        d="M13 17 Q24 11 35 17 L34 11 Q24 7 14 11 Z"
        fill="#18181b"
        stroke="#0c0a09"
        strokeWidth="1.8"
      />

      {/* Mata */}
      {seat.eliminated ? (
        <>
          <text x="17" y="24" fontSize="8" fontWeight="900" fill="#dc2626">
            ×
          </text>
          <text x="27" y="24" fontSize="8" fontWeight="900" fill="#dc2626">
            ×
          </text>
        </>
      ) : (
        <>
          <circle cx="20" cy="22" r="1.8" fill="#0c0a09" />
          <circle cx="28" cy="22" r="1.8" fill="#0c0a09" />
        </>
      )}

      {/* Kacamata */}
      {seat.hasGlasses && (
        <g stroke="#0c0a09" strokeWidth="1.5" fill="none">
          <rect x="16" y="19.5" width="7" height="5" rx="1" />
          <rect x="25" y="19.5" width="7" height="5" rx="1" />
          <line x1="23" y1="22" x2="25" y2="22" />
        </g>
      )}

      {/* Kumis */}
      {seat.hasMustache && (
        <path
          d="M19 26.5 Q24 24.5 29 26.5"
          stroke="#18181b"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
      )}

      {/* Mulut sesuai Mood */}
      {seat.mood === "SMIRK" ? (
        <path
          d="M20 28.5 Q25 31 29 27.5"
          stroke="#0c0a09"
          strokeWidth="1.8"
          fill="none"
        />
      ) : seat.mood === "SHOCK" ? (
        <circle cx="24" cy="29" r="2.3" fill="#7f1d1d" />
      ) : (
        <line
          x1="21"
          y1="29"
          x2="27"
          y2="29"
          stroke="#0c0a09"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}

      {/* Tetes Keringat Dingin saat Dicurigai */}
      {seat.mood === "SWEAT" && !seat.eliminated && (
        <path
          d="M36 17 C38 20, 38 22, 36 22 C34 22, 34 20, 36 17 Z"
          fill="#38bdf8"
          stroke="#0284c7"
          strokeWidth="1"
        />
      )}
    </svg>
  );
};

export const CabinetSimApp: React.FC = () => {
  const [mode, setMode] = useState<GameMode>("SOLO");
  const [soloName, setSoloName] = useState("Budi");
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
  const [soundOn, setSoundOn] = useState(true);
  const [showSecret, setShowSecret] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);

  // Pilihan interaktif langsung di meja & kartu
  const [pickedExecutorId, setPickedExecutorId] = useState<string>("");
  const [pickedCardId, setPickedCardId] = useState<string>("");
  const [voteTargetId, setVoteTargetId] = useState<string>("AMAN");

  // Gesture swipe/drag kartu ke atas
  const dragStartYRef = useRef<number | null>(null);
  const [dragOffsetY, setDragOffsetY] = useState<number>(0);

  const triggerJuice = useCallback(
    (sfx: "GAVEL" | "RIP" | "SIREN" | "CHIME" | "BOOT") => {
      playGameSfx(soundOn, sfx);
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 340);
    },
    [soundOn]
  );

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
      // Abaikan
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

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    playGameSfx(soundOn, "GAVEL");
    const created = createPlengerGame({
      mode,
      cabinetName: "KABINET PLENGER",
      humanNames: mode === "SOLO" ? [soloName] : multiNames,
      soloPreferredRole: soloRole,
      soloPreferredFaction: soloFaction,
    });
    setPickedExecutorId("");
    setPickedCardId("");
    setVoteTargetId("AMAN");
    setShowSecret(false);
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

  // ==================== LAYAR START ARCADE (100dvh, NO SCROLL) ====================
  if (!game) {
    return (
      <main
        style={{
          height: "100dvh",
          width: "100vw",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 50% 25%, #451a03 0%, #0c0a09 80%)",
          color: "#fafaf9",
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "14px",
          boxSizing: "border-box",
        }}
      >
        <form
          onSubmit={handleStart}
          style={{
            width: "100%",
            maxWidth: "420px",
            backgroundColor: "#1c1917",
            border: "3px solid #f59e0b",
            borderRadius: "20px",
            padding: "18px",
            boxShadow: "0 0 40px rgba(245, 158, 11, 0.25)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "14px" }}>
            <span
              style={{
                backgroundColor: "#dc2626",
                color: "#fef08a",
                fontSize: "10px",
                fontWeight: 900,
                padding: "3px 10px",
                borderRadius: "999px",
                letterSpacing: "1px",
              }}
            >
              5 REFORMIS VS 3 OPORTUNIS
            </span>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 900,
                margin: "6px 0 2px",
                color: "#fbbf24",
                letterSpacing: "-0.5px",
              }}
            >
              KABINET PLENGER
            </h1>
            <p style={{ fontSize: "12px", color: "#a8a29e", margin: 0 }}>
              Ketok palu kebijakan, bongkar menteri titipan!
            </p>
          </div>

          {/* Toggle Solo / Multiplayer */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            {(["SOLO", "MULTIPLAYER"] as GameMode[]).map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    playGameSfx(soundOn, "TAP");
                    setMode(m);
                  }}
                  style={{
                    padding: "10px 8px",
                    borderRadius: "12px",
                    border: active
                      ? "2px solid #fbbf24"
                      : "2px solid #44403c",
                    backgroundColor: active ? "#b45309" : "#292524",
                    color: "#ffffff",
                    fontWeight: 900,
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  {m === "SOLO" ? "SOLO (VS 7 AI)" : "MABAR (2-8 ORANG)"}
                </button>
              );
            })}
          </div>

          {mode === "SOLO" ? (
            <div style={{ display: "grid", gap: "10px", marginBottom: "14px" }}>
              <input
                type="text"
                value={soloName}
                onChange={(e) => setSoloName(e.target.value)}
                placeholder="Nama Pejabat"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "2px solid #57534e",
                  backgroundColor: "#292524",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 800,
                }}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                <select
                  value={soloRole}
                  onChange={(e) => setSoloRole(e.target.value as RoleId)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "2px solid #57534e",
                    backgroundColor: "#292524",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 800,
                  }}
                >
                  {CABINET_ROLES.map((r) => (
                    <option key={r.roleId} value={r.roleId}>
                      {r.shortTitle}
                    </option>
                  ))}
                </select>

                <select
                  value={soloFaction}
                  onChange={(e) =>
                    setSoloFaction(e.target.value as FactionType | "RANDOM")
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "2px solid #57534e",
                    backgroundColor: "#292524",
                    color: "#fbbf24",
                    fontSize: "12px",
                    fontWeight: 800,
                  }}
                >
                  <option value="RANDOM">KUBU: ACAK</option>
                  <option value="REFORMIS">REFORMIS</option>
                  <option value="OPORTUNIS">OPORTUNIS</option>
                </select>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                  fontSize: "11px",
                  color: "#d6d3d1",
                  fontWeight: 800,
                }}
              >
                <span>PEMAIN ({multiNames.length}/8)</span>
                {multiNames.length < 8 && (
                  <button
                    type="button"
                    onClick={() =>
                      setMultiNames((p) => [...p, `Pemain ${p.length + 1}`])
                    }
                    style={{
                      padding: "3px 8px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "#f59e0b",
                      color: "#0c0a09",
                      fontWeight: 900,
                      fontSize: "11px",
                      cursor: "pointer",
                    }}
                  >
                    + KURSI
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
                        padding: "7px 9px",
                        borderRadius: "8px",
                        border: "1.5px solid #57534e",
                        backgroundColor: "#292524",
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    />
                    {multiNames.length > 2 && (
                      <button
                        type="button"
                        onClick={() =>
                          setMultiNames((p) => p.filter((_, i) => i !== idx))
                        }
                        style={{
                          padding: "0 7px",
                          borderRadius: "8px",
                          border: "none",
                          backgroundColor: "#991b1b",
                          color: "#ffffff",
                          fontWeight: 900,
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

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              backgroundColor: "#f59e0b",
              color: "#0c0a09",
              fontSize: "15px",
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: "0 5px 0 #92400e",
            }}
          >
            MULAI SIDANG KABINET ▶
          </button>
        </form>
      </main>
    );
  }

  // ==================== STATE DALAM GAME (100dvh LOCKED ARENA) ====================
  const president =
    game.seats.find((s) => s.id === game.presidentSeatId) ?? game.seats[0];
  const executor = game.seats.find((s) => s.id === game.executorSeatId);
  const soloPlayer =
    game.mode === "SOLO"
      ? game.seats.find((s) => s.isHuman) ?? game.seats[0]
      : null;

  const activeHumans = game.seats.filter((s) => s.isHuman && !s.eliminated);
  const currentMultiHuman =
    activeHumans[game.activeHumanIndex] ?? activeHumans[0];

  let activeTurnSeat: CabinetSeat | undefined = undefined;
  if (game.phase === "ROLE_REVEAL" || game.phase === "DEBATE_VOTE") {
    activeTurnSeat = currentMultiHuman;
  } else if (game.phase === "SELECT_EXECUTOR") {
    activeTurnSeat = president;
  } else if (game.phase === "MINISTER_ENACT") {
    activeTurnSeat = executor;
  }

  const needsCurtain =
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

  const activeCards =
    game.phase === "SELECT_EXECUTOR"
      ? game.drawnCards
      : game.phase === "MINISTER_ENACT"
      ? game.passedCards
      : [];

  const effectiveCardId =
    activeCards.find((c) => c.id === pickedCardId)?.id ??
    activeCards[0]?.id ??
    "";

  const executeCardAction = (cardIdToUse: string) => {
    if (game.phase === "SELECT_EXECUTOR") {
      triggerJuice("RIP");
      setPickedCardId("");
      setGame((prev) =>
        prev
          ? selectExecutorAndDiscard(prev, effectiveExecutorId, cardIdToUse)
          : prev
      );
    } else if (game.phase === "MINISTER_ENACT") {
      const targetCard = game.passedCards.find((c) => c.id === cardIdToUse);
      triggerJuice(
        targetCard?.alignment === "TITIPAN"
          ? "SIREN"
          : targetCard?.alignment === "BERSIH"
          ? "CHIME"
          : "GAVEL"
      );
      setPickedCardId("");
      setGame((prev) => (prev ? enactPolicyCard(prev, cardIdToUse) : prev));
    }
  };

  return (
    <main
      style={{
        height: "100dvh",
        width: "100vw",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 42%, #292524 0%, #0c0a09 88%)",
        color: "#fafaf9",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        animation: shakeScreen ? "plengerShake 0.34s ease-in-out" : "none",
      }}
    >
      <style>{`
        @keyframes plengerShake {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-6px, 4px); }
          40% { transform: translate(6px, -4px); }
          60% { transform: translate(-4px, -2px); }
          80% { transform: translate(4px, 2px); }
        }
        @keyframes stampSlam {
          0% { transform: translate(-50%, -50%) scale(2.4) rotate(-18deg); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1) rotate(-8deg); opacity: 1; }
        }
      `}</style>

      {/* ==================== 1. TOP GAME HUD ==================== */}
      <header
        style={{
          padding: "8px 10px 6px",
          backgroundColor: "rgba(12, 10, 9, 0.85)",
          borderBottom: "2px solid #44403c",
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "6px",
          }}
        >
          {/* 4 Indikator Barometer */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "6px",
              flex: 1,
            }}
          >
            <div
              style={{
                backgroundColor: "#1c1917",
                border: "1px solid #44403c",
                borderRadius: "8px",
                padding: "4px 6px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "9px", color: "#fbbf24", fontWeight: 900 }}>
                <Landmark size={10} style={{ display: "inline" }} /> APBN
              </div>
              <div style={{ fontSize: "12px", fontWeight: 900 }}>
                {game.metrics.budgetTrillion}T
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#1c1917",
                border: "1px solid #44403c",
                borderRadius: "8px",
                padding: "4px 6px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "9px", color: "#34d399", fontWeight: 900 }}>
                <Users size={10} style={{ display: "inline" }} /> PUBLIK
              </div>
              <div style={{ fontSize: "12px", fontWeight: 900 }}>
                {game.metrics.publicTrust}%
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#1c1917",
                border: "1px solid #44403c",
                borderRadius: "8px",
                padding: "4px 6px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "9px", color: "#60a5fa", fontWeight: 900 }}>
                <Gavel size={10} style={{ display: "inline" }} /> DPR
              </div>
              <div style={{ fontSize: "12px", fontWeight: 900 }}>
                {game.metrics.dprSupport}%
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#1c1917",
                border: "1px solid #44403c",
                borderRadius: "8px",
                padding: "4px 6px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "9px", color: "#f87171", fontWeight: 900 }}>
                <Scale size={10} style={{ display: "inline" }} /> AUDIT
              </div>
              <div style={{ fontSize: "12px", fontWeight: 900 }}>
                {game.metrics.auditScore}%
              </div>
            </div>
          </div>

          {/* Tombol Identitas, Sound, Reset */}
          <div style={{ display: "flex", gap: "4px" }}>
            {soloPlayer && (
              <button
                type="button"
                onClick={() => {
                  playGameSfx(soundOn, "TAP");
                  setShowSecret((p) => !p);
                }}
                aria-label="Identitas Rahasia"
                style={{
                  padding: "7px",
                  borderRadius: "8px",
                  border: "1.5px solid #f59e0b",
                  backgroundColor: showSecret ? "#b45309" : "#1c1917",
                  color: "#fde047",
                  cursor: "pointer",
                }}
              >
                {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            )}

            <button
              type="button"
              onClick={() => setSoundOn((p) => !p)}
              aria-label="Suara"
              style={{
                padding: "7px",
                borderRadius: "8px",
                border: "1px solid #44403c",
                backgroundColor: "#1c1917",
                color: "#e7e5e4",
                cursor: "pointer",
              }}
            >
              {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset"
              style={{
                padding: "7px",
                borderRadius: "8px",
                border: "1px solid #7f1d1d",
                backgroundColor: "#1c1917",
                color: "#fca5a5",
                cursor: "pointer",
              }}
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Ticker Berita Satir 1 Baris */}
        <div
          style={{
            maxWidth: "820px",
            margin: "5px auto 0",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            fontWeight: 800,
            color: "#fde047",
          }}
        >
          <span
            style={{
              backgroundColor: "#dc2626",
              color: "#ffffff",
              padding: "1px 6px",
              borderRadius: "4px",
              fontSize: "10px",
              flexShrink: 0,
            }}
          >
            THN {game.year}/{game.maxYears}
          </span>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {game.tickerText}
          </span>
        </div>

        {/* Kartu Identitas Rahasia Solo (Overlay Mini) */}
        {soloPlayer && showSecret && (
          <div
            style={{
              maxWidth: "820px",
              margin: "5px auto 0",
              padding: "6px 10px",
              borderRadius: "8px",
              backgroundColor:
                soloPlayer.faction === "OPORTUNIS" ? "#7f1d1d" : "#065f46",
              fontSize: "11px",
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            KUBU ANDA:{" "}
            {soloPlayer.faction === "OPORTUNIS"
              ? `OPORTUNIS (PLENGER) — Rekan: ${game.seats
                  .filter(
                    (s) =>
                      s.faction === "OPORTUNIS" && s.id !== soloPlayer.id
                  )
                  .map((s) => s.shortTitle)
                  .join(", ")}`
              : "REFORMIS (BERSIH) — Pecat semua penyusup Plenger!"}
          </div>
        )}
      </header>

      {/* ==================== 2. ARENA MEJA SIDANG 2D ==================== */}
      <section
        style={{
          position: "relative",
          flex: 1,
          width: "100%",
          maxWidth: "760px",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {/* Meja Bundar Istana */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "56%",
            height: "46%",
            borderRadius: "999px",
            background:
              "radial-gradient(circle, #78350f 0%, #451a03 85%, #290f02 100%)",
            border: "6px solid #d97706",
            boxShadow:
              "0 12px 35px rgba(0,0,0,0.75), inset 0 0 25px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              fontWeight: 900,
              letterSpacing: "1px",
              color: "#fbbf24",
              opacity: 0.85,
            }}
          >
            MEJA SIDANG ISTANA
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 900,
              color: "#fef3c7",
              marginTop: "3px",
              lineHeight: 1.25,
            }}
          >
            {game.currentCrisis.headline}
          </div>

          {/* Stempel Tinta Raksasa di Tengah Meja */}
          {game.lastStamp && game.phase === "DEBATE_VOTE" && (
            <div
              key={game.lastStamp.id}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(-8deg)",
                border: `3px solid ${game.lastStamp.color}`,
                backgroundColor: "rgba(12, 10, 9, 0.9)",
                color: game.lastStamp.color,
                padding: "4px 12px",
                borderRadius: "8px",
                fontWeight: 900,
                fontSize: "14px",
                letterSpacing: "1px",
                whiteSpace: "nowrap",
                animation: "stampSlam 0.25s ease-out",
                boxShadow: "0 4px 15px rgba(0,0,0,0.7)",
              }}
            >
              {game.lastStamp.text}
            </div>
          )}
        </div>

        {/* 8 Kursi Karakter Melingkar */}
        {game.seats.map((seat, idx) => {
          const pos = SEAT_COORDS[idx] ?? SEAT_COORDS[0];
          const isExecutor = seat.id === game.executorSeatId;
          const isEligiblePick =
            game.phase === "SELECT_EXECUTOR" &&
            !seat.eliminated &&
            seat.id !== president.id &&
            seat.id !== game.lastExecutorSeatId;
          const isVotePick =
            game.phase === "DEBATE_VOTE" &&
            !seat.eliminated &&
            seat.roleId !== "PRESIDEN" &&
            seat.id !== currentMultiHuman?.id;

          const isSelectedOnTable =
            (isEligiblePick && effectiveExecutorId === seat.id) ||
            (isVotePick && voteTargetId === `RESHUFFLE:${seat.id}`);

          return (
            <div
              key={seat.id}
              onClick={() => {
                if (isEligiblePick) {
                  playGameSfx(soundOn, "TAP");
                  setPickedExecutorId(seat.id);
                } else if (isVotePick) {
                  playGameSfx(soundOn, "TAP");
                  setVoteTargetId((prev) =>
                    prev === `RESHUFFLE:${seat.id}`
                      ? "AMAN"
                      : `RESHUFFLE:${seat.id}`
                  );
                }
              }}
              style={{
                position: "absolute",
                top: pos.top,
                left: pos.left,
                transform: "translate(-50%, -50%)",
                width: "84px",
                textAlign: "center",
                cursor: isEligiblePick || isVotePick ? "pointer" : "default",
                zIndex: isSelectedOnTable ? 8 : 4,
              }}
            >
              {/* Speech Bubble Satir */}
              {!seat.eliminated && (
                <div
                  style={{
                    backgroundColor: "#fafaf9",
                    color: "#0c0a09",
                    fontSize: "9px",
                    fontWeight: 800,
                    padding: "2px 6px",
                    borderRadius: "8px",
                    marginBottom: "2px",
                    lineHeight: 1.15,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {seat.chatter}
                </div>
              )}

              {/* Lingkaran Kursi & Avatar */}
              <div
                style={{
                  position: "relative",
                  width: "52px",
                  height: "52px",
                  margin: "0 auto",
                  borderRadius: "999px",
                  backgroundColor: seat.eliminated ? "#1c1917" : "#292524",
                  border: isSelectedOnTable
                    ? "3px solid #fbbf24"
                    : isExecutor
                    ? "3px solid #38bdf8"
                    : isEligiblePick || isVotePick
                    ? "2px dashed #a8a29e"
                    : "2px solid #57534e",
                  boxShadow: isSelectedOnTable
                    ? "0 0 16px rgba(251, 191, 36, 0.85)"
                    : "0 4px 10px rgba(0,0,0,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <MinisterAvatar seat={seat} />

                {seat.eliminated && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(127, 29, 29, 0.78)",
                      color: "#fef08a",
                      fontSize: "8px",
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: "rotate(-15deg)",
                    }}
                  >
                    PECAT
                  </div>
                )}
              </div>

              {/* Label Jabatan */}
              <div
                style={{
                  marginTop: "2px",
                  backgroundColor: isSelectedOnTable
                    ? "#f59e0b"
                    : seat.isHuman
                    ? "#1d4ed8"
                    : "#1c1917",
                  color: isSelectedOnTable ? "#0c0a09" : "#fafaf9",
                  fontSize: "9px",
                  fontWeight: 900,
                  padding: "1px 5px",
                  borderRadius: "5px",
                  border: "1px solid #44403c",
                }}
              >
                {seat.shortTitle}
              </div>
            </div>
          );
        })}

        {/* OVERLAY TIRAI PASS-AND-PLAY MULTIPLAYER */}
        {needsCurtain && activeTurnSeat && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(12, 10, 9, 0.96)",
              zIndex: 25,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <Shield size={40} color="#fbbf24" />
            <h2 style={{ fontSize: "20px", fontWeight: 900, margin: "10px 0 4px" }}>
              OPER HP KE {activeTurnSeat.name.toUpperCase()}
            </h2>
            <p style={{ fontSize: "12px", color: "#a8a29e", margin: "0 0 16px" }}>
              Giliran berkas rahasia <strong>{activeTurnSeat.shortTitle}</strong>
            </p>
            <button
              type="button"
              onClick={() => {
                playGameSfx(soundOn, "TAP");
                setGame((p) => (p ? { ...p, privacyCurtainOpen: true } : p));
              }}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#f59e0b",
                color: "#0c0a09",
                fontWeight: 900,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              BUKA BERKAS SAYA
            </button>
          </div>
        )}

        {/* OVERLAY REVEAL PERAN MULTIPLAYER */}
        {!needsCurtain && game.phase === "ROLE_REVEAL" && currentMultiHuman && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(12, 10, 9, 0.94)",
              zIndex: 25,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 900 }}>
              IDENTITAS RAHASIA • {currentMultiHuman.name.toUpperCase()}
            </div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 900,
                margin: "6px 0",
                color:
                  currentMultiHuman.faction === "OPORTUNIS"
                    ? "#f87171"
                    : "#34d399",
              }}
            >
              {currentMultiHuman.faction === "OPORTUNIS"
                ? "KUBU OPORTUNIS (PLENGER)"
                : "KUBU REFORMIS (BERSIH)"}
            </h2>
            <p style={{ fontSize: "12px", color: "#d6d3d1", maxWidth: "340px" }}>
              {currentMultiHuman.faction === "OPORTUNIS"
                ? `Rekan Anda: ${game.seats
                    .filter(
                      (s) =>
                        s.faction === "OPORTUNIS" &&
                        s.id !== currentMultiHuman.id
                    )
                    .map((s) => `${s.name} (${s.shortTitle})`)
                    .join(", ")}`
                : "Jaga skor Audit & APBN tetap aman, lalu pecat menteri titipan!"}
            </p>
            <button
              type="button"
              onClick={() => {
                playGameSfx(soundOn, "TAP");
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
                marginTop: "12px",
                padding: "12px 24px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#f59e0b",
                color: "#0c0a09",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              PAHAM, TUTUP
            </button>
          </div>
        )}

        {/* OVERLAY GAME OVER / VICTORY */}
        {game.phase === "ENDED" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(12, 10, 9, 0.94)",
              zIndex: 30,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color:
                  game.winnerFaction === "REFORMIS"
                    ? "#34d399"
                    : game.winnerFaction === "OPORTUNIS"
                    ? "#f87171"
                    : "#fbbf24",
                margin: "0 0 10px",
              }}
            >
              {game.endReason}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "5px",
                width: "100%",
                maxWidth: "420px",
                marginBottom: "14px",
              }}
            >
              {game.seats.map((s) => (
                <div
                  key={s.id}
                  style={{
                    padding: "5px 8px",
                    borderRadius: "6px",
                    backgroundColor:
                      s.faction === "OPORTUNIS" ? "#7f1d1d" : "#064e3b",
                    fontSize: "10px",
                    fontWeight: 800,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{s.shortTitle}</span>
                  <span>{s.faction}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#f59e0b",
                color: "#0c0a09",
                fontWeight: 900,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              MAIN PERIODE BARU ▶
            </button>
          </div>
        )}
      </section>

      {/* ==================== 3. HAND / DECK KARTU INTERAKTIF BAWAH ==================== */}
      {!needsCurtain && game.phase !== "ENDED" && game.phase !== "ROLE_REVEAL" && (
        <footer
          style={{
            padding: "8px 10px 12px",
            backgroundColor: "rgba(12, 10, 9, 0.92)",
            borderTop: "2px solid #44403c",
            zIndex: 12,
          }}
        >
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            {/* FASE 1 & 2: KARTU KEBIJAKAN (TAP ATAU SWIPE KE ATAS!) */}
            {(game.phase === "SELECT_EXECUTOR" ||
              game.phase === "MINISTER_ENACT") && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "10px",
                    fontWeight: 900,
                    color: "#fbbf24",
                    marginBottom: "6px",
                  }}
                >
                  <span>
                    {game.phase === "SELECT_EXECUTOR"
                      ? `1. TAP KURSI MENTERI DI MEJA • 2. GESER KE ATAS / TAP 1 KARTU UNTUK DIBUANG`
                      : `GILIRAN ${executor?.shortTitle}: GESER KE ATAS / TAP KARTU UNTUK KETOK PALU`}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${activeCards.length}, minmax(0, 1fr))`,
                    gap: "8px",
                  }}
                >
                  {activeCards.map((card) => {
                    const isSelected = effectiveCardId === card.id;
                    const borderColor =
                      card.alignment === "TITIPAN"
                        ? "#ef4444"
                        : card.alignment === "BERSIH"
                        ? "#10b981"
                        : "#3b82f6";

                    return (
                      <div
                        key={card.id}
                        onClick={() => {
                          playGameSfx(soundOn, "TAP");
                          setPickedCardId(card.id);
                        }}
                        onPointerDown={(e) => {
                          dragStartYRef.current = e.clientY;
                          setPickedCardId(card.id);
                        }}
                        onPointerMove={(e) => {
                          if (
                            dragStartYRef.current !== null &&
                            effectiveCardId === card.id
                          ) {
                            const diff = e.clientY - dragStartYRef.current;
                            if (diff < 0) {
                              setDragOffsetY(Math.max(-60, diff));
                            }
                          }
                        }}
                        onPointerUp={() => {
                          if (dragOffsetY <= -35 && effectiveCardId === card.id) {
                            executeCardAction(card.id);
                          }
                          dragStartYRef.current = null;
                          setDragOffsetY(0);
                        }}
                        style={{
                          transform: isSelected
                            ? `translateY(${dragOffsetY - 6}px)`
                            : "translateY(0)",
                          transition:
                            dragStartYRef.current === null
                              ? "transform 0.15s ease"
                              : "none",
                          backgroundColor: isSelected ? "#292524" : "#1c1917",
                          border: `2.5px solid ${
                            isSelected ? "#fbbf24" : borderColor
                          }`,
                          borderRadius: "12px",
                          padding: "8px",
                          cursor: "grab",
                          touchAction: "none",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "9px",
                            fontWeight: 900,
                            color: borderColor,
                          }}
                        >
                          {card.alignment}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 900,
                            marginTop: "2px",
                            lineHeight: 1.2,
                            color: "#fafaf9",
                          }}
                        >
                          {card.title}
                        </div>
                        <div
                          style={{
                            fontSize: "9px",
                            fontWeight: 800,
                            color: "#a8a29e",
                            marginTop: "4px",
                          }}
                        >
                          {card.tagLine}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => executeCardAction(effectiveCardId)}
                  style={{
                    marginTop: "8px",
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor:
                      game.phase === "SELECT_EXECUTOR" ? "#dc2626" : "#f59e0b",
                    color:
                      game.phase === "SELECT_EXECUTOR" ? "#ffffff" : "#0c0a09",
                    fontSize: "12px",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  {game.phase === "SELECT_EXECUTOR"
                    ? `BUANG KARTU TERPILIH & LEMPAR KE ${
                        eligibleExecutors.find(
                          (e) => e.id === effectiveExecutorId
                        )?.shortTitle ?? "MENTERI"
                      }`
                    : "KETOK PALU & SAHKAN KEBIJAKAN"}
                </button>
              </>
            )}

            {/* FASE 3: VOTING RESHUFFLE LANGSUNG DI MEJA */}
            {game.phase === "DEBATE_VOTE" && currentMultiHuman && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 900,
                    color: "#fbbf24",
                    textAlign: "center",
                  }}
                >
                  {voteTargetId === "AMAN"
                    ? "TAP KURSI MENTERI DI MEJA UNTUK TUNTUT RESHUFFLE — ATAU LANJUTKAN"
                    : `TARGET RESHUFFLE: ${
                        game.seats.find(
                          (s) => `RESHUFFLE:${s.id}` === voteTargetId
                        )?.shortTitle ?? ""
                      }`}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      playGameSfx(soundOn, "TAP");
                      setVoteTargetId("AMAN");
                    }}
                    style={{
                      padding: "11px",
                      borderRadius: "10px",
                      border:
                        voteTargetId === "AMAN"
                          ? "2px solid #10b981"
                          : "1px solid #44403c",
                      backgroundColor:
                        voteTargetId === "AMAN" ? "#064e3b" : "#1c1917",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    ✓ AMAN (JANGAN PECAT)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerJuice(
                        voteTargetId === "AMAN" ? "GAVEL" : "BOOT"
                      );
                      const chosen = voteTargetId;
                      setVoteTargetId("AMAN");
                      setGame((prev) =>
                        prev
                          ? castDebateVote(prev, currentMultiHuman.id, chosen)
                          : prev
                      );
                    }}
                    style={{
                      padding: "11px",
                      borderRadius: "10px",
                      border: "none",
                      backgroundColor:
                        voteTargetId === "AMAN" ? "#f59e0b" : "#dc2626",
                      color:
                        voteTargetId === "AMAN" ? "#0c0a09" : "#ffffff",
                      fontSize: "12px",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    {voteTargetId === "AMAN"
                      ? "KUNCI SUARA AMAN ▶"
                      : "SAHKAN VOTE RESHUFFLE!"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </footer>
      )}
    </main>
  );
};
