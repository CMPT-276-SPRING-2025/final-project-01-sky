// utils/requestMic.js

// requests access to the user's microphone
async function requestMicAccess() {
  try {
    // try to access the user's microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // if successful, return the media stream and a granted flag
    return { granted: true, stream };
  } catch (error) {
    // if access is denied or fails, return an error and set granted to false
    return { granted: false, error };
  }
}

// export the function so it can be used in components or tested
module.exports = { requestMicAccess };
