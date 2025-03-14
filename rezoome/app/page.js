import Link from "next/link";

export default function Home() {
  return (
    // Title and Description
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <header className="text-center p-10">
        <h1 className="text-5xl font-bold text-black">ReZoomé</h1>
        <p className=" text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
        AI-powered mock interview and resume review platform with real-time practice and 
        feedback tailored to your target job.
        </p>
      </header>

      {/* Mock Interview Card */}
      <main className="flex flex-col md:flex-row justify-center items-center gap-8 min-h-screen bg-[var(--background)] p-8 mt-0">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-[474px]">
          <img src="/mock-interview.jpg" alt="Mock Interview" className="w-full h-64 object-cover" />
          <div className="p-10 flex flex-col h-64">
            <h2 className="text-2xl font-bold mb-2 pt-4">Mock Interview</h2>
            <p className="text-base text-[var(--text-colour)] mb-4">
              Practice with realistic interview questions tailored to your target job.
            </p>
            <div className="mt-auto">
              <Link href="/mock-interview">
                <button className="w-full bg-[var(--button-colour)] text-white py-2 rounded-lg hover:bg-blue-600 transition">
                Begin Now
                </button>
              </Link>
          </div>
          </div>
        </div>

        {/* Resume Review Card  */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-[474px]">
          <img src="/resume-review.jpg" alt="Resume Review" className="w-full h-64 object-cover" />
          <div className="p-10 flex flex-col h-64">
            <h2 className="text-2xl font-bold mb-2 pt-4">Resume Review</h2>
            <p className="text-base text-[var(--text-colour)] mb-4">
              Get expert feedback to make your resume stand out to employers.
            </p>
            <div className="mt-auto">
              <Link href="/resume-review">
                <button className="w-full bg-[var(--button-colour)] text-white py-2 rounded-lg hover:bg-blue-600 transition">
                Begin Now
                </button>
              </Link>
          </div>
          </div>
        </div>
      </main>

      {/* Reason Section */}
      <section className="bg-[var(--secondary-colour)] py-30">
        <header className="text-center py-10">
        <h2 className="text-4xl font-bold text-black">Why Choose ReZoomé</h2>
        <p className=" text-[var(--text-colour)] mt-4 max-w-3xl mx-auto">
        lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        </header>

        <main className="flex flex-wrap justify-center items-center gap-8 mt-8">
        {/* Reason Card 1 */}
        <div className="bg-white shadow-lg rounded-lg w-[303.33px] h-[295.27px] flex flex-col p-4">
          <img src="/mock-interview.jpg" alt="Mock Interview" className="w-full h-48 object-cover rounded-lg" />
          <div className="flex flex-col justify-between mt-4">
            <h2 className="text-xl font-semibold">Reason #1</h2>
            <p className="text-base text-[var(--text-colour)] mt-2">
              lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>

        {/* Reason Card 2 */}
        <div className="bg-white shadow-lg rounded-lg w-[303.33px] h-[295.27px] flex flex-col p-4">
          <img src="/resume-review.jpg" alt="Resume Review" className="w-full h-48 object-cover rounded-lg" />
          <div className="flex flex-col justify-between mt-4">
            <h2 className="text-xl font-semibold">Reason #2</h2>
            <p className="text-base text-[var(--text-colour)] mt-2">
              lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>

        {/* Reason Card 3 */}
        <div className="bg-white shadow-lg rounded-lg w-[303.33px] h-[295.27px] flex flex-col p-4">
          <img src="/career-coaching.jpg" alt="Career Coaching" className="w-full h-48 object-cover rounded-lg" />
          <div className="flex flex-col justify-between mt-4">
            <h2 className="text-xl font-semibold">Reason #3</h2>
            <p className="text-base text-[var(--text-colour)] mt-2">
              lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
      </main>

      </section>
    </div>
  );
}
