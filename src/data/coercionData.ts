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
  },
  {
    id: 'relational-string-vs-number',
    expression: '"10" < "9" vs "10" < 9',
    evaluatedResult: 'true vs false',
    category: 'Aritmetika i Konkatenacija',
    categoryEn: 'Arithmetic & Concatenation',
    explanation: 'Kada su OBA operanda stringovi, relacioni operatori (`<`, `>`, `<=`, `>=`) vrše leksikografsko poređenje UTF-16 kodova znakova (`"1"` ima manji kod od `"9"`, pa je `"10" < "9"` tačno!). Ali kada je jedan operand broj, a drugi string, string se preko `ToNumber()` konvertuje u broj, pa `10 < 9` daje `false`.',
    explanationEn: 'When BOTH operands are strings, relational operators (`<`, `>`, `<=`, `>=`) compare UTF-16 character codes lexicographically (`"1"` < `"9"`, making `"10" < "9"` true!). But when one operand is a number, the string is coerced via `ToNumber()`, making `10 < 9` evaluate to `false`.',
    steps: [
      'Korak 1: `"10" < "9"`: Oba su stringovi → Leksikografsko poređenje prvih znakova: `"1"` (kod 49) < `"9"` (kod 57) → `true`',
      'Korak 2: `"10" < 9`: Jedan je broj → `ToNumber("10")` = `10` → Numeričko poređenje: `10 < 9` → `false`',
      'Korak 3: Zato je `"100" < "20"` tačno, dok je `"100" < 20` netačno!'
    ],
    stepsEn: [
      'Step 1: `"10" < "9"`: Both are strings → Lexicographical UTF-16 comparison of first characters: `"1"` (code 49) < `"9"` (code 57) → `true`',
      'Step 2: `"10" < 9`: One operand is number → `ToNumber("10")` = `10` → Numeric comparison: `10 < 9` → `false`',
      'Step 3: Hence `"100" < "20"` is true, whereas `"100" < 20` is false!'
    ],
    specReference: 'ECMA-262 §7.2.13 Abstract Relational Comparison'
  },
  {
    id: 'null-relational-quirk',
    expression: 'null == 0 vs null >= 0 vs null > 0',
    evaluatedResult: 'false vs true vs false',
    category: 'Labava Jednakost (==)',
    categoryEn: 'Loose Equality (==)',
    explanation: 'Jedna od najpoznatijih asimetrija u JavaScript-u. Labava jednakost `==` koristi algoritam u 11 koraka gde `null` biva jednak isključivo sa `undefined`. Nasuprot tome, relacioni operatori (`>=`, `<=`, `<`, `>`) koriste Abstract Relational Comparison koji eksplicitno poziva `ToNumber(null)` što daje `0`. Zato `0 >= 0` daje `true`, dok `0 > 0` daje `false`!',
    explanationEn: 'One of the most famous asymmetries in JS. Loose equality `==` uses an 11-step algorithm where `null` only equals `undefined`. In contrast, relational operators (`>=`, `<=`, `<`, `>`) invoke `ToNumber(null)` which yields `0`. Thus `0 >= 0` evaluates to `true`, while `0 > 0` evaluates to `false`!',
    steps: [
      'Korak 1: `null == 0` → Pravilo specifikacije: `null` je labavo jednak samo sa `undefined` → `false`',
      'Korak 2: `null >= 0` → Relaciono poređenje pretvara `null` preko `ToNumber(null)` u `0` → `0 >= 0` → `true`',
      'Korak 3: `null > 0` → `ToNumber(null)` = `0` → `0 > 0` → `false`'
    ],
    stepsEn: [
      'Step 1: `null == 0` → Spec rule: `null` loosely equals only `undefined` → `false`',
      'Step 2: `null >= 0` → Relational comparison coerces `null` via `ToNumber(null)` to `0` → `0 >= 0` → `true`',
      'Step 3: `null > 0` → `ToNumber(null)` = `0` → `0 > 0` → `false`'
    ],
    specReference: 'ECMA-262 §7.2.13 (Relational) vs §7.2.14 (Equality)'
  },
  {
    id: 'samevalue-zero-nan-zero',
    expression: 'Object.is(+0, -0) vs (+0 === -0) && [NaN].includes(NaN)',
    evaluatedResult: 'false vs true && true',
    category: 'Labava Jednakost (==)',
    categoryEn: 'Loose Equality (==)',
    explanation: 'ECMAScript definiše 4 algoritma jednakosti: 1) Abstract Equality (`==`), 2) Strict Equality (`===`), 3) SameValue (`Object.is`), i 4) SameValueZero (koristi se u `Map`, `Set` i `Array.prototype.includes`). `SameValue` razlikuje `+0` i `-0` i smatra `NaN` jednakim samom sebi. `SameValueZero` smatra `+0` i `-0` jednakim, ali takođe smatra da je `NaN` jednak `NaN` (zbog čega `[NaN].includes(NaN)` vraća `true`, dok `[NaN].indexOf(NaN)` koji koristi `===` vraća `-1`).',
    explanationEn: 'ECMAScript defines 4 equality algorithms: 1) Abstract (`==`), 2) Strict (`===`), 3) SameValue (`Object.is`), and 4) SameValueZero (used by `Map`, `Set`, and `Array.prototype.includes`). `SameValue` distinguishes `+0` from `-0` and treats `NaN` equal to `NaN`. `SameValueZero` treats `+0` and `-0` as equal, but matches `NaN` to `NaN` (which is why `[NaN].includes(NaN)` is `true`, while `[NaN].indexOf(NaN)` using `===` returns `-1`).',
    steps: [
      'Korak 1: `+0 === -0` vraća `true` (IEEE 754 striktna jednakost)',
      'Korak 2: `Object.is(+0, -0)` vraća `false` (SameValue algoritam)',
      'Korak 3: `NaN === NaN` vraća `false`, pa `[NaN].indexOf(NaN)` vraća `-1`',
      'Korak 4: `[NaN].includes(NaN)` koristi SameValueZero algoritam i vraća `true`!'
    ],
    stepsEn: [
      'Step 1: `+0 === -0` returns `true` (IEEE 754 strict equality)',
      'Step 2: `Object.is(+0, -0)` returns `false` (SameValue algorithm)',
      'Step 3: `NaN === NaN` returns `false`, so `[NaN].indexOf(NaN)` returns `-1`',
      'Step 4: `[NaN].includes(NaN)` uses SameValueZero algorithm and returns `true`!'
    ],
    specReference: 'ECMA-262 §7.2.11 SameValue & §7.2.12 SameValueZero'
  },
  {
    id: 'bitwise-toint32-coercion',
    expression: '~~3.9 vs (1.5 | 0) vs (2**32 | 0)',
    evaluatedResult: '3 vs 1 vs 0',
    category: 'Konverzija Tipova',
    categoryEn: 'Type Conversion',
    explanation: 'Svi bitwise operatori u JavaScript-u (`~`, `|`, `&`, `^`, `<<`, `>>`) prinudno konvertuju svoje operande u 32-bitne označene cele brojeve (algoritam `ToInt32`). Decimalni deo se momentalno odseca (truncation). Brojevi veći od 2^31 - 1 se prelivaju (wrap-around), pa `(2**32) | 0` postaje `0`.',
    explanationEn: 'All JavaScript bitwise operators (`~`, `|`, `&`, `^`, `<<`, `>>`) force their operands into 32-bit signed integers (via `ToInt32`). Decimal portions are instantly truncated. Numbers beyond 2^31 - 1 wrap around, turning `(2**32) | 0` into `0`.',
    steps: [
      'Korak 1: `~~3.9`: Prvi `~3.9` poziva `ToInt32(3.9)` = 3, zatim bitwise NOT `~3` = -4; drugi `~(-4)` vraća 3 (brzo odsecanje decimale)',
      'Korak 2: `1.5 | 0`: `ToInt32(1.5)` = 1, `1 | 0` = 1',
      'Korak 3: `2**32 | 0`: `2**32` je 4294967296. U 32-bitnoj aritmetici sa modulom 2^32 ovo se preliva u `0`'
    ],
    stepsEn: [
      'Step 1: `~~3.9`: First `~3.9` runs `ToInt32(3.9)` = 3, bitwise NOT `~3` = -4; second `~(-4)` returns 3 (fast truncation)',
      'Step 2: `1.5 | 0`: `ToInt32(1.5)` = 1, `1 | 0` = 1',
      'Step 3: `2**32 | 0`: `2**32` is 4294967296. In 32-bit modulo 2^32 arithmetic it wraps around to `0`'
    ],
    specReference: 'ECMA-262 §7.1.5 ToInt32 & §7.1.6 ToUint32'
  },
  {
    id: 'symbol-coercion-rules',
    expression: 'String(Symbol("id")) vs ("" + Symbol("id"))',
    evaluatedResult: '"Symbol(id)" vs TypeError',
    category: 'Konverzija Tipova',
    categoryEn: 'Type Conversion',
    explanation: 'Simboli (`Symbol`) se namerno NE MOGU implicitno konvertovati u stringove ili brojeve! Pisanje `"" + Symbol("id")` ili `+Symbol("id")` baca `TypeError: Cannot convert a Symbol value to a string/number`. Ovo je namerno dizajnirano u ES6 kako bi se sprečilo da simboli slučajno postanu obična svojstva objekata. Eksplicitna konverzija preko `String(Symbol("id"))` ili `Boolean(Symbol("id"))` (koji je uvek `true`) je dozvoljena.',
    explanationEn: 'Symbols cannot be implicitly coerced to strings or numbers! Writing `"" + Symbol("id")` or `+Symbol("id")` throws `TypeError: Cannot convert a Symbol value to a string/number`. This was deliberately designed in ES6 to prevent symbols from silently degrading into normal string object properties. Explicit conversion via `String(Symbol("id"))` or `Boolean(Symbol("id"))` (always `true`) is permitted.',
    steps: [
      'Korak 1: `"" + Symbol("id")` pokušava implicitni `ToString` → baca `TypeError`!',
      'Korak 2: `+Symbol("id")` pokušava `ToNumber` → baca `TypeError`!',
      'Korak 3: `String(Symbol("id"))` vrši eksplicitnu konverziju → `"Symbol(id)"` (uspešno)',
      'Korak 4: `Boolean(Symbol("id"))` → `true` (svi simboli su truthy)'
    ],
    stepsEn: [
      'Step 1: `"" + Symbol("id")` attempts implicit `ToString` → throws `TypeError`!',
      'Step 2: `+Symbol("id")` attempts `ToNumber` → throws `TypeError`!',
      'Step 3: `String(Symbol("id"))` performs explicit conversion → `"Symbol(id)"` (succeeds)',
      'Step 4: `Boolean(Symbol("id"))` → `true` (all symbols are truthy)'
    ],
    specReference: 'ECMA-262 §7.1.12 ToString (Symbol rejection)'
  },
  {
    id: 'symbol-toprimitive-custom',
    expression: '+{ [Symbol.toPrimitive]: h => h==="number"?42:"hi" }',
    evaluatedResult: '42',
    category: 'Konverzija Tipova',
    categoryEn: 'Object-to-Primitive Coercion',
    explanation: 'Kada objekat implementira `[Symbol.toPrimitive](hint)`, JavaScript motor preskače standardne `.valueOf()` i `.toString()` metode i direktno prepušta kontrolu vašoj funkciji. Parametar `hint` može biti `"number"`, `"string"` ili `"default"`.',
    explanationEn: 'When an object defines `[Symbol.toPrimitive](hint)`, the JavaScript engine bypasses the standard `.valueOf()` and `.toString()` algorithms and delegates directly to your function. The `hint` argument is `"number"`, `"string"`, or `"default"`.',
    steps: [
      'Korak 1: Unarni `+` operator zahteva numeričku vrednost → Pokreće `ToPrimitive(hint: "number")`',
      'Korak 2: Motor pronalazi `[Symbol.toPrimitive]` hook i poziva ga sa `hint = "number"`',
      'Korak 3: Funkcija vraća `42` → Unarni plus dobija primitiv i rezultat je `42`',
      'Korak 4: Kada bismo upotrebili template literal `${obj}`, hint bi bio `"string"` i vratio bi `"hi"`!'
    ],
    stepsEn: [
      'Step 1: Unary `+` operator demands a numeric value → Triggers `ToPrimitive(hint: "number")`',
      'Step 2: Engine detects `[Symbol.toPrimitive]` hook and executes it passing `hint = "number"`',
      'Step 3: Function returns `42` → Unary plus receives primitive number and finishes with `42`',
      'Step 4: If evaluated in a template string `${obj}`, hint would be `"string"` and return `"hi"`!'
    ],
    specReference: 'ECMA-262 §7.1.1 ToPrimitive with Symbol.toPrimitive'
  },
  {
    id: 'parseint-vs-number-coercion',
    expression: 'parseInt("10px", 10) vs Number("10px") vs parseInt("08")',
    evaluatedResult: '10 vs NaN vs 8',
    category: 'Konverzija Tipova',
    categoryEn: 'Type Conversion',
    explanation: 'Razlika između parsiranja i konverzije: `Number("10px")` vrši striktnu `ToNumber` konverziju koja zahteva da CEO string bude validan broj (ako naiđe na `"px"`, vraća `NaN`). Nasuprot tome, `parseInt("10px", 10)` skenira string s leva na desno i staje na prvom ne-numeričkom karakteru (vraća `10`). Uvek eksplicitno navedite osnovu `10` (`radix`) u `parseInt` da biste izbegli oktalno parsiranje u starijim okruženjima!',
    explanationEn: 'Parsing vs Coercion distinction: `Number("10px")` runs strict `ToNumber` coercion requiring the ENTIRE string to be numeric (returns `NaN` upon encountering `"px"`). In contrast, `parseInt("10px", 10)` reads left-to-right until the first non-numeric character (returns `10`). Always supply explicit base `10` (`radix`) to `parseInt` to prevent legacy octal parsing!',
    steps: [
      'Korak 1: `Number("10px")` → Striktan `ToNumber` algoritam nailazi na slovo `"p"` → Momentalno vraća `NaN`',
      'Korak 2: `parseInt("10px", 10)` → Čita `"1"`, `"0"`, nailazi na `"p"` i prekida čitanje → Vraća `10`',
      'Korak 3: `Number("")` vraća `0`, dok `parseInt("")` vraća `NaN` (jer prazan string nema početne cifre)',
      'Korak 4: Zlatno pravilo: Za čiste brojeve koristite `Number(x)` ili `+x`; za CSS jedinice i mešovite stringove koristite `parseInt(x, 10)`'
    ],
    stepsEn: [
      'Step 1: `Number("10px")` → Strict `ToNumber` algorithm encounters non-digit `"p"` → Instantly returns `NaN`',
      'Step 2: `parseInt("10px", 10)` → Parses `"1"`, `"0"`, halts at `"p"` → Returns parsed integer `10`',
      'Step 3: `Number("")` evaluates to `0`, while `parseInt("")` evaluates to `NaN` (no starting digits)',
      'Step 4: Golden rule: For pure numbers use `Number(x)` or `+x`; for CSS units and mixed strings use `parseInt(x, 10)`'
    ],
    specReference: 'ECMA-262 §7.1.3 ToNumber vs §19.2.5 parseInt'
  }
];
