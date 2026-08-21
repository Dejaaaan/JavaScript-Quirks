export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'WTJS Quirks';

export type CategoryId = 
  | 'type-coercion'
  | 'event-loop'
  | 'this-context'
  | 'scope-closures'
  | 'prototypes-oop'
  | 'arrays-objects'
  | 'math-numbers'
  | 'syntax-asi'
  | 'async-promises';

export type LeetCodeDifficulty = 'Easy' | 'Medium' | 'Hard';

export type LeetCodeCategory =
  | 'Arrays & Hash Maps'
  | 'Two Pointers'
  | 'Sliding Window'
  | 'Stack'
  | 'Linked Lists'
  | 'Trees'
  | 'Dynamic Programming'
  | 'JavaScript & Async';

export interface LeetCodeTestCase {
  id: string;
  name: string;
  inputParams: any[];
  inputStr: string;
  expectedOutput: any;
  expectedStr: string;
}

export interface LeetCodeSolution {
  title?: string;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
  explanationEn?: string;
}

export interface LeetCodeProblem {
  id: string;
  number: number;
  title: string;
  titleEn: string;
  difficulty: LeetCodeDifficulty;
  category: LeetCodeCategory;
  tags: string[];
  leetcodeUrl: string;
  description: string;
  descriptionEn?: string;
  pattern: string;
  patternEn?: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
    explanationEn?: string;
  }>;
  constraints: string[];
  intuition: string;
  intuitionEn?: string;
  optimalSolution: LeetCodeSolution;
  bruteForceSolution?: LeetCodeSolution;
  jsSpecificTips: string[];
  jsSpecificTipsEn?: string[];
  testCases: LeetCodeTestCase[];
  runFunctionName: string;
}

export interface CodeComparison {
  title: string;
  titleEn?: string;
  badCode: string;
  badExplanation: string;
  badExplanationEn?: string;
  goodCode: string;
  goodExplanation: string;
  goodExplanationEn?: string;
  pitfall: string;
  pitfallEn?: string;
}

export interface LanguageComparison {
  language: 'Python' | 'Java' | 'Rust' | 'Go' | 'C++';
  jsCode: string;
  otherCode: string;
  jsBehavior: string;
  jsBehaviorEn?: string;
  otherBehavior: string;
  otherBehaviorEn?: string;
  keyDifference: string;
  keyDifferenceEn?: string;
  whyJsDoesThis: string;
  whyJsDoesThisEn?: string;
}

export interface VisualDemoPreset {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  code: string;
  visualType: 'event-loop' | 'coercion' | 'prototype' | 'this-binding' | 'scope-hoisting' | 'custom-console';
  interactiveConfig?: Record<string, any>;
}

export interface DeepDiveGuide {
  title: string;
  titleEn?: string;
  summary: string;
  summaryEn?: string;
  keyPoints: { term: string; termEn?: string; detail: string; detailEn?: string }[];
  mentalModel?: string;
  mentalModelEn?: string;
}

export interface JSTopic {
  id: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  category: CategoryId;
  difficulty: DifficultyLevel;
  tags: string[];
  summary: string;
  summaryEn?: string;
  deepDive?: DeepDiveGuide;
  ecmaSpecNote?: string;
  visualType?: 'event-loop' | 'coercion' | 'prototype' | 'this-binding' | 'scope-hoisting' | 'custom-console';
  codePresets: VisualDemoPreset[];
  comparisons: CodeComparison[];
  languageComparisons: LanguageComparison[];
  quizzes?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  topicId?: string;
  title: string;
  titleEn?: string;
  codeSnippet: string;
  options: string[];
  optionsEn?: string[];
  correctAnswerIndex: number;
  explanation: string;
  explanationEn?: string;
  ecmaRule: string;
  ecmaRuleEn?: string;
  difficulty: DifficultyLevel;
  category: CategoryId;
}

export interface LogEntry {
  type: 'log' | 'info' | 'warn' | 'error' | 'return';
  content: string;
  timestamp: number;
}

export interface ExecutionResult {
  logs: LogEntry[];
  returnValue?: string;
  error?: string;
  executionTimeMs: number;
}
