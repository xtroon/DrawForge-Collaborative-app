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
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import type { Shape } from "../../features/types";
import { useAuth } from "../../contexts/AuthContext";
import { socket } from "../../services/socket";

function Workspace() {
  const { id } = useParams<{ id: string }>();
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
  const [boardTitle, setBoardTitle] = useState("Untitled Board");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("Untitled Board");
  const [boardOwnerId, setBoardOwnerId] = useState("");
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [history, setHistory] = useState<Shape[][]>([[]]);
  const [historyStep, setHistoryStep] = useState(0);

  const appRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  const isCreatingRef = useRef(false);
  const lastEmitRef = useRef(0);
  
  const [cursors, setCursors] = useState<Record<string, { x: number; y: number; user: { name: string } }>>({});

  useEffect(() => {
    if (!id || !user) return;
    
    if (id === "new") {
      if (isCreatingRef.current) return;
      isCreatingRef.current = true;
      axios.post("http://localhost:5000/api/boards", { title: "Untitled Board", owner: user.id })
        .then(res => {
          navigate(`/board/${res.data._id}`, { replace: true });
        })
        .catch(err => {
          console.error("Failed to create new board:", err);
          isCreatingRef.current = false;
        });
      return;
    }

    axios.get(`http://localhost:5000/api/boards/${id}`)
      .then(res => {
        if (res.data) {
          if (res.data.title) {
            setBoardTitle(res.data.title);
            setTempTitle(res.data.title);
          }
          if (res.data.owner) {
            setBoardOwnerId(res.data.owner);
          }
          if (res.data.shapes) {
            setShapes(res.data.shapes);
            setHistory([res.data.shapes]);
            setHistoryStep(0);
          }
        }
      })
      .catch(err => console.error("Failed to load board:", err));
  }, [id, user, navigate]);

  useEffect(() => {
    if (id && id !== "new") {
      socket.emit('join-room', id);

      const handleShapesUpdated = (newShapes: Shape[]) => {
        setShapes(newShapes);
        setHistory(prev => {
          const newHistory = [...prev];
          newHistory.push(newShapes);
          return newHistory;
        });
        setHistoryStep(prev => prev + 1);
      };

      const handleCursorMoved = (data: { socketId: string, x: number, y: number, user: { name: string } }) => {
        setCursors(prev => ({
          ...prev,
          [data.socketId]: { x: data.x, y: data.y, user: data.user }
        }));
      };

      const handleCursorDisconnected = (socketId: string) => {
        setCursors(prev => {
          const newCursors = { ...prev };
          delete newCursors[socketId];
          return newCursors;
        });
      };

      socket.on('shapes-updated', handleShapesUpdated);
      socket.on('cursor-moved', handleCursorMoved);
      socket.on('cursor-disconnected', handleCursorDisconnected);

      return () => {
        socket.emit('leave-room', id);
        socket.off('shapes-updated', handleShapesUpdated);
        socket.off('cursor-moved', handleCursorMoved);
        socket.off('cursor-disconnected', handleCursorDisconnected);
      };
    }
  }, [id]);

  const commitShapes = (newShapes: Shape[]) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newShapes);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);

    if (id) {
      axios.put(`http://localhost:5000/api/boards/${id}/shapes`, { shapes: newShapes })
        .catch(err => console.error("Failed to save shapes:", err));
      socket.emit('update-shapes', { roomId: id, shapes: newShapes });
    }
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim() === "" || tempTitle === boardTitle) {
      setTempTitle(boardTitle);
      return;
    }
    setBoardTitle(tempTitle);
    if (id && id !== "new") {
      axios.put(`http://localhost:5000/api/boards/${id}/title`, { title: tempTitle })
        .catch(err => console.error("Failed to update title:", err));
    }
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      setShapes(history[newStep]);
      if (id && id !== "new") {
        socket.emit('update-shapes', { roomId: id, shapes: history[newStep] });
        axios.put(`http://localhost:5000/api/boards/${id}/shapes`, { shapes: history[newStep] }).catch(err => console.error(err));
      }
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      setShapes(history[newStep]);
      if (id && id !== "new") {
        socket.emit('update-shapes', { roomId: id, shapes: history[newStep] });
        axios.put(`http://localhost:5000/api/boards/${id}/shapes`, { shapes: history[newStep] }).catch(err => console.error(err));
      }
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

  const isAdmin = user && user.id === boardOwnerId;

  const handlePointerMove = (e: React.PointerEvent) => {
    const now = Date.now();
    if (now - lastEmitRef.current > 50) {
      if (id && id !== "new" && user) {
        const scale = zoom / 100;
        const worldX = (e.clientX - pan.x) / scale;
        const worldY = (e.clientY - pan.y) / scale;

        socket.emit('cursor-move', {
          roomId: id,
          x: worldX,
          y: worldY,
          user: { name: user.name }
        });
        lastEmitRef.current = now;
      }
    }
  };

  return (
    <>
      <div 
        ref={appRef} 
        className="min-h-screen relative overflow-hidden text-[#2B2B2A] selection:bg-[#FFC53D]/50"
        onPointerMove={handlePointerMove}
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
        
        {/* Render Live Cursors */}
        {Object.entries(cursors).map(([socketId, cursor]) => {
          const screenX = cursor.x * (zoom / 100) + pan.x;
          const screenY = cursor.y * (zoom / 100) + pan.y;
          
          return (
            <div
              key={socketId}
              className="absolute pointer-events-none z-[45] transition-all duration-75 ease-linear flex items-start"
              style={{ transform: `translate(${screenX}px, ${screenY}px)` }}
            >
              <svg 
                width="24" height="36" viewBox="0 0 24 36" fill="none" 
                className="drop-shadow-md" style={{ transform: "rotate(-15deg)", transformOrigin: "top left" }}
              >
                <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7871 12.3673H5.65376Z" fill="#FF6B6B"/>
                <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7871 12.3673H5.65376Z" stroke="white" strokeWidth="1"/>
              </svg>
              <div 
                className="bg-[#FF6B6B] text-white font-bold text-xs px-2 py-0.5 rounded-full rounded-tl-none whitespace-nowrap shadow-sm mt-4 -ml-1"
              >
                {cursor.user.name}
              </div>
            </div>
          );
        })}

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

        {/* top-left controls */}
        <div className="fixed top-6 left-6 z-50 flex items-center gap-4">
          <Link 
            to="/dashboard"
            className="doodle-btn border-2 border-[#2B2B2A] bg-white text-[#2B2B2A] p-2 hover:bg-[#FFC53D] transition-colors shadow-[3px_3px_0_#2B2B2A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#2B2B2A] flex items-center justify-center"
          >
            <MdKeyboardBackspace size={24} />
          </Link>
          <div className="flex flex-col gap-1">
            {isEditingTitle ? (
              <input
                autoFocus
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSave();
                  if (e.key === 'Escape') {
                    setTempTitle(boardTitle);
                    setIsEditingTitle(false);
                  }
                }}
                className="bg-white border-2 border-[#2B2B2A] shadow-[3px_3px_0_#2B2B2A] px-4 py-1.5 doodle-btn font-doodle text-xl font-bold text-[#2B2B2A] w-[200px] outline-none focus:shadow-[1px_1px_0_#4FC1CF]"
              />
            ) : (
              <div 
                onClick={() => { 
                  if (isAdmin) {
                    setIsEditingTitle(true); setTempTitle(boardTitle); 
                  }
                }}
                className={`bg-white border-2 border-[#2B2B2A] shadow-[3px_3px_0_#2B2B2A] px-4 py-1.5 doodle-btn font-doodle text-xl font-bold text-[#2B2B2A] truncate max-w-[200px] ${isAdmin ? 'cursor-pointer hover:bg-[#E5E1D8]' : ''} transition-colors`}
                title={isAdmin ? "Click to edit" : ""}
              >
                {boardTitle}
              </div>
            )}
          </div>
        </div>

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
