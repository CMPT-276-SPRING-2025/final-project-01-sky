"use client"; {/* Error popups if this is not here */}
import React, { useState } from 'react'; // Add the useState import
import Header from '../../components/Header';
import '../globals.css';
import Button from '@/components/Button';

export default function ResumeReview() {
  const [text, setText] = useState(""); 

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(){
    if (!text.trim()) return;
    
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

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      <Header />
      <div className="text-center p-20">
        <h1 className="text-5xl font-bold text-black">Resume Review</h1>
        <p className="text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
        Copy and paste the job posting text of your target job.
        </p>
      </div>

      {/* Text input section */}

      <section className="bg-[var(--secondary-colour)] pb-55">
        <div className="text-center p-5">
          <main className="flex flex-col md:flex-row justify-center items-center gap-8 mt-8 ">
            <div className="flex justify-center w-full mt-8">
              <div className="w-[980px] h-[261px] bg-white rounded-lg flex justify-center items-center relative cursor-pointer"> 
                <textarea 
                  placeholder="Enter the target job posting here..." 
                  value={text} 
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-full p-5 border border-gray-300 rounded resize-none"
                />
              </div>
            </div>
          </main>
        </div> 
        <div className="flex justify-between mx-70">
          <Button color="grey" href="/resume-review-1">Go Back</Button>
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

      </section>
    </div>
  );
}