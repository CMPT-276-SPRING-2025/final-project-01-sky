import { useRef } from "react";

const FileUpload = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-[980px] h-[261px] bg-white rounded-lg flex justify-center items-center relative cursor-pointer"
    >
      <input
        ref={fileInputRef}
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        accept=".pdf, .docx"
      />
      <div className="text-center mt-6">
        <img
          src="/your-image-placeholder.png"
          alt="Upload"
          className="mb-4"
        />
        <p className="font-bold text-black text-lg">Drag & drop your resume here</p>
        <p className="text-gray-500 text-sm">or click to browse files</p>
        <p className="text-gray-500 text-sm">PDF or DOCX format only</p>
      </div>
    </div>
  );
};

export default FileUpload;


