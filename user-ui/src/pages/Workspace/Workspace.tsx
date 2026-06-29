import Online from "../../components/canvas/Online";
import Toolbar from "../../components/canvas/Toolbar";
import { MdFullscreen, MdKeyboardBackspace } from "react-icons/md";

function Workspace() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 relative">
        {/* canvas */}


        
        {/* toolbar  */}
        <Toolbar />

        {/* current online users  */}
        < Online />

        {/* back to dashboard button */}
        <div className=" fixed top-5 left-5 bg-gray-800 text-white p-1 rounded-full shadow-lg">
          <button className=" cursor-pointer hover:bg-gray-600 rounded-full p-2 duration-300 ease-in-out" >
            <MdKeyboardBackspace size={20} />
          </button>
        </div>

        {/* full screen button */}
        <div className=" fixed bottom-5 right-5 bg-gray-800 text-white p-1 rounded-full shadow-lg">
          <button className=" cursor-pointer hover:bg-gray-600 rounded-full p-2 duration-300 ease-in-out" >
            <MdFullscreen size={20} />
          </button>
        </div>
      </div>
    </>
  );
}

export default Workspace;
