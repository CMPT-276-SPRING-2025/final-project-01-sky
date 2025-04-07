"use client";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import "../globals.css";
import Button from "@/components/Button";

export default function MockInterviewFeedback() {
  const [resumeFileUrl, setResumeFileUrl] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("Your Resume");
  const [jobListing, setJobListing] = useState("Job posting text goes here...");
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [feedbackPoints, setFeedbackPoints] = useState([]);
  const [generalFeedback, setGeneralFeedback] = useState("");
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
  
        if (json.feedback && typeof json.feedback === "object") {
          const ordered = ["q1", "q2", "q3", "q4"].map(
            (key) => json.feedback[key] || "No feedback."
          );
          setFeedbackPoints(ordered);
          setGeneralFeedback(json.feedback.generalFeedback || "No general feedback available.");
        } else {
          throw new Error("Invalid feedback format");
        }
  
      } catch (err) {
        console.error("Error fetching feedback:", err);
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

      <section className="bg-[var(--secondary-colour)] pb-20 pt-10">
        {/* Resume & Job Section */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10 px-8">
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
          </div>

          {/* Job Posting Section */}
          <div>
            <h2 className="text-lg font-bold mb-2">Job Posting</h2>
            <div className="bg-white rounded-lg shadow-lg">
              <div className="border border-gray-200 rounded-lg p-4 h-36 overflow-y-auto">
                <p className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">
                  {jobListing || "No job posting available."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* General Feedback */}
        <div className="max-w-5xl mx-auto px-8 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-black">General Feedback</h2>
          <div className="bg-white rounded-lg shadow-lg">
            <div className="border border-gray-200 rounded-lg p-6 min-h-[120px] max-h-[280px] overflow-y-auto">
              {loading ? (
                <p className="text-gray-500 italic text-base">Loading feedback...</p>
              ) : (
                <p className="text-gray-800 whitespace-pre-line text-lg">
                  {generalFeedback}
                </p>
              )}
            </div>
          </div>
        </div>


          {/* Suggestions Section */}
          <div className="max-w-5xl mx-auto px-8">
            <h2 className="text-xl font-bold mb-3 text-black">Suggestions</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="border border-gray-200 rounded-lg p-6 space-y-6">
                {loading ? (
                  <p className="text-gray-500 italic text-base">Loading suggestions...</p>
                ) : (
                  feedbackPoints.map((feedback, index) => (
                    <div key={index} className="bg-white border border-gray-300 rounded-md p-4 shadow-sm">
                      <p className="text-base text-gray-800 mb-2 leading-relaxed">
                        <span className="font-bold">Question {index + 1}:</span>{" "}
                        {questions[index] || "Question not found."}
                      </p>
                      <p className="text-base text-gray-700 mb-2 leading-relaxed">
                        <span className="font-bold">Your Response:</span>{" "}
                        {responses[index] || "No response recorded."}
                      </p>
                      <p className="text-base text-gray-700 mt-2 leading-relaxed">
                        <span className="font-bold">Feedback:</span>{" "}
                        {feedback}
                      </p>
                    </div>
                  ))
                )}
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
