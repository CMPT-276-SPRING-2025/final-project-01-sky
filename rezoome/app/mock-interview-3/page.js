"use client"; {/* Error popups if this is not here */}
import React, { useState, useEffect } from 'react'; // Add the useState import
import Header from '../../components/Header';
import '../globals.css';
import Button from '@/components/Button';

export default function ResumeReview() {

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
     

      {/* Text input section */}
      <section className="bg-[var(--secondary-colour)] pb-30">

      <div className="flex justify-between mx-60">
          <Button color="grey" href="/mock-interview-2">Go Back</Button>
          <Button color="black" href="/mock-interview-4">Next</Button>
        </div>

      </section>

    </div>
    
  );
}