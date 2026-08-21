import { LeetCodeProblem } from '../types';

export const LEETCODE_PROBLEMS: LeetCodeProblem[] = [
  {
    id: 'two-sum',
    number: 1,
    title: 'Two Sum (Zbir Dva Broja)',
    titleEn: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hash Maps',
    tags: ['Hash Map', 'Nizovi', 'Jedan Prolaz', 'O(n)'],
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    description: 'Dat je niz celih brojeva `nums` i ceo broj `target`. Pronađi indekse dva broja u nizu čiji je zbir jednak vrednosti `target`. Pretpostavlja se da svaki unos ima tačno jedno rešenje i ne sme se koristiti isti element dva puta. Rezultat se može vratiti u bilo kom redosledu.',
    pattern: 'Hash Map Lookup (Jedan Prolaz)',
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Zato što je nums[0] + nums[1] == 2 + 7 == 9, vraćamo [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'nums[1] + nums[2] == 2 + 4 == 6, vraćamo [1, 2].'
      },
      {
        input: 'nums = [3, 3], target = 6',
        output: '[0, 1]',
        explanation: 'nums[0] + nums[1] == 3 + 3 == 6, vraćamo [0, 1].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Postoji tačno jedno validno rešenje.'
    ],
    intuition: 'Umesto dvostruke petlje koja poredi svaki par sa vremenskom složenošću O(n²), koristimo Hash Map (JavaScript `Map` ili plain objekat `{}`). Prilikom prolaska kroz niz za svaki broj `num` računamo komplement: `complement = target - num`. Ako komplement već postoji u mapi, odmah vraćamo njegov indeks i trenutni indeks.',
    optimalSolution: {
      title: 'Optimalno rešenje: Hash Map u jednom prolazu',
      code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Map za čuvanje parova: { broj => indeks }
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const current = nums[i];
    const complement = target - current;
    
    // Ako smo ranije videli komplement, pronašli smo par
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    // Čuvamo trenutni broj i njegov indeks u mapi
    map.set(current, i);
  }
  
  return [];
}`,
      timeComplexity: 'O(n) — Jedan prolaz kroz niz dužine n; pretraga i upis u Map traju O(1) u proseku.',
      spaceComplexity: 'O(n) — U najgorem slučaju čuvamo do n elemenata u mapi.',
      explanation: 'U svakom koraku proveravamo da li je komplement već viđen. JavaScript `Map` nudi konzistentne O(1) operacije `.has()` i `.get()` bez zagađivanja prototipskog lanca koje običan objekat `{}` može imati.'
    },
    bruteForceSolution: {
      title: 'Brute Force (Naivni pristup)',
      code: `function twoSumBruteForce(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}`,
      timeComplexity: 'O(n²) — Dve ugnježdene petlje testiraju sve parove.',
      spaceComplexity: 'O(1) — Ne koristi dodatnu memoriju.',
      explanation: 'Za veće nizove (n = 10^4) ovaj pristup dostiže 10^8 operacija i dovodi do Time Limit Exceeded (TLE).'
    },
    jsSpecificTips: [
      'Koristite `new Map()` umesto običnog objekta `{}` kada su ključevi brojevi, jer objekti sve ključeve konvertuju u stringove što stvara nepotreban overhead.',
      'Metode `map.has()` i `map.get()` su znatno jasnije i bezbednije od `complement in obj` ili `obj[complement] !== undefined` jer izbegavaju probleme sa svojstvima iz `Object.prototype` (kao npr. `toString`).'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'Standardni niz',
        inputParams: [[2, 7, 11, 15], 9],
        inputStr: 'nums = [2, 7, 11, 15], target = 9',
        expectedOutput: [0, 1],
        expectedStr: '[0, 1]'
      },
      {
        id: 'tc-2',
        name: 'Elementi nisu sortirani',
        inputParams: [[3, 2, 4], 6],
        inputStr: 'nums = [3, 2, 4], target = 6',
        expectedOutput: [1, 2],
        expectedStr: '[1, 2]'
      },
      {
        id: 'tc-3',
        name: 'Duplikati',
        inputParams: [[3, 3], 6],
        inputStr: 'nums = [3, 3], target = 6',
        expectedOutput: [0, 1],
        expectedStr: '[0, 1]'
      },
      {
        id: 'tc-4',
        name: 'Negativni brojevi',
        inputParams: [[-1, -2, -3, -4, -5], -8],
        inputStr: 'nums = [-1, -2, -3, -4, -5], target = -8',
        expectedOutput: [2, 4],
        expectedStr: '[2, 4]'
      }
    ],
    runFunctionName: 'twoSum'
  },
  {
    id: 'valid-parentheses',
    number: 20,
    title: 'Valid Parentheses (Validne Zagrade)',
    titleEn: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    tags: ['Stack', 'Stringovi', 'O(n)'],
    leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/',
    description: 'Dat je string `s` koji sadrži samo karaktere `(`, `)`, `{`, `}`, `[` i `]`. Odredi da li je uneti string validan. String je validan ako:\n1. Otvorene zagrade moraju biti zatvorene istom vrstom zagrada.\n2. Otvorene zagrade moraju biti zatvorene u ispravnom redosledu.\n3. Svaka zatvorena zagrada ima odgovarajuću otvorenu zagradu istog tipa.',
    pattern: 'Stack (LIFO — Last In First Out)',
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: 'Zagrada je otvorena i pravilno zatvorena.'
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'Sve tri vrste zagrada su pravilno uparene i zatvorene.'
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: 'Otvorena je obla zagrada (, a zatvorena uglasta ].'
      },
      {
        input: 's = "([)]"',
        output: 'false',
        explanation: 'Redosled zatvaranja nije ispravan.'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's se sastoji isključivo od zagrada "()[]{}"'
    ],
    intuition: 'Stack struktura podataka je savršena za uparivanje zagrada jer poslednja otvorena zagrada mora biti prva koja će se zatvoriti (LIFO). Kada naiđemo na otvorenu zagradu, stavljamo je na stack (ili odmah stavljamo njenu odgovarajuću zatvorenu). Kada naiđemo na zatvorenu zagradu, skidamo vrh stack-a i poredimo.',
    optimalSolution: {
      title: 'Optimalno rešenje: Stack sa Hash Mapom',
      code: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Ako je dužina stringa neparna, nemoguće je da su sve zagrade uparene
  if (s.length % 2 !== 0) return false;
  
  const stack = [];
  const map = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    
    if (map[char]) {
      // char je zatvorena zagrada -> skidamo sa stack-a i poredimo
      const top = stack.length > 0 ? stack.pop() : '#';
      if (top !== map[char]) {
        return false;
      }
    } else {
      // char je otvorena zagrada -> dodajemo na stack
      stack.push(char);
    }
  }
  
  // Ako je stack prazan, sve zagrade su validno zatvorene
  return stack.length === 0;
}`,
      timeComplexity: 'O(n) — Jedan prolaz kroz sve karaktere stringa; push i pop na JS niz traju O(1).',
      spaceComplexity: 'O(n) — U najgorem slučaju (npr. "((((((") na stack stavljamo do n elemenata.',
      explanation: 'Prethodna provera `s.length % 2 !== 0` odmah odbacuje neparne dužine u O(1). Koristimo JS niz kao brz Stack sa ugrađenim `.push()` i `.pop()` metodama.'
    },
    jsSpecificTips: [
      'U JavaScriptu, `Array.prototype.push()` i `Array.prototype.pop()` rade na kraju niza i imaju O(1) amortizovanu složenost, što niz čini idealnim stack-om.',
      'Nemojte koristiti `shift()` ili `unshift()` kao stack operacije jer one pomeraju sve elemente u nizu i imaju O(n) složenost!'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'Jednostavan par',
        inputParams: ['()'],
        inputStr: 's = "()"',
        expectedOutput: true,
        expectedStr: 'true'
      },
      {
        id: 'tc-2',
        name: 'Mešovite zagrade',
        inputParams: ['()[]{}'],
        inputStr: 's = "()[]{}"',
        expectedOutput: true,
        expectedStr: 'true'
      },
      {
        id: 'tc-3',
        name: 'Pogrešno uparene zagrade',
        inputParams: ['(]'],
        inputStr: 's = "(]"',
        expectedOutput: false,
        expectedStr: 'false'
      },
      {
        id: 'tc-4',
        name: 'Ugnježdeni niz',
        inputParams: ['{[]()}'],
        inputStr: 's = "{[]()}"',
        expectedOutput: true,
        expectedStr: 'true'
      },
      {
        id: 'tc-5',
        name: 'Samo zatvorene zagrade',
        inputParams: [']['],
        inputStr: 's = "]["',
        expectedOutput: false,
        expectedStr: 'false'
      }
    ],
    runFunctionName: 'isValid'
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    number: 121,
    title: 'Best Time to Buy and Sell Stock (Najbolji Trenutak za Kupovinu Akcija)',
    titleEn: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Two Pointers',
    tags: ['Nizovi', 'Greedy', 'Jedan Prolaz', 'Sliding Window'],
    leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    description: 'Dat je niz `prices` gde je `prices[i]` cena date akcije `i`-tog dana. Želiš da maksimizuješ svoj profit biranjem jednog dana za kupovinu i drugog, kasnijeg dana u budućnosti za prodaju te akcije. Vrati maksimalni profit koji možeš ostvariti. Ako profit nije moguć, vrati 0.',
    pattern: 'Jedan Prolaz / Greedy (Tracking Min Price)',
    examples: [
      {
        input: 'prices = [7, 1, 5, 3, 6, 4]',
        output: '5',
        explanation: 'Kupovina 2. dana (cena = 1) i prodaja 5. dana (cena = 6), profit = 6 - 1 = 5.'
      },
      {
        input: 'prices = [7, 6, 4, 3, 1]',
        output: '0',
        explanation: 'U ovom slučaju nijedna transakcija ne donosi profit, pa je maxProfit = 0.'
      }
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    intuition: 'Kako prolazimo kroz niz s leva na desno, konstantno pamtimo najmanju cenu viđenu do sada (`minPrice`). Za svaki sledeći dan računamo potencijalni profit: `trenutnaCena - minPrice` i ažuriramo `maxProfit`.',
    optimalSolution: {
      title: 'Optimalno rešenje: Jedan prolaz (Greedy)',
      code: `/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  
  for (let i = 0; i < prices.length; i++) {
    const price = prices[i];
    
    if (price < minPrice) {
      minPrice = price; // Pronašli smo novu najnižu cenu za kupovinu
    } else {
      const currentProfit = price - minPrice;
      if (currentProfit > maxProfit) {
        maxProfit = currentProfit;
      }
    }
  }
  
  return maxProfit;
}`,
      timeComplexity: 'O(n) — Jedan prolaz kroz ceo niz cena.',
      spaceComplexity: 'O(1) — Koriste se samo dve promenljive za praćenje stanja.',
      explanation: 'Ovaj pristup rešava problem u linearnom vremenu bez alokacije dodatne memorije. Inicijalizacija sa `Infinity` garantuje da će prva stvarna cena postati početni minimum.'
    },
    jsSpecificTips: [
      'U JS-u `Infinity` je globalno svojstvo koje predstavlja pozitivnu beskonačnost (`Number.POSITIVE_INFINITY`), idealno za početne min promenljive.',
      'Izbegavajte pozivanje `Math.min(...prices)` na velikim nizovima jer `Math.min(...arr)` raspakuje elemente na Call Stack kao argumente funkcije, što baca `RangeError: Maximum call stack size exceeded` za nizove veće od ~65,000 elemenata!'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'Standardan primer',
        inputParams: [[7, 1, 5, 3, 6, 4]],
        inputStr: 'prices = [7, 1, 5, 3, 6, 4]',
        expectedOutput: 5,
        expectedStr: '5'
      },
      {
        id: 'tc-2',
        name: 'Opadajući niz (Bez profita)',
        inputParams: [[7, 6, 4, 3, 1]],
        inputStr: 'prices = [7, 6, 4, 3, 1]',
        expectedOutput: 0,
        expectedStr: '0'
      },
      {
        id: 'tc-3',
        name: 'Dva elementa',
        inputParams: [[2, 4]],
        inputStr: 'prices = [2, 4]',
        expectedOutput: 2,
        expectedStr: '2'
      }
    ],
    runFunctionName: 'maxProfit'
  },
  {
    id: 'valid-anagram',
    number: 242,
    title: 'Valid Anagram (Validan Anagram)',
    titleEn: 'Valid Anagram',
    difficulty: 'Easy',
    category: 'Arrays & Hash Maps',
    tags: ['Hash Map', 'Stringovi', 'Sortiranje', 'Brojač Frekvencija'],
    leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/',
    description: 'Data su dva stringa `s` i `t`. Vrati `true` ako je `t` anagram od `s`, a u suprotnom vrati `false`. Anagram je reč ili fraza formirana preslaganjem slova druge reči, koristeći sva originalna slova tačno jednom.',
    pattern: 'Frekventni Niz / Hash Map',
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: 'true',
        explanation: 'Oba stringa sadrže ista slova sa istom frekvencijom.'
      },
      {
        input: 's = "rat", t = "car"',
        output: 'false',
        explanation: 'Sadrže različita slova (c i t).'
      }
    ],
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's i t se sastoje isključivo od malih engleskih slova'
    ],
    intuition: 'Dva stringa su anagrami ako i samo ako imaju identičnu dužinu i svako slovo se pojavljuje isti broj puta. Možemo koristiti fiksni niz od 26 elemenata (ili Hash Map) za praćenje broja pojavljivanja svakog karaktera.',
    optimalSolution: {
      title: 'Optimalno rešenje: Niz frekvencije (26 karaktera)',
      code: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  
  // Niz od 26 brojača za mala slova abecede ('a' do 'z')
  const count = new Int32Array(26);
  const baseCode = 'a'.charCodeAt(0);
  
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - baseCode]++;
    count[t.charCodeAt(i) - baseCode]--;
  }
  
  // Ako su stringovi anagrami, svi brojači moraju biti 0
  for (let i = 0; i < 26; i++) {
    if (count[i] !== 0) return false;
  }
  
  return true;
}`,
      timeComplexity: 'O(n) — Jedan prolaz kroz oba stringa dužine n.',
      spaceComplexity: 'O(1) — Koristi se fiksni TypedArray veličine 26 bajtova.',
      explanation: 'Umesto skupog sortiranja O(n log n), brojač frekvencije postiže O(n) vreme i O(1) dodatnu memoriju. Korišćenje `Int32Array(26)` u JS V8 engine-u je ekstremno brzo i eliminiše kreiranje objekata na heap-u.'
    },
    bruteForceSolution: {
      title: 'Sortiranje (Brute Force / Alternativno)',
      code: `function isAnagramSort(s, t) {
  if (s.length !== t.length) return false;
  return s.split('').sort().join('') === t.split('').sort().join('');
}`,
      timeComplexity: 'O(n log n) — Zbog sortiranja nizova karaktera.',
      spaceComplexity: 'O(n) — split() kreira nove nizove karaktera u memoriji.',
      explanation: 'Iako je kod kratak, pretvaranje stringova u nizove (`split`) i sortiranje je memorijski i računski znatno teže za velike stringove.'
    },
    jsSpecificTips: [
      '`charCodeAt(i)` je mnogo brži od indeksiranja karaktera ili `s[i]` kada želimo direktan numerički kod za tabele frekvencija.',
      'Za Unicode podršku (emojiji i internacionalni karakteri), koristite `new Map()` umesto fiksnog niza od 26 elemenata.'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'Validan anagram',
        inputParams: ['anagram', 'nagaram'],
        inputStr: 's = "anagram", t = "nagaram"',
        expectedOutput: true,
        expectedStr: 'true'
      },
      {
        id: 'tc-2',
        name: 'Nisu anagrami',
        inputParams: ['rat', 'car'],
        inputStr: 's = "rat", t = "car"',
        expectedOutput: false,
        expectedStr: 'false'
      },
      {
        id: 'tc-3',
        name: 'Različite dužine',
        inputParams: ['a', 'ab'],
        inputStr: 's = "a", t = "ab"',
        expectedOutput: false,
        expectedStr: 'false'
      }
    ],
    runFunctionName: 'isAnagram'
  },
  {
    id: 'group-anagrams',
    number: 49,
    title: 'Group Anagrams (Grupisanje Anagrama)',
    titleEn: 'Group Anagrams',
    difficulty: 'Medium',
    category: 'Arrays & Hash Maps',
    tags: ['Hash Map', 'Stringovi', 'Nizovi'],
    leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/',
    description: 'Dat je niz stringova `strs`. Grupiši anagrame zajedno. Odgovor možeš vratiti u bilo kom redosledu.',
    pattern: 'Hash Map sa kanonskim ključem (Categorize by Sorted String)',
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: '"eat", "tea" i "ate" su međusobni anagrami pa idu u istu grupu.'
      },
      {
        input: 'strs = [""]',
        output: '[[""]]',
        explanation: 'Prazan string je sam svoja grupa.'
      },
      {
        input: 'strs = ["a"]',
        output: '[["a"]]',
        explanation: 'Jedno slovo je samo svoja grupa.'
      }
    ],
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100',
      'strs[i] se sastoji isključivo od malih engleskih slova'
    ],
    intuition: 'Svi anagrami imaju identičan oblik kada se njihova slova sortiraju (npr. "eat", "tea", "ate" sva postaju "aet"). Koristimo taj sortirani oblik kao ključ u Hash Mapi, gde je vrednost lista reči koje pripadaju toj grupi.',
    optimalSolution: {
      title: 'Optimalno rešenje: Hash Map sa sortiranim ključem',
      code: `/**
 * @param {string[]} strs
 * @return {string[][]}
 */
function groupAnagrams(strs) {
  const map = new Map();
  
  for (let i = 0; i < strs.length; i++) {
    const str = strs[i];
    
    // Sortiramo karaktere da dobijemo kanonski ključ za grupu
    const sortedKey = str.split('').sort().join('');
    
    if (!map.has(sortedKey)) {
      map.set(sortedKey, []);
    }
    
    map.get(sortedKey).push(str);
  }
  
  // Vraćamo niz svih grupa
  return Array.from(map.values());
}`,
      timeComplexity: 'O(N * K log K) — gde je N broj stringova u nizu, a K maksimalna dužina pojedinačnog stringa.',
      spaceComplexity: 'O(N * K) — Ukupna memorija potrebna za skladištenje svih reči u Hash Mapi.',
      explanation: 'Za prosečne reči (K <= 100) sortiranje reči je izuzetno brzo. Na kraju koristimo `Array.from(map.values())` da ekstrahujemo grupe u traženi format.'
    },
    jsSpecificTips: [
      '`Array.from(map.values())` ili `[...map.values()]` je standardan i elegantan način u modernom JS-u za konverziju iteratora mapa u običan niz.',
      'Ako su reči veoma dugačke, umesto sortiranja može se generisati brojački ključ npr. `#1#0#0...#2` preko frekventnog niza od 26 slova, što smanjuje složenost na O(N * K).'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'Klasičan primer',
        inputParams: [["eat","tea","tan","ate","nat","bat"]],
        inputStr: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        expectedOutput: [["eat","tea","ate"],["tan","nat"],["bat"]],
        expectedStr: '[["eat","tea","ate"], ["tan","nat"], ["bat"]]'
      },
      {
        id: 'tc-2',
        name: 'Jedan prazan string',
        inputParams: [[""]],
        inputStr: 'strs = [""]',
        expectedOutput: [[""]],
        expectedStr: '[[""]]'
      },
      {
        id: 'tc-3',
        name: 'Jedan karakter',
        inputParams: [["a"]],
        inputStr: 'strs = ["a"]',
        expectedOutput: [["a"]],
        expectedStr: '[["a"]]'
      }
    ],
    runFunctionName: 'groupAnagrams'
  },
  {
    id: 'longest-substring-without-repeating-characters',
    number: 3,
    title: 'Longest Substring Without Repeating Characters (Najduži Podstring Bez Ponavljanja)',
    titleEn: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    tags: ['Sliding Window', 'Set', 'Dva Pokazivača', 'Stringovi'],
    leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    description: 'Dat je string `s`. Pronađi dužinu najdužeg podstringa (uzastopnog dela stringa) bez ponavljajućih karaktera.',
    pattern: 'Sliding Window (Klizni Prozor) sa Set-om ili Map-om',
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'Odgovor je "abc", čija je dužina 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'Odgovor je "b", sa dužinom 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'Odgovor je "wke", sa dužinom 3. Primeti da "pwke" nije podstring već podniz.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's se sastoji od engleskih slova, cifara, simbola i razmaka'
    ],
    intuition: 'Održavamo "klizni prozor" definisan sa dva pokazivača: `left` i `right`. Pomeramo `right` udesno i dodajemo karaktere u `Set`. Ako naiđemo na karakter koji se već nalazi u Set-u, sužavamo prozor pomeranjem `left` udesno i uklanjanjem karaktera iz Set-a sve dok duplikat ne nestane.',
    optimalSolution: {
      title: 'Optimalno rešenje: Sliding Window sa Set-om',
      code: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  const set = new Set();
  let left = 0;
  let maxLength = 0;
  
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    
    // Ako karakter već postoji u prozoru, sužavamo prozor sa leve strane
    while (set.has(char)) {
      set.delete(s[left]);
      left++;
    }
    
    // Dodajemo novi karakter u trenutni prozor
    set.add(char);
    
    // Ažuriramo maksimalnu dužinu
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}`,
      timeComplexity: 'O(n) — Iako imamo while petlju unutra, svaki karakter se dodaje u Set tačno jednom i briše najviše jednom (2n koraka ukupno).',
      spaceComplexity: 'O(min(m, n)) — Gde je n dužina stringa, a m veličina azbuke/skupa mogućih karaktera u Set-u.',
      explanation: 'Sliding window tehnika obezbeđuje optimalno linearno rešenje umesto testiranja svih mogućih podstringova u O(n²).'
    },
    jsSpecificTips: [
      'JS `Set` metode `.add()`, `.has()`, `.delete()` rade u O(1) vremenu i automatski rukuju bilo kojim karakterom (uključujući razmake i specijalne simbole).',
      'Optimizacija sa Map-om: Umesto postepenog pomeranja `left` kroz while petlju, u `Map` se može pamtiti indeks svakog karaktera pa skočiti direktno na `left = Math.max(left, map.get(char) + 1)`.'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'abcabcbb',
        inputParams: ['abcabcbb'],
        inputStr: 's = "abcabcbb"',
        expectedOutput: 3,
        expectedStr: '3'
      },
      {
        id: 'tc-2',
        name: 'Svi isti karakteri',
        inputParams: ['bbbbb'],
        inputStr: 's = "bbbbb"',
        expectedOutput: 1,
        expectedStr: '1'
      },
      {
        id: 'tc-3',
        name: 'Prazan string',
        inputParams: [''],
        inputStr: 's = ""',
        expectedOutput: 0,
        expectedStr: '0'
      },
      {
        id: 'tc-4',
        name: 'Sa razmacima i brojevima',
        inputParams: ['pwwkew'],
        inputStr: 's = "pwwkew"',
        expectedOutput: 3,
        expectedStr: '3'
      }
    ],
    runFunctionName: 'lengthOfLongestSubstring'
  },
  {
    id: 'container-with-most-water',
    number: 11,
    title: 'Container With Most Water (Kontejner sa Najviše Vode)',
    titleEn: 'Container With Most Water',
    difficulty: 'Medium',
    category: 'Two Pointers',
    tags: ['Dva Pokazivača', 'Greedy', 'Nizovi', 'O(n)'],
    leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
    description: 'Dat je celobrojni niz `height` dužine `n`. Postoji `n` vertikalnih linija nacrtanih tako da su krajnje tačke `i`-te linije `(i, 0)` i `(i, height[i])`. Pronađi dve linije koje zajedno sa x-osom formiraju kontejner koji sadrži najviše vode. Vrati maksimalnu količinu vode koju kontejner može da skladišti.',
    pattern: 'Two Pointers (Dva Pokazivača koja konvergiraju)',
    examples: [
      {
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation: 'Vertikalne linije na indeksima 1 (visina 8) i 8 (visina 7) daju max površinu: min(8, 7) * (8 - 1) = 7 * 7 = 49.'
      },
      {
        input: 'height = [1,1]',
        output: '1',
        explanation: 'Površina je min(1, 1) * (1 - 0) = 1.'
      }
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    intuition: 'Postavljamo dva pokazivača: jedan na početak (`left = 0`) i jedan na kraj (`right = height.length - 1`). Površina je određena formulom: `(right - left) * min(height[left], height[right])`. Pošto se širina `(right - left)` smanjuje u svakom koraku, jedina šansa da nađemo veću površinu je da pomerimo pokazivač sa MANJOM visinom, u nadi da ćemo naići na višu liniju.',
    optimalSolution: {
      title: 'Optimalno rešenje: Dva Pokazivača (Two Pointers)',
      code: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;
  
  while (left < right) {
    const width = right - left;
    const hLeft = height[left];
    const hRight = height[right];
    
    // Visina je ograničena nižom stranicom
    const currentHeight = Math.min(hLeft, hRight);
    const currentArea = width * currentHeight;
    
    if (currentArea > maxWater) {
      maxWater = currentArea;
    }
    
    // Pomeramo onaj pokazivač koji je kraći jer on predstavlja usko grlo
    if (hLeft < hRight) {
      left++;
    } else {
      right--;
    }
  }
  
  return maxWater;
}`,
      timeComplexity: 'O(n) — Dva pokazivača pređu ceo niz za tačno n koraka.',
      spaceComplexity: 'O(1) — Konstantan broj promenljivih.',
      explanation: 'Pomeranje pokazivača sa većom visinom nikada ne bi moglo doneti bolju površinu jer bi širina opala, a visina bi i dalje bila ograničena kraćom linijom.'
    },
    jsSpecificTips: [
      'Lokalno čuvanje `height[left]` u promenljivu unutar petlje je brže od ponovnog pristupa elementu niza više puta u istoj iteraciji.',
      'Koristite `left < right` a ne `left <= right` jer kada se pokazivači poklope, širina je 0 i voda ne može postojati.'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'Standardni niz',
        inputParams: [[1,8,6,2,5,4,8,3,7]],
        inputStr: 'height = [1,8,6,2,5,4,8,3,7]',
        expectedOutput: 49,
        expectedStr: '49'
      },
      {
        id: 'tc-2',
        name: 'Dva elementa',
        inputParams: [[1, 1]],
        inputStr: 'height = [1, 1]',
        expectedOutput: 1,
        expectedStr: '1'
      },
      {
        id: 'tc-3',
        name: 'Rastući niz',
        inputParams: [[4, 3, 2, 1, 4]],
        inputStr: 'height = [4, 3, 2, 1, 4]',
        expectedOutput: 16,
        expectedStr: '16'
      }
    ],
    runFunctionName: 'maxArea'
  },
  {
    id: 'three-sum',
    number: 15,
    title: '3Sum (Tri Broja sa Zbirom Nula)',
    titleEn: '3Sum',
    difficulty: 'Medium',
    category: 'Two Pointers',
    tags: ['Dva Pokazivača', 'Sortiranje', 'Preskakanje Duplikata', 'Nizovi'],
    leetcodeUrl: 'https://leetcode.com/problems/3sum/',
    description: 'Dat je celobrojni niz `nums`. Vrati sve jedinstvene trojke `[nums[i], nums[j], nums[k]]` takve da je `i != j`, `i != k`, `j != k`, i `nums[i] + nums[j] + nums[k] == 0`. Rezultujući skup ne sme sadržati duplirane trojke.',
    pattern: 'Sortiranje + Two Pointers sa preskakanjem duplikata',
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
        explanation: 'nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0; nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.'
      },
      {
        input: 'nums = [0,1,1]',
        output: '[]',
        explanation: 'Nijedna kombinacija ne daje zbir 0.'
      },
      {
        input: 'nums = [0,0,0]',
        output: '[[0,0,0]]',
        explanation: 'Jedina moguća trojka je [0, 0, 0].'
      }
    ],
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5'
    ],
    intuition: 'Prvo sortiramo niz u rastućem poretku. Zatim iteriramo kroz niz fiksnim elementom `nums[i]`. Za preostali deo niza primenjujemo tehniku dva pokazivača (`left` i `right`) tražeći zbir `-nums[i]`. Ključ je u preskakanju duplikata za `i`, `left` i `right` kako bi se izbegle identične trojke bez korišćenja sporog Hash Seta.',
    optimalSolution: {
      title: 'Optimalno rešenje: Sortiranje + Two Pointers',
      code: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  const result = [];
  if (nums.length < 3) return result;
  
  // OBAVEZNO: Numeričko sortiranje u JavaScript-u!
  nums.sort((a, b) => a - b);
  
  for (let i = 0; i < nums.length - 2; i++) {
    // Ako je najmanji broj veći od nule, zbir tri broja nikada ne može biti 0
    if (nums[i] > 0) break;
    
    // Preskačemo duplikate za prvi element trojke
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    
    let left = i + 1;
    let right = nums.length - 1;
    
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        
        // Preskačemo duplikate za levi i desni pokazivač
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        
        left++;
        right--;
      } else if (sum < 0) {
        left++; // Zbir je premali, povećavamo levu stranu
      } else {
        right--; // Zbir je prevelik, smanjujemo desnu stranu
      }
    }
  }
  
  return result;
}`,
      timeComplexity: 'O(n²) — Sortiranje je O(n log n), a dvostruka petlja (for + two pointers) traje O(n²).',
      spaceComplexity: 'O(1) ili O(log n) — Zavisi od memorije potrebne za sortiranje u JS engine-u.',
      explanation: 'Preskakanje duplikata na licu mesta (in-place) eliminiše potrebu za pretvaranjem trojki u stringove radi ubacivanja u Set, što drastično ubrzava izvršavanje.'
    },
    jsSpecificTips: [
      'KRITIČAN JS BUG: `nums.sort()` po defaultu sortira elemente kao STRINGOVE! Poziv `[-1, -4, 2].sort()` daje `[-1, -4, 2]` a ne `[-4, -1, 2]`. Uvek prosledite komparator `(a, b) => a - b`!',
      'Nemojte koristiti `JSON.stringify` i `Set` za eliminaciju duplikata u 3Sum jer je stringifikacija hiljadama puta sporija od jednostavnog `nums[i] === nums[i-1]` preskakanja.'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: '[-1,0,1,2,-1,-4]',
        inputParams: [[-1, 0, 1, 2, -1, -4]],
        inputStr: 'nums = [-1, 0, 1, 2, -1, -4]',
        expectedOutput: [[-1, -1, 2], [-1, 0, 1]],
        expectedStr: '[[-1, -1, 2], [-1, 0, 1]]'
      },
      {
        id: 'tc-2',
        name: 'Tri nule',
        inputParams: [[0, 0, 0]],
        inputStr: 'nums = [0, 0, 0]',
        expectedOutput: [[0, 0, 0]],
        expectedStr: '[[0, 0, 0]]'
      },
      {
        id: 'tc-3',
        name: 'Nema rešenja',
        inputParams: [[0, 1, 1]],
        inputStr: 'nums = [0, 1, 1]',
        expectedOutput: [],
        expectedStr: '[]'
      }
    ],
    runFunctionName: 'threeSum'
  },
  {
    id: 'maximum-subarray',
    number: 53,
    title: 'Maximum Subarray (Maksimalni Podniz - Kadaneov Algoritam)',
    titleEn: 'Maximum Subarray',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['Dinamičko Programiranje', 'Kadaneov Algoritam', 'O(n)', 'Nizovi'],
    leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/',
    description: 'Dat je celobrojni niz `nums`. Pronađi podniz (neprekidni segment niza) koji ima najveći zbir i vrati njegov zbir.',
    pattern: "Kadane's Algorithm / Dinamičko Programiranje u jednom prolazu",
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'Neprekidni podniz [4,-1,2,1] ima najveći zbir = 6.'
      },
      {
        input: 'nums = [1]',
        output: '1',
        explanation: 'Jedan element ima zbir 1.'
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23',
        explanation: 'Ceo niz [5,4,-1,7,8] ima najveći zbir = 23.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    intuition: 'Kadaneov algoritam se zasniva na prostom uvidu: kada sabiramo elemente, ako kumulativni zbir postane negativan (`currentSum < 0`), on samo odmaže bilo kom budućem podnizu. U tom trenutku "odbacujemo" prethodni segment i resetujemo `currentSum = 0` (odnosno počinjemo novi podniz od trenutnog elementa).',
    optimalSolution: {
      title: "Optimalno rešenje: Kadane's Algorithm",
      code: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let currentSum = 0;
  
  for (let i = 0; i < nums.length; i++) {
    currentSum += nums[i];
    
    if (currentSum > maxSoFar) {
      maxSoFar = currentSum;
    }
    
    // Ako trenutni zbir ode ispod nule, resetujemo ga
    if (currentSum < 0) {
      currentSum = 0;
    }
  }
  
  return maxSoFar;
}`,
      timeComplexity: 'O(n) — Jedan prolaz kroz niz.',
      spaceComplexity: 'O(1) — Potrebne su samo dve promenljive.',
      explanation: 'Inicijalizacija `maxSoFar = nums[0]` obezbeđuje ispravnost čak i u slučaju kada su svi brojevi u nizu negativni (npr. `[-3, -2, -5]` vraća `-2`).'
    },
    jsSpecificTips: [
      'Pazite da ne postavite `maxSoFar = 0` na početku, jer ako je niz sastavljen isključivo od negativnih brojeva (npr. `[-1]`), nula bi bila pogrešno vraćena umesto `-1`!',
      'U poređenju sa `Math.max(currentSum, maxSoFar)` unutar for petlje, eksplicitni `if` uslov je malo brži jer izbegava poziv funkcije u JS engine-u.'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'Mešoviti pozitivni i negativni',
        inputParams: [[-2,1,-3,4,-1,2,1,-5,4]],
        inputStr: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        expectedOutput: 6,
        expectedStr: '6'
      },
      {
        id: 'tc-2',
        name: 'Jedan element',
        inputParams: [[1]],
        inputStr: 'nums = [1]',
        expectedOutput: 1,
        expectedStr: '1'
      },
      {
        id: 'tc-3',
        name: 'Svi negativni brojevi',
        inputParams: [[-5, -2, -8, -1, -4]],
        inputStr: 'nums = [-5, -2, -8, -1, -4]',
        expectedOutput: -1,
        expectedStr: '-1'
      },
      {
        id: 'tc-4',
        name: 'Svi pozitivni brojevi',
        inputParams: [[5, 4, -1, 7, 8]],
        inputStr: 'nums = [5, 4, -1, 7, 8]',
        expectedOutput: 23,
        expectedStr: '23'
      }
    ],
    runFunctionName: 'maxSubArray'
  },
  {
    id: 'climbing-stairs',
    number: 70,
    title: 'Climbing Stairs (Penjanje uz Stepenice)',
    titleEn: 'Climbing Stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    tags: ['Dinamičko Programiranje', 'Fibonači', 'Memorizacija', 'O(1) Prostor'],
    leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
    description: 'Penješ se uz stepenište koje ima `n` stepenika. Svaki put možeš preći ili 1 ili 2 stepenika. Na koliko različitih načina možeš stići do vrha?',
    pattern: 'Dinamičko Programiranje (DP / Fibonacci sekvenca)',
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'Postoje 2 načina: (1 + 1) ili (2).'
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: 'Postoje 3 načina: (1 + 1 + 1), (1 + 2) ili (2 + 1).'
      },
      {
        input: 'n = 4',
        output: '5',
        explanation: 'Načini: (1+1+1+1), (1+1+2), (1+2+1), (2+1+1), (2+2).'
      }
    ],
    constraints: [
      '1 <= n <= 45'
    ],
    intuition: 'Da bismo stigli na stepenik `n`, mogli smo doći ili sa stepenika `n-1` (skokom od 1) ili sa stepenika `n-2` (skokom od 2). Prema tome: `ways(n) = ways(n-1) + ways(n-2)`. Ovo je identično Fibonačijevom nizu! Umesto rekurzije O(2^n), iterativno pamtimo samo prethodna dva stanja.',
    optimalSolution: {
      title: 'Optimalno rešenje: DP sa O(1) memorije',
      code: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  if (n <= 2) return n;
  
  let prev2 = 1; // ways(1)
  let prev1 = 2; // ways(2)
  
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  
  return prev1;
}`,
      timeComplexity: 'O(n) — Jedna jednostavna for petlja od 3 do n.',
      spaceComplexity: 'O(1) — Konstantna memorija, bez alokacije nizova.',
      explanation: 'Čuvanjem samo dva prethodna broja smanjujemo potrošnju memorije sa O(n) na O(1) i izbegavamo rekurzivni call stack overflow.'
    },
    jsSpecificTips: [
      'Čista rekurzija `climbStairs(n-1) + climbStairs(n-2)` bez memorizacije ima eksponencijalnu složenost O(2^n) i izaziva Time Limit Exceeded (TLE) za n > 35.',
      'U JS-u za n <= 45 brojevi ostaju znatno ispod `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991) tako da standardni `number` tip ima apsolutnu preciznost bez potrebe za `BigInt`.'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'n = 2',
        inputParams: [2],
        inputStr: 'n = 2',
        expectedOutput: 2,
        expectedStr: '2'
      },
      {
        id: 'tc-2',
        name: 'n = 3',
        inputParams: [3],
        inputStr: 'n = 3',
        expectedOutput: 3,
        expectedStr: '3'
      },
      {
        id: 'tc-3',
        name: 'n = 5',
        inputParams: [5],
        inputStr: 'n = 5',
        expectedOutput: 8,
        expectedStr: '8'
      }
    ],
    runFunctionName: 'climbStairs'
  },
  {
    id: 'binary-search',
    number: 704,
    title: 'Binary Search (Binarna Pretraga)',
    titleEn: 'Binary Search',
    difficulty: 'Easy',
    category: 'Two Pointers',
    tags: ['Binarna Pretraga', 'Nizovi', 'O(log n)'],
    leetcodeUrl: 'https://leetcode.com/problems/binary-search/',
    description: 'Dat je sortiran celobrojni niz `nums` u rastućem poretku i celobrojna vrednost `target`. Napiši funkciju za pretragu `target` u `nums`. Ako `target` postoji, vrati njegov indeks, a u suprotnom vrati `-1`. Algoritam mora raditi u O(log n) vremenskoj složenosti.',
    pattern: 'Binary Search (Podeli pa vladaj)',
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: 'Broj 9 postoji u nizu i njegov indeks je 4.'
      },
      {
        input: 'nums = [-1,0,3,5,9,12], target = 2',
        output: '-1',
        explanation: 'Broj 2 ne postoji u nizu pa se vraća -1.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'Svi brojevi u nums su jedinstveni',
      'nums je sortiran u rastućem poretku'
    ],
    intuition: 'Pošto je niz već sortiran, u svakom koraku poredimo ciljnu vrednost `target` sa srednjim elementom (`mid`). Ako je `target` manji, pretragu nastavljamo u levoj polovini; ako je veći, u desnoj. Time se prostor pretrage prepolovljuje u svakom koraku.',
    optimalSolution: {
      title: 'Optimalno rešenje: Iterativna Binarna Pretraga',
      code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left <= right) {
    // U JS-u koristimo Math.floor jer deljenje / vraća float!
    const mid = Math.floor(left + (right - left) / 2);
    const midVal = nums[mid];
    
    if (midVal === target) {
      return mid;
    } else if (midVal < target) {
      left = mid + 1; // Traženi element je desno
    } else {
      right = mid - 1; // Traženi element je levo
    }
  }
  
  return -1;
}`,
      timeComplexity: 'O(log n) — Prostor pretrage se prepolovljuje u svakoj iteraciji.',
      spaceComplexity: 'O(1) — Konstantna memorija bez rekurzivnih poziva.',
      explanation: 'Formulacija `left + Math.floor((right - left) / 2)` sprečava potencijalno prekoračenje i garantuje ceo broj.'
    },
    jsSpecificTips: [
      'ČEST JS BUG: U jezicima kao što su C++ ili Java, deljenje dva cela broja `(left + right) / 2` automatski odseca decimale. U JavaScriptu deljenje vraća decimalni broj (`float`), pa `nums[2.5]` vraća `undefined`! Uvek koristite `Math.floor()` ili bitwise `((left + right) >> 1)`.',
      'Bitwise operator `(left + right) >> 1` takođe vrši celobrojno deljenje sa 2 i radi veoma brzo za brojeve do 32 bita.'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'Element postoji',
        inputParams: [[-1, 0, 3, 5, 9, 12], 9],
        inputStr: 'nums = [-1,0,3,5,9,12], target = 9',
        expectedOutput: 4,
        expectedStr: '4'
      },
      {
        id: 'tc-2',
        name: 'Element ne postoji',
        inputParams: [[-1, 0, 3, 5, 9, 12], 2],
        inputStr: 'nums = [-1,0,3,5,9,12], target = 2',
        expectedOutput: -1,
        expectedStr: '-1'
      },
      {
        id: 'tc-3',
        name: 'Jedan element (Poklapa se)',
        inputParams: [[5], 5],
        inputStr: 'nums = [5], target = 5',
        expectedOutput: 0,
        expectedStr: '0'
      }
    ],
    runFunctionName: 'search'
  },
  {
    id: 'merge-intervals',
    number: 56,
    title: 'Merge Intervals (Spajanje Preklapajućih Intervala)',
    titleEn: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'Arrays & Hash Maps',
    tags: ['Intervali', 'Sortiranje', 'Nizovi', 'Greedy'],
    leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/',
    description: 'Dat je niz intervala gde je `intervals[i] = [start_i, end_i]`. Spoj sve preklapajuće intervale i vrati niz nepreklapajućih intervala koji pokrivaju sve intervale iz unosa.',
    pattern: 'Sortiranje po početku + Greedy spajanje',
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Intervali [1,3] i [2,6] se preklapaju, pa se spajaju u [1,6].'
      },
      {
        input: 'intervals = [[1,4],[4,5]]',
        output: '[[1,5]]',
        explanation: 'Intervali [1,4] i [4,5] se dodiruju na tački 4 i smatraju se preklopljenim.'
      }
    ],
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= start_i <= end_i <= 10^4'
    ],
    intuition: 'Ako sortiramo intervale prema njihovom početnom vremenu (`start`), onda se svaki interval može preklapati samo sa neposredno prethodnim spojem. Dva intervala `[a, b]` i `[c, d]` se preklapaju ako je `c <= b`. Tada ih spajamo u `[a, Math.max(b, d)]`.',
    optimalSolution: {
      title: 'Optimalno rešenje: Sortiranje + Linearno spajanje',
      code: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function merge(intervals) {
  if (intervals.length <= 1) return intervals;
  
  // 1. Sortiramo intervale po početnoj tački
  intervals.sort((a, b) => a[0] - b[0]);
  
  const merged = [intervals[0]];
  
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const lastMerged = merged[merged.length - 1];
    
    // Proveravamo da li postoji preklapanje (trenutni start <= prethodni end)
    if (current[0] <= lastMerged[1]) {
      // Spajamo proširenjem kraja prethodnog intervala
      lastMerged[1] = Math.max(lastMerged[1], current[1]);
    } else {
      // Nema preklapanja, dodajemo novi interval
      merged.push(current);
    }
  }
  
  return merged;
}`,
      timeComplexity: 'O(n log n) — Zbog sortiranja niza intervala.',
      spaceComplexity: 'O(n) — Memorija za skladištenje rezultujućeg niza.',
      explanation: 'Sortiranje omogućava da jednim prolazom O(n) rešimo problem poredeći uvek samo poslednji spojeni interval u listi.'
    },
    jsSpecificTips: [
      'Mutiranje `lastMerged[1] = Math.max(...)` direktno u nizu izbegava nepotrebno kreiranje novih podnizova i smanjuje pritisak na garbage collector.',
      'Ne zaboravite komparator `(a, b) => a[0] - b[0]` u `.sort()`. Bez njega, `[10, 2]` bi bilo sortirano pre `[2, 5]` jer JS poređenje stringova stavlja "1" pre "2".'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'Standardno preklapanje',
        inputParams: [[[1,3],[2,6],[8,10],[15,18]]],
        inputStr: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        expectedOutput: [[1,6],[8,10],[15,18]],
        expectedStr: '[[1,6],[8,10],[15,18]]'
      },
      {
        id: 'tc-2',
        name: 'Dodirivanje na granici',
        inputParams: [[[1,4],[4,5]]],
        inputStr: 'intervals = [[1,4],[4,5]]',
        expectedOutput: [[1,5]],
        expectedStr: '[[1,5]]'
      },
      {
        id: 'tc-3',
        name: 'Jedan interval unutar drugog',
        inputParams: [[[1,4],[2,3]]],
        inputStr: 'intervals = [[1,4],[2,3]]',
        expectedOutput: [[1,4]],
        expectedStr: '[[1,4]]'
      }
    ],
    runFunctionName: 'merge'
  },
  {
    id: 'debounce-js',
    number: 2627,
    title: 'Debounce (JavaScript Async Obrazac)',
    titleEn: 'Debounce',
    difficulty: 'Medium',
    category: 'JavaScript & Async',
    tags: ['Closures', 'Timers', 'Async JS', 'Event Loop'],
    leetcodeUrl: 'https://leetcode.com/problems/debounce/',
    description: 'Data je funkcija `fn` i vreme kašnjenja `t` u milisekundama. Vrati **debounced** verziju te funkcije.\n\nDebounced funkcija je funkcija čije se izvršavanje odlaže za `t` milisekundi. Ako se funkcija ponovo pozove unutar tog intervala od `t` ms, prethodni planirani poziv se poništava i tajmer se restartuje sa novim argumentima.',
    pattern: 'Closure + setTimeout / clearTimeout',
    examples: [
      {
        input: 't = 50ms, pozivi na 30ms, 60ms, 100ms',
        output: 'Izvršava se samo poslednji poziv na 100ms + 50ms = 150ms',
        explanation: 'Svaki novi poziv poništava prethodni aktivni tajmer.'
      }
    ],
    constraints: [
      '0 <= t <= 1000',
      'fn je validna funkcija',
      'Poziva se sa proizvoljnim brojem argumenata'
    ],
    intuition: 'Koristimo closure za čuvanje reference na identifikator trenutnog tajmera (`timerId`). Svaki put kada se debounced funkcija pozove, prvo pozivamo `clearTimeout(timerId)`, a zatim postavljamo novi `setTimeout` koji će nakon `t` milisekundi izvršiti originalnu funkciju sa prosleđenim parametrima.',
    optimalSolution: {
      title: 'Optimalno rešenje: Debounce sa Closure i Rest parametrima',
      code: `/**
 * @param {Function} fn
 * @param {number} t milliseconds
 * @return {Function}
 */
function debounce(fn, t) {
  let timerId = null;
  
  return function(...args) {
    // 1. Poništavamo prethodno planirani poziv ako postoji
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    
    // 2. Postavljamo novi tajmer
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, t);
  };
}`,
      timeComplexity: 'O(1) — Postavljanje i čišćenje tajmera je O(1).',
      spaceComplexity: 'O(1) — Čuva se samo jedna referenca na timerId u closure-u.',
      explanation: 'Korišćenje `fn.apply(this, args)` ili `fn(...args)` obezbeđuje pravilno prosleđivanje konteksta `this` i svih argumenata originalnoj funkciji.'
    },
    jsSpecificTips: [
      'Očuvanje `this`: Arrow funkcija unutar `setTimeout(() => { fn.apply(this, args); }, t)` leksički nasleđuje `this` spoljašnje funkcije, što je ključno ako je debounce vezan za metodu objekta ili DOM event listener.',
      'U Node.js i browser okruženjima `clearTimeout(null)` ili `clearTimeout(undefined)` bezbedno ne radi ništa, ali eksplicitna provera čini nameru jasnijom.'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'Jedan poziv',
        inputParams: [50],
        inputStr: 'debounce(fn, 50ms) -> pozvano jednom',
        expectedOutput: 'Izvršeno',
        expectedStr: 'Funkcija se izvršava nakon 50ms'
      }
    ],
    runFunctionName: 'debounce'
  },
  {
    id: 'promise-all-parallel',
    number: 2721,
    title: 'Execute Asynchronous Functions in Parallel / Promise.all Implementacija',
    titleEn: 'Execute Asynchronous Functions in Parallel',
    difficulty: 'Medium',
    category: 'JavaScript & Async',
    tags: ['Promises', 'Async/Await', 'Event Loop', 'Ručna Implementacija'],
    leetcodeUrl: 'https://leetcode.com/problems/execute-asynchronous-functions-in-parallel/',
    description: 'Dat je niz funkcija `functions` koje vraćaju Promise. Vrati novi Promise koji se razrešava kada se SVI uneti Promise-i uspešno završe. Vrednost razrešenog Promise-a treba da bude niz rezultata u tačnom redosledu originalnog niza (ne po redosledu završavanja!). Ako BILO KOJI Promise baci grešku (reject), vraćeni Promise se odmah odbija sa tom prvom greškom. Nemoj koristiti ugrađeni `Promise.all`!',
    pattern: 'Brojač završenih asinhronih zadataka (Completed Counter)',
    examples: [
      {
        input: 'functions = [() => new Promise(res => res(42)), () => new Promise(res => res("JS"))]',
        output: '[42, "JS"]',
        explanation: 'Sve funkcije su uspešno izvršene i rezultati su sačuvani u tačnom redosledu.'
      },
      {
        input: 'Jedna od funkcija uradi reject("Greška")',
        output: 'Odmah se odbija sa "Greška"',
        explanation: 'Fast-fail mehanizam identičan specifikaciji Promise.all.'
      }
    ],
    constraints: [
      'functions je niz funkcija koje vraćaju Promise',
      '0 <= functions.length <= 10'
    ],
    intuition: 'Kreiramo novi `Promise((resolve, reject) => ...)`. Održavamo niz `results` i brojač `resolvedCount = 0`. Za svaku funkciju pozivamo `.then()` i smeštamo rezultat na NJEN TAČAN INDEKS `i` (`results[i] = res`). Kada `resolvedCount === functions.length`, pozivamo `resolve(results)`. Ako bilo koja funkcija baci grešku u `.catch()`, odmah pozivamo `reject(err)`.',
    optimalSolution: {
      title: 'Optimalno rešenje: Ručna implementacija Promise.all',
      code: `/**
 * @param {Array<Function>} functions
 * @return {Promise<any>}
 */
function promiseAll(functions) {
  return new Promise((resolve, reject) => {
    // Ako je niz funkcija prazan, odmah se razrešava praznim nizom
    if (functions.length === 0) {
      resolve([]);
      return;
    }
    
    const results = new Array(functions.length);
    let completedCount = 0;
    
    functions.forEach((fn, index) => {
      // Pozivamo funkciju i osiguravamo da radimo sa Promise-om
      Promise.resolve(fn())
        .then((val) => {
          // Čuvamo na tačnom indeksu, a ne push-ovanjem na kraj!
          results[index] = val;
          completedCount++;
          
          // Kada su svi završeni, razrešavamo glavni Promise
          if (completedCount === functions.length) {
            resolve(results);
          }
        })
        .catch((err) => {
          // Prva greška odmah obara ceo Promise.all
          reject(err);
        });
    });
  });
}`,
      timeComplexity: 'O(N) — Gde je N broj asinhronih funkcija. Sve se pokreću paralelno u isto vreme.',
      spaceComplexity: 'O(N) — Niz za čuvanje rezultata.',
      explanation: 'Ključno pravilo: rezultati se moraju sačuvati na `results[index] = val`, jer asinhroni zadaci mogu završiti u bilo kom redosledu (npr. drugi pre prvog), ali izlaz mora pratiti redosled unosa.'
    },
    jsSpecificTips: [
      'NIKADA nemojte koristiti `results.push(val)` umesto `results[index] = val`! Ako brži Promise završi pre sporijeg, `push` bi poremetio redosled elemenata.',
      'Nemojte koristiti `results.length === functions.length` kao uslov završetka, jer ako se prvo popuni `results[5]`, niz `results` u JS-u dobija dužinu 6 (sa praznim rupama/empty slots) pre nego što su ostali Promise-i uopšte završeni! Zato je neophodan poseban brojač `completedCount`.'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'Dve paralelne funkcije',
        inputParams: [],
        inputStr: 'promiseAll([fn1, fn2])',
        expectedOutput: 'Niz rezultata [res1, res2]',
        expectedStr: 'Paralelno izvršavanje u tačnom redosledu'
      }
    ],
    runFunctionName: 'promiseAll'
  },
  {
    id: 'function-composition',
    number: 2629,
    title: 'Function Composition (Kompozicija Funkcija)',
    titleEn: 'Function Composition',
    difficulty: 'Easy',
    category: 'JavaScript & Async',
    tags: ['Funkcionalno Programiranje', 'reduceRight', 'Closures', 'Higher-Order Functions'],
    leetcodeUrl: 'https://leetcode.com/problems/function-composition/',
    description: 'Dat je niz funkcija `[f1, f2, f3, ..., fn]`. Vrati novu funkciju `fn` koja predstavlja kompoziciju tih funkcija.\n\nKompozicija funkcija `[f, g, h]` je definisana kao `fn(x) = f(g(h(x)))`. Kompozicija praznog niza funkcija je identitet funkcija `f(x) = x`.\n\nPrimetite da se funkcije izvršavaju s desna na levo!',
    pattern: 'Array.prototype.reduceRight (Funkcionalni Pipeline)',
    examples: [
      {
        input: 'functions = [x => x + 1, x => x * x, x => 2 * x], x = 4',
        output: '65',
        explanation: 'Računa se s desna na levo: 2 * 4 = 8, zatim 8 * 8 = 64, i na kraju 64 + 1 = 65.'
      },
      {
        input: 'functions = [x => 10 * x, x => 10 * x, x => 10 * x], x = 1',
        output: '1000',
        explanation: '10 * (10 * (10 * 1)) = 1000.'
      },
      {
        input: 'functions = [], x = 42',
        output: '42',
        explanation: 'Prazan niz funkcija vraća originalni ulaz x.'
      }
    ],
    constraints: [
      '-1000 <= x <= 1000',
      '0 <= functions.length <= 1000',
      'Sve funkcije primaju i vraćaju ceo broj'
    ],
    intuition: 'Kompozicija funkcija u matematici $(f \\circ g)(x) = f(g(x))$ znači da se najdesnija funkcija izvršava prva, a njen izlaz postaje ulaz za funkciju sa njene leve strane. U JavaScript-u, ugrađena metoda `Array.prototype.reduceRight()` je savršeno dizajnirana za ovaj obrazac.',
    optimalSolution: {
      title: 'Optimalno rešenje: reduceRight',
      code: `/**
 * @param {Function[]} functions
 * @return {Function}
 */
function compose(functions) {
  return function(x) {
    // reduceRight prolazi kroz niz s desna na levo
    return functions.reduceRight((acc, fn) => fn(acc), x);
  };
}`,
      timeComplexity: 'O(n) — Gde je n broj funkcija u nizu.',
      spaceComplexity: 'O(1) — Nema dodatne alokacije memorije.',
      explanation: '`reduceRight` prolazi kroz niz od poslednjeg indeksa ka nultom, primenjujući svaku funkciju na akumuliranu vrednost `acc`, počevši od početnog `x`.'
    },
    bruteForceSolution: {
      title: 'Klasična for petlja unazad',
      code: `function composeLoop(functions) {
  return function(x) {
    let result = x;
    for (let i = functions.length - 1; i >= 0; i--) {
      result = functions[i](result);
    }
    return result;
  };
}`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: 'Imperativna varijanta koja radi identičnu stvar i može biti blago brža u sirovom izvršavanju od reduce callback-a.'
    },
    jsSpecificTips: [
      '`reduceRight` je standardna ES5 metoda dostupna na svim nizovima. Ako je niz prazan i prosleđen je početni parametar `x`, `reduceRight` automatski vraća `x` bez ikakvih grešaka.',
      'U bibliotekama poput Lodash ili Redux, `compose` funkcija radi s desna na levo, dok `pipe` funkcija radi s leva na desno (koristi `reduce`).'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: '[x+1, x*x, 2*x], x=4',
        inputParams: [4],
        inputStr: 'functions = [x => x + 1, x => x * x, x => 2 * x], x = 4',
        expectedOutput: 65,
        expectedStr: '65'
      },
      {
        id: 'tc-2',
        name: 'Prazan niz funkcija',
        inputParams: [42],
        inputStr: 'functions = [], x = 42',
        expectedOutput: 42,
        expectedStr: '42'
      }
    ],
    runFunctionName: 'compose'
  },
  {
    id: 'lru-cache',
    number: 146,
    title: 'LRU Cache (Least Recently Used Keš Memorija)',
    titleEn: 'LRU Cache',
    difficulty: 'Medium',
    category: 'Arrays & Hash Maps',
    tags: ['Design', 'Hash Map', 'Map Redosled', 'O(1)'],
    leetcodeUrl: 'https://leetcode.com/problems/lru-cache/',
    description: 'Dizajniraj strukturu podataka koja prati ograničenja **Least Recently Used (LRU)** keša.\n\nImplementiraj `LRUCache` klasu:\n- `LRUCache(capacity)`: Inicijalizuje LRU keš sa pozitivnim kapacitetom `capacity`.\n- `get(key)`: Vraća vrednost ključa `key` ako postoji, u suprotnom vraća `-1`.\n- `put(key, value)`: Ažurira vrednost ključa ako postoji, ili ubacuje par `key-value`. Ako broj ključeva premaši `capacity`, izbaci **najmanje skoro korišćeni** ključ.\n\nObe metode `get` i `put` moraju raditi u prosečnoj vremenskoj složenosti **O(1)**.',
    pattern: 'JavaScript Map (Insertion Order) ili Hash Map + Doubly Linked List',
    examples: [
      {
        input: 'LRUCache(2); put(1, 1); put(2, 2); get(1); put(3, 3); // izbacuje ključ 2; get(2); // vrati -1',
        output: '[null, null, null, 1, null, -1]',
        explanation: 'Ključ 2 je bio najmanje skoro korišćen pa je izbačen kada je dodat ključ 3.'
      }
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'Najviše 2 * 10^5 poziva ka get i put'
    ],
    intuition: 'U drugim jezicima (C++, Java) LRU se implementira pomoću Doubly Linked List i Hash Mape. U JavaScript-u, `Map` objekat po ECMAScript specifikaciji **garantovano čuva redosled umetanja (insertion order)**! Ako obrišemo ključ i ponovo ga postavimo (`map.delete(key); map.set(key, value);`), taj ključ se pomera na sam KRAJ mape (najskorije korišćen). Prvi element u mapi (`map.keys().next().value`) je automatski najmanje skoro korišćen.',
    optimalSolution: {
      title: 'Optimalno rešenje u JavaScript-u: Map Insertion Order',
      code: `/**
 * @param {number} capacity
 */
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  /** 
   * @param {number} key
   * @return {number}
   */
  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }
    
    // Osvežavamo poziciju ključa: brišemo ga i ponovo upisujemo na kraj
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }

  /** 
   * @param {number} key 
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    // Ako ključ već postoji, uklanjamo staru poziciju
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // Upisujemo novu vrednost na kraj (najnovije korišćen)
    this.cache.set(key, value);
    
    // Ako smo premašili kapacitet, izbacujemo prvi element (najstariji)
    if (this.cache.size > this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }
}`,
      timeComplexity: 'O(1) za get i O(1) za put — Map operacije has, get, set i delete rade u O(1).',
      spaceComplexity: 'O(capacity) — Keš nikada ne premašuje definisani kapacitet.',
      explanation: 'Ovo je jedno od najlepših specifičnih JS rešenja na intervjuima jer koristi zvaničnu garanciju ECMA-262 specifikacije o redosledu `Map` iteratora.'
    },
    jsSpecificTips: [
      '`this.cache.keys().next().value` vraća prvi ključ iz iteratora bez kreiranja niza i bez O(n) overhead-a.',
      'Običan JS objekat `{}` NE garantuje striktan redosled umetanja za numeričke ključeve (V8 prvo sortira celobrojne indekse!), zbog čega je `new Map()` apsolutno obavezan za LRU keš u JS-u.'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'Kapacitet 2 sa evikcijom',
        inputParams: [2],
        inputStr: 'LRUCache cap=2: put(1,1), put(2,2), get(1), put(3,3)',
        expectedOutput: 'Validan rad keša',
        expectedStr: 'get(2) vraća -1 jer je ključ 2 izbačen'
      }
    ],
    runFunctionName: 'LRUCache'
  },
  {
    id: 'reverse-linked-list',
    number: 206,
    title: 'Reverse Linked List (Obrtanje Jednostruko Povezane Liste)',
    titleEn: 'Reverse Linked List',
    difficulty: 'Easy',
    category: 'Linked Lists',
    tags: ['Povezane Liste', 'Pokazivači', 'In-Place', 'O(1) Prostor'],
    leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
    description: 'Data je glava jednostruko povezane liste `head`. Obrni redosled čvorova u listi i vrati novu glavu obrnute liste.',
    pattern: 'Three Pointers (prev, curr, next)',
    examples: [
      {
        input: 'head = [1, 2, 3, 4, 5]',
        output: '[5, 4, 3, 2, 1]',
        explanation: 'Svaki čvor sada pokazuje na svog prethodnika.'
      },
      {
        input: 'head = [1, 2]',
        output: '[2, 1]',
        explanation: '2 pokazuje na 1, a 1 pokazuje na null.'
      },
      {
        input: 'head = []',
        output: '[]',
        explanation: 'Prazna lista ostaje prazna.'
      }
    ],
    constraints: [
      'Broj čvorova u listi je u opsegu [0, 5000]',
      '-5000 <= Node.val <= 5000'
    ],
    intuition: 'Održavamo tri reference: `prev` (inicijalno null), `curr` (trenutni čvor) i privremeni `next`. U svakom koraku pamtimo `next = curr.next`, preusmeravamo pokazivač `curr.next = prev`, a zatim pomeramo `prev = curr` i `curr = next`. Kada `curr` postane null, `prev` je nova glava obrnute liste.',
    optimalSolution: {
      title: 'Optimalno rešenje: Iterativno sa tri pokazivača',
      code: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
  let prev = null;
  let curr = head;
  
  while (curr !== null) {
    const nextTemp = curr.next; // 1. Pamtimo sledeći čvor pre raskidanja veze
    curr.next = prev;           // 2. Obrćemo pokazivač unazad
    prev = curr;                // 3. Pomeramo prev napred
    curr = nextTemp;            // 4. Pomeramo curr napred
  }
  
  return prev; // prev je novi početak (glava) obrnute liste
}`,
      timeComplexity: 'O(n) — Jedan prolaz kroz listu gde je n broj čvorova.',
      spaceComplexity: 'O(1) — Menjaju se samo pokazivači u postojećim objektima (in-place).',
      explanation: 'Iterativni pristup je bezbedniji u JS-u od rekurzivnog jer za dugačke liste (n > 10,000) rekurzija može izazvati Stack Overflow.'
    },
    jsSpecificTips: [
      'U JS-u su čvorovi povezane liste obični objekti `{ val: x, next: {...} }`. Pošto se objekti prosleđuju po referenci, modifikacija `curr.next` menja originalnu strukturu u memoriji bez pravljenja kopija.',
      'Uvek sačuvajte `curr.next` u privremenu promenljivu PRE nego što ga prepišete sa `prev`, jer biste u suprotnom izgubili referencu na ostatak liste!'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: '[1,2,3,4,5]',
        inputParams: [[1, 2, 3, 4, 5]],
        inputStr: 'head = [1, 2, 3, 4, 5]',
        expectedOutput: [5, 4, 3, 2, 1],
        expectedStr: '[5, 4, 3, 2, 1]'
      },
      {
        id: 'tc-2',
        name: 'Prazna lista',
        inputParams: [[]],
        inputStr: 'head = []',
        expectedOutput: [],
        expectedStr: '[]'
      }
    ],
    runFunctionName: 'reverseList'
  },
  {
    id: 'merge-two-sorted-lists',
    number: 21,
    title: 'Merge Two Sorted Lists (Spajanje Dve Sortirane Povezane Liste)',
    titleEn: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    category: 'Linked Lists',
    tags: ['Povezane Liste', 'Dummy Node', 'Dva Pokazivača'],
    leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    description: 'Date su glave dve sortirane povezane liste `list1` i `list2`. Spoj ove dve liste u jednu sortiranu listu spajanjem postojećih čvorova. Vrati glavu rezultujuće spojene liste.',
    pattern: 'Dummy Head Node Tehnika',
    examples: [
      {
        input: 'list1 = [1,2,4], list2 = [1,3,4]',
        output: '[1,1,2,3,4,4]',
        explanation: 'Spojena lista sadrži sve elemente u neopadajućem poretku.'
      },
      {
        input: 'list1 = [], list2 = []',
        output: '[]',
        explanation: 'Spajanje dve prazne liste daje praznu listu.'
      },
      {
        input: 'list1 = [], list2 = [0]',
        output: '[0]',
        explanation: 'Spajanje prazne i neprazne liste vraća nepraznu listu.'
      }
    ],
    constraints: [
      'Broj čvorova u obe liste je u opsegu [0, 50]',
      '-100 <= Node.val <= 100',
      'Obe liste su sortirane u neopadajućem redosledu'
    ],
    intuition: 'Kreiramo lažni početni čvor (`dummy = { val: 0, next: null }`) i pokazivač `tail = dummy`. Upoređujemo `list1.val` i `list2.val`. Manji čvor vezujemo za `tail.next` i pomeramo odgovarajući pokazivač. Kada jedna lista ostane prazna, preostali deo druge liste jednostavno prikačimo na kraj.',
    optimalSolution: {
      title: 'Optimalno rešenje: Dummy Node Iterativno',
      code: `/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
function mergeTwoLists(list1, list2) {
  // Dummy node eliminiše potrebu za posebnim if uslovima za glavu liste
  const dummy = { val: -1, next: null };
  let tail = dummy;
  
  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }
  
  // Prikačimo preostali neprazni rep direktno u O(1)
  tail.next = list1 !== null ? list1 : list2;
  
  return dummy.next;
}`,
      timeComplexity: 'O(n + m) — Gde su n i m dužine lista.',
      spaceComplexity: 'O(1) — Koristi se samo dummy čvor i pokazivač tail.',
      explanation: 'Dummy Node pattern je standardni industrijski obrazac za algoritme sa povezanim listama jer potpuno eliminiše dosadne `if (head === null)` grane.'
    },
    jsSpecificTips: [
      'Povezivanje preostalog dela liste `tail.next = list1 !== null ? list1 : list2` je O(1) jer samo povezujemo referencu na postojeći lanac čvorova bez potrebe za petljom.',
      'U JS objektima `{ val: 0, next: null }` predstavlja laganu reprezentaciju ListNode-a bez potrebe za ES6 `class` definicijom.'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: '[1,2,4] i [1,3,4]',
        inputParams: [[1,2,4], [1,3,4]],
        inputStr: 'list1 = [1,2,4], list2 = [1,3,4]',
        expectedOutput: [1,1,2,3,4,4],
        expectedStr: '[1,1,2,3,4,4]'
      },
      {
        id: 'tc-2',
        name: 'Jedna prazna lista',
        inputParams: [[], [0]],
        inputStr: 'list1 = [], list2 = [0]',
        expectedOutput: [0],
        expectedStr: '[0]'
      }
    ],
    runFunctionName: 'mergeTwoLists'
  },
  {
    id: 'invert-binary-tree',
    number: 226,
    title: 'Invert Binary Tree (Invertovanje Binarnog Stabla)',
    titleEn: 'Invert Binary Tree',
    difficulty: 'Easy',
    category: 'Trees',
    tags: ['Binarna Stabla', 'DFS', 'BFS', 'Rekurzija'],
    leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/',
    description: 'Data je glava (root) binarnog stabla. Invertuj stablo (napravi njegov odraz u ogledalu) i vrati njegov koren.',
    pattern: 'Rekurzivni DFS ili Iterativni BFS (Queue)',
    examples: [
      {
        input: 'root = [4,2,7,1,3,6,9]',
        output: '[4,7,2,9,6,3,1]',
        explanation: 'Za svaki čvor zamenjujemo njegovo levo i desno podstablo.'
      },
      {
        input: 'root = [2,1,3]',
        output: '[2,3,1]',
        explanation: 'Levo dete 1 i desno dete 3 su zamenili mesta.'
      },
      {
        input: 'root = []',
        output: '[]',
        explanation: 'Prazno stablo vraća null.'
      }
    ],
    constraints: [
      'Broj čvorova u stablu je u opsegu [0, 100]',
      '-100 <= Node.val <= 100'
    ],
    intuition: 'Za svaki čvor u stablu potrebno je zameniti njegovo levo i desno dete, a zatim rekurzivno ponoviti isti postupak za levo i desno podstablo. Bazni slučaj je kada je čvor `null`.',
    optimalSolution: {
      title: 'Optimalno rešenje: DFS Rekurzija',
      code: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
function invertTree(root) {
  if (root === null) {
    return null;
  }
  
  // 1. Zamenjujemo levo i desno dete koristeći JS destrukturiranje
  const temp = root.left;
  root.left = root.right;
  root.right = temp;
  
  // 2. Rekurzivno invertujemo levo i desno podstablo
  invertTree(root.left);
  invertTree(root.right);
  
  return root;
}`,
      timeComplexity: 'O(n) — Poseti se svaki čvor u stablu tačno jednom.',
      spaceComplexity: 'O(h) — Gde je h visina stabla (memorija na Call Stack-u). U najgorem slučaju O(n), za balanso stablo O(log n).',
      explanation: 'Ovo je čuveni zadatak koji je Max Howell (tvorac Homebrew alata) popularizovao kada ga je Google odbio na intervjuu.'
    },
    jsSpecificTips: [
      'Može se napisati i u jednoj liniji u modernom JS-u: `[root.left, root.right] = [invertTree(root.right), invertTree(root.left)]; return root;` zahvaljujući array destructuring swap sintaksi!',
      'Za izrazito duboka stabla (h > 10,000) iterativna varijanta sa redom (Queue / BFS) sprečava Call Stack limit browser-a.'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: '[4,2,7,1,3,6,9]',
        inputParams: [[4,2,7,1,3,6,9]],
        inputStr: 'root = [4,2,7,1,3,6,9]',
        expectedOutput: [4,7,2,9,6,3,1],
        expectedStr: '[4,7,2,9,6,3,1]'
      },
      {
        id: 'tc-2',
        name: '[2,1,3]',
        inputParams: [[2,1,3]],
        inputStr: 'root = [2,1,3]',
        expectedOutput: [2,3,1],
        expectedStr: '[2,3,1]'
      }
    ],
    runFunctionName: 'invertTree'
  },
  {
    id: 'product-of-array-except-self',
    number: 238,
    title: 'Product of Array Except Self (Proizvod Niza Bez Samog Sebe)',
    titleEn: 'Product of Array Except Self',
    difficulty: 'Medium',
    category: 'Arrays & Hash Maps',
    tags: ['Prefiks Proizvodi', 'Sufiks Proizvodi', 'Nizovi', 'O(1) Dodatni Prostor'],
    leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/',
    description: 'Dat je celobrojni niz `nums`. Vrati niz `answer` takav da je `answer[i]` jednak proizvodu svih elemenata `nums` osim `nums[i]`.\n\nAlgoritam MORA raditi u **O(n)** vremenskoj složenosti i **BEZ korišćenja operacije deljenja (/)**!',
    pattern: 'Prefix and Suffix Products (Proizvodi sa leve i desne strane)',
    examples: [
      {
        input: 'nums = [1,2,3,4]',
        output: '[24,12,8,6]',
        explanation: 'Za indeks 0: 2*3*4 = 24; za indeks 1: 1*3*4 = 12; za indeks 2: 1*2*4 = 8; za indeks 3: 1*2*3 = 6.'
      },
      {
        input: 'nums = [-1,1,0,-3,3]',
        output: '[0,0,9,0,0]',
        explanation: 'Elementi oko nule dobijaju 0 osim samog indeksa gde je nula.'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^5',
      '-30 <= nums[i] <= 30',
      'Garantuje se da proizvod staje u 32-bitni ceo broj'
    ],
    intuition: 'Za svaki element `i`, proizvod svih ostalih brojeva jednak je: `(proizvod svih elemenata levo od i) * (proizvod svih elemenata desno od i)`. Prvo u nizu `result` izračunamo prefiks proizvode s leva na desno. Zatim u drugom prolazu s desna na levo množimo akumuliranim sufiks proizvodom.',
    optimalSolution: {
      title: 'Optimalno rešenje: Dva prolaza sa O(1) dodatne memorije',
      code: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n);
  
  // 1. Prolaz s leva na desno: result[i] sadrži proizvod svih elemenata LEVO od i
  result[0] = 1;
  for (let i = 1; i < n; i++) {
    result[i] = result[i - 1] * nums[i - 1];
  }
  
  // 2. Prolaz s desna na levo: množimo akumuliranim proizvodom sa DESNE strane
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] = result[i] * rightProduct;
    rightProduct *= nums[i];
  }
  
  return result;
}`,
      timeComplexity: 'O(n) — Dva linearna prolaza kroz niz dužine n.',
      spaceComplexity: 'O(1) — Rezultujući niz se ne računa kao dodatna memorija po zahtevu zadatka.',
      explanation: 'Izbegavanjem deljenja (/), algoritam bez problema rukuje nulama u nizu bez deljenja sa nulom (`DivisionByZeroError`).'
    },
    jsSpecificTips: [
      '`new Array(n)` unapred alocira niz tačne dužine, što sprečava česte realokacije memorije u JS V8 engine-u u poređenju sa postepenim `.push()`-ovanjem.',
      'U JS-u `0 * -1` daje `-0`. Pošto `-0 === 0` u standardnoj jednakosti, JS test case runneri ovo tretiraju ispravno.'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: '[1,2,3,4]',
        inputParams: [[1, 2, 3, 4]],
        inputStr: 'nums = [1, 2, 3, 4]',
        expectedOutput: [24, 12, 8, 6],
        expectedStr: '[24, 12, 8, 6]'
      },
      {
        id: 'tc-2',
        name: 'Sadrži nulu',
        inputParams: [[-1, 1, 0, -3, 3]],
        inputStr: 'nums = [-1, 1, 0, -3, 3]',
        expectedOutput: [0, 0, 9, 0, 0],
        expectedStr: '[0, 0, 9, 0, 0]'
      }
    ],
    runFunctionName: 'productExceptSelf'
  },
  {
    id: 'house-robber',
    number: 198,
    title: 'House Robber (Pljačkaš Kuća)',
    titleEn: 'House Robber',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['Dinamičko Programiranje', 'O(1) Prostor', 'O(n) Vreme'],
    leetcodeUrl: 'https://leetcode.com/problems/house-robber/',
    description: 'Ti si profesionalni pljačkaš koji planira da opljačka kuće duž ulice. Svaka kuća ima određenu količinu novca u sebi. Jedino ograničenje je što susedne kuće imaju povezane sigurnosne sisteme i **automatski će alarmirati policiju ako su dve susedne kuće opljačkane iste noći**.\n\nDat je celobrojni niz `nums` koji predstavlja količinu novca u svakoj kući. Vrati maksimalnu količinu novca koju možeš opljačkati večeras bez alarmiranja policije.',
    pattern: 'Dinamičko Programiranje (Odlučivanje: opljačkati ili preskočiti)',
    examples: [
      {
        input: 'nums = [1,2,3,1]',
        output: '4',
        explanation: 'Pljačkamo kuću 1 (novac = 1) i kuću 3 (novac = 3). Ukupan profit = 1 + 3 = 4.'
      },
      {
        input: 'nums = [2,7,9,3,1]',
        output: '12',
        explanation: 'Pljačkamo kuću 1 (2), kuću 3 (9) i kuću 5 (1). Ukupno = 2 + 9 + 1 = 12.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 100',
      '0 <= nums[i] <= 400'
    ],
    intuition: 'Za svaku kuću imamo dva izbora:\n1. Opljačkamo trenutnu kuću (`nums[i] + profit od kuće i-2`)\n2. Preskočimo trenutnu kuću (`profit od kuće i-1`).\nDakle: `dp[i] = max(dp[i-1], nums[i] + dp[i-2])`. Pošto nam trebaju samo dve prethodne vrednosti, optimizujemo prostor na O(1).',
    optimalSolution: {
      title: 'Optimalno rešenje: DP sa O(1) memorijom',
      code: `/**
 * @param {number[]} nums
 * @return {number}
 */
function rob(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  
  let robPrev2 = 0; // Maksimalan plen do kuće i-2
  let robPrev1 = 0; // Maksimalan plen do kuće i-1
  
  for (let i = 0; i < nums.length; i++) {
    // Novi maksimum je veći od (preskakanja trenutne) ili (pljačkanja trenutne + i-2)
    const currentMax = Math.max(robPrev1, nums[i] + robPrev2);
    robPrev2 = robPrev1;
    robPrev1 = currentMax;
  }
  
  return robPrev1;
}`,
      timeComplexity: 'O(n) — Jedan prolaz kroz niz kuća.',
      spaceComplexity: 'O(1) — Konstantan broj promenljivih.',
      explanation: 'Prelazak stanja `dp[i] = max(dp[i-1], dp[i-2] + nums[i])` se svodi na dve jednostavne promenljive, identično optimizaciji Fibonačijevog niza.'
    },
    jsSpecificTips: [
      '`Math.max(a, b)` u JS-u radi u O(1) i izuzetno je efikasan za poređenje dva broja.',
      'Ovaj isti obrazac se primenjuje na srodne zadatke: House Robber II (#213 - gde su kuće u krugu) i Delete and Earn (#740).'
    ],
    testCases: [
      {
        id: 'tc-1',
        name: '[1,2,3,1]',
        inputParams: [[1, 2, 3, 1]],
        inputStr: 'nums = [1, 2, 3, 1]',
        expectedOutput: 4,
        expectedStr: '4'
      },
      {
        id: 'tc-2',
        name: '[2,7,9,3,1]',
        inputParams: [[2, 7, 9, 3, 1]],
        inputStr: 'nums = [2, 7, 9, 3, 1]',
        expectedOutput: 12,
        expectedStr: '12'
      }
    ],
    runFunctionName: 'rob'
  }
];
