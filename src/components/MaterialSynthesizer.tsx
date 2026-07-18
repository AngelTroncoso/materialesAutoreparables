import React, { useState } from 'react';
import { CustomMaterial, SynthesisResult } from '../types';
import { Sparkles, Brain, Cpu, Atom, AlertCircle, FileText, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { translations, Language } from '../lib/translations';

interface MaterialSynthesizerProps {
  lang: Language;
}

export default function MaterialSynthesizer({ lang }: MaterialSynthesizerProps) {
  const t = translations[lang];
  const [material, setMaterial] = useState<CustomMaterial>({
    name: '',
    baseMaterial: lang === 'es' ? 'Nitinol (Aleación de Ni-Ti)' : lang === 'zh' ? '镍钛诺 (Ni-Ti 合金)' : 'Nitinol (Ni-Ti Alloy)',
    dopant: lang === 'es' ? 'Puntos Cuánticos de Seleniuro de Cadmio (CdSe)' : lang === 'zh' ? '硒化镉 (CdSe) 量子点' : 'Cadmium Selenide (CdSe) Quantum Dots',
    trigger: lang === 'es' ? 'Activación Coherente por Láser Infrarrojo' : lang === 'zh' ? '红外激光相干激活' : 'Coherent Infrared Laser Activation',
    notes: lang === 'es' ? 'Orientado a aplicaciones en deflectores de flujo aeroespacial de bajo perfil.' : lang === 'zh' ? '适用于低剖面航空航天导流板应用。' : 'Targeted for low-profile aerospace flow deflector applications.',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SynthesisResult | null>(null);

  const predefinedMaterials = lang === 'en' ? [
    {
      name: 'Nitinol-Q (SMA)',
      baseMaterial: 'Nitinol (Nickel-Titanium)',
      dopant: 'Overlapped CdSe quantum dots',
      trigger: 'RF (Radiofrequency) coherence field induction',
      notes: 'Optimized for self-healing vascular implants without structural fatigue.',
    },
    {
      name: 'Kevlar-Q-SMP (SMP)',
      baseMaterial: 'Thermoplastic Polyurethane with Kevlar microstructures',
      dopant: 'Spin-coherent doped carbon nanotubes',
      trigger: 'Localized thermal pulse + resonant microwaves',
      notes: 'For lightweight tactical shields with ballistic recovery in seconds.',
    },
    {
      name: 'BioHeal Elastomer (SMP)',
      baseMaterial: 'Elastomeric poly(lactic-co-glycolic acid) (PLGA)',
      dopant: 'Topological bismuth nanoparticles',
      trigger: 'Normal body temperature (37°C) catalyzed by infrared photons',
      notes: 'Designed for self-healing bone regeneration scaffolds.',
    }
  ] : lang === 'zh' ? [
    {
      name: 'Nitinol-Q (SMA)',
      baseMaterial: '镍钛诺 (镍钛合金)',
      dopant: '重叠 CdSe 量子点',
      trigger: '射频 (RF) 相干场诱导',
      notes: '针对无结构疲劳的自愈合血管支架进行优化。',
    },
    {
      name: 'Kevlar-Q-SMP (SMP)',
      baseMaterial: '具有凯夫拉微结构的聚氨酯弹性体',
      dopant: '自旋相干掺杂碳纳米管',
      trigger: '局部热脉冲 + 共振微波',
      notes: '用于数秒内防弹复原的轻型战术防护盾。',
    },
    {
      name: 'BioHeal Elastomer (SMP)',
      baseMaterial: '弹性聚乳酸-羟基乙酸共聚物 (PLGA)',
      dopant: '拓扑铋纳米粒子',
      trigger: '红外光子催化的正常体温 (37°C)',
      notes: '专为自愈合骨再生支架设计。',
    }
  ] : [
    {
      name: 'Nitinol-Q (SMA)',
      baseMaterial: 'Nitinol (Níquel-Titanio)',
      dopant: 'Puntos cuánticos de CdSe superpuestos',
      trigger: 'Inducción de campo de coherencia RF (Radiofrecuencia)',
      notes: 'Optimizada para implantes vasculares auto-reparables sin fatiga estructural.',
    },
    {
      name: 'Kevlar-Q-SMP (SMP)',
      baseMaterial: 'Poliuretano Termoplástico con microestructuras de Kevlar',
      dopant: 'Nanotubos de carbono dopados con espín-coherente',
      trigger: 'Pulso térmico localizado + microondas resonantes',
      notes: 'Para blindajes tácticos ligeros con recuperación balística en segundos.',
    },
    {
      name: 'BioHeal Elastomer (SMP)',
      baseMaterial: 'Ácido poliláctico-co-glicólico (PLGA) elastomérico',
      dopant: 'Nanopartículas topológicas de bismuto',
      trigger: 'Temperatura corporal normal (37°C) catalizada por fotones infrarrojos',
      notes: 'Diseñado para andamios de regeneración celular ósea autorreparables.',
    }
  ];

  const applyPredefined = (item: typeof predefinedMaterials[0]) => {
    setMaterial({
      name: item.name,
      baseMaterial: item.baseMaterial,
      dopant: item.dopant,
      trigger: item.trigger,
      notes: item.notes,
    });
  };

  const handleSynthesize = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/simulate-material', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(material),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'API_KEY_MISSING') {
          const keyMsg = lang === 'es'
            ? 'La API de Gemini no está configurada. Por favor, añada su GEMINI_API_KEY en la pestaña Secrets de Google AI Studio.'
            : lang === 'zh'
            ? 'Gemini API 未配置。请在 Google AI Studio 的 Secrets 选项卡中添加您的 GEMINI_API_KEY。'
            : 'Gemini API is not configured. Please add your GEMINI_API_KEY in the Secrets tab of Google AI Studio.';
          throw new Error(keyMsg);
        }
        throw new Error(data.message || (lang === 'es' ? 'Error al procesar la simulación.' : lang === 'zh' ? '模拟处理错误。' : 'Error processing simulation.'));
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      const fallbackErr = lang === 'es'
        ? 'Ocurrió un error inesperado al conectar con el laboratorio de IA.'
        : lang === 'zh'
        ? '连接 AI 实验室时发生意外错误。'
        : 'An unexpected error occurred while connecting to the AI laboratory.';
      setError(err.message || fallbackErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 shadow-2xl" id="material-synthesizer-container">
      <div className="flex items-center gap-2 mb-5">
        <Brain className="w-5 h-5 text-purple-400" />
        <h3 className="font-serif font-medium text-lg text-white tracking-tight">
          {t.synthTitle}
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Presets */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <span className="text-[10px] font-mono font-semibold text-white/55 uppercase tracking-wider block mb-2">
              {t.presetTemplates}
            </span>
            <div className="grid grid-cols-1 gap-2">
              {predefinedMaterials.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPredefined(item)}
                  className="text-left text-xs bg-[#0a0a0c]/60 hover:bg-white/5 border border-white/10 p-2.5 rounded transition-all text-white/80 hover:text-white flex items-center justify-between group"
                >
                  <div className="truncate">
                    <div className="font-bold text-[#00f2ff] group-hover:text-[#00e0eb]">{item.name}</div>
                    <div className="text-[10px] text-white/40 truncate mt-0.5">{item.baseMaterial}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#00f2ff] shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSynthesize} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">{t.protoName}</label>
              <input
                type="text"
                required
                placeholder={lang === 'es' ? 'Ej. Nitinol-X3 / QuantumElast-Q' : lang === 'zh' ? '例如 Nitinol-X3 / QuantumElast-Q' : 'e.g., Nitinol-X3 / QuantumElast-Q'}
                value={material.name}
                onChange={(e) => setMaterial(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#0a0a0c] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00f2ff] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">{t.matrixMat}</label>
              <input
                type="text"
                required
                value={material.baseMaterial}
                onChange={(e) => setMaterial(prev => ({ ...prev, baseMaterial: e.target.value }))}
                className="w-full bg-[#0a0a0c] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00f2ff] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">{t.quantumDop}</label>
              <input
                type="text"
                required
                value={material.dopant}
                onChange={(e) => setMaterial(prev => ({ ...prev, dopant: e.target.value }))}
                className="w-full bg-[#0a0a0c] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00f2ff] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">{t.triggerMat}</label>
              <input
                type="text"
                required
                value={material.trigger}
                onChange={(e) => setMaterial(prev => ({ ...prev, trigger: e.target.value }))}
                className="w-full bg-[#0a0a0c] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00f2ff] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">{t.notesHyp}</label>
              <textarea
                placeholder={lang === 'es' ? 'Añada variables de diseño aeroespacial, médico o condiciones extremas...' : lang === 'zh' ? '添加航空航天、医疗设计变量或极端条件...' : 'Add aerospace, medical design variables or extreme conditions...'}
                value={material.notes}
                onChange={(e) => setMaterial(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
                className="w-full bg-[#0a0a0c] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00f2ff] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              id="btn-trigger-ai-synthesis"
              className={`w-full py-3 px-4 rounded font-sans font-semibold text-xs uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
                loading
                  ? 'bg-purple-950/40 text-purple-300 border border-purple-800/50 cursor-wait animate-pulse'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/10 active:translate-y-px'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  {t.synthesizing}
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5 text-pink-300" />
                  {t.btnTriggerSynth}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: AI Analysis Result Dossier */}
        <div className="lg:col-span-7 flex flex-col justify-center min-h-[350px]">
          {loading && (
            <div className="bg-[#0a0a0c]/40 border border-white/5 p-8 rounded text-center space-y-4 animate-pulse">
              <Atom className="w-12 h-12 text-[#00f2ff] mx-auto animate-spin" />
              <div className="space-y-1">
                <p className="font-serif font-medium text-white">{t.aiProgressTitle}</p>
                <p className="text-xs text-white/50 max-w-sm mx-auto">
                  {t.aiProgressDesc}
                </p>
              </div>
              <div className="flex justify-center gap-1.5 text-[10px] font-mono text-white/35">
                <span>[DFT simulation]</span>
                <span>[Wavepacket boundary solve]</span>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="bg-rose-950/25 border border-rose-900/50 p-6 rounded text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
              <div className="space-y-1">
                <p className="font-bold text-rose-200">{lang === 'es' ? 'Error de Simulación' : lang === 'zh' ? '模拟错误' : 'Simulation Error'}</p>
                <p className="text-xs text-rose-300">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && !result && (
            <div className="bg-white/5 border border-white/10 p-10 rounded text-center space-y-3 flex flex-col items-center justify-center border-dashed">
              <FileText className="w-12 h-12 text-white/20 mb-1" />
              <p className="font-serif text-white/60 text-sm max-w-md">
                {t.aiSynthPlaceholder}
              </p>
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider mt-2">
                {t.aiSynthFooter}
              </span>
            </div>
          )}

          {!loading && !error && result && (
            <div className="bg-[#0a0a0c] border border-white/10 rounded p-5 md:p-6 space-y-5 shadow-inner relative overflow-hidden animate-fade-in">
              {result.isFallback && (
                <div className="bg-purple-950/20 border border-purple-500/30 p-3.5 rounded-lg flex items-start gap-3 text-[11px] leading-relaxed">
                  <Sparkles className="w-4 h-4 text-[#00f2ff] shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-bold text-[#00f2ff] block mb-0.5 uppercase tracking-wider font-mono">
                      {lang === 'es' ? 'Simulación Heurística Local Activada' : lang === 'zh' ? '本地启发式模拟已激活' : 'Local Heuristic Simulation Active'}
                    </span>
                    <span className="text-white/70 font-serif">
                      {lang === 'es' 
                        ? 'Se superó el límite de cuota o no se detectó la clave de la API de Gemini. Se ha activado el motor local de simulación cuántica sintonizado por DFT heurística para garantizar la disponibilidad ininterrumpida.' 
                        : lang === 'zh' 
                        ? '已达到配额限制或未检测到 Gemini API 密钥。已激活经由启发式 DFT 微调的本地量子物理模拟引擎，以确保系统无间断的高可用运行。' 
                        : 'Quota limit exceeded or Gemini API key unconfigured. The local quantum physics simulation engine fine-tuned by heuristic DFT has been activated to ensure 100% uninterrupted availability.'}
                    </span>
                  </div>
                </div>
              )}

              {/* Technical Badge Header */}
              <div className="flex justify-between items-start gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[9px] font-mono font-bold text-purple-400 border border-purple-500/20 bg-purple-950/30 px-2 py-0.5 rounded uppercase tracking-wider">
                    {t.techAnalysis}
                  </span>
                  <h4 className="font-serif text-xl md:text-2xl font-bold text-white tracking-tight mt-1.5">
                    {result.materialName}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-white/40 block">{t.viabilityDft}</span>
                  <span className={`text-xl font-mono font-bold ${result.feasibilityRating >= 70 ? 'text-emerald-400' : result.feasibilityRating >= 40 ? 'text-yellow-400' : 'text-rose-400'}`}>
                    {result.feasibilityRating}/100
                  </span>
                </div>
              </div>

              {/* Grid Properties */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white/5 border border-white/5 p-2 rounded">
                  <span className="text-[10px] text-white/50 block">{t.youngModulus}</span>
                  <span className="text-xs font-mono font-bold text-white/90">{result.mechanicalProperties.youngModulus}</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-2 rounded">
                  <span className="text-[10px] text-white/50 block">{t.tensileStrength}</span>
                  <span className="text-xs font-mono font-bold text-white/90">{result.mechanicalProperties.tensileStrength}</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-2 rounded">
                  <span className="text-[10px] text-white/50 block">{t.recoveryRatio}</span>
                  <span className="text-xs font-mono font-bold text-white/90">{result.mechanicalProperties.recoveryRatio}</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-2 rounded">
                  <span className="text-[10px] text-white/50 block">{t.healingSpeed}</span>
                  <span className="text-xs font-mono font-bold text-[#00f2ff]">{result.mechanicalProperties.healingSpeed}</span>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4 text-xs text-white/80 leading-relaxed font-sans">
                <div>
                  <h5 className="font-bold text-white/90 mb-1 flex items-center gap-1 font-serif text-sm">
                    <Atom className="w-3.5 h-3.5 text-[#00f2ff]" />
                    {t.molecularStructureTitle}
                  </h5>
                  <p className="bg-white/5 p-2.5 rounded border border-white/5 text-white/80 font-serif leading-relaxed">
                    {result.molecularStructure}
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-white/90 mb-1 flex items-center gap-1 font-serif text-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                    {t.healingMechanismTitle}
                  </h5>
                  <p className="bg-white/5 p-2.5 rounded border border-white/5 text-white/80 font-serif leading-relaxed">
                    {result.healingMechanism}
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-white/90 mb-1 font-serif text-sm">
                    {t.coherenceEstimateTitle}
                  </h5>
                  <p className="font-mono text-[11px] text-purple-300 bg-purple-950/10 p-2.5 rounded border border-purple-900/20">
                    {result.quantumCoherenceEstimate}
                  </p>
                </div>

                {/* Recommendations */}
                <div className="border-t border-white/10 pt-4">
                  <h5 className="font-serif font-bold text-white/90 mb-2">{t.recommendedNextSteps}</h5>
                  <ul className="grid grid-cols-1 gap-1.5">
                    {result.researchNextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-1.5 text-white/60 text-xs">
                        <span className="text-[#00f2ff] font-bold font-mono shrink-0">[{index + 1}]</span>
                        <span className="font-serif">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
