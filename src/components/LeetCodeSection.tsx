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
  Flame,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
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

export const LeetCodeSection: React.FC<LeetCodeSectionProps> = ({ onOpenInPlayground }) => {
  const { locale, m } = useI18n();
  const [selectedProblemId, setSelectedProblemId] = useState<string>(LEETCODE_PROBLEMS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'problem' | 'optimal' | 'comparison' | 'runner'>('optimal');
  
  // Solved tracking via localStorage
  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('js_coding_challenges_solved') || localStorage.getItem('js_leetcode_solved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Test Runner state
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestCaseResult[] | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

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
      navigator.clipboard.writeText(currentProblem.optimalSolution.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Safe client-side Sandbox Test Runner
  const handleRunTests = async () => {
    if (!currentProblem) return;
    setIsRunningTests(true);
    setTestResults(null);

    try {
      // Evaluate user code in a function constructor wrapper
      const codeToRun = currentProblem.optimalSolution.code;
      const fnName = currentProblem.runFunctionName;

      // Sandbox wrapper
      const createRunner = new Function(`
        ${codeToRun}
        if (typeof ${fnName} !== 'function') {
          throw new Error('Funkcija "${fnName}" nije definisana u kodu.');
        }
        return ${fnName};
      `);

      const userFn = createRunner();
      const results: TestCaseResult[] = [];

      for (const tc of currentProblem.testCases) {
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
    } catch (err: any) {
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem List Directory */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#73736C] dark:text-[#A1A1AA]">
              {locale === 'sr' ? `Prikazano: ${filteredProblems.length} zadataka` : `Showing: ${filteredProblems.length} problems`}
            </span>
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
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

              <button
                onClick={() => setActiveTab('runner')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'runner'
                    ? 'border-[#B45309] dark:border-[#F59E0B] text-[#B45309] dark:text-[#F59E0B]'
                    : 'border-transparent text-[#73736C] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-[#047857] dark:text-[#34D399]" />
                <span>{m.lc_tab_runner({ count: currentProblem.testCases.length })}</span>
              </button>
            </div>

            {/* TAB CONTENT AREA */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* TAB 1: Optimal Solution */}
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

                  {/* Solution Code Block with Copy & Actions */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#73736C] dark:text-[#A1A1AA] uppercase tracking-wider">
                        JavaScript Implementacija (ES2024+)
                      </span>
                      <div className="flex items-center gap-2">
                        {onOpenInPlayground && (
                          <button
                            onClick={() => onOpenInPlayground(currentProblem.optimalSolution.code)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F2F2ED] dark:bg-[#27272A] hover:bg-[#E5E5DF] dark:hover:bg-[#3F3F46] text-[#1A1A1A] dark:text-[#F4F4F5] flex items-center gap-1 transition cursor-pointer"
                            title={m.card_open_playground()}
                          >
                            <Terminal className="w-3 h-3 text-[#047857] dark:text-[#34D399]" />
                            <span>{m.card_open_playground()}</span>
                          </button>
                        )}
                        <button
                          onClick={handleCopyCode}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F2F2ED] dark:bg-[#27272A] hover:bg-[#E5E5DF] dark:hover:bg-[#3F3F46] text-[#1A1A1A] dark:text-[#F4F4F5] flex items-center gap-1 transition cursor-pointer"
                        >
                          {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCode ? m.lc_copied() : m.lc_copy()}</span>
                        </button>
                      </div>
                    </div>

                    <CodeBlock
                      code={currentProblem.optimalSolution.code}
                      language="javascript"
                      showLineNumbers={true}
                    />
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

              {/* TAB 4: Interactive Test Runner */}
              {activeTab === 'runner' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#F9F9F7] dark:bg-[#202023] rounded-xl border border-[#E5E5DF] dark:border-[#27272A]">
                    <div>
                      <h3 className="text-sm font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                        {m.lc_test_runner_title()}
                      </h3>
                      <p className="text-xs text-[#73736C] dark:text-[#A1A1AA]">
                        {m.lc_test_runner_desc({ func: currentProblem.runFunctionName })}
                      </p>
                    </div>

                    <button
                      onClick={handleRunTests}
                      disabled={isRunningTests}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-sm transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isRunningTests ? m.lc_running_tests_btn() : m.lc_run_tests_btn()}</span>
                    </button>
                  </div>

                  {/* Test Cases Table / List */}
                  <div className="space-y-3">
                    {currentProblem.testCases.map((tc, idx) => {
                      const res = testResults?.find((r) => r.testId === tc.id);

                      return (
                        <div
                          key={tc.id}
                          className={`p-4 rounded-xl border transition-all ${
                            res
                              ? res.passed
                                ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30'
                                : 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/30'
                              : 'bg-[#FFFFFF] dark:bg-[#18181B] border-[#E5E5DF] dark:border-[#27272A]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#73736C] dark:text-[#A1A1AA]">
                                Test #{idx + 1}:
                              </span>
                              <span className="text-xs font-semibold text-[#1A1A1A] dark:text-[#F4F4F5]">
                                {tc.name}
                              </span>
                            </div>

                            {res && (
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-[#73736C] dark:text-[#A1A1AA]">
                                  {res.executionTimeMs} ms
                                </span>
                                {res.passed ? (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> {m.lc_test_passed()}
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                                    ✕ {m.lc_test_failed()}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono bg-[#F9F9F7] dark:bg-[#121214] p-3 rounded-lg border border-[#E5E5DF] dark:border-[#27272A]">
                            <div>
                              <span className="text-[#8C8C82] block text-[10px] uppercase">{m.lc_input_label()}</span>
                              <span className="text-[#1A1A1A] dark:text-[#F4F4F5] break-all">{tc.inputStr}</span>
                            </div>
                            <div>
                              <span className="text-[#8C8C82] block text-[10px] uppercase">{locale === 'sr' ? 'Očekivani Izlaz:' : 'Expected Output:'}</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold break-all">{tc.expectedStr}</span>
                            </div>

                            {res && !res.passed && (
                              <div className="col-span-1 md:col-span-2 pt-2 border-t border-rose-500/20 text-rose-600 dark:text-rose-400">
                                <span className="block text-[10px] uppercase font-bold">{m.lc_actual_output()}</span>
                                <span>{res.error ? `${m.lc_error()} ${res.error}` : res.actualStr}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
