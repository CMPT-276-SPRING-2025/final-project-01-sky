"use client";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import "../globals.css";
import Button from "@/components/Button";

export default function MockInterviewFeedback() {
  const [resumeFileUrl, setResumeFileUrl] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("Your Resume");
  const [jobListing, setJobListing] = useState("Job posting text goes here...");
  const [feedbackPoints, setFeedbackPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleResumeDownload = () => {
    if (resumeFileUrl) {
      const link = document.createElement("a");
      link.href = resumeFileUrl;
      link.download = resumeFileName || "resume-file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    const storedResponses = localStorage.getItem("mockInterviewResponses");
    const storedJob = localStorage.getItem("jobListingData");
    const storedResumeFile = localStorage.getItem("resumeFileDataUrl");
    const storedResumeName = localStorage.getItem("resumeFileName");

    if (storedJob) setJobListing(storedJob);
    if (storedResumeFile) setResumeFileUrl(storedResumeFile);
    if (storedResumeName) setResumeFileName(storedResumeName);

    if (!storedResponses) {
      setFeedbackPoints(["Missing responses. Please redo the interview."]);
      setLoading(false);
      return;
    }

    async function fetchFeedback() {
      try {
        const response = await fetch("/api/openai-mock-feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ responses: JSON.parse(storedResponses) }),
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response error text:", errorText);
          throw new Error(errorText);
        }
    
        const json = await response.json();
        console.log("💬 Raw feedback response from API:", json);
    
        if (json.feedback && typeof json.feedback === "object") {
          const ordered = ["q1", "q2", "q3", "q4"].map(
            (key) => json.feedback[key] || "No feedback."
          );
          console.log("✅ Parsed feedback array:", ordered);
          setFeedbackPoints(ordered);
        } else {
          throw new Error("Invalid feedback format");
        }
    
      } catch (err) {
        console.error("❌ Error fetching feedback:", err);
        setFeedbackPoints(["Something went wrong. Please try again."]);
      } finally {
        setLoading(false);
      }
    }
    

    fetchFeedback();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      <Header />
      <div className="text-center pt-20 pb-5">
        <h1 className="text-5xl font-bold text-black">Mock Interview Feedback</h1>
        <p className="text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
          Here's your feedback and suggestions based on your interview performance.
        </p>
      </div>

      <section className="bg-[var(--secondary-colour)] pb-75 pt-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8 px-8">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Resume Download */}
            <div>
              <h2 className="text-lg font-bold mb-2">Your Resume</h2>
              <div className="bg-white rounded-lg shadow-lg h-36">
                <div className="border border-gray-200 rounded-lg h-full flex items-center p-4">
                  <div className="bg-[var(--second-button-colour)] p-3 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <button onClick={handleResumeDownload} className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                    {resumeFileName || "Download Resume"}
                  </button>
                </div>
              </div>
            </div>

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
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">

          {/* Feedback Box */}
          <div>
            <h2 className="text-lg font-bold mb-2">Feedback</h2>
            <div className="bg-white rounded-lg shadow-lg">
              <div className="border border-gray-200 rounded-lg p-6 h-48 overflow-y-auto">
                {loading ? (
                  <p className="text-gray-500 italic">Loading feedback...</p>
                ) : feedbackPoints && typeof feedbackPoints === 'object' ? (
                  <p className="text-gray-600 whitespace-pre-line">
                    Here’s how you can improve your mock interview answers based on each response.
                  </p>
                ) : (
                  <p className="italic text-gray-500">No feedback available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Suggestions Box */}
          <div>
            <h2 className="text-lg font-bold mb-2">Suggestions</h2>
            <div className="bg-white rounded-lg shadow-lg">
              <div className="border border-gray-200 rounded-lg p-6 h-96 overflow-y-auto">
                {loading ? (
                  <p className="text-gray-500 italic">Loading suggestions...</p>
                ) : feedbackPoints && typeof feedbackPoints === 'object' ? (
                  <ul className="list-disc pl-5 text-gray-600 space-y-3">
                    {["q1", "q2", "q3", "q4"].map((key, i) => (
                      <li key={key}>
                        <span className="font-semibold">Question {i + 1}:</span> {feedbackPoints[key]}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-gray-500">No suggestions available.</p>
                )}
              </div>
            </div>
          </div>
          </div>

        </div>

        {/* Navigation */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between mt-6 px-8 pb-8">
          <Button color="grey" href="/mock-interview-3">Go Back</Button>
          <Button color="black" href="/">Go Home</Button>
        </div>
      </section>
    </div>
  );
}
