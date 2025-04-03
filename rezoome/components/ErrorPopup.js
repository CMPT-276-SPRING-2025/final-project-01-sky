const ErrorPopup = ({ message, onClose }) => {
    if (!message) return null; // Don't render if no error
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-bold text-red-600">Error</h2>
          <p className="text-gray-700 mt-2">{message}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            OK, Got it
          </button>
        </div>
      </div>
    );
  };
  
  export default ErrorPopup;
  