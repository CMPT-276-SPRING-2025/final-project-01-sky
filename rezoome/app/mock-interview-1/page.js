"use client"; {/* Error popups if this is not here */}
import Link from "next/link";
import React, { useState } from 'react'; // Add the useState import
import Header from '../../components/Header';
import FileUpload from "../../components/FileUpload";
import '../globals.css';
import Button from "@/components/Button";

export default function ResumeReview() {

  const handleFileSelect = (file) => {
    console.log("File selected:", file);
    uploadFile(file)
    // Handle the selected file
  };

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
      <section className="bg-[var(--secondary-colour)] pb-20">
        <div className="text-center p-5">
        <main className="flex flex-col md:flex-row justify-center items-center gap-8 mt-8 pb-10">
          <div className="flex justify-center w-full mt-8">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>

          

        </main>
        <div className="flex justify-between mx-60">
          <Button color="grey" href="/" >Go Home</Button>
          <Button color="black" href="/mock-interview-2">Next</Button>
          </div>
        
        </div> 

        

        
      </section>

      

    </div>
    
  );
}