import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  Check,
  X
} from 'lucide-react';
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
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLangDropdownOpen(false);
      }
    };

    if (langDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [langDropdownOpen]);

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
    { id: 'async-promises', label: m.cat_async_promises() },
  ];

  const navItems = [
    { id: 'topics' as const, label: m.nav_topics(), icon: BookOpen, color: 'text-[#4338CA] dark:text-[#818CF8]' },
    { id: 'coercion' as const, label: m.nav_coercion(), icon: Sparkles, color: 'text-[#B45309] dark:text-[#F59E0B]' },
    { id: 'event-loop' as const, label: m.nav_event_loop(), icon: Layers, color: 'text-[#047857] dark:text-[#34D399]' },
    { id: 'playground' as const, label: m.nav_playground(), icon: Terminal, color: 'text-[#6D28D9] dark:text-[#A78BFA]' },
    { id: 'leetcode' as const, label: m.nav_leetcode(), icon: Code2, color: 'text-[#D97706] dark:text-[#FBBF24]' },
    { id: 'quiz' as const, label: m.nav_quiz(), icon: HelpCircle, color: 'text-[#BE185D] dark:text-[#F472B6]' },
    { id: 'matrix' as const, label: m.nav_matrix(), icon: Globe, color: 'text-[#0284C7] dark:text-[#38BDF8]' },
  ];

  const handleSelectLanguage = (newLocale: 'en' | 'sr') => {
    setLocale(newLocale);
    setLangDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E5DF] dark:border-[#27272A] bg-[#FAF9F5]/95 dark:bg-[#121214]/95 backdrop-blur-md transition-colors">
      {/* Top Standard & Spec Banner */}
      <div className="bg-[#1A1A1A] text-[#F59E0B] px-4 py-1 text-[11px] font-mono flex items-center justify-between border-b border-[#27272A]">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse"></span>
            <span className="font-bold tracking-wider">{m.top_masthead_title()}</span>
            <span className="text-[#73736C] hidden sm:inline">•</span>
            <span className="text-[#A1A1AA] hidden sm:inline text-[10px]">{m.top_masthead_subtitle()}</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-[#A1A1AA]">
            <span className="bg-[#27272A] px-2 py-0.5 rounded font-mono text-[#F4F4F5] border border-[#3F3F46]">
              {m.top_standard()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3">
          {/* Logo & Title */}
          <div 
            onClick={() => setActiveView('topics')}
            className="flex items-center gap-2.5 cursor-pointer flex-shrink-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F59E0B] dark:text-[#18181B] font-mono font-bold flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform">
              JS
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-[#1A1A1A] dark:text-[#F4F4F5]">
                  {m.brand_title()}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EBEBE5] dark:bg-[#27272A] text-[#3F3F3C] dark:text-[#D4D4D8] font-mono font-semibold">
                  {m.brand_badge()}
                </span>
              </div>
              <span className="text-[10px] text-[#40403C] dark:text-[#D4D4D8] hidden md:block leading-tight">
                {m.brand_subtitle()}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#F4F4F0] dark:bg-[#1C1C1F] p-1 rounded-xl border border-[#E5E5DF] dark:border-[#2E2E33]" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveView(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1A1A1A] text-[#FFFFFF] dark:bg-[#F59E0B] dark:text-[#18181B] shadow-xs font-bold'
                      : 'text-[#3F3F3C] dark:text-[#D4D4D8] hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:bg-[#E5E5DF] dark:hover:bg-[#27272A] font-semibold'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F59E0B] dark:text-[#18181B]' : item.color}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Language Dropdown, Saved Bookmark, Dark Mode */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language Selection Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="language-dropdown-toggle"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="h-8 px-2.5 rounded-lg bg-[#FAF9F5] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#3F3F46] text-[#1A1A1A] dark:text-[#F4F4F5] hover:border-[#78350F] dark:hover:border-[#F59E0B] transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30"
                aria-label={m.lang_switcher_label()}
                aria-expanded={langDropdownOpen}
                aria-haspopup="true"
              >
                <Languages className="w-3.5 h-3.5 text-[#78350F] dark:text-[#F59E0B]" />
                <span className="font-mono font-bold text-[11px] uppercase tracking-wider">
                  {locale === 'sr' ? '🇷🇸 SR' : '🇬🇧 EN'}
                </span>
                <ChevronDown className={`w-3 h-3 text-[#40403C] dark:text-[#D4D4D8] transition-transform duration-200 ${langDropdownOpen ? 'rotate-180 text-[#78350F] dark:text-[#F59E0B]' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {langDropdownOpen && (
                <div 
                  id="language-dropdown-menu"
                  className="absolute right-0 mt-1.5 w-40 rounded-xl bg-[#FFFFFF] dark:bg-[#1E1E22] border border-[#E5E5DF] dark:border-[#3F3F46] shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  role="menu"
                >
                  <div className="px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#40403C] dark:text-[#D4D4D8] border-b border-[#F4F4F0] dark:border-[#27272A] mb-1">
                    {m.lang_switcher_label()}
                  </div>

                  <button
                    id="lang-select-en"
                    onClick={() => handleSelectLanguage('en')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition ${
                      locale === 'en'
                        ? 'bg-[#F4F4F0] dark:bg-[#27272A] text-[#78350F] dark:text-[#F59E0B] font-bold'
                        : 'text-[#3F3F3C] dark:text-[#D4D4D8] hover:bg-[#FAF9F5] dark:hover:bg-[#2E2E33] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF] font-medium'
                    }`}
                    role="menuitem"
                  >
                    <span className="flex items-center gap-2">
                      <span>🇬🇧</span>
                      <span>English</span>
                    </span>
                    {locale === 'en' && <Check className="w-3.5 h-3.5 text-[#78350F] dark:text-[#F59E0B]" />}
                  </button>

                  <button
                    id="lang-select-sr"
                    onClick={() => handleSelectLanguage('sr')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition ${
                      locale === 'sr'
                        ? 'bg-[#F4F4F0] dark:bg-[#27272A] text-[#78350F] dark:text-[#F59E0B] font-bold'
                        : 'text-[#3F3F3C] dark:text-[#D4D4D8] hover:bg-[#FAF9F5] dark:hover:bg-[#2E2E33] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF] font-medium'
                    }`}
                    role="menuitem"
                  >
                    <span className="flex items-center gap-2">
                      <span>🇷🇸</span>
                      <span>Srpski</span>
                    </span>
                    {locale === 'sr' && <Check className="w-3.5 h-3.5 text-[#78350F] dark:text-[#F59E0B]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Saved Bookmarks Toggle */}
            <button
              id="bookmarks-filter-btn"
              onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer h-8 ${
                showOnlyBookmarks
                  ? 'bg-[#78350F] dark:bg-[#F59E0B] border-[#78350F] dark:border-[#F59E0B] text-white dark:text-[#18181B] shadow-xs'
                  : 'bg-[#FAF9F5] dark:bg-[#202023] border-[#E5E5DF] dark:border-[#3F3F46] text-[#3F3F3C] dark:text-[#D4D4D8] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF]'
              }`}
              title={m.filter_saved_tooltip()}
              aria-label={m.filter_saved()}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarks ? 'fill-current' : 'text-[#78350F] dark:text-[#F59E0B]'}`} />
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
              id="theme-toggle-button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-8 h-8 rounded-lg border bg-[#FAF9F5] dark:bg-[#202023] border-[#E5E5DF] dark:border-[#3F3F46] text-[#3F3F3C] dark:text-[#D4D4D8] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF] transition cursor-pointer flex items-center justify-center"
              title={isDarkMode ? m.toggle_theme_light() : m.toggle_theme_dark()}
              aria-label={isDarkMode ? m.toggle_theme_light() : m.toggle_theme_dark()}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4 text-[#3F3F3C]" />}
            </button>
          </div>
        </div>

        {/* Secondary Mobile/Tablet Horizontal Scroll Nav (Only below xl) */}
        <div className="flex xl:hidden items-center gap-1 overflow-x-auto py-2 border-t border-[#E5E5DF]/70 dark:border-[#27272A]/70 no-scrollbar" aria-label="Mobile Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => setActiveView(item.id)}
                className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap cursor-pointer transition flex items-center gap-1.5 flex-shrink-0 ${
                  isActive
                    ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#FFFFFF] dark:text-[#18181B] font-bold shadow-xs'
                    : 'text-[#3F3F3C] dark:text-[#D4D4D8] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A] font-semibold'
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
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#575750] dark:text-[#A1A1AA]" />
                <input
                  id="topics-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={m.search_placeholder()}
                  aria-label={m.search_placeholder()}
                  className="w-full bg-[#FFFFFF] dark:bg-[#202023] border border-[#D4D4CE] dark:border-[#3F3F46] rounded-xl pl-8.5 pr-8 py-1.5 text-xs text-[#1A1A1A] dark:text-[#F4F4F5] placeholder-[#575750] dark:placeholder-[#A1A1AA] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#F59E0B] shadow-2xs transition font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#575750] hover:text-[#1A1A1A] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5] cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs" role="tablist" aria-label="Category Filters">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`cat-filter-${cat.id}`}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap flex-shrink-0 font-mono text-[11px] ${
                      isSelected
                        ? 'bg-[#312E81] dark:bg-[#818CF8] text-white dark:text-[#0F172A] font-bold shadow-xs'
                        : 'bg-[#FFFFFF] dark:bg-[#202023] text-[#3F3F3C] dark:text-[#D4D4D8] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A] border border-[#D4D4CE] dark:border-[#3F3F46] font-semibold'
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
