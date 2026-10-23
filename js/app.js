/**
 * ApexQuiz - Interactive Quiz Game Engine
 * Internship Task 03 Implementation
 */

class QuizApp {
  constructor() {
    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.lives = 3;
    this.timerInterval = null;
    this.timeLimit = 25;
    this.timeRemaining = 25;
    this.userAnswers = [];
    this.gameMode = 'classic';
    this.category = 'all';
    this.difficulty = 'all';
    this.questionType = 'all';
    this.questionCount = 10;
    this.hasAnsweredCurrent = false;

    this.lifelines = {
      fiftyFifty: true,
      extraTime: true,
      hint: true,
      skip: true
    };

    // DOM Elements Cache
    this.screens = {
      setup: document.getElementById('screen-setup'),
      quiz: document.getElementById('screen-quiz'),
      result: document.getElementById('screen-result')
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.loadInitialPreferences();
    this.renderCustomQuestionsSummary();
  }

  loadInitialPreferences() {
    const savedName = localStorage.getItem('apex_quiz_candidate_name') || 'Intern Candidate';
    const nameInput = document.getElementById('player-name-input');
    if (nameInput) nameInput.value = savedName;

    // Sound toggle state
    const soundToggle = document.getElementById('sound-toggle-btn');
    if (soundToggle && window.soundEffects) {
      this.updateSoundIcon(soundToggle, window.soundEffects.isMuted());
    }
  }

  updateSoundIcon(btn, isMuted) {
    btn.innerHTML = isMuted
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
    btn.title = isMuted ? "Sound Muted (Click to Unmute)" : "Sound On (Click to Mute)";
  }

  bindEvents() {
    // Sound Button
    const soundToggle = document.getElementById('sound-toggle-btn');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        const muted = window.soundEffects.toggleMute();
        this.updateSoundIcon(soundToggle, muted);
      });
    }

    // Modal Triggers
    document.getElementById('btn-open-leaderboard')?.addEventListener('click', () => this.openLeaderboard());
    document.getElementById('btn-open-project-info')?.addEventListener('click', () => this.openProjectInfo());
    document.getElementById('btn-open-custom-creator')?.addEventListener('click', () => this.openCustomCreator());

    // Setup Screen Controls
    document.getElementById('btn-start-quiz')?.addEventListener('click', () => this.startQuiz());

    // Lifeline buttons
    document.getElementById('btn-lifeline-5050')?.addEventListener('click', () => this.useFiftyFifty());
    document.getElementById('btn-lifeline-time')?.addEventListener('click', () => this.useExtraTime());
    document.getElementById('btn-lifeline-hint')?.addEventListener('click', () => this.useHint());
    document.getElementById('btn-lifeline-skip')?.addEventListener('click', () => this.useSkip());

    // Next button
    document.getElementById('btn-next-question')?.addEventListener('click', () => this.nextQuestion());

    // Results Actions
    document.getElementById('btn-play-again')?.addEventListener('click', () => this.startQuiz());
    document.getElementById('btn-change-settings')?.addEventListener('click', () => this.showScreen('setup'));
    document.getElementById('btn-view-certificate')?.addEventListener('click', () => this.showCertificate());

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
  }

  handleGlobalKeydown(e) {
    if (this.screens.quiz.classList.contains('active')) {
      // If modal is active, ignore
      if (document.querySelector('.modal-overlay.active')) return;

      const currentQ = this.questions[this.currentIndex];
      if (!currentQ) return;

      // Enter key for next question if answered
      if (this.hasAnsweredCurrent && (e.key === 'Enter' || e.key === 'ArrowRight')) {
        e.preventDefault();
        this.nextQuestion();
        return;
      }

      // If single choice or boolean, allow 1,2,3,4 or A,B,C,D
      if (!this.hasAnsweredCurrent) {
        if (currentQ.type === 'single') {
          const key = e.key.toUpperCase();
          const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
          if (keyMap[key] !== undefined && keyMap[key] < currentQ.options.length) {
            this.handleSingleChoiceAnswer(keyMap[key]);
          }
        } else if (currentQ.type === 'boolean') {
          const key = e.key.toUpperCase();
          if (key === '1' || key === 'T') this.handleSingleChoiceAnswer(0); // True
          if (key === '2' || key === 'F') this.handleSingleChoiceAnswer(1); // False
        }
      }
    }
  }

  showScreen(screenName) {
    Object.keys(this.screens).forEach(key => {
      if (this.screens[key]) {
        this.screens[key].classList.toggle('active', key === screenName);
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==================== QUIZ INITIALIZATION ====================
  startQuiz() {
    window.soundEffects?.playClick();

    // Read Settings from Setup Screen
    const categorySelect = document.getElementById('select-category');
    const difficultySelect = document.getElementById('select-difficulty');
    const typeSelect = document.getElementById('select-type');
    const modeSelect = document.getElementById('select-mode');
    const countSelect = document.getElementById('select-count');
    const timerSelect = document.getElementById('select-timer');
    const nameInput = document.getElementById('player-name-input');

    this.category = categorySelect ? categorySelect.value : 'all';
    this.difficulty = difficultySelect ? difficultySelect.value : 'all';
    this.questionType = typeSelect ? typeSelect.value : 'all';
    this.gameMode = modeSelect ? modeSelect.value : 'classic';
    this.questionCount = countSelect ? parseInt(countSelect.value, 10) : 10;
    this.timeLimit = timerSelect ? parseInt(timerSelect.value, 10) : 25;

    const candidateName = nameInput?.value.trim() || 'Intern Candidate';
    localStorage.setItem('apex_quiz_candidate_name', candidateName);

    // Filter Question Pool
    let pool = window.storageManager.getAllQuestions();

    if (this.category !== 'all') {
      pool = pool.filter(q => q.category === this.category);
    }
    if (this.difficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === this.difficulty);
    }
    if (this.questionType !== 'all') {
      pool = pool.filter(q => q.type === this.questionType);
    }

    if (pool.length === 0) {
      alert("No questions matched the selected combination of filters. Reverting to all questions for this category!");
      pool = window.storageManager.getAllQuestions();
    }

    // Shuffle and pick desired count
    this.questions = this.shuffleArray([...pool]).slice(0, Math.min(this.questionCount, pool.length));
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.lives = 3;
    this.userAnswers = [];
    this.hasAnsweredCurrent = false;

    // Reset Lifelines
    this.lifelines = {
      fiftyFifty: true,
      extraTime: true,
      hint: true,
      skip: true
    };
    this.updateLifelinesUI();

    // Setup mode-specific UI
    this.setupModeUI();

    // Show Quiz Arena Screen
    this.showScreen('quiz');
    this.renderCurrentQuestion();
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  setupModeUI() {
    const survivalBadge = document.getElementById('hud-lives-container');
    const timerCircle = document.getElementById('timer-container');

    if (this.gameMode === 'survival') {
      if (survivalBadge) survivalBadge.style.display = 'flex';
      this.renderLives();
    } else {
      if (survivalBadge) survivalBadge.style.display = 'none';
    }

    if (this.gameMode === 'practice') {
      if (timerCircle) timerCircle.style.display = 'none';
    } else {
      if (timerCircle) timerCircle.style.display = 'flex';
    }

    // Update HUD Score & Streak
    this.updateHUD();
  }

  renderLives() {
    const container = document.getElementById('hud-lives-container');
    if (!container) return;
    let hearts = '';
    for (let i = 0; i < 3; i++) {
      if (i < this.lives) {
        hearts += `<span class="life-heart active" title="Active Life">❤️</span>`;
      } else {
        hearts += `<span class="life-heart lost" title="Lost Life">🖤</span>`;
      }
    }
    container.innerHTML = `<span class="lives-label">LIVES:</span> ${hearts}`;
  }

  updateHUD() {
    const scoreElem = document.getElementById('hud-score-value');
    if (scoreElem) scoreElem.textContent = this.score;

    const streakElem = document.getElementById('hud-streak-container');
    if (streakElem) {
      if (this.streak >= 2) {
        streakElem.innerHTML = `<span class="hud-streak-badge">🔥 ${this.streak}x STREAK</span>`;
        streakElem.style.display = 'block';
      } else {
        streakElem.style.display = 'none';
      }
    }

    const progressElem = document.getElementById('hud-progress-text');
    if (progressElem) {
      progressElem.textContent = `Question ${this.currentIndex + 1} of ${this.questions.length}`;
    }

    const progressBar = document.getElementById('hud-progress-fill');
    if (progressBar) {
      const pct = ((this.currentIndex + 1) / this.questions.length) * 100;
      progressBar.style.width = `${pct}%`;
    }
  }

  // ==================== QUESTION RENDERING ====================
  renderCurrentQuestion() {
    this.hasAnsweredCurrent = false;
    const q = this.questions[this.currentIndex];
    if (!q) {
      this.finishQuiz();
      return;
    }

    this.updateHUD();

    // Reset Next Button
    const nextBtn = document.getElementById('btn-next-question');
    if (nextBtn) {
      nextBtn.style.display = 'none';
      nextBtn.textContent = this.currentIndex === this.questions.length - 1 ? 'Finish Quiz 🏁' : 'Next Question ➔';
    }

    // Question Header & Badges
    const categoryBadge = document.getElementById('q-category-badge');
    if (categoryBadge) {
      const catNames = {
        webdev: '💻 Web Dev',
        cs: '🧠 Computer Science',
        tech: '⚡ Tech & AI',
        general: '🚀 Science Trivia'
      };
      categoryBadge.textContent = catNames[q.category] || q.category.toUpperCase();
    }

    const typeBadge = document.getElementById('q-type-badge');
    if (typeBadge) {
      const typeLabels = {
        single: 'Single Choice',
        multi: 'Multiple Select (Pick all correct)',
        fill: 'Fill in the Blank',
        boolean: 'True / False'
      };
      typeBadge.textContent = typeLabels[q.type] || 'Quiz Question';
    }

    const diffBadge = document.getElementById('q-difficulty-badge');
    if (diffBadge) {
      diffBadge.textContent = `${q.difficulty.toUpperCase()} • ${q.points || 100} PTS`;
      diffBadge.className = `badge badge-${q.difficulty}`;
    }

    // Question Title
    const titleElem = document.getElementById('q-title-text');
    if (titleElem) titleElem.textContent = q.question;

    // Code Snippet Box (if available)
    const codeBox = document.getElementById('q-code-snippet');
    if (codeBox) {
      if (q.code) {
        codeBox.style.display = 'block';
        codeBox.querySelector('code').textContent = q.code;
      } else {
        codeBox.style.display = 'none';
      }
    }

    // Hint Box (hidden until requested)
    const hintCard = document.getElementById('q-hint-card');
    if (hintCard) hintCard.style.display = 'none';

    // Explanation Box (hidden until answered)
    const explanationCard = document.getElementById('q-explanation-card');
    if (explanationCard) explanationCard.style.display = 'none';

    // Render Answer Interactive Inputs
    const optionsContainer = document.getElementById('q-options-container');
    if (!optionsContainer) return;
    optionsContainer.innerHTML = '';

    switch (q.type) {
      case 'single':
      case 'boolean':
        this.renderSingleChoiceOptions(optionsContainer, q);
        break;
      case 'multi':
        this.renderMultiSelectOptions(optionsContainer, q);
        break;
      case 'fill':
        this.renderFillInTheBlank(optionsContainer, q);
        break;
      default:
        this.renderSingleChoiceOptions(optionsContainer, q);
    }

    // Reset 50-50 lifeline UI if disabled for non-single types
    const fFiftyBtn = document.getElementById('btn-lifeline-5050');
    if (fFiftyBtn) {
      if (q.type !== 'single') {
        fFiftyBtn.classList.add('disabled-for-type');
      } else {
        fFiftyBtn.classList.remove('disabled-for-type');
      }
    }

    // Start Timer
    if (this.gameMode !== 'practice') {
      this.startTimer();
    }
  }

  renderSingleChoiceOptions(container, q) {
    const letters = ['A', 'B', 'C', 'D'];
    const grid = document.createElement('div');
    grid.className = 'options-grid-single';

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-card option-single';
      btn.id = `option-btn-${idx}`;
      btn.innerHTML = `
        <span class="option-key-badge">${letters[idx] || (idx + 1)}</span>
        <span class="option-text">${opt}</span>
      `;
      btn.addEventListener('click', () => {
        if (!this.hasAnsweredCurrent) {
          this.handleSingleChoiceAnswer(idx);
        }
      });
      grid.appendChild(btn);
    });

    container.appendChild(grid);
  }

  renderMultiSelectOptions(container, q) {
    const wrap = document.createElement('div');
    wrap.className = 'options-multi-wrapper';

    const grid = document.createElement('div');
    grid.className = 'options-grid-multi';

    q.options.forEach((opt, idx) => {
      const label = document.createElement('label');
      label.className = 'option-card option-checkbox-card';
      label.id = `option-multi-${idx}`;
      label.innerHTML = `
        <input type="checkbox" name="multi-option" value="${idx}" class="multi-check-input" />
        <span class="custom-checkbox-box"></span>
        <span class="option-text">${opt}</span>
      `;
      grid.appendChild(label);
    });

    wrap.appendChild(grid);

    // Submit Multi-select button
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-primary btn-submit-multi';
    submitBtn.id = 'btn-submit-multi';
    submitBtn.innerHTML = `Submit Selected Answers <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
    submitBtn.addEventListener('click', () => {
      if (!this.hasAnsweredCurrent) {
        this.handleMultiSelectAnswer();
      }
    });

    wrap.appendChild(submitBtn);
    container.appendChild(wrap);
  }

  renderFillInTheBlank(container, q) {
    const wrap = document.createElement('div');
    wrap.className = 'fill-blank-wrapper';

    wrap.innerHTML = `
      <div class="fill-input-group">
        <input 
          type="text" 
          id="fill-blank-input" 
          class="fill-blank-input" 
          placeholder="${q.placeholder || 'Type your answer here...'}" 
          autocomplete="off" 
          spellcheck="false"
        />
        <button class="btn btn-primary" id="btn-submit-fill">
          Submit
        </button>
      </div>
      <p class="fill-subtext">Answers are case-insensitive. Press <kbd>Enter</kbd> to submit.</p>
    `;

    container.appendChild(wrap);

    const input = wrap.querySelector('#fill-blank-input');
    const submitBtn = wrap.querySelector('#btn-submit-fill');

    setTimeout(() => input?.focus(), 100);

    const submitHandler = () => {
      if (!this.hasAnsweredCurrent) {
        const val = input.value.trim();
        if (!val) {
          input.focus();
          return;
        }
        this.handleFillInBlankAnswer(val);
      }
    };

    submitBtn.addEventListener('click', submitHandler);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitHandler();
      }
    });
  }

  // ==================== TIMER ENGINE ====================
  startTimer() {
    this.stopTimer();
    this.timeRemaining = this.timeLimit;
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();

      if (this.timeRemaining <= 5 && this.timeRemaining > 0) {
        window.soundEffects?.playWarningTick();
      }

      if (this.timeRemaining <= 0) {
        this.stopTimer();
        this.handleTimeExpired();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateTimerDisplay() {
    const textElem = document.getElementById('timer-seconds-text');
    const circle = document.getElementById('timer-svg-circle');
    if (textElem) textElem.textContent = this.timeRemaining;

    if (circle) {
      const radius = 34;
      const circumference = 2 * Math.PI * radius;
      const progress = Math.max(0, this.timeRemaining / this.timeLimit);
      const strokeDashoffset = circumference - (progress * circumference);
      circle.style.strokeDashoffset = strokeDashoffset;

      if (this.timeRemaining <= 5) {
        circle.style.stroke = '#ef4444'; // pulsing red
        circle.classList.add('pulse-timer');
      } else if (this.timeRemaining <= 10) {
        circle.style.stroke = '#f59e0b'; // amber
        circle.classList.remove('pulse-timer');
      } else {
        circle.style.stroke = '#06b6d4'; // cyan
        circle.classList.remove('pulse-timer');
      }
    }
  }

  handleTimeExpired() {
    if (this.hasAnsweredCurrent) return;
    this.hasAnsweredCurrent = true;
    window.soundEffects?.playIncorrect();

    const q = this.questions[this.currentIndex];

    // Penalty / Streak reset
    this.streak = 0;
    if (this.gameMode === 'survival') {
      this.lives--;
      this.renderLives();
    }

    // Record unanswered / timeout
    this.userAnswers.push({
      question: q.question,
      type: q.type,
      userAnswer: '(Time Expired)',
      correctAnswer: this.getFormattedCorrectAnswer(q),
      isCorrect: false,
      pointsAwarded: 0,
      explanation: q.explanation
    });

    // Reveal correct option in UI
    this.highlightCorrectAnswers(q);
    this.showExplanation(q, false, "Time Expired! ⏳");

    this.checkSurvivalOrShowNext();
  }

  // ==================== ANSWER EVALUATION ====================
  handleSingleChoiceAnswer(selectedIndex) {
    this.hasAnsweredCurrent = true;
    this.stopTimer();

    const q = this.questions[this.currentIndex];
    const isCorrect = (selectedIndex === q.answer);
    const chosenBtn = document.getElementById(`option-btn-${selectedIndex}`);

    // Points calculation
    let points = 0;
    if (isCorrect) {
      points = q.points || 100;
      // Speed bonus if answered in first 40% of time
      const timeSpent = this.timeLimit - this.timeRemaining;
      if (this.gameMode !== 'practice' && timeSpent <= this.timeLimit * 0.4) {
        points += 50;
      }
      // Streak Multiplier
      this.streak++;
      if (this.streak > this.bestStreak) this.bestStreak = this.streak;
      if (this.streak >= 2) {
        points = Math.round(points * (1 + (this.streak * 0.15)));
      }
      this.score += points;

      chosenBtn?.classList.add('correct');
      window.soundEffects?.playCorrect();
      this.triggerPointsAnimation(`+${points} pts!`);

      if (this.streak >= 3) {
        window.confetti?.burst();
      }
    } else {
      this.streak = 0;
      chosenBtn?.classList.add('wrong');
      window.soundEffects?.playIncorrect();

      if (this.gameMode === 'survival') {
        this.lives--;
        this.renderLives();
      }
    }

    // Highlight the correct answer if chosen wrong
    const correctBtn = document.getElementById(`option-btn-${q.answer}`);
    correctBtn?.classList.add('correct');

    this.userAnswers.push({
      question: q.question,
      type: q.type,
      userAnswer: q.options[selectedIndex],
      correctAnswer: q.options[q.answer],
      isCorrect: isCorrect,
      pointsAwarded: points,
      explanation: q.explanation
    });

    this.updateHUD();
    this.showExplanation(q, isCorrect);
    this.checkSurvivalOrShowNext();
  }

  handleMultiSelectAnswer() {
    this.hasAnsweredCurrent = true;
    this.stopTimer();

    const q = this.questions[this.currentIndex];
    const checkboxes = document.querySelectorAll('input[name="multi-option"]:checked');
    const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.value, 10)).sort((a, b) => a - b);
    const correctIndices = [...q.answer].sort((a, b) => a - b);

    const isCorrect = (
      selectedIndices.length === correctIndices.length &&
      selectedIndices.every((val, index) => val === correctIndices[index])
    );

    // Disable all inputs & submit btn
    document.querySelectorAll('.multi-check-input').forEach(i => i.disabled = true);
    const submitBtn = document.getElementById('btn-submit-multi');
    if (submitBtn) submitBtn.disabled = true;

    // Highlight cards
    q.options.forEach((_, idx) => {
      const card = document.getElementById(`option-multi-${idx}`);
      if (!card) return;
      const isSelected = selectedIndices.includes(idx);
      const isShouldBeSelected = correctIndices.includes(idx);

      if (isShouldBeSelected) {
        card.classList.add('correct');
      } else if (isSelected && !isShouldBeSelected) {
        card.classList.add('wrong');
      }
    });

    let points = 0;
    if (isCorrect) {
      points = q.points || 150;
      this.streak++;
      if (this.streak > this.bestStreak) this.bestStreak = this.streak;
      if (this.streak >= 2) points = Math.round(points * (1 + (this.streak * 0.15)));
      this.score += points;

      window.soundEffects?.playCorrect();
      this.triggerPointsAnimation(`+${points} pts!`);
      if (this.streak >= 3) window.confetti?.burst();
    } else {
      this.streak = 0;
      window.soundEffects?.playIncorrect();
      if (this.gameMode === 'survival') {
        this.lives--;
        this.renderLives();
      }
    }

    const userAnsStr = selectedIndices.map(i => q.options[i]).join(', ') || '(No options selected)';
    const correctAnsStr = correctIndices.map(i => q.options[i]).join(', ');

    this.userAnswers.push({
      question: q.question,
      type: q.type,
      userAnswer: userAnsStr,
      correctAnswer: correctAnsStr,
      isCorrect: isCorrect,
      pointsAwarded: points,
      explanation: q.explanation
    });

    this.updateHUD();
    this.showExplanation(q, isCorrect);
    this.checkSurvivalOrShowNext();
  }

  handleFillInBlankAnswer(userText) {
    this.hasAnsweredCurrent = true;
    this.stopTimer();

    const q = this.questions[this.currentIndex];
    const input = document.getElementById('fill-blank-input');
    const submitBtn = document.getElementById('btn-submit-fill');
    if (input) input.disabled = true;
    if (submitBtn) submitBtn.disabled = true;

    const normalizedUser = userText.trim().toLowerCase();
    const isCorrect = q.acceptedAnswers.some(ans => ans.trim().toLowerCase() === normalizedUser);

    let points = 0;
    if (isCorrect) {
      points = q.points || 120;
      input?.classList.add('correct');
      this.streak++;
      if (this.streak > this.bestStreak) this.bestStreak = this.streak;
      if (this.streak >= 2) points = Math.round(points * (1 + (this.streak * 0.15)));
      this.score += points;

      window.soundEffects?.playCorrect();
      this.triggerPointsAnimation(`+${points} pts!`);
      if (this.streak >= 3) window.confetti?.burst();
    } else {
      input?.classList.add('wrong');
      this.streak = 0;
      window.soundEffects?.playIncorrect();
      if (this.gameMode === 'survival') {
        this.lives--;
        this.renderLives();
      }
    }

    this.userAnswers.push({
      question: q.question,
      type: q.type,
      userAnswer: userText,
      correctAnswer: q.acceptedAnswers[0],
      isCorrect: isCorrect,
      pointsAwarded: points,
      explanation: q.explanation
    });

    this.updateHUD();
    this.showExplanation(q, isCorrect);
    this.checkSurvivalOrShowNext();
  }

  highlightCorrectAnswers(q) {
    if (q.type === 'single' || q.type === 'boolean') {
      const correctBtn = document.getElementById(`option-btn-${q.answer}`);
      correctBtn?.classList.add('correct');
    } else if (q.type === 'multi') {
      q.answer.forEach(idx => {
        document.getElementById(`option-multi-${idx}`)?.classList.add('correct');
      });
    } else if (q.type === 'fill') {
      const input = document.getElementById('fill-blank-input');
      if (input) {
        input.value = `Correct: ${q.acceptedAnswers[0]}`;
        input.classList.add('reveal-correct');
      }
    }
  }

  getFormattedCorrectAnswer(q) {
    if (q.type === 'single' || q.type === 'boolean') {
      return q.options[q.answer];
    } else if (q.type === 'multi') {
      return q.answer.map(i => q.options[i]).join(', ');
    } else if (q.type === 'fill') {
      return q.acceptedAnswers[0];
    }
    return '';
  }

  showExplanation(q, isCorrect, customHeader = null) {
    const card = document.getElementById('q-explanation-card');
    if (!card) return;

    const icon = isCorrect ? '✅ Excellent!' : '💡 Key Concept:';
    const headerText = customHeader || (isCorrect ? 'Correct Answer!' : 'Not quite right');

    card.className = `explanation-card ${isCorrect ? 'is-correct' : 'is-wrong'}`;
    card.innerHTML = `
      <div class="explanation-title">
        <span>${icon} ${headerText}</span>
      </div>
      <p class="explanation-body">${q.explanation}</p>
    `;
    card.style.display = 'block';
  }

  triggerPointsAnimation(text) {
    const floatElem = document.getElementById('points-floating-tag');
    if (floatElem) {
      floatElem.textContent = text;
      floatElem.classList.remove('animate-float');
      void floatElem.offsetWidth; // retrigger reflow
      floatElem.classList.add('animate-float');
    }
  }

  checkSurvivalOrShowNext() {
    if (this.gameMode === 'survival' && this.lives <= 0) {
      setTimeout(() => {
        alert("Game Over! You have exhausted all 3 lives.");
        this.finishQuiz();
      }, 1500);
      return;
    }

    const nextBtn = document.getElementById('btn-next-question');
    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      nextBtn.focus();
    }
  }

  nextQuestion() {
    window.soundEffects?.playClick();
    this.currentIndex++;
    if (this.currentIndex >= this.questions.length) {
      this.finishQuiz();
    } else {
      this.renderCurrentQuestion();
    }
  }

  // ==================== LIFELINES ====================
  updateLifelinesUI() {
    const map = [
      { id: 'btn-lifeline-5050', key: 'fiftyFifty' },
      { id: 'btn-lifeline-time', key: 'extraTime' },
      { id: 'btn-lifeline-hint', key: 'hint' },
      { id: 'btn-lifeline-skip', key: 'skip' }
    ];
    map.forEach(({ id, key }) => {
      const el = document.getElementById(id);
      if (el) {
        el.disabled = !this.lifelines[key];
        el.classList.toggle('used', !this.lifelines[key]);
      }
    });
  }

  useFiftyFifty() {
    if (!this.lifelines.fiftyFifty || this.hasAnsweredCurrent) return;
    const q = this.questions[this.currentIndex];
    if (q.type !== 'single') {
      alert("50:50 Eliminator can only be used on Multiple Choice Single-Select questions.");
      return;
    }

    this.lifelines.fiftyFifty = false;
    this.updateLifelinesUI();
    window.soundEffects?.playLifeline();

    // Pick 2 wrong answers to strike out
    const wrongIndices = [0, 1, 2, 3].filter(i => i !== q.answer);
    const shuffledWrong = this.shuffleArray(wrongIndices);
    const toEliminate = shuffledWrong.slice(0, 2);

    toEliminate.forEach(idx => {
      const btn = document.getElementById(`option-btn-${idx}`);
      if (btn) {
        btn.classList.add('eliminated');
        btn.disabled = true;
      }
    });
  }

  useExtraTime() {
    if (!this.lifelines.extraTime || this.hasAnsweredCurrent) return;
    if (this.gameMode === 'practice') return;

    this.lifelines.extraTime = false;
    this.updateLifelinesUI();
    window.soundEffects?.playLifeline();

    this.timeRemaining += 15;
    this.updateTimerDisplay();

    const circle = document.getElementById('timer-svg-circle');
    circle?.classList.add('time-bonus-glow');
    setTimeout(() => circle?.classList.remove('time-bonus-glow'), 800);
  }

  useHint() {
    if (!this.lifelines.hint || this.hasAnsweredCurrent) return;
    const q = this.questions[this.currentIndex];

    this.lifelines.hint = false;
    this.updateLifelinesUI();
    window.soundEffects?.playLifeline();

    const hintCard = document.getElementById('q-hint-card');
    if (hintCard) {
      hintCard.innerHTML = `
        <div class="hint-title">💡 Smart Hint:</div>
        <p class="hint-text">${q.hint || "Analyze the core concept and eliminate obvious outliers."}</p>
      `;
      hintCard.style.display = 'block';
    }
  }

  useSkip() {
    if (!this.lifelines.skip || this.hasAnsweredCurrent) return;
    this.lifelines.skip = false;
    this.updateLifelinesUI();
    window.soundEffects?.playLifeline();

    // Advance to next question with neutral record
    const q = this.questions[this.currentIndex];
    this.userAnswers.push({
      question: q.question,
      type: q.type,
      userAnswer: '(Skipped with Lifeline)',
      correctAnswer: this.getFormattedCorrectAnswer(q),
      isCorrect: null, // neutral
      pointsAwarded: 0,
      explanation: q.explanation
    });

    this.nextQuestion();
  }

  // ==================== RESULTS SCREEN ====================
  finishQuiz() {
    this.stopTimer();
    this.showScreen('result');

    const totalQuestions = this.userAnswers.length;
    const correctCount = this.userAnswers.filter(a => a.isCorrect === true).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const totalPossiblePoints = this.questions.reduce((sum, q) => sum + (q.points || 100), 0);

    // Calculate Grade
    let grade = 'C (Satisfactory)';
    let gradeBadgeClass = 'grade-c';
    if (accuracy >= 90) {
      grade = 'S-Rank Distinction 🏆';
      gradeBadgeClass = 'grade-s';
    } else if (accuracy >= 80) {
      grade = 'A+ Outstanding 🌟';
      gradeBadgeClass = 'grade-a-plus';
    } else if (accuracy >= 70) {
      grade = 'A Competent 🎯';
      gradeBadgeClass = 'grade-a';
    } else if (accuracy >= 60) {
      grade = 'B Proficient 👍';
      gradeBadgeClass = 'grade-b';
    }

    // Sound and Celebrations
    if (accuracy >= 70) {
      window.soundEffects?.playVictory();
      window.confetti?.celebrate();
    } else {
      window.soundEffects?.playCorrect();
    }

    // Populate Results Screen
    document.getElementById('res-score-number').textContent = this.score;
    document.getElementById('res-accuracy-number').textContent = `${accuracy}%`;
    document.getElementById('res-correct-number').textContent = `${correctCount} / ${totalQuestions}`;
    document.getElementById('res-streak-number').textContent = `${this.bestStreak}x`;
    document.getElementById('res-grade-badge').textContent = grade;
    document.getElementById('res-grade-badge').className = `result-grade-badge ${gradeBadgeClass}`;

    // Save to Leaderboard
    const candidateName = localStorage.getItem('apex_quiz_candidate_name') || 'Intern Candidate';
    window.storageManager.saveScore({
      name: candidateName,
      score: this.score,
      accuracy: accuracy,
      mode: this.gameMode.toUpperCase(),
      category: this.category
    });

    // Render Answer Review List
    this.renderReviewList('all');

    // Store summary for certificate
    this.lastResultData = {
      candidateName,
      score: this.score,
      totalPossible: totalPossiblePoints,
      accuracy,
      category: document.getElementById('select-category')?.options[document.getElementById('select-category').selectedIndex]?.text || 'Full-Stack Development',
      grade
    };
  }

  renderReviewList(filter = 'all') {
    const container = document.getElementById('review-items-container');
    if (!container) return;
    container.innerHTML = '';

    let items = this.userAnswers;
    if (filter === 'wrong') {
      items = items.filter(a => a.isCorrect === false);
    } else if (filter === 'correct') {
      items = items.filter(a => a.isCorrect === true);
    }

    if (items.length === 0) {
      container.innerHTML = `<div class="empty-review">No questions match the "${filter}" filter.</div>`;
      return;
    }

    items.forEach((item, idx) => {
      const card = document.createElement('div');
      const statusClass = item.isCorrect === true ? 'is-correct' : (item.isCorrect === false ? 'is-wrong' : 'is-skipped');
      const statusLabel = item.isCorrect === true ? 'Correct (+'+ item.pointsAwarded +' pts)' : (item.isCorrect === false ? 'Incorrect' : 'Skipped');

      card.className = `review-card ${statusClass}`;
      card.innerHTML = `
        <div class="review-card-header">
          <span class="review-num">#${idx + 1}</span>
          <span class="review-status-pill">${statusLabel}</span>
        </div>
        <h4 class="review-q-text">${item.question}</h4>
        <div class="review-answers-grid">
          <div class="review-answer-box your-answer ${item.isCorrect ? 'box-good' : 'box-bad'}">
            <span class="label">Your Answer:</span>
            <span class="val">${item.userAnswer}</span>
          </div>
          <div class="review-answer-box correct-answer">
            <span class="label">Correct Answer:</span>
            <span class="val">${item.correctAnswer}</span>
          </div>
        </div>
        <div class="review-explanation">
          <strong>Explanation:</strong> ${item.explanation}
        </div>
      `;
      container.appendChild(card);
    });

    // Review Filters buttons
    const filterBtns = document.querySelectorAll('.review-filter-btn');
    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
      btn.onclick = () => this.renderReviewList(btn.dataset.filter);
    });
  }

  showCertificate() {
    if (window.certificateGenerator && this.lastResultData) {
      window.certificateGenerator.show(this.lastResultData);
    }
  }

  // ==================== MODALS ====================
  openLeaderboard() {
    const list = window.storageManager.getLeaderboard();
    const modal = document.getElementById('leaderboard-modal-container');
    if (!modal) return;

    let rowsHTML = '';
    list.forEach((item, index) => {
      const rankBadge = index === 0 ? '🥇' : (index === 1 ? '🥈' : (index === 2 ? '🥉' : `#${index + 1}`));
      rowsHTML += `
        <tr class="${index < 3 ? 'top-tier' : ''}">
          <td class="cell-rank">${rankBadge}</td>
          <td class="cell-name"><strong>${item.name}</strong></td>
          <td class="cell-score"><span class="score-badge">${item.score}</span></td>
          <td class="cell-acc">${item.accuracy}%</td>
          <td class="cell-mode"><span class="mode-tag">${item.mode}</span></td>
          <td class="cell-date">${item.date}</td>
        </tr>
      `;
    });

    modal.innerHTML = `
      <div class="modal-overlay active">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3>🏆 Global Assessment Leaderboard</h3>
            <button class="modal-close-btn" id="btn-close-lb">✕</button>
          </div>
          <div class="modal-body">
            <table class="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Candidate</th>
                  <th>Score</th>
                  <th>Accuracy</th>
                  <th>Mode</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHTML || '<tr><td colspan="6" style="text-align:center;">No records yet!</td></tr>'}
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" id="btn-reset-lb">Reset Leaderboard</button>
            <button class="btn btn-primary btn-sm" id="btn-done-lb">Close</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-close-lb')?.addEventListener('click', () => modal.innerHTML = '');
    document.getElementById('btn-done-lb')?.addEventListener('click', () => modal.innerHTML = '');
    document.getElementById('btn-reset-lb')?.addEventListener('click', () => {
      if (confirm("Reset all stored scores?")) {
        window.storageManager.clearLeaderboard();
        this.openLeaderboard();
      }
    });
  }

  openProjectInfo() {
    const modal = document.getElementById('project-info-modal-container');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-overlay active">
        <div class="modal-dialog info-dialog">
          <div class="modal-header">
            <h3>📑 Internship Task 03 - Project Overview & Technical Report</h3>
            <button class="modal-close-btn" id="btn-close-info">✕</button>
          </div>
          <div class="modal-body project-report-content">
            <div class="report-badge-strip">
              <span class="report-badge">Task 03</span>
              <span class="report-badge">Full-Stack Quiz Application</span>
              <span class="report-badge success">Internship Ready</span>
            </div>

            <h4>🎯 Project Objective</h4>
            <p>Develop an interactive, full-featured quiz application that dynamically displays multi-type questions, gathers candidate responses, evaluates performance in real time with audio-visual feedback, and delivers in-depth post-quiz analytics alongside verified certification.</p>

            <h4>✨ Key Features Implemented</h4>
            <div class="report-feature-grid">
              <div class="report-feature-card">
                <h5>1. Diverse Question Types</h5>
                <p>Support for Single Choice, Multi-Select Checkboxes, Fill in the Blanks, and True/False decisions.</p>
              </div>
              <div class="report-feature-card">
                <h5>2. Dynamic SVG Countdown & Audio</h5>
                <p>Real-time circular countdown clock with warning states, powered by synthesized Web Audio API sound effects.</p>
              </div>
              <div class="report-feature-card">
                <h5>3. Four Lifelines & Power-Ups</h5>
                <p>50:50 Eliminator, +15s Extra Time, Smart Hints, and Question Skip mechanics.</p>
              </div>
              <div class="report-feature-card">
                <h5>4. 4 Game Modes</h5>
                <p>Classic Timed, 3-Lives Survival, Blitz Speed Run, and Practice Study Mode.</p>
              </div>
              <div class="report-feature-card">
                <h5>5. Verifiable Internship Certificate</h5>
                <p>High-resolution printable Certificate of Achievement with auto-generated credential ID, grades, and official seal.</p>
              </div>
              <div class="report-feature-card">
                <h5>6. Custom Question Creator & Local Storage</h5>
                <p>Allows mentors or candidates to add and persist their own questions and tracks local high scores.</p>
              </div>
            </div>

            <h4>🛠️ Architecture & Tech Stack</h4>
            <ul class="report-tech-list">
              <li><strong>HTML5:</strong> Semantic tags, accessible forms, audio visual layout.</li>
              <li><strong>CSS3:</strong> Modern Glassmorphism, CSS Custom Properties, flexbox/grid, keyframe animations, print media stylesheet.</li>
              <li><strong>Vanilla ES6+ JavaScript:</strong> Zero external frameworks or CDN dependencies for 100% offline reliability.</li>
              <li><strong>Web Audio API:</strong> Pure oscillator audio synthesis without external media files.</li>
              <li><strong>HTML5 Canvas:</strong> Custom physics-based particle confetti engine.</li>
            </ul>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" id="btn-done-info">Close Overview</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-close-info')?.addEventListener('click', () => modal.innerHTML = '');
    document.getElementById('btn-done-info')?.addEventListener('click', () => modal.innerHTML = '');
  }

  openCustomCreator() {
    const modal = document.getElementById('custom-creator-modal-container');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-overlay active">
        <div class="modal-dialog creator-dialog">
          <div class="modal-header">
            <h3>➕ Add Custom Quiz Question</h3>
            <button class="modal-close-btn" id="btn-close-creator">✕</button>
          </div>
          <div class="modal-body">
            <form id="form-create-question" class="creator-form">
              <div class="form-row">
                <div class="form-col">
                  <label>Category:</label>
                  <select id="cq-category" class="form-control">
                    <option value="webdev">Web Development</option>
                    <option value="cs">Computer Science</option>
                    <option value="tech">Tech & AI Trivia</option>
                    <option value="general">Science & General</option>
                  </select>
                </div>
                <div class="form-col">
                  <label>Difficulty:</label>
                  <select id="cq-difficulty" class="form-control">
                    <option value="easy">Easy (100 pts)</option>
                    <option value="medium" selected>Medium (150 pts)</option>
                    <option value="hard">Hard (200 pts)</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>Question Text:</label>
                <textarea id="cq-question" class="form-control" rows="2" placeholder="Enter your question here..." required></textarea>
              </div>

              <div class="form-group">
                <label>Question Type:</label>
                <select id="cq-type" class="form-control">
                  <option value="single">Single Choice (4 options)</option>
                  <option value="fill">Fill in the Blank</option>
                </select>
              </div>

              <div id="cq-single-fields">
                <div class="form-group">
                  <label>Option A (Correct Answer):</label>
                  <input type="text" id="cq-opt-0" class="form-control" placeholder="Correct answer here" required />
                </div>
                <div class="form-group">
                  <label>Option B (Incorrect):</label>
                  <input type="text" id="cq-opt-1" class="form-control" placeholder="Distractor 1" required />
                </div>
                <div class="form-group">
                  <label>Option C (Incorrect):</label>
                  <input type="text" id="cq-opt-2" class="form-control" placeholder="Distractor 2" required />
                </div>
                <div class="form-group">
                  <label>Option D (Incorrect):</label>
                  <input type="text" id="cq-opt-3" class="form-control" placeholder="Distractor 3" required />
                </div>
              </div>

              <div id="cq-fill-fields" style="display: none;">
                <div class="form-group">
                  <label>Accepted Answer (Case-insensitive):</label>
                  <input type="text" id="cq-fill-ans" class="form-control" placeholder="e.g. JavaScript" />
                </div>
              </div>

              <div class="form-group">
                <label>Educational Explanation:</label>
                <textarea id="cq-explanation" class="form-control" rows="2" placeholder="Why is this answer correct?" required></textarea>
              </div>

              <div class="form-group">
                <label>Helpful Hint:</label>
                <input type="text" id="cq-hint" class="form-control" placeholder="Brief clue for candidate..." />
              </div>

              <div class="modal-footer">
                <button type="submit" class="btn btn-primary">Save & Add to Pool</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    const typeSelect = document.getElementById('cq-type');
    const singleFields = document.getElementById('cq-single-fields');
    const fillFields = document.getElementById('cq-fill-fields');

    typeSelect?.addEventListener('change', () => {
      if (typeSelect.value === 'single') {
        singleFields.style.display = 'block';
        fillFields.style.display = 'none';
      } else {
        singleFields.style.display = 'none';
        fillFields.style.display = 'block';
      }
    });

    document.getElementById('btn-close-creator')?.addEventListener('click', () => modal.innerHTML = '');

    const form = document.getElementById('form-create-question');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = typeSelect.value;
      const pointsMap = { easy: 100, medium: 150, hard: 200 };
      const diff = document.getElementById('cq-difficulty').value;

      let newQ = {
        category: document.getElementById('cq-category').value,
        type: type,
        difficulty: diff,
        points: pointsMap[diff],
        question: document.getElementById('cq-question').value.trim(),
        explanation: document.getElementById('cq-explanation').value.trim(),
        hint: document.getElementById('cq-hint').value.trim()
      };

      if (type === 'single') {
        const opt0 = document.getElementById('cq-opt-0').value.trim();
        const opt1 = document.getElementById('cq-opt-1').value.trim();
        const opt2 = document.getElementById('cq-opt-2').value.trim();
        const opt3 = document.getElementById('cq-opt-3').value.trim();

        // Shuffle options so Option A is not always in position 0
        const options = [opt0, opt1, opt2, opt3];
        const correctText = opt0;
        const shuffled = this.shuffleArray([...options]);
        newQ.options = shuffled;
        newQ.answer = shuffled.indexOf(correctText);
      } else {
        const ans = document.getElementById('cq-fill-ans').value.trim();
        newQ.placeholder = "Type your answer...";
        newQ.acceptedAnswers = [ans];
      }

      window.storageManager.saveCustomQuestion(newQ);
      modal.innerHTML = '';
      this.renderCustomQuestionsSummary();
      alert("Custom question successfully saved to question pool!");
    });
  }

  renderCustomQuestionsSummary() {
    const customCount = window.storageManager.getCustomQuestions().length;
    const badge = document.getElementById('custom-questions-badge');
    if (badge) {
      badge.textContent = `${customCount} Custom Questions Available`;
    }
  }
}

// Initialize Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.quizApp = new QuizApp();
});
