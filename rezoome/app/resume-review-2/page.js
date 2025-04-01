"use client"; {/* Error popups if this is not here */}
import React, { useState } from 'react'; // Add the useState import
import Header from '../../components/Header';
import '../globals.css';
import Button from '@/components/Button';

export default function ResumeReview() {
  const [text, setText] = useState(""); 
  function handleSubmit(){
    console.log("user typed:", text)
    localStorage.setItem("mockInterviewInput", text); // store this in local storage
  }
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      <Header />
      <div className="text-center p-20">
        <h1 className="text-5xl font-bold text-black">Resume Review</h1>
        <p className="text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
        Get expert feedback to make your resume stand out to employers.
        </p>
      </div>

      {/* Text input section */}
      <section className="bg-[var(--secondary-colour)] pb-55">
              <div className="text-center p-5">
              <main className="flex flex-col md:flex-row justify-center items-center gap-8 mt-8 ">
                <div className="flex justify-center w-full mt-8">
                  <div className="w-[980px] h-[261px] bg-white rounded-lg flex justify-center items-center relative cursor-pointer"> 
                      <textarea 
                          placeholder="Enter the target job listing here..." 
                          value={text} 
                          onChange={(e) => setText(e.target.value)}
                          className="w-full h-full p-5 border border-gray-300 rounded resize-none"
                      />
                  </div>
                </div>
              </main>
      
              </div> 
              <div className="flex justify-between mx-70">
                <Button color="grey" href="/resume-review-1" >Go Back</Button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                    window.location.href = "/resume-review-3";
                  }}
                  className={`rounded-lg px-4 py-2 inline-block transition ${
                    text
                      ? "bg-black text-white hover:bg-[var(--second-button-colour)] cursor-pointer"
                      : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                  }`}
                  disabled={!text}
                >
                  Next
                </button>
                </div>
      </section>

    </div>
    
  );
}
