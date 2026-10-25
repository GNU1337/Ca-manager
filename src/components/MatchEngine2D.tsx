import React, { useEffect, useRef, useState } from 'react';
import { GameState, MapName, MatchState, MatchRoundLog, Player, BuyStrategy, TacticStrategy } from '../types/game';
import { soundFx } from '../utils/audio';
import { Play, Pause, FastForward, Shield, Crosshair, Zap, RotateCcw, Award, Flame, Target } from 'lucide-react';

interface MatchEngine2DProps {
  userTeam: GameState['roster'];
  opponentTeam: Player[];
  opponentName: string;
  opponentTag: string;
  mapName?: MapName;
  prizeMoney: number;
  onMatchComplete: (winnerIsUser: boolean, scoreUser: number, scoreOpponent: number, earnings: number) => void;
  onExit: () => void;
}

interface Agent2D {
  id: string;
  name: string;
  nickname: string;
  team: 'CT' | 'T';
  isUser: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  hp: number;
  maxHp: number;
  weapon: 'Pistol' | 'SMG' | 'Rifle' | 'AWP';
  isAlive: boolean;
  angle: number;
  accuracy: number;
  reflexes: number;
  role: string;
  mentality: 'Aggressive' | 'Balanced' | 'Defensive';
  kills: number;
  deaths: number;
  isBombCarrier?: boolean;
  plantProgress?: number; // 0 to 100
  defuseProgress?: number; // 0 to 100
}

interface Bullet {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  isHeadshot?: boolean;
}

interface SmokeEffect {
  x: number;
  y: number;
  radius: number;
  timer: number;
}

export const MatchEngine2D: React.FC<MatchEngine2DProps> = ({
  userTeam,
  opponentTeam,
  opponentName,
  opponentTag,
  mapName = 'de_dust',
  prizeMoney,
  onMatchComplete,
  onExit
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Match State
  const [scoreUser, setScoreUser] = useState(0);
  const [scoreOpponent, setScoreOpponent] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundTime, setRoundTime] = useState(115); // 1:55 round time
  const [isPaused, setIsPaused] = useState(false);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 5>(1);

  // Pre-round Tactical Pause & Auto-Play States (Requirement 1)
  const [isFreezeTime, setIsFreezeTime] = useState(true);
  const [autoPlayRounds, setAutoPlayRounds] = useState(false);
  const [roundEndBanner, setRoundEndBanner] = useState<{ text: string; won: boolean } | null>(null);
  const isTransitioningRoundRef = useRef(false);

  // CS Economy State
  const [userMoney, setUserMoney] = useState(800);
  const [oppMoney, setOppMoney] = useState(800);
  const [userLossStreak, setUserLossStreak] = useState(0);
  const [oppLossStreak, setOppLossStreak] = useState(0);

  // Tactical Directives
  const [userBuyStrategy, setUserBuyStrategy] = useState<BuyStrategy>('Auto');
  const [userTactic, setUserTactic] = useState<TacticStrategy>('Default');

  // de_dust C4 Objective State
  const [bombState, setBombState] = useState<'none' | 'planting' | 'planted' | 'defusing' | 'exploded' | 'defused'>('none');
  const [bombTimer, setBombTimer] = useState(40);
  const [bombPos, setBombPos] = useState<{ x: number; y: number; site: 'A' | 'B' } | null>(null);
  const [droppedBombPos, setDroppedBombPos] = useState<{ x: number; y: number } | null>(null);
  const [activeObjectiveText, setActiveObjectiveText] = useState<string>('Ts pushing objectives via Bridge & Underpass');

  // Round logs & Killfeed
  const [killfeed, setKillfeed] = useState<{ id: string; text: string; isHeadshot?: boolean }[]>([]);

  // 2D Simulation Entities
  const agentsRef = useRef<Agent2D[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const smokesRef = useRef<SmokeEffect[]>([]);

  // Authentic original CS "de_dust" map geometry (800x480 coordinate space)
  const mapGeometry = {
    mapTitle: 'de_dust (Counter-Strike Original)',
    tSpawn: { x: 120, y: 410, label: 'T SPAWN' },
    ctSpawn: { x: 720, y: 70, label: 'CT SPAWN' },
    siteA: { x: 670, y: 130, label: 'BOMSITE A' },
    siteB: { x: 160, y: 130, label: 'BOMSITE B' },
    midCourtyard: { x: 440, y: 260, label: 'MID COURTYARD' },
    tUpperRamp: { x: 260, y: 360 },
    bridgeStart: { x: 330, y: 340 },
    bridgeEnd: { x: 570, y: 220 },
    underpassEntry: { x: 140, y: 290 },
    underpassExit: { x: 160, y: 160 },
    ctStairs: { x: 600, y: 160 },
    // Map Obstacles & Sandstone structures
    obstacles: [
      // Site A Crates
      { x: 650, y: 110, w: 35, h: 35, label: 'A Box' },
      { x: 690, y: 140, w: 30, h: 30, label: 'A Box 2' },
      // Site B Pillars & Sandbags
      { x: 130, y: 110, w: 25, h: 25, label: 'Pillar' },
      { x: 190, y: 135, w: 25, h: 25, label: 'Pillar' },
      // Mid Courtyard Sandbags
      { x: 420, y: 250, w: 45, h: 20, label: 'Sandbags' },
      // Underpass Walls
      { x: 100, y: 200, w: 20, h: 100, label: 'Tunnel Wall' },
      // Bridge Stone Walls
      { x: 330, y: 310, w: 10, h: 40, label: 'Bridge Arch' },
      { x: 560, y: 230, w: 10, h: 40, label: 'Bridge Arch' }
    ]
  };

  // Setup Agents & Objectives at Round Start
  const initRound = (uScore: number, oScore: number, roundNum: number) => {
    isTransitioningRoundRef.current = false;
    setRoundEndBanner(null);

    // User is CT on first half (Rounds 1-12), T on second half (Rounds 13-24)
    const userIsCT = roundNum <= 12;

    const newAgents: Agent2D[] = [];

    // User Agents
    userTeam.slice(0, 5).forEach((p, idx) => {
      const spawn = userIsCT ? mapGeometry.ctSpawn : mapGeometry.tSpawn;
      const offsetX = (idx - 2) * 32;
      newAgents.push({
        id: p.id,
        name: p.name,
        nickname: p.nickname,
        team: userIsCT ? 'CT' : 'T',
        isUser: true,
        x: spawn.x + offsetX,
        y: spawn.y,
        vx: 0,
        vy: 0,
        targetX: spawn.x + offsetX,
        targetY: spawn.y,
        hp: 100,
        maxHp: 100,
        weapon: p.skills.accuracy > 84 ? 'AWP' : 'Rifle',
        isAlive: true,
        angle: userIsCT ? Math.PI / 2 : -Math.PI / 2,
        accuracy: p.skills.accuracy,
        reflexes: p.skills.reflexes,
        role: p.role,
        mentality: p.mentality || 'Balanced',
        kills: 0,
        deaths: 0,
        plantProgress: 0,
        defuseProgress: 0
      });
    });

    // Opponent Agents
    opponentTeam.slice(0, 5).forEach((p, idx) => {
      const spawn = userIsCT ? mapGeometry.tSpawn : mapGeometry.ctSpawn;
      const offsetX = (idx - 2) * 32;
      newAgents.push({
        id: p.id,
        name: p.name,
        nickname: p.nickname,
        team: userIsCT ? 'T' : 'CT',
        isUser: false,
        x: spawn.x + offsetX,
        y: spawn.y,
        vx: 0,
        vy: 0,
        targetX: spawn.x + offsetX,
        targetY: spawn.y,
        hp: 100,
        maxHp: 100,
        weapon: p.skills.accuracy > 85 ? 'AWP' : 'Rifle',
        isAlive: true,
        angle: userIsCT ? -Math.PI / 2 : Math.PI / 2,
        accuracy: p.skills.accuracy,
        reflexes: p.skills.reflexes,
        role: p.role,
        mentality: p.mentality || 'Balanced',
        kills: 0,
        deaths: 0,
        plantProgress: 0,
        defuseProgress: 0
      });
    });

    // Assign Bomb Carrier to a random Terrorist
    const tAgents = newAgents.filter(a => a.team === 'T');
    if (tAgents.length > 0) {
      const carrierIndex = Math.floor(Math.random() * tAgents.length);
      tAgents[carrierIndex].isBombCarrier = true;
    }

    agentsRef.current = newAgents;
    bulletsRef.current = [];
    smokesRef.current = [];
    setBombState('none');
    setBombTimer(40);
    setBombPos(null);
    setDroppedBombPos(null);
    setRoundTime(115);
    setActiveObjectiveText(
      userIsCT
        ? 'CT Defense: Guard Bombsites A (Bridge) & B (Underpass)'
        : 'T Assault: Execute push towards Bombsite A or B'
    );

    // If auto-play is OFF, pause in Freeze Time for manager calls
    setIsFreezeTime(!autoPlayRounds);
  };

  useEffect(() => {
    initRound(scoreUser, scoreOpponent, currentRound);
  }, []);

  const handleStartRound = () => {
    soundFx.playClick();
    setIsFreezeTime(false);
  };

  const handleToggleAutoPlay = () => {
    soundFx.playClick();
    setAutoPlayRounds(prev => {
      const nextVal = !prev;
      if (nextVal && isFreezeTime) {
        setIsFreezeTime(false);
      }
      return nextVal;
    });
  };

  // Main 2D Canvas Game Loop
  useEffect(() => {
    let animId: number;

    const updateAndDraw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas with Sandy de_dust Theme
      ctx.fillStyle = '#18140f';
      ctx.fillRect(0, 0, width, height);

      // Draw Tactical Radar Grid
      ctx.strokeStyle = '#261f18';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Classic de_dust Features: Underpass Tunnel
      ctx.fillStyle = '#120e0b';
      ctx.fillRect(115, 140, 70, 160);
      ctx.strokeStyle = '#3d3023';
      ctx.strokeRect(115, 140, 70, 160);
      ctx.fillStyle = '#8b7355';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('UNDERPASS TUNNEL', 105, 230);

      // Draw Classic de_dust Features: The Stone Arch Bridge
      ctx.fillStyle = '#2d2319';
      ctx.fillRect(320, 260, 250, 40);
      ctx.strokeStyle = '#d29922';
      ctx.lineWidth = 2;
      ctx.strokeRect(320, 260, 250, 40);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('THE OVERPASS BRIDGE', 370, 285);

      // Draw Bombsite A (Top Right Plaza)
      ctx.fillStyle = 'rgba(217, 119, 6, 0.2)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(mapGeometry.siteA.x, mapGeometry.siteA.y, 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('SITE A', mapGeometry.siteA.x - 20, mapGeometry.siteA.y + 4);

      // Draw Bombsite B (Underpass Exit)
      ctx.fillStyle = 'rgba(217, 119, 6, 0.2)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(mapGeometry.siteB.x, mapGeometry.siteB.y, 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('SITE B', mapGeometry.siteB.x - 20, mapGeometry.siteB.y + 4);

      // Draw Obstacles (Wooden Crates & Sandbags)
      mapGeometry.obstacles.forEach(obs => {
        ctx.fillStyle = '#362a1e';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.strokeStyle = '#6b543e';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
      });

      // Draw Spawns
      // CT Spawn (Top Right)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
      ctx.fillRect(mapGeometry.ctSpawn.x - 60, mapGeometry.ctSpawn.y - 25, 120, 40);
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('CT SPAWN', mapGeometry.ctSpawn.x - 25, mapGeometry.ctSpawn.y - 3);

      // T Spawn (Bottom Left)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.fillRect(mapGeometry.tSpawn.x - 60, mapGeometry.tSpawn.y - 20, 120, 40);
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('T SPAWN', mapGeometry.tSpawn.x - 20, mapGeometry.tSpawn.y + 5);

      // Draw Dropped C4 (If carrier died)
      if (droppedBombPos && bombState === 'none') {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(droppedBombPos.x, droppedBombPos.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('C4', droppedBombPos.x - 5, droppedBombPos.y + 3);
      }

      // Draw Planted C4 with Pulse
      if (bombPos && (bombState === 'planted' || bombState === 'defusing')) {
        const pulse = (Date.now() % 1000) / 1000;
        ctx.fillStyle = `rgba(248, 81, 73, ${0.3 + pulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(bombPos.x, bombPos.y, 16 + pulse * 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f85149';
        ctx.beginPath();
        ctx.arc(bombPos.x, bombPos.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('C4', bombPos.x - 6, bombPos.y + 3);
      }

      // Update & Render 2D Simulation
      if (!isPaused) {
        const speedMultiplier = simSpeed;

        // Round Objective AI Logic on de_dust
        agentsRef.current.forEach(agent => {
          if (!agent.isAlive) return;

          // Calculate agent movement factor based on mentality
          const mentalitySpeedFactor = agent.mentality === 'Aggressive' ? 1.4 : agent.mentality === 'Defensive' ? 0.9 : 1.15;
          const moveStep = 1.1 * speedMultiplier * mentalitySpeedFactor;

          if (agent.team === 'T') {
            // Terrorist Movement & Objective Pursuit
            if (agent.isBombCarrier) {
              // Carrier objective choice: Site A (Bridge) or Site B (Underpass)
              const targetSite = userTactic === 'Rush A' ? mapGeometry.siteA : userTactic === 'Split B' ? mapGeometry.siteB : mapGeometry.siteA;
              const distToSite = Math.hypot(targetSite.x - agent.x, targetSite.y - agent.y);

              if (distToSite > 35) {
                // Waypoint Pathing for de_dust
                let wayX = targetSite.x;
                let wayY = targetSite.y;

                if (userTactic === 'Rush A' && agent.y > 280) {
                  // Follow Overpass Bridge path
                  wayX = mapGeometry.bridgeStart.x;
                  wayY = mapGeometry.bridgeStart.y;
                } else if (userTactic === 'Split B' && agent.y > 200) {
                  // Follow Underpass Tunnel path
                  wayX = mapGeometry.underpassEntry.x;
                  wayY = mapGeometry.underpassEntry.y;
                }

                const angle = Math.atan2(wayY - agent.y, wayX - agent.x);
                agent.angle = angle;
                agent.x += Math.cos(angle) * moveStep;
                agent.y += Math.sin(angle) * moveStep;
              } else if (bombState === 'none') {
                // Carrier reached site -> Start Planting C4!
                setBombState('planting');
                agent.plantProgress = (agent.plantProgress || 0) + 2.5 * speedMultiplier;

                if (agent.plantProgress >= 100) {
                  setBombState('planted');
                  setBombPos({ x: agent.x, y: agent.y, site: userTactic === 'Rush A' ? 'A' : 'B' });
                  soundFx.playBombBeep();
                  setKillfeed(prev => [{ id: Math.random().toString(), text: `💣 C4 Planted at Site ${userTactic === 'Rush A' ? 'A' : 'B'}!` }, ...prev]);
                  setActiveObjectiveText(`C4 armed at Site ${userTactic === 'Rush A' ? 'A' : 'B'}! Ts defending bomb site!`);
                }
              }
            } else if (droppedBombPos && bombState === 'none') {
              // Retrieve dropped C4
              const distToDrop = Math.hypot(droppedBombPos.x - agent.x, droppedBombPos.y - agent.y);
              if (distToDrop < 20) {
                agent.isBombCarrier = true;
                setDroppedBombPos(null);
                setKillfeed(prev => [{ id: Math.random().toString(), text: `🎒 ${agent.nickname} picked up dropped C4!` }, ...prev]);
              } else {
                const angle = Math.atan2(droppedBombPos.y - agent.y, droppedBombPos.x - agent.x);
                agent.angle = angle;
                agent.x += Math.cos(angle) * (moveStep * 1.1);
                agent.y += Math.sin(angle) * (moveStep * 1.1);
              }
            } else {
              // T Support Agent: Escort Carrier or Hold Angles
              const targetSite = userTactic === 'Rush A' ? mapGeometry.siteA : mapGeometry.siteB;
              const distToSite = Math.hypot(targetSite.x - agent.x, targetSite.y - agent.y);
              if (distToSite > 45) {
                const angle = Math.atan2(targetSite.y - agent.y, targetSite.x - agent.x);
                agent.angle = angle;
                agent.x += Math.cos(angle) * moveStep;
                agent.y += Math.sin(angle) * moveStep;
              }
            }
          } else {
            // CT Movement & Objective Defense / Retake
            let targetPos = mapGeometry.siteA;
            if (bombPos) {
              // Retake planted site
              targetPos = bombPos;
            } else {
              // Standard defense split on de_dust
              targetPos = agent.id.endsWith('1') || agent.id.endsWith('2') ? mapGeometry.siteA : mapGeometry.siteB;
            }

            const dist = Math.hypot(targetPos.x - agent.x, targetPos.y - agent.y);
            if (dist > 30) {
              const angle = Math.atan2(targetPos.y - agent.y, targetPos.x - agent.x);
              agent.angle = angle;
              agent.x += Math.cos(angle) * moveStep;
              agent.y += Math.sin(angle) * moveStep;
            } else if (bombPos && (bombState === 'planted' || bombState === 'defusing')) {
              // Defusing C4
              setBombState('defusing');
              agent.defuseProgress = (agent.defuseProgress || 0) + 1.8 * speedMultiplier;

              if (agent.defuseProgress >= 100) {
                setBombState('defused');
                soundFx.playRoundWin();
                setKillfeed(prev => [{ id: Math.random().toString(), text: `✂️ C4 DEFUSED! CT WINS THE ROUND!` }, ...prev]);
              }
            }
          }

          // Firefight Line of Sight & Engagement
          agentsRef.current.forEach(enemy => {
            if (!enemy.isAlive || enemy.team === agent.team) return;

            const enemyDist = Math.hypot(enemy.x - agent.x, enemy.y - agent.y);
            const engagementRange = agent.mentality === 'Aggressive' ? 260 : 230;
            if (enemyDist < engagementRange) {
              // Face enemy
              agent.angle = Math.atan2(enemy.y - agent.y, enemy.x - agent.x);

              const shootChance = agent.mentality === 'Aggressive' ? 0.065 : 0.045;
              if (Math.random() < shootChance * speedMultiplier) {
                const effectiveAccuracy = agent.mentality === 'Defensive' ? Math.min(99, agent.accuracy * 1.15) : agent.accuracy;
                // Shoot tracer
                bulletsRef.current.push({
                  x: agent.x,
                  y: agent.y,
                  targetX: enemy.x,
                  targetY: enemy.y,
                  progress: 0,
                  isHeadshot: Math.random() < effectiveAccuracy / 120
                });

                soundFx.playGunshot(agent.weapon);

                const isHeadshot = Math.random() < effectiveAccuracy / 125;
                const damage = isHeadshot ? 100 : Math.floor(Math.random() * 35) + 18;
                enemy.hp -= damage;

                if (isHeadshot) soundFx.playHeadshot();

                if (enemy.hp <= 0) {
                  enemy.isAlive = false;
                  agent.kills += 1;
                  enemy.deaths += 1;

                  // Handle Carrier Death / Bomb Drop
                  if (enemy.isBombCarrier) {
                    enemy.isBombCarrier = false;
                    setDroppedBombPos({ x: enemy.x, y: enemy.y });
                    setKillfeed(prev => [{ id: Math.random().toString(), text: `⚠️ C4 Carrier ${enemy.nickname} eliminated! Bomb dropped!` }, ...prev]);
                  }

                  setKillfeed(prev => [
                    {
                      id: Math.random().toString(),
                      text: `${agent.nickname} [${agent.weapon}] ${enemy.nickname}`,
                      isHeadshot
                    },
                    ...prev.slice(0, 5)
                  ]);
                }
              }
            }
          });
        });

        // Update Bullets
        bulletsRef.current.forEach(bullet => {
          bullet.progress += 0.22 * simSpeed;
        });
        bulletsRef.current = bulletsRef.current.filter(b => b.progress < 1);
      }

      // Draw Bullet Tracers
      bulletsRef.current.forEach(bullet => {
        ctx.strokeStyle = bullet.isHeadshot ? '#facc15' : '#ffffff';
        ctx.lineWidth = bullet.isHeadshot ? 2 : 1;
        ctx.beginPath();
        const currX = bullet.x + (bullet.targetX - bullet.x) * bullet.progress;
        const currY = bullet.y + (bullet.targetY - bullet.y) * bullet.progress;
        ctx.moveTo(currX, currY);
        ctx.lineTo(currX + (bullet.targetX - bullet.x) * 0.12, currY + (bullet.targetY - bullet.y) * 0.12);
        ctx.stroke();
      });

      // Draw Agents & Status Markers
      agentsRef.current.forEach(agent => {
        if (!agent.isAlive) return;

        const color = agent.team === 'CT' ? '#3b82f6' : '#ef4444';

        // Sight cone
        ctx.fillStyle = agent.team === 'CT' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)';
        ctx.beginPath();
        ctx.moveTo(agent.x, agent.y);
        ctx.arc(agent.x, agent.y, 90, agent.angle - Math.PI / 6, agent.angle + Math.PI / 6);
        ctx.closePath();
        ctx.fill();

        // Agent body
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Carrier Bomb Badge
        if (agent.isBombCarrier) {
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(agent.x, agent.y - 14, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#000000';
          ctx.stroke();
        }

        // HP bar
        ctx.fillStyle = '#000000';
        ctx.fillRect(agent.x - 12, agent.y - 20, 24, 4);
        ctx.fillStyle = agent.hp > 50 ? '#238636' : agent.hp > 25 ? '#d29922' : '#f85149';
        ctx.fillRect(agent.x - 12, agent.y - 20, (agent.hp / agent.maxHp) * 24, 4);

        // Nickname
        ctx.fillStyle = '#ffffff';
        ctx.font = '9px monospace';
        ctx.fillText(agent.nickname, agent.x - 14, agent.y + 20);
      });

      // Render Tactical Freeze Time Planning Lines & Overlay
      if (isFreezeTime) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(0, 0, width, height);

        // Draw planned tactical strategy arrows
        ctx.save();
        ctx.setLineDash([8, 6]);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#3fb950';

        const userIsCT = currentRound <= 12;
        if (!userIsCT) {
          // T Route Preview
          ctx.beginPath();
          ctx.moveTo(mapGeometry.tSpawn.x, mapGeometry.tSpawn.y);
          if (userTactic === 'Rush A') {
            ctx.lineTo(mapGeometry.bridgeStart.x, mapGeometry.bridgeStart.y);
            ctx.lineTo(mapGeometry.bridgeEnd.x, mapGeometry.bridgeEnd.y);
            ctx.lineTo(mapGeometry.siteA.x, mapGeometry.siteA.y);
          } else if (userTactic === 'Split B') {
            ctx.lineTo(mapGeometry.underpassEntry.x, mapGeometry.underpassEntry.y);
            ctx.lineTo(mapGeometry.underpassExit.x, mapGeometry.underpassExit.y);
            ctx.lineTo(mapGeometry.siteB.x, mapGeometry.siteB.y);
          } else if (userTactic === 'Mid Control') {
            ctx.lineTo(mapGeometry.midCourtyard.x, mapGeometry.midCourtyard.y);
          } else {
            ctx.lineTo(mapGeometry.midCourtyard.x, mapGeometry.midCourtyard.y);
          }
          ctx.stroke();
        } else {
          // CT Defense Line Preview
          ctx.beginPath();
          ctx.moveTo(mapGeometry.ctSpawn.x, mapGeometry.ctSpawn.y);
          ctx.lineTo(mapGeometry.siteA.x, mapGeometry.siteA.y);
          ctx.moveTo(mapGeometry.ctSpawn.x, mapGeometry.ctSpawn.y);
          ctx.lineTo(mapGeometry.siteB.x, mapGeometry.siteB.y);
          ctx.stroke();
        }
        ctx.restore();

        // Overlay Banner on Canvas
        ctx.fillStyle = 'rgba(13, 17, 23, 0.9)';
        ctx.strokeStyle = '#d29922';
        ctx.lineWidth = 2;
        ctx.fillRect(width / 2 - 220, 20, 440, 56);
        ctx.strokeRect(width / 2 - 220, 20, 440, 56);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`🛡️ FREEZE TIME — ROUND ${currentRound} TACTICAL BRIEFING`, width / 2, 42);

        ctx.fillStyle = '#8b949e';
        ctx.font = '10px monospace';
        ctx.fillText('Select Buy & Playstyle -> Click [START ROUND] or Toggle [AUTO-PLAY]', width / 2, 60);
        ctx.textAlign = 'left';
      }

      // Round End Condition Evaluation
      const ctAlive = agentsRef.current.filter(a => a.team === 'CT' && a.isAlive).length;
      const tAlive = agentsRef.current.filter(a => a.team === 'T' && a.isAlive).length;

      if (!isPaused && !isFreezeTime && !isTransitioningRoundRef.current) {
        if (ctAlive === 0 || tAlive === 0 || roundTime <= 0 || bombState === 'defused') {
          isTransitioningRoundRef.current = true;

          let roundWinner: 'CT' | 'T' = ctAlive > 0 ? 'CT' : 'T';
          let winReason = 'Elimination';
          if (bombState === 'planted' && tAlive > 0) {
            roundWinner = 'T';
            winReason = 'Bomb Exploded';
          }
          if (bombState === 'defused') {
            roundWinner = 'CT';
            winReason = 'Bomb Defused';
          }
          if (roundTime <= 0 && bombState === 'none') {
            roundWinner = 'CT';
            winReason = 'Time Expired';
          }

          const userIsCT = currentRound <= 12;
          const userWon = (userIsCT && roundWinner === 'CT') || (!userIsCT && roundWinner === 'T');

          setRoundEndBanner({
            text: `${userWon ? 'ROUND WON' : 'ROUND LOST'} — ${winReason.toUpperCase()}`,
            won: userWon
          });

          if (userWon) {
            soundFx.playRoundWin();
            setScoreUser(prev => prev + 1);
            setUserMoney(prev => Math.min(16000, prev + 3250));
            setOppMoney(prev => Math.min(16000, prev + 1400 + oppLossStreak * 500));
            setOppLossStreak(prev => Math.min(4, prev + 1));
            setUserLossStreak(0);
          } else {
            soundFx.playRoundLoss();
            setScoreOpponent(prev => prev + 1);
            setOppMoney(prev => Math.min(16000, prev + 3250));
            setUserMoney(prev => Math.min(16000, prev + 1400 + userLossStreak * 500));
            setUserLossStreak(prev => Math.min(4, prev + 1));
            setOppLossStreak(0);
          }

          const nextRound = currentRound + 1;
          const nextScoreU = userWon ? scoreUser + 1 : scoreUser;
          const nextScoreO = userWon ? scoreOpponent : scoreOpponent + 1;

          // Short dramatic pause before advancing or showing next round freeze time
          setTimeout(() => {
            if (nextScoreU >= 13 || nextScoreO >= 13 || nextRound > 24) {
              const winnerIsUser = nextScoreU > nextScoreO;
              onMatchComplete(winnerIsUser, nextScoreU, nextScoreO, winnerIsUser ? prizeMoney : Math.round(prizeMoney * 0.25));
            } else {
              setCurrentRound(nextRound);
              initRound(nextScoreU, nextScoreO, nextRound);
            }
          }, 1400 / simSpeed);
        }
      }

      animId = requestAnimationFrame(updateAndDraw);
    };

    animId = requestAnimationFrame(updateAndDraw);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, isFreezeTime, simSpeed, bombState, bombPos, droppedBombPos, currentRound, scoreUser, scoreOpponent, userTactic, autoPlayRounds]);

  // Round Timer Countdown
  useEffect(() => {
    if (isPaused || isFreezeTime) return;
    const interval = setInterval(() => {
      setRoundTime(prev => Math.max(0, prev - 1));
    }, 1000 / simSpeed);
    return () => clearInterval(interval);
  }, [isPaused, isFreezeTime, simSpeed]);

  return (
    <div className="fixed inset-0 bg-[#0d1117] text-white flex flex-col z-50 select-none overflow-hidden font-mono">
      {/* Top CS Scoreboard Bar (Tablet Friendly touch layout) */}
      <div className="h-16 sm:h-20 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-3 sm:px-6 shrink-0">
        {/* User Team */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 bg-[#238636] font-black text-sm sm:text-lg flex items-center justify-center rounded-lg shadow-md">
            VG
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase text-white tracking-wider">Vortex Gaming</h3>
            <span className="text-xs text-[#238636] font-bold">${userMoney.toLocaleString()}</span>
          </div>
          <span className="text-2xl sm:text-4xl font-black text-[#238636] ml-2 sm:ml-4">{scoreUser}</span>
        </div>

        {/* Round Timer & Map Objective Badge */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-[#8b949e] uppercase tracking-widest font-bold">ROUND {currentRound} / 24</span>
          <div className="text-xl sm:text-3xl font-black text-amber-400">
            {Math.floor(roundTime / 60)}:{(roundTime % 60).toString().padStart(2, '0')}
          </div>
          <span className="text-[9px] sm:text-[10px] text-amber-300 uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded mt-0.5">
            de_dust (CS Classic)
          </span>
        </div>

        {/* Opponent Team */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-2xl sm:text-4xl font-black text-[#f85149] mr-2 sm:mr-4">{scoreOpponent}</span>
          <div className="text-right">
            <h3 className="text-xs sm:text-sm font-black uppercase text-white tracking-wider">{opponentName}</h3>
            <span className="text-xs text-[#f85149] font-bold">${oppMoney.toLocaleString()}</span>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 bg-[#f85149] font-black text-sm sm:text-lg flex items-center justify-center rounded-lg shadow-md">
            {opponentTag}
          </div>
        </div>
      </div>

      {/* Main 2D Canvas & Tablet Tactical Controls Container */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        {/* Canvas Radar View */}
        <div className="flex-1 bg-[#120e0b] relative flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={800}
            height={480}
            className="w-full max-w-[800px] aspect-[5/3] bg-[#18140f] border-2 border-[#3d3023] rounded-lg shadow-2xl object-contain max-h-[60vh] md:max-h-[75vh]"
          />

          {/* Objective Banner */}
          <div className="absolute top-4 left-4 right-4 md:right-72 pointer-events-none flex justify-center z-10">
            <div className="bg-black/85 border border-amber-500/40 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-bold text-amber-300 flex items-center gap-2 shadow-xl backdrop-blur-md">
              <Target className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{isFreezeTime ? `ROUND ${currentRound} FREEZE TIME — Set tactics and press Start Round` : activeObjectiveText}</span>
            </div>
          </div>

          {/* Round End Result Banner Overlay */}
          {roundEndBanner && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div
                className={`px-6 py-4 rounded-xl border-2 shadow-2xl backdrop-blur-md text-center transform scale-110 animate-bounce ${
                  roundEndBanner.won
                    ? 'bg-[#161b22]/95 border-[#238636] text-[#3fb950] shadow-[0_0_30px_rgba(35,134,54,0.6)]'
                    : 'bg-[#161b22]/95 border-[#f85149] text-[#f85149] shadow-[0_0_30px_rgba(248,81,73,0.6)]'
                }`}
              >
                <span className="text-xl sm:text-2xl font-black uppercase tracking-wider block font-mono">
                  {roundEndBanner.won ? '🏆 ' : '💀 '}
                  {roundEndBanner.text}
                </span>
                <span className="text-xs text-white/80 font-mono mt-1 block">Preparing next tactical phase...</span>
              </div>
            </div>
          )}

          {/* Floating Killfeed */}
          <div className="absolute bottom-4 right-4 w-56 sm:w-64 space-y-1.5 pointer-events-none">
            {killfeed.map(item => (
              <div
                key={item.id}
                className="bg-black/90 border-l-4 border-[#f85149] px-2.5 py-1.5 rounded text-[10px] sm:text-xs font-mono text-white flex justify-between items-center shadow-lg"
              >
                <span>{item.text}</span>
                {item.isHeadshot && <span className="text-amber-400 font-bold">🎯 HS</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Manager Tactical Control Panel (Tablet & Touch Optimized) */}
        <div className="w-full md:w-80 bg-[#161b22] border-t md:border-t-0 md:border-l border-[#30363d] p-3 sm:p-5 flex flex-col justify-between gap-3 shrink-0 overflow-y-auto">
          <div>
            {/* Requirement 1: Freeze Time Tactical Launcher & Auto-Play Button */}
            <div className="mb-3 p-3 rounded-lg border bg-[#0d1117] border-[#30363d] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-[#8b949e] flex items-center gap-1.5">
                  <Zap className={`w-3.5 h-3.5 ${isFreezeTime ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
                  {isFreezeTime ? 'Pre-Round Freeze' : 'Combat Phase'}
                </span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                    isFreezeTime ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {isFreezeTime ? 'Paused for calls' : 'Live Combat'}
                </span>
              </div>

              {isFreezeTime ? (
                <button
                  onClick={handleStartRound}
                  className="w-full min-h-[46px] py-2.5 px-4 bg-[#238636] hover:bg-[#2ea043] text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-[0_0_15px_rgba(35,134,54,0.5)] cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all mb-2"
                >
                  <Play className="w-4 h-4 fill-white" /> Start Round (Live Combat)
                </button>
              ) : (
                <div className="text-[11px] text-emerald-400 font-mono font-bold mb-2 flex items-center justify-center gap-2 py-1.5 bg-emerald-950/40 border border-emerald-500/30 rounded">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Round {currentRound} Live
                </div>
              )}

              {/* Auto-Play Rounds Toggle Button */}
              <button
                onClick={handleToggleAutoPlay}
                className={`w-full min-h-[40px] py-2 px-3 text-xs font-mono font-bold uppercase rounded-md border cursor-pointer active:scale-95 transition-all flex items-center justify-between ${
                  autoPlayRounds
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/60 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                    : 'bg-[#21262d] text-[#8b949e] border-[#30363d] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <FastForward className="w-3.5 h-3.5 text-blue-400" />
                  Auto-Play (Skip Freeze):
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${autoPlayRounds ? 'bg-blue-500 text-white' : 'bg-black/40 text-gray-400'}`}>
                  {autoPlayRounds ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            <h3 className="text-xs font-black uppercase tracking-widest text-[#8b949e] border-b border-[#30363d] pb-2 mb-3 flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-[#238636]" /> Tactical Directives
            </h3>

            {/* Tactical Strategy Options */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-[#8b949e] uppercase font-bold block mb-1.5">Buy Economy Strategy</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Auto', 'Eco', 'Force Buy', 'Full Buy'] as BuyStrategy[]).map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        soundFx.playClick();
                        setUserBuyStrategy(st);
                      }}
                      className={`min-h-[44px] py-2 px-3 rounded-lg text-xs font-bold uppercase border cursor-pointer active:scale-95 transition-all flex items-center justify-center ${
                        userBuyStrategy === st
                          ? 'bg-[#238636] border-[#3fb950] text-white shadow-[0_0_10px_rgba(35,134,54,0.4)]'
                          : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#8b949e] uppercase font-bold block mb-1.5">de_dust Objective Callout</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'Rush A', label: 'Overpass Bridge Push (Site A)' },
                    { id: 'Split B', label: 'Underpass Tunnel Split (Site B)' },
                    { id: 'Mid Control', label: 'Mid Courtyard Flank' },
                    { id: 'Slow Execute', label: 'Slow Contact & Defend' }
                  ].map(tac => (
                    <button
                      key={tac.id}
                      onClick={() => {
                        soundFx.playClick();
                        setUserTactic(tac.id as TacticStrategy);
                      }}
                      className={`min-h-[44px] py-2.5 px-3 rounded-lg text-xs font-bold uppercase border cursor-pointer active:scale-95 transition-all text-left flex items-center justify-between ${
                        userTactic === tac.id
                          ? 'bg-[#238636] border-[#3fb950] text-white shadow-[0_0_10px_rgba(35,134,54,0.4)]'
                          : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:text-white'
                      }`}
                    >
                      <span>{tac.label}</span>
                      {userTactic === tac.id && <span className="text-amber-400 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Speed & Match Pause Controls (Spacious Touch Buttons) */}
          <div className="space-y-2 border-t border-[#30363d] pt-3">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsPaused(!isPaused);
                }}
                className="flex-1 min-h-[44px] py-2.5 bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-bold uppercase rounded-lg border border-[#30363d] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                {isPaused ? <Play className="w-4 h-4 text-[#238636]" /> : <Pause className="w-4 h-4 text-amber-400" />}
                {isPaused ? 'Resume Match' : 'Pause Match'}
              </button>

              <div className="flex gap-1.5">
                {([1, 2, 5] as (1 | 2 | 5)[]).map(spd => (
                  <button
                    key={spd}
                    onClick={() => {
                      soundFx.playClick();
                      setSimSpeed(spd);
                    }}
                    className={`min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-lg border cursor-pointer active:scale-95 transition-all ${
                      simSpeed === spd
                        ? 'bg-[#238636] border-[#3fb950] text-white'
                        : 'bg-[#21262d] border-[#30363d] text-[#8b949e]'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onExit();
              }}
              className="w-full min-h-[44px] py-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs font-bold uppercase rounded-lg border border-red-500/30 cursor-pointer active:scale-95 transition-all"
            >
              Forfeit / Exit Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
