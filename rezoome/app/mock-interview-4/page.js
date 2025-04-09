"use client";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import "../globals.css";
import Button from "@/components/Button";
import MockInterviewProgressBar from "@/components/MockInterviewProgressBar";

export default function MockInterviewFeedback() {
  const [resumeFileUrl, setResumeFileUrl] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("Your Resume");
  const [jobListing, setJobListing] = useState("Job posting text goes here...");
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [feedbackPoints, setFeedbackPoints] = useState([]);
  const [generalFeedback, setGeneralFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleGoBack = () => {
    window.location.href = "/mock-interview-3";
  };
  

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
    const storedQuestions = localStorage.getItem("mockInterviewQuestions");
    const storedJob = localStorage.getItem("jobListingData");
    const storedResumeFile = localStorage.getItem("resumeFileDataUrl");
    const storedResumeName = localStorage.getItem("resumeFileName");

    if (storedJob) setJobListing(storedJob);
    if (storedResumeFile) setResumeFileUrl(storedResumeFile);
    if (storedResumeName) setResumeFileName(storedResumeName);
    if (storedQuestions) setQuestions(JSON.parse(storedQuestions));
    if (storedResponses) {
      setResponses(JSON.parse(storedResponses));
    } else {
      setFeedbackPoints(["Missing responses. Please redo the interview."]);
      setLoading(false);
      return;
    }

    let intervalId;

    const startProgress = () => {
      intervalId = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(intervalId);
            return 90;
          }
          return prev + 5;
        });
      }, 500);
    };

    startProgress();


    
    async function fetchFeedback() {
      try {
        const response = await fetch("/api/openai-mock-feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ responses: JSON.parse(storedResponses) }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const json = await response.json();
        if (json.feedback && typeof json.feedback === "object") {
          const ordered = ["q1", "q2", "q3", "q4"].map((key) => json.feedback[key] || "No feedback.");
          setFeedbackPoints(ordered);
          setGeneralFeedback(json.feedback.generalFeedback || "No general feedback provided.");
        } else {
          throw new Error("Invalid feedback format.");
        }
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        clearInterval(intervalId);
        setProcessingProgress(100);

        // Short delay for visual finish
        setTimeout(() => {
          setLoading(false);
        }, 600);

      }
    }

    fetchFeedback();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      <Header />
      <div className="text-center pt-20 pb-5">
        <h1 className="text-5xl font-bold text-black">Mock Interview</h1>
        <p className="text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
          Review the provided feedback and suggestions to improve your interview performance for your targeted job.
        </p>
      </div>

      <MockInterviewProgressBar currentStep={4} />

      <section className="bg-[var(--secondary-colour)] pb-20 pt-10">
        {loading ? (
          <div className="max-w-5xl mx-auto px-8 py-5 pb-16">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-8 w-full flex flex-col items-center justify-center">
              <p className="text-lg font-medium text-gray-700 mb-2">
                Analyzing your interview performance...
              </p>
              <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className="bg-[var(--second-button-colour)] h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                {processingProgress < 100
                  ? "Analyzing and extracting insights from your answers..."
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
          <>
            {/* Resume & Job Posting */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10 px-8">
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold mb-2">Your Resume</h2>
                  <div className="bg-white rounded-lg shadow-lg h-36">
                    <div className="border border-gray-200 rounded-lg h-full flex items-center p-4">
                      <div className="bg-[var(--second-button-colour)] p-3 rounded-lg mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <button onClick={handleResumeDownload} className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
                        {resumeFileName}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold mb-2">Job Posting</h2>
                  <div className="bg-white rounded-lg shadow-lg h-36">
                    <div className="border border-gray-200 rounded-lg p-4 h-full overflow-y-auto">
                      <p className="text-gray-600 whitespace-pre-line text-sm">
                        {jobListing || "No job posting available."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* General Feedback */}
            <div className="max-w-5xl mx-auto px-8 mb-6">
              <h2 className="text-lg font-bold mb-2">General Feedback</h2>
              <div className="bg-white rounded-lg shadow-lg">
                <div className="border border-gray-200 rounded-lg p-6 max-h-[200px] overflow-y-auto">
                  <p className="text-gray-800 whitespace-pre-line text-lg">{generalFeedback}</p>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="max-w-5xl mx-auto px-8">
              <h2 className="text-lg font-bold mb-2">Suggestions</h2>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-10">
                <div className="border border-gray-200 rounded-lg p-6 space-y-6">
                  {feedbackPoints.map((feedback, index) => (
                    <div key={index} className="bg-white border border-gray-300 rounded-md p-4 shadow-sm">
                      <p className="text-base text-gray-900 mb-2">
                        <span className="font-bold">Question {index + 1}:</span>{" "}
                        {questions[index] || "Question not found."}
                      </p>
                      <p className="text-base text-gray-800 mb-2">
                        <span className="font-bold">Your Response:</span>{" "}
                        {responses[index] || "No response recorded."}
                      </p>
                      <p className="text-base text-gray-800 mt-2">
                        <span className="font-bold">Feedback:</span>{" "}
                        {feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Navigation Buttons (always visible) */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between mt-6 px-8 pb-8">
          <Button color="grey" onClick={handleGoBack}>Go Back</Button>
          <Button color="black" href="/">Go Home</Button>
        </div>
      </section>
    </div>
  );
}
