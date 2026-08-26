import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import data sources
import { JS_TOPICS } from '../src/data/topics.js';
import { CHAPTER_GUIDES } from '../src/data/chapterGuides.js';
import { LEETCODE_PROBLEMS } from '../src/data/leetcodeProblems.js';
import { QUIZ_QUESTIONS } from '../src/data/quizQuestions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

export function generateLlmsFiles() {
  console.log('Generating llms.txt and llms-full.txt from live source data...');

  const baseUrl = 'https://javascript-quirks.ai.studio';

  // 1. GENERATE llms.txt (Table of Contents & Index - strictly following llmstxt.org)
  let llmsIndex = `# JavaScript Quirks & Engine Internals Guide\n`;
  llmsIndex += `> An authoritative reference and interactive learning engine for ECMAScript 2026 specifications, JavaScript engine internals (V8/SpiderMonkey), type coercion, event loop execution, and interview challenges.\n\n`;

  llmsIndex += `## Core Chapters & Language Quirks (${JS_TOPICS.length} Comprehensive Guides)\n`;
  for (const topic of JS_TOPICS) {
    const title = topic.titleEn || topic.title;
    const desc = (topic.summaryEn || topic.summary || topic.subtitleEn || topic.subtitle || '').replace(/\n+/g, ' ').slice(0, 140);
    llmsIndex += `- [${title}](${baseUrl}/#topic-${topic.id}): ${desc}...\n`;
  }

  llmsIndex += `\n## LeetCode & Technical Interview Challenges (${LEETCODE_PROBLEMS.length} Problems with Test Cases)\n`;
  for (const problem of LEETCODE_PROBLEMS) {
    const title = problem.titleEn || problem.title;
    const pattern = problem.patternEn || problem.pattern || 'Algorithmic Solution';
    llmsIndex += `- [#${problem.number} ${title} (${problem.difficulty})](${baseUrl}/#view=leetcode): ${pattern}. Category: ${problem.category}.\n`;
  }

  llmsIndex += `\n## Interactive Tools & Visualizers\n`;
  llmsIndex += `- [Interactive AST Playground](${baseUrl}/#view=playground): Real-time sandbox to execute, debug, and inspect JavaScript expressions with console output.\n`;
  llmsIndex += `- [Event Loop Visualizer](${baseUrl}/#view=event-loop): Visual step-by-step animator for Call Stack, Microtasks, Macrotasks, and rendering ticks.\n`;
  llmsIndex += `- [Type Coercion Matrix](${baseUrl}/#view=coercion): Interactive matrix comparing strict vs loose equality across all JavaScript primitives.\n`;
  llmsIndex += `- [JavaScript Diagnostics Quiz](${baseUrl}/#view=quiz): ${QUIZ_QUESTIONS.length}-question diagnostic test covering tricky language semantics.\n`;

  llmsIndex += `\n## Documentation & Raw Knowledge Base\n`;
  llmsIndex += `- [Full Documentation (llms-full.txt)](${baseUrl}/llms-full.txt): Complete uncompressed textual knowledge base including every single topic, chapter guide, ECMAScript rule, code sample, and interview solution.\n`;
  llmsIndex += `- [Sitemap](${baseUrl}/sitemap.xml): Complete URL index of all topics and interactive tools.\n`;

  fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsIndex, 'utf8');
  console.log('✓ Successfully generated /public/llms.txt');

  // 2. GENERATE llms-full.txt (Comprehensive, 100% unabridged documentation)
  let fullDoc = `# JavaScript Quirks & Engine Internals Guide — Full Reference Documentation\n\n`;
  fullDoc += `> Complete encyclopedia of ECMAScript specifications, V8/SpiderMonkey engine execution mechanisms, type coercion abstract operations, event loop concurrency, prototype chains, and coding interview diagnostics.\n\n`;
  fullDoc += `Generated automatically from live source code. Contains ${JS_TOPICS.length} core topics, ${Object.keys(CHAPTER_GUIDES).length} in-depth chapter guides, ${LEETCODE_PROBLEMS.length} interview challenge solutions, and ${QUIZ_QUESTIONS.length} diagnostic quiz questions.\n\n`;
  fullDoc += `---\n\n`;

  fullDoc += `## PART 1: CORE TOPICS & ENGINE QUIRKS (${JS_TOPICS.length} Topics)\n\n`;
  for (let i = 0; i < JS_TOPICS.length; i++) {
    const topic = JS_TOPICS[i];
    const title = topic.titleEn || topic.title;
    fullDoc += `### Topic ${i + 1}: ${title} (ID: \`${topic.id}\`)\n`;
    fullDoc += `- **Category**: ${topic.category}\n`;
    fullDoc += `- **Difficulty**: ${topic.difficulty}\n`;
    fullDoc += `- **Tags**: ${topic.tags.join(', ')}\n`;
    if (topic.ecmaSpecNote) {
      fullDoc += `- **ECMAScript Specification**: ${topic.ecmaSpecNote}\n`;
    }
    fullDoc += `\n`;

    if (topic.summaryEn || topic.summary) {
      fullDoc += `#### Summary:\n${topic.summaryEn || topic.summary}\n\n`;
    }

    if (topic.codePresets && topic.codePresets.length > 0) {
      fullDoc += `#### Interactive Code Demos:\n`;
      for (const preset of topic.codePresets) {
        fullDoc += `**${preset.titleEn || preset.title}**\n`;
        if (preset.descriptionEn || preset.description) {
          fullDoc += `${preset.descriptionEn || preset.description}\n`;
        }
        fullDoc += `\`\`\`javascript\n${preset.code}\n\`\`\`\n\n`;
      }
    }

    if (topic.comparisons && topic.comparisons.length > 0) {
      fullDoc += `#### Bad vs Good Code Patterns (Pitfalls & Defenses):\n`;
      for (const comp of topic.comparisons) {
        fullDoc += `**${comp.titleEn || comp.title}**\n\n`;
        fullDoc += `❌ **Problematic Code (Anti-Pattern):**\n\`\`\`javascript\n${comp.badCode}\n\`\`\`\n`;
        fullDoc += `*Explanation:* ${comp.badExplanationEn || comp.badExplanation}\n\n`;
        fullDoc += `✅ **Recommended Modern Approach:**\n\`\`\`javascript\n${comp.goodCode}\n\`\`\`\n`;
        fullDoc += `*Explanation:* ${comp.goodExplanationEn || comp.goodExplanation}\n\n`;
        if (comp.pitfallEn || comp.pitfall) {
          fullDoc += `*Critical Pitfall:* ${comp.pitfallEn || comp.pitfall}\n\n`;
        }
      }
    }

    if (topic.languageComparisons && topic.languageComparisons.length > 0) {
      fullDoc += `#### Cross-Language Comparison (How Other Languages Handle This):\n`;
      for (const lang of topic.languageComparisons) {
        fullDoc += `##### In ${lang.language}:\n`;
        fullDoc += `- **JavaScript Code**: \`${lang.jsCode}\` → *Behavior:* ${lang.jsBehaviorEn || lang.jsBehavior}\n`;
        fullDoc += `- **${lang.language} Code**: \`${lang.otherCode}\` → *Behavior:* ${lang.otherBehaviorEn || lang.otherBehavior}\n`;
        fullDoc += `- **Key Architectural Difference**: ${lang.keyDifferenceEn || lang.keyDifference}\n`;
        fullDoc += `- **Why JavaScript Does This**: ${lang.whyJsDoesThisEn || lang.whyJsDoesThis}\n\n`;
      }
    }

    fullDoc += `---\n\n`;
  }

  fullDoc += `## PART 2: IN-DEPTH CHAPTER GUIDES & ECMASCRIPT SPECIFICATIONS (${Object.keys(CHAPTER_GUIDES).length} Guides)\n\n`;
  for (const [guideId, guide] of Object.entries(CHAPTER_GUIDES)) {
    fullDoc += `### Deep-Dive Chapter Guide: \`${guideId}\`\n\n`;
    fullDoc += `#### Overview:\n${guide.overviewEn || guide.overview}\n\n`;
    
    if (guide.analogyEn || guide.analogy) {
      fullDoc += `#### Real-World Analogy:\n${guide.analogyEn || guide.analogy}\n\n`;
    }

    if (guide.historyAndOrigin) {
      fullDoc += `#### Origin & Historical Context:\n`;
      fullDoc += `**${guide.historyAndOrigin.titleEn || guide.historyAndOrigin.title}**\n`;
      fullDoc += `${guide.historyAndOrigin.descriptionEn || guide.historyAndOrigin.description}\n\n`;
      fullDoc += `*Why it exists today:* ${guide.historyAndOrigin.whyItExistsEn || guide.historyAndOrigin.whyItExists}\n\n`;
    }

    if (guide.underTheHood) {
      fullDoc += `#### Under The Hood (Specification Breakdown):\n`;
      fullDoc += `${guide.underTheHood.summaryEn || guide.underTheHood.summary}\n\n`;
      
      for (const step of guide.underTheHood.steps) {
        fullDoc += `##### Step ${step.stepNumber}: ${step.titleEn || step.title}\n`;
        fullDoc += `${step.descriptionEn || step.description}\n\n`;
        if (step.codeSnippet) {
          fullDoc += `\`\`\`javascript\n${step.codeSnippet}\n\`\`\`\n\n`;
        }
      }
    }

    if (guide.pitfalls && guide.pitfalls.length > 0) {
      fullDoc += `#### Common Pitfalls in Production:\n`;
      for (const pf of guide.pitfalls) {
        fullDoc += `**${pf.titleEn || pf.title}**\n`;
        fullDoc += `- *Cause:* ${pf.causeEn || pf.cause}\n`;
        fullDoc += `- *Impact:* ${pf.impactEn || pf.impact}\n`;
        if (pf.codeSnippet) {
          fullDoc += `\`\`\`javascript\n${pf.codeSnippet}\n\`\`\`\n`;
        }
        fullDoc += `\n`;
      }
    }

    if (guide.solutions && guide.solutions.length > 0) {
      fullDoc += `#### Best-Practice Solutions & Fixes:\n`;
      for (const sol of guide.solutions) {
        fullDoc += `**${sol.titleEn || sol.title}**\n`;
        fullDoc += `- *Solution:* ${sol.solutionEn || sol.solution}\n`;
        fullDoc += `- *Recommendation:* ${sol.recommendationEn || sol.recommendation}\n`;
        if (sol.codeSnippet) {
          fullDoc += `\`\`\`javascript\n${sol.codeSnippet}\n\`\`\`\n`;
        }
        fullDoc += `\n`;
      }
    }

    if (guide.mentalModelEn || guide.mentalModel) {
      fullDoc += `#### Senior Engineer Mental Model:\n${guide.mentalModelEn || guide.mentalModel}\n\n`;
    }

    if (guide.goldenRuleEn || guide.goldenRule) {
      fullDoc += `#### Golden Rule:\n> ${guide.goldenRuleEn || guide.goldenRule}\n\n`;
    }

    fullDoc += `---\n\n`;
  }

  fullDoc += `## PART 3: LEETCODE & INTERVIEW CHALLENGES (${LEETCODE_PROBLEMS.length} Problems with Verified Solutions)\n\n`;
  for (const prob of LEETCODE_PROBLEMS) {
    const title = prob.titleEn || prob.title;
    fullDoc += `### Problem #${prob.number}: ${title} (${prob.difficulty})\n`;
    fullDoc += `- **Category**: ${prob.category}\n`;
    fullDoc += `- **Pattern**: ${prob.patternEn || prob.pattern}\n`;
    fullDoc += `- **Tags**: ${prob.tags.join(', ')}\n`;
    fullDoc += `- **LeetCode Link**: ${prob.leetcodeUrl}\n\n`;
    
    fullDoc += `#### Problem Statement:\n${prob.descriptionEn || prob.description}\n\n`;

    if (prob.intuitionEn || prob.intuition) {
      fullDoc += `#### Intuition & Algorithmic Strategy:\n${prob.intuitionEn || prob.intuition}\n\n`;
    }

    if (prob.examples && prob.examples.length > 0) {
      fullDoc += `#### Examples:\n`;
      for (let j = 0; j < prob.examples.length; j++) {
        const ex = prob.examples[j];
        fullDoc += `- **Example ${j + 1}**:\n  - Input: \`${ex.input}\`\n  - Output: \`${ex.output}\`\n  - Explanation: ${ex.explanationEn || ex.explanation}\n`;
      }
      fullDoc += `\n`;
    }

    if (prob.constraints && prob.constraints.length > 0) {
      fullDoc += `#### Constraints:\n`;
      const constraints = prob.constraintsEn || prob.constraints;
      for (const c of constraints) {
        fullDoc += `- \`${c}\`\n`;
      }
      fullDoc += `\n`;
    }

    if (prob.optimalSolution) {
      fullDoc += `#### Optimal Solution (Time: \`${prob.optimalSolution.timeComplexity}\`, Space: \`${prob.optimalSolution.spaceComplexity}\`):\n`;
      fullDoc += `\`\`\`javascript\n${prob.optimalSolution.code}\n\`\`\`\n`;
      fullDoc += `*Complexity & Explanation:* ${prob.optimalSolution.explanationEn || prob.optimalSolution.explanation}\n\n`;
    }

    if (prob.bruteForceSolution) {
      fullDoc += `#### Brute-Force Baseline (Time: \`${prob.bruteForceSolution.timeComplexity}\`, Space: \`${prob.bruteForceSolution.spaceComplexity}\`):\n`;
      fullDoc += `\`\`\`javascript\n${prob.bruteForceSolution.code}\n\`\`\`\n`;
      fullDoc += `*Explanation:* ${prob.bruteForceSolution.explanationEn || prob.bruteForceSolution.explanation}\n\n`;
    }

    if (prob.jsSpecificTips && prob.jsSpecificTips.length > 0) {
      fullDoc += `#### JavaScript-Specific Optimization Tips:\n`;
      const tips = prob.jsSpecificTipsEn || prob.jsSpecificTips;
      for (const tip of tips) {
        fullDoc += `- ${tip}\n`;
      }
      fullDoc += `\n`;
    }

    if (prob.testCases && prob.testCases.length > 0) {
      fullDoc += `#### Verified Test Cases:\n`;
      for (const tc of prob.testCases) {
        fullDoc += `- **${tc.name}**: Input \`${tc.inputStr}\` → Expected: \`${tc.expectedStr}\`\n`;
      }
      fullDoc += `\n`;
    }

    fullDoc += `---\n\n`;
  }

  fullDoc += `## PART 4: DIAGNOSTIC QUIZ QUESTIONS & ANSWERS (${QUIZ_QUESTIONS.length} Questions)\n\n`;
  for (let q = 0; q < QUIZ_QUESTIONS.length; q++) {
    const quiz = QUIZ_QUESTIONS[q];
    fullDoc += `### Question ${q + 1}: ${quiz.titleEn || quiz.title}\n`;
    fullDoc += `- **Category**: ${quiz.category} | **Rule**: ${quiz.ecmaRuleEn || quiz.ecmaRule}\n\n`;
    fullDoc += `\`\`\`javascript\n${quiz.codeSnippet}\n\`\`\`\n\n`;
    
    const options = quiz.optionsEn || quiz.options;
    fullDoc += `Options:\n`;
    options.forEach((opt, idx) => {
      const isCorrect = idx === quiz.correctAnswerIndex ? ' ✓ (Correct Answer)' : '';
      fullDoc += `- [${String.fromCharCode(65 + idx)}] ${opt}${isCorrect}\n`;
    });
    fullDoc += `\n**Detailed Explanation:**\n${quiz.explanationEn || quiz.explanation}\n\n`;
    fullDoc += `---\n\n`;
  }

  fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), fullDoc, 'utf8');
  console.log('✓ Successfully generated /public/llms-full.txt (Total characters: ' + fullDoc.length + ')');
}

generateLlmsFiles();
