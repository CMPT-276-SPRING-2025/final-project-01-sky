function getCurrentStep(index) {
    return index + 1; // 0-based index to 1-based step
  }
  
  function isAllAnswered(responses) {
    return responses.filter(
      (r) => r && r.trim() !== "" && !["no response", "unintelligible"].includes(r.toLowerCase())
    ).length === 4;
  }
  
  function hasAnyAnswered(responses) {
    return responses.some(
      (r) => r && r.trim() !== "" && !["no response", "unintelligible"].includes(r.toLowerCase())
    );
  }
  
  module.exports = {
    getCurrentStep,
    isAllAnswered,
    hasAnyAnswered
  };
  