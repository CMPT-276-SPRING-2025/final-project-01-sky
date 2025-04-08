function whisperHandler(fileBlob) {
    if (!fileBlob || typeof fileBlob === 'string') {
      return { status: 400, error: "No valid file uploaded" };
    }
  
    if (fileBlob.size < 1000) {
      return { status: 400, error: "Silent or too short" };
    }
  
    return {
      status: 200,
      transcription: "This is a mocked transcription"
    };
  }
  
  module.exports = { whisperHandler };
  