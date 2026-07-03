import Canvas from "../../features/Canva";
import Online from "../../components/canvas/Online";
import Toolbar from "../../components/canvas/Toolbar";
import {
  MdFullscreen,
  MdFullscreenExit,
  MdKeyboardBackspace,
} from "react-icons/md";
import { useState, useRef, useEffect } from "react";

function Workspace() {
  const [tool, setTool] = useState<"pointer" | "pencil" | "rectangle" | "circle" | "line">(
    "pointer",
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const appElement = appRef.current;
    if (!appElement) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Prevent browser native zoom and scroll
      if (e.ctrlKey) {
        setZoom((prevZoom) => {
          // Adjust the sensitivity for pinch-to-zoom
          const newZoom = prevZoom - e.deltaY * 0.25;
          return Math.round(Math.min(Math.max(newZoom, 10), 300));
        });
      } else {
        // Two-finger slide pans the canvas
        setPan((prevPan) => ({
          x: prevPan.x - e.deltaX,
          y: prevPan.y - e.deltaY,
        }));
      }
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
      <div ref={appRef} className="min-h-screen bg-gray-50 relative overflow-hidden">
        {/* canvas */}
        <Canvas tool={tool} zoom={zoom} pan={pan} setPan={setPan} />

        {/* toolbar  */}
        <Toolbar tool={tool} setTool={setTool} />

        {/* current online users  */}
        <Online zoom={zoom} setZoom={setZoom} />

        {/* back to dashboard button */}
        <div className=" fixed top-5 left-5 hover:bg-gray-600 bg-gray-800 text-white p-1 rounded-full shadow-lg">
          <button className=" cursor-pointer rounded-full p-2 duration-300 ease-in-out">
            <MdKeyboardBackspace size={20} />
          </button>
        </div>

        {/* full screen button */}
        <div className=" fixed bottom-5 right-5 bg-gray-800 text-white p-1 rounded-full shadow-lg">
          <button
            onClick={toggleFullscreen}
            className=" cursor-pointer hover:bg-gray-600 rounded-full p-2 duration-300 ease-in-out"
          >
            {isFullscreen ? (
              <MdFullscreenExit size={20} />
            ) : (
              <MdFullscreen size={20} />
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default Workspace;
