import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, CheckCircle, ArrowRight, Layers, Clock, Cpu, Terminal, Zap } from 'lucide-react';
import Prism from 'prismjs';
import { FormattedText } from '../FormattedText';

interface Step {
  stepNumber: number;
  description: string;
  activeLine?: number;
  callStack: string[];
  webApis: string[];
  microtasks: string[];
  macrotasks: string[];
  consoleLogs: string[];
  explanation: string;
}

const EVENT_LOOP_PRESETS: { id: string; name: string; code: string; steps: Step[] }[] = [
  {
    id: 'micro-vs-macro',
    name: 'Redosled Microtask vs Macrotask',
    code: `1: console.log('1: Sinhrono');
2: setTimeout(() => console.log('2: Timeout'), 0);
3: Promise.resolve().then(() => console.log('3: Promise'));
4: queueMicrotask(() => console.log('4: Microtask'));
5: console.log('5: Sinhroni Kraj');`,
    steps: [
      {
        stepNumber: 1,
        description: 'Inicijalizacija izvršavanja skripte na `Call Stack`-u',
        activeLine: 1,
        callStack: ['main()', "console.log('1: Sinhrono')"],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: ['1: Sinhrono'],
        explanation: 'Sinhroni `console.log` postavlja se na `Call Stack` i izvršava odmah.'
      },
      {
        stepNumber: 2,
        description: 'Registracija `setTimeout` funkcije kod Web API / Timer niti',
        activeLine: 2,
        callStack: ['main()', 'setTimeout(cb, 0)'],
        webApis: ['Timer (0ms) -> [cb: Timeout]'],
        microtasks: [],
        macrotasks: [],
        consoleLogs: ['1: Sinhrono'],
        explanation: '`setTimeout` se prosleđuje u pozadinsku Web API tajmer nit browser-a (ili libuv u Node.js).'
      },
      {
        stepNumber: 3,
        description: 'Tajmer završava i callback se smešta u Macrotask red',
        activeLine: 3,
        callStack: ['main()', 'Promise.resolve().then(...)'],
        webApis: [],
        microtasks: ['PromiseCallback ("3: Promise")'],
        macrotasks: ['setTimeoutCallback ("2: Timeout")'],
        consoleLogs: ['1: Sinhrono'],
        explanation: '`Promise.then` raspoređuje posao visokog prioriteta u `Microtask` red. Callback tajmera stoji u `Macrotask` (Task) redu.'
      },
      {
        stepNumber: 4,
        description: '`queueMicrotask` dodaje još jedan mikrozadatak',
        activeLine: 4,
        callStack: ['main()', 'queueMicrotask(...)'],
        webApis: [],
        microtasks: ['PromiseCallback ("3: Promise")', 'MicrotaskCallback ("4: Microtask")'],
        macrotasks: ['setTimeoutCallback ("2: Timeout")'],
        consoleLogs: ['1: Sinhrono'],
        explanation: 'Eksplicitni `queueMicrotask()` postavlja zadatak direktno na kraj postojećih mikrozadataka.'
      },
      {
        stepNumber: 5,
        description: 'Izvršavanje sinhronog ispisa na kraju skripte',
        activeLine: 5,
        callStack: ['main()', "console.log('5: Sinhroni Kraj')"],
        webApis: [],
        microtasks: ['PromiseCallback ("3: Promise")', 'MicrotaskCallback ("4: Microtask")'],
        macrotasks: ['setTimeoutCallback ("2: Timeout")'],
        consoleLogs: ['1: Sinhrono', '5: Sinhroni Kraj'],
        explanation: 'Funkcija `main()` završava sinhroni kod. `Call Stack` se u potpunosti prazni.'
      },
      {
        stepNumber: 6,
        description: '`Call Stack` je prazan! Event Loop prvo u potpunosti prazni `Microtask` red!',
        activeLine: 3,
        callStack: ['PromiseCallback()', "console.log('3: Promise')"],
        webApis: [],
        microtasks: ['MicrotaskCallback ("4: Microtask")'],
        macrotasks: ['setTimeoutCallback ("2: Timeout")'],
        consoleLogs: ['1: Sinhrono', '5: Sinhroni Kraj', '3: Promise'],
        explanation: 'Ključno pravilo: `Microtask` red MORA biti u potpunosti ispražnjen pre nego što Event Loop pređe na sledeći `Macrotask`.'
      },
      {
        stepNumber: 7,
        description: 'Izvršava se sledeći `Microtask`',
        activeLine: 4,
        callStack: ['MicrotaskCallback()', "console.log('4: Microtask')"],
        webApis: [],
        microtasks: [],
        macrotasks: ['setTimeoutCallback ("2: Timeout")'],
        consoleLogs: ['1: Sinhrono', '5: Sinhroni Kraj', '3: Promise', '4: Microtask'],
        explanation: 'Drugi mikrozadatak se izvršava. `Microtask` red je sada potpuno ispražnjen.'
      },
      {
        stepNumber: 8,
        description: 'Event Loop uzima 1 Macrotask iz reda',
        activeLine: 2,
        callStack: ['setTimeoutCallback()', "console.log('2: Timeout')"],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: ['1: Sinhrono', '5: Sinhroni Kraj', '3: Promise', '4: Microtask', '2: Timeout'],
        explanation: 'Macrotask (`setTimeout`) se izvršava na Call Stack-u. Svi redovi čekanja su sada prazni!'
      }
    ]
  },
  {
    id: 'async-await-flow',
    name: 'Tok Async/Await i Microtask-ova',
    code: `1: async function foo() {
2:   console.log('A: foo početak');
3:   await Promise.resolve();
4:   console.log('B: foo nastavak (Microtask)');
5: }
6: console.log('C: sinhroni početak');
7: foo();
8: console.log('D: sinhroni kraj');`,
    steps: [
      {
        stepNumber: 1,
        description: 'Izvršavanje sinhronog početka skripte',
        activeLine: 6,
        callStack: ['main()', "console.log('C: sinhroni početak')"],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: ['C: sinhroni početak'],
        explanation: 'Sinhrona linija 6 (`console.log`) se izvršava na `Call Stack`-u.'
      },
      {
        stepNumber: 2,
        description: 'Poziv asinhone funkcije `foo()` sinhrono do prvog `await`-a',
        activeLine: 2,
        callStack: ['main()', 'foo()', "console.log('A: foo početak')"],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: ['C: sinhroni početak', 'A: foo početak'],
        explanation: 'Asinhrone `async` funkcije se izvršavaju potpuno sinhrono sve dok ne naiđu na prvu `await` naredbu!'
      },
      {
        stepNumber: 3,
        description: 'Nailazak na `await`: pauzira se `foo()` i nastavak se raspoređuje kao `Microtask`',
        activeLine: 3,
        callStack: ['main()'],
        webApis: [],
        microtasks: ['Nastavak foo() nakon await-a'],
        macrotasks: [],
        consoleLogs: ['C: sinhroni početak', 'A: foo početak'],
        explanation: '`await` se interno odmotava u `Promise.resolve().then(nastavak)`. Kontrola se odmah sinhrono vraća funkciji `main()`.'
      },
      {
        stepNumber: 4,
        description: 'Izvršavanje sinhronog kraja skripte',
        activeLine: 8,
        callStack: ['main()', "console.log('D: sinhroni kraj')"],
        webApis: [],
        microtasks: ['Nastavak foo() nakon await-a'],
        macrotasks: [],
        consoleLogs: ['C: sinhroni početak', 'A: foo početak', 'D: sinhroni kraj'],
        explanation: '`main()` završava sinhrono izvršavanje. `Call Stack` se prazni.'
      },
      {
        stepNumber: 5,
        description: 'Event Loop preuzima mikrozadatak i nastavlja izvršavanje funkcije `foo()`',
        activeLine: 4,
        callStack: ['foo() [nastavljeno]', "console.log('B: foo nastavak')"],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        consoleLogs: ['C: sinhroni početak', 'A: foo početak', 'D: sinhroni kraj', 'B: foo nastavak (Microtask)'],
        explanation: 'Preostali deo tela funkcije `foo()` se izvršava i uspešno završava rad.'
      }
    ]
  }
];

export const EventLoopVisualizer: React.FC = () => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1800);

  const currentPreset = EVENT_LOOP_PRESETS[selectedPresetIndex];
  const step = currentPreset.steps[currentStepIndex];

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < currentPreset.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentPreset, speed]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    if (currentStepIndex < currentPreset.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div id="event-loop-visualizer-root" className="bg-[#FFFFFF] dark:bg-[#18181B] text-[#1A1A1A] dark:text-[#F4F4F5] rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-6">
      {/* Header & Preset Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5DF] dark:border-[#27272A] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#B45309]/10 dark:bg-[#F59E0B]/10 text-[#B45309] dark:text-[#FCD34D] font-mono text-[11px] font-bold border border-[#B45309]/20 dark:border-[#F59E0B]/30">
              <Zap className="w-3.5 h-3.5 inline-block mr-1" />
              Arhitektura Runtime-a
            </span>
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight">Vizuelna simulacija JavaScript Event Loop-a</h3>
          </div>
          <p className="text-xs text-[#73736C] dark:text-[#A1A1AA] font-serif italic mt-1">
            Posmatrajte Call Stack, Web API-je, Microtask i Macrotask redove u hronološkom nizu.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF9F5] dark:bg-[#27272A] p-1 rounded-xl border border-[#E5E5DF] dark:border-[#3F3F46]">
          {EVENT_LOOP_PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPresetIndex(idx);
                setCurrentStepIndex(0);
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[36px] flex items-center ${
                selectedPresetIndex === idx
                  ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] shadow-sm'
                  : 'text-[#575750] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5]'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Code with Active Line Highlight (5 cols) */}
        <div className="lg:col-span-5 bg-[#FAF9F5] dark:bg-[#202023] rounded-xl p-4 border border-[#E5E5DF] dark:border-[#27272A] font-mono text-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E5DF] dark:border-[#27272A] text-xs text-[#73736C] dark:text-[#A1A1AA]">
              <span className="font-semibold flex items-center gap-1.5 text-[#1A1A1A] dark:text-[#F4F4F5]">
                <Terminal className="w-3.5 h-3.5 text-[#B45309] dark:text-[#F59E0B]" />
                Izvorni Kod
              </span>
              <span className="font-mono">Korak {currentStepIndex + 1} od {currentPreset.steps.length}</span>
            </div>
            <div className="space-y-1.5 text-xs sm:text-sm">
              {currentPreset.code.split('\n').map((line, idx) => {
                const lineNum = idx + 1;
                const isCurrentActive = step.activeLine === lineNum;
                const rawLine = line.replace(/^\d+:\s*/, '');
                const highlighted = Prism.highlight(rawLine, Prism.languages.javascript, 'javascript');
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 px-2.5 py-1.5 rounded-lg transition-colors ${
                      isCurrentActive
                        ? 'bg-[#18181B] dark:bg-[#27272A] text-[#F4F4F5] border-l-4 border-[#F59E0B] font-bold shadow-sm'
                        : 'text-[#40403C] dark:text-[#D4D4D8] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A]'
                    }`}
                  >
                    <span className="text-[#A3A39A] dark:text-[#71717A] select-none text-xs w-5 font-mono">{lineNum}</span>
                    <span
                      className="font-mono"
                      dangerouslySetInnerHTML={{ __html: highlighted }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation Box */}
          <div className="mt-4 p-3.5 bg-[#FFFFFF] dark:bg-[#18181B] rounded-lg border border-[#E5E5DF] dark:border-[#27272A] text-xs text-[#262624] dark:text-[#E4E4E7] leading-relaxed shadow-sm">
            <span className="font-serif font-bold text-[#B45309] dark:text-[#F59E0B] block mb-1">
              Faza {step.stepNumber}: <FormattedText text={step.description} />
            </span>
            <FormattedText text={step.explanation} as="p" className="text-xs text-[#575750] dark:text-[#A1A1AA] leading-relaxed" />
          </div>
        </div>

        {/* Right Column: Execution Queues & Memory (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Call Stack (LIFO) */}
          <div className="bg-[#FAF9F5] dark:bg-[#202023] rounded-xl p-3.5 border border-[#E5E5DF] dark:border-[#27272A] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#1E40AF] dark:text-[#60A5FA] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#3B82F6]" />
                Call Stack (LIFO)
              </span>
              <span className="text-[11px] text-[#73736C] dark:text-[#A1A1AA] font-mono">Glavna Nit</span>
            </div>
            <div className="flex-1 min-h-[110px] bg-[#FFFFFF] dark:bg-[#18181B] rounded-lg p-2.5 border border-[#E5E5DF] dark:border-[#27272A] flex flex-col-reverse justify-start gap-1.5 overflow-hidden">
              {step.callStack.length === 0 ? (
                <div className="text-xs text-[#A3A39A] dark:text-[#71717A] italic text-center my-auto font-serif">Stack je prazan</div>
              ) : (
                step.callStack.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1.5 bg-[#EFF6FF] dark:bg-[#172554] border border-[#BFDBFE] dark:border-[#1E3A8A] text-[#1E40AF] dark:text-[#93C5FD] text-xs font-mono font-bold rounded shadow-sm"
                  >
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. Web APIs / Background Threads */}
          <div className="bg-[#FAF9F5] dark:bg-[#202023] rounded-xl p-3.5 border border-[#E5E5DF] dark:border-[#27272A] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#16A34A] dark:text-[#22C55E]" />
                Web APIs / Tajmeri
              </span>
              <span className="text-[11px] text-[#73736C] dark:text-[#A1A1AA] font-mono">Nit Browser-a</span>
            </div>
            <div className="flex-1 min-h-[110px] bg-[#FFFFFF] dark:bg-[#18181B] rounded-lg p-2.5 border border-[#E5E5DF] dark:border-[#27272A] flex flex-col gap-1.5">
              {step.webApis.length === 0 ? (
                <div className="text-xs text-[#A3A39A] dark:text-[#71717A] italic text-center my-auto font-serif">Nema aktivnih tajmera</div>
              ) : (
                step.webApis.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1.5 bg-[#F0FDF4] dark:bg-[#0E2718] border border-[#BBF7D0] dark:border-[#14532D] text-[#166534] dark:text-[#86EFAC] text-xs font-mono rounded"
                  >
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 3. Microtask Queue (High Priority) */}
          <div className="bg-[#FAF9F5] dark:bg-[#202023] rounded-xl p-3.5 border border-[#E5E5DF] dark:border-[#27272A] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#6B21A8] dark:text-[#C084FC] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#9333EA] dark:text-[#A855F7]" />
                Microtask Red
              </span>
              <span className="text-[10px] bg-[#FAF5FF] dark:bg-[#2E1065] text-[#6B21A8] dark:text-[#E9D5FF] px-1.5 py-0.5 rounded border border-[#E9D5FF] dark:border-[#581C87] font-mono">
                Promises
              </span>
            </div>
            <div className="flex-1 min-h-[90px] bg-[#FFFFFF] dark:bg-[#18181B] rounded-lg p-2.5 border border-[#E5E5DF] dark:border-[#27272A] flex flex-col gap-1.5">
              {step.microtasks.length === 0 ? (
                <div className="text-xs text-[#A3A39A] dark:text-[#71717A] italic text-center my-auto font-serif">Red je prazan</div>
              ) : (
                step.microtasks.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1.5 bg-[#FAF5FF] dark:bg-[#2E1065] border border-[#E9D5FF] dark:border-[#581C87] text-[#6B21A8] dark:text-[#E9D5FF] text-xs font-mono rounded"
                  >
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 4. Macrotask / Callback Queue */}
          <div className="bg-[#FAF9F5] dark:bg-[#202023] rounded-xl p-3.5 border border-[#E5E5DF] dark:border-[#27272A] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#B45309] dark:text-[#F59E0B] flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F59E0B]" />
                Macrotask Red
              </span>
              <span className="text-[10px] bg-[#FFFBEB] dark:bg-[#451A03] text-[#B45309] dark:text-[#FDE68A] px-1.5 py-0.5 rounded border border-[#FDE68A] dark:border-[#78350F] font-mono">
                setTimeout
              </span>
            </div>
            <div className="flex-1 min-h-[90px] bg-[#FFFFFF] dark:bg-[#18181B] rounded-lg p-2.5 border border-[#E5E5DF] dark:border-[#27272A] flex flex-col gap-1.5">
              {step.macrotasks.length === 0 ? (
                <div className="text-xs text-[#A3A39A] dark:text-[#71717A] italic text-center my-auto font-serif">Red je prazan</div>
              ) : (
                step.macrotasks.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1.5 bg-[#FFFBEB] dark:bg-[#451A03] border border-[#FDE68A] dark:border-[#78350F] text-[#92400E] dark:text-[#FDE68A] text-xs font-mono rounded"
                  >
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Console Output (Full width of right column) */}
          <div className="sm:col-span-2 bg-[#141413] dark:bg-[#09090B] rounded-xl p-3.5 border border-[#2B2B28] dark:border-[#27272A]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6EE7B7] dark:text-[#34D399] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Konzolni Ispis (Console)
              </span>
              <span className="text-[11px] text-[#73736C] dark:text-[#71717A] font-mono">{step.consoleLogs.length} zapisa</span>
            </div>
            <div className="min-h-[60px] font-mono text-xs text-[#A7F3D0] dark:text-[#6EE7B7] space-y-1">
              {step.consoleLogs.length === 0 ? (
                <span className="text-[#52524E] dark:text-[#52525B] italic font-serif">Još uvek nema ispisanog izlaza...</span>
              ) : (
                step.consoleLogs.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[#52524E] dark:text-[#52525B] select-none">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Playback Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E5E5DF] dark:border-[#27272A]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] font-semibold text-xs hover:bg-[#333330] dark:hover:bg-[#D97706] transition shadow-sm cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-[#F59E0B] dark:text-[#18181B]" /> : <Play className="w-4 h-4 text-[#F59E0B] dark:text-[#18181B]" />}
            <span>{isPlaying ? 'Pauziraj' : 'Automatsko puštanje'}</span>
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-3 py-2 rounded-xl bg-[#FAF9F5] dark:bg-[#27272A] border border-[#E5E5DF] dark:border-[#3F3F46] text-[#1A1A1A] dark:text-[#F4F4F5] text-xs font-medium hover:bg-[#EBEBE5] dark:hover:bg-[#3F3F46] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            Prethodni korak
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === currentPreset.steps.length - 1}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#FAF9F5] dark:bg-[#27272A] border border-[#E5E5DF] dark:border-[#3F3F46] text-[#1A1A1A] dark:text-[#F4F4F5] text-xs font-medium hover:bg-[#EBEBE5] dark:hover:bg-[#3F3F46] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <span>Sledeći korak</span>
            <FastForward className="w-3.5 h-3.5 text-[#B45309] dark:text-[#F59E0B]" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-[#FAF9F5] dark:bg-[#27272A] border border-[#E5E5DF] dark:border-[#3F3F46] text-[#73736C] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5] hover:bg-[#EBEBE5] dark:hover:bg-[#3F3F46] transition cursor-pointer"
            title="Restartuj na početak"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed & Progress */}
        <div className="flex items-center gap-4 text-xs text-[#73736C] dark:text-[#A1A1AA]">
          <div className="flex items-center gap-2">
            <span className="font-serif italic">Brzina:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="bg-[#FFFFFF] dark:bg-[#27272A] border border-[#E5E5DF] dark:border-[#3F3F46] rounded-lg px-2 py-1 text-[#1A1A1A] dark:text-[#F4F4F5] text-xs font-mono outline-none shadow-sm cursor-pointer"
            >
              <option value={2600}>Sporo (2.6s)</option>
              <option value={1800}>Normalno (1.8s)</option>
              <option value={1000}>Brzo (1.0s)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            {currentPreset.steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] scale-125'
                    : idx < currentStepIndex
                    ? 'bg-[#B45309] dark:bg-[#F59E0B]/60'
                    : 'bg-[#E5E5DF] dark:bg-[#3F3F46]'
                }`}
                title={`Idi na korak ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
