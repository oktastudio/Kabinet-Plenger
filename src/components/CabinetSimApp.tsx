"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RotateCcw,
  Shield,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  GameSimulationState,
  OriginType,
  PolicyOptionId,
  RoleId,
} from "@/types";
import {
  applyMetricsDelta,
  castPlayerVote,
  closeYearAndAdvance,
  createInitialSimulation,
  ORIGIN_INFO,
  reshuffleMinister,
  resolvePublicScandal,
  ROLE_CATALOG,
  runLobbyAction,
  runSectoralTask,
  WORLD_THEMES,
} from "@/lib/cabinetEngine";

const STORAGE_KEY = "mario_kabinet_save_v1";

const CANVAS_W = 800;
const CANVAS_H = 420;
const GROUND_Y = 356;
const LEVEL_END_X = 2850;
const FLAG_X = 2720;

type BlockType =
  | "BRICK"
  | "QUESTION_SECTOR"
  | "QUESTION_POLICY"
  | "QUESTION_SCANDAL"
  | "QUESTION_COIN"
  | "PIPE";

interface LevelBlock {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: BlockType;
  hit: boolean;
  bumpOffset: number;
  label?: string;
}

interface LevelCoin {
  id: string;
  x: number;
  y: number;
  collected: boolean;
}

interface LevelEnemy {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  minX: number;
  maxX: number;
  label: string;
  alive: boolean;
  squashTimer: number;
}

interface FloatingPopup {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

type ActiveModal = "NONE" | "POLICY" | "SCANDAL" | "CABINET";

function playRetroTone(
  enabled: boolean,
  kind: "JUMP" | "COIN" | "BUMP" | "STOMP" | "HURT" | "CLEAR"
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

    const now = ctx.currentTime;
    if (kind === "JUMP") {
      osc.type = "square";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.14);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (kind === "COIN") {
      osc.type = "square";
      osc.frequency.setValueAtTime(987, now);
      osc.frequency.setValueAtTime(1318, now + 0.06);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.23);
    } else if (kind === "BUMP") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (kind === "STOMP") {
      osc.type = "square";
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (kind === "HURT") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.25);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc.start(now);
      osc.stop(now + 0.27);
    } else {
      osc.type = "square";
      osc.frequency.setValueAtTime(523, now);
      osc.frequency.setValueAtTime(659, now + 0.1);
      osc.frequency.setValueAtTime(784, now + 0.2);
      osc.frequency.setValueAtTime(1046, now + 0.3);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.start(now);
      osc.stop(now + 0.56);
    }
  } catch {
    // Abaikan jika browser memblokir audio
  }
}

function buildStageEntities(year: number): {
  blocks: LevelBlock[];
  coins: LevelCoin[];
  enemies: LevelEnemy[];
} {
  const theme = WORLD_THEMES[(year - 1) % WORLD_THEMES.length];

  const blocks: LevelBlock[] = [
    // Zona 1: Pengenalan & Program Sektoral
    {
      id: "b_coin_1",
      x: 240,
      y: 232,
      w: 36,
      h: 36,
      type: "QUESTION_COIN",
      hit: false,
      bumpOffset: 0,
      label: "APBN",
    },
    {
      id: "b_brick_1",
      x: 340,
      y: 232,
      w: 36,
      h: 36,
      type: "BRICK",
      hit: false,
      bumpOffset: 0,
    },
    {
      id: "b_sector",
      x: 376,
      y: 232,
      w: 36,
      h: 36,
      type: "QUESTION_SECTOR",
      hit: false,
      bumpOffset: 0,
      label: "PROKER",
    },
    {
      id: "b_brick_2",
      x: 412,
      y: 232,
      w: 36,
      h: 36,
      type: "BRICK",
      hit: false,
      bumpOffset: 0,
    },
    {
      id: "pipe_1",
      x: 560,
      y: GROUND_Y - 56,
      w: 54,
      h: 56,
      type: "PIPE",
      hit: false,
      bumpOffset: 0,
      label: "DPR",
    },

    // Zona 2: Sidang Isu Nasional
    {
      id: "b_brick_3",
      x: 860,
      y: 232,
      w: 36,
      h: 36,
      type: "BRICK",
      hit: false,
      bumpOffset: 0,
    },
    {
      id: "b_policy",
      x: 896,
      y: 232,
      w: 36,
      h: 36,
      type: "QUESTION_POLICY",
      hit: false,
      bumpOffset: 0,
      label: "SIDANG",
    },
    {
      id: "b_brick_4",
      x: 932,
      y: 232,
      w: 36,
      h: 36,
      type: "BRICK",
      hit: false,
      bumpOffset: 0,
    },
    {
      id: "b_high_coin",
      x: 896,
      y: 128,
      w: 36,
      h: 36,
      type: "QUESTION_COIN",
      hit: false,
      bumpOffset: 0,
      label: "BONUS",
    },
    {
      id: "pipe_2",
      x: 1120,
      y: GROUND_Y - 76,
      w: 54,
      h: 76,
      type: "PIPE",
      hit: false,
      bumpOffset: 0,
      label: "BPK",
    },

    // Zona 3: Tangga Bata & Skandal Publik
    {
      id: "b_step_1",
      x: 1440,
      y: 260,
      w: 36,
      h: 36,
      type: "BRICK",
      hit: false,
      bumpOffset: 0,
    },
    {
      id: "b_step_2",
      x: 1476,
      y: 260,
      w: 36,
      h: 36,
      type: "BRICK",
      hit: false,
      bumpOffset: 0,
    },
    {
      id: "b_scandal",
      x: 1580,
      y: 190,
      w: 36,
      h: 36,
      type: "QUESTION_SCANDAL",
      hit: false,
      bumpOffset: 0,
      label: "SKANDAL",
    },
    {
      id: "pipe_3",
      x: 1790,
      y: GROUND_Y - 64,
      w: 54,
      h: 64,
      type: "PIPE",
      hit: false,
      bumpOffset: 0,
      label: "KPK",
    },

    // Zona 4: Menuju Tiang Bendera Istana
    {
      id: "b_coin_2",
      x: 2140,
      y: 224,
      w: 36,
      h: 36,
      type: "QUESTION_COIN",
      hit: false,
      bumpOffset: 0,
    },
    {
      id: "b_stair_1",
      x: 2380,
      y: GROUND_Y - 36,
      w: 36,
      h: 36,
      type: "BRICK",
      hit: false,
      bumpOffset: 0,
    },
    {
      id: "b_stair_2",
      x: 2416,
      y: GROUND_Y - 72,
      w: 36,
      h: 72,
      type: "BRICK",
      hit: false,
      bumpOffset: 0,
    },
    {
      id: "b_stair_3",
      x: 2452,
      y: GROUND_Y - 108,
      w: 36,
      h: 108,
      type: "BRICK",
      hit: false,
      bumpOffset: 0,
    },
    {
      id: "b_stair_4",
      x: 2488,
      y: GROUND_Y - 144,
      w: 36,
      h: 144,
      type: "BRICK",
      hit: false,
      bumpOffset: 0,
    },
  ];

  const coins: LevelCoin[] = [
    { id: "c1", x: 350, y: 185, collected: false },
    { id: "c2", x: 386, y: 185, collected: false },
    { id: "c3", x: 422, y: 185, collected: false },
    { id: "c4", x: 700, y: 270, collected: false },
    { id: "c5", x: 740, y: 240, collected: false },
    { id: "c6", x: 780, y: 270, collected: false },
    { id: "c7", x: 1280, y: 265, collected: false },
    { id: "c8", x: 1320, y: 265, collected: false },
    { id: "c9", x: 1960, y: 255, collected: false },
    { id: "c10", x: 2000, y: 230, collected: false },
    { id: "c11", x: 2040, y: 255, collected: false },
  ];

  const enemies: LevelEnemy[] = [
    {
      id: "e1",
      x: 680,
      y: GROUND_Y - 30,
      w: 34,
      h: 30,
      vx: -1.35,
      minX: 625,
      maxX: 830,
      label: theme.enemyLabels[0],
      alive: true,
      squashTimer: 0,
    },
    {
      id: "e2",
      x: 1260,
      y: GROUND_Y - 30,
      w: 34,
      h: 30,
      vx: 1.5,
      minX: 1185,
      maxX: 1420,
      label: theme.enemyLabels[1],
      alive: true,
      squashTimer: 0,
    },
    {
      id: "e3",
      x: 1940,
      y: GROUND_Y - 30,
      w: 34,
      h: 30,
      vx: -1.65,
      minX: 1855,
      maxX: 2110,
      label: theme.enemyLabels[2],
      alive: true,
      squashTimer: 0,
    },
    {
      id: "e4",
      x: 2240,
      y: GROUND_Y - 30,
      w: 34,
      h: 30,
      vx: -1.5,
      minX: 2180,
      maxX: 2360,
      label: theme.enemyLabels[0],
      alive: true,
      squashTimer: 0,
    },
  ];

  return { blocks, coins, enemies };
}

export const CabinetSimApp: React.FC = () => {
  const [countryName, setCountryName] = useState("Republik Nusantara");
  const [presidentName, setPresidentName] = useState("Budi Santoso");
  const [playerRoleId, setPlayerRoleId] = useState<RoleId>("PRESIDEN");
  const [playerOrigin, setPlayerOrigin] = useState<OriginType>("PARTAI");

  const [sim, setSim] = useState<GameSimulationState | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [activeModal, setActiveModal] = useState<ActiveModal>("NONE");
  const [stageNotice, setStageNotice] = useState<string>("");

  const [lobbyTargetId, setLobbyTargetId] = useState<string>("");
  const [reshuffleTargetId, setReshuffleTargetId] = useState<string>("");
  const [reshuffleOrigin, setReshuffleOrigin] =
    useState<OriginType>("TEKNOKRAT");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simRef = useRef<GameSimulationState | null>(null);
  const modalRef = useRef<ActiveModal>("NONE");
  const soundRef = useRef<boolean>(true);

  simRef.current = sim;
  modalRef.current = activeModal;
  soundRef.current = soundOn;

  const keysRef = useRef<{ left: boolean; right: boolean; jump: boolean }>({
    left: false,
    right: false,
    jump: false,
  });

  const worldRef = useRef<{
    yearLoaded: number;
    player: {
      x: number;
      y: number;
      w: number;
      h: number;
      vx: number;
      vy: number;
      onGround: boolean;
      facing: 1 | -1;
      walkFrame: number;
      invuln: number;
    };
    cameraX: number;
    flagSlideY: number;
    clearingStage: boolean;
    blocks: LevelBlock[];
    coins: LevelCoin[];
    enemies: LevelEnemy[];
    popups: FloatingPopup[];
  }>({
    yearLoaded: 0,
    player: {
      x: 70,
      y: GROUND_Y - 38,
      w: 28,
      h: 38,
      vx: 0,
      vy: 0,
      onGround: true,
      facing: 1,
      walkFrame: 0,
      invuln: 0,
    },
    cameraX: 0,
    flagSlideY: 0,
    clearingStage: false,
    blocks: [],
    coins: [],
    enemies: [],
    popups: [],
  });

  const resetStagePhysics = useCallback((year: number) => {
    const built = buildStageEntities(year);
    worldRef.current = {
      yearLoaded: year,
      player: {
        x: 70,
        y: GROUND_Y - 38,
        w: 28,
        h: 38,
        vx: 0,
        vy: 0,
        onGround: true,
        facing: 1,
        walkFrame: 0,
        invuln: 0,
      },
      cameraX: 0,
      flagSlideY: 0,
      clearingStage: false,
      blocks: built.blocks,
      coins: built.coins,
      enemies: built.enemies,
      popups: [],
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as GameSimulationState;
      if (parsed && parsed.metrics && Array.isArray(parsed.members)) {
        setSim(parsed);
        const others = parsed.members.filter((m) => m.id !== parsed.playerId);
        setLobbyTargetId(others[0]?.id ?? "");
        setReshuffleTargetId(others[0]?.id ?? "");
        resetStagePhysics(parsed.year);
      }
    } catch {
      // Abaikan error storage
    }
  }, [resetStagePhysics]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sim) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sim));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Abaikan
    }
  }, [sim]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        keysRef.current.left = true;
      }
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        keysRef.current.right = true;
      }
      if (
        e.code === "ArrowUp" ||
        e.code === "KeyW" ||
        e.code === "Space"
      ) {
        keysRef.current.jump = true;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        keysRef.current.left = false;
      }
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        keysRef.current.right = false;
      }
      if (
        e.code === "ArrowUp" ||
        e.code === "KeyW" ||
        e.code === "Space"
      ) {
        keysRef.current.jump = false;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Game Loop 60fps Mario Bros Engine
  useEffect(() => {
    if (!sim) return;
    let rafId = 0;
    let lastTime = performance.now();

    const addPopup = (x: number, y: number, text: string, color: string) => {
      worldRef.current.popups.push({
        id: Math.random(),
        x,
        y,
        text,
        color,
        life: 1.1,
      });
    };

    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - lastTime) / 1000);
      lastTime = now;

      const currentSim = simRef.current;
      const canvas = canvasRef.current;
      if (!currentSim || !canvas) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (worldRef.current.yearLoaded !== currentSim.year) {
        resetStagePhysics(currentSim.year);
      }

      const world = worldRef.current;
      const p = world.player;
      const paused =
        modalRef.current !== "NONE" || currentSim.status !== "ACTIVE";

      // Update bump animation & floating text even if modal open
      world.blocks.forEach((b) => {
        if (b.bumpOffset < 0) {
          b.bumpOffset = Math.min(0, b.bumpOffset + 45 * dt);
        }
      });
      world.popups.forEach((pop) => {
        pop.y -= 28 * dt;
        pop.life -= dt;
      });
      world.popups = world.popups.filter((pop) => pop.life > 0);

      if (!paused) {
        if (p.invuln > 0) p.invuln = Math.max(0, p.invuln - dt);

        if (world.clearingStage) {
          // Animasi turun tiang bendera Istana
          p.vx = 0;
          if (p.y < GROUND_Y - p.h) {
            p.y = Math.min(GROUND_Y - p.h, p.y + 160 * dt);
          }
          world.flagSlideY = Math.min(150, world.flagSlideY + 180 * dt);
          if (world.flagSlideY >= 150) {
            world.clearingStage = false;
            setSim((prev) => {
              if (!prev) return prev;
              const nextState = closeYearAndAdvance(prev);
              setStageNotice(
                `World 1-${prev.year} Selesai! Lanjut Tahun ke-${nextState.year}.`
              );
              return nextState;
            });
          }
        } else {
          // Kontrol gerak kiri/kanan
          const accel = 0.65;
          const maxSpeed = 4.3;
          if (keysRef.current.left) {
            p.vx = Math.max(-maxSpeed, p.vx - accel);
            p.facing = -1;
            p.walkFrame += 10 * dt;
          } else if (keysRef.current.right) {
            p.vx = Math.min(maxSpeed, p.vx + accel);
            p.facing = 1;
            p.walkFrame += 10 * dt;
          } else {
            p.vx *= 0.8;
            if (Math.abs(p.vx) < 0.1) p.vx = 0;
          }

          // Lompat
          if (keysRef.current.jump && p.onGround) {
            p.vy = -11.4;
            p.onGround = false;
            playRetroTone(soundRef.current, "JUMP");
          }

          // Gerak Horizontal + Kolisi Blok
          p.x += p.vx;
          if (p.x < 12) {
            p.x = 12;
            p.vx = 0;
          }
          if (p.x > LEVEL_END_X) {
            p.x = LEVEL_END_X;
          }

          for (const b of world.blocks) {
            if (
              p.x + p.w > b.x &&
              p.x < b.x + b.w &&
              p.y + p.h > b.y &&
              p.y < b.y + b.h
            ) {
              if (p.vx > 0) {
                p.x = b.x - p.w;
              } else if (p.vx < 0) {
                p.x = b.x + b.w;
              }
              p.vx = 0;
            }
          }

          // Gravitasi & Gerak Vertikal
          p.vy = Math.min(13, p.vy + 0.54);
          p.y += p.vy;
          p.onGround = false;

          // Kolisi Lantai Utama
          if (p.y + p.h >= GROUND_Y) {
            p.y = GROUND_Y - p.h;
            p.vy = 0;
            p.onGround = true;
          }

          // Kolisi Vertikal Blok (Mendarat di atas atau Menyundul dari bawah!)
          for (const b of world.blocks) {
            if (
              p.x + p.w > b.x &&
              p.x < b.x + b.w &&
              p.y + p.h > b.y &&
              p.y < b.y + b.h
            ) {
              if (p.vy > 0) {
                p.y = b.y - p.h;
                p.vy = 0;
                p.onGround = true;
              } else if (p.vy < 0) {
                p.y = b.y + b.h;
                p.vy = 1.6;
                b.bumpOffset = -10;

                if (b.type === "BRICK" || b.type === "PIPE" || b.hit) {
                  playRetroTone(soundRef.current, "BUMP");
                } else {
                  b.hit = true;
                  keysRef.current.left = false;
                  keysRef.current.right = false;
                  keysRef.current.jump = false;

                  if (b.type === "QUESTION_COIN") {
                    playRetroTone(soundRef.current, "COIN");
                    addPopup(b.x, b.y - 14, "+Rp 15T APBN", "#fde047");
                    setSim((prev) =>
                      prev
                        ? {
                            ...prev,
                            metrics: applyMetricsDelta(prev.metrics, {
                              budgetTrillion: 15,
                            }),
                          }
                        : prev
                    );
                  } else if (b.type === "QUESTION_SECTOR") {
                    playRetroTone(soundRef.current, "COIN");
                    addPopup(b.x - 10, b.y - 16, "PROKER SEKTORAL!", "#86efac");
                    setSim((prev) => (prev ? runSectoralTask(prev) : prev));
                    setStageNotice(
                      "Blok Proker tersundul! Program sektoral kementerian langsung dijalankan."
                    );
                  } else if (b.type === "QUESTION_POLICY") {
                    playRetroTone(soundRef.current, "COIN");
                    setActiveModal("POLICY");
                  } else if (b.type === "QUESTION_SCANDAL") {
                    playRetroTone(soundRef.current, "HURT");
                    if (currentSim.activeScandal) {
                      setActiveModal("SCANDAL");
                    } else {
                      addPopup(b.x, b.y - 14, "+5% AUDIT", "#93c5fd");
                      setSim((prev) =>
                        prev
                          ? {
                              ...prev,
                              metrics: applyMetricsDelta(prev.metrics, {
                                auditScore: 5,
                              }),
                            }
                          : prev
                      );
                    }
                  }
                }
              }
            }
          }

          // Ambil Koin APBN Melayang
          for (const coin of world.coins) {
            if (coin.collected) continue;
            if (
              p.x + p.w > coin.x - 10 &&
              p.x < coin.x + 10 &&
              p.y + p.h > coin.y - 10 &&
              p.y < coin.y + 10
            ) {
              coin.collected = true;
              playRetroTone(soundRef.current, "COIN");
              addPopup(coin.x - 16, coin.y - 12, "+Rp 5T", "#fde047");
              setSim((prev) =>
                prev
                  ? {
                      ...prev,
                      metrics: applyMetricsDelta(prev.metrics, {
                        budgetTrillion: 5,
                      }),
                    }
                  : prev
              );
            }
          }

          // Gerak & Tabrakan Musuh (Hoaks, Inflasi, Markup)
          for (const enemy of world.enemies) {
            if (!enemy.alive) continue;
            enemy.x += enemy.vx;
            if (enemy.x <= enemy.minX || enemy.x + enemy.w >= enemy.maxX) {
              enemy.vx *= -1;
            }

            if (
              p.x + p.w > enemy.x + 3 &&
              p.x < enemy.x + enemy.w - 3 &&
              p.y + p.h > enemy.y + 3 &&
              p.y < enemy.y + enemy.h
            ) {
              const stomped = p.vy > 0 && p.y + p.h - p.vy <= enemy.y + 14;
              if (stomped) {
                enemy.alive = false;
                p.vy = -8.5;
                playRetroTone(soundRef.current, "STOMP");
                addPopup(
                  enemy.x,
                  enemy.y - 12,
                  `+${enemy.label} BERES (+4% AUDIT)`,
                  "#86efac"
                );
                setSim((prev) =>
                  prev
                    ? {
                        ...prev,
                        metrics: applyMetricsDelta(prev.metrics, {
                          auditScore: 4,
                          publicTrust: 2,
                        }),
                      }
                    : prev
                );
              } else if (p.invuln <= 0) {
                p.invuln = 1.4;
                p.vy = -6.5;
                p.vx = p.x < enemy.x ? -4.5 : 4.5;
                playRetroTone(soundRef.current, "HURT");
                addPopup(p.x, p.y - 16, `-5% PUBLIK (${enemy.label})`, "#fca5a5");
                setSim((prev) =>
                  prev
                    ? {
                        ...prev,
                        metrics: applyMetricsDelta(prev.metrics, {
                          publicTrust: -5,
                        }),
                      }
                    : prev
                );
              }
            }
          }

          // Cek Sentuh Tiang Bendera Istana di Ujung Level
          if (p.x + p.w >= FLAG_X) {
            world.clearingStage = true;
            playRetroTone(soundRef.current, "CLEAR");
          }
        }
      }

      // Kamera mengikuti karakter
      world.cameraX = Math.max(
        0,
        Math.min(LEVEL_END_X - CANVAS_W + 100, p.x - CANVAS_W * 0.34)
      );

      // ================= RENDER PIXEL ART MARIO BROS =================
      const theme =
        WORLD_THEMES[(currentSim.year - 1) % WORLD_THEMES.length];
      const playerRole =
        ROLE_CATALOG.find(
          (r) =>
            r.roleId ===
            (currentSim.members.find((m) => m.id === currentSim.playerId)
              ?.roleId ?? "PRESIDEN")
        ) ?? ROLE_CATALOG[0];

      // Langit Gradasi Retro
      const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      skyGrad.addColorStop(0, theme.skyTop);
      skyGrad.addColorStop(1, theme.skyBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      const cam = world.cameraX;

      // Bukit Latar Parallax
      ctx.fillStyle = "rgba(22, 101, 52, 0.35)";
      for (let i = 0; i < 8; i++) {
        const hx = i * 440 - (cam * 0.35) % 440;
        ctx.beginPath();
        ctx.arc(hx + 90, GROUND_Y, 95, Math.PI, 0);
        ctx.fill();
      }

      // Awan Pixel Mario
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 10; i++) {
        const cx = i * 330 + 60 - ((cam * 0.5) % 330);
        const cy = 54 + (i % 3) * 26;
        ctx.fillRect(cx, cy, 48, 16);
        ctx.fillRect(cx + 10, cy - 10, 28, 12);
      }

      // Tanah & Rumput Hijau
      ctx.fillStyle = theme.groundBody;
      ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);
      ctx.fillStyle = theme.groundTop;
      ctx.fillRect(0, GROUND_Y, CANVAS_W, 14);

      // Pola Bata Tanah
      ctx.strokeStyle = "rgba(0,0,0,0.28)";
      ctx.lineWidth = 2;
      const startTile = Math.floor(cam / 32) * 32;
      for (let gx = startTile; gx < cam + CANVAS_W + 32; gx += 32) {
        const sx = gx - cam;
        ctx.strokeRect(sx, GROUND_Y + 14, 32, 25);
        ctx.strokeRect(sx + 16, GROUND_Y + 39, 32, 25);
      }

      // Gambar Blok, Blok ?, dan Pipa Hijau
      for (const b of world.blocks) {
        const sx = b.x - cam;
        const sy = b.y + b.bumpOffset;
        if (sx + b.w < -40 || sx > CANVAS_W + 40) continue;

        if (b.type === "PIPE") {
          // Pipa Hijau Mario
          ctx.fillStyle = "#16a34a";
          ctx.fillRect(sx + 4, sy + 14, b.w - 8, b.h - 14);
          ctx.fillStyle = "#22c55e";
          ctx.fillRect(sx, sy, b.w, 16);
          ctx.strokeStyle = "#052e16";
          ctx.lineWidth = 2;
          ctx.strokeRect(sx + 4, sy + 14, b.w - 8, b.h - 14);
          ctx.strokeRect(sx, sy, b.w, 16);

          if (b.label) {
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 10px monospace";
            ctx.textAlign = "center";
            ctx.fillText(b.label, sx + b.w / 2, sy + 34);
          }
        } else if (b.type === "BRICK") {
          ctx.fillStyle = "#c2410c";
          ctx.fillRect(sx, sy, b.w, b.h);
          ctx.strokeStyle = "#431407";
          ctx.lineWidth = 2;
          ctx.strokeRect(sx, sy, b.w, b.h);
          ctx.beginPath();
          ctx.moveTo(sx, sy + b.h / 2);
          ctx.lineTo(sx + b.w, sy + b.h / 2);
          ctx.moveTo(sx + b.w / 2, sy);
          ctx.lineTo(sx + b.w / 2, sy + b.h / 2);
          ctx.stroke();
        } else {
          // Blok Misteri (?)
          ctx.fillStyle = b.hit ? "#78716c" : "#f59e0b";
          ctx.fillRect(sx, sy, b.w, b.h);
          ctx.strokeStyle = "#451a03";
          ctx.lineWidth = 2.5;
          ctx.strokeRect(sx, sy, b.w, b.h);

          ctx.fillStyle = b.hit ? "#d6d3d1" : "#fef08a";
          ctx.font = "900 18px monospace";
          ctx.textAlign = "center";
          ctx.fillText(b.hit ? "•" : "?", sx + b.w / 2, sy + 24);

          if (!b.hit && b.label) {
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 9px monospace";
            ctx.fillText(b.label, sx + b.w / 2, sy - 5);
          }
        }
      }

      // Gambar Koin APBN
      for (const coin of world.coins) {
        if (coin.collected) continue;
        const sx = coin.x - cam;
        if (sx < -20 || sx > CANVAS_W + 20) continue;
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.ellipse(sx, coin.y, 8, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#854d0e";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#854d0e";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Rp", sx, coin.y + 3);
      }

      // Gambar Musuh (Goomba-style Hoaks/Inflasi/Markup)
      for (const enemy of world.enemies) {
        if (!enemy.alive) continue;
        const sx = enemy.x - cam;
        if (sx + enemy.w < -40 || sx > CANVAS_W + 40) continue;

        ctx.fillStyle = "#7f1d1d";
        ctx.beginPath();
        ctx.arc(sx + enemy.w / 2, enemy.y + 14, 15, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(sx + 3, enemy.y + 14, enemy.w - 6, 10);

        // Mata marah
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(sx + 8, enemy.y + 10, 5, 5);
        ctx.fillRect(sx + 21, enemy.y + 10, 5, 5);
        ctx.fillStyle = "#000000";
        ctx.fillRect(sx + 10, enemy.y + 11, 2, 3);
        ctx.fillRect(sx + 22, enemy.y + 11, 2, 3);

        // Kaki
        ctx.fillStyle = "#1c1917";
        ctx.fillRect(sx + 5, enemy.y + 24, 9, 6);
        ctx.fillRect(sx + 20, enemy.y + 24, 9, 6);

        // Label isu di atas musuh
        ctx.fillStyle = "#fef2f2";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(enemy.label, sx + enemy.w / 2, enemy.y - 5);
      }

      // Gambar Tiang Bendera Merah Putih & Gedung Istana di Akhir Level
      const flagScreenX = FLAG_X - cam;
      if (flagScreenX < CANVAS_W + 250) {
        // Tiang bendera
        ctx.fillStyle = "#e5e7eb";
        ctx.fillRect(flagScreenX, GROUND_Y - 210, 6, 210);
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(flagScreenX + 3, GROUND_Y - 214, 7, 0, Math.PI * 2);
        ctx.fill();

        // Bendera Merah Putih
        const fy = GROUND_Y - 200 + world.flagSlideY;
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(flagScreenX + 6, fy, 44, 14);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(flagScreenX + 6, fy + 14, 44, 14);
        ctx.strokeStyle = "#1f2937";
        ctx.lineWidth = 1;
        ctx.strokeRect(flagScreenX + 6, fy, 44, 28);

        // Mini Istana Merdeka
        const ix = flagScreenX + 75;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(ix, GROUND_Y - 95, 110, 95);
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(ix - 6, GROUND_Y - 107, 122, 12);
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText("ISTANA", ix + 55, GROUND_Y - 52);
      }

      // Gambar Karakter Pemain (Pejabat Berpeci & Jas)
      const blinkSkip =
        p.invuln > 0 && Math.floor(p.invuln * 16) % 2 === 0;
      if (!blinkSkip) {
        const px = p.x - cam;
        const py = p.y;

        // Peci Hitam Nasional
        ctx.fillStyle = "#111827";
        ctx.fillRect(px + 4, py, 20, 7);

        // Kepala / Wajah
        ctx.fillStyle = "#fed7aa";
        ctx.fillRect(px + 5, py + 7, 18, 11);

        // Mata & Kacamata
        ctx.fillStyle = "#111827";
        const eyeX = p.facing === 1 ? px + 16 : px + 7;
        ctx.fillRect(eyeX, py + 10, 4, 3);

        // Jas Menteri / Presiden
        ctx.fillStyle = playerRole.suitColor;
        ctx.fillRect(px + 3, py + 18, 22, 12);

        // Dasi Merah/Putih
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(px + 12, py + 18, 4, 9);

        // Celana & Sepatu Bergerak
        const step = Math.sin(p.walkFrame) * 3;
        ctx.fillStyle = "#1f2937";
        ctx.fillRect(px + 5, py + 30, 7, 8 + (p.onGround ? step * 0.4 : 0));
        ctx.fillRect(px + 16, py + 30, 7, 8 - (p.onGround ? step * 0.4 : 0));
      }

      // Floating Score Popups
      for (const pop of world.popups) {
        ctx.fillStyle = pop.color;
        ctx.font = "900 12px monospace";
        ctx.textAlign = "center";
        ctx.fillText(pop.text, pop.x - cam + 14, pop.y);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [sim, resetStagePhysics]);

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
    setActiveModal("NONE");
    setStageNotice(
      "Jalan ke kanan, sundul blok (?) untuk Proker & Sidang, injak musuh, dan raih tiang bendera Istana!"
    );
    resetStagePhysics(1);
    setSim(created);
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Abaikan
      }
    }
    setActiveModal("NONE");
    setSim(null);
  };

  // ==================== LAYAR AWAL RETRO MARIO ====================
  if (!sim) {
    return (
      <main
        style={{
          minHeight: "100dvh",
          background: "linear-gradient(180deg, #1d4ed8 0%, #60a5fa 72%, #16a34a 72%, #92400e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          fontFamily: "monospace",
        }}
      >
        <form
          onSubmit={handleStart}
          style={{
            width: "100%",
            maxWidth: "460px",
            backgroundColor: "#fefce8",
            border: "4px solid #1c1917",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 10px 0 #1c1917",
            color: "#1c1917",
          }}
        >
          <div
            style={{
              backgroundColor: "#dc2626",
              color: "#fef08a",
              border: "3px solid #1c1917",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "14px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: 900, letterSpacing: "1px" }}>
              SUPER KABINET BROS • EDISI INDONESIA
            </div>
            <h1 style={{ fontSize: "20px", fontWeight: 900, margin: "4px 0 0" }}>
              PRESIDEN &amp; MENTERI RUN
            </h1>
          </div>

          <div style={{ display: "grid", gap: "10px", marginBottom: "12px" }}>
            <label style={{ fontSize: "12px", fontWeight: 800 }}>
              NAMA PEMERINTAHAN / NEGARA
              <input
                type="text"
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
                required
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "8px 10px",
                  border: "2px solid #1c1917",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
              />
            </label>

            <label style={{ fontSize: "12px", fontWeight: 800 }}>
              NAMA KARAKTER PEJABAT
              <input
                type="text"
                value={presidentName}
                onChange={(e) => setPresidentName(e.target.value)}
                required
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "8px 10px",
                  border: "2px solid #1c1917",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
              />
            </label>

            <label style={{ fontSize: "12px", fontWeight: 800 }}>
              PILIH JABATAN KABINET
              <select
                value={playerRoleId}
                onChange={(e) => {
                  const nextRole = e.target.value as RoleId;
                  setPlayerRoleId(nextRole);
                  const found = ROLE_CATALOG.find((r) => r.roleId === nextRole);
                  if (found) setPlayerOrigin(found.defaultOrigin);
                }}
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "8px 10px",
                  border: "2px solid #1c1917",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
              >
                {ROLE_CATALOG.map((r) => (
                  <option key={r.roleId} value={r.roleId}>
                    {r.roleTitle}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <div style={{ fontSize: "12px", fontWeight: 800, marginBottom: "5px" }}>
                LATAR BELAKANG TOKOH
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                {(["TEKNOKRAT", "PARTAI", "PENGUSAHA"] as OriginType[]).map(
                  (orig) => {
                    const active = playerOrigin === orig;
                    return (
                      <button
                        key={orig}
                        type="button"
                        onClick={() => setPlayerOrigin(orig)}
                        style={{
                          padding: "8px 4px",
                          border: "2px solid #1c1917",
                          borderRadius: "8px",
                          backgroundColor: active ? "#f59e0b" : "#ffffff",
                          fontFamily: "monospace",
                          fontSize: "11px",
                          fontWeight: 900,
                          cursor: "pointer",
                        }}
                      >
                        {ORIGIN_INFO[orig].label}
                      </button>
                    );
                  }
                )}
              </div>
              <p style={{ fontSize: "11px", color: "#44403c", marginTop: "6px" }}>
                {ORIGIN_INFO[playerOrigin].note}
              </p>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#16a34a",
              color: "#ffffff",
              border: "3px solid #1c1917",
              borderRadius: "10px",
              fontFamily: "monospace",
              fontSize: "14px",
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: "0 4px 0 #1c1917",
            }}
          >
            ▶ START WORLD 1-1 (TAHUN 1)
          </button>
        </form>
      </main>
    );
  }

  const player =
    sim.members.find((m) => m.id === sim.playerId) ?? sim.members[0];
  const theme = WORLD_THEMES[(sim.year - 1) % WORLD_THEMES.length];
  const isPresident = player.roleId === "PRESIDEN";
  const reshuffleUsedThisYear = sim.reshuffleDoneYear === sim.year;
  const otherMembers = sim.members.filter((m) => m.id !== player.id);

  const voteCounts: Record<PolicyOptionId, number> = { A: 0, B: 0, C: 0 };
  sim.members.forEach((m) => {
    const v = m.votedOption ?? "A";
    voteCounts[v] += 1;
  });

  const activeLobbyTargetId =
    otherMembers.find((m) => m.id === lobbyTargetId)?.id ??
    otherMembers[0]?.id ??
    "";
  const activeReshuffleTargetId =
    otherMembers.find((m) => m.id === reshuffleTargetId)?.id ??
    otherMembers[0]?.id ??
    "";

  return (
    <main
      style={{
        minHeight: "100dvh",
        backgroundColor: "#0f172a",
        color: "#ffffff",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "800px" }}>
        {/* HUD RETRO SUPER MARIO */}
        <header
          style={{
            backgroundColor: "#111827",
            border: "3px solid #f59e0b",
            borderRadius: "12px 12px 0 0",
            padding: "8px 12px",
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: "6px",
            fontSize: "11px",
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ color: "#9ca3af", fontSize: "9px" }}>PEJABAT</div>
            <div style={{ fontWeight: 900, color: "#fef08a" }}>
              {player.roleId}
            </div>
          </div>
          <div>
            <div style={{ color: "#9ca3af", fontSize: "9px" }}>KAS APBN</div>
            <div style={{ fontWeight: 900, color: "#fde047" }}>
              Rp {sim.metrics.budgetTrillion}T
            </div>
          </div>
          <div>
            <div style={{ color: "#9ca3af", fontSize: "9px" }}>PUBLIK / DPR</div>
            <div style={{ fontWeight: 900, color: "#86efac" }}>
              {sim.metrics.publicTrust}% / {sim.metrics.dprSupport}%
            </div>
          </div>
          <div>
            <div style={{ color: "#9ca3af", fontSize: "9px" }}>AUDIT / PASAR</div>
            <div style={{ fontWeight: 900, color: "#93c5fd" }}>
              {sim.metrics.auditScore}% / {sim.metrics.economicStability}%
            </div>
          </div>
          <div>
            <div style={{ color: "#9ca3af", fontSize: "9px" }}>WORLD</div>
            <div style={{ fontWeight: 900, color: "#fca5a5" }}>
              {theme.worldCode} (THN {sim.year}/5)
            </div>
          </div>
        </header>

        {/* LAYAR GAME CANVAS MARIO BROS */}
        <div
          style={{
            position: "relative",
            width: "100%",
            borderLeft: "3px solid #f59e0b",
            borderRight: "3px solid #f59e0b",
            backgroundColor: "#3b82f6",
            overflow: "hidden",
          }}
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              imageRendering: "pixelated",
            }}
          />

          {/* Banner Stage Info Singkat */}
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "10px",
              right: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pointerEvents: "none",
              fontSize: "10px",
              fontWeight: 900,
              textShadow: "1px 1px 0 #000",
            }}
          >
            <span
              style={{
                backgroundColor: "rgba(0,0,0,0.55)",
                padding: "3px 8px",
                borderRadius: "6px",
                color: "#fef08a",
              }}
            >
              {theme.stageName}
            </span>
            <span
              style={{
                backgroundColor: "rgba(0,0,0,0.55)",
                padding: "3px 8px",
                borderRadius: "6px",
                color: "#ffffff",
              }}
            >
              TAKTIS: {player.tacticalFund}M
            </span>
          </div>

          {/* POPUP MODAL SAAT MENYUNDUL BLOK SIDANG / SKANDAL / KABINET */}
          {activeModal === "POLICY" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(15, 23, 42, 0.88)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px",
                zIndex: 20,
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "540px",
                  maxHeight: "94%",
                  overflowY: "auto",
                  backgroundColor: "#fefce8",
                  color: "#1c1917",
                  border: "4px solid #f59e0b",
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                <div style={{ fontSize: "10px", fontWeight: 900, color: "#b45309" }}>
                  BLOK SIDANG KABINET • {sim.currentIssue.ministry}
                </div>
                <h2 style={{ fontSize: "14px", fontWeight: 900, margin: "4px 0" }}>
                  {sim.currentIssue.title}
                </h2>
                <p style={{ fontSize: "11px", color: "#44403c", marginBottom: "10px" }}>
                  {sim.currentIssue.context}
                </p>

                <div style={{ display: "grid", gap: "6px" }}>
                  {sim.currentIssue.options.map((opt) => {
                    const selected = player.votedOption === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSim((prev) =>
                            prev ? castPlayerVote(prev, opt.id) : prev
                          );
                          setStageNotice(
                            `Sikap Sidang dipilih: Opsi ${opt.id} (${opt.title}). Lanjut ke bendera Istana!`
                          );
                          setActiveModal("NONE");
                        }}
                        style={{
                          textAlign: "left",
                          padding: "8px 10px",
                          border: "2px solid #1c1917",
                          borderRadius: "8px",
                          backgroundColor: selected ? "#1d4ed8" : "#ffffff",
                          color: selected ? "#ffffff" : "#1c1917",
                          cursor: "pointer",
                          fontFamily: "monospace",
                        }}
                      >
                        <div style={{ fontSize: "11px", fontWeight: 900 }}>
                          {opt.id}. {opt.title} ({voteCounts[opt.id]} suara)
                        </div>
                        <div style={{ fontSize: "10px", opacity: 0.9 }}>
                          {opt.realWorldTradeoff}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeModal === "SCANDAL" && sim.activeScandal && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(127, 29, 29, 0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px",
                zIndex: 20,
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "540px",
                  maxHeight: "94%",
                  overflowY: "auto",
                  backgroundColor: "#fef2f2",
                  color: "#1c1917",
                  border: "4px solid #dc2626",
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                <div style={{ fontSize: "10px", fontWeight: 900, color: "#dc2626" }}>
                  ALERT SKANDAL PUBLIK • {sim.activeScandal.severity}
                </div>
                <h2 style={{ fontSize: "14px", fontWeight: 900, margin: "4px 0" }}>
                  {sim.activeScandal.headline}
                </h2>
                <p style={{ fontSize: "11px", color: "#44403c", marginBottom: "10px" }}>
                  {sim.activeScandal.detail}
                </p>

                <div style={{ display: "grid", gap: "6px" }}>
                  {sim.activeScandal.responses.map((res) => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => {
                        setSim((prev) =>
                          prev ? resolvePublicScandal(prev, res.id) : prev
                        );
                        setStageNotice(
                          `Skandal ditangani dengan: ${res.label}.`
                        );
                        setActiveModal("NONE");
                      }}
                      style={{
                        textAlign: "left",
                        padding: "8px 10px",
                        border: "2px solid #1c1917",
                        borderRadius: "8px",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                        fontFamily: "monospace",
                      }}
                    >
                      <div style={{ fontSize: "11px", fontWeight: 900, color: "#b91c1c" }}>
                        {res.id}. {res.label}
                      </div>
                      <div style={{ fontSize: "10px", color: "#44403c" }}>
                        {res.note}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeModal === "CABINET" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(15, 23, 42, 0.92)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
                zIndex: 25,
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "640px",
                  maxHeight: "95%",
                  overflowY: "auto",
                  backgroundColor: "#f8fafc",
                  color: "#0f172a",
                  border: "4px solid #3b82f6",
                  borderRadius: "12px",
                  padding: "12px",
                  fontSize: "11px",
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
                  <strong>SUSUNAN 8 KABINET, LOBI &amp; RESHUFFLE</strong>
                  <button
                    type="button"
                    onClick={() => setActiveModal("NONE")}
                    style={{
                      padding: "4px 10px",
                      backgroundColor: "#dc2626",
                      color: "#fff",
                      border: "2px solid #0f172a",
                      borderRadius: "6px",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    LANJUT MAIN ✕
                  </button>
                </div>

                {/* Lobi & Reshuffle */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isPresident ? "1fr 1fr" : "1fr",
                    gap: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      border: "2px solid #cbd5e1",
                      borderRadius: "8px",
                      padding: "8px",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <div style={{ fontWeight: 900, marginBottom: "4px" }}>
                      LOBI MENTERI (Saldo: {player.tacticalFund}M)
                    </div>
                    <select
                      value={activeLobbyTargetId}
                      onChange={(e) => setLobbyTargetId(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "5px",
                        marginBottom: "6px",
                        border: "1px solid #94a3b8",
                        borderRadius: "6px",
                      }}
                    >
                      {otherMembers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.roleTitle} (Opsi {m.votedOption ?? "-"})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={player.tacticalFund < 15}
                      onClick={() =>
                        setSim((prev) =>
                          prev ? runLobbyAction(prev, activeLobbyTargetId) : prev
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "6px",
                        backgroundColor: "#1d4ed8",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Kirim Lobi (15M)
                    </button>
                  </div>

                  {isPresident && (
                    <div
                      style={{
                        border: "2px solid #cbd5e1",
                        borderRadius: "8px",
                        padding: "8px",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <div style={{ fontWeight: 900, marginBottom: "4px" }}>
                        RESHUFFLE ({reshuffleUsedThisYear ? "Selesai" : "1x/Thn"})
                      </div>
                      <select
                        value={activeReshuffleTargetId}
                        onChange={(e) => setReshuffleTargetId(e.target.value)}
                        disabled={reshuffleUsedThisYear}
                        style={{
                          width: "100%",
                          padding: "5px",
                          marginBottom: "4px",
                          border: "1px solid #94a3b8",
                          borderRadius: "6px",
                        }}
                      >
                        {otherMembers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.roleTitle} ({ORIGIN_INFO[m.origin].label})
                          </option>
                        ))}
                      </select>
                      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                        {(["TEKNOKRAT", "PARTAI", "PENGUSAHA"] as OriginType[]).map(
                          (orig) => (
                            <button
                              key={orig}
                              type="button"
                              onClick={() => setReshuffleOrigin(orig)}
                              style={{
                                flex: 1,
                                padding: "3px",
                                fontSize: "9px",
                                fontWeight: 900,
                                backgroundColor:
                                  reshuffleOrigin === orig ? "#f59e0b" : "#e2e8f0",
                                border: "1px solid #64748b",
                                borderRadius: "4px",
                              }}
                            >
                              {ORIGIN_INFO[orig].label}
                            </button>
                          )
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={reshuffleUsedThisYear}
                        onClick={() =>
                          setSim((prev) =>
                            prev
                              ? reshuffleMinister(
                                  prev,
                                  activeReshuffleTargetId,
                                  reshuffleOrigin
                                )
                              : prev
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "5px",
                          backgroundColor: "#b45309",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: 900,
                          cursor: "pointer",
                        }}
                      >
                        Tetapkan Reshuffle
                      </button>
                    </div>
                  )}
                </div>

                {/* Daftar 8 Pejabat */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "5px",
                  }}
                >
                  {sim.members.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        padding: "6px 8px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        backgroundColor: m.id === player.id ? "#dbeafe" : "#ffffff",
                      }}
                    >
                      <div style={{ fontWeight: 900 }}>{m.roleTitle}</div>
                      <div style={{ fontSize: "10px", color: "#475569" }}>
                        {ORIGIN_INFO[m.origin].label} • Opsi {m.votedOption ?? "-"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LAYAR TAMAT / GAME OVER */}
          {sim.status === "ENDED" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(15, 23, 42, 0.92)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                zIndex: 30,
              }}
            >
              <div
                style={{
                  maxWidth: "460px",
                  backgroundColor: "#fefce8",
                  color: "#1c1917",
                  border: "4px solid #f59e0b",
                  borderRadius: "14px",
                  padding: "18px",
                  textAlign: "center",
                }}
              >
                <h2 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "8px" }}>
                  AKHIR MASA JABATAN
                </h2>
                <p style={{ fontSize: "12px", lineHeight: 1.5, marginBottom: "14px" }}>
                  {sim.endSummary}
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    padding: "10px 18px",
                    backgroundColor: "#16a34a",
                    color: "#ffffff",
                    border: "3px solid #1c1917",
                    borderRadius: "10px",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  MAIN LAGI DARI TAHUN 1
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CONTROLLER GAMEPAD ALA MARIO BROS (TOUCH + DESKTOP) */}
        <footer
          style={{
            backgroundColor: "#1e293b",
            border: "3px solid #f59e0b",
            borderRadius: "0 0 14px 14px",
            padding: "10px 12px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          {/* D-Pad Kiri / Kanan */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              type="button"
              onPointerDown={() => {
                keysRef.current.left = true;
              }}
              onPointerUp={() => {
                keysRef.current.left = false;
              }}
              onPointerLeave={() => {
                keysRef.current.left = false;
              }}
              aria-label="Jalan Kiri"
              style={{
                width: "54px",
                height: "48px",
                backgroundColor: "#334155",
                color: "#ffffff",
                border: "3px solid #94a3b8",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                touchAction: "none",
              }}
            >
              <ArrowLeft size={22} />
            </button>

            <button
              type="button"
              onPointerDown={() => {
                keysRef.current.right = true;
              }}
              onPointerUp={() => {
                keysRef.current.right = false;
              }}
              onPointerLeave={() => {
                keysRef.current.right = false;
              }}
              aria-label="Jalan Kanan"
              style={{
                width: "54px",
                height: "48px",
                backgroundColor: "#334155",
                color: "#ffffff",
                border: "3px solid #94a3b8",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                touchAction: "none",
              }}
            >
              <ArrowRight size={22} />
            </button>
          </div>

          {/* Tombol Menu Kabinet, Suara, Reset */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <button
              type="button"
              onClick={() =>
                setActiveModal((prev) => (prev === "CABINET" ? "NONE" : "CABINET"))
              }
              style={{
                padding: "10px 12px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "2px solid #93c5fd",
                borderRadius: "10px",
                fontWeight: 900,
                fontSize: "11px",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
              }}
            >
              <Users size={15} /> KABINET
            </button>

            <button
              type="button"
              onClick={() => setSoundOn((prev) => !prev)}
              aria-label="Suara 8-bit"
              style={{
                padding: "10px",
                backgroundColor: "#334155",
                color: "#fde047",
                border: "2px solid #64748b",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset Game"
              style={{
                padding: "10px",
                backgroundColor: "#7f1d1d",
                color: "#fecaca",
                border: "2px solid #f87171",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Tombol Lompat Merah Khas Mario */}
          <button
            type="button"
            onPointerDown={() => {
              keysRef.current.jump = true;
            }}
            onPointerUp={() => {
              keysRef.current.jump = false;
            }}
            onPointerLeave={() => {
              keysRef.current.jump = false;
            }}
            style={{
              padding: "0 20px",
              height: "48px",
              backgroundColor: "#dc2626",
              color: "#fef08a",
              border: "3px solid #fca5a5",
              borderRadius: "999px",
              fontWeight: 900,
              fontSize: "13px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              touchAction: "none",
              boxShadow: "0 4px 0 #7f1d1d",
            }}
          >
            <ArrowUp size={18} /> LOMPAT
          </button>
        </footer>

        {/* Ticker Berita Bawah */}
        {stageNotice && (
          <div
            style={{
              marginTop: "8px",
              padding: "8px 12px",
              backgroundColor: "#111827",
              border: "2px solid #334155",
              borderRadius: "8px",
              fontSize: "11px",
              color: "#e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Shield size={14} color="#f59e0b" />
            <span>{stageNotice}</span>
          </div>
        )}
      </div>
    </main>
  );
};
