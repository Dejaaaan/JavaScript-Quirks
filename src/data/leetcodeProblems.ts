import { LeetCodeProblem } from '../types';

export const LEETCODE_PROBLEMS: LeetCodeProblem[] = [
  {
    "id": "two-sum",
    "number": 1,
    "title": "Two Sum (Zbir Dva Broja)",
    "titleEn": "Two Sum",
    "difficulty": "Easy",
    "category": "Arrays & Hash Maps",
    "tags": [
      "Hash Map",
      "Nizovi",
      "Jedan Prolaz",
      "O(n)"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/two-sum/",
    "description": "Dat je niz celih brojeva `nums` i ceo broj `target`. Pronađi indekse dva broja u nizu čiji je zbir jednak vrednosti `target`. Pretpostavlja se da svaki unos ima tačno jedno rešenje i ne sme se koristiti isti element dva puta. Rezultat se može vratiti u bilo kom redosledu.",
    "pattern": "Hash Map Lookup (Jedan Prolaz)",
    "examples": [
      {
        "input": "nums = [2, 7, 11, 15], target = 9",
        "output": "[0, 1]",
        "explanation": "Zato što je nums[0] + nums[1] == 2 + 7 == 9, vraćamo [0, 1].",
        "explanationEn": "Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1]."
      },
      {
        "input": "nums = [3, 2, 4], target = 6",
        "output": "[1, 2]",
        "explanation": "nums[1] + nums[2] == 2 + 4 == 6, vraćamo [1, 2].",
        "explanationEn": "nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2]."
      },
      {
        "input": "nums = [3, 3], target = 6",
        "output": "[0, 1]",
        "explanation": "nums[0] + nums[1] == 3 + 3 == 6, vraćamo [0, 1].",
        "explanationEn": "nums[0] + nums[1] == 3 + 3 == 6, we return [0, 1]."
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Postoji tačno jedno validno rešenje."
    ],
    "intuition": "Umesto dvostruke petlje koja poredi svaki par sa vremenskom složenošću O(n²), koristimo Hash Map (JavaScript `Map` ili plain objekat `{}`). Prilikom prolaska kroz niz za svaki broj `num` računamo komplement: `complement = target - num`. Ako komplement već postoji u mapi, odmah vraćamo njegov indeks i trenutni indeks.",
    "optimalSolution": {
      "title": "Optimalno rešenje: Hash Map u jednom prolazu",
      "code": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n  // Map to store pairs: { number => index }\n  const map = new Map();\n  \n  for (let i = 0; i < nums.length; i++) {\n    const current = nums[i];\n    const complement = target - current;\n    \n    // If we've seen the complement before, pair is found\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    \n    // Store current number and its index in map\n    map.set(current, i);\n  }\n  \n  return [];\n}",
      "timeComplexity": "O(n) — Jedan prolaz kroz niz dužine n; pretraga i upis u Map traju O(1) u proseku.",
      "spaceComplexity": "O(n) — U najgorem slučaju čuvamo do n elemenata u mapi.",
      "explanation": "U svakom koraku proveravamo da li je komplement već viđen. JavaScript `Map` nudi konzistentne O(1) operacije `.has()` i `.get()` bez zagađivanja prototipskog lanca koje običan objekat `{}` može imati.",
      "explanationEn": "In each step, we check if the complement has already been seen. JavaScript `Map` provides consistent average O(1) operations for `.has()` and `.get()` without the prototype chain interference of plain objects."
    },
    "bruteForceSolution": {
      "title": "Brute Force (Naivni pristup)",
      "code": "function twoSumBruteForce(nums, target) {\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) {\n        return [i, j];\n      }\n    }\n  }\n  return [];\n}",
      "timeComplexity": "O(n²) — Dve ugnježdene petlje testiraju sve parove.",
      "spaceComplexity": "O(1) — Ne koristi dodatnu memoriju.",
      "explanation": "Za veće nizove (n = 10^4) ovaj pristup dostiže 10^8 operacija i dovodi do Time Limit Exceeded (TLE).",
      "explanationEn": "For larger arrays (n = 10^4), nested loops require 10^8 operations, leading to Time Limit Exceeded (TLE)."
    },
    "jsSpecificTips": [
      "Koristite `new Map()` umesto običnog objekta `{}` kada su ključevi brojevi, jer objekti sve ključeve konvertuju u stringove što stvara nepotreban overhead.",
      "Metode `map.has()` i `map.get()` su znatno jasnije i bezbednije od `complement in obj` ili `obj[complement] !== undefined` jer izbegavaju probleme sa svojstvima iz `Object.prototype` (kao npr. `toString`)."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "Standard array",
        "inputParams": [
          [
            2,
            7,
            11,
            15
          ],
          9
        ],
        "inputStr": "nums = [2, 7, 11, 15], target = 9",
        "expectedOutput": [
          0,
          1
        ],
        "expectedStr": "[0, 1]"
      },
      {
        "id": "tc-2",
        "name": "Unsorted elements",
        "inputParams": [
          [
            3,
            2,
            4
          ],
          6
        ],
        "inputStr": "nums = [3, 2, 4], target = 6",
        "expectedOutput": [
          1,
          2
        ],
        "expectedStr": "[1, 2]"
      },
      {
        "id": "tc-3",
        "name": "Duplicates",
        "inputParams": [
          [
            3,
            3
          ],
          6
        ],
        "inputStr": "nums = [3, 3], target = 6",
        "expectedOutput": [
          0,
          1
        ],
        "expectedStr": "[0, 1]"
      },
      {
        "id": "tc-4",
        "name": "Negative numbers",
        "inputParams": [
          [
            -1,
            -2,
            -3,
            -4,
            -5
          ],
          -8
        ],
        "inputStr": "nums = [-1, -2, -3, -4, -5], target = -8",
        "expectedOutput": [
          2,
          4
        ],
        "expectedStr": "[2, 4]"
      }
    ],
    "runFunctionName": "twoSum",
    "descriptionEn": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    "patternEn": "Hash Map Lookup (Single Pass)",
    "intuitionEn": "Instead of using a nested loop comparing every pair with O(n²) time complexity, use a Hash Map (JavaScript `Map` or plain object `{}`). As you iterate through the array, compute the complement for each number: `complement = target - num`. If the complement is already in the map, immediately return its stored index along with the current index.",
    "jsSpecificTipsEn": [
      "Prefer `new Map()` over a plain object `{}` when keys are numbers, because objects coerce numeric keys into strings, adding extra allocation overhead.",
      "Methods `map.has()` and `map.get()` are safer than `complement in obj` or `obj[complement] !== undefined` because they avoid checking inherited properties on `Object.prototype` (such as `toString`)."
    ]
  },
  {
    "id": "valid-parentheses",
    "number": 20,
    "title": "Valid Parentheses (Validne Zagrade)",
    "titleEn": "Valid Parentheses",
    "difficulty": "Easy",
    "category": "Stack",
    "tags": [
      "Stack",
      "Stringovi",
      "O(n)"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/valid-parentheses/",
    "description": "Dat je string `s` koji sadrži samo karaktere `(`, `)`, `{`, `}`, `[` i `]`. Odredi da li je uneti string validan. String je validan ako:\n1. Otvorene zagrade moraju biti zatvorene istom vrstom zagrada.\n2. Otvorene zagrade moraju biti zatvorene u ispravnom redosledu.\n3. Svaka zatvorena zagrada ima odgovarajuću otvorenu zagradu istog tipa.",
    "pattern": "Stack (LIFO — Last In First Out)",
    "examples": [
      {
        "input": "s = \"()\"",
        "output": "true",
        "explanation": "Zagrada je otvorena i pravilno zatvorena.",
        "explanationEn": "The brackets match in correct order."
      },
      {
        "input": "s = \"()[]{}\"",
        "output": "true",
        "explanation": "Sve tri vrste zagrada su pravilno uparene i zatvorene.",
        "explanationEn": "All pairs open and close in proper sequence."
      },
      {
        "input": "s = \"(]\"",
        "output": "false",
        "explanation": "Otvorena je obla zagrada (, a zatvorena uglasta ].",
        "explanationEn": "Opening round bracket is closed by square bracket, which is invalid."
      },
      {
        "input": "s = \"([)]\"",
        "output": "false",
        "explanation": "Redosled zatvaranja nije ispravan."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^4",
      "s se sastoji isključivo od zagrada \"()[]{}\""
    ],
    "intuition": "Stack struktura podataka je savršena za uparivanje zagrada jer poslednja otvorena zagrada mora biti prva koja će se zatvoriti (LIFO). Kada naiđemo na otvorenu zagradu, stavljamo je na stack (ili odmah stavljamo njenu odgovarajuću zatvorenu). Kada naiđemo na zatvorenu zagradu, skidamo vrh stack-a i poredimo.",
    "optimalSolution": {
      "title": "Optimalno rešenje: Stack sa Hash Mapom",
      "code": "/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n  // If string length is odd, brackets cannot all be matched\n  if (s.length % 2 !== 0) return false;\n  \n  const stack = [];\n  const map = {\n    ')': '(',\n    '}': '{',\n    ']': '['\n  };\n  \n  for (let i = 0; i < s.length; i++) {\n    const char = s[i];\n    \n    if (map[char]) {\n      // char is closing bracket -> pop stack and compare\n      const top = stack.length > 0 ? stack.pop() : '#';\n      if (top !== map[char]) {\n        return false;\n      }\n    } else {\n      // char is opening bracket -> push to stack\n      stack.push(char);\n    }\n  }\n  \n  // If stack is empty, all brackets are properly matched\n  return stack.length === 0;\n}",
      "timeComplexity": "O(n) — Jedan prolaz kroz sve karaktere stringa; push i pop na JS niz traju O(1).",
      "spaceComplexity": "O(n) — U najgorem slučaju (npr. \"((((((\") na stack stavljamo do n elemenata.",
      "explanation": "Prethodna provera `s.length % 2 !== 0` odmah odbacuje neparne dužine u O(1). Koristimo JS niz kao brz Stack sa ugrađenim `.push()` i `.pop()` metodama.",
      "explanationEn": "Iterate through each character once. If it is an opening bracket, push its closing counterpart onto the stack. If it is a closing bracket, pop the top element and compare. If it does not match or the stack was empty, the string is invalid. Finally, return `stack.length === 0`."
    },
    "jsSpecificTips": [
      "U JavaScriptu, `Array.prototype.push()` i `Array.prototype.pop()` rade na kraju niza i imaju O(1) amortizovanu složenost, što niz čini idealnim stack-om.",
      "Nemojte koristiti `shift()` ili `unshift()` kao stack operacije jer one pomeraju sve elemente u nizu i imaju O(n) složenost!"
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "Simple pair",
        "inputParams": [
          "()"
        ],
        "inputStr": "s = \"()\"",
        "expectedOutput": true,
        "expectedStr": "true"
      },
      {
        "id": "tc-2",
        "name": "Mixed brackets",
        "inputParams": [
          "()[]{}"
        ],
        "inputStr": "s = \"()[]{}\"",
        "expectedOutput": true,
        "expectedStr": "true"
      },
      {
        "id": "tc-3",
        "name": "Mismatched brackets",
        "inputParams": [
          "(]"
        ],
        "inputStr": "s = \"(]\"",
        "expectedOutput": false,
        "expectedStr": "false"
      },
      {
        "id": "tc-4",
        "name": "Nested sequence",
        "inputParams": [
          "{[]()}"
        ],
        "inputStr": "s = \"{[]()}\"",
        "expectedOutput": true,
        "expectedStr": "true"
      },
      {
        "id": "tc-5",
        "name": "Closing brackets only",
        "inputParams": [
          "]["
        ],
        "inputStr": "s = \"][\"",
        "expectedOutput": false,
        "expectedStr": "false"
      }
    ],
    "runFunctionName": "isValid",
    "descriptionEn": "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    "patternEn": "Stack (LIFO)",
    "intuitionEn": "Use a Stack data structure (implemented via a JS array). When encountering an opening bracket, push its expected matching closing bracket onto the stack. When encountering a closing bracket, pop from the stack and verify that it matches. If the stack is empty at the end, all brackets were matched correctly.",
    "jsSpecificTipsEn": [
      "In JavaScript, standard arrays are used as stacks via `.push()` and `.pop()`, both of which are amortized O(1) operations in modern engines (V8).",
      "Using an early exit check `if (s.length % 2 !== 0) return false;` immediately rejects odd-length strings in O(1) time."
    ]
  },
  {
    "id": "best-time-to-buy-and-sell-stock",
    "number": 121,
    "title": "Best Time to Buy and Sell Stock (Najbolji Trenutak za Kupovinu Akcija)",
    "titleEn": "Best Time to Buy and Sell Stock",
    "difficulty": "Easy",
    "category": "Two Pointers",
    "tags": [
      "Nizovi",
      "Greedy",
      "Jedan Prolaz",
      "Sliding Window"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    "description": "Dat je niz `prices` gde je `prices[i]` cena date akcije `i`-tog dana. Želiš da maksimizuješ svoj profit biranjem jednog dana za kupovinu i drugog, kasnijeg dana u budućnosti za prodaju te akcije. Vrati maksimalni profit koji možeš ostvariti. Ako profit nije moguć, vrati 0.",
    "pattern": "Jedan Prolaz / Greedy (Tracking Min Price)",
    "examples": [
      {
        "input": "prices = [7, 1, 5, 3, 6, 4]",
        "output": "5",
        "explanation": "Kupovina 2. dana (cena = 1) i prodaja 5. dana (cena = 6), profit = 6 - 1 = 5.",
        "explanationEn": "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."
      },
      {
        "input": "prices = [7, 6, 4, 3, 1]",
        "output": "0",
        "explanation": "U ovom slučaju nijedna transakcija ne donosi profit, pa je maxProfit = 0.",
        "explanationEn": "In this case, no transactions are done and max profit = 0."
      }
    ],
    "constraints": [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    "intuition": "Kako prolazimo kroz niz s leva na desno, konstantno pamtimo najmanju cenu viđenu do sada (`minPrice`). Za svaki sledeći dan računamo potencijalni profit: `trenutnaCena - minPrice` i ažuriramo `maxProfit`.",
    "optimalSolution": {
      "title": "Optimalno rešenje: Jedan prolaz (Greedy)",
      "code": "/**\n * @param {number[]} prices\n * @return {number}\n */\nfunction maxProfit(prices) {\n  let minPrice = Infinity;\n  let maxProfit = 0;\n  \n  for (let i = 0; i < prices.length; i++) {\n    const price = prices[i];\n    \n    if (price < minPrice) {\n      minPrice = price; // Found a new lowest buying price\n    } else {\n      const currentProfit = price - minPrice;\n      if (currentProfit > maxProfit) {\n        maxProfit = currentProfit;\n      }\n    }\n  }\n  \n  return maxProfit;\n}",
      "timeComplexity": "O(n) — Jedan prolaz kroz ceo niz cena.",
      "spaceComplexity": "O(1) — Koriste se samo dve promenljive za praćenje stanja.",
      "explanation": "Ovaj pristup rešava problem u linearnom vremenu bez alokacije dodatne memorije. Inicijalizacija sa `Infinity` garantuje da će prva stvarna cena postati početni minimum.",
      "explanationEn": "Maintain two variables: `minPrice` (initialized to `Infinity`) and `maxProfit` (initialized to `0`). As we scan the prices array in a single pass, update `minPrice = Math.min(minPrice, price)` and `maxProfit = Math.max(maxProfit, price - minPrice)`."
    },
    "jsSpecificTips": [
      "U JS-u `Infinity` je globalno svojstvo koje predstavlja pozitivnu beskonačnost (`Number.POSITIVE_INFINITY`), idealno za početne min promenljive.",
      "Izbegavajte pozivanje `Math.min(...prices)` na velikim nizovima jer `Math.min(...arr)` raspakuje elemente na Call Stack kao argumente funkcije, što baca `RangeError: Maximum call stack size exceeded` za nizove veće od ~65,000 elemenata!"
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "Standard example",
        "inputParams": [
          [
            7,
            1,
            5,
            3,
            6,
            4
          ]
        ],
        "inputStr": "prices = [7, 1, 5, 3, 6, 4]",
        "expectedOutput": 5,
        "expectedStr": "5"
      },
      {
        "id": "tc-2",
        "name": "Descending prices (Zero profit)",
        "inputParams": [
          [
            7,
            6,
            4,
            3,
            1
          ]
        ],
        "inputStr": "prices = [7, 6, 4, 3, 1]",
        "expectedOutput": 0,
        "expectedStr": "0"
      },
      {
        "id": "tc-3",
        "name": "Two elements",
        "inputParams": [
          [
            2,
            4
          ]
        ],
        "inputStr": "prices = [2, 4]",
        "expectedOutput": 2,
        "expectedStr": "2"
      }
    ],
    "runFunctionName": "maxProfit",
    "descriptionEn": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    "patternEn": "Greedy / Single Pass Tracker",
    "intuitionEn": "Track the minimum buy price observed so far as you iterate through the days. On each day, compute the profit if sold today (`price - minPrice`) and update `maxProfit` if this profit is greater than our record.",
    "jsSpecificTipsEn": [
      "Use `Math.min()` and `Math.max()` for clean and idiomatic updates.",
      "Initialize `minPrice` to `Infinity` so the first price is guaranteed to set the baseline."
    ]
  },
  {
    "id": "valid-anagram",
    "number": 242,
    "title": "Valid Anagram (Validan Anagram)",
    "titleEn": "Valid Anagram",
    "difficulty": "Easy",
    "category": "Arrays & Hash Maps",
    "tags": [
      "Hash Map",
      "Stringovi",
      "Sortiranje",
      "Brojač Frekvencija"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/valid-anagram/",
    "description": "Data su dva stringa `s` i `t`. Vrati `true` ako je `t` anagram od `s`, a u suprotnom vrati `false`. Anagram je reč ili fraza formirana preslaganjem slova druge reči, koristeći sva originalna slova tačno jednom.",
    "pattern": "Frekventni Niz / Hash Map",
    "examples": [
      {
        "input": "s = \"anagram\", t = \"nagaram\"",
        "output": "true",
        "explanation": "Oba stringa sadrže ista slova sa istom frekvencijom.",
        "explanationEn": "Both strings contain the exact same characters with identical counts."
      },
      {
        "input": "s = \"rat\", t = \"car\"",
        "output": "false",
        "explanation": "Sadrže različita slova (c i t).",
        "explanationEn": "Character counts do not match."
      }
    ],
    "constraints": [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s i t se sastoje isključivo od malih engleskih slova"
    ],
    "intuition": "Dva stringa su anagrami ako i samo ako imaju identičnu dužinu i svako slovo se pojavljuje isti broj puta. Možemo koristiti fiksni niz od 26 elemenata (ili Hash Map) za praćenje broja pojavljivanja svakog karaktera.",
    "optimalSolution": {
      "title": "Optimalno rešenje: Niz frekvencije (26 karaktera)",
      "code": "/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nfunction isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  \n  // Array of 26 counters for lowercase letters ('a' through 'z')\n  const count = new Int32Array(26);\n  const baseCode = 'a'.charCodeAt(0);\n  \n  for (let i = 0; i < s.length; i++) {\n    count[s.charCodeAt(i) - baseCode]++;\n    count[t.charCodeAt(i) - baseCode]--;\n  }\n  \n  // If strings are anagrams, all counts must be 0\n  for (let i = 0; i < 26; i++) {\n    if (count[i] !== 0) return false;\n  }\n  \n  return true;\n}",
      "timeComplexity": "O(n) — Jedan prolaz kroz oba stringa dužine n.",
      "spaceComplexity": "O(1) — Koristi se fiksni TypedArray veličine 26 bajtova.",
      "explanation": "Umesto skupog sortiranja O(n log n), brojač frekvencije postiže O(n) vreme i O(1) dodatnu memoriju. Korišćenje `Int32Array(26)` u JS V8 engine-u je ekstremno brzo i eliminiše kreiranje objekata na heap-u.",
      "explanationEn": "First check if lengths differ (`s.length !== t.length`); if so, return false immediately. Use an integer array of size 26 or a Map to count character frequencies. Increment for `s` and decrement for `t`. If any count drops below zero, return false."
    },
    "bruteForceSolution": {
      "title": "Sortiranje (Brute Force / Alternativno)",
      "code": "function isAnagramSort(s, t) {\n  if (s.length !== t.length) return false;\n  return s.split('').sort().join('') === t.split('').sort().join('');\n}",
      "timeComplexity": "O(n log n) — Zbog sortiranja nizova karaktera.",
      "spaceComplexity": "O(n) — split() kreira nove nizove karaktera u memoriji.",
      "explanation": "Iako je kod kratak, pretvaranje stringova u nizove (`split`) i sortiranje je memorijski i računski znatno teže za velike stringove.",
      "explanationEn": "Sorting both strings (`s.split(\"\").sort().join(\"\")`) takes O(n log n) time and creates extra intermediate array and string allocations."
    },
    "jsSpecificTips": [
      "`charCodeAt(i)` je mnogo brži od indeksiranja karaktera ili `s[i]` kada želimo direktan numerički kod za tabele frekvencija.",
      "Za Unicode podršku (emojiji i internacionalni karakteri), koristite `new Map()` umesto fiksnog niza od 26 elemenata."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "Valid anagram",
        "inputParams": [
          "anagram",
          "nagaram"
        ],
        "inputStr": "s = \"anagram\", t = \"nagaram\"",
        "expectedOutput": true,
        "expectedStr": "true"
      },
      {
        "id": "tc-2",
        "name": "Not anagrams",
        "inputParams": [
          "rat",
          "car"
        ],
        "inputStr": "s = \"rat\", t = \"car\"",
        "expectedOutput": false,
        "expectedStr": "false"
      },
      {
        "id": "tc-3",
        "name": "Different lengths",
        "inputParams": [
          "a",
          "ab"
        ],
        "inputStr": "s = \"a\", t = \"ab\"",
        "expectedOutput": false,
        "expectedStr": "false"
      }
    ],
    "runFunctionName": "isAnagram",
    "descriptionEn": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    "patternEn": "Frequency Counter / Hash Map",
    "intuitionEn": "If two strings are anagrams, they must have identical character frequencies. Count character frequencies for string `s` and decrement them for string `t`. If all frequencies resolve to zero, they are valid anagrams.",
    "jsSpecificTipsEn": [
      "Use `str.charCodeAt(i) - 97` for lowercase English letters to index directly into a fixed-size 26-element TypedArray (`new Int32Array(26)`), which is ultra-fast in V8.",
      "Avoid splitting strings into arrays with `.split('')` when a single frequency array achieves O(n) without multi-megabyte garbage collection."
    ]
  },
  {
    "id": "group-anagrams",
    "number": 49,
    "title": "Group Anagrams (Grupisanje Anagrama)",
    "titleEn": "Group Anagrams",
    "difficulty": "Medium",
    "category": "Arrays & Hash Maps",
    "tags": [
      "Hash Map",
      "Stringovi",
      "Nizovi"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/group-anagrams/",
    "description": "Dat je niz stringova `strs`. Grupiši anagrame zajedno. Odgovor možeš vratiti u bilo kom redosledu.",
    "pattern": "Hash Map sa kanonskim ključem (Categorize by Sorted String)",
    "examples": [
      {
        "input": "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
        "output": "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]",
        "explanation": "\"eat\", \"tea\" i \"ate\" su međusobni anagrami pa idu u istu grupu.",
        "explanationEn": "Anagrams are grouped based on sharing the same sorted letter signature."
      },
      {
        "input": "strs = [\"\"]",
        "output": "[[\"\"]]",
        "explanation": "Prazan string je sam svoja grupa.",
        "explanationEn": "Single empty string forms a single group."
      },
      {
        "input": "strs = [\"a\"]",
        "output": "[[\"a\"]]",
        "explanation": "Jedno slovo je samo svoja grupa.",
        "explanationEn": "Single character string forms a single group."
      }
    ],
    "constraints": [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] se sastoji isključivo od malih engleskih slova"
    ],
    "intuition": "Svi anagrami imaju identičan oblik kada se njihova slova sortiraju (npr. \"eat\", \"tea\", \"ate\" sva postaju \"aet\"). Koristimo taj sortirani oblik kao ključ u Hash Mapi, gde je vrednost lista reči koje pripadaju toj grupi.",
    "optimalSolution": {
      "title": "Optimalno rešenje: Hash Map sa sortiranim ključem",
      "code": "/**\n * @param {string[]} strs\n * @return {string[][]}\n */\nfunction groupAnagrams(strs) {\n  const map = new Map();\n  \n  for (let i = 0; i < strs.length; i++) {\n    const str = strs[i];\n    \n    // Sort characters to get canonical key for the group\n    const sortedKey = str.split('').sort().join('');\n    \n    if (!map.has(sortedKey)) {\n      map.set(sortedKey, []);\n    }\n    \n    map.get(sortedKey).push(str);\n  }\n  \n  // Return array of all groups\n  return Array.from(map.values());\n}",
      "timeComplexity": "O(N * K log K) — gde je N broj stringova u nizu, a K maksimalna dužina pojedinačnog stringa.",
      "spaceComplexity": "O(N * K) — Ukupna memorija potrebna za skladištenje svih reči u Hash Mapi.",
      "explanation": "Za prosečne reči (K <= 100) sortiranje reči je izuzetno brzo. Na kraju koristimo `Array.from(map.values())` da ekstrahujemo grupe u traženi format.",
      "explanationEn": "Create a `Map` where each key is the sorted version of the word (e.g. `\"eat\"` -> `\"aet\"`). For each string in `strs`, compute its key and push the original word into the corresponding map array. Return `Array.from(map.values())`."
    },
    "jsSpecificTips": [
      "`Array.from(map.values())` ili `[...map.values()]` je standardan i elegantan način u modernom JS-u za konverziju iteratora mapa u običan niz.",
      "Ako su reči veoma dugačke, umesto sortiranja može se generisati brojački ključ npr. `#1#0#0...#2` preko frekventnog niza od 26 slova, što smanjuje složenost na O(N * K)."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "Classic example",
        "inputParams": [
          [
            "eat",
            "tea",
            "tan",
            "ate",
            "nat",
            "bat"
          ]
        ],
        "inputStr": "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
        "expectedOutput": [
          [
            "eat",
            "tea",
            "ate"
          ],
          [
            "tan",
            "nat"
          ],
          [
            "bat"
          ]
        ],
        "expectedStr": "[[\"eat\",\"tea\",\"ate\"], [\"tan\",\"nat\"], [\"bat\"]]"
      },
      {
        "id": "tc-2",
        "name": "Single empty string",
        "inputParams": [
          [
            ""
          ]
        ],
        "inputStr": "strs = [\"\"]",
        "expectedOutput": [
          [
            ""
          ]
        ],
        "expectedStr": "[[\"\"]]"
      },
      {
        "id": "tc-3",
        "name": "Single character",
        "inputParams": [
          [
            "a"
          ]
        ],
        "inputStr": "strs = [\"a\"]",
        "expectedOutput": [
          [
            "a"
          ]
        ],
        "expectedStr": "[[\"a\"]]"
      }
    ],
    "runFunctionName": "groupAnagrams",
    "descriptionEn": "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
    "patternEn": "Categorization by Canonical Key (Hash Map)",
    "intuitionEn": "Every group of anagrams shares a common canonical key when sorted alphabetically (or when represented as a 26-character frequency count signature). Use this canonical key as the hash map lookup key.",
    "jsSpecificTipsEn": [
      "Use `Array.from(map.values())` or `[...map.values()]` to extract the grouped arrays from the Map.",
      "For short strings (length <= 100), `str.split('').sort().join('')` is extremely fast and readable in modern JS engines."
    ]
  },
  {
    "id": "longest-substring-without-repeating-characters",
    "number": 3,
    "title": "Longest Substring Without Repeating Characters (Najduži Podstring Bez Ponavljanja)",
    "titleEn": "Longest Substring Without Repeating Characters",
    "difficulty": "Medium",
    "category": "Sliding Window",
    "tags": [
      "Sliding Window",
      "Set",
      "Dva Pokazivača",
      "Stringovi"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "description": "Dat je string `s`. Pronađi dužinu najdužeg podstringa (uzastopnog dela stringa) bez ponavljajućih karaktera.",
    "pattern": "Sliding Window (Klizni Prozor) sa Set-om ili Map-om",
    "examples": [
      {
        "input": "s = \"abcabcbb\"",
        "output": "3",
        "explanation": "Odgovor je \"abc\", čija je dužina 3.",
        "explanationEn": "The answer is \"abc\", with the length of 3."
      },
      {
        "input": "s = \"bbbbb\"",
        "output": "1",
        "explanation": "Odgovor je \"b\", sa dužinom 1.",
        "explanationEn": "The answer is \"b\", with the length of 1."
      },
      {
        "input": "s = \"pwwkew\"",
        "output": "3",
        "explanation": "Odgovor je \"wke\", sa dužinom 3. Primeti da \"pwke\" nije podstring već podniz.",
        "explanationEn": "The answer is \"wke\", with the length of 3."
      }
    ],
    "constraints": [
      "0 <= s.length <= 5 * 10^4",
      "s se sastoji od engleskih slova, cifara, simbola i razmaka"
    ],
    "intuition": "Održavamo \"klizni prozor\" definisan sa dva pokazivača: `left` i `right`. Pomeramo `right` udesno i dodajemo karaktere u `Set`. Ako naiđemo na karakter koji se već nalazi u Set-u, sužavamo prozor pomeranjem `left` udesno i uklanjanjem karaktera iz Set-a sve dok duplikat ne nestane.",
    "optimalSolution": {
      "title": "Optimalno rešenje: Sliding Window sa Set-om",
      "code": "/**\n * @param {string} s\n * @return {number}\n */\nfunction lengthOfLongestSubstring(s) {\n  const set = new Set();\n  let left = 0;\n  let maxLength = 0;\n  \n  for (let right = 0; right < s.length; right++) {\n    const char = s[right];\n    \n    // If character already exists in window, shrink window from left\n    while (set.has(char)) {\n      set.delete(s[left]);\n      left++;\n    }\n    \n    // Add new character to current window\n    set.add(char);\n    \n    // Update maximum length\n    maxLength = Math.max(maxLength, right - left + 1);\n  }\n  \n  return maxLength;\n}",
      "timeComplexity": "O(n) — Iako imamo while petlju unutra, svaki karakter se dodaje u Set tačno jednom i briše najviše jednom (2n koraka ukupno).",
      "spaceComplexity": "O(min(m, n)) — Gde je n dužina stringa, a m veličina azbuke/skupa mogućih karaktera u Set-u.",
      "explanation": "Sliding window tehnika obezbeđuje optimalno linearno rešenje umesto testiranja svih mogućih podstringova u O(n²).",
      "explanationEn": "Use a `Map` to store the last seen position of each character. When a duplicate is encountered at `right`, update `left = Math.max(left, map.get(char) + 1)`. Update max length at every step: `maxLen = Math.max(maxLen, right - left + 1)`."
    },
    "jsSpecificTips": [
      "JS `Set` metode `.add()`, `.has()`, `.delete()` rade u O(1) vremenu i automatski rukuju bilo kojim karakterom (uključujući razmake i specijalne simbole).",
      "Optimizacija sa Map-om: Umesto postepenog pomeranja `left` kroz while petlju, u `Map` se može pamtiti indeks svakog karaktera pa skočiti direktno na `left = Math.max(left, map.get(char) + 1)`."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "abcabcbb",
        "inputParams": [
          "abcabcbb"
        ],
        "inputStr": "s = \"abcabcbb\"",
        "expectedOutput": 3,
        "expectedStr": "3"
      },
      {
        "id": "tc-2",
        "name": "All identical characters",
        "inputParams": [
          "bbbbb"
        ],
        "inputStr": "s = \"bbbbb\"",
        "expectedOutput": 1,
        "expectedStr": "1"
      },
      {
        "id": "tc-3",
        "name": "Empty string",
        "inputParams": [
          ""
        ],
        "inputStr": "s = \"\"",
        "expectedOutput": 0,
        "expectedStr": "0"
      },
      {
        "id": "tc-4",
        "name": "With spaces and numbers",
        "inputParams": [
          "pwwkew"
        ],
        "inputStr": "s = \"pwwkew\"",
        "expectedOutput": 3,
        "expectedStr": "3"
      }
    ],
    "runFunctionName": "lengthOfLongestSubstring",
    "descriptionEn": "Given a string `s`, find the length of the longest substring without repeating characters.",
    "patternEn": "Sliding Window + Hash Map",
    "intuitionEn": "Maintain a dynamic sliding window `[left, right]`. As the `right` pointer expands the window, record the latest index of each character in a Map. If a duplicate character is found within the current window, jump the `left` pointer to `map.get(char) + 1`.",
    "jsSpecificTipsEn": [
      "Remember to use `Math.max(left, map.get(char) + 1)` because the duplicate character might have appeared before the current `left` boundary and should not move `left` backwards.",
      "Using `Map` is preferred over plain objects to avoid integer string coercion quirks."
    ]
  },
  {
    "id": "container-with-most-water",
    "number": 11,
    "title": "Container With Most Water (Kontejner sa Najviše Vode)",
    "titleEn": "Container With Most Water",
    "difficulty": "Medium",
    "category": "Two Pointers",
    "tags": [
      "Dva Pokazivača",
      "Greedy",
      "Nizovi",
      "O(n)"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/container-with-most-water/",
    "description": "Dat je celobrojni niz `height` dužine `n`. Postoji `n` vertikalnih linija nacrtanih tako da su krajnje tačke `i`-te linije `(i, 0)` i `(i, height[i])`. Pronađi dve linije koje zajedno sa x-osom formiraju kontejner koji sadrži najviše vode. Vrati maksimalnu količinu vode koju kontejner može da skladišti.",
    "pattern": "Two Pointers (Dva Pokazivača koja konvergiraju)",
    "examples": [
      {
        "input": "height = [1,8,6,2,5,4,8,3,7]",
        "output": "49",
        "explanation": "Vertikalne linije na indeksima 1 (visina 8) i 8 (visina 7) daju max površinu: min(8, 7) * (8 - 1) = 7 * 7 = 49.",
        "explanationEn": "The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, max area of water the container can contain is 49."
      },
      {
        "input": "height = [1,1]",
        "output": "1",
        "explanation": "Površina je min(1, 1) * (1 - 0) = 1.",
        "explanationEn": "Width is 1, min height is 1, area is 1."
      }
    ],
    "constraints": [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    "intuition": "Postavljamo dva pokazivača: jedan na početak (`left = 0`) i jedan na kraj (`right = height.length - 1`). Površina je određena formulom: `(right - left) * min(height[left], height[right])`. Pošto se širina `(right - left)` smanjuje u svakom koraku, jedina šansa da nađemo veću površinu je da pomerimo pokazivač sa MANJOM visinom, u nadi da ćemo naići na višu liniju.",
    "optimalSolution": {
      "title": "Optimalno rešenje: Dva Pokazivača (Two Pointers)",
      "code": "/**\n * @param {number[]} height\n * @return {number}\n */\nfunction maxArea(height) {\n  let left = 0;\n  let right = height.length - 1;\n  let maxWater = 0;\n  \n  while (left < right) {\n    const width = right - left;\n    const hLeft = height[left];\n    const hRight = height[right];\n    \n    // Height is constrained by the shorter boundary\n    const currentHeight = Math.min(hLeft, hRight);\n    const currentArea = width * currentHeight;\n    \n    if (currentArea > maxWater) {\n      maxWater = currentArea;\n    }\n    \n    // Move the pointer with smaller height because it is the bottleneck\n    if (hLeft < hRight) {\n      left++;\n    } else {\n      right--;\n    }\n  }\n  \n  return maxWater;\n}",
      "timeComplexity": "O(n) — Dva pokazivača pređu ceo niz za tačno n koraka.",
      "spaceComplexity": "O(1) — Konstantan broj promenljivih.",
      "explanation": "Pomeranje pokazivača sa većom visinom nikada ne bi moglo doneti bolju površinu jer bi širina opala, a visina bi i dalje bila ograničena kraćom linijom.",
      "explanationEn": "Initialize `maxArea = 0`. While `left < right`, compute area and update `maxArea`. Shift the pointer pointing to the smaller height inward. This guarantees inspecting all viable candidate pairs in O(n) time."
    },
    "jsSpecificTips": [
      "Lokalno čuvanje `height[left]` u promenljivu unutar petlje je brže od ponovnog pristupa elementu niza više puta u istoj iteraciji.",
      "Koristite `left < right` a ne `left <= right` jer kada se pokazivači poklope, širina je 0 i voda ne može postojati."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "Standard array",
        "inputParams": [
          [
            1,
            8,
            6,
            2,
            5,
            4,
            8,
            3,
            7
          ]
        ],
        "inputStr": "height = [1,8,6,2,5,4,8,3,7]",
        "expectedOutput": 49,
        "expectedStr": "49"
      },
      {
        "id": "tc-2",
        "name": "Two elements",
        "inputParams": [
          [
            1,
            1
          ]
        ],
        "inputStr": "height = [1, 1]",
        "expectedOutput": 1,
        "expectedStr": "1"
      },
      {
        "id": "tc-3",
        "name": "Ascending array",
        "inputParams": [
          [
            4,
            3,
            2,
            1,
            4
          ]
        ],
        "inputStr": "height = [4, 3, 2, 1, 4]",
        "expectedOutput": 16,
        "expectedStr": "16"
      }
    ],
    "runFunctionName": "maxArea",
    "descriptionEn": "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    "patternEn": "Two Pointers (Inward Shrink)",
    "intuitionEn": "Start with two pointers at the extreme ends (`left = 0`, `right = height.length - 1`) to maximize the container width. Calculate the area `(right - left) * Math.min(height[left], height[right])`. Move the pointer pointing to the shorter line inward, because keeping the shorter line can never yield a larger area with a smaller width.",
    "jsSpecificTipsEn": [
      "Math.min and Math.max allow compact single-line area calculations in JS.",
      "Moving the shorter pointer is a mathematically proven greedy choice."
    ]
  },
  {
    "id": "three-sum",
    "number": 15,
    "title": "3Sum (Tri Broja sa Zbirom Nula)",
    "titleEn": "3Sum",
    "difficulty": "Medium",
    "category": "Two Pointers",
    "tags": [
      "Dva Pokazivača",
      "Sortiranje",
      "Preskakanje Duplikata",
      "Nizovi"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/3sum/",
    "description": "Dat je celobrojni niz `nums`. Vrati sve jedinstvene trojke `[nums[i], nums[j], nums[k]]` takve da je `i != j`, `i != k`, `j != k`, i `nums[i] + nums[j] + nums[k] == 0`. Rezultujući skup ne sme sadržati duplirane trojke.",
    "pattern": "Sortiranje + Two Pointers sa preskakanjem duplikata",
    "examples": [
      {
        "input": "nums = [-1,0,1,2,-1,-4]",
        "output": "[[-1,-1,2],[-1,0,1]]",
        "explanation": "nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0; nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.",
        "explanationEn": "The distinct triplets that sum to 0 are [-1, -1, 2] and [-1, 0, 1]."
      },
      {
        "input": "nums = [0,1,1]",
        "output": "[]",
        "explanation": "Nijedna kombinacija ne daje zbir 0.",
        "explanationEn": "The only possible triplet does not sum up to 0."
      },
      {
        "input": "nums = [0,0,0]",
        "output": "[[0,0,0]]",
        "explanation": "Jedina moguća trojka je [0, 0, 0].",
        "explanationEn": "The only possible triplet sums up to 0."
      }
    ],
    "constraints": [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    "intuition": "Prvo sortiramo niz u rastućem poretku. Zatim iteriramo kroz niz fiksnim elementom `nums[i]`. Za preostali deo niza primenjujemo tehniku dva pokazivača (`left` i `right`) tražeći zbir `-nums[i]`. Ključ je u preskakanju duplikata za `i`, `left` i `right` kako bi se izbegle identične trojke bez korišćenja sporog Hash Seta.",
    "optimalSolution": {
      "title": "Optimalno rešenje: Sortiranje + Two Pointers",
      "code": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction threeSum(nums) {\n  const result = [];\n  if (nums.length < 3) return result;\n  \n  // REQUIRED: Numeric sorting in JavaScript!\n  nums.sort((a, b) => a - b);\n  \n  for (let i = 0; i < nums.length - 2; i++) {\n    // If the smallest number > 0, sum of three numbers can never be 0\n    if (nums[i] > 0) break;\n    \n    // Skip duplicates for the first element of triplet\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    \n    let left = i + 1;\n    let right = nums.length - 1;\n    \n    while (left < right) {\n      const sum = nums[i] + nums[left] + nums[right];\n      \n      if (sum === 0) {\n        result.push([nums[i], nums[left], nums[right]]);\n        \n        // Skip duplicates for left and right pointers\n        while (left < right && nums[left] === nums[left + 1]) left++;\n        while (left < right && nums[right] === nums[right - 1]) right--;\n        \n        left++;\n        right--;\n      } else if (sum < 0) {\n        left++; // Sum is too small, advance left\n      } else {\n        right--; // Sum is too large, decrement right\n      }\n    }\n  }\n  \n  return result;\n}",
      "timeComplexity": "O(n²) — Sortiranje je O(n log n), a dvostruka petlja (for + two pointers) traje O(n²).",
      "spaceComplexity": "O(1) ili O(log n) — Zavisi od memorije potrebne za sortiranje u JS engine-u.",
      "explanation": "Preskakanje duplikata na licu mesta (in-place) eliminiše potrebu za pretvaranjem trojki u stringove radi ubacivanja u Set, što drastično ubrzava izvršavanje.",
      "explanationEn": "Sort the array with `nums.sort((a, b) => a - b)`. Loop with index `i`. If `nums[i] > 0`, break early (sum of 3 positive numbers can never be 0). When a valid triplet is found, push it to results, then advance `left` and decrement `right` while skipping duplicate values."
    },
    "jsSpecificTips": [
      "KRITIČAN JS BUG: `nums.sort()` po defaultu sortira elemente kao STRINGOVE! Poziv `[-1, -4, 2].sort()` daje `[-1, -4, 2]` a ne `[-4, -1, 2]`. Uvek prosledite komparator `(a, b) => a - b`!",
      "Nemojte koristiti `JSON.stringify` i `Set` za eliminaciju duplikata u 3Sum jer je stringifikacija hiljadama puta sporija od jednostavnog `nums[i] === nums[i-1]` preskakanja."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "[-1,0,1,2,-1,-4]",
        "inputParams": [
          [
            -1,
            0,
            1,
            2,
            -1,
            -4
          ]
        ],
        "inputStr": "nums = [-1, 0, 1, 2, -1, -4]",
        "expectedOutput": [
          [
            -1,
            -1,
            2
          ],
          [
            -1,
            0,
            1
          ]
        ],
        "expectedStr": "[[-1, -1, 2], [-1, 0, 1]]"
      },
      {
        "id": "tc-2",
        "name": "Three zeros",
        "inputParams": [
          [
            0,
            0,
            0
          ]
        ],
        "inputStr": "nums = [0, 0, 0]",
        "expectedOutput": [
          [
            0,
            0,
            0
          ]
        ],
        "expectedStr": "[[0, 0, 0]]"
      },
      {
        "id": "tc-3",
        "name": "No solution",
        "inputParams": [
          [
            0,
            1,
            1
          ]
        ],
        "inputStr": "nums = [0, 1, 1]",
        "expectedOutput": [],
        "expectedStr": "[]"
      }
    ],
    "runFunctionName": "threeSum",
    "descriptionEn": "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
    "patternEn": "Sorting + Two Pointers",
    "intuitionEn": "Sort the array first. Fix one element `nums[i]` and then use two pointers (`left = i + 1`, `right = n - 1`) to find pairs where `nums[left] + nums[right] === -nums[i]`. Skip duplicate elements at every pointer step to prevent duplicate triplets in the output.",
    "jsSpecificTipsEn": [
      "Always sort numeric arrays with `nums.sort((a, b) => a - b)`. Calling `.sort()` without a comparator sorts lexicographically by string representation!",
      "Skipping duplicates directly via while loops avoids needing expensive JSON string set serialization."
    ]
  },
  {
    "id": "maximum-subarray",
    "number": 53,
    "title": "Maximum Subarray (Maksimalni Podniz - Kadaneov Algoritam)",
    "titleEn": "Maximum Subarray",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "tags": [
      "Dinamičko Programiranje",
      "Kadaneov Algoritam",
      "O(n)",
      "Nizovi"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/maximum-subarray/",
    "description": "Dat je celobrojni niz `nums`. Pronađi podniz (neprekidni segment niza) koji ima najveći zbir i vrati njegov zbir.",
    "pattern": "Kadane's Algorithm / Dinamičko Programiranje u jednom prolazu",
    "examples": [
      {
        "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        "output": "6",
        "explanation": "Neprekidni podniz [4,-1,2,1] ima najveći zbir = 6.",
        "explanationEn": "The subarray [4,-1,2,1] has the largest sum 6."
      },
      {
        "input": "nums = [1]",
        "output": "1",
        "explanation": "Jedan element ima zbir 1.",
        "explanationEn": "The subarray [1] has the largest sum 1."
      },
      {
        "input": "nums = [5,4,-1,7,8]",
        "output": "23",
        "explanation": "Ceo niz [5,4,-1,7,8] ima najveći zbir = 23.",
        "explanationEn": "The subarray [5,4,-1,7,8] has the largest sum 23."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "intuition": "Kadaneov algoritam se zasniva na prostom uvidu: kada sabiramo elemente, ako kumulativni zbir postane negativan (`currentSum < 0`), on samo odmaže bilo kom budućem podnizu. U tom trenutku \"odbacujemo\" prethodni segment i resetujemo `currentSum = 0` (odnosno počinjemo novi podniz od trenutnog elementa).",
    "optimalSolution": {
      "title": "Optimalno rešenje: Kadane's Algorithm",
      "code": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction maxSubArray(nums) {\n  let maxSoFar = nums[0];\n  let currentSum = 0;\n  \n  for (let i = 0; i < nums.length; i++) {\n    currentSum += nums[i];\n    \n    if (currentSum > maxSoFar) {\n      maxSoFar = currentSum;\n    }\n    \n    // If current sum drops below zero, reset it\n    if (currentSum < 0) {\n      currentSum = 0;\n    }\n  }\n  \n  return maxSoFar;\n}",
      "timeComplexity": "O(n) — Jedan prolaz kroz niz.",
      "spaceComplexity": "O(1) — Potrebne su samo dve promenljive.",
      "explanation": "Inicijalizacija `maxSoFar = nums[0]` obezbeđuje ispravnost čak i u slučaju kada su svi brojevi u nizu negativni (npr. `[-3, -2, -5]` vraća `-2`).",
      "explanationEn": "Kadane's algorithm operates in O(n) time and O(1) space. Initialize `maxSum = nums[0]` and `currentSum = nums[0]`. Scan from index 1 to the end, updating `currentSum` and recording `maxSum = Math.max(maxSum, currentSum)`."
    },
    "jsSpecificTips": [
      "Pazite da ne postavite `maxSoFar = 0` na početku, jer ako je niz sastavljen isključivo od negativnih brojeva (npr. `[-1]`), nula bi bila pogrešno vraćena umesto `-1`!",
      "U poređenju sa `Math.max(currentSum, maxSoFar)` unutar for petlje, eksplicitni `if` uslov je malo brži jer izbegava poziv funkcije u JS engine-u."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "Mixed positive and negative",
        "inputParams": [
          [
            -2,
            1,
            -3,
            4,
            -1,
            2,
            1,
            -5,
            4
          ]
        ],
        "inputStr": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        "expectedOutput": 6,
        "expectedStr": "6"
      },
      {
        "id": "tc-2",
        "name": "Single element",
        "inputParams": [
          [
            1
          ]
        ],
        "inputStr": "nums = [1]",
        "expectedOutput": 1,
        "expectedStr": "1"
      },
      {
        "id": "tc-3",
        "name": "All negative numbers",
        "inputParams": [
          [
            -5,
            -2,
            -8,
            -1,
            -4
          ]
        ],
        "inputStr": "nums = [-5, -2, -8, -1, -4]",
        "expectedOutput": -1,
        "expectedStr": "-1"
      },
      {
        "id": "tc-4",
        "name": "All positive numbers",
        "inputParams": [
          [
            5,
            4,
            -1,
            7,
            8
          ]
        ],
        "inputStr": "nums = [5, 4, -1, 7, 8]",
        "expectedOutput": 23,
        "expectedStr": "23"
      }
    ],
    "runFunctionName": "maxSubArray",
    "descriptionEn": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    "patternEn": "Kadane's Algorithm (Dynamic Programming)",
    "intuitionEn": "Iterate through the array while maintaining the current running subarray sum. At each element, decide whether to append the current element to the existing subarray or start a brand new subarray at the current element: `currentSum = Math.max(num, currentSum + num)`.",
    "jsSpecificTipsEn": [
      "Initialize `maxSum` with `nums[0]` rather than `0`, because if all numbers are negative, the maximum sum will be the largest negative number (e.g. `[-1]` -> `-1`)."
    ]
  },
  {
    "id": "climbing-stairs",
    "number": 70,
    "title": "Climbing Stairs (Penjanje uz Stepenice)",
    "titleEn": "Climbing Stairs",
    "difficulty": "Easy",
    "category": "Dynamic Programming",
    "tags": [
      "Dinamičko Programiranje",
      "Fibonači",
      "Memorizacija",
      "O(1) Prostor"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/climbing-stairs/",
    "description": "Penješ se uz stepenište koje ima `n` stepenika. Svaki put možeš preći ili 1 ili 2 stepenika. Na koliko različitih načina možeš stići do vrha?",
    "pattern": "Dinamičko Programiranje (DP / Fibonacci sekvenca)",
    "examples": [
      {
        "input": "n = 2",
        "output": "2",
        "explanation": "Postoje 2 načina: (1 + 1) ili (2).",
        "explanationEn": "There are two ways to climb: (1 step + 1 step) or (2 steps)."
      },
      {
        "input": "n = 3",
        "output": "3",
        "explanation": "Postoje 3 načina: (1 + 1 + 1), (1 + 2) ili (2 + 1).",
        "explanationEn": "There are three ways: (1+1+1), (1+2), or (2+1)."
      },
      {
        "input": "n = 4",
        "output": "5",
        "explanation": "Načini: (1+1+1+1), (1+1+2), (1+2+1), (2+1+1), (2+2)."
      }
    ],
    "constraints": [
      "1 <= n <= 45"
    ],
    "intuition": "Da bismo stigli na stepenik `n`, mogli smo doći ili sa stepenika `n-1` (skokom od 1) ili sa stepenika `n-2` (skokom od 2). Prema tome: `ways(n) = ways(n-1) + ways(n-2)`. Ovo je identično Fibonačijevom nizu! Umesto rekurzije O(2^n), iterativno pamtimo samo prethodna dva stanja.",
    "optimalSolution": {
      "title": "Optimalno rešenje: DP sa O(1) memorije",
      "code": "/**\n * @param {number} n\n * @return {number}\n */\nfunction climbStairs(n) {\n  if (n <= 2) return n;\n  \n  let prev2 = 1; // ways(1)\n  let prev1 = 2; // ways(2)\n  \n  for (let i = 3; i <= n; i++) {\n    const current = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = current;\n  }\n  \n  return prev1;\n}",
      "timeComplexity": "O(n) — Jedna jednostavna for petlja od 3 do n.",
      "spaceComplexity": "O(1) — Konstantna memorija, bez alokacije nizova.",
      "explanation": "Čuvanjem samo dva prethodna broja smanjujemo potrošnju memorije sa O(n) na O(1) i izbegavamo rekurzivni call stack overflow.",
      "explanationEn": "Use bottom-up DP with two variables `prev1 = 1` and `prev2 = 2` to track previous values in O(n) time and O(1) auxiliary space, avoiding O(2^n) exponential recursion."
    },
    "jsSpecificTips": [
      "Čista rekurzija `climbStairs(n-1) + climbStairs(n-2)` bez memorizacije ima eksponencijalnu složenost O(2^n) i izaziva Time Limit Exceeded (TLE) za n > 35.",
      "U JS-u za n <= 45 brojevi ostaju znatno ispod `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991) tako da standardni `number` tip ima apsolutnu preciznost bez potrebe za `BigInt`."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "n = 2",
        "inputParams": [
          2
        ],
        "inputStr": "n = 2",
        "expectedOutput": 2,
        "expectedStr": "2"
      },
      {
        "id": "tc-2",
        "name": "n = 3",
        "inputParams": [
          3
        ],
        "inputStr": "n = 3",
        "expectedOutput": 3,
        "expectedStr": "3"
      },
      {
        "id": "tc-3",
        "name": "n = 5",
        "inputParams": [
          5
        ],
        "inputStr": "n = 5",
        "expectedOutput": 8,
        "expectedStr": "8"
      }
    ],
    "runFunctionName": "climbStairs",
    "descriptionEn": "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    "patternEn": "Dynamic Programming (Fibonacci Sequence)",
    "intuitionEn": "To reach step `n`, you must arrive either from step `n-1` (by taking 1 step) or from step `n-2` (by taking 2 steps). Thus, `ways(n) = ways(n-1) + ways(n-2)`. This matches the Fibonacci sequence.",
    "jsSpecificTipsEn": [
      "Avoid naive recursion without memoization in JavaScript as the Call Stack will exceed limits for large `n` (`Maximum call stack size exceeded`).",
      "For large values beyond standard limits, JS numbers can safely handle up to `n = 78` before exceeding `Number.MAX_SAFE_INTEGER`."
    ]
  },
  {
    "id": "binary-search",
    "number": 704,
    "title": "Binary Search (Binarna Pretraga)",
    "titleEn": "Binary Search",
    "difficulty": "Easy",
    "category": "Two Pointers",
    "tags": [
      "Binarna Pretraga",
      "Nizovi",
      "O(log n)"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/binary-search/",
    "description": "Dat je sortiran celobrojni niz `nums` u rastućem poretku i celobrojna vrednost `target`. Napiši funkciju za pretragu `target` u `nums`. Ako `target` postoji, vrati njegov indeks, a u suprotnom vrati `-1`. Algoritam mora raditi u O(log n) vremenskoj složenosti.",
    "pattern": "Binary Search (Podeli pa vladaj)",
    "examples": [
      {
        "input": "nums = [-1,0,3,5,9,12], target = 9",
        "output": "4",
        "explanation": "Broj 9 postoji u nizu i njegov indeks je 4.",
        "explanationEn": "9 exists in nums and its index is 4."
      },
      {
        "input": "nums = [-1,0,3,5,9,12], target = 2",
        "output": "-1",
        "explanation": "Broj 2 ne postoji u nizu pa se vraća -1.",
        "explanationEn": "2 does not exist in nums so return -1."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "Svi brojevi u nums su jedinstveni",
      "nums je sortiran u rastućem poretku"
    ],
    "intuition": "Pošto je niz već sortiran, u svakom koraku poredimo ciljnu vrednost `target` sa srednjim elementom (`mid`). Ako je `target` manji, pretragu nastavljamo u levoj polovini; ako je veći, u desnoj. Time se prostor pretrage prepolovljuje u svakom koraku.",
    "optimalSolution": {
      "title": "Optimalno rešenje: Iterativna Binarna Pretraga",
      "code": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nfunction search(nums, target) {\n  let left = 0;\n  let right = nums.length - 1;\n  \n  while (left <= right) {\n    // In JS use Math.floor because / returns float!\n    const mid = Math.floor(left + (right - left) / 2);\n    const midVal = nums[mid];\n    \n    if (midVal === target) {\n      return mid;\n    } else if (midVal < target) {\n      left = mid + 1; // Target is in the right half\n    } else {\n      right = mid - 1; // Target is in the left half\n    }\n  }\n  \n  return -1;\n}",
      "timeComplexity": "O(log n) — Prostor pretrage se prepolovljuje u svakoj iteraciji.",
      "spaceComplexity": "O(1) — Konstantna memorija bez rekurzivnih poziva.",
      "explanation": "Formulacija `left + Math.floor((right - left) / 2)` sprečava potencijalno prekoračenje i garantuje ceo broj.",
      "explanationEn": "Maintain two boundary pointers `left = 0` and `right = nums.length - 1`. While `left <= right`, compute `mid = Math.floor((left + right) / 2)`. Each comparison halves the remaining search range, yielding O(log n) time."
    },
    "jsSpecificTips": [
      "ČEST JS BUG: U jezicima kao što su C++ ili Java, deljenje dva cela broja `(left + right) / 2` automatski odseca decimale. U JavaScriptu deljenje vraća decimalni broj (`float`), pa `nums[2.5]` vraća `undefined`! Uvek koristite `Math.floor()` ili bitwise `((left + right) >> 1)`.",
      "Bitwise operator `(left + right) >> 1` takođe vrši celobrojno deljenje sa 2 i radi veoma brzo za brojeve do 32 bita."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "Target exists",
        "inputParams": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          9
        ],
        "inputStr": "nums = [-1,0,3,5,9,12], target = 9",
        "expectedOutput": 4,
        "expectedStr": "4"
      },
      {
        "id": "tc-2",
        "name": "Target does not exist",
        "inputParams": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          2
        ],
        "inputStr": "nums = [-1,0,3,5,9,12], target = 2",
        "expectedOutput": -1,
        "expectedStr": "-1"
      },
      {
        "id": "tc-3",
        "name": "Single element found",
        "inputParams": [
          [
            5
          ],
          5
        ],
        "inputStr": "nums = [5], target = 5",
        "expectedOutput": 0,
        "expectedStr": "0"
      }
    ],
    "runFunctionName": "search",
    "descriptionEn": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "patternEn": "Binary Search (Divide & Conquer)",
    "intuitionEn": "Take advantage of the sorted order by comparing `target` with the middle element `mid`. If `nums[mid] === target`, return `mid`. If `nums[mid] < target`, discard the left half by moving `left = mid + 1`. Otherwise, discard the right half by moving `right = mid - 1`.",
    "jsSpecificTipsEn": [
      "In JavaScript, numbers are 64-bit floats, so integer division requires explicit rounding: `Math.floor((left + right) / 2)` or bitwise shift `(left + right) >> 1`.",
      "Ensure the loop condition is `while (left <= right)` so single-element ranges are checked."
    ]
  },
  {
    "id": "merge-intervals",
    "number": 56,
    "title": "Merge Intervals (Spajanje Preklapajućih Intervala)",
    "titleEn": "Merge Intervals",
    "difficulty": "Medium",
    "category": "Arrays & Hash Maps",
    "tags": [
      "Intervali",
      "Sortiranje",
      "Nizovi",
      "Greedy"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/merge-intervals/",
    "description": "Dat je niz intervala gde je `intervals[i] = [start_i, end_i]`. Spoj sve preklapajuće intervale i vrati niz nepreklapajućih intervala koji pokrivaju sve intervale iz unosa.",
    "pattern": "Sortiranje po početku + Greedy spajanje",
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "explanation": "Intervali [1,3] i [2,6] se preklapaju, pa se spajaju u [1,6].",
        "explanationEn": "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."
      },
      {
        "input": "intervals = [[1,4],[4,5]]",
        "output": "[[1,5]]",
        "explanation": "Intervali [1,4] i [4,5] se dodiruju na tački 4 i smatraju se preklopljenim.",
        "explanationEn": "Intervals [1,4] and [4,5] are considered overlapping."
      }
    ],
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    "intuition": "Ako sortiramo intervale prema njihovom početnom vremenu (`start`), onda se svaki interval može preklapati samo sa neposredno prethodnim spojem. Dva intervala `[a, b]` i `[c, d]` se preklapaju ako je `c <= b`. Tada ih spajamo u `[a, Math.max(b, d)]`.",
    "optimalSolution": {
      "title": "Optimalno rešenje: Sortiranje + Linearno spajanje",
      "code": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction merge(intervals) {\n  if (intervals.length <= 1) return intervals;\n  \n  // 1. Sort intervals by start time\n  intervals.sort((a, b) => a[0] - b[0]);\n  \n  const merged = [intervals[0]];\n  \n  for (let i = 1; i < intervals.length; i++) {\n    const current = intervals[i];\n    const lastMerged = merged[merged.length - 1];\n    \n    // Check if overlap exists (current.start <= lastMerged.end)\n    if (current[0] <= lastMerged[1]) {\n      // Merge by expanding the end of previous interval\n      lastMerged[1] = Math.max(lastMerged[1], current[1]);\n    } else {\n      // No overlap, push new interval\n      merged.push(current);\n    }\n  }\n  \n  return merged;\n}",
      "timeComplexity": "O(n log n) — Zbog sortiranja niza intervala.",
      "spaceComplexity": "O(n) — Memorija za skladištenje rezultujućeg niza.",
      "explanation": "Sortiranje omogućava da jednim prolazom O(n) rešimo problem poredeći uvek samo poslednji spojeni interval u listi.",
      "explanationEn": "Sort intervals by `a[0] - b[0]`. Initialize `merged = [intervals[0]]`. Iterate through remaining intervals: compare with `merged[merged.length - 1]`. If overlapping, merge in place; if disjoint, push to `merged`."
    },
    "jsSpecificTips": [
      "Mutiranje `lastMerged[1] = Math.max(...)` direktno u nizu izbegava nepotrebno kreiranje novih podnizova i smanjuje pritisak na garbage collector.",
      "Ne zaboravite komparator `(a, b) => a[0] - b[0]` u `.sort()`. Bez njega, `[10, 2]` bi bilo sortirano pre `[2, 5]` jer JS poređenje stringova stavlja \"1\" pre \"2\"."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "Standard overlap",
        "inputParams": [
          [
            [
              1,
              3
            ],
            [
              2,
              6
            ],
            [
              8,
              10
            ],
            [
              15,
              18
            ]
          ]
        ],
        "inputStr": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "expectedOutput": [
          [
            1,
            6
          ],
          [
            8,
            10
          ],
          [
            15,
            18
          ]
        ],
        "expectedStr": "[[1,6],[8,10],[15,18]]"
      },
      {
        "id": "tc-2",
        "name": "Boundary touching",
        "inputParams": [
          [
            [
              1,
              4
            ],
            [
              4,
              5
            ]
          ]
        ],
        "inputStr": "intervals = [[1,4],[4,5]]",
        "expectedOutput": [
          [
            1,
            5
          ]
        ],
        "expectedStr": "[[1,5]]"
      },
      {
        "id": "tc-3",
        "name": "Nested interval",
        "inputParams": [
          [
            [
              1,
              4
            ],
            [
              2,
              3
            ]
          ]
        ],
        "inputStr": "intervals = [[1,4],[2,3]]",
        "expectedOutput": [
          [
            1,
            4
          ]
        ],
        "expectedStr": "[[1,4]]"
      }
    ],
    "runFunctionName": "merge",
    "descriptionEn": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "patternEn": "Sorting + Interval Sweeping",
    "intuitionEn": "Sort intervals by their starting times. Then, iterate through the sorted list: if the current interval starts before or when the previous interval ends (`curr[0] <= prev[1]`), merge them by extending the end time (`prev[1] = Math.max(prev[1], curr[1])`). Otherwise, push the interval as a new entry.",
    "jsSpecificTipsEn": [
      "Sort with `intervals.sort((a, b) => a[0] - b[0])`.",
      "Mutating `lastMerged[1] = Math.max(lastMerged[1], curr[1])` directly modifies the object in the output array in O(1) time without extra allocations."
    ]
  },
  {
    "id": "debounce-js",
    "number": 2627,
    "title": "Debounce (JavaScript Async Obrazac)",
    "titleEn": "Debounce",
    "difficulty": "Medium",
    "category": "JavaScript & Async",
    "tags": [
      "Closures",
      "Timers",
      "Async JS",
      "Event Loop"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/debounce/",
    "description": "Data je funkcija `fn` i vreme kašnjenja `t` u milisekundama. Vrati **debounced** verziju te funkcije.\n\nDebounced funkcija je funkcija čije se izvršavanje odlaže za `t` milisekundi. Ako se funkcija ponovo pozove unutar tog intervala od `t` ms, prethodni planirani poziv se poništava i tajmer se restartuje sa novim argumentima.",
    "pattern": "Closure + setTimeout / clearTimeout",
    "examples": [
      {
        "input": "t = 50ms, pozivi na 30ms, 60ms, 100ms",
        "output": "Izvršava se samo poslednji poziv na 100ms + 50ms = 150ms",
        "explanation": "Svaki novi poziv poništava prethodni aktivni tajmer.",
        "explanationEn": "Calls within the timeout cancel previous pending executions and trigger only after 50ms of inactivity."
      }
    ],
    "constraints": [
      "0 <= t <= 1000",
      "fn je validna funkcija",
      "Poziva se sa proizvoljnim brojem argumenata"
    ],
    "intuition": "Koristimo closure za čuvanje reference na identifikator trenutnog tajmera (`timerId`). Svaki put kada se debounced funkcija pozove, prvo pozivamo `clearTimeout(timerId)`, a zatim postavljamo novi `setTimeout` koji će nakon `t` milisekundi izvršiti originalnu funkciju sa prosleđenim parametrima.",
    "optimalSolution": {
      "title": "Optimalno rešenje: Debounce sa Closure i Rest parametrima",
      "code": "/**\n * @param {Function} fn\n * @param {number} t milliseconds\n * @return {Function}\n */\nfunction debounce(fn, t) {\n  let timerId = null;\n  \n  return function(...args) {\n    // 1. Cancel previous pending timer if exists\n    if (timerId !== null) {\n      clearTimeout(timerId);\n    }\n    \n    // 2. Set new timer\n    timerId = setTimeout(() => {\n      fn.apply(this, args);\n    }, t);\n  };\n}",
      "timeComplexity": "O(1) — Postavljanje i čišćenje tajmera je O(1).",
      "spaceComplexity": "O(1) — Čuva se samo jedna referenca na timerId u closure-u.",
      "explanation": "Korišćenje `fn.apply(this, args)` ili `fn(...args)` obezbeđuje pravilno prosleđivanje konteksta `this` i svih argumenata originalnoj funkciji.",
      "explanationEn": "The debounced function creates a closure retaining `timerId`. On invocation, it cancels any pending execution and resets the countdown. When the delay elapses without further calls, the original function executes with the latest arguments and context."
    },
    "jsSpecificTips": [
      "Očuvanje `this`: Arrow funkcija unutar `setTimeout(() => { fn.apply(this, args); }, t)` leksički nasleđuje `this` spoljašnje funkcije, što je ključno ako je debounce vezan za metodu objekta ili DOM event listener.",
      "U Node.js i browser okruženjima `clearTimeout(null)` ili `clearTimeout(undefined)` bezbedno ne radi ništa, ali eksplicitna provera čini nameru jasnijom."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "Single invocation",
        "inputParams": [
          50
        ],
        "inputStr": "debounce(fn, 50ms) -> called once",
        "expectedOutput": "Executed",
        "expectedStr": "Function executes after 50ms"
      }
    ],
    "runFunctionName": "debounce",
    "descriptionEn": "Given a function `fn` and a time in milliseconds `t`, return a debounced version of that function.\n\nA debounced function is a function whose execution is delayed by `t` milliseconds and whose execution is cancelled if it is called again within that window of time. The debounced function should also receive the passed parameters.",
    "patternEn": "Closure + Timer Management",
    "intuitionEn": "Store a timer ID (`timerId`) inside the parent closure. Every time the returned debounced function is called, immediately clear the active timer with `clearTimeout(timerId)` and start a fresh timer with `setTimeout`.",
    "jsSpecificTipsEn": [
      "Preserve arguments and execution context using rest parameters `(...args)` and call `fn.apply(this, args)` or `fn(...args)`.",
      "Debouncing is standard practice in browser UI for search autocomplete inputs, window resize handlers, and infinite scroll triggers."
    ]
  },
  {
    "id": "promise-all-parallel",
    "number": 2721,
    "title": "Execute Asynchronous Functions in Parallel / Promise.all Implementacija",
    "titleEn": "Execute Asynchronous Functions in Parallel",
    "difficulty": "Medium",
    "category": "JavaScript & Async",
    "tags": [
      "Promises",
      "Async/Await",
      "Event Loop",
      "Ručna Implementacija"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/execute-asynchronous-functions-in-parallel/",
    "description": "Dat je niz funkcija `functions` koje vraćaju Promise. Vrati novi Promise koji se razrešava kada se SVI uneti Promise-i uspešno završe. Vrednost razrešenog Promise-a treba da bude niz rezultata u tačnom redosledu originalnog niza (ne po redosledu završavanja!). Ako BILO KOJI Promise baci grešku (reject), vraćeni Promise se odmah odbija sa tom prvom greškom. Nemoj koristiti ugrađeni `Promise.all`!",
    "pattern": "Brojač završenih asinhronih zadataka (Completed Counter)",
    "examples": [
      {
        "input": "functions = [() => new Promise(res => res(42)), () => new Promise(res => res(\"JS\"))]",
        "output": "[42, \"JS\"]",
        "explanation": "Sve funkcije su uspešno izvršene i rezultati su sačuvani u tačnom redosledu.",
        "explanationEn": "All 3 async functions execute in parallel and resolve into an ordered array."
      },
      {
        "input": "Jedna od funkcija uradi reject(\"Greška\")",
        "output": "Odmah se odbija sa \"Greška\"",
        "explanation": "Fast-fail mehanizam identičan specifikaciji Promise.all."
      }
    ],
    "constraints": [
      "functions je niz funkcija koje vraćaju Promise",
      "0 <= functions.length <= 10"
    ],
    "intuition": "Kreiramo novi `Promise((resolve, reject) => ...)`. Održavamo niz `results` i brojač `resolvedCount = 0`. Za svaku funkciju pozivamo `.then()` i smeštamo rezultat na NJEN TAČAN INDEKS `i` (`results[i] = res`). Kada `resolvedCount === functions.length`, pozivamo `resolve(results)`. Ako bilo koja funkcija baci grešku u `.catch()`, odmah pozivamo `reject(err)`.",
    "optimalSolution": {
      "title": "Optimalno rešenje: Ručna implementacija Promise.all",
      "code": "/**\n * @param {Array<Function>} functions\n * @return {Promise<any>}\n */\nfunction promiseAll(functions) {\n  return new Promise((resolve, reject) => {\n    // If array is empty, resolve immediately with empty array\n    if (functions.length === 0) {\n      resolve([]);\n      return;\n    }\n    \n    const results = new Array(functions.length);\n    let completedCount = 0;\n    \n    functions.forEach((fn, index) => {\n      // Execute function and wrap with Promise.resolve\n      Promise.resolve(fn())\n        .then((val) => {\n          // Store at original index, not pushing to end!\n          results[index] = val;\n          completedCount++;\n          \n          // When all promises resolve, resolve outer promise\n          if (completedCount === functions.length) {\n            resolve(results);\n          }\n        })\n        .catch((err) => {\n          // First rejection rejects entire promiseAll\n          reject(err);\n        });\n    });\n  });\n}",
      "timeComplexity": "O(N) — Gde je N broj asinhronih funkcija. Sve se pokreću paralelno u isto vreme.",
      "spaceComplexity": "O(N) — Niz za čuvanje rezultata.",
      "explanation": "Ključno pravilo: rezultati se moraju sačuvati na `results[index] = val`, jer asinhroni zadaci mogu završiti u bilo kom redosledu (npr. drugi pre prvog), ali izlaz mora pratiti redosled unosa.",
      "explanationEn": "Return `new Promise((resolve, reject) => { ... })`. Handle empty arrays immediately by resolving `[]`. Execute all functions, attaching `.then(val => { results[i] = val; if (++completed === total) resolve(results); }).catch(reject)`."
    },
    "jsSpecificTips": [
      "NIKADA nemojte koristiti `results.push(val)` umesto `results[index] = val`! Ako brži Promise završi pre sporijeg, `push` bi poremetio redosled elemenata.",
      "Nemojte koristiti `results.length === functions.length` kao uslov završetka, jer ako se prvo popuni `results[5]`, niz `results` u JS-u dobija dužinu 6 (sa praznim rupama/empty slots) pre nego što su ostali Promise-i uopšte završeni! Zato je neophodan poseban brojač `completedCount`."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "Two parallel functions",
        "inputParams": [],
        "inputStr": "promiseAll([fn1, fn2])",
        "expectedOutput": "Array of results [res1, res2]",
        "expectedStr": "Parallel execution in original order"
      }
    ],
    "runFunctionName": "promiseAll",
    "descriptionEn": "Given an array of asynchronous functions `functions`, return a new promise `promise`. Each function in the array accepts no arguments and returns a promise. All the promises should be executed in parallel.\n\n`promise` resolves when all promises have resolved, returning an array of resolved values in the same order as the input. If any promise rejects, `promise` rejects immediately with that error.",
    "patternEn": "Asynchronous Coordination / Custom Promise.all",
    "intuitionEn": "Track completed promises with a counter `resolvedCount`. Execute all functions in parallel immediately. When each promise resolves, store its result at the corresponding index (to preserve input order) and increment `resolvedCount`. When `resolvedCount === functions.length`, resolve the outer promise.",
    "jsSpecificTipsEn": [
      "Store results at index `results[i] = val` rather than using `results.push(val)` to ensure output ordering matches the input array regardless of completion time.",
      "Calling `reject(err)` on the first failure automatically rejects the outer promise once because Promise state is immutable after settlement."
    ]
  },
  {
    "id": "function-composition",
    "number": 2629,
    "title": "Function Composition (Kompozicija Funkcija)",
    "titleEn": "Function Composition",
    "difficulty": "Easy",
    "category": "JavaScript & Async",
    "tags": [
      "Funkcionalno Programiranje",
      "reduceRight",
      "Closures",
      "Higher-Order Functions"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/function-composition/",
    "description": "Dat je niz funkcija `[f1, f2, f3, ..., fn]`. Vrati novu funkciju `fn` koja predstavlja kompoziciju tih funkcija.\n\nKompozicija funkcija `[f, g, h]` je definisana kao `fn(x) = f(g(h(x)))`. Kompozicija praznog niza funkcija je identitet funkcija `f(x) = x`.\n\nPrimetite da se funkcije izvršavaju s desna na levo!",
    "pattern": "Array.prototype.reduceRight (Funkcionalni Pipeline)",
    "examples": [
      {
        "input": "functions = [x => x + 1, x => x * x, x => 2 * x], x = 4",
        "output": "65",
        "explanation": "Računa se s desna na levo: 2 * 4 = 8, zatim 8 * 8 = 64, i na kraju 64 + 1 = 65.",
        "explanationEn": "Evaluating from right to left: 2*4 = 8, 8+1 = 9, 9*9 = 81."
      },
      {
        "input": "functions = [x => 10 * x, x => 10 * x, x => 10 * x], x = 1",
        "output": "1000",
        "explanation": "10 * (10 * (10 * 1)) = 1000.",
        "explanationEn": "Empty functions list acts as the identity function returning input 42."
      },
      {
        "input": "functions = [], x = 42",
        "output": "42",
        "explanation": "Prazan niz funkcija vraća originalni ulaz x."
      }
    ],
    "constraints": [
      "-1000 <= x <= 1000",
      "0 <= functions.length <= 1000",
      "Sve funkcije primaju i vraćaju ceo broj"
    ],
    "intuition": "Kompozicija funkcija u matematici $(f \\circ g)(x) = f(g(x))$ znači da se najdesnija funkcija izvršava prva, a njen izlaz postaje ulaz za funkciju sa njene leve strane. U JavaScript-u, ugrađena metoda `Array.prototype.reduceRight()` je savršeno dizajnirana za ovaj obrazac.",
    "optimalSolution": {
      "title": "Optimalno rešenje: reduceRight",
      "code": "/**\n * @param {Function[]} functions\n * @return {Function}\n */\nfunction compose(functions) {\n  return function(x) {\n    // reduceRight iterates through functions array from right to left\n    return functions.reduceRight((acc, fn) => fn(acc), x);\n  };\n}",
      "timeComplexity": "O(n) — Gde je n broj funkcija u nizu.",
      "spaceComplexity": "O(1) — Nema dodatne alokacije memorije.",
      "explanation": "`reduceRight` prolazi kroz niz od poslednjeg indeksa ka nultom, primenjujući svaku funkciju na akumuliranu vrednost `acc`, počevši od početnog `x`.",
      "explanationEn": "Use `functions.reduceRight((acc, fn) => fn(acc), x)`. If the array is empty, `reduceRight` returns the initial value `x` directly."
    },
    "bruteForceSolution": {
      "title": "Klasična for petlja unazad",
      "code": "function composeLoop(functions) {\n  return function(x) {\n    let result = x;\n    for (let i = functions.length - 1; i >= 0; i--) {\n      result = functions[i](result);\n    }\n    return result;\n  };\n}",
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(1)",
      "explanation": "Imperativna varijanta koja radi identičnu stvar i može biti blago brža u sirovom izvršavanju od reduce callback-a."
    },
    "jsSpecificTips": [
      "`reduceRight` je standardna ES5 metoda dostupna na svim nizovima. Ako je niz prazan i prosleđen je početni parametar `x`, `reduceRight` automatski vraća `x` bez ikakvih grešaka.",
      "U bibliotekama poput Lodash ili Redux, `compose` funkcija radi s desna na levo, dok `pipe` funkcija radi s leva na desno (koristi `reduce`)."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "[x+1, x*x, 2*x], x=4",
        "inputParams": [
          4
        ],
        "inputStr": "functions = [x => x + 1, x => x * x, x => 2 * x], x = 4",
        "expectedOutput": 65,
        "expectedStr": "65"
      },
      {
        "id": "tc-2",
        "name": "Empty functions array",
        "inputParams": [
          42
        ],
        "inputStr": "functions = [], x = 42",
        "expectedOutput": 42,
        "expectedStr": "42"
      }
    ],
    "runFunctionName": "compose",
    "descriptionEn": "Given an array of functions `[f_1, f_2, f_3, ..., f_n]`, return a new function `fn` that is the function composition of the array of functions.\n\nThe function composition of `[f, g, h]` is `fn(x) = f(g(h(x)))`. The function composition of an empty list of functions is the identity function `f(x) = x`.",
    "patternEn": "Functional Programming / Reduce Right",
    "intuitionEn": "Function composition executes functions from right to left, piping the output of one function as the input to the next. JavaScript's `Array.prototype.reduceRight()` is tailor-made for this operation.",
    "jsSpecificTipsEn": [
      "`reduceRight` processes arrays from the last element to the first, perfectly matching the mathematical definition of composition `(f ∘ g)(x) = f(g(x))`.",
      "For iterative execution, a simple reverse for loop (`for (let i = functions.length - 1; i >= 0; i--)`) is also optimal and avoids extra function frame allocations."
    ]
  },
  {
    "id": "lru-cache",
    "number": 146,
    "title": "LRU Cache (Least Recently Used Keš Memorija)",
    "titleEn": "LRU Cache",
    "difficulty": "Medium",
    "category": "Arrays & Hash Maps",
    "tags": [
      "Design",
      "Hash Map",
      "Map Redosled",
      "O(1)"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/lru-cache/",
    "description": "Dizajniraj strukturu podataka koja prati ograničenja **Least Recently Used (LRU)** keša.\n\nImplementiraj `LRUCache` klasu:\n- `LRUCache(capacity)`: Inicijalizuje LRU keš sa pozitivnim kapacitetom `capacity`.\n- `get(key)`: Vraća vrednost ključa `key` ako postoji, u suprotnom vraća `-1`.\n- `put(key, value)`: Ažurira vrednost ključa ako postoji, ili ubacuje par `key-value`. Ako broj ključeva premaši `capacity`, izbaci **najmanje skoro korišćeni** ključ.\n\nObe metode `get` i `put` moraju raditi u prosečnoj vremenskoj složenosti **O(1)**.",
    "pattern": "JavaScript Map (Insertion Order) ili Hash Map + Doubly Linked List",
    "examples": [
      {
        "input": "LRUCache(2); put(1, 1); put(2, 2); get(1); put(3, 3); // izbacuje ključ 2; get(2); // vrati -1",
        "output": "[null, null, null, 1, null, -1]",
        "explanation": "Ključ 2 je bio najmanje skoro korišćen pa je izbačen kada je dodat ključ 3.",
        "explanationEn": "Key 1 is evicted when capacity is exceeded because key 2 was accessed more recently."
      }
    ],
    "constraints": [
      "1 <= capacity <= 3000",
      "0 <= key <= 10^4",
      "0 <= value <= 10^5",
      "Najviše 2 * 10^5 poziva ka get i put"
    ],
    "intuition": "U drugim jezicima (C++, Java) LRU se implementira pomoću Doubly Linked List i Hash Mape. U JavaScript-u, `Map` objekat po ECMAScript specifikaciji **garantovano čuva redosled umetanja (insertion order)**! Ako obrišemo ključ i ponovo ga postavimo (`map.delete(key); map.set(key, value);`), taj ključ se pomera na sam KRAJ mape (najskorije korišćen). Prvi element u mapi (`map.keys().next().value`) je automatski najmanje skoro korišćen.",
    "optimalSolution": {
      "title": "Optimalno rešenje u JavaScript-u: Map Insertion Order",
      "code": "/**\n * @param {number} capacity\n */\nclass LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n\n  /** \n   * @param {number} key\n   * @return {number}\n   */\n  get(key) {\n    if (!this.cache.has(key)) {\n      return -1;\n    }\n    \n    // Refresh key position: delete and re-insert at end\n    const value = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, value);\n    \n    return value;\n  }\n\n  /** \n   * @param {number} key \n   * @param {number} value\n   * @return {void}\n   */\n  put(key, value) {\n    // If key exists, delete old position\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    }\n    \n    // Insert new value at end (most recently used)\n    this.cache.set(key, value);\n    \n    // If capacity exceeded, evict the first element (least recently used)\n    if (this.cache.size > this.capacity) {\n      const oldestKey = this.cache.keys().next().value;\n      this.cache.delete(oldestKey);\n    }\n  }\n}",
      "timeComplexity": "O(1) za get i O(1) za put — Map operacije has, get, set i delete rade u O(1).",
      "spaceComplexity": "O(capacity) — Keš nikada ne premašuje definisani kapacitet.",
      "explanation": "Ovo je jedno od najlepših specifičnih JS rešenja na intervjuima jer koristi zvaničnu garanciju ECMA-262 specifikacije o redosledu `Map` iteratora.",
      "explanationEn": "In `get(key)`: if present, retrieve value, `map.delete(key)` and `map.set(key, value)`, then return value. In `put(key, value)`: if key exists, delete it first; if at capacity, evict the first item `map.keys().next().value`; then `map.set(key, value)`."
    },
    "jsSpecificTips": [
      "`this.cache.keys().next().value` vraća prvi ključ iz iteratora bez kreiranja niza i bez O(n) overhead-a.",
      "Običan JS objekat `{}` NE garantuje striktan redosled umetanja za numeričke ključeve (V8 prvo sortira celobrojne indekse!), zbog čega je `new Map()` apsolutno obavezan za LRU keš u JS-u."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "Capacity 2 with eviction",
        "inputParams": [
          2
        ],
        "inputStr": "LRUCache cap=2: put(1,1), put(2,2), get(1), put(3,3)",
        "expectedOutput": "Valid cache operation",
        "expectedStr": "get(2) returns -1 because key 2 was evicted"
      }
    ],
    "runFunctionName": "LRUCache",
    "descriptionEn": "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size `capacity`.\n- `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\n- `void put(int key, int value)` Update the value of the `key` if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, evict the least recently used key.\n\nThe functions `get` and `put` must each run in `O(1)` average time complexity.",
    "patternEn": "Doubly Linked List + Hash Map / JS Map Ordering",
    "intuitionEn": "JavaScript `Map` preserves insertion order of keys. When an item is accessed or updated, deleting and re-inserting it moves it to the end (marking it as most recently used). The first key in `map.keys()` is always the least recently used.",
    "jsSpecificTipsEn": [
      "JavaScript's standard `Map` specification guarantees iteration in key insertion order, allowing clean O(1) LRU implementation without building a manual Doubly Linked List.",
      "`map.keys().next().value` retrieves the oldest (LRU) key in O(1) time."
    ]
  },
  {
    "id": "reverse-linked-list",
    "number": 206,
    "title": "Reverse Linked List (Obrtanje Jednostruko Povezane Liste)",
    "titleEn": "Reverse Linked List",
    "difficulty": "Easy",
    "category": "Linked Lists",
    "tags": [
      "Povezane Liste",
      "Pokazivači",
      "In-Place",
      "O(1) Prostor"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/reverse-linked-list/",
    "description": "Data je glava jednostruko povezane liste `head`. Obrni redosled čvorova u listi i vrati novu glavu obrnute liste.",
    "pattern": "Three Pointers (prev, curr, next)",
    "examples": [
      {
        "input": "head = [1, 2, 3, 4, 5]",
        "output": "[5, 4, 3, 2, 1]",
        "explanation": "Svaki čvor sada pokazuje na svog prethodnika.",
        "explanationEn": "Reversing 1->2->3->4->5 yields 5->4->3->2->1."
      },
      {
        "input": "head = [1, 2]",
        "output": "[2, 1]",
        "explanation": "2 pokazuje na 1, a 1 pokazuje na null.",
        "explanationEn": "Reversing 1->2 yields 2->1."
      },
      {
        "input": "head = []",
        "output": "[]",
        "explanation": "Prazna lista ostaje prazna."
      }
    ],
    "constraints": [
      "Broj čvorova u listi je u opsegu [0, 5000]",
      "-5000 <= Node.val <= 5000"
    ],
    "intuition": "Održavamo tri reference: `prev` (inicijalno null), `curr` (trenutni čvor) i privremeni `next`. U svakom koraku pamtimo `next = curr.next`, preusmeravamo pokazivač `curr.next = prev`, a zatim pomeramo `prev = curr` i `curr = next`. Kada `curr` postane null, `prev` je nova glava obrnute liste.",
    "optimalSolution": {
      "title": "Optimalno rešenje: Iterativno sa tri pokazivača",
      "code": "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nfunction reverseList(head) {\n  let prev = null;\n  let curr = head;\n  \n  while (curr !== null) {\n    const nextTemp = curr.next; // 1. Save next node before breaking link\n    curr.next = prev;           // 2. Reverse pointer backwards\n    prev = curr;                // 3. Move prev forward\n    curr = nextTemp;            // 4. Move curr forward\n  }\n  \n  return prev; // prev is the new head of reversed list\n}",
      "timeComplexity": "O(n) — Jedan prolaz kroz listu gde je n broj čvorova.",
      "spaceComplexity": "O(1) — Menjaju se samo pokazivači u postojećim objektima (in-place).",
      "explanation": "Iterativni pristup je bezbedniji u JS-u od rekurzivnog jer za dugačke liste (n > 10,000) rekurzija može izazvati Stack Overflow.",
      "explanationEn": "Iterate through the list reversing pointers in place in O(n) time and O(1) extra space. Return `prev` as the new head."
    },
    "jsSpecificTips": [
      "U JS-u su čvorovi povezane liste obični objekti `{ val: x, next: {...} }`. Pošto se objekti prosleđuju po referenci, modifikacija `curr.next` menja originalnu strukturu u memoriji bez pravljenja kopija.",
      "Uvek sačuvajte `curr.next` u privremenu promenljivu PRE nego što ga prepišete sa `prev`, jer biste u suprotnom izgubili referencu na ostatak liste!"
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "[1,2,3,4,5]",
        "inputParams": [
          [
            1,
            2,
            3,
            4,
            5
          ]
        ],
        "inputStr": "head = [1, 2, 3, 4, 5]",
        "expectedOutput": [
          5,
          4,
          3,
          2,
          1
        ],
        "expectedStr": "[5, 4, 3, 2, 1]"
      },
      {
        "id": "tc-2",
        "name": "Empty list",
        "inputParams": [
          []
        ],
        "inputStr": "head = []",
        "expectedOutput": [],
        "expectedStr": "[]"
      }
    ],
    "runFunctionName": "reverseList",
    "descriptionEn": "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
    "patternEn": "Pointer Manipulation (Iterative 3-Pointers)",
    "intuitionEn": "Maintain three pointers: `prev` (initialized to null), `curr` (initialized to head), and `nextTemp`. In each iteration, save `nextTemp = curr.next`, redirect `curr.next = prev`, then advance `prev = curr` and `curr = nextTemp`.",
    "jsSpecificTipsEn": [
      "Linked lists in JS are plain objects with `val` and `next` properties: `{ val: 1, next: { val: 2, next: null } }`.",
      "Always cache `curr.next` before overwriting the pointer to prevent losing the rest of the list."
    ]
  },
  {
    "id": "merge-two-sorted-lists",
    "number": 21,
    "title": "Merge Two Sorted Lists (Spajanje Dve Sortirane Povezane Liste)",
    "titleEn": "Merge Two Sorted Lists",
    "difficulty": "Easy",
    "category": "Linked Lists",
    "tags": [
      "Povezane Liste",
      "Dummy Node",
      "Dva Pokazivača"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/merge-two-sorted-lists/",
    "description": "Date su glave dve sortirane povezane liste `list1` i `list2`. Spoj ove dve liste u jednu sortiranu listu spajanjem postojećih čvorova. Vrati glavu rezultujuće spojene liste.",
    "pattern": "Dummy Head Node Tehnika",
    "examples": [
      {
        "input": "list1 = [1,2,4], list2 = [1,3,4]",
        "output": "[1,1,2,3,4,4]",
        "explanation": "Spojena lista sadrži sve elemente u neopadajućem poretku.",
        "explanationEn": "Merged sorted list combines both lists in ascending order."
      },
      {
        "input": "list1 = [], list2 = []",
        "output": "[]",
        "explanation": "Spajanje dve prazne liste daje praznu listu.",
        "explanationEn": "Merging empty lists returns empty list."
      },
      {
        "input": "list1 = [], list2 = [0]",
        "output": "[0]",
        "explanation": "Spajanje prazne i neprazne liste vraća nepraznu listu."
      }
    ],
    "constraints": [
      "Broj čvorova u obe liste je u opsegu [0, 50]",
      "-100 <= Node.val <= 100",
      "Obe liste su sortirane u neopadajućem redosledu"
    ],
    "intuition": "Kreiramo lažni početni čvor (`dummy = { val: 0, next: null }`) i pokazivač `tail = dummy`. Upoređujemo `list1.val` i `list2.val`. Manji čvor vezujemo za `tail.next` i pomeramo odgovarajući pokazivač. Kada jedna lista ostane prazna, preostali deo druge liste jednostavno prikačimo na kraj.",
    "optimalSolution": {
      "title": "Optimalno rešenje: Dummy Node Iterativno",
      "code": "/**\n * @param {ListNode} list1\n * @param {ListNode} list2\n * @return {ListNode}\n */\nfunction mergeTwoLists(list1, list2) {\n  // Dummy node eliminates edge cases for list head\n  const dummy = { val: -1, next: null };\n  let tail = dummy;\n  \n  while (list1 !== null && list2 !== null) {\n    if (list1.val <= list2.val) {\n      tail.next = list1;\n      list1 = list1.next;\n    } else {\n      tail.next = list2;\n      list2 = list2.next;\n    }\n    tail = tail.next;\n  }\n  \n  // Attach remaining non-empty tail in O(1)\n  tail.next = list1 !== null ? list1 : list2;\n  \n  return dummy.next;\n}",
      "timeComplexity": "O(n + m) — Gde su n i m dužine lista.",
      "spaceComplexity": "O(1) — Koristi se samo dummy čvor i pokazivač tail.",
      "explanation": "Dummy Node pattern je standardni industrijski obrazac za algoritme sa povezanim listama jer potpuno eliminiše dosadne `if (head === null)` grane.",
      "explanationEn": "While both lists have nodes, compare `list1.val` and `list2.val`, attach the smaller node to `tail.next`, and advance that list's pointer. Finally, attach `list1 || list2` to `tail.next` and return `dummy.next`."
    },
    "jsSpecificTips": [
      "Povezivanje preostalog dela liste `tail.next = list1 !== null ? list1 : list2` je O(1) jer samo povezujemo referencu na postojeći lanac čvorova bez potrebe za petljom.",
      "U JS objektima `{ val: 0, next: null }` predstavlja laganu reprezentaciju ListNode-a bez potrebe za ES6 `class` definicijom."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "[1,2,4] and [1,3,4]",
        "inputParams": [
          [
            1,
            2,
            4
          ],
          [
            1,
            3,
            4
          ]
        ],
        "inputStr": "list1 = [1,2,4], list2 = [1,3,4]",
        "expectedOutput": [
          1,
          1,
          2,
          3,
          4,
          4
        ],
        "expectedStr": "[1,1,2,3,4,4]"
      },
      {
        "id": "tc-2",
        "name": "One empty list",
        "inputParams": [
          [],
          [
            0
          ]
        ],
        "inputStr": "list1 = [], list2 = [0]",
        "expectedOutput": [
          0
        ],
        "expectedStr": "[0]"
      }
    ],
    "runFunctionName": "mergeTwoLists",
    "descriptionEn": "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
    "patternEn": "Dummy Head Node + Two Pointers",
    "intuitionEn": "Use a sentinel dummy head node (`dummy = new ListNode(-1)`) to avoid special-casing the first node. Use a `tail` pointer to attach whichever node has the smaller value from `list1` or `list2`. When one list finishes, attach the remainder of the other list directly.",
    "jsSpecificTipsEn": [
      "A dummy head node simplifies list construction and eliminates null-checking edge cases.",
      "Splicing pointers in place uses O(1) auxiliary space without allocating new node objects."
    ]
  },
  {
    "id": "invert-binary-tree",
    "number": 226,
    "title": "Invert Binary Tree (Invertovanje Binarnog Stabla)",
    "titleEn": "Invert Binary Tree",
    "difficulty": "Easy",
    "category": "Trees",
    "tags": [
      "Binarna Stabla",
      "DFS",
      "BFS",
      "Rekurzija"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/invert-binary-tree/",
    "description": "Data je glava (root) binarnog stabla. Invertuj stablo (napravi njegov odraz u ogledalu) i vrati njegov koren.",
    "pattern": "Rekurzivni DFS ili Iterativni BFS (Queue)",
    "examples": [
      {
        "input": "root = [4,2,7,1,3,6,9]",
        "output": "[4,7,2,9,6,3,1]",
        "explanation": "Za svaki čvor zamenjujemo njegovo levo i desno podstablo.",
        "explanationEn": "All left and right children are swapped across all levels."
      },
      {
        "input": "root = [2,1,3]",
        "output": "[2,3,1]",
        "explanation": "Levo dete 1 i desno dete 3 su zamenili mesta.",
        "explanationEn": "Left child 1 and right child 3 are swapped."
      },
      {
        "input": "root = []",
        "output": "[]",
        "explanation": "Prazno stablo vraća null."
      }
    ],
    "constraints": [
      "Broj čvorova u stablu je u opsegu [0, 100]",
      "-100 <= Node.val <= 100"
    ],
    "intuition": "Za svaki čvor u stablu potrebno je zameniti njegovo levo i desno dete, a zatim rekurzivno ponoviti isti postupak za levo i desno podstablo. Bazni slučaj je kada je čvor `null`.",
    "optimalSolution": {
      "title": "Optimalno rešenje: DFS Rekurzija",
      "code": "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\n/**\n * @param {TreeNode} root\n * @return {TreeNode}\n */\nfunction invertTree(root) {\n  if (root === null) {\n    return null;\n  }\n  \n  // 1. Swap left and right children using JS destructuring\n  const temp = root.left;\n  root.left = root.right;\n  root.right = temp;\n  \n  // 2. Recursively invert left and right subtrees\n  invertTree(root.left);\n  invertTree(root.right);\n  \n  return root;\n}",
      "timeComplexity": "O(n) — Poseti se svaki čvor u stablu tačno jednom.",
      "spaceComplexity": "O(h) — Gde je h visina stabla (memorija na Call Stack-u). U najgorem slučaju O(n), za balanso stablo O(log n).",
      "explanation": "Ovo je čuveni zadatak koji je Max Howell (tvorac Homebrew alata) popularizovao kada ga je Google odbio na intervjuu.",
      "explanationEn": "If `root === null`, return null. Swap `root.left` and `root.right` (using destructuring `[root.left, root.right] = [invertTree(root.right), invertTree(root.left)]`), then return `root`."
    },
    "jsSpecificTips": [
      "Može se napisati i u jednoj liniji u modernom JS-u: `[root.left, root.right] = [invertTree(root.right), invertTree(root.left)]; return root;` zahvaljujući array destructuring swap sintaksi!",
      "Za izrazito duboka stabla (h > 10,000) iterativna varijanta sa redom (Queue / BFS) sprečava Call Stack limit browser-a."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "[4,2,7,1,3,6,9]",
        "inputParams": [
          [
            4,
            2,
            7,
            1,
            3,
            6,
            9
          ]
        ],
        "inputStr": "root = [4,2,7,1,3,6,9]",
        "expectedOutput": [
          4,
          7,
          2,
          9,
          6,
          3,
          1
        ],
        "expectedStr": "[4,7,2,9,6,3,1]"
      },
      {
        "id": "tc-2",
        "name": "[2,1,3]",
        "inputParams": [
          [
            2,
            1,
            3
          ]
        ],
        "inputStr": "root = [2,1,3]",
        "expectedOutput": [
          2,
          3,
          1
        ],
        "expectedStr": "[2,3,1]"
      }
    ],
    "runFunctionName": "invertTree",
    "descriptionEn": "Given the `root` of a binary tree, invert the tree, and return its root.",
    "patternEn": "Tree Traversal (DFS / Recursion)",
    "intuitionEn": "To invert a binary tree, swap the left and right subtrees for every node in the tree recursively.",
    "jsSpecificTipsEn": [
      "Modern JavaScript array destructuring allows swapping pointers in a single line: `[root.left, root.right] = [invertTree(root.right), invertTree(root.left)]`.",
      "Both recursive DFS and iterative BFS (using a queue) run in O(n) time visiting every node once."
    ]
  },
  {
    "id": "product-of-array-except-self",
    "number": 238,
    "title": "Product of Array Except Self (Proizvod Niza Bez Samog Sebe)",
    "titleEn": "Product of Array Except Self",
    "difficulty": "Medium",
    "category": "Arrays & Hash Maps",
    "tags": [
      "Prefiks Proizvodi",
      "Sufiks Proizvodi",
      "Nizovi",
      "O(1) Dodatni Prostor"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/product-of-array-except-self/",
    "description": "Dat je celobrojni niz `nums`. Vrati niz `answer` takav da je `answer[i]` jednak proizvodu svih elemenata `nums` osim `nums[i]`.\n\nAlgoritam MORA raditi u **O(n)** vremenskoj složenosti i **BEZ korišćenja operacije deljenja (/)**!",
    "pattern": "Prefix and Suffix Products (Proizvodi sa leve i desne strane)",
    "examples": [
      {
        "input": "nums = [1,2,3,4]",
        "output": "[24,12,8,6]",
        "explanation": "Za indeks 0: 2*3*4 = 24; za indeks 1: 1*3*4 = 12; za indeks 2: 1*2*4 = 8; za indeks 3: 1*2*3 = 6.",
        "explanationEn": "At index 0: 2*3*4 = 24. At index 1: 1*3*4 = 12. At index 2: 1*2*4 = 8. At index 3: 1*2*3 = 6."
      },
      {
        "input": "nums = [-1,1,0,-3,3]",
        "output": "[0,0,9,0,0]",
        "explanation": "Elementi oko nule dobijaju 0 osim samog indeksa gde je nula.",
        "explanationEn": "Products computed correctly with zeros in array."
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30",
      "Garantuje se da proizvod staje u 32-bitni ceo broj"
    ],
    "intuition": "Za svaki element `i`, proizvod svih ostalih brojeva jednak je: `(proizvod svih elemenata levo od i) * (proizvod svih elemenata desno od i)`. Prvo u nizu `result` izračunamo prefiks proizvode s leva na desno. Zatim u drugom prolazu s desna na levo množimo akumuliranim sufiks proizvodom.",
    "optimalSolution": {
      "title": "Optimalno rešenje: Dva prolaza sa O(1) dodatne memorije",
      "code": "/**\n * @param {number[]} nums\n * @return {number[]}\n */\nfunction productExceptSelf(nums) {\n  const n = nums.length;\n  const result = new Array(n);\n  \n  // 1. Left-to-right pass: result[i] contains product of all elements to the LEFT of i\n  result[0] = 1;\n  for (let i = 1; i < n; i++) {\n    result[i] = result[i - 1] * nums[i - 1];\n  }\n  \n  // 2. Right-to-left pass: multiply with accumulated product from RIGHT side\n  let rightProduct = 1;\n  for (let i = n - 1; i >= 0; i--) {\n    result[i] = result[i] * rightProduct;\n    rightProduct *= nums[i];\n  }\n  \n  return result;\n}",
      "timeComplexity": "O(n) — Dva linearna prolaza kroz niz dužine n.",
      "spaceComplexity": "O(1) — Rezultujući niz se ne računa kao dodatna memorija po zahtevu zadatka.",
      "explanation": "Izbegavanjem deljenja (/), algoritam bez problema rukuje nulama u nizu bez deljenja sa nulom (`DivisionByZeroError`).",
      "explanationEn": "Create output array `res` of length `n`. Pass 1 (left-to-right): `res[i] = prefix`, `prefix *= nums[i]`. Pass 2 (right-to-left): `res[i] *= suffix`, `suffix *= nums[i]`. Total time is O(n) and auxiliary space is O(1) (excluding the output array)."
    },
    "jsSpecificTips": [
      "`new Array(n)` unapred alocira niz tačne dužine, što sprečava česte realokacije memorije u JS V8 engine-u u poređenju sa postepenim `.push()`-ovanjem.",
      "U JS-u `0 * -1` daje `-0`. Pošto `-0 === 0` u standardnoj jednakosti, JS test case runneri ovo tretiraju ispravno."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "[1,2,3,4]",
        "inputParams": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "inputStr": "nums = [1, 2, 3, 4]",
        "expectedOutput": [
          24,
          12,
          8,
          6
        ],
        "expectedStr": "[24, 12, 8, 6]"
      },
      {
        "id": "tc-2",
        "name": "Contains zero",
        "inputParams": [
          [
            -1,
            1,
            0,
            -3,
            3
          ]
        ],
        "inputStr": "nums = [-1, 1, 0, -3, 3]",
        "expectedOutput": [
          0,
          0,
          9,
          0,
          0
        ],
        "expectedStr": "[0, 0, 9, 0, 0]"
      }
    ],
    "runFunctionName": "productExceptSelf",
    "descriptionEn": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in `O(n)` time and without using the division operation.",
    "patternEn": "Prefix and Suffix Accumulation",
    "intuitionEn": "The answer at index `i` is the product of all elements to the left of `i` multiplied by the product of all elements to the right of `i`. Compute prefix products in a forward pass, then multiply by suffix products in a backward pass.",
    "jsSpecificTipsEn": [
      "Pre-allocating output with `new Array(nums.length)` avoids dynamic resizing.",
      "Multiplying directly into the output array satisfies the O(1) extra space constraint."
    ]
  },
  {
    "id": "house-robber",
    "number": 198,
    "title": "House Robber (Pljačkaš Kuća)",
    "titleEn": "House Robber",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "tags": [
      "Dinamičko Programiranje",
      "O(1) Prostor",
      "O(n) Vreme"
    ],
    "leetcodeUrl": "https://leetcode.com/problems/house-robber/",
    "description": "Ti si profesionalni pljačkaš koji planira da opljačka kuće duž ulice. Svaka kuća ima određenu količinu novca u sebi. Jedino ograničenje je što susedne kuće imaju povezane sigurnosne sisteme i **automatski će alarmirati policiju ako su dve susedne kuće opljačkane iste noći**.\n\nDat je celobrojni niz `nums` koji predstavlja količinu novca u svakoj kući. Vrati maksimalnu količinu novca koju možeš opljačkati večeras bez alarmiranja policije.",
    "pattern": "Dinamičko Programiranje (Odlučivanje: opljačkati ili preskočiti)",
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "4",
        "explanation": "Pljačkamo kuću 1 (novac = 1) i kuću 3 (novac = 3). Ukupan profit = 1 + 3 = 4.",
        "explanationEn": "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4."
      },
      {
        "input": "nums = [2,7,9,3,1]",
        "output": "12",
        "explanation": "Pljačkamo kuću 1 (2), kuću 3 (9) i kuću 5 (1). Ukupno = 2 + 9 + 1 = 12.",
        "explanationEn": "Rob house 1 (money = 2), house 3 (money = 9) and house 5 (money = 1). Total amount you can rob = 2 + 9 + 1 = 12."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    "intuition": "Za svaku kuću imamo dva izbora:\n1. Opljačkamo trenutnu kuću (`nums[i] + profit od kuće i-2`)\n2. Preskočimo trenutnu kuću (`profit od kuće i-1`).\nDakle: `dp[i] = max(dp[i-1], nums[i] + dp[i-2])`. Pošto nam trebaju samo dve prethodne vrednosti, optimizujemo prostor na O(1).",
    "optimalSolution": {
      "title": "Optimalno rešenje: DP sa O(1) memorijom",
      "code": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction rob(nums) {\n  if (nums.length === 0) return 0;\n  if (nums.length === 1) return nums[0];\n  \n  let robPrev2 = 0; // Max profit up to house i-2\n  let robPrev1 = 0; // Max profit up to house i-1\n  \n  for (let i = 0; i < nums.length; i++) {\n    // New maximum is max of (skipping current) or (robbing current + i-2)\n    const currentMax = Math.max(robPrev1, nums[i] + robPrev2);\n    robPrev2 = robPrev1;\n    robPrev1 = currentMax;\n  }\n  \n  return robPrev1;\n}",
      "timeComplexity": "O(n) — Jedan prolaz kroz niz kuća.",
      "spaceComplexity": "O(1) — Konstantan broj promenljivih.",
      "explanation": "Prelazak stanja `dp[i] = max(dp[i-1], dp[i-2] + nums[i])` se svodi na dve jednostavne promenljive, identično optimizaciji Fibonačijevog niza.",
      "explanationEn": "Use two state variables `prevMax = 0` and `currMax = 0`. For each house amount `num`, compute `temp = Math.max(currMax, prevMax + num)`, update `prevMax = currMax`, and `currMax = temp`. Return `currMax` in O(n) time and O(1) space."
    },
    "jsSpecificTips": [
      "`Math.max(a, b)` u JS-u radi u O(1) i izuzetno je efikasan za poređenje dva broja.",
      "Ovaj isti obrazac se primenjuje na srodne zadatke: House Robber II (#213 - gde su kuće u krugu) i Delete and Earn (#740)."
    ],
    "testCases": [
      {
        "id": "tc-1",
        "name": "[1,2,3,1]",
        "inputParams": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "inputStr": "nums = [1, 2, 3, 1]",
        "expectedOutput": 4,
        "expectedStr": "4"
      },
      {
        "id": "tc-2",
        "name": "[2,7,9,3,1]",
        "inputParams": [
          [
            2,
            7,
            9,
            3,
            1
          ]
        ],
        "inputStr": "nums = [2, 7, 9, 3, 1]",
        "expectedOutput": 12,
        "expectedStr": "12"
      }
    ],
    "runFunctionName": "rob",
    "descriptionEn": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
    "patternEn": "Dynamic Programming (State Reduction)",
    "intuitionEn": "At house `i`, you have two choices: rob house `i` (taking `nums[i] + maxRob(i-2)`) or skip house `i` (keeping `maxRob(i-1)`). Thus, `rob(i) = Math.max(rob(i-1), nums[i] + rob(i-2))`.",
    "jsSpecificTipsEn": [
      "State reduction eliminates the need for an O(n) DP array, achieving O(1) auxiliary space.",
      "Handles base cases (0 or 1 house) naturally without special branches."
    ]
  }
];
