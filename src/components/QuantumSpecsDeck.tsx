import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { SimulationParams } from '../types';
import { translations, Language } from '../lib/translations';
import { 
  Activity, Shield, ShieldCheck, Zap, Cpu, Database, 
  Binary, RefreshCw, Flame, Sliders, ArrowRight, Settings, Radio
} from 'lucide-react';

interface SpecsDeckProps {
  params: SimulationParams;
  setParams: Dispatch<SetStateAction<SimulationParams>>;
  lang: Language;
}

export default function QuantumSpecsDeck({ params, setParams, lang }: SpecsDeckProps) {
  const t = translations[lang];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedSpec, setSelectedSpec] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Initialize activeSpecs if it doesn't exist
  useEffect(() => {
    if (!params.activeSpecs) {
      setParams(prev => ({
        ...prev,
        activeSpecs: {
          phononShielding: true,
          topologicalPinning: false,
          blochResonance: true,
          gnomeHpc: false,
          quantumTomography: true,
          picosecondLaser: false,
          kryoIsolation: false
        }
      }));
    }
  }, [params.activeSpecs, setParams]);

  const activeSpecs = params.activeSpecs || {
    phononShielding: true,
    topologicalPinning: false,
    blochResonance: true,
    gnomeHpc: false,
    quantumTomography: true,
    picosecondLaser: false,
    kryoIsolation: false
  };

  const engagedCount = Object.values(activeSpecs).filter(Boolean).length;

  // Generate logs based on active specifications
  useEffect(() => {
    const activeList: string[] = [];
    const prefix = lang === 'es' ? '[OK]' : lang === 'zh' ? '[系统就绪]' : '[OK]';
    
    if (activeSpecs.phononShielding) {
      activeList.push(
        lang === 'es' 
          ? `${prefix} Amortiguación activa acoplada. Ruido fonónico a 300K reducido en 24.8 dB.`
          : lang === 'zh'
          ? `${prefix} 主动声子阻尼屏障已联接。300K环境声子热噪声已被主动抑制减弱 24.8 dB。`
          : `${prefix} Active phonon damping coupled. 300K phonon noise suppressed by 24.8 dB.`
      );
    } else {
      activeList.push(
        lang === 'es'
          ? `[ALERTA] Amortiguador fonónico inactivo. Vibración térmica interfiere en la coherencia local.`
          : lang === 'zh'
          ? `[警报] 主动声子阻尼未激活。晶格受强热振动干扰，自旋相位开始受损。`
          : `[WARNING] Phononic damping offline. Ambient thermal vibration causing spin dephasing.`
      );
    }

    if (activeSpecs.topologicalPinning) {
      activeList.push(
        lang === 'es'
          ? `${prefix} Estados de Weyl topológicos anclados en dopaje Bi-Sb. Migración plástica reducida a cero.`
          : lang === 'zh'
          ? `${prefix} 铋锑(Bi-Sb)拓扑外尔节点已锁死。晶格空位扩散滑移几率降至极限零值。`
          : `${prefix} Weyl nodes pinned at Bi-Sb sites. Plastic slip probability reduced to zero.`
      );
    }

    if (activeSpecs.blochResonance) {
      activeList.push(
        lang === 'es'
          ? `${prefix} Inductor de resonancia GHz activo. Coherencia en la Esfera de Bloch estabilizada.`
          : lang === 'zh'
          ? `${prefix} 吉赫兹(GHz)微波磁共振已激发。Bloch 球上的自旋相位进动向量保持极高对称。`
          : `${prefix} GHz Bloch resonance generator online. Spin wave precession phase locked.`
      );
    }

    if (activeSpecs.gnomeHpc) {
      activeList.push(
        lang === 'es'
          ? `${prefix} Conexión de doble agente HPC establecida con GNoME. Algoritmo DFT acelerado.`
          : lang === 'zh'
          ? `${prefix} Google DeepMind GNoME 晶体数据库与 Google Cloud HPC 已建立高带宽双向通道。`
          : `${prefix} GNoME high-bandwidth link established. Graph Neural Networks pre-calculating crystal energy states.`
      );
    }

    if (activeSpecs.quantumTomography) {
      activeList.push(
        lang === 'es'
          ? `${prefix} Escaneo de tomografía activa encendido. Fidelidad cuántica actual: ${(92.4 + (engagedCount * 1.05)).toFixed(2)}%.`
          : lang === 'zh'
          ? `${prefix} 无损量子自旋断层扫描持续运行中。当前实测状态保真度 F = ${(92.4 + (engagedCount * 1.05)).toFixed(2)}%.`
          : `${prefix} Tomographic scanner monitoring wavepacket. Current state fidelity F = ${(92.4 + (engagedCount * 1.05)).toFixed(2)}%.`
      );
    }

    if (activeSpecs.picosecondLaser) {
      activeList.push(
        lang === 'es'
          ? `${prefix} Modulador láser de picosegundos calibrado. Transición colectiva forzada lista.`
          : lang === 'zh'
          ? `${prefix} 皮秒级整形激光调幅相位已锁定。格点向初始完好态的相干集体越迁就绪。`
          : `${prefix} Picosecond shaped laser ready. Coherent collective wave-packet reconstruction channel open.`
      );
    }

    if (activeSpecs.kryoIsolation) {
      activeList.push(
        lang === 'es'
          ? `${prefix} Vacío hermético acoplado (k < 0.005 W/mK). Blindaje térmico total.`
          : lang === 'zh'
          ? `${prefix} 绝热气凝胶/多壁碳纳米管(MWCNTs)屏蔽层密封就绪。外部对流传热梯度已归零。`
          : `${prefix} Vacuum multi-walled CNT shield active. Total convective isolation (k < 0.005 W/mK).`
      );
    }

    setLogs(activeList);
  }, [activeSpecs, lang, engagedCount]);

  // Live Quantum Tomography Wave Animation on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let angle = 0;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      
      ctx.clearRect(0, 0, w, h);

      // Draw background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const centerX = w / 2;
      const centerY = h / 2;
      const baseRadius = Math.min(w, h) * 0.35;

      // Draw Bloch Sphere Outline or Orbital rings
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)'; // Purple hue
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Horizontal equator ellipse
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, baseRadius, baseRadius * 0.25, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Vertical polar ellipse
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, baseRadius * 0.25, baseRadius, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Dynamic precessing spin vector
      const vectorLength = baseRadius * 0.9;
      // Adjust precession speed based on Bloch resonance and Coherence
      const speedFactor = activeSpecs.blochResonance ? 0.015 : 0.04;
      angle += speedFactor;

      // Calculate spherical coordinates precessing
      const sphereX = centerX + vectorLength * Math.sin(angle) * Math.cos(angle * 0.1);
      const sphereY = centerY - vectorLength * Math.cos(angle) * 0.8;

      // Draw vector line
      ctx.strokeStyle = activeSpecs.blochResonance ? '#00f2ff' : '#a855f7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(sphereX, sphereY);
      ctx.stroke();

      // Vector head circle
      ctx.fillStyle = activeSpecs.blochResonance ? '#00f2ff' : '#ec4899';
      ctx.beginPath();
      ctx.arc(sphereX, sphereY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Draw wave patterns surrounding the sphere representing phonon shielding
      const waveCount = activeSpecs.phononShielding ? 3 : 1;
      ctx.lineWidth = 1.5;
      
      for (let i = 0; i < waveCount; i++) {
        ctx.strokeStyle = `rgba(0, 242, 255, ${0.4 - i * 0.1})`;
        ctx.beginPath();
        const segments = 100;
        for (let j = 0; j <= segments; j++) {
          const theta = (j / segments) * Math.PI * 2;
          const radialNoise = Math.sin(theta * 6 + angle * 4 + i * 2) * (activeSpecs.phononShielding ? 3 : 15);
          const r = baseRadius + 12 + i * 10 + radialNoise;
          const wx = centerX + r * Math.cos(theta);
          const wy = centerY + r * Math.sin(theta);
          if (j === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Draw diagnostic stats overlay inside canvas
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px monospace';
      ctx.fillText(`SPIN_VECTOR: [${(Math.sin(angle)).toFixed(3)}, ${(Math.cos(angle)).toFixed(3)}]`, 15, h - 30);
      ctx.fillText(`FIDELITY: ${(92.4 + (engagedCount * 1.05)).toFixed(2)}%`, 15, h - 15);
      ctx.fillText(`PHONON_DAMP: ${activeSpecs.phononShielding ? 'ACTIVE (-24.8dB)' : 'OFF (CRITICAL)'}`, w - 180, h - 15);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [activeSpecs, engagedCount]);

  // Handler to toggle specification state
  const handleToggle = (key: keyof typeof activeSpecs) => {
    const updated = {
      ...activeSpecs,
      [key]: !activeSpecs[key]
    };

    setParams(prev => {
      const updatedParams = {
        ...prev,
        activeSpecs: updated
      };

      // Apply dynamic physical changes in the simulator parameters when toggles are clicked!
      if (key === 'phononShielding') {
        // If phonon shielding is activated, increase default coherenceField field
        if (updated.phononShielding) {
          updatedParams.coherenceField = Math.min(100, prev.coherenceField + 15);
        } else {
          updatedParams.coherenceField = Math.max(10, prev.coherenceField - 15);
        }
      }

      if (key === 'kryoIsolation') {
        // Keeps temperature insulated, reset to ambient room temp
        if (updated.kryoIsolation) {
          updatedParams.temperature = 293; 
        }
      }

      return updatedParams;
    });
  };

  // Simulated spectroscopic quantum scan
  const triggerScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          // Add a new detailed log after scan completes
          setLogs(prevLogs => [
            lang === 'es'
              ? `[SCAN COMPLETADO] Cristalografía atómica estable. Densidad del Hamiltoniano simétrica.`
              : lang === 'zh'
              ? `[扫描完成] 原子级晶相演化稳定。哈密顿量局域密度完全符合量子相变对称。`
              : `[SCAN COMPLETE] Non-destructive spectroscopic scan verified. Local Hamiltonian density symmetric.`,
            ...prevLogs
          ]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Mapping of key values to their keys
  const specItems = [
    {
      key: 'phononShielding' as const,
      name: t.spec1Name,
      desc: t.spec1Desc,
      impact: t.spec1Impact,
      note: t.spec1Note,
      icon: Shield,
      color: 'text-cyan-400 border-cyan-500/20'
    },
    {
      key: 'topologicalPinning' as const,
      name: t.spec2Name,
      desc: t.spec2Desc,
      impact: t.spec2Impact,
      note: t.spec2Note,
      icon: ShieldCheck,
      color: 'text-emerald-400 border-emerald-500/20'
    },
    {
      key: 'blochResonance' as const,
      name: t.spec3Name,
      desc: t.spec3Desc,
      impact: t.spec3Impact,
      note: t.spec3Note,
      icon: Radio,
      color: 'text-purple-400 border-purple-500/20'
    },
    {
      key: 'gnomeHpc' as const,
      name: t.spec4Name,
      desc: t.spec4Desc,
      impact: t.spec4Impact,
      note: t.spec4Note,
      icon: Database,
      color: 'text-[#00f2ff] border-[#00f2ff]/20'
    },
    {
      key: 'quantumTomography' as const,
      name: t.spec5Name,
      desc: t.spec5Desc,
      impact: t.spec5Impact,
      note: t.spec5Note,
      icon: Activity,
      color: 'text-pink-400 border-pink-500/20'
    },
    {
      key: 'picosecondLaser' as const,
      name: t.spec6Name,
      desc: t.spec6Desc,
      impact: t.spec6Impact,
      note: t.spec6Note,
      icon: Flame,
      color: 'text-amber-400 border-amber-500/20'
    },
    {
      key: 'kryoIsolation' as const,
      name: t.spec7Name,
      desc: t.spec7Desc,
      impact: t.spec7Impact,
      note: t.spec7Note,
      icon: Binary,
      color: 'text-indigo-400 border-indigo-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      {/* LEFT SIDE: Specifications List (7 columns) */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        
        {/* Specifications introduction panel */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            <h3 className="font-serif font-medium text-lg text-white tracking-tight">
              {t.specsTitle}
            </h3>
          </div>
          <p className="text-xs text-white/60 leading-relaxed font-serif">
            {t.specsDesc}
          </p>
        </div>

        {/* List of 7 Specifications */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
          {specItems.map((item, idx) => {
            const isEngaged = activeSpecs[item.key];
            const IconComponent = item.icon;
            const isSelected = selectedSpec === idx;

            return (
              <div 
                key={idx}
                onClick={() => setSelectedSpec(idx)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected 
                    ? 'bg-white/5 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.08)]' 
                    : 'bg-transparent border-white/5 hover:border-white/10 hover:bg-white/2'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`p-2.5 rounded-lg bg-white/5 ${item.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-white tracking-wide font-sans">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-white/50 truncate max-w-md mt-0.5 font-serif">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Engaging Switch Toggle */}
                <button
                  type="button"
                  id={`toggle-spec-${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(item.key);
                  }}
                  className={`px-3 py-1.5 rounded-md font-mono text-[9px] font-bold transition-all border shrink-0 ${
                    isEngaged
                      ? 'bg-purple-950/40 border-purple-500 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.2)]'
                      : 'bg-[#0a0a0c] border-white/10 text-white/40 hover:text-white/60 hover:border-white/20'
                  }`}
                >
                  {isEngaged ? t.specActiveBadge : t.specInactiveBadge}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Tomography Feed & Deep Analysis (5 columns) */}
      <div className="lg:col-span-5 flex flex-col space-y-6">
        
        {/* Tomography Feed panel */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden flex-1 min-h-[320px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-white font-semibold tracking-wider uppercase text-[10px] font-mono">
                {lang === 'es' ? 'TOMOGRAFÍA DE COHERENCIA EN TIEMPO REAL' : lang === 'zh' ? '有源量子纠缠断层扫描诊断' : 'REAL-TIME COHERENCE TOMOGRAPHY'}
              </span>
            </div>
            <span className="text-[9px] bg-purple-950/50 border border-purple-500/20 px-2 py-0.5 rounded text-purple-400 font-mono">
              {engagedCount}/7 {lang === 'es' ? 'Sistemas' : lang === 'zh' ? '系统已联接' : 'Systems Engaged'}
            </span>
          </div>

          {/* Interactive Canvas Stage */}
          <div className="relative bg-[#070709] border border-white/5 rounded-lg overflow-hidden flex-1 h-48 flex items-center justify-center">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            
            {/* Scan animation bar */}
            {isScanning && (
              <div 
                className="absolute left-0 right-0 h-0.5 bg-[#00f2ff] shadow-[0_0_8px_#00f2ff] animate-bounce"
                style={{ top: `${scanProgress}%` }}
              ></div>
            )}
          </div>

          {/* Scan control trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={triggerScan}
              disabled={isScanning}
              id="btn-spectroscopic-scan"
              className={`flex-1 py-2 px-3 rounded font-mono text-[10px] font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 border ${
                isScanning 
                  ? 'bg-purple-950/20 border-purple-800/30 text-purple-400 cursor-wait'
                  : 'bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 border-purple-500/30 shadow-md active:translate-y-px'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-purple-400' : 'text-purple-300'}`} />
              {isScanning 
                ? `${lang === 'es' ? 'ESCANEO EN PROGRESO...' : lang === 'zh' ? '光谱断层扫描中...' : 'SCANNING SPECTROSCOPY...'}` 
                : `${lang === 'es' ? 'ESCANEO ESPECTROSCÓPICO' : lang === 'zh' ? '单晶无损扫描' : 'RUN SPECTROSCOPIC SCAN'}`
              }
            </button>
          </div>
        </div>

        {/* Selected Specification Details and Notes */}
        <div className="bg-[#0a0a0c] border border-white/10 rounded-xl p-5 space-y-4">
          <div className="border-b border-white/5 pb-2">
            <span className="text-[9px] font-mono bg-purple-950/40 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/20 uppercase">
              {lang === 'es' ? 'ESPECIFICACIÓN SELECCIONADA' : lang === 'zh' ? '技术规格细节参数剖析' : 'SELECTED SPECIFICATION'}
            </span>
            <h4 className="text-white font-serif font-bold text-sm mt-2">
              {specItems[selectedSpec].name}
            </h4>
          </div>

          {/* Dynamic properties of selected specification */}
          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-white/40 block uppercase text-[8px] font-mono tracking-wider">{t.specImpactLabel}</span>
              <span className="text-emerald-400 font-sans font-bold block mt-0.5">
                {specItems[selectedSpec].impact}
              </span>
            </div>

            <div>
              <span className="text-white/40 block uppercase text-[8px] font-mono tracking-wider">{t.specEngineeringNote}</span>
              <p className="text-white/70 font-serif leading-relaxed italic bg-white/5 p-3 rounded border border-white/5 mt-1">
                "{specItems[selectedSpec].note}"
              </p>
            </div>
          </div>
        </div>

        {/* Live Diagnostics Log console */}
        <div className="bg-[#070709] border border-white/10 rounded-xl p-4 font-mono text-[9px] text-white/55 space-y-2">
          <span className="text-white/35 font-bold uppercase tracking-widest block border-b border-white/5 pb-1.5">
            {lang === 'es' ? 'REGISTRO DE COHERENCIA ACTIVA (SYS_LOG)' : lang === 'zh' ? '量子系统运行日志 (SYS_LOG)' : 'ACTIVE COHERENCE DIAGNOSTICS (SYS_LOG)'}
          </span>
          <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-thin">
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-1">
                <span className="text-purple-400 shrink-0">&gt;</span>
                <span className="leading-normal">{log}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
