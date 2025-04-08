function uploadToAffinda(file) {
    // return error if no file
    if (!file) return { status: 400, error: "no file uploaded" };
  
    // only allow pdf and docx
    const allowedExtensions = [".pdf", ".docx"];
    const maxSize = 5 * 1024 * 1024; // 5mb
  
    // get file extension
    const ext = file.name?.slice(file.name.lastIndexOf(".")).toLowerCase();
  
    // reject unsupported file types
    if (!allowedExtensions.includes(ext)) return { status: 400, error: "unsupported file type" };
  
    // reject files that are too big
    if (file.size > maxSize) return { status: 400, error: "file too large" };
  
    // return mock parsed resume
    return {
      status: 200,
      parsedData: {
        name: "jane doe",
        work: [],
        skills: []
      }
    };
  }
  
  module.exports = { uploadToAffinda };
  