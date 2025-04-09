// converts a 0-based index (used in arrays) to a 1-based step number for UI display
function getCurrentStep(index) {
  return index + 1; // example: index 0 becomes step 1
}

// checks if all four responses are valid and meaningful
function isAllAnswered(responses) {
  return responses.filter(
    (r) =>
      r && // not null or undefined
      r.trim() !== "" && // not empty or just spaces
      !["no response", "unintelligible"].includes(r.toLowerCase()) // not a placeholder
  ).length === 4; // must be exactly four valid answers
}

// checks if at least one of the responses is valid and meaningful
function hasAnyAnswered(responses) {
  return responses.some(
    (r) =>
      r && // not null or undefined
      r.trim() !== "" && // not empty or just spaces
      !["no response", "unintelligible"].includes(r.toLowerCase()) // not a placeholder
  );
}

// export all functions so they can be used in other parts of the app or tested
module.exports = {
  getCurrentStep,
  isAllAnswered,
  hasAnyAnswered
};
