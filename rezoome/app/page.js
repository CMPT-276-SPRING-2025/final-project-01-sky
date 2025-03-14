export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <header className="text-center py-10">
        <h1 className="text-5xl font-bold text-black">ReZoomé</h1>
        <p className=" text-[var(--text-colour)] mt-4 max-w-4xl mx-auto">
        AI-powered mock interview and resume review platform with real-time practice and 
        feedback tailored to your target job.
        </p>
      </header>

      
      <main className="flex flex-col md:flex-row justify-center items-center gap-8 min-h-screen bg-[var(--background)] p-8">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-[474px]">
          <img src="/mock-interview.jpg" alt="Mock Interview" className="w-full h-64 object-cover" />
          <div className="p-8 flex flex-col h-64">
            <h2 className="text-2xl font-bold mb-8">Mock Interview</h2>
            <p className="text-base text-[var(--text-colour)] mb-8">
              Practice with realistic interview questions tailored to your target job.
            </p>
            <div className="mt-auto">
              <button className="w-full bg-[var(--button-colour)] text-white py-2 rounded-lg hover:bg-blue-600 transition">
              Begin Now
              </button>
          </div>
          </div>
        </div>


        <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-[474px]">
          <img src="/resume-review.jpg" alt="Resume Review" className="w-full h-64 object-cover" />
          <div className="p-8 flex flex-col h-64">
            <h2 className="text-2xl font-bold mb-8">Resume Review</h2>
            <p className="text-base text-[var(--text-colour)] mb-8">
              Get expert feedback to make your resume stand out to employers.
            </p>
            <div className="mt-auto">
              <button className="w-full bg-[var(--button-colour)] text-white py-2 rounded-lg hover:bg-blue-600 transition">
              Begin Now
              </button>
          </div>
          </div>
        </div>
      </main>





    </div>
  );
}
