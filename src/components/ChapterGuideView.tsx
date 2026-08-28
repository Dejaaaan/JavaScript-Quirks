import React, { useState } from 'react';
import { ChapterGuide } from '../types';
import { useI18n } from '../i18n';
import { FormattedText } from './FormattedText';
import { CodeBlock } from './CodeBlock';
import { AdBanner } from './AdBanner';
import { 
  Lightbulb, 
  History, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ChapterGuideViewProps {
  guide: ChapterGuide;
}

export const ChapterGuideView: React.FC<ChapterGuideViewProps> = ({ guide }) => {
  const { locale, localize } = useI18n();
  const [activeSection, setActiveSection] = useState<'all' | 'overview' | 'engine' | 'pitfalls' | 'solutions' | 'history' | 'funfacts'>('all');
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  const overview = (locale === 'en' && guide.overviewEn) ? guide.overviewEn : guide.overview;
  const analogy = (locale === 'en' && guide.analogyEn) ? guide.analogyEn : guide.analogy;
  const mentalModel = (locale === 'en' && guide.mentalModelEn) ? guide.mentalModelEn : guide.mentalModel;
  const goldenRule = (locale === 'en' && guide.goldenRuleEn) ? guide.goldenRuleEn : guide.goldenRule;

  const historyTitle = (locale === 'en' && guide.historyAndOrigin.titleEn) ? guide.historyAndOrigin.titleEn : guide.historyAndOrigin.title;
  const historyDesc = (locale === 'en' && guide.historyAndOrigin.descriptionEn) ? guide.historyAndOrigin.descriptionEn : guide.historyAndOrigin.description;
  const historyWhy = (locale === 'en' && guide.historyAndOrigin.whyItExistsEn) ? guide.historyAndOrigin.whyItExistsEn : guide.historyAndOrigin.whyItExists;

  const engineTitle = (locale === 'en' && guide.underTheHood.titleEn) ? guide.underTheHood.titleEn : guide.underTheHood.title;
  const engineSummary = (locale === 'en' && guide.underTheHood.summaryEn) ? guide.underTheHood.summaryEn : guide.underTheHood.summary;

  return (
    <div className="space-y-6">
      {/* Quick Filter Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-[#E5E5DF] dark:border-[#27272A]">
        {[
          { id: 'all', label: localize('Sveobuhvatan pregled', 'Complete Guide'), icon: Layers },
          { id: 'overview', label: localize('Koncept & Intuicija', 'Concept & Intuition'), icon: Lightbulb },
          { id: 'engine', label: localize('Ispod haube (V8/Spec)', 'Under the Hood'), icon: Cpu },
          { id: 'pitfalls', label: localize('Zamke & Bagovi', 'Pitfalls & Bugs'), icon: AlertTriangle },
          { id: 'solutions', label: localize('Najbolja praksa', 'Best Practices'), icon: ShieldCheck },
          { id: 'history', label: localize('Istorijat & Poreklo', 'History & Origin'), icon: History },
          { id: 'funfacts', label: localize('Zanimljivosti', 'Fun Facts & Quirks'), icon: Flame },
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#78350F] dark:bg-[#F59E0B] text-white dark:text-[#18181B] shadow-xs font-bold'
                  : 'bg-[#FAF9F5] dark:bg-[#202023] text-[#3F3F3C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF] border border-[#D4D4CE] dark:border-[#27272A] font-semibold'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: Concept & Mental Metaphor */}
      {(activeSection === 'all' || activeSection === 'overview') && (
        <section className="space-y-4">
          <div className="bg-[#FAF9F5] dark:bg-[#202023] rounded-xl border border-[#E5E5DF] dark:border-[#27272A] p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#78350F] dark:text-[#FDE68A] uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              <span>{localize('1. O ČEMU SE RADI U OVOJ TEMI?', '1. CORE CONCEPT & INTUITION')}</span>
            </div>
            
            <FormattedText
              text={overview}
              as="p"
              className="text-[15px] sm:text-base text-[#1A1A1A] dark:text-[#F4F4F5] leading-relaxed font-sans"
            />

            {analogy && (
              <div className="mt-4 p-4 rounded-xl bg-[#FFFBEB] dark:bg-[#2A2012] border border-[#FDE68A] dark:border-[#78350F] flex items-start gap-3">
                <Compass className="w-5 h-5 text-[#78350F] dark:text-[#FDE68A] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#78350F] dark:text-[#FDE68A] block">
                    {localize('Slikovito poređenje (Metafora iz stvarnog sveta):', 'Real-world Metaphor & Analogy:')}
                  </span>
                  <FormattedText
                    text={analogy}
                    as="p"
                    className="text-xs sm:text-sm text-[#78350F] dark:text-[#FDE68A] leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECTION 2: History and Origin (Zašto se tako zove i zašto je tako napravljeno) */}
      {(activeSection === 'all' || activeSection === 'history') && (
        <section className="space-y-4">
          <div className="bg-[#FAF9F5] dark:bg-[#202023] rounded-xl border border-[#E5E5DF] dark:border-[#27272A] p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#3730A3] dark:text-[#C7D2FE] uppercase tracking-wider">
              <History className="w-4 h-4" />
              <span>{localize('2. ISTORIJAT, POREKLO IMENA I ZAŠTO JE TAKO NAPRAVLJENO', '2. ORIGIN, NAMING & HISTORICAL ROOTS')}</span>
            </div>

            <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
              {historyTitle}
            </h3>

            <FormattedText
              text={historyDesc}
              as="p"
              className="text-sm text-[#40403C] dark:text-[#D4D4D8] leading-relaxed"
            />

            <div className="p-4 rounded-xl bg-[#EEF2FF] dark:bg-[#1E1E38] border border-[#C7D2FE] dark:border-[#3730A3] space-y-1.5">
              <span className="text-xs font-mono font-bold text-[#312E81] dark:text-[#E0E7FF] block uppercase tracking-wider">
                {localize('Zašto ovo ponašanje nije promenjeno u novim verzijama?', 'Why was this behavior preserved in modern ECMAScript?')}
              </span>
              <FormattedText
                text={historyWhy}
                as="p"
                className="text-xs sm:text-sm text-[#312E81] dark:text-[#E0E7FF] leading-relaxed font-medium"
              />
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: Under the Hood Engine Breakdown */}
      {(activeSection === 'all' || activeSection === 'engine') && (
        <section className="space-y-4">
          <div className="bg-[#FAF9F5] dark:bg-[#202023] rounded-xl border border-[#E5E5DF] dark:border-[#27272A] p-5 sm:p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E5E5DF] dark:border-[#27272A] pb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#065F46] dark:text-[#6EE7B7] uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>{localize('3. KAKO FUNKCIONIŠE ISPOD HUBE (ALGORITMI & V8)', '3. HOW IT WORKS UNDER THE HOOD (ENGINE MECHANICS)')}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                {engineTitle}
              </h3>
              <FormattedText
                text={engineSummary}
                as="p"
                className="text-sm text-[#40403C] dark:text-[#D4D4D8] leading-relaxed"
              />
            </div>

            {/* Step-by-Step Flow */}
            <div className="space-y-3 pt-2">
              {guide.underTheHood.steps.map((step) => {
                const stepTitle = (locale === 'en' && step.titleEn) ? step.titleEn : step.title;
                const stepDesc = (locale === 'en' && step.descriptionEn) ? step.descriptionEn : step.description;
                const isExpanded = expandedSteps[step.stepNumber] !== false; // expanded by default

                return (
                  <div
                    key={step.stepNumber}
                    className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#18181B] border border-[#E5E5DF] dark:border-[#27272A] shadow-xs space-y-3"
                  >
                    <div 
                      className="flex items-start justify-between gap-3 cursor-pointer"
                      onClick={() => toggleStep(step.stepNumber)}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#065F46]/15 text-[#065F46] dark:text-[#6EE7B7] flex items-center justify-center text-xs font-mono font-bold border border-[#065F46]/30">
                          {step.stepNumber}
                        </span>
                        <h4 className="text-sm sm:text-[15px] font-mono font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                          {stepTitle}
                        </h4>
                      </div>
                      <button 
                        className="text-[#40403C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF] p-1 cursor-pointer"
                        aria-label={isExpanded ? localize('Skupi detalje koraka', 'Collapse step details') : localize('Proširi detalje koraka', 'Expand step details')}
                        title={isExpanded ? localize('Skupi detalje koraka', 'Collapse step details') : localize('Proširi detalje koraka', 'Expand step details')}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="space-y-3 pt-1 pl-8">
                        <FormattedText
                          text={stepDesc}
                          as="p"
                          className="text-xs sm:text-sm text-[#40403C] dark:text-[#D4D4D8] leading-relaxed font-sans"
                        />
                        {step.codeSnippet && (
                          <div className="pt-1">
                            <CodeBlock code={step.codeSnippet} language="javascript" showCopyButton={true} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Strategic Native Ad Placement between Engine Mechanics and Pitfalls */}
      {activeSection === 'all' && (
        <AdBanner
          format="horizontal"
          label={locale === 'sr' ? 'Sponzorisano' : 'Sponsored'}
        />
      )}

      {/* SECTION 4: Common Pitfalls & Real Bugs */}
      {(activeSection === 'all' || activeSection === 'pitfalls') && (
        <section className="space-y-4">
          <div className="bg-[#FAF9F5] dark:bg-[#202023] rounded-xl border border-[#E5E5DF] dark:border-[#27272A] p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#991B1B] dark:text-[#FCA5A5] uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>{localize('4. KOJI MOGU BITI PROBLEMI I ZAMKE U PRODUKCIJI?', '4. COMMON PITFALLS & PRODUCTION BUGS')}</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {guide.pitfalls.map((pitfall, pIdx) => {
                const title = (locale === 'en' && pitfall.titleEn) ? pitfall.titleEn : pitfall.title;
                const cause = (locale === 'en' && pitfall.causeEn) ? pitfall.causeEn : pitfall.cause;
                const impact = (locale === 'en' && pitfall.impactEn) ? pitfall.impactEn : pitfall.impact;

                return (
                  <div
                    key={pIdx}
                    className="p-4 sm:p-5 rounded-xl bg-[#FFF5F5] dark:bg-[#2A1515] border border-[#FECACA] dark:border-[#7F1D1D] space-y-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#DC2626] mt-1.5 flex-shrink-0"></span>
                      <h3 className="text-sm sm:text-base font-serif font-bold text-[#991B1B] dark:text-[#FCA5A5]">
                        {title}
                      </h3>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm text-[#7F1D1D] dark:text-[#FECACA] pl-4">
                      <div>
                        <strong className="font-mono text-[#991B1B] dark:text-[#FCA5A5]">{localize('Uzrok problema:', 'Root Cause:')} </strong>
                        <FormattedText text={cause} as="span" />
                      </div>
                      <div>
                        <strong className="font-mono text-[#991B1B] dark:text-[#FCA5A5]">{localize('Posledica (Bug):', 'Impact / Failure:')} </strong>
                        <FormattedText text={impact} as="span" />
                      </div>
                    </div>

                    {pitfall.codeSnippet && (
                      <div className="pt-2 pl-4">
                        <CodeBlock code={pitfall.codeSnippet} language="javascript" showCopyButton={true} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: Practical Solutions & Modern Best Practices */}
      {(activeSection === 'all' || activeSection === 'solutions') && (
        <section className="space-y-4">
          <div className="bg-[#FAF9F5] dark:bg-[#202023] rounded-xl border border-[#E5E5DF] dark:border-[#27272A] p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#14532D] dark:text-[#86EFAC] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{localize('5. KAKO REŠITI PROBLEME & MODERNA NAJBOLJA PRAKSA', '5. HOW TO SOLVE THEM & MODERN BEST PRACTICES')}</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {guide.solutions.map((sol, sIdx) => {
                const title = (locale === 'en' && sol.titleEn) ? sol.titleEn : sol.title;
                const solutionText = (locale === 'en' && sol.solutionEn) ? sol.solutionEn : sol.solution;
                const rec = (locale === 'en' && sol.recommendationEn) ? sol.recommendationEn : sol.recommendation;

                return (
                  <div
                    key={sIdx}
                    className="p-4 sm:p-5 rounded-xl bg-[#F0FDF4] dark:bg-[#0E2718] border border-[#BBF7D0] dark:border-[#14532D] space-y-3"
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#15803D] dark:text-[#86EFAC] mt-0.5 flex-shrink-0" />
                      <h3 className="text-sm sm:text-base font-serif font-bold text-[#14532D] dark:text-[#86EFAC]">
                        {title}
                      </h3>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm text-[#14532D] dark:text-[#BBF7D0] pl-6">
                      <div>
                        <strong className="font-mono text-[#15803D] dark:text-[#86EFAC]">{localize('Rešenje:', 'Solution:')} </strong>
                        <FormattedText text={solutionText} as="span" />
                      </div>
                      <div>
                        <strong className="font-mono text-[#15803D] dark:text-[#86EFAC]">{localize('Preporuka:', 'Standard / Lint Rule:')} </strong>
                        <FormattedText text={rec} as="span" />
                      </div>
                    </div>

                    {sol.codeSnippet && (
                      <div className="pt-2 pl-6">
                        <CodeBlock code={sol.codeSnippet} language="javascript" showCopyButton={true} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 6: Fun Facts & Quirks */}
      {(activeSection === 'all' || activeSection === 'funfacts') && guide.funFacts.length > 0 && (
        <section className="space-y-4">
          <div className="bg-[#FAF9F5] dark:bg-[#202023] rounded-xl border border-[#E5E5DF] dark:border-[#27272A] p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C2410C] dark:text-[#FDBA74] uppercase tracking-wider">
              <Flame className="w-4 h-4" />
              <span>{localize('6. ZANIMLJIVOSTI, KURIOZITETI I FUN FACTS', '6. CURIOSITIES, TRIVIA & FUN FACTS')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guide.funFacts.map((fact, fIdx) => {
                const title = (locale === 'en' && fact.titleEn) ? fact.titleEn : fact.title;
                const exp = (locale === 'en' && fact.explanationEn) ? fact.explanationEn : fact.explanation;

                return (
                  <div
                    key={fIdx}
                    className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#18181B] border border-[#E5E5DF] dark:border-[#27272A] space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C2410C] dark:text-[#FDBA74]" />
                      <h3 className="text-xs sm:text-[13px] font-mono font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                        {title}
                      </h3>
                    </div>

                    {fact.codeSnippet && (
                      <CodeBlock code={fact.codeSnippet} language="javascript" showCopyButton={true} />
                    )}

                    <FormattedText
                      text={exp}
                      as="p"
                      className="text-xs sm:text-[13px] text-[#40403C] dark:text-[#D4D4D8] leading-relaxed"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 7: Mental Model & Golden Rule */}
      <section className="p-5 sm:p-6 rounded-xl bg-[#FEF3C7]/40 dark:bg-[#78350F]/20 border border-[#FDE68A] dark:border-[#92400E] space-y-4">
        <div className="flex items-start gap-3">
          <Compass className="w-6 h-6 text-[#78350F] dark:text-[#FDE68A] flex-shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <div>
              <strong className="text-xs font-mono uppercase tracking-wider text-[#78350F] dark:text-[#FDE68A] block">
                {localize('Mentalni Model (Kako razmišljati o ovoj temi):', 'Mental Model (How to intuitively reason about this):')}
              </strong>
              <FormattedText
                text={mentalModel}
                as="p"
                className="text-xs sm:text-sm text-[#78350F] dark:text-[#FDE68A] leading-relaxed mt-1"
              />
            </div>

            <div className="pt-2 border-t border-[#FDE68A]/60 dark:border-[#92400E]/60">
              <strong className="text-xs font-mono uppercase tracking-wider text-[#78350F] dark:text-[#FDE68A] block">
                {localize('Zlatno Pravilo u Praksi:', 'Golden Rule in Production:')}
              </strong>
              <FormattedText
                text={goldenRule}
                as="p"
                className="text-xs sm:text-sm font-semibold text-[#78350F] dark:text-[#FDE68A] leading-relaxed mt-0.5"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
