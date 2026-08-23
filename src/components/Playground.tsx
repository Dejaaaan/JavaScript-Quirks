import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Clock, AlertCircle } from 'lucide-react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import { runJavaScriptCode } from '../utils/codeRunner';
import { ExecutionResult } from '../types';
import { useI18n } from '../i18n';

interface PlaygroundProps {
  initialCode?: string;
}

export const Playground: React.FC<PlaygroundProps> = ({ initialCode }) => {
  const { locale, m, localize } = useI18n();

  const PLAYGROUND_PRESETS = [
    {
      name: locale === 'sr' ? 'JSFuck Primitivi (+!+[])' : 'JSFuck Primitives (+!+[])',
      code: `// JSFuck uses only 6 characters: []()!+
console.log("0 in JSFuck:       +[]           =>", +[]);
console.log("1 in JSFuck:       +!+[]         =>", +!+[]);
console.log("2 in JSFuck:       !+[] + !+[]   =>", !+[] + !+[]);
console.log("String 'true':      (![] + [])    =>", ![] + []);
console.log("Letter 'a':         (![] + [])[1] =>", (![] + [])[1]);
console.log("Letter 't':         (true + '')[0]=>", (true + '')[0]);`
    },
    {
      name: locale === 'sr' ? 'Prototip i Pretraga Svojstava' : 'Prototype & Property Lookup',
      code: `const proto = {
  greeting: "Hello",
  sayHi() {
    return this.greeting + ", " + this.name;
  }
};

const user = Object.create(proto);
user.name = "Grace Hopper";

console.log("user.greeting (inherited):", user.greeting);
console.log("user.sayHi():", user.sayHi());
console.log("user.hasOwnProperty('greeting'):", user.hasOwnProperty('greeting'));
console.log("user.hasOwnProperty('name'):", user.hasOwnProperty('name'));`
    },
    {
      name: locale === 'sr' ? 'Objektni Ključevi i Stringifikacija' : 'Object Keys & Stringification',
      code: `const map = {};
const keyA = { id: 1 };
const keyB = { id: 2 };

map[keyA] = "Value for A";
map[keyB] = "Value for B"; // Overwrites because both keys become "[object Object]"!

console.log("map[keyA] =>", map[keyA]);
console.log("Object keys =>", Object.keys(map));

// Safe modern alternative with Map:
const safeMap = new Map();
safeMap.set(keyA, "Value A");
safeMap.set(keyB, "Value B");
console.log("safeMap.get(keyA) =>", safeMap.get(keyA));
console.log("safeMap.get(keyB) =>", safeMap.get(keyB));`
    },
    {
      name: locale === 'sr' ? 'Async Promise Microtask Redosled' : 'Async Promise Microtask Queue',
      code: `console.log("1. Synchronous start");

setTimeout(() => {
  console.log("4. setTimeout (Macrotask)");
}, 0);

Promise.resolve()
  .then(() => console.log("2. Microtask 1"))
  .then(() => console.log("3. Microtask 2"));

console.log("5. Synchronous end");`
    },
    {
      name: locale === 'sr' ? 'Preciznost Pokretnog Zareza (IEEE 754)' : 'Floating Point Precision (IEEE 754)',
      code: `const a = 0.1;
const b = 0.2;
const sum = a + b;

console.log("0.1 + 0.2 actual value:", sum);
console.log("0.1 + 0.2 === 0.3:", sum === 0.3);
console.log("Is difference < Number.EPSILON?:", Math.abs(sum - 0.3) < Number.EPSILON);

const maxSafe = Number.MAX_SAFE_INTEGER;
console.log("MAX_SAFE_INTEGER:", maxSafe);
console.log("maxSafe + 1 === maxSafe + 2:", maxSafe + 1 === maxSafe + 2);`
    },
    {
      name: locale === 'sr' ? 'ES2026/ES2024: Object.groupBy i Promise.withResolvers' : 'ES2026/ES2024: Object.groupBy & Promise.withResolvers',
      code: `// 1. Native Object.groupBy (ES2024+)
const inventory = [
  { name: 'Apple', type: 'fruit', qty: 10 },
  { name: 'Banana', type: 'fruit', qty: 0 },
  { name: 'Carrot', type: 'vegetable', qty: 15 },
  { name: 'Broccoli', type: 'vegetable', qty: 8 }
];

if (typeof Object.groupBy === 'function') {
  const grouped = Object.groupBy(inventory, (item) => item.type);
  console.log("Object.groupBy result:", grouped);
} else {
  console.log("Object.groupBy fallback demo");
}

// 2. Promise.withResolvers (ES2024+)
if (typeof Promise.withResolvers === 'function') {
  const { promise, resolve, reject } = Promise.withResolvers();
  promise.then((val) => console.log("Promise.withResolvers received:", val));
  resolve("Resolved cleanly without new Promise constructor callback!");
} else {
  console.log("Promise.withResolvers is supported in modern ES runtimes");
}

// 3. Immutable Array methods (toSorted, toReversed, toSpliced, with)
const original = [3, 1, 4, 1, 5];
const sorted = original.toSorted();
console.log("Original array (unmutated):", original);
console.log("toSorted array:", sorted);`
    }
  ];

  const [code, setCode] = useState<string>(initialCode || PLAYGROUND_PRESETS[0].code);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleRun = async () => {
    setIsRunning(true);
    const res = await runJavaScriptCode(code);
    setResult(res);
    setIsRunning(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div id="playground-root" className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5DF] dark:border-[#27272A] pb-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight flex items-center gap-2">
            <Terminal className="w-6 h-6 text-[#047857] dark:text-[#34D399]" />
            <span>{m.play_title()}</span>
          </h2>
          <p className="text-xs text-[#73736C] dark:text-[#A1A1AA] font-serif italic mt-0.5">
            {m.play_subtitle()}
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-[#73736C] dark:text-[#A1A1AA] font-mono font-medium">{localize('Primeri:', 'Presets:')}</span>
          {PLAYGROUND_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCode(preset.code);
                setResult(null);
              }}
              className="px-2.5 py-1 text-xs rounded-lg bg-[#FFFFFF] dark:bg-[#202023] text-[#575750] dark:text-[#D4D4D8] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5] transition border border-[#E5E5DF] dark:border-[#3F3F46] shadow-sm font-medium cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Code Editor on Left, Console Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Editor Container (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] dark:bg-[#18181B] text-[#1A1A1A] dark:text-[#F4F4F5] rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col min-h-[580px] h-full justify-between">
          <div className="flex flex-col flex-1 min-h-0 space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5E5DF] dark:border-[#27272A] pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block"></span>
                <span className="text-xs font-mono text-[#73736C] dark:text-[#A1A1AA] ml-2">sandbox.js</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#FAF9F5] dark:bg-[#27272A] text-[#73736C] dark:text-[#A1A1AA] border border-[#E5E5DF] dark:border-[#3F3F46]">
                  {localize('Uživo označavanje koda', 'Live Syntax Highlighting')}
                </span>
              </div>

              {/* Action buttons (Copy, Clear) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-[#575750] dark:text-[#D4D4D8] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5] px-2.5 py-1 rounded-lg bg-[#FAF9F5] dark:bg-[#27272A] hover:bg-[#EBEBE5] dark:hover:bg-[#3F3F46] border border-[#E5E5DF] dark:border-[#3F3F46] transition cursor-pointer"
                  title={localize('Kopirajte kod', 'Copy code')}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#15803D] dark:text-[#4ADE80]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? localize('Kopirano', 'Copied') : localize('Kopiraj', 'Copy')}</span>
                </button>
                <button
                  onClick={() => setCode('')}
                  className="p-1.5 rounded-lg text-[#575750] dark:text-[#D4D4D8] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5] hover:bg-[#FAF9F5] dark:hover:bg-[#27272A] border border-[#E5E5DF] dark:border-[#3F3F46] transition cursor-pointer"
                  title={localize('Ispraznite editor', 'Clear editor')}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Syntax-Highlighted Editor that fills the entire container */}
            <div className="rounded-xl border border-[#27272A] dark:border-[#3F3F46] bg-[#18181B] dark:bg-[#121214] flex flex-1 min-h-[460px] overflow-hidden shadow-inner focus-within:border-[#F59E0B] focus-within:ring-1 focus-within:ring-[#F59E0B] transition">
              {/* Line Numbers Gutter */}
              <div className="select-none py-3 px-2.5 text-right font-mono text-xs text-[#52525B] bg-[#141416] dark:bg-[#0D0D0E] border-r border-[#27272A] dark:border-[#27272A] flex flex-col shrink-0 min-w-[2.75rem] leading-[1.65rem] overflow-hidden">
                {lines.map((_, i) => (
                  <span key={i} className="block text-[11px] font-mono leading-[1.65rem] opacity-75">
                    {i + 1}
                  </span>
                ))}
              </div>

              {/* Editable Code Area */}
              <div className="flex-1 overflow-x-auto overflow-y-auto h-full flex flex-col">
                <Editor
                  value={code}
                  onValueChange={(val) => setCode(val)}
                  highlight={(c) => Prism.highlight(c, Prism.languages.javascript, 'javascript')}
                  padding={12}
                  className="font-mono text-xs flex-1"
                  placeholder={localize('// Upišite ili nalepite vaš JavaScript kod ovde...', '// Type or paste your JavaScript code here...')}
                  style={{
                    fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                    fontSize: '12px',
                    lineHeight: '1.65rem',
                    minHeight: '100%',
                    color: '#F4F4F5',
                    backgroundColor: 'transparent',
                    outline: 'none',
                  }}
                  textareaClassName="focus:outline-none focus:ring-0 leading-[1.65rem]"
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E5E5DF] dark:border-[#27272A] mt-3 shrink-0">
            <span className="text-xs text-[#73736C] dark:text-[#A1A1AA] font-serif italic">
              {localize('Podržava ES2026, async/await i standardne console funkcije', 'Supports ES2026, async/await and standard console functions')}
            </span>
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1A1A1A] dark:bg-[#F59E0B] hover:bg-[#333330] dark:hover:bg-[#D97706] text-[#F9F9F7] dark:text-[#18181B] font-semibold text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-[#F59E0B] dark:text-[#18181B]" />
              <span>{isRunning ? localize('Izvršavanje...', 'Executing...') : m.play_run_btn()}</span>
            </button>
          </div>
        </div>

        {/* Console & Result Container (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] dark:bg-[#18181B] text-[#1A1A1A] dark:text-[#F4F4F5] rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col min-h-[580px] h-full justify-between">
          <div className="flex flex-col flex-1 min-h-0 space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5E5DF] dark:border-[#27272A] pb-3 shrink-0">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F4F4F5] flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[#047857] dark:text-[#34D399]" />
                {m.play_console_output()}
              </span>
              {result && (
                <span className="text-[11px] font-mono text-[#73736C] dark:text-[#A1A1AA] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {result.executionTimeMs}ms
                </span>
              )}
            </div>

            {/* Console Log Stream */}
            <div className="flex-1 min-h-[460px] overflow-y-auto bg-[#141413] dark:bg-[#09090B] rounded-xl p-4 border border-[#2B2B28] dark:border-[#27272A] font-mono text-xs space-y-2">
              {!result ? (
                <div className="text-[#73736C] dark:text-[#71717A] italic text-center my-28 font-serif">
                  {m.play_no_output()}
                </div>
              ) : result.logs.length === 0 && !result.returnValue && !result.error ? (
                <div className="text-[#73736C] dark:text-[#71717A] italic">{localize('Kod je izvršen bez ispisa u konzoli.', 'Code executed with no console output.')}</div>
              ) : (
                <>
                  {result.logs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#52524E] select-none">&gt;</span>
                      <span
                        className={
                          log.type === 'error'
                            ? 'text-[#F87171]'
                            : log.type === 'warn'
                            ? 'text-[#FDE68A]'
                            : 'text-[#6EE7B7]'
                        }
                      >
                        {log.content}
                      </span>
                    </div>
                  ))}

                  {result.returnValue !== undefined && (
                    <div className="pt-2 border-t border-[#262624] text-[#93C5FD] flex items-start gap-2">
                      <span className="text-[#52524E] select-none">&lt;</span>
                      <span className="font-bold">{localize('Povratna vrednost:', 'Return value:')} {result.returnValue}</span>
                    </div>
                  )}

                  {result.error && (
                    <div className="p-2.5 rounded bg-[#450A0A] border border-[#7F1D1D] text-[#FCA5A5] flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{result.error}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E5DF] dark:border-[#27272A] text-[11px] text-[#73736C] dark:text-[#A1A1AA] flex items-center justify-between mt-3 shrink-0">
            <span>{localize('Izvršeno u izolovanom okruženju pretraživača', 'Executed in isolated browser environment')}</span>
            <button
              onClick={() => setResult(null)}
              className="text-[#575750] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5] transition font-medium cursor-pointer"
            >
              {m.play_clear_btn()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
