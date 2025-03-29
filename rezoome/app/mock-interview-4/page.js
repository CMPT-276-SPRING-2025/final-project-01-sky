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
        <h1 className="text-5xl font-bold text-black">Mock Interview</h1>
        <p className="text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
        Practice with realistic interview questions tailored to your target job.
        </p>
      </div>

      {/* Text input section */}
      <section className="bg-[var(--secondary-colour)] flex flex-col items-center pb-30 pt-20 px-8">
        <div className="w-full max-w-3xl">
          {/* Feedback Section */}
          <h2 className="text-lg font-bold mb-2">Feedback</h2>
          <div className="bg-white p-6 rounded-lg shadow-md w-full mb-6">
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          {/* Suggestions Section */}
          <h2 className="text-lg font-bold mb-2">Suggestions</h2>
          <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <ul className="list-disc pl-5 text-gray-600">
              <li>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
              <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
              <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</li>
            </ul>
          </div>

          {/* Buttons Below */}
          <div className="flex justify-between mt-6">
            <Button color="grey" href="/mock-interview-3">Go Back</Button>
            <Button color="black" href="/">Go Home</Button>
          </div>
        </div>
      </section>

    </div>
    
  );
}