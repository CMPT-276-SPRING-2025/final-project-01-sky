function validateFeedbackInput(storage) {
  try {
    // try to parse the stored responses from localStorage
    const responses = JSON.parse(storage.mockInterviewResponses);

    // check if parsed data is a non-empty array
    if (!Array.isArray(responses) || responses.length === 0) {
      return false; // invalid if not an array or if it's empty
    }

    // valid input: parsed successfully and contains responses
    return true;
  } catch (err) {
    // if JSON parsing fails or input is malformed, return false
    return false;
  }
}

// export the function so it can be used or tested elsewhere
module.exports = { validateFeedbackInput };
