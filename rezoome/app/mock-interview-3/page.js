"use client"; {/* Error popups if this is not here */}

import React, { useState, useEffect } from 'react'; // Add the useState import

import Header from '../../components/Header';
import '../globals.css';
import Button from '@/components/Button';

export default function InterviewPage() {
  // State to manage recording status
  const [isRecording, setIsRecording] = useState(false);
  // ref to access the video element
  const videoRef = useRef(null);


  const [storedText, setStoredText] = useState("");

  useEffect(() => {
    const savedText = localStorage.getItem("mockInterviewInput");
    if (savedText) {
      console.log("Job listing text:", savedText); // Keep it in terminal
      setStoredText(savedText);
    }
  }, []);
  


  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      <Header />

      {/* Question Box */}
      <section className="bg-[var(--secondary-colour)] py-6 text-center w-full">
        <div className="w-full max-w-2xl mx-auto bg-white p-4 rounded-xl shadow-md">
          <p className="text-gray-500 text-sm">Question 1</p>
          <h2 className="text-lg font-semibold mt-1">Tell me about yourself.</h2>
          <p className="text-gray-400 text-sm mt-1">1/4</p>
        </div>
      </section>

      {/* Video + Recording Section */}
      <section className="flex flex-col items-center justify-center mt-8">
        <div className=" w-full max-w-[980px] h-[496px] bg-gray-300 rounded-xl relative overflow-hidden">
          <video ref={videoRef} autoPlay playsInline className="absolute w-full h-full object-cover" />
        </div>

        {/* Record Button */}
        <button
          className={`w-12 h-12 mt-4 rounded-full ${
            isRecording ? "bg-red-600" : "bg-red-500"
          }`}
          onClick={toggleRecording}
        ></button>
      </section>

      {/* Navigation Buttons */}
      <section className="flex justify-between mx-70 px-8">
        <Button color="grey" href="/mock-interview-2">Go Back</Button>
        <Button color="black" href="/mock-interview-4">Next</Button>
      </section>
    </div>
  );
}