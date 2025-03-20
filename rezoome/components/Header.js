// Header for the website, for easy navigation and access to different features
import Link from "next/link";

const Header = () => {
  return (

    <>
    <header className="bg-[#F2F9FA] px-4 flex justify-between items-center">
      {/* Left side - Logo */}
      <Link href="/" className="flex items-center space-x-4">
        {/* Replace with your logo image */}
        <img src="/favicon.ico" alt="This is the ReZoomé logo, which is a dark green circle with a light green capital R overlayed on top." className="w-8 h-8" />
        <span className="text-lg font-semibold text-gray-800 hover:text-gray-900 border-b-1 border-transparent hover:border-gray-900 transition">ReZoomé</span>
      </Link>

      {/* Right side - Navigation */}
      <nav className="flex space-x-8">
        <Link
          href="/mock-interview-1"
          className="text-black font-semibold hover:text-gray-900 border-b-1 border-transparent hover:border-gray-900 transition"
        >
          Mock Interview
        </Link>
        <Link
          href="/resume-review-1"
          className="text-black font-semibold hover:text-gray-900 border-b-1 border-transparent hover:border-gray-900 transition"
        >
          Resume Review
        </Link>
      </nav>
    </header>

    {/* Add divider under nav links */}
    <div className="w-screen border-b-1 border-[var(--secondary-colour)] my-5"></div>
    </>
  );
};

export default Header;

