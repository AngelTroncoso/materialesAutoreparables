import { useState } from 'react';
import { SimulationParams } from './types';
import LatticeSimulator from './components/LatticeSimulator';
import EquationSandbox from './components/EquationSandbox';
import MaterialSynthesizer from './components/MaterialSynthesizer';
import LoopEngineer from './components/LoopEngineer';
import ScientificDocumentation from './components/ScientificDocumentation';
import QuantumSpecsDeck from './components/QuantumSpecsDeck';
import { Atom, Award, BookOpen, Layers, Lightbulb, Sparkles, Cpu, Globe, Sliders } from 'lucide-react';
import { translations, Language } from './lib/translations';

export default function App() {
  const [lang, setLang] = useState<Language>('es');
  const t = translations[lang];

  const [params, setParams] = useState<SimulationParams>({
    materialType: 'SMA', // SMA (Nitinol) or SMP (Shape Memory Polymer)
    quantumMode: 'TUNNELING', // NONE (classical Arrhenius), TUNNELING, ENTANGLEMENT
    temperature: 293, // Kelvin
    barrierWidth: 0.24, // nm
    barrierHeight: 1.80, // eV
    coherenceField: 85, // %
    activeSpecs: {
      phononShielding: true,
      topologicalPinning: false,
      blochResonance: true,
      gnomeHpc: false,
      quantumTomography: true,
      picosecondLaser: false,
      kryoIsolation: false,
    },
  });

  const [activeTab, setActiveTab] = useState<'sim' | 'ai' | 'loop' | 'docs' | 'specs'>('sim');

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e0e0e0] flex flex-col font-sans selection:bg-[#00f2ff]/30 selection:text-white">
      {/* Top Banner Accent Line */}
      <div className="h-[2px] bg-gradient-to-r from-[#00f2ff] via-indigo-500 to-purple-600"></div>

      {/* Hero Header */}
      <header className="border-b border-white/10 bg-[#0a0a0c]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-5 md:py-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#00f2ff] font-semibold italic">
              {t.unit}
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif tracking-tight text-white leading-none">
              {t.title} <span className="text-white/40 italic">{t.and}</span> {t.subtitle}
            </h1>
          </div>

          {/* Right Indicator and Navigation Tab container */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-md shrink-0">
              <Globe className="w-3.5 h-3.5 text-white/50 ml-1.5 mr-1" />
              <button
                onClick={() => setLang('es')}
                className={`px-2 py-1 rounded text-[10px] font-mono transition-all ${
                  lang === 'es'
                    ? 'bg-[#00f2ff]/20 text-[#00f2ff] font-bold border border-[#00f2ff]/25'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded text-[10px] font-mono transition-all ${
                  lang === 'en'
                    ? 'bg-[#00f2ff]/20 text-[#00f2ff] font-bold border border-[#00f2ff]/25'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('zh')}
                className={`px-2 py-1 rounded text-[10px] font-mono transition-all ${
                  lang === 'zh'
                    ? 'bg-[#00f2ff]/20 text-[#00f2ff] font-bold border border-[#00f2ff]/25'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                中文
              </button>
            </div>

            {/* Realtime coherence indicator from Design HTML */}
            <div className="text-left sm:text-right shrink-0">
              <div className="text-[10px] font-mono text-white/50 mb-1 tracking-wider">{t.coherence}: {params.quantumMode === 'NONE' ? '0.0%' : `${params.coherenceField}.4%`}</div>
              <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00f2ff] shadow-[0_0_10px_#00f2ff] transition-all duration-500" 
                  style={{ width: params.quantumMode === 'NONE' ? '0%' : `${params.coherenceField}%` }}
                ></div>
              </div>
            </div>

            {/* Tab Navigation Controls */}
            <div className="flex bg-white/5 border border-white/10 p-1 rounded-lg self-start">
              <button
                onClick={() => setActiveTab('sim')}
                id="tab-simulador"
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium font-sans transition-all flex items-center gap-1.5 ${
                  activeTab === 'sim'
                    ? 'bg-white/5 text-[#00f2ff] border border-[#00f2ff]/30 shadow-[0_0_8px_rgba(0,242,255,0.15)] font-semibold'
                    : 'text-white/60 hover:text-white border border-transparent'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                {t.tabSim}
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                id="tab-sintetizador"
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium font-sans transition-all flex items-center gap-1.5 ${
                  activeTab === 'ai'
                    ? 'bg-white/5 text-purple-400 border border-purple-500/30 shadow-[0_0_8px_rgba(168,85,247,0.15)] font-semibold'
                    : 'text-white/60 hover:text-white border border-transparent'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {t.tabAi}
              </button>
              <button
                onClick={() => setActiveTab('loop')}
                id="tab-loop-engineer"
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium font-sans transition-all flex items-center gap-1.5 ${
                  activeTab === 'loop'
                    ? 'bg-white/5 text-cyan-400 border border-[#00f2ff]/30 shadow-[0_0_8px_rgba(0,242,255,0.15)] font-semibold'
                    : 'text-white/60 hover:text-white border border-transparent'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                {t.tabLoop}
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                id="tab-documentos"
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium font-sans transition-all flex items-center gap-1.5 ${
                  activeTab === 'docs'
                    ? 'bg-white/5 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.15)] font-semibold'
                    : 'text-white/60 hover:text-white border border-transparent'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                {t.tabDocs}
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                id="tab-especificaciones"
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium font-sans transition-all flex items-center gap-1.5 ${
                  activeTab === 'specs'
                    ? 'bg-white/5 text-purple-400 border border-purple-500/30 shadow-[0_0_8px_rgba(168,85,247,0.15)] font-semibold'
                    : 'text-white/60 hover:text-white border border-transparent'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                {t.tabSpecs}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {activeTab === 'sim' && (
          <div className="space-y-6">
            {/* Simulation Parameter Controls Bar */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-4 items-center">
                {/* Material Base Selector */}
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-white/40 mb-1 tracking-wider uppercase">{t.matrizBase}</span>
                  <div className="flex bg-[#0a0a0c] p-0.5 rounded border border-white/10">
                    <button
                      onClick={() => setParams(prev => ({ ...prev, materialType: 'SMA' }))}
                      id="opt-sma"
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        params.materialType === 'SMA'
                          ? 'bg-white/5 text-[#00f2ff] font-semibold border border-[#00f2ff]/20'
                          : 'text-white/55 hover:text-white'
                      }`}
                    >
                      {t.metallicSMA}
                    </button>
                    <button
                      onClick={() => setParams(prev => ({ ...prev, materialType: 'SMP' }))}
                      id="opt-smp"
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        params.materialType === 'SMP'
                          ? 'bg-white/5 text-[#00f2ff] font-semibold border border-[#00f2ff]/20'
                          : 'text-white/55 hover:text-white'
                      }`}
                    >
                      {t.polymerSMP}
                    </button>
                  </div>
                </div>

                {/* Quantum Mode Selector */}
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-white/40 mb-1 tracking-wider uppercase">{t.mecanismoEnlace}</span>
                  <div className="flex bg-[#0a0a0c] p-0.5 rounded border border-white/10">
                    <button
                      onClick={() => setParams(prev => ({ ...prev, quantumMode: 'NONE' }))}
                      id="opt-classical"
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        params.quantumMode === 'NONE'
                          ? 'bg-white/5 text-amber-400 font-semibold border border-amber-500/20'
                          : 'text-white/55 hover:text-white'
                      }`}
                    >
                      {t.classicalDiff}
                    </button>
                    <button
                      onClick={() => setParams(prev => ({ ...prev, quantumMode: 'TUNNELING' }))}
                      id="opt-tunneling"
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        params.quantumMode === 'TUNNELING'
                          ? 'bg-white/5 text-[#00f2ff] font-semibold border border-[#00f2ff]/20'
                          : 'text-white/55 hover:text-white'
                      }`}
                    >
                      {t.quantumTunnel}
                    </button>
                    <button
                      onClick={() => setParams(prev => ({ ...prev, quantumMode: 'ENTANGLEMENT' }))}
                      id="opt-entanglement"
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        params.quantumMode === 'ENTANGLEMENT'
                          ? 'bg-white/5 text-indigo-400 font-semibold border border-indigo-500/20'
                          : 'text-white/55 hover:text-white'
                      }`}
                    >
                      {t.quantumEntangle}
                    </button>
                  </div>
                </div>
              </div>

              {/* Slider Field for local coherence */}
              {params.quantumMode !== 'NONE' && (
                <div className="flex flex-col w-full sm:w-52">
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-white/40 uppercase tracking-wider">{t.campoCoherente}</span>
                    <span className="text-[#00f2ff] font-bold">{params.coherenceField}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={params.coherenceField}
                    onChange={(e) => setParams(prev => ({ ...prev, coherenceField: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-[#0a0a0c] rounded border border-white/10 appearance-none cursor-pointer accent-[#00f2ff]"
                  />
                </div>
              )}
            </div>

            {/* Core simulation stage (Two column layout on desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7">
                <LatticeSimulator params={params} setParams={setParams} lang={lang} />
              </div>
              <div className="lg:col-span-5">
                <EquationSandbox params={params} setParams={setParams} lang={lang} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-6">
            {/* Banner block for AI */}
            <div className="bg-gradient-to-r from-purple-950/10 via-[#0a0a0c] to-slate-950 border border-white/10 rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="w-5 h-5 text-purple-400" />
                  <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-widest">
                    {t.aiSubtitle}
                  </span>
                </div>
                <h2 className="font-serif text-xl md:text-2xl font-bold text-white tracking-tight">
                  {t.aiTitle}
                </h2>
                <p className="text-xs text-white/60 leading-relaxed font-serif">
                  {t.aiDesc}
                </p>
              </div>
              <div className="bg-[#0a0a0c] border border-white/10 p-3.5 rounded-lg text-center flex items-center gap-3 shrink-0">
                <Award className="w-10 h-10 text-pink-400 animate-pulse" />
                <div className="text-left">
                  <span className="text-[10px] font-mono text-white/40 block">{t.engineId}</span>
                  <span className="text-xs font-bold font-mono text-purple-300">GEMINI 3.5 FLASH</span>
                </div>
              </div>
            </div>

            <MaterialSynthesizer lang={lang} />
          </div>
        )}

        {activeTab === 'loop' && (
          <div className="space-y-6">
            {/* Banner block for Loop Engineer */}
            <div className="bg-gradient-to-r from-cyan-950/15 via-[#0a0a0c] to-slate-950 border border-white/10 rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-5 h-5 text-[#00f2ff] animate-pulse" />
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
                    {t.loopSubtitle}
                  </span>
                </div>
                <h2 className="font-serif text-xl md:text-2xl font-bold text-white tracking-tight">
                  {t.loopTitle}
                </h2>
                <p className="text-xs text-white/60 leading-relaxed font-serif">
                  {t.loopDesc}
                </p>
              </div>
              <div className="bg-[#0a0a0c] border border-white/10 p-3.5 rounded-lg text-center flex items-center gap-3 shrink-0">
                <Cpu className="w-10 h-10 text-cyan-400 animate-pulse" />
                <div className="text-left">
                  <span className="text-[10px] font-mono text-white/40 block">{t.systemStatus}</span>
                  <span className="text-xs font-bold font-mono text-emerald-400">{t.doubleAgentOnline}</span>
                </div>
              </div>
            </div>

            <LoopEngineer lang={lang} />
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-6 animate-fade-in">
            <ScientificDocumentation lang={lang} />
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="space-y-6 animate-fade-in">
            {/* Banner block for Specs */}
            <div className="bg-gradient-to-r from-purple-950/15 via-[#0a0a0c] to-slate-950 border border-white/10 rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-5 h-5 text-purple-400" />
                  <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-widest">
                    {t.specsSubtitle}
                  </span>
                </div>
                <h2 className="font-serif text-xl md:text-2xl font-bold text-white tracking-tight">
                  {t.specsTitle}
                </h2>
                <p className="text-xs text-white/60 leading-relaxed font-serif">
                  {t.specsDesc}
                </p>
              </div>
              <div className="bg-[#0a0a0c] border border-white/10 p-3.5 rounded-lg text-center flex items-center gap-3 shrink-0">
                <Sliders className="w-10 h-10 text-purple-400 animate-pulse" />
                <div className="text-left">
                  <span className="text-[10px] font-mono text-white/40 block">{lang === 'es' ? 'NIVEL INDUSTRIAL' : lang === 'zh' ? '工业级标准' : 'INDUSTRIAL SOTA'}</span>
                  <span className="text-xs font-bold font-mono text-purple-300">EURO-SOTA 300K</span>
                </div>
              </div>
            </div>

            <QuantumSpecsDeck params={params} setParams={setParams} lang={lang} />
          </div>
        )}
      </main>

      {/* Footer information bar */}
      <footer className="border-t border-white/5 bg-[#0a0a0c] py-5 text-center text-[10px] text-white/40 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex gap-4 uppercase tracking-widest">
            <span>SYS: NANOTECH_CORE_021</span>
            <span>LOC: LAB_S2_OMEGA</span>
            <span>AUT: AI_ASSISTED_SIMULATION</span>
          </div>
          <span className="bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-[#00f2ff] font-bold uppercase tracking-tighter rounded">
            {t.protocol}
          </span>
        </div>
      </footer>
    </div>
  );
}
