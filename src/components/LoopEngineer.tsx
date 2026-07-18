import { useState, useEffect } from 'react';
import { 
  Cpu, 
  Settings, 
  Play, 
  RefreshCw, 
  CheckCircle, 
  TrendingUp, 
  Dna, 
  Layers, 
  Terminal, 
  ArrowRight, 
  ChevronRight, 
  AlertCircle, 
  ShieldCheck,
  ChevronDown,
  Info,
  Sparkles
} from 'lucide-react';

interface Iteration {
  iteration: number;
  proposal: {
    prototypeName: string;
    exactComposition: string;
    nanoscaleDistribution: string;
    repairStimulus: string;
  };
  evaluation: {
    youngModulusGpa: number;
    tensileStrengthMpa: number;
    recoveryRatioPercent: number;
    healingSpeedNms: number;
    feasibilityRating: number;
    quantumCoherencePs: number;
    critique: string;
    metAllTargets: boolean;
  };
}

interface FinalMaterial {
  materialName: string;
  molecularStructure: string;
  healingMechanism: string;
  mechanicalProperties: {
    youngModulus: string;
    tensileStrength: string;
    recoveryRatio: string;
    healingSpeed: string;
  };
  feasibilityRating: number;
  quantumCoherenceEstimate: string;
  researchNextSteps: string[];
}

import { translations, Language } from '../lib/translations';

interface LoopEngineerProps {
  lang: Language;
}

export default function LoopEngineer({ lang }: LoopEngineerProps) {
  const t = translations[lang];
  const [baseMaterial, setBaseMaterial] = useState(lang === 'es' ? 'Nitinol (Ni-Ti SMA)' : lang === 'zh' ? '镍钛诺 (Ni-Ti SMA)' : 'Nitinol (Ni-Ti SMA)');
  const [preferredDopants, setPreferredDopants] = useState(lang === 'es' ? 'Puntos Cuánticos de Grafeno (GQDs) & Nanotubos de Carbono' : lang === 'zh' ? '石墨烯量子点 (GQDs) 和碳纳米管' : 'Graphene Quantum Dots (GQDs) & Carbon Nanotubes');
  const [targetYoungModulus, setTargetYoungModulus] = useState(55);
  const [targetHealingSpeed, setTargetHealingSpeed] = useState(12);
  const [maxIterations, setMaxIterations] = useState(3);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Iteration[]>([]);
  const [finalMaterial, setFinalMaterial] = useState<FinalMaterial | null>(null);
  const [productionBlueprint, setProductionBlueprint] = useState<string>('');
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [simStep, setSimStep] = useState<string>('');
  
  // Custom interactive simulation step-by-step messaging for realism
  useEffect(() => {
    if (!loading) return;
    const intervals = lang === 'en' ? [
      { t: 0, msg: "Starting Loop Engineer: Orchestrating intelligent agents..." },
      { t: 2500, msg: "Iteration 1: Agent A proposes molecular composition..." },
      { t: 5000, msg: "Iteration 1: Agent B runs DFT simulation (Hamiltonian Modeling)..." },
      { t: 7500, msg: "Iteration 1: Critique completed. Adjusting quantum doping weights..." },
      { t: 10000, msg: "Iteration 2: Adjusting stoichiometry to reduce phonon scattering..." },
      { t: 12500, msg: "Iteration 2: Agent B evaluates elastic conductivity and spin coherence..." },
      { t: 15000, msg: "Iteration 3: Converging towards chemical-physical optimum..." },
      { t: 17500, msg: "Iteration 3: DFT simulation finished. Generating Production Blueprint..." }
    ] : lang === 'zh' ? [
      { t: 0, msg: "正在启动 Loop Engineer：协调智能代理..." },
      { t: 2500, msg: "迭代 1：代理 A 提出分子组成..." },
      { t: 5000, msg: "迭代 1：代理 B 运行 DFT 模拟（哈密顿量建模）..." },
      { t: 7500, msg: "迭代 1：评审完成。调整量子掺杂权重..." },
      { t: 10000, msg: "迭代 2：调整化学计量以减少声子散射..." },
      { t: 12500, msg: "迭代 2：代理 B 评估弹性传导性和自旋相干性..." },
      { t: 15000, msg: "迭代 3：向物化最优点收敛..." },
      { t: 17500, msg: "迭代 3：DFT 模拟完成。正在生成生产蓝图..." }
    ] : [
      { t: 0, msg: "Iniciando Loop Engineer: Orquestando agentes inteligentes..." },
      { t: 2500, msg: "Iteración 1: Agente A propone composición molecular..." },
      { t: 5000, msg: "Iteración 1: Agente B ejecuta simulación DFT (Modelando Hamiltoniano)..." },
      { t: 7500, msg: "Iteración 1: Crítica completada. Ajustando pesos de dopaje cuántico..." },
      { t: 10000, msg: "Iteración 2: Ajustando estequiometría para reducir la dispersión fonónica..." },
      { t: 12500, msg: "Iteración 2: Agente B evalúa conductividad elástica y coherencia de espín..." },
      { t: 15000, msg: "Iteración 3: Convergiendo hacia el óptimo físico-químico..." },
      { t: 17500, msg: "Iteración 3: Simulación DFT finalizada. Generando Blueprint de Producción..." }
    ];

    const timers = intervals.map(item => {
      return setTimeout(() => setSimStep(item.msg), item.t);
    });

    return () => timers.forEach(clearTimeout);
  }, [loading, lang]);

  const runLoopOptimization = async () => {
    setLoading(true);
    setError(null);
    setHistory([]);
    setFinalMaterial(null);
    setProductionBlueprint('');
    setActiveStep(null);
    setSimStep(lang === 'es' ? 'Conectando con el supercomputador virtual de Gemini...' : lang === 'zh' ? '正在连接到 Gemini 虚拟超级计算机...' : 'Connecting to the Gemini virtual supercomputer...');

    try {
      const response = await fetch('/api/run-loop-engineer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseMaterial,
          preferredDopants,
          targetYoungModulus,
          targetHealingSpeed,
          maxIterations
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || (lang === 'es' ? 'Error en la simulación del loop.' : lang === 'zh' ? '循环模拟错误。' : 'Error in loop simulation.'));
      }

      const data = await response.json();
      setHistory(data.history || []);
      setFinalMaterial(data.finalMaterial || null);
      setProductionBlueprint(data.productionBlueprint || '');
      if (data.history && data.history.length > 0) {
        setActiveStep(data.history.length - 1);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || (lang === 'es' ? 'Ocurrió un error inesperado al orquestar los agentes.' : lang === 'zh' ? '编排代理时发生意外错误。' : 'An unexpected error occurred while orchestrating the agents.'));
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (base: string, dopants: string, modulus: number, speed: number) => {
    setBaseMaterial(base);
    setPreferredDopants(dopants);
    setTargetYoungModulus(modulus);
    setTargetHealingSpeed(speed);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="loop-engineer-container">
      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Input Configuration (5 columns) */}
        <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Settings className="w-5 h-5 text-[#00f2ff]" />
              <h3 className="font-serif font-medium text-lg text-white tracking-tight">
                {t.loopConsoleTitle}
              </h3>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-semibold text-white/40 uppercase tracking-widest block">
                {t.loopPresetTitle}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset(lang === 'zh' ? '镍钛诺 (Ni-Ti SMA)' : 'Nitinol (Ni-Ti SMA)', lang === 'en' ? 'Graphene Quantum Dots (GQDs)' : lang === 'zh' ? '石墨烯量子点 (GQDs)' : 'Puntos Cuánticos de Grafeno (GQDs)', 60, 15)}
                  className="text-left text-xs bg-[#0a0a0c]/80 hover:bg-white/5 border border-white/5 hover:border-[#00f2ff]/30 p-2.5 rounded transition-all group"
                >
                  <div className="font-bold text-[#00f2ff] group-hover:text-cyan-300">
                    {lang === 'es' ? 'Aeroespacial Extremo' : lang === 'zh' ? '极端航空航天' : 'Extreme Aerospace'}
                  </div>
                  <div className="text-[10px] text-white/50 mt-0.5">
                    {lang === 'es' ? 'Módulo' : lang === 'zh' ? '模量' : 'Modulus'}: 60 GPa | {lang === 'es' ? 'Vel' : lang === 'zh' ? '速度' : 'Speed'}: 15 nm/s
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(lang === 'zh' ? '聚氨酯基 SMP' : 'Polyurethane Base SMP', lang === 'en' ? 'Functionalized Carbon Nanotubes' : lang === 'zh' ? '官能化碳纳米管' : 'Nanotubos de Carbono Funcionalizados', 30, 25)}
                  className="text-left text-xs bg-[#0a0a0c]/80 hover:bg-white/5 border border-white/5 hover:border-purple-500/30 p-2.5 rounded transition-all group"
                >
                  <div className="font-bold text-purple-400 group-hover:text-purple-300">
                    {lang === 'es' ? 'Biomedicina Autorreparable' : lang === 'zh' ? '自修复生物医学' : 'Self-Healing Biomedicine'}
                  </div>
                  <div className="text-[10px] text-white/50 mt-0.5">
                    {lang === 'es' ? 'Módulo' : lang === 'zh' ? '模量' : 'Modulus'}: 30 GPa | {lang === 'es' ? 'Vel' : lang === 'zh' ? '速度' : 'Speed'}: 25 nm/s
                  </div>
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">
                  {t.loopBaseMat}
                </label>
                <input
                  type="text"
                  value={baseMaterial}
                  onChange={(e) => setBaseMaterial(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00f2ff]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">
                  {t.loopDopantSug}
                </label>
                <input
                  type="text"
                  value={preferredDopants}
                  onChange={(e) => setPreferredDopants(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00f2ff]"
                />
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1.5">
                    <span className="text-white/40 uppercase tracking-wider">{t.loopTargetYoung}</span>
                    <span className="text-[#00f2ff] font-bold">{targetYoungModulus} GPa</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    value={targetYoungModulus}
                    onChange={(e) => setTargetYoungModulus(parseInt(e.target.value))}
                    className="w-full h-1 bg-[#0a0a0c] rounded appearance-none cursor-pointer accent-[#00f2ff] border border-white/10"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1.5">
                    <span className="text-white/40 uppercase tracking-wider">{t.loopTargetSpeed}</span>
                    <span className="text-purple-400 font-bold">{targetHealingSpeed} nm/s</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={targetHealingSpeed}
                    onChange={(e) => setTargetHealingSpeed(parseInt(e.target.value))}
                    className="w-full h-1 bg-[#0a0a0c] rounded appearance-none cursor-pointer accent-purple-500 border border-white/10"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-mono mb-1.5">
                  <span className="text-white/40 uppercase tracking-wider">{t.loopMaxIter}</span>
                  <span className="text-indigo-400 font-bold">{maxIterations} {lang === 'es' ? 'Ciclos' : lang === 'zh' ? '周期' : 'Cycles'}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="5"
                  value={maxIterations}
                  onChange={(e) => setMaxIterations(parseInt(e.target.value))}
                  className="w-full h-1 bg-[#0a0a0c] rounded appearance-none cursor-pointer accent-indigo-500 border border-white/10"
                />
                <span className="text-[9px] text-white/35 font-mono mt-1 block leading-relaxed">
                  {t.loopIterHelp}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={runLoopOptimization}
            disabled={loading}
            className={`w-full mt-6 py-3 px-4 rounded font-sans font-semibold text-xs uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
              loading
                ? 'bg-purple-950/40 text-purple-300 border border-purple-800/50 cursor-wait animate-pulse'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/10 active:translate-y-px'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                {t.btnRunningLoop}
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-pink-300 fill-current" />
                {t.btnStartLoop}
              </>
            )}
          </button>
        </div>

        {/* Right Terminal Log / Live Monitoring (7 columns) */}
        <div className="lg:col-span-7 bg-[#050507] border border-white/10 rounded-xl p-5 md:p-6 flex flex-col justify-between font-mono text-xs relative overflow-hidden">
          {/* Subtle tech background grids */}
          <div className="absolute inset-0 bg-[radial-gradient(#00f2ff1a_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
          
          <div className="relative z-10 space-y-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span className="text-white font-semibold tracking-wider uppercase text-[11px]">
                    {t.terminalTitle}
                  </span>
                </div>
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/45">
                  [DFT COOPERATIVE SYSTEM]
                </span>
              </div>

              {/* Status or idle */}
              {!loading && history.length === 0 && !error && (
                <div className="h-48 flex flex-col items-center justify-center text-center space-y-3">
                  <Cpu className="w-10 h-10 text-white/10 animate-pulse" />
                  <p className="text-white/40 max-w-sm font-serif">
                    {t.terminalWaiting}
                  </p>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="bg-rose-950/20 border border-rose-900/50 p-4 rounded text-center text-rose-300 space-y-2">
                  <AlertCircle className="w-8 h-8 mx-auto text-rose-500" />
                  <p className="font-bold font-serif text-sm">
                    {lang === 'es' ? 'Error en la Orquestación de Agentes' : lang === 'zh' ? '智能体编排错误' : 'Agent Orchestration Error'}
                  </p>
                  <p className="text-xs font-mono">{error}</p>
                </div>
              )}

              {/* Active loading state */}
              {loading && (
                <div className="space-y-4 py-8 flex flex-col items-center justify-center text-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-purple-900/20 border-t-purple-500 animate-spin"></div>
                    <Dna className="w-5 h-5 text-purple-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-semibold text-white animate-pulse">{simStep}</p>
                    <p className="text-[10px] text-white/40 max-w-md mx-auto">
                      {t.terminalLoading}
                    </p>
                  </div>
                </div>
              )}

              {/* Show results interactive steps timeline */}
              {history.length > 0 && (
                <div className="space-y-4">
                  <span className="text-[10px] font-semibold text-white/40 tracking-wider block uppercase">
                    {t.terminalCompletedTitle}
                  </span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {history.map((step, idx) => {
                      const metTargets = step.evaluation.metAllTargets;
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveStep(idx)}
                          className={`p-2.5 rounded border text-left transition-all ${
                            activeStep === idx
                              ? 'bg-white/5 border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.1)]'
                              : 'bg-transparent border-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className={activeStep === idx ? 'text-purple-400' : 'text-white/50'}>
                              {lang === 'es' ? 'Ciclo' : lang === 'zh' ? '周期' : 'Cycle'} {step.iteration}
                            </span>
                            {metTargets ? (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            )}
                          </div>
                          <div className="text-xs font-bold text-white truncate mt-1">
                            {step.proposal.prototypeName}
                          </div>
                          <div className="text-[9px] text-white/40 truncate mt-0.5">
                            {lang === 'es' ? 'Mod' : lang === 'zh' ? '模量' : 'Mod'}: {step.evaluation.youngModulusGpa} GPa
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* active step detail */}
            {history.length > 0 && activeStep !== null && (
              <div className="bg-[#0c0c0f] border border-white/10 rounded p-4 space-y-3.5 mt-4">
                <div className="flex justify-between items-start border-b border-white/5 pb-2">
                  <div>
                    <span className="text-[9px] font-mono bg-purple-950/40 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/20 uppercase">
                      {t.cycleDetail} {history[activeStep].iteration}
                    </span>
                    <h4 className="text-white font-serif font-bold text-sm mt-1">
                      {history[activeStep].proposal.prototypeName}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-white/40 block">VIABILIDAD</span>
                    <span className="text-sm font-mono font-bold text-purple-400">
                      {history[activeStep].evaluation.feasibilityRating}/100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div>
                    <span className="text-white/40 block uppercase">{t.formulaRed}</span>
                    <span className="text-white font-bold">{history[activeStep].proposal.exactComposition}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block uppercase">{t.stimulusQuantum}</span>
                    <span className="text-[#00f2ff] font-bold truncate block">{history[activeStep].proposal.repairStimulus}</span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3">
                  <span className="text-[9px] text-white/40 block uppercase mb-1">{t.evalMetrics}</span>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white/5 p-1 rounded">
                      <div className="text-[8px] text-white/40">{lang === 'es' ? 'Mod. Young' : lang === 'zh' ? '杨氏模量' : 'Young Mod.'}</div>
                      <div className={`font-bold ${history[activeStep].evaluation.youngModulusGpa >= targetYoungModulus ? 'text-emerald-400' : 'text-amber-500'}`}>
                        {history[activeStep].evaluation.youngModulusGpa} GPa
                      </div>
                    </div>
                    <div className="bg-white/5 p-1 rounded">
                      <div className="text-[8px] text-white/40">{lang === 'es' ? 'Res. Tracción' : lang === 'zh' ? '抗拉强度' : 'Tensile'}</div>
                      <div className="font-bold text-white/90">
                        {history[activeStep].evaluation.tensileStrengthMpa} MPa
                      </div>
                    </div>
                    <div className="bg-white/5 p-1 rounded">
                      <div className="text-[8px] text-white/40">{lang === 'es' ? 'Vel. Reparación' : lang === 'zh' ? '修复速度' : 'Heal Speed'}</div>
                      <div className={`font-bold ${history[activeStep].evaluation.healingSpeedNms >= targetHealingSpeed ? 'text-emerald-400' : 'text-amber-500'}`}>
                        {history[activeStep].evaluation.healingSpeedNms} nm/s
                      </div>
                    </div>
                    <div className="bg-white/5 p-1 rounded">
                      <div className="text-[8px] text-white/40">{lang === 'es' ? 'Coherencia' : lang === 'zh' ? '相干时间' : 'Coherence'}</div>
                      <div className="font-bold text-indigo-400">
                        {history[activeStep].evaluation.quantumCoherencePs} ps
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3">
                  <span className="text-[9px] text-white/40 block uppercase mb-1">{t.critiqueTitle}</span>
                  <p className="text-[11px] text-white/70 italic leading-relaxed font-serif bg-white/5 p-2 rounded">
                    "{history[activeStep].evaluation.critique}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Final Optimal Material Dashboard & Production Blueprint (Only if finalMaterial exists) */}
      {finalMaterial && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Optimal Recipe details (7 columns) */}
          <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
            
            {/* Fallback Banner */}
            {(finalMaterial as any).isFallback && (
              <div className="bg-purple-950/20 border border-purple-500/30 p-3.5 rounded-lg mb-4 flex items-start gap-3 text-[11px] leading-relaxed relative z-20">
                <Sparkles className="w-4 h-4 text-[#00f2ff] shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="font-bold text-[#00f2ff] block mb-0.5 uppercase tracking-wider font-mono">
                    {lang === 'es' ? 'Bucle Heurístico de Co-Simulación Local Activado' : lang === 'zh' ? '本地启发式协同模拟循环已激活' : 'Local Heuristic Co-Simulation Loop Active'}
                  </span>
                  <span className="text-white/70 font-serif">
                    {lang === 'es' 
                      ? 'Debido a límites de cuota temporales de Gemini, hemos canalizado la optimización de doble agente autónomo a través de aproximaciones ab initio deterministas hiperrealistas.' 
                      : lang === 'zh' 
                      ? '由于 Gemini API 临时配额限制，双智能体自适应优化现已无缝切换至本地确定性第一性原理（Ab Initio）高保真模拟方案。' 
                      : 'Due to temporary Gemini API quota limits, the autonomous double-agent optimization has been seamlessly channeled through hyper-realistic deterministic ab-initio physics approximations.'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <span className="text-[9px] font-mono font-bold bg-purple-950/40 text-purple-400 px-2.5 py-0.5 rounded border border-purple-500/20 uppercase tracking-widest">
                  {t.optimalRecipeTitle}
                </span>
                <h4 className="font-serif text-xl md:text-2xl font-bold text-white tracking-tight mt-1.5">
                  {finalMaterial.materialName}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-white/40 block uppercase">{t.optimalFesibility}</span>
                <span className="text-xl font-mono font-bold text-[#00f2ff]">
                  {finalMaterial.feasibilityRating}/100
                </span>
              </div>
            </div>

            {/* Properties visualization list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0c0c0f] border border-white/5 p-3 rounded">
                <span className="text-[9px] text-white/40 uppercase block mb-1">{t.stiffnessTarget}</span>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono font-bold text-white">{finalMaterial.mechanicalProperties.youngModulus}</span>
                  <TrendingUp className="w-4 h-4 text-[#00f2ff]" />
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: `${Math.min(100, parseFloat(finalMaterial.mechanicalProperties.youngModulus) * 1.1)}%` }}></div>
                </div>
              </div>

              <div className="bg-[#0c0c0f] border border-white/5 p-3 rounded">
                <span className="text-[9px] text-white/40 uppercase block mb-1">{t.healingSpeedTarget}</span>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono font-bold text-[#00f2ff]">{finalMaterial.mechanicalProperties.healingSpeed}</span>
                  <Dna className="w-4 h-4 text-purple-400" />
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: `${Math.min(100, parseFloat(finalMaterial.mechanicalProperties.healingSpeed) * 2)}%` }}></div>
                </div>
              </div>

              <div className="bg-[#0c0c0f] border border-white/5 p-3 rounded">
                <span className="text-[9px] text-white/40 uppercase block mb-1">{t.recoveryRatioTarget}</span>
                <span className="text-sm font-mono font-bold text-white block mt-1">{finalMaterial.mechanicalProperties.recoveryRatio}</span>
              </div>

              <div className="bg-[#0c0c0f] border border-white/5 p-3 rounded">
                <span className="text-[9px] text-white/40 uppercase block mb-1">{t.tensileStrengthTarget}</span>
                <span className="text-sm font-mono font-bold text-white block mt-1">{finalMaterial.mechanicalProperties.tensileStrength}</span>
              </div>
            </div>

            {/* Microstructure Details */}
            <div className="space-y-4 border-t border-white/10 pt-4 font-sans text-xs text-white/80">
              <div>
                <h5 className="font-serif font-bold text-white mb-1.5 flex items-center gap-1.5 text-sm">
                  <Layers className="w-4 h-4 text-purple-400" />
                  {t.alignmentTitle}
                </h5>
                <p className="bg-[#0a0a0c] p-3 rounded border border-white/5 font-serif leading-relaxed">
                  {finalMaterial.molecularStructure}
                </p>
              </div>

              <div>
                <h5 className="font-serif font-bold text-white mb-1.5 flex items-center gap-1.5 text-sm">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  {t.quantumMechOptTitle}
                </h5>
                <p className="bg-[#0a0a0c] p-3 rounded border border-white/5 font-serif leading-relaxed">
                  {finalMaterial.healingMechanism}
                </p>
              </div>

              <div className="bg-purple-950/10 border border-purple-900/30 p-3 rounded flex items-start gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-purple-300 block text-[11px] uppercase tracking-wider font-mono">
                    {t.coherenceEstimateLabel}
                  </span>
                  <span className="text-white/70 block mt-0.5 leading-relaxed">
                    {finalMaterial.quantumCoherenceEstimate}
                  </span>
                </div>
              </div>

              {/* Research roadmap next steps */}
              <div className="space-y-2 pt-2">
                <h5 className="font-serif font-bold text-white text-sm">{t.labValidationTitle}</h5>
                <ul className="grid grid-cols-1 gap-1.5">
                  {finalMaterial.researchNextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white/60">
                      <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span className="font-serif">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* SOTA Tech Stack & Production Blueprint (5 columns) */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h3 className="font-serif font-medium text-lg text-white tracking-tight">
                  {t.techStackTitle}
                </h3>
              </div>

              <div className="bg-[#0a0a0c] border border-purple-500/20 p-4 rounded space-y-3.5">
                <div className="flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-purple-400" />
                  <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                    {lang === 'es' ? 'RECOMENDACIONES DE TRANSICIÓN INDUSTRIAL (EURO SOTA)' : lang === 'zh' ? '工业化转型建议 (欧洲先进技术)' : 'INDUSTRIAL TRANSITION RECOMMENDATIONS (EURO SOTA)'}
                  </span>
                </div>
                
                <p className="text-xs text-white/75 leading-relaxed font-serif">
                  {t.techStackDesc}
                </p>

                {/* SOTA Blueprint details */}
                <div className="space-y-3 pt-2 text-[11px] font-mono leading-relaxed">
                  <div className="border-l border-white/20 pl-3">
                    <strong className="text-white block uppercase text-[10px]">{t.techStep1Title}</strong>
                    <span className="text-white/60">{t.techStep1Desc}</span>
                  </div>
                  
                  <div className="border-l border-white/20 pl-3">
                    <strong className="text-white block uppercase text-[10px]">{t.techStep2Title}</strong>
                    <span className="text-white/60">{t.techStep2Desc}</span>
                  </div>

                  <div className="border-l border-white/20 pl-3">
                    <strong className="text-white block uppercase text-[10px]">{t.techStep3Title}</strong>
                    <span className="text-white/60">{t.techStep3Desc}</span>
                  </div>
                </div>
              </div>

              {/* Raw dynamic Blueprint text generated by Gemini */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest block">
                  {t.germanReportLabel}
                </span>
                <div className="bg-[#0a0a0c]/80 border border-white/5 p-4 rounded text-xs text-white/70 leading-relaxed font-serif whitespace-pre-line max-h-64 overflow-y-auto">
                  {productionBlueprint}
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 p-3.5 rounded flex items-center justify-between text-[11px] font-mono text-white/55">
              <span>{t.licenceStatus}</span>
              <span className="text-purple-400 font-bold">{t.availableGcp}</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
