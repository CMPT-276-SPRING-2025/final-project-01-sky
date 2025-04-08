const { whisperHandler } = require('../utils/whisperHandler');

describe('whisperHandler', () => {
  // returns 200 if the blob is valid
  it('returns 200 and mock transcription for a valid blob', () => {
    const validBlob = new Blob(["some fake audio data"], { type: 'audio/webm' });
    Object.defineProperty(validBlob, 'size', { value: 2000 }); // mock valid size
    const result = whisperHandler(validBlob);
    expect(result.status).toBe(200);
    expect(result.transcription).toMatch(/transcription/i);
  });

  // returns 400 if no blob is passed
  it('returns 400 if no blob is passed', () => {
    const result = whisperHandler(null);
    expect(result.status).toBe(400);
    expect(result.error).toMatch(/no valid file/i);
  });

  // returns 400 if blob is not a real blob
  it('returns 400 if blob is a string', () => {
    const result = whisperHandler("not a blob");
    expect(result.status).toBe(400);
    expect(result.error).toMatch(/no valid file/i);
  });

  // returns 400 if blob is very small (silent)
  it('returns 400 for a very small/silent blob', () => {
    const silentBlob = new Blob([""], { type: 'audio/webm' });
    Object.defineProperty(silentBlob, 'size', { value: 500 }); // simulate small blob
    const result = whisperHandler(silentBlob);
    expect(result.status).toBe(400);
    expect(result.error).toMatch(/silent/i);
  });

  // edge case: large blob with wrong mime type still returns 200
  it('returns 200 even if mime type is wrong but size is large', () => {
    const blob = new Blob(["data"], { type: 'text/plain' });
    Object.defineProperty(blob, 'size', { value: 2000 });
    const result = whisperHandler(blob);
    expect(result.status).toBe(200);
  });
});
