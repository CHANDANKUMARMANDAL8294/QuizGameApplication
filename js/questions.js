/**
 * Extensive Curated Question Bank
 * Supports: 'single' (Multiple Choice), 'multi' (Multiple Selection), 'fill' (Fill in the Blank), 'boolean' (True/False)
 */
const DEFAULT_QUESTIONS = [
  // ==================== WEB DEVELOPMENT ====================
  {
    id: "wd-01",
    category: "webdev",
    type: "single",
    difficulty: "easy",
    points: 100,
    question: "Which HTML5 semantic element is most suitable for encapsulating self-contained syndicate-able content like a blog post or news item?",
    options: ["<section>", "<article>", "<aside>", "<div>"],
    answer: 1,
    hint: "Think about standalone news feeds or blog entries that make sense on their own.",
    explanation: "The <article> element represents a self-contained composition in a document, page, application, or site, which is independently distributable or reusable."
  },
  {
    id: "wd-02",
    category: "webdev",
    type: "single",
    difficulty: "medium",
    points: 150,
    question: "What will be printed to the console when the following JavaScript code runs?",
    code: "console.log(typeof NaN);\nconsole.log(NaN === NaN);",
    options: [
      "'number' and true",
      "'number' and false",
      "'undefined' and false",
      "'NaN' and false"
    ],
    answer: 1,
    hint: "Remember that NaN is a numeric data type, yet it is never equal to anything, even itself.",
    explanation: "In JavaScript, typeof NaN is 'number', and IEEE 754 specifies that NaN is not equal to any value, including itself (NaN === NaN evaluates to false)."
  },
  {
    id: "wd-03",
    category: "webdev",
    type: "multi",
    difficulty: "medium",
    points: 180,
    question: "Which of the following are primitive data types in modern JavaScript? (Select all that apply)",
    options: ["Symbol", "BigInt", "Array", "Boolean", "Object"],
    answer: [0, 1, 3], // Symbol, BigInt, Boolean
    hint: "Arrays and plain Objects are non-primitive reference types.",
    explanation: "JavaScript has 7 primitive types: string, number, bigint, boolean, symbol, undefined, and null. Arrays and Objects are reference types."
  },
  {
    id: "wd-04",
    category: "webdev",
    type: "fill",
    difficulty: "easy",
    points: 120,
    question: "In CSS Flexbox, what property value for 'display' turns a block container into a flexible box container?",
    placeholder: "Type property value (e.g. flex)",
    acceptedAnswers: ["flex", "inline-flex", "'flex'"],
    hint: "It is a 4-letter keyword starting with 'f'.",
    explanation: "Setting 'display: flex;' establishes a flex formatting context for the element and its direct children."
  },
  {
    id: "wd-05",
    category: "webdev",
    type: "boolean",
    difficulty: "easy",
    points: 100,
    question: "In JavaScript, the 'const' keyword creates an immutable variable value, preventing nested properties of an object from being modified.",
    options: ["True", "False"],
    answer: 1, // False
    hint: "Does const freeze the object's contents, or only the variable reference?",
    explanation: "False! 'const' creates a constant reference, not an immutable value. You can still mutate properties of an object declared with const (use Object.freeze() to prevent property mutation)."
  },
  {
    id: "wd-06",
    category: "webdev",
    type: "single",
    difficulty: "hard",
    points: 200,
    question: "Which phase of the JavaScript Event Propagation model occurs FIRST when an event is dispatched in the DOM?",
    options: [
      "Target Phase",
      "Bubbling Phase",
      "Capturing (Trickling) Phase",
      "Default Action Phase"
    ],
    answer: 2,
    hint: "The event travels down from the window to the target before traveling back up.",
    explanation: "Event flow in DOM Level 2 consists of 3 phases: 1) Capturing phase (down from Window to target), 2) Target phase, and 3) Bubbling phase (up from target back to Window)."
  },
  {
    id: "wd-07",
    category: "webdev",
    type: "multi",
    difficulty: "medium",
    points: 170,
    question: "Which HTTP request methods are considered 'Idempotent' according to RFC specifications? (Select all that apply)",
    options: ["GET", "POST", "PUT", "DELETE"],
    answer: [0, 2, 3], // GET, PUT, DELETE
    hint: "An idempotent method can be called multiple times without changing the server state beyond the initial call.",
    explanation: "GET, PUT, and DELETE are idempotent because executing them multiple times produces the same server state as a single request. POST is NOT idempotent."
  },
  {
    id: "wd-08",
    category: "webdev",
    type: "fill",
    difficulty: "medium",
    points: 150,
    question: "What web API storage mechanism allows storing key-value pairs that persist with NO expiration date even after the browser is closed?",
    placeholder: "Name of the Web Storage object",
    acceptedAnswers: ["localStorage", "local storage", "window.localStorage"],
    hint: "Unlike sessionStorage, this storage lasts across sessions.",
    explanation: "window.localStorage provides persistent web storage that remains indefinitely until cleared by the user or script."
  },
  {
    id: "wd-09",
    category: "webdev",
    type: "single",
    difficulty: "medium",
    points: 140,
    question: "In CSS Box Model, what does the 'box-sizing: border-box;' property declaration do?",
    options: [
      "Adds an extra decorative border around the box margin",
      "Includes padding and border within the element's specified width and height",
      "Forces the background image to clip exclusively to the content box",
      "Disables all margin collapse behaviors"
    ],
    answer: 1,
    hint: "It makes width calculations intuitive by incorporating padding and borders inside the total width.",
    explanation: "With 'border-box', the element's width and height apply to content + padding + border, preventing elements from expanding unexpectedly."
  },
  {
    id: "wd-10",
    category: "webdev",
    type: "boolean",
    difficulty: "medium",
    points: 120,
    question: "HTTP/2 uses binary framing and multiplexes multiple concurrent requests and responses over a single TCP connection.",
    options: ["True", "False"],
    answer: 0, // True
    hint: "This major improvement eliminated the head-of-line blocking issue of HTTP/1.1 connections.",
    explanation: "True! HTTP/2 introduced binary framing layers allowing full multiplexing of requests/responses over a single persistent TCP connection."
  },

  // ==================== COMPUTER SCIENCE & PROGRAMMING ====================
  {
    id: "cs-01",
    category: "cs",
    type: "single",
    difficulty: "easy",
    points: 100,
    question: "What is the average time complexity of searching for an element in a balanced Binary Search Tree (BST) containing n nodes?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: 1,
    hint: "Each comparison eliminates half of the remaining nodes.",
    explanation: "Searching a balanced BST halves the search space at each level, yielding an average time complexity of O(log n)."
  },
  {
    id: "cs-02",
    category: "cs",
    type: "multi",
    difficulty: "hard",
    points: 200,
    question: "Which of the following sorting algorithms have a worst-case time complexity of O(n log n)? (Select all that apply)",
    options: ["Merge Sort", "Quick Sort", "Heap Sort", "Bubble Sort"],
    answer: [0, 2], // Merge Sort and Heap Sort
    hint: "Quick Sort's worst case degenerates to O(n^2) when bad pivots are chosen.",
    explanation: "Merge Sort and Heap Sort guarantee O(n log n) even in the worst case. Quick Sort degrades to O(n²) with poor pivot choices, and Bubble Sort is O(n²)."
  },
  {
    id: "cs-03",
    category: "cs",
    type: "fill",
    difficulty: "easy",
    points: 110,
    question: "What fundamental Data Structure operates on a 'Last-In, First-Out' (LIFO) principle?",
    placeholder: "Name the data structure",
    acceptedAnswers: ["Stack", "a stack", "stacks"],
    hint: "Think of a physical pile of cafeteria trays or plates.",
    explanation: "A Stack is a linear data structure that follows the LIFO (Last In First Out) principle, commonly supporting push and pop operations."
  },
  {
    id: "cs-04",
    category: "cs",
    type: "boolean",
    difficulty: "medium",
    points: 130,
    question: "A deadlock in an operating system can occur even if the mutual exclusion condition is NOT satisfied.",
    options: ["True", "False"],
    answer: 1, // False
    hint: "Coffman stated that all 4 conditions must hold simultaneously for a deadlock to exist.",
    explanation: "False! Deadlock requires all 4 Coffman conditions to hold simultaneously: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait."
  },
  {
    id: "cs-05",
    category: "cs",
    type: "single",
    difficulty: "medium",
    points: 150,
    question: "In Git version control, which command combines changes from a feature branch into the current branch while creating a new merge commit?",
    options: [
      "git rebase feature",
      "git merge --no-ff feature",
      "git cherry-pick feature",
      "git checkout -b feature"
    ],
    answer: 1,
    hint: "--no-ff stands for 'no fast-forward', ensuring a distinct commit represents the merge.",
    explanation: "'git merge --no-ff <branch>' ensures that a merge commit is created even if a fast-forward merge would have been possible, preserving branch history."
  },
  {
    id: "cs-06",
    category: "cs",
    type: "multi",
    difficulty: "medium",
    points: 170,
    question: "Which of the following are valid components of the ACID properties in database transaction management? (Select all that apply)",
    options: ["Atomicity", "Concurrency", "Isolation", "Durability", "Availability"],
    answer: [0, 2, 3], // Atomicity, Isolation, Durability (C is Consistency, not Concurrency!)
    hint: "A-C-I-D stands for Atomicity, Consistency, Isolation, and Durability.",
    explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability. 'Concurrency' and 'Availability' are not part of ACID."
  },
  {
    id: "cs-07",
    category: "cs",
    type: "fill",
    difficulty: "medium",
    points: 140,
    question: "What algorithmic paradigm solves a problem by breaking it into overlapping subproblems and memoizing their solutions?",
    placeholder: "Name the paradigm (2 words)",
    acceptedAnswers: ["Dynamic Programming", "dynamic programming", "DP"],
    hint: "Often abbreviated as 'DP'. Used for Fibonacci, Knapsack, and shortest path algorithms.",
    explanation: "Dynamic Programming (DP) solves complex problems by breaking them down into overlapping subproblems and caching subproblem solutions."
  },
  {
    id: "cs-08",
    category: "cs",
    type: "single",
    difficulty: "hard",
    points: 190,
    question: "In Computer Architecture, what is the primary purpose of the Translation Lookaside Buffer (TLB)?",
    options: [
      "To store CPU instruction microcode",
      "To cache virtual-to-physical address translations for faster memory access",
      "To buffer I/O disk writes before committing to flash storage",
      "To synchronize clock frequencies between multi-core CPUs"
    ],
    answer: 1,
    hint: "It acts as a high-speed cache for page table lookups.",
    explanation: "The TLB is a specialized hardware memory cache used by the Memory Management Unit (MMU) to speed up virtual address translation."
  },

  // ==================== TECH & INNOVATION TRIVIA ====================
  {
    id: "tech-01",
    category: "tech",
    type: "single",
    difficulty: "easy",
    points: 100,
    question: "Who is widely recognized as the world's first computer programmer for writing an algorithm for Babbage's Analytical Engine?",
    options: ["Alan Turing", "Ada Lovelace", "Grace Hopper", "Katherine Johnson"],
    answer: 1,
    hint: "She was the daughter of the English poet Lord Byron.",
    explanation: "Ada Lovelace wrote the first algorithm intended to be executed by a machine (Charles Babbage's Analytical Engine) in 1843."
  },
  {
    id: "tech-02",
    category: "tech",
    type: "multi",
    difficulty: "medium",
    points: 160,
    question: "Which of the following neural network architectures are primarily based on the 'Attention' mechanism? (Select all that apply)",
    options: ["BERT", "GPT-4", "AlexNet", "Transformer", "VGG16"],
    answer: [0, 1, 3], // BERT, GPT-4, Transformer
    hint: "AlexNet and VGG16 are traditional Convolutional Neural Networks (CNNs).",
    explanation: "Transformers, BERT, and GPT models are built upon self-attention mechanisms introduced in the 2017 paper 'Attention Is All You Need'."
  },
  {
    id: "tech-03",
    category: "tech",
    type: "fill",
    difficulty: "easy",
    points: 110,
    question: "What open-source container orchestration platform was originally designed by Google and is now maintained by the CNCF?",
    placeholder: "Name the tool (starts with K)",
    acceptedAnswers: ["Kubernetes", "k8s", "kubernetes"],
    hint: "Often abbreviated as K8s.",
    explanation: "Kubernetes (K8s) is the industry-standard container orchestration platform originally open-sourced by Google in 2014."
  },
  {
    id: "tech-04",
    category: "tech",
    type: "boolean",
    difficulty: "easy",
    points: 100,
    question: "Moore's Law is a physical law of nature that guarantees semiconductor chips will perpetually double in transistor count every two years.",
    options: ["True", "False"],
    answer: 1, // False
    hint: "Is it an inviolable law of physics, or an empirical observation made by Gordon Moore?",
    explanation: "False! Moore's Law is an empirical observation and industry projection formulated by Intel co-founder Gordon Moore, not an invariant physical law."
  },
  {
    id: "tech-05",
    category: "tech",
    type: "single",
    difficulty: "hard",
    points: 190,
    question: "What does the 'TPU' hardware accelerator developed by Google specifically optimize for?",
    options: [
      "Cryptocurrency mining hashing operations",
      "Tensor processing and matrix multiplications for Machine Learning workloads",
      "High-frame-rate real-time Ray Tracing graphics",
      "Quantum qubit coherence stabilization"
    ],
    answer: 1,
    hint: "The 'T' stands for Tensor.",
    explanation: "Google's TPU (Tensor Processing Unit) is an ASIC custom-designed for accelerated machine learning and deep neural network matrix computations."
  },
  {
    id: "tech-06",
    category: "tech",
    type: "fill",
    difficulty: "medium",
    points: 130,
    question: "What programming language was developed by Brendan Eich in just 10 days in May 1995 while at Netscape?",
    placeholder: "Language name",
    acceptedAnswers: ["JavaScript", "javascript", "js", "Mocha"],
    hint: "It was originally codenamed Mocha, then LiveScript, before its final famous name.",
    explanation: "Brendan Eich created JavaScript in May 1995 at Netscape Communications to add interactivity to the web."
  },

  // ==================== SCIENCE & GENERAL KNOWLEDGE ====================
  {
    id: "gen-01",
    category: "general",
    type: "single",
    difficulty: "easy",
    points: 100,
    question: "What is the speed of light in a vacuum (approximate value in km/s)?",
    options: ["150,000 km/s", "300,000 km/s", "450,000 km/s", "1,000,000 km/s"],
    answer: 1,
    hint: "It takes light approximately 8 minutes and 20 seconds to travel from the Sun to Earth.",
    explanation: "The speed of light in vacuum is exactly 299,792,458 m/s, which is approximately 300,000 km/s (or 186,282 miles/s)."
  },
  {
    id: "gen-02",
    category: "general",
    type: "multi",
    difficulty: "medium",
    points: 160,
    question: "Which of the following planets in our Solar System possess a planetary ring system? (Select all that apply)",
    options: ["Saturn", "Jupiter", "Uranus", "Neptune", "Venus"],
    answer: [0, 1, 2, 3], // All 4 gas/ice giants have rings!
    hint: "All four giant outer planets (gas and ice giants) have rings, though Saturn's are the most prominent.",
    explanation: "All four giant planets—Saturn, Jupiter, Uranus, and Neptune—have rings. Terrestrial planets like Venus do not."
  },
  {
    id: "gen-03",
    category: "general",
    type: "fill",
    difficulty: "easy",
    points: 100,
    question: "What is the chemical symbol for the element Gold on the periodic table?",
    placeholder: "2-letter chemical symbol",
    acceptedAnswers: ["Au", "au", "AU"],
    hint: "It comes from the Latin word 'Aurum', meaning shining dawn.",
    explanation: "The symbol for Gold is 'Au', derived from the Latin word 'Aurum'."
  },
  {
    id: "gen-04",
    category: "general",
    type: "boolean",
    difficulty: "easy",
    points: 100,
    question: "Sound waves travel FASTER through water and solid steel than they do through air.",
    options: ["True", "False"],
    answer: 0, // True
    hint: "Sound travels via particle collisions; denser media transfer acoustic vibrations more rapidly.",
    explanation: "True! Sound travels at ~343 m/s in air, ~1,480 m/s in water, and ~5,100 m/s in steel because molecules are much more tightly packed."
  },
  {
    id: "gen-05",
    category: "general",
    type: "single",
    difficulty: "medium",
    points: 140,
    question: "Which subatomic particle was discovered by British physicist J.J. Thomson in 1897 using cathode ray tubes?",
    options: ["Proton", "Neutron", "Electron", "Positron"],
    answer: 2,
    hint: "It carries a negative electric charge.",
    explanation: "J.J. Thomson discovered the electron in 1897, establishing that atoms are composed of subatomic constituent particles."
  },
  {
    id: "gen-06",
    category: "general",
    type: "multi",
    difficulty: "hard",
    points: 180,
    question: "Which of the following are SI fundamental base units? (Select all that apply)",
    options: ["Kelvin (K)", "Second (s)", "Newton (N)", "Mole (mol)", "Joule (J)"],
    answer: [0, 1, 3], // Kelvin, Second, Mole (Newton and Joule are derived units!)
    hint: "Newton and Joule are derived units (force and energy), not base units.",
    explanation: "The 7 SI base units are: second, meter, kilogram, ampere, kelvin, mole, and candela. Newton (kg·m/s²) and Joule (N·m) are derived units."
  }
];

window.DEFAULT_QUESTIONS = DEFAULT_QUESTIONS;
