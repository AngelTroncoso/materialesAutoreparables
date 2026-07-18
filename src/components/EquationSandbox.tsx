import React, { useState, useEffect, useRef } from 'react';
import { SimulationParams } from '../types';
import { Sliders, HelpCircle, AlertTriangle, HelpCircle as HelpIcon, TrendingUp } from 'lucide-react';
import { translations, Language } from '../lib/translations';

interface EquationSandboxProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  lang: Language;
}

export default function EquationSandbox({ params, setParams, lang }: EquationSandboxProps) {
  const t = translations[lang];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveOffset, setWaveOffset] = useState(0);

  // Constants
  const mass = 1.0; // Normalized mass
  const hbar = 1.0; // Planck constant normalized
  const energy = 1.2; // Particle energy in eV

  // Calculate tunnel probability
  // P = exp(-2 * L * sqrt(2 * m * (V0 - E)) / hbar)
  const barrierDiff = Math.max(0.01, params.barrierHeight - energy);
  const tunnelingProbability = Math.exp(-2 * params.barrierWidth * Math.sqrt(2 * mass * barrierDiff));

  // Arrhenius rate: k = A * exp(-Ea / (kB * T))
  // Normalized kB = 0.0083
  const classicalRate = Math.min(1.0, Math.exp(-params.barrierHeight / (0.0083 * params.temperature)));

  // Animation frame loop for the wavepacket visualizer
  useEffect(() => {
    let animId: number;
    const animate = () => {
      setWaveOffset((prev) => (prev + 0.1) % (Math.PI * 2));
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Draw Potential Barrier and Tunneling Wave Function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }

    // 1. Draw the Energy Potential Barrier
    // Position of the barrier: centered
    const barrierX = width / 2 - (params.barrierWidth * 150) / 2;
    const barrierW = params.barrierWidth * 150;
    const barrierH = params.barrierHeight * 40; // scale height in eV

    ctx.fillStyle = 'rgba(239, 68, 68, 0.05)';
    ctx.fillRect(barrierX, centerY - barrierH, barrierW, barrierH);

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(barrierX, centerY);
    ctx.lineTo(barrierX, centerY - barrierH);
    ctx.lineTo(barrierX + barrierW, centerY - barrierH);
    ctx.lineTo(barrierX + barrierW, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // 2. Draw Energy level of Particle (E = 1.2 eV)
    const energyY = centerY - energy * 40;
    ctx.strokeStyle = '#eab308';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, energyY);
    ctx.lineTo(width, energyY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Energy label
    ctx.fillStyle = '#eab308';
    ctx.font = '10px monospace';
    const energyLabel = lang === 'es' ? 'Energía Atómica' : lang === 'zh' ? '原子能' : 'Atomic Energy';
    ctx.fillText(`${energyLabel} E = ${energy.toFixed(1)} eV`, 10, energyY - 6);

    // Barrier Height Label
    ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
    const barrierLabel = lang === 'es' ? 'Barrera' : lang === 'zh' ? '势垒' : 'Barrier';
    ctx.fillText(`${barrierLabel} V₀ = ${params.barrierHeight.toFixed(2)} eV`, barrierX + 5, centerY - barrierH - 6);

    // 3. Draw Quantum Wave Function
    // Left of barrier: Incident + Reflected waves (sine wave)
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Wave before barrier
    for (let x = 0; x < barrierX; x++) {
      const waveAmplitude = 25;
      const waveY = energyY + Math.sin(x * 0.12 - waveOffset) * waveAmplitude;
      if (x === 0) ctx.moveTo(x, waveY);
      else ctx.lineTo(x, waveY);
    }

    // Wave decaying inside the barrier (exponential decay)
    // At x = barrierX, wave amplitude matches left side wave
    const waveAmpAtBarrier = Math.sin(barrierX * 0.12 - waveOffset) * 25;
    
    for (let x = barrierX; x <= barrierX + barrierW; x++) {
      const progress = (x - barrierX) / barrierW;
      // Exponential decay: e^(-alpha * progress)
      // Alpha is proportional to sqrt(V0 - E)
      const alpha = Math.sqrt(barrierDiff) * 3;
      const decayFactor = Math.exp(-alpha * progress);
      const waveY = energyY + Math.sin(barrierX * 0.12 - waveOffset) * 25 * decayFactor;
      ctx.lineTo(x, waveY);
    }

    // Wave after barrier: Transmitted wave (smaller amplitude)
    const transmittedAmplitude = 25 * tunnelingProbability;
    for (let x = barrierX + barrierW; x < width; x++) {
      // Phase shifts after barrier, we connect it smoothly
      const waveY = energyY + Math.sin(x * 0.12 - waveOffset) * transmittedAmplitude;
      ctx.lineTo(x, waveY);
    }

    ctx.strokeStyle = '#00f2ff';
    ctx.stroke();

    // Wave Packet description text
    ctx.fillStyle = '#00f2ff';
    const transAmpLabel = lang === 'es' ? 'Amplitud Transmitida' : lang === 'zh' ? '透射振幅' : 'Transmitted Amplitude';
    ctx.fillText(`${transAmpLabel}: ${(tunnelingProbability * 100).toFixed(2)}%`, barrierX + barrierW + 15, energyY - 6);

    // Draw particle representation inside
    if (params.quantumMode === 'TUNNELING') {
      const particleX = (width * 0.2 + (waveOffset * 35)) % width;
      ctx.beginPath();
      ctx.arc(particleX, energyY + Math.sin(particleX * 0.12 - waveOffset) * (particleX < barrierX ? 25 : particleX > barrierX + barrierW ? transmittedAmplitude : 10), 5, 0, Math.PI * 2);
      ctx.fillStyle = '#a855f7';
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

  }, [params.barrierWidth, params.barrierHeight, params.quantumMode, waveOffset, barrierDiff, tunnelingProbability, lang]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 shadow-2xl h-full flex flex-col justify-between" id="equation-sandbox-container">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#00f2ff]" />
          <h3 className="font-serif font-medium text-lg text-white tracking-tight">
            {t.sandboxTitle}
          </h3>
        </div>

        {/* Dynamic Physics Simulation Plot */}
        <div className="relative border border-white/10 bg-[#0a0a0c] rounded overflow-hidden p-2.5 mb-5 shadow-inner">
          <div className="absolute top-2 right-2 flex gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
              E = 1.2 eV
            </span>
          </div>
          <canvas
            ref={canvasRef}
            width={480}
            height={180}
            className="w-full block"
          />
        </div>

        {/* Configuration Sliders */}
        <div className="space-y-4 mb-5">
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-white/50">{t.defectWidth}</span>
              <span className="text-[#00f2ff] font-bold">{params.barrierWidth.toFixed(2)} nm</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.60"
              step="0.02"
              value={params.barrierWidth}
              onChange={(e) => setParams(prev => ({ ...prev, barrierWidth: parseFloat(e.target.value) }))}
              className="w-full h-1 bg-[#0a0a0c] rounded border border-white/10 appearance-none cursor-pointer accent-[#00f2ff]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-white/50">{t.barrierHeight}</span>
              <span className="text-rose-400 font-bold">{params.barrierHeight.toFixed(2)} eV</span>
            </div>
            <input
              type="range"
              min="1.30"
              max="3.00"
              step="0.05"
              value={params.barrierHeight}
              onChange={(e) => setParams(prev => ({ ...prev, barrierHeight: parseFloat(e.target.value) }))}
              className="w-full h-1 bg-[#0a0a0c] rounded border border-white/10 appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-white/50">{t.envTemp}</span>
              <span className="text-amber-400 font-bold">{params.temperature} K</span>
            </div>
            <input
              type="range"
              min="100"
              max="400"
              step="10"
              value={params.temperature}
              onChange={(e) => setParams(prev => ({ ...prev, temperature: parseInt(e.target.value) }))}
              className="w-full h-1 bg-[#0a0a0c] rounded border border-[#0a0a0c] appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Physics outcomes */}
      <div className="bg-[#0a0a0c]/60 border border-white/5 p-4 rounded space-y-3">
        <h4 className="text-[10px] font-mono font-semibold text-[#00f2ff] uppercase tracking-wider">
          {t.mathResults}
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[11px] font-sans text-white/50 mb-0.5">{t.quantumRate}</div>
            <div className="font-mono text-base font-bold text-[#00f2ff]">
              {(tunnelingProbability * 100).toFixed(4)}%
            </div>
            <div className="text-[10px] text-white/40 leading-tight mt-1">
              {t.quantumRateDesc}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-sans text-white/50 mb-0.5">{t.classicalRate}</div>
            <div className="font-mono text-base font-bold text-amber-500">
              {(classicalRate * 100).toFixed(4)}%
            </div>
            <div className="text-[10px] text-white/40 leading-tight mt-1">
              {t.classicalRateDesc}
            </div>
          </div>
        </div>

        {/* Decoherence notice if T is high */}
        {params.temperature > 280 && params.quantumMode !== 'NONE' && (
          params.activeSpecs?.phononShielding ? (
            <div className="border border-emerald-950/20 bg-emerald-950/10 px-3 py-2 rounded flex items-start gap-2 text-emerald-400">
              <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-[10px] leading-tight font-sans">
                {lang === 'es' 
                  ? `[Amortiguación Activa] Interferencia fonónica suprimida. Coherencia cuántica protegida a ${params.temperature} K.` 
                  : lang === 'zh'
                  ? `[300K 主动屏蔽已激活] 热声子散射已被抑制，在 ${params.temperature} K 环境下自旋相干保持完整。`
                  : `[Active Phonic Damping] Phononic thermal decoherence suppressed. Coherence preserved at ${params.temperature} K.`
                }
              </span>
            </div>
          ) : (
            <div className="border border-amber-900/40 bg-amber-950/10 px-3 py-2 rounded flex items-start gap-2 text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-[10px] leading-tight font-sans">
                {t.decoherenceWarning.replace('{temp}', String(params.temperature))}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
