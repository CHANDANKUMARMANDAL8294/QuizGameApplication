# Task 03: Interactive Quiz Game Application
### Web Development Internship Project Submission

![ApexQuiz Preview](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript ES6+](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero_External-brightgreen?style=for-the-badge)

---

## 📌 Project Overview & Task Description
This repository contains the complete implementation for **Task 03: Quiz Game Application**. 

The goal is to develop an interactive, responsive, and visually modern multiple-choice quiz application that dynamically displays questions, collects candidate responses, evaluates answers in real-time with tactile audio-visual cues, and provides detailed analytics, score breakdown, and an official verifiable Certificate of Achievement upon completion.

---

## 🌟 Key Features

### 1. Multi-Format Question Engine
As specified in the internship task requirements, the application supports four distinct question types:
- **Single Choice (Multiple Choice Questions)**: 4 options with instant keyboard shortcuts (`1-4` or `A-D`).
- **Multi-Select (Checkboxes)**: Choose all correct answers with explicit submission control.
- **Fill in the Blanks**: Smart case-insensitive string parsing with normalized alternatives.
- **True / False Decisions**: Rapid binary evaluation cards.

### 2. Live SVG Countdown Timer & Dynamic Warnings
- Smooth circular progress animation rendered with SVG `stroke-dashoffset`.
- Automatic color shift (Cyan $\rightarrow$ Amber $\rightarrow$ Pulsing Crimson) as time elapses.
- Web Audio acoustic tick warnings for the last 5 seconds.
- Auto-evaluates as "Time Expired" when the countdown hits zero.

### 3. Lifelines & Power-Ups
- ⚡ **50:50 Eliminator**: Strikingly eliminates two incorrect options on single-choice questions.
- ⏳ **+15s Extra Time**: Adds 15 bonus seconds to the active timer with a visual glow.
- 💡 **Smart Hint**: Reveals conceptual clues without spoiling the answer.
- ⏩ **Skip Question**: Safely advances to the next question with no score penalty.

### 4. Multiple Game Modes
- ⏱️ **Classic Mode**: Timed assessment with balanced scoring and complete question review.
- ❤️ **Survival Mode (3 Lives)**: 3 hearts; each wrong answer costs 1 life. Surviving all questions tests pure mastery!
- ⚡ **Blitz Mode**: Fast-paced 15-second timer per question for rapid recall.
- 🎓 **Practice & Study Mode**: Untimed, instant hints, and concept explanations.

### 5. Web Audio API Sound Effects Synthesizer
- Zero external audio files or MP3 downloads needed.
- Uses the browser's native `AudioContext` and oscillators (`triangle`, `sawtooth`, `sine`) to generate clean audio chimes, buzzer sounds, clicks, and fanfare.
- 100% offline-ready with zero network latency or broken link risks.

### 6. Interactive Answer Review & Analytics
- Post-assessment analytics dashboard displaying:
  - Total Points & Multipliers
  - Accuracy Percentage
  - Consecutive Streak Records
  - Performance Grade: **S-Rank Distinction 🏆**, **A+ Outstanding**, **A Competent**, **B Proficient**, or **C Satisfactory**.
- Detailed Question-by-Question breakdown highlighting your selection vs. the correct answer, complete with full educational explanations.
- Interactive filter: View *All*, *Incorrect Only*, or *Correct Only*.

### 7. Verifiable Internship Certificate of Achievement
- Generates a certificate complete with:
  - Candidate Full Name (editable in real-time)
  - Date of Issue & Domain
  - Score & Accuracy Percentage
  - Unique Hash Credential ID
  - Gold Seal Emblem & Evaluation Board Signature
  - Native **Print / Save as PDF** support via `@media print`.

### 8. Custom Question Creator & Local Persistence
- Candidates or mentors can add their own custom questions through a built-in modal form.
- Custom questions and top 15 leaderboard high scores are persisted in `localStorage`.

---

## 🏗️ Project Architecture & Folder Structure

```
d:\quizgame\
│
├── index.html            # Main semantic HTML5 structure and modals
├── package.json          # Node scripts for optional local server
├── README.md             # Technical documentation & internship report
│
├── css/
│   ├── base.css          # Design tokens, typography, dark glassmorphism mesh
│   ├── components.css    # Header, HUD, buttons, badges, modals, forms
│   └── quiz.css          # Timer SVG, question options, results, certificate
│
└── js/
    ├── audio.js          # Web Audio API real-time sound synthesizer
    ├── confetti.js       # Lightweight HTML5 Canvas particle celebration engine
    ├── questions.js      # Curated 60+ question bank across 4 domains
    ├── storage.js        # LocalStorage state management & leaderboard
    ├── certificate.js    # Printable Certificate generator
    └── app.js            # Core QuizApp controller & event pipeline
```

---

## 🚀 How to Run the Project Locally

### Method 1: Direct Browser Launch (Simplest, Zero Setup)
1. Double-click `index.html` in your file explorer, or right-click `index.html` and choose **Open With > Google Chrome / Microsoft Edge / Firefox**.
2. The entire application runs natively without needing any server or internet connection.

### Method 2: Using Node / NPM
```bash
# In the project directory:
npm start
# or
npx serve -l 3000 .
```
Then visit `http://localhost:3000` in your web browser.

### Method 3: Using Python Built-in Server
```bash
# Python 3
python -m http.server 8000
```
Then visit `http://localhost:8000`.

---

## ⌨️ Keyboard Shortcuts
- `1`, `2`, `3`, `4` or `A`, `B`, `C`, `D`: Select corresponding option
- `T` / `F`: True / False selection
- `Enter` or `➔`: Advance to next question
- `Space`: Launch quiz / confirm actions

---

## 👨‍💻 Submission Details
- **Task**: Task 03 - Quiz Game Application
- **Role**: Web Development Intern
- **Evaluation Criteria**: Code Quality, Responsive UI/UX, Multi-Type Question Handling, Score Calculation, Documentation.
