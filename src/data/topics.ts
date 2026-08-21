import { JSTopic } from '../types';

export const JS_TOPICS: JSTopic[] = [
  {
    id: 'type-coercion-equality',
    title: 'Implicitna konverzija tipova i labava jednakost (==)',
    subtitle: 'Misteriozni mehanizmi operatora +, -, == i ToPrimitive algoritma',
    category: 'type-coercion',
    difficulty: 'Intermediate',
    tags: ['Coercion', 'Type Casting', '== vs ===', 'ToPrimitive', 'JSFuck'],
    summary: 'JavaScript je dinamički i slabo tipiziran jezik. Kada operatori prime nespojive tipove podataka, umesto rušenja programa runtime automatski pokreće apstraktne algoritme konverzije (ToPrimitive, ToNumber, ToString). Razumevanje ovih preciznih ECMAScript pravila uklanja osećaj "magije" ili nepredvidivosti u JS izrazima.',
    deepDive: {
      title: 'Kako JavaScript konvertuje tipove „ispod haube”',
      summary: 'Kada se izvršava operacija između različitih tipova (npr. sabiranje ili poređenje jednakosti), JavaScript agregira operande kroz striktan niz koraka definisanih u ECMA-262 specifikaciji.',
      keyPoints: [
        {
          term: 'ToPrimitive(input, preferredType) algoritam',
          detail: 'Ako je operand objekat ili niz, JS prvo traži Symbol.toPrimitive metodu. Ako ona ne postoji, poziva .valueOf(), a ukoliko on ne vrati primitivnu vrednost, poziva .toString(). Za nizove, [1, 2].toString() daje "1,2", dok za prazan niz [].toString() vraća prazan string "".'
        },
        {
          term: 'Preopterećeni operator sabiranja (+)',
          detail: 'Operator + je jedini aritmetički operator koji vrši i matematičko sabiranje i konkatenaciju stringova. Pravilo glasi: ako je makar jedan operand nakon ToPrimitive operacije String, vrši se spajanje stringova. Svi ostali operatori (-, *, /, %) bezuslovno konvertuju oba operanda u Number preko ToNumber().'
        },
        {
          term: 'Labava jednakost (==) naspram Striktne (===)',
          detail: 'Striktna jednakost (===) odmah vraća false ako se tipovi razlikuju. Labava jednakost (==) prati 11 koraka: npr. ako poredi Number i Boolean, Boolean se prvo pretvara u Number (true -> 1, false -> 0). Izraz [] == ![] je true jer ![] prvo postaje false, a zatim se [] i false konvertuju u brojeve: 0 == 0 -> true.'
        },
        {
          term: 'Specijalni slučaj: null i undefined',
          detail: 'U labavoj jednakosti (==), null i undefined su jednaki isključivo jedno drugom i ničemu drugom (null == undefined je true, ali null == 0 je false). Međutim, relacioni operatori (>=, <=) konvertuju null u 0 preko ToNumber, zbog čega je null >= 0 true!'
        }
      ],
      mentalModel: 'Zamišljajte JS operatore kao filtere: operator + preferira String ukoliko naiđe na tekst, dok matematički operatori (-, *, /) i relacije (>, <, >=) agresivno forsiraju Number pretvaranje preko ToNumber.'
    },
    ecmaSpecNote: 'ECMA-262 §7.1 Type Conversion & §7.2.14 Abstract Equality Comparison',
    visualType: 'coercion',
    codePresets: [
      {
        id: 'coercion-math',
        title: 'Matematička i String konverzija',
        description: 'Uočite razliku između preopterećenog operatora + i numeričkih operatora (-, *, /)',
        code: `console.log('"5" + 3  =>', "5" + 3);  // String konkatenacija -> "53"
console.log('"5" - 3  =>', "5" - 3);  // Konvertuje u number -> 2
console.log('"5" * "2" =>', "5" * "2"); // 10
console.log('true + 1  =>', true + 1); // true postaje 1 -> 2
console.log('null + 1  =>', null + 1); // null postaje 0 -> 1
console.log('undefined + 1 =>', undefined + 1); // undefined postaje NaN -> NaN`,
        visualType: 'coercion'
      },
      {
        id: 'coercion-arrays-objects',
        title: 'Nizovi i objekti u aritmetici',
        description: 'Kako se objekti i nizovi razrešavaju preko metoda .valueOf() i .toString()',
        code: `console.log('[] + []       =>', JSON.stringify([] + [])); // ""
console.log('[] + {}       =>', [] + {}); // "[object Object]"
console.log('[1, 2] + [3]  =>', [1, 2] + [3]); // "1,23"
console.log('+[]           =>', +[]); // Unarni plus konvertuje prazan niz u 0
console.log('+!+[]         =>', +!+[]); // 1
console.log('!+[] + !+[]   =>', !+[] + !+[]); // 2`,
        visualType: 'coercion'
      },
      {
        id: 'loose-vs-strict',
        title: 'Labava (==) naspram Striktne (===) jednakosti',
        description: 'Zašto je 0 == false tačno, null == undefined tačno, a null == false netačno',
        code: `console.log('0 == false       =>', 0 == false); // true
console.log('"" == false      =>', "" == false); // true
console.log('[] == false      =>', [] == false); // true
console.log('[] == ![]        =>', [] == ![]); // true!
console.log('null == undefined=>', null == undefined); // true
console.log('null == 0        =>', null == 0); // false
console.log('NaN === NaN      =>', NaN === NaN); // false
console.log('Object.is(NaN, NaN) =>', Object.is(NaN, NaN)); // true`,
        visualType: 'coercion'
      }
    ],
    comparisons: [
      {
        title: 'Provera jednakosti (Labava == naspram Striktne ===)',
        badCode: `// ❌ RIZIČNO: Korišćenje labave jednakosti (==)
function checkDiscount(couponCode) {
  // Ako korisnik unese 0 ili false, labava jednakost pravi neočekivane propuste!
  if (couponCode == false) {
    console.log("Kupon nije primenjen");
  }
  
  const total = "100";
  if (total == 100) { // Prolazi iako su tipovi različiti (string i number)
    return Number(total) * 0.9;
  }
}`,
        badExplanation: 'Labava jednakost (==) prolazi kroz 11 koraka apstraktnog algoritma konverzije. Poređenja "" == 0, [] == false ili "0" == false daju true, što stvara skrivene sigurnosne i logičke bug-ove.',
        goodCode: `// ✅ NAJBOLJA PRAKSA: Uvek koristite striktnu jednakost (===) i eksplicitnu konverziju
function checkDiscount(couponCode: string | null) {
  if (couponCode === null || couponCode === "") {
    console.log("Kupon nije primenjen");
    return;
  }
  
  const total = 100;
  if (typeof total === "number" && total === 100) {
    return total * 0.9;
  }
}`,
        goodExplanation: 'Striktna jednakost (===) nikada ne vrši konverziju tipova. Ukoliko tipovi nisu identični, odmah vraća false bez ikakvih sporednih efekata.',
        pitfall: 'Implicitna konverzija tipova u uslovima (if) koja dovodi do pogrešnih truthy/falsy evaluacija.'
      },
      {
        title: 'Parsiranje i validacija brojeva',
        badCode: `// ❌ RIZIČNO: Globalna funkcija isNaN()
console.log(isNaN("hello")); // true
console.log(isNaN(undefined)); // true (prvo konvertuje undefined u NaN!)
console.log(isNaN({})); // true`,
        badExplanation: 'Globalna funkcija `isNaN()` prvo prinudno konvertuje argument u Number pre provere. Zato `isNaN("hello")` ili `isNaN({})` vraćaju `true` iako same vrednosti u startu nisu tipa `NaN`.',
        goodCode: `// ✅ NAJBOLJA PRAKSA: Koristite Number.isNaN() ili Number.isFinite()
console.log(Number.isNaN("hello")); // false (nema prinudne konverzije!)
console.log(Number.isNaN(NaN)); // true
console.log(Number.isFinite(123)); // true
console.log(Number.isFinite("123")); // false (striktno proverava i tip)`,
        goodExplanation: 'Metoda `Number.isNaN()` uvedena u ES6 standardu striktno proverava da li je prosleđena vrednost tipa Number i jednaka `NaN`, bez ikakve implicitne konverzije.',
        pitfall: 'Slučajno korišćenje globalne isNaN() funkcije za validaciju korisničkog unosa.'
      }
    ],
    languageComparisons: [
      {
        language: 'Python',
        jsCode: `console.log("5" + 3);  // Izlaz: "53"
console.log("5" - 3);  // Izlaz: 2
console.log([] == false); // Izlaz: true`,
        otherCode: `# Python
print("5" + 3)  # TypeError: can only concatenate str to str
print("5" - 3)  # TypeError: unsupported operand type(s)
print([] == False) # Izlaz: False (striktno poređenje vrednosti/identiteta)`,
        jsBehavior: 'JavaScript automatski vrši konverziju tipova operanada kako bi sprečio rušenje skripte u ranim browser-ima.',
        otherBehavior: 'Python je strogo tipiziran jezik koji zabranjuje implicitne aritmetičke operacije između stringova i brojeva.',
        keyDifference: 'Dinamički + Slabo tipiziran (JS) naspram Dinamički + Strogo tipiziran (Python).',
        whyJsDoesThis: 'Kreiran za 10 dana 1995. godine za Netscape Navigator, dizajniran da bude tolerantan prema greškama kako skripte ne bi rušile web stranice.'
      },
      {
        language: 'Java',
        jsCode: `console.log(null == 0); // false
console.log(null >= 0); // true (>= konvertuje null u 0 preko ToNumber!)`,
        otherCode: `// Java
// Integer x = null;
// x == 0; // Baca NullPointerException pri unboxing-u!
// Nije moguće porediti nekompatibilne tipove bez greške kompajlera`,
        jsBehavior: 'Relacioni operator `>=` konvertuje `null` u `0` preko apstraktne operacije `ToNumber()`, dok labava jednakost `==` to ne čini.',
        otherBehavior: 'Java nameće statičku proveru tipova u compile-time fazi, a unboxing null vrednosti baca NullPointerException.',
        keyDifference: 'Implicitna relacija u JS-u naspram striktnog compile-time tipiziranja u Javi.',
        whyJsDoesThis: 'Različiti algoritmi u ECMAScript specifikaciji za Abstract Equality (7.2.14) i Abstract Relational Comparison (7.2.13).'
      }
    ]
  },
  {
    id: 'event-loop-concurrency',
    title: 'Event Loop i redovi zadataka (Task Queues)',
    subtitle: 'Jednonitni neblokirajući I/O, Microtasks naspram Macrotasks i Starvation problem',
    category: 'event-loop',
    difficulty: 'Advanced',
    tags: ['Event Loop', 'Call Stack', 'Microtasks', 'Promises', 'setTimeout', 'queueMicrotask'],
    summary: 'JavaScript se izvršava u jednoj niti sa jednim Call Stack-om. Asinhronost se postiže saradnjom runtime okruženja (Browser Web APIs ili Node.js libuv) i Event Loop mehanizma koji koordiniše pražnjenje Call Stack-a, Microtask reda (Promises) i Macrotask reda (Timers/I-O).',
    deepDive: {
      title: 'Anatomija jednog ciklusa (Tick) Event Loop-a',
      summary: 'Event Loop je beskonačna petlja koja neprekidno prati stanje Call Stack-a i raspoređuje zadatke po strogim nivoima prioriteta.',
      keyPoints: [
        {
          term: '1. Call Stack (Glavna programska nit)',
          detail: 'Mesto gde se sinhroni JavaScript kod izvršava funkciju po funkciju po LIFO (Last-In, First-Out) principu. Dok god na Call Stack-u postoji frejm koji se izvršava, Event Loop ne može da ubaci nijedan asinhroni zadatak.'
        },
        {
          term: '2. Microtask Queue (Maksimalni prioritet)',
          detail: 'U ovaj red idu Promise .then/.catch/.finally callback-ovi, async/await nastavci koda, queueMicrotask i MutationObserver. Čim se Call Stack isprazni, Event Loop ISPRAŽNJUJE CEO MICROTASK RED do poslednje stavke pre nego što pređe na bilo šta drugo!'
        },
        {
          term: '3. Render faza i requestAnimationFrame',
          detail: 'Nakon što se isprazne svi microtask-ovi, browser po potrebi (npr. svakih 16.6ms za 60fps) osvežava prikaz na ekranu, pokreće rAF callback-ove i vrši proračun rasporeda (layout/paint).'
        },
        {
          term: '4. Macrotask / Task Queue (Nizak prioritet)',
          detail: 'U ovaj red stižu setTimeout, setInterval, setImmediate (Node), I/O operacije i korisnički klikovi. U svakom ciklusu, Event Loop uzima TAČNO JEDAN Macrotask, prebacuje ga na Call Stack, a zatim odmah proverava Microtask red ponovo.'
        }
      ],
      mentalModel: 'Microtask red se ponaša kao VIP propusnica sa prioritetom: ako microtask kreira novi microtask, svi oni moraju biti izvršeni pre nego što browser uopšte pogleda sledeći setTimeout!'
    },
    ecmaSpecNote: 'HTML Living Standard §8.1.6 Event loops & ECMA-262 §9.5 Jobs',
    visualType: 'event-loop',
    codePresets: [
      {
        id: 'classic-microtask-race',
        title: 'Redosled izvršavanja Microtask vs Macrotask',
        description: 'Pratite tačan redosled sinhronog koda, setTimeout callback-a i Promise.then zadataka',
        code: `console.log('1: Početak skripte (Sinhrono)');

setTimeout(() => {
  console.log('2: setTimeout (Macrotask)');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Promise 1 (Microtask)');
}).then(() => {
  console.log('4: Promise 2 (Microtask)');
});

queueMicrotask(() => {
  console.log('5: queueMicrotask (Microtask)');
});

console.log('6: Kraj skripte (Sinhrono)');`,
        visualType: 'event-loop'
      },
      {
        id: 'nested-async-order',
        title: 'Odmotavanje toka Async/Await funkcija',
        description: 'Kako await pauzira funkciju i preostali kod raspoređuje u Microtask red',
        code: `async function async1() {
  console.log('async1 početak');
  await async2();
  console.log('async1 nastavak (Microtask)');
}

async function async2() {
  console.log('async2 sinhrono izvršavanje');
}

console.log('skripta start');
setTimeout(() => console.log('setTimeout callback (Macrotask)'), 0);
async1();
new Promise((resolve) => {
  console.log('promise konstruktor (Sinhrono!)');
  resolve();
}).then(() => {
  console.log('promise.then callback (Microtask)');
});
console.log('skripta kraj');`,
        visualType: 'event-loop'
      }
    ],
    comparisons: [
      {
        title: 'Izvršavanje teških proračuna bez zamrzavanja UI-ja',
        badCode: `// ❌ RIZIČNO: Blokiranje jedine programske niti (Call Stack)
function processMillionItems(items) {
  console.log("Započinje težak proračun...");
  const start = Date.now();
  while (Date.now() - start < 3000) {
    // Sinhrono čekanje od 3 sekunde (busy-wait loop)
    // Browser je potpuno zamrznut! Nema klikova, animacija, niti renderovanja!
  }
  console.log("Završeno");
}`,
        badExplanation: 'Pošto je JS jednonitan, dugačke sinhrone petlje u potpunosti okupiraju Call Stack. Event Loop ne može da obradi renderovanje stranice, klikove korisnika niti asinhrone događaje, što dovodi do zaleđivanja interfejsa.',
        goodCode: `// ✅ NAJBOLJA PRAKSA: Prepuštanje kontrole Event Loop-u (Yielding) ili Web Workers
async function processInChunks(items, chunkSize = 1000) {
  for (let i = 0; i < items.length; i += chunkSize) {
    // Obrada segmenta (chunk-a)
    const chunk = items.slice(i, i + chunkSize);
    chunk.forEach(item => /* proračun */ null);
    
    // Prepuštanje kontrole browser-u za render frejma i obradu događaja
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  console.log("Sve je obrađeno glatko bez zamrzavanja UI-ja");
}`,
        goodExplanation: 'Korišćenje `setTimeout(resolve, 0)` ili `requestIdleCallback` omogućava browser-u da iscrta frejmove i odgovori na akcije korisnika između obrađenih segmenata podataka.',
        pitfall: 'Blokiranje glavne niti (Main Thread) intenzivnim CPU proračunima umesto deljenja na segmente ili korišćenja Web Workers.'
      }
    ],
    languageComparisons: [
      {
        language: 'Go',
        jsCode: `// JS: Jednonitni Event Loop model
setTimeout(() => console.log("Završeno"), 1000);
// CPU nastavlja rad na glavnoj niti`,
        otherCode: `// Go: Višenitne preemtivne Goroutines
go func() {
    time.Sleep(1 * time.Second)
    fmt.Println("Završeno")
}()
// Goroutine-e rade na pravim OS nitima uz M:N scheduler`,
        jsBehavior: 'Jednonitni model reda događaja sa neblokirajućim I/O mehanizmom. Konkurentnost se bazira na asinhronim callback-ovima i Promise-ima.',
        otherBehavior: 'Go koristi lagane zelene niti (Goroutines) koje se paralelno raspoređuju preko višejezgarnih CPU niti uz preemtivno prebacivanje konteksta.',
        keyDifference: 'Jednonitni neblokirajući Event Loop naspram prave višenitne konkurentnosti (Goroutines).',
        whyJsDoesThis: 'Izbegava složeno zaključavanje niti (mutex/locks), trke za resursima (race conditions) i oštećenja deljene memorije u browser okruženju.'
      }
    ]
  },
  {
    id: 'this-context-binding',
    title: 'Ključna reč "this" i izvršni kontekst',
    subtitle: 'Dinamičko vezivanje, call/apply/bind metode i leksičke arrow funkcije',
    category: 'this-context',
    difficulty: 'Intermediate',
    tags: ['this', 'call', 'apply', 'bind', 'Arrow Functions', 'Context Loss'],
    summary: 'Za razliku od većine jezika gde je `this` trajno vezan za instancu klase, u JavaScript-u standardna funkcija dinamički određuje `this` na osnovu načina poziva u runtime-u (Call-site). Arrow funkcije, s druge strane, uopšte nemaju sopstveni `this` već ga leksički preuzimaju iz okruženja.',
    deepDive: {
      title: '4 Pravila određivanja "this" konteksta (Rangirana po prioritetu)',
      summary: 'Kada se izvršava telo funkcije, JavaScript engine evaluira `this` prema hijerarhiji od 4 stroga pravila:',
      keyPoints: [
        {
          term: '1. new Vezivanje (Konstruktori - Najviši prioritet)',
          detail: 'Kada se funkcija pozove sa `new MyFunc()`, JavaScript engine kreira potpuno nov prazan objekat, postavlja mu prototip na MyFunc.prototype, vezuje `this` za taj novi objekat i vraća ga.'
        },
        {
          term: '2. Eksplicitno vezivanje (.call, .apply, .bind)',
          detail: 'Metode .call(context, ...args) i .apply(context, [args]) odmah izvršavaju funkciju namećući specificirani context kao `this`. Metoda .bind(context) vraća novu omotanu funkciju trajno zaključanu na zadati objekat.'
        },
        {
          term: '3. Implicitno vezivanje (Objekat ispred tačke)',
          detail: 'Kada se metoda pozove kao `user.getName()`, objekat neposredno ispred tačke (`user`) postaje `this`. Ako se referenca izdvoji u promenljivu (`const fn = user.getName; fn()`), implicitna veza se prekida i gubi!'
        },
        {
          term: '4. Podrazumevano vezivanje (Default / Fallback)',
          detail: 'Samostalan poziv funkcije `fn()` u non-strict modu vezuje `this` za globalni objekat (window ili globalThis). U modernom "use strict" modu, `this` bezbedno ostaje `undefined` kako bi se sprečilo zagađenje globalnog opsega.'
        }
      ],
      mentalModel: 'Uvek locirajte tačno mesto gde se funkcija poziva u zagradama `()`. Izuzetak su Arrow funkcije: one ignorišu call-site i gledaju gde su sintaksno napisane u kodu.'
    },
    ecmaSpecNote: 'ECMA-262 §10.2.1.1.6 GetThisEnvironment & §14.3.8 Arrow Function Evaluation',
    visualType: 'this-binding',
    codePresets: [
      {
        id: 'lost-context-demo',
        title: 'Klasična zamka gubitka "this" konteksta',
        description: 'Izdvajanje reference metode iz objekta prekida njeno implicitno this vezivanje',
        code: `const user = {
  name: 'Ada Lovelace',
  greet() {
    return 'Pozdrav, ja sam ' + this.name;
  }
};

console.log('Direktan poziv:', user.greet());

// Izdvajanje reference metode:
const detachedGreet = user.greet;
try {
  console.log('Izdvojen poziv:', detachedGreet());
} catch(e) {
  console.log('Greška izdvojenog poziva:', e.message);
}

// Rešavanje uz eksplicitni .bind():
const boundGreet = user.greet.bind(user);
console.log('Vezani (bound) poziv:', boundGreet());`,
        visualType: 'this-binding'
      },
      {
        id: 'arrow-vs-regular-this',
        title: 'Arrow funkcije naspram standardnih funkcija',
        description: 'Arrow funkcije leksički preuzimaju vrednost `this` iz okružujućeg opsega u trenutku definisanja',
        code: `const timerObj = {
  seconds: 0,
  regularTimer() {
    function tick() {
      // U non-strict modu this je window/global; u strict modu je undefined
      console.log('Standardna funkcija this:', typeof this, this === timerObj);
    }
    tick();
  },
  arrowTimer() {
    const tick = () => {
      // Leksički nasleđuje this iz arrowTimer opsega
      console.log('Arrow funkcija this:', this.seconds, this === timerObj);
    };
    tick();
  }
};

timerObj.regularTimer();
timerObj.arrowTimer();`,
        visualType: 'this-binding'
      }
    ],
    comparisons: [
      {
        title: 'Prosleđivanje metoda objekta kao Callback funkcija',
        badCode: `// ❌ RIZIČNO: Direktno prosleđivanje reference metode
class Counter {
  count = 0;
  increment() {
    this.count++;
    console.log("Trenutno stanje:", this.count);
  }
}

const c = new Counter();
setTimeout(c.increment, 100); 
// Izlaz u browser-u: TypeError: Cannot read properties of undefined (this je izgubljen!)`,
        badExplanation: '`setTimeout` izvršava prosleđeni callback kao samostalnu funkciju `callback()`, resetujući `this` na globalni objekat ili undefined u strict modu.',
        goodCode: `// ✅ NAJBOLJA PRAKSA: Korišćenje arrow polja u klasi ili eksplicitnog bind-a
class Counter {
  count = 0;
  
  // Arrow polje klase automatski vezuje this za instancu
  increment = () => {
    this.count++;
    console.log("Trenutno stanje:", this.count);
  };
}

const c = new Counter();
setTimeout(c.increment, 100); // Radi besprekorno!`,
        goodExplanation: 'Arrow svojstva klase vezuju se za instancu tokom inicijalizacije konstruktora, čineći ih potpuno bezbednim za prosleđivanje kao callback funkcije.',
        pitfall: 'Gubitak konteksta (this) pri prosleđivanju metoda kao event listener-a ili tajmera.'
      }
    ],
    languageComparisons: [
      {
        language: 'Python',
        jsCode: `const obj = {
  val: 42,
  getVal() { return this.val; }
};
const fn = obj.getVal;
fn(); // 'this' se gubi -> undefined ili TypeError`,
        otherCode: `# Python
class MyClass:
    def __init__(self):
        self.val = 42
    def get_val(self):
        return self.val

obj = MyClass()
fn = obj.get_val
print(fn()) # Izlaz: 42 (Bound method automatski čuva self instancu!)`,
        jsBehavior: 'Metode u JS-u su obične reference na funkcije smeštene u svojstvima objekta; način poziva (call-site) diktira `this`.',
        otherBehavior: 'Python pri pristupu preko tačke automatski kreira "Bound Method" objekat koji trajno enkapsulira pokazivač na `self` instancu.',
        keyDifference: 'Dinamički `this` određen pozivom (JS) naspram automatski vezane instance (Python).',
        whyJsDoesThis: 'Omogućava pozajmljivanje metoda između različitih objekata preko `fn.call(otherObj)` i deljenje prototipova bez alokacije dodatnih omotača.'
      }
    ]
  },
  {
    id: 'scope-hoisting-closures',
    title: 'Opseg (Scope), Hoisting i Zatvorenja (Closures)',
    subtitle: 'var naspram let/const, Temporal Dead Zone (TDZ) i leksička okruženja',
    category: 'scope-closures',
    difficulty: 'Intermediate',
    tags: ['Closures', 'Hoisting', 'TDZ', 'var vs let', 'Scope Chain'],
    summary: 'JavaScript koristi leksički (statički) opseg. Pre izvršavanja koda, JS engine prolazi kroz fazu kreiranja okruženja gde alocira memoriju za deklaracije. Razumevanje razlike između hoisting-a sa preinicijalizacijom (var) i Temporal Dead Zone-a (let/const) ključno je za eliminaciju skrivenih bagova.',
    deepDive: {
      title: 'Faza kreiranja Execution Context-a i Životni ciklus vezivanja',
      summary: 'Svaki put kada se uđe u novi opseg (funkciju ili blok), JS engine kreira Environment Record i registruje promenljive u dve faze:',
      keyPoints: [
        {
          term: '1. Hoisting funkcija i var promenljivih',
          detail: 'Deklaracije funkcija (`function foo() {}`) se u celosti podižu na vrh i odmah postaju dostupne za poziv. Promenljive deklarisane sa `var` se takođe podižu, ali se automatski predinicijalizuju na vrednost `undefined`.'
        },
        {
          term: '2. Temporal Dead Zone (TDZ) za let i const',
          detail: 'I `let` i `const` bivaju registrovani u memoriji tokom faze kreiranja, ali OSTAJU NEINICIJALIZOVANI. Vremenski prozor od ulaska u blok do linije gde se fizički nalazi deklaracija naziva se TDZ. Svaki pokušaj čitanja promenljive u TDZ-u baca ReferenceError.'
        },
        {
          term: '3. Blokovski opseg (Block Scope) u petljama',
          detail: 'Za razliku od `var` koji ima funkcijski opseg i deli jednu promenljivu kroz celu for petlju, `let` unutar for petlje kreira POTPUNO NOVO leksičko vezivanje za svaku pojedinačnu iteraciju, rešavajući asinhroni problem tajmera.'
        },
        {
          term: '4. Zatvorenja (Closures)',
          detail: 'Zatvorenje nastaje kada unutrašnja funkcija zadrži živu referencu na Environment Record svog spoljašnjeg opsega čak i nakon što je spoljašnja funkcija završila izvršavanje i skinuta sa Call Stack-a.'
        }
      ],
      mentalModel: 'Zamišljajte `let` i `const` kao rezervisana parking mesta sa zabranom prilaza (TDZ): mesto postoji od početka bloka, ali auto ne sme da se parkira niti proveri registracija dok se ne stigne do linije deklaracije.'
    },
    ecmaSpecNote: 'ECMA-262 §9.1.1 Declarative Environment Records & §14.3.1 Let and Const Declarations',
    visualType: 'scope-hoisting',
    codePresets: [
      {
        id: 'var-in-loops-trap',
        title: 'Čuvena zamka "var unutar setTimeout petlje"',
        description: 'Zašto var ispisuje 3, 3, 3 dok let ispravno ispisuje 0, 1, 2',
        code: `console.log('--- Korišćenje var (deljeni funkcijski opseg) ---');
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var i:', i), 10);
}

setTimeout(() => {
  console.log('--- Korišćenje let (sveže blokovsko vezivanje po iteraciji) ---');
  for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log('let j:', j), 10);
  }
}, 50);`,
        visualType: 'scope-hoisting'
      },
      {
        id: 'tdz-hoisting-demo',
        title: 'Temporal Dead Zone (TDZ) naspram Hoisting-a',
        description: 'Promenljive sa let/const postoje u opsegu pre linije deklaracije, ali pristup njima baca ReferenceError',
        code: `console.log('var podignuta vrednost:', typeof hoistedVar, hoistedVar);
var hoistedVar = 'Ja sam inicijalizovan';

try {
  console.log('let unutar TDZ-a:', tdzVar);
} catch (err) {
  console.log('Uhvaćena TDZ greška:', err.message);
}
let tdzVar = 'Sada sam inicijalizovan';
console.log('let nakon deklaracije:', tdzVar);`,
        visualType: 'scope-hoisting'
      }
    ],
    comparisons: [
      {
        title: 'Deklaracija promenljivih (var naspram const/let)',
        badCode: `// ❌ RIZIČNO: Korišćenje zastarelog 'var'
function computeStats(values) {
  if (values.length > 0) {
    var average = 50; // "Curi" van if bloka!
  }
  console.log("Prosek:", average); // 50 (dostupno van bloka!)
  
  for (var i = 0; i < 3; i++) {}
  console.log("i je procurelo:", i); // 3 (iscurilo u funkciju)
}`,
        badExplanation: 'Ključna reč `var` ima opseg na nivou funkcije ili globalnog objekta i potpuno ignoriše blokovske zagrade `{}`.',
        goodCode: `// ✅ NAJBOLJA PRAKSA: Koristite const podrazumevano, let samo kod ponovne dodele
function computeStats(values: number[]) {
  let average = 0;
  if (values.length > 0) {
    const sum = values.reduce((a, b) => a + b, 0);
    average = sum / values.length;
  }
  // sum ovde nije dostupan jer je blokovski zaštićen!
  return average;
}`,
        goodExplanation: '`let` i `const` imaju striktan blokovski opseg i štite kod od slučajnih curenja promenljivih i neočekivanih prepisivanja stanja.',
        pitfall: 'Nenamerno curenje promenljivih i kolizije imena usled korišćenja var.'
      }
    ],
    languageComparisons: [
      {
        language: 'Rust',
        jsCode: `// U JS-u objekti deklarisani sa const i dalje mogu mutirati svoja svojstva!
const config = { port: 8080 };
config.port = 9000; // Uspešno menja svojstvo!`,
        otherCode: `// U Rust-u promenljive su podrazumevano potpuno nepromenljive (immutable)
let config = Config { port: 8080 };
// config.port = 9000; // Compile Error!
// Mora se eksplicitno navesti: let mut config = ...`,
        jsBehavior: 'U JS-u `const` štiti samo pokazivač promenljive na objekat, dok su unutrašnja svojstva objekta i dalje promenljiva.',
        otherBehavior: 'Rust nameće duboku nepromenljivost i na nivou memorijske vrednosti i na nivou vezivanja već u fazi kompajliranja.',
        keyDifference: 'Zaštita reference (JS) naspram duboke nepromenljivosti vrednosti (Rust).',
        whyJsDoesThis: 'Objekti u JavaScript-u su dinamičke strukture svojstava koje se prenose po referenci.'
      }
    ]
  },
  {
    id: 'prototypes-oop',
    title: 'Prototipovi, __proto__ i nasleđivanje',
    subtitle: 'Delegaciono nasleđivanje, Prototype Pollution rizik i realnost ES6 klasa',
    category: 'prototypes-oop',
    difficulty: 'Advanced',
    tags: ['Prototypes', '__proto__', 'Object.create', 'Classes', 'Inheritance', 'Prototype Pollution'],
    summary: 'JavaScript nema tradicionalne klase zasnovane na kopiranju šablona. ES6 `class` sintaksa je čist sintaksni šećer (syntactic sugar) preko prototipskog delegacionog lanca. Svaki objekat sadrži internu vezu [[Prototype]] ka drugom objektu, omogućavajući deljenje metoda uz minimalnu potrošnju memorije.',
    deepDive: {
      title: 'Kako funkcioniše delegacioni lanac prototipova',
      summary: 'Kada zatražite svojstvo `obj.prop`, JavaScript ne traži definiciju u statičkoj klasi, već putuje uzbrdo kroz žive reference objekata.',
      keyPoints: [
        {
          term: '1. Čitanje svojstva i delegacija',
          detail: 'Ako svojstvo ne postoji na samom objektu, JS proverava njegov interni [[Prototype]] (`__proto__`). Pretraga se nastavlja uz lanac sve dok se svojstvo ne pronađe ili se ne dostigne terminalni `Object.prototype.[[Prototype]]` koji je `null` (u kom slučaju se vraća `undefined`).'
        },
        {
          term: '2. Pisanje svojstva i Zasenjivanje (Shadowing)',
          detail: 'Dodeljivanje vrednosti `obj.prop = 42` po pravilu kreira novo sopstveno (own) svojstvo direktno na instanci `obj`, ostavljajući prototip nepromenjenim. Ovo sprečava da jedna instanca slučajno pokvari podatke za sve ostale objekte.'
        },
        {
          term: '3. Konstruktori vs Instance (prototype vs __proto__)',
          detail: 'Konstruktorske funkcije i klase imaju svojstvo `.prototype` (objekat šablon koji će biti dodeljen novim instancama). Konkretne kreirane instance poseduju accessor `__proto__` koji pokazuje na taj isti objekat šablon.'
        },
        {
          term: '4. Prototype Pollution bezbednosni rizik',
          detail: 'Ukoliko neoprezno spojite neprovereni JSON unos korisnika koji sadrži ključ `__proto__`, možete mutirati globalni `Object.prototype`, menjajući ponašanje SVAKOG objekta u celoj aplikaciji!'
        }
      ],
      mentalModel: 'Prototipski lanac je lanac delegiranja: instanca kaže "Ako ja nemam ovu metodu, pitaj mog roditelja. Ako ni on nema, pitaj njegovog roditelja sve do Object.prototype".'
    },
    ecmaSpecNote: 'ECMA-262 §10.1 Ordinary and Exotic Objects Behaviors & §20.1.2 Object Prototype',
    visualType: 'prototype',
    codePresets: [
      {
        id: 'prototype-chain-traversal',
        title: 'Kretanje kroz lanac prototipova (Prototype Chain)',
        description: 'Pogledajte kako pretraga svojstva putuje uzbrdo kroz prototipove sve dok ne dostigne terminalni null',
        code: `const grandParent = { familyName: 'Curie', origin: 'Poljska' };
const parent = Object.create(grandParent);
parent.profession = 'Fizičar';

const child = Object.create(parent);
child.name = 'Irène';

console.log('child.name =>', child.name); // Sopstveno svojstvo
console.log('child.profession =>', child.profession); // Pronađeno na parent objektu
console.log('child.familyName =>', child.familyName); // Pronađeno na grandparent objektu
console.log('child.nonExistent =>', child.nonExistent); // Dostiže null -> undefined

console.log('Object.getPrototypeOf(child) === parent:', Object.getPrototypeOf(child) === parent);
console.log('Object.getPrototypeOf(parent) === grandParent:', Object.getPrototypeOf(parent) === grandParent);`,
        visualType: 'prototype'
      },
      {
        id: 'class-vs-prototype',
        title: 'ES6 klase "ispod haube"',
        description: 'Klase u JS-u su zapravo konstruktorske funkcije povezane sa prototipskim objektima',
        code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return this.name + ' se oglašava.';
  }
}

console.log('typeof Animal:', typeof Animal); // "function"
console.log('Animal.prototype.speak:', Animal.prototype.speak.toString());

const dog = new Animal('Rex');
console.log('dog.__proto__ === Animal.prototype:', Object.getPrototypeOf(dog) === Animal.prototype);
console.log('dog.speak():', dog.speak());`,
        visualType: 'prototype'
      }
    ],
    comparisons: [
      {
        title: 'Pretraga rečnika (Object naspram Map naspram Object.create(null))',
        badCode: `// ❌ RIZIČNO: Korišćenje običnog objekta {} za korisničke ključeve
function isSafeWord(word) {
  const dictionary = { "apple": true, "banana": true };
  
  // Šta ako korisnik unese "toString" ili "constructor"?
  return dictionary[word] === true; // dictionary["toString"] vraća ugrađenu funkciju toString()!
}`,
        badExplanation: 'Obični objekti nasleđuju ugrađene metode poput `toString`, `valueOf` i `constructor` sa `Object.prototype`. Provera ključeva bez `Object.hasOwn()` može izazvati lažno pozitivne rezultate ili sigurnosne ranjivosti (Prototype Pollution).',
        goodCode: `// ✅ NAJBOLJA PRAKSA: Koristite Map ili Object.create(null)
function isSafeWord(word: string) {
  const dictionary = new Map<string, boolean>([
    ["apple", true],
    ["banana", true]
  ]);
  return dictionary.has(word);
}

// Ili čist rečnik bez prototipa:
const cleanDict = Object.create(null);
cleanDict["apple"] = true;
// cleanDict["toString"] je striktno undefined!`,
        goodExplanation: '`Map` ili `Object.create(null)` nemaju nasleđeni prototip, što garantuje potpuno bezbednu pretragu proizvoljnih korisničkih ključeva bez kolizija sa ugrađenim metodama.',
        pitfall: 'Kolizija prototipa i bezbednosni rizici pri korišćenju običnih objekata kao hash mapa.'
      }
    ],
    languageComparisons: [
      {
        language: 'Java',
        jsCode: `// JS: Objekti mogu dinamički dodavati metode u runtime-u!
const dog = { name: "Sparky" };
dog.bark = () => "Av av!";`,
        otherCode: `// Java: Klase su fiksne i nepromenljive strukture definisane u compile-time-u
class Dog {
    String name;
    // Nije moguće dinamički dodati novu metodu na instancu tokom izvršavanja
}`,
        jsBehavior: 'Objekti su dinamički memorijski skupovi svojstava sa živim pokazivačem prototipske delegacije.',
        otherBehavior: 'Java klase se kompajliraju u byte-code sa striktnim VTable mehanizmom razrešavanja metoda.',
        keyDifference: 'Prototipska delegacija i dinamička proširivost naspram klasičnog statičkog nasleđivanja.',
        whyJsDoesThis: 'Dizajniran za maksimalnu fleksibilnost pri manipulaciji DOM elementima u web browser-u bez potrebe za kompajliranjem.'
      }
    ]
  },
  {
    id: 'arrays-and-objects',
    title: 'Specifičnosti nizova, Sparse praznine i Mutacija',
    subtitle: 'Leksikografsko sortiranje, prazna mesta u nizu i duboko vs plitko kloniranje',
    category: 'arrays-objects',
    difficulty: 'Intermediate',
    tags: ['Array.sort', 'Sparse Arrays', 'delete', 'structuredClone', 'Shallow Copy'],
    summary: 'JavaScript nizovi su specijalizovani objekti sa numeričkim ključevima i automatskim `length` svojstvom. Podrazumevani `Array.prototype.sort()` pretvara elemente u stringove, dok brisanje elemenata operatorom `delete` stvara memorijske "rupe" (sparse slots) koje iteratori preskaču.',
    deepDive: {
      title: 'Interna optimizacija nizova u V8 i mutacione zamke',
      summary: 'V8 i moderni JS engine-i optimizuju nizove u zavisnosti od njihovog sadržaja, ali određene operacije degradiraju performanse:',
      keyPoints: [
        {
          term: '1. V8 Element Kinds (Packed vs Holey/Sparse)',
          detail: 'Kada je niz popunjen (npr. [1, 2, 3]), V8 ga čuva u kontinualnom C++ nizu visoke brzine (PACKED_SMI_ELEMENTS). Ako kreirate prazninu sa `new Array(3)` ili `delete arr[0]`, niz prelazi u HOLEY/DICTIONARY režim koji dramatično usporava pristup.'
        },
        {
          term: '2. Leksikografsko sortiranje po podrazumevanom',
          detail: 'Metoda `arr.sort()` bez argumenata pretvara sve elemente u UTF-16 stringove i poredi ih leksikografski. Zbog toga [10, 2, 5].sort() daje [10, 2, 5] jer string "10" dolazi pre "2". Uvek morate proslediti komparator `(a, b) => a - b`!'
        },
        {
          term: '3. Plitko kopiranje (Spread / Object.assign) naspram Dubokog kloniranja',
          detail: 'Spread operator `[...arr]` i `{...obj}` kopiraju samo prvi nivo svojstava. Ugnježdeni objekti se prenose po referenci. Za bezbedno duboko kloniranje koristite standardni `structuredClone(obj)` iz ES2022.'
        },
        {
          term: '4. Nove nepromenljive (Immutable) metode iz ES2023',
          detail: 'Metode .sort(), .reverse() i .splice() mutiraju originalni niz na mestu. Standard ES2023 je uveo nepromenljive alternative: `.toSorted()`, `.toReversed()`, `.toSpliced()` i `.with(index, value)`.'
        }
      ],
      mentalModel: 'Nikada ne koristite operator `delete` na nizovima (on ostavlja rupu praznog slota). Koristite `.splice()` ili filter ako želite da fizički skratite niz i sačuvate kontinualnu memoriju.'
    },
    ecmaSpecNote: 'ECMA-262 §23.1 Array Objects & §7.3.31 ArraySpeciesCreate',
    visualType: 'custom-console',
    codePresets: [
      {
        id: 'array-sort-trap',
        title: 'Zamka podrazumevanog sort() metoda',
        description: 'Zašto [10, 2, 1, 20].sort() ne sortira brojeve po veličini',
        code: `const numbers = [10, 2, 1, 20, 5, 100];
console.log('Podrazumevani .sort() izlaz:');
console.log([...numbers].sort()); 
// ["1", "10", "100", "2", "20", "5"] jer svaki broj prvo pretvara u string!

console.log('Ispravan numerički komparator .sort((a, b) => a - b):');
console.log([...numbers].sort((a, b) => a - b));`,
        visualType: 'custom-console'
      },
      {
        id: 'sparse-arrays-holes',
        title: 'Sparse nizovi (Prazna mesta vs Undefined)',
        description: 'Array(3) kreira 3 prazna mesta. .map() i .forEach() preskaču prazna mesta!',
        code: `const sparse = new Array(3); // 3 prazna slota (empty slots)
const explicit = [undefined, undefined, undefined];

console.log('sparse niz:', sparse);
console.log('eksplicitni niz:', explicit);

console.log('sparse.map(x => 1):', sparse.map(() => 1)); // I dalje 3 prazna slota!
console.log('explicit.map(x => 1):', explicit.map(() => 1)); // [1, 1, 1]

// Operator "delete" stvara rupu u nizu!
const arr = [1, 2, 3];
delete arr[1];
console.log('arr nakon delete arr[1]:', arr, 'dužina (length):', arr.length);`,
        visualType: 'custom-console'
      },
      {
        id: 'cloning-objects-modern',
        title: 'Kloniranje objekata: Spread naspram structuredClone',
        description: 'Poređenje plitkog spread operatora, JSON serijalizacije i modernog structuredClone API-ja',
        code: `const original = {
  name: 'Alex',
  created: new Date(),
  nested: { role: 'Admin' },
  map: new Map([['key', 'val']])
};

// 1. Plitka kopija (Shallow Copy)
const shallow = { ...original };
shallow.nested.role = 'SuperAdmin'; // Menja i original.nested podatak!

// 2. Moderno duboko kloniranje (ES2022+ structuredClone)
const deep = structuredClone(original);
deep.nested.role = 'Guest';

console.log('original.nested.role:', original.nested.role); // SuperAdmin (plitka kopija ga je izmenila)
console.log('deep.nested.role:', deep.nested.role); // Guest (potpuno nezavisan objekat!)
console.log('deep.created je instanca Date objekta:', deep.created instanceof Date);`,
        visualType: 'custom-console'
      }
    ],
    comparisons: [
      {
        title: 'Sortiranje numeričkih nizova',
        badCode: `// ❌ RIZIČNO: Pozivanje .sort() bez funkcije poređenja (komparatora)
const prices = [100, 25, 5, 80, 10];
prices.sort();
console.log(prices); // [10, 100, 25, 5, 80] -> Potpuno pogrešan redosled!`,
        badExplanation: 'Po default-u, `Array.prototype.sort()` pretvara elemente u stringove i poredi njihove UTF-16 kodne jedinice po abecednom redu, stavljajući 100 pre 25.',
        goodCode: `// ✅ NAJBOLJA PRAKSA: Uvek navedite eksplicitni komparator ili koristite toSorted()
const prices = [100, 25, 5, 80, 10];
// U ES2023+: toSorted() vraća novi sortirani niz bez menjanja originalnog
const sortedPrices = prices.toSorted((a, b) => a - b);
console.log(sortedPrices); // [5, 10, 25, 80, 100]`,
        goodExplanation: 'Navođenjem `(a, b) => a - b` obezbeđujete pravo matematičko poređenje. Metoda `toSorted()` sprečava mutaciju originalnog niza.',
        pitfall: 'Slučajno alfabetsko sortiranje numeričkih nizova.'
      }
    ],
    languageComparisons: [
      {
        language: 'Python',
        jsCode: `const list = [10, 2, 1];
list.sort(); // Izlaz: [1, 10, 2] (abecedno/string sortiranje)`,
        otherCode: `# Python
lst = [10, 2, 1]
lst.sort() # Izlaz: [1, 2, 10] (prirodno numeričko sortiranje)`,
        jsBehavior: 'JS podrazumevano sortira nizove pretvarajući svaku stavku u String ukoliko nije prosleđena funkcija poređenja.',
        otherBehavior: 'Python sortira elemente na osnovu njihovih prirodnih operatora poređenja (`<`).',
        keyDifference: 'Podrazumevano string sortiranje (JS) naspram tipskog poređenja vrednosti (Python).',
        whyJsDoesThis: 'Godine 1995. nizovi su prvenstveno korišćeni za skladištenje string tokena pri manipulaciji DOM elementima.'
      }
    ]
  },
  {
    id: 'floating-point-numbers',
    title: 'Matematika sa pokretnim zarezom i BigInt preciznost',
    subtitle: 'IEEE 754 standard, MAX_SAFE_INTEGER granica i razlika između -0 i +0',
    category: 'math-numbers',
    difficulty: 'Intermediate',
    tags: ['IEEE 754', '0.1 + 0.2', 'BigInt', 'MAX_SAFE_INTEGER', 'Infinity', '-0'],
    summary: 'Svi standardni brojevi u JavaScript-u čuvaju se kao 64-bitni brojevi sa pokretnim zarezom dvostruke tačnosti u skladu sa IEEE 754 standardom. Pošto se decimalni razlomci u bazi 10 (poput 0.1 i 0.2) u binarnom sistemu pretvaraju u beskonačne ponavljajuće periode, javljaju se minimalna odstupanja pri proračunu.',
    deepDive: {
      title: 'IEEE 754 format i granice bezbedne celobrojne matematike',
      summary: 'Struktura svakog 64-bitnog broja (Double Precision) u JavaScript memoriji:',
      keyPoints: [
        {
          term: '1. Memorijska struktura: 1 bit znaka + 11 bita eksponenta + 52 bita frakcije',
          detail: 'Zbog 52 bita mantise, JavaScript može savršeno precizno da predstavi cele brojeve u rasponu od -(2^53 - 1) do +(2^53 - 1). Ovaj maksimum definisan je konstantom `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991).'
        },
        {
          term: '2. Zašto je 0.1 + 0.2 === 0.30000000000000004',
          detail: 'U bazi 2, broj 0.1 je beskonačni binarni period: 0.0001100110011... Kada se iseče na 53 bita preciznosti, dolazi do blagog zaokruživanja na gore. Zbog toga se poređenje decimala nikada ne radi sa `===`, već uz toleranciju `Math.abs(a - b) < Number.EPSILON`.'
        },
        {
          term: '3. Prekoračenje granice i BigInt rešenje',
          detail: 'Iznad MAX_SAFE_INTEGER, susedni celi brojevi dele isti binarni obrazac, pa `MAX_SAFE_INTEGER + 1 === MAX_SAFE_INTEGER + 2` vraća true! Za 64-bitne baze podataka (ID-jevi, hash-evi, kriptovalute) mora se koristiti tip `BigInt` (npr. `1234567890123456789n`).'
        },
        {
          term: '4. Znak nule (-0 naspram +0)',
          detail: 'Zbog odvojenog bita za znak, JS podržava i pozitivnu i negativnu nulu: `+0 === -0` je true, ali `1 / +0` daje `Infinity` dok `1 / -0` daje `-Infinity`! Za razlikovanje koristite `Object.is(+0, -0)` koji vraća false.'
        }
      ],
      mentalModel: 'Za novac i finansijske transakcije NIKADA ne čuvajte evre/dinare u decimalama—čuvajte novac u parama/centima kao cele brojeve (integers) ili koristite namensku decimalnu biblioteku.'
    },
    ecmaSpecNote: 'ECMA-262 §6.1.6.1 Number Type & §6.1.6.2 BigInt Type',
    visualType: 'custom-console',
    codePresets: [
      {
        id: 'float-math-demo',
        title: 'Problem preciznosti: 0.1 + 0.2',
        description: 'Saznajte zašto binarni format pokretnog zareza daje 0.30000000000000004',
        code: `console.log('0.1 + 0.2 === 0.3 =>', 0.1 + 0.2 === 0.3); // false
console.log('0.1 + 0.2 stvarna vrednost =>', 0.1 + 0.2); // 0.30000000000000004

// Ispravno poređenje decimalnih brojeva uz Number.EPSILON:
function areAlmostEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}
console.log('areAlmostEqual(0.1 + 0.2, 0.3) =>', areAlmostEqual(0.1 + 0.2, 0.3)); // true`,
        visualType: 'custom-console'
      },
      {
        id: 'max-safe-int-demo',
        title: 'Number.MAX_SAFE_INTEGER i BigInt',
        description: 'Prekoračenje granice 2^53 - 1 gubi preciznost bez ikakve greške. BigInt rešava ovaj problem.',
        code: `const maxSafe = Number.MAX_SAFE_INTEGER; // 9007199254740991 (2^53 - 1)
console.log('MAX_SAFE_INTEGER:', maxSafe);
console.log('maxSafe + 1 === maxSafe + 2:', maxSafe + 1 === maxSafe + 2); // true!

// Rešenje: Koristite BigInt za proizvoljno velike cele brojeve (ID-jevi, kriptografija, finansije)
const bigA = 9007199254740991n;
console.log('bigA + 1n === bigA + 2n:', bigA + 1n === bigA + 2n); // false (tačno i precizno!)
console.log('bigA + 100n:', (bigA + 100n).toString());`,
        visualType: 'custom-console'
      }
    ],
    comparisons: [
      {
        title: 'Obrada novčanih i finansijskih transakcija',
        badCode: `// ❌ RIZIČNO: Korišćenje običnih decimalnih brojeva za novac
function calculateCartTotal(pricePerItem, quantity, taxRate) {
  const subtotal = pricePerItem * quantity; // npr. 19.99 * 3 = 59.970000000000006
  const total = subtotal + (subtotal * taxRate);
  return total; // 64.76760000000001
}`,
        badExplanation: 'Greške zaokruživanja u formatu pokretnog zareza stvaraju odstupanja u parama i centima, što može dovesti do netačnih finansijskih obračuna.',
        goodCode: `// ✅ NAJBOLJA PRAKSA: Čuvajte novac u celim jedinicama (parama/centima) ili namenskoj biblioteci
function calculateCartTotal(priceInCents: number, quantity: number, taxBasisPoints: number) {
  const subtotalCents = priceInCents * quantity;
  const taxCents = Math.round((subtotalCents * taxBasisPoints) / 10000);
  const totalCents = subtotalCents + taxCents;
  
  return {
    totalCents,
    formatted: (totalCents / 100).toFixed(2)
  };
}`,
        goodExplanation: 'Rad sa celim brojevima (npr. centi ili pare umesto dinara/evra) eliminiše greške zaokruživanja binarnog pokretnog zareza.',
        pitfall: 'Direktno korišćenje decimalnih brojeva za proračune novčanih iznosa.'
      }
    ],
    languageComparisons: [
      {
        language: 'Rust',
        jsCode: `// U JS-u svi brojevi su podrazumevano 64-bitni float
const x = 5 / 2; // Izlaz: 2.5`,
        otherCode: `// U Rust-u celobrojno deljenje zadržava celobrojni tip
let x: i32 = 5 / 2; // Izlaz: 2 (odsečeno)
let y: f64 = 5.0 / 2.0; // Izlaz: 2.5`,
        jsBehavior: 'Svi osnovni brojevi u JS-u su IEEE 754 64-bitni float dvostruke tačnosti.',
        otherBehavior: 'Rust ima striktno definisane mašinske tipove: i8, u32, i64, f32, f64, isize.',
        keyDifference: 'Univerzalni float64 tip (JS) naspram eksplicitnih primitivnih mašinskih tipova (Rust).',
        whyJsDoesThis: 'Dizajniran jednostavno kako početnici ne bi morali da brinu o prelivanju celih brojeva ili širini memorijskih registara.'
      }
    ]
  },
  {
    id: 'syntax-asi-traps',
    title: 'Automatsko umetanje tačka-zapete (ASI) i sintaksne zamke',
    subtitle: 'Problem novog reda nakon return-a, opasnosti sa zagradama i operator zareza',
    category: 'syntax-asi',
    difficulty: 'Intermediate',
    tags: ['ASI', 'Semicolons', 'return newline', 'Syntax', 'Comma Operator'],
    summary: 'JavaScript poseduje mehanizam Automatic Semicolon Insertion (ASI) koji automatski umeće tačka-zarez na mestima preloma linija kada bi kod inače izazvao sintaksnu grešku. Međutim, kod "ograničenih produkcija" (restricted productions) poput `return`, novi red automatski prekida naredbu i tiho vraća `undefined`.',
    deepDive: {
      title: 'Pravila ASI mehanizma i rizične sintaksne konstrukcije',
      summary: 'ECMA-262 specifikacija nalaže 3 osnovna pravila za umetanje tačka-zapete:',
      keyPoints: [
        {
          term: '1. Ograničene produkcije (Restricted Productions)',
          detail: 'Nije dozvoljen prelom linije (LineTerminator) neposredno nakon ključnih reči: `return`, `throw`, `yield`, `break`, `continue`, kao ni ispred postfiks operatora `++` i `--`. Ako prelomite red: `return\\n { a: 1 }`, JS automatski umeće `;` iza return-a i funkcija vraća undefined.'
        },
        {
          term: '2. Opasnost linija koje počinju zagradama ( [ i ( )',
          detail: 'Ako pišete kod bez tačka-zapete, a naredni red počinje sa `(` ili `[`, JavaScript NEĆE umetnuti `;`, već će protumačiti novi red kao poziv funkcije ili indeksiranje niza nad prethodnim izrazom: `a = b\\n(function(){})()` postaje `a = b(function(){})()` i baca TypeError!'
        },
        {
          term: '3. Operator zareza (Comma Operator)',
          detail: 'Operator zarez `(expr1, expr2)` evaluira oba izraza s leva na desno i vraća vrednost POSLEDNJEG izraza. Na primer: `let x = (1, 2, 3);` dodeljuje vrednost 3 promenljivoj `x`.'
        },
        {
          term: '4. Zatvorena vitičasta zagrada } i kraj fajla',
          detail: 'ASI takođe automatski umeće `;` ispred zatvorene vitičaste zagrade `}` bloka ili na samom kraju skripte ukoliko je tačka-zarez izostavljena.'
        }
      ],
      mentalModel: 'Ako izostavljate tačka-zarez, nikada ne počinjite novi red sa `[`, `(`, `/` (regex), ili `` ` `` (template literal), i uvek držite otvorenu zagradu `{` u istoj liniji sa ključnom reči `return`.'
    },
    ecmaSpecNote: 'ECMA-262 §12.9 Automatic Semicolon Insertion',
    visualType: 'custom-console',
    codePresets: [
      {
        id: 'return-asi-trap',
        title: 'Zamka novog reda nakon ključne reči return',
        description: 'Zašto postavljanje objekta u novi red ispod return naredbe vraća undefined',
        code: `function badGetConfig() {
  return
  {
    status: 'active'
  };
}

function goodGetConfig() {
  return {
    status: 'active'
  };
}

console.log('badGetConfig() izlaz =>', badGetConfig()); // undefined! (jer je JS dodao ; odmah iza return)
console.log('goodGetConfig() izlaz =>', goodGetConfig()); // { status: "active" }`,
        visualType: 'custom-console'
      },
      {
        id: 'parenthesis-hazard',
        title: 'Opasnost linija koje počinju zagradama ( i [',
        description: 'Ukoliko izostavljate tačka-zarez, linije koje počinju sa ( ili [ tumače se kao pozivi prethodne linije',
        code: `const a = 1 + 2
const b = 3

// Ako se kod napiše bez tačka-zapete:
// let x = a + b
// (function() {})()
// JS ovo tumači kao: let x = (a + b)(function() {})() -> TypeError: (a + b) is not a function!

console.log('Uvek budite oprezni sa linijama koje počinju sa ( ili [ ako izostavljate tačka-zarez.');`,
        visualType: 'custom-console'
      }
    ],
    comparisons: [
      {
        title: 'Završetak naredbi i višelinijski return',
        badCode: `// ❌ RIZIČNO: Razdvajanje return-a i vrednosti u novi red
function createUser(name) {
  return
    {
      id: Math.random(),
      name: name
    };
}`,
        badExplanation: 'ASI pravilo nalaže da se iza `return` naredbe na prelomu reda automatski umetne tačka-zarez (`return;`), dok objekat ispod ostaje nedostižan kod.',
        goodCode: `// ✅ NAJBOLJA PRAKSA: Zadržite otvorenu vitičastu zagradu u istoj liniji ili obuhvatite običnim zagradama
function createUser(name: string) {
  return {
    id: Math.random(),
    name: name
  };
  
  // Ili u JSX-u:
  // return (
  //   <div>...</div>
  // );
}`,
        goodExplanation: 'Postavljanjem otvorene zagrade `{` ili `(` u istu liniju sa `return` sprečava se automatsko umetanje tačka-zapete.',
        pitfall: 'Skriveni bagovi gde funkcija tiho vraća undefined usled prelomljenog reda.'
      }
    ],
    languageComparisons: [
      {
        language: 'Python',
        jsCode: `// U JS-u uvlačenje nije bitno, ali ASI reaguje na nove redove
function test() {
  return
  42;
}
console.log(test()); // undefined`,
        otherCode: `# U Python-u uvlačenje (indentation) definiše blokove
def test():
    return (
        42
    )
print(test()) # Izlaz: 42`,
        jsBehavior: 'Sintaksa sa vitičastim zagradama C stila uz heurističko automatsko umetanje tačka-zapete.',
        otherBehavior: 'Python koristi gramatiku baziranu na uvlačenju redova i eksplicitnom nastavljanju izraza kroz otvorene zagrade.',
        keyDifference: 'ASI heuristika (JS) naspram gramatike uvlačenja koda (Python).',
        whyJsDoesThis: 'Kako bi tačka-zarez bio opcionalan za početnike, uz zadržavanje sintakse slične jezicima C i Java.'
      }
    ]
  }
];
