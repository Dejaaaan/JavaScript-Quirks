/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { JS_TOPICS } from './data/topics';
import { Header } from './components/Header';
import { updateDynamicSEO } from './utils/seo';
import { TopicCard } from './components/TopicCard';
import { AdBanner } from './components/AdBanner';
import { 
  Sparkles, 
  Terminal, 
  HelpCircle, 
  Globe, 
  Code2, 
  Zap, 
  Bookmark, 
  BookOpen, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Flame,
  Loader2
} from 'lucide-react';
import { useI18n } from './i18n';
import { getStoredTheme, saveTheme } from './utils/themeStorage';

// Production Code-Splitting for Heavy Visualizers & Sandbox Components
const CoercionVisualizer = lazy(() => 
  import('./components/Visualizers/CoercionVisualizer').then(m => ({ default: m.CoercionVisualizer }))
);
const EventLoopVisualizer = lazy(() => 
  import('./components/Visualizers/EventLoopVisualizer').then(m => ({ default: m.EventLoopVisualizer }))
);
const Playground = lazy(() => 
  import('./components/Playground').then(m => ({ default: m.Playground }))
);
const Quiz = lazy(() => 
  import('./components/Quiz').then(m => ({ default: m.Quiz }))
);
const LanguageComparisonMatrix = lazy(() => 
  import('./components/LanguageComparisonMatrix').then(m => ({ default: m.LanguageComparisonMatrix }))
);
const LeetCodeSection = lazy(() => 
  import('./components/LeetCodeSection').then(m => ({ default: m.LeetCodeSection }))
);

// Sleek loading skeleton for lazily-loaded modules
const ViewLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500 dark:text-slate-400">
    <Loader2 className="w-8 h-8 animate-spin text-[#B45309] dark:text-[#F59E0B]" />
    <span className="font-mono text-xs tracking-wider uppercase">Loading Interactive Engine...</span>
  </div>
);

export default function App() {
  const { locale, m } = useI18n();
  const [activeView, setActiveView] = useState<'topics' | 'coercion' | 'event-loop' | 'playground' | 'quiz' | 'matrix' | 'leetcode'>('topics');
  const [playgroundCode, setPlaygroundCode] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('js_quirks_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const stored = getStoredTheme();
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    try {
      saveTheme(isDarkMode ? 'dark' : 'light');
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  // Deep linking via URL hash: #view=coercion or #topic-id
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;

      if (hash.startsWith('view=')) {
        const viewName = hash.replace('view=', '') as any;
        if (['topics', 'coercion', 'event-loop', 'playground', 'quiz', 'matrix', 'leetcode'].includes(viewName)) {
          setActiveView(viewName);
        }
      } else if (hash.startsWith('topic-')) {
        setActiveView('topics');
        const topicId = hash.replace('topic-', '');
        setTimeout(() => {
          const el = document.getElementById(topicId) || document.getElementById(`topic-${topicId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 200);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update Dynamic SEO on view or locale change
  useEffect(() => {
    updateDynamicSEO(activeView, locale);
  }, [activeView, locale]);

  const handleToggleBookmark = (topicId: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId];
      try {
        localStorage.setItem('js_quirks_bookmarks', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Filter topics
  const filteredTopics = JS_TOPICS.filter((topic) => {
    if (showOnlyBookmarks && !bookmarks.includes(topic.id)) {
      return false;
    }
    if (selectedCategory !== 'all' && topic.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (topic.title && topic.title.toLowerCase().includes(q)) || 
                         (topic.titleEn && topic.titleEn.toLowerCase().includes(q));
      const matchSummary = (topic.summary && topic.summary.toLowerCase().includes(q)) || 
                           (topic.summaryEn && topic.summaryEn.toLowerCase().includes(q));
      const matchTags = topic.tags && topic.tags.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchSummary || matchTags;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F9F9F7] dark:bg-[#121214] text-[#1A1A1A] dark:text-[#F4F4F5] font-sans antialiased transition-colors duration-200 flex flex-col justify-between">
      {/* Header */}
      <Header
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          if (view !== 'topics') {
            window.location.hash = `view=${view}`;
          } else {
            window.location.hash = '';
          }
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        bookmarkedCount={bookmarks.length}
        showOnlyBookmarks={showOnlyBookmarks}
        setShowOnlyBookmarks={setShowOnlyBookmarks}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-grow">
        {/* VIEW 1: Main Topics Catalog */}
        {activeView === 'topics' && (
          <div className="space-y-6">
            {/* Editorial Header Banner */}
            <div className="rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] bg-[#FFFFFF] dark:bg-[#18181B] p-6 shadow-xs relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none text-9xl font-mono font-black select-none text-[#1A1A1A] dark:text-[#F4F4F5]">
                {'{ }'}
              </div>

              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FAF9F5] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#3F3F46] text-[#78350F] dark:text-[#FDE68A] font-mono text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{locale === 'sr' ? 'Standardizovan Referentni Priručnik' : 'Standardized Engineering Reference'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight leading-tight">
                  {m.app_title()}
                </h1>
                <p className="text-sm sm:text-base text-[#3F3F3C] dark:text-[#D4D4D8] leading-relaxed">
                  {m.app_subtitle()}
                </p>
              </div>

              {/* Quick Navigation Cards */}
              <div className="mt-6 pt-6 border-t border-[#F0EFEA] dark:border-[#27272A] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  id="quick-card-coercion"
                  onClick={() => {
                    setActiveView('coercion');
                    window.location.hash = 'view=coercion';
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#2E2E33] hover:border-[#78350F] dark:hover:border-[#F59E0B] text-left transition group cursor-pointer shadow-2xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A] dark:text-[#F4F4F5] group-hover:text-[#78350F] dark:group-hover:text-[#F59E0B] transition">
                      <Sparkles className="w-3.5 h-3.5 text-[#78350F] dark:text-[#F59E0B]" />
                      <span>{m.quick_coercion_title()}</span>
                    </div>
                    <p className="text-[11px] text-[#40403C] dark:text-[#D4D4D8]">{m.quick_coercion_desc()}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#40403C] dark:text-[#D4D4D8] group-hover:translate-x-1 group-hover:text-[#78350F] dark:group-hover:text-[#F59E0B] transition-all flex-shrink-0" />
                </button>

                <button
                  id="quick-card-event-loop"
                  onClick={() => {
                    setActiveView('event-loop');
                    window.location.hash = 'view=event-loop';
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#2E2E33] hover:border-[#065F46] dark:hover:border-[#34D399] text-left transition group cursor-pointer shadow-2xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A] dark:text-[#F4F4F5] group-hover:text-[#065F46] dark:group-hover:text-[#34D399] transition">
                      <Layers className="w-3.5 h-3.5 text-[#065F46] dark:text-[#34D399]" />
                      <span>{m.quick_event_loop_title()}</span>
                    </div>
                    <p className="text-[11px] text-[#40403C] dark:text-[#D4D4D8]">{m.quick_event_loop_desc()}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#40403C] dark:text-[#D4D4D8] group-hover:translate-x-1 group-hover:text-[#065F46] dark:group-hover:text-[#34D399] transition-all flex-shrink-0" />
                </button>

                <button
                  id="quick-card-leetcode"
                  onClick={() => {
                    setActiveView('leetcode');
                    window.location.hash = 'view=leetcode';
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#2E2E33] hover:border-[#78350F] dark:hover:border-[#FBBF24] text-left transition group cursor-pointer shadow-2xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A] dark:text-[#F4F4F5] group-hover:text-[#78350F] dark:group-hover:text-[#FBBF24] transition">
                      <Code2 className="w-3.5 h-3.5 text-[#78350F] dark:text-[#FBBF24]" />
                      <span>{m.quick_leetcode_title()}</span>
                    </div>
                    <p className="text-[11px] text-[#40403C] dark:text-[#D4D4D8]">{m.quick_leetcode_desc()}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#40403C] dark:text-[#D4D4D8] group-hover:translate-x-1 group-hover:text-[#78350F] dark:group-hover:text-[#FBBF24] transition-all flex-shrink-0" />
                </button>

                <button
                  id="quick-card-quiz"
                  onClick={() => {
                    setActiveView('quiz');
                    window.location.hash = 'view=quiz';
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] dark:bg-[#202023] border border-[#E5E5DF] dark:border-[#2E2E33] hover:border-[#9D174D] dark:hover:border-[#F472B6] text-left transition group cursor-pointer shadow-2xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A] dark:text-[#F4F4F5] group-hover:text-[#9D174D] dark:group-hover:text-[#F472B6] transition">
                      <HelpCircle className="w-3.5 h-3.5 text-[#9D174D] dark:text-[#F472B6]" />
                      <span>{m.quick_quiz_title()}</span>
                    </div>
                    <p className="text-[11px] text-[#40403C] dark:text-[#D4D4D8]">{m.quick_quiz_desc()}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#40403C] dark:text-[#D4D4D8] group-hover:translate-x-1 group-hover:text-[#9D174D] dark:group-hover:text-[#F472B6] transition-all flex-shrink-0" />
                </button>
              </div>
            </div>

            {/* Topic Cards List */}
            {filteredTopics.length === 0 ? (
              <div className="text-center py-16 bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] p-8">
                <p className="text-[#40403C] dark:text-[#D4D4D8] text-sm">{m.card_no_results()}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredTopics.map((topic, index) => (
                  <React.Fragment key={topic.id}>
                    <TopicCard
                      topic={topic}
                      isBookmarked={bookmarks.includes(topic.id)}
                      onToggleBookmark={handleToggleBookmark}
                    />
                    {/* Native In-Feed Placement after Topic 3 and Topic 6 */}
                    {(index === 2 || index === 5) && index < filteredTopics.length - 1 && (
                      <AdBanner format="in-feed" label={locale === 'sr' ? 'Sponzorisano' : 'Sponsored'} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: Coercion Lab */}
        {activeView === 'coercion' && (
          <Suspense fallback={<ViewLoadingFallback />}>
            <div className="space-y-6">
              <CoercionVisualizer />
            </div>
          </Suspense>
        )}

        {/* VIEW 3: Event Loop Visualizer */}
        {activeView === 'event-loop' && (
          <Suspense fallback={<ViewLoadingFallback />}>
            <div className="space-y-6">
              <EventLoopVisualizer />
            </div>
          </Suspense>
        )}

        {/* VIEW 4: Interactive Playground */}
        {activeView === 'playground' && (
          <Suspense fallback={<ViewLoadingFallback />}>
            <div className="space-y-6">
              <Playground initialCode={playgroundCode} />
            </div>
          </Suspense>
        )}

        {/* VIEW 5: LeetCode Problems Explorer */}
        {activeView === 'leetcode' && (
          <Suspense fallback={<ViewLoadingFallback />}>
            <div className="space-y-6">
              <LeetCodeSection 
                onOpenInPlayground={(code) => {
                  setPlaygroundCode(code);
                  setActiveView('playground');
                  window.location.hash = 'view=playground';
                }} 
              />
            </div>
          </Suspense>
        )}

        {/* VIEW 6: WTF JS Quiz */}
        {activeView === 'quiz' && (
          <Suspense fallback={<ViewLoadingFallback />}>
            <div className="space-y-6">
              <Quiz />
            </div>
          </Suspense>
        )}

        {/* VIEW 7: Cross-Language Matrix */}
        {activeView === 'matrix' && (
          <Suspense fallback={<ViewLoadingFallback />}>
            <div className="space-y-6">
              <LanguageComparisonMatrix />
            </div>
          </Suspense>
        )}
      </main>

      {/* Editorial App Footer */}
      <footer className="mt-16 border-t border-[#E5E5DF] dark:border-[#27272A] bg-[#F2F2ED] dark:bg-[#18181B] py-8 text-[#3F3F3C] dark:text-[#D4D4D8] text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded bg-[#1A1A1A] dark:bg-[#27272A] text-[#F59E0B] font-mono font-bold flex items-center justify-center text-[10px]">
              JS
            </span>
            <span className="text-[#1A1A1A] dark:text-[#F4F4F5] font-serif font-bold">{m.brand_title()}</span>
            <span className="text-[#71717A] dark:text-[#71717A]" aria-hidden="true">|</span>
            <span className="text-[#3F3F3C] dark:text-[#D4D4D8] font-medium">{locale === 'sr' ? 'Usklađeno sa ECMAScript 2026 Specifikacijom' : 'Aligned with ECMAScript 2026 Specification'}</span>
          </div>

          <div className="flex items-center gap-4 text-[#3F3F3C] dark:text-[#D4D4D8] font-mono text-[11px] font-medium">
            <span>{m.footer_text()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
