import React, { useEffect, useRef, useState } from 'react';
import { SimulationParams, LatticeNode, LatticeBond, QuantumMode, MaterialType } from '../types';
import { Activity, ShieldAlert, Sparkles, Thermometer, Zap, RefreshCw } from 'lucide-react';
import { translations, Language } from '../lib/translations';

interface LatticeSimulatorProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  lang: Language;
}

export default function LatticeSimulator({ params, setParams, lang }: LatticeSimulatorProps) {
  const t = translations[lang];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<LatticeNode[]>([]);
  const [bonds, setBonds] = useState<LatticeBond[]>([]);
  const [isDamaging, setIsDamaging] = useState(false);
  const [isHealing, setIsHealing] = useState(false);
  const [structuralIntegrity, setStructuralIntegrity] = useState(100);
  const [activeCoherence, setActiveCoherence] = useState(100);
  const [healProgress, setHealProgress] = useState(100);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [healedAtomsCount, setHealedAtomsCount] = useState(0);

  // Quantum coherence calculations based on temperature & field setting
  useEffect(() => {
    // Speculative formula: higher temperature decays coherence; higher coherence field boosts it
    let tempValue = params.temperature;
    if (params.activeSpecs?.phononShielding) {
      // Suppress thermal phonon noise impact!
      tempValue = Math.max(100, 100 + (params.temperature - 100) * 0.18);
    }
    const tempFactor = Math.max(0, 1 - (tempValue - 100) / 300); // 1 at 100K, 0 at 400K
    let calculatedCoherence = Math.round(
      (tempFactor * 0.7 + (params.coherenceField / 100) * 0.3) * 100
    );
    if (params.activeSpecs?.phononShielding) {
      calculatedCoherence = Math.min(100, calculatedCoherence + 20);
    }
    setActiveCoherence(params.quantumMode === 'NONE' ? 0 : calculatedCoherence);
  }, [params.temperature, params.coherenceField, params.quantumMode, params.activeSpecs]);

  // Initialize the lattice (rows and columns of atoms)
  const initializeLattice = () => {
    const cols = 12;
    const rows = 6;
    const spacingX = 45;
    const spacingY = 45;
    const offsetX = 50;
    const offsetY = 45;

    const newNodes: LatticeNode[] = [];
    const newBonds: LatticeBond[] = [];

    // Create atomic nodes
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = r * cols + c;
        const x = offsetX + c * spacingX + (r % 2 === 0 ? 0 : spacingX / 2);
        const y = offsetY + r * spacingY;

        // Choose atomic element based on material type
        let element: 'Ti' | 'Ni' | 'O' | 'C' | 'Dopant' = 'Ti';
        if (params.materialType === 'SMA') {
          element = (r + c) % 2 === 0 ? 'Ti' : 'Ni';
        } else {
          // Polymer base
          element = c % 3 === 0 ? 'O' : 'C';
        }

        // Randomly scatter a few quantum dopants in quantum mode
        if (params.quantumMode !== 'NONE' && (id * 7) % 13 === 0) {
          element = 'Dopant';
        }

        newNodes.push({
          id,
          originalX: x,
          originalY: y,
          x,
          y,
          vx: 0,
          vy: 0,
          isDamaged: false,
          displacementX: 0,
          displacementY: 0,
          element,
        });
      }
    }

    // Connect neighbors with bonds
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = r * cols + c;

        // Right connection
        if (c < cols - 1) {
          const rightId = r * cols + (c + 1);
          newBonds.push({
            from: id,
            to: rightId,
            originalDistance: spacingX,
            broken: false,
            strength: 1.0,
          });
        }

        // Down connection
        if (r < rows - 1) {
          const downId = (r + 1) * cols + c;
          newBonds.push({
            from: id,
            to: downId,
            originalDistance: spacingY,
            broken: false,
            strength: 1.0,
          });

          // Diagonal connections for hexagonal/triangular crystal lattice structure
          if (r % 2 === 0) {
            if (c > 0) {
              const diagId = (r + 1) * cols + (c - 1);
              newBonds.push({
                from: id,
                to: diagId,
                originalDistance: Math.sqrt(spacingX * spacingX + spacingY * spacingY),
                broken: false,
                strength: 1.0,
              });
            }
          } else {
            if (c < cols - 1) {
              const diagId = (r + 1) * cols + (c + 1);
              newBonds.push({
                from: id,
                to: diagId,
                originalDistance: Math.sqrt(spacingX * spacingX + spacingY * spacingY),
                broken: false,
                strength: 1.0,
              });
            }
          }
        }
      }
    }

    setNodes(newNodes);
    setBonds(newBonds);
    setStructuralIntegrity(100);
    setHealedAtomsCount(0);
    setTimeElapsed(0);
    setIsHealing(false);
  };

  // Run initialization on mount or material type change
  useEffect(() => {
    initializeLattice();
  }, [params.materialType]);

  // Recalculate structural integrity
  useEffect(() => {
    if (bonds.length === 0) return;
    const unbroken = bonds.filter((b) => !b.broken).length;
    setStructuralIntegrity(Math.round((unbroken / bonds.length) * 100));
  }, [bonds]);

  // Handle damage dragging on canvas
  const damageLattice = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const damageRadius = 60;

    // Displace nodes and break bonds close to the mouse coordinate
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        const dx = node.x - x;
        const dy = node.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < damageRadius) {
          // Push atom away to simulate fracture and mechanical dislocation
          const angle = Math.atan2(dy, dx) || Math.random() * Math.PI * 2;
          const force = (damageRadius - dist) / damageRadius;
          const pushDistance = force * 22;

          const dispX = node.displacementX + Math.cos(angle) * pushDistance;
          const dispY = node.displacementY + Math.sin(angle) * pushDistance;

          return {
            ...node,
            x: node.originalX + dispX,
            y: node.originalY + dispY,
            displacementX: dispX,
            displacementY: dispY,
            isDamaged: true,
          };
        }
        return node;
      })
    );

    setBonds((prevBonds) =>
      prevBonds.map((bond) => {
        const nodeA = nodes.find((n) => n.id === bond.from);
        const nodeB = nodes.find((n) => n.id === bond.to);

        if (!nodeA || !nodeB) return bond;

        // Calculate distance between displaced nodes
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        // Break if distance is 15% larger than original spacing
        if (currentDistance > bond.originalDistance * 1.15) {
          return {
            ...bond,
            broken: true,
            strength: 0,
          };
        }
        return bond;
      })
    );
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDamaging(true);
    damageLattice(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDamaging) return;
    damageLattice(e.clientX, e.clientY);
  };

  const handleMouseUpOrLeave = () => {
    setIsDamaging(false);
  };

  // Core physics loop / animation of repair processes
  useEffect(() => {
    let animationFrameId: number;
    let timerId: NodeJS.Timeout;

    if (isHealing) {
      // Start stopwatch
      timerId = setInterval(() => {
        setTimeElapsed((t) => Number((t + 0.1).toFixed(1)));
      }, 100);

      const render = () => {
        let anyChanges = false;
        let atomsHealedThisFrame = 0;

        // Update node positions towards original positions
        setNodes((prevNodes) => {
          let updated = prevNodes.map((node) => {
            if (!node.isDamaged) return node;

            const distToOrig = Math.sqrt(
              node.displacementX * node.displacementX +
              node.displacementY * node.displacementY
            );

            if (distToOrig < 0.5) {
              atomsHealedThisFrame++;
              return {
                ...node,
                x: node.originalX,
                y: node.originalY,
                displacementX: 0,
                displacementY: 0,
                isDamaged: false,
              };
            }

            anyChanges = true;

            // Compute healing rate
            let speedFactor = 0.02; // Base speed

            if (params.quantumMode === 'NONE') {
              // Arrhenius thermal diffusion rate: k = A * exp(-Ea / (kB * T))
              // If temp is low, thermal speed is extremely slow!
              const activationEnergy = params.barrierHeight; // represented by barrier height
              const thermalRate = Math.exp(-activationEnergy / (0.0083 * params.temperature));
              speedFactor = 0.05 * thermalRate;
            } else if (params.quantumMode === 'TUNNELING') {
              // Quantum Tunneling Probability: P = exp(-2 * L * sqrt(2 * m * (V0 - E) / hbar^2))
              // Here width is params.barrierWidth, height is params.barrierHeight
              // Quantum coherence scales the quantum rate directly!
              const coherenceMultiplier = activeCoherence / 100;
              const mass = 1.0;
              const energyDiff = Math.max(0.1, params.barrierHeight - 0.2); // energy of particles
              
              let tunnelingProb = Math.exp(
                -2 * params.barrierWidth * Math.sqrt(2 * mass * energyDiff) * 3
              );

              if (params.activeSpecs?.blochResonance) {
                // Double physical tunneling probability through spin precession vector alignment
                tunnelingProb = Math.min(1.0, tunnelingProb * 2.2);
              }
              
              // Quantum speed is extremely fast if coherence is maintained!
              speedFactor = 0.015 + 0.18 * tunnelingProb * coherenceMultiplier;
            } else if (params.quantumMode === 'ENTANGLEMENT') {
              // Entangled wave cascades and locks atoms in place very quickly
              const coherenceMultiplier = activeCoherence / 100;
              speedFactor = 0.12 * coherenceMultiplier + 0.01;
            }

            if (params.activeSpecs?.picosecondLaser) {
              // Sub-picosecond laser shaper ignites atomic jumping at twice the frequency
              speedFactor *= 2.0;
            }

            // Cap min speed so it doesn't freeze completely
            speedFactor = Math.max(0.001, speedFactor);

            const dx = -node.displacementX * speedFactor;
            const dy = -node.displacementY * speedFactor;

            return {
              ...node,
              x: node.x + dx,
              y: node.y + dy,
              displacementX: node.displacementX + dx,
              displacementY: node.displacementY + dy,
            };
          });
          return updated;
        });

        // Gradually restore bonds if connected atoms are near original spots
        setBonds((prevBonds) => {
          return prevBonds.map((bond) => {
            if (!bond.broken) return bond;

            // Check nodes
            return { ...bond }; // temporary
          });
        });

        if (atomsHealedThisFrame > 0) {
          setHealedAtomsCount((c) => c + atomsHealedThisFrame);
        }

        if (anyChanges) {
          animationFrameId = requestAnimationFrame(render);
        } else {
          // Fully repaired!
          setBonds((prevBonds) => prevBonds.map((b) => ({ ...b, broken: false, strength: 1.0 })));
          setIsHealing(false);
        }
      };

      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (timerId) clearInterval(timerId);
    };
  }, [isHealing, params.quantumMode, params.temperature, params.barrierWidth, params.barrierHeight, activeCoherence]);

  // Hook to repair bonds once nodes align
  useEffect(() => {
    if (!isHealing) return;
    setBonds((prevBonds) =>
      prevBonds.map((bond) => {
        if (!bond.broken) return bond;

        const nodeA = nodes.find((n) => n.id === bond.from);
        const nodeB = nodes.find((n) => n.id === bond.to);

        if (!nodeA || !nodeB) return bond;

        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Reconnect if atoms are within 4% of original distance
        if (dist <= bond.originalDistance * 1.04 && !nodeA.isDamaged && !nodeB.isDamaged) {
          return {
            ...bond,
            broken: false,
            strength: 1.0,
          };
        }
        return bond;
      })
    );
  }, [nodes, isHealing]);

  // Draw the simulation canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid background lines (high-tech aesthetic)
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 40) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(canvas.width, j);
      ctx.stroke();
    }

    // Draw broken bonds shadow (glowing red fissures)
    bonds.forEach((bond) => {
      if (!bond.broken) return;
      const fromNode = nodes.find((n) => n.id === bond.from);
      const toNode = nodes.find((n) => n.id === bond.to);
      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Red dotted line
      ctx.beginPath();
      ctx.setLineDash([2, 4]);
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw active bonds (neon pathways)
    bonds.forEach((bond) => {
      if (bond.broken) return;
      const fromNode = nodes.find((n) => n.id === bond.from);
      const toNode = nodes.find((n) => n.id === bond.to);
      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);

      // Bond styling based on Quantum Mode
      if (params.quantumMode === 'NONE') {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'; // Classical gray bond
        ctx.lineWidth = 1.5;
      } else if (params.quantumMode === 'TUNNELING') {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)'; // Tunneling Cyan glow
        ctx.lineWidth = 2;
        // Glow effect
        ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
        ctx.shadowBlur = 4;
      } else {
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)'; // Entanglement Purple glow
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(168, 85, 247, 0.6)';
        ctx.shadowBlur = 6;
      }

      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow
    });

    // Draw atoms
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.element === 'Dopant' ? 6 : 5, 0, Math.PI * 2);

      // Node color by element and damage state
      if (node.isDamaged) {
        ctx.fillStyle = '#ef4444'; // Red damaged atom
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 6;
      } else {
        if (node.element === 'Ti') {
          ctx.fillStyle = '#60a5fa'; // Blue Titanium
        } else if (node.element === 'Ni') {
          ctx.fillStyle = '#34d399'; // Green Nickel
        } else if (node.element === 'C') {
          ctx.fillStyle = '#facc15'; // Yellow Carbon
        } else if (node.element === 'O') {
          ctx.fillStyle = '#fb923c'; // Orange Oxygen
        } else if (node.element === 'Dopant') {
          ctx.fillStyle = '#a855f7'; // Purple Quantum Dopant
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 8;
        }
      }

      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      // Draw subtle outer orbits for Quantum Dopants
      if (node.element === 'Dopant' && !node.isDamaged) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 11, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw wave ripple effects if healing is active and using Quantum modes
      if (isHealing && node.isDamaged && params.quantumMode !== 'NONE') {
        const pulseRadius = 12 + (Date.now() % 1000) / 45;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = params.quantumMode === 'TUNNELING' 
          ? `rgba(56, 189, 248, ${Math.max(0, 1 - pulseRadius / 35)})` 
          : `rgba(168, 85, 247, ${Math.max(0, 1 - pulseRadius / 35)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    // Draw instructional overlay text when damage is 0
    if (structuralIntegrity === 100 && !isHealing) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        t.simReady,
        canvas.width / 2,
        canvas.height - 20
      );
    }
  }, [nodes, bonds, params.quantumMode, isHealing, structuralIntegrity, t]);

  // Request continuous redraw loop for animations
  useEffect(() => {
    let animId: number;
    const tick = () => {
      // Force trigger state-based drawing for wave ripples
      if (isHealing && params.quantumMode !== 'NONE') {
        setNodes((prev) => [...prev]);
      }
      animId = requestAnimationFrame(tick);
    };
    if (isHealing && params.quantumMode !== 'NONE') {
      animId = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animId);
  }, [isHealing, params.quantumMode]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 shadow-2xl relative overflow-hidden flex flex-col h-full justify-between" id="lattice-simulator-container">
      {/* Decorative Sci-Fi Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f2ff] rounded-tl-sm opacity-55"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f2ff] rounded-tr-sm opacity-55"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00f2ff] rounded-bl-sm opacity-55"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f2ff] rounded-br-sm opacity-55"></div>

      <div>
        {/* Title Block */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#00f2ff] animate-pulse" />
            <h3 className="font-serif font-medium text-lg text-white tracking-tight">
              {t.simTitle}
            </h3>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#00f2ff] border border-[#00f2ff]/30 bg-[#00f2ff]/5 px-2.5 py-0.5 rounded flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            {t.simActive}
          </span>
        </div>

        {/* Real-time Diagnostics HUD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-[#0a0a0c]/60 border border-white/5 p-3 rounded text-center flex flex-col justify-center">
            <div className="flex items-center justify-center gap-1.5 text-white/50 text-[10px] uppercase tracking-wider font-medium mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-[#00f2ff]" />
              {t.integrity}
            </div>
            <div className={`font-mono text-xl font-bold ${structuralIntegrity < 65 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {structuralIntegrity}%
            </div>
          </div>

          <div className="bg-[#0a0a0c]/60 border border-white/5 p-3 rounded text-center flex flex-col justify-center">
            <div className="flex items-center justify-center gap-1.5 text-white/50 text-[10px] uppercase tracking-wider font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              {t.coherenceSim}
            </div>
            <div className={`font-mono text-xl font-bold ${activeCoherence < 30 ? 'text-slate-500' : 'text-purple-400'}`}>
              {params.quantumMode === 'NONE' ? '0.0%' : `${activeCoherence}%`}
            </div>
          </div>

          <div className="bg-[#0a0a0c]/60 border border-white/5 p-3 rounded text-center flex flex-col justify-center">
            <div className="flex items-center justify-center gap-1.5 text-white/50 text-[10px] uppercase tracking-wider font-medium mb-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              {t.temperature}
            </div>
            <div className="font-mono text-xl font-bold text-amber-400">
              {params.temperature}K
            </div>
          </div>

          <div className="bg-[#0a0a0c]/60 border border-white/5 p-3 rounded text-center flex flex-col justify-center">
            <div className="flex items-center justify-center gap-1.5 text-white/50 text-[10px] uppercase tracking-wider font-medium mb-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              {t.healingTime}
            </div>
            <div className="font-mono text-xl font-bold text-yellow-400">
              {timeElapsed > 0 ? `${timeElapsed}s` : '0.0s'}
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="relative border border-white/10 bg-[#0a0a0c] rounded overflow-hidden shadow-inner">
          <canvas
            ref={canvasRef}
            width={580}
            height={310}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="w-full cursor-crosshair block bg-[#050507]"
          />

          {/* Atomic legend overlays */}
          <div className="absolute top-2.5 left-2.5 bg-[#0a0a0c]/90 backdrop-blur-md border border-white/10 px-3 py-2 rounded flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] font-mono text-white/80">
            {params.materialType === 'SMA' ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#60a5fa]"></span> {t.legendTi}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#34d399]"></span> {t.legendNi}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#facc15]"></span> {t.legendC}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#fb923c]"></span> {t.legendO}
                </div>
              </>
            )}
            {params.quantumMode !== 'NONE' && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#a855f7] animate-pulse"></span> {t.legendDopant}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-3 items-center">
        {/* Run simulator buttons */}
        <button
          onClick={() => {
            if (structuralIntegrity === 100) return;
            setIsHealing(true);
            setTimeElapsed(0);
          }}
          disabled={structuralIntegrity === 100 || isHealing}
          id="btn-simulate-repair"
          className={`w-full sm:w-auto px-6 py-3 font-sans font-semibold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-all shadow-md ${
            structuralIntegrity === 100
              ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
              : isHealing
              ? 'bg-[#00f2ff]/5 text-[#00f2ff] border border-[#00f2ff]/30 animate-pulse cursor-wait'
              : 'bg-gradient-to-r from-[#00f2ff] to-indigo-600 hover:from-[#00e0eb] hover:to-indigo-700 text-black shadow-[#00f2ff]/20 active:translate-y-px'
          }`}
        >
          {isHealing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00f2ff]" />
              {t.btnRepairing}
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-black fill-black" />
              {t.btnRepair}
            </>
          )}
        </button>

        <button
          onClick={initializeLattice}
          id="btn-reset-lattice"
          className="w-full sm:w-auto px-5 py-3 font-sans text-xs font-semibold uppercase tracking-wider border border-white/10 hover:bg-white/5 text-white/80 hover:text-white rounded transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {t.btnReset}
        </button>

        {/* Interactive hint */}
        <div className="text-center sm:text-left text-[11px] font-sans text-white/50 mt-2 sm:mt-0 flex-1">
          {isHealing ? (
            <p className="animate-pulse text-[#00f2ff]">
              {params.quantumMode === 'NONE'
                ? t.thermalDiffHelp
                : t.quantumMechHelp}
            </p>
          ) : structuralIntegrity < 100 ? (
            <p className="text-rose-400 font-medium">
              {t.damageDetected.replace('{damage}', String(100 - structuralIntegrity))}
            </p>
          ) : (
            <p className="italic">{t.simReady}</p>
          )}
        </div>
      </div>
    </div>
  );
}
