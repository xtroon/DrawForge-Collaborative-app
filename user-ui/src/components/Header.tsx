import { Link } from 'react-router-dom';
import { PenTool } from 'lucide-react';

export const Header = () => {
  return (
      <header className="fixed top-0 w-full z-50 bg-[#FFFDF6]/90 backdrop-blur-sm border-b-2 border-[#2B2B2A]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg viewBox="0 0 44 44" className="absolute inset-0">
                <circle cx="22" cy="22" r="19" fill="none" stroke="#FF6B6B" strokeWidth="3" strokeDasharray="3 5" />
              </svg>
              <PenTool className="text-[#2B2B2A] text-xl relative" size={20} />
            </div>
            <span className="font-doodle text-3xl font-bold tracking-tight">
              DrawForge
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-lg">
            <a href="#features" className="hover:text-[#FF6B6B] transition-colors">Features</a>
            <a href="#how-to-use" className="hover:text-[#FF6B6B] transition-colors">How to Use</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-lg hover:text-[#FF6B6B] transition-colors">
              Log in
            </Link>
            <Link to="/auth" className="doodle-btn text-lg font-bold bg-[#2B2B2A] text-[#FFFDF6] px-5 py-2 border-2 border-[#2B2B2A] shadow-[3px_3px_0_#FF6B6B] hover:shadow-[1px_1px_0_#FF6B6B] hover:translate-x-[2px] hover:translate-y-[2px] transition-all inline-block">
              Sign up free
            </Link>
          </div>
        </div>
      </header>
  )
}
