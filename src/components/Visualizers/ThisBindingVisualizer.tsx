import React, { useState } from 'react';
import { Target, ArrowRight, User, Terminal, Code2, Sparkles, AlertCircle } from 'lucide-react';
import { CodeBlock } from '../CodeBlock';
import { FormattedText } from '../FormattedText';
import { useI18n } from '../../i18n';

interface BindingRule {
  id: string;
  name: string;
  nameEn: string;
  category: 'Podrazumevano' | 'Implicitno' | 'Eksplicitno' | 'new' | 'Leksičko (Arrow)';
  categoryEn: 'Default' | 'Implicit' | 'Explicit' | 'new' | 'Lexical (Arrow)';
  snippet: string;
  thisTarget: string;
  thisTargetEn: string;
  description: string;
  descriptionEn: string;
  callSite: string;
  isStrictDifference: boolean;
}

const THIS_RULES: BindingRule[] = [
  {
    id: 'rule-implicit',
    name: 'Pravilo 1: Implicitno vezivanje',
    nameEn: 'Rule 1: Implicit Binding',
    category: 'Implicitno',
    categoryEn: 'Implicit',
    snippet: `const user = {
  name: "Ada Lovelace",
  greet() {
    return "Pozdrav, ja sam " + this.name;
  }
};

// Poziv sa objektnim kontekstom:
user.greet(); // 'this' pokazuje na objekat user`,
    thisTarget: 'user { name: "Ada Lovelace" }',
    thisTargetEn: 'user { name: "Ada Lovelace" }',
    description: 'Kada se funkcija pozove sa tačkom ispred (`obj.method()`), `this` se implicitno vezuje za objekat koji se nalazi neposredno ispred tačke u trenutku poziva.',
    descriptionEn: 'When a method is called with dot notation (`obj.method()`), `this` is implicitly bound to the object preceding the dot at the moment of the call.',
    callSite: 'user.greet()',
    isStrictDifference: false
  },
  {
    id: 'rule-lost-context',
    name: 'Zamka: Gubitak konteksta (Izdvojena metoda)',
    nameEn: 'Trap: Context Loss (Detached Method)',
    category: 'Podrazumevano',
    categoryEn: 'Default',
    snippet: `const user = {
  name: "Ada Lovelace",
  greet() { return this.name; }
};

// Čuvanje reference u samostalnoj promenljivoj:
const detached = user.greet;
detached(); // 'this' se gubi i pada na global/undefined!`,
    thisTarget: 'undefined (u strict modu) ili window/global (u sloppy modu)',
    thisTargetEn: 'undefined (in strict mode) or window/global (in sloppy mode)',
    description: 'Dodeljivanje metode novoj promenljivoj ili njeno prosleđivanje kao callback (npr. u `setTimeout`) odbacuje originalni objekat. Mesto poziva (call-site) postaje običan samostalan poziv funkcije `detached()`.',
    descriptionEn: 'Assigning a method to a variable or passing it as a callback (e.g. in `setTimeout`) discards the original object base. The call-site becomes a plain standalone invocation `detached()`.',
    callSite: 'detached()',
    isStrictDifference: true
  },
  {
    id: 'rule-explicit',
    name: 'Pravilo 2: Eksplicitno vezivanje (.call / .apply / .bind)',
    nameEn: 'Rule 2: Explicit Binding (.call / .apply / .bind)',
    category: 'Eksplicitno',
    categoryEn: 'Explicit',
    snippet: `function introduce(role, city) {
  return this.name + " (" + role + " u " + city + ")";
}

const person = { name: "Alan Turing" };

// Eksplicitno nametanje 'this' konteksta:
introduce.call(person, "Pionir", "Bletchley");
// Ili .apply(person, ["Pionir", "Bletchley"])
// Ili const bound = introduce.bind(person);`,
    thisTarget: 'person { name: "Alan Turing" }',
    thisTargetEn: 'person { name: "Alan Turing" }',
    description: 'Metode `.call()` i `.apply()` odmah izvršavaju funkciju uz eksplicitno postavljen `this` cilj. Metoda `.bind()` vraća novu funkciju trajno vezanu za navedeni objekat.',
    descriptionEn: '`.call()` and `.apply()` invoke the function immediately with an explicit `this` target. `.bind()` returns a new function permanently bound to the specified object.',
    callSite: 'introduce.call(person, ...)',
    isStrictDifference: false
  },
  {
    id: 'rule-new',
    name: 'Pravilo 3: new vezivanje (Konstruktor)',
    nameEn: 'Rule 3: new Binding (Constructor)',
    category: 'new',
    categoryEn: 'new',
    snippet: `function Developer(name, lang) {
  // 1. Kreira se potpuno nov objekat {}
  // 2. this se vezuje za taj novi {}
  this.name = name;
  this.lang = lang;
  // 3. Novokreirani objekat se automatski vraća
}

const dev = new Developer("Grace", "COBOL");`,
    thisTarget: 'Sveže alocirana instanca { name: "Grace", lang: "COBOL" }',
    thisTargetEn: 'Newly allocated instance { name: "Grace", lang: "COBOL" }',
    description: 'Ključna reč `new` stvara nov prazan objekat u memoriji, vezuje `this` za njega, povezuje njegov prototip i vraća kreiranu instancu.',
    descriptionEn: 'The `new` operator creates a new empty object in memory, binds `this` to it, links its prototype, and returns the constructed instance.',
    callSite: 'new Developer("Grace", "COBOL")',
    isStrictDifference: false
  },
  {
    id: 'rule-arrow',
    name: 'Pravilo 4: Leksičke Arrow funkcije (Nema this)',
    nameEn: 'Rule 4: Lexical Arrow Functions (No this)',
    category: 'Leksičko (Arrow)',
    categoryEn: 'Lexical (Arrow)',
    snippet: `const dashboard = {
  title: "Analitika",
  init() {
    // Arrow funkcija preuzima 'this' iz init() leksičkog opsega:
    setTimeout(() => {
      console.log("Učitavanje: " + this.title);
    }, 100);
  }
};

dashboard.init();`,
    thisTarget: 'dashboard { title: "Analitika" } (Nasleđeno iz init opsega)',
    thisTargetEn: 'dashboard { title: "Analytics" } (Inherited from init scope)',
    description: 'Arrow funkcije NEMAJU sopstveni `this`. One vrednost `this` razrešavaju leksički iz okružujućeg opsega u trenutku definisanja. Ne mogu se predefinisati sa `.call()` / `.bind()` / `.apply()` niti pozvati sa `new`.',
    descriptionEn: 'Arrow functions do NOT possess their own `this`. They resolve `this` lexically from their enclosing lexical scope at definition time. They cannot be reassigned via `.call()` / `.bind()` / `.apply()`, nor invoked with `new`.',
    callSite: '() => { ... }',
    isStrictDifference: false
  }
];

export const ThisBindingVisualizer: React.FC = () => {
  const { locale } = useI18n();
  const [selectedRule, setSelectedRule] = useState<BindingRule>(THIS_RULES[0]);

  const displayName = locale === 'en' ? selectedRule.nameEn : selectedRule.name;
  const displayCategory = locale === 'en' ? selectedRule.categoryEn : selectedRule.category;
  const displayThisTarget = locale === 'en' ? selectedRule.thisTargetEn : selectedRule.thisTarget;
  const displayDescription = locale === 'en' ? selectedRule.descriptionEn : selectedRule.description;

  return (
    <div id="this-binding-visualizer" className="bg-[#FFFFFF] dark:bg-[#18181B] text-[#1A1A1A] dark:text-[#F4F4F5] rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-6">
      <div className="flex items-center justify-between border-b border-[#E5E5DF] dark:border-[#27272A] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#0D9488]/10 dark:bg-[#14B8A6]/20 text-[#0F766E] dark:text-[#2DD4BF] font-mono text-[11px] font-bold border border-[#0D9488]/20 dark:border-[#14B8A6]/30">
              <Target className="w-3.5 h-3.5 inline-block mr-1" />
              {locale === 'en' ? 'ExecutionContext Inspector' : 'ExecutionContext Inspektor'}
            </span>
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight">
              {locale === 'en' ? '4 Rules of "this" Keyword Binding' : '4 Pravila vezivanja ključne reči "this"'}
            </h3>
          </div>
          <p className="text-xs text-[#73736C] dark:text-[#A1A1AA] font-serif italic mt-1">
            {locale === 'en' ? (
              <>Understand how the invocation site (call-site) dynamically determines JavaScript execution context.</>
            ) : (
              <>Naučite kako mesto poziva funkcije (call-site) dinamički određuje JavaScript kontekst izvršavanja.</>
            )}
          </p>
        </div>
      </div>

      {/* Rule Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {THIS_RULES.map((rule) => {
          const ruleCat = locale === 'en' ? rule.categoryEn : rule.category;
          const ruleTitle = locale === 'en' ? rule.nameEn : rule.name;
          const isSelected = selectedRule.id === rule.id;

          return (
            <button
              key={rule.id}
              onClick={() => setSelectedRule(rule)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] border-[#1A1A1A] dark:border-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] shadow-sm'
                  : 'bg-[#FAF9F5] dark:bg-[#202023] border-[#E5E5DF] dark:border-[#27272A] text-[#575750] dark:text-[#A1A1AA] hover:border-[#1A1A1A] dark:hover:border-[#52525B] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A]'
              }`}
            >
              <span className={`text-[10px] uppercase font-bold tracking-wider block font-mono mb-1 ${
                isSelected ? 'text-[#5EEAD4] dark:text-[#0F766E]' : 'text-[#0F766E] dark:text-[#2DD4BF]'
              }`}>
                {ruleCat}
              </span>
              <span className="text-xs font-semibold block leading-tight">{ruleTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Main Diagram Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 bg-[#FAF9F5] dark:bg-[#202023] rounded-xl p-5 border border-[#E5E5DF] dark:border-[#27272A] items-start">
        {/* Left: Code Snippet (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#73736C] dark:text-[#A1A1AA] border-b border-[#E5E5DF] dark:border-[#27272A] pb-2">
            <span className="font-semibold text-[#1A1A1A] dark:text-[#F4F4F5] flex items-center gap-1.5 font-serif">
              <Code2 className="w-4 h-4 text-[#0F766E] dark:text-[#2DD4BF]" />
              {locale === 'en' ? 'Execution Scenario' : 'Scenario Izvršavanja'}
            </span>
            <span className="font-mono text-[#0F766E] dark:text-[#2DD4BF] bg-[#FFFFFF] dark:bg-[#18181B] px-2 py-0.5 rounded border border-[#E5E5DF] dark:border-[#27272A] text-[11px] font-bold">
              Call-site: {selectedRule.callSite}
            </span>
          </div>
          <CodeBlock
            code={selectedRule.snippet}
            language="javascript"
            showCopyButton={true}
          />
          <div className="p-3.5 bg-[#FFFFFF] dark:bg-[#18181B] rounded-lg border border-[#E5E5DF] dark:border-[#27272A] text-xs text-[#262624] dark:text-[#D4D4D8] leading-relaxed shadow-sm">
            <span className="font-serif font-bold text-[#0F766E] dark:text-[#2DD4BF] block mb-1">
              {locale === 'en' ? 'Mechanics:' : 'Mehanika:'}
            </span>
            <FormattedText text={displayDescription} as="p" className="text-xs text-[#575750] dark:text-[#A1A1AA] leading-relaxed" />
          </div>
        </div>

        {/* Right: Visual Memory Pointer Diagram (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-start space-y-4">
          <div className="text-xs text-[#73736C] dark:text-[#A1A1AA] border-b border-[#E5E5DF] dark:border-[#27272A] pb-2">
            <span className="font-semibold text-[#1A1A1A] dark:text-[#F4F4F5] font-serif">
              {locale === 'en' ? 'Heap Memory & Execution Context Pointer' : 'Heap Memorija i Pokazivač Konteksta Izvršavanja'}
            </span>
          </div>

          {/* Context Arrow Box */}
          <div className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-xl p-5 border border-[#E5E5DF] dark:border-[#27272A] space-y-4 flex flex-col items-center justify-center text-center shadow-sm">
            {/* Function Frame */}
            <div className="w-full max-w-sm p-3 bg-[#FAF9F5] dark:bg-[#202023] border border-[#0D9488]/40 dark:border-[#14B8A6]/40 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-[#73736C] dark:text-[#A1A1AA] block font-mono">
                {locale === 'en' ? 'Active Call Stack Frame' : 'Aktivni Okvir na Stack-u'}
              </span>
              <span className="text-xs font-mono font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                {locale === 'en' ? 'Function Execution Context' : 'Kontekst Izvršavanja Funkcije'}
              </span>
              <div className="mt-2 text-xs font-mono bg-[#CCFBF1] dark:bg-[#134E4A] border border-[#99F6E4] dark:border-[#2DD4BF]/40 text-[#0F766E] dark:text-[#5EEAD4] py-1 px-2 rounded font-bold">
                <span className="text-[#B45309] dark:text-[#FBBF24]">this</span> =&gt; {locale === 'en' ? '[Heap Reference Pointer]' : '[Pokazivač reference u Heap-u]'}
              </div>
            </div>

            {/* Dynamic Arrow */}
            <div className="flex flex-col items-center text-[#0F766E] dark:text-[#2DD4BF]">
              <span className="text-[11px] font-mono text-[#73736C] dark:text-[#A1A1AA] mb-1">
                {locale === 'en' ? 'dynamically resolves at call-time to' : 'dinamički se razrešava u trenutku poziva u'}
              </span>
              <ArrowRight className="w-5 h-5 rotate-90" />
            </div>

            {/* Bound Object Target */}
            <div className="w-full max-w-sm p-3.5 bg-[#F0FDFA] dark:bg-[#042F2E] border-2 border-[#0D9488] dark:border-[#2DD4BF] rounded-lg shadow-sm">
              <span className="text-[10px] uppercase font-bold text-[#0F766E] dark:text-[#2DD4BF] block font-mono">
                {locale === 'en' ? 'Resolved Context in Memory' : 'Razrešeni Kontekst u Memoriji'}
              </span>
              <span className="text-xs font-mono font-bold text-[#134E4A] dark:text-[#CCFBF1] block mt-1 break-words">
                {displayThisTarget}
              </span>
            </div>
          </div>

          {/* Strict mode note */}
          {selectedRule.isStrictDifference && (
            <div className="flex items-start gap-2 p-3 bg-[#FFFBEB] dark:bg-[#78350F]/30 border border-[#FDE68A] dark:border-[#B45309]/50 rounded-lg text-xs text-[#92400E] dark:text-[#FDE68A]">
              <AlertCircle className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <span>
                <strong className="font-serif">{locale === 'en' ? 'Impact of "use strict" directive:' : 'Uticaj "use strict" direktive:'}</strong>{' '}
                {locale === 'en' ? (
                  <>In strict mode, standalone calls default to <code className="text-[#1A1A1A] dark:text-[#F4F4F5] font-mono bg-[#FFFFFF] dark:bg-[#18181B] px-1 rounded border border-[#FDE68A] dark:border-[#B45309]">undefined</code> instead of leaking into <code className="text-[#1A1A1A] dark:text-[#F4F4F5] font-mono bg-[#FFFFFF] dark:bg-[#18181B] px-1 rounded border border-[#FDE68A] dark:border-[#B45309]">globalThis / window</code> object.</>
                ) : (
                  <>U striktnom modu, samostalni pozivi podrazumevano dobijaju <code className="text-[#1A1A1A] dark:text-[#F4F4F5] font-mono bg-[#FFFFFF] dark:bg-[#18181B] px-1 rounded border border-[#FDE68A] dark:border-[#B45309]">undefined</code> umesto curenja u globalni <code className="text-[#1A1A1A] dark:text-[#F4F4F5] font-mono bg-[#FFFFFF] dark:bg-[#18181B] px-1 rounded border border-[#FDE68A] dark:border-[#B45309]">globalThis / window</code> objekat.</>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
