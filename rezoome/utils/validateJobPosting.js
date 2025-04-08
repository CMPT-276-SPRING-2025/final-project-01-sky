function validateJobPosting(text) {
    if (!text || typeof text !== "string" || text.trim().length < 30) {
      return false;
    }
  
    const keywords = [
      "responsibilities",
      "qualifications",
      "requirements",
      "role",
      "position",
      "skills",
    ];
  
    // clean and normalize text
    const plainText = text
      .toLowerCase()
      .replace(/<\/?[^>]+(>|$)/g, "")     // remove html tags
      .replace(/[^\w\s]/g, "");           // remove special characters
  
    // check for presence of at least one keyword
    return keywords.some((keyword) => plainText.includes(keyword));
  }
  
  module.exports = { validateJobPosting };
  