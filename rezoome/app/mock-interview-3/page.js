"use client"; {/* Error popups if this is not here */}
import { useState, useRef, useEffect } from "react"; // Add the useState import
import Header from '../../components/Header';
import '../globals.css';
import Button from '@/components/Button';

let currQuestion = 0;
let questionList;
let hasFetched = false;


export default function InterviewPage() {
  // State to manage recording status
  const [isRecording, setIsRecording] = useState(false);
  // ref to access the video element
  const videoRef = useRef(null);


  useEffect(() => {
    // Access the user's camera
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Set the video source to the stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing media:", err)); //Log errors
  }, []); // This effect runs once when the component mounts

  useEffect( () => {
    
    // Fetch interview questions from the API
    async function fetchQuestions() {
      if(hasFetched !== true){
        hasFetched = true
        try {
          const response = await fetch("/api/openai-mock-interview");
          if (!response.ok) {
            const text = await response.text(); // fallback for non-JSON error bodies
            throw new Error(`Fetch failed: ${text}`);
          }
          const data = await response.json();
          console.log("Interview questions:", data.questions);
    
          const questionsArr = data.questions.split('|');
          const questionElement = document.getElementById("questionText");
          if (questionElement && questionsArr.length > 0) {
            questionElement.textContent = questionsArr[0].trim();
          }
          questionList = questionsArr
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      }

    }

  
    fetchQuestions();


  }, []);

  function nextQuestion(){
    currQuestion = (currQuestion + 1) % 4;
    document.getElementById("questionText").textContent = questionList[currQuestion].trim();
    document.getElementById("questionNumber").textContent = "Question " + (currQuestion + 1);
    document.getElementById("questionFraction").textContent = (currQuestion + 1) + "/4";
  }

  // Function to toggle recording state
  // This function will start or stop the recording based on the current state
  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      <Header />

      {/* Question Box */}

      <section onClick={nextQuestion} className="bg-[var(--secondary-colour)] py-6 text-center w-full cursor-pointer">
        <div className="w-full max-w-2xl mx-auto bg-white p-4 rounded-xl shadow-md">
          <p id="questionNumber" className="text-gray-500 text-sm">Question 1</p>
          <h2 id="questionText"  className="text-lg font-semibold mt-1">Tell me about yourself.</h2>
          <p id="questionFraction" className="text-gray-400 text-sm mt-1">1/4</p>

        </div>
      </section>

      {/* Video + Recording Section */}
      <section className="flex flex-col items-center justify-center mt-8">
        <div className=" w-full max-w-[980px] h-[496px] bg-gray-300 rounded-xl relative overflow-hidden">
          <video ref={videoRef} autoPlay playsInline className="absolute w-full h-full object-cover" />
        </div>

        {/* Record Button */}
        <button
          className={`w-12 h-12 mt-4 rounded-full ${
            isRecording ? "bg-red-600" : "bg-red-500"
          }`}
          onClick={toggleRecording}
        ></button>
      </section>

      {/* Navigation Buttons */}
      <section className="flex justify-between mx-70 px-8">
        <Button color="grey" href="/mock-interview-2">Go Back</Button>
        <Button color="black" href="/mock-interview-4">Next</Button>
      </section>
    </div>
  );
}