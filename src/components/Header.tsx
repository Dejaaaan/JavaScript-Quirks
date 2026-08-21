import React from 'react';
import { 
  Code2, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  Terminal, 
  Globe, 
  Search, 
  Bookmark, 
  Zap,
  BookOpen,
  Sun,
  Moon,
  Flame,
  Languages
} from 'lucide-react';
import { CategoryId, DifficultyLevel } from '../types';
import { useI18n } from '../i18n';

interface HeaderProps {
  activeView: 'topics' | 'coercion' | 'event-loop' | 'playground' | 'quiz' | 'matrix' | 'leetcode';
  setActiveView: (view: 'topics' | 'coercion' | 'event-loop' | 'playground' | 'quiz' | 'matrix' | 'leetcode') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (diff: string) => void;
  bookmarkedCount: number;
  showOnlyBookmarks: boolean;
  setShowOnlyBookmarks: (show: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  bookmarkedCount,
  showOnlyBookmarks,
  setShowOnlyBookmarks,
  isDarkMode,
  setIsDarkMode
}) => {
  const { locale, setLocale, toggleLocale, m } = useI18n();

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: m.filter_all_categories() },
    { id: 'type-coercion', label: m.cat_type_coercion() },
    { id: 'event-loop', label: m.cat_event_loop() },
    { id: 'this-context', label: m.cat_this_context() },
    { id: 'scope-closures', label: m.cat_scope_closures() },
    { id: 'prototypes-oop', label: m.cat_prototypes_oop() },
    { id: 'arrays-objects', label: m.cat_arrays_objects() },
    { id: 'math-numbers', label: m.cat_math_numbers() },
    { id: 'syntax-asi', label: m.cat_syntax_asi() }
  ];

  const difficultyOptions: { id: string; label: string }[] = [
    { id: 'All', label: m.diff_all() },
    { id: 'Beginner', label: m.diff_beginner() },
    { id: 'Intermediate', label: m.diff_intermediate() },
    { id: 'Advanced', label: m.diff_advanced() },
    { id: 'WTJS Quirks', label: m.diff_expert() }
  ];

  return (
    <header id="main-header" className="sticky top-0 z-50 bg-[#F9F9F7]/95 dark:bg-[#121214]/95 backdrop-blur-md border-b border-[#E5E5DF] dark:border-[#27272A] text-[#1A1A1A] dark:text-[#F4F4F5] shadow-sm transition-colors duration-200">
      {/* Editorial Top Masthead Strip */}
      <div className="border-b border-[#E5E5DF]/70 dark:border-[#27272A]/70 bg-[#F2F2ED] dark:bg-[#18181B] py-1 px-4 sm:px-6 lg:px-8 transition-colors duration-200 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-[#73736C] dark:text-[#A1A1AA] gap-2 overflow-hidden">
          <div className="flex items-center gap-2 truncate min-w-0">
            <span className="font-semibold tracking-wider uppercase text-[#1A1A1A] dark:text-[#F4F4F5] flex-shrink-0">{m.top_masthead_title()}</span>
            <span className="text-[#A3A39A] dark:text-[#52525B] flex-shrink-0">/</span>
            <span className="truncate">{m.top_masthead_subtitle()}</span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-[#73736C] dark:text-[#A1A1AA] flex-shrink-0">
            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-[#B45309] dark:text-[#F59E0B]" /> {m.top_standard()}</span>
            <span className="text-[#A3A39A] dark:text-[#52525B]">·</span>
            <span>{m.top_volume()}</span>
          </div>
        </div>
      </div>

      {/* Main Masthead & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
          {/* Brand Logo & Editorial Title */}
          <div 
            onClick={() => setActiveView('topics')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none flex-shrink-0 group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#1A1A1A] dark:bg-[#F59E0B] border border-[#333330] dark:border-[#D97706] flex items-center justify-center text-[#F59E0B] dark:text-[#18181B] font-mono font-black text-base sm:text-lg shadow-xs transition-transform group-hover:scale-105">
              JS
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif font-bold text-sm sm:text-base lg:text-lg tracking-tight text-[#1A1A1A] dark:text-[#F4F4F5] truncate">
                  {m.brand_title()}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#F59E0B]/15 dark:bg-[#F59E0B]/20 text-[#B45309] dark:text-[#FCD34D] font-bold border border-[#F59E0B]/30 flex-shrink-0">
                  {m.brand_badge()}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#73736C] dark:text-[#A1A1AA] font-serif italic hidden lg:block truncate">{m.brand_subtitle()}</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Segmented Controller) */}
          <nav className="hidden xl:flex items-center gap-0.5 bg-[#F2F2ED] dark:bg-[#1E1E22] p-1 rounded-xl border border-[#E5E5DF] dark:border-[#2E2E33] flex-shrink-0">
            <button
              onClick={() => setActiveView('topics')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeView === 'topics'
                  ? 'bg-[#1A1A1A] text-[#FFFFFF] dark:bg-[#F59E0B] dark:text-[#18181B] shadow-xs'
                  : 'text-[#40403C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:bg-[#E5E5DF] dark:hover:bg-[#2A2A2E]'
              }`}
            >
              <Code2 className={`w-3.5 h-3.5 ${activeView === 'topics' ? 'text-[#F59E0B] dark:text-[#18181B]' : 'text-[#B45309] dark:text-[#FCD34D]'}`} />
              <span>{m.nav_topics()}</span>
            </button>

            <button
              onClick={() => setActiveView('coercion')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeView === 'coercion'
                  ? 'bg-[#1A1A1A] text-[#FFFFFF] dark:bg-[#F59E0B] dark:text-[#18181B] shadow-xs'
                  : 'text-[#40403C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:bg-[#E5E5DF] dark:hover:bg-[#2A2A2E]'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${activeView === 'coercion' ? 'text-[#F59E0B] dark:text-[#18181B]' : 'text-[#D97706] dark:text-[#FCD34D]'}`} />
              <span>{m.nav_coercion()}</span>
            </button>

            <button
              onClick={() => setActiveView('event-loop')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeView === 'event-loop'
                  ? 'bg-[#1A1A1A] text-[#FFFFFF] dark:bg-[#F59E0B] dark:text-[#18181B] shadow-xs'
                  : 'text-[#40403C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:bg-[#E5E5DF] dark:hover:bg-[#2A2A2E]'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${activeView === 'event-loop' ? 'text-[#F59E0B] dark:text-[#18181B]' : 'text-[#D97706] dark:text-[#FCD34D]'}`} />
              <span>{m.nav_event_loop()}</span>
            </button>

            <button
              onClick={() => setActiveView('playground')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeView === 'playground'
                  ? 'bg-[#1A1A1A] text-[#FFFFFF] dark:bg-[#F59E0B] dark:text-[#18181B] shadow-xs'
                  : 'text-[#40403C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:bg-[#E5E5DF] dark:hover:bg-[#2A2A2E]'
              }`}
            >
              <Terminal className={`w-3.5 h-3.5 ${activeView === 'playground' ? 'text-[#34D399] dark:text-[#18181B]' : 'text-[#059669] dark:text-[#34D399]'}`} />
              <span>{m.nav_playground()}</span>
            </button>

            <button
              onClick={() => setActiveView('leetcode')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeView === 'leetcode'
                  ? 'bg-[#1A1A1A] text-[#FFFFFF] dark:bg-[#F59E0B] dark:text-[#18181B] shadow-xs'
                  : 'text-[#40403C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:bg-[#E5E5DF] dark:hover:bg-[#2A2A2E]'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${activeView === 'leetcode' ? 'text-[#F59E0B] dark:text-[#18181B]' : 'text-[#EA580C] dark:text-[#FB923C]'}`} />
              <span>{m.nav_leetcode()}</span>
            </button>

            <button
              onClick={() => setActiveView('quiz')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeView === 'quiz'
                  ? 'bg-[#1A1A1A] text-[#FFFFFF] dark:bg-[#F59E0B] dark:text-[#18181B] shadow-xs'
                  : 'text-[#40403C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:bg-[#E5E5DF] dark:hover:bg-[#2A2A2E]'
              }`}
            >
              <HelpCircle className={`w-3.5 h-3.5 ${activeView === 'quiz' ? 'text-[#F87171] dark:text-[#18181B]' : 'text-[#DC2626] dark:text-[#F87171]'}`} />
              <span>{m.nav_quiz()}</span>
            </button>

            <button
              onClick={() => setActiveView('matrix')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeView === 'matrix'
                  ? 'bg-[#1A1A1A] text-[#FFFFFF] dark:bg-[#F59E0B] dark:text-[#18181B] shadow-xs'
                  : 'text-[#40403C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:bg-[#E5E5DF] dark:hover:bg-[#2A2A2E]'
              }`}
            >
              <Globe className={`w-3.5 h-3.5 ${activeView === 'matrix' ? 'text-[#A5B4FC] dark:text-[#18181B]' : 'text-[#4F46E5] dark:text-[#A5B4FC]'}`} />
              <span>{m.nav_matrix()}</span>
            </button>
          </nav>

          {/* Right Action Tools: Language Switcher, Bookmark Filter & Theme Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Paraglide Bilingual Switcher (🇷🇸 SR / 🇬🇧 EN) */}
            <div className="flex items-center p-0.5 rounded-lg bg-[#EBEBE5] dark:bg-[#27272A] border border-[#E5E5DF] dark:border-[#3F3F46] flex-shrink-0">
              <button
                onClick={() => setLocale('sr')}
                className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
                  locale === 'sr'
                    ? 'bg-[#FFFFFF] dark:bg-[#18181B] text-[#B45309] dark:text-[#F59E0B] shadow-xs'
                    : 'text-[#575750] dark:text-[#D4D4D8] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF]'
                }`}
                title="Prebaci na Srpski jezik"
              >
                <span>🇷🇸</span>
                <span className="hidden sm:inline">SR</span>
              </button>
              <button
                onClick={() => setLocale('en')}
                className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
                  locale === 'en'
                    ? 'bg-[#FFFFFF] dark:bg-[#18181B] text-[#B45309] dark:text-[#F59E0B] shadow-xs'
                    : 'text-[#575750] dark:text-[#D4D4D8] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF]'
                }`}
                title="Switch to English language"
              >
                <span>🇬🇧</span>
                <span className="hidden sm:inline">EN</span>
              </button>
            </div>

            {/* Bookmark Filter */}
            <button
              onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer flex-shrink-0 min-h-[34px] ${
                showOnlyBookmarks
                  ? 'bg-[#B45309] dark:bg-[#F59E0B] border-[#B45309] dark:border-[#F59E0B] text-white dark:text-[#18181B] shadow-xs'
                  : 'bg-[#FFFFFF] dark:bg-[#27272A] border-[#E5E5DF] dark:border-[#3F3F46] text-[#40403C] dark:text-[#D4D4D8] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF] hover:border-[#D4D4CE] dark:hover:border-[#52525B]'
              }`}
              title={m.filter_saved_tooltip()}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarks ? 'fill-current' : 'text-[#B45309] dark:text-[#F59E0B]'}`} />
              <span className="hidden md:inline">{m.filter_saved()}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${showOnlyBookmarks ? 'bg-white/20 dark:bg-black/20 text-white dark:text-[#18181B]' : 'bg-[#F2F2ED] dark:bg-[#18181B] text-[#575750] dark:text-[#D4D4D8]'}`}>
                {bookmarkedCount}
              </span>
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg text-xs font-semibold border bg-[#FFFFFF] dark:bg-[#27272A] border-[#E5E5DF] dark:border-[#3F3F46] text-[#40403C] dark:text-[#D4D4D8] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF] hover:border-[#D4D4CE] dark:hover:border-[#52525B] transition cursor-pointer flex-shrink-0 min-w-[34px] min-h-[34px] flex items-center justify-center"
              title={isDarkMode ? m.toggle_theme_light() : m.toggle_theme_dark()}
              aria-label="Promenite temu"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-[#F59E0B]" />
              ) : (
                <Moon className="w-4 h-4 text-[#575750]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Navigation Row (Below brand row, horizontally scrollable) */}
        <div className="flex xl:hidden items-center gap-1.5 overflow-x-auto pb-2.5 pt-1 border-t border-[#E5E5DF] dark:border-[#27272A] no-scrollbar">
          <button
            onClick={() => setActiveView('topics')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium cursor-pointer transition min-h-[36px] flex items-center gap-1.5 flex-shrink-0 ${
              activeView === 'topics' ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] font-semibold shadow-xs' : 'text-[#40403C] dark:text-[#D4D4D8] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#B45309] dark:text-[#FCD34D]" />
            <span>{m.nav_topics()}</span>
          </button>
          <button
            onClick={() => setActiveView('coercion')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium cursor-pointer transition min-h-[36px] flex items-center gap-1.5 flex-shrink-0 ${
              activeView === 'coercion' ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] font-semibold shadow-xs' : 'text-[#40403C] dark:text-[#D4D4D8] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FCD34D]" />
            <span>{m.nav_coercion()}</span>
          </button>
          <button
            onClick={() => setActiveView('event-loop')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium cursor-pointer transition min-h-[36px] flex items-center gap-1.5 flex-shrink-0 ${
              activeView === 'event-loop' ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] font-semibold shadow-xs' : 'text-[#40403C] dark:text-[#D4D4D8] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FCD34D]" />
            <span>{m.nav_event_loop()}</span>
          </button>
          <button
            onClick={() => setActiveView('playground')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium cursor-pointer transition min-h-[36px] flex items-center gap-1.5 flex-shrink-0 ${
              activeView === 'playground' ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] font-semibold shadow-xs' : 'text-[#40403C] dark:text-[#D4D4D8] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399]" />
            <span>{m.nav_playground()}</span>
          </button>
          <button
            onClick={() => setActiveView('leetcode')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium cursor-pointer transition min-h-[36px] flex items-center gap-1.5 flex-shrink-0 ${
              activeView === 'leetcode' ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] font-semibold shadow-xs' : 'text-[#40403C] dark:text-[#D4D4D8] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#EA580C] dark:text-[#FB923C]" />
            <span>{m.nav_leetcode()}</span>
          </button>
          <button
            onClick={() => setActiveView('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium cursor-pointer transition min-h-[36px] flex items-center gap-1.5 flex-shrink-0 ${
              activeView === 'quiz' ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] font-semibold shadow-xs' : 'text-[#40403C] dark:text-[#D4D4D8] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#DC2626] dark:text-[#F87171]" />
            <span>{m.nav_quiz()}</span>
          </button>
          <button
            onClick={() => setActiveView('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium cursor-pointer transition min-h-[36px] flex items-center gap-1.5 flex-shrink-0 ${
              activeView === 'matrix' ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] font-semibold shadow-xs' : 'text-[#40403C] dark:text-[#D4D4D8] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#4F46E5] dark:text-[#A5B4FC]" />
            <span>{m.nav_matrix()}</span>
          </button>
        </div>
      </div>

      {/* Secondary Filter & Search Bar (Visible on 'topics' view) */}
      {activeView === 'topics' && (
        <div className="border-t border-[#E5E5DF] dark:border-[#27272A] bg-[#F4F4F0]/80 dark:bg-[#18181B]/80 py-3 transition-colors duration-200 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Input styled as an editorial index lookup */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8C82] dark:text-[#71717A]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={m.search_placeholder()}
                  className="w-full bg-[#FFFFFF] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#3F3F46] rounded-xl pl-9.5 pr-4 py-2 text-xs text-[#1A1A1A] dark:text-[#F4F4F5] placeholder-[#8C8C82] dark:placeholder-[#71717A] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#F59E0B] focus:ring-1 focus:ring-[#1A1A1A] dark:focus:ring-[#F59E0B] shadow-sm transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C8C82] dark:text-[#71717A] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5] text-xs font-mono font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[11px] text-[#73736C] dark:text-[#A1A1AA] mr-1 font-mono uppercase tracking-wider font-semibold flex-shrink-0">{locale === 'sr' ? 'Nivo:' : 'Level:'}</span>
                {difficultyOptions.map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer flex-shrink-0 ${
                      selectedDifficulty === diff.id
                        ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] shadow-sm'
                        : 'bg-[#FFFFFF] dark:bg-[#202023] text-[#575750] dark:text-[#D4D4D8] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5] border border-[#E5E5DF] dark:border-[#3F3F46] hover:border-[#D4D4CE] dark:hover:border-[#52525B]'
                    }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer flex-shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-[#B45309] dark:bg-[#F59E0B] text-white dark:text-[#18181B] font-semibold shadow-sm'
                      : 'bg-[#FFFFFF] dark:bg-[#202023] text-[#575750] dark:text-[#D4D4D8] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5] border border-[#E5E5DF] dark:border-[#3F3F46]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

