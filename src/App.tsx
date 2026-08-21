/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { JS_TOPICS } from './data/topics';
import { Header } from './components/Header';
import { TopicCard } from './components/TopicCard';
import { CoercionVisualizer } from './components/Visualizers/CoercionVisualizer';
import { EventLoopVisualizer } from './components/Visualizers/EventLoopVisualizer';
import { Playground } from './components/Playground';
import { Quiz } from './components/Quiz';
import { LanguageComparisonMatrix } from './components/LanguageComparisonMatrix';
import { LeetCodeSection } from './components/LeetCodeSection';
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
  Flame
} from 'lucide-react';
import { useI18n } from './i18n';

export default function App() {
  const { locale, m } = useI18n();
  const [activeView, setActiveView] = useState<'topics' | 'coercion' | 'event-loop' | 'playground' | 'quiz' | 'matrix' | 'leetcode'>('topics');
  const [playgroundCode, setPlaygroundCode] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
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
    try {
      const saved = localStorage.getItem('js_quirks_dark_mode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('js_quirks_dark_mode', JSON.stringify(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('js_quirks_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarks]);

  const handleToggleBookmark = (topicId: string) => {
    setBookmarks((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  // Filter topics
  const filteredTopics = JS_TOPICS.filter((topic) => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = topic.title.toLowerCase().includes(q);
      const matchesSubtitle = topic.subtitle.toLowerCase().includes(q);
      const matchesTags = topic.tags.some((t) => t.toLowerCase().includes(q));
      const matchesSummary = topic.summary.toLowerCase().includes(q);
      const matchesPresets = topic.codePresets.some((p) => p.code.toLowerCase().includes(q));
      if (!matchesTitle && !matchesSubtitle && !matchesTags && !matchesSummary && !matchesPresets) {
        return false;
      }
    }

    // Category
    if (selectedCategory !== 'all' && topic.category !== selectedCategory) {
      return false;
    }

    // Difficulty
    if (selectedDifficulty !== 'All' && topic.difficulty !== selectedDifficulty) {
      return false;
    }

    // Bookmarks only
    if (showOnlyBookmarks && !bookmarks.includes(topic.id)) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#F9F9F7] dark:bg-[#121214] text-[#1A1A1A] dark:text-[#F4F4F5] font-sans selection:bg-[#F59E0B]/30 selection:text-[#1A1A1A] flex flex-col transition-colors">
      {/* App Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        bookmarkedCount={bookmarks.length}
        showOnlyBookmarks={showOnlyBookmarks}
        setShowOnlyBookmarks={setShowOnlyBookmarks}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* VIEW 1: Topics & Quirks Deep Dive */}
        {activeView === 'topics' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center justify-between border-b border-[#E5E5DF] dark:border-[#27272A] pb-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] flex items-center gap-2 tracking-tight">
                  <Code2 className="w-6 h-6 text-[#B45309] dark:text-[#F59E0B]" />
                  <span>{locale === 'sr' ? `JavaScript Poglavlja i Teme (${filteredTopics.length})` : `JavaScript Topics & Chapters (${filteredTopics.length})`}</span>
                </h2>
                <p className="text-xs text-[#73736C] dark:text-[#A1A1AA] font-serif italic mt-0.5">
                  {locale === 'sr' ? 'Interaktivne analize uz poređenje loših i dobrih praksi i paralele sa drugim programskim jezicima.' : 'Interactive in-depth analysis comparing bad vs best practices and parallels with other languages.'}
                </p>
              </div>

              {(searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'All' || showOnlyBookmarks) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedDifficulty('All');
                    setShowOnlyBookmarks(false);
                  }}
                  className="text-xs text-[#B45309] dark:text-[#F59E0B] font-medium hover:underline cursor-pointer"
                >
                  {m.filter_reset()}
                </button>
              )}
            </div>

            {filteredTopics.length === 0 ? (
              <div className="text-center py-16 bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] space-y-3 shadow-sm">
                <Layers className="w-10 h-10 text-[#A3A39A] dark:text-[#52525B] mx-auto" />
                <h3 className="text-base font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">{m.card_no_results()}</h3>
                <p className="text-xs text-[#73736C] dark:text-[#A1A1AA]">{locale === 'sr' ? 'Pokušajte da promenite uneti pojam ili resetujete filter kategorija.' : 'Try adjusting your search query or resetting category filters.'}</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedDifficulty('All');
                    setShowOnlyBookmarks(false);
                  }}
                  className="px-4 py-2 bg-[#1A1A1A] dark:bg-[#27272A] hover:bg-[#333330] dark:hover:bg-[#3F3F46] text-xs font-semibold rounded-lg text-[#F9F9F7] dark:text-[#F4F4F5] transition cursor-pointer"
                >
                  {m.filter_reset()}
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredTopics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    isBookmarked={bookmarks.includes(topic.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: Coercion Lab */}
        {activeView === 'coercion' && (
          <div className="space-y-6">
            <CoercionVisualizer />
          </div>
        )}

        {/* VIEW 3: Event Loop Visualizer */}
        {activeView === 'event-loop' && (
          <div className="space-y-6">
            <EventLoopVisualizer />
          </div>
        )}

        {/* VIEW 4: Interactive Playground */}
        {activeView === 'playground' && (
          <div className="space-y-6">
            <Playground initialCode={playgroundCode} />
          </div>
        )}

        {/* VIEW 5: LeetCode Problems Explorer */}
        {activeView === 'leetcode' && (
          <div className="space-y-6">
            <LeetCodeSection 
              onOpenInPlayground={(code) => {
                setPlaygroundCode(code);
                setActiveView('playground');
              }} 
            />
          </div>
        )}

        {/* VIEW 6: WTF JS Quiz */}
        {activeView === 'quiz' && (
          <div className="space-y-6">
            <Quiz />
          </div>
        )}

        {/* VIEW 7: Cross-Language Matrix */}
        {activeView === 'matrix' && (
          <div className="space-y-6">
            <LanguageComparisonMatrix />
          </div>
        )}
      </main>

      {/* Editorial App Footer */}
      <footer className="mt-16 border-t border-[#E5E5DF] dark:border-[#27272A] bg-[#F2F2ED] dark:bg-[#18181B] py-8 text-[#73736C] dark:text-[#A1A1AA] text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded bg-[#1A1A1A] dark:bg-[#27272A] text-[#F59E0B] font-mono font-bold flex items-center justify-center text-[10px]">
              JS
            </span>
            <span className="text-[#1A1A1A] dark:text-[#F4F4F5] font-serif font-bold">{m.brand_title()}</span>
            <span className="text-[#D4D4CE] dark:text-[#3F3F46]">|</span>
            <span>{locale === 'sr' ? 'Usklađeno sa ECMAScript 2024+ Specifikacijom' : 'Aligned with ECMAScript 2024+ Specification'}</span>
          </div>

          <div className="flex items-center gap-4 text-[#73736C] dark:text-[#A1A1AA] font-mono text-[11px]">
            <span>{locale === 'sr' ? 'Edukativni Referentni Priručnik' : 'Educational Reference Manual'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

