"use client";
import { useState, useRef, useEffect } from "react";
import Header from '../../components/Header';
import '../globals.css';
import Button from '@/components/Button';

export default function InterviewPage() {
  const [questionList, setQuestionList] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responses, setResponses] = useState([null, null, null, null]);

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
      .catch((err) => console.error("Error accessing video:", err));
  }, []);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch("/api/openai-mock-interview");
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Fetch failed: ${text}`);
        }
        const data = await response.json();
        const questionsArr = data.questions.split('|').map(q => q.trim());
        setQuestionList(questionsArr);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }

    fetchQuestions();
  }, []);

  function nextQuestion() {
    if (!isAnswering && !isProcessing) {
      setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % 4);
    }
  }

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
            "the end"
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

  const currentQuestion = questionList[currentQuestionIndex];
  const currentAnswer = responses[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      <Header />

      {/* Question Box */}
      <section onClick={nextQuestion} className="bg-[var(--secondary-colour)] py-6 text-center w-full cursor-pointer">
        <div className="w-full max-w-2xl mx-auto bg-white p-4 rounded-xl shadow-md">
          <p className="text-gray-500 text-sm">Question {currentQuestionIndex + 1}</p>
          <h2 className="text-lg font-semibold mt-1">
            {currentQuestion || "Loading..."}
          </h2>
          <p className="text-gray-400 text-sm mt-1">{`${currentQuestionIndex + 1}/4`}</p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-semibold">Your Answer:</span>{" "}
            {currentAnswer || "Click 'Answer Question' to begin."}
          </p>
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
          disabled={!currentQuestion || (isProcessing && !isAnswering)}
        >
          {isProcessing
            ? "Loading..."
            : isAnswering
              ? "Done"
              : "Answer Question"}
        </button>
      </section>

      {/* Navigation Buttons */}
      <section className="flex justify-between mx-70 px-8">
        <Button color="grey" href="/mock-interview-2">Go Back</Button>
        <Button color="black" href="/mock-interview-4">Next</Button>
      </section>
    </div>
  );
}
