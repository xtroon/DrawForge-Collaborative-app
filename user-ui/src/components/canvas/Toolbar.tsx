import { useState, useRef, useEffect } from "react";
import { FaMousePointer, FaPencilAlt, FaPaintBrush, FaEraser, FaShapes, FaFont, FaSlash, FaUndo, FaRedo, FaRegClone, FaTh, FaSquare, FaCircle, FaLongArrowAltRight } from "react-icons/fa";

type ToolType = "pointer" | "pencil" | "brush" | "eraser" | "rectangle" | "circle" | "line" | "rounded-rectangle" | "rhombus" | "arrow" | "text";

type ToolbarProps = {
  tool: ToolType;
  setTool: (tool: ToolType) => void;
  color: string;
  setColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
};

export default function Toolbar({ tool, setTool, color, setColor, strokeWidth, setStrokeWidth, onUndo, onRedo, canUndo, canRedo, showGrid, setShowGrid }: ToolbarProps) {
  const [activeMenu, setActiveMenu] = useState<"shape" | "color" | "draw" | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const colors = [
    "#ffffff",
    "#a1a1aa",
    "#18181b",
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
  ];

  const getBtnClass = (isActive: boolean) =>
    `relative group cursor-pointer p-3 transition-all duration-200 flex items-center justify-center doodle-btn ${
      isActive
        ? "bg-[#FFC53D] text-[#2B2B2A] border-2 border-[#2B2B2A] shadow-[2px_2px_0_#2B2B2A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#2B2B2A]"
        : "text-[#8a8a86] hover:bg-[#2B2B2A]/5 hover:text-[#2B2B2A] border-2 border-transparent"
    }`;

  const renderOptions = () => {
    switch (activeMenu) {
      case "shape":
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => setTool("rectangle")} 
              className={`p-2.5 rounded-lg transition-colors flex items-center justify-center w-10 h-10 ${tool === "rectangle" ? "bg-[#FFC53D] text-[#2B2B2A] border-2 border-[#2B2B2A]" : "text-[#8a8a86] hover:bg-[#2B2B2A]/5 hover:text-[#2B2B2A]"}`}
              title="Rectangle"
            >
              <div className="w-5 h-4 border-2 border-current" />
            </button>
            <button 
              onClick={() => setTool("rounded-rectangle")} 
              className={`p-2.5 rounded-lg transition-colors flex items-center justify-center w-10 h-10 ${tool === "rounded-rectangle" ? "bg-[#FFC53D] text-[#2B2B2A] border-2 border-[#2B2B2A]" : "text-[#8a8a86] hover:bg-[#2B2B2A]/5 hover:text-[#2B2B2A]"}`}
              title="Rounded Rectangle"
            >
              <div className="w-5 h-4 border-2 border-current rounded-md" />
            </button>
            <button 
              onClick={() => setTool("circle")} 
              className={`p-2.5 rounded-lg transition-colors flex items-center justify-center w-10 h-10 ${tool === "circle" ? "bg-[#FFC53D] text-[#2B2B2A] border-2 border-[#2B2B2A]" : "text-[#8a8a86] hover:bg-[#2B2B2A]/5 hover:text-[#2B2B2A]"}`}
              title="Circle"
            >
              <div className="w-5 h-5 border-2 border-current rounded-full" />
            </button>
            <button 
              onClick={() => setTool("rhombus")} 
              className={`p-2.5 rounded-lg transition-colors flex items-center justify-center w-10 h-10 ${tool === "rhombus" ? "bg-[#FFC53D] text-[#2B2B2A] border-2 border-[#2B2B2A]" : "text-[#8a8a86] hover:bg-[#2B2B2A]/5 hover:text-[#2B2B2A]"}`}
              title="Rhombus"
            >
              <div className="w-3.5 h-3.5 border-2 border-current rotate-45" />
            </button>
            <button 
              onClick={() => setTool("arrow")} 
              className={`p-2.5 rounded-lg transition-colors flex items-center justify-center w-10 h-10 ${tool === "arrow" ? "bg-[#FFC53D] text-[#2B2B2A] border-2 border-[#2B2B2A]" : "text-[#8a8a86] hover:bg-[#2B2B2A]/5 hover:text-[#2B2B2A]"}`}
              title="Arrow"
            >
              <FaLongArrowAltRight size={20} />
            </button>
            <button 
              onClick={() => setTool("line")} 
              className={`p-2.5 rounded-lg transition-colors flex items-center justify-center w-10 h-10 ${tool === "line" ? "bg-[#FFC53D] text-[#2B2B2A] border-2 border-[#2B2B2A]" : "text-[#8a8a86] hover:bg-[#2B2B2A]/5 hover:text-[#2B2B2A]"}`}
              title="Line"
            >
              <FaSlash size={20} />
            </button>
          </div>
        );
      case "draw":
        return (
          <div className="flex flex-col gap-3 p-1 w-48 font-sans">
            <div className="flex gap-2">
              <button 
                onClick={() => setTool("pencil")} 
                className={`flex-1 py-2 rounded-lg transition-colors flex flex-col items-center gap-1 border-2 ${tool === "pencil" ? "bg-[#FFC53D] text-[#2B2B2A] border-[#2B2B2A]" : "text-[#8a8a86] hover:bg-[#2B2B2A]/5 hover:text-[#2B2B2A] border-transparent"}`}
              >
                <FaPencilAlt size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Pencil</span>
              </button>
              <button 
                onClick={() => setTool("brush")} 
                className={`flex-1 py-2 rounded-lg transition-colors flex flex-col items-center gap-1 border-2 ${tool === "brush" ? "bg-[#FFC53D] text-[#2B2B2A] border-[#2B2B2A]" : "text-[#8a8a86] hover:bg-[#2B2B2A]/5 hover:text-[#2B2B2A] border-transparent"}`}
              >
                <FaPaintBrush size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Brush</span>
              </button>
            </div>
            <div className="h-px w-full bg-[#2B2B2A]/20" />
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[#8a8a86] font-bold uppercase tracking-wider px-1">Stroke Width</span>
              <div className="flex gap-2 justify-between px-1">
                {[2, 4, 8].map((w) => (
                  <button
                    key={w}
                    onClick={() => setStrokeWidth(w)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${strokeWidth === w ? "border-[#FF6B6B] bg-[#FF6B6B]/20" : "border-[#2B2B2A]/30 hover:border-[#2B2B2A]"}`}
                  >
                    <div className="bg-current rounded-full" style={{ width: w + 2, height: w + 2, color: strokeWidth === w ? "#FF6B6B" : "#2B2B2A" }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case "color":
        return (
          <div className="flex flex-col gap-3 p-1 font-sans">
            <div className="grid grid-cols-5 gap-2.5">
              {colors.map((c) => (
                <button
                  key={c}
                  title={c}
                  onClick={() => { setColor(c); setActiveMenu(null); }}
                  className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                    color === c ? "border-[#2B2B2A] scale-125 shadow-[2px_2px_0_#2B2B2A]" : "border-transparent hover:scale-110 hover:border-[#2B2B2A]/50 shadow-sm"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            
            <div className="h-px w-full bg-[#2B2B2A]/20" />
            
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-[#8a8a86] font-bold uppercase tracking-wider">Custom Color</span>
              <label className="relative group rounded-full overflow-hidden w-7 h-7 cursor-pointer ring-2 ring-[#2B2B2A]/20 hover:ring-[#2B2B2A] transition-all">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer border-0 p-0 m-0"
                  title="Custom Color"
                />
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div ref={toolbarRef} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        {/* Floating Options Menu */}
        {activeMenu && (
          <div className="mb-4 bg-white border-2 border-[#2B2B2A] shadow-[4px_4px_0_#FF6B6B] p-2 flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-200 doodle-card wobble-1">
            {renderOptions()}
          </div>
        )}

        {/* Main Toolbar */}
        <div className="bg-white border-2 border-[#2B2B2A] shadow-[6px_6px_0_#4FC1CF] px-4 py-2 flex items-center gap-2 doodle-card">

          <button 
            className={getBtnClass(tool === "pointer")} 
            onClick={() => { setTool("pointer"); setActiveMenu(null); }}
            title="Pointer"
          >
            <FaMousePointer size={18} />
          </button>

          <button
            className={getBtnClass(activeMenu === "color")}
            onClick={() => setActiveMenu(activeMenu === "color" ? null : "color")}
            title="Choose Color"
          >
            <div className="w-5 h-5 rounded-full border-2 border-gray-400 shadow-inner" style={{ backgroundColor: color }} />
          </button>

          <button 
            className={getBtnClass(tool === "pencil" || tool === "brush")} 
            onClick={() => {
              if (activeMenu === "draw") setActiveMenu(null);
              else {
                setActiveMenu("draw");
                if (tool !== "pencil" && tool !== "brush") setTool("pencil");
              }
            }}
            title="Draw & Erase"
          >
            {tool === "brush" ? <FaPaintBrush size={18} /> :<FaPencilAlt size={18} />}
          </button>

          <button 
            className={getBtnClass(tool === "eraser")} 
            onClick={() => {
              setActiveMenu(null);
              setTool("eraser");
            }}
            title="Erase"
          >
            {<FaEraser size={18} />}
          </button>

         
          <button 
            className={getBtnClass(tool === "rectangle" || tool === "circle" || tool === "rounded-rectangle" || tool === "rhombus" || tool === "arrow" || tool === "line")} 
            onClick={() => {
              if (activeMenu === "shape") setActiveMenu(null);
              else {
                setActiveMenu("shape");
                if (!["rectangle", "circle", "rounded-rectangle", "rhombus", "arrow", "line"].includes(tool)) {
                  setTool("rectangle");
                }
              }
            }}
            title="Shapes & Lines"
          >
            <FaShapes size={18} />
          </button>

          <div className="w-px h-8 bg-gray-700/80 mx-2" />

          <button className={getBtnClass(tool === "text")} title="Text" onClick={() => { setTool("text"); setActiveMenu(null); }}>
            <FaFont size={18} />
          </button>
          
          <button className={getBtnClass(showGrid)} title="Toggle Grid" onClick={() => setShowGrid(!showGrid)}>
            <FaTh size={18} />
          </button>

          <button className={getBtnClass(false)} title="Duplicate (Coming Soon)">
            <FaRegClone size={18} />
          </button>

          <div className="w-px h-8 bg-gray-700/80 mx-2" />

          <button 
            className={getBtnClass(false)} 
            onClick={onUndo} 
            disabled={!canUndo} 
            title="Undo"
          >
            <FaUndo size={18} className={!canUndo ? "opacity-30" : ""} />
          </button>

          <button 
            className={getBtnClass(false)} 
            onClick={onRedo} 
            disabled={!canRedo} 
            title="Redo"
          >
            <FaRedo size={18} className={!canRedo ? "opacity-30" : ""} />
          </button>
        </div>
      </div>
    </>
  );
}
