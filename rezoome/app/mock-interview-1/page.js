"use client"; {/* Error popups if this is not here */}
import Link from "next/link";
import React, { useState } from 'react'; // Add the useState import
import Header from '../../components/Header';
import FileUpload from "../../components/FileUpload";
import '../globals.css';
import Button from "@/components/Button";

export default function ResumeReview() {
  const [fileUploaded, setFileUploaded] = useState(false); // track file upload state; initially set it to false


  const handleFileSelect = async (file) => {
    console.log("File selected:", file);
    setFileUploaded(true); // set the file upload to true once there is one uploaded
    
    
    // handle the selected file
    const rawData = await uploadFile(file)
    if(rawData.success === true){
      const resumeData = rawData.data.data
      console.log("Interperting data")
      const formattedData = interpretData(resumeData)
      console.log("Here is the formatted data:")
      console.log(formattedData)
      try {
        const response = await fetch('/api/openai-mock-interview', {
          method: "POST",
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
  return(jsonOutput)
}

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      <Header />
      <div className="text-center p-20">
        <h1 className="text-5xl font-bold text-black">Mock Interview</h1>
        <p className="text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
        Practice with realistic interview questions tailored to your target job.
        </p>
      </div>

      {/* Upload File Section */}
      <section className="bg-[var(--secondary-colour)] pb-45">
        <div className="text-center p-5">
        <main className="flex flex-col md:flex-row justify-center items-center gap-8 mt-8 pb-10">
          <div className="flex justify-center w-full mt-8">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>

          

        </main>
        <div className="flex justify-between mx-60">
          <Button color="grey" href="/" >Go Home</Button>
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
                disabled={!fileUploaded}
              >
                Next
          </button>
          </div>
        
        </div> 

        

        
      </section>

      

    </div>
    
  );
}