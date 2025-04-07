"use client";
import { useState, useRef, useEffect } from "react";
import Header from '../../components/Header';
import '../globals.css';
import Button from '@/components/Button';
import MockInterviewProgressBar from "@/components/MockInterviewProgressBar";

let hasFetched = false;

export default function InterviewPage() {
  const [questionList, setQuestionList] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responses, setResponses] = useState([null, null, null, null]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

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
          const resume = JSON.parse(localStorage.getItem("mockInterviewResume"));
          const listing = localStorage.getItem("mockInterviewInput");

          if (!resume || !listing) {
            throw new Error("Missing resume or job listing in localStorage");
          }

          const response = await fetch("/api/openai-mock-interview", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;

      let chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
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
    } else {
      mediaRecorderRef.current?.stop();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      <Header />
      <div className="text-center pt-20 pb-5">
        <h1 className="text-5xl font-bold text-black">Mock Interview</h1>
        <p className="text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
        Press answer question to record answer then hit next question.
        </p>
      </div>
      <MockInterviewProgressBar currentStep={3} />
      {/* Question Card */}
      <section className="bg-[var(--secondary-colour)] py-6 text-center w-full">
        <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md min-h-[260px] flex flex-col justify-center">
          <p className="text-gray-500 text-sm">Question {currentQuestionIndex + 1}</p>
          <h2 className="text-lg font-semibold mt-1">
            {loadingQuestions ? <span className="text-xl">Loading...</span> : currentQuestion || "No question available."}
          </h2>
          <p className="text-gray-400 text-sm mt-1">{`${currentQuestionIndex + 1}/4`}</p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-semibold">Your Answer:</span>{" "}
            {currentAnswer || "Click 'Answer Question' to begin."}
          </p>
        </div>

        
       {/* Question Navigation Buttons */}
        <div className="flex justify-between items-center max-w-2xl mx-auto px-4 mt-4">
          <button
            onClick={() =>
              setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : 0))
            }
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-full font-medium transition ${
              currentQuestionIndex === 0
                ? "bg-gray-300 text-white opacity-50 cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            Previous Question
          </button>

          <button
            onClick={() =>
              setCurrentQuestionIndex((prev) =>
                prev < questionList.length - 1 ? prev + 1 : prev
              )
            }
            disabled={currentQuestionIndex === questionList.length - 1}
            className={`px-6 py-3 rounded-full font-medium transition ${
              currentQuestionIndex === questionList.length - 1
                ? "bg-black text-white opacity-50 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Next Question
          </button>
        </div>

      </section>


      {/* Video + Answering Section */}
      <section className="flex flex-col items-center justify-center mt-8">
        <div className="w-full max-w-[980px] h-[496px] bg-gray-300 rounded-xl relative overflow-hidden">
          <video ref={videoRef} autoPlay playsInline className="absolute w-full h-full object-cover" />
        </div>

        <button
          className="mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
          onClick={recordAnswerChunk}
          disabled={!currentQuestion || isProcessing || loadingQuestions}
        >
          {isProcessing
            ? "Loading..."
            : isAnswering
              ? "Done"
              : "Answer Question"}
        </button>
      </section>

      {/* Navigation Buttons */}
      <section className="w-full mt-16 flex justify-center">
        <div className="flex justify-between w-full max-w-[1045px] px-8">
          <Button
            color="grey"
            href="/mock-interview-2"
            className="w-auto px-6 py-2"
          >
            Go Back
          </Button>
          <Button
            color="black"
            href="/mock-interview-4"
            className="w-auto px-6 py-2"
          >
            Next
          </Button>
        </div>
      </section>


    </div>
  );
}
