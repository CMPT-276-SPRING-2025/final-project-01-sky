import Link from 'next/link'

const Footer = () => {
    return (
      <footer className="bg-[var(--button-colour)] text-white text-center py-4">
        <div className="container mx-auto flex flex-col items-center justify-center px-6">
          <div className="flex w-full justify-between px-60">
            <div className="text-white p-6 w-80">
              <p className='font-bold text-left'>About Us</p>
              <p className='text-sm text-left'>We are 4 Computing Science student developers at Simon Fraser University.</p>
            </div>
            <div className="text-white p-6 w-80">
              <p className='font-bold text-left'>About Project</p>
              <p className='text-sm text-left'>This is a group project for Spring 2025 CMPT 276 D200</p>
            </div>
            <div className="text-white p-6">
            <p className='font-bold text-left'>Quick Links</p>
            <ul className='text-left text-sm'>
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/resume-review" className="hover:underline">Resume Review</Link></li>
              <li><Link href="/mock-interview " className="hover:underline">Mock Interview</Link></li>
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