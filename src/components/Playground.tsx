import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Clock, AlertCircle, Code2, Eye } from 'lucide-react';
import { runJavaScriptCode } from '../utils/codeRunner';
import { ExecutionResult } from '../types';
import { CodeBlock } from './CodeBlock';
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
    }
  ];

  const [code, setCode] = useState<string>(initialCode || PLAYGROUND_PRESETS[0].code);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const [editorMode, setEditorMode] = useState<'edit' | 'highlight'>('edit');
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Editor Container (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] dark:bg-[#18181B] text-[#1A1A1A] dark:text-[#F4F4F5] rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5E5DF] dark:border-[#27272A] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block"></span>
                <span className="text-xs font-mono text-[#73736C] dark:text-[#A1A1AA] ml-2">sandbox.js</span>
              </div>

              {/* Toggle Edit vs Highlight & Copy */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#FAF9F5] dark:bg-[#27272A] p-0.5 rounded-lg border border-[#E5E5DF] dark:border-[#3F3F46] text-xs">
                  <button
                    onClick={() => setEditorMode('edit')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 cursor-pointer ${
                      editorMode === 'edit'
                        ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] shadow-sm font-semibold'
                        : 'text-[#73736C] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5]'
                    }`}
                  >
                    <Code2 className="w-3 h-3" />
                    <span>{localize('Uredi', 'Edit')}</span>
                  </button>
                  <button
                    onClick={() => setEditorMode('highlight')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 cursor-pointer ${
                      editorMode === 'highlight'
                        ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] shadow-sm font-semibold'
                        : 'text-[#73736C] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5]'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>{localize('Pregled', 'Preview')}</span>
                  </button>
                </div>

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

            {/* Code Textarea or Highlighted CodeBlock */}
            {editorMode === 'edit' ? (
              <div className="relative">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={localize('// Upišite ili nalepite vaš JavaScript kod ovde...', '// Type or paste your JavaScript code here...')}
                  rows={14}
                  className="w-full bg-[#18181B] dark:bg-[#121214] text-[#F4F4F5] font-mono text-xs p-4 rounded-xl border border-[#27272A] dark:border-[#3F3F46] focus:border-[#F59E0B] focus:outline-none resize-none leading-relaxed shadow-inner"
                  spellCheck={false}
                />
              </div>
            ) : (
              <div className="min-h-[295px]">
                <CodeBlock
                  code={code || (locale === 'sr' ? '// (Editor je prazan. Kliknite "Uredi" da upišete JavaScript kod)' : '// (Editor is empty. Click "Edit" to type JavaScript code)')}
                  language="javascript"
                  showLineNumbers={true}
                  showCopyButton={false}
                />
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E5E5DF] dark:border-[#27272A] mt-2">
            <span className="text-xs text-[#73736C] dark:text-[#A1A1AA] font-serif italic">
              {localize('Podržava ES2024+, async/await i standardne console funkcije', 'Supports ES2024+, async/await and standard console functions')}
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
        <div className="lg:col-span-5 bg-[#FFFFFF] dark:bg-[#18181B] text-[#1A1A1A] dark:text-[#F4F4F5] rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5E5DF] dark:border-[#27272A] pb-3">
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
            <div className="min-h-[260px] max-h-[360px] overflow-y-auto bg-[#141413] dark:bg-[#09090B] rounded-xl p-4 border border-[#2B2B28] dark:border-[#27272A] font-mono text-xs space-y-2">
              {!result ? (
                <div className="text-[#73736C] dark:text-[#71717A] italic text-center my-16 font-serif">
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

          <div className="pt-3 border-t border-[#E5E5DF] dark:border-[#27272A] text-[11px] text-[#73736C] dark:text-[#A1A1AA] flex items-center justify-between mt-2">
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
