import { useState } from "react";
import { FaMousePointer, FaPencilAlt, FaShapes, FaFont, FaSlash, FaUndo, FaRedo, FaRegClone, FaTh, FaSquare, FaCircle } from "react-icons/fa";

type ToolType = "pointer" | "pencil" | "rectangle" | "circle" | "line";

type ToolbarProps = {
  tool: ToolType;
  setTool: (tool: ToolType) => void;
};

export default function Toolbar({ tool, setTool }: ToolbarProps) {
  const [activeMenu, setActiveMenu] = useState<"shape" | null>(null);

  const renderOptions = () => {
    switch (activeMenu) {
      case "shape":
        return (
          <div className="flex gap-3 text-black">
            <button onClick={() => setTool("rectangle")} className={`p-2 rounded ${tool === "rectangle" ? "bg-gray-200" : "hover:bg-gray-100"}`}><FaSquare size={20}/></button>
            <button onClick={() => setTool("circle")} className={`p-2 rounded ${tool === "circle" ? "bg-gray-200" : "hover:bg-gray-100"}`}><FaCircle size={20}/></button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
        {/* Floating Options */}
        {activeMenu && (
          <div className="mb-3 rounded-xl bg-white shadow-lg p-4 flex justify-center">
            {renderOptions()}
          </div>
        )}

        {/* Bottom Toolbar */}
        <div className=" bg-gray-800 text-white shadow-xl rounded-2xl px-8 py-2 flex items-center gap-3">

          <button 
            className={`cursor-pointer rounded-full p-4 duration-300 ease-in-out ${tool === "pointer" ? "bg-gray-600" : "hover:bg-gray-600"}`} 
            onClick={() => { setTool("pointer"); setActiveMenu(null); }}
          >
            <FaMousePointer size={20} />
          </button>

          <button 
            className={`cursor-pointer rounded-full p-4 duration-300 ease-in-out ${tool === "pencil" ? "bg-gray-600" : "hover:bg-gray-600"}`} 
            onClick={() => { setTool("pencil"); setActiveMenu(null); }}
          >
            <FaPencilAlt size={20} />
          </button>

          <button 
            className={`cursor-pointer rounded-full p-4 duration-300 ease-in-out ${tool === "rectangle" || tool === "circle" ? "bg-gray-600" : "hover:bg-gray-600"}`} 
            onClick={() => setActiveMenu(activeMenu === "shape" ? null : "shape")}
          >
            <FaShapes size={20} />
          </button>

          <button 
            className={`cursor-pointer rounded-full p-4 duration-300 ease-in-out ${tool === "line" ? "bg-gray-600" : "hover:bg-gray-600"}`} 
            onClick={() => { setTool("line"); setActiveMenu(null); }}
          >
            <FaSlash size={20} />
          </button>

          <button className=" cursor-pointer hover:bg-gray-600  rounded-full p-4 duration-300 ease-in-out">
            <FaFont size={20} />
          </button>
          
          <button className=" cursor-pointer hover:bg-gray-600  rounded-full p-4 duration-300 ease-in-out">
            <FaTh size={20} />
          </button>

          <button className=" cursor-pointer hover:bg-gray-600  rounded-full p-4 duration-300 ease-in-out">
            <FaRegClone size={20} />
          </button>

          <div className="w-px h-7 bg-gray-500 mx-2" />

          <button className=" cursor-pointer hover:bg-gray-600  rounded-full p-4 duration-300 ease-in-out">
            <FaUndo size={20} />
          </button>

          <button className=" cursor-pointer hover:bg-gray-600  rounded-full p-4 duration-300 ease-in-out">
            <FaRedo size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
