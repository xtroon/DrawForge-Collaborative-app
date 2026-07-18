import { useState } from "react";
import { FiShare  } from "react-icons/fi";


type OnlineProps = {
  zoom: number;
  setZoom: (z: number) => void;
  onShareClick: () => void;
  liveUsers?: Array<{ socketId: string, user: { name: string } }>;
};

export default function Online({ zoom, setZoom, onShareClick, liveUsers = [] }: OnlineProps) {
  const [showUsers, setShowUsers] = useState(false);

  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 300));
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 10));

  return (
    <div className="fixed top-6 right-6 bg-white border-2 border-[#2B2B2A] shadow-[6px_6px_0_#9B7EDE] py-2 px-4 doodle-card flex items-center gap-7 z-50">
      {/* users */}
      <div className="relative">
        <div
          onClick={() => setShowUsers(!showUsers)}
          className="flex cursor-pointer"
        >
          {liveUsers.slice(0, 3).map((u, index) => (
            <div
              key={u.socketId}
              className={`w-10 h-10 rounded-full border-2 border-[#2B2B2A] text-[#2B2B2A] flex items-center justify-center font-doodle font-bold text-xl ${
                index !== 0 ? "-ml-3" : ""
              }`}
              style={{ backgroundColor: ['#FF6B6B', '#4FC1CF', '#FFC53D', '#9B7EDE'][index % 4] }}
              title={u.user.name}
            >
              {u.user.name[0]?.toUpperCase() || '?'}
            </div>
          ))}

          {liveUsers.length > 3 && (
            <div className="-ml-3 w-10 h-10 rounded-full bg-[#E5E1D8] border-2 border-[#2B2B2A] flex items-center justify-center font-doodle font-bold text-lg text-[#2B2B2A]">
              +{liveUsers.length - 3}
            </div>
          )}
        </div>

        {/* popup */}
        {showUsers && (
          <div className="absolute right-0 mt-3 w-52 bg-white border-2 border-[#2B2B2A] shadow-[4px_4px_0_#FF6B6B] p-3 doodle-card wobble-2">
            <p className="font-doodle font-bold text-2xl mb-2 text-[#2B2B2A] border-b-2 border-dashed border-[#2B2B2A]/30 pb-2">Online Users</p>

            {liveUsers.length === 0 && (
              <p className="text-sm font-bold text-[#5b5b58] italic py-2">Just you for now</p>
            )}

            {liveUsers.map((u, index) => (
              <div key={u.socketId} className="flex items-center gap-3 py-2">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-[#2B2B2A] text-[#2B2B2A] flex items-center justify-center font-doodle font-bold text-lg"
                  style={{ backgroundColor: ['#FF6B6B', '#4FC1CF', '#FFC53D', '#9B7EDE'][index % 4] }}
                >
                  {u.user.name[0]?.toUpperCase() || '?'}
                </div>

                <span className="font-bold text-[#2B2B2A] text-lg truncate" title={u.user.name}>{u.user.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Zoom */}
      <div className="flex items-center gap-2 bg-[#FFFDF6] border-2 border-[#2B2B2A] px-2 py-1 doodle-input">
        <button onClick={handleZoomOut} className="text-2xl font-bold cursor-pointer px-2 hover:bg-[#2B2B2A]/5 text-[#2B2B2A] rounded leading-none pb-1">-</button>
        <span className="w-12 text-center select-none font-bold text-[#2B2B2A]">{zoom}%</span>
        <button onClick={handleZoomIn} className="text-2xl font-bold cursor-pointer px-2 hover:bg-[#2B2B2A]/5 text-[#2B2B2A] rounded leading-none pb-1">+</button>
      </div>

      {/* share btn */}
      <button onClick={onShareClick} className="cursor-pointer doodle-btn bg-[#9B7EDE] text-[#2B2B2A] border-2 border-[#2B2B2A] px-5 py-2 flex justify-between items-center gap-2 font-doodle font-bold text-2xl shadow-[3px_3px_0_#2B2B2A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#2B2B2A] transition-all">
        Share
        <FiShare size={20}/>
      </button>
    </div>
  );
}
