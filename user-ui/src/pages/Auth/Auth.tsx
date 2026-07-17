import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PenTool, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

import type { LucideIcon } from "lucide-react";

function Squiggle({ color = "#FF6B6B", className = "" }: { color?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 20"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 12 C 20 4, 40 20, 60 10 S 100 2, 120 12 S 160 20, 180 8 S 198 12, 198 12"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Pin({ color }: { color: string }) {
  return (
    <span
      className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#2B2B2A] shadow-[1px_2px_0_rgba(0,0,0,0.4)]"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  );
}

function DoodleInput({ icon: Icon, label, type = "text", placeholder, showToggle, showValue, onToggle }: { icon: LucideIcon; label: string; type?: string; placeholder?: string; showToggle?: boolean; showValue?: boolean; onToggle?: () => void }) {
  return (
    <label className="block text-left mb-5">
      <span className="font-doodle text-xl font-bold block mb-1">{label}</span>
      <div className="relative flex items-center border-2 border-[#2B2B2A] bg-white doodle-input px-4 py-3 focus-within:shadow-[3px_3px_0_#4FC1CF] transition-shadow">
        <Icon size={18} className="text-[#8a8a86] shrink-0" />
        <input
          type={showToggle ? (showValue ? "text" : "password") : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none ml-3 text-lg placeholder:text-[#b5b2a8]"
          style={{ fontFamily: "'Patrick Hand', cursive" }}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="text-[#8a8a86] hover:text-[#2B2B2A] shrink-0"
            aria-label={showValue ? "Hide password" : "Show password"}
          >
            {showValue ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </label>
  );
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [showPw, setShowPw] = useState(false);
  const isLogin = mode === "login";

  return (
    <div
      className="min-h-screen text-[#2B2B2A] selection:bg-[#FFC53D]/50 flex items-center justify-center px-6 py-16"
      style={{
        fontFamily: "'Patrick Hand', cursive",
        backgroundColor: "#FFFDF6",
        backgroundImage: "radial-gradient(#E5E1D8 1.4px, transparent 1.4px)",
        backgroundSize: "22px 22px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Patrick+Hand&display=swap');
        .font-doodle { font-family: 'Caveat', cursive; }
        .wobble-1 { transform: rotate(-0.8deg); }
        .doodle-card {
          border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
        }
        .doodle-btn {
          border-radius: 200px 15px 190px 15px / 15px 190px 15px 200px;
        }
        .doodle-input {
          border-radius: 14px 60px 14px 60px / 60px 14px 60px 14px;
        }
        .doodle-toggle {
          border-radius: 200px;
        }
      `}</style>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10 cursor-pointer">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <svg viewBox="0 0 44 44" className="absolute inset-0">
              <circle cx="22" cy="22" r="19" fill="none" stroke="#FF6B6B" strokeWidth="3" strokeDasharray="3 5" />
            </svg>
            <PenTool className="text-[#2B2B2A] relative" size={20} />
          </div>
          <span className="font-doodle text-3xl font-bold tracking-tight">DrawForge</span>
        </div>

        {/* Mode toggle */}
        <div className="flex justify-center mb-8">
          <div className="relative flex border-2 border-[#2B2B2A] doodle-toggle bg-white p-1 shadow-[3px_3px_0_#2B2B2A]">
            <button
              onClick={() => setMode("login")}
              className={`px-6 py-2 font-doodle text-xl font-bold doodle-toggle transition-colors ${
                isLogin ? "bg-[#FFC53D] text-[#2B2B2A]" : "text-[#8a8a86] hover:text-[#2B2B2A]"
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`px-6 py-2 font-doodle text-xl font-bold doodle-toggle transition-colors ${
                !isLogin ? "bg-[#4FC1CF] text-[#2B2B2A]" : "text-[#8a8a86] hover:text-[#2B2B2A]"
              }`}
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="relative doodle-card wobble-1 bg-white border-2 border-[#2B2B2A] shadow-[6px_6px_0_#FF6B6B] p-8 md:p-10">
          <Pin color={isLogin ? "#FFC53D" : "#4FC1CF"} />

          <h1 className="font-doodle text-4xl md:text-5xl font-bold text-center mb-2 leading-tight">
            {isLogin ? (
              <>
                Welcome{" "}
                <span className="relative inline-block">
                  back.
                  <Squiggle color="#FFC53D" className="absolute left-0 -bottom-1 w-full h-3" />
                </span>
              </>
            ) : (
              <>
                Grab a{" "}
                <span className="relative inline-block">
                  marker.
                  <Squiggle color="#4FC1CF" className="absolute left-0 -bottom-1 w-full h-3" />
                </span>
              </>
            )}
          </h1>
          <p className="text-center text-[#5b5b58] text-lg mb-8">
            {isLogin ? "Your board is right where you left it." : "Your first infinite whiteboard is 30 seconds away."}
          </p>

          <form onSubmit={(e) => {
            e.preventDefault();
            navigate("/dashboard");
          }}>
            {!isLogin && (
              <DoodleInput icon={User} label="Name" placeholder="What should we call you?" />
            )}
            <DoodleInput icon={Mail} label="Email" type="email" placeholder="you@example.com" />
            <DoodleInput
              icon={Lock}
              label="Password"
              placeholder={isLogin ? "Your password" : "Make it a good one"}
              showToggle
              showValue={showPw}
              onToggle={() => setShowPw((v) => !v)}
            />

            {isLogin && (
              <div className="text-right -mt-2 mb-6">
                <a href="#" className="text-[#5b5b58] hover:text-[#FF6B6B] underline decoration-dashed underline-offset-4">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="doodle-btn w-full flex items-center justify-center gap-2 bg-[#FF6B6B] text-[#2B2B2A] py-4 border-2 border-[#2B2B2A] font-doodle font-bold text-2xl shadow-[4px_4px_0_#2B2B2A] hover:shadow-[2px_2px_0_#2B2B2A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {isLogin ? "Log in" : "Create my board"}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 border-t-2 border-dashed border-[#2B2B2A]/30" />
            <span className="text-[#8a8a86] text-lg">or</span>
            <div className="flex-1 border-t-2 border-dashed border-[#2B2B2A]/30" />
          </div>

          <SignInButton mode="modal">
            <button type="button" className="doodle-btn w-full flex items-center justify-center gap-3 bg-white py-3.5 border-2 border-[#2B2B2A] font-doodle font-bold text-xl hover:bg-[#2B2B2A]/5 transition-colors">
              <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC53D" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
                <path fill="#FF6B6B" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.5 0-14 4.2-17.7 10.7z"/>
                <path fill="#4FC1CF" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.4C29.6 35.4 27 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.9 39.7 16.4 44 24 44z"/>
                <path fill="#9B7EDE" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.4C41.9 35.9 44 30.4 44 24c0-1.3-.1-2.7-.4-3.5z"/>
              </svg>
              Continue with Google (Clerk)
            </button>
          </SignInButton>

          <p className="text-center text-[#5b5b58] mt-7">
            {isLogin ? "New to DrawForge? " : "Already have a board? "}
            <button
              onClick={() => setMode(isLogin ? "signup" : "login")}
              className="font-bold text-[#2B2B2A] underline decoration-dashed underline-offset-4 hover:text-[#FF6B6B]"
            >
              {isLogin ? "Sign up free" : "Log in"}
            </button>
          </p>
        </div>

        <p className="text-center text-[#8a8a86] text-sm mt-8">
          By continuing, you agree to our{" "}
          <a href="#" className="underline decoration-dashed">Terms</a> and{" "}
          <a href="#" className="underline decoration-dashed">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}