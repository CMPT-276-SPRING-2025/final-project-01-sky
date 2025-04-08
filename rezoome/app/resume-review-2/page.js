"use client"; {/* Error popups if this is not here */}
import React, { useState, useEffect } from 'react'; // Add the useEffect import
import Header from '../../components/Header';
import '../globals.css';
import Button from '@/components/Button';
import ProgressBar from "../../components/ProgressBar";
import ErrorPopup from "@/components/ErrorPopup"; // if not already imported
const { validateJobPosting } = require("../../utils/validateJobPosting");

export default function ResumeReview() {
  const [text, setText] = useState(""); 
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 6000;
  const [showErrorPopup, setShowErrorPopup] = useState(false);


  // Load previously saved job listing data on component mount
  useEffect(() => {
    const savedJobListing = localStorage.getItem("jobListingData");
    if (savedJobListing) {
      setText(savedJobListing);
      setCharCount(savedJobListing.length);
    }
  }, []);

  // Update the onChange handler for the textarea
  const handleTextChange = (e) => {
    const newText = e.target.value.slice(0, MAX_CHARS);
    setText(newText);
    setCharCount(newText.length);
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(){
    if (!text.trim()) return;

    const isValid = validateJobPosting(text);
    if (!isValid) {
      setShowErrorPopup(true);
      return;
    }
    
    setIsSubmitting(true);
    console.log("Job listing input:", text);
    
    // Store job listing in localStorage
    localStorage.setItem("jobListingData", text);
    
    try {
      const response = await fetch('/api/openai-resume-review', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(text),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Server response:", result.message);
      window.location.href = "/resume-review-3";
    } catch (error) {
      console.error("Error sending job listing data:", error);
      alert("There was a problem submitting your job listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Check if resume data exists before allowing navigation to next step
  const handleGoBack = () => {
    // No special checks needed here - just navigate back
    window.location.href = "/resume-review-1";
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      <Header />
      <div className="text-center pt-20 pb-5">
        <h1 className="text-5xl font-bold text-black">Resume Review</h1>
        <p className="text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
        Copy and paste the job posting text of your target job.
        </p>
      </div>

      <ProgressBar currentStep={2} />

      {/* Text input section */}
      <section className="bg-[var(--secondary-colour)] pb-100">
        <div className="text-center p-5">
          <main className="flex flex-col items-center gap-8 mt-8 ">
            <div className="w-[980px]">
              <div className="h-[261px] bg-white rounded-lg flex flex-col justify-center items-center relative cursor-pointer"> 
                <textarea 
                  placeholder="Enter the target job posting here..." 
                  value={text} 
                  onChange={handleTextChange}
                  className="w-full h-full p-5 border border-gray-300 rounded resize-none"
                  maxLength={MAX_CHARS}
                />
                <div className="text-sm text-gray-500 absolute bottom-2 right-4">
                  {charCount}/{MAX_CHARS}
                </div>
              </div>
            </div>

            <div className="w-[980px] flex justify-between">
              <Button color="grey" onClick={handleGoBack}>Go Back</Button>
              <button
                onClick={handleSubmit}
                className={`rounded-lg px-4 py-2 inline-block transition ${
                  text && !isSubmitting
                    ? "bg-black text-white hover:bg-[var(--second-button-colour)] cursor-pointer"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                }`}
                disabled={!text || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Next"}
              </button>
            </div>
          </main>
        </div>
      </section>
      {showErrorPopup && (
        <ErrorPopup
          title="Invalid Job Posting"
          message="Please enter a more complete job description with responsibilities or requirements."
          onClose={() => setShowErrorPopup(false)}
          onConfirm={() => setShowErrorPopup(false)}
          buttonText="Try Again"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}