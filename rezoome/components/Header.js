// Header for the website, for easy navigation and access to different features
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-[#F2F9FA] px-4 flex justify-between items-center">
      {/* Left side - Logo */}
      <Link href="/" className="flex items-center space-x-4">
        {/* Replace with your logo image */}
        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        <span className="text-lg font-semibold text-gray-800 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-900 transition">ReZoomé</span>
      </Link>

      {/* Right side - Navigation */}
      <nav className="flex space-x-8">
        <Link
          href="/mock-interview"
          className="text-gray-700 font-semibold hover:text-gray-900 border-b-2 border-transparent hover:border-gray-900 transition"
        >
          Mock Interview
        </Link>
        <Link
          href="/resume-review"
          className="text-gray-700 font-semibold hover:text-gray-900 border-b-2 border-transparent hover:border-gray-900 transition"
        >
          Resume Review
        </Link>
      </nav>
    </header>
  );
};

export default Header;

