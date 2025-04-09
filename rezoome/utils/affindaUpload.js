function uploadToAffinda(file) {
  // return error if no file is provided
  if (!file) return { status: 400, error: "no file uploaded" };

  // only allow certain file types (pdf and docx)
  const allowedExtensions = [".pdf", ".docx"];

  // maximum allowed file size is 5 megabytes
  const maxSize = 5 * 1024 * 1024;

  // extract file extension from the file name (e.g., ".pdf")
  const ext = file.name?.slice(file.name.lastIndexOf(".")).toLowerCase();

  // return error if the file type is not supported
  if (!allowedExtensions.includes(ext)) return { status: 400, error: "unsupported file type" };

  // return error if the file is too large
  if (file.size > maxSize) return { status: 400, error: "file too large" };

  // simulate a successful resume upload and parsing response
  return {
    status: 200, // success status
    parsedData: {
      name: "jane doe", // mock extracted name from resume
      work: [], // mock work experience (empty for now)
      skills: [] // mock skills (empty for now)
    }
  };
}

// export the function so it can be tested or used in other parts of the app
module.exports = { uploadToAffinda };
