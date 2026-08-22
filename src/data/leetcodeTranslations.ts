// Complete English Translations Dictionary for all 21 LeetCode problems
export interface ProblemTranslation {
  descriptionEn: string;
  patternEn: string;
  intuitionEn: string;
  optimalExplanationEn: string;
  bruteForceExplanationEn?: string;
  jsSpecificTipsEn: string[];
  examplesEn?: Array<{ explanationEn?: string }>;
}

export const leetcodeTranslations: Record<string, ProblemTranslation> = {
  'two-sum': {
    descriptionEn: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    patternEn: 'Hash Map Lookup (Single Pass)',
    intuitionEn: 'Instead of using a nested loop comparing every pair with O(n²) time complexity, use a Hash Map (JavaScript `Map` or plain object `{}`). As you iterate through the array, compute the complement for each number: `complement = target - num`. If the complement is already in the map, immediately return its stored index along with the current index.',
    optimalExplanationEn: 'In each step, we check if the complement has already been seen. JavaScript `Map` provides consistent average O(1) operations for `.has()` and `.get()` without the prototype chain interference of plain objects.',
    bruteForceExplanationEn: 'For larger arrays (n = 10^4), nested loops require 10^8 operations, leading to Time Limit Exceeded (TLE).',
    jsSpecificTipsEn: [
      'Prefer `new Map()` over a plain object `{}` when keys are numbers, because objects coerce numeric keys into strings, adding extra allocation overhead.',
      'Methods `map.has()` and `map.get()` are safer than `complement in obj` or `obj[complement] !== undefined` because they avoid checking inherited properties on `Object.prototype` (such as `toString`).'
    ],
    examplesEn: [
      { explanationEn: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].' },
      { explanationEn: 'nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2].' },
      { explanationEn: 'nums[0] + nums[1] == 3 + 3 == 6, we return [0, 1].' }
    ]
  },
  'valid-parentheses': {
    descriptionEn: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    patternEn: 'Stack (LIFO)',
    intuitionEn: 'Use a Stack data structure (implemented via a JS array). When encountering an opening bracket, push its expected matching closing bracket onto the stack. When encountering a closing bracket, pop from the stack and verify that it matches. If the stack is empty at the end, all brackets were matched correctly.',
    optimalExplanationEn: 'Iterate through each character once. If it is an opening bracket, push its closing counterpart onto the stack. If it is a closing bracket, pop the top element and compare. If it does not match or the stack was empty, the string is invalid. Finally, return `stack.length === 0`.',
    bruteForceExplanationEn: 'Repeatedly replacing substrings like `()`, `{}`, `[]` with empty strings requires scanning and allocating new strings repeatedly, resulting in O(n²) time complexity.',
    jsSpecificTipsEn: [
      'In JavaScript, standard arrays are used as stacks via `.push()` and `.pop()`, both of which are amortized O(1) operations in modern engines (V8).',
      'Using an early exit check `if (s.length % 2 !== 0) return false;` immediately rejects odd-length strings in O(1) time.'
    ],
    examplesEn: [
      { explanationEn: 'The brackets match in correct order.' },
      { explanationEn: 'All pairs open and close in proper sequence.' },
      { explanationEn: 'Opening round bracket is closed by square bracket, which is invalid.' }
    ]
  },
  'best-time-to-buy-and-sell-stock': {
    descriptionEn: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
    patternEn: 'Greedy / Single Pass Tracker',
    intuitionEn: 'Track the minimum buy price observed so far as you iterate through the days. On each day, compute the profit if sold today (`price - minPrice`) and update `maxProfit` if this profit is greater than our record.',
    optimalExplanationEn: 'Maintain two variables: `minPrice` (initialized to `Infinity`) and `maxProfit` (initialized to `0`). As we scan the prices array in a single pass, update `minPrice = Math.min(minPrice, price)` and `maxProfit = Math.max(maxProfit, price - minPrice)`.',
    bruteForceExplanationEn: 'Comparing every pair of buy and sell days takes O(n²) time and will time out on inputs with up to 10^5 days.',
    jsSpecificTipsEn: [
      'Use `Math.min()` and `Math.max()` for clean and idiomatic updates.',
      'Initialize `minPrice` to `Infinity` so the first price is guaranteed to set the baseline.'
    ],
    examplesEn: [
      { explanationEn: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' },
      { explanationEn: 'In this case, no transactions are done and max profit = 0.' }
    ]
  },
  'valid-anagram': {
    descriptionEn: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    patternEn: 'Frequency Counter / Hash Map',
    intuitionEn: 'If two strings are anagrams, they must have identical character frequencies. Count character frequencies for string `s` and decrement them for string `t`. If all frequencies resolve to zero, they are valid anagrams.',
    optimalExplanationEn: 'First check if lengths differ (`s.length !== t.length`); if so, return false immediately. Use an integer array of size 26 or a Map to count character frequencies. Increment for `s` and decrement for `t`. If any count drops below zero, return false.',
    bruteForceExplanationEn: 'Sorting both strings (`s.split("").sort().join("")`) takes O(n log n) time and creates extra intermediate array and string allocations.',
    jsSpecificTipsEn: [
      'Use `str.charCodeAt(i) - 97` for lowercase English letters to index directly into a fixed-size 26-element TypedArray (`new Int32Array(26)`), which is ultra-fast in V8.',
      'Avoid splitting strings into arrays with `.split(\'\')` when a single frequency array achieves O(n) without multi-megabyte garbage collection.'
    ],
    examplesEn: [
      { explanationEn: 'Both strings contain the exact same characters with identical counts.' },
      { explanationEn: 'Character counts do not match.' }
    ]
  },
  'group-anagrams': {
    descriptionEn: 'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.',
    patternEn: 'Categorization by Canonical Key (Hash Map)',
    intuitionEn: 'Every group of anagrams shares a common canonical key when sorted alphabetically (or when represented as a 26-character frequency count signature). Use this canonical key as the hash map lookup key.',
    optimalExplanationEn: 'Create a `Map` where each key is the sorted version of the word (e.g. `"eat"` -> `"aet"`). For each string in `strs`, compute its key and push the original word into the corresponding map array. Return `Array.from(map.values())`.',
    jsSpecificTipsEn: [
      'Use `Array.from(map.values())` or `[...map.values()]` to extract the grouped arrays from the Map.',
      'For short strings (length <= 100), `str.split(\'\').sort().join(\'\')` is extremely fast and readable in modern JS engines.'
    ],
    examplesEn: [
      { explanationEn: 'Anagrams are grouped based on sharing the same sorted letter signature.' },
      { explanationEn: 'Single empty string forms a single group.' },
      { explanationEn: 'Single character string forms a single group.' }
    ]
  },
  'longest-substring-without-repeating-characters': {
    descriptionEn: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    patternEn: 'Sliding Window + Hash Map',
    intuitionEn: 'Maintain a dynamic sliding window `[left, right]`. As the `right` pointer expands the window, record the latest index of each character in a Map. If a duplicate character is found within the current window, jump the `left` pointer to `map.get(char) + 1`.',
    optimalExplanationEn: 'Use a `Map` to store the last seen position of each character. When a duplicate is encountered at `right`, update `left = Math.max(left, map.get(char) + 1)`. Update max length at every step: `maxLen = Math.max(maxLen, right - left + 1)`.',
    jsSpecificTipsEn: [
      'Remember to use `Math.max(left, map.get(char) + 1)` because the duplicate character might have appeared before the current `left` boundary and should not move `left` backwards.',
      'Using `Map` is preferred over plain objects to avoid integer string coercion quirks.'
    ],
    examplesEn: [
      { explanationEn: 'The answer is "abc", with the length of 3.' },
      { explanationEn: 'The answer is "b", with the length of 1.' },
      { explanationEn: 'The answer is "wke", with the length of 3.' }
    ]
  },
  'container-with-most-water': {
    descriptionEn: 'You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    patternEn: 'Two Pointers (Inward Shrink)',
    intuitionEn: 'Start with two pointers at the extreme ends (`left = 0`, `right = height.length - 1`) to maximize the container width. Calculate the area `(right - left) * Math.min(height[left], height[right])`. Move the pointer pointing to the shorter line inward, because keeping the shorter line can never yield a larger area with a smaller width.',
    optimalExplanationEn: 'Initialize `maxArea = 0`. While `left < right`, compute area and update `maxArea`. Shift the pointer pointing to the smaller height inward. This guarantees inspecting all viable candidate pairs in O(n) time.',
    jsSpecificTipsEn: [
      'Math.min and Math.max allow compact single-line area calculations in JS.',
      'Moving the shorter pointer is a mathematically proven greedy choice.'
    ],
    examplesEn: [
      { explanationEn: 'The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, max area of water the container can contain is 49.' },
      { explanationEn: 'Width is 1, min height is 1, area is 1.' }
    ]
  },
  'three-sum': {
    descriptionEn: 'Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.',
    patternEn: 'Sorting + Two Pointers',
    intuitionEn: 'Sort the array first. Fix one element `nums[i]` and then use two pointers (`left = i + 1`, `right = n - 1`) to find pairs where `nums[left] + nums[right] === -nums[i]`. Skip duplicate elements at every pointer step to prevent duplicate triplets in the output.',
    optimalExplanationEn: 'Sort the array with `nums.sort((a, b) => a - b)`. Loop with index `i`. If `nums[i] > 0`, break early (sum of 3 positive numbers can never be 0). When a valid triplet is found, push it to results, then advance `left` and decrement `right` while skipping duplicate values.',
    jsSpecificTipsEn: [
      'Always sort numeric arrays with `nums.sort((a, b) => a - b)`. Calling `.sort()` without a comparator sorts lexicographically by string representation!',
      'Skipping duplicates directly via while loops avoids needing expensive JSON string set serialization.'
    ],
    examplesEn: [
      { explanationEn: 'The distinct triplets that sum to 0 are [-1, -1, 2] and [-1, 0, 1].' },
      { explanationEn: 'The only possible triplet does not sum up to 0.' },
      { explanationEn: 'The only possible triplet sums up to 0.' }
    ]
  },
  'maximum-subarray': {
    descriptionEn: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
    patternEn: 'Kadane\'s Algorithm (Dynamic Programming)',
    intuitionEn: 'Iterate through the array while maintaining the current running subarray sum. At each element, decide whether to append the current element to the existing subarray or start a brand new subarray at the current element: `currentSum = Math.max(num, currentSum + num)`.',
    optimalExplanationEn: 'Kadane\'s algorithm operates in O(n) time and O(1) space. Initialize `maxSum = nums[0]` and `currentSum = nums[0]`. Scan from index 1 to the end, updating `currentSum` and recording `maxSum = Math.max(maxSum, currentSum)`.',
    jsSpecificTipsEn: [
      'Initialize `maxSum` with `nums[0]` rather than `0`, because if all numbers are negative, the maximum sum will be the largest negative number (e.g. `[-1]` -> `-1`).'
    ],
    examplesEn: [
      { explanationEn: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { explanationEn: 'The subarray [1] has the largest sum 1.' },
      { explanationEn: 'The subarray [5,4,-1,7,8] has the largest sum 23.' }
    ]
  },
  'climbing-stairs': {
    descriptionEn: 'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    patternEn: 'Dynamic Programming (Fibonacci Sequence)',
    intuitionEn: 'To reach step `n`, you must arrive either from step `n-1` (by taking 1 step) or from step `n-2` (by taking 2 steps). Thus, `ways(n) = ways(n-1) + ways(n-2)`. This matches the Fibonacci sequence.',
    optimalExplanationEn: 'Use bottom-up DP with two variables `prev1 = 1` and `prev2 = 2` to track previous values in O(n) time and O(1) auxiliary space, avoiding O(2^n) exponential recursion.',
    jsSpecificTipsEn: [
      'Avoid naive recursion without memoization in JavaScript as the Call Stack will exceed limits for large `n` (`Maximum call stack size exceeded`).',
      'For large values beyond standard limits, JS numbers can safely handle up to `n = 78` before exceeding `Number.MAX_SAFE_INTEGER`.'
    ],
    examplesEn: [
      { explanationEn: 'There are two ways to climb: (1 step + 1 step) or (2 steps).' },
      { explanationEn: 'There are three ways: (1+1+1), (1+2), or (2+1).' }
    ]
  },
  'binary-search': {
    descriptionEn: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
    patternEn: 'Binary Search (Divide & Conquer)',
    intuitionEn: 'Take advantage of the sorted order by comparing `target` with the middle element `mid`. If `nums[mid] === target`, return `mid`. If `nums[mid] < target`, discard the left half by moving `left = mid + 1`. Otherwise, discard the right half by moving `right = mid - 1`.',
    optimalExplanationEn: 'Maintain two boundary pointers `left = 0` and `right = nums.length - 1`. While `left <= right`, compute `mid = Math.floor((left + right) / 2)`. Each comparison halves the remaining search range, yielding O(log n) time.',
    jsSpecificTipsEn: [
      'In JavaScript, numbers are 64-bit floats, so integer division requires explicit rounding: `Math.floor((left + right) / 2)` or bitwise shift `(left + right) >> 1`.',
      'Ensure the loop condition is `while (left <= right)` so single-element ranges are checked.'
    ],
    examplesEn: [
      { explanationEn: '9 exists in nums and its index is 4.' },
      { explanationEn: '2 does not exist in nums so return -1.' }
    ]
  },
  'merge-intervals': {
    descriptionEn: 'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    patternEn: 'Sorting + Interval Sweeping',
    intuitionEn: 'Sort intervals by their starting times. Then, iterate through the sorted list: if the current interval starts before or when the previous interval ends (`curr[0] <= prev[1]`), merge them by extending the end time (`prev[1] = Math.max(prev[1], curr[1])`). Otherwise, push the interval as a new entry.',
    optimalExplanationEn: 'Sort intervals by `a[0] - b[0]`. Initialize `merged = [intervals[0]]`. Iterate through remaining intervals: compare with `merged[merged.length - 1]`. If overlapping, merge in place; if disjoint, push to `merged`.',
    jsSpecificTipsEn: [
      'Sort with `intervals.sort((a, b) => a[0] - b[0])`.',
      'Mutating `lastMerged[1] = Math.max(lastMerged[1], curr[1])` directly modifies the object in the output array in O(1) time without extra allocations.'
    ],
    examplesEn: [
      { explanationEn: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' },
      { explanationEn: 'Intervals [1,4] and [4,5] are considered overlapping.' }
    ]
  },
  'debounce-js': {
    descriptionEn: 'Given a function `fn` and a time in milliseconds `t`, return a debounced version of that function.\n\nA debounced function is a function whose execution is delayed by `t` milliseconds and whose execution is cancelled if it is called again within that window of time. The debounced function should also receive the passed parameters.',
    patternEn: 'Closure + Timer Management',
    intuitionEn: 'Store a timer ID (`timerId`) inside the parent closure. Every time the returned debounced function is called, immediately clear the active timer with `clearTimeout(timerId)` and start a fresh timer with `setTimeout`.',
    optimalExplanationEn: 'The debounced function creates a closure retaining `timerId`. On invocation, it cancels any pending execution and resets the countdown. When the delay elapses without further calls, the original function executes with the latest arguments and context.',
    jsSpecificTipsEn: [
      'Preserve arguments and execution context using rest parameters `(...args)` and call `fn.apply(this, args)` or `fn(...args)`.',
      'Debouncing is standard practice in browser UI for search autocomplete inputs, window resize handlers, and infinite scroll triggers.'
    ],
    examplesEn: [
      { explanationEn: 'Calls within the timeout cancel previous pending executions and trigger only after 50ms of inactivity.' }
    ]
  },
  'promise-all-parallel': {
    descriptionEn: 'Given an array of asynchronous functions `functions`, return a new promise `promise`. Each function in the array accepts no arguments and returns a promise. All the promises should be executed in parallel.\n\n`promise` resolves when all promises have resolved, returning an array of resolved values in the same order as the input. If any promise rejects, `promise` rejects immediately with that error.',
    patternEn: 'Asynchronous Coordination / Custom Promise.all',
    intuitionEn: 'Track completed promises with a counter `resolvedCount`. Execute all functions in parallel immediately. When each promise resolves, store its result at the corresponding index (to preserve input order) and increment `resolvedCount`. When `resolvedCount === functions.length`, resolve the outer promise.',
    optimalExplanationEn: 'Return `new Promise((resolve, reject) => { ... })`. Handle empty arrays immediately by resolving `[]`. Execute all functions, attaching `.then(val => { results[i] = val; if (++completed === total) resolve(results); }).catch(reject)`.',
    jsSpecificTipsEn: [
      'Store results at index `results[i] = val` rather than using `results.push(val)` to ensure output ordering matches the input array regardless of completion time.',
      'Calling `reject(err)` on the first failure automatically rejects the outer promise once because Promise state is immutable after settlement.'
    ],
    examplesEn: [
      { explanationEn: 'All 3 async functions execute in parallel and resolve into an ordered array.' }
    ]
  },
  'function-composition': {
    descriptionEn: 'Given an array of functions `[f_1, f_2, f_3, ..., f_n]`, return a new function `fn` that is the function composition of the array of functions.\n\nThe function composition of `[f, g, h]` is `fn(x) = f(g(h(x)))`. The function composition of an empty list of functions is the identity function `f(x) = x`.',
    patternEn: 'Functional Programming / Reduce Right',
    intuitionEn: 'Function composition executes functions from right to left, piping the output of one function as the input to the next. JavaScript\'s `Array.prototype.reduceRight()` is tailor-made for this operation.',
    optimalExplanationEn: 'Use `functions.reduceRight((acc, fn) => fn(acc), x)`. If the array is empty, `reduceRight` returns the initial value `x` directly.',
    jsSpecificTipsEn: [
      '`reduceRight` processes arrays from the last element to the first, perfectly matching the mathematical definition of composition `(f ∘ g)(x) = f(g(x))`.',
      'For iterative execution, a simple reverse for loop (`for (let i = functions.length - 1; i >= 0; i--)`) is also optimal and avoids extra function frame allocations.'
    ],
    examplesEn: [
      { explanationEn: 'Evaluating from right to left: 2*4 = 8, 8+1 = 9, 9*9 = 81.' },
      { explanationEn: 'Empty functions list acts as the identity function returning input 42.' }
    ]
  },
  'lru-cache': {
    descriptionEn: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size `capacity`.\n- `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\n- `void put(int key, int value)` Update the value of the `key` if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, evict the least recently used key.\n\nThe functions `get` and `put` must each run in `O(1)` average time complexity.',
    patternEn: 'Doubly Linked List + Hash Map / JS Map Ordering',
    intuitionEn: 'JavaScript `Map` preserves insertion order of keys. When an item is accessed or updated, deleting and re-inserting it moves it to the end (marking it as most recently used). The first key in `map.keys()` is always the least recently used.',
    optimalExplanationEn: 'In `get(key)`: if present, retrieve value, `map.delete(key)` and `map.set(key, value)`, then return value. In `put(key, value)`: if key exists, delete it first; if at capacity, evict the first item `map.keys().next().value`; then `map.set(key, value)`.',
    jsSpecificTipsEn: [
      'JavaScript\'s standard `Map` specification guarantees iteration in key insertion order, allowing clean O(1) LRU implementation without building a manual Doubly Linked List.',
      '`map.keys().next().value` retrieves the oldest (LRU) key in O(1) time.'
    ],
    examplesEn: [
      { explanationEn: 'Key 1 is evicted when capacity is exceeded because key 2 was accessed more recently.' }
    ]
  },
  'reverse-linked-list': {
    descriptionEn: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
    patternEn: 'Pointer Manipulation (Iterative 3-Pointers)',
    intuitionEn: 'Maintain three pointers: `prev` (initialized to null), `curr` (initialized to head), and `nextTemp`. In each iteration, save `nextTemp = curr.next`, redirect `curr.next = prev`, then advance `prev = curr` and `curr = nextTemp`.',
    optimalExplanationEn: 'Iterate through the list reversing pointers in place in O(n) time and O(1) extra space. Return `prev` as the new head.',
    jsSpecificTipsEn: [
      'Linked lists in JS are plain objects with `val` and `next` properties: `{ val: 1, next: { val: 2, next: null } }`.',
      'Always cache `curr.next` before overwriting the pointer to prevent losing the rest of the list.'
    ],
    examplesEn: [
      { explanationEn: 'Reversing 1->2->3->4->5 yields 5->4->3->2->1.' },
      { explanationEn: 'Reversing 1->2 yields 2->1.' }
    ]
  },
  'merge-two-sorted-lists': {
    descriptionEn: 'You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.',
    patternEn: 'Dummy Head Node + Two Pointers',
    intuitionEn: 'Use a sentinel dummy head node (`dummy = new ListNode(-1)`) to avoid special-casing the first node. Use a `tail` pointer to attach whichever node has the smaller value from `list1` or `list2`. When one list finishes, attach the remainder of the other list directly.',
    optimalExplanationEn: 'While both lists have nodes, compare `list1.val` and `list2.val`, attach the smaller node to `tail.next`, and advance that list\'s pointer. Finally, attach `list1 || list2` to `tail.next` and return `dummy.next`.',
    jsSpecificTipsEn: [
      'A dummy head node simplifies list construction and eliminates null-checking edge cases.',
      'Splicing pointers in place uses O(1) auxiliary space without allocating new node objects.'
    ],
    examplesEn: [
      { explanationEn: 'Merged sorted list combines both lists in ascending order.' },
      { explanationEn: 'Merging empty lists returns empty list.' }
    ]
  },
  'invert-binary-tree': {
    descriptionEn: 'Given the `root` of a binary tree, invert the tree, and return its root.',
    patternEn: 'Tree Traversal (DFS / Recursion)',
    intuitionEn: 'To invert a binary tree, swap the left and right subtrees for every node in the tree recursively.',
    optimalExplanationEn: 'If `root === null`, return null. Swap `root.left` and `root.right` (using destructuring `[root.left, root.right] = [invertTree(root.right), invertTree(root.left)]`), then return `root`.',
    jsSpecificTipsEn: [
      'Modern JavaScript array destructuring allows swapping pointers in a single line: `[root.left, root.right] = [invertTree(root.right), invertTree(root.left)]`.',
      'Both recursive DFS and iterative BFS (using a queue) run in O(n) time visiting every node once.'
    ],
    examplesEn: [
      { explanationEn: 'All left and right children are swapped across all levels.' },
      { explanationEn: 'Left child 1 and right child 3 are swapped.' }
    ]
  },
  'product-of-array-except-self': {
    descriptionEn: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in `O(n)` time and without using the division operation.',
    patternEn: 'Prefix and Suffix Accumulation',
    intuitionEn: 'The answer at index `i` is the product of all elements to the left of `i` multiplied by the product of all elements to the right of `i`. Compute prefix products in a forward pass, then multiply by suffix products in a backward pass.',
    optimalExplanationEn: 'Create output array `res` of length `n`. Pass 1 (left-to-right): `res[i] = prefix`, `prefix *= nums[i]`. Pass 2 (right-to-left): `res[i] *= suffix`, `suffix *= nums[i]`. Total time is O(n) and auxiliary space is O(1) (excluding the output array).',
    jsSpecificTipsEn: [
      'Pre-allocating output with `new Array(nums.length)` avoids dynamic resizing.',
      'Multiplying directly into the output array satisfies the O(1) extra space constraint.'
    ],
    examplesEn: [
      { explanationEn: 'At index 0: 2*3*4 = 24. At index 1: 1*3*4 = 12. At index 2: 1*2*4 = 8. At index 3: 1*2*3 = 6.' },
      { explanationEn: 'Products computed correctly with zeros in array.' }
    ]
  },
  'house-robber': {
    descriptionEn: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.',
    patternEn: 'Dynamic Programming (State Reduction)',
    intuitionEn: 'At house `i`, you have two choices: rob house `i` (taking `nums[i] + maxRob(i-2)`) or skip house `i` (keeping `maxRob(i-1)`). Thus, `rob(i) = Math.max(rob(i-1), nums[i] + rob(i-2))`.',
    optimalExplanationEn: 'Use two state variables `prevMax = 0` and `currMax = 0`. For each house amount `num`, compute `temp = Math.max(currMax, prevMax + num)`, update `prevMax = currMax`, and `currMax = temp`. Return `currMax` in O(n) time and O(1) space.',
    jsSpecificTipsEn: [
      'State reduction eliminates the need for an O(n) DP array, achieving O(1) auxiliary space.',
      'Handles base cases (0 or 1 house) naturally without special branches.'
    ],
    examplesEn: [
      { explanationEn: 'Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4.' },
      { explanationEn: 'Rob house 1 (money = 2), house 3 (money = 9) and house 5 (money = 1). Total amount you can rob = 2 + 9 + 1 = 12.' }
    ]
  }
};
