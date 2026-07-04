import { PenTool, Users, Infinity as InfinityIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function Squiggle({ color = "#FF6B6B", className = "" }) {
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

function Pin({ color }) {
  return (
    <span
      className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#2B2B2A] shadow-[1px_2px_0_rgba(0,0,0,0.4)]"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  );
}

export default function Landing() {
  return (
    <div
      className="min-h-screen text-[#2B2B2A] selection:bg-[#FFC53D]/50"
      style={{
        fontFamily: "'Patrick Hand', cursive",
        backgroundColor: "#FFFDF6",
        backgroundImage:
          "radial-gradient(#E5E1D8 1.4px, transparent 1.4px)",
        backgroundSize: "22px 22px",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Patrick+Hand&display=swap');
        .font-doodle { font-family: 'Caveat', cursive; }
        .wobble-1 { transform: rotate(-1.2deg); }
        .wobble-2 { transform: rotate(1deg); }
        .wobble-3 { transform: rotate(-0.6deg); }
        .doodle-card {
          border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
        }
        .doodle-btn {
          border-radius: 200px 15px 190px 15px / 15px 190px 15px 200px;
        }
      `}</style>

      {/* Header */}
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

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-24 px-6 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="font-doodle text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-[1.05]">
              Where great ideas get{" "}
              <span className="relative inline-block">
                scribbled first.
                <Squiggle color="#FFC53D" className="absolute left-0 -bottom-2 w-full h-4" />
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[#5b5b58] mb-10 max-w-2xl mx-auto leading-relaxed">
              DrawForge is your infinite whiteboard for brainstorming, diagramming,
              and drawing together in real time. Grab a marker &mdash; no rules, just ideas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/board/demo" className="doodle-btn flex items-center gap-2 bg-[#FF6B6B] text-[#2B2B2A] px-8 py-4 border-2 border-[#2B2B2A] font-doodle font-bold text-2xl shadow-[4px_4px_0_#2B2B2A] hover:shadow-[2px_2px_0_#2B2B2A] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                Start drawing now
                <ArrowRight size={20} />
              </Link>
              <Link to="/board/demo" className="doodle-btn px-8 py-4 border-2 border-dashed border-[#2B2B2A] font-doodle font-bold text-2xl hover:bg-[#2B2B2A]/5 transition-colors">
                View live demo
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 border-t-2 border-b-2 border-[#2B2B2A]/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-doodle text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                Everything you need to build ideas.
              </h2>
              <p className="text-[#5b5b58] text-xl">Simple tools, taped together into one beautiful board.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 pt-4">
              {/* Feature 1 */}
              <div className="relative doodle-card wobble-2 p-8 bg-white border-2 border-[#2B2B2A] shadow-[6px_6px_0_#4FC1CF]">
                <Pin color="#4FC1CF" />
                <div className="w-14 h-14 rounded-full bg-[#4FC1CF]/20 flex items-center justify-center mb-6 border-2 border-[#2B2B2A]">
                  <Users className="text-[#2B2B2A]" size={26} />
                </div>
                <h3 className="font-doodle text-2xl font-bold mb-2">Real-time Collaboration</h3>
                <p className="text-[#5b5b58] leading-relaxed">
                  Work together with your team instantly. Watch cursors move and
                  shapes appear on the board as they happen.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative doodle-card wobble-1 p-8 bg-white border-2 border-[#2B2B2A] shadow-[6px_6px_0_#FF6B6B] md:mt-6">
                <Pin color="#FF6B6B" />
                <div className="w-14 h-14 rounded-full bg-[#FF6B6B]/20 flex items-center justify-center mb-6 border-2 border-[#2B2B2A]">
                  <PenTool className="text-[#2B2B2A]" size={24} />
                </div>
                <h3 className="font-doodle text-2xl font-bold mb-2">Rich Drawing Tools</h3>
                <p className="text-[#5b5b58] leading-relaxed">
                  From perfect shapes to freehand scribbles and sticky notes,
                  say it exactly how you picture it.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative doodle-card wobble-3 p-8 bg-white border-2 border-[#2B2B2A] shadow-[6px_6px_0_#FFC53D]">
                <Pin color="#FFC53D" />
                <div className="w-14 h-14 rounded-full bg-[#FFC53D]/20 flex items-center justify-center mb-6 border-2 border-[#2B2B2A]">
                  <InfinityIcon className="text-[#2B2B2A]" size={26} />
                </div>
                <h3 className="font-doodle text-2xl font-bold mb-2">Infinite Canvas</h3>
                <p className="text-[#5b5b58] leading-relaxed">
                  Never run out of space. Pan, zoom, and stretch your
                  whiteboard as far as your ideas go.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section id="how-to-use" className="py-24 px-6 relative">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-doodle text-4xl md:text-6xl font-bold mb-16 text-center tracking-tight">
              How it works
            </h2>

            <div className="relative">
              <svg
                viewBox="0 0 20 400"
                preserveAspectRatio="none"
                className="hidden md:block absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-6 h-[calc(100%-3rem)]"
                aria-hidden="true"
              >
                <path
                  d="M10 0 C 2 60, 18 100, 10 160 S 2 260, 10 320 S 16 380, 10 400"
                  fill="none"
                  stroke="#2B2B2A"
                  strokeWidth="2.5"
                  strokeDasharray="6 8"
                  strokeLinecap="round"
                />
              </svg>

              <div className="space-y-14 relative">
                {[
                  { n: 1, color: "#FF6B6B", title: "Create a Board", body: "Sign up in seconds and open your first infinite whiteboard. No setup, no tutorial video." },
                  { n: 2, color: "#4FC1CF", title: "Invite your Team", body: "Share one link. Anyone who has it can jump in and start drawing right away." },
                  { n: 3, color: "#FFC53D", title: "Start Forging Ideas", body: "Grab the toolbar, add shapes, write notes, sketch freehand — it all syncs live." },
                ].map((step) => (
                  <div key={step.n} className="relative flex items-start gap-6 md:justify-center">
                    <div
                      className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-[#2B2B2A] font-doodle text-2xl font-bold shrink-0 z-10 shadow-[3px_3px_0_#2B2B2A] bg-white md:order-1"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.n}
                    </div>
                    <div className="doodle-card w-full md:max-w-sm p-6 bg-white border-2 border-[#2B2B2A]">
                      <h3 className="font-doodle text-2xl font-bold mb-1">{step.title}</h3>
                      <p className="text-[#5b5b58]">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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
    </div>
  );
}