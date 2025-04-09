// loads stored mock interview questions from localStorage
function loadStoredQuestions() {
  const stored = localStorage.getItem("mockInterviewQuestions"); // get saved questions string
  return stored ? JSON.parse(stored) : []; // return parsed array or empty array if nothing found
}

// loads stored user responses from localStorage
function loadStoredResponses() {
  const stored = localStorage.getItem("mockInterviewResponses"); // get saved responses string
  return stored ? JSON.parse(stored) : [null, null, null, null]; // default to 4 empty responses
}

// saves an array of responses to localStorage
function saveResponses(responses) {
  localStorage.setItem("mockInterviewResponses", JSON.stringify(responses)); // store stringified version
}

// saves an array of questions to localStorage
function saveQuestions(questions) {
  localStorage.setItem("mockInterviewQuestions", JSON.stringify(questions)); // store stringified version
}

// export all localStorage utility functions for reuse and testing
module.exports = {
  loadStoredQuestions,
  loadStoredResponses,
  saveResponses,
  saveQuestions
};
