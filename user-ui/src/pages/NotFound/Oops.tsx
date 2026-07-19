import { Link } from 'react-router-dom';
import { PenTool, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center text-[#2B2B2A] selection:bg-[#FFC53D]/50" 
      style={{ 
        fontFamily: "'Patrick Hand', cursive",
        backgroundColor: "#FFFDF6",
        backgroundImage: "radial-gradient(circle, #E5E1D8 1.5px, transparent 1.5px)", 
        backgroundSize: "22px 22px" 
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Patrick+Hand&display=swap');
        .font-doodle { font-family: 'Caveat', cursive; }
        .doodle-btn { border-radius: 200px 15px 190px 15px / 15px 190px 15px 200px; }
      `}</style>

      <div className="bg-white p-12 rounded-3xl border-2 border-[#2B2B2A] shadow-[8px_8px_0_#2B2B2A] max-w-lg w-full text-center relative flex flex-col items-center transform -rotate-1">
        
        <div className="w-24 h-24 bg-[#FF6B6B] rounded-full border-2 border-[#2B2B2A] flex items-center justify-center mb-6 transform rotate-6 shadow-[4px_4px_0_#2B2B2A]">
          <PenTool size={48} className="text-[#2B2B2A]" />
        </div>

        <h1 className="font-doodle text-7xl font-bold mb-2">Oops!</h1>
        <h2 className="text-3xl font-bold mb-6 text-[#FFC53D] stroke-[#2B2B2A]" style={{ WebkitTextStroke: "1px #2B2B2A" }}>
          404 - Page Not Found
        </h2>
        
        <p className="text-xl text-[#5b5b58] mb-10">
          Looks like you drew outside the lines! The page you are looking for doesn't exist or has been moved.
        </p>

        <Link 
          to="/" 
          className="doodle-btn flex items-center justify-center gap-3 px-8 py-4 bg-[#4FC1CF] hover:bg-[#FFC53D] text-[#2B2B2A] font-doodle font-bold text-3xl border-2 border-[#2B2B2A] shadow-[4px_4px_0_#2B2B2A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#2B2B2A] transition-all"
        >
          <Home size={28} />
          Take Me Home
        </Link>
      </div>

    </div>
  );
}
