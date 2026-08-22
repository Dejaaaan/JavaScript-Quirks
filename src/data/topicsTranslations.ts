import fs from 'fs';

// Helper script to inject bilingual translations into topics.ts and leetcodeProblems.ts
console.log('Starting data localization injection...');

const topicsTranslations = {
  'type-coercion-equality': {
    titleEn: 'Implicit Type Coercion and Loose Equality (==)',
    subtitleEn: 'The mysterious mechanics of +, -, == operators and the ToPrimitive algorithm',
    summaryEn: 'JavaScript is dynamically and weakly typed. When operators receive incompatible types, rather than halting execution, the runtime invokes abstract conversion algorithms (ToPrimitive, ToNumber, ToString). Mastering these exact ECMAScript rules eliminates the sense of magic and unpredictability in JS expressions.',
    deepDiveTitleEn: 'How JavaScript Converts Types Under the Hood',
    deepDiveSummaryEn: 'When evaluating operations between different types (such as addition or equality checks), JavaScript resolves operands via a strict series of steps defined in the ECMA-262 specification.',
    keyPoints: [
      {
        termEn: 'ToPrimitive(input, preferredType) Algorithm',
        detailEn: 'If an operand is an object or array, JS first checks for a Symbol.toPrimitive method. If absent, it calls .valueOf(), and if that does not return a primitive, it calls .toString(). For arrays, [1, 2].toString() yields "1,2", while [].toString() yields "".'
      },
      {
        termEn: 'Overloaded Addition Operator (+)',
        detailEn: 'The + operator is the only arithmetic operator performing both mathematical addition and string concatenation. Rule: if either operand becomes a String after ToPrimitive, string concatenation occurs. All other operators (-, *, /, %) unconditionally convert operands to Number via ToNumber().'
      },
      {
        termEn: 'Loose (==) vs Strict (===) Equality',
        detailEn: 'Strict equality (===) immediately returns false if types differ. Loose equality (==) executes 11 comparison steps: e.g. comparing Number and Boolean converts Boolean to Number (true -> 1, false -> 0). The expression [] == ![] evaluates to true because ![] becomes false, then [] and false coerce to 0 == 0 -> true.'
      },
      {
        termEn: 'Special Case: null and undefined',
        detailEn: 'Under loose equality (==), null and undefined equal only each other and nothing else (null == undefined is true, but null == 0 is false). However, relational operators (>=, <=) coerce null to 0 via ToNumber, making null >= 0 evaluate to true!'
      }
    ],
    mentalModelEn: 'Think of JS operators as filters: the + operator prefers String if text is encountered, whereas arithmetic operators (-, *, /) and relational operators (>, <, >=) aggressively enforce Number conversion via ToNumber.',
    presets: {
      'coercion-math': {
        titleEn: 'Math and String Coercion',
        descriptionEn: 'Observe the difference between overloaded + and numeric arithmetic operators (-, *, /)'
      },
      'coercion-arrays-objects': {
        titleEn: 'Arrays and Objects in Arithmetic',
        descriptionEn: 'How objects and arrays resolve via .valueOf() and .toString() methods'
      },
      'loose-vs-strict': {
        titleEn: 'Loose (==) vs Strict (===) Equality',
        descriptionEn: 'Why 0 == false is true, null == undefined is true, but null == false is false'
      }
    },
    comparisons: [
      {
        titleEn: 'Equality Checking (Loose == vs Strict ===)',
        badExplanationEn: 'Loose equality (==) steps through 11 abstract conversion rules. Comparisons like "" == 0, [] == false or "0" == false return true, causing hidden security and logic bugs.',
        goodExplanationEn: 'Strict equality (===) never performs type coercion. If types are not identical, it immediately returns false without side effects.',
        pitfallEn: 'Implicit type coercion in if conditions causing misleading truthy/falsy evaluations.'
      },
      {
        titleEn: 'Number Parsing and Validation',
        badExplanationEn: 'Global isNaN() coerces its argument to Number before validation. Hence isNaN("hello") or isNaN({}) return true even though the inputs were not originally of type NaN.',
        goodExplanationEn: 'Number.isNaN() introduced in ES6 strictly checks if the passed value is of type Number and equals NaN, without any implicit type casting.',
        pitfallEn: 'Accidentally using the global isNaN() function for validating user inputs.'
      }
    ],
    langComparisons: [
      {
        jsBehaviorEn: 'JavaScript automatically coerces operand types to avoid crashing in early browser scripts.',
        otherBehaviorEn: 'Python is strongly typed and disallows implicit arithmetic between strings and numbers.',
        keyDifferenceEn: 'Dynamic + Weakly Typed (JS) vs Dynamic + Strongly Typed (Python).',
        whyJsDoesThisEn: 'Built in 10 days in 1995 for Netscape Navigator, engineered to be forgiving so scripts would not crash web pages.'
      },
      {
        jsBehaviorEn: 'Relational operator `>=` coerces `null` to `0` via abstract `ToNumber()`, whereas loose `==` does not.',
        otherBehaviorEn: 'Java enforces compile-time static type checks, and unboxing null throws NullPointerException.',
        keyDifferenceEn: 'Implicit relational coercion in JS vs strict compile-time types in Java.',
        whyJsDoesThisEn: 'Separate algorithms in ECMAScript specification for Abstract Equality (7.2.14) and Abstract Relational Comparison (7.2.13).'
      }
    ]
  },
  'event-loop-concurrency': {
    titleEn: 'Event Loop & Task Queues',
    subtitleEn: 'Single-threaded non-blocking I/O, Microtasks vs Macrotasks, and Starvation',
    summaryEn: 'JavaScript executes on a single thread with a single Call Stack. Asynchronous behavior is achieved through the runtime environment (Browser Web APIs or Node.js libuv) coordinating with the Event Loop to manage the Call Stack, Microtask Queue (Promises), and Macrotask Queue (Timers/I-O).',
    deepDiveTitleEn: 'Anatomy of an Event Loop Tick',
    deepDiveSummaryEn: 'The Event Loop is a continuous process monitoring the Call Stack and dispatching tasks based on strict priority levels.',
    keyPoints: [
      {
        termEn: '1. Call Stack (Main Thread Execution)',
        detailEn: 'Where synchronous JavaScript executes function frames in LIFO (Last-In, First-Out) order. As long as a frame occupies the Call Stack, the Event Loop cannot process any asynchronous tasks.'
      },
      {
        termEn: '2. Microtask Queue (Highest Priority)',
        detailEn: 'Houses Promise .then/.catch/.finally callbacks, async/await resumes, queueMicrotask, and MutationObservers. Once the Call Stack empties, the Event Loop DRAINS THE ENTIRE MICROTASK QUEUE before yielding to anything else!'
      },
      {
        termEn: '3. Render Phase & requestAnimationFrame',
        detailEn: 'After microtasks drain, the browser updates display rendering if needed (e.g. every 16.6ms for 60fps), executing rAF callbacks and recalculating layout/paint.'
      },
      {
        termEn: '4. Macrotask / Task Queue (Standard Priority)',
        detailEn: 'Houses setTimeout, setInterval, setImmediate (Node), I/O events, and user UI interactions. Each tick, the Event Loop executes EXACTLY ONE Macrotask, transfers it to the Call Stack, and immediately checks the Microtask queue again.'
      }
    ],
    mentalModelEn: 'The Microtask queue acts like a VIP priority pass: if a microtask schedules another microtask, all of them must run before the browser even checks the next setTimeout!',
    presets: {
      'classic-microtask-race': {
        titleEn: 'Execution Order: Microtasks vs Macrotasks',
        descriptionEn: 'Track the exact sequencing of synchronous code, setTimeout callbacks, and Promise.then tasks'
      },
      'nested-async-order': {
        titleEn: 'Unwinding Async/Await Execution Flow',
        descriptionEn: 'How await pauses function execution and queues subsequent expressions into the Microtask queue'
      }
    },
    comparisons: [
      {
        titleEn: 'Running Heavy Computations Without Freezing the UI',
        badExplanationEn: 'Since JS is single-threaded, long synchronous loops completely occupy the Call Stack. The Event Loop cannot process page rendering, user clicks, or async events, leading to a frozen UI.',
        goodExplanationEn: 'Using `setTimeout(resolve, 0)` or `requestIdleCallback` allows the browser to paint frames and respond to user actions between processed data chunks.',
        pitfallEn: 'Blocking the main thread with heavy CPU computations instead of chunking or utilizing Web Workers.'
      }
    ],
    langComparisons: [
      {
        jsBehaviorEn: 'Single-threaded event queue model with non-blocking I/O. Concurrency is based on async callbacks and Promises.',
        otherBehaviorEn: 'Go uses lightweight green threads (Goroutines) scheduled across multi-core OS threads with preemptive context switching.',
        keyDifferenceEn: 'Single-threaded non-blocking Event Loop vs true multi-threaded preemptive concurrency (Goroutines).',
        whyJsDoesThisEn: 'Avoids complex thread locks (mutexes), race conditions, and shared memory corruption in browser environments.'
      }
    ]
  },
  'this-context-binding': {
    titleEn: 'The "this" Keyword & Execution Context',
    subtitleEn: 'Dynamic binding, call/apply/bind methods, and lexical arrow functions',
    summaryEn: 'Unlike languages where `this` is permanently tied to a class instance, in JavaScript standard functions dynamically evaluate `this` based on their invocation call-site at runtime. Arrow functions, conversely, do not have their own `this` and capture it lexically from their enclosing scope.',
    deepDiveTitleEn: 'The 4 Rules of "this" Resolution (Ranked by Precedence)',
    deepDiveSummaryEn: 'When a function body executes, the JavaScript engine resolves `this` according to a strict 4-rule hierarchy:',
    keyPoints: [
      {
        termEn: '1. new Binding (Constructors - Highest Priority)',
        detailEn: 'Invoking `new MyFunc()` causes the JS engine to allocate a brand new empty object, set its prototype to MyFunc.prototype, bind `this` to that new instance, and return it.'
      },
      {
        termEn: '2. Explicit Binding (.call, .apply, .bind)',
        detailEn: '`.call(context, ...args)` and `.apply(context, [args])` execute the function immediately forcing `context` as `this`. `.bind(context)` returns a new wrapper function permanently locked to the object.'
      },
      {
        termEn: '3. Implicit Binding (Object Preceding Dot)',
        detailEn: 'Calling `user.getName()` sets the object directly before the dot (`user`) as `this`. Detaching the reference into a variable (`const fn = user.getName; fn()`) breaks and loses the implicit binding!'
      },
      {
        termEn: '4. Default Binding (Fallback)',
        detailEn: 'A standalone function call `fn()` in non-strict mode binds `this` to the global object (window/globalThis). In strict mode ("use strict"), `this` safely remains `undefined` to prevent global pollution.'
      }
    ],
    mentalModelEn: 'Always locate the exact site where the function parentheses `()` are invoked. Exception: Arrow functions ignore the call-site and resolve `this` where they were lexically authored.',
    presets: {
      'lost-context-demo': {
        titleEn: 'The Classic "Lost this Context" Trap',
        descriptionEn: 'Detaching a method reference from its parent object breaks its implicit this binding'
      },
      'arrow-vs-regular-this': {
        titleEn: 'Arrow Functions vs Regular Functions',
        descriptionEn: 'Arrow functions lexically inherit this from their enclosing scope at declaration time'
      }
    },
    comparisons: [
      {
        titleEn: 'Passing Object Methods as Callback Functions',
        badExplanationEn: '`setTimeout` invokes the passed callback as a standalone function `callback()`, resetting `this` to the global object or undefined in strict mode.',
        goodExplanationEn: 'Class arrow properties bind to the instance during constructor initialization, making them safe to pass directly as callbacks.',
        pitfallEn: 'Losing `this` context when passing object methods as event listeners or timers.'
      }
    ],
    langComparisons: [
      {
        jsBehaviorEn: 'Methods in JS are plain function references stored in object properties; the call-site dictates `this`.',
        otherBehaviorEn: 'Python dot access returns a "Bound Method" object that encapsulates the `self` instance pointer permanently.',
        keyDifferenceEn: 'Dynamic call-site `this` (JS) vs automatically bound instance reference (Python).',
        whyJsDoesThisEn: 'Enables method borrowing across objects via `fn.call(otherObj)` and sharing prototypes without extra wrapper allocations.'
      }
    ]
  },
  'scope-hoisting-closures': {
    titleEn: 'Scope, Hoisting & Closures',
    subtitleEn: 'var vs let/const, Temporal Dead Zone (TDZ), and Lexical Environments',
    summaryEn: 'JavaScript uses lexical (static) scoping. Before execution, the engine runs an environment creation phase where memory is allocated for declarations. Understanding the difference between pre-initialized hoisting (var) and the Temporal Dead Zone (let/const) is vital to preventing bugs.',
    deepDiveTitleEn: 'Execution Context Creation Phase & Binding Lifecycle',
    deepDiveSummaryEn: 'Entering a new scope (function or block) initializes an Environment Record and registers variables in two phases:',
    keyPoints: [
      {
        termEn: '1. Function and var Hoisting',
        detailEn: 'Function declarations (`function foo() {}`) are hoisted entirely and can be called immediately. Variables declared with `var` are also hoisted, but are pre-initialized to `undefined`.'
      },
      {
        termEn: '2. Temporal Dead Zone (TDZ) for let and const',
        detailEn: '`let` and `const` are registered in memory during creation, but REMAIN UNINITIALIZED. The time gap between entering the block and evaluating the declaration line is the TDZ. Accessing them throws ReferenceError.'
      },
      {
        termEn: '3. Block Scope in Loops',
        detailEn: 'While `var` has function scope and shares a single binding across loop iterations, `let` inside a for loop creates a FRESH lexical binding for every single iteration, fixing async timer closures.'
      },
      {
        termEn: '4. Closures',
        detailEn: 'A closure occurs when an inner function retains a reference to its outer Environment Record even after the outer function has returned and been popped from the Call Stack.'
      }
    ],
    mentalModelEn: 'Think of `let` and `const` like reserved parking spaces with a barrier (TDZ): the slot exists from the start of the block, but parking or reading the sign is forbidden until the declaration line evaluates.',
    presets: {
      'var-in-loops-trap': {
        titleEn: 'The Famous "var inside setTimeout Loop" Trap',
        descriptionEn: 'Why var logs 3, 3, 3 while let correctly logs 0, 1, 2'
      },
      'tdz-hoisting-demo': {
        titleEn: 'Temporal Dead Zone (TDZ) vs Hoisting',
        descriptionEn: 'Variables with let/const exist in scope before their declaration line, but accessing them throws ReferenceError'
      }
    },
    comparisons: [
      {
        titleEn: 'Variable Declarations (var vs const/let)',
        badExplanationEn: '`var` is scoped to function or global levels and completely ignores block curly braces `{}`.',
        goodExplanationEn: '`let` and `const` have strict block scope, protecting code against accidental variable leakage and unexpected state overwrites.',
        pitfallEn: 'Accidental variable leakage and namespace collisions caused by var.'
      }
    ],
    langComparisons: [
      {
        jsBehaviorEn: 'In JS, objects declared with const can still mutate their inner properties.',
        otherBehaviorEn: 'Rust enforces deep immutability at both value and binding levels at compile time.',
        keyDifferenceEn: 'Reference binding protection (JS) vs deep value immutability (Rust).',
        whyJsDoesThisEn: 'JavaScript objects are dynamic key-value collections passed by reference.'
      }
    ]
  },
  'prototypes-oop': {
    titleEn: 'Prototypes, __proto__ & Inheritance',
    subtitleEn: 'Delegation inheritance, Prototype Pollution risk, and ES6 class reality',
    summaryEn: 'JavaScript lacks classical copy-based classes. ES6 `class` syntax is pure syntactic sugar over the prototype delegation chain. Every object carries an internal [[Prototype]] link to another object, facilitating memory-efficient method sharing.',
    deepDiveTitleEn: 'How Prototype Delegation Works',
    deepDiveSummaryEn: 'Accessing `obj.prop` travels up live object reference links rather than querying a static class definition.',
    keyPoints: [
      {
        termEn: '1. Property Lookup & Delegation',
        detailEn: 'If a property does not exist on the object itself, JS checks its internal [[Prototype]] (`__proto__`). The lookup continues up the chain until found or until `Object.prototype.[[Prototype]]` (which is `null`) is reached, returning `undefined`.'
      },
      {
        termEn: '2. Property Writing & Shadowing',
        detailEn: 'Assigning `obj.prop = 42` creates an "own" property directly on instance `obj`, leaving the prototype unchanged and preventing cross-instance mutation bugs.'
      },
      {
        termEn: '3. Constructors vs Instances (prototype vs __proto__)',
        detailEn: 'Constructor functions and classes have a `.prototype` property (the blueprint object). Instances have `__proto__` pointing to that same prototype object.'
      },
      {
        termEn: '4. Prototype Pollution Security Risk',
        detailEn: 'Merging untrusted user JSON containing `__proto__` can mutate `Object.prototype`, altering the behavior of EVERY object in the entire runtime!'
      }
    ],
    mentalModelEn: 'The prototype chain is a delegation chain: an instance says "If I do not have this method, ask my parent. If my parent lacks it, ask their parent up to Object.prototype".',
    presets: {
      'prototype-chain-traversal': {
        titleEn: 'Prototype Chain Traversal',
        descriptionEn: 'Observe property lookup traveling up prototypes until reaching terminal null'
      },
      'class-vs-prototype': {
        titleEn: 'ES6 Classes Under the Hood',
        descriptionEn: 'Classes in JS are constructor functions linked to prototype objects'
      }
    },
    comparisons: [
      {
        titleEn: 'Dictionary Lookup (Object vs Map vs Object.create(null))',
        badExplanationEn: 'Plain objects inherit built-in methods like `toString` from `Object.prototype`. Checking keys without `Object.hasOwn()` can cause false positives or Prototype Pollution.',
        goodExplanationEn: '`Map` or `Object.create(null)` have no inherited prototype, ensuring secure lookup for arbitrary user keys without built-in collisions.',
        pitfallEn: 'Prototype collision and security risks when using plain objects as hash maps.'
      }
    ],
    langComparisons: [
      {
        jsBehaviorEn: 'Objects are dynamic memory property bags with a live prototype delegation pointer.',
        otherBehaviorEn: 'Java classes compile to bytecode with a strict VTable method resolution structure.',
        keyDifferenceEn: 'Prototype delegation and dynamic extension vs classical static inheritance.',
        whyJsDoesThisEn: 'Designed for flexible DOM element manipulation in web browsers without compilation steps.'
      }
    ]
  },
  'arrays-and-objects': {
    titleEn: 'Array Quirks, Sparse Holes & Mutation',
    subtitleEn: 'Lexicographical sorting, sparse array slots, and deep vs shallow cloning',
    summaryEn: 'JavaScript arrays are specialized objects with numeric keys and an automatic `length` property. The default `Array.prototype.sort()` converts elements to strings, while removing items with the `delete` operator creates empty "holes" (sparse slots) that iterators skip.',
    deepDiveTitleEn: 'V8 Array Optimization & Mutation Traps',
    deepDiveSummaryEn: 'Modern engines optimize arrays based on memory density, but certain operations degrade performance:',
    keyPoints: [
      {
        termEn: '1. V8 Element Kinds (Packed vs Holey/Sparse)',
        detailEn: 'When an array is densely populated ([1, 2, 3]), V8 stores it as a high-speed continuous C++ vector (PACKED_SMI_ELEMENTS). Creating holes via `new Array(3)` or `delete arr[0]` switches it to a slow HOLEY/DICTIONARY mode.'
      },
      {
        termEn: '2. Default Lexicographical Sorting',
        detailEn: 'Calling `arr.sort()` without arguments converts elements to UTF-16 strings. Hence [10, 2, 5].sort() yields [10, 2, 5] because "10" precedes "2". Always pass a numeric comparator `(a, b) => a - b`!'
      },
      {
        termEn: '3. Shallow Copy (Spread) vs Deep Cloning',
        detailEn: 'Spread `[...arr]` and `{...obj}` copy only first-level properties. Nested objects copy by reference. For true deep cloning, use native `structuredClone(obj)`.'
      },
      {
        termEn: '4. Modern Immutable Methods (ES2023)',
        detailEn: 'Methods like .sort(), .reverse(), and .splice() mutate arrays in place. ES2023 introduced non-mutating alternatives: `.toSorted()`, `.toReversed()`, `.toSpliced()`, and `.with(index, value)`.'
      }
    ],
    mentalModelEn: 'Never use `delete` on arrays (it leaves a sparse empty slot). Use `.splice()` or `.filter()` to resize arrays cleanly and preserve fast continuous memory.',
    presets: {
      'array-sort-trap': {
        titleEn: 'Default sort() Method Trap',
        descriptionEn: 'Why [10, 2, 1, 20].sort() fails to sort numbers by magnitude'
      },
      'sparse-arrays-holes': {
        titleEn: 'Sparse Arrays (Empty Slots vs Undefined)',
        descriptionEn: 'Array(3) creates 3 empty holes. .map() and .forEach() skip empty slots!'
      },
      'cloning-objects-modern': {
        titleEn: 'Cloning Objects: Spread vs structuredClone',
        descriptionEn: 'Comparing shallow spread, JSON serialization, and modern structuredClone'
      }
    },
    comparisons: [
      {
        titleEn: 'Sorting Numeric Arrays',
        badExplanationEn: 'By default, `Array.prototype.sort()` converts elements to strings and compares UTF-16 code units, placing 100 before 25.',
        goodExplanationEn: 'Supplying `(a, b) => a - b` provides true numeric comparison. `toSorted()` avoids mutating the source array.',
        pitfallEn: 'Accidental alphabetical sorting of numeric arrays.'
      }
    ],
    langComparisons: [
      {
        jsBehaviorEn: 'JS sorts arrays by converting each item to String unless a custom comparator is provided.',
        otherBehaviorEn: 'Python sorts elements based on their natural comparison operators (`<`).',
        keyDifferenceEn: 'Default string sorting (JS) vs natural typed value comparison (Python).',
        whyJsDoesThisEn: 'In 1995 arrays primarily stored string tokens when manipulating DOM elements.'
      }
    ]
  },
  'floating-point-numbers': {
    titleEn: 'Floating-Point Math & BigInt Precision',
    subtitleEn: 'IEEE 754 standard, MAX_SAFE_INTEGER limits, and the difference between -0 and +0',
    summaryEn: 'All standard numbers in JavaScript are stored as 64-bit double-precision floating point numbers adhering to the IEEE 754 standard. Because base-10 fractions (such as 0.1 and 0.2) convert into infinite repeating binary expansions, minimal rounding discrepancies occur.',
    deepDiveTitleEn: 'IEEE 754 Format & Safe Integer Boundaries',
    deepDiveSummaryEn: 'Memory layout of every 64-bit Double Precision number in JavaScript:',
    keyPoints: [
      {
        termEn: '1. Memory Layout: 1 sign bit + 11 exponent bits + 52 fraction bits',
        detailEn: 'With 52 mantissa bits, JavaScript can represent integers precisely within [-(2^53 - 1), +(2^53 - 1)]. This limit is defined by `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991).'
      },
      {
        termEn: '2. Why 0.1 + 0.2 === 0.30000000000000004',
        detailEn: 'In base-2, 0.1 is an infinite binary repeating fraction: 0.0001100110011... Truncating at 53 bits rounds slightly upwards. Never compare decimals with `===`; use `Math.abs(a - b) < Number.EPSILON`.'
      },
      {
        termEn: '3. Integer Overflow & The BigInt Solution',
        detailEn: 'Above MAX_SAFE_INTEGER, adjacent integers share the same binary representation, causing `MAX_SAFE_INTEGER + 1 === MAX_SAFE_INTEGER + 2` to evaluate to true! For 64-bit database IDs, hashes, or cryptography, use `BigInt` (e.g. `1234567890123456789n`).'
      },
      {
        termEn: '4. Signed Zero (-0 vs +0)',
        detailEn: 'Due to the sign bit, JS supports both +0 and -0: `+0 === -0` is true, but `1 / +0` yields `Infinity` while `1 / -0` yields `-Infinity`! Distinguish them with `Object.is(+0, -0)` which returns false.'
      }
    ],
    mentalModelEn: 'For financial calculations, NEVER store money as floating decimals—store currency in cents/cents as integers or use a dedicated decimal library.',
    presets: {
      'float-math-demo': {
        titleEn: 'Precision Pitfall: 0.1 + 0.2',
        descriptionEn: 'Learn why binary floating point arithmetic yields 0.30000000000000004'
      },
      'max-safe-int-demo': {
        titleEn: 'Number.MAX_SAFE_INTEGER & BigInt',
        descriptionEn: 'Exceeding 2^53 - 1 loses precision silently. BigInt resolves this completely.'
      }
    },
    comparisons: [
      {
        titleEn: 'Financial and Currency Calculations',
        badExplanationEn: 'Floating-point rounding errors create fractional cents discrepancies, resulting in incorrect financial balances.',
        goodExplanationEn: 'Working with integer cents (or specific decimal libraries) eliminates binary floating-point rounding errors.',
        pitfallEn: 'Directly using floating-point decimals for monetary calculations.'
      }
    ],
    langComparisons: [
      {
        jsBehaviorEn: 'All standard numbers in JS are IEEE 754 64-bit double precision floats.',
        otherBehaviorEn: 'Rust features strictly typed machine primitives: i8, u32, i64, f32, f64, isize.',
        keyDifferenceEn: 'Universal float64 type (JS) vs explicit primitive machine types (Rust).',
        whyJsDoesThisEn: 'Designed simply so beginners wouldn\'t have to deal with integer overflows or register bit-widths.'
      }
    ]
  },
  'syntax-asi-traps': {
    titleEn: 'Automatic Semicolon Insertion (ASI) & Syntax Traps',
    subtitleEn: 'The return newline trap, parenthesis hazards, and the comma operator',
    summaryEn: 'JavaScript features Automatic Semicolon Insertion (ASI), automatically placing semicolons at line breaks where code would otherwise produce syntax errors. However, restricted productions like `return` treat a subsequent newline as an immediate statement terminator, silently returning `undefined`.',
    deepDiveTitleEn: 'ASI Rules & Syntax Pitfalls',
    deepDiveSummaryEn: 'The ECMA-262 specification governs 3 primary rules for semicolon insertion:',
    keyPoints: [
      {
        termEn: '1. Restricted Productions',
        detailEn: 'No line terminator is permitted immediately after keywords: `return`, `throw`, `yield`, `break`, `continue`, or before `++` and `--`. Breaking the line (`return\\n { a: 1 }`) causes JS to insert a semicolon after `return`, returning undefined.'
      },
      {
        termEn: '2. Hazard with Lines Starting with ( or [',
        detailEn: 'Without semicolons, if the next line starts with `(` or `[`, JS will NOT insert `;`. It parses the line as a function call or property access on the previous line, throwing a TypeError!'
      },
      {
        termEn: '3. Comma Operator',
        detailEn: 'The comma operator `(expr1, expr2)` evaluates both operands left-to-right and returns the value of the LAST expression. E.g., `let x = (1, 2, 3);` sets x to 3.'
      },
      {
        termEn: '4. Closing Curly Braces } and End of File',
        detailEn: 'ASI automatically inserts a semicolon before a closing curly brace `}` or at the end of the script.'
      }
    ],
    mentalModelEn: 'If omitting semicolons, never start a line with `[`, `(`, `/` (regex), or `` ` ``, and always keep the opening brace `{` on the same line as `return`.',
    presets: {
      'return-asi-trap': {
        titleEn: 'The return Newline Trap',
        descriptionEn: 'Why placing an object on a new line below return yields undefined'
      },
      'parenthesis-hazard': {
        titleEn: 'Hazard with Lines Starting with ( and [',
        descriptionEn: 'When semicolons are omitted, lines starting with ( or [ are parsed as calls on previous expressions'
      }
    },
    comparisons: [
      {
        titleEn: 'Statement Termination & Multiline Return',
        badExplanationEn: 'ASI rules mandate that a newline following `return` automatically inserts a semicolon (`return;`), leaving the object below as unreachable dead code.',
        goodExplanationEn: 'Placing the opening brace `{` or parenthesis `(` on the same line as `return` prevents automatic semicolon insertion.',
        pitfallEn: 'Hidden bugs where functions silently return undefined due to a line break.'
      }
    ],
    langComparisons: [
      {
        jsBehaviorEn: 'C-style brace syntax combined with heuristic automatic semicolon insertion.',
        otherBehaviorEn: 'Python relies on an indentation-based grammar with explicit expression continuation.',
        keyDifferenceEn: 'ASI heuristics (JS) vs indentation grammar (Python).',
        whyJsDoesThisEn: 'To make semicolons optional for newcomers while maintaining a syntax familiar to C and Java programmers.'
      }
    ]
  }
};

// Export for node runner
export { topicsTranslations };
