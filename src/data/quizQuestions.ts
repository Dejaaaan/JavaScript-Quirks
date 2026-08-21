import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-1',
    title: 'Tranzitivnost labave jednakosti (==)',
    codeSnippet: `console.log(0 == "0");
console.log(0 == []);
console.log("0" == []);`,
    options: [
      'true, true, true',
      'true, true, false',
      'false, false, false',
      'true, false, false'
    ],
    correctAnswerIndex: 1,
    explanation: 'Izraz `0 == "0"` je `true` (string se konvertuje u broj `0`). Izraz `0 == []` je `true` (`[]` se konvertuje u `""` pa u `0`). ALI `"0" == []` poredi String i Objekat: `[]` postaje `""`, a `"0" == ""` je `false`! Labava jednakost u JavaScript-u NIJE tranzitivna.',
    ecmaRule: 'ECMA-262 §7.2.14 Abstract Equality Comparison',
    difficulty: 'WTJS Quirks',
    category: 'type-coercion'
  },
  {
    id: 'quiz-2',
    title: 'Misterija sortiranja niza',
    codeSnippet: `const numbers = [10, 1, 5, 2, 20];
numbers.sort();
console.log(numbers);`,
    options: [
      '[1, 2, 5, 10, 20]',
      '[1, 10, 2, 20, 5]',
      '[20, 10, 5, 2, 1]',
      'TypeError: cannot sort numbers without comparator'
    ],
    correctAnswerIndex: 1,
    explanation: 'Podrazumevano, `Array.prototype.sort()` konvertuje elemente u stringove i poredi njihove UTF-16 kodne tačke (leksikografski). Zato string `"10"` abecedno dolazi pre stringa `"2"`. Za numeričko sortiranje neophodno je proslediti comparator funkciju `(a, b) => a - b`.',
    ecmaRule: 'ECMA-262 §23.1.3.30 Array.prototype.sort',
    difficulty: 'Beginner',
    category: 'arrays-objects'
  },
  {
    id: 'quiz-3',
    title: 'Dvostruki typeof operator',
    codeSnippet: `console.log(typeof typeof 1);`,
    options: [
      '"number"',
      '"string"',
      '"undefined"',
      '"object"'
    ],
    correctAnswerIndex: 1,
    explanation: 'Prvo se evaluira `typeof 1` što daje string vrednost `"number"`. Zatim se evaluira `typeof "number"`, što vraća `"string"` jer je rezultat svakog `typeof` operatora uvek string tip!',
    ecmaRule: 'ECMA-262 §13.5.3 The typeof Operator vraća string primitiv',
    difficulty: 'Beginner',
    category: 'type-coercion'
  },
  {
    id: 'quiz-4',
    title: 'Relaciona naspram Labave jednakosti sa Null',
    codeSnippet: `console.log(null > 0);
console.log(null == 0);
console.log(null >= 0);`,
    options: [
      'false, false, false',
      'false, true, true',
      'false, false, true',
      'true, true, true'
    ],
    correctAnswerIndex: 2,
    explanation: 'Relacioni operator `>=` konvertuje `null` preko `Number(null)` što daje `0` (pa je `0 >= 0` tačno tj. `true`). Ali `==` koristi drugačije pravilo gde je `null` labavo jednak SAMO sa `undefined` (pa je `null == 0` netačno tj. `false`)!',
    ecmaRule: 'ECMA-262 §7.2.13 Abstract Relational naspram §7.2.14 Abstract Equality',
    difficulty: 'WTJS Quirks',
    category: 'type-coercion'
  },
  {
    id: 'quiz-5',
    title: 'Hoisting funkcija naspram zasenjivanja promenljivih',
    codeSnippet: `var a = 1;
function test() {
  a = 10;
  return;
  function a() {}
}
test();
console.log(a);`,
    options: [
      '10',
      '1',
      'undefined',
      'TypeError: a is not a function'
    ],
    correctAnswerIndex: 1,
    explanation: 'Unutar funkcije `test()`, deklaracija funkcije `function a() {}` biva podignuta (hoisted) na sam vrh funkcijskog opsega, kreirajući lokalnu promenljivu `a`. Dodeljivanje `a = 10` menja tu lokalnu promenljivu, dok spoljašnje globalno `a` ostaje netaknuto sa vrednošću `1`!',
    ecmaRule: 'ECMA-262 §10.2.1 FunctionDeclarationInstantiation hoisting pravilo',
    difficulty: 'Advanced',
    category: 'scope-closures'
  },
  {
    id: 'quiz-6',
    title: 'Sparse nizovi i Array.map()',
    codeSnippet: `const arr = [1, 2, 3];
delete arr[1];
const result = arr.map(x => x * 2);
console.log(result.length, result[1]);`,
    options: [
      '2, undefined',
      '3, NaN',
      '3, undefined (empty slot)',
      '3, 4'
    ],
    correctAnswerIndex: 2,
    explanation: 'Operator `delete arr[1]` ne menja indekse preostalih elemenata, već stvara prazan slot (rupu u nizu). Metoda `Array.prototype.map` po specifikaciji preskače prazne slotove, pa je rezultat `[2, <empty>, 6]` dužine `3`, a pristup `result[1]` vraća `undefined`.',
    ecmaRule: 'ECMA-262 §23.1.3.19 Array.prototype.map (HasProperty provera)',
    difficulty: 'Intermediate',
    category: 'arrays-objects'
  },
  {
    id: 'quiz-7',
    title: 'Ekstremi metoda Math.min i Math.max',
    codeSnippet: `console.log(Math.min() > Math.max());`,
    options: [
      'false',
      'true',
      'NaN',
      'TypeError'
    ],
    correctAnswerIndex: 1,
    explanation: '`Math.min()` bez argumenata vraća `+Infinity` (neutralni element za traženje minimuma). `Math.max()` bez argumenata vraća `-Infinity`. Pošto je `+Infinity > -Infinity`, izraz daje `true`!',
    ecmaRule: 'ECMA-262 §21.2.2.24 & §21.2.2.25 Math svojstva',
    difficulty: 'WTJS Quirks',
    category: 'math-numbers'
  },
  {
    id: 'quiz-8',
    title: 'Operator sabiranja nad nizovima',
    codeSnippet: `console.log([1, 2] + [3, 4]);`,
    options: [
      '[1, 2, 3, 4]',
      '"1,23,4"',
      'NaN',
      'TypeError: cannot add arrays'
    ],
    correctAnswerIndex: 1,
    explanation: 'Nizovi ne podržavaju matematičko sabiranje. Operator `+` poziva metodu `.toString()` na oba niza: `[1, 2].toString()` daje `"1,2"`, a `[3, 4].toString()` daje `"3,4"`. Spajanjem stringova `"1,2" + "3,4"` dobija se `"1,23,4"`.',
    ecmaRule: 'ECMA-262 §13.15.3 ApplyStringOrNumericBinaryOperator',
    difficulty: 'Intermediate',
    category: 'type-coercion'
  },
  {
    id: 'quiz-9',
    title: 'Konverzija ključeva objekta u string',
    codeSnippet: `const a = {};
const b = { key: 'b' };
const c = { key: 'c' };

a[b] = 123;
a[c] = 456;

console.log(a[b]);`,
    options: [
      '123',
      '456',
      'undefined',
      'TypeError'
    ],
    correctAnswerIndex: 1,
    explanation: 'Ključevi običnog JavaScript objekta moraju biti `string` ili `symbol`. I objekat `b` i objekat `c` se preko `toString()` konvertuju u string `"[object Object]"`. Zato i `a[b]` i `a[c]` pristupaju potpuno istom svojstvu `a["[object Object]"]`, pa poslednja dodela `456` prepisuje prethodnu.',
    ecmaRule: 'ECMA-262 §7.1.17 ToPropertyKey',
    difficulty: 'Intermediate',
    category: 'arrays-objects'
  },
  {
    id: 'quiz-10',
    title: 'Automatsko umetanje tačka-zapete (ASI) na Return naredbi',
    codeSnippet: `function foo() {
  return
  {
    name: 'JS'
  };
}
console.log(foo());`,
    options: [
      '{ name: "JS" }',
      'undefined',
      'null',
      'SyntaxError'
    ],
    correctAnswerIndex: 1,
    explanation: 'JavaScript automatski postavlja tačka-zarez nakon `return` jer se u sledećem redu nalazi prelom reda pre `{`. Kod postaje `return;`, a blok `{ name: "JS" }` ispod se tretira kao nedostižna naredba. Funkcija vraća `undefined`.',
    ecmaRule: 'ECMA-262 §12.9.1 Pravila automatskog umetanja tačka-zapete (ASI)',
    difficulty: 'Beginner',
    category: 'syntax-asi'
  },
  {
    id: 'quiz-11',
    title: 'Redosled u Event Loop-u',
    codeSnippet: `console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');`,
    options: [
      'A, B, C, D',
      'A, D, B, C',
      'A, D, C, B',
      'A, C, D, B'
    ],
    correctAnswerIndex: 2,
    explanation: 'Sinhroni pozivi `\'A\'` i `\'D\'` se izvršavaju prvi na Call Stack-u. Zatim se Microtask red (`Promise \'C\'`) u potpunosti prazni pre nego što se pređe na Macrotask red (`setTimeout \'B\'`). Redosled je: `A`, `D`, `C`, `B`.',
    ecmaRule: 'HTML Event Loop: Microtask red se prazni pre sledeće iteracije glavnog task loop-a',
    difficulty: 'Intermediate',
    category: 'event-loop'
  },
  {
    id: 'quiz-12',
    title: 'Unarni plus i matematičke operacije sa Boolean vrednostima',
    codeSnippet: `console.log(+true + !!"false" + +[]);`,
    options: [
      '2',
      '3',
      'NaN',
      '"1true0"'
    ],
    correctAnswerIndex: 0,
    explanation: 'Unarni `+true` postaje `1`. `!!"false"` (neprazan string je truthy) daje `true` (što se u sabiranju konvertuje u `1`). `+[]` konvertuje `[]` u `""` pa u `0`. Ukupno: `1 + 1 + 0 = 2`.',
    ecmaRule: 'ECMA-262 §13.5.6 Unary + Operator & §7.1.1 ToNumber',
    difficulty: 'WTJS Quirks',
    category: 'type-coercion'
  }
];
