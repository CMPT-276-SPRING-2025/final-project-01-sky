const { requestMicAccess } = require('../utils/requestMic');

describe('requestMicAccess', () => {
  // user allows mic access
  it('returns granted: true when mic is allowed', async () => {
    const mockStream = { id: '123' };
    global.navigator.mediaDevices = {
      getUserMedia: jest.fn(() => Promise.resolve(mockStream)),
    };

    const result = await requestMicAccess();
    expect(result.granted).toBe(true);
    expect(result.stream).toBe(mockStream);
  });

  // user denies mic access
  it('returns granted: false when mic is denied', async () => {
    global.navigator.mediaDevices = {
      getUserMedia: jest.fn(() =>
        Promise.reject(new DOMException('permission denied', 'NotAllowedError'))
      ),
    };

    const result = await requestMicAccess();
    expect(result.granted).toBe(false);
    expect(result.error.name).toBe('NotAllowedError');
  });
});
