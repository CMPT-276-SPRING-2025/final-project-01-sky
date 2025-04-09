// import the utility functions for saving and loading data from localStorage
const {
  loadStoredQuestions,
  loadStoredResponses,
  saveQuestions,
  saveResponses
} = require('../utils/localStorageUtils');

// mock localStorage object globally for testing purposes
global.localStorage = {
  store: {}, // stores key-value pairs in memory
  getItem(key) {
    return this.store[key] || null; // return stored value or null if key doesn't exist
  },
  setItem(key, value) {
    this.store[key] = String(value); // convert values to strings before saving
  },
  clear() {
    this.store = {}; // reset storage
  },
};

// test suite for verifying localStorage utility behavior
describe('localStorage behavior', () => {

  // before each test, clear the localStorage mock so tests are isolated
  beforeEach(() => {
    localStorage.clear();
  });

  // test case: should save and load an array of mock interview questions
  it('saves and retrieves mock interview questions', () => {
    const questions = ['question 1', 'question 2']; // sample input
    saveQuestions(questions); // store questions
    const loaded = loadStoredQuestions(); // retrieve from mock storage
    expect(loaded).toEqual(questions); // output should match input
  });

  // test case: should save and load an array of user responses
  it('saves and retrieves user responses', () => {
    const responses = ['answer 1', null, 'answer 3', '']; // mix of valid and empty inputs
    saveResponses(responses); // store responses
    const loaded = loadStoredResponses(); // retrieve from storage
    expect(loaded).toEqual(responses); // output should match input
  });

  // test case: if no questions are in storage, return an empty array
  it('returns empty array if no questions in localStorage', () => {
    const loaded = loadStoredQuestions(); // no data saved beforehand
    expect(loaded).toEqual([]); // output: default empty array
  });

  // test case: if no responses are in storage, return default array of four null values
  it('returns [null, null, null, null] if no responses stored', () => {
    const loaded = loadStoredResponses(); // no saved data
    expect(loaded).toEqual([null, null, null, null]); // default value for 4-question setup
  });

});
