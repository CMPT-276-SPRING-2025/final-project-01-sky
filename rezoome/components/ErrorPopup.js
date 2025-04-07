import React from "react";

export default function ErrorPopup({
  title = "Error",
  message = "Something went wrong.",
  fileName,
  fileSize,
  onClose,
  buttonText = "OK, got it"
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dimmed background */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      {/* Modal content */}
      <div className="relative z-10 bg-white rounded-xl shadow-lg w-full max-w-md px-6 py-5">
        {/* Close (X) icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-sm"
          aria-label="Close popup"
        >
          ✖
        </button>

        {/* Title */}
        <h2 className="text-sm font-semibold text-red-600 mb-2">
          {title}
        </h2>

        {/* File info */}
        {fileName && (
          <p className="text-sm text-gray-700 mb-1">
            <strong>{fileName}</strong>{fileSize && ` (${fileSize})`}
          </p>
        )}

        {/* Message */}
        <p className="text-sm text-gray-600 mb-6">{message}</p>

        {/* Confirm button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
