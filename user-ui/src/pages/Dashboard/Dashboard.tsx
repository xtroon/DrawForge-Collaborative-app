import { useState } from "react";
import {
  PenTool,
  Search,
  Plus,
  LayoutGrid,
  Star,
  Trash2,
  DoorOpen,
  MoreHorizontal,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

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

const NAV_ITEMS = [
  { id: "boards", label: "My Boards", icon: LayoutGrid },
  { id: "starred", label: "Starred", icon: Star },
];

const patterns = ["grid", "scribble", "dots"];
const colors = ["#FF6B6B", "#4FC1CF", "#FFC53D", "#9B7EDE"];

const getPattern = (id: string) => patterns[id.charCodeAt(0) % patterns.length];
const getColor = (id: string) => colors[id.charCodeAt(id.length - 1) % colors.length];

function ThumbnailPattern({ pattern, color }: { pattern: string; color: string }) {
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

function Avatar({ i }: { i: number }) {
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
  const [boards] = useState<any[]>([]);
  const loading = false;
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();
  const { user, token, login, logout } = useAuth();
  
  const handleSaveName = async () => {
    if (!newName.trim() || !user || !token) return;
    try {
      const res = await axios.put(`http://localhost:5000/api/users/${user.id}`, { name: newName.trim() });
      if (res.data.success) {
        login(token, res.data.user);
        setIsEditingName(false);
      }
    } catch (err) {
      console.error("Failed to update name", err);
    }
  };

  const filteredBoards = boards;

  const renameBoard = (_id: string, _title: string) => {};
  const toggleStar = (_e: any, _id: string, _starred: boolean) => {};
  const deleteBoard = (_id: string) => {};
  return (
    <div
      onClick={() => {
        setOpenDropdownId(null);
        setShowProfilePopup(false);
      }}
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

          <div className="mt-auto relative pt-6 border-t-2 border-dashed border-[#2B2B2A]/20">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:bg-[#2B2B2A]/5 p-2 -mx-2 rounded-xl transition-colors"
              onClick={(e) => { e.stopPropagation(); setShowProfilePopup(!showProfilePopup); }}
            >
              <div className="w-10 h-10 rounded-full bg-[#4FC1CF] border-2 border-[#2B2B2A] flex items-center justify-center font-doodle font-bold text-lg shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-bold leading-none truncate">{user?.name || 'User'}</p>
                <p className="text-sm text-[#8a8a86]">Free plan</p>
              </div>
            </div>

            {showProfilePopup && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-20 left-0 w-64 bg-white border-2 border-[#2B2B2A] shadow-[4px_4px_0_#2B2B2A] rounded-2xl p-4 z-50 flex flex-col gap-4"
              >
                {isEditingName ? (
                  <div className="flex flex-col gap-2 pb-2 border-b-2 border-[#2B2B2A]/10">
                    <input 
                      autoFocus
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="border-2 border-[#2B2B2A] rounded-md px-2 py-1 outline-none text-[#2B2B2A] text-lg font-bold w-full"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                        if (e.key === 'Escape') setIsEditingName(false);
                      }}
                    />
                    <div className="flex gap-2">
                       <button onClick={handleSaveName} className="text-sm bg-[#4FC1CF] text-[#2B2B2A] px-3 py-1 rounded-xl border-2 border-[#2B2B2A] font-bold shadow-[2px_2px_0_#2B2B2A] hover:shadow-[1px_1px_0_#2B2B2A] hover:translate-x-[1px] hover:translate-y-[1px] transition-all">Save</button>
                       <button onClick={() => setIsEditingName(false)} className="text-sm text-[#5b5b58] px-2 py-1 hover:text-[#FF6B6B] font-bold">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="font-bold text-lg text-[#2B2B2A] pb-2 border-b-2 border-[#2B2B2A]/10">
                    {user?.name || 'User'}
                  </div>
                )}
                
                {!isEditingName && (
                  <button 
                    onClick={() => {
                      setNewName(user?.name || "");
                      setIsEditingName(true);
                    }}
                    className="w-full text-left font-bold text-[#5b5b58] hover:text-[#4FC1CF] transition-colors"
                  >
                    Edit Name
                  </button>
                )}

                <button 
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left font-bold text-[#FF6B6B] hover:text-[#2B2B2A] transition-colors"
                >
                  Log out
                </button>

                <button 
                  onClick={() => navigate('/board/new')}
                  className="w-full mt-2 flex items-center justify-center gap-2 text-[#FF6B6B] hover:text-white hover:bg-[#FF6B6B] border-2 border-transparent hover:border-[#2B2B2A] p-2 rounded-xl transition-all font-bold"
                >
                  <PenTool size={18} /> Start Drawing
                </button>
              </div>
            )}
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
                  {user?.name?.split(' ')[0] || 'Creator'}.
                  <Squiggle color="#FFC53D" className="absolute left-0 -bottom-1 w-full h-3" />
                </span>
              </h1>
              <p className="text-[#5b5b58] text-lg mt-1">You've got {boards.length} boards waiting for you.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8a86]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search boards..."
                className="w-full border-2 border-[#2B2B2A] doodle-input bg-white pl-11 pr-4 py-2.5 text-lg outline-none focus:shadow-[3px_3px_0_#4FC1CF] transition-shadow placeholder:text-[#b5b2a8]"
              />
            </div>
          </div>

          {/* Quick actions & Room */}
          <div className="grid lg:grid-cols-2 gap-8 mb-14 mt-4">
            <Link to="/board/new" className="relative doodle-card wobble-1 bg-white border-2 border-[#2B2B2A] shadow-[6px_6px_0_#FF6B6B] p-8 text-left hover:-translate-y-1 transition-transform block">
              <div className="w-14 h-14 rounded-full bg-[#FF6B6B]/20 border-2 border-[#2B2B2A] flex items-center justify-center mb-6">
                <Plus size={24} />
              </div>
              <h3 className="font-doodle text-3xl font-bold mb-2">Blank board</h3>
              <p className="text-[#5b5b58] text-lg max-w-sm">Start from a fresh canvas and let your imagination run wild.</p>
            </Link>

            <div className="relative doodle-card bg-white border-2 border-[#2B2B2A] shadow-[6px_6px_0_#9B7EDE] p-8">
              <Pin color="#9B7EDE" />
              <div className="flex flex-col h-full justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#9B7EDE]/20 border-2 border-[#2B2B2A] flex items-center justify-center shrink-0">
                    <DoorOpen size={24} />
                  </div>
                  <div>
                    <h3 className="font-doodle text-3xl font-bold mb-1">Create a room</h3>
                    <p className="text-[#5b5b58]">
                      Spin up a live session and get a shareable code — perfect for a quick jam with the team.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/board/new" className="doodle-btn flex items-center justify-center gap-2 bg-[#9B7EDE] text-[#2B2B2A] px-6 py-3 border-2 border-[#2B2B2A] font-doodle font-bold text-xl shadow-[3px_3px_0_#2B2B2A] hover:shadow-[1px_1px_0_#2B2B2A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all shrink-0">
                    <Plus size={18} />
                    Create room
                  </Link>
                  <div className="flex flex-1 border-2 border-[#2B2B2A] doodle-input bg-white overflow-hidden">
                    <input
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                      placeholder="Enter code"
                      className="w-full px-4 py-3 text-lg outline-none placeholder:text-[#b5b2a8] bg-transparent min-w-[100px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && roomCode.trim()) {
                          navigate(`/board/${roomCode.trim()}`);
                        }
                      }}
                    />
                    <button 
                      onClick={() => roomCode.trim() && navigate(`/board/${roomCode.trim()}`)}
                      className="px-4 font-doodle font-bold text-lg text-[#2B2B2A] hover:bg-[#2B2B2A]/5 shrink-0 border-l-2 border-[#2B2B2A] transition-colors"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Board list header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-doodle text-3xl font-bold capitalize">{active === 'boards' ? 'My Boards' : active}</h2>
            <button className="text-[#5b5b58] hover:text-[#FF6B6B] underline decoration-dashed underline-offset-4">
              View all
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-12 text-center text-[#8a8a86] font-doodle text-2xl">
                Loading your masterpieces...
              </div>
            ) : filteredBoards.length === 0 ? (
              <div className="col-span-full py-12 text-center text-[#8a8a86] font-doodle text-2xl">
                No boards found here.
              </div>
            ) : (
              filteredBoards.map((b) => (
                <div
                  key={b._id}
                  className="group bg-white border-2 border-[#2B2B2A] doodle-card p-4 hover:-translate-y-1 hover:shadow-[5px_5px_0_#2B2B2A] transition-all block relative"
                >
                  <div 
                    onClick={() => navigate(`/board/${b._id}`)}
                    className="cursor-pointer"
                  >
                    <div className="doodle-thumb overflow-hidden border-2 border-[#2B2B2A] mb-4 h-28">
                      <ThumbnailPattern pattern={getPattern(b._id)} color={getColor(b._id)} />
                    </div>
                    <div className="flex items-start justify-between gap-2 px-1">
                      <div className="w-full mr-2">
                        {renamingId === b._id ? (
                          <input
                            autoFocus
                            value={renameTitle}
                            onChange={(e) => setRenameTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onBlur={() => renameBoard(b._id, renameTitle)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.stopPropagation();
                                renameBoard(b._id, renameTitle);
                              }
                              if (e.key === 'Escape') {
                                e.stopPropagation();
                                setRenamingId(null);
                              }
                            }}
                            className="font-doodle text-2xl font-bold leading-tight truncate border-b-2 border-[#2B2B2A] bg-transparent outline-none w-full mb-1"
                          />
                        ) : (
                          <h3 className="font-doodle text-2xl font-bold leading-tight truncate mb-1">{b.title}</h3>
                        )}
                        <p className="text-sm text-[#8a8a86]">Edited {new Date(b.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center mt-3 px-1">
                      <Avatar i={0} />
                    </div>
                  </div>
                  
                  {/* Star Button */}
                  <button 
                    onClick={(e) => toggleStar(e, b._id, user ? b.starredBy?.includes(user.id) : false)}
                    className={`absolute top-6 right-6 z-10 w-8 h-8 rounded-full border-2 border-[#2B2B2A] flex items-center justify-center transition-colors ${user && b.starredBy?.includes(user.id) ? 'bg-[#FFC53D] shadow-[2px_2px_0_#2B2B2A]' : 'bg-white hover:bg-[#f4f4f0]'}`}
                  >
                    <Star size={14} className={user && b.starredBy?.includes(user.id) ? 'fill-[#2B2B2A] text-[#2B2B2A]' : 'text-[#8a8a86]'} />
                  </button>
                  
                  {/* 3 dots menu */}
                  <div className="absolute right-4 top-[152px] z-10">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setOpenDropdownId(openDropdownId === b._id ? null : b._id);
                      }}
                      className="p-1 hover:bg-[#2B2B2A]/5 rounded-md transition-colors"
                    >
                      <MoreHorizontal size={18} className="text-[#8a8a86] hover:text-[#2B2B2A]" />
                    </button>
                    {openDropdownId === b._id && (
                      <div className="absolute right-0 mt-1 w-44 bg-white border-2 border-[#2B2B2A] shadow-[3px_3px_0_#2B2B2A] rounded-xl overflow-hidden z-20">
                        {active !== "trash" && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setRenamingId(b._id);
                              setRenameTitle(b.title);
                              setOpenDropdownId(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-[#FFC53D] hover:text-[#2B2B2A] transition-colors font-bold text-sm flex items-center gap-2"
                          >
                            <PenTool size={16} /> Rename
                          </button>
                        )}
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (user && b.owner !== user.id) {
                                // Visitor deleting from their starred view
                                toggleStar(e, b._id, true);
                                setOpenDropdownId(null);
                            } else {
                                deleteBoard(b._id);
                            }
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-[#FF6B6B] hover:text-white transition-colors font-bold text-sm flex items-center gap-2"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}