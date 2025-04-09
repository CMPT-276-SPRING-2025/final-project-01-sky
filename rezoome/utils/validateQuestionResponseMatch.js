function validateQuestionResponseMatch(responses, questions) {
  // check if both responses and questions are arrays
  if (!Array.isArray(responses) || !Array.isArray(questions)) {
    return false; // invalid if either input is not an array
  }

  // return true only if both arrays are the same length
  // this ensures each question has a matching response
  return responses.length === questions.length;
}

// export the function so it can be reused or tested elsewhere
module.exports = { validateQuestionResponseMatch };
