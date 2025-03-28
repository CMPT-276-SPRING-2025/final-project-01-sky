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
      <section className="bg-[var(--secondary-colour)] pb-30 pt-20">
      {/* Content Layout */}
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6 pb-8 px-8">
        {/* Resume Section */}
        <div className="col-span-1">
          <h2 className="text-lg font-bold mb-2">Your Resume</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="border border-gray-300 rounded-lg p-4 min-h-[400px]">
              <h3 className="font-semibold">JOHN DOE</h3>
              <p className="text-gray-500 text-sm">Location, City | 000-000-000 | john@example.com</p>
            </div>
          </div>
        </div>

        {/* Feedback & Suggestions */}
        <div className="col-span-2 flex flex-col gap-6">
          {/* Feedback Section */}
          <div>
            <h2 className="text-lg font-bold mb-2">Feedback</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
              </p>
          </div>
          </div>

          {/* Suggestions Section */}
          <div>
            <h2 className="text-lg font-bold mb-2">Suggestions</h2>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <ul className="list-disc pl-5 text-gray-600">
                <li>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                <li>Curabitur pretium tincidunt lacus.</li>
                <li>Nulla gravida orci a odio.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mx-70">
        <Button color="grey" href="/resume-review-2">Go Back</Button>
        <Button color="black" href="/">Go Home</Button>
      </div>
      </section>

    </div>
    
  );
}
