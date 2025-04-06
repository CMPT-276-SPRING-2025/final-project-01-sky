"use client"; {/* Error popups if this is not here */}
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import '../globals.css';
import Button from '@/components/Button';
import ProgressBar from "../../components/ProgressBar";

export default function ResumeReview() {
  const [jobListing, setJobListing] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [resumeFileUrl, setResumeFileUrl] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("Your Resume");
  const [feedback, setFeedback] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        
        // Start progress animation
        const progressInterval = setInterval(() => {
          setProcessingProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90; // Cap at 90% until actual completion
            }
            return prev + 10;
          });
        }, 500);
        
        // Get data from localStorage
        const storedResumeData = localStorage.getItem("resumeData");
        const storedJobListing = localStorage.getItem("jobListingData");
        const storedResumeFileUrl = localStorage.getItem("resumeFileDataUrl");
        const storedResumeFileName = localStorage.getItem("resumeFileName");
        
        if (!storedResumeData || !storedJobListing) {
          clearInterval(progressInterval);
          throw new Error("Missing resume or job listing data. Please go back and try again.");
        }
        
        setJobListing(storedJobListing);
        setResumeData(JSON.parse(storedResumeData));
        
        if (storedResumeFileUrl) {
          setResumeFileUrl(storedResumeFileUrl);
        }
        
        if (storedResumeFileName) {
          setResumeFileName(storedResumeFileName);
        }
        
        // Create URL with encoded parameters
        const encodedResumeData = encodeURIComponent(storedResumeData);
        const encodedJobListing = encodeURIComponent(storedJobListing);
        const url = `/api/openai-resume-review?resumeData=${encodedResumeData}&listingData=${encodedJobListing}`;
        
        // Fetch the analysis results
        const response = await fetch(url);
        
        if (!response.ok) {
          clearInterval(progressInterval);
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch feedback");
        }
        
        const data = await response.json();
        console.log("OpenAI feedback:", data);
        
        setFeedback(data.feedback || "No feedback provided");
        
        // Ensure suggestions is always an array
        if (data.suggestions && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
        } else if (data.suggestions && typeof data.suggestions === 'string') {
          // If it's a string, try to split it into an array
          setSuggestions(data.suggestions.split('\n').filter(item => item.trim()));
        } else {
          setSuggestions([]);
        }
        
        // Set progress to 100% when complete
        clearInterval(progressInterval);
        setProcessingProgress(100);
        
        // Short delay before removing loading state
        setTimeout(() => {
          setLoading(false);
        }, 500);
        
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Format suggestions list or show placeholder if none
  const renderSuggestions = () => {
    if (!suggestions || suggestions.length === 0) {
      return <p className="text-gray-500 italic">No suggestions available.</p>;
    }
    
    return (
      <ul className="list-disc pl-5 space-y-3">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="text-gray-600">
            {suggestion}
          </li>
        ))}
      </ul>
    );
  };

  // Function to handle file download
  const handleResumeDownload = () => {
    if (resumeFileUrl) {
      const link = document.createElement('a');
      link.href = resumeFileUrl;
      link.download = resumeFileName || 'resume-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle go back to job listing page
  const handleGoBack = () => {
    window.location.href = "/resume-review-2";
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      <Header />
      <div className="text-center pt-20 pb-5">
        <h1 className="text-5xl font-bold text-black">Resume Review</h1>
        <p className="text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
          Review the provided feedback and suggestions to improve your resume for your targeted job.
        </p>
      </div>

      <ProgressBar currentStep={3} />

      <section className="bg-[var(--secondary-colour)] pb-75 pt-10">
        {loading ? (
          <div className="max-w-5xl mx-auto px-8 py-5 pb-100">
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 w-full flex flex-col items-center justify-center">
              <p className="text-lg font-medium text-gray-700 mb-2">
                Analyzing your resume against the job listing...
              </p>
              <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-[var(--second-button-colour)] h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                {processingProgress < 100 
                  ? "Analyzing and extracting insights from your resume and job posting..." 
                  : "Analysis complete!"}
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-5xl mx-auto text-center py-10">
            <p className="text-lg text-red-500">Error: {error}</p>
            <p className="mt-2">Please go back and try again.</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8 px-8">
            {/* Left column - Resume and Job Posting */}
            <div className="flex flex-col gap-6">
              {/* Resume Download Section */}
              <div>
                <h2 className="text-lg font-bold mb-2">Your Resume</h2>
                <div className="bg-white rounded-lg shadow-lg h-36">
                  <div className="border border-gray-200 rounded-lg h-full flex items-center p-4">
                    <div className="bg-[var(--second-button-colour)] p-3 rounded-lg mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <button 
                      onClick={handleResumeDownload}
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      {resumeFileName || "Download Resume"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Feedback Section */}
              <div>
                <h2 className="text-lg font-bold mb-2">Feedback</h2>
                <div className="bg-white rounded-lg shadow-lg">
                  <div className="border border-gray-200 rounded-lg p-6 h-96 overflow-y-auto">
                    <p className="text-gray-600 whitespace-pre-line">
                      {feedback}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Feedback & Suggestions */}
            <div className="flex flex-col gap-6">

              {/* Job Posting Section */}
              <div>
                <h2 className="text-lg font-bold mb-2">Job Posting</h2>
                <div className="bg-white rounded-lg shadow-lg">
                  <div className="border border-gray-200 rounded-lg p-4 h-36 overflow-y-auto">
                    <p className="text-gray-600 whitespace-pre-line text-sm">
                      {jobListing || "No job posting available."}
                    </p>
                  </div>
                </div>
              </div>
              

              {/* Suggestions Section */}
              <div>
                <h2 className="text-lg font-bold mb-2">Suggestions</h2>
                <div className="bg-white rounded-lg shadow-lg">
                  <div className="border border-gray-200 rounded-lg p-6 h-96 overflow-y-auto">
                    {renderSuggestions()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between mt-6 px-8 pb-8">
          <Button color="grey" onClick={handleGoBack}>Go Back</Button>
          <Button color="black" href="/">Go Home</Button>
        </div>
      </section>
    </div>
  );
}