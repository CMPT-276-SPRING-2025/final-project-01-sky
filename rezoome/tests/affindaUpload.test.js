const { uploadToAffinda } = require('../utils/affindaUpload');

describe('uploadToAffinda', () => {
  // no file provided
  it('returns 400 if no file is uploaded', () => {
    const result = uploadToAffinda(null);
    expect(result.status).toBe(400);
  });

  // unsupported file type
  it('returns 400 if file has invalid extension (.jpg)', () => {
    const result = uploadToAffinda({ name: "resume.jpg", size: 300_000 });
    expect(result.status).toBe(400);
  });

  // file too large
  it('returns 400 if file size is too large (10mb+)', () => {
    const result = uploadToAffinda({ name: "resume.pdf", size: 15_000_000 });
    expect(result.status).toBe(400);
  });

  // valid pdf
  it('returns 200 if file is valid pdf with proper size', () => {
    const result = uploadToAffinda({ name: "resume.pdf", size: 300_000 });
    expect(result.status).toBe(200);
    expect(result.parsedData).toBeDefined();
    expect(result.parsedData.name).toBe("jane doe");
  });

  // valid docx
  it('returns 200 if file is .docx and valid size', () => {
    const result = uploadToAffinda({ name: "resume.docx", size: 100_000 });
    expect(result.status).toBe(200);
  });
});
