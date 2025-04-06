"use client"; {/* Error popups if this is not here */}
import React, { useState } from 'react'; // Add the useState import
import Header from '../../components/Header';
import '../globals.css';
import Button from '@/components/Button';
import MockInterviewProgressBar from '@/components/MockInterviewProgressBar';

export default function ResumeReview() {
  const [text, setText] = useState(""); 

    async function handleSubmit(){
      console.log("user typed:", text);
      localStorage.setItem("mockInterviewInput", text); // store this in local storage
      try {
        const response = await fetch("/api/openai-mock-interview", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(text),
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
    
        const result = await response.json();
        console.log("Server Response:", result);
      } catch (error) {
        console.error("Error calling OpenAI route:", error);
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
            onChange={(e) => setText(e.target.value)}
            className="w-full h-full p-5 border border-gray-300 rounded resize-none"
          />
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
            text
              ? "bg-black text-white hover:bg-[var(--second-button-colour)] cursor-pointer"
              : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
          }`}
          disabled={!text}
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