import { JSTopic } from '../types';
import { CHAPTER_GUIDES } from './chapterGuides';

const RAW_TOPICS: JSTopic[] = [
  {
    "id": "type-coercion-equality",
    "title": "Implicitna konverzija tipova i labava jednakost (==)",
    "subtitle": "Misteriozni mehanizmi operatora +, -, == i ToPrimitive algoritma",
    "category": "type-coercion",
    "difficulty": "Intermediate",
    "tags": [
      "Coercion",
      "Type Casting",
      "== vs ===",
      "ToPrimitive",
      "JSFuck"
    ],
    "summary": "JavaScript je dinamički i slabo tipiziran jezik. Kada operatori prime nespojive tipove podataka, umesto rušenja programa runtime automatski pokreće apstraktne algoritme konverzije (ToPrimitive, ToNumber, ToString). Razumevanje ovih preciznih ECMAScript pravila uklanja osećaj \"magije\" ili nepredvidivosti u JS izrazima.",
    "deepDive": {
      "title": "Kako JavaScript konvertuje tipove „ispod haube”",
      "summary": "Kada se izvršava operacija između različitih tipova (npr. sabiranje ili poređenje jednakosti), JavaScript agregira operande kroz striktan niz koraka definisanih u ECMA-262 specifikaciji.",
      "keyPoints": [
        {
          "term": "ToPrimitive(input, preferredType) algoritam",
          "detail": "Ako je operand objekat ili niz, JS prvo traži Symbol.toPrimitive metodu. Ako ona ne postoji, poziva .valueOf(), a ukoliko on ne vrati primitivnu vrednost, poziva .toString(). Za nizove, [1, 2].toString() daje \"1,2\", dok za prazan niz [].toString() vraća prazan string \"\".",
          "termEn": "ToPrimitive(input, preferredType) Algorithm",
          "detailEn": "If an operand is an object or array, JS first checks for a Symbol.toPrimitive method. If absent, it calls .valueOf(), and if that does not return a primitive, it calls .toString(). For arrays, [1, 2].toString() yields \"1,2\", while [].toString() yields \"\"."
        },
        {
          "term": "Preopterećeni operator sabiranja (+)",
          "detail": "Operator + je jedini aritmetički operator koji vrši i matematičko sabiranje i konkatenaciju stringova. Pravilo glasi: ako je makar jedan operand nakon ToPrimitive operacije String, vrši se spajanje stringova. Svi ostali operatori (-, *, /, %) bezuslovno konvertuju oba operanda u Number preko ToNumber().",
          "termEn": "Overloaded Addition Operator (+)",
          "detailEn": "The + operator is the only arithmetic operator performing both mathematical addition and string concatenation. Rule: if either operand becomes a String after ToPrimitive, string concatenation occurs. All other operators (-, *, /, %) unconditionally convert operands to Number via ToNumber()."
        },
        {
          "term": "Labava jednakost (==) naspram Striktne (===)",
          "detail": "Striktna jednakost (===) odmah vraća false ako se tipovi razlikuju. Labava jednakost (==) prati 11 koraka: npr. ako poredi Number i Boolean, Boolean se prvo pretvara u Number (true -> 1, false -> 0). Izraz [] == ![] je true jer ![] prvo postaje false, a zatim se [] i false konvertuju u brojeve: 0 == 0 -> true.",
          "termEn": "Loose (==) vs Strict (===) Equality",
          "detailEn": "Strict equality (===) immediately returns false if types differ. Loose equality (==) executes 11 comparison steps: e.g. comparing Number and Boolean converts Boolean to Number (true -> 1, false -> 0). The expression [] == ![] evaluates to true because ![] becomes false, then [] and false coerce to 0 == 0 -> true."
        },
        {
          "term": "Specijalni slučaj: null i undefined",
          "detail": "U labavoj jednakosti (==), null i undefined su jednaki isključivo jedno drugom i ničemu drugom (null == undefined je true, ali null == 0 je false). Međutim, relacioni operatori (>=, <=) konvertuju null u 0 preko ToNumber, zbog čega je null >= 0 true!",
          "termEn": "Special Case: null and undefined",
          "detailEn": "Under loose equality (==), null and undefined equal only each other and nothing else (null == undefined is true, but null == 0 is false). However, relational operators (>=, <=) coerce null to 0 via ToNumber, making null >= 0 evaluate to true!"
        }
      ],
      "mentalModel": "Zamišljajte JS operatore kao filtere: operator + preferira String ukoliko naiđe na tekst, dok matematički operatori (-, *, /) i relacije (>, <, >=) agresivno forsiraju Number pretvaranje preko ToNumber.",
      "titleEn": "How JavaScript Converts Types Under the Hood",
      "summaryEn": "When evaluating operations between different types (such as addition or equality checks), JavaScript resolves operands via a strict series of steps defined in the ECMA-262 specification.",
      "mentalModelEn": "Think of JS operators as filters: the + operator prefers String if text is encountered, whereas arithmetic operators (-, *, /) and relational operators (>, <, >=) aggressively enforce Number conversion via ToNumber."
    },
    "ecmaSpecNote": "ECMA-262 §7.1 Type Conversion & §7.2.14 Abstract Equality Comparison",
    "visualType": "coercion",
    "codePresets": [
      {
        "id": "coercion-math",
        "title": "Matematička i String konverzija",
        "description": "Uočite razliku između preopterećenog operatora + i numeričkih operatora (-, *, /)",
        "code": "console.log('\"5\" + 3  =>', \"5\" + 3);  // String konkatenacija -> \"53\"\nconsole.log('\"5\" - 3  =>', \"5\" - 3);  // Konvertuje u number -> 2\nconsole.log('\"5\" * \"2\" =>', \"5\" * \"2\"); // 10\nconsole.log('true + 1  =>', true + 1); // true postaje 1 -> 2\nconsole.log('null + 1  =>', null + 1); // null postaje 0 -> 1\nconsole.log('undefined + 1 =>', undefined + 1); // undefined postaje NaN -> NaN",
        "visualType": "coercion",
        "titleEn": "Math and String Coercion",
        "descriptionEn": "Observe the difference between overloaded + and numeric arithmetic operators (-, *, /)"
      },
      {
        "id": "coercion-arrays-objects",
        "title": "Nizovi i objekti u aritmetici",
        "description": "Kako se objekti i nizovi razrešavaju preko metoda .valueOf() i .toString()",
        "code": "console.log('[] + []       =>', JSON.stringify([] + [])); // \"\"\nconsole.log('[] + {}       =>', [] + {}); // \"[object Object]\"\nconsole.log('[1, 2] + [3]  =>', [1, 2] + [3]); // \"1,23\"\nconsole.log('+[]           =>', +[]); // Unarni plus konvertuje prazan niz u 0\nconsole.log('+!+[]         =>', +!+[]); // 1\nconsole.log('!+[] + !+[]   =>', !+[] + !+[]); // 2",
        "visualType": "coercion",
        "titleEn": "Arrays and Objects in Arithmetic",
        "descriptionEn": "How objects and arrays resolve via .valueOf() and .toString() methods"
      },
      {
        "id": "loose-vs-strict",
        "title": "Labava (==) naspram Striktne (===) jednakosti",
        "description": "Zašto je 0 == false tačno, null == undefined tačno, a null == false netačno",
        "code": "console.log('0 == false       =>', 0 == false); // true\nconsole.log('\"\" == false      =>', \"\" == false); // true\nconsole.log('[] == false      =>', [] == false); // true\nconsole.log('[] == ![]        =>', [] == ![]); // true!\nconsole.log('null == undefined=>', null == undefined); // true\nconsole.log('null == 0        =>', null == 0); // false\nconsole.log('NaN === NaN      =>', NaN === NaN); // false\nconsole.log('Object.is(NaN, NaN) =>', Object.is(NaN, NaN)); // true",
        "visualType": "coercion",
        "titleEn": "Loose (==) vs Strict (===) Equality",
        "descriptionEn": "Why 0 == false is true, null == undefined is true, but null == false is false"
      }
    ],
    "comparisons": [
      {
        "title": "Provera jednakosti (Labava == naspram Striktne ===)",
        "badCode": "// ❌ RIZIČNO: Korišćenje labave jednakosti (==)\nfunction checkDiscount(couponCode) {\n  // Ako korisnik unese 0 ili false, labava jednakost pravi neočekivane propuste!\n  if (couponCode == false) {\n    console.log(\"Kupon nije primenjen\");\n  }\n  \n  const total = \"100\";\n  if (total == 100) { // Prolazi iako su tipovi različiti (string i number)\n    return Number(total) * 0.9;\n  }\n}",
        "badExplanation": "Labava jednakost (==) prolazi kroz 11 koraka apstraktnog algoritma konverzije. Poređenja \"\" == 0, [] == false ili \"0\" == false daju true, što stvara skrivene sigurnosne i logičke bug-ove.",
        "goodCode": "// ✅ NAJBOLJA PRAKSA: Uvek koristite striktnu jednakost (===) i eksplicitnu konverziju\nfunction checkDiscount(couponCode: string | null) {\n  if (couponCode === null || couponCode === \"\") {\n    console.log(\"Kupon nije primenjen\");\n    return;\n  }\n  \n  const total = 100;\n  if (typeof total === \"number\" && total === 100) {\n    return total * 0.9;\n  }\n}",
        "goodExplanation": "Striktna jednakost (===) nikada ne vrši konverziju tipova. Ukoliko tipovi nisu identični, odmah vraća false bez ikakvih sporednih efekata.",
        "pitfall": "Implicitna konverzija tipova u uslovima (if) koja dovodi do pogrešnih truthy/falsy evaluacija.",
        "titleEn": "Equality Checking (Loose == vs Strict ===)",
        "badExplanationEn": "Loose equality (==) steps through 11 abstract conversion rules. Comparisons like \"\" == 0, [] == false or \"0\" == false return true, causing hidden security and logic bugs.",
        "goodExplanationEn": "Strict equality (===) never performs type coercion. If types are not identical, it immediately returns false without side effects.",
        "pitfallEn": "Implicit type coercion in if conditions causing misleading truthy/falsy evaluations."
      },
      {
        "title": "Parsiranje i validacija brojeva",
        "badCode": "// ❌ RIZIČNO: Globalna funkcija isNaN()\nconsole.log(isNaN(\"hello\")); // true\nconsole.log(isNaN(undefined)); // true (prvo konvertuje undefined u NaN!)\nconsole.log(isNaN({})); // true",
        "badExplanation": "Globalna funkcija `isNaN()` prvo prinudno konvertuje argument u Number pre provere. Zato `isNaN(\"hello\")` ili `isNaN({})` vraćaju `true` iako same vrednosti u startu nisu tipa `NaN`.",
        "goodCode": "// ✅ NAJBOLJA PRAKSA: Koristite Number.isNaN() ili Number.isFinite()\nconsole.log(Number.isNaN(\"hello\")); // false (nema prinudne konverzije!)\nconsole.log(Number.isNaN(NaN)); // true\nconsole.log(Number.isFinite(123)); // true\nconsole.log(Number.isFinite(\"123\")); // false (striktno proverava i tip)",
        "goodExplanation": "Metoda `Number.isNaN()` uvedena u ES6 standardu striktno proverava da li je prosleđena vrednost tipa Number i jednaka `NaN`, bez ikakve implicitne konverzije.",
        "pitfall": "Slučajno korišćenje globalne isNaN() funkcije za validaciju korisničkog unosa.",
        "titleEn": "Number Parsing and Validation",
        "badExplanationEn": "Global isNaN() coerces its argument to Number before validation. Hence isNaN(\"hello\") or isNaN({}) return true even though the inputs were not originally of type NaN.",
        "goodExplanationEn": "Number.isNaN() introduced in ES6 strictly checks if the passed value is of type Number and equals NaN, without any implicit type casting.",
        "pitfallEn": "Accidentally using the global isNaN() function for validating user inputs."
      }
    ],
    "languageComparisons": [
      {
        "language": "Python",
        "jsCode": "console.log(\"5\" + 3);  // Izlaz: \"53\"\nconsole.log(\"5\" - 3);  // Izlaz: 2\nconsole.log([] == false); // Izlaz: true",
        "otherCode": "# Python\nprint(\"5\" + 3)  # TypeError: can only concatenate str to str\nprint(\"5\" - 3)  # TypeError: unsupported operand type(s)\nprint([] == False) # Izlaz: False (striktno poređenje vrednosti/identiteta)",
        "jsBehavior": "JavaScript automatski vrši konverziju tipova operanada kako bi sprečio rušenje skripte u ranim browser-ima.",
        "otherBehavior": "Python je strogo tipiziran jezik koji zabranjuje implicitne aritmetičke operacije između stringova i brojeva.",
        "keyDifference": "Dinamički + Slabo tipiziran (JS) naspram Dinamički + Strogo tipiziran (Python).",
        "whyJsDoesThis": "Kreiran za 10 dana 1995. godine za Netscape Navigator, dizajniran da bude tolerantan prema greškama kako skripte ne bi rušile web stranice.",
        "jsBehaviorEn": "JavaScript automatically coerces operand types to avoid crashing in early browser scripts.",
        "otherBehaviorEn": "Python is strongly typed and disallows implicit arithmetic between strings and numbers.",
        "keyDifferenceEn": "Dynamic + Weakly Typed (JS) vs Dynamic + Strongly Typed (Python).",
        "whyJsDoesThisEn": "Built in 10 days in 1995 for Netscape Navigator, engineered to be forgiving so scripts would not crash web pages."
      },
      {
        "language": "Java",
        "jsCode": "console.log(null == 0); // false\nconsole.log(null >= 0); // true (>= konvertuje null u 0 preko ToNumber!)",
        "otherCode": "// Java\n// Integer x = null;\n// x == 0; // Baca NullPointerException pri unboxing-u!\n// Nije moguće porediti nekompatibilne tipove bez greške kompajlera",
        "jsBehavior": "Relacioni operator `>=` konvertuje `null` u `0` preko apstraktne operacije `ToNumber()`, dok labava jednakost `==` to ne čini.",
        "otherBehavior": "Java nameće statičku proveru tipova u compile-time fazi, a unboxing null vrednosti baca NullPointerException.",
        "keyDifference": "Implicitna relacija u JS-u naspram striktnog compile-time tipiziranja u Javi.",
        "whyJsDoesThis": "Različiti algoritmi u ECMAScript specifikaciji za Abstract Equality (7.2.14) i Abstract Relational Comparison (7.2.13).",
        "jsBehaviorEn": "Relational operator `>=` coerces `null` to `0` via abstract `ToNumber()`, whereas loose `==` does not.",
        "otherBehaviorEn": "Java enforces compile-time static type checks, and unboxing null throws NullPointerException.",
        "keyDifferenceEn": "Implicit relational coercion in JS vs strict compile-time types in Java.",
        "whyJsDoesThisEn": "Separate algorithms in ECMAScript specification for Abstract Equality (7.2.14) and Abstract Relational Comparison (7.2.13)."
      }
    ],
    "titleEn": "Implicit Type Coercion and Loose Equality (==)",
    "subtitleEn": "The mysterious mechanics of +, -, == operators and the ToPrimitive algorithm",
    "summaryEn": "JavaScript is dynamically and weakly typed. When operators receive incompatible types, rather than halting execution, the runtime invokes abstract conversion algorithms (ToPrimitive, ToNumber, ToString). Mastering these exact ECMAScript rules eliminates the sense of magic and unpredictability in JS expressions."
  },
  {
    "id": "event-loop-concurrency",
    "title": "Event Loop i redovi zadataka (Task Queues)",
    "subtitle": "Jednonitni neblokirajući I/O, Microtasks naspram Macrotasks i Starvation problem",
    "category": "event-loop",
    "difficulty": "Advanced",
    "tags": [
      "Event Loop",
      "Call Stack",
      "Microtasks",
      "Promises",
      "setTimeout",
      "queueMicrotask"
    ],
    "summary": "JavaScript se izvršava u jednoj niti sa jednim Call Stack-om. Asinhronost se postiže saradnjom runtime okruženja (Browser Web APIs ili Node.js libuv) i Event Loop mehanizma koji koordiniše pražnjenje Call Stack-a, Microtask reda (Promises) i Macrotask reda (Timers/I-O).",
    "deepDive": {
      "title": "Anatomija jednog ciklusa (Tick) Event Loop-a",
      "summary": "Event Loop je beskonačna petlja koja neprekidno prati stanje Call Stack-a i raspoređuje zadatke po strogim nivoima prioriteta.",
      "keyPoints": [
        {
          "term": "1. Call Stack (Glavna programska nit)",
          "detail": "Mesto gde se sinhroni JavaScript kod izvršava funkciju po funkciju po LIFO (Last-In, First-Out) principu. Dok god na Call Stack-u postoji frejm koji se izvršava, Event Loop ne može da ubaci nijedan asinhroni zadatak.",
          "termEn": "1. Call Stack (Main Thread Execution)",
          "detailEn": "Where synchronous JavaScript executes function frames in LIFO (Last-In, First-Out) order. As long as a frame occupies the Call Stack, the Event Loop cannot process any asynchronous tasks."
        },
        {
          "term": "2. Microtask Queue (Maksimalni prioritet)",
          "detail": "U ovaj red idu Promise .then/.catch/.finally callback-ovi, async/await nastavci koda, queueMicrotask i MutationObserver. Čim se Call Stack isprazni, Event Loop ISPRAŽNJUJE CEO MICROTASK RED do poslednje stavke pre nego što pređe na bilo šta drugo!",
          "termEn": "2. Microtask Queue (Highest Priority)",
          "detailEn": "Houses Promise .then/.catch/.finally callbacks, async/await resumes, queueMicrotask, and MutationObservers. Once the Call Stack empties, the Event Loop DRAINS THE ENTIRE MICROTASK QUEUE before yielding to anything else!"
        },
        {
          "term": "3. Render faza i requestAnimationFrame",
          "detail": "Nakon što se isprazne svi microtask-ovi, browser po potrebi (npr. svakih 16.6ms za 60fps) osvežava prikaz na ekranu, pokreće rAF callback-ove i vrši proračun rasporeda (layout/paint).",
          "termEn": "3. Render Phase & requestAnimationFrame",
          "detailEn": "After microtasks drain, the browser updates display rendering if needed (e.g. every 16.6ms for 60fps), executing rAF callbacks and recalculating layout/paint."
        },
        {
          "term": "4. Macrotask / Task Queue (Nizak prioritet)",
          "detail": "U ovaj red stižu setTimeout, setInterval, setImmediate (Node), I/O operacije i korisnički klikovi. U svakom ciklusu, Event Loop uzima TAČNO JEDAN Macrotask, prebacuje ga na Call Stack, a zatim odmah proverava Microtask red ponovo.",
          "termEn": "4. Macrotask / Task Queue (Standard Priority)",
          "detailEn": "Houses setTimeout, setInterval, setImmediate (Node), I/O events, and user UI interactions. Each tick, the Event Loop executes EXACTLY ONE Macrotask, transfers it to the Call Stack, and immediately checks the Microtask queue again."
        }
      ],
      "mentalModel": "Microtask red se ponaša kao VIP propusnica sa prioritetom: ako microtask kreira novi microtask, svi oni moraju biti izvršeni pre nego što browser uopšte pogleda sledeći setTimeout!",
      "titleEn": "Anatomy of an Event Loop Tick",
      "summaryEn": "The Event Loop is a continuous process monitoring the Call Stack and dispatching tasks based on strict priority levels.",
      "mentalModelEn": "The Microtask queue acts like a VIP priority pass: if a microtask schedules another microtask, all of them must run before the browser even checks the next setTimeout!"
    },
    "ecmaSpecNote": "HTML Living Standard §8.1.6 Event loops & ECMA-262 §9.5 Jobs",
    "visualType": "event-loop",
    "codePresets": [
      {
        "id": "classic-microtask-race",
        "title": "Redosled izvršavanja Microtask vs Macrotask",
        "description": "Pratite tačan redosled sinhronog koda, setTimeout callback-a i Promise.then zadataka",
        "code": "console.log('1: Početak skripte (Sinhrono)');\n\nsetTimeout(() => {\n  console.log('2: setTimeout (Macrotask)');\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log('3: Promise 1 (Microtask)');\n}).then(() => {\n  console.log('4: Promise 2 (Microtask)');\n});\n\nqueueMicrotask(() => {\n  console.log('5: queueMicrotask (Microtask)');\n});\n\nconsole.log('6: Kraj skripte (Sinhrono)');",
        "visualType": "event-loop",
        "titleEn": "Execution Order: Microtasks vs Macrotasks",
        "descriptionEn": "Track the exact sequencing of synchronous code, setTimeout callbacks, and Promise.then tasks"
      },
      {
        "id": "nested-async-order",
        "title": "Odmotavanje toka Async/Await funkcija",
        "description": "Kako await pauzira funkciju i preostali kod raspoređuje u Microtask red",
        "code": "async function async1() {\n  console.log('async1 početak');\n  await async2();\n  console.log('async1 nastavak (Microtask)');\n}\n\nasync function async2() {\n  console.log('async2 sinhrono izvršavanje');\n}\n\nconsole.log('skripta start');\nsetTimeout(() => console.log('setTimeout callback (Macrotask)'), 0);\nasync1();\nnew Promise((resolve) => {\n  console.log('promise konstruktor (Sinhrono!)');\n  resolve();\n}).then(() => {\n  console.log('promise.then callback (Microtask)');\n});\nconsole.log('skripta kraj');",
        "visualType": "event-loop",
        "titleEn": "Unwinding Async/Await Execution Flow",
        "descriptionEn": "How await pauses function execution and queues subsequent expressions into the Microtask queue"
      }
    ],
    "comparisons": [
      {
        "title": "Izvršavanje teških proračuna bez zamrzavanja UI-ja",
        "badCode": "// ❌ RIZIČNO: Blokiranje jedine programske niti (Call Stack)\nfunction processMillionItems(items) {\n  console.log(\"Započinje težak proračun...\");\n  const start = Date.now();\n  while (Date.now() - start < 3000) {\n    // Sinhrono čekanje od 3 sekunde (busy-wait loop)\n    // Browser je potpuno zamrznut! Nema klikova, animacija, niti renderovanja!\n  }\n  console.log(\"Završeno\");\n}",
        "badExplanation": "Pošto je JS jednonitan, dugačke sinhrone petlje u potpunosti okupiraju Call Stack. Event Loop ne može da obradi renderovanje stranice, klikove korisnika niti asinhrone događaje, što dovodi do zaleđivanja interfejsa.",
        "goodCode": "// ✅ NAJBOLJA PRAKSA: Prepuštanje kontrole Event Loop-u (Yielding) ili Web Workers\nasync function processInChunks(items, chunkSize = 1000) {\n  for (let i = 0; i < items.length; i += chunkSize) {\n    // Obrada segmenta (chunk-a)\n    const chunk = items.slice(i, i + chunkSize);\n    chunk.forEach(item => /* proračun */ null);\n    \n    // Prepuštanje kontrole browser-u za render frejma i obradu događaja\n    await new Promise(resolve => setTimeout(resolve, 0));\n  }\n  console.log(\"Sve je obrađeno glatko bez zamrzavanja UI-ja\");\n}",
        "goodExplanation": "Korišćenje `setTimeout(resolve, 0)` ili `requestIdleCallback` omogućava browser-u da iscrta frejmove i odgovori na akcije korisnika između obrađenih segmenata podataka.",
        "pitfall": "Blokiranje glavne niti (Main Thread) intenzivnim CPU proračunima umesto deljenja na segmente ili korišćenja Web Workers.",
        "titleEn": "Running Heavy Computations Without Freezing the UI",
        "badExplanationEn": "Since JS is single-threaded, long synchronous loops completely occupy the Call Stack. The Event Loop cannot process page rendering, user clicks, or async events, leading to a frozen UI.",
        "goodExplanationEn": "Using `setTimeout(resolve, 0)` or `requestIdleCallback` allows the browser to paint frames and respond to user actions between processed data chunks.",
        "pitfallEn": "Blocking the main thread with heavy CPU computations instead of chunking or utilizing Web Workers."
      }
    ],
    "languageComparisons": [
      {
        "language": "Go",
        "jsCode": "// JS: Jednonitni Event Loop model\nsetTimeout(() => console.log(\"Završeno\"), 1000);\n// CPU nastavlja rad na glavnoj niti",
        "otherCode": "// Go: Višenitne preemtivne Goroutines\ngo func() {\n    time.Sleep(1 * time.Second)\n    fmt.Println(\"Završeno\")\n}()\n// Goroutine-e rade na pravim OS nitima uz M:N scheduler",
        "jsBehavior": "Jednonitni model reda događaja sa neblokirajućim I/O mehanizmom. Konkurentnost se bazira na asinhronim callback-ovima i Promise-ima.",
        "otherBehavior": "Go koristi lagane zelene niti (Goroutines) koje se paralelno raspoređuju preko višejezgarnih CPU niti uz preemtivno prebacivanje konteksta.",
        "keyDifference": "Jednonitni neblokirajući Event Loop naspram prave višenitne konkurentnosti (Goroutines).",
        "whyJsDoesThis": "Izbegava složeno zaključavanje niti (mutex/locks), trke za resursima (race conditions) i oštećenja deljene memorije u browser okruženju.",
        "jsBehaviorEn": "Single-threaded event queue model with non-blocking I/O. Concurrency is based on async callbacks and Promises.",
        "otherBehaviorEn": "Go uses lightweight green threads (Goroutines) scheduled across multi-core OS threads with preemptive context switching.",
        "keyDifferenceEn": "Single-threaded non-blocking Event Loop vs true multi-threaded preemptive concurrency (Goroutines).",
        "whyJsDoesThisEn": "Avoids complex thread locks (mutexes), race conditions, and shared memory corruption in browser environments."
      }
    ],
    "titleEn": "Event Loop & Task Queues",
    "subtitleEn": "Single-threaded non-blocking I/O, Microtasks vs Macrotasks, and Starvation",
    "summaryEn": "JavaScript executes on a single thread with a single Call Stack. Asynchronous behavior is achieved through the runtime environment (Browser Web APIs or Node.js libuv) coordinating with the Event Loop to manage the Call Stack, Microtask Queue (Promises), and Macrotask Queue (Timers/I-O)."
  },
  {
    "id": "this-context-binding",
    "title": "Ključna reč \"this\" i izvršni kontekst",
    "subtitle": "Dinamičko vezivanje, call/apply/bind metode i leksičke arrow funkcije",
    "category": "this-context",
    "difficulty": "Intermediate",
    "tags": [
      "this",
      "call",
      "apply",
      "bind",
      "Arrow Functions",
      "Context Loss"
    ],
    "summary": "Za razliku od većine jezika gde je `this` trajno vezan za instancu klase, u JavaScript-u standardna funkcija dinamički određuje `this` na osnovu načina poziva u runtime-u (Call-site). Arrow funkcije, s druge strane, uopšte nemaju sopstveni `this` već ga leksički preuzimaju iz okruženja.",
    "deepDive": {
      "title": "4 Pravila određivanja \"this\" konteksta (Rangirana po prioritetu)",
      "summary": "Kada se izvršava telo funkcije, JavaScript engine evaluira `this` prema hijerarhiji od 4 stroga pravila:",
      "keyPoints": [
        {
          "term": "1. new Vezivanje (Konstruktori - Najviši prioritet)",
          "detail": "Kada se funkcija pozove sa `new MyFunc()`, JavaScript engine kreira potpuno nov prazan objekat, postavlja mu prototip na MyFunc.prototype, vezuje `this` za taj novi objekat i vraća ga.",
          "termEn": "1. new Binding (Constructors - Highest Priority)",
          "detailEn": "Invoking `new MyFunc()` causes the JS engine to allocate a brand new empty object, set its prototype to MyFunc.prototype, bind `this` to that new instance, and return it."
        },
        {
          "term": "2. Eksplicitno vezivanje (.call, .apply, .bind)",
          "detail": "Metode .call(context, ...args) i .apply(context, [args]) odmah izvršavaju funkciju namećući specificirani context kao `this`. Metoda .bind(context) vraća novu omotanu funkciju trajno zaključanu na zadati objekat.",
          "termEn": "2. Explicit Binding (.call, .apply, .bind)",
          "detailEn": "`.call(context, ...args)` and `.apply(context, [args])` execute the function immediately forcing `context` as `this`. `.bind(context)` returns a new wrapper function permanently locked to the object."
        },
        {
          "term": "3. Implicitno vezivanje (Objekat ispred tačke)",
          "detail": "Kada se metoda pozove kao `user.getName()`, objekat neposredno ispred tačke (`user`) postaje `this`. Ako se referenca izdvoji u promenljivu (`const fn = user.getName; fn()`), implicitna veza se prekida i gubi!",
          "termEn": "3. Implicit Binding (Object Preceding Dot)",
          "detailEn": "Calling `user.getName()` sets the object directly before the dot (`user`) as `this`. Detaching the reference into a variable (`const fn = user.getName; fn()`) breaks and loses the implicit binding!"
        },
        {
          "term": "4. Podrazumevano vezivanje (Default / Fallback)",
          "detail": "Samostalan poziv funkcije `fn()` u non-strict modu vezuje `this` za globalni objekat (window ili globalThis). U modernom \"use strict\" modu, `this` bezbedno ostaje `undefined` kako bi se sprečilo zagađenje globalnog opsega.",
          "termEn": "4. Default Binding (Fallback)",
          "detailEn": "A standalone function call `fn()` in non-strict mode binds `this` to the global object (window/globalThis). In strict mode (\"use strict\"), `this` safely remains `undefined` to prevent global pollution."
        }
      ],
      "mentalModel": "Uvek locirajte tačno mesto gde se funkcija poziva u zagradama `()`. Izuzetak su Arrow funkcije: one ignorišu call-site i gledaju gde su sintaksno napisane u kodu.",
      "titleEn": "The 4 Rules of \"this\" Resolution (Ranked by Precedence)",
      "summaryEn": "When a function body executes, the JavaScript engine resolves `this` according to a strict 4-rule hierarchy:",
      "mentalModelEn": "Always locate the exact site where the function parentheses `()` are invoked. Exception: Arrow functions ignore the call-site and resolve `this` where they were lexically authored."
    },
    "ecmaSpecNote": "ECMA-262 §10.2.1.1.6 GetThisEnvironment & §14.3.8 Arrow Function Evaluation",
    "visualType": "this-binding",
    "codePresets": [
      {
        "id": "lost-context-demo",
        "title": "Klasična zamka gubitka \"this\" konteksta",
        "description": "Izdvajanje reference metode iz objekta prekida njeno implicitno this vezivanje",
        "code": "const user = {\n  name: 'Ada Lovelace',\n  greet() {\n    return 'Pozdrav, ja sam ' + this.name;\n  }\n};\n\nconsole.log('Direktan poziv:', user.greet());\n\n// Izdvajanje reference metode:\nconst detachedGreet = user.greet;\ntry {\n  console.log('Izdvojen poziv:', detachedGreet());\n} catch(e) {\n  console.log('Greška izdvojenog poziva:', e.message);\n}\n\n// Rešavanje uz eksplicitni .bind():\nconst boundGreet = user.greet.bind(user);\nconsole.log('Vezani (bound) poziv:', boundGreet());",
        "visualType": "this-binding",
        "titleEn": "The Classic \"Lost this Context\" Trap",
        "descriptionEn": "Detaching a method reference from its parent object breaks its implicit this binding"
      },
      {
        "id": "arrow-vs-regular-this",
        "title": "Arrow funkcije naspram standardnih funkcija",
        "description": "Arrow funkcije leksički preuzimaju vrednost `this` iz okružujućeg opsega u trenutku definisanja",
        "code": "const timerObj = {\n  seconds: 0,\n  regularTimer() {\n    function tick() {\n      // U non-strict modu this je window/global; u strict modu je undefined\n      console.log('Standardna funkcija this:', typeof this, this === timerObj);\n    }\n    tick();\n  },\n  arrowTimer() {\n    const tick = () => {\n      // Leksički nasleđuje this iz arrowTimer opsega\n      console.log('Arrow funkcija this:', this.seconds, this === timerObj);\n    };\n    tick();\n  }\n};\n\ntimerObj.regularTimer();\ntimerObj.arrowTimer();",
        "visualType": "this-binding",
        "titleEn": "Arrow Functions vs Regular Functions",
        "descriptionEn": "Arrow functions lexically inherit this from their enclosing scope at declaration time"
      }
    ],
    "comparisons": [
      {
        "title": "Prosleđivanje metoda objekta kao Callback funkcija",
        "badCode": "// ❌ RIZIČNO: Direktno prosleđivanje reference metode\nclass Counter {\n  count = 0;\n  increment() {\n    this.count++;\n    console.log(\"Trenutno stanje:\", this.count);\n  }\n}\n\nconst c = new Counter();\nsetTimeout(c.increment, 100); \n// Izlaz u browser-u: TypeError: Cannot read properties of undefined (this je izgubljen!)",
        "badExplanation": "`setTimeout` izvršava prosleđeni callback kao samostalnu funkciju `callback()`, resetujući `this` na globalni objekat ili undefined u strict modu.",
        "goodCode": "// ✅ NAJBOLJA PRAKSA: Korišćenje arrow polja u klasi ili eksplicitnog bind-a\nclass Counter {\n  count = 0;\n  \n  // Arrow polje klase automatski vezuje this za instancu\n  increment = () => {\n    this.count++;\n    console.log(\"Trenutno stanje:\", this.count);\n  };\n}\n\nconst c = new Counter();\nsetTimeout(c.increment, 100); // Radi besprekorno!",
        "goodExplanation": "Arrow svojstva klase vezuju se za instancu tokom inicijalizacije konstruktora, čineći ih potpuno bezbednim za prosleđivanje kao callback funkcije.",
        "pitfall": "Gubitak konteksta (this) pri prosleđivanju metoda kao event listener-a ili tajmera.",
        "titleEn": "Passing Object Methods as Callback Functions",
        "badExplanationEn": "`setTimeout` invokes the passed callback as a standalone function `callback()`, resetting `this` to the global object or undefined in strict mode.",
        "goodExplanationEn": "Class arrow properties bind to the instance during constructor initialization, making them safe to pass directly as callbacks.",
        "pitfallEn": "Losing `this` context when passing object methods as event listeners or timers."
      }
    ],
    "languageComparisons": [
      {
        "language": "Python",
        "jsCode": "const obj = {\n  val: 42,\n  getVal() { return this.val; }\n};\nconst fn = obj.getVal;\nfn(); // 'this' se gubi -> undefined ili TypeError",
        "otherCode": "# Python\nclass MyClass:\n    def __init__(self):\n        self.val = 42\n    def get_val(self):\n        return self.val\n\nobj = MyClass()\nfn = obj.get_val\nprint(fn()) # Izlaz: 42 (Bound method automatski čuva self instancu!)",
        "jsBehavior": "Metode u JS-u su obične reference na funkcije smeštene u svojstvima objekta; način poziva (call-site) diktira `this`.",
        "otherBehavior": "Python pri pristupu preko tačke automatski kreira \"Bound Method\" objekat koji trajno enkapsulira pokazivač na `self` instancu.",
        "keyDifference": "Dinamički `this` određen pozivom (JS) naspram automatski vezane instance (Python).",
        "whyJsDoesThis": "Omogućava pozajmljivanje metoda između različitih objekata preko `fn.call(otherObj)` i deljenje prototipova bez alokacije dodatnih omotača.",
        "jsBehaviorEn": "Methods in JS are plain function references stored in object properties; the call-site dictates `this`.",
        "otherBehaviorEn": "Python dot access returns a \"Bound Method\" object that encapsulates the `self` instance pointer permanently.",
        "keyDifferenceEn": "Dynamic call-site `this` (JS) vs automatically bound instance reference (Python).",
        "whyJsDoesThisEn": "Enables method borrowing across objects via `fn.call(otherObj)` and sharing prototypes without extra wrapper allocations."
      }
    ],
    "titleEn": "The \"this\" Keyword & Execution Context",
    "subtitleEn": "Dynamic binding, call/apply/bind methods, and lexical arrow functions",
    "summaryEn": "Unlike languages where `this` is permanently tied to a class instance, in JavaScript standard functions dynamically evaluate `this` based on their invocation call-site at runtime. Arrow functions, conversely, do not have their own `this` and capture it lexically from their enclosing scope."
  },
  {
    "id": "scope-hoisting-closures",
    "title": "Opseg (Scope), Hoisting i Zatvorenja (Closures)",
    "subtitle": "var naspram let/const, Temporal Dead Zone (TDZ) i leksička okruženja",
    "category": "scope-closures",
    "difficulty": "Intermediate",
    "tags": [
      "Closures",
      "Hoisting",
      "TDZ",
      "var vs let",
      "Scope Chain"
    ],
    "summary": "JavaScript koristi leksički (statički) opseg. Pre izvršavanja koda, JS engine prolazi kroz fazu kreiranja okruženja gde alocira memoriju za deklaracije. Razumevanje razlike između hoisting-a sa preinicijalizacijom (var) i Temporal Dead Zone-a (let/const) ključno je za eliminaciju skrivenih bagova.",
    "deepDive": {
      "title": "Faza kreiranja Execution Context-a i Životni ciklus vezivanja",
      "summary": "Svaki put kada se uđe u novi opseg (funkciju ili blok), JS engine kreira Environment Record i registruje promenljive u dve faze:",
      "keyPoints": [
        {
          "term": "1. Hoisting funkcija i var promenljivih",
          "detail": "Deklaracije funkcija (`function foo() {}`) se u celosti podižu na vrh i odmah postaju dostupne za poziv. Promenljive deklarisane sa `var` se takođe podižu, ali se automatski predinicijalizuju na vrednost `undefined`.",
          "termEn": "1. Function and var Hoisting",
          "detailEn": "Function declarations (`function foo() {}`) are hoisted entirely and can be called immediately. Variables declared with `var` are also hoisted, but are pre-initialized to `undefined`."
        },
        {
          "term": "2. Temporal Dead Zone (TDZ) za let i const",
          "detail": "I `let` i `const` bivaju registrovani u memoriji tokom faze kreiranja, ali OSTAJU NEINICIJALIZOVANI. Vremenski prozor od ulaska u blok do linije gde se fizički nalazi deklaracija naziva se TDZ. Svaki pokušaj čitanja promenljive u TDZ-u baca ReferenceError.",
          "termEn": "2. Temporal Dead Zone (TDZ) for let and const",
          "detailEn": "`let` and `const` are registered in memory during creation, but REMAIN UNINITIALIZED. The time gap between entering the block and evaluating the declaration line is the TDZ. Accessing them throws ReferenceError."
        },
        {
          "term": "3. Blokovski opseg (Block Scope) u petljama",
          "detail": "Za razliku od `var` koji ima funkcijski opseg i deli jednu promenljivu kroz celu for petlju, `let` unutar for petlje kreira POTPUNO NOVO leksičko vezivanje za svaku pojedinačnu iteraciju, rešavajući asinhroni problem tajmera.",
          "termEn": "3. Block Scope in Loops",
          "detailEn": "While `var` has function scope and shares a single binding across loop iterations, `let` inside a for loop creates a FRESH lexical binding for every single iteration, fixing async timer closures."
        },
        {
          "term": "4. Zatvorenja (Closures)",
          "detail": "Zatvorenje nastaje kada unutrašnja funkcija zadrži živu referencu na Environment Record svog spoljašnjeg opsega čak i nakon što je spoljašnja funkcija završila izvršavanje i skinuta sa Call Stack-a.",
          "termEn": "4. Closures",
          "detailEn": "A closure occurs when an inner function retains a reference to its outer Environment Record even after the outer function has returned and been popped from the Call Stack."
        }
      ],
      "mentalModel": "Zamišljajte `let` i `const` kao rezervisana parking mesta sa zabranom prilaza (TDZ): mesto postoji od početka bloka, ali auto ne sme da se parkira niti proveri registracija dok se ne stigne do linije deklaracije.",
      "titleEn": "Execution Context Creation Phase & Binding Lifecycle",
      "summaryEn": "Entering a new scope (function or block) initializes an Environment Record and registers variables in two phases:",
      "mentalModelEn": "Think of `let` and `const` like reserved parking spaces with a barrier (TDZ): the slot exists from the start of the block, but parking or reading the sign is forbidden until the declaration line evaluates."
    },
    "ecmaSpecNote": "ECMA-262 §9.1.1 Declarative Environment Records & §14.3.1 Let and Const Declarations",
    "visualType": "scope-hoisting",
    "codePresets": [
      {
        "id": "var-in-loops-trap",
        "title": "Čuvena zamka \"var unutar setTimeout petlje\"",
        "description": "Zašto var ispisuje 3, 3, 3 dok let ispravno ispisuje 0, 1, 2",
        "code": "console.log('--- Korišćenje var (deljeni funkcijski opseg) ---');\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log('var i:', i), 10);\n}\n\nsetTimeout(() => {\n  console.log('--- Korišćenje let (sveže blokovsko vezivanje po iteraciji) ---');\n  for (let j = 0; j < 3; j++) {\n    setTimeout(() => console.log('let j:', j), 10);\n  }\n}, 50);",
        "visualType": "scope-hoisting",
        "titleEn": "The Famous \"var inside setTimeout Loop\" Trap",
        "descriptionEn": "Why var logs 3, 3, 3 while let correctly logs 0, 1, 2"
      },
      {
        "id": "tdz-hoisting-demo",
        "title": "Temporal Dead Zone (TDZ) naspram Hoisting-a",
        "description": "Promenljive sa let/const postoje u opsegu pre linije deklaracije, ali pristup njima baca ReferenceError",
        "code": "console.log('var podignuta vrednost:', typeof hoistedVar, hoistedVar);\nvar hoistedVar = 'Ja sam inicijalizovan';\n\ntry {\n  console.log('let unutar TDZ-a:', tdzVar);\n} catch (err) {\n  console.log('Uhvaćena TDZ greška:', err.message);\n}\nlet tdzVar = 'Sada sam inicijalizovan';\nconsole.log('let nakon deklaracije:', tdzVar);",
        "visualType": "scope-hoisting",
        "titleEn": "Temporal Dead Zone (TDZ) vs Hoisting",
        "descriptionEn": "Variables with let/const exist in scope before their declaration line, but accessing them throws ReferenceError"
      }
    ],
    "comparisons": [
      {
        "title": "Deklaracija promenljivih (var naspram const/let)",
        "badCode": "// ❌ RIZIČNO: Korišćenje zastarelog 'var'\nfunction computeStats(values) {\n  if (values.length > 0) {\n    var average = 50; // \"Curi\" van if bloka!\n  }\n  console.log(\"Prosek:\", average); // 50 (dostupno van bloka!)\n  \n  for (var i = 0; i < 3; i++) {}\n  console.log(\"i je procurelo:\", i); // 3 (iscurilo u funkciju)\n}",
        "badExplanation": "Ključna reč `var` ima opseg na nivou funkcije ili globalnog objekta i potpuno ignoriše blokovske zagrade `{}`.",
        "goodCode": "// ✅ NAJBOLJA PRAKSA: Koristite const podrazumevano, let samo kod ponovne dodele\nfunction computeStats(values: number[]) {\n  let average = 0;\n  if (values.length > 0) {\n    const sum = values.reduce((a, b) => a + b, 0);\n    average = sum / values.length;\n  }\n  // sum ovde nije dostupan jer je blokovski zaštićen!\n  return average;\n}",
        "goodExplanation": "`let` i `const` imaju striktan blokovski opseg i štite kod od slučajnih curenja promenljivih i neočekivanih prepisivanja stanja.",
        "pitfall": "Nenamerno curenje promenljivih i kolizije imena usled korišćenja var.",
        "titleEn": "Variable Declarations (var vs const/let)",
        "badExplanationEn": "`var` is scoped to function or global levels and completely ignores block curly braces `{}`.",
        "goodExplanationEn": "`let` and `const` have strict block scope, protecting code against accidental variable leakage and unexpected state overwrites.",
        "pitfallEn": "Accidental variable leakage and namespace collisions caused by var."
      }
    ],
    "languageComparisons": [
      {
        "language": "Rust",
        "jsCode": "// U JS-u objekti deklarisani sa const i dalje mogu mutirati svoja svojstva!\nconst config = { port: 8080 };\nconfig.port = 9000; // Uspešno menja svojstvo!",
        "otherCode": "// U Rust-u promenljive su podrazumevano potpuno nepromenljive (immutable)\nlet config = Config { port: 8080 };\n// config.port = 9000; // Compile Error!\n// Mora se eksplicitno navesti: let mut config = ...",
        "jsBehavior": "U JS-u `const` štiti samo pokazivač promenljive na objekat, dok su unutrašnja svojstva objekta i dalje promenljiva.",
        "otherBehavior": "Rust nameće duboku nepromenljivost i na nivou memorijske vrednosti i na nivou vezivanja već u fazi kompajliranja.",
        "keyDifference": "Zaštita reference (JS) naspram duboke nepromenljivosti vrednosti (Rust).",
        "whyJsDoesThis": "Objekti u JavaScript-u su dinamičke strukture svojstava koje se prenose po referenci.",
        "jsBehaviorEn": "In JS, objects declared with const can still mutate their inner properties.",
        "otherBehaviorEn": "Rust enforces deep immutability at both value and binding levels at compile time.",
        "keyDifferenceEn": "Reference binding protection (JS) vs deep value immutability (Rust).",
        "whyJsDoesThisEn": "JavaScript objects are dynamic key-value collections passed by reference."
      }
    ],
    "titleEn": "Scope, Hoisting & Closures",
    "subtitleEn": "var vs let/const, Temporal Dead Zone (TDZ), and Lexical Environments",
    "summaryEn": "JavaScript uses lexical (static) scoping. Before execution, the engine runs an environment creation phase where memory is allocated for declarations. Understanding the difference between pre-initialized hoisting (var) and the Temporal Dead Zone (let/const) is vital to preventing bugs."
  },
  {
    "id": "prototypes-oop",
    "title": "Prototipovi, __proto__ i nasleđivanje",
    "subtitle": "Delegaciono nasleđivanje, Prototype Pollution rizik i realnost ES6 klasa",
    "category": "prototypes-oop",
    "difficulty": "Advanced",
    "tags": [
      "Prototypes",
      "__proto__",
      "Object.create",
      "Classes",
      "Inheritance",
      "Prototype Pollution"
    ],
    "summary": "JavaScript nema tradicionalne klase zasnovane na kopiranju šablona. ES6 `class` sintaksa je čist sintaksni šećer (syntactic sugar) preko prototipskog delegacionog lanca. Svaki objekat sadrži internu vezu [[Prototype]] ka drugom objektu, omogućavajući deljenje metoda uz minimalnu potrošnju memorije.",
    "deepDive": {
      "title": "Kako funkcioniše delegacioni lanac prototipova",
      "summary": "Kada zatražite svojstvo `obj.prop`, JavaScript ne traži definiciju u statičkoj klasi, već putuje uzbrdo kroz žive reference objekata.",
      "keyPoints": [
        {
          "term": "1. Čitanje svojstva i delegacija",
          "detail": "Ako svojstvo ne postoji na samom objektu, JS proverava njegov interni [[Prototype]] (`__proto__`). Pretraga se nastavlja uz lanac sve dok se svojstvo ne pronađe ili se ne dostigne terminalni `Object.prototype.[[Prototype]]` koji je `null` (u kom slučaju se vraća `undefined`).",
          "termEn": "1. Property Lookup & Delegation",
          "detailEn": "If a property does not exist on the object itself, JS checks its internal [[Prototype]] (`__proto__`). The lookup continues up the chain until found or until `Object.prototype.[[Prototype]]` (which is `null`) is reached, returning `undefined`."
        },
        {
          "term": "2. Pisanje svojstva i Zasenjivanje (Shadowing)",
          "detail": "Dodeljivanje vrednosti `obj.prop = 42` po pravilu kreira novo sopstveno (own) svojstvo direktno na instanci `obj`, ostavljajući prototip nepromenjenim. Ovo sprečava da jedna instanca slučajno pokvari podatke za sve ostale objekte.",
          "termEn": "2. Property Writing & Shadowing",
          "detailEn": "Assigning `obj.prop = 42` creates an \"own\" property directly on instance `obj`, leaving the prototype unchanged and preventing cross-instance mutation bugs."
        },
        {
          "term": "3. Konstruktori vs Instance (prototype vs __proto__)",
          "detail": "Konstruktorske funkcije i klase imaju svojstvo `.prototype` (objekat šablon koji će biti dodeljen novim instancama). Konkretne kreirane instance poseduju accessor `__proto__` koji pokazuje na taj isti objekat šablon.",
          "termEn": "3. Constructors vs Instances (prototype vs __proto__)",
          "detailEn": "Constructor functions and classes have a `.prototype` property (the blueprint object). Instances have `__proto__` pointing to that same prototype object."
        },
        {
          "term": "4. Prototype Pollution bezbednosni rizik",
          "detail": "Ukoliko neoprezno spojite neprovereni JSON unos korisnika koji sadrži ključ `__proto__`, možete mutirati globalni `Object.prototype`, menjajući ponašanje SVAKOG objekta u celoj aplikaciji!",
          "termEn": "4. Prototype Pollution Security Risk",
          "detailEn": "Merging untrusted user JSON containing `__proto__` can mutate `Object.prototype`, altering the behavior of EVERY object in the entire runtime!"
        }
      ],
      "mentalModel": "Prototipski lanac je lanac delegiranja: instanca kaže \"Ako ja nemam ovu metodu, pitaj mog roditelja. Ako ni on nema, pitaj njegovog roditelja sve do Object.prototype\".",
      "titleEn": "How Prototype Delegation Works",
      "summaryEn": "Accessing `obj.prop` travels up live object reference links rather than querying a static class definition.",
      "mentalModelEn": "The prototype chain is a delegation chain: an instance says \"If I do not have this method, ask my parent. If my parent lacks it, ask their parent up to Object.prototype\"."
    },
    "ecmaSpecNote": "ECMA-262 §10.1 Ordinary and Exotic Objects Behaviors & §20.1.2 Object Prototype",
    "visualType": "prototype",
    "codePresets": [
      {
        "id": "prototype-chain-traversal",
        "title": "Kretanje kroz lanac prototipova (Prototype Chain)",
        "description": "Pogledajte kako pretraga svojstva putuje uzbrdo kroz prototipove sve dok ne dostigne terminalni null",
        "code": "const grandParent = { familyName: 'Curie', origin: 'Poljska' };\nconst parent = Object.create(grandParent);\nparent.profession = 'Fizičar';\n\nconst child = Object.create(parent);\nchild.name = 'Irène';\n\nconsole.log('child.name =>', child.name); // Sopstveno svojstvo\nconsole.log('child.profession =>', child.profession); // Pronađeno na parent objektu\nconsole.log('child.familyName =>', child.familyName); // Pronađeno na grandparent objektu\nconsole.log('child.nonExistent =>', child.nonExistent); // Dostiže null -> undefined\n\nconsole.log('Object.getPrototypeOf(child) === parent:', Object.getPrototypeOf(child) === parent);\nconsole.log('Object.getPrototypeOf(parent) === grandParent:', Object.getPrototypeOf(parent) === grandParent);",
        "visualType": "prototype",
        "titleEn": "Prototype Chain Traversal",
        "descriptionEn": "Observe property lookup traveling up prototypes until reaching terminal null"
      },
      {
        "id": "class-vs-prototype",
        "title": "ES6 klase \"ispod haube\"",
        "description": "Klase u JS-u su zapravo konstruktorske funkcije povezane sa prototipskim objektima",
        "code": "class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    return this.name + ' se oglašava.';\n  }\n}\n\nconsole.log('typeof Animal:', typeof Animal); // \"function\"\nconsole.log('Animal.prototype.speak:', Animal.prototype.speak.toString());\n\nconst dog = new Animal('Rex');\nconsole.log('dog.__proto__ === Animal.prototype:', Object.getPrototypeOf(dog) === Animal.prototype);\nconsole.log('dog.speak():', dog.speak());",
        "visualType": "prototype",
        "titleEn": "ES6 Classes Under the Hood",
        "descriptionEn": "Classes in JS are constructor functions linked to prototype objects"
      }
    ],
    "comparisons": [
      {
        "title": "Pretraga rečnika (Object naspram Map naspram Object.create(null))",
        "badCode": "// ❌ RIZIČNO: Korišćenje običnog objekta {} za korisničke ključeve\nfunction isSafeWord(word) {\n  const dictionary = { \"apple\": true, \"banana\": true };\n  \n  // Šta ako korisnik unese \"toString\" ili \"constructor\"?\n  return dictionary[word] === true; // dictionary[\"toString\"] vraća ugrađenu funkciju toString()!\n}",
        "badExplanation": "Obični objekti nasleđuju ugrađene metode poput `toString`, `valueOf` i `constructor` sa `Object.prototype`. Provera ključeva bez `Object.hasOwn()` može izazvati lažno pozitivne rezultate ili sigurnosne ranjivosti (Prototype Pollution).",
        "goodCode": "// ✅ NAJBOLJA PRAKSA: Koristite Map ili Object.create(null)\nfunction isSafeWord(word: string) {\n  const dictionary = new Map<string, boolean>([\n    [\"apple\", true],\n    [\"banana\", true]\n  ]);\n  return dictionary.has(word);\n}\n\n// Ili čist rečnik bez prototipa:\nconst cleanDict = Object.create(null);\ncleanDict[\"apple\"] = true;\n// cleanDict[\"toString\"] je striktno undefined!",
        "goodExplanation": "`Map` ili `Object.create(null)` nemaju nasleđeni prototip, što garantuje potpuno bezbednu pretragu proizvoljnih korisničkih ključeva bez kolizija sa ugrađenim metodama.",
        "pitfall": "Kolizija prototipa i bezbednosni rizici pri korišćenju običnih objekata kao hash mapa.",
        "titleEn": "Dictionary Lookup (Object vs Map vs Object.create(null))",
        "badExplanationEn": "Plain objects inherit built-in methods like `toString` from `Object.prototype`. Checking keys without `Object.hasOwn()` can cause false positives or Prototype Pollution.",
        "goodExplanationEn": "`Map` or `Object.create(null)` have no inherited prototype, ensuring secure lookup for arbitrary user keys without built-in collisions.",
        "pitfallEn": "Prototype collision and security risks when using plain objects as hash maps."
      }
    ],
    "languageComparisons": [
      {
        "language": "Java",
        "jsCode": "// JS: Objekti mogu dinamički dodavati metode u runtime-u!\nconst dog = { name: \"Sparky\" };\ndog.bark = () => \"Av av!\";",
        "otherCode": "// Java: Klase su fiksne i nepromenljive strukture definisane u compile-time-u\nclass Dog {\n    String name;\n    // Nije moguće dinamički dodati novu metodu na instancu tokom izvršavanja\n}",
        "jsBehavior": "Objekti su dinamički memorijski skupovi svojstava sa živim pokazivačem prototipske delegacije.",
        "otherBehavior": "Java klase se kompajliraju u byte-code sa striktnim VTable mehanizmom razrešavanja metoda.",
        "keyDifference": "Prototipska delegacija i dinamička proširivost naspram klasičnog statičkog nasleđivanja.",
        "whyJsDoesThis": "Dizajniran za maksimalnu fleksibilnost pri manipulaciji DOM elementima u web browser-u bez potrebe za kompajliranjem.",
        "jsBehaviorEn": "Objects are dynamic memory property bags with a live prototype delegation pointer.",
        "otherBehaviorEn": "Java classes compile to bytecode with a strict VTable method resolution structure.",
        "keyDifferenceEn": "Prototype delegation and dynamic extension vs classical static inheritance.",
        "whyJsDoesThisEn": "Designed for flexible DOM element manipulation in web browsers without compilation steps."
      }
    ],
    "titleEn": "Prototypes, __proto__ & Inheritance",
    "subtitleEn": "Delegation inheritance, Prototype Pollution risk, and ES6 class reality",
    "summaryEn": "JavaScript lacks classical copy-based classes. ES6 `class` syntax is pure syntactic sugar over the prototype delegation chain. Every object carries an internal [[Prototype]] link to another object, facilitating memory-efficient method sharing."
  },
  {
    "id": "arrays-and-objects",
    "title": "Specifičnosti nizova, Sparse praznine i Mutacija",
    "subtitle": "Leksikografsko sortiranje, prazna mesta u nizu i duboko vs plitko kloniranje",
    "category": "arrays-objects",
    "difficulty": "Intermediate",
    "tags": [
      "Array.sort",
      "Sparse Arrays",
      "delete",
      "structuredClone",
      "Shallow Copy"
    ],
    "summary": "JavaScript nizovi su specijalizovani objekti sa numeričkim ključevima i automatskim `length` svojstvom. Podrazumevani `Array.prototype.sort()` pretvara elemente u stringove, dok brisanje elemenata operatorom `delete` stvara memorijske \"rupe\" (sparse slots) koje iteratori preskaču.",
    "deepDive": {
      "title": "Interna optimizacija nizova u V8 i mutacione zamke",
      "summary": "V8 i moderni JS engine-i optimizuju nizove u zavisnosti od njihovog sadržaja, ali određene operacije degradiraju performanse:",
      "keyPoints": [
        {
          "term": "1. V8 Element Kinds (Packed vs Holey/Sparse)",
          "detail": "Kada je niz popunjen (npr. [1, 2, 3]), V8 ga čuva u kontinualnom C++ nizu visoke brzine (PACKED_SMI_ELEMENTS). Ako kreirate prazninu sa `new Array(3)` ili `delete arr[0]`, niz prelazi u HOLEY/DICTIONARY režim koji dramatično usporava pristup.",
          "termEn": "1. V8 Element Kinds (Packed vs Holey/Sparse)",
          "detailEn": "When an array is densely populated ([1, 2, 3]), V8 stores it as a high-speed continuous C++ vector (PACKED_SMI_ELEMENTS). Creating holes via `new Array(3)` or `delete arr[0]` switches it to a slow HOLEY/DICTIONARY mode."
        },
        {
          "term": "2. Leksikografsko sortiranje po podrazumevanom",
          "detail": "Metoda `arr.sort()` bez argumenata pretvara sve elemente u UTF-16 stringove i poredi ih leksikografski. Zbog toga [10, 2, 5].sort() daje [10, 2, 5] jer string \"10\" dolazi pre \"2\". Uvek morate proslediti komparator `(a, b) => a - b`!",
          "termEn": "2. Default Lexicographical Sorting",
          "detailEn": "Calling `arr.sort()` without arguments converts elements to UTF-16 strings. Hence [10, 2, 5].sort() yields [10, 2, 5] because \"10\" precedes \"2\". Always pass a numeric comparator `(a, b) => a - b`!"
        },
        {
          "term": "3. Plitko kopiranje (Spread / Object.assign) naspram Dubokog kloniranja",
          "detail": "Spread operator `[...arr]` i `{...obj}` kopiraju samo prvi nivo svojstava. Ugnježdeni objekti se prenose po referenci. Za bezbedno duboko kloniranje koristite standardni `structuredClone(obj)` iz ES2022.",
          "termEn": "3. Shallow Copy (Spread) vs Deep Cloning",
          "detailEn": "Spread `[...arr]` and `{...obj}` copy only first-level properties. Nested objects copy by reference. For true deep cloning, use native `structuredClone(obj)`."
        },
        {
          "term": "4. Nove nepromenljive (Immutable) metode iz ES2023",
          "detail": "Metode .sort(), .reverse() i .splice() mutiraju originalni niz na mestu. Standard ES2023 je uveo nepromenljive alternative: `.toSorted()`, `.toReversed()`, `.toSpliced()` i `.with(index, value)`.",
          "termEn": "4. Modern Immutable Methods (ES2023)",
          "detailEn": "Methods like .sort(), .reverse(), and .splice() mutate arrays in place. ES2023 introduced non-mutating alternatives: `.toSorted()`, `.toReversed()`, `.toSpliced()`, and `.with(index, value)`."
        }
      ],
      "mentalModel": "Nikada ne koristite operator `delete` na nizovima (on ostavlja rupu praznog slota). Koristite `.splice()` ili filter ako želite da fizički skratite niz i sačuvate kontinualnu memoriju.",
      "titleEn": "V8 Array Optimization & Mutation Traps",
      "summaryEn": "Modern engines optimize arrays based on memory density, but certain operations degrade performance:",
      "mentalModelEn": "Never use `delete` on arrays (it leaves a sparse empty slot). Use `.splice()` or `.filter()` to resize arrays cleanly and preserve fast continuous memory."
    },
    "ecmaSpecNote": "ECMA-262 §23.1 Array Objects & §7.3.31 ArraySpeciesCreate",
    "visualType": "custom-console",
    "codePresets": [
      {
        "id": "array-sort-trap",
        "title": "Zamka podrazumevanog sort() metoda",
        "description": "Zašto [10, 2, 1, 20].sort() ne sortira brojeve po veličini",
        "code": "const numbers = [10, 2, 1, 20, 5, 100];\nconsole.log('Podrazumevani .sort() izlaz:');\nconsole.log([...numbers].sort()); \n// [\"1\", \"10\", \"100\", \"2\", \"20\", \"5\"] jer svaki broj prvo pretvara u string!\n\nconsole.log('Ispravan numerički komparator .sort((a, b) => a - b):');\nconsole.log([...numbers].sort((a, b) => a - b));",
        "visualType": "custom-console",
        "titleEn": "Default sort() Method Trap",
        "descriptionEn": "Why [10, 2, 1, 20].sort() fails to sort numbers by magnitude"
      },
      {
        "id": "sparse-arrays-holes",
        "title": "Sparse nizovi (Prazna mesta vs Undefined)",
        "description": "Array(3) kreira 3 prazna mesta. .map() i .forEach() preskaču prazna mesta!",
        "code": "const sparse = new Array(3); // 3 prazna slota (empty slots)\nconst explicit = [undefined, undefined, undefined];\n\nconsole.log('sparse niz:', sparse);\nconsole.log('eksplicitni niz:', explicit);\n\nconsole.log('sparse.map(x => 1):', sparse.map(() => 1)); // I dalje 3 prazna slota!\nconsole.log('explicit.map(x => 1):', explicit.map(() => 1)); // [1, 1, 1]\n\n// Operator \"delete\" stvara rupu u nizu!\nconst arr = [1, 2, 3];\ndelete arr[1];\nconsole.log('arr nakon delete arr[1]:', arr, 'dužina (length):', arr.length);",
        "visualType": "custom-console",
        "titleEn": "Sparse Arrays (Empty Slots vs Undefined)",
        "descriptionEn": "Array(3) creates 3 empty holes. .map() and .forEach() skip empty slots!"
      },
      {
        "id": "cloning-objects-modern",
        "title": "Kloniranje objekata: Spread naspram structuredClone",
        "description": "Poređenje plitkog spread operatora, JSON serijalizacije i modernog structuredClone API-ja",
        "code": "const original = {\n  name: 'Alex',\n  created: new Date(),\n  nested: { role: 'Admin' },\n  map: new Map([['key', 'val']])\n};\n\n// 1. Plitka kopija (Shallow Copy)\nconst shallow = { ...original };\nshallow.nested.role = 'SuperAdmin'; // Menja i original.nested podatak!\n\n// 2. Moderno duboko kloniranje (ES2022+ structuredClone)\nconst deep = structuredClone(original);\ndeep.nested.role = 'Guest';\n\nconsole.log('original.nested.role:', original.nested.role); // SuperAdmin (plitka kopija ga je izmenila)\nconsole.log('deep.nested.role:', deep.nested.role); // Guest (potpuno nezavisan objekat!)\nconsole.log('deep.created je instanca Date objekta:', deep.created instanceof Date);",
        "visualType": "custom-console",
        "titleEn": "Cloning Objects: Spread vs structuredClone",
        "descriptionEn": "Comparing shallow spread, JSON serialization, and modern structuredClone"
      }
    ],
    "comparisons": [
      {
        "title": "Sortiranje numeričkih nizova",
        "badCode": "// ❌ RIZIČNO: Pozivanje .sort() bez funkcije poređenja (komparatora)\nconst prices = [100, 25, 5, 80, 10];\nprices.sort();\nconsole.log(prices); // [10, 100, 25, 5, 80] -> Potpuno pogrešan redosled!",
        "badExplanation": "Po default-u, `Array.prototype.sort()` pretvara elemente u stringove i poredi njihove UTF-16 kodne jedinice po abecednom redu, stavljajući 100 pre 25.",
        "goodCode": "// ✅ NAJBOLJA PRAKSA: Uvek navedite eksplicitni komparator ili koristite toSorted()\nconst prices = [100, 25, 5, 80, 10];\n// U ES2023+: toSorted() vraća novi sortirani niz bez menjanja originalnog\nconst sortedPrices = prices.toSorted((a, b) => a - b);\nconsole.log(sortedPrices); // [5, 10, 25, 80, 100]",
        "goodExplanation": "Navođenjem `(a, b) => a - b` obezbeđujete pravo matematičko poređenje. Metoda `toSorted()` sprečava mutaciju originalnog niza.",
        "pitfall": "Slučajno alfabetsko sortiranje numeričkih nizova.",
        "titleEn": "Sorting Numeric Arrays",
        "badExplanationEn": "By default, `Array.prototype.sort()` converts elements to strings and compares UTF-16 code units, placing 100 before 25.",
        "goodExplanationEn": "Supplying `(a, b) => a - b` provides true numeric comparison. `toSorted()` avoids mutating the source array.",
        "pitfallEn": "Accidental alphabetical sorting of numeric arrays."
      }
    ],
    "languageComparisons": [
      {
        "language": "Python",
        "jsCode": "const list = [10, 2, 1];\nlist.sort(); // Izlaz: [1, 10, 2] (abecedno/string sortiranje)",
        "otherCode": "# Python\nlst = [10, 2, 1]\nlst.sort() # Izlaz: [1, 2, 10] (prirodno numeričko sortiranje)",
        "jsBehavior": "JS podrazumevano sortira nizove pretvarajući svaku stavku u String ukoliko nije prosleđena funkcija poređenja.",
        "otherBehavior": "Python sortira elemente na osnovu njihovih prirodnih operatora poređenja (`<`).",
        "keyDifference": "Podrazumevano string sortiranje (JS) naspram tipskog poređenja vrednosti (Python).",
        "whyJsDoesThis": "Godine 1995. nizovi su prvenstveno korišćeni za skladištenje string tokena pri manipulaciji DOM elementima.",
        "jsBehaviorEn": "JS sorts arrays by converting each item to String unless a custom comparator is provided.",
        "otherBehaviorEn": "Python sorts elements based on their natural comparison operators (`<`).",
        "keyDifferenceEn": "Default string sorting (JS) vs natural typed value comparison (Python).",
        "whyJsDoesThisEn": "In 1995 arrays primarily stored string tokens when manipulating DOM elements."
      }
    ],
    "titleEn": "Array Quirks, Sparse Holes & Mutation",
    "subtitleEn": "Lexicographical sorting, sparse array slots, and deep vs shallow cloning",
    "summaryEn": "JavaScript arrays are specialized objects with numeric keys and an automatic `length` property. The default `Array.prototype.sort()` converts elements to strings, while removing items with the `delete` operator creates empty \"holes\" (sparse slots) that iterators skip."
  },
  {
    "id": "floating-point-numbers",
    "title": "Matematika sa pokretnim zarezom i BigInt preciznost",
    "subtitle": "IEEE 754 standard, MAX_SAFE_INTEGER granica i razlika između -0 i +0",
    "category": "math-numbers",
    "difficulty": "Intermediate",
    "tags": [
      "IEEE 754",
      "0.1 + 0.2",
      "BigInt",
      "MAX_SAFE_INTEGER",
      "Infinity",
      "-0"
    ],
    "summary": "Svi standardni brojevi u JavaScript-u čuvaju se kao 64-bitni brojevi sa pokretnim zarezom dvostruke tačnosti u skladu sa IEEE 754 standardom. Pošto se decimalni razlomci u bazi 10 (poput 0.1 i 0.2) u binarnom sistemu pretvaraju u beskonačne ponavljajuće periode, javljaju se minimalna odstupanja pri proračunu.",
    "deepDive": {
      "title": "IEEE 754 format i granice bezbedne celobrojne matematike",
      "summary": "Struktura svakog 64-bitnog broja (Double Precision) u JavaScript memoriji:",
      "keyPoints": [
        {
          "term": "1. Memorijska struktura: 1 bit znaka + 11 bita eksponenta + 52 bita frakcije",
          "detail": "Zbog 52 bita mantise, JavaScript može savršeno precizno da predstavi cele brojeve u rasponu od -(2^53 - 1) do +(2^53 - 1). Ovaj maksimum definisan je konstantom `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991).",
          "termEn": "1. Memory Layout: 1 sign bit + 11 exponent bits + 52 fraction bits",
          "detailEn": "With 52 mantissa bits, JavaScript can represent integers precisely within [-(2^53 - 1), +(2^53 - 1)]. This limit is defined by `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991)."
        },
        {
          "term": "2. Zašto je 0.1 + 0.2 === 0.30000000000000004",
          "detail": "U bazi 2, broj 0.1 je beskonačni binarni period: 0.0001100110011... Kada se iseče na 53 bita preciznosti, dolazi do blagog zaokruživanja na gore. Zbog toga se poređenje decimala nikada ne radi sa `===`, već uz toleranciju `Math.abs(a - b) < Number.EPSILON`.",
          "termEn": "2. Why 0.1 + 0.2 === 0.30000000000000004",
          "detailEn": "In base-2, 0.1 is an infinite binary repeating fraction: 0.0001100110011... Truncating at 53 bits rounds slightly upwards. Never compare decimals with `===`; use `Math.abs(a - b) < Number.EPSILON`."
        },
        {
          "term": "3. Prekoračenje granice i BigInt rešenje",
          "detail": "Iznad MAX_SAFE_INTEGER, susedni celi brojevi dele isti binarni obrazac, pa `MAX_SAFE_INTEGER + 1 === MAX_SAFE_INTEGER + 2` vraća true! Za 64-bitne baze podataka (ID-jevi, hash-evi, kriptovalute) mora se koristiti tip `BigInt` (npr. `1234567890123456789n`).",
          "termEn": "3. Integer Overflow & The BigInt Solution",
          "detailEn": "Above MAX_SAFE_INTEGER, adjacent integers share the same binary representation, causing `MAX_SAFE_INTEGER + 1 === MAX_SAFE_INTEGER + 2` to evaluate to true! For 64-bit database IDs, hashes, or cryptography, use `BigInt` (e.g. `1234567890123456789n`)."
        },
        {
          "term": "4. Znak nule (-0 naspram +0)",
          "detail": "Zbog odvojenog bita za znak, JS podržava i pozitivnu i negativnu nulu: `+0 === -0` je true, ali `1 / +0` daje `Infinity` dok `1 / -0` daje `-Infinity`! Za razlikovanje koristite `Object.is(+0, -0)` koji vraća false.",
          "termEn": "4. Signed Zero (-0 vs +0)",
          "detailEn": "Due to the sign bit, JS supports both +0 and -0: `+0 === -0` is true, but `1 / +0` yields `Infinity` while `1 / -0` yields `-Infinity`! Distinguish them with `Object.is(+0, -0)` which returns false."
        }
      ],
      "mentalModel": "Za novac i finansijske transakcije NIKADA ne čuvajte evre/dinare u decimalama—čuvajte novac u parama/centima kao cele brojeve (integers) ili koristite namensku decimalnu biblioteku.",
      "titleEn": "IEEE 754 Format & Safe Integer Boundaries",
      "summaryEn": "Memory layout of every 64-bit Double Precision number in JavaScript:",
      "mentalModelEn": "For financial calculations, NEVER store money as floating decimals—store currency in cents/cents as integers or use a dedicated decimal library."
    },
    "ecmaSpecNote": "ECMA-262 §6.1.6.1 Number Type & §6.1.6.2 BigInt Type",
    "visualType": "custom-console",
    "codePresets": [
      {
        "id": "float-math-demo",
        "title": "Problem preciznosti: 0.1 + 0.2",
        "description": "Saznajte zašto binarni format pokretnog zareza daje 0.30000000000000004",
        "code": "console.log('0.1 + 0.2 === 0.3 =>', 0.1 + 0.2 === 0.3); // false\nconsole.log('0.1 + 0.2 stvarna vrednost =>', 0.1 + 0.2); // 0.30000000000000004\n\n// Ispravno poređenje decimalnih brojeva uz Number.EPSILON:\nfunction areAlmostEqual(a, b) {\n  return Math.abs(a - b) < Number.EPSILON;\n}\nconsole.log('areAlmostEqual(0.1 + 0.2, 0.3) =>', areAlmostEqual(0.1 + 0.2, 0.3)); // true",
        "visualType": "custom-console",
        "titleEn": "Precision Pitfall: 0.1 + 0.2",
        "descriptionEn": "Learn why binary floating point arithmetic yields 0.30000000000000004"
      },
      {
        "id": "max-safe-int-demo",
        "title": "Number.MAX_SAFE_INTEGER i BigInt",
        "description": "Prekoračenje granice 2^53 - 1 gubi preciznost bez ikakve greške. BigInt rešava ovaj problem.",
        "code": "const maxSafe = Number.MAX_SAFE_INTEGER; // 9007199254740991 (2^53 - 1)\nconsole.log('MAX_SAFE_INTEGER:', maxSafe);\nconsole.log('maxSafe + 1 === maxSafe + 2:', maxSafe + 1 === maxSafe + 2); // true!\n\n// Rešenje: Koristite BigInt za proizvoljno velike cele brojeve (ID-jevi, kriptografija, finansije)\nconst bigA = 9007199254740991n;\nconsole.log('bigA + 1n === bigA + 2n:', bigA + 1n === bigA + 2n); // false (tačno i precizno!)\nconsole.log('bigA + 100n:', (bigA + 100n).toString());",
        "visualType": "custom-console",
        "titleEn": "Number.MAX_SAFE_INTEGER & BigInt",
        "descriptionEn": "Exceeding 2^53 - 1 loses precision silently. BigInt resolves this completely."
      }
    ],
    "comparisons": [
      {
        "title": "Obrada novčanih i finansijskih transakcija",
        "badCode": "// ❌ RIZIČNO: Korišćenje običnih decimalnih brojeva za novac\nfunction calculateCartTotal(pricePerItem, quantity, taxRate) {\n  const subtotal = pricePerItem * quantity; // npr. 19.99 * 3 = 59.970000000000006\n  const total = subtotal + (subtotal * taxRate);\n  return total; // 64.76760000000001\n}",
        "badExplanation": "Greške zaokruživanja u formatu pokretnog zareza stvaraju odstupanja u parama i centima, što može dovesti do netačnih finansijskih obračuna.",
        "goodCode": "// ✅ NAJBOLJA PRAKSA: Čuvajte novac u celim jedinicama (parama/centima) ili namenskoj biblioteci\nfunction calculateCartTotal(priceInCents: number, quantity: number, taxBasisPoints: number) {\n  const subtotalCents = priceInCents * quantity;\n  const taxCents = Math.round((subtotalCents * taxBasisPoints) / 10000);\n  const totalCents = subtotalCents + taxCents;\n  \n  return {\n    totalCents,\n    formatted: (totalCents / 100).toFixed(2)\n  };\n}",
        "goodExplanation": "Rad sa celim brojevima (npr. centi ili pare umesto dinara/evra) eliminiše greške zaokruživanja binarnog pokretnog zareza.",
        "pitfall": "Direktno korišćenje decimalnih brojeva za proračune novčanih iznosa.",
        "titleEn": "Financial and Currency Calculations",
        "badExplanationEn": "Floating-point rounding errors create fractional cents discrepancies, resulting in incorrect financial balances.",
        "goodExplanationEn": "Working with integer cents (or specific decimal libraries) eliminates binary floating-point rounding errors.",
        "pitfallEn": "Directly using floating-point decimals for monetary calculations."
      }
    ],
    "languageComparisons": [
      {
        "language": "Rust",
        "jsCode": "// U JS-u svi brojevi su podrazumevano 64-bitni float\nconst x = 5 / 2; // Izlaz: 2.5",
        "otherCode": "// U Rust-u celobrojno deljenje zadržava celobrojni tip\nlet x: i32 = 5 / 2; // Izlaz: 2 (odsečeno)\nlet y: f64 = 5.0 / 2.0; // Izlaz: 2.5",
        "jsBehavior": "Svi osnovni brojevi u JS-u su IEEE 754 64-bitni float dvostruke tačnosti.",
        "otherBehavior": "Rust ima striktno definisane mašinske tipove: i8, u32, i64, f32, f64, isize.",
        "keyDifference": "Univerzalni float64 tip (JS) naspram eksplicitnih primitivnih mašinskih tipova (Rust).",
        "whyJsDoesThis": "Dizajniran jednostavno kako početnici ne bi morali da brinu o prelivanju celih brojeva ili širini memorijskih registara.",
        "jsBehaviorEn": "All standard numbers in JS are IEEE 754 64-bit double precision floats.",
        "otherBehaviorEn": "Rust features strictly typed machine primitives: i8, u32, i64, f32, f64, isize.",
        "keyDifferenceEn": "Universal float64 type (JS) vs explicit primitive machine types (Rust).",
        "whyJsDoesThisEn": "Designed simply so beginners wouldn't have to deal with integer overflows or register bit-widths."
      }
    ],
    "titleEn": "Floating-Point Math & BigInt Precision",
    "subtitleEn": "IEEE 754 standard, MAX_SAFE_INTEGER limits, and the difference between -0 and +0",
    "summaryEn": "All standard numbers in JavaScript are stored as 64-bit double-precision floating point numbers adhering to the IEEE 754 standard. Because base-10 fractions (such as 0.1 and 0.2) convert into infinite repeating binary expansions, minimal rounding discrepancies occur."
  },
  {
    "id": "syntax-asi-traps",
    "title": "Automatsko umetanje tačka-zapete (ASI) i sintaksne zamke",
    "subtitle": "Problem novog reda nakon return-a, opasnosti sa zagradama i operator zareza",
    "category": "syntax-asi",
    "difficulty": "Intermediate",
    "tags": [
      "ASI",
      "Semicolons",
      "return newline",
      "Syntax",
      "Comma Operator"
    ],
    "summary": "JavaScript poseduje mehanizam Automatic Semicolon Insertion (ASI) koji automatski umeće tačka-zarez na mestima preloma linija kada bi kod inače izazvao sintaksnu grešku. Međutim, kod \"ograničenih produkcija\" (restricted productions) poput `return`, novi red automatski prekida naredbu i tiho vraća `undefined`.",
    "deepDive": {
      "title": "Pravila ASI mehanizma i rizične sintaksne konstrukcije",
      "summary": "ECMA-262 specifikacija nalaže 3 osnovna pravila za umetanje tačka-zapete:",
      "keyPoints": [
        {
          "term": "1. Ograničene produkcije (Restricted Productions)",
          "detail": "Nije dozvoljen prelom linije (LineTerminator) neposredno nakon ključnih reči: `return`, `throw`, `yield`, `break`, `continue`, kao ni ispred postfiks operatora `++` i `--`. Ako prelomite red: `return\\n { a: 1 }`, JS automatski umeće `;` iza return-a i funkcija vraća undefined.",
          "termEn": "1. Restricted Productions",
          "detailEn": "No line terminator is permitted immediately after keywords: `return`, `throw`, `yield`, `break`, `continue`, or before `++` and `--`. Breaking the line (`return\\n { a: 1 }`) causes JS to insert a semicolon after `return`, returning undefined."
        },
        {
          "term": "2. Opasnost linija koje počinju zagradama ( [ i ( )",
          "detail": "Ako pišete kod bez tačka-zapete, a naredni red počinje sa `(` ili `[`, JavaScript NEĆE umetnuti `;`, već će protumačiti novi red kao poziv funkcije ili indeksiranje niza nad prethodnim izrazom: `a = b\\n(function(){})()` postaje `a = b(function(){})()` i baca TypeError!",
          "termEn": "2. Hazard with Lines Starting with ( or [",
          "detailEn": "Without semicolons, if the next line starts with `(` or `[`, JS will NOT insert `;`. It parses the line as a function call or property access on the previous line, throwing a TypeError!"
        },
        {
          "term": "3. Operator zareza (Comma Operator)",
          "detail": "Operator zarez `(expr1, expr2)` evaluira oba izraza s leva na desno i vraća vrednost POSLEDNJEG izraza. Na primer: `let x = (1, 2, 3);` dodeljuje vrednost 3 promenljivoj `x`.",
          "termEn": "3. Comma Operator",
          "detailEn": "The comma operator `(expr1, expr2)` evaluates both operands left-to-right and returns the value of the LAST expression. E.g., `let x = (1, 2, 3);` sets x to 3."
        },
        {
          "term": "4. Zatvorena vitičasta zagrada } i kraj fajla",
          "detail": "ASI takođe automatski umeće `;` ispred zatvorene vitičaste zagrade `}` bloka ili na samom kraju skripte ukoliko je tačka-zarez izostavljena.",
          "termEn": "4. Closing Curly Braces } and End of File",
          "detailEn": "ASI automatically inserts a semicolon before a closing curly brace `}` or at the end of the script."
        }
      ],
      "mentalModel": "Ako izostavljate tačka-zarez, nikada ne počinjite novi red sa `[`, `(`, `/` (regex), ili `` ` `` (template literal), i uvek držite otvorenu zagradu `{` u istoj liniji sa ključnom reči `return`.",
      "titleEn": "ASI Rules & Syntax Pitfalls",
      "summaryEn": "The ECMA-262 specification governs 3 primary rules for semicolon insertion:",
      "mentalModelEn": "If omitting semicolons, never start a line with `[`, `(`, `/` (regex), or `` ` ``, and always keep the opening brace `{` on the same line as `return`."
    },
    "ecmaSpecNote": "ECMA-262 §12.9 Automatic Semicolon Insertion",
    "visualType": "custom-console",
    "codePresets": [
      {
        "id": "return-asi-trap",
        "title": "Zamka novog reda nakon ključne reči return",
        "description": "Zašto postavljanje objekta u novi red ispod return naredbe vraća undefined",
        "code": "function badGetConfig() {\n  return\n  {\n    status: 'active'\n  };\n}\n\nfunction goodGetConfig() {\n  return {\n    status: 'active'\n  };\n}\n\nconsole.log('badGetConfig() izlaz =>', badGetConfig()); // undefined! (jer je JS dodao ; odmah iza return)\nconsole.log('goodGetConfig() izlaz =>', goodGetConfig()); // { status: \"active\" }",
        "visualType": "custom-console",
        "titleEn": "The return Newline Trap",
        "descriptionEn": "Why placing an object on a new line below return yields undefined"
      },
      {
        "id": "parenthesis-hazard",
        "title": "Opasnost linija koje počinju zagradama ( i [",
        "description": "Ukoliko izostavljate tačka-zarez, linije koje počinju sa ( ili [ tumače se kao pozivi prethodne linije",
        "code": "const a = 1 + 2\nconst b = 3\n\n// Ako se kod napiše bez tačka-zapete:\n// let x = a + b\n// (function() {})()\n// JS ovo tumači kao: let x = (a + b)(function() {})() -> TypeError: (a + b) is not a function!\n\nconsole.log('Uvek budite oprezni sa linijama koje počinju sa ( ili [ ako izostavljate tačka-zarez.');",
        "visualType": "custom-console",
        "titleEn": "Hazard with Lines Starting with ( and [",
        "descriptionEn": "When semicolons are omitted, lines starting with ( or [ are parsed as calls on previous expressions"
      }
    ],
    "comparisons": [
      {
        "title": "Završetak naredbi i višelinijski return",
        "badCode": "// ❌ RIZIČNO: Razdvajanje return-a i vrednosti u novi red\nfunction createUser(name) {\n  return\n    {\n      id: Math.random(),\n      name: name\n    };\n}",
        "badExplanation": "ASI pravilo nalaže da se iza `return` naredbe na prelomu reda automatski umetne tačka-zarez (`return;`), dok objekat ispod ostaje nedostižan kod.",
        "goodCode": "// ✅ NAJBOLJA PRAKSA: Zadržite otvorenu vitičastu zagradu u istoj liniji ili obuhvatite običnim zagradama\nfunction createUser(name: string) {\n  return {\n    id: Math.random(),\n    name: name\n  };\n  \n  // Ili u JSX-u:\n  // return (\n  //   <div>...</div>\n  // );\n}",
        "goodExplanation": "Postavljanjem otvorene zagrade `{` ili `(` u istu liniju sa `return` sprečava se automatsko umetanje tačka-zapete.",
        "pitfall": "Skriveni bagovi gde funkcija tiho vraća undefined usled prelomljenog reda.",
        "titleEn": "Statement Termination & Multiline Return",
        "badExplanationEn": "ASI rules mandate that a newline following `return` automatically inserts a semicolon (`return;`), leaving the object below as unreachable dead code.",
        "goodExplanationEn": "Placing the opening brace `{` or parenthesis `(` on the same line as `return` prevents automatic semicolon insertion.",
        "pitfallEn": "Hidden bugs where functions silently return undefined due to a line break."
      }
    ],
    "languageComparisons": [
      {
        "language": "Python",
        "jsCode": "// U JS-u uvlačenje nije bitno, ali ASI reaguje na nove redove\nfunction test() {\n  return\n  42;\n}\nconsole.log(test()); // undefined",
        "otherCode": "# U Python-u uvlačenje (indentation) definiše blokove\ndef test():\n    return (\n        42\n    )\nprint(test()) # Izlaz: 42",
        "jsBehavior": "Sintaksa sa vitičastim zagradama C stila uz heurističko automatsko umetanje tačka-zapete.",
        "otherBehavior": "Python koristi gramatiku baziranu na uvlačenju redova i eksplicitnom nastavljanju izraza kroz otvorene zagrade.",
        "keyDifference": "ASI heuristika (JS) naspram gramatike uvlačenja koda (Python).",
        "whyJsDoesThis": "Kako bi tačka-zarez bio opcionalan za početnike, uz zadržavanje sintakse slične jezicima C i Java.",
        "jsBehaviorEn": "C-style brace syntax combined with heuristic automatic semicolon insertion.",
        "otherBehaviorEn": "Python relies on an indentation-based grammar with explicit expression continuation.",
        "keyDifferenceEn": "ASI heuristics (JS) vs indentation grammar (Python).",
        "whyJsDoesThisEn": "To make semicolons optional for newcomers while maintaining a syntax familiar to C and Java programmers."
      }
    ],
    "titleEn": "Automatic Semicolon Insertion (ASI) & Syntax Traps",
    "subtitleEn": "The return newline trap, parenthesis hazards, and the comma operator",
    "summaryEn": "JavaScript features Automatic Semicolon Insertion (ASI), automatically placing semicolons at line breaks where code would otherwise produce syntax errors. However, restricted productions like `return` treat a subsequent newline as an immediate statement terminator, silently returning `undefined`."
  }
];

export const JS_TOPICS: JSTopic[] = RAW_TOPICS.map((topic) => ({
  ...topic,
  chapterGuide: CHAPTER_GUIDES[topic.id] || topic.chapterGuide
}));
