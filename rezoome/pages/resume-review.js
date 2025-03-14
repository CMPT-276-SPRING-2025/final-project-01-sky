import Link from "next/link";
import '../app/globals.css';

export default function ResumeReview() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans p-10">
      <div className="text-center p-10">
        <h1 className="text-5xl font-bold text-black">Resume Review</h1>
        <p className="text-[var(--text-colour)] text-2xl mt-4 max-w-screen-lg mx-auto px-4">
          lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
  );
}
