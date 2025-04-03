"use client"; {/* Error popups if this is not here */}
import React, { useState } from 'react'; // Add the useState import
import Header from '../../components/Header';
import '../globals.css';
import Button from '@/components/Button';

export default function ResumeReview() {
  const [jobListing, setJobListing] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [resumeFileUrl, setResumeFileUrl] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("Your Resume");
  const [feedback, setFeedback] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        
        // Get data from localStorage
        const storedResumeData = localStorage.getItem("resumeData");
        const storedJobListing = localStorage.getItem("jobListingData");
        const storedResumeFileUrl = localStorage.getItem("resumeFileDataUrl");
        const storedResumeFileName = localStorage.getItem("resumeFileName");
        
        if (!storedResumeData || !storedJobListing) {
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
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError(err.message);
      } finally {
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

  // Render the PDF file or fallback to parsed data if not available
  const renderResumePreview = () => {
    if (resumeFileUrl) {
      const isPdf = resumeFileName?.toLowerCase().endsWith('.pdf');

      if (isPdf) {
        // PDF embedded viewer
        return (
          <div className="h-full">
            <p className="font-medium text-sm mb-2">{resumeFileName}</p>
            <iframe 
              src={resumeFileUrl} 
              className="w-full h-[500px] border border-gray-200 rounded" 
              title="Resume PDF"
            />
          </div>
        );
      } else {
        // Image preview (if file was an image format)
        return (
          <div className="h-full">
            <p className="font-medium text-sm mb-2">{resumeFileName}</p>
            <img 
              src={resumeFileUrl} 
              alt="Resume" 
              className="w-full border border-gray-200 rounded max-h-[500px] object-contain"
            />
          </div>
        );
      }
    }

    // Fallback to the parsed resume data if no file is available
    if (!resumeData) return (
      <>
        <h3 className="font-semibold">Resume Preview</h3>
        <p className="text-gray-500 text-xs mt-4 italic">Resume data not available</p>
      </>
    );

    return (
      <>
        <h3 className="font-semibold">{resumeData.name || "NAME NOT AVAILABLE"}</h3>
        
        {resumeData.education && resumeData.education.length > 0 && (
          <div className="mt-3">
            <p className="font-medium text-sm">Education:</p>
            {resumeData.education.map((edu, i) => (
              <p key={i} className="text-gray-600 text-xs">
                {edu.institution} - {edu.degree} {edu.major && `in ${edu.major}`} {edu.date && `(${edu.date})`}
              </p>
            ))}
          </div>
        )}
        
        {resumeData.skills && resumeData.skills.length > 0 && (
          <div className="mt-3">
            <p className="font-medium text-sm">Skills:</p>
            <p className="text-gray-600 text-xs">{resumeData.skills.join(", ")}</p>
          </div>
        )}
        
        {resumeData.workExperience && resumeData.workExperience.length > 0 && (
          <div className="mt-3">
            <p className="font-medium text-sm">Experience:</p>
            {resumeData.workExperience.slice(0, 2).map((job, i) => (
              <div key={i} className="text-gray-600 text-xs mt-1">
                <p className="font-medium">{job.jobTitle} at {job.company}</p>
                <p>{job.startDate} - {job.endDate || "Present"}</p>
              </div>
            ))}
            {resumeData.workExperience.length > 2 && (
              <p className="text-gray-500 text-xs italic">+ {resumeData.workExperience.length - 2} more positions</p>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      <Header />
      <div className="text-center p-20">
        <h1 className="text-5xl font-bold text-black">Resume Review</h1>
        <p className="text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
          Review the provided feedback and suggestions to improve your resume for your targeted job.
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

      <div className="flex flex-col md:flex-row justify-between mx-70">
        <Button color="grey" href="/resume-review-2">Go Back</Button>
        <Button color="black" href="/">Go Home</Button>
      </div>
      </section>
    </div>
  );
}