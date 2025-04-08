const { isMicSilent } = require('../utils/isMicSilent');

describe('isMicSilent', () => {
  // no audio at all
  it('returns true for an empty blob', () => {
    const blob = new Blob([]);
    expect(isMicSilent(blob)).toBe(true);
  });

  // very small audio file, probably silent
  it('returns true for a very small blob (likely silent)', () => {
    const smallBlob = new Blob([''], { type: 'audio/webm' });
    Object.defineProperty(smallBlob, 'size', { value: 500 }); // fake small size
    expect(isMicSilent(smallBlob)).toBe(true);
  });

  // blob has real content
  it('returns false for a blob with actual audio data', () => {
    const bigBlob = new Blob(['real audio data'], { type: 'audio/webm' });
    Object.defineProperty(bigBlob, 'size', { value: 2000 }); // fake real size
    expect(isMicSilent(bigBlob)).toBe(false);
  });
});
