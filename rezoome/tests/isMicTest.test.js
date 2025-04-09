// import the isMicSilent utility function used to check if a recorded audio blob contains sound
const { isMicSilent } = require('../utils/isMicSilent');

// test suite for the isMicSilent function
describe('isMicSilent', () => {

  // test case: returns true if the blob has no audio data at all
  it('returns true for an empty blob', () => {
    const blob = new Blob([]); // input: blob with no content
    expect(isMicSilent(blob)).toBe(true); // output: true because no audio is present
  });

  // test case: returns true if the blob is very small (suggesting no significant audio was captured)
  it('returns true for a very small blob (likely silent)', () => {
    const smallBlob = new Blob([''], { type: 'audio/webm' }); // input: nearly empty audio blob
    Object.defineProperty(smallBlob, 'size', { value: 500 }); // simulate small file size under threshold
    expect(isMicSilent(smallBlob)).toBe(true); // output: true since it's too small to contain meaningful audio
  });

  // test case: returns false if the blob has enough data to be considered non-silent
  it('returns false for a blob with actual audio data', () => {
    const bigBlob = new Blob(['real audio data'], { type: 'audio/webm' }); // input: simulated real audio
    Object.defineProperty(bigBlob, 'size', { value: 2000 }); // simulate larger file size
    expect(isMicSilent(bigBlob)).toBe(false); // output: false because the size suggests real audio was captured
  });

});
