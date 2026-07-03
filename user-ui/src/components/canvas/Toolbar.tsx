import { useState } from "react";
import { FaMousePointer, FaPencilAlt, FaPaintBrush, FaShapes, FaFont, FaSlash, FaUndo, FaRedo, FaRegClone, FaTh, FaSquare, FaCircle, FaLongArrowAltRight } from "react-icons/fa";

type ToolType = "pointer" | "pencil" | "brush" | "rectangle" | "circle" | "line" | "rounded-rectangle" | "rhombus" | "arrow";

type ToolbarProps = {
  tool: ToolType;
  setTool: (tool: ToolType) => void;
  color: string;
  setColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
};

export default function Toolbar({ tool, setTool, color, setColor, strokeWidth, setStrokeWidth }: ToolbarProps) {
  const [activeMenu, setActiveMenu] = useState<"shape" | "color" | "draw" | null>(null);

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
    `relative group cursor-pointer rounded-xl p-3 transition-all duration-200 flex items-center justify-center ${
      isActive
        ? "bg-indigo-500/20 text-indigo-400 shadow-sm"
        : "text-gray-400 hover:bg-gray-700/50 hover:text-gray-100"
    }`;

  const renderOptions = () => {
    switch (activeMenu) {
      case "shape":
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => setTool("rectangle")} 
              className={`p-2.5 rounded-lg transition-colors flex items-center justify-center w-10 h-10 ${tool === "rectangle" ? "bg-indigo-500/20 text-indigo-400" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
              title="Rectangle"
            >
              <div className="w-5 h-4 border-2 border-current" />
            </button>
            <button 
              onClick={() => setTool("rounded-rectangle")} 
              className={`p-2.5 rounded-lg transition-colors flex items-center justify-center w-10 h-10 ${tool === "rounded-rectangle" ? "bg-indigo-500/20 text-indigo-400" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
              title="Rounded Rectangle"
            >
              <div className="w-5 h-4 border-2 border-current rounded-md" />
            </button>
            <button 
              onClick={() => setTool("circle")} 
              className={`p-2.5 rounded-lg transition-colors flex items-center justify-center w-10 h-10 ${tool === "circle" ? "bg-indigo-500/20 text-indigo-400" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
              title="Circle"
            >
              <div className="w-5 h-5 border-2 border-current rounded-full" />
            </button>
            <button 
              onClick={() => setTool("rhombus")} 
              className={`p-2.5 rounded-lg transition-colors flex items-center justify-center w-10 h-10 ${tool === "rhombus" ? "bg-indigo-500/20 text-indigo-400" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
              title="Rhombus"
            >
              <div className="w-3.5 h-3.5 border-2 border-current rotate-45" />
            </button>
            <button 
              onClick={() => setTool("arrow")} 
              className={`p-2.5 rounded-lg transition-colors flex items-center justify-center w-10 h-10 ${tool === "arrow" ? "bg-indigo-500/20 text-indigo-400" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
              title="Arrow"
            >
              <FaLongArrowAltRight size={20} />
            </button>
            <button 
              onClick={() => setTool("line")} 
              className={`p-2.5 rounded-lg transition-colors flex items-center justify-center w-10 h-10 ${tool === "line" ? "bg-indigo-500/20 text-indigo-400" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
              title="Line"
            >
              <FaSlash size={20} />
            </button>
          </div>
        );
      case "draw":
        return (
          <div className="flex flex-col gap-3 p-1 w-48">
            <div className="flex gap-2">
              <button 
                onClick={() => setTool("pencil")} 
                className={`flex-1 py-2 rounded-lg transition-colors flex flex-col items-center gap-1 ${tool === "pencil" ? "bg-indigo-500/20 text-indigo-400" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
              >
                <FaPencilAlt size={16} />
                <span className="text-[10px]">Pencil</span>
              </button>
              <button 
                onClick={() => setTool("brush")} 
                className={`flex-1 py-2 rounded-lg transition-colors flex flex-col items-center gap-1 ${tool === "brush" ? "bg-indigo-500/20 text-indigo-400" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
              >
                <FaPaintBrush size={16} />
                <span className="text-[10px]">Brush</span>
              </button>
            </div>
            <div className="h-px w-full bg-gray-700/80" />
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-400 font-medium px-1">Stroke Width</span>
              <div className="flex gap-2 justify-between px-1">
                {[2, 4, 8].map((w) => (
                  <button
                    key={w}
                    onClick={() => setStrokeWidth(w)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${strokeWidth === w ? "border-indigo-400 bg-indigo-500/10" : "border-gray-600 hover:border-gray-400"}`}
                  >
                    <div className="bg-current rounded-full" style={{ width: w + 2, height: w + 2, color: strokeWidth === w ? "#818cf8" : "#9ca3af" }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case "color":
        return (
          <div className="flex flex-col gap-3 p-1">
            <div className="grid grid-cols-5 gap-2.5">
              {colors.map((c) => (
                <button
                  key={c}
                  title={c}
                  onClick={() => { setColor(c); setActiveMenu(null); }}
                  className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                    color === c ? "border-indigo-400 scale-125 shadow-md shadow-indigo-500/30" : "border-gray-500/30 hover:scale-110 hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            
            <div className="h-px w-full bg-gray-700/80" />
            
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-gray-400 font-medium">Custom Color</span>
              <label className="relative group rounded-full overflow-hidden w-7 h-7 cursor-pointer ring-2 ring-gray-600 hover:ring-indigo-400 transition-all">
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
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        {/* Floating Options Menu */}
        {activeMenu && (
          <div className="mb-4 rounded-2xl bg-gray-900/85 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-black/40 p-2 flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-200">
            {renderOptions()}
          </div>
        )}

        {/* Main Toolbar */}
        <div className="bg-gray-900/85 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-black/40 rounded-2xl px-4 py-2 flex items-center gap-1">

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
            title="Draw"
          >
            {tool === "brush" ? <FaPaintBrush size={18} /> : <FaPencilAlt size={18} />}
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

          <button className={getBtnClass(false)} title="Text (Coming Soon)">
            <FaFont size={18} />
          </button>
          
          <button className={getBtnClass(false)} title="Grid (Coming Soon)">
            <FaTh size={18} />
          </button>

          <button className={getBtnClass(false)} title="Duplicate (Coming Soon)">
            <FaRegClone size={18} />
          </button>

          <div className="w-px h-8 bg-gray-700/80 mx-2" />

          <button className={getBtnClass(false)} title="Undo (Coming Soon)">
            <FaUndo size={18} />
          </button>

          <button className={getBtnClass(false)} title="Redo (Coming Soon)">
            <FaRedo size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
