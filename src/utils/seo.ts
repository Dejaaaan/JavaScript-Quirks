// Dynamic SEO & Structured Data Management
// Automatically aggregates all topics, quiz questions, and LeetCode challenges into Schema.org graphs
import { JS_TOPICS } from '../data/topics';
import { LEETCODE_PROBLEMS } from '../data/leetcodeProblems';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';

export function updateDynamicSEO(activeView: string, locale: 'en' | 'sr') {
  if (typeof window === 'undefined') return;

  const origin = window.location.origin;
  const currentUrl = `${origin}${window.location.pathname}${window.location.hash}`;
  const canonicalUrl = `${origin}${window.location.pathname}`;

  // 1. Update HTML Document Language Tag
  document.documentElement.lang = locale;

  // 2. Update Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // 3. Update OpenGraph URL
  let ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', currentUrl);

  // 4. Update Meta Description dynamically based on view
  let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (metaDesc) {
    const descriptions: Record<string, { en: string; sr: string }> = {
      'topics': {
        en: 'Explore JavaScript engine mechanics, ToPrimitive type coercion, Event Loop microtasks/macrotasks, and prototypal inheritance with interactive visualizers.',
        sr: 'Istražite JavaScript mehaniku motora, konverziju tipova, event loop mikrozadatke i prototipsko nasleđivanje uz interaktivne vizuelizatore.'
      },
      'coercion': {
        en: 'Interactive JavaScript Type Coercion laboratory. Test ToPrimitive, binary plus (+), loose equality (==), and truthy/falsy evaluation step-by-step.',
        sr: 'Interaktivna laboratorija za prinudnu konverziju tipova u JavaScript-u. Testirajte ToPrimitive, operator +, labavu jednakost i truthy/falsy pravila.'
      },
      'event-loop': {
        en: 'Interactive JavaScript Event Loop & Microtask visualizer. Step through Call Stack, Web APIs, Microtask Queue (Promises), and Macrotasks (setTimeout).',
        sr: 'Interaktivni vizuelizator Event Loop-a i mikrozadataka. Pratite Call Stack, Web API, red mikrozadataka (Promises) i makrozadatke (setTimeout).'
      },
      'playground': {
        en: 'Real-time JavaScript code playground with AST evaluator, console stream, and engine memory inspections.',
        sr: 'JavaScript radno okruženje u realnom vremenu sa AST evaluatorom, konzolom i inspekcijom memorije.'
      },
      'leetcode': {
        en: '21+ Essential JavaScript coding interview challenges with test runners, solutions, and algorithmic explanations (Debounce, LRU Cache, Two Sum).',
        sr: '21+ ključnih JavaScript zadataka za tehničke intervjue sa testovima, rešenjima i algoritmima (Debounce, LRU Cache, Two Sum).'
      },
      'quiz': {
        en: 'Diagnostic WTF JavaScript quiz testing weird type coercions, array sorting mysteries, and ECMAScript spec edge cases.',
        sr: 'Kviz JavaScript zagonetki koji testira neobične konverzije tipova, misterije sortiranja niza i specifičnosti ECMA specifikacije.'
      },
      'matrix': {
        en: 'Cross-language quirks comparison matrix between JavaScript, Python, Java, Rust, and Go for syntax and runtime behaviors.',
        sr: 'Matrica poređenja specifičnosti između JavaScript-a, Python-a, Java-e, Rust-a i Go-a za sintaksu i runtime ponašanja.'
      }
    };
    const descObj = descriptions[activeView] || descriptions.topics;
    metaDesc.setAttribute('content', locale === 'sr' ? descObj.sr : descObj.en);
  }

  // 5. Dynamic JSON-LD Structured Data
  let schemaScript = document.getElementById('json-ld-structured-data') as HTMLScriptElement | null;
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'json-ld-structured-data';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }

  // Auto-aggregate all Topics into an ItemList (using locale awareness)
  const topicsItemList = {
    '@type': 'ItemList',
    '@id': `${origin}/#topics-list`,
    'name': locale === 'sr' ? 'JavaScript Teme i Mehanika Motora' : 'JavaScript Engine Topics & Quirks',
    'description': 'Comprehensive catalog of ECMAScript specifications, type conversion algorithms, and runtime mechanics.',
    'numberOfItems': JS_TOPICS.length,
    'itemListElement': JS_TOPICS.map((topic, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'TechArticle',
        'name': locale === 'sr' ? topic.title : (topic.titleEn || topic.title),
        'description': locale === 'sr' ? topic.summary : (topic.summaryEn || topic.summary),
        'url': `${origin}/#topic-${topic.id}`,
        'about': topic.tags.map((tag) => ({ '@type': 'Thing', 'name': tag }))
      }
    }))
  };

  // Auto-aggregate all LeetCode Problems into a Course/Quiz ItemList
  const leetCodeItemList = {
    '@type': 'ItemList',
    '@id': `${origin}/#leetcode-challenges`,
    'name': locale === 'sr' ? 'JavaScript Zadaci za Programerske Intervjue' : 'JavaScript Engine Coding Challenges',
    'description': 'Algorithmic and practical JavaScript implementation challenges (Debounce, LRU Cache, Event Emitter, Two Sum).',
    'numberOfItems': LEETCODE_PROBLEMS.length,
    'itemListElement': LEETCODE_PROBLEMS.map((prob, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'LearningResource',
        'name': locale === 'sr' ? prob.title : prob.titleEn,
        'description': locale === 'sr' ? prob.description : (prob.descriptionEn || prob.description),
        'learningResourceType': 'Coding Challenge',
        'url': `${origin}/#view=leetcode`
      }
    }))
  };

  // Auto-aggregate all Quiz Questions into the FAQPage schema
  const dynamicFAQEntities = QUIZ_QUESTIONS.map((q) => ({
    '@type': 'Question',
    'name': locale === 'sr' ? q.title : q.titleEn,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': `${locale === 'sr' ? q.explanation : q.explanationEn} (${locale === 'sr' ? q.ecmaRule : q.ecmaRuleEn})`
    }
  }));

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${origin}/#webapp`,
        'name': locale === 'sr' ? 'JavaScript Mehanika Motora i Specifičnosti' : 'JavaScript Quirks & Engine Mechanics',
        'url': `${origin}/`,
        'applicationCategory': 'EducationalApplication',
        'operatingSystem': 'All',
        'description': locale === 'sr' 
          ? 'Interaktivni vodič kroz JavaScript mehaniku motora, konverziju tipova, event loop i izazove.'
          : 'Interactive educational workbench exploring ECMAScript runtime mechanics, AST evaluation, memory visualizers, and code challenges.',
        'inLanguage': ['en', 'sr'],
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${origin}/#breadcrumb`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${origin}/`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': activeView.charAt(0).toUpperCase() + activeView.slice(1),
            'item': currentUrl
          }
        ]
      },
      topicsItemList,
      leetCodeItemList,
      {
        '@type': 'FAQPage',
        '@id': `${origin}/#faq`,
        'mainEntity': dynamicFAQEntities
      }
    ]
  };

  schemaScript.textContent = JSON.stringify(structuredData, null, 2);
}
