import React, { useState, useEffect, useMemo } from 'react';
import { 
  Code2, 
  Search, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Play, 
  RotateCcw, 
  Clock, 
  Cpu, 
  Check, 
  Copy, 
  Shuffle, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  BookOpen, 
  ArrowLeft, 
  ArrowRight,
  Filter,
  Terminal,
  Zap,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Flame,
  AlertTriangle,
  Lightbulb,
  Edit3,
  Undo2,
  X,
  Trash2
} from 'lucide-react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import { LEETCODE_PROBLEMS } from '../data/leetcodeProblems';
import { LeetCodeProblem, LeetCodeDifficulty, LeetCodeCategory } from '../types';
import { CodeBlock } from './CodeBlock';
import { FormattedText } from './FormattedText';
import { useI18n } from '../i18n';

interface LeetCodeSectionProps {
  onOpenInPlayground?: (code: string) => void;
}

interface TestCaseResult {
  testId: string;
  passed: boolean;
  actualOutput: any;
  actualStr: string;
  executionTimeMs: number;
  error?: string;
}

interface ConsoleLogEntry {
  id: string;
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  testLabel?: string;
  timestamp: string;
}

export const LeetCodeSection: React.FC<LeetCodeSectionProps> = ({ onOpenInPlayground }) => {
  const { locale, m } = useI18n();
  const [selectedProblemId, setSelectedProblemId] = useState<string>(LEETCODE_PROBLEMS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'optimal' | 'problem' | 'comparison'>('optimal');
  const [isOutputExpanded, setIsOutputExpanded] = useState<boolean>(false);
  const [outputTab, setOutputTab] = useState<'tests' | 'console'>('tests');
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogEntry[]>([]);
  
  // Solved tracking via localStorage
  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('js_coding_challenges_solved') || localStorage.getItem('js_leetcode_solved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Editable Solution Code state per problem
  const [customCodes, setCustomCodes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('js_challenges_custom_codes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('js_challenges_custom_codes', JSON.stringify(customCodes));
    } catch (e) {
      console.error(e);
    }
  }, [customCodes]);

  // Test Runner state
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestCaseResult[] | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isRunnerEditorExpanded, setIsRunnerEditorExpanded] = useState<boolean>(true);

  useEffect(() => {
    try {
      localStorage.setItem('js_coding_challenges_solved', JSON.stringify(solvedIds));
    } catch (e) {
      console.error(e);
    }
  }, [solvedIds]);

  const toggleSolved = (problemId: string) => {
    setSolvedIds((prev) =>
      prev.includes(problemId) ? prev.filter((id) => id !== problemId) : [...prev, problemId]
    );
  };

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return LEETCODE_PROBLEMS.filter((problem) => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesNum = `#${problem.number}`.includes(q) || String(problem.number).includes(q);
        const matchesTitle = problem.title.toLowerCase().includes(q) || (problem.titleEn && problem.titleEn.toLowerCase().includes(q));
        const matchesCategory = problem.category.toLowerCase().includes(q);
        const matchesPattern = problem.pattern.toLowerCase().includes(q);
        const matchesTags = problem.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesNum && !matchesTitle && !matchesCategory && !matchesPattern && !matchesTags) {
          return false;
        }
      }

      // Difficulty filter
      if (selectedDifficulty !== 'All' && problem.difficulty !== selectedDifficulty) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && problem.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedDifficulty, selectedCategory]);

  const currentProblem: LeetCodeProblem = useMemo(() => {
    const found = LEETCODE_PROBLEMS.find((p) => p.id === selectedProblemId);
    return found || filteredProblems[0] || LEETCODE_PROBLEMS[0];
  }, [selectedProblemId, filteredProblems]);

  // Current problem's active code (custom or optimal)
  const currentCode = customCodes[currentProblem.id] ?? currentProblem.optimalSolution.code;
  const isCodeModified = customCodes[currentProblem.id] !== undefined && customCodes[currentProblem.id] !== currentProblem.optimalSolution.code;

  const handleCodeChange = (newCode: string) => {
    setCustomCodes((prev) => ({
      ...prev,
      [currentProblem.id]: newCode
    }));
  };

  const handleResetCode = () => {
    setCustomCodes((prev) => {
      const next = { ...prev };
      delete next[currentProblem.id];
      return next;
    });
  };

  const handleLoadBruteForce = () => {
    if (currentProblem.bruteForceSolution) {
      handleCodeChange(currentProblem.bruteForceSolution.code);
    }
  };

  const currentIndex = filteredProblems.findIndex((p) => p.id === currentProblem.id);

  const handlePrevProblem = () => {
    if (currentIndex > 0) {
      setSelectedProblemId(filteredProblems[currentIndex - 1].id);
      setTestResults(null);
    }
  };

  const handleNextProblem = () => {
    if (currentIndex < filteredProblems.length - 1) {
      setSelectedProblemId(filteredProblems[currentIndex + 1].id);
      setTestResults(null);
    }
  };

  const handleRandomProblem = () => {
    const randomIndex = Math.floor(Math.random() * LEETCODE_PROBLEMS.length);
    setSelectedProblemId(LEETCODE_PROBLEMS[randomIndex].id);
    setTestResults(null);
  };

  const handleCopyCode = () => {
    if (currentProblem) {
      navigator.clipboard.writeText(currentCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const formatConsoleArg = (arg: any): string => {
    if (arg === undefined) return 'undefined';
    if (arg === null) return 'null';
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg, null, 2);
      } catch {
        return String(arg);
      }
    }
    return String(arg);
  };

  // Safe client-side Sandbox Test Runner & Console Capture
  const handleRunTests = async (customCodeToRun?: string) => {
    if (!currentProblem) return;
    setIsRunningTests(true);
    setTestResults(null);
    setIsOutputExpanded(true);

    let currentTestLabel = locale === 'sr' ? 'Inicijalizacija' : 'Initialization';
    const capturedLogs: ConsoleLogEntry[] = [];

    const addLog = (type: 'log' | 'warn' | 'error' | 'info', args: any[]) => {
      capturedLogs.push({
        id: Math.random().toString(36).substring(2, 9),
        type,
        message: args.map(formatConsoleArg).join(' '),
        testLabel: currentTestLabel,
        timestamp: new Date().toLocaleTimeString()
      });
    };

    const customConsole = {
      log: (...args: any[]) => addLog('log', args),
      warn: (...args: any[]) => addLog('warn', args),
      error: (...args: any[]) => addLog('error', args),
      info: (...args: any[]) => addLog('info', args)
    };

    // Backup global console methods during execution so direct/window calls are also intercepted
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;
    const origInfo = console.info;

    try {
      console.log = customConsole.log;
      console.warn = customConsole.warn;
      console.error = customConsole.error;
      console.info = customConsole.info;

      // Evaluate active user code in a function constructor wrapper with injected console
      const codeToRun = customCodeToRun ?? currentCode;
      const fnName = currentProblem.runFunctionName;

      // Sandbox wrapper
      const createRunner = new Function('console', `
        ${codeToRun}
        if (typeof ${fnName} !== 'function') {
          throw new Error('Funkcija "${fnName}" nije definisana u kodu.');
        }
        return ${fnName};
      `);

      const userFn = createRunner(customConsole);
      const results: TestCaseResult[] = [];

      let tcIdx = 1;
      for (const tc of currentProblem.testCases) {
        currentTestLabel = `Test #${tcIdx}: ${tc.name || tc.id}`;
        tcIdx++;

        const startTime = performance.now();
        try {
          // Deep clone input params to avoid mutation side-effects across tests
          const clonedParams = JSON.parse(JSON.stringify(tc.inputParams));
          const output = userFn(...clonedParams);
          const endTime = performance.now();

          // Compare result
          let passed = false;
          const expected = tc.expectedOutput;

          if (Array.isArray(expected)) {
            // For array results, normalize comparison
            const actualStr = JSON.stringify(output);
            const expectedStr = JSON.stringify(expected);
            // If Two Sum where order might be flexible
            if (currentProblem.id === 'two-sum' && Array.isArray(output) && output.length === 2) {
              passed = (output[0] === expected[0] && output[1] === expected[1]) ||
                       (output[0] === expected[1] && output[1] === expected[0]);
            } else {
              passed = actualStr === expectedStr;
            }
          } else if (typeof expected === 'object' && expected !== null) {
            passed = JSON.stringify(output) === JSON.stringify(expected);
          } else {
            passed = output === expected;
          }

          results.push({
            testId: tc.id,
            passed,
            actualOutput: output,
            actualStr: typeof output === 'object' ? JSON.stringify(output) : String(output),
            executionTimeMs: Number((endTime - startTime).toFixed(3))
          });
        } catch (err: any) {
          const endTime = performance.now();
          results.push({
            testId: tc.id,
            passed: false,
            actualOutput: null,
            actualStr: locale === 'sr' ? 'Greška' : 'Error',
            executionTimeMs: Number((endTime - startTime).toFixed(3)),
            error: err?.message || String(err)
          });
        }
      }

      setTestResults(results);
      setConsoleLogs(capturedLogs);
    } catch (err: any) {
      customConsole.error(err?.message || (locale === 'sr' ? 'Greška pri evaluaciji koda.' : 'Error evaluating code.'));
      setConsoleLogs(capturedLogs);
      setTestResults([
        {
          testId: 'error-eval',
          passed: false,
          actualOutput: null,
          actualStr: locale === 'sr' ? 'Kompilaciona greška' : 'Compilation error',
          executionTimeMs: 0,
          error: err?.message || (locale === 'sr' ? 'Greška pri evaluaciji koda.' : 'Error evaluating code.')
        }
      ]);
    } finally {
      console.log = origLog;
      console.warn = origWarn;
      console.error = origError;
      console.info = origInfo;
      setIsRunningTests(false);
    }
  };

  const getDifficultyBadge = (diff: LeetCodeDifficulty) => {
    switch (diff) {
      case 'Easy':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            Easy
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            Medium
          </span>
        );
      case 'Hard':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            Hard
          </span>
        );
    }
  };

  const categories = [
    'All',
    'Arrays & Hash Maps',
    'Two Pointers',
    'Sliding Window',
    'Stack',
    'Linked Lists',
    'Trees',
    'Dynamic Programming',
    'JavaScript & Async'
  ];

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const solvedCount = LEETCODE_PROBLEMS.filter((p) => solvedIds.includes(p.id)).length;
  const progressPercent = Math.round((solvedCount / LEETCODE_PROBLEMS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Editorial Header Section */}
      <div className="p-6 bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5DF] dark:border-[#27272A] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#B45309]/10 text-[#B45309] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D] border border-[#B45309]/20 dark:border-[#F59E0B]/30">
                {m.lc_badge_interview()}
              </span>
              <span className="text-xs text-[#73736C] dark:text-[#A1A1AA] font-mono">
                {m.lc_badge_count({ count: LEETCODE_PROBLEMS.length })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight">
              {m.lc_main_title()}
            </h1>
            <p className="text-xs sm:text-sm text-[#73736C] dark:text-[#A1A1AA] font-serif italic mt-1 max-w-3xl leading-relaxed">
              {m.lc_main_desc()}
            </p>
          </div>

          {/* Progress Tracker Card */}
          <div className="bg-[#F9F9F7] dark:bg-[#202023] p-3.5 rounded-xl border border-[#E5E5DF] dark:border-[#3F3F46] min-w-[200px] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1A1A1A] dark:text-[#F4F4F5]">{m.lc_your_progress()}</span>
              <span className="font-mono font-bold text-[#B45309] dark:text-[#F59E0B]">
                {solvedCount} / {LEETCODE_PROBLEMS.length} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-[#E5E5DF] dark:bg-[#27272A] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#B45309] dark:bg-[#F59E0B] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-[#73736C] dark:text-[#A1A1AA] text-right">
              {m.lc_saved_local()}
            </span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8C82] dark:text-[#71717A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={m.lc_search_placeholder()}
              className="w-full bg-[#F9F9F7] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#3F3F46] rounded-xl pl-9.5 pr-4 py-2 text-xs text-[#1A1A1A] dark:text-[#F4F4F5] placeholder-[#8C8C82] dark:placeholder-[#71717A] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#F59E0B] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#73736C] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5] font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Difficulty and Random Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-[#F9F9F7] dark:bg-[#202023] p-1 rounded-xl border border-[#E5E5DF] dark:border-[#3F3F46]">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-white dark:text-[#18181B] shadow-sm'
                      : 'text-[#575750] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white'
                  }`}
                >
                  {diff === 'All' ? m.diff_all() : diff}
                </button>
              ))}
            </div>

            <button
              onClick={handleRandomProblem}
              className="px-3 py-1.5 rounded-xl border border-[#E5E5DF] dark:border-[#3F3F46] bg-[#F9F9F7] dark:bg-[#202023] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A] text-[#1A1A1A] dark:text-[#F4F4F5] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title={m.lc_random_btn()}
            >
              <Shuffle className="w-3.5 h-3.5 text-[#B45309] dark:text-[#F59E0B]" />
              <span>{m.lc_random_btn()}</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#B45309] dark:bg-[#F59E0B] text-white dark:text-[#18181B] font-semibold shadow-sm'
                  : 'bg-[#F9F9F7] dark:bg-[#202023] text-[#575750] dark:text-[#D4D4D8] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A] border border-[#E5E5DF] dark:border-[#3F3F46]'
              }`}
            >
              {cat === 'All' ? m.filter_all_categories() : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column / Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Problem List Directory (height strictly driven by the right-hand column) */}
        <div className="lg:col-span-4 flex flex-col min-h-[420px] lg:min-h-0 bg-[#FAF9F5] dark:bg-[#202023] rounded-2xl p-4 border border-[#E5E5DF] dark:border-[#27272A] shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E5DF] dark:border-[#27272A] flex-shrink-0">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#73736C] dark:text-[#A1A1AA]">
              {locale === 'sr' ? `Prikazano: ${filteredProblems.length} zadataka` : `Showing: ${filteredProblems.length} problems`}
            </span>
          </div>

          <div className="relative flex-1 min-h-0">
            <div className="absolute inset-0 overflow-y-auto space-y-2 pr-1.5 custom-scrollbar">
              {filteredProblems.map((problem) => {
                const isSelected = problem.id === currentProblem.id;
                const isSolved = solvedIds.includes(problem.id);
                const displayTitle = locale === 'en' ? (problem.titleEn || problem.title) : problem.title;

                return (
                  <div
                    key={problem.id}
                    onClick={() => {
                      setSelectedProblemId(problem.id);
                      setTestResults(null);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-[#FFFFFF] dark:bg-[#202023] border-[#B45309] dark:border-[#F59E0B] shadow-md ring-1 ring-[#B45309]/30 dark:ring-[#F59E0B]/30'
                        : 'bg-[#FFFFFF] dark:bg-[#18181B] border-[#E5E5DF] dark:border-[#27272A] hover:border-[#B45309]/40 dark:hover:border-[#F59E0B]/40 hover:bg-[#FDFDFB] dark:hover:bg-[#1E1E22]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSolved(problem.id);
                          }}
                          className="text-[#8C8C82] hover:text-[#047857] dark:hover:text-[#34D399] transition cursor-pointer"
                          title={isSolved ? (locale === 'sr' ? 'Označi kao nerešeno' : 'Mark as unsolved') : (locale === 'sr' ? 'Označi kao rešeno' : 'Mark as solved')}
                        >
                          {isSolved ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <span className="font-mono text-xs font-bold text-[#73736C] dark:text-[#A1A1AA]">
                          #{problem.number}
                        </span>
                      </div>

                      {getDifficultyBadge(problem.difficulty)}
                    </div>

                    <h3 className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] dark:text-[#F4F4F5] line-clamp-1">
                      {displayTitle}
                    </h3>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E5DF]/60 dark:border-[#27272A] text-[11px] text-[#73736C] dark:text-[#A1A1AA]">
                      <span className="font-mono truncate">{problem.pattern}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 text-[#B45309] dark:text-[#F59E0B]' : 'opacity-40'}`} />
                    </div>
                  </div>
                );
              })}

              {filteredProblems.length === 0 && (
                <div className="p-8 text-center bg-[#FFFFFF] dark:bg-[#18181B] rounded-xl border border-[#E5E5DF] dark:border-[#27272A] space-y-2">
                  <AlertTriangle className="w-8 h-8 text-[#A3A39A] dark:text-[#52525B] mx-auto" />
                  <p className="text-xs text-[#73736C] dark:text-[#A1A1AA]">{m.lc_no_problems_found()}</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedDifficulty('All');
                      setSelectedCategory('All');
                    }}
                    className="text-xs text-[#B45309] dark:text-[#F59E0B] font-bold hover:underline cursor-pointer"
                  >
                    {m.filter_reset()}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Problem Deep Dive & Interactive Workbench */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] shadow-sm overflow-hidden">
            {/* Problem Top Masthead */}
            <div className="p-4 sm:p-6 border-b border-[#E5E5DF] dark:border-[#27272A] bg-[#FAFAF8] dark:bg-[#1C1C1F]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs sm:text-sm text-[#B45309] dark:text-[#F59E0B] bg-[#B45309]/10 dark:bg-[#F59E0B]/20 px-2 py-0.5 rounded">
                      {locale === 'sr' ? `Zadatak #${currentProblem.number}` : `Challenge #${currentProblem.number}`}
                    </span>
                    {getDifficultyBadge(currentProblem.difficulty)}
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#E5E5DF] dark:bg-[#27272A] text-[#575750] dark:text-[#D4D4D8]">
                      {currentProblem.category}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight">
                    {locale === 'en' ? (currentProblem.titleEn || currentProblem.title) : currentProblem.title}
                  </h2>
                  <div className="text-xs text-[#73736C] dark:text-[#A1A1AA] font-mono">
                    {locale === 'sr' ? (
                      <>
                        Engleski naziv: <span className="font-semibold text-[#1A1A1A] dark:text-[#F4F4F5]">{currentProblem.titleEn}</span>
                        <span className="mx-2">·</span>
                        Obrazac: <span className="text-[#B45309] dark:text-[#F59E0B] font-semibold">{currentProblem.pattern}</span>
                      </>
                    ) : (
                      <>
                        Pattern: <span className="text-[#B45309] dark:text-[#F59E0B] font-semibold">{currentProblem.pattern}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  <button
                    onClick={() => toggleSolved(currentProblem.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border min-h-[38px] ${
                      solvedIds.includes(currentProblem.id)
                        ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-[#27272A] border-[#E5E5DF] dark:border-[#3F3F46] text-[#575750] dark:text-[#D4D4D8] hover:text-[#1A1A1A] dark:hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{solvedIds.includes(currentProblem.id) ? m.lc_marked_solved() : m.lc_mark_solved()}</span>
                  </button>

                  <a
                    href={currentProblem.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-[#E5E5DF] dark:border-[#3F3F46] bg-white dark:bg-[#27272A] text-[#73736C] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white transition flex items-center justify-center min-w-[38px] min-h-[38px]"
                    title={m.lc_open_leetcode()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Navigation Controls between problems */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#E5E5DF]/70 dark:border-[#27272A]/70 text-xs">
                <button
                  onClick={handlePrevProblem}
                  disabled={currentIndex <= 0}
                  className="flex items-center gap-1 text-[#73736C] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition font-medium cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{m.lc_prev_problem()}</span>
                </button>

                <div className="flex items-center gap-1">
                  {currentProblem.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EBEBE5] dark:bg-[#27272A] text-[#575750] dark:text-[#A1A1AA]">
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleNextProblem}
                  disabled={currentIndex >= filteredProblems.length - 1}
                  className="flex items-center gap-1 text-[#73736C] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition font-medium cursor-pointer"
                >
                  <span>{m.lc_next_problem()}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Workbench Navigation Sub-Tabs */}
            <div className="flex items-center border-b border-[#E5E5DF] dark:border-[#27272A] px-5 sm:px-6 bg-[#FFFFFF] dark:bg-[#18181B] overflow-x-auto">
              <button
                onClick={() => setActiveTab('optimal')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'optimal'
                    ? 'border-[#B45309] dark:border-[#F59E0B] text-[#B45309] dark:text-[#F59E0B]'
                    : 'border-transparent text-[#73736C] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>{m.lc_tab_optimal()}</span>
              </button>

              <button
                onClick={() => setActiveTab('problem')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'problem'
                    ? 'border-[#B45309] dark:border-[#F59E0B] text-[#B45309] dark:text-[#F59E0B]'
                    : 'border-transparent text-[#73736C] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{m.lc_tab_problem()}</span>
              </button>

              {currentProblem.bruteForceSolution && (
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'comparison'
                      ? 'border-[#B45309] dark:border-[#F59E0B] text-[#B45309] dark:text-[#F59E0B]'
                      : 'border-transparent text-[#73736C] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{m.lc_tab_comparison()}</span>
                </button>
              )}
            </div>

            {/* TAB CONTENT AREA */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* TAB 1: Optimal Solution & Integrated Test Runner */}
              {activeTab === 'optimal' && (
                <div className="space-y-6">
                  {/* Complexity Quick Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="p-3.5 rounded-xl bg-[#F9F9F7] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#27272A] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#73736C] dark:text-[#A1A1AA] font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#B45309] dark:text-[#F59E0B]" />
                        <span>{m.lc_time_complexity()}</span>
                      </div>
                      <div className="font-mono text-sm font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                        {currentProblem.optimalSolution.timeComplexity.split('—')[0].trim()}
                      </div>
                      <p className="text-xs text-[#575750] dark:text-[#A1A1AA] leading-snug">
                        {currentProblem.optimalSolution.timeComplexity.split('—')[1] || currentProblem.optimalSolution.timeComplexity}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F9F9F7] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#27272A] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#73736C] dark:text-[#A1A1AA] font-mono">
                        <Cpu className="w-3.5 h-3.5 text-[#047857] dark:text-[#34D399]" />
                        <span>{m.lc_space_complexity()}</span>
                      </div>
                      <div className="font-mono text-sm font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                        {currentProblem.optimalSolution.spaceComplexity.split('—')[0].trim()}
                      </div>
                      <p className="text-xs text-[#575750] dark:text-[#A1A1AA] leading-snug">
                        {currentProblem.optimalSolution.spaceComplexity.split('—')[1] || currentProblem.optimalSolution.spaceComplexity}
                      </p>
                    </div>
                  </div>

                  {/* Solution Code Block with Copy, Edit & Run Actions */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E5DF] dark:border-[#27272A] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#73736C] dark:text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5 text-[#B45309] dark:text-[#F59E0B]" />
                          <span>{locale === 'en' ? 'Interactive JavaScript Solution' : 'Interaktivno JavaScript Rešenje'}</span>
                        </span>
                        {isCodeModified ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-[#B45309] dark:text-[#FCD34D] border border-amber-500/20">
                            {locale === 'en' ? '● Custom Edited' : '● Izmenjeno'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#EBEBE5] dark:bg-[#27272A] text-[#73736C] dark:text-[#A1A1AA]">
                            {locale === 'en' ? 'Optimal Default' : 'Optimalno podrazumevano'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {currentProblem.bruteForceSolution && (
                          <button
                            onClick={handleLoadBruteForce}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FAF9F5] dark:bg-[#202023] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A] border border-[#E5E5DF] dark:border-[#3F3F46] text-[#73736C] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5] flex items-center gap-1 transition cursor-pointer"
                            title={locale === 'en' ? 'Load naive approach to test its runtime' : 'Učitaj naivno rešenje za poređenje'}
                          >
                            <Layers className="w-3 h-3 text-rose-500" />
                            <span>{locale === 'en' ? 'Load Naive' : 'Učitaj Naivno'}</span>
                          </button>
                        )}

                        {isCodeModified && (
                          <button
                            onClick={handleResetCode}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-[#B45309] dark:text-[#FCD34D] border border-amber-500/30 flex items-center gap-1 transition cursor-pointer"
                            title={locale === 'en' ? 'Reset to optimal solution' : 'Vrati na originalno rešenje'}
                          >
                            <Undo2 className="w-3 h-3" />
                            <span>{locale === 'en' ? 'Reset' : 'Resetuj'}</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleRunTests(currentCode)}
                          disabled={isRunningTests}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white flex items-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{isRunningTests ? (locale === 'en' ? 'Testing...' : 'Testiram...') : (locale === 'en' ? 'Run Tests' : 'Pokreni Testove')}</span>
                        </button>

                        {onOpenInPlayground && (
                          <button
                            onClick={() => onOpenInPlayground(currentCode)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FAF9F5] dark:bg-[#202023] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A] border border-[#E5E5DF] dark:border-[#3F3F46] text-[#1A1A1A] dark:text-[#F4F4F5] flex items-center gap-1 transition cursor-pointer"
                            title={m.card_open_playground()}
                          >
                            <Terminal className="w-3 h-3 text-[#047857] dark:text-[#34D399]" />
                            <span>{m.card_open_playground()}</span>
                          </button>
                        )}

                        <button
                          onClick={handleCopyCode}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FAF9F5] dark:bg-[#202023] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A] border border-[#E5E5DF] dark:border-[#3F3F46] text-[#1A1A1A] dark:text-[#F4F4F5] flex items-center gap-1 transition cursor-pointer"
                        >
                          {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCode ? m.lc_copied() : m.lc_copy()}</span>
                        </button>
                      </div>
                    </div>

                    {/* Live Syntax-Highlighted Editor */}
                    <div className="rounded-xl border border-[#27272A] dark:border-[#3F3F46] bg-[#18181B] dark:bg-[#121214] flex overflow-hidden shadow-inner focus-within:border-[#F59E0B] focus-within:ring-1 focus-within:ring-[#F59E0B] transition">
                      {/* Line numbers gutter */}
                      <div className="select-none py-3 px-2.5 text-right font-mono text-xs text-[#52525B] bg-[#141416] dark:bg-[#0D0D0E] border-r border-[#27272A] dark:border-[#27272A] flex flex-col shrink-0 min-w-[2.5rem] leading-[1.65rem]">
                        {currentCode.split('\n').map((_, i) => (
                          <span key={i} className="block text-[11px] font-mono leading-[1.65rem] opacity-75">
                            {i + 1}
                          </span>
                        ))}
                      </div>

                      {/* Editable Code */}
                      <div className="flex-1 overflow-x-auto min-h-[340px]">
                        <Editor
                          value={currentCode}
                          onValueChange={(val) => handleCodeChange(val)}
                          highlight={(c) => Prism.highlight(c, Prism.languages.javascript, 'javascript')}
                          padding={12}
                          className="font-mono text-xs"
                          placeholder="// Write JavaScript solution here..."
                          style={{
                            fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                            fontSize: '12px',
                            lineHeight: '1.65rem',
                            minHeight: '340px',
                            color: '#F4F4F5',
                            backgroundColor: 'transparent',
                            outline: 'none',
                          }}
                          textareaClassName="focus:outline-none focus:ring-0 leading-[1.65rem]"
                        />
                      </div>
                    </div>

                    {/* Mini Collapsible / Expandable Output Window (Separated Test Runner & Console Output) */}
                    <div className="rounded-xl border border-[#E5E5DF] dark:border-[#27272A] bg-[#FAF9F5] dark:bg-[#18181B] overflow-hidden shadow-xs">
                      {/* Output Window Header */}
                      <div className="px-3 py-2 bg-[#F2F2ED] dark:bg-[#202023] flex items-center justify-between border-b border-[#E5E5DF] dark:border-[#27272A] gap-2 flex-wrap">
                        {/* Left Tab Switcher: Tests vs Console */}
                        <div className="flex items-center gap-1.5 p-0.5 bg-[#E5E5DF]/60 dark:bg-[#121214] rounded-lg">
                          <button
                            onClick={() => {
                              setOutputTab('tests');
                              if (!isOutputExpanded) setIsOutputExpanded(true);
                            }}
                            className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                              outputTab === 'tests'
                                ? 'bg-white dark:bg-[#27272A] text-[#1A1A1A] dark:text-white shadow-xs'
                                : 'text-[#73736C] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white'
                            }`}
                          >
                            <Play className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>{locale === 'sr' ? 'Test Runner' : 'Test Runner'}</span>

                            {/* Summary status badge */}
                            {isRunningTests ? (
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            ) : testResults ? (
                              testResults.every((r) => r.passed) ? (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                                  {testResults.length}/{testResults.length}
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500/20 text-rose-700 dark:text-rose-300">
                                  {testResults.filter((r) => !r.passed).length}/{testResults.length}
                                </span>
                              )
                            ) : (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/5 dark:bg-white/10 text-[#73736C] dark:text-[#A1A1AA]">
                                {currentProblem.testCases.length}
                              </span>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setOutputTab('console');
                              if (!isOutputExpanded) setIsOutputExpanded(true);
                            }}
                            className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                              outputTab === 'console'
                                ? 'bg-white dark:bg-[#27272A] text-[#1A1A1A] dark:text-white shadow-xs'
                                : 'text-[#73736C] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white'
                            }`}
                          >
                            <Terminal className="w-3 h-3 text-[#B45309] dark:text-[#F59E0B]" />
                            <span>{locale === 'sr' ? 'Konzolni Izlaz' : 'Console Output'}</span>
                            {consoleLogs.length > 0 && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                                {consoleLogs.length}
                              </span>
                            )}
                          </button>
                        </div>

                        {/* Right Header Action Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleRunTests(currentCode)}
                            disabled={isRunningTests}
                            className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white flex items-center gap-1 shadow-xs transition cursor-pointer disabled:opacity-50"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>{isRunningTests ? (locale === 'sr' ? 'Testiram...' : 'Running...') : (locale === 'sr' ? 'Pokreni Testove' : 'Run Tests')}</span>
                          </button>

                          {((outputTab === 'tests' && testResults) || (outputTab === 'console' && consoleLogs.length > 0)) && (
                            <button
                              onClick={() => {
                                if (outputTab === 'tests') {
                                  setTestResults(null);
                                } else {
                                  setConsoleLogs([]);
                                }
                              }}
                              className="px-2 py-1 rounded text-xs font-semibold text-[#73736C] dark:text-[#A1A1AA] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer flex items-center gap-1"
                              title={locale === 'sr' ? 'Obriši trenutni izlaz' : 'Clear current output'}
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>{locale === 'sr' ? 'Obriši' : 'Clear'}</span>
                            </button>
                          )}

                          <button
                            onClick={() => setIsOutputExpanded(!isOutputExpanded)}
                            className="px-2 py-1 rounded text-xs font-semibold bg-white dark:bg-[#27272A] border border-[#E5E5DF] dark:border-[#3F3F46] text-[#575750] dark:text-[#D4D4D8] hover:text-[#1A1A1A] dark:hover:text-white flex items-center gap-1 transition cursor-pointer"
                            title={isOutputExpanded ? (locale === 'sr' ? 'Sakrij prozor' : 'Collapse output') : (locale === 'sr' ? 'Proširi prozor' : 'Expand output')}
                          >
                            {isOutputExpanded ? (
                              <>
                                <ChevronUp className="w-3.5 h-3.5" />
                                <span>{locale === 'sr' ? 'Sakrij' : 'Hide'}</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3.5 h-3.5" />
                                <span>{locale === 'sr' ? 'Prikaži' : 'Show'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Output Panel Body (Collapsible) */}
                      {isOutputExpanded && (
                        <div className="p-3.5 bg-[#18181B] dark:bg-[#121214] text-[#F4F4F5] border-t border-[#27272A] space-y-2.5 max-h-[360px] overflow-y-auto font-mono text-xs">
                          {/* TAB 1: TEST RUNNER VIEW */}
                          {outputTab === 'tests' && (
                            testResults ? (
                              <div className="space-y-2.5">
                                {consoleLogs.length > 0 && (
                                  <div
                                    onClick={() => setOutputTab('console')}
                                    className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-between text-xs font-mono transition cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Terminal className="w-3.5 h-3.5 shrink-0" />
                                      <span>
                                        {locale === 'sr'
                                          ? `Zabeleženo ${consoleLogs.length} konzolnih zapisa u ovom testu.`
                                          : `Captured ${consoleLogs.length} console log(s) during this run.`}
                                      </span>
                                    </div>
                                    <span className="text-[11px] underline font-semibold flex items-center gap-1">
                                      {locale === 'sr' ? 'Pogledaj Konzolni Izlaz →' : 'View Console Output →'}
                                    </span>
                                  </div>
                                )}

                                {testResults.map((res, idx) => {
                                  const tc = currentProblem.testCases.find((t) => t.id === res.testId) || currentProblem.testCases[idx];
                                  return (
                                    <div
                                      key={res.testId || idx}
                                      className={`p-3 rounded-lg border ${
                                        res.passed
                                          ? 'bg-emerald-500/5 border-emerald-500/20'
                                          : 'bg-rose-500/5 border-rose-500/20'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between gap-2 mb-1.5">
                                        <div className="flex items-center gap-2">
                                          <span className={`w-2 h-2 rounded-full ${res.passed ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                          <span className="font-bold text-xs text-white">
                                            Test #{idx + 1}: {tc?.name || res.testId}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] text-[#A1A1AA]">{res.executionTimeMs} ms</span>
                                          {res.passed ? (
                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                                              PASSED
                                            </span>
                                          ) : (
                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
                                              FAILED
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-[#0E0E10] p-2.5 rounded border border-[#27272A]">
                                        <div>
                                          <span className="text-[#71717A] text-[10px] uppercase block">{m.lc_input_label()}</span>
                                          <span className="text-[#D4D4D8] break-all">{tc ? tc.inputStr : '-'}</span>
                                        </div>
                                        <div>
                                          <span className="text-[#71717A] text-[10px] uppercase block">{locale === 'sr' ? 'Očekivano:' : 'Expected:'}</span>
                                          <span className="text-emerald-400 font-bold break-all">{tc ? tc.expectedStr : '-'}</span>
                                        </div>
                                        {(!res.passed || res.error) && (
                                          <div className="sm:col-span-2 pt-1.5 border-t border-[#27272A] text-rose-400">
                                            <span className="text-[10px] uppercase font-bold block">{m.lc_actual_output()}</span>
                                            <span className="break-all">{res.error ? `${m.lc_error()} ${res.error}` : res.actualStr}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="text-[#A1A1AA] text-xs flex items-center justify-between pb-1 border-b border-[#27272A]">
                                  <span>{locale === 'sr' ? 'Pregled test primera za ovaj zadatak:' : 'Preview of test cases for this challenge:'}</span>
                                  <span className="text-[10px] text-emerald-400 font-semibold">{locale === 'sr' ? 'Kliknite "Pokreni Testove" iznad' : 'Click "Run Tests" above'}</span>
                                </div>
                                <div className="space-y-2">
                                  {currentProblem.testCases.map((tc, idx) => (
                                    <div key={tc.id} className="p-2.5 rounded bg-[#0E0E10] border border-[#27272A] text-[11px]">
                                      <div className="font-bold text-[#E4E4E7] mb-1">Test #{idx + 1}: {tc.name}</div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[#A1A1AA]">
                                        <div><span className="text-[#71717A]">Input: </span><span className="text-[#D4D4D8]">{tc.inputStr}</span></div>
                                        <div><span className="text-[#71717A]">Expected: </span><span className="text-emerald-400">{tc.expectedStr}</span></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          )}

                          {/* TAB 2: SEPARATED CONSOLE OUTPUT (STDOUT) VIEW */}
                          {outputTab === 'console' && (
                            consoleLogs.length > 0 ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between pb-1.5 border-b border-[#27272A] text-[11px] text-[#A1A1AA]">
                                  <span>{locale === 'sr' ? 'Stdout / Konzolni zapisi:' : 'Stdout / Console logs:'}</span>
                                  <span className="text-[10px] text-[#71717A]">
                                    {consoleLogs.length} {locale === 'sr' ? 'zapisa' : 'entries'}
                                  </span>
                                </div>
                                <div className="space-y-1.5">
                                  {consoleLogs.map((log) => (
                                    <div
                                      key={log.id}
                                      className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${
                                        log.type === 'error'
                                          ? 'bg-rose-950/20 border-rose-800/40 text-rose-300'
                                          : log.type === 'warn'
                                          ? 'bg-amber-950/20 border-amber-800/40 text-amber-300'
                                          : log.type === 'info'
                                          ? 'bg-sky-950/20 border-sky-800/40 text-sky-300'
                                          : 'bg-[#0E0E10] border-[#27272A] text-[#E4E4E7]'
                                      }`}
                                    >
                                      <span
                                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 uppercase tracking-wider ${
                                          log.type === 'error'
                                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                            : log.type === 'warn'
                                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                            : log.type === 'info'
                                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                        }`}
                                      >
                                        {log.type}
                                      </span>
                                      <div className="flex-1 min-w-0 space-y-1">
                                        {log.testLabel && (
                                          <div className="text-[10px] text-[#A1A1AA] font-semibold opacity-75">
                                            {log.testLabel}
                                          </div>
                                        )}
                                        <pre className="whitespace-pre-wrap break-all font-mono text-xs leading-relaxed overflow-x-auto text-white dark:text-[#F4F4F5]">
                                          {log.message}
                                        </pre>
                                      </div>
                                      <span className="text-[10px] text-[#71717A] shrink-0 font-mono">
                                        {log.timestamp}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="py-8 px-4 text-center space-y-2">
                                <Terminal className="w-7 h-7 mx-auto text-[#71717A] opacity-60" />
                                <p className="text-xs font-semibold text-[#D4D4D8]">
                                  {locale === 'sr' ? 'Konzola je trenutno prazna' : 'Console is currently empty'}
                                </p>
                                <p className="text-[11px] text-[#71717A] max-w-md mx-auto">
                                  {locale === 'sr'
                                    ? 'Dodajte console.log(...) u funkciju i kliknite "Pokreni Testove" da biste videli formatirani ispis i objekte ovde.'
                                    : 'Add console.log(...) in your solution function and click "Run Tests" to inspect formatted logs and objects here.'}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Explanation Walkthrough */}
                  <div className="p-4 rounded-xl bg-[#F9F9F7] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#27272A] space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#B45309] dark:text-[#F59E0B] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{m.lc_solution_analysis()}</span>
                    </h4>
                    <p className="text-xs text-[#262624] dark:text-[#E4E4E7] leading-relaxed">
                      {locale === 'en' && currentProblem.optimalSolution.explanationEn ? currentProblem.optimalSolution.explanationEn : currentProblem.optimalSolution.explanation}
                    </p>
                  </div>

                  {/* JavaScript-specific Tips & Pitfalls */}
                  {((locale === 'en' && currentProblem.jsSpecificTipsEn) ? currentProblem.jsSpecificTipsEn : currentProblem.jsSpecificTips) && ((locale === 'en' && currentProblem.jsSpecificTipsEn) ? currentProblem.jsSpecificTipsEn : currentProblem.jsSpecificTips)!.length > 0 && (
                    <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-2.5">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#B45309] dark:text-[#FCD34D] flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-[#B45309] dark:text-[#FCD34D]" />
                        <span>{m.lc_js_tips()}</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-[#451A03] dark:text-[#FDE68A] leading-relaxed">
                        {((locale === 'en' && currentProblem.jsSpecificTipsEn) ? currentProblem.jsSpecificTipsEn : currentProblem.jsSpecificTips)!.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-bold text-[#B45309] dark:text-[#F59E0B]">•</span>
                            <FormattedText text={tip} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Problem Description & Examples */}
              {activeTab === 'problem' && (
                <div className="space-y-6">
                  {/* Problem Statement */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#73736C] dark:text-[#A1A1AA]">
                      {m.lc_problem_statement()}
                    </h3>
                    <div className="p-4 rounded-xl bg-[#F9F9F7] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#27272A] text-xs text-[#1A1A1A] dark:text-[#F4F4F5] leading-relaxed whitespace-pre-line">
                      <FormattedText text={locale === 'en' && currentProblem.descriptionEn ? currentProblem.descriptionEn : currentProblem.description} />
                    </div>
                  </div>

                  {/* Intuition & Mental Model */}
                  <div className="p-4 rounded-xl bg-[#F4F4F0] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#27272A] space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#B45309] dark:text-[#F59E0B] flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{m.lc_key_intuition()}</span>
                    </h4>
                    <p className="text-xs text-[#262624] dark:text-[#E4E4E7] leading-relaxed">
                      <FormattedText text={locale === 'en' && currentProblem.intuitionEn ? currentProblem.intuitionEn : currentProblem.intuition} />
                    </p>
                  </div>

                  {/* Examples List */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#73736C] dark:text-[#A1A1AA]">
                      {m.lc_examples_title()}
                    </h3>
                    {currentProblem.examples.map((ex, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#F9F9F7] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#27272A] space-y-2 text-xs">
                        <div className="font-mono font-bold text-[#73736C] dark:text-[#A1A1AA]">{m.lc_example_num({ num: idx + 1 })}</div>
                        <div className="space-y-1 font-mono text-[11px]">
                          <div><span className="text-[#8C8C82] dark:text-[#71717A]">{m.lc_input_label()} </span><span className="text-[#1A1A1A] dark:text-[#F4F4F5] font-semibold">{ex.input}</span></div>
                          <div><span className="text-[#8C8C82] dark:text-[#71717A]">{m.lc_output_label()} </span><span className="text-emerald-700 dark:text-emerald-400 font-bold">{ex.output}</span></div>
                        </div>
                        {(ex.explanationEn && locale === 'en' ? ex.explanationEn : ex.explanation) && (
                          <p className="text-[#575750] dark:text-[#A1A1AA] text-xs pt-1 border-t border-[#E5E5DF]/60 dark:border-[#27272A]">
                            <span className="font-semibold">{m.lc_explanation_label()}</span> {locale === 'en' && ex.explanationEn ? ex.explanationEn : ex.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  {currentProblem.constraints && currentProblem.constraints.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#73736C] dark:text-[#A1A1AA]">
                        {m.lc_constraints_title()}
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-xs font-mono text-[#575750] dark:text-[#A1A1AA] bg-[#F9F9F7] dark:bg-[#202023] p-3.5 rounded-xl border border-[#E5E5DF] dark:border-[#27272A]">
                        {currentProblem.constraints.map((c, i) => (
                          <li key={i}><FormattedText text={c} /></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Brute Force vs Optimal Comparison */}
              {activeTab === 'comparison' && currentProblem.bruteForceSolution && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Brute Force Card */}
                    <div className="p-4 rounded-xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                          {m.lc_naive_approach()}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded">
                          {currentProblem.bruteForceSolution.timeComplexity.split('—')[0]}
                        </span>
                      </div>
                      
                      <CodeBlock
                        code={currentProblem.bruteForceSolution.code}
                        language="javascript"
                        showLineNumbers={false}
                      />

                      <p className="text-xs text-rose-950 dark:text-rose-200 leading-relaxed">
                        {locale === 'en' && currentProblem.bruteForceSolution.explanationEn ? currentProblem.bruteForceSolution.explanationEn : currentProblem.bruteForceSolution.explanation}
                      </p>
                    </div>

                    {/* Optimal Card */}
                    <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                          {m.lc_optimal_approach()}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                          {currentProblem.optimalSolution.timeComplexity.split('—')[0]}
                        </span>
                      </div>

                      <CodeBlock
                        code={currentProblem.optimalSolution.code}
                        language="javascript"
                        showLineNumbers={false}
                      />

                      <p className="text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed">
                        {locale === 'en' && currentProblem.optimalSolution.explanationEn ? currentProblem.optimalSolution.explanationEn : currentProblem.optimalSolution.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
