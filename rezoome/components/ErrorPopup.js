import React from "react";

export default function ErrorPopup({
  title = "Are you sure?",
  message = "You haven't answered all the questions.",
  onClose,
  onConfirm,
  buttonText = "Continue",
  cancelText = "Go Back"
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dimmed background */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      {/* Modal content */}
      <div className="relative z-10 bg-white rounded-xl shadow-lg w-full max-w-md px-6 py-5">
        {/* Title */}
        <h2 className="text-base font-semibold text-red-600 mb-2">
          {title}
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-6">{message}</p>

        {/* Confirm + Cancel buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded hover:bg-[var(--second-button-colour)] transition hover:text-white cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-[var(--second-button-colour)] transition cursor-pointer"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
