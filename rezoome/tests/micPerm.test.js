// import the requestMicAccess function that asks the browser for microphone permissions
const { requestMicAccess } = require('../utils/requestMic');

// test suite for microphone permission behavior
describe('requestMicAccess', () => {

  // make sure global.navigator exists before setting mediaDevices
  beforeEach(() => {
    if (!global.navigator) {
      global.navigator = {}; // create navigator if missing (useful in node test environments)
    }
  });

  // test case: user allows mic access, and getUserMedia resolves successfully
  it('returns granted: true when mic is allowed', async () => {
    const mockStream = { id: '123' }; // simulate a stream object returned from getUserMedia

    // mock getUserMedia to return the stream without error
    global.navigator.mediaDevices = {
      getUserMedia: jest.fn(() => Promise.resolve(mockStream)),
    };

    const result = await requestMicAccess(); // call the function

    // expected output: granted is true, and stream matches the mocked stream
    expect(result.granted).toBe(true);
    expect(result.stream).toBe(mockStream);
  });

  // test case: user denies mic access, getUserMedia throws a NotAllowedError
  it('returns granted: false when mic is denied', async () => {
    // mock getUserMedia to reject with a DOMException
    global.navigator.mediaDevices = {
      getUserMedia: jest.fn(() =>
        Promise.reject(new DOMException('permission denied', 'NotAllowedError'))
      ),
    };

    const result = await requestMicAccess(); // call the function

    // expected output: granted is false, and error name matches the denial reason
    expect(result.granted).toBe(false);
    expect(result.error.name).toBe('NotAllowedError');
  });

});
