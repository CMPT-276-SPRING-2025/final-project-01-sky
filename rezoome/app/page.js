import Link from "next/link";
import Header from '../components/Header';
import ButtonCard from "../components/ButtonCard";
import ReasonCard from "../components/ReasonCard";

export default function Home() {
  return (
    // Title and Description
        
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-5">
      {/* Header Component */}
      <Header />
      <header className="text-center p-20">

        <h1 className="text-5xl font-bold text-black">ReZoomé</h1>
        <p className=" text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
        AI-powered mock interview and resume review platform with real-time practice and 
        feedback tailored to your target job.
        </p>
      </header>

      {/* Cards Section */}
      <main className="flex flex-col md:flex-row justify-center items-center gap-8  pb-50">
        {/* Mock Interview Card */}
        <ButtonCard
          title="Mock Interview"
          altText="This image is a snippet of the Mock Interview feature on step 3, where you can read your feedback and suggestions based on your interview performance."
          description="Practice with realistic interview questions tailored to your target job."
          imageSrc="/mock-interview.png"
          link="/mock-interview-1"
        />

        {/* Resume Review Card */}
        <ButtonCard
          title="Resume Review"
          altText="This image is a snippet of the Resume Review feature on step 3, where you have your uploaded resume on the left and your feedback and suggestions on the right."
          description="Get expert feedback to make your resume stand out to employers."
          imageSrc="/resume-review.png"
          link="/resume-review-1"
        />
      </main>


      {/* Reason Section */}
      <section className="bg-[var(--secondary-colour)] pt-20 pb-60">
        <header className="text-center py-10">
        <h2 className="text-4xl font-bold text-black">Why Choose ReZoomé</h2>
        <p className=" text-[var(--text-colour)] mt-4 max-w-3xl mx-auto text-2xl">
        ReZoomé offers a comprehensive, AI-driven platform that helps users build confidence, get personalized feedback, and practice interviews, all in a realistic and accessible way.
        </p>
        </header>

        {/* Reason Cards Section */}
      <main className="flex flex-wrap justify-center items-center gap-8 mt-8">
        <ReasonCard
          title="Confidence Building"
          altText="This image for the first reason why you should use ReZoomé displays an dark green icon of a confident, happy person with a smile."
          imageSrc="/mock-interview.jpg"
          description="Provides repeated practice to boost confidence in interview settings."
        />

        <ReasonCard
          title="Tailored Feedback"
          altText="This image for the second reason why you should use ReZoomé displays an dark green icon of a line with an overall positive graph trend."
          imageSrc="/resume-review.jpg"
          description="Live audio and visual recordings mimic real interview scenarios."
        />

        <ReasonCard
          title="Realistic Simulation"
          altText="This image for the third reason why you should use ReZoomé displays an dark green icon of a pencil and paper beside each other, where the paper has a list of items with some checkmarks marked."
          imageSrc="/career-coaching.jpg"
          description="Customized questions and feedback based on the user's resume."
        />
      </main>

      </section>
    </div>
  );
}
