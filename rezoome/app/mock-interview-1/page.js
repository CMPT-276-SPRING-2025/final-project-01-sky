"use client"; {/* Error popups if this is not here */}
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import FileUpload from "../../components/FileUpload";
import '../globals.css';
import Button from "@/components/Button";
import MockInterviewProgressBar from "@/components/MockInterviewProgressBar";
import { isValidResume } from '../../utils/isResume';
import ErrorPopup from "@/components/ErrorPopup";

export default function ResumeReview() {
  const [fileUploaded, setFileUploaded] = useState(false); // track file upload state; initially set it to false
  const [isLoading, setIsLoading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [errorPopupData, setErrorPopupData] = useState(null);

  useEffect(() => {
    const storedFileName = localStorage.getItem("resumeFileName");
    const storedResumeData = localStorage.getItem("mockInterviewResume");
  
    if (storedFileName && storedResumeData) {
      setFileName(storedFileName);
      setFileUploaded(true);
    }
  }, []);

  const handleFileSelect = async (file) => {
  console.log("File selected:", file);

  // 🧹 Clean up previous session data except job listing
  localStorage.removeItem("resumeFileDataUrl");
  localStorage.removeItem("resumeFileName");
  localStorage.removeItem("resumeData");
  localStorage.removeItem("mockInterviewResume");
  localStorage.removeItem("mockInterviewQuestions");
  localStorage.removeItem("mockInterviewResponses");

  setFileUploaded(false);
  setFileName(file.name); 
  setIsLoading(true);

  // Handle file too large
  if (file.size > 5 * 1024 * 1024) {
    setErrorPopupData({
      title: "File size exceeds limit",
      message: "The maximum file size allowed is 5 MB. Please compress your file or upload a smaller version.",
      fileName: file.name,
      fileSize: (file.size / (1024 * 1024)).toFixed(2) + " MB"
    });
    setIsLoading(false);
    return;
  }

  const progressInterval = setInterval(() => {
    setProcessingProgress((prev) => {
      if (prev >= 90) {
        clearInterval(progressInterval);
        return 90;
      }
      return prev + 10;
    });
  }, 500);

  try {
    const fileDataUrl = await fileToDataURL(file);
    localStorage.setItem("resumeFileDataUrl", fileDataUrl);
    localStorage.setItem("resumeFileName", file.name);

    const rawData = await uploadFile(file);
    clearInterval(progressInterval);

    if (rawData.success !== true) {
      throw new Error("Data not readable");
    }

    setProcessingProgress(100);

    const resumeData = rawData.data.data;
    const formattedData = interpretData(resumeData);

    if (!isValidResume(formattedData)) {
      throw new Error("Invalid resume content");
    }

    localStorage.setItem("resumeData", JSON.stringify(formattedData));
    localStorage.setItem("mockInterviewResume", JSON.stringify(formattedData));

    setFileUploaded(true);
    setFileName(file.name);
  } catch (err) {
    console.error("Error processing file:", err);

    setErrorPopupData({
      title: "Upload Error",
      message: err.message || "An unexpected error occurred.",
      fileName: file.name
    });

    // Clean up only the resume data — job listing stays
    localStorage.removeItem("resumeFileDataUrl");
    localStorage.removeItem("resumeFileName");
    localStorage.removeItem("resumeData");
    localStorage.removeItem("mockInterviewResume");
    localStorage.removeItem("mockInterviewQuestions");
    localStorage.removeItem("mockInterviewResponses");
  } finally {
    setIsLoading(false);
    clearInterval(progressInterval);
  }
};

  //Takes in the file object and runs it to the Affinda API returns JSON
  async function uploadFile(file) {
    try {
        const base64File = await fileToBase64(file); // Convert file to Base64

        const response = await fetch("/api/affinda", { // ✅ Call the API route
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file: base64File }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();
        console.log("Affinda API Response:", data);
        //console.log("first name:" + data.data.data.candidateName.raw)
        return data;
    } catch (error) {
        console.error("Error uploading file:", error);
        return { error: error.message };
    }
}

// Utility function to convert file to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); // Extract base64 part
        reader.onerror = (error) => reject(error);
    });
}
  // Function to convert file to data URL for storage
  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

//Takes in the raw data JSON and returns it formatted
function interpretData(data){
  const jsonOutput = {
    name: [
      data?.candidateName?.parsed?.candidateNameFirst?.parsed,
      data?.candidateName?.parsed?.candidateNameMiddle?.parsed,
      data?.candidateName?.parsed?.candidateNameFamily?.parsed,
    ]
      .filter(Boolean)
      .join(" "),
    
    age: data?.dateOfBirth?.parsed?.age ?? null, 

    education: data?.education?.map((edu) => ({
      institution: edu.parsed?.educationOrganization?.parsed,
      degree: edu.parsed?.educationAccreditation?.parsed,
      major: edu.parsed?.educationMajor?.map((m) => m.parsed).join(", "),
      date: edu.parsed?.educationDateRange?.parsed?.end?.year,
      location: edu.parsed?.educationLocation?.parsed?.formatted,
    })) ?? [],

    workExperience: data?.workExperience?.map((job) => ({
      jobTitle: job.parsed?.jobTitle?.parsed,
      company: job.parsed?.workExperienceOrganization?.parsed,
      location: job.parsed?.workExperienceLocation?.parsed?.formatted,
      startDate: job.parsed?.workExperienceDateRange?.parsed?.start?.year,
      endDate: job.parsed?.workExperienceDateRange?.parsed?.end?.year,
      description: job.parsed?.jobDescription?.parsed
    })) ?? [],

    skills: data?.skill?.map((skill) => skill.parsed?.name) ?? [],

    //projects: data?.project?.map((proj) => proj.parsed?.name) ?? [],
    projects: data?.project?.map((proj) => ({
      projectTitle: proj.parsed?.projectTitle?.parsed,
      description: proj.parsed?.projectDescription?.parsed
    })) ?? [],

    acheivements: data?.achievement?.map((item) => item.parsed) ?? [],

    associations: data?.association?.map(a => a.parsed || a.raw) ?? [],
    hobbies: data?.hobby?.map(h => h.parsed || h.raw) ?? [],
    patents: data?.patent?.map(p => p.parsed || p.raw) ?? []
  };
  return(jsonOutput);
}

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      <Header />
      <div className="text-center pt-20 pb-5">
        <h1 className="text-5xl font-bold text-black">Mock Interview</h1>
        <p className="text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
        Upload the resume you'd use to apply for your target job.
        </p>
      </div>

      <MockInterviewProgressBar currentStep={1} />

      {/* Upload File Section */}
      <section className="bg-[var(--secondary-colour)]">
        <div className="text-center p-5">
          <main className="flex flex-col items-center gap-8 mt-8 pb-35">
            
            {/* File Upload Box */}
            <div className="w-[980px]">
              {!isLoading && !fileUploaded ? (
                <FileUpload onFileSelect={handleFileSelect} />
              ) : isLoading ? (
                <div className="bg-white border-2 border-gray-300 rounded-lg p-8 w-full flex flex-col items-center justify-center">
                  <p className="text-lg font-medium text-gray-700 mb-2 ">
                    Processing {fileName}
                  </p>
                  <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-2">
                    <div 
                      className="bg-[var(--second-button-colour)] h-2.5 rounded-full transition-all duration-300 ease-in-out " 
                      style={{ width: `${processingProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {processingProgress < 100 
                      ? "Analyzing and extracting information from your resume..." 
                      : "Analysis complete!"}
                  </p>
                </div>
              ) : (
                <div className="bg-white border-2 border-gray-300 rounded-lg p-8 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-[var(--second-button-colour)] p-3 rounded-lg mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-lg text-gray-900">{fileName}</h3>
                        <p className="text-sm text-[var(--second-button-colour)]">Successfully processed</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setFileUploaded(false);
                          setFileName("");
                        }} 
                        className="text-sm text-gray-500 hover:text-gray-700 transition flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Replace
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between mx-auto max-w-[980px] w-full">
              <Button color="grey" href="/">Go Home</Button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (fileUploaded) {
                    window.location.href = "/mock-interview-2";
                  }
                }}
                className={`rounded-lg px-4 py-2 inline-block transition ${
                  fileUploaded
                    ? "bg-black text-white hover:bg-[var(--second-button-colour)] cursor-pointer"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                }`}
                disabled={!fileUploaded || isLoading}
              >
                Next
              </button>
            </div>

          </main>
        </div>
      </section>
      {errorPopupData && (
        <ErrorPopup
          title={errorPopupData.title}
          message={errorPopupData.message}
          fileName={errorPopupData.fileName}
          fileSize={errorPopupData.fileSize}
          onClose={() => setErrorPopupData(null)}
        />
      )}
    </div>
  );
}