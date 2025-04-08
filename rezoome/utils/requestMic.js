// utils/requestMic.js

async function requestMicAccess() {
    try {
      // try to get mic access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return { granted: true, stream };
    } catch (error) {
      // return error if permission is denied or fails
      return { granted: false, error };
    }
  }
  
  module.exports = { requestMicAccess };
  