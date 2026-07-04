import { useState } from "react";
import {
  PenTool,
  Search,
  Plus,
  Users,
  LayoutGrid,
  Clock,
  Star,
  Trash2,
  Settings,
  DoorOpen,
  MoreHorizontal,
  Grid3x3,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Squiggle({ color = "#FF6B6B", className = "" }) {
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

function Pin({ color }) {
  return (
    <span
      className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#2B2B2A] shadow-[1px_2px_0_rgba(0,0,0,0.4)]"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  );
}

const NAV_ITEMS = [
  { id: "boards", label: "My Boards", icon: LayoutGrid },
  { id: "recent", label: "Recent", icon: Clock },
  { id: "starred", label: "Starred", icon: Star },
  { id: "trash", label: "Trash", icon: Trash2 },
];

const PROJECTS = [
  { id: 1, name: "Q3 Roadmap Sketch", color: "#FF6B6B", edited: "2 hours ago", collaborators: 3, pattern: "grid" },
  { id: 2, name: "Onboarding Flow v2", color: "#4FC1CF", edited: "Yesterday", collaborators: 5, pattern: "scribble" },
  { id: 3, name: "Brand Moodboard", color: "#FFC53D", edited: "3 days ago", collaborators: 2, pattern: "dots" },
  { id: 4, name: "Team Retro — June", color: "#9B7EDE", edited: "1 week ago", collaborators: 6, pattern: "grid" },
  { id: 5, name: "App Wireframes", color: "#FF6B6B", edited: "1 week ago", collaborators: 1, pattern: "scribble" },
  { id: 6, name: "Untitled Board", color: "#4FC1CF", edited: "2 weeks ago", collaborators: 1, pattern: "dots" },
];

function ThumbnailPattern({ pattern, color }) {
  if (pattern === "grid") {
    return (
      <svg viewBox="0 0 200 110" className="w-full h-full">
        <rect width="200" height="110" fill={`${color}1A`} />
        {[20, 60, 100, 140, 180].map((x) => (
          <line key={x} x1={x} y1="10" x2={x} y2="100" stroke={color} strokeWidth="2" opacity="0.5" />
        ))}
        <rect x="30" y="25" width="45" height="30" rx="4" fill="none" stroke={color} strokeWidth="2.5" />
        <rect x="110" y="55" width="60" height="30" rx="4" fill="none" stroke={color} strokeWidth="2.5" />
      </svg>
    );
  }
  if (pattern === "scribble") {
    return (
      <svg viewBox="0 0 200 110" className="w-full h-full">
        <rect width="200" height="110" fill={`${color}1A`} />
        <path
          d="M20 70 C 40 20, 70 90, 100 40 S 150 20, 180 60"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="150" cy="35" r="14" fill="none" stroke={color} strokeWidth="2.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 110" className="w-full h-full">
      <rect width="200" height="110" fill={`${color}1A`} />
      {[...Array(24)].map((_, i) => (
        <circle key={i} cx={15 + (i % 8) * 25} cy={20 + Math.floor(i / 8) * 30} r="3" fill={color} opacity="0.6" />
      ))}
    </svg>
  );
}

function Avatar({ i }) {
  const colors = ["#FF6B6B", "#4FC1CF", "#FFC53D", "#9B7EDE"];
  return (
    <div
      className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center font-doodle font-bold text-sm text-[#2B2B2A] -ml-2 first:ml-0"
      style={{ backgroundColor: colors[i % colors.length] }}
    >
      {String.fromCharCode(65 + i)}
    </div>
  );
}

export default function Dashboard() {
  const [active, setActive] = useState("boards");
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen text-[#2B2B2A] selection:bg-[#FFC53D]/50"
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
        .doodle-card { border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px; }
        .doodle-btn { border-radius: 200px 15px 190px 15px / 15px 190px 15px 200px; }
        .doodle-input { border-radius: 14px 60px 14px 60px / 60px 14px 60px 14px; }
        .doodle-thumb { border-radius: 18px 8px 18px 8px / 8px 18px 8px 18px; }
        .wobble-1 { transform: rotate(-0.6deg); }
        .wobble-2 { transform: rotate(0.5deg); }
        .wobble-3 { transform: rotate(-0.4deg); }
      `}</style>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 min-h-screen border-r-2 border-[#2B2B2A]/10 px-6 py-8">
          <Link to="/" className="flex items-center gap-3 mb-10 cursor-pointer">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg viewBox="0 0 44 44" className="absolute inset-0">
                <circle cx="22" cy="22" r="19" fill="none" stroke="#FF6B6B" strokeWidth="3" strokeDasharray="3 5" />
              </svg>
              <PenTool className="text-[#2B2B2A] relative" size={18} />
            </div>
            <span className="font-doodle text-2xl font-bold tracking-tight">DrawForge</span>
          </Link>

          <Link to="/board/new" className="doodle-btn w-full flex items-center justify-center gap-2 bg-[#FF6B6B] text-[#2B2B2A] py-3 border-2 border-[#2B2B2A] font-doodle font-bold text-xl shadow-[3px_3px_0_#2B2B2A] hover:shadow-[1px_1px_0_#2B2B2A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all mb-8">
            <Plus size={20} />
            New board
          </Link>

          <nav className="flex flex-col gap-1 mb-8">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-lg text-left transition-colors ${
                    isActive ? "bg-[#FFC53D]/25 border-2 border-[#2B2B2A]" : "border-2 border-transparent hover:bg-[#2B2B2A]/5"
                  } doodle-input`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto flex items-center gap-3 pt-6 border-t-2 border-dashed border-[#2B2B2A]/20">
            <div className="w-10 h-10 rounded-full bg-[#4FC1CF] border-2 border-[#2B2B2A] flex items-center justify-center font-doodle font-bold text-lg">
              A
            </div>
            <div className="flex-1">
              <p className="font-bold leading-none">Alex Rivera</p>
              <p className="text-sm text-[#8a8a86]">Free plan</p>
            </div>
            <Settings size={18} className="text-[#8a8a86] hover:text-[#2B2B2A] cursor-pointer" />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-6 md:px-10 py-8 max-w-6xl">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="font-doodle text-4xl md:text-5xl font-bold">
                Good morning,{" "}
                <span className="relative inline-block">
                  Alex.
                  <Squiggle color="#FFC53D" className="absolute left-0 -bottom-1 w-full h-3" />
                </span>
              </h1>
              <p className="text-[#5b5b58] text-lg mt-1">You've got 6 boards waiting for you.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8a86]" />
              <input
                type="text"
                placeholder="Search boards..."
                className="w-full border-2 border-[#2B2B2A] doodle-input bg-white pl-11 pr-4 py-2.5 text-lg outline-none focus:shadow-[3px_3px_0_#4FC1CF] transition-shadow placeholder:text-[#b5b2a8]"
              />
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <Link to="/board/new" className="relative doodle-card wobble-1 bg-white border-2 border-[#2B2B2A] shadow-[5px_5px_0_#FF6B6B] p-6 text-left hover:-translate-y-0.5 transition-transform block">
              <div className="w-12 h-12 rounded-full bg-[#FF6B6B]/20 border-2 border-[#2B2B2A] flex items-center justify-center mb-4">
                <Plus size={22} />
              </div>
              <h3 className="font-doodle text-2xl font-bold mb-1">Blank board</h3>
              <p className="text-[#5b5b58]">Start from a fresh canvas.</p>
            </Link>

            <button className="relative doodle-card wobble-2 bg-white border-2 border-[#2B2B2A] shadow-[5px_5px_0_#4FC1CF] p-6 text-left hover:-translate-y-0.5 transition-transform">
              <div className="w-12 h-12 rounded-full bg-[#4FC1CF]/20 border-2 border-[#2B2B2A] flex items-center justify-center mb-4">
                <Grid3x3 size={20} />
              </div>
              <h3 className="font-doodle text-2xl font-bold mb-1">From a template</h3>
              <p className="text-[#5b5b58]">Retros, roadmaps, mind maps.</p>
            </button>

            <button className="relative doodle-card wobble-3 bg-white border-2 border-[#2B2B2A] shadow-[5px_5px_0_#FFC53D] p-6 text-left hover:-translate-y-0.5 transition-transform">
              <div className="w-12 h-12 rounded-full bg-[#FFC53D]/20 border-2 border-[#2B2B2A] flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <h3 className="font-doodle text-2xl font-bold mb-1">Import a file</h3>
              <p className="text-[#5b5b58]">Bring in Figma or images.</p>
            </button>
          </div>

          {/* Create / Join a room */}
          <div className="relative doodle-card bg-white border-2 border-[#2B2B2A] shadow-[6px_6px_0_#9B7EDE] p-8 mb-14">
            <Pin color="#9B7EDE" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[#9B7EDE]/20 border-2 border-[#2B2B2A] flex items-center justify-center shrink-0">
                  <DoorOpen size={24} />
                </div>
                <div>
                  <h3 className="font-doodle text-3xl font-bold mb-1">Create a room</h3>
                  <p className="text-[#5b5b58] max-w-md">
                    Spin up a live session and get a shareable code — perfect for a quick jam with the team.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link to="/board/new" className="doodle-btn flex items-center justify-center gap-2 bg-[#9B7EDE] text-[#2B2B2A] px-6 py-3 border-2 border-[#2B2B2A] font-doodle font-bold text-xl shadow-[3px_3px_0_#2B2B2A] hover:shadow-[1px_1px_0_#2B2B2A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                  <Plus size={18} />
                  Create room
                </Link>
                <div className="flex border-2 border-[#2B2B2A] doodle-input bg-white overflow-hidden">
                  <input
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    placeholder="Enter code"
                    className="w-32 px-4 py-3 text-lg outline-none placeholder:text-[#b5b2a8] bg-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && roomCode.trim()) {
                        navigate(`/board/${roomCode.trim()}`);
                      }
                    }}
                  />
                  <button 
                    onClick={() => roomCode.trim() && navigate(`/board/${roomCode.trim()}`)}
                    className="px-4 font-doodle font-bold text-lg text-[#2B2B2A] hover:text-[#9B7EDE] shrink-0"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent projects */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-doodle text-3xl font-bold">Recent projects</h2>
            <button className="text-[#5b5b58] hover:text-[#FF6B6B] underline decoration-dashed underline-offset-4">
              View all
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((p) => (
              <Link
                key={p.id}
                to={`/board/${p.id}`}
                className="group bg-white border-2 border-[#2B2B2A] doodle-card p-4 hover:-translate-y-1 hover:shadow-[5px_5px_0_#2B2B2A] transition-all cursor-pointer block"
              >
                <div className="doodle-thumb overflow-hidden border-2 border-[#2B2B2A] mb-4 h-28">
                  <ThumbnailPattern pattern={p.pattern} color={p.color} />
                </div>
                <div className="flex items-start justify-between gap-2 px-1">
                  <div>
                    <h3 className="font-doodle text-2xl font-bold leading-tight">{p.name}</h3>
                    <p className="text-sm text-[#8a8a86]">Edited {p.edited}</p>
                  </div>
                  <MoreHorizontal size={18} className="text-[#8a8a86] hover:text-[#2B2B2A] shrink-0 mt-1" />
                </div>
                <div className="flex items-center mt-3 px-1">
                  {[...Array(Math.min(p.collaborators, 4))].map((_, i) => (
                    <Avatar key={i} i={i} />
                  ))}
                  {p.collaborators > 4 && (
                    <span className="text-sm text-[#8a8a86] ml-2">+{p.collaborators - 4}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}