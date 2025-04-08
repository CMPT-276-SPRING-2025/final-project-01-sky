"use client";
import { useState, useRef, useEffect } from "react";
import Header from '../../components/Header';
import '../globals.css';
import Button from '@/components/Button';
import MockInterviewProgressBar from "@/components/MockInterviewProgressBar";
import ErrorPopup from "@/components/ErrorPopup";
import { isMicSilent } from '@/utils/isMicSilent';


let hasFetched = false;

export default function InterviewPage() {
  const [questionList, setQuestionList] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responses, setResponses] = useState([null, null, null, null]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showMicError, setShowMicError] = useState(false);
  const silenceTimerRef = useRef(null);
  const [showMicPermissionError, setShowMicPermissionError] = useState(false);


  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing media:", err));
  }, []);

  useEffect(() => {
    const storedQuestions = localStorage.getItem("mockInterviewQuestions");
    const storedResponses = localStorage.getItem("mockInterviewResponses");

    if (storedResponses) {
      setResponses(JSON.parse(storedResponses));
    }

    if (storedQuestions) {
      setQuestionList(JSON.parse(storedQuestions));
      setLoadingQuestions(false);
    } else {
      async function fetchQuestions() {
        if (hasFetched) return;
        hasFetched = true;

        try {
          const resume = JSON.parse(localStorage.getItem("resumeData"));
          const listing = localStorage.getItem("jobListingData");

          if (!resume || !listing) {
            throw new Error("Missing resume or job listing in localStorage");
          }

          const response = await fetch("/api/openai-mock-interview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resume, listing }),
          });

          if (!response.ok) {
            const text = await response.text();
            throw new Error(`Fetch failed: ${text}`);
          }

          const data = await response.json();
          const questionsArr = data.questions.split('|').map(q => q.trim());
          setQuestionList(questionsArr);
          localStorage.setItem("mockInterviewQuestions", JSON.stringify(questionsArr));
          setLoadingQuestions(false);
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      }

      fetchQuestions();
    }
  }, []);

  const currentQuestion = questionList[currentQuestionIndex];
  const currentAnswer = responses[currentQuestionIndex];

  const recordAnswerChunk = async () => {
    if (!isAnswering) {
      try{
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        mediaRecorderRef.current = recorder;

        let chunks = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
            dataReceived = true;
          }
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: "audio/webm" });

          if (isMicSilent(audioBlob)) {
            setShowMicError(true);
            setIsAnswering(false);
            return;
          }

          const formData = new FormData();
          formData.append("file", audioBlob, "chunk.webm");

          setIsProcessing(true);
          try {
            const res = await fetch("/api/whisper", {
              method: "POST",
              body: formData,
            });
            const json = await res.json();
            let cleanText = (json.transcription || "").trim().toLowerCase();

            const hallucinationPhrases = [
              "bye bye",
              "thank you for watching",
              "thank you.",
              "thanks for watching",
              "see you next time",
              "goodbye",
              "the end",
              "i'll see you tomorrow."
            ];

            if (
              !cleanText ||
              cleanText.length < 5 ||
              hallucinationPhrases.includes(cleanText) ||
              /^[\W\d\s]+$/.test(cleanText)
            ) {
              cleanText = "No response";
            } else {
              const englishLetters = cleanText.match(/[a-zA-Z]/g) || [];
              const density = englishLetters.length / cleanText.length;
              if (density < 0.7) {
                cleanText = "Unintelligible";
              }
            }

            const newResponses = [...responses];
            newResponses[currentQuestionIndex] = cleanText;
            setResponses(newResponses);
            localStorage.setItem("mockInterviewResponses", JSON.stringify(newResponses));
          } catch (err) {
            console.error("Whisper error:", err);
          } finally {
            setIsProcessing(false);
            setIsAnswering(false);
          }
        };

        recorder.start();
        setIsAnswering(true);

        silenceTimerRef.current = setTimeout(() => {
          if (!dataReceived) {
            recorder.stop();
          }
        }, 5000);
      } catch (error) {
        console.error("Error accessing media:", error);
        if (error.name === "NotAllowedError") {
          setShowMicPermissionError(true); // 👈 show custom mic permission popup
        } else {
          setShowMicError(true); // fallback for other errors
        }
      }
    } else {
      mediaRecorderRef.current?.stop();
    }
  };

  const validResponses = responses.filter(
    (res) =>
      res &&
      res.trim() !== "" &&
      res.toLowerCase() !== "no response" &&
      res.toLowerCase() !== "unintelligible"
  );
  const hasAnsweredAtLeastOne = validResponses.length > 0;
  const allAnswered = validResponses.length === 4;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      <Header />
      <div className="text-center pt-20 pb-5">
        <h1 className="text-5xl font-bold text-black">Mock Interview</h1>
        <p className="text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
          Press the "Answer Question" button to record answer, then hit the "Next Question".
        </p>
      </div>
      <MockInterviewProgressBar currentStep={3} />

      <div className="bg-[var(--secondary-colour)] pt-6 pb-35 w-full">
      {/* Question Card */}
      <section className="bg-[var(--secondary-colour)] py-6 text-center w-full">
        <div className="w-full max-w-[980px] mx-auto bg-white p-6 rounded-xl shadow-md min-h-[200px] flex flex-col justify-center">
          <p className="text-gray-500 text-sm">   Question {currentQuestionIndex + 1} <span className="">({currentQuestionIndex + 1}/4)</span>
          </p>
          <h2 className="text-lg font-semibold mt-1">
            {loadingQuestions ? <span className="text-xl">Loading...</span> : currentQuestion || "No question available."}
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-semibold">Your Answer:</span>{" "}
            {currentAnswer || "Click 'Answer Question' to begin."}
          </p>

          {/* Question Navigation */}
        <div className="flex justify-between items-center w-full mx-auto px-4">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : 0))}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              currentQuestionIndex === 0
                ? "bg-gray-300 text-white opacity-50 cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-[var(--second-button-colour)] cursor-pointer"
            }`}
          >
            Previous Question
          </button>

          <button
            onClick={() => setCurrentQuestionIndex((prev) =>
              prev < questionList.length - 1 ? prev + 1 : prev
            )}
            disabled={currentQuestionIndex === questionList.length - 1}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              currentQuestionIndex === questionList.length - 1
                ? "bg-black text-white opacity-50 cursor-not-allowed"
                : "bg-black text-white hover:bg-[var(--second-button-colour)] cursor-pointer"
            }`}
          >
            Next Question
          </button>
        </div>
        </div>

        
      </section>

      {/* Video */}
      <section className="flex flex-col items-center justify-center bg-[var(--secondary-colour)]">
        <div className="w-full max-w-[980px] h-[450px] bg-gray-300 rounded-xl relative overflow-hidden">
          <video ref={videoRef} autoPlay playsInline className="absolute w-full h-full object-cover" />
        </div>

        <button
          className="mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-[var(--second-button-colour)] transition cursor-pointer"
          onClick={recordAnswerChunk}
          disabled={!currentQuestion || isProcessing || loadingQuestions}
        >
          {isProcessing ? "Loading..." : isAnswering ? "Done" : "Answer Question"}
        </button>
      </section>

      {/* Final Navigation */}
        <section className="w-full mt-16 flex justify-center">
          <div className="flex justify-between w-full max-w-[1045px] px-8">
            <Button color="grey" href="/mock-interview-2">Go Back</Button>

            <button
              onClick={() => {
                if (!hasAnsweredAtLeastOne) return; // disable action if no answers
                if (allAnswered) {
                  window.location.href = "/mock-interview-4";
                } else {
                  setShowConfirmPopup(true);
                }
              }}
              className={`w-auto px-6 py-2 rounded-lg font-medium transition ${
                hasAnsweredAtLeastOne
                  ? "bg-black text-white hover:bg-[var(--second-button-colour)] cursor-pointer"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed opacity-50"
              }`}
              disabled={!hasAnsweredAtLeastOne}
            >
              Next
            </button>
          </div>
        </section>
        </div>


      {/* Confirm Popup */}
      {showConfirmPopup && (
        <ErrorPopup
          title="Are you sure?"
          message="You haven't answered all the questions."
          onClose={() => setShowConfirmPopup(false)} // 👈 "Go Back"
          onConfirm={() => window.location.href = "/mock-interview-4"} // 👈 "Continue"
          buttonText="Continue"
          cancelText="Go Back"
        />
      )}

    {showMicError && (
      <ErrorPopup
        title="We arn't detecting any sound!"
        message="We didn't detect any sound after 5 seconds. Is your mic plugged in and working?"
        onClose={() => setShowMicError(false)}
        onConfirm={() => {
          setShowMicError(false);
          recordAnswerChunk(); // Optionally retry
        }}
        buttonText="Try Again"
        cancelText="Cancel"
      />
    )}

    {showMicPermissionError && (
      <ErrorPopup
        title="We couldn't access your microphone"
        message="It looks like you denied microphone access. Please allow it in your browser settings to continue."
        onClose={() => setShowMicPermissionError(false)}
        onConfirm={() => setShowMicPermissionError(false)}
        buttonText="OK"
        cancelText="Cancel"
      />
    )}


    </div>
  );
}
