import { ChapterGuide } from '../types';

export const CHAPTER_GUIDES: Record<string, ChapterGuide> = {
  'type-coercion-equality': {
    overview: 'Implicitna konverzija tipova (Type Coercion) je mehanizam u JavaScriptu gde runtime automatski transformiše vrednost jednog tipa u drugi kada operator ili izraz zahteva kompatibilne tipove. Za razliku od strogo tipiziranih jezika koji bi u takvim situacijama odmah bacili grešku (TypeError), JavaScript pokušava da "spase" izvršavanje i pretvori podatke na osnovu niza ugrađenih apstraktnih algoritama.',
    overviewEn: 'Implicit Type Coercion is JavaScript\'s automatic mechanism for converting a value from one data type to another when an operator or expression expects compatible types. Unlike strictly typed languages that immediately throw a runtime TypeError, JavaScript attempts to keep running by coercing operands using built-in abstract algorithms.',
    analogy: 'Zamislite univerzalni električni adapter koji bez pitanja pokušava da ugura bilo koji utikač u utičnicu: nekada radi savršeno, ali nekada propusti pogrešan napon i izazove kratak spoj ako niste znali šta se desilo.',
    analogyEn: 'Think of an aggressive universal travel adapter that forces any plug into any socket without asking: sometimes it works effortlessly, but other times it passes the wrong voltage and causes a short circuit.',
    historyAndOrigin: {
      title: 'Zašto se tako zove i kako je nastalo?',
      titleEn: 'Origin of the Name & Historical Context',
      description: 'Brendan Eich je 1995. godine kreirao JavaScript za samo 10 dana za Netscape Navigator. Cilj je bio da jezik bude "oprostiv" prema početnicima i veb dizajnerima koji nisu bili profesionalni programeri. Ako bi pogrešili tip (npr. uneli broj kao string iz HTML input polja), stranica nije smela da se sruši ili pokaže "beli ekran smrti", već je browser pokušao da pogodi nameru programera.',
      descriptionEn: 'Brendan Eich created JavaScript in just 10 days in 1995 for Netscape Navigator. The primary goal was to create a forgiving scripting language for web designers and beginners. If someone made a type mismatch (like reading a numeric input as a string from an HTML form), the browser needed to gracefully continue rather than crashing the webpage with a blank screen.',
      whyItExists: 'Razlog zašto je ovo ponašanje ostalo i danas jeste "Web Compatibility" (princip #DontBreakTheWeb). Milioni sajtova i skripti iz 1990-ih i 2000-ih i dalje zavise od ovih pravila, pa TC39 komitet ne može promeniti ponašanje operatora == ili + bez rušenja postojećeg interneta.',
      whyItExistsEn: 'This behavior remains today due to Web Compatibility (the "#DontBreakTheWeb" invariant). Millions of websites created over the past 30 years rely on these legacy coercion rules, so TC39 cannot alter the semantics of operators like `==` or `+` without breaking the web.'
    },
    underTheHood: {
      title: 'Kako funkcioniše ispod haube (ECMAScript algoritmi)',
      titleEn: 'Under the Hood (ECMAScript Specification Algorithms)',
      summary: 'Konverzija se ne odvija nasumično već prati stroge matematičke korake definisane u ECMA-262 specifikaciji (§7.1 i §7.2).',
      summaryEn: 'Coercion is not arbitrary; it follows deterministic rules defined in the ECMA-262 specification (§7.1 and §7.2).',
      steps: [
        {
          stepNumber: 1,
          title: 'ToPrimitive(input, preferredType)',
          titleEn: 'ToPrimitive(input, preferredType)',
          description: 'Kada se objekat ili niz nađe u operaciji sa primitivom, JS poziva [Symbol.toPrimitive](hint). Ako to ne postoji, poziva .valueOf(), a ako to ne vrati primitiv, poziva .toString(). Za nizove [1, 2].toString() daje "1,2", a [].toString() daje "".',
          descriptionEn: 'When an object/array encounters a primitive operation, JS checks `[Symbol.toPrimitive](hint)`. If absent, it invokes `.valueOf()`, and if that fails to return a primitive, it calls `.toString()`. Arrays serialize via `.join(\',\')`, so `[1, 2].toString()` becomes `"1,2"` and `[].toString()` becomes `""`.',
          codeSnippet: '[1, 2].valueOf() // [1, 2] (objekat)\n[1, 2].toString() // "1,2" (primitivni string)'
        },
        {
          stepNumber: 2,
          title: 'Dvostruka uloga operatora sabiranja (+)',
          titleEn: 'Dual Nature of the Addition (+) Operator',
          description: 'Operator + proverava: ako je makar jedan operand (nakon ToPrimitive) String, cela operacija prelazi u konkatenaciju (spajanje stringova). Svi ostali operatori (-, *, /, %) forsiraju ToNumber algoritam.',
          descriptionEn: 'The `+` operator checks: if either operand after ToPrimitive is a String, string concatenation occurs. All other arithmetic operators (`-`, `*`, `/`, `%`) aggressively invoke `ToNumber`.',
          codeSnippet: '"5" + 3 // "53" (jer je levi string)\n"5" - 3 // 2 (jer minus forsira broj)'
        },
        {
          stepNumber: 3,
          title: 'Algoritam labave jednakosti (==) u 11 koraka',
          titleEn: '11-Step Abstract Equality Algorithm (==)',
          description: 'Ako poredite Number i String, String postaje Number. Ako poredite Boolean sa bilo čim, Boolean se PRVO pretvara u Number (true -> 1, false -> 0). Izraz [] == ![] je true jer ![] prvo postaje false, pa se upoređuju [] i false -> 0 == 0 -> true.',
          descriptionEn: 'Comparing Number and String coerces String to Number. Comparing Boolean with anything converts Boolean to Number first (`true -> 1`, `false -> 0`). `[] == ![]` is true because `![]` evaluates to `false`, then `[]` and `false` both coerce to `0 == 0 -> true`.',
          codeSnippet: '[] == ![] \n// 1. ![] je false\n// 2. [] == false\n// 3. ToNumber(false) -> 0, ToPrimitive([]) -> ""\n// 4. "" == 0 -> ToNumber("") -> 0 == 0 -> true'
        },
        {
          stepNumber: 4,
          title: 'Izolovani par: null i undefined',
          titleEn: 'Isolated Pair: null and undefined',
          description: 'U labavoj jednakosti (==), null i undefined su jednaki samo jedno drugom i ničemu drugom na svetu (null == undefined je true, ali null == 0 je false). Ali kod relacionih operatora (>=, <=) null se pretvara u 0!',
          descriptionEn: 'Under `==`, `null` and `undefined` only equal each other and nothing else. However, relational operators (`>=`, `<=`) convert `null` to `0` via `ToNumber`, making `null >= 0` evaluate to `true`!',
          codeSnippet: 'null == 0   // false (specijalno pravilo labave jednakosti)\nnull >= 0   // true (jer ToNumber(null) === 0)\nnull > 0    // false (0 > 0 je false)'
        }
      ]
    },
    pitfalls: [
      {
        title: 'Lažna istinitost (Falsy vrednosti u uslovima)',
        titleEn: 'Falsy Value Edge Cases in Conditionals',
        cause: 'Vrednosti kao što su 0, "", false, null, undefined i NaN su sve falsy. Ako proveravate da li korisnik ima 0 poena ili prazan unos pomoću if (points), nula će se tretirati kao da vrednost ne postoji!',
        causeEn: 'Values `0`, `""`, `false`, `null`, `undefined`, and `NaN` are all falsy. Writing `if (score)` treats `0` as nonexistent.',
        impact: 'Korisnici sa 0 poena ili praznim tekstom bivaju blokirani ili dobijaju default vrednost umesto unete.',
        impactEn: 'Users with 0 score or valid empty inputs get overwritten with fallback defaults.',
        codeSnippet: 'function setScore(score) {\n  // ❌ Bug: ako je score 0, dodeliće 100!\n  const finalScore = score || 100;\n  // ✅ Ispravno: Nullish coalescing\n  const safeScore = score ?? 100;\n}'
      },
      {
        title: 'Sigurnosni propusti kod labave provere kupona ili ID-eva',
        titleEn: 'Security Flaws with Loose Equality Checks',
        cause: 'Ako proveravate `input == false` ili `token == 0`, neočekivani stringovi poput `""` ili `"0"` ili `[]` će proći validaciju.',
        causeEn: 'Comparing `input == false` or `token == 0` allows unexpected inputs like `""`, `"0"`, or `[]` to pass validation.',
        impact: 'Bypass autorizacije ili pogrešno aktiviranje administratorskih opcija.',
        impactEn: 'Authentication bypass or accidental privilege granting.',
        codeSnippet: 'const userRole = "";\nif (userRole == 0) { /* ❌ neočekivano prolazi! */ }'
      }
    ],
    solutions: [
      {
        title: 'Uvek koristite striktnu jednakost (===)',
        titleEn: 'Always Use Strict Equality (===)',
        solution: 'Striktna jednakost nikada ne vrši konverziju. Ako tipovi nisu identični, odmah vraća false.',
        solutionEn: 'Strict equality never converts types. If types differ, it returns false immediately.',
        recommendation: 'Uključite ESLint pravilo "eqeqeq": ["error", "always"].',
        recommendationEn: 'Enable ESLint rule `"eqeqeq": ["error", "always"]`.',
        codeSnippet: '0 === false // false\n"" === 0    // false\n[1] === "1" // false'
      },
      {
        title: 'Eksplicitna konverzija tipova pre operacija',
        titleEn: 'Explicit Type Casting',
        solution: 'Koristite `Number(val)`, `String(val)`, `Boolean(val)` ili `BigInt(val)` umesto oslanjanja na operatore.',
        solutionEn: 'Use `Number(val)`, `String(val)`, `Boolean(val)`, or `BigInt(val)` explicitly.',
        recommendation: 'Izbegavajte unarni plus `+val` u timskom radu ako smanjuje čitljivost.',
        recommendationEn: 'Prefer readable `Number(val)` over unary `+val` in large codebases.',
        codeSnippet: 'const count = Number(inputString);\nconst isValid = Boolean(userObj);'
      }
    ],
    funFacts: [
      {
        title: 'Kako dobiti reč "banana" u čistom JavaScriptu?',
        titleEn: 'How to Produce "banana" in Pure JavaScript',
        codeSnippet: "('b' + 'a' + + 'a' + 'a').toLowerCase() // 'banana'",
        explanation: "+'a' pokušava da pretvori 'a' u broj, što daje NaN. Izraz postaje 'b' + 'a' + 'NaN' + 'a' -> 'baNaNa', a toLowerCase() pretvara sve u 'banana'!",
        explanationEn: "`+'a'` evaluates to `NaN`. The expression concatenates `'b' + 'a' + 'NaN' + 'a' -> 'baNaNa'`, which `.toLowerCase()` turns into `'banana'`!"
      },
      {
        title: 'JSFuck ezoterični jezik',
        titleEn: 'JSFuck: Coding with Only 6 Characters',
        codeSnippet: '(![]+[])[+!+[]] // "a"',
        explanation: 'Kombinovanjem implicitnih konverzija nizova i negacija, ceo JavaScript program (uključujući alert i eval) može se napisati koristeći samo 6 karaktera: [ ] ! + ( )',
        explanationEn: 'By leveraging coercion of empty arrays and booleans, complete JS apps can run using only 6 characters: `[ ] ! + ( )`'
      }
    ],
    mentalModel: 'Zamislite operatore kao striktne carinike: `+` voli tekst i čim vidi slovo pretvara sve u string; matematički operatori (`-`, `*`, `/`) i relacije (`<`, `>`) priznaju samo brojeve i nemilosrdno sve pretvaraju u Number.',
    mentalModelEn: 'Imagine JS operators as customs officers: `+` prioritizes text and turns everything into strings if any string appears; arithmetic (`-`, `*`, `/`) accepts only numbers and aggressively converts everything via `ToNumber`.',
    goldenRule: 'Zlatno pravilo: Nikada ne dozvolite JavaScriptu da pogađa tipove umesto vas. Koristite `===`, `??` i eksplicitni `Number()` / `String()`.',
    goldenRuleEn: 'Golden Rule: Never let JavaScript guess types for you. Always use `===`, `??`, and explicit `Number()` / `String()` wrappers.'
  },

  'event-loop-concurrency': {
    overview: 'JavaScript je jedninitni (single-threaded) jezik, što znači da ima samo jedan Call Stack i može da izvršava samo jednu liniju koda u datom trenutku. Kako onda browser uspeva da učitava podatke sa servera, pušta animacije i reaguje na klikove bez zamrzavanja celog ekrana? Odgovor je: Event Loop u kombinaciji sa Web API / libuv okruženjem.',
    overviewEn: 'JavaScript is single-threaded, meaning it has only one Call Stack and executes one operation at a time. How can browsers fetch data, run 60fps animations, and respond to user clicks without freezing? The answer is the Event Loop coordinating with Web APIs and Task Queues.',
    analogy: 'Zamislite šalter u banci sa jednim službenikom (Call Stack). Dok službenik radi sa vama, niko drugi ne može na šalter. Ako vam treba overa koja traje 30 minuta, ne stojite na šalteru – službenik vas pošalje u čekaonicu (Web API), a kad dokument bude spreman, dobijate VIP broj za brzi red (Microtask) ili standardni broj (Macrotask). Čim se šalter oslobodi, Event Loop poziva sledeću osobu.',
    analogyEn: 'Imagine a bank with a single teller (Call Stack). If a task requires waiting for a notary (Web API), you step aside to the lobby. When done, you get a VIP ticket (Microtask Queue) or standard ticket (Macrotask Queue). As soon as the teller is free, the Event Loop calls the next ticket.',
    historyAndOrigin: {
      title: 'Zašto je JavaScript jedninitan i kako je Event Loop nastao?',
      titleEn: 'Why is JavaScript Single-Threaded?',
      description: 'Tokom ranih dana veba 1995. godine, računari su uglavnom imali samo jedan procesor. Višenitno programiranje (Multi-threading) donosi složene probleme poput "Race Conditions", "Deadlocks" i sinhronizacije memorije. Da je JS bio višenitan, dve niti bi mogle istovremeno da pokušaju da obrišu i promene isti DOM element, što bi izazivalo nepredvidive padove browsera.',
      descriptionEn: 'In 1995, computers were predominantly single-core. Multi-threaded programming introduces race conditions, deadlocks, and shared memory corruption. If JS were multi-threaded, two threads might mutate or delete the same DOM element simultaneously, causing browser crashes.',
      whyItExists: 'Event Loop model omogućava maksimalnu propusnost (Non-blocking I/O) uz minimalnu potrošnju memorije, što je kasnije Ryan Dahl iskoristio za Node.js kako bi stvorio servere sposobne da opsluže desetine hiljada konekcija bez otvaranja teških OS niti.',
      whyItExistsEn: 'The non-blocking Event Loop architecture achieves massive throughput with minimal memory overhead, which later inspired Node.js to handle tens of thousands of concurrent connections efficiently without thread-per-request overhead.'
    },
    underTheHood: {
      title: 'Kako Event Loop tačno funkcioniše (Redosled prioriteta)',
      titleEn: 'Event Loop Execution Priority Order',
      summary: 'Jedan "Tick" Event Loop-a prolazi kroz strogo hijerarhijski ciklus izvršavanja.',
      summaryEn: 'Each "Tick" of the Event Loop follows a strict hierarchical cycle.',
      steps: [
        {
          stepNumber: 1,
          title: 'Call Stack (Sinhroni kod ima apsolutni prioritet)',
          titleEn: 'Call Stack (Synchronous Execution)',
          description: 'Sve funkcije koje se pozovu slažu se na Call Stack (LIFO). Dokle god na steku ima koda, Event Loop je blokiran i NIŠTA drugo se ne može izvršiti.',
          descriptionEn: 'All invoked functions push onto the Call Stack. While frames exist on the stack, the Event Loop is locked and cannot process asynchronous callbacks.',
          codeSnippet: 'function foo() { bar(); }\nfunction bar() { console.log("Done"); }'
        },
        {
          stepNumber: 2,
          title: 'Microtask Queue (VIP red – Promise, async/await, queueMicrotask)',
          titleEn: 'Microtask Queue (VIP Priority: Promises, queueMicrotask)',
          description: 'Čim se Call Stack isprazni, Event Loop ODMAH PRELAZI na Microtask red i prazni ga DO POSLEDNJEG zadatka pre nego što pogleda bilo šta drugo. Ako mikrozadatak kreira novi mikrozadatak, i on će se izvršiti u istom ciklusu!',
          descriptionEn: 'Once the stack empties, the Event Loop drains the ENTIRE Microtask Queue before doing anything else. If a microtask enqueues another microtask, it will execute in the same tick.',
          codeSnippet: 'Promise.resolve().then(() => console.log("Microtask!"));'
        },
        {
          stepNumber: 3,
          title: 'Render faza (Browser Frame & requestAnimationFrame)',
          titleEn: 'Render Phase & requestAnimationFrame',
          description: 'Nakon što se isprazne svi mikrozadaci, browser proverava da li je vreme za osvežavanje ekrana (npr. svakih 16.6ms za 60 FPS) i izvršava requestAnimationFrame i renderovanje.',
          descriptionEn: 'After draining microtasks, the browser determines if screen repainting is required (e.g. every 16.6ms for 60fps) and invokes rAF callbacks and paint pipelines.',
          codeSnippet: 'requestAnimationFrame(() => updateUI());'
        },
        {
          stepNumber: 4,
          title: 'Macrotask / Task Queue (setTimeout, setInterval, I/O)',
          titleEn: 'Macrotask Queue (setTimeout, setInterval, I/O)',
          description: 'Event Loop uzima TAČNO JEDAN zadatak iz Macrotask reda, prebacuje ga na Call Stack i izvršava ga. Nakon tog JEDNOG zadatka, ponovo se vraća na proveru Microtask reda!',
          descriptionEn: 'The Event Loop dequeues and runs EXACTLY ONE macrotask, then immediately loops back to check and drain the Microtask Queue again.',
          codeSnippet: 'setTimeout(() => console.log("Macrotask"), 0);'
        }
      ]
    },
    pitfalls: [
      {
        title: 'Izgladnjivanje Event Loop-a (Microtask Starvation)',
        titleEn: 'Event Loop Starvation by Microtasks',
        cause: 'Ako rekurzivno kreirate Promise.resolve().then(...) ili queueMicrotask, Microtask red se nikada neće isprazniti.',
        causeEn: 'Chaining recursive `Promise.resolve().then(...)` or `queueMicrotask` prevents the queue from ever emptying.',
        impact: 'Browser se kompletno zamrzava, korisnički klikovi se ne registruju i setTimeout se nikada ne izvršava.',
        impactEn: 'The browser freezes completely, user interactions stall, and timers never execute.',
        codeSnippet: 'function freeze() {\n  Promise.resolve().then(freeze); // ❌ UI se zauvek zamrzava!\n}'
      },
      {
        title: 'Teške matematičke operacije na glavnoj niti',
        titleEn: 'Blocking the Main Thread with CPU-Heavy Loops',
        cause: 'Sinhrona petlja od 10 milijardi iteracija drži Call Stack okupiranim.',
        causeEn: 'A synchronous loop with millions of iterations holds the Call Stack hostage.',
        impact: 'Dropovani frejmovi, jank animacije i "Page Unresponsive" popup prozor.',
        impactEn: 'Dropped frames, stuttering UI animations, and "Page Unresponsive" browser dialogs.',
        codeSnippet: '// ❌ Blokira sve na 3 sekunde\nfor (let i = 0; i < 1e9; i++) { /* heavy math */ }'
      }
    ],
    solutions: [
      {
        title: 'Segmentacija zadataka (Chunking / Yielding)',
        titleEn: 'Task Chunking & Yielding to Main Thread',
        solution: 'Podelite veliku obradu na manje delove koristeći `await new Promise(r => setTimeout(r, 0))` ili moderni `scheduler.yield()`.',
        solutionEn: 'Split large CPU workloads into smaller batches yielding via `await new Promise(r => setTimeout(r, 0))` or `scheduler.yield()`.',
        recommendation: 'Za teške kalkulacije koristite Web Workers (odvojenu pozadinsku nit).',
        recommendationEn: 'For heavy data processing, offload to Web Workers.',
        codeSnippet: 'async function processLargeData(items) {\n  for (let i = 0; i < items.length; i++) {\n    processItem(items[i]);\n    if (i % 1000 === 0) await new Promise(r => setTimeout(r, 0));\n  }\n}'
      }
    ],
    funFacts: [
      {
        title: 'setTimeout(fn, 0) zapravo ne čeka 0 milisekundi',
        titleEn: 'setTimeout(fn, 0) Does Not Run in 0ms',
        codeSnippet: 'setTimeout(() => {}, 0);',
        explanation: 'HTML5 specifikacija nalaže da nakon 5 ugnježdenih setTimeout poziva browser automatski primenjuje minimalno prinudno kašnjenje od 4ms!',
        explanationEn: 'The HTML5 specification mandates a minimum 4ms clamping delay after 5 nested `setTimeout` invocations.'
      }
    ],
    mentalModel: 'Call Stack je pozornica, Microtask red je VIP propusnica za sledeći izlazak na pozornicu, a setTimeout je obična karta u redu za čekanje.',
    mentalModelEn: 'The Call Stack is the active stage, Microtasks are VIP backstage passes that jump the queue, and setTimeout is a standard waiting ticket.',
    goldenRule: 'Zlatno pravilo: Nikada ne blokirajte Call Stack dugotrajnim sinhronim kodom; prepustite kontrolu browseru kroz asinhroni yielding ili Web Workere.',
    goldenRuleEn: 'Golden Rule: Never block the Call Stack with synchronous work; yield back control to the browser loop or delegate to Web Workers.'
  },

  'this-context-binding': {
    overview: 'U većini objektno-orijentisanih jezika (kao što su Java, C++ ili C#), ključna reč `this` je trajno i nepromenljivo vezana za instancu klase unutar koje je metoda napisana. U JavaScriptu, `this` se kod standardnih funkcija ponaša potpuno drugačije: njegova vrednost se određuje dinamički u TRENUTKU POZIVA funkcije (tzv. "call-site"), a ne u trenutku definisanja!',
    overviewEn: 'In traditional OOP languages (Java, C#, C++), `this` is immutably bound to the enclosing class instance. In JavaScript standard functions, `this` is evaluated dynamically at RUNTIME based on WHERE and HOW the function is invoked (the "call-site").',
    analogy: 'Zamislite ključnu reč `this` kao praznu značku sa imenom kompanije. Kada radnik uđe u firmu "Google", na značku upiše "Google". Ako taj isti radnik ode da radi za drugu firmu ("Meta"), njegova značka sada nosi ime "Meta". Značka zavisi od toga ko ga je pozvao na posao tog dana.',
    analogyEn: 'Think of `this` like an employee name tag. When an independent contractor works at "Google", their badge says "Google". If borrowed by "Meta", their badge says "Meta". The identity depends entirely on who hired them for that call.',
    historyAndOrigin: {
      title: 'Zašto je "this" u JavaScriptu dinamički vezan?',
      titleEn: 'Why is "this" Dynamically Bound in JavaScript?',
      description: 'JavaScript je u startu dizajniran kao jezik baziran na prototipovima, a ne na klasama. Kako bi se uštedela memorija u browserima sa samo 16MB RAM-a iz 1995. godine, ista funkcija je morala da se deli ("pozajmljuje") između stotina različitih objekata. Dinamički `this` je omogućio da jedna jedina funkcija na prototipu radi za sve objekte koji je pozovu kroz `obj.metoda()`.',
      descriptionEn: 'JavaScript was built around prototype delegation rather than classical inheritance. To save memory on 1995-era computers with 16MB RAM, functions needed to be shared ("borrowed") across hundreds of objects. Dynamic `this` allowed a single prototype function to operate across any calling object.',
      whyItExists: 'Arrow funkcije (`() => {}`) su uvedene tek u ES6 (2015) kako bi rešile 20 godina frustracija gde su programeri morali da pišu `var self = this;` ili `var that = this;` unutar callback funkcija.',
      whyItExistsEn: 'Arrow functions (`() => {}`) were introduced in ES6 (2015) specifically to fix 20 years of workarounds where developers had to write `const self = this;` inside event callbacks.'
    },
    underTheHood: {
      title: '4 pravila određivanja "this" vrednosti (po prioritetu)',
      titleEn: 'The 4 Rules of "this" Resolution (Ranked by Precedence)',
      summary: 'Kada se funkcija pozove, JavaScript engine proverava sledeća 4 pravila po strogom redosledu prioriteta:',
      summaryEn: 'When evaluating a function call, the JS engine evaluates 4 rules in strict order:',
      steps: [
        {
          stepNumber: 1,
          title: '1. new Binding (Konstruktori - Najviši prioritet)',
          titleEn: '1. new Binding (Constructors - Highest Priority)',
          description: 'Kada se funkcija pozove sa `new MyFunc()`, kreira se potpuno nov prazan objekat, njegov [[Prototype]] se postavlja na MyFunc.prototype, a `this` se unutar funkcije vezuje za taj novi objekat.',
          descriptionEn: 'Calling `new MyFunc()` allocates a fresh empty object, links its prototype to `MyFunc.prototype`, and binds `this` to that newly minted instance.',
          codeSnippet: 'const user = new User("Nikola"); // this je novokreirani user'
        },
        {
          stepNumber: 2,
          title: '2. Eksplicitno vezivanje (.call, .apply, .bind)',
          titleEn: '2. Explicit Binding (.call, .apply, .bind)',
          description: 'Metode `.call(context, a, b)` i `.apply(context, [a, b])` odmah pozivaju funkciju i prinudno postavljaju `context` kao `this`. Metoda `.bind(context)` vraća novu omotačku funkciju sa trajno zacementiranim `this`.',
          descriptionEn: '`.call(context, ...args)` and `.apply(context, [args])` execute immediately forcing `context` as `this`. `.bind(context)` returns a new wrapper function with `this` permanently locked.',
          codeSnippet: 'showName.call({ name: "Ana" }); // this je { name: "Ana" }'
        },
        {
          stepNumber: 3,
          title: '3. Implicitno vezivanje (Objekat ispred tačke)',
          titleEn: '3. Implicit Binding (Object Preceding the Dot)',
          description: 'Kada pozovete `user.getName()`, objekat neposredno ispred tačke (`user`) postaje `this`. Ako otkačite referencu u promenljivu (`const fn = user.getName; fn()`), implicitno vezivanje se GUBI!',
          descriptionEn: 'Calling `user.getName()` assigns the object before the dot (`user`) as `this`. Detaching the function reference (`const fn = user.getName; fn()`) loses the implicit binding!',
          codeSnippet: 'user.getName(); // this === user\nconst detached = user.getName;\ndetached(); // ❌ this je window / undefined!'
        },
        {
          stepNumber: 4,
          title: '4. Default vezivanje (Fallback / Samostalni poziv)',
          titleEn: '4. Default Binding (Standalone Call Fallback)',
          description: 'Ako funkciju pozovete samostalno `fn()`, u standardnom režimu `this` je globalni objekat (`window` ili `globalThis`). U striktnom režimu ("use strict"), `this` ostaje `undefined`.',
          descriptionEn: 'Calling a standalone `fn()` in non-strict mode sets `this` to the global object (`window`/`globalThis`). In strict mode (`"use strict"`), `this` safely remains `undefined`.',
          codeSnippet: 'function show() { console.log(this); }\nshow(); // window (ili undefined u strict mode)'
        }
      ]
    },
    pitfalls: [
      {
        title: 'Gubitak "this" konteksta u Callback i Event Listener funkcijama',
        titleEn: 'Losing "this" in Callback Handlers & Timers',
        cause: 'Kada prosledite metodu objekta kao callback u setTimeout(obj.handleClick, 1000) ili addEventListener, funkciju zapravo poziva timer ili DOM engine bez prefiksa sa tačkom.',
        causeEn: 'Passing `obj.handleClick` as a callback passes only the bare function reference, which gets invoked standalone by the timer/DOM dispatcher.',
        impact: '`this.state` ili `this.name` bacaju "TypeError: Cannot read properties of undefined".',
        impactEn: 'Crashes with `TypeError: Cannot read properties of undefined`.',
        codeSnippet: 'class Button {\n  render() {\n    // ❌ this je unutar timeout-a window/undefined!\n    setTimeout(this.logClick, 100);\n  }\n}'
      }
    ],
    solutions: [
      {
        title: 'Arrow funkcije za callback-ove (Leksičko vezivanje)',
        titleEn: 'Use Arrow Functions for Lexical "this"',
        solution: 'Arrow funkcije nemaju sopstveni `this`. One leksički preuzimaju `this` iz okružujućeg koda u trenutku pisanja.',
        solutionEn: 'Arrow functions do not have their own `this`. They capture `this` lexically from their enclosing authoring scope.',
        recommendation: 'Koristite arrow funkcije za sve event callback-ove i metode unutar klasa kada se prosleđuju dalje.',
        recommendationEn: 'Use arrow functions for event listeners and timer callbacks.',
        codeSnippet: 'setTimeout(() => this.logClick(), 100);'
      }
    ],
    funFacts: [
      {
        title: 'Arrow funkcije se ne mogu naterati da promene "this"',
        titleEn: 'Arrow Functions Cannot Be Bound with .call / .bind',
        codeSnippet: 'const arrow = () => console.log(this);\narrow.call({ name: "Petar" }); // Ignoriše argument!',
        explanation: 'Poziv .call, .apply ili .bind na arrow funkciji je potpuno ignorisan jer arrow funkcija nema sopstveni binding slot u Environment Record-u.',
        explanationEn: 'Calling `.call`, `.apply`, or `.bind` on an arrow function silently ignores the context argument because arrow functions lack a `[[ThisBindingStatus]]` slot.'
      }
    ],
    mentalModel: 'Pronađite gde se nalaze zagrade `()` u trenutku izvršavanja. Šta god da stoji levo od tačke je vaš `this`. Ako nema ničega levo, `this` je global/undefined. Ako je arrow funkcija, zaboravite zagrade i pogledajte u kom je scope-u napisana.',
    mentalModelEn: 'Find the parentheses `()` at the call-site. Whatever sits directly left of the dot is `this`. If there is no dot, it is global/undefined. If it is an arrow function, look at where it was declared in code.',
    goldenRule: 'Zlatno pravilo: Koristite regularne funkcije kada želite dinamički kontekst (npr. metode prototipa), a Arrow funkcije kada želite da sačuvate kontekst klase ili spoljnog scope-a.',
    goldenRuleEn: 'Golden Rule: Use regular functions when you want caller-dependent dynamic context, and arrow functions when preserving lexical parent scope.'
  },

  'scope-hoisting-closures': {
    overview: 'Scope (Opseg vidljivosti) određuje gde su promenljive i funkcije dostupne u vašem kodu. Hoisting (Izvlačenje na vrh) je ponašanje gde deklaracije promenljivih i funkcija bivaju rezervisane u memoriji pre nego što krene izvršavanje. Closure (Zatvorenje) je sposobnost funkcije da zapamti i pristupi svom leksičkom okruženju čak i nakon što je spoljna funkcija završila rad i uklonjena sa Call Stack-a.',
    overviewEn: 'Scope determines accessibility of variables and functions. Hoisting is the engine\'s compilation phase reserving memory declarations before executing. A Closure is an inner function retaining access to its parent Environment Record even after the parent function has exited the Call Stack.',
    analogy: 'Zamislite Closure kao ranac koji dete ponese od kuće: čak i kada dete ode kilometrima daleko u školu (funkcija izašla sa steka), ono i dalje u rancu ima sendvič i ključ od kuće (promenljive iz roditeljskog scope-a).',
    analogyEn: 'Imagine a closure like a backpack a traveler takes from home: even when they travel across the world (parent function exited stack), they still carry the key and notebook packed inside their backpack.',
    historyAndOrigin: {
      title: 'Zašto je postojao samo var i zašto je uveden let/const?',
      titleEn: 'Why Did We Only Have var and Why Were let/const Added?',
      description: 'Pre 2015. godine (ES6), JavaScript je imao isključivo funkcijski i globalni opseg (Function Scope). Promenljive deklarisane sa `var` nisu poštovale vitičaste zagrade `if`, `for` ili `while` blokova. Reč "Hoisting" nikada se nije nalazila u originalnoj specifikaciji – skovali su je programeri kako bi objasnili zašto se deklaracije ponašaju kao da su "podignute na vrh fajla".',
      descriptionEn: 'Before ES6 (2015), JavaScript only had function and global scope. `var` declarations ignored block boundaries (`if`, `for`). The term "Hoisting" was actually coined by developers to explain why declarations behaved as if lifted to the top of the file.',
      whyItExists: 'Uvođenjem `let` i `const` stvoren je Temporal Dead Zone (TDZ) kako bi se sprečilo čitanje promenljivih pre njihove inicijalizacije, što je bila jedna od najčešćih grešaka u starom JS kodu.',
      whyItExistsEn: '`let` and `const` introduced the Temporal Dead Zone (TDZ) to eliminate the hazards of accessing uninitialized variables before their declaration line.'
    },
    underTheHood: {
      title: 'Dve faze izvršavanja JavaScript engine-a',
      titleEn: 'The 2 Execution Phases of the JavaScript Engine',
      summary: 'JavaScript engine ne interpretira kod liniju po liniju naivno; on prolazi kroz Fazu Kreiranja i Fazu Izvršavanja.',
      summaryEn: 'The engine processes code in two distinct phases: Creation Phase and Execution Phase.',
      steps: [
        {
          stepNumber: 1,
          title: 'Faza kreiranja (Creation / Memory Allocation Phase)',
          titleEn: '1. Creation Phase (Memory Allocation)',
          description: 'Engine skenira kod, alocira memoriju za funkcije i promenljive. `function foo() {}` se memoriše kompletno. `var x` se alocira i odmah postavlja na `undefined`. `let y` i `const z` se alociraju u memoriji, ali ostaju NEINICIJALIZOVANI (TDZ).',
          descriptionEn: 'The engine allocates memory records. Function declarations hoist fully. `var` allocates and pre-initializes to `undefined`. `let` and `const` allocate but remain strictly UNINITIALIZED (in the TDZ).',
          codeSnippet: 'console.log(a); // undefined\nconsole.log(b); // ❌ ReferenceError (TDZ)\nvar a = 10;\nlet b = 20;'
        },
        {
          stepNumber: 2,
          title: 'Temporal Dead Zone (TDZ)',
          titleEn: '2. Temporal Dead Zone (TDZ)',
          description: 'TDZ je vremenski interval od trenutka ulaska u blok do trenutka kada engine izvrši liniju sa `let` ili `const`. Svaki pokušaj čitanja u tom intervalu baca ReferenceError.',
          descriptionEn: 'The TDZ is the temporal window between entering a block scope and evaluating the `let`/`const` declaration line. Accessing it throws a ReferenceError.',
          codeSnippet: '{\n  // Pocetak TDZ-a za let promenljivu\n  // console.log(value); // ❌ ReferenceError\n  let value = "hello"; // Kraj TDZ-a\n}'
        },
        {
          stepNumber: 3,
          title: 'Leksički opseg i Closure veze na Heap memoriji',
          titleEn: '3. Lexical Scope & Closure References on the Heap',
          description: 'Kada unutrašnja funkcija referencira promenljive spoljne funkcije, Garbage Collector prebacuje te promenljive sa Call Stack-a u posebnu strukturu na Heap memoriji (Closure Record), tako da one prežive.',
          descriptionEn: 'When an inner function references outer variables, the Garbage Collector retains that Environment Record on the Heap memory rather than deallocating it.',
          codeSnippet: 'function counter() {\n  let count = 0;\n  return () => ++count;\n}'
        }
      ]
    },
    pitfalls: [
      {
        title: 'Poznata zamka: var unutar for petlje sa setTimeout',
        titleEn: 'The Classic "var inside setTimeout loop" Trap',
        cause: 'Promenljiva `var i` ima samo jedno zajedničko vezivanje za celu petlju. Kada tajmeri nakon 100ms stignu na red, petlja je već završena i `i` ima vrednost 3.',
        causeEn: '`var i` shares a single mutable binding across all iterations. By the time timers fire, the loop has completed with `i = 3`.',
        impact: 'Sva tri timeout callback-a ispisuju broj 3 umesto 0, 1, 2.',
        impactEn: 'All timer callbacks print `3, 3, 3` instead of `0, 1, 2`.',
        codeSnippet: 'for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100); // Ispisuje: 3, 3, 3\n}\n// ✅ Rešenje sa let:\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100); // Ispisuje: 0, 1, 2\n}'
      }
    ],
    solutions: [
      {
        title: 'Zaboravite var – koristite isključivo const i let',
        titleEn: 'Use const by default, let when reassigning',
        solution: '`const` sprečava slučajno prebrisavanje referenci, a `let` kreira novo leksičko vezivanje po svakoj iteraciji petlje.',
        solutionEn: '`const` guarantees binding immutability and block scope, while `let` creates fresh bindings per loop iteration.',
        recommendation: 'Postavite ESLint pravilo "no-var": "error".',
        recommendationEn: 'Enable ESLint `"no-var": "error"`.',
        codeSnippet: 'const MAX_RETRIES = 3;\nlet currentRetry = 0;'
      }
    ],
    funFacts: [
      {
        title: 'Funkcijske deklaracije mogu da se pozovu pre nego što su napisane',
        titleEn: 'Function Declarations Hoist with Their Full Body',
        codeSnippet: 'sayHi(); // "Zdravo!" radi bez problema\nfunction sayHi() { console.log("Zdravo!"); }',
        explanation: 'Za razliku od funkcijskih izraza (const fn = () => {}), regularne deklaracije `function name() {}` se u fazi kreiranja kompletno učitavaju u memoriju.',
        explanationEn: 'Unlike function expressions (`const f = () => {}`), declarations hoist with their complete executable body.'
      }
    ],
    mentalModel: 'Zamišljajte scope kao jednosmerno ogledalo: iz unutrašnjeg scope-a možete savršeno videti sve promenljive spolja, ali spoljni scope ne može videti ništa što se nalazi unutra.',
    mentalModelEn: 'Imagine scope like a one-way mirror: inner scopes can see everything in outer scopes, but outer scopes cannot see inside.',
    goldenRule: 'Zlatno pravilo: Koristite `const` po defaultu, `let` samo kad morate menjati vrednost, i nikada ne koristite `var`.',
    goldenRuleEn: 'Golden Rule: Default to `const`, use `let` when mutating, and never write `var`.'
  },

  'prototypes-oop': {
    overview: 'JavaScript nema klasične klase kao jezici poput Jave ili C++ (gde klasa služi kao kalup iz koga se kopiraju metode). U JavaScriptu je sve bazirano na Prototipskom Nasleđivanju (Delegation). Svaki objekat ima skriveni interni link `[[Prototype]]` koji pokazuje na drugi objekat. Ako objekat nema traženo svojstvo, on delegira potragu svom roditeljskom prototipu.',
    overviewEn: 'JavaScript does not feature classical copy-based classes. Instead, it relies on Prototype Delegation Inheritance. Every object contains an internal link `[[Prototype]]` pointing to another object. If a property is missing, the engine delegates lookup up the prototype chain.',
    analogy: 'Zamislite kancelariju u kojoj stažista nema pečat (svojstvo). On ne pravi nov pečat, već pita svog menadžera (prototip). Ako ni menadžer nema pečat, pita direktora (Object.prototype). Ako ni direktor nema, odgovor je "nema pečata" (undefined).',
    analogyEn: 'Imagine an office where an intern needs a stamp. They do not forge one; they ask their manager (prototype). If the manager lacks it, they ask the CEO (Object.prototype). If the CEO lacks it, the search ends at null, returning `undefined`.',
    historyAndOrigin: {
      title: 'Zašto je JS baziran na prototipovima a ne na klasama?',
      titleEn: 'Why Did JavaScript Choose Prototypes Over Classes?',
      description: 'Brendan Eich je bio inspirisan jezikom Self (dijalekt Smalltalk-a). Prototipovi su izuzetno dinamični i memorijski efikasni: objekti mogu u toku samog rada programa da menjaju svoja svojstva i delegate bez komplikovane rekompilacije koda.',
      descriptionEn: 'Brendan Eich was inspired by the Self programming language. Prototypes are dynamic and memory-light: objects can delegate behavior and mutate at runtime without compilation.',
      whyItExists: 'Sintaksa `class` uvedena u ES6 (2015) je samo sintaksni šećer (Syntactic Sugar). Ispod haube, klase u JS-u su i dalje obične konstruktorske funkcije povezane preko `.prototype` objekta!',
      whyItExistsEn: 'The ES6 `class` syntax is pure syntactic sugar. Under the hood, JavaScript classes are regular constructor functions wired via `.prototype` delegation objects.'
    },
    underTheHood: {
      title: 'Kako radi lanac prototipova (Prototype Chain)',
      titleEn: 'How the Prototype Chain Lookup Works',
      summary: 'Čitanje i pisanje svojstava prate dva fundamentalno različita mehanizma.',
      summaryEn: 'Reading and writing properties follow two fundamentally different rules.',
      steps: [
        {
          stepNumber: 1,
          title: 'Čitanje svojstva (Lookup delegacija)',
          titleEn: '1. Reading Properties (Delegation Lookup)',
          description: 'Kada pristupite `obj.prop`, engine prvo proverava sopstvena svojstva (Own Properties). Ako ne nađe, prati `obj.__proto__`, pa `obj.__proto__.__proto__`, sve dok ne stigne do `Object.prototype.__proto__` koji je `null`.',
          descriptionEn: 'Accessing `obj.prop` checks own properties first, then traverses `obj.__proto__` until reaching terminal `Object.prototype.__proto__` (which is `null`).',
          codeSnippet: 'const arr = [1, 2];\narr.hasOwnProperty("map"); // false (map je na Array.prototype)\nArray.prototype.hasOwnProperty("map"); // true'
        },
        {
          stepNumber: 2,
          title: 'Pisanje svojstva (Shadowing / Zasipanje)',
          titleEn: '2. Writing Properties (Property Shadowing)',
          description: 'Kada napišete `obj.prop = 42`, JavaScript NE MENJA prototip, već kreira novo sopstveno svojstvo direktno na instanci `obj`, čime se prototip štiti od mutacije.',
          descriptionEn: 'Assigning `obj.prop = 42` creates an "own" property on `obj` rather than mutating the shared prototype object.',
          codeSnippet: 'const dog = Object.create({ legs: 4 });\ndog.legs = 3; // Kreira dog.legs, prototip ostaje 4'
        },
        {
          stepNumber: 3,
          title: 'Rizik od Prototype Pollution napada',
          titleEn: '3. Prototype Pollution Security Vulnerability',
          description: 'Ako neprovereni korisnički JSON sadrži ključ `__proto__`, rekurzivno spajanje (merge) može izmeniti sam `Object.prototype`, što menja ponašanje svih objekata u celoj aplikaciji!',
          descriptionEn: 'Recursively merging untrusted user JSON containing `__proto__` can mutate `Object.prototype`, injecting malicious properties across every object in the runtime.',
          codeSnippet: 'const userPayload = JSON.parse(\'{"__proto__": {"isAdmin": true}}\');'
        }
      ]
    },
    pitfalls: [
      {
        title: 'Korišćenje običnog objekta kao rečnika (Map)',
        titleEn: 'Using Plain Objects as Hash Maps',
        cause: 'Običan objekat `{}` automatski nasleđuje metode sa `Object.prototype` (poput `toString`, `valueOf`, `constructor`). Ako korisnik unese ključ "toString", provera `if (obj[key])` vraća funkciju umesto undefined!',
        causeEn: 'Plain `{}` inherits methods from `Object.prototype`. Accessing `obj["toString"]` returns a function rather than `undefined`.',
        impact: 'Sigurnosni bagovi i pogrešne logičke grane.',
        impactEn: 'Security holes and logic errors in user data lookup.',
        codeSnippet: 'const dict = {};\nif ("toString" in dict) { /* ❌ true iako ključ nismo uneli! */ }'
      }
    ],
    solutions: [
      {
        title: 'Koristite Map ili Object.create(null)',
        titleEn: 'Use Map or Object.create(null) for Dictionaries',
        solution: '`new Map()` i `Object.create(null)` nemaju prototip i potpuno su bezbedni od kolizija i Prototype Pollution-a.',
        solutionEn: '`new Map()` and `Object.create(null)` have no prototype collisions or pollution vulnerabilities.',
        recommendation: 'Za dinamičke ključeve uvek preferirajte `Map`.',
        recommendationEn: 'Always prefer `Map` for dynamic key-value collections.',
        codeSnippet: 'const safeMap = new Map();\nconst cleanDict = Object.create(null);'
      }
    ],
    funFacts: [
      {
        title: 'Object.prototype.__proto__ je jedini objekat sa null prototipom',
        titleEn: 'Object.prototype.__proto__ is null',
        codeSnippet: 'Object.getPrototypeOf(Object.prototype) === null // true',
        explanation: 'Ovo označava apsolutni kraj lanca prototipova u JavaScript memoriji.',
        explanationEn: 'This marks the terminal end of all prototype delegation chains in JavaScript memory.'
      }
    ],
    mentalModel: 'Prototip nije kopija – to je živi pokazivač na roditeljski objekat. Ako promenite metodu na prototipu, sve postojeće instance će istog trenutka videti novu metodu!',
    mentalModelEn: 'A prototype is not a copy; it is a live memory pointer. Mutating a prototype instantly updates behavior across all instances.',
    goldenRule: 'Zlatno pravilo: Nikada ne mutirajte ugrađene prototipove (`Array.prototype`, `Object.prototype`) i koristite `Map` za dinamičke podatke.',
    goldenRuleEn: 'Golden Rule: Never mutate native prototypes and use `Map` for arbitrary dynamic key-value maps.'
  },

  'arrays-and-objects': {
    overview: 'Nizovi u JavaScriptu nisu tradicionalni fiksni memorijski blokovi kao u C jeziku; oni su specijalizovani objekti sa numeričkim indeksima i automatskim `length` svojstvom. Zbog toga nizovi u JS-u mogu imati "rupe" (sparse arrays), podrazumevano se sortiraju kao tekst, a brisanje elementa sa `delete` ostavlja prazno mesto umesto promene dužine niza.',
    overviewEn: 'JavaScript arrays are not fixed contiguous C-style memory buffers; they are specialized objects with integer indices and a dynamic `length` property. Consequently, JS arrays can contain sparse "holes", sort alphabetically by default, and `delete arr[i]` leaves an empty slot instead of shrinking the array.',
    analogy: 'Zamislite niz kao red polica sa brojevima. Ako sa police broj 2 uzmete knjigu koristeći `delete`, polica ne nestaje i ostale se ne pomeraju – polica broj 2 ostaje prazna rupa u zidu.',
    analogyEn: 'Think of an array like a numbered bookshelf. If you remove a book from shelf 2 using `delete`, the shelf does not collapse—it remains as an empty hollow slot.',
    historyAndOrigin: {
      title: 'Zašto se brojevi podrazumevano sortiraju kao stringovi?',
      titleEn: 'Why Does Array.prototype.sort() Sort Alphabetically by Default?',
      description: 'U ranim verzijama Netscape browsera, nizovi su služili gotovo isključivo za manipulaciju DOM elementima i listama tekstualnih naziva (npr. listama linkova ili padajućim menijima). Zato je `sort()` podrazumevano konvertovao svaki element u string i poredio UTF-16 kodne jedinice.',
      descriptionEn: 'In early Netscape browsers, arrays predominantly held string tokens for HTML select options and DOM elements. Therefore, `sort()` was specified to convert items to strings and compare UTF-16 code units by default.',
      whyItExists: 'Zbog toga `[10, 2, 5].sort()` daje `[10, 2, 5]` jer karakter "1" u "10" ima manji UTF-16 kod od karaktera "2".',
      whyItExistsEn: 'Hence `[10, 2, 5].sort()` yields `[10, 2, 5]` because `"1"` in `"10"` comes before `"2"` lexicographically.'
    },
    underTheHood: {
      title: 'V8 optimizacija elemenata (Packed vs Holey / Dictionary mode)',
      titleEn: 'V8 Engine Elements Kinds: Packed vs Holey',
      summary: 'V8 engine interno menja reprezentaciju niza u memoriji zavisno od načina na koji sa njim radite.',
      summaryEn: 'V8 transitions array memory representations based on data density.',
      steps: [
        {
          stepNumber: 1,
          title: 'PACKED_SMI_ELEMENTS (Maksimalna brzina)',
          titleEn: 'PACKED_SMI_ELEMENTS (Ultra-Fast C++ Vector)',
          description: 'Kada kreirate gust niz sa celim brojevima `[1, 2, 3]`, V8 ga čuva kao ultra-brzi kontinualni C++ niz.',
          descriptionEn: 'When an array contains dense small integers (`[1, 2, 3]`), V8 stores it as a raw, contiguous C++ memory buffer.',
          codeSnippet: 'const dense = [1, 2, 3]; // PACKED_SMI'
        },
        {
          stepNumber: 2,
          title: 'HOLEY_ELEMENTS (Degradacija performansi)',
          titleEn: 'HOLEY_ELEMENTS (Performance Degradation)',
          description: 'Ako napravite rupu sa `delete arr[1]` ili `arr[100] = 5`, niz prelazi u HOLEY režim. Svako čitanje sada mora da proverava prototip i usporava izvršavanje i do 10x.',
          descriptionEn: 'Creating holes via `delete arr[1]` or `arr[100] = 5` downgrades it to HOLEY mode, forcing prototype lookups on missed indices.',
          codeSnippet: 'delete dense[1]; // ⚠️ Prelazi u HOLEY režim'
        },
        {
          stepNumber: 3,
          title: 'Plitko kopiranje (Spread) naspram Dubokog kloniranja',
          titleEn: 'Shallow Copying vs Deep Cloning',
          description: 'Operator `[...arr]` ili `{...obj}` kopira samo prvi nivo. Ako objekat sadrži ugnježdene objekte, kopira se samo referenca. Za pravo duboko kloniranje koristite ugrađeni `structuredClone()`.',
          descriptionEn: 'Spread `[...arr]` copies only first-level references. Nested objects remain linked. Use native `structuredClone()` for true deep copies.',
          codeSnippet: 'const deepCopy = structuredClone(originalObj);'
        }
      ]
    },
    pitfalls: [
      {
        title: 'Upotreba delete operatora nad nizovima',
        titleEn: 'Using delete on Array Elements',
        cause: '`delete arr[0]` postavlja slot na `<empty>` umesto uklanjanja elementa, a `arr.length` ostaje nepromenjen.',
        causeEn: '`delete arr[0]` leaves `<empty slot>` without reducing `arr.length`.',
        impact: 'Metode `.map()` i `.forEach()` preskaču prazne slotove, stvarajući neočekivane bagove.',
        impactEn: 'Iterators skip holes, causing off-by-one errors.',
        codeSnippet: 'const arr = [1, 2, 3];\ndelete arr[1];\nconsole.log(arr.length); // 3 (nije 2!)'
      }
    ],
    solutions: [
      {
        title: 'Uvek prosledite komparator u .sort() i koristite ES2023 metode',
        titleEn: 'Always Pass a Numeric Comparator & Use ES2023 Immutable Methods',
        solution: 'Za brojeve uvek koristite `arr.sort((a, b) => a - b)`. Za bezbedno sortiranje bez mutacije originala koristite `arr.toSorted()` i `arr.toSpliced()`.',
        solutionEn: 'Sort numbers with `arr.sort((a, b) => a - b)`. Use non-mutating ES2023 `.toSorted()`, `.toReversed()`, `.toSpliced()`.',
        recommendation: 'Preferirajte `.toSorted()` i `.filter()` umesto mutiranja izvornih nizova.',
        recommendationEn: 'Prefer immutable methods in modern functional React/TypeScript code.',
        codeSnippet: 'const sorted = nums.toSorted((a, b) => a - b);'
      }
    ],
    funFacts: [
      {
        title: 'Array(3) kreira 3 rupe a ne 3 undefined vrednosti',
        titleEn: 'Array(3) Creates 3 Holes, Not 3 Undefineds',
        codeSnippet: 'Array(3).map(() => 1) // Vraća [empty x 3] jer map preskače rupe!',
        explanation: 'Da biste popunili novi niz, morate pozvati Array(3).fill(0) ili Array.from({ length: 3 }).',
        explanationEn: 'To populate an array, use `Array(3).fill(0)` or `Array.from({ length: 3 })`.'
      }
    ],
    mentalModel: 'Niz je lista sa adresama: nikada ne brišite adresu sa `delete` (ostaje prazan plac), već koristite `.splice()` ili `.filter()` da preuredite ceo komšiluk.',
    mentalModelEn: 'An array is a row of street addresses: never delete an address with `delete` (leaving an empty lot); use `.filter()` or `.splice()` to recompact the street.',
    goldenRule: 'Zlatno pravilo: Za brojeve uvek koristite `(a, b) => a - b` u `.sort()`, i koristite `structuredClone` za duboko kopiranje.',
    goldenRuleEn: 'Golden Rule: Always supply `(a, b) => a - b` when sorting numbers, and use `structuredClone` for deep cloning.'
  },

  'floating-point-numbers': {
    overview: 'U JavaScriptu ne postoje odvojeni tipovi za `int`, `float`, `double` ili `decimal`. Svi standardni brojevi su IEEE 754 64-bitni brojevi sa dvostrukom tačnošću (Double Precision Floats). Zbog toga što računari brojeve čuvaju u bazi 2 (binarno), decimalne razlomke kao što su 0.1 ili 0.2 nije moguće precizno predstaviti u binarnom zapisu bez beskonačnog ponavljanja.',
    overviewEn: 'JavaScript has no separate `int`, `short`, or `float` primitive types. All standard numbers are IEEE 754 64-bit Double Precision Floats. Because computers store numbers in base-2 (binary), decimal fractions like 0.1 and 0.2 convert into infinite repeating binary fractions, leading to tiny rounding discrepancies.',
    analogy: 'Zamislite da pokušavate da napišete razlomak 1/3 u decimalnom sistemu: dobijate 0.333333... beskonačno. Kada saberete 0.333 + 0.333 + 0.333 dobijate 0.999 a ne 1.0. Potpuno ista stvar se dešava računaru kada pokuša da sabere 0.1 i 0.2 u binarnom sistemu!',
    analogyEn: 'Think of representing 1/3 in base 10: you get 0.33333... repeating. Adding 0.333 + 0.333 + 0.333 gives 0.999, not 1.0. The exact same limitation occurs in binary when storing base-10 fractions like 0.1.',
    historyAndOrigin: {
      title: 'Zašto je JavaScript izabrao samo jedan numerički tip?',
      titleEn: 'Why Did JavaScript Have Only One Number Type?',
      description: 'Tokom kreiranja 1995. godine, Brendan Eich je želeo da poštedi veb programere od razmišljanja o bit-širinama (16-bit vs 32-bit vs 64-bit int) i problemima prepunjavanja registara (integer overflow). IEEE 754 Double je bio univerzalan i omogućavao rad i sa celim brojevima i sa decimalama.',
      descriptionEn: 'In 1995, the design goal was simplicity for non-programmers without needing to manage 16-bit vs 32-bit registers or type casting. IEEE 754 Double was chosen as a single universal numeric standard.',
      whyItExists: 'Tek 2020. godine je u ES11 dodat `BigInt` (npr. `9007199254740993n`) kako bi se omogućio rad sa 64-bitnim bazama podataka i kriptografskim celim brojevima bez gubitka preciznosti.',
      whyItExistsEn: 'Only in ES2020 was `BigInt` added to safely represent arbitrarily large 64-bit database IDs and cryptographic integers.'
    },
    underTheHood: {
      title: 'Struktura IEEE 754 64-bitnog broja u memoriji',
      titleEn: 'IEEE 754 64-Bit Memory Structure',
      summary: 'Svaki broj u JS-u zauzima tačno 64 bita u memoriji raspoređenih u 3 celine.',
      summaryEn: 'Every JS number occupies 64 bits split into 3 hardware fields.',
      steps: [
        {
          stepNumber: 1,
          title: '1 Sign Bit (Znak: 0 za +, 1 za -)',
          titleEn: '1 Sign Bit (Sign: 0 for +, 1 for -)',
          description: 'Zbog postojanja posebnog bita za znak, JavaScript podržava i pozitivnu i negativnu nulu (+0 i -0)! Iako je `+0 === -0` true, `1 / +0` daje `Infinity` a `1 / -0` daje `-Infinity`.',
          descriptionEn: 'Because of the sign bit, JavaScript supports signed zeros (+0 and -0). While `+0 === -0` is true, `1 / +0 === Infinity` while `1 / -0 === -Infinity`.',
          codeSnippet: 'Object.is(+0, -0) // false'
        },
        {
          stepNumber: 2,
          title: '11 Exponent Bits (Eksponent)',
          titleEn: '11 Exponent Bits (Dynamic Range Scaling)',
          description: 'Omogućava ogroman raspon brojeva od 10^-308 do 10^+308.',
          descriptionEn: 'Provides a vast numerical range spanning from 10^-308 up to 10^+308.',
          codeSnippet: 'Number.MAX_VALUE // ~1.79e+308'
        },
        {
          stepNumber: 3,
          title: '52 Fraction / Mantissa Bits (Preciznost)',
          titleEn: '52 Fraction / Mantissa Bits (Precision Limit)',
          description: 'Daje tačno 53 bita efektivne preciznosti (1 skriveni bit). Zbog toga su celi brojevi bezbedni samo u opsegu do 2^53 - 1 (`Number.MAX_SAFE_INTEGER` = 9,007,199,254,740,991). Iznad toga, brojevi gube parnost!',
          descriptionEn: 'Yields 53 bits of effective precision, capping exact integers at `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991). Beyond this, integers lose parity.',
          codeSnippet: '9007199254740991 + 1 === 9007199254740991 + 2 // true! (Overflow)'
        }
      ]
    },
    pitfalls: [
      {
        title: 'Računanje novca u decimalnim brojevima',
        titleEn: 'Using Floating-Point Numbers for Financial Math',
        cause: 'Operacija `0.1 + 0.2` daje `0.30000000000000004`. Ako u e-commerce aplikaciji proveravate `if (price === 0.3)`, plaćanje nikada neće proći!',
        causeEn: '`0.1 + 0.2 === 0.30000000000000004`. Comparing `if (total === 0.3)` causes checkout validation failures.',
        impact: 'Finansijska neslaganja, greške u naplati i knjigovodstveni problemi.',
        impactEn: 'Balance sheet discrepancies and failed transactional assertions.',
        codeSnippet: 'const total = 0.1 + 0.2;\nif (total === 0.3) { /* ❌ nikada se ne izvršava! */ }'
      },
      {
        title: 'Gubitak 64-bitnih ID-eva iz baza podataka (npr. Twitter / Snowflake IDs)',
        titleEn: 'Corruption of 64-Bit Database IDs',
        cause: 'JSON.parse() automatski pretvara velike brojeve u standardni JS Number, čime se zadnje cifre zaokružuju i ID biva korumpiran.',
        causeEn: '`JSON.parse()` silently converts large 64-bit IDs into standard Numbers, rounding off trailing digits.',
        impact: 'Pogrešan korisnik ili entitet biva ažuriran u bazi podataka.',
        impactEn: 'Wrong database records modified due to ID collisions.',
        codeSnippet: 'const id = 1234567890123456789; // Pretvara se u 1234567890123456770'
      }
    ],
    solutions: [
      {
        title: 'Novac čuvajte u parama/centima (celi brojevi) i koristite Number.EPSILON',
        titleEn: 'Store Currency in Integer Cents & Compare with Number.EPSILON',
        solution: 'Čuvajte 19.99€ kao 1999 centi. Za poređenje decimala koristite toleranciju: `Math.abs(a - b) < Number.EPSILON`.',
        solutionEn: 'Store currency in cents ($19.99 -> 1999). For floating comparisons, use `Math.abs(a - b) < Number.EPSILON`.',
        recommendation: 'Za 64-bitne ID-eve uvek koristite String ili BigInt.',
        recommendationEn: 'Represent 64-bit IDs as Strings or BigInts.',
        codeSnippet: 'function areFloatsEqual(a, b) {\n  return Math.abs(a - b) < Number.EPSILON;\n}'
      }
    ],
    funFacts: [
      {
        title: 'Math.min() je veće od Math.max() ako nema argumenata',
        titleEn: 'Math.min() > Math.max() When Passed No Arguments',
        codeSnippet: 'Math.min() > Math.max() // true!',
        explanation: 'Math.min() bez argumenata vraća +Infinity, a Math.max() vraća -Infinity. Pošto je +Infinity > -Infinity, rezultat je true!',
        explanationEn: '`Math.min()` with no arguments returns `Infinity`, while `Math.max()` returns `-Infinity`. Since `Infinity > -Infinity`, this evaluates to `true`!'
      }
    ],
    mentalModel: 'JavaScript brojevi su kao lenjir sa milimetarskim podeocima: savršeni su za merenje drveta, ali ako pokušate da izmerite atom (finansijski decimalni mikron), doći će do greške.',
    mentalModelEn: 'JavaScript numbers are like a tape measure with millimeter markings: great for everyday measurement, but incapable of measuring atomic particles without rounding.',
    goldenRule: 'Zlatno pravilo: Nikada ne poredite decimale sa `===` i nikada ne čuvajte novac kao float – čuvajte ga u centima kao integer ili koristite BigInt.',
    goldenRuleEn: 'Golden Rule: Never compare floating decimals with `===` and never store currency as floats—use integer cents or BigInt.'
  },

  'syntax-asi-traps': {
    overview: 'JavaScript poseduje mehanizam koji se zove Automatic Semicolon Insertion (ASI). Ako zaboravite tačku-zarez (;) na kraju linije, parser analizira sintaksu i automatski ubacuje virtuelni tačka-zarez ukoliko bi nedostatak istog izazvao sintaksnu grešku. Međutim, postoje stroga pravila gde ASI pravi katastrofalne tihe greške, naročito kod `return` naredbi i linija koje počinju sa zagradama `(` ili `[`.',
    overviewEn: 'JavaScript features Automatic Semicolon Insertion (ASI). If you omit a semicolon, the parser automatically inserts a virtual semicolon at line breaks where code would otherwise produce a syntax error. However, strict edge cases (Restricted Productions) can lead to silent failures, particularly after `return` or on lines beginning with `(` or `[`.',
    analogy: 'Zamislite lektora koji automatski ubacuje tačku na kraju svakog reda u vašem pismu čim pređete u novi red. Ako ste napisali "Šaljem vam" i u novom redu "milion dolara", lektor će staviti tačku posle "Šaljem vam.", a milion dolara ostaje nepročitano!',
    analogyEn: 'Imagine an aggressive editor who automatically places a period at every line break. If you write "I am sending" and on the next line "one million dollars", the editor prints "I am sending." and discards the rest as unreachable!',
    historyAndOrigin: {
      title: 'Zašto je ASI uopšte kreiran?',
      titleEn: 'Why Was ASI Added to JavaScript?',
      description: 'U ranom vebu 1995. godine, mnogi HTML kreatori nisu imali formalno obrazovanje iz C ili Java programiranja i stalno su zaboravljali da stave tačku-zarez na kraju naredbi. Da bi se izbeglo masovno pucanje skripti, ASI je dizajniran da učini tačku-zarez opcionalnim u većini uobičajenih slučajeva.',
      descriptionEn: 'In 1995, many early web developers were unfamiliar with C/Java syntax and frequently forgot semicolons. ASI was designed to make semicolons optional for common scripting patterns without throwing syntax errors.',
      whyItExists: 'Ipak, pravila gramatike ECMA specifikacije zabranjuju prelazak u novi red posle određenih ključnih reči (tzv. "Restricted Productions"), što je stvorilo čuvenu return zamku.',
      whyItExistsEn: 'However, ECMAScript grammar strictly forbids line terminators following certain keywords (Restricted Productions), creating the famous multiline return trap.'
    },
    underTheHood: {
      title: 'Kako ASI pravila odlučuju kada da umetnu tačku-zarez',
      titleEn: 'How ASI Decides Semicolon Insertion',
      summary: 'ECMAScript specifikacija (§12.9) propisuje 3 osnovna pravila za ASI:',
      summaryEn: 'ECMAScript §12.9 defines 3 foundational rules for ASI:',
      steps: [
        {
          stepNumber: 1,
          title: 'Restricted Productions (Zabranjen novi red)',
          titleEn: '1. Restricted Productions',
          description: 'Nijedan prelazak u novi red nije dozvoljen neposredno posle: `return`, `throw`, `yield`, `break`, `continue`, niti ispred `++` i `--`. Ako pređete u novi red, JS bezuslovno ubacuje `;` odmah iza ključne reči!',
          descriptionEn: 'No newline is permitted after `return`, `throw`, `yield`, `break`, `continue`, or before `++`/`--`. A newline triggers immediate semicolon insertion right after the keyword!',
          codeSnippet: 'function getUser() {\n  return\n  {\n    name: "Marko"\n  };\n}\n// JS ovo parsira kao: return; { name: "Marko" }; -> Vraća undefined!'
        },
        {
          stepNumber: 2,
          title: 'Opasnost sa linijama koje počinju sa ( ili [',
          titleEn: '2. Hazard with Lines Starting with ( or [',
          description: 'Ako ne stavljate tačku-zarez, a sledeća linija počinje sa `(` ili `[`, JS NEĆE ubaciti `;`. Umesto toga, protumačiće sledeću liniju kao poziv funkcije ili indeksni pristup prethodnoj liniji!',
          descriptionEn: 'If semicolons are omitted and the next line begins with `(` or `[`, JS will NOT insert a semicolon. It parses the next line as a function call or array index on the previous line!',
          codeSnippet: 'const a = b + c\n(d + e).print()\n// JS parsira kao: const a = b + c(d + e).print() -> TypeError!'
        },
        {
          stepNumber: 3,
          title: 'Zatvorena vitičasta zagrada } i kraj fajla',
          titleEn: '3. Closing Braces and EOF',
          description: 'ASI uvek automatski ubacuje tačku-zarez ispred zatvorene vitičaste zagrade `}` ili na samom kraju skripte.',
          descriptionEn: 'ASI automatically places a semicolon before a closing brace `}` or at End Of File (EOF).',
          codeSnippet: 'let x = 10 }'
        }
      ]
    },
    pitfalls: [
      {
        title: 'Tihi undefined bag kod multiline return izraza',
        titleEn: 'Silent undefined in Multiline Return Statements',
        cause: 'Stavljanje otvarajuće vitičaste zagrade `{` u novom redu ispod `return`.',
        causeEn: 'Placing the opening curly brace `{` on a new line below `return`.',
        impact: 'Funkcija tiho vraća `undefined`, a objekat ispod ostaje mrtav kod koji se nikada ne izvršava.',
        impactEn: 'Function silently returns `undefined`, leaving the object payload as dead unreachable code.',
        codeSnippet: 'function getConfig() {\n  return // ❌ ASI ubacuje ; ovde!\n  {\n    port: 3000\n  };\n}'
      }
    ],
    solutions: [
      {
        title: 'Otvarajuću zagradu ({) držite na istoj liniji sa return ili koristite Prettier',
        titleEn: 'Keep Opening Brace on the Same Line or Use Prettier',
        solution: 'Uvek pišite `return {` ili `return (` na istoj liniji. Koristite Prettier / Biome za automatsko formatiranje.',
        solutionEn: 'Always place `return {` or `return (` on the exact same line. Use Prettier or ESLint to automate formatting.',
        recommendation: 'Podesite automatsko formatiranje koda pri svakom snimanju fajla (Format on Save).',
        recommendationEn: 'Enable Format on Save in your editor.',
        codeSnippet: 'function getConfig() {\n  return {\n    port: 3000\n  };\n}'
      }
    ],
    funFacts: [
      {
        title: 'Operator zarez (Comma Operator) vraća poslednji izraz',
        titleEn: 'The Comma Operator Evaluates to the Last Operand',
        codeSnippet: 'let a = (1, 2, 3); // a postaje 3',
        explanation: 'Operator zarez izvršava sve izraze sa leva na desno i vraća rezultat poslednjeg.',
        explanationEn: 'The comma operator evaluates all sub-expressions left-to-right and returns the final value.'
      }
    ],
    mentalModel: 'Nikada ne ostavljajte `return` samog na liniji bez zagrade, i nikada ne počinjite novu liniju sa `(` ili `[` osim ako prethodna linija ima eksplicitnu tačku-zarez.',
    mentalModelEn: 'Never leave `return` alone on a line without an opening brace or parenthesis, and never start a line with `(` or `[` without preceding semicolons.',
    goldenRule: 'Zlatno pravilo: Koristite automatski formater (Prettier) i držite otvarajuće zagrade `{`, `(` na istoj liniji sa kontrolnim naredbama.',
    goldenRuleEn: 'Golden Rule: Use an automated formatter (Prettier) and always keep opening `{` or `(` on the same line as `return`.'
  }
};
