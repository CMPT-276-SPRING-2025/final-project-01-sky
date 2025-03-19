import Link from "next/link";
import React, { useState } from 'react'; // Add the useState import
import FileUpload from "../components/FileUpload";
import '../app/globals.css';

export default function ResumeReview() {

  const handleFileSelect = (file) => {
    console.log("File selected:", file);
    // Handle the selected file
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-10">
      <div className="text-center p-10">
        <h1 className="text-5xl font-bold text-black">Mock Interview</h1>
        <p className="text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
          lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* Upload File Section */}
      <section className="bg-[var(--secondary-colour)] pb-30">
        <div className="text-center p-5">
        <main className="flex flex-col md:flex-row justify-center items-center gap-8 mt-8 pb-50">
          <div className="flex justify-center w-full mt-8">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        </main>
        </div> 
      </section>

    </div>
    
  );
}