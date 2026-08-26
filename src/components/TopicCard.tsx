import React, { useState, lazy, Suspense } from 'react';
import { JSTopic, CodeComparison, LanguageComparison } from '../types';
import { FormattedText } from './FormattedText';
import { useI18n } from '../i18n';
import { 
  Play, 
  Check, 
  X, 
  Globe, 
  BookOpen, 
  Code2, 
  Sparkles, 
  AlertTriangle, 
  Copy, 
  ChevronRight, 
  Layers,
  Terminal,
  Bookmark,
  Share2,
  Cpu,
  Lightbulb,
  Compass,
  Loader2
} from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { runJavaScriptCode } from '../utils/codeRunner';

const ChapterGuideView = lazy(() => 
  import('./ChapterGuideView').then(m => ({ default: m.ChapterGuideView }))
);
const EventLoopVisualizer = lazy(() => 
  import('./Visualizers/EventLoopVisualizer').then(m => ({ default: m.EventLoopVisualizer }))
);
const CoercionVisualizer = lazy(() => 
  import('./Visualizers/CoercionVisualizer').then(m => ({ default: m.CoercionVisualizer }))
);
const ThisBindingVisualizer = lazy(() => 
  import('./Visualizers/ThisBindingVisualizer').then(m => ({ default: m.ThisBindingVisualizer }))
);
const PrototypeVisualizer = lazy(() => 
  import('./Visualizers/PrototypeVisualizer').then(m => ({ default: m.PrototypeVisualizer }))
);
const ScopeVisualizer = lazy(() => 
  import('./Visualizers/ScopeVisualizer').then(m => ({ default: m.ScopeVisualizer }))
);

interface TopicCardProps {
  topic: JSTopic;
  isBookmarked: boolean;
  onToggleBookmark: (topicId: string) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, isBookmarked, onToggleBookmark }) => {
  const { locale, m, localize } = useI18n();
  const hasVisualizer = Boolean(topic.visualType && topic.visualType !== 'custom-console');
  const chapterGuide = (locale === 'en' && topic.chapterGuideEn) ? topic.chapterGuideEn : topic.chapterGuide;
  const [activeTab, setActiveTab] = useState<'chapter-guide' | 'visualizer' | 'deep-dive' | 'bad-vs-good' | 'languages' | 'presets'>(
    chapterGuide ? 'chapter-guide' : (hasVisualizer ? 'visualizer' : 'deep-dive')
  );
  const [activePresetIdx, setActivePresetIdx] = useState<number>(0);
  const [presetOutput, setPresetOutput] = useState<{ logs: string[]; error?: string; returnVal?: string } | null>(null);
  const [isRunningPreset, setIsRunningPreset] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Localized topic attributes
  const title = (locale === 'en' && topic.titleEn) ? topic.titleEn : topic.title;
  const subtitle = (locale === 'en' && topic.subtitleEn) ? topic.subtitleEn : topic.subtitle;
  const summary = (locale === 'en' && topic.summaryEn) ? topic.summaryEn : topic.summary;
  const deepDive = (locale === 'en' && topic.deepDiveEn) ? topic.deepDiveEn : topic.deepDive;
  const comparisons = (locale === 'en' && topic.comparisonsEn) ? topic.comparisonsEn : topic.comparisons;
  const languageComparisons = (locale === 'en' && topic.languageComparisonsEn) ? topic.languageComparisonsEn : topic.languageComparisons;
  const codePresets = (locale === 'en' && topic.codePresetsEn) ? topic.codePresetsEn : topic.codePresets;

  const currentPreset = codePresets[activePresetIdx] || codePresets[0] || topic.codePresets[0];

  const handleRunPreset = async () => {
    if (!currentPreset) return;
    setIsRunningPreset(true);
    const res = await runJavaScriptCode(currentPreset.code);
    setPresetOutput({
      logs: res.logs.map((l) => l.content),
      error: res.error,
      returnVal: res.returnValue
    });
    setIsRunningPreset(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Render appropriate interactive visualizer
  const renderVisualizer = () => {
    let Component: React.ReactNode = null;
    switch (topic.visualType) {
      case 'event-loop':
        Component = <EventLoopVisualizer />;
        break;
      case 'coercion':
        Component = <CoercionVisualizer />;
        break;
      case 'this-binding':
        Component = <ThisBindingVisualizer />;
        break;
      case 'prototype':
        Component = <PrototypeVisualizer />;
        break;
      case 'scope-hoisting':
        Component = <ScopeVisualizer />;
        break;
      default:
        return null;
    }

    return (
      <Suspense fallback={
        <div className="flex items-center justify-center p-8 gap-2 text-slate-500 font-mono text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-[#B45309] dark:text-[#F59E0B]" />
          <span>Loading visualizer...</span>
        </div>
      }>
        {Component}
      </Suspense>
    );
  };

  return (
    <article id={`topic-${topic.id}`} className="cv-auto bg-[#FFFFFF] dark:bg-[#18181B] text-[#1A1A1A] dark:text-[#F4F4F5] rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden space-y-0 transition-all">
      {/* Top Banner / Editorial Header */}
      <div className="p-6 border-b border-[#E5E5DF] dark:border-[#27272A] bg-[#FAF9F5] dark:bg-[#202023]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-[#F59E0B]/20 text-[#78350F] dark:text-[#FDE68A] border border-[#F59E0B]/40">
                {topic.difficulty}
              </span>
              <span className="text-xs text-[#40403C] dark:text-[#D4D4D8] font-mono font-medium">§ {topic.category}</span>
              {topic.tags.map((tag) => (
                <span key={tag} className="text-[11px] font-mono bg-[#FFFFFF] dark:bg-[#27272A] text-[#2E2E2A] dark:text-[#E4E4E7] px-2 py-0.5 rounded border border-[#D4D4CE] dark:border-[#3F3F46]">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight">{title}</h2>
            <p className="text-sm sm:text-[15px] text-[#40403C] dark:text-[#D4D4D8] font-serif italic">{subtitle}</p>
          </div>

          {/* Actions: Direct Link & Bookmark */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const url = `${window.location.origin}${window.location.pathname}#topic-${topic.id}`;
                navigator.clipboard.writeText(url);
                window.location.hash = `topic-${topic.id}`;
                setCopiedCode(`share-${topic.id}`);
                setTimeout(() => setCopiedCode(null), 2000);
              }}
              className="p-2.5 rounded-xl border border-[#D4D4CE] dark:border-[#3F3F46] bg-[#FFFFFF] dark:bg-[#27272A] text-[#40403C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:border-[#A8A89F] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
              title={localize('Kopirajte direktan link do ove teme', 'Copy direct link to this topic')}
              aria-label={localize('Kopirajte direktan link do ove teme', 'Copy direct link to this topic')}
            >
              {copiedCode === `share-${topic.id}` ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
                  <span className="hidden sm:inline text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
                    {locale === 'sr' ? 'Link kopiran!' : 'Link copied!'}
                  </span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline text-[11px] font-medium">
                    {locale === 'sr' ? 'Deli temu' : 'Share'}
                  </span>
                </>
              )}
            </button>

            <button
              onClick={() => onToggleBookmark(topic.id)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-[#78350F] dark:bg-[#F59E0B] border-[#78350F] dark:border-[#F59E0B] text-white dark:text-[#18181B] shadow-sm'
                  : 'bg-[#FFFFFF] dark:bg-[#27272A] border-[#D4D4CE] dark:border-[#3F3F46] text-[#40403C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:border-[#A8A89F]'
              }`}
              title={isBookmarked ? localize('Uklonite sačuvanu lekciju', 'Remove bookmark') : localize('Sačuvajte lekciju', 'Bookmark topic')}
              aria-label={isBookmarked ? localize('Uklonite sačuvanu lekciju', 'Remove bookmark') : localize('Sačuvajte lekciju', 'Bookmark topic')}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Summary text - increased size and enhanced readability */}
        <div className="mt-4 p-4 sm:p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#18181B] border border-[#E5E5DF] dark:border-[#27272A] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <FormattedText
            text={summary}
            as="p"
            className="text-[15px] sm:text-base text-[#1A1A1A] dark:text-[#F4F4F5] leading-relaxed font-sans"
          />
        </div>

        {topic.ecmaSpecNote && (
          <div className="mt-2.5 text-xs text-[#40403C] dark:text-[#D4D4D8] flex items-center gap-1.5 font-mono">
            <BookOpen className="w-3.5 h-3.5 text-[#78350F] dark:text-[#FDE68A]" />
            <span>{localize('Referenca u Specifikaciji:', 'Specification Reference:')} <strong className="text-[#000000] dark:text-[#FFFFFF]">{topic.ecmaSpecNote}</strong></span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 px-4 sm:px-6 pt-3 border-b border-[#E5E5DF] dark:border-[#27272A] bg-[#F4F4F0] dark:bg-[#1E1E22] overflow-x-auto no-scrollbar">
        {chapterGuide && (
          <button
            onClick={() => setActiveTab('chapter-guide')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${
              activeTab === 'chapter-guide'
                ? 'border-[#78350F] dark:border-[#F59E0B] text-[#78350F] dark:text-[#FDE68A] bg-[#FFFFFF] dark:bg-[#18181B] shadow-xs font-bold'
                : 'border-transparent text-[#3F3F3C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#78350F] dark:text-[#FDE68A]" />
            <span>{localize('Detaljan Vodič Kroz Poglavlje', 'Comprehensive Chapter Guide')}</span>
          </button>
        )}

        {hasVisualizer && (
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${
              activeTab === 'visualizer'
                ? 'border-[#1A1A1A] dark:border-[#F59E0B] text-[#1A1A1A] dark:text-[#F4F4F5] bg-[#FFFFFF] dark:bg-[#18181B] shadow-xs font-bold'
                : 'border-transparent text-[#3F3F3C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#78350F] dark:text-[#FDE68A]" />
            <span>{localize('Interaktivni Vizuelni Prikaz', 'Interactive Visualizer')}</span>
          </button>
        )}

        {deepDive && (
          <button
            onClick={() => setActiveTab('deep-dive')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${
              activeTab === 'deep-dive'
                ? 'border-[#1A1A1A] dark:border-[#F59E0B] text-[#1A1A1A] dark:text-[#F4F4F5] bg-[#FFFFFF] dark:bg-[#18181B] shadow-xs font-bold'
                : 'border-transparent text-[#3F3F3C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#78350F] dark:text-[#FDE68A]" />
            <span>{localize('Ključni Mehanizmi', 'Key Mechanics')}</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('bad-vs-good')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${
            activeTab === 'bad-vs-good'
              ? 'border-[#1A1A1A] dark:border-[#F59E0B] text-[#1A1A1A] dark:text-[#F4F4F5] bg-[#FFFFFF] dark:bg-[#18181B] shadow-xs font-bold'
              : 'border-transparent text-[#3F3F3C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF]'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-[#065F46] dark:text-[#34D399]" />
          <span>{localize('Loš vs Dobar Kod', 'Bad vs Good Practice')} ({comparisons.length})</span>
        </button>

        {languageComparisons.length > 0 && (
          <button
            onClick={() => setActiveTab('languages')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${
              activeTab === 'languages'
                ? 'border-[#1A1A1A] dark:border-[#F59E0B] text-[#1A1A1A] dark:text-[#F4F4F5] bg-[#FFFFFF] dark:bg-[#18181B] shadow-xs font-bold'
                : 'border-transparent text-[#3F3F3C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#3730A3] dark:text-[#818CF8]" />
            <span>{localize('Poređenje sa drugim jezicima', 'Cross-Language Comparison')} ({languageComparisons.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('presets')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${
            activeTab === 'presets'
              ? 'border-[#1A1A1A] dark:border-[#F59E0B] text-[#1A1A1A] dark:text-[#F4F4F5] bg-[#FFFFFF] dark:bg-[#18181B] shadow-xs font-bold'
              : 'border-transparent text-[#3F3F3C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-[#78350F] dark:text-[#FDE68A]" />
          <span>{localize('Primeri Koda Uživo', 'Live Code Presets')} ({codePresets.length})</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="p-6">
        {/* TAB 0: Chapter Comprehensive Guide */}
        {activeTab === 'chapter-guide' && chapterGuide && (
          <Suspense fallback={
            <div className="flex items-center justify-center p-8 text-xs font-mono text-[#40403C] dark:text-[#D4D4D8]">
              <Loader2 className="w-5 h-5 animate-spin text-[#78350F] dark:text-[#F59E0B] mr-2" />
              <span>{localize('Učitavanje vodiča...', 'Loading chapter guide...')}</span>
            </div>
          }>
            <ChapterGuideView guide={chapterGuide} />
          </Suspense>
        )}

        {/* TAB 1: Visualizer */}
        {activeTab === 'visualizer' && hasVisualizer && (
          <div>{renderVisualizer()}</div>
        )}

        {/* TAB: Deep Dive & Architectural Explanation */}
        {activeTab === 'deep-dive' && deepDive && (
          <div className="space-y-6">
            <div className="bg-[#FAF9F5] dark:bg-[#202023] rounded-xl border border-[#E5E5DF] dark:border-[#27272A] p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="border-b border-[#E5E5DF] dark:border-[#27272A] pb-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#78350F] dark:text-[#FDE68A] mb-1">
                  <Cpu className="w-4 h-4" />
                  <span>{localize('DUBINSKO RAZUMEVANJE MEHANIZMA', 'IN-DEPTH MECHANICS UNDERSTANDING')}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                  <FormattedText text={(locale === 'en' && deepDive.titleEn) ? deepDive.titleEn : deepDive.title} />
                </h3>
                <FormattedText
                  text={(locale === 'en' && deepDive.summaryEn) ? deepDive.summaryEn : deepDive.summary}
                  as="p"
                  className="text-sm text-[#40403C] dark:text-[#D4D4D8] mt-1.5 leading-relaxed"
                />
              </div>

              {/* Key Points Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deepDive.keyPoints.map((point, pIdx) => {
                  const term = (locale === 'en' && point.termEn) ? point.termEn : point.term;
                  const detail = (locale === 'en' && point.detailEn) ? point.detailEn : point.detail;
                  return (
                    <div 
                      key={pIdx}
                      className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#18181B] border border-[#E5E5DF] dark:border-[#27272A] space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#78350F] dark:bg-[#F59E0B] mt-2 flex-shrink-0"></span>
                        <h4 className="text-xs sm:text-[13px] font-mono font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                          <FormattedText text={term} />
                        </h4>
                      </div>
                      <FormattedText
                        text={detail}
                        as="p"
                        className="text-xs sm:text-[13px] text-[#40403C] dark:text-[#D4D4D8] leading-relaxed pl-3.5"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Practical Mental Model Box */}
              {deepDive.mentalModel && (
                <div className="p-4 sm:p-5 rounded-xl bg-[#FEF3C7]/40 dark:bg-[#78350F]/20 border border-[#FDE68A] dark:border-[#92400E] flex items-start gap-3.5">
                  <Lightbulb className="w-5 h-5 text-[#78350F] dark:text-[#FDE68A] flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <strong className="text-xs sm:text-sm font-serif font-bold text-[#78350F] dark:text-[#FDE68A] block">
                      {localize('Mentalni model (Pravilo za pamćenje u praksi):', 'Mental model (Practical rule of thumb):')}
                    </strong>
                    <FormattedText
                      text={(locale === 'en' && deepDive.mentalModelEn) ? deepDive.mentalModelEn : deepDive.mentalModel}
                      as="p"
                      className="text-xs sm:text-[13px] text-[#78350F] dark:text-[#FDE68A] leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Bad vs Good Code Comparison */}
        {activeTab === 'bad-vs-good' && (
          <div className="space-y-6">
            {comparisons.map((comp, idx) => {
              const compTitle = (locale === 'en' && comp.titleEn) ? comp.titleEn : comp.title;
              const compPitfall = (locale === 'en' && comp.pitfallEn) ? comp.pitfallEn : comp.pitfall;
              const badExp = (locale === 'en' && comp.badExplanationEn) ? comp.badExplanationEn : comp.badExplanation;
              const goodExp = (locale === 'en' && comp.goodExplanationEn) ? comp.goodExplanationEn : comp.goodExplanation;
              return (
                <div key={idx} className="bg-[#FAF9F5] dark:bg-[#202023] rounded-xl border border-[#E5E5DF] dark:border-[#27272A] p-5 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E5DF] dark:border-[#27272A] pb-3 gap-2">
                    <h3 className="text-base font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#78350F] dark:bg-[#F59E0B]"></span>
                      {compTitle}
                    </h3>
                    <span className="text-xs text-[#78350F] dark:text-[#FDE68A] font-mono bg-[#F59E0B]/15 px-2.5 py-1 rounded border border-[#F59E0B]/30 self-start sm:self-auto font-semibold">
                      {localize('Zamka:', 'Pitfall:')} <FormattedText text={compPitfall} />
                    </span>
                  </div>

                  {/* Side by Side Diff */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bad / Antipattern */}
                    <div className="bg-[#FFF5F5] dark:bg-[#2A1515] rounded-xl border border-[#FECACA] dark:border-[#7F1D1D] p-4 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-[#991B1B] dark:text-[#FCA5A5] font-semibold mb-2">
                          <span className="flex items-center gap-1.5 font-serif font-bold">
                            <X className="w-4 h-4 text-[#DC2626] dark:text-[#F87171]" />
                            {localize('Anti-pattern / Zamka u ponašanju', 'Anti-pattern / Behavioral Pitfall')}
                          </span>
                        </div>
                        <CodeBlock
                          code={comp.badCode}
                          language="javascript"
                          showCopyButton={true}
                        />
                      </div>
                      <div className="text-xs text-[#7F1D1D] dark:text-[#FECACA] bg-[#FEE2E2]/60 dark:bg-[#450A0A]/40 p-3 rounded-lg border border-[#FECACA] dark:border-[#7F1D1D] leading-relaxed mt-2 font-medium">
                        <FormattedText text={badExp} as="p" />
                      </div>
                    </div>

                    {/* Good / Best Practice */}
                    <div className="bg-[#F0FDF4] dark:bg-[#0E2718] rounded-xl border border-[#BBF7D0] dark:border-[#14532D] p-4 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-[#14532D] dark:text-[#86EFAC] font-semibold mb-2">
                          <span className="flex items-center gap-1.5 font-serif font-bold">
                            <Check className="w-4 h-4 text-[#15803D] dark:text-[#4ADE80]" />
                            {localize('Moderna Najbolja Praksa (Best Practice)', 'Modern Recommended Best Practice')}
                          </span>
                        </div>
                        <CodeBlock
                          code={comp.goodCode}
                          language="javascript"
                          showCopyButton={true}
                        />
                      </div>
                      <div className="text-xs text-[#14532D] dark:text-[#BBF7D0] bg-[#DCFCE7]/60 dark:bg-[#052E16]/40 p-3 rounded-lg border border-[#BBF7D0] dark:border-[#14532D] leading-relaxed mt-2 font-medium">
                        <FormattedText text={goodExp} as="p" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: Cross Language Comparison */}
        {activeTab === 'languages' && (
          <div className="space-y-6">
            {languageComparisons.map((langComp, idx) => {
              const keyDiff = (locale === 'en' && langComp.keyDifferenceEn) ? langComp.keyDifferenceEn : langComp.keyDifference;
              const jsBeh = (locale === 'en' && langComp.jsBehaviorEn) ? langComp.jsBehaviorEn : langComp.jsBehavior;
              const otherBeh = (locale === 'en' && langComp.otherBehaviorEn) ? langComp.otherBehaviorEn : langComp.otherBehavior;
              const whyJs = (locale === 'en' && langComp.whyJsDoesThisEn) ? langComp.whyJsDoesThisEn : langComp.whyJsDoesThis;
              return (
                <div key={idx} className="bg-[#FAF9F5] dark:bg-[#202023] rounded-xl border border-[#E5E5DF] dark:border-[#27272A] p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#E5E5DF] dark:border-[#27272A] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-[#4338CA]/15 dark:bg-[#818CF8]/15 text-[#3730A3] dark:text-[#C7D2FE] font-bold text-xs font-mono border border-[#4338CA]/30">
                        JavaScript vs {langComp.language}
                      </span>
                      <span className="text-xs text-[#1A1A1A] dark:text-[#F4F4F5] font-serif font-bold">
                        <FormattedText text={keyDiff} />
                      </span>
                    </div>
                  </div>

                  {/* Side-by-side code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* JavaScript side */}
                    <div className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-xl border border-[#E5E5DF] dark:border-[#27272A] p-4 space-y-2">
                      <span className="text-xs font-mono font-bold text-[#78350F] dark:text-[#FDE68A] block">JavaScript (ES2024+):</span>
                      <CodeBlock
                        code={langComp.jsCode}
                        language="javascript"
                        showCopyButton={true}
                      />
                      <FormattedText
                        text={jsBeh}
                        as="p"
                        className="text-xs text-[#40403C] dark:text-[#D4D4D8] leading-relaxed pt-1 font-medium"
                      />
                    </div>

                    {/* Other language side */}
                    <div className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-xl border border-[#E5E5DF] dark:border-[#27272A] p-4 space-y-2">
                      <span className="text-xs font-mono font-bold text-[#3730A3] dark:text-[#C7D2FE] block">{localize('Ponašanje u', 'Behavior in')} {langComp.language}:</span>
                      <CodeBlock
                        code={langComp.otherCode}
                        language={langComp.language.toLowerCase()}
                        showCopyButton={true}
                      />
                      <FormattedText
                        text={otherBeh}
                        as="p"
                        className="text-xs text-[#40403C] dark:text-[#D4D4D8] leading-relaxed pt-1 font-medium"
                      />
                    </div>
                  </div>

                  {/* Why JS does this */}
                  <div className="p-4 bg-[#EEF2FF] dark:bg-[#1E1B4B]/30 rounded-xl border border-[#C7D2FE] dark:border-[#3730A3] text-xs text-[#312E81] dark:text-[#C7D2FE] leading-relaxed flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#3730A3] dark:text-[#C7D2FE] flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <strong className="text-[#1E1B4B] dark:text-[#E0E7FF] font-serif font-bold block mb-0.5 text-sm">{localize('Kontekst Specifikacije i Istorijat:', 'Specification Context & History:')}</strong>
                      <FormattedText text={whyJs} as="p" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: Live Code Presets */}
        {activeTab === 'presets' && (
          <div className="space-y-4">
            {/* Presets Button Selector */}
            <div className="flex flex-wrap gap-2">
              {codePresets.map((preset, idx) => {
                const presetTitle = (locale === 'en' && preset.titleEn) ? preset.titleEn : preset.title;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setActivePresetIdx(idx);
                      setPresetOutput(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activePresetIdx === idx
                        ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] font-semibold shadow-sm'
                        : 'bg-[#FAF9F5] dark:bg-[#27272A] text-[#575750] dark:text-[#A1A1AA] hover:bg-[#EBEBE5] dark:hover:bg-[#3F3F46] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5] border border-[#E5E5DF] dark:border-[#3F3F46]'
                    }`}
                  >
                    {presetTitle}
                  </button>
                );
              })}
            </div>

            {/* Selected Preset Runner Card */}
            <div className="bg-[#FAF9F5] dark:bg-[#202023] rounded-xl p-5 border border-[#E5E5DF] dark:border-[#27272A] space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E5DF] dark:border-[#27272A] pb-3 gap-3">
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                    {(locale === 'en' && currentPreset.titleEn) ? currentPreset.titleEn : currentPreset.title}
                  </h3>
                  <FormattedText
                    text={(locale === 'en' && currentPreset.descriptionEn) ? currentPreset.descriptionEn : currentPreset.description}
                    as="p"
                    className="text-xs text-[#52524E] dark:text-[#A1A1AA] mt-0.5"
                  />
                </div>
                <button
                  onClick={handleRunPreset}
                  disabled={isRunningPreset}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1A1A1A] dark:bg-[#F59E0B] hover:bg-[#333330] dark:hover:bg-[#D97706] text-[#F9F9F7] dark:text-[#18181B] font-semibold text-xs shadow-sm transition disabled:opacity-50 self-start sm:self-auto cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#F59E0B] dark:text-[#18181B]" />
                  <span>{isRunningPreset ? localize('Izvršavanje...', 'Executing...') : localize('Izvršite Primer', 'Run Example')}</span>
                </button>
              </div>

              {/* Code */}
              <CodeBlock
                code={currentPreset.code}
                language="javascript"
                showLineNumbers={true}
                showCopyButton={true}
              />

              {/* Output */}
              {presetOutput && (
                <div className="p-4 bg-[#111110] rounded-xl border border-[#333330] font-mono text-xs space-y-2">
                  <span className="text-[11px] text-[#34D399] font-bold uppercase tracking-wider block font-mono">
                    {localize('Konzolni Ispis (Console Output):', 'Console Output:')}
                  </span>
                  {presetOutput.logs.length === 0 && !presetOutput.returnVal && !presetOutput.error && (
                    <span className="text-[#73736C] italic">{localize('Kod je izvršen bez ispisa u konzoli.', 'Code executed with no console output.')}</span>
                  )}
                  {presetOutput.logs.map((log, lIdx) => (
                    <div key={lIdx} className="text-[#6EE7B7] flex items-start gap-2">
                      <span className="text-[#52524E] select-none">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  {presetOutput.returnVal && (
                    <div className="text-[#93C5FD] font-bold pt-1.5 border-t border-[#262624]">
                      &lt; {localize('Povratna vrednost:', 'Return value:')} {presetOutput.returnVal}
                    </div>
                  )}
                  {presetOutput.error && (
                    <div className="text-[#F87171] font-bold">
                      {localize('Greška:', 'Error:')} {presetOutput.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
