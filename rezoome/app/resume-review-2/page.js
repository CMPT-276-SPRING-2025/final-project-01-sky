"use client"; {/* Error popups if this is not here */}
import React, { useState } from 'react'; // Add the useState import
import Header from '../../components/Header';
import '../globals.css';
import Button from '@/components/Button';

export default function ResumeReview() {

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
      <section className="bg-[var(--secondary-colour)] pb-30">
      <div className="flex justify-between mx-70">
          <Button color="grey" href="/" >Go Back</Button>
          <Button color="black" href="/resume-review-3">Next</Button>
          </div>
      </section>

    </div>
    
  );
}
