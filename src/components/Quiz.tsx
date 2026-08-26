import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { QuizQuestion } from '../types';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, Zap, BookOpen, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CodeBlock } from './CodeBlock';
import { FormattedText } from './FormattedText';
import { AdBanner } from './AdBanner';
import { useI18n } from '../i18n';

export const Quiz: React.FC = () => {
  const { locale, m } = useI18n();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<{ question: QuizQuestion; selected: number; isCorrect: boolean }[]>([]);

  const question = QUIZ_QUESTIONS[currentIdx];
  const isAnswered = selectedOption !== null;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    const isCorrect = index === question.correctAnswerIndex;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        question,
        selected: index,
        isCorrect
      }
    ]);
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setStreak(0);
    setIsCompleted(false);
    setUserAnswers([]);
  };

  if (isCompleted) {
    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    return (
      <div id="quiz-results" className="max-w-2xl mx-auto bg-[#FFFFFF] dark:bg-[#18181B] text-[#1A1A1A] dark:text-[#F4F4F5] rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] p-8 shadow-[0_2px_16px_rgba(0,0,0,0.06)] text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#F59E0B]/15 dark:bg-[#F59E0B]/20 text-[#B45309] dark:text-[#F59E0B] flex items-center justify-center mx-auto border border-[#F59E0B]/30">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-[#78350F] dark:text-[#F59E0B]">{locale === 'sr' ? 'Rezultat Provere Znanja' : 'Quiz Knowledge Result'}</span>
          <h2 className="text-3xl font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] mt-1">{m.quiz_mastery_level()}</h2>
          <p className="text-sm text-[#3F3F3C] dark:text-[#D4D4D8] font-serif italic mt-2">
            {m.quiz_points_scored({ score, total: QUIZ_QUESTIONS.length, percent: percentage })}
          </p>
        </div>

        {/* Rating Badge */}
        <div className="p-4 bg-[#FAF9F5] dark:bg-[#202023] rounded-xl border border-[#E5E5DF] dark:border-[#3F3F46] text-sm">
          {percentage >= 80 ? (
            <span className="text-[#15803D] dark:text-[#4ADE80] font-bold font-serif text-base">
              {locale === 'sr' ? 'JavaScript Velemajstor: Pokazujete napredno razumevanje ECMAScript specifikacije i internih mehanizama.' : 'JavaScript Grandmaster: You demonstrate an advanced grasp of the ECMAScript specification.'}
            </span>
          ) : percentage >= 50 ? (
            <span className="text-[#B45309] dark:text-[#FBBF24] font-bold font-serif text-base">
              {locale === 'sr' ? 'Solidno Znanje: Specifičnosti JavaScript-a zahtevaju još malo prakse za potpuno usvajanje.' : 'Solid Knowledge: JavaScript quirks require just a little more practice to fully conquer.'}
            </span>
          ) : (
            <span className="text-[#B91C1C] dark:text-[#F87171] font-bold font-serif text-base">
              {locale === 'sr' ? 'Učenik na početku: Pređite ponovo kroz poglavlja i vizuelne simulacije, pa pokušajte ponovo!' : 'Apprentice: Review the deep-dive topics and visualizers, then test your knowledge again!'}
            </span>
          )}
        </div>

        {/* Restart Button */}
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] dark:bg-[#F59E0B] hover:bg-[#333330] dark:hover:bg-[#D97706] text-[#F9F9F7] dark:text-[#18181B] font-semibold text-xs mx-auto shadow-sm transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#F59E0B] dark:text-[#18181B]" />
          <span>{m.quiz_restart_btn()}</span>
        </button>

        {/* Post-Quiz Achievement Ad Placement */}
        <AdBanner
          format="auto"
          label={locale === 'sr' ? 'Preporučeni kursevi i alati' : 'Recommended Tools & Courses'}
        />
      </div>
    );
  }

  return (
    <div id="quiz-container" className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Progress & Stats */}
      <div className="flex items-center justify-between border-b border-[#E5E5DF] dark:border-[#27272A] pb-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] font-mono text-xs font-semibold">
            {m.quiz_question_num({ current: currentIdx + 1, total: QUIZ_QUESTIONS.length })}
          </span>
          <span className="text-xs text-[#3F3F3C] dark:text-[#D4D4D8] font-mono font-semibold">§ {question.category}</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-[#78350F] dark:text-[#F59E0B] font-bold">
            <Zap className="w-4 h-4 fill-current" />
            {m.quiz_streak({ streak })}
          </span>
          <span className="text-[#3F3F3C] dark:text-[#D4D4D8] font-semibold">{m.quiz_points({ score, total: currentIdx + (isAnswered ? 1 : 0) })}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-[#E5E5DF] dark:bg-[#27272A] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1A1A1A] dark:bg-[#F59E0B] transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-[#FFFFFF] dark:bg-[#18181B] text-[#1A1A1A] dark:text-[#F4F4F5] rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-5">
        <div>
          <span className="text-xs font-mono font-bold text-[#78350F] dark:text-[#F59E0B] uppercase tracking-wider">{question.difficulty}</span>
          <h3 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] mt-1">
            {locale === 'en' && question.titleEn ? question.titleEn : question.title}
          </h3>
          <p className="text-xs text-[#3F3F3C] dark:text-[#D4D4D8] font-serif italic mt-1">{m.quiz_prompt()}</p>
        </div>

        {/* Code Snippet */}
        <CodeBlock
          code={question.codeSnippet}
          language="javascript"
          showLineNumbers={true}
          showCopyButton={true}
        />

        {/* Options List */}
        <div className="grid grid-cols-1 gap-2.5">
          {(locale === 'en' && question.optionsEn ? question.optionsEn : question.options).map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === question.correctAnswerIndex;

            let buttonStyle = 'bg-[#FAF9F5] dark:bg-[#202023] border-[#E5E5DF] dark:border-[#3F3F46] hover:border-[#1A1A1A] dark:hover:border-[#A1A1AA] text-[#1A1A1A] dark:text-[#F4F4F5]';
            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = 'bg-[#F0FDF4] dark:bg-[#064E3B]/40 border-[#15803D] dark:border-[#10B981] text-[#166534] dark:text-[#6EE7B7] font-bold';
              } else if (isSelected) {
                buttonStyle = 'bg-[#FFF5F5] dark:bg-[#7F1D1D]/40 border-[#DC2626] dark:border-[#EF4444] text-[#991B1B] dark:text-[#FCA5A5] font-bold';
              } else {
                buttonStyle = 'bg-[#FAF9F5] dark:bg-[#202023] border-[#E5E5DF] dark:border-[#27272A] text-[#A3A39A] dark:text-[#71717A] opacity-50';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`p-3.5 rounded-xl border text-left font-mono text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-[#EBEBE5] dark:bg-[#27272A] flex items-center justify-center font-bold text-xs text-[#1A1A1A] dark:text-[#F4F4F5]">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswered && (
                  <div>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-[#15803D] dark:text-[#34D399]" />}
                    {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-[#DC2626] dark:text-[#F87171]" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Revealed */}
        {isAnswered && (
          <div className="mt-4 p-5 bg-[#FAF9F5] dark:bg-[#202023] rounded-xl border border-[#E5E5DF] dark:border-[#3F3F46] space-y-2">
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#78350F] dark:text-[#F59E0B]">
              <Sparkles className="w-4 h-4 text-[#78350F] dark:text-[#F59E0B]" />
              <span>{m.quiz_explanation_title()}</span>
            </div>
            <FormattedText
              text={locale === 'en' && question.explanationEn ? question.explanationEn : question.explanation}
              as="p"
              className="text-xs sm:text-sm text-[#262624] dark:text-[#D4D4D8] leading-relaxed"
            />
            <div className="pt-2 border-t border-[#E5E5DF] dark:border-[#3F3F46] text-[11px] text-[#3F3F3C] dark:text-[#D4D4D8] flex items-center gap-1.5 font-mono font-medium">
              <BookOpen className="w-3.5 h-3.5 text-[#78350F] dark:text-[#F59E0B]" />
              <span>{m.quiz_spec_ref({ rule: (locale === 'en' && question.ecmaRuleEn) ? question.ecmaRuleEn : question.ecmaRule })}</span>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1A1A1A] dark:bg-[#F59E0B] hover:bg-[#333330] dark:hover:bg-[#D97706] text-[#F9F9F7] dark:text-[#18181B] font-semibold text-xs shadow-sm transition cursor-pointer"
              >
                <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? m.quiz_next_btn() : m.quiz_finish_btn()}</span>
                <ArrowRight className="w-4 h-4 text-[#F59E0B] dark:text-[#18181B]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
