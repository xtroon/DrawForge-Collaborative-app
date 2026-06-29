import { useState } from "react";
import { FiShare  } from "react-icons/fi";


type User = {
  id: number;
  name: string;
};

const users: User[] = [
  { id: 1, name: "Om" },
  { id: 2, name: "Rahul" },
  { id: 3, name: "Aman" },
  { id: 4, name: "Priya" },
];

export default function Online() {
  const [showUsers, setShowUsers] = useState(false);

  return (
    <div className="fixed top-5 right-5 bg-gray-800 py-2 px-4 rounded-2xl shadow-xl flex items-center gap-7 z-50">
      {/* users */}
      <div className="relative">
        <div
          onClick={() => setShowUsers(!showUsers)}
          className="flex cursor-pointer"
        >
          {users.slice(0, 3).map((user, index) => (
            <div
              key={user.id}
              className={`w-10 h-10 rounded-full bg-blue-500 border-2 border-white text-white flex items-center justify-center font-semibold ${
                index !== 0 ? "-ml-3" : ""
              }`}
            >
              {user.name[0]}
            </div>
          ))}

          {users.length > 3 && (
            <div className="-ml-3 w-10 h-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-sm">
              +{users.length - 3}
            </div>
          )}
        </div>

        {/* popup */}
        {showUsers && (
          <div className="absolute right-0 mt-3 w-52 bg-white rounded-lg shadow-xl p-3">
            <p className="font-semibold mb-2 text-gray-700">Online Users</p>

            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {user.name[0]}
                </div>

                <span className="text-gray-700">{user.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* share btn */}
      <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 flex justify-between items-center gap-2 rounded-lg font-medium transition">
        Share
        <FiShare size={20}/>
      </button>
    </div>
  );
}
