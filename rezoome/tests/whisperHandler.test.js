// import the whisperHandler function that handles audio blobs and returns transcriptions
const { whisperHandler } = require('../utils/whisperHandler');

// test suite for validating audio input to the whisperHandler utility
describe('whisperHandler', () => {

  // test case: returns 200 and a mock transcription if the blob is valid
  it('returns 200 and mock transcription for a valid blob', () => {
    const validBlob = new Blob(["some fake audio data"], { type: 'audio/webm' }); // simulate valid audio blob
    Object.defineProperty(validBlob, 'size', { value: 2000 }); // mock size to simulate real audio

    const result = whisperHandler(validBlob); // call function with valid blob

    expect(result.status).toBe(200); // output: valid response
    expect(result.transcription).toMatch(/transcription/i); // transcription string should be returned
  });

  // test case: returns 400 if no blob is provided
  it('returns 400 if no blob is passed', () => {
    const result = whisperHandler(null); // input: null
    expect(result.status).toBe(400); // output: invalid due to missing file
    expect(result.error).toMatch(/no valid file/i); // output: should explain that input was not valid
  });

  // test case: returns 400 if input is not a blob (e.g. just a string)
  it('returns 400 if blob is a string', () => {
    const result = whisperHandler("not a blob"); // input: wrong type
    expect(result.status).toBe(400); // output: invalid
    expect(result.error).toMatch(/no valid file/i); // output: descriptive error
  });

  // test case: returns 400 if blob is too small (likely silent or empty)
  it('returns 400 for a very small/silent blob', () => {
    const silentBlob = new Blob([""], { type: 'audio/webm' }); // simulate nearly empty blob
    Object.defineProperty(silentBlob, 'size', { value: 500 }); // mock small file size

    const result = whisperHandler(silentBlob); // process silent blob

    expect(result.status).toBe(400); // output: reject small files
    expect(result.error).toMatch(/silent/i); // error message should reference silence
  });

  // test case: returns 200 even if mime type is not audio, as long as size is big enough
  it('returns 200 even if mime type is wrong but size is large', () => {
    const blob = new Blob(["data"], { type: 'text/plain' }); // input: wrong type
    Object.defineProperty(blob, 'size', { value: 2000 }); // simulate large file size

    const result = whisperHandler(blob); // process blob

    expect(result.status).toBe(200); // output: accepted due to size even if mime is unusual
  });

});
