import { BookOpen, Atom, HelpCircle, ShieldAlert, Zap, Globe } from 'lucide-react';
import { translations, Language } from '../lib/translations';

interface Props {
  lang: Language;
}

export default function ScientificDocumentation({ lang }: Props) {
  const t = translations[lang];

  const sections = [
    {
      title: t.sec1Title,
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      content: t.sec1Content
    },
    {
      title: t.sec2Title,
      icon: <Atom className="w-5 h-5 text-[#00f2ff]" />,
      content: t.sec2Content
    },
    {
      title: t.sec3Title,
      icon: <HelpCircle className="w-5 h-5 text-purple-400" />,
      content: t.sec3Content
    },
    {
      title: t.sec4Title,
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      content: t.sec4Content
    }
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 shadow-2xl space-y-6" id="scientific-documentation-container">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-white/10">
        <BookOpen className="w-5 h-5 text-emerald-400" />
        <h3 className="font-serif font-medium text-lg text-white tracking-tight">
          {t.docTitle}
        </h3>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sections.map((sec, idx) => (
          <div key={idx} className="bg-[#0a0a0c]/60 border border-white/5 p-4 rounded space-y-2.5 hover:border-[#00f2ff]/30 transition-colors">
            <div className="flex items-center gap-2">
              {sec.icon}
              <h4 className="font-serif font-bold text-white/95 text-sm">
                {sec.title}
              </h4>
            </div>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              {sec.content}
            </p>
          </div>
        ))}
      </div>

      {/* Experimental Roadmap Timeline */}
      <div className="bg-[#0a0a0c] border border-white/10 p-4 rounded space-y-4">
        <h4 className="font-serif text-sm font-bold text-white flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-[#00f2ff] animate-pulse" />
          {t.roadmapTitle}
        </h4>

        <div className="relative border-l-2 border-white/10 ml-2.5 pl-5 space-y-4.5 text-xs text-white/60">
          <div className="relative">
            <span className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-[#00f2ff] border-2 border-[#0a0a0c]"></span>
            <strong className="text-[#00f2ff] block font-mono">{t.roadmapPresent}</strong>
            <span className="font-serif">{t.roadmapPresentDesc}</span>
          </div>

          <div className="relative">
            <span className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-purple-500 border-2 border-[#0a0a0c]"></span>
            <strong className="text-purple-400 block font-mono">{t.roadmapPhase2}</strong>
            <span className="font-serif">{t.roadmapPhase2Desc}</span>
          </div>

          <div className="relative">
            <span className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-yellow-500 border-2 border-[#0a0a0c]"></span>
            <strong className="text-yellow-400 block font-mono">{t.roadmapPhase3}</strong>
            <span className="font-serif">{t.roadmapPhase3Desc}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
