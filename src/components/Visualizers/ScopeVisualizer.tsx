import React, { useState } from 'react';
import { Layers, ShieldCheck, AlertOctagon, HelpCircle, Code } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';
import { FormattedText } from '../FormattedText';

interface ScopeScenario {
  id: string;
  title: string;
  code: string;
  variableType: 'var' | 'let' | 'const' | 'function';
  phases: {
    phaseName: string;
    description: string;
    variableState: string;
    isAccessible: boolean;
  }[];
  explanation: string;
}

const SCOPE_SCENARIOS: ScopeScenario[] = [
  {
    id: 'let-tdz',
    title: 'let / const: Temporal Dead Zone (TDZ)',
    code: `1: {
2:   // Ulazak u blok opseg: promenljiva je registrovana u memoriji (početak TDZ-a)
3:   console.log(x); // ReferenceError: Cannot access 'x' before initialization
4:   let x = 42;    // Završetak TDZ-a, x je inicijalizovan na vrednost 42
5:   console.log(x); // Dostupno za čitanje: 42
6: }`,
    variableType: 'let',
    phases: [
      {
        phaseName: '1. Kreiranje Blokovskog Opsega (Linija 1)',
        description: 'JS engine ulazi u blok `{}`. Identifikator `x` se deklariše i smešta u `Lexical Environment Record`.',
        variableState: 'Neinicijalizovano (U TDZ-u)',
        isAccessible: false
      },
      {
        phaseName: '2. Temporal Dead Zone faza (Linije 2-3)',
        description: 'Pokušaj čitanja promenljive `x` pre inicijalizacije baca runtime `ReferenceError` grešku.',
        variableState: 'Neinicijalizovano (Čitanje zabranjeno)',
        isAccessible: false
      },
      {
        phaseName: '3. Deklaracija i Dodeljivanje (Linija 4)',
        description: 'Izvršava se `let x = 42`. Promenljiva se vezuje i inicijalizuje vrednošću `42`. TDZ se zatvara.',
        variableState: 'Vrednost: 42 (Inicijalizovano)',
        isAccessible: true
      },
      {
        phaseName: '4. Pristup nakon TDZ-a (Linija 5)',
        description: 'Promenljivoj `x` se može normalno pristupati i upisivati nove vrednosti sve do kraja opsega.',
        variableState: 'Vrednost: 42 (Spremno)',
        isAccessible: true
      }
    ],
    explanation: 'Promenljive deklarisane sa `let` i `const` bivaju podignute na vrh svog blokovskog opsega, ali ostaju neinicijalizovane sve dok se ne izvrši linija sa njihovom deklaracijom. Prostor između ulaska u opseg i linije deklaracije naziva se Temporal Dead Zone (TDZ).'
  },
  {
    id: 'var-hoisting',
    title: 'var: Podizanje deklaracije (Hoisting) na undefined',
    code: `1: function demo() {
2:   console.log(v); // undefined (podignuto!)
3:   var v = "hello";
4:   console.log(v); // "hello"
5: }`,
    variableType: 'var',
    phases: [
      {
        phaseName: '1. Kreiranje Funkcijskog Opsega (Linija 1)',
        description: 'JS engine alocira promenljivu `v` u `Variable Environment` i automatski je predinicijalizuje na `undefined`.',
        variableState: 'Vrednost: undefined (Predinicijalizovano)',
        isAccessible: true
      },
      {
        phaseName: '2. Pristup pre deklaracije (Linija 2)',
        description: 'Promenljiva `v` se čita bez izbacivanja greške; vraća se vrednost `undefined`.',
        variableState: 'Vrednost: undefined',
        isAccessible: true
      },
      {
        phaseName: '3. Dodeljivanje vrednosti (Linija 3)',
        description: 'Izvršava se `v = "hello"`, dodeljujući promenljivoj `v` string vrednost `"hello"`.',
        variableState: 'Vrednost: "hello"',
        isAccessible: true
      }
    ],
    explanation: 'Za razliku od `let`, deklaracije sa `var` se podižu na vrh i AUTOMATSKI inicijalizuju na `undefined` tokom faze kompajliranja, dozvoljavajući pristup pre same linije deklaracije bez greške.'
  }
];

export const ScopeVisualizer: React.FC = () => {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const scenario = SCOPE_SCENARIOS[selectedScenarioIdx];

  return (
    <div id="scope-visualizer" className="bg-[#FFFFFF] dark:bg-[#18181B] text-[#1A1A1A] dark:text-[#F4F4F5] rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5DF] dark:border-[#27272A] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#15803D]/10 dark:bg-[#22C55E]/15 text-[#15803D] dark:text-[#4ADE80] font-mono text-[11px] font-bold border border-[#15803D]/20 dark:border-[#22C55E]/30">
              <Layers className="w-3.5 h-3.5 inline-block mr-1" />
              Životni Ciklus Leksičkog Okruženja
            </span>
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight">Vizuelni prikaz Scope-a, Hoisting-a i TDZ-a</h3>
          </div>
          <p className="text-xs text-[#73736C] dark:text-[#A1A1AA] font-serif italic mt-1">
            Uporedite vremenske linije inicijalizacije između zastarelog <code className="text-[#15803D] dark:text-[#4ADE80] font-mono font-bold">var</code> i modernog <code className="text-[#15803D] dark:text-[#4ADE80] font-mono font-bold">let / const</code> blokovskog opsega.
          </p>
        </div>

        {/* Switcher */}
        <div className="flex items-center gap-1.5 bg-[#FAF9F5] dark:bg-[#202023] p-1 rounded-xl border border-[#E5E5DF] dark:border-[#27272A]">
          {SCOPE_SCENARIOS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setSelectedScenarioIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedScenarioIdx === idx
                  ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] shadow-sm'
                  : 'text-[#575750] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5]'
              }`}
            >
              {s.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Code Snippet (5 cols) */}
        <div className="lg:col-span-5 bg-[#FAF9F5] dark:bg-[#202023] p-4 rounded-xl border border-[#E5E5DF] dark:border-[#27272A] space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-xs font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] uppercase tracking-wider block mb-2">
              Primer Koda
            </span>
            <CodeBlock
              code={scenario.code}
              language="javascript"
              showCopyButton={true}
            />
          </div>

          <div className="p-3.5 bg-[#FFFFFF] dark:bg-[#18181B] rounded-lg border border-[#E5E5DF] dark:border-[#27272A] text-xs text-[#262624] dark:text-[#D4D4D8] shadow-sm">
            <span className="font-serif font-bold text-[#15803D] dark:text-[#4ADE80] block mb-1">Osnovni Princip:</span>
            <FormattedText text={scenario.explanation} as="p" className="text-[#575750] dark:text-[#A1A1AA] text-xs leading-relaxed" />
          </div>
        </div>

        {/* Lifecycle Phase Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-serif font-bold text-[#73736C] dark:text-[#A1A1AA] uppercase tracking-wider block mb-1">
            Vremenska linija izvršavanja i stanja u memoriji:
          </span>

          <div className="space-y-2.5">
            {scenario.phases.map((phase, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  phase.isAccessible
                    ? 'bg-[#F0FDF4] dark:bg-[#064E3B]/30 border-[#BBF7D0] dark:border-[#059669]/40 text-[#14532D] dark:text-[#86EFAC]'
                    : 'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 border-[#FECACA] dark:border-[#991B1B]/50 text-[#7F1D1D] dark:text-[#FCA5A5]'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    {phase.isAccessible ? (
                      <ShieldCheck className="w-4 h-4 text-[#16A34A] dark:text-[#4ADE80] shrink-0" />
                    ) : (
                      <AlertOctagon className="w-4 h-4 text-[#DC2626] dark:text-[#F87171] shrink-0" />
                    )}
                    <span className="font-serif font-bold text-xs sm:text-sm">{phase.phaseName}</span>
                  </div>
                  <FormattedText text={phase.description} as="p" className="text-xs text-[#575750] dark:text-[#D4D4D8] pl-6 leading-relaxed font-sans" />
                </div>

                <span
                  className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded whitespace-nowrap self-start sm:self-center shrink-0 ${
                    phase.isAccessible
                      ? 'bg-[#DCFCE7] dark:bg-[#064E3B] text-[#15803D] dark:text-[#86EFAC] border border-[#86EFAC] dark:border-[#059669]'
                      : 'bg-[#FEE2E2] dark:bg-[#7F1D1D] text-[#B91C1C] dark:text-[#FCA5A5] border border-[#FCA5A5] dark:border-[#991B1B]'
                  }`}
                >
                  {phase.variableState}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
