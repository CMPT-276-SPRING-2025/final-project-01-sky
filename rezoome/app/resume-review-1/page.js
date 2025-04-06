"use client"; {/* Error popups if this is not here */}
import Link from "next/link";
import React, { useState } from 'react'; // Add the useState import
import Header from '../../components/Header';
import ProgressBar from "../../components/ProgressBar";
import FileUpload from "../../components/FileUpload";
import '../globals.css';
import Button from "@/components/Button";

export default function ResumeReview() {
  const steps = ['Upload Resume', 'Add Job', 'View Results'];
  const [currentStep, setCurrentStep] = useState(0); // Initialize at the first step
  const [fileUploaded, setFileUploaded] = useState(false); // track file upload state; initially set it to false


  const handleFileSelect = async (file) => {
    console.log("File selected:", file);
    setFileUploaded(true); // set the file upload to true once there is one uploaded

    // Convert file to data URL for display later
    const fileDataUrl = await fileToDataURL(file);
    localStorage.setItem("resumeFileDataUrl", fileDataUrl);
    localStorage.setItem("resumeFileName", file.name);


    // Handle the selected file
    const rawData = await uploadFile(file)
    if(rawData.success === true){
      const resumeData = rawData.data.data
      console.log("Interpreting data")
      const formattedData = interpretData(resumeData)
      console.log("Here is the formatted data:")
      console.log(formattedData)

      // Store the resume data in localStorage
      localStorage.setItem("resumeData", JSON.stringify(formattedData));
      
      try {
        const response = await fetch('/api/openai-resume-review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
          throw new Error(`Failed to send data: ${response.status}`);
        }

        const result = await response.json();
        console.log("Server response:", result.message);
      } catch (error) {
        console.error("Error sending formatted data:", error);
      }
    }
    else{
      console.log("Data is not readable")
    }
  };

  // Function to convert file to data URL for storage
  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

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

      projects: data?.project?.map((proj) => ({
        projectTitle: proj.parsed?.projectTitle?.parsed,
        description: proj.parsed?.projectDescription?.parsed
      })) ?? [],

      acheivements: data?.achievement?.map((item) => item.parsed) ?? [],

      associations: data?.association?.map(a => a.parsed || a.raw) ?? [],
      hobbies: data?.hobby?.map(h => h.parsed || h.raw) ?? [],
      patents: data?.patent?.map(p => p.parsed || p.raw) ?? []
    };
    return(jsonOutput)
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      <Header />
      <div className="text-center pt-20 pb-5">
        <h1 className="text-5xl font-bold text-black">Resume Review</h1>
        <p className="text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
        Upload the resume you'd use to apply for your target job.
        </p>
      </div>

      <ProgressBar currentStep={1} />

      {/* Upload File Section */}
      <section className="bg-[var(--secondary-colour)] pb-45">
  <div className="text-center p-5">
    <main className="flex flex-col items-center gap-8 mt-8 pb-10 ">

      <div className="w-[980px]">
        <FileUpload onFileSelect={handleFileSelect} />
      </div>

      {/* Wrapping buttons in a div with same width as the upload box */}
  <div className="flex justify-between mx-auto max-w-[980px] w-full ">
    <Button color="grey" href="/" className="w-full md:w-auto">
      Go Home
    </Button>
    <button
      onClick={(e) => {
        e.preventDefault();
        if (fileUploaded) {
          window.location.href = "/resume-review-2";
        }
      }}
      className={`rounded-lg px-4 py-2 inline-block w-full md:w-auto transition ${
        fileUploaded
          ? "bg-black text-white hover:bg-[var(--second-button-colour)] cursor-pointer"
          : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
      }`}
      disabled={!fileUploaded}
    >
      Next
    </button>
  </div>
      
    </main>
  </div>


</section>




    </div>
    
  );
}