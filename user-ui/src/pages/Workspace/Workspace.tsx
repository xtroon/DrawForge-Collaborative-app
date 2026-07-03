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
  const [tool, setTool] = useState<"pointer" | "pencil" | "brush" | "rectangle" | "circle" | "line" | "rounded-rectangle" | "rhombus" | "arrow">(
    "pencil",
  );
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const appRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);

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
      <div ref={appRef} className="min-h-screen bg-gray-50 relative overflow-hidden">
        {/* canvas */}
        <Canvas tool={tool} zoom={zoom} pan={pan} setPan={setPan} color={color} strokeWidth={strokeWidth} />

        {/* toolbar  */}
        <Toolbar tool={tool} setTool={setTool} color={color} setColor={setColor} strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} />

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
