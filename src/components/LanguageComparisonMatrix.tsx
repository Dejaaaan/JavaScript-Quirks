import React, { useState } from 'react';
import { Globe, ArrowRight, ShieldCheck, Zap, Layers, Cpu, HelpCircle, Check, Sparkles } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { FormattedText } from './FormattedText';
import { useI18n } from '../i18n';

interface LanguageMatrixRow {
  dimension: string;
  dimensionEn?: string;
  description: string;
  descriptionEn?: string;
  js: {
    title: string;
    titleEn?: string;
    detail: string;
    detailEn?: string;
    codeExample: string;
    gotcha: string;
    gotchaEn?: string;
  };
  other: {
    language: 'Python' | 'Java' | 'Rust' | 'Go';
    title: string;
    titleEn?: string;
    detail: string;
    detailEn?: string;
    codeExample: string;
    contrast: string;
    contrastEn?: string;
  };
}

const COMPARISON_ROWS: LanguageMatrixRow[] = [
  {
    dimension: 'Sistem Tipova i Konverzija (Coercion)',
    dimensionEn: 'Type System and Coercion',
    description: 'Kako se tipovi podataka proveravaju i konvertuju tokom izvršavanja u runtime-u',
    descriptionEn: 'How data types are checked and converted at runtime',
    js: {
      title: 'Dinamički i Slabo Tipiziran',
      titleEn: 'Dynamically & Weakly Typed',
      detail: 'Promenljive nemaju fiksiran tip. Operandi se implicitno konvertuju preko `ToPrimitive` / `ToNumber` apstraktnih operacija umesto izbacivanja greške o neslaganju tipova.',
      detailEn: 'Variables have no fixed type. Operands are implicitly converted via `ToPrimitive` / `ToNumber` abstract operations instead of throwing type mismatch errors.',
      codeExample: `"5" + 3  // "53"
"5" - 3  // 2
[] + {}  // "[object Object]"`,
      gotcha: 'Tihe greške i bagovi usled implicitne konverzije umesto ranog prekida izvršavanja (`TypeError`).',
      gotchaEn: 'Silent errors and bugs due to implicit conversion instead of early execution failure (`TypeError`).'
    },
    other: {
      language: 'Python',
      title: 'Dinamički i Strogo Tipiziran',
      titleEn: 'Dynamically & Strongly Typed',
      detail: 'Promenljive se dinamički tipiziraju, ali je implicitna konverzija između nekompatibilnih tipova strogo zabranjena.',
      detailEn: 'Variables are dynamically typed, but implicit coercion between incompatible types is strictly forbidden.',
      codeExample: `"5" + 3  # TypeError!
"5" - 3  # TypeError!
# Mora se eksplicitno konvertovati: int("5") - 3`,
      contrast: 'Python odmah prekida rad kod neslaganja tipova, sprečavajući skrivene bagove konverzije bacanjem `TypeError` greške.',
      contrastEn: 'Python immediately aborts on type mismatches, preventing silent conversion bugs by throwing `TypeError`.'
    }
  },
  {
    dimension: 'Model Konkurentnosti i Asinhronosti',
    dimensionEn: 'Concurrency and Async Model',
    description: 'Kako se obrađuju dugotrajni zadaci, tajmeri i asinhroni I/O zahtevi',
    descriptionEn: 'How long-running tasks, timers, and asynchronous I/O requests are handled',
    js: {
      title: 'Jednonitni Neblokirajući Event Loop',
      titleEn: 'Single-Threaded Non-Blocking Event Loop',
      detail: 'Izvršava se na jednom `Call Stack`-u. Asinhroni poslovi se raspoređuju u `Microtask` red (`Promise`-i, `queueMicrotask`) i `Macrotask` red (`setTimeout`, I/O) bez zaključavanja sistemskih niti OS-a.',
      detailEn: 'Runs on a single `Call Stack`. Asynchronous tasks are queued into `Microtask` (`Promise`, `queueMicrotask`) and `Macrotask` (`setTimeout`, I/O) queues without locking OS threads.',
      codeExample: `setTimeout(() => console.log("Završeno"), 100);
// Glavna nit nikada ne blokira!`,
      gotcha: 'Dugačke sinhrone CPU petlje (npr. intenzivna obrada podataka) blokiraju jedinu nit i zamrzavaju čitav browser tab ili server.',
      gotchaEn: 'Heavy synchronous CPU loops block the single thread and freeze the entire browser tab or server process.'
    },
    other: {
      language: 'Go',
      title: 'M:N Višenitne Goroutines',
      titleEn: 'M:N Multithreaded Goroutines',
      detail: 'Hiljade laganih zelenih niti (`goroutines`) raspoređuju se preko hardverskih jezgara procesora uz komunikaciju preko kanala (`channels`).',
      detailEn: 'Thousands of lightweight green threads (`goroutines`) are multiplexed onto OS threads across CPU cores with channel-based communication.',
      codeExample: `go func() {
    time.Sleep(100 * time.Millisecond)
    fmt.Println("Završeno")
}()`,
      contrast: 'Go koristi pravi hardverski višenitni paralelizam na višejezgarnim procesorima potpuno automatski uz `go` ključnu reč.',
      contrastEn: 'Go utilizes true hardware multithreaded parallelism across multicore CPUs automatically via the `go` keyword.'
    }
  },
  {
    dimension: 'Objektni Model i Nasleđivanje',
    dimensionEn: 'Object Model & Inheritance',
    description: 'Kako se implementiraju ponovna upotrebljivost koda i polimorfizam',
    descriptionEn: 'How code reuse and polymorphism are implemented',
    js: {
      title: 'Prototipska Delegacija i Dinamički Objekti',
      titleEn: 'Prototypal Delegation & Dynamic Objects',
      detail: 'Objekti nasleđuju direktno iz drugih živih objekata preko `[[Prototype]]` (`__proto__`) reference. ES6 `class` sintaksa je samo leksički sloj (syntactic sugar) preko prototipskog lanca.',
      detailEn: 'Objects inherit directly from other live objects via `[[Prototype]]` (`__proto__`) reference. ES6 `class` syntax is syntactic sugar over the prototype chain.',
      codeExample: `const child = Object.create(parent);
child.customProp = 42; // Dinamička mutacija`,
      gotcha: 'Rizik od `Prototype Pollution` sigurnosnih ranjivosti i deoptimizacije JIT kompajlera pri promeni oblika objekta (hidden classes).',
      gotchaEn: 'Risk of `Prototype Pollution` security vulnerabilities and JIT compiler deoptimization on object shape mutations (hidden classes).'
    },
    other: {
      language: 'Java',
      title: 'Klasični Statički Šabloni Klasa',
      titleEn: 'Classical Static Class Blueprints',
      detail: 'Fiksirane kompajlirane klase sa eksplicitnim modifikatorima pristupa (`private`, `protected`, `public`) i `vtable` razrešavanjem metoda.',
      detailEn: 'Fixed compiled classes with explicit access modifiers (`private`, `protected`, `public`) and `vtable` method dispatch.',
      codeExample: `class Dog extends Animal {
    private String breed;
    // Struktura je zaključana u fazi kompajliranja
}`,
      contrast: 'Java garantuje stroge ugovore kroz interfejse i sigurnost fiksnog rasporeda memorije objekata u Heap-u.',
      contrastEn: 'Java guarantees strict contracts through interfaces and fixed memory layouts for objects in the Heap.'
    }
  },
  {
    dimension: 'Upravljanje Memorijom i Imutabilnost',
    dimensionEn: 'Memory Management & Immutability',
    description: 'Kako se oslobađa memorija i kako se kontroliše mutabilnost promenljivih',
    descriptionEn: 'How memory is reclaimed and variable mutability is controlled',
    js: {
      title: 'Garbage Collection i Const Zaštita Pokazivača',
      titleEn: 'Garbage Collection & Pointer Binding Protection',
      detail: 'Automatski Mark-and-Sweep sakupljač smeća (GC). Ključna reč `const` zaključava samo vezivanje promenljive na referencu, a ne i unutrašnja svojstva objekta ili nizova.',
      detailEn: 'Automatic Mark-and-Sweep garbage collector (GC). The `const` keyword only prevents reassigning the variable identifier, not mutating object/array contents.',
      codeExample: `const user = { name: "Alex" };
user.name = "Sam"; // Objekat se slobodno menja!`,
      gotcha: 'Slučajne mutacije usled deljenja referenci; zahteva `structuredClone()` ili `Object.freeze()` za sprečavanje promena.',
      gotchaEn: 'Accidental mutations from shared references; requires `structuredClone()` or `Object.freeze()` to prevent changes.'
    },
    other: {
      language: 'Rust',
      title: 'Compile-Time Vlasništvo (Ownership) i Borrow Checker',
      titleEn: 'Compile-Time Ownership & Borrow Checker',
      detail: 'Nema `Garbage Collector`-a u runtime-u. Promenljive su duboko nepromenljive po default-u (`immutable`) uz strogi model jednog vlasnika memorije.',
      detailEn: 'No runtime `Garbage Collector`. Variables are immutable by default with a strict single-owner memory model.',
      codeExample: `let user = User { name: String::from("Alex") };
// user.name = ... // Compile Error!
// Mora se eksplicitno navesti: let mut user = ...`,
      contrast: 'Rust eliminiše trke za resursima (`data races`), `null` pokazivače i GC pauze već tokom faze kompajliranja.',
      contrastEn: 'Rust eliminates data races, null pointers, and GC pause times entirely at compile-time.'
    }
  },
  {
    dimension: 'Dualizam Null i Undefined Vrednosti',
    dimensionEn: 'Null and Undefined Dualism',
    description: 'Kako je u jeziku modelovano nepostojanje vrednosti ili podatka',
    descriptionEn: 'How absence of value or data is modeled in the language',
    js: {
      title: 'Dvostruke Vrednosti: `undefined` i `null`',
      titleEn: 'Dual Absence Values: `undefined` & `null`',
      detail: '`undefined` označava neinicijalizovanu ili nedostajuću promenljivu; `null` označava namerno postavljeno prazno stanje. U labavoj jednakosti `null == undefined` je `true`, ali striktno `null === undefined` je `false`.',
      detailEn: '`undefined` represents an uninitialized or missing binding; `null` denotes an intentionally absent object value. Loose `null == undefined` is `true`, but strict `null === undefined` is `false`.',
      codeExample: `let a; // undefined
let b = null; // null
typeof null // "object" (istorijski bug iz 1995. godine)`,
      gotcha: 'Pravilna provera postojanja zahteva nullish coalescing operator (`??`) i optional chaining (`?.`).',
      gotchaEn: 'Robust null checks require nullish coalescing (`??`) and optional chaining (`?.`).'
    },
    other: {
      language: 'Rust',
      title: 'Tipski Bezbedan Option<T> Monad',
      titleEn: 'Type-Safe Option<T> Monad',
      detail: 'U sigurnom Rust-u ne postoji `null` niti `undefined`. Odsustvo vrednosti je strogo tipizirano kroz enum `Option::Some(T)` ili `Option::None`.',
      detailEn: 'Safe Rust has neither `null` nor `undefined`. The absence of a value is strictly typed via the `Option::Some(T)` or `Option::None` enum.',
      codeExample: `fn find_user() -> Option<User> {
    // Mora se eksplicitno obraditi Some(u) ili None!
}`,
      contrast: 'U potpunosti eliminiše "grešku od milijardu dolara" (`NullPointerExceptions`) kroz proveru tipova.',
      contrastEn: 'Completely eliminates the "billion-dollar mistake" (`NullPointerException`) via static type checking.'
    }
  }
];

export const LanguageComparisonMatrix: React.FC = () => {
  const { locale, m } = useI18n();
  const [selectedLang, setSelectedLang] = useState<'All' | 'Python' | 'Java' | 'Rust' | 'Go'>('All');

  const filteredRows = selectedLang === 'All'
    ? COMPARISON_ROWS
    : COMPARISON_ROWS.filter((r) => r.other.language === selectedLang);

  const langLabels: Record<string, string> = {
    'All': locale === 'sr' ? 'Svi jezici' : 'All languages',
    'Python': 'Python',
    'Java': 'Java',
    'Rust': 'Rust',
    'Go': 'Go'
  };

  return (
    <div id="language-comparison-matrix" className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5DF] dark:border-[#27272A] pb-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6 text-[#4338CA] dark:text-[#818CF8]" />
            <span>{m.matrix_title()}</span>
          </h2>
          <p className="text-xs text-[#73736C] dark:text-[#A1A1AA] font-serif italic mt-0.5">
            {m.matrix_subtitle()}
          </p>
        </div>

        {/* Filter Language */}
        <div className="flex items-center gap-1.5 bg-[#FFFFFF] dark:bg-[#18181B] p-1 rounded-xl border border-[#E5E5DF] dark:border-[#27272A] shadow-sm">
          {(['All', 'Python', 'Java', 'Rust', 'Go'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedLang === lang
                  ? 'bg-[#1A1A1A] dark:bg-[#F59E0B] text-[#F9F9F7] dark:text-[#18181B] shadow-sm'
                  : 'text-[#575750] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-[#F4F4F5] hover:bg-[#EBEBE5] dark:hover:bg-[#27272A]'
              }`}
            >
              {langLabels[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className="space-y-6">
        {filteredRows.map((row, idx) => {
          const dimensionTitle = locale === 'en' && row.dimensionEn ? row.dimensionEn : row.dimension;
          const dimensionDesc = locale === 'en' && row.descriptionEn ? row.descriptionEn : row.description;
          const jsTitle = locale === 'en' && row.js.titleEn ? row.js.titleEn : row.js.title;
          const jsDetail = locale === 'en' && row.js.detailEn ? row.js.detailEn : row.js.detail;
          const jsGotcha = locale === 'en' && row.js.gotchaEn ? row.js.gotchaEn : row.js.gotcha;
          const otherTitle = locale === 'en' && row.other.titleEn ? row.other.titleEn : row.other.title;
          const otherDetail = locale === 'en' && row.other.detailEn ? row.other.detailEn : row.other.detail;
          const otherContrast = locale === 'en' && row.other.contrastEn ? row.other.contrastEn : row.other.contrast;

          return (
            <div
              key={idx}
              className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl border border-[#E5E5DF] dark:border-[#27272A] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4"
            >
              <div className="border-b border-[#E5E5DF] dark:border-[#27272A] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#4338CA] dark:text-[#A5B4FC]">
                    {locale === 'sr' ? `Dimenzija ${idx + 1}` : `Dimension ${idx + 1}`}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] mt-0.5">{dimensionTitle}</h3>
                </div>
                <span className="text-xs text-[#73736C] dark:text-[#A1A1AA] font-mono">{dimensionDesc}</span>
              </div>

              {/* Two Column Comparative Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* JS Side */}
                <div className="bg-[#FAF9F5] dark:bg-[#202023] rounded-xl p-5 border border-[#E5E5DF] dark:border-[#27272A] space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-[#B45309]/10 dark:bg-[#F59E0B]/15 text-[#B45309] dark:text-[#FCD34D] font-bold text-xs font-mono border border-[#B45309]/20 dark:border-[#F59E0B]/30">
                        JavaScript (ES2024+)
                      </span>
                      <span className="text-xs font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                        <FormattedText text={jsTitle} />
                      </span>
                    </div>
                    <FormattedText
                      text={jsDetail}
                      as="p"
                      className="text-xs text-[#40403C] dark:text-[#D4D4D8] leading-relaxed mt-2.5"
                    />
                    <div className="mt-3">
                      <CodeBlock
                        code={row.js.codeExample}
                        language="javascript"
                        showCopyButton={true}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-[#991B1B] dark:text-[#FCA5A5] bg-[#FFF5F5] dark:bg-[#7F1D1D]/30 p-3 rounded-lg border border-[#FECACA] dark:border-[#991B1B]/50 leading-relaxed mt-2">
                    <strong className="font-serif">{locale === 'sr' ? 'Specifičnost JS Runtime-a: ' : 'JS Runtime Quirk: '}</strong>
                    <FormattedText text={jsGotcha} />
                  </div>
                </div>

                {/* Other Language Side */}
                <div className="bg-[#FAF9F5] dark:bg-[#202023] rounded-xl p-5 border border-[#E5E5DF] dark:border-[#27272A] space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-[#4338CA]/10 dark:bg-[#6366F1]/20 text-[#4338CA] dark:text-[#A5B4FC] font-bold text-xs font-mono border border-[#4338CA]/20 dark:border-[#6366F1]/30">
                        {row.other.language}
                      </span>
                      <span className="text-xs font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                        <FormattedText text={otherTitle} />
                      </span>
                    </div>
                    <FormattedText
                      text={otherDetail}
                      as="p"
                      className="text-xs text-[#40403C] dark:text-[#D4D4D8] leading-relaxed mt-2.5"
                    />
                    <div className="mt-3">
                      <CodeBlock
                        code={row.other.codeExample}
                        language={row.other.language.toLowerCase()}
                        showCopyButton={true}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-[#166534] dark:text-[#86EFAC] bg-[#F0FDF4] dark:bg-[#064E3B]/30 p-3 rounded-lg border border-[#BBF7D0] dark:border-[#059669]/40 leading-relaxed mt-2">
                    <strong className="font-serif">{locale === 'sr' ? 'Kontrast u drugom jeziku: ' : 'Other Language Contrast: '}</strong>
                    <FormattedText text={otherContrast} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
