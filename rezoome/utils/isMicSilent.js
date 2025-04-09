// utils/isMicSilent.js

// checks if a microphone recording is silent based on the blob's size
function isMicSilent(blob, thresholdSize = 1000) {
  // return true if no blob is provided or the size is zero
  if (!blob || blob.size === 0) return true;

  // if the blob is smaller than the threshold, treat it as silent
  // small blobs usually mean little or no speech was detected
  return blob.size < thresholdSize;
}

// export the function so it can be used or tested in other parts of the app
module.exports = { isMicSilent };
