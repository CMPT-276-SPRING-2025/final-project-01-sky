"use client"; {/* Error popups if this is not here */}
import React, { useState, useEffect } from 'react'; // Add the useState import
import Header from '../../components/Header';
import '../globals.css';
import Button from '@/components/Button';
import MockInterviewProgressBar from '@/components/MockInterviewProgressBar';

export default function ResumeReview() {
  const [text, setText] = useState(""); 
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 6000;

  useEffect(() => {
    const savedListing = localStorage.getItem("jobListingData");
    if (savedListing) {
      setText(savedListing);
      setCharCount(savedListing.length);
    }
  }, []);

  // Update the onChange handler for the textarea
  const handleTextChange = (e) => {
    const newText = e.target.value.slice(0, MAX_CHARS);
    setText(newText);
    setCharCount(newText.length);
  }

  async function handleSubmit(){
    if (!text.trim()) return;
    
    console.log("user typed:", text);
    
    try {
      // Save the job listing text in localStorage
      localStorage.setItem("jobListingData", text);
      console.log("Job listing saved to localStorage");
    } catch (error) {
      console.error("Error saving job listing to localStorage:", error);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      <Header />
      <div className="text-center pt-20 pb-5">
        <h1 className="text-5xl font-bold text-black">Mock Interview</h1>
        <p className="text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
        Copy and paste the job posting text of your target job.
        </p>
      </div>

      <MockInterviewProgressBar currentStep={2} />

      {/* Text input section */}
      <section className="bg-[var(--secondary-colour)] pb-55">
        <div className="text-center p-5">
          <main className="flex flex-col items-center gap-8 mt-8">
            
            {/* Textarea Container */}
            <div className="w-[980px]">
              <div className="h-[261px] bg-white rounded-lg flex justify-center items-center relative cursor-pointer">
                <textarea
                  placeholder="Enter the target job listing here..."
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

            {/* Buttons */}
            <div className="w-[980px] flex justify-between">
              <Button color="grey" href="/mock-interview-1">Go Back</Button>
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  await handleSubmit();
                  window.location.href = "/mock-interview-3";
                }}
                className={`rounded-lg px-4 py-2 inline-block transition ${
                  text.trim()
                    ? "bg-black text-white hover:bg-[var(--second-button-colour)] cursor-pointer"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                }`}
                disabled={!text.trim()}
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