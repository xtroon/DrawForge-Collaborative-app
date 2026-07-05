import React from 'react'
import { PenTool } from 'lucide-react'

export const Footer = () => {
  return (
      <footer className="border-t-2 border-[#2B2B2A]/10 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full border-2 border-[#2B2B2A] flex items-center justify-center">
              <PenTool className="text-[#2B2B2A]" size={16} />
            </div>
            <span className="font-doodle text-2xl font-bold">DrawForge</span>
          </div>

          <div className="flex items-center gap-6 text-lg">
            <a href="#" className="hover:text-[#FF6B6B] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#FF6B6B] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#FF6B6B] transition-colors">Twitter</a>
            <a href="#" className="hover:text-[#FF6B6B] transition-colors">GitHub</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 text-center md:text-left text-[#8a8a86]">
          &copy; {new Date().getFullYear()} DrawForge. All rights reserved.
        </div>
      </footer>
  )
}
