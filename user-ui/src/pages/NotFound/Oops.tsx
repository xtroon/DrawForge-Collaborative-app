import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF6] font-['Patrick_Hand'] selection:bg-[#FFC53D]/50" style={{ backgroundImage: "radial-gradient(#E5E1D8 1.4px, transparent 1.4px)", backgroundSize: "22px 22px" }}>
      
      <div className="bg-white p-12 rounded-3xl border-2 border-[#2B2B2A] shadow-[8px_8px_0_#2B2B2A] max-w-lg w-full text-center relative flex flex-col items-center transform -rotate-1">
        
        <div className="w-24 h-24 bg-[#FF6B6B] rounded-full border-2 border-[#2B2B2A] flex items-center justify-center mb-6 transform rotate-6 shadow-[4px_4px_0_#2B2B2A]">
          <PenTool size={48} className="text-[#2B2B2A]" />
        </div>

        <h1 className="font-['Caveat'] text-7xl font-bold mb-2">Oops!</h1>
        <h2 className="text-3xl font-bold mb-6 text-[#FFC53D] stroke-[#2B2B2A]" style={{ WebkitTextStroke: "1px #2B2B2A" }}>
          404 - Page Not Found
        </h2>
        
        <p className="text-xl text-[#5b5b58] mb-10">
          Looks like you drew outside the lines! The page you are looking for doesn't exist or has been moved.
        </p>

        <Link 
          to="/" 
          className="flex items-center gap-2 px-8 py-4 bg-[#4FC1CF] hover:bg-[#3db0be] text-[#2B2B2A] font-bold text-2xl rounded-xl border-2 border-[#2B2B2A] shadow-[4px_4px_0_#2B2B2A] hover:translate-y-1 hover:shadow-[2px_2px_0_#2B2B2A] transition-all"
        >
          <Home size={28} />
          Take Me Home
        </Link>
      </div>

    </div>
  );
}
