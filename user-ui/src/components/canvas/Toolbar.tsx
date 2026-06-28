import { useState } from "react";
import {FaPencilAlt, FaShapes, FaFont, FaSlash ,FaUndo, FaRedo, FaRegClone} from 'react-icons/fa'; 

export default function Toolbar() {
  const [activeTool, setActiveTool] = useState<"draw" | "shape" | "line" | "text" | "template">("draw");

  return (
    <>
      {/* Floating Options */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg p-4">
        {activeTool === "draw" && (
          <div className="flex gap-3">
            <button>Pencil</button>
            <button>Brush</button>
            <button>Marker</button>
            <input type="color" />
          </div>
        )}

        {activeTool === "shape" && (
          <div className="flex gap-3">
            <button>Rectangle</button>
            <button>Circle</button>
            <button>Arrow</button>
            <button>Line</button>
          </div>
        )}

        {activeTool === "text" && (
          <div className="flex gap-3">
            <button>B</button>
            <button>I</button>
            <button>U</button>
            <input type="number" placeholder="16" className="w-14" />
          </div>
        )}

        {activeTool === "template" && (
          <div className="flex gap-3">
            <button>Flowchart</button>
            <button>Mind Map</button>
            <button>Blank</button>
          </div>
        )}
      </div>

      {/* Bottom Toolbar */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white shadow-xl rounded-2xl px-6 py-3 flex items-center gap-6">

        <button onClick={() => setActiveTool("draw")}>
          <FaPencilAlt size={20} />
        </button>

        <button onClick={() => setActiveTool("shape")}>
          <FaShapes size={20} />
        </button>

        <button onClick={() => setActiveTool("line")}>
          <FaSlash size={20} />
        </button>

        <button onClick={() => setActiveTool("text")}>
          <FaFont size={20} />
        </button>

        <button onClick={() => setActiveTool("template")}>
          <FaRegClone size={20} />
        </button>

        <div className="w-px h-7 bg-gray-300" />

        <button>
          <FaUndo size={20} />
        </button>

        <button>
          <FaRedo size={20} />
        </button>

      </div>
    </>
  );
}

