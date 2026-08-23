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
  Languages,
  X
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
  bookmarkedCount,
  showOnlyBookmarks,
  setShowOnlyBookmarks,
  isDarkMode,
  setIsDarkMode
}) => {
  const { locale, setLocale, m } = useI18n();

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: m.filter_all_categories() },
    { id: 'type-coercion', label: m.cat_type_coercion() },
    { id: 'event-loop', label: m.cat_event_loop() },
    { id: 'this-context', label: m.cat_this_context() },
    { id: 'scope-closures', label: m.cat_scope_closures() },
    { id: 'prototypes-oop', label: m.cat_prototypes_oop() },
    { id: 'arrays-objects', label: m.cat_arrays_objects() },
    { id: 'math-numbers', label: m.cat_math_numbers() },
    { id: 'syntax-asi', label: m.cat_syntax_asi() },
    { id: 'async-promises', label: m.cat_async_promises() }
  ];

  const navItems = [
    { id: 'topics', label: m.nav_topics(), icon: Code2, color: 'text-[#B45309] dark:text-[#FCD34D]' },
    { id: 'coercion', label: m.nav_coercion(), icon: Sparkles, color: 'text-[#D97706] dark:text-[#FCD34D]' },
    { id: 'event-loop', label: m.nav_event_loop(), icon: Zap, color: 'text-[#D97706] dark:text-[#FCD34D]' },
    { id: 'playground', label: m.nav_playground(), icon: Terminal, color: 'text-[#059669] dark:text-[#34D399]' },
    { id: 'leetcode', label: m.nav_leetcode(), icon: Flame, color: 'text-[#EA580C] dark:text-[#FB923C]' },
    { id: 'quiz', label: m.nav_quiz(), icon: HelpCircle, color: 'text-[#DC2626] dark:text-[#F87171]' },
    { id: 'matrix', label: m.nav_matrix(), icon: Globe, color: 'text-[#4F46E5] dark:text-[#A5B4FC]' }
  ] as const;

  return (
    <header id="main-header" className="sticky top-0 z-50 bg-[#FFFFFF]/95 dark:bg-[#121214]/95 backdrop-blur-md border-b border-[#E5E5DF] dark:border-[#27272A] text-[#1A1A1A] dark:text-[#F4F4F5] shadow-[0_1px_4px_rgba(0,0,0,0.03)] transition-colors duration-200">
      {/* Unified Compact Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-3">
          {/* Brand Logo & Title */}
          <div 
            onClick={() => setActiveView('topics')}
            className="flex items-center gap-2.5 cursor-pointer select-none flex-shrink-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] dark:bg-[#F59E0B] border border-[#333330] dark:border-[#D97706] flex items-center justify-center text-[#F59E0B] dark:text-[#18181B] font-mono font-black text-sm shadow-xs transition-transform group-hover:scale-105">
              JS
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base tracking-tight text-[#1A1A1A] dark:text-[#F4F4F5]">
                {m.brand_title()}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#F4F4F0] dark:bg-[#1C1C1F] p-1 rounded-xl border border-[#E5E5DF] dark:border-[#2E2E33]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1A1A1A] text-[#FFFFFF] dark:bg-[#F59E0B] dark:text-[#18181B] shadow-xs font-bold'
                      : 'text-[#575750] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:bg-[#E5E5DF] dark:hover:bg-[#27272A]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F59E0B] dark:text-[#18181B]' : item.color}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Language (SR/EN), Saved Bookmark, Dark Mode */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-[#F4F4F0] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#3F3F46]">
              <button
                onClick={() => setLocale('sr')}
                className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
                  locale === 'sr'
                    ? 'bg-[#FFFFFF] dark:bg-[#2E2E33] text-[#B45309] dark:text-[#F59E0B] shadow-xs'
                    : 'text-[#73736C] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5]'
                }`}
                title="Srpski jezik"
              >
                <span>🇷🇸</span>
                <span>SR</span>
              </button>
              <button
                onClick={() => setLocale('en')}
                className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
                  locale === 'en'
                    ? 'bg-[#FFFFFF] dark:bg-[#2E2E33] text-[#B45309] dark:text-[#F59E0B] shadow-xs'
                    : 'text-[#73736C] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5]'
                }`}
                title="English language"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            {/* Saved Bookmarks Toggle */}
            <button
              onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer h-8 ${
                showOnlyBookmarks
                  ? 'bg-[#B45309] dark:bg-[#F59E0B] border-[#B45309] dark:border-[#F59E0B] text-white dark:text-[#18181B] shadow-xs'
                  : 'bg-[#FAF9F5] dark:bg-[#202023] border-[#E5E5DF] dark:border-[#3F3F46] text-[#575750] dark:text-[#D4D4D8] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF]'
              }`}
              title={m.filter_saved_tooltip()}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarks ? 'fill-current' : 'text-[#B45309] dark:text-[#F59E0B]'}`} />
              <span className="hidden md:inline">{m.filter_saved()}</span>
              {bookmarkedCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  showOnlyBookmarks ? 'bg-white/20 dark:bg-black/20 text-white dark:text-[#18181B]' : 'bg-[#E5E5DF] dark:bg-[#2E2E33] text-[#1A1A1A] dark:text-[#F4F4F5]'
                }`}>
                  {bookmarkedCount}
                </span>
              )}
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-8 h-8 rounded-lg border bg-[#FAF9F5] dark:bg-[#202023] border-[#E5E5DF] dark:border-[#3F3F46] text-[#575750] dark:text-[#D4D4D8] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF] transition cursor-pointer flex items-center justify-center"
              title={isDarkMode ? m.toggle_theme_light() : m.toggle_theme_dark()}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4 text-[#575750]" />}
            </button>
          </div>
        </div>

        {/* Secondary Mobile/Tablet Horizontal Scroll Nav (Only below xl) */}
        <div className="flex xl:hidden items-center gap-1 overflow-x-auto py-2 border-t border-[#E5E5DF]/70 dark:border-[#27272A]/70 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap font-medium cursor-pointer transition flex items-center gap-1.5 flex-shrink-0 ${
                  isActive
                    ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#FFFFFF] dark:text-[#18181B] font-semibold shadow-xs'
                    : 'text-[#575750] dark:text-[#D4D4D8] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F59E0B] dark:text-[#18181B]' : item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Search Bar for Topics */}
      {activeView === 'topics' && (
        <div className="border-t border-[#E5E5DF] dark:border-[#27272A] bg-[#FAF9F5] dark:bg-[#18181B] py-2.5">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-2.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8C82] dark:text-[#71717A]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={m.search_placeholder()}
                  className="w-full bg-[#FFFFFF] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#3F3F46] rounded-xl pl-8.5 pr-8 py-1.5 text-xs text-[#1A1A1A] dark:text-[#F4F4F5] placeholder-[#8C8C82] dark:placeholder-[#71717A] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#F59E0B] shadow-2xs transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C8C82] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap flex-shrink-0 font-mono text-[11px] ${
                      isSelected
                        ? 'bg-[#4338CA] dark:bg-[#818CF8] text-white dark:text-[#0F172A] font-bold shadow-xs'
                        : 'bg-[#FFFFFF] dark:bg-[#202023] text-[#575750] dark:text-[#A1A1AA] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A] border border-[#E5E5DF] dark:border-[#3F3F46]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
