import { Handbag } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { FaXTwitter, FaDiscord, FaLinkedin, FaGithub, FaYoutube } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-[#0f0f10] text-white text-sm w-[95%] mx-auto rounded-xl">
      <div className="max-w-7xl mx-auto px-6 py-12 grid  md:grid-cols-5 gap-10 border-b border-gray-800">
        {/* Left Section */}
        <div className="col-span-1 space-y-4">
           <Link href="/" className='flex items-center gap-2 text-xl font-semibold'>
            <span className="text-white">
                <Handbag/>
            </span>
            <span>PRO-CART</span>
            </Link>
          <p className="text-gray-400">Hassle-free Shopping platform that buyers would love.</p>
          {/* Icons */}
          <div className="flex gap-4 mt-4 text-gray-400">
            <FaXTwitter className="hover:text-white cursor-pointer" />
            <FaDiscord className="hover:text-white cursor-pointer" />
            <FaLinkedin className="hover:text-white cursor-pointer" />
            <FaGithub className="hover:text-white cursor-pointer" />
            <FaYoutube className="hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Link Sections */}
        <div className="justify-center md:col-span-4 grid grid-cols-3 md:grid-cols-3 gap-20 md:gap-40 mx-auto">
          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3 text-white">Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/Contacts">Contacts</Link></li>
              <li><Link href="/Privacy-Policy">Privacy Policy</Link> </li>
              <li><Link href="/Terms">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-3 text-white">Explore</h4>
            <ul className="space-y-2 text-gray-400">
              <li>All Products</li>
              <li>Best Seller</li>
              <li>New Arrivals</li>
              <li>Sale</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-3 text-white">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/About">About</Link></li>
              <li><Link href="/Contacts">Contacts</Link></li>
              <li><Link href="/Blog">Blog</Link></li>
            </ul>
          </div>

         
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
        <div className='flex flex-col gap-2'><p>© 2025 PRO-CART</p>
        <p>All Rights Reserved</p></div>   
        <div className="space-x-4 mt-2 md:mt-0">
          <Link href="Privacy-Policy" className="hover:text-white">Privacy Policy</Link>
          <Link href="Terms" className="hover:text-white">Terms</Link>
          <Link href="Code-of-conduct" className="hover:text-white">Code of conduct</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
