/**
 * Local Storage & State Persistence Manager
 */
class StorageManager {
  constructor() {
    this.KEYS = {
      CUSTOM_QUESTIONS: 'apex_quiz_custom_questions',
      LEADERBOARD: 'apex_quiz_leaderboard',
      USER_PROFILE: 'apex_quiz_profile',
      GAME_SETTINGS: 'apex_quiz_settings'
    };
  }

  // Question Management
  getAllQuestions() {
    const custom = this.getCustomQuestions();
    return [...(window.DEFAULT_QUESTIONS || []), ...custom];
  }

  getCustomQuestions() {
    try {
      const data = localStorage.getItem(this.KEYS.CUSTOM_QUESTIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading custom questions', e);
      return [];
    }
  }

  saveCustomQuestion(questionObj) {
    const list = this.getCustomQuestions();
    questionObj.id = 'custom-' + Date.now();
    list.unshift(questionObj);
    localStorage.setItem(this.KEYS.CUSTOM_QUESTIONS, JSON.stringify(list));
    return questionObj;
  }

  deleteCustomQuestion(id) {
    let list = this.getCustomQuestions();
    list = list.filter(q => q.id !== id);
    localStorage.setItem(this.KEYS.CUSTOM_QUESTIONS, JSON.stringify(list));
    return list;
  }

  // Leaderboard Management
  getLeaderboard() {
    try {
      const data = localStorage.getItem(this.KEYS.LEADERBOARD);
      if (data) return JSON.parse(data);
      // Sample mock leaderboard entries for rich visual presentation
      return [
        { name: 'Alex Rivera', score: 1850, accuracy: 100, mode: 'Classic', category: 'webdev', date: '2026-10-20' },
        { name: 'Priya Sharma', score: 1620, accuracy: 90, mode: 'Blitz', category: 'cs', date: '2026-10-21' },
        { name: 'Devon Vance', score: 1480, accuracy: 85, mode: 'Survival', category: 'all', date: '2026-10-22' }
      ];
    } catch (e) {
      return [];
    }
  }

  saveScore(entry) {
    const list = this.getLeaderboard();
    const newEntry = {
      name: entry.name || 'Anonymous Learner',
      score: entry.score || 0,
      accuracy: Math.round(entry.accuracy || 0),
      mode: entry.mode || 'Classic',
      category: entry.category || 'all',
      date: new Date().toISOString().split('T')[0]
    };
    list.push(newEntry);
    list.sort((a, b) => b.score - a.score);
    const topList = list.slice(0, 15); // keep top 15
    localStorage.setItem(this.KEYS.LEADERBOARD, JSON.stringify(topList));
    return topList;
  }

  clearLeaderboard() {
    localStorage.removeItem(this.KEYS.LEADERBOARD);
  }

  // Settings
  getSettings() {
    try {
      const data = localStorage.getItem(this.KEYS.GAME_SETTINGS);
      return data ? JSON.parse(data) : {
        questionCount: 10,
        timePerQuestion: 25,
        theme: 'dark-cyber',
        sound: true
      };
    } catch (e) {
      return { questionCount: 10, timePerQuestion: 25 };
    }
  }

  saveSettings(settings) {
    localStorage.setItem(this.KEYS.GAME_SETTINGS, JSON.stringify(settings));
  }
}

window.storageManager = new StorageManager();
