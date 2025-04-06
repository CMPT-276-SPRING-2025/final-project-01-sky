"use client"; {/* Error popups if this is not here */}
import { useState, useRef, useEffect } from "react";
import Header from '../../components/Header';
import '../globals.css';
import Button from '@/components/Button';
import MockInterviewProgressBar from "@/components/MockInterviewProgressBar";

let currQuestion = 0;
let questionList;
let hasFetched = false;

export default function InterviewPage() {
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [transcription, setTranscription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);

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
      if (hasFetched !== true) {
        hasFetched = true;
        try {
          const response = await fetch("/api/openai-mock-interview");
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`Fetch failed: ${text}`);
          }
          const data = await response.json();
          console.log("Interview questions:", data.questions);

          const questionsArr = data.questions.split('|');
          const questionElement = document.getElementById("questionText");
          if (questionElement && questionsArr.length > 0) {
            questionElement.textContent = questionsArr[0].trim();
          }
          questionList = questionsArr;
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      }
    }

    fetchQuestions();
  }, []);

  function nextQuestion() {
    currQuestion = (currQuestion + 1) % 4;
    document.getElementById("questionText").textContent = questionList[currQuestion].trim();
    document.getElementById("questionNumber").textContent = "Question " + (currQuestion + 1);
    document.getElementById("questionFraction").textContent = (currQuestion + 1) + "/4";
  }

  const toggleRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
    } else {
      const stream = videoRef.current.srcObject;
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" }); 
      mediaRecorderRef.current = recorder;

      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.webm");

        try {
          const res = await fetch("/api/whisper", {
            method: "POST",
            body: formData,
          });
          const json = await res.json();
          setTranscription(json.transcription);
          console.log("Transcription:", json.transcription);
        } catch (err) {
          console.error("Whisper error:", err);
        }
      };

      recorder.start();
    }

    setIsRecording(!isRecording);
  };

  

  const recordAnswerChunk = async () => {
    if (!isAnswering) {
      // Start recording
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
          setTranscription(json.transcription || "[No response from Whisper]");
        } catch (err) {
          console.error("Whisper error:", err);
          setTranscription("Error transcribing answer.");
        } finally {
          setIsProcessing(false);
          setIsAnswering(false); // Reset to initial state
        }
      };
  
      recorder.start();
      setIsAnswering(true); // ✅ We are now recording
    } else {
      // Stop recording
      mediaRecorderRef.current?.stop();
    }
  };
  

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      <Header />
      <div className="text-center pt-20 pb-5">
        <h1 className="text-5xl font-bold text-black">Mock Interview</h1>
        <p className="text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
        Practice with realistic interview questions tailored to your target job.
        </p>
      </div>

      <MockInterviewProgressBar currentStep={3} />

      {/* Question Box */}

      <section onClick={nextQuestion} className="bg-[var(--secondary-colour)] py-6 text-center w-full cursor-pointer pt-13">
        <div className="w-full max-w-[980px] mx-auto bg-white p-4 rounded-xl shadow-md">
          <p id="questionNumber" className="text-gray-500 text-sm">Question 1</p>
          <h2 id="questionText" className="text-lg font-semibold mt-1">Tell me about yourself.</h2>
          <p id="questionFraction" className="text-gray-400 text-sm mt-1">1/4</p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-semibold">Your Answer:</span> {transcription || "Click 'Answer Question' to begin."}
          </p>
        </div>
      

      {/* Video + Recording Section */}
      <section className="flex flex-col items-center justify-center mt-8">
        <div className="w-full max-w-[980px] h-[496px] bg-gray-300 rounded-xl relative overflow-hidden">
          <video ref={videoRef} autoPlay playsInline className="absolute w-full h-full object-cover" />
        </div>

        <button
          className="mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
          onClick={recordAnswerChunk}
          disabled={isProcessing}
        >
          {isAnswering ? "Done" : "Answer Question"}
        </button>

        <button
          className={`w-12 h-12 mt-4 rounded-full ${isRecording ? "bg-red-600" : "bg-red-500"}`}
          onClick={toggleRecording}
        ></button>
      </section>

      {/* Navigation Buttons */}
      {/* Navigation Buttons */}
<section className="flex justify-between mx-auto max-w-[980px] pb-8 mt-6">
  <Button color="grey" href="/mock-interview-2">Go Back</Button>
  <Button color="black" href="/mock-interview-4">Next</Button>
</section>

      </section>
    </div>
  );
}
