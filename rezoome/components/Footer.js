import Link from 'next/link'

const Footer = () => {
    return (
      <footer className="bg-[var(--footer-colour)] text-white text-center py-4">
        <div className="container mx-auto flex flex-col items-center justify-center px-6">
          <div className="grid grid-cols-3 pl-30 gap-4 p-6 w-full">
            <div className="text-white p-6">
              <p className='font-bold text-left'>About Us</p>
              <p className='text-left'>We are 4 Computing Science student developers at Simon Fraser University.</p>
            </div>
            <div className="text-white p-6">

              <p className='font-bold text-left'>About Project</p>
              <p className='text-left'>This is a group project for Spring 2025 CMPT 276 D200</p>
            </div>
            <div className="text-white p-6">
            <p className='font-bold text-left mb-4'>Quick Links</p>
            <ul className='text-left'>
              <li><Link 
              href="/"
              className="hover:text-white border-b-1 border-transparent hover:border-white transition"
              >Home</Link></li>
              <li><Link 
              href="/resume-review-1"
              className="hover:text-white border-b-1 border-transparent hover:border-white transition"
              >Resume Review</Link></li>
              <li><Link href=
              "/mock-interview-1"
              className="hover:text-white border-b-1 border-transparent hover:border-white transition"
              >Mock Interview</Link></li>

            </ul>
              
            </div>
          </div>
        </div>
        <div className="w-screen border-b-1 border-white my-6"></div>

        <p>© 2025 ReZoomé. All rights reserved.</p>
      </footer>
    );
  };

export default Footer;