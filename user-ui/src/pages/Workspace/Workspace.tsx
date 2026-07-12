import Canvas from "../../features/Canva";
import Online from "../../components/canvas/Online";
import Toolbar from "../../components/canvas/Toolbar";
import {
  MdFullscreen,
  MdFullscreenExit,
  MdKeyboardBackspace,
  MdClose,
} from "react-icons/md";
import Share from "../../components/Share";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import type { Shape } from "../../features/types";

function Workspace() {
  const [tool, setTool] = useState<"pointer" | "pencil" | "brush" | "eraser" | "rectangle" | "circle" | "line" | "rounded-rectangle" | "rhombus" | "arrow" | "text">(
    "pencil",
  );
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [history, setHistory] = useState<Shape[][]>([[]]);
  const [historyStep, setHistoryStep] = useState(0);

  const appRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);

  const commitShapes = (newShapes: Shape[]) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newShapes);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      setShapes(history[newStep]);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      setShapes(history[newStep]);
    }
  };

  useEffect(() => {
    zoomRef.current = zoom;
    panRef.current = pan;
  }, [zoom, pan]);

  useEffect(() => {
    const appElement = appRef.current;
    if (!appElement) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Prevent browser native zoom and scroll

      const currentZoom = zoomRef.current;
      const currentPan = panRef.current;

      const delta = -e.deltaY * 0.25;
      const newZoom = Math.round(Math.min(Math.max(currentZoom + delta, 10), 300));
      
      if (newZoom === currentZoom) return;

      const scale = currentZoom / 100;
      const newScale = newZoom / 100;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Calculate world coordinates under mouse
      const worldX = (mouseX - currentPan.x) / scale;
      const worldY = (mouseY - currentPan.y) / scale;

      // Calculate new pan to keep mouse pointing at the same world coordinates
      const newPanX = mouseX - worldX * newScale;
      const newPanY = mouseY - worldY * newScale;

      setZoom(newZoom);
      setPan({ x: newPanX, y: newPanY });
    };

    // passive: false is required to allow e.preventDefault()
    appElement.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      appElement.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await appRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <>
      <div 
        ref={appRef} 
        className="min-h-screen relative overflow-hidden text-[#2B2B2A] selection:bg-[#FFC53D]/50"
        style={{
          fontFamily: "'Patrick Hand', cursive",
          backgroundColor: "#FFFDF6",
          backgroundImage: showGrid ? `radial-gradient(circle, #E5E1D8 1.5px, transparent 1.5px)` : 'none',
          backgroundSize: `${22 * (zoom / 100)}px ${22 * (zoom / 100)}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Patrick+Hand&display=swap');
          .font-doodle { font-family: 'Caveat', cursive; }
          .doodle-btn { border-radius: 200px 15px 190px 15px / 15px 190px 15px 200px; }
        `}</style>
        {/* canvas */}
        <Canvas 
          tool={tool} 
          zoom={zoom} 
          pan={pan} 
          setPan={setPan} 
          color={color} 
          strokeWidth={strokeWidth}
          shapes={shapes}
          setShapes={setShapes}
          commitShapes={commitShapes}
        />

        {/* toolbar  */}
        <Toolbar 
          tool={tool} 
          setTool={setTool} 
          color={color} 
          setColor={setColor} 
          strokeWidth={strokeWidth} 
          setStrokeWidth={setStrokeWidth} 
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyStep > 0}
          canRedo={historyStep < history.length - 1}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
        />

        {/* current online users  */}
        <Online zoom={zoom} setZoom={setZoom} onShareClick={() => setShowSharePopup(true)} />

        {/* back to dashboard button */}
        <Link 
          to="/dashboard"
          className="fixed top-6 left-6 doodle-btn border-2 border-[#2B2B2A] bg-white text-[#2B2B2A] p-2 hover:bg-[#FFC53D] transition-colors shadow-[3px_3px_0_#2B2B2A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#2B2B2A] z-50 flex items-center justify-center"
        >
          <MdKeyboardBackspace size={24} />
        </Link>

        {/* full screen button */}
        <button
          onClick={toggleFullscreen}
          className="fixed bottom-6 right-6 doodle-btn border-2 border-[#2B2B2A] bg-white text-[#2B2B2A] p-2 hover:bg-[#4FC1CF] transition-colors shadow-[3px_3px_0_#2B2B2A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#2B2B2A] z-50 flex items-center justify-center"
        >
          {isFullscreen ? (
            <MdFullscreenExit size={24} />
          ) : (
            <MdFullscreen size={24} />
          )}
        </button>

        {/* share popup */}
        {showSharePopup && (
          <div className="fixed inset-0 bg-[#2B2B2A]/40 backdrop-blur-sm z-[100] flex items-center justify-center">
            <div className="relative animate-in zoom-in duration-200">
              <button 
                onClick={() => setShowSharePopup(false)}
                className="absolute -top-3 -right-3 bg-white border-2 border-[#2B2B2A] rounded-full p-1.5 hover:bg-[#FF6B6B] hover:text-white transition-colors shadow-[2px_2px_0_#2B2B2A] z-[101]"
              >
                <MdClose size={20} />
              </button>
              <Share />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Workspace;
