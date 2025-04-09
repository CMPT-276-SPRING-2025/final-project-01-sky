function validateJobPosting(text) {
  // return false if text is missing, not a string, or too short
  if (!text || typeof text !== "string" || text.trim().length < 30) {
    return false;
  }

  // keywords that are commonly found in job postings
  const keywords = [
    "responsibilities",
    "qualifications",
    "requirements",
    "role",
    "position",
    "skills",
  ];

  // clean and normalize the input text
  const plainText = text
    .toLowerCase() // convert to lowercase for case-insensitive matching
    .replace(/<\/?[^>]+(>|$)/g, "") // remove html tags
    .replace(/[^\w\s]/g, ""); // remove punctuation and special characters

  // return true if at least one keyword is found in the text
  return keywords.some((keyword) => plainText.includes(keyword));
}

// export the function so it can be reused or tested
module.exports = { validateJobPosting };
