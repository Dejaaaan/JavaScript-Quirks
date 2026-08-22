export interface CoercionItem {
  id: string;
  expression: string;
  evaluatedResult: string;
  category: 'Aritmetika i Konkatenacija' | 'Labava Jednakost (==)' | 'Konverzija Tipova' | 'Logika i Truthy/Falsy' | 'Nizovi i Objekti';
  categoryEn?: string;
  explanation: string;
  explanationEn?: string;
  steps: string[];
  stepsEn?: string[];
  specReference: string;
}

export const COERCION_DATABASE: CoercionItem[] = [
  {
    id: 'empty-arrays-add',
    expression: '[] + []',
    evaluatedResult: '""',
    category: 'Aritmetika i Konkatenacija',
    categoryEn: 'Arithmetic & Concatenation',
    explanation: 'Oba prazna niza se konvertuju u primitivne vrednosti pozivom apstraktne operacije `ToPrimitive()`. Prazan niz poziva metodu `Array.prototype.toString()`, što daje prazan string `""`. Sabiranje dva prazna stringa `"" + ""` rezultuje praznim stringom `""`.',
    explanationEn: 'Both empty arrays are coerced to primitives via `ToPrimitive()`. An empty array calls `Array.prototype.toString()`, returning an empty string `""`. Concatenating two empty strings `"" + ""` yields `""`.',
    steps: [
      'Korak 1: Evaluacija levog operanda `[]`: `ToPrimitive([])` poziva `[].toString()` → `""` (prazan string)',
      'Korak 2: Evaluacija desnog operanda `[]`: `ToPrimitive([])` poziva `[].toString()` → `""` (prazan string)',
      'Korak 3: Primenjuje se operator `+` na dva stringa: `"" + ""` → `""`'
    ],
    stepsEn: [
      'Step 1: Left operand `[]`: `ToPrimitive([])` calls `[].toString()` → `""` (empty string)',
      'Step 2: Right operand `[]`: `ToPrimitive([])` calls `[].toString()` → `""` (empty string)',
      'Step 3: Apply `+` operator to two strings: `"" + ""` → `""`'
    ],
    specReference: 'ECMA-262 §7.1.1 ToPrimitive & §13.15.3 ApplyStringOrNumericBinaryOperator'
  },
  {
    id: 'array-plus-object',
    expression: '[] + {}',
    evaluatedResult: '"[object Object]"',
    category: 'Aritmetika i Konkatenacija',
    categoryEn: 'Arithmetic & Concatenation',
    explanation: 'Levi operand `[]` se konvertuje u `""`. Desni operand `{}` se preko metode `Object.prototype.toString()` konvertuje u primitivni string `"[object Object]"`. Spajanjem stringova dobija se `"[object Object]"`.',
    explanationEn: 'Left operand `[]` evaluates to `""`. Right operand `{}` invokes `Object.prototype.toString()` to become primitive string `"[object Object]"`. String concatenation yields `"[object Object]"`.',
    steps: [
      'Korak 1: Levi operand `[]` poziva `[].toString()` → `""` (string)',
      'Korak 2: Desni operand `{}` poziva `({}).toString()` → `"[object Object]"` (string)',
      'Korak 3: Izvršava se konkatenacija: `"" + "[object Object]"` → `"[object Object]"`'
    ],
    stepsEn: [
      'Step 1: Left operand `[]` calls `[].toString()` → `""` (string)',
      'Step 2: Right operand `{}` calls `({}).toString()` → `"[object Object]"` (string)',
      'Step 3: Concatenation runs: `"" + "[object Object]"` → `"[object Object]"`'
    ],
    specReference: 'ECMA-262 §7.1.1 ToPrimitive (hint: "default")'
  },
  {
    id: 'object-plus-array-quirk',
    expression: '{ } + [ ]',
    evaluatedResult: '0 (u konzoli) ili "[object Object]" (u izrazu)',
    category: 'Aritmetika i Konkatenacija',
    categoryEn: 'Arithmetic & Concatenation',
    explanation: 'Na početku naredbe, `{}` se parsira kao prazan blok koda, pa se zatim evaluira unarni operator `+[]` koji prazan niz konvertuje u broj `0`. Ukoliko je izraz obuhvaćen zagradama `({} + [])`, `{}` se tretira kao objekat i rezultat je `"[object Object]"`.',
    explanationEn: 'At the statement beginning, `{}` is parsed as an empty block, followed by unary `+[]` which coerces empty array to `0`. If parenthesized `({} + [])`, `{}` is treated as an object literal producing `"[object Object]"`.',
    steps: [
      'Korak 1: Na nivou naredbe: `{}` se tumači kao prazan blok koda `{}`',
      'Korak 2: Preostali deo je unarni plus: `+[]`',
      'Korak 3: `+[]` poziva `Number("")` → `0`',
      'Korak 4: Ako je obuhvaćeno zagradama `({} + [])`: `{}` je objekat i rezultat je `"[object Object]"`'
    ],
    stepsEn: [
      'Step 1: At statement level: `{}` is interpreted as an empty code block `{}`',
      'Step 2: Remaining part is unary plus: `+[]`',
      'Step 3: `+[]` invokes `Number("")` → `0`',
      'Step 4: If wrapped in parentheses `({} + [])`: `{}` is an object literal → `"[object Object]"`'
    ],
    specReference: 'ECMA-262 Gramatička dvosmislenost: BlockStatement naspram ObjectLiteral'
  },
  {
    id: 'array-equals-not-array',
    expression: '[] == ![]',
    evaluatedResult: 'true',
    category: 'Labava Jednakost (==)',
    categoryEn: 'Loose Equality (==)',
    explanation: 'Logički operator NOT `!` ima veći prioritet od operatora `==`. Izraz `![]` daje `false` jer su svi objekti (pa i nizovi) u JavaScript-u truthy. Zatim se porede `[] == false` prema pravilima labave jednakosti.',
    explanationEn: 'Logical NOT `!` has higher precedence than `==`. `![]` yields `false` because all objects (including arrays) are truthy in JS. Then `[] == false` is compared via abstract equality rules.',
    steps: [
      'Korak 1: Prvo se evaluira `![]`: `Boolean([])` je `true`, pa `!true` daje `false`',
      'Korak 2: Izraz sada glasi: `[] == false`',
      'Korak 3: Pravilo: Ako se poredi Objekat sa Boolean-om, Boolean se konvertuje u broj (`ToNumber(false)` = `0`), pa imamo: `[] == 0`',
      'Korak 4: Pravilo: Ako se poredi Objekat sa brojem, Objekat se konvertuje u primitivnu vrednost (`ToPrimitive([])` = `""`), pa imamo: `"" == 0`',
      'Korak 5: Pravilo: Ako se poredi String sa brojem, String se konvertuje u broj (`ToNumber("")` = `0`), pa imamo: `0 == 0`',
      'Korak 6: Rezultat je `0 === 0` što daje `true`!'
    ],
    stepsEn: [
      'Step 1: Evaluate `![]`: `Boolean([])` is `true`, so `!true` gives `false`',
      'Step 2: Expression becomes `[] == false`',
      'Step 3: Object vs Boolean rule: Boolean converts to number (`ToNumber(false)` = `0`) → `[] == 0`',
      'Step 4: Object vs Number rule: Object converts to primitive (`ToPrimitive([])` = `""`) → `"" == 0`',
      'Step 5: String vs Number rule: String converts to number (`ToNumber("")` = `0`) → `0 == 0`',
      'Step 6: Result is `0 === 0` which returns `true`!'
    ],
    specReference: 'ECMA-262 §7.2.14 Abstract Equality Comparison'
  },
  {
    id: 'string-minus-vs-plus',
    expression: '"5" - 3 vs "5" + 3',
    evaluatedResult: '2 vs "53"',
    category: 'Aritmetika i Konkatenacija',
    categoryEn: 'Arithmetic & Concatenation',
    explanation: 'Operator `+` je preopterećen za spajanje stringova ukoliko je bar jedan operand tipa string. Operator `-` radi isključivo sa brojevima i uvek primorava oba operanda na numeričku konverziju.',
    explanationEn: 'Operator `+` is overloaded for string concatenation when at least one operand is a string. Operator `-` only performs arithmetic and forces both operands to Numbers via `ToNumber()`.',
    steps: [
      'Korak 1: Za `"5" + 3`: Jedan operand je string → spajanje stringova → `"5" + "3"` = `"53"`',
      'Korak 2: Za `"5" - 3`: Oduzimanje podržava samo brojeve → `Number("5") - 3` = `5 - 3` = `2`',
      'Korak 3: `"5" * 2 = 10`, `"5" / 2 = 2.5` (svi ostali matematički operatori vrše konverziju u Number)'
    ],
    stepsEn: [
      'Step 1: For `"5" + 3`: String operand triggers concatenation → `"5" + "3"` = `"53"`',
      'Step 2: For `"5" - 3`: Subtraction forces numeric conversion → `Number("5") - 3` = `5 - 3` = `2`',
      'Step 3: `"5" * 2 = 10`, `"5" / 2 = 2.5` (all other math operators convert operands to Number)'
    ],
    specReference: 'ECMA-262 §13.15.3 Addition vs Subtraction'
  },
  {
    id: 'typeof-null',
    expression: 'typeof null',
    evaluatedResult: '"object"',
    category: 'Konverzija Tipova',
    categoryEn: 'Type Conversion',
    explanation: 'U originalnoj implementaciji JavaScript-a iz 1995. godine, vrednosti su čuvane kao oznaka tipa (type tag) i sama vrednost. Objekti su imali oznaku tipa 0. Pokazivač na null (NULL pointer) imao je vrednost 0x00, zbog čega je `typeof` pogrešno vraćao "object". Ova greška je zadržana zbog kompatibilnosti unazad sa postojećim web sajtovima.',
    explanationEn: 'In JS 1995 engine, values had a type tag. Objects had tag `0`. The null pointer was `0x00`, leading `typeof` to mistakenly return `"object"`. Kept for backward compatibility.',
    steps: [
      'Korak 1: U ranom JS engine-u: bit oznaka objekta bila je `000`',
      'Korak 2: null pointer je u jeziku C bio `0x00`, što se poklopilo sa oznakom `000`',
      'Korak 3: `typeof` je čitao bitove oznake i klasifikovao `null` kao objekat',
      'Korak 4: Predlog u ECMAScript-u da se ovo ispravi je odbijen radi kompatibilnosti unazad.'
    ],
    stepsEn: [
      'Step 1: In early JS engine: object bit tag was `000`',
      'Step 2: Null pointer in C was `0x00`, matching `000` tag',
      'Step 3: `typeof` checked tag bits and classified `null` as object',
      'Step 4: An ECMAScript fix was proposed (`typeof null === "null"`) but rejected to avoid breaking the web.'
    ],
    specReference: 'ECMA-262 §13.5.3 The typeof Operator (historic bug)'
  },
  {
    id: 'nan-equality',
    expression: 'NaN === NaN',
    evaluatedResult: 'false',
    category: 'Labava Jednakost (==)',
    categoryEn: 'Loose Equality (==)',
    explanation: 'Prema IEEE 754 standardu za brojeve sa pokretnim zarezom, `NaN` (Not a Number) predstavlja nedefinisan ili neodređen numerički rezultat i nikada nije jednak nijednoj vrednosti, čak ni samom sebi. Za detekciju koristite `Number.isNaN()` ili `Object.is()`.',
    explanationEn: 'Per IEEE 754 standard, `NaN` represents an undefined numerical result and never equals any value, including itself. Use `Number.isNaN()` or `Object.is(NaN, NaN)`.',
    steps: [
      'Korak 1: IEEE 754 specifikacija nalaže da poređenje bilo kog broja sa NaN daje false',
      'Korak 2: `NaN === NaN` → false',
      'Korak 3: `NaN == NaN` → false',
      'Korak 4: Ispravno rešenje: `Number.isNaN(val)` ili `Object.is(NaN, NaN)` (vraća true)'
    ],
    stepsEn: [
      'Step 1: IEEE 754 specifies any comparison involving NaN returns false',
      'Step 2: `NaN === NaN` → false',
      'Step 3: `NaN == NaN` → false',
      'Step 4: Proper check: `Number.isNaN(val)` or `Object.is(NaN, NaN)` (returns true)'
    ],
    specReference: 'IEEE 754-2008 Standard & ECMA-262 §7.2.15 Strict Equality Comparison'
  },
  {
    id: 'truthy-array-equals-false',
    expression: 'Boolean([]) === true && [] == false',
    evaluatedResult: 'true',
    category: 'Logika i Truthy/Falsy',
    categoryEn: 'Logic & Truthy/Falsy',
    explanation: 'Svi objekti (uključujući prazan niz `[]`) su truthy kada se direktno evaluiraju u logičkom kontekstu (`if ([])` se izvršava). Međutim, u labavoj jednakosti `==`, `[]` se konvertuje u primitivni string `""`, koji potom postaje broj `0`, što se poklapa sa `false` (0).',
    explanationEn: 'All objects (including `[]`) are truthy in boolean context (`if ([])` runs). In loose equality `==`, `[]` is coerced to `""`, then to `0`, which equals `false` (0).',
    steps: [
      'Korak 1: `Boolean([])` je `true` jer je svaka referenca na objekat truthy.',
      'Korak 2: Za `[] == false` pokreće se algoritam labave konverzije:',
      'Korak 3: 1. `false` → `0`',
      'Korak 4: 2. `[]` → `""` (preko `[].toString()`)',
      'Korak 5: 3. `""` → `0` (preko `Number("")`)',
      'Korak 6: 4. `0 == 0` → `true`'
    ],
    stepsEn: [
      'Step 1: `Boolean([])` is `true` because every object reference is truthy.',
      'Step 2: For `[] == false` loose coercion runs:',
      'Step 3: 1. `false` → `0`',
      'Step 4: 2. `[]` → `""` (via `[].toString()`)',
      'Step 5: 3. `""` → `0` (via `Number("")`)',
      'Step 6: 4. `0 == 0` → `true`'
    ],
    specReference: 'ECMA-262 §7.1.2 ToBoolean vs §7.2.14 Abstract Equality'
  },
  {
    id: 'array-sort-numbers',
    expression: '[10, 1, 5, 2, 20].sort()',
    evaluatedResult: '[1, 10, 2, 20, 5]',
    category: 'Nizovi i Objekti',
    categoryEn: 'Arrays & Objects',
    explanation: 'Ukoliko ne navedete funkciju poređenja (komparator), `Array.prototype.sort()` automatski pretvara sve elemente niza u stringove i poredi ih leksikografski (po abecednom redu UTF-16 kodova). Zbog toga `"10"` dolazi pre `"2"`.',
    explanationEn: 'Without a comparator function, `Array.prototype.sort()` converts elements to strings and compares their UTF-16 code units lexicographically, placing `"10"` before `"2"`.',
    steps: [
      'Korak 1: Elementi se pretvaraju u stringove: `"10"`, `"1"`, `"5"`, `"2"`, `"20"`',
      'Korak 2: Leksikografsko poređenje: `"1"` < `"10"` < `"2"` < `"20"` < `"5"`',
      'Korak 3: Sortirani izlaz: `[1, 10, 2, 20, 5]`',
      'Korak 4: Ispravno numeričko sortiranje: `[10, 1, 5, 2, 20].sort((a, b) => a - b)` → `[1, 2, 5, 10, 20]`'
    ],
    stepsEn: [
      'Step 1: Elements are stringified: `"10"`, `"1"`, `"5"`, `"2"`, `"20"`',
      'Step 2: Lexicographical comparison: `"1"` < `"10"` < `"2"` < `"20"` < `"5"`',
      'Step 3: Sorted output: `[1, 10, 2, 20, 5]`',
      'Step 4: Correct numeric sort: `[10, 1, 5, 2, 20].sort((a, b) => a - b)` → `[1, 2, 5, 10, 20]`'
    ],
    specReference: 'ECMA-262 §23.1.3.30 Array.prototype.sort'
  },
  {
    id: 'math-min-max',
    expression: 'Math.min() > Math.max()',
    evaluatedResult: 'true',
    category: 'Aritmetika i Konkatenacija',
    categoryEn: 'Arithmetic & Concatenation',
    explanation: '`Math.min()` pozvan bez argumenata vraća `+Infinity` (neutralni element za traženje minimuma). `Math.max()` bez argumenata vraća `-Infinity` (neutralni element za traženje maksimuma). Pošto je `+Infinity > -Infinity`, rezultat izraza je `true`.',
    explanationEn: '`Math.min()` with no arguments returns `+Infinity` (identity element for minimum). `Math.max()` returns `-Infinity`. Because `+Infinity > -Infinity`, the expression yields `true`.',
    steps: [
      'Korak 1: `Math.min()` bez argumenata vraća `+Infinity`',
      'Korak 2: `Math.max()` bez argumenata vraća `-Infinity`',
      'Korak 3: Poređenje `+Infinity > -Infinity` daje `true`'
    ],
    stepsEn: [
      'Step 1: `Math.min()` without arguments returns `+Infinity`',
      'Step 2: `Math.max()` without arguments returns `-Infinity`',
      'Step 3: Comparison `+Infinity > -Infinity` produces `true`'
    ],
    specReference: 'ECMA-262 §21.2.2.24 Math.max & §21.2.2.25 Math.min'
  },
  {
    id: 'object-key-stringification',
    expression: 'const a = {}, b = { key: "b" }, c = { key: "c" }; a[b] = 123; a[c] = 456; a[b]',
    evaluatedResult: '456',
    category: 'Nizovi i Objekti',
    categoryEn: 'Arrays & Objects',
    explanation: 'Standardni ključevi svojstava u JavaScript objektima mogu biti isključivo String ili Symbol. Kada se objekat `b` koristi kao ključ, on se preko `b.toString()` pretvara u `"[object Object]"`. I `a[b]` i `a[c]` zapravo upisuju u isto svojstvo `a["[object Object]"]`. Za objekte kao ključeve koristite `Map`!',
    explanationEn: 'Object property keys must be String or Symbol. Using object `b` as a key converts it via `toString()` to `"[object Object]"`. Both `a[b]` and `a[c]` write to the exact same property `a["[object Object]"]`. Use `Map` for object keys!',
    steps: [
      'Korak 1: `a[b] = 123` zapravo postavlja `a["[object Object]"] = 123`',
      'Korak 2: `a[c] = 456` prepisuje istu vrednost: `a["[object Object]"] = 456`',
      'Korak 3: Čitanje `a[b]` vraća prepisanu vrednost `456`',
      'Korak 4: Rešenje: Koristite `new Map()` za skladištenje objekata kao ključeva.'
    ],
    stepsEn: [
      'Step 1: `a[b] = 123` assigns to `a["[object Object]"] = 123`',
      'Step 2: `a[c] = 456` overwrites the same key: `a["[object Object]"] = 456`',
      'Step 3: Reading `a[b]` returns the overwritten value `456`',
      'Step 4: Solution: Use `new Map()` when you need object references as keys.'
    ],
    specReference: 'ECMA-262 §7.1.17 ToPropertyKey'
  }
];
