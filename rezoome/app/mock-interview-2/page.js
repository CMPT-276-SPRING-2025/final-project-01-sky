"use client"; {/* Error popups if this is not here */}
import React, { useState } from 'react'; // Add the useState import
import Header from '../../components/Header';
import '../globals.css';
import Button from '@/components/Button';

export default function ResumeReview() {
  const [text, setText] = useState(""); 
    function handleSubmit(){
      console.log("user typed:", text)
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

      {/* Text input section */}
      <section className="bg-[var(--secondary-colour)] pb-30">
              <div className="text-center p-5">
              <main className="flex flex-col md:flex-row justify-center items-center gap-8 mt-8 ">
                <div className="flex justify-center w-full mt-8">
                  <div className="w-[980px] h-[261px] bg-white rounded-lg flex justify-center items-center relative cursor-pointer"> 
                      <textarea 
                          placeholder="Start typing here..." 
                          value={text} 
                          onChange={(e) => setText(e.target.value)}
                          className="w-full h-full p-2 border rounded resize-none"
                      />
                      <button 
                          onClick={() => handleSubmit(text)}
                          className="absolute bottom-2 right-2 bg-blue-500 text-white px-4 py-2 rounded"
                      >
                          Submit
                      </button>
                  </div>
                </div>
              </main>
      
              
              
              
              </div> 
              <div className="flex justify-between mx-70">
                <Button color="grey" href="/mock-interview-1" >Go Back</Button>
                <Button color="black" href="/mock-interview-3">Next</Button>
                </div>
            </section>

    </div>
    
  );
}