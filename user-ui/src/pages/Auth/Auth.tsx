import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { PenTool } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

function Squiggle({ color = "#FF6B6B", className = "" }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 20" preserveAspectRatio="none" className={className} aria-hidden="true">
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

export default function AuthPage() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError('');

    try {
      const API_URL = 'http://localhost:5000/api/auth';
      
      let response;
      if (isLogin) {
        response = await axios.post(`${API_URL}/login`, { email, password });
      } else {
        response = await axios.post(`${API_URL}/signup`, { name, email, password });
      }

      const { token, user } = response.data;
      login(token, user);      
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

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
        .doodle-toggle {
          border-radius: 200px;
        }
      `}</style>

      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-10 cursor-pointer">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <svg viewBox="0 0 44 44" className="absolute inset-0">
              <circle cx="22" cy="22" r="19" fill="none" stroke="#FF6B6B" strokeWidth="3" strokeDasharray="3 5" />
            </svg>
            <PenTool className="text-[#2B2B2A] relative" size={20} />
          </div>
          <span className="font-doodle text-3xl font-bold tracking-tight">DrawForge</span>
        </Link>

        {/* Mode toggle */}
        <div className="flex justify-center mb-8">
          <div className="relative flex border-2 border-[#2B2B2A] doodle-toggle bg-white p-1 shadow-[3px_3px_0_#2B2B2A]">
            <Link
              to="/login"
              className={`px-6 py-2 font-doodle text-xl font-bold doodle-toggle transition-colors ${
                isLogin ? "bg-[#FFC53D] text-[#2B2B2A]" : "text-[#8a8a86] hover:text-[#2B2B2A]"
              }`}
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className={`px-6 py-2 font-doodle text-xl font-bold doodle-toggle transition-colors ${
                !isLogin ? "bg-[#4FC1CF] text-[#2B2B2A]" : "text-[#8a8a86] hover:text-[#2B2B2A]"
              }`}
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Card */}
        <div className="relative doodle-card wobble-1 bg-white border-2 border-[#2B2B2A] shadow-[6px_6px_0_#FF6B6B] p-8 md:p-10 flex flex-col items-center">
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

          <div className="w-full flex flex-col items-center justify-center clerk-override">
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-[#2B2B2A] rounded-xl text-lg px-4 h-12 focus:shadow-[3px_3px_0_#4FC1CF] transition-shadow outline-none"
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-[#2B2B2A] rounded-xl text-lg px-4 h-12 focus:shadow-[3px_3px_0_#4FC1CF] transition-shadow outline-none"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-[#2B2B2A] rounded-xl text-lg px-4 h-12 focus:shadow-[3px_3px_0_#4FC1CF] transition-shadow outline-none"
                required
              />
              {error && (
                <div className="bg-red-100 border-2 border-red-400 text-red-600 px-4 py-3 rounded-xl relative font-bold text-center">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className={`w-full mt-2 border-2 border-[#2B2B2A] text-[#2B2B2A] shadow-[4px_4px_0_#2B2B2A] hover:shadow-[2px_2px_0_#2B2B2A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-[200px_15px_190px_15px/15px_190px_15px_200px] font-doodle text-2xl h-14 ${isLogin ? 'bg-[#FF6B6B]' : 'bg-[#4FC1CF]'}`}
              >
                {isLogin ? "Log in" : "Sign up"}
              </button>
            </form>
          </div>
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
