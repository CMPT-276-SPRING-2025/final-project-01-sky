// utils/isMicSilent.js

function isMicSilent(blob, thresholdSize = 1000) {
    if (!blob || blob.size === 0) return true;
  
    // If the audio file is super small (likely no speech), consider it silent
    return blob.size < thresholdSize;
  }
  
  module.exports = { isMicSilent };
  