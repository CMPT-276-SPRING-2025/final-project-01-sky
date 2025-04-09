// import the uploadToAffinda function from the utils directory
// this file is used to test the uploadToAffinda function
// Output: parsed resume data or error object
const { uploadToAffinda } = require('../utils/affindaUpload');

// group of tests for the uploadToAffinda function
describe('uploadToAffinda', () => {
  // test case: when no file is provided, the function should return a 400 error
  it('returns 400 if no file is uploaded', () => {
    const result = uploadToAffinda(null); //input is null
    expect(result.status).toBe(400); //output is 400 which indicates a bad request
  });

  // test case: when the file is not supported, the function should return a 400 error
  it('returns 400 if file has invalid extension (.jpg)', () => {
    const result = uploadToAffinda({ name: "resume.jpg", size: 300_000 }); // input: jpg file
    expect(result.status).toBe(400);  // output: 400 status due to unsupported file type
  });

  // test case: when the file size exceeds the allowed limit (e.g., more than 10mb), return a 400 error
  it('returns 400 if file size is too large (10mb+)', () => {
    const result = uploadToAffinda({ name: "resume.pdf", size: 15_000_000 }); // input: oversized pdf
    expect(result.status).toBe(400); // output: 400 status due to file size limit
  });

    // test case: when a valid pdf file is uploaded (correct extension and size), return 200 and parsed data
  it('returns 200 if file is valid pdf with proper size', () => {
    const result = uploadToAffinda({ name: "resume.pdf", size: 300_000 }); // input: valid pdf file
    expect(result.status).toBe(200);  // output: 200 status means success
    expect(result.parsedData).toBeDefined(); // output: parsed data object should exist
    expect(result.parsedData.name).toBe("jane doe"); // output: sample field from parsed data
  });

  // test case: when a valid docx file is uploaded, return 200
  it('returns 200 if file is .docx and valid size', () => {
    const result = uploadToAffinda({ name: "resume.docx", size: 100_000 }); // input: valid docx file
    expect(result.status).toBe(200); // output: 200 status means success

  });
});
