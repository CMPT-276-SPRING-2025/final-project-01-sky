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
      <header className="text-center p-10">

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
          description="Practice with realistic interview questions tailored to your target job."
          imageSrc="/mock-interview.jpg"
          link="/mock-interview"
        />

        {/* Resume Review Card */}
        <ButtonCard
          title="Resume Review"
          description="Get expert feedback to make your resume stand out to employers."
          imageSrc="/resume-review.jpg"
          link="/resume-review"
        />
      </main>


      {/* Reason Section */}
      <section className="bg-[var(--secondary-colour)] py-30">
        <header className="text-center py-10">
        <h2 className="text-4xl font-bold text-black">Why Choose ReZoomé</h2>
        <p className=" text-[var(--text-colour)] mt-4 max-w-3xl mx-auto">
        lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        </header>

        {/* Reason Cards Section */}
      <main className="flex flex-wrap justify-center items-center gap-8 mt-8">
        <ReasonCard
          title="Reason #1"
          imageSrc="/mock-interview.jpg"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />

        <ReasonCard
          title="Reason #2"
          imageSrc="/resume-review.jpg"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />

        <ReasonCard
          title="Reason #3"
          imageSrc="/career-coaching.jpg"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />
      </main>

      </section>
    </div>
  );
}
