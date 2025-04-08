const {
    loadStoredQuestions,
    loadStoredResponses,
    saveQuestions,
    saveResponses
  } = require('../utils/localStorageUtils');

  // mock localStorage globally
global.localStorage = {
    store: {},
    getItem(key) {
      return this.store[key] || null;
    },
    setItem(key, value) {
      this.store[key] = String(value);
    },
    clear() {
      this.store = {};
    },
  };
  
  
  describe('localStorage behavior', () => {
    beforeEach(() => {
      localStorage.clear();
    });
  
    // saves and loads questions
    it('saves and retrieves mock interview questions', () => {
      const questions = ['question 1', 'question 2'];
      saveQuestions(questions);
      const loaded = loadStoredQuestions();
      expect(loaded).toEqual(questions);
    });
  
    // saves and loads responses
    it('saves and retrieves user responses', () => {
      const responses = ['answer 1', null, 'answer 3', ''];
      saveResponses(responses);
      const loaded = loadStoredResponses();
      expect(loaded).toEqual(responses);
    });
  
    // handles no data in storage
    it('returns empty array if no questions in localStorage', () => {
      const loaded = loadStoredQuestions();
      expect(loaded).toEqual([]);
    });
  
    // returns default array of nulls if no responses stored
    it('returns [null, null, null, null] if no responses stored', () => {
      const loaded = loadStoredResponses();
      expect(loaded).toEqual([null, null, null, null]);
    });
  });
  