export interface CoercionItem {
  id: string;
  expression: string;
  evaluatedResult: string;
  category: 'Aritmetika i Konkatenacija' | 'Labava Jednakost (==)' | 'Konverzija Tipova' | 'Logika i Truthy/Falsy' | 'Nizovi i Objekti';
  explanation: string;
  steps: string[];
  specReference: string;
}

export const COERCION_DATABASE: CoercionItem[] = [
  {
    id: 'empty-arrays-add',
    expression: '[] + []',
    evaluatedResult: '""',
    category: 'Aritmetika i Konkatenacija',
    explanation: 'Oba prazna niza se konvertuju u primitivne vrednosti pozivom apstraktne operacije `ToPrimitive()`. Prazan niz poziva metodu `Array.prototype.toString()`, što daje prazan string `""`. Sabiranje dva prazna stringa `"" + ""` rezultuje praznim stringom `""`.',
    steps: [
      'Korak 1: Evaluacija levog operanda `[]`: `ToPrimitive([])` poziva `[].toString()` → `""` (prazan string)',
      'Korak 2: Evaluacija desnog operanda `[]`: `ToPrimitive([])` poziva `[].toString()` → `""` (prazan string)',
      'Korak 3: Primenjuje se operator `+` na dva stringa: `"" + ""` → `""`'
    ],
    specReference: 'ECMA-262 §7.1.1 ToPrimitive & §13.15.3 ApplyStringOrNumericBinaryOperator'
  },
  {
    id: 'array-plus-object',
    expression: '[] + {}',
    evaluatedResult: '"[object Object]"',
    category: 'Aritmetika i Konkatenacija',
    explanation: 'Levi operand `[]` se konvertuje u `""`. Desni operand `{}` se preko metode `Object.prototype.toString()` konvertuje u primitivni string `"[object Object]"`. Spajanjem stringova dobija se `"[object Object]"`.',
    steps: [
      'Korak 1: Levi operand `[]` poziva `[].toString()` → `""` (string)',
      'Korak 2: Desni operand `{}` poziva `({}).toString()` → `"[object Object]"` (string)',
      'Korak 3: Izvršava se konkatenacija: `"" + "[object Object]"` → `"[object Object]"`'
    ],
    specReference: 'ECMA-262 §7.1.1 ToPrimitive (hint: "default")'
  },
  {
    id: 'object-plus-array-quirk',
    expression: '{ } + [ ]',
    evaluatedResult: '0 (u konzoli) ili "[object Object]" (u izrazu)',
    category: 'Aritmetika i Konkatenacija',
    explanation: 'Na početku naredbe, `{}` se parsira kao prazan blok koda, pa se zatim evaluira unarni operator `+[]` koji prazan niz konvertuje u broj `0`. Ukoliko je izraz obuhvaćen zagradama `({} + [])`, `{}` se tretira kao objekat i rezultat je `"[object Object]"`.',
    steps: [
      'Korak 1: Na nivou naredbe: `{}` se tumači kao prazan blok koda `{}`',
      'Korak 2: Preostali deo je unarni plus: `+[]`',
      'Korak 3: `+[]` poziva `Number("")` → `0`',
      'Korak 4: Ako je obuhvaćeno zagradama `({} + [])`: `{}` je objekat i rezultat je `"[object Object]"`'
    ],
    specReference: 'ECMA-262 Gramatička dvosmislenost: BlockStatement naspram ObjectLiteral'
  },
  {
    id: 'array-equals-not-array',
    expression: '[] == ![]',
    evaluatedResult: 'true',
    category: 'Labava Jednakost (==)',
    explanation: 'Logički operator NOT `!` ima veći prioritet od operatora `==`. Izraz `![]` daje `false` jer su svi objekti (pa i nizovi) u JavaScript-u truthy. Zatim se porede `[] == false` prema pravilima labave jednakosti.',
    steps: [
      'Korak 1: Prvo se evaluira `![]`: `Boolean([])` je `true`, pa `!true` daje `false`',
      'Korak 2: Izraz sada glasi: `[] == false`',
      'Korak 3: Pravilo: Ako se poredi Objekat sa Boolean-om, Boolean se konvertuje u broj (`ToNumber(false)` = `0`), pa imamo: `[] == 0`',
      'Korak 4: Pravilo: Ako se poredi Objekat sa brojem, Objekat se konvertuje u primitivnu vrednost (`ToPrimitive([])` = `""`), pa imamo: `"" == 0`',
      'Korak 5: Pravilo: Ako se poredi String sa brojem, String se konvertuje u broj (`ToNumber("")` = `0`), pa imamo: `0 == 0`',
      'Korak 6: Rezultat je `0 === 0` što daje `true`!'
    ],
    specReference: 'ECMA-262 §7.2.14 Abstract Equality Comparison'
  },
  {
    id: 'string-minus-vs-plus',
    expression: '"5" - 3 naspram "5" + 3',
    evaluatedResult: '2 naspram "53"',
    category: 'Aritmetika i Konkatenacija',
    explanation: 'Operator `+` je preopterećen za spajanje stringova ukoliko je bar jedan operand tipa string. Operator `-` radi isključivo sa brojevima i uvek primorava oba operanda na numeričku konverziju.',
    steps: [
      'Korak 1: Za `"5" + 3`: Jedan operand je string → spajanje stringova → `"5" + "3"` = `"53"`',
      'Korak 2: Za `"5" - 3`: Oduzimanje podržava samo brojeve → `Number("5") - 3` = `5 - 3` = `2`',
      'Korak 3: `"5" * 2 = 10`, `"5" / 2 = 2.5` (svi ostali matematički operatori vrše konverziju u Number)'
    ],
    specReference: 'ECMA-262 §13.15.3 Sabiranje naspram Oduzimanja'
  },
  {
    id: 'typeof-null',
    expression: 'typeof null',
    evaluatedResult: '"object"',
    category: 'Konverzija Tipova',
    explanation: 'U originalnoj implementaciji JavaScript-a iz 1995. godine, vrednosti su čuvane kao oznaka tipa (type tag) i sama vrednost. Objekti su imali oznaku tipa 0. Pokazivač na null (NULL pointer) imao je vrednost 0x00, zbog čega je `typeof` pogrešno vraćao "object". Ova greška je zadržana zbog kompatibilnosti unazad sa postojećim web sajtovima.',
    steps: [
      'Korak 1: U ranom JS engine-u: bit oznaka objekta bila je `000`',
      'Korak 2: null pointer je u jeziku C bio `0x00`, što se poklopilo sa oznakom `000`',
      'Korak 3: `typeof` je čitao bitove oznake i klasifikovao `null` kao objekat',
      'Korak 4: Predlog u ECMAScript-u da se ovo ispravi (tako da `typeof null === "null"`) je odbijen jer bi srušio hiljade postojećih sajtova.'
    ],
    specReference: 'ECMA-262 §13.5.3 The typeof Operator (istorijski bug)'
  },
  {
    id: 'nan-equality',
    expression: 'NaN === NaN',
    evaluatedResult: 'false',
    category: 'Labava Jednakost (==)',
    explanation: 'Prema IEEE 754 standardu za brojeve sa pokretnim zarezom, `NaN` (Not a Number) predstavlja nedefinisan ili neodređen numerički rezultat i nikada nije jednak nijednoj vrednosti, čak ni samom sebi. Za detekciju koristite `Number.isNaN()` ili `Object.is()`.',
    steps: [
      'Korak 1: IEEE 754 specifikacija nalaže da poređenje bilo kog broja sa NaN (uključujući NaN sa NaN) daje false',
      'Korak 2: `NaN === NaN` → false',
      'Korak 3: `NaN == NaN` → false',
      'Korak 4: Ispravno rešenje: `Number.isNaN(val)` ili `Object.is(NaN, NaN)` (vraća true)'
    ],
    specReference: 'IEEE 754-2008 Standard & ECMA-262 §7.2.15 Strict Equality Comparison'
  },
  {
    id: 'truthy-array-equals-false',
    expression: 'Boolean([]) === true && [] == false',
    evaluatedResult: 'true (oba izraza su tačna!)',
    category: 'Logika i Truthy/Falsy',
    explanation: 'Svi objekti (uključujući prazan niz `[]`) su truthy kada se direktno evaluiraju u logičkom kontekstu (`if ([])` se izvršava). Međutim, u labavoj jednakosti `==`, `[]` se konvertuje u primitivni string `""`, koji potom postaje broj `0`, što se poklapa sa `false` (0).',
    steps: [
      'Korak 1: `Boolean([])` je `true` jer je svaka referenca na objekat truthy.',
      'Korak 2: Za `[] == false` pokreće se algoritam labave konverzije:',
      'Korak 3: 1. `false` → `0`',
      'Korak 4: 2. `[]` → `""` (preko `[].toString()`)',
      'Korak 5: 3. `""` → `0` (preko `Number("")`)',
      'Korak 6: 4. `0 == 0` → `true`'
    ],
    specReference: 'ECMA-262 §7.1.2 ToBoolean naspram §7.2.14 Abstract Equality'
  },
  {
    id: 'array-sort-numbers',
    expression: '[10, 1, 5, 2, 20].sort()',
    evaluatedResult: '[1, 10, 2, 20, 5]',
    category: 'Nizovi i Objekti',
    explanation: 'Ukoliko ne navedete funkciju poređenja (komparator), `Array.prototype.sort()` automatski pretvara sve elemente niza u stringove i poredi ih leksikografski (po abecednom redu UTF-16 kodova). Zbog toga `"10"` dolazi pre `"2"`.',
    steps: [
      'Korak 1: Elementi se pretvaraju u stringove: `"10"`, `"1"`, `"5"`, `"2"`, `"20"`',
      'Korak 2: Leksikografsko poređenje: `"1"` < `"10"` < `"2"` < `"20"` < `"5"`',
      'Korak 3: Sortirani izlaz: `[1, 10, 2, 20, 5]`',
      'Korak 4: Ispravno numeričko sortiranje: `[10, 1, 5, 2, 20].sort((a, b) => a - b)` → `[1, 2, 5, 10, 20]`'
    ],
    specReference: 'ECMA-262 §23.1.3.30 Array.prototype.sort'
  },
  {
    id: 'math-min-max',
    expression: 'Math.min() > Math.max()',
    evaluatedResult: 'true',
    category: 'Aritmetika i Konkatenacija',
    explanation: '`Math.min()` pozvan bez argumenata vraća `+Infinity` (neutralni element za traženje minimuma). `Math.max()` bez argumenata vraća `-Infinity` (neutralni element za traženje maksimuma). Pošto je `+Infinity > -Infinity`, rezultat izraza je `true`.',
    steps: [
      'Korak 1: `Math.min()` bez argumenata vraća `+Infinity`',
      'Korak 2: `Math.max()` bez argumenata vraća `-Infinity`',
      'Korak 3: Poređenje `+Infinity > -Infinity` daje `true`'
    ],
    specReference: 'ECMA-262 §21.2.2.24 Math.max & §21.2.2.25 Math.min'
  },
  {
    id: 'object-key-stringification',
    expression: 'const a = {}, b = { key: "b" }, c = { key: "c" }; a[b] = 123; a[c] = 456; a[b]',
    evaluatedResult: '456',
    category: 'Nizovi i Objekti',
    explanation: 'Standardni ključevi svojstava u JavaScript objektima mogu biti isključivo String ili Symbol. Kada se objekat `b` koristi kao ključ, on se preko `b.toString()` pretvara u `"[object Object]"`. I `a[b]` i `a[c]` zapravo upisuju u isto svojstvo `a["[object Object]"]`. Za objekte kao ključeve koristite `Map`!',
    steps: [
      'Korak 1: `a[b] = 123` zapravo postavlja `a["[object Object]"] = 123`',
      'Korak 2: `a[c] = 456` prepisuje istu vrednost: `a["[object Object]"] = 456`',
      'Korak 3: Čitanje `a[b]` vraća prepisanu vrednost `456`',
      'Korak 4: Rešenje: Koristite `new Map()` za skladištenje objekata kao ključeva.'
    ],
    specReference: 'ECMA-262 §7.1.17 ToPropertyKey'
  }
];
