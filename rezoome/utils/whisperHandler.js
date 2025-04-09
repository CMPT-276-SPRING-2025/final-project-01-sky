function whisperHandler(fileBlob) {
  // return error if no file is provided or if input is not a valid Blob
  if (!fileBlob || typeof fileBlob === 'string') {
    return { status: 400, error: "No valid file uploaded" };
  }

  // return error if the file is too small (likely silent or empty)
  if (fileBlob.size < 1000) {
    return { status: 400, error: "Silent or too short" };
  }

  // simulate a successful transcription for valid audio blobs
  return {
    status: 200, // success
    transcription: "This is a mocked transcription" // placeholder transcript
  };
}

// export the function for use in handlers or testing
module.exports = { whisperHandler };
