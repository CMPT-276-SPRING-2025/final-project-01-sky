import { useRef, useState } from "react";

const FileUpload = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      onFileSelect(file);
    }
  };

  /* 
    function to handle drag enter event
    prevents the default behaviour and sets dragActive to true
  */

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  /*
    function to handle drag over event
    prevents the default behaviour and ensures dragActive state is true
  */

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  /*
    function to handle drag leave event 
    prevents the default behaviour and sets dragActive back to false
  */

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-[980px] h-[261px] bg-white rounded-lg flex justify-center items-center relative cursor-pointer border-dashed ${
        dragActive ? "border-4 border-blue-500" : "border-2 border-gray-300"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onClick={(e) => e.stopPropagation()}
        onChange={handleFileChange}
        accept=".pdf, .docx"
      />
      <div className="text-center">
        <img
          src="/upload.png"
          width={60}
          height={60}
          alt="This is a black icon with an arrow pointing up and a square bracket pointing up, holding the up arrow."
          className="mb-4 block mx-auto"
        />
        {!uploadedFile ? (
          <>
            <p className="font-bold text-black text-lg">Drag & drop your resume here</p>
            <p className="text-gray-500 text-sm">or click to browse files</p>
            <p className="text-gray-500 text-sm">PDF or DOCX format only</p>
          </>
        ) : (
          <>
            <p className="font-bold text-black text-lg">File Uploaded</p>
            <p className="text-gray-500 text-sm">File Name: {uploadedFile.name}</p>
            <p className="text-gray-500 text-sm">Click again to change file</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
