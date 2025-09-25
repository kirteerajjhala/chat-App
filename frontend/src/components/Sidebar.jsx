import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/emptyDp.webp";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import { BsSun, BsMoon } from "react-icons/bs";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  setOtherUsers,
  setSearchData,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";

function Sidebar({ darkMode, setDarkMode, sidebarWidth, mobile }) {
  const [input, setInput] = useState("");
  const { onlineUsers, selectedUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [search, setSearch] = useState(false);

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData?.data);
  const otherUserData = useSelector((state) => state.user.otherUsers) || [];
  const searchData = useSelector((state) => state.user.searchData);

  const handleLogout = async () => {
    try {
      let token = localStorage.getItem("token");
      await axios.get("http://localhost:8000/api/auth/logout", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login", { replace: true });
    } catch (error) {
      localStorage.removeItem("token");
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login", { replace: true });
    }
  };

  const handleSearch = async () => {
    try {
      let token = localStorage.getItem("token");
      if (!input.trim()) {
        dispatch(setSearchData([]));
        return;
      }
      const result = await axios.get(
        `http://localhost:8000/api/user/search?query=${input}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setSearchData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch();
    }, 400);
    return () => clearTimeout(timeout);
  }, [input]);

  return (
    <div
      style={{ width: mobile ? "100%" : sidebarWidth }}
      className={`h-[100vh] flex-shrink-0 flex flex-col transition-all duration-300 ${
        darkMode ? "bg-[#121c1b] text-white" : "bg-slate-200 text-gray-900"
      }`}
    >
      {/* Top Buttons + Back Button (Mobile) */}
      <div className="absolute top-2 left-3 flex gap-2 z-50 items-center">
        {mobile && selectedUser && (
          <div
            onClick={() => dispatch(setSelectedUser(null))}
            className="p-2 cursor-pointer rounded-full bg-gray-200 dark:bg-[#00ffa2] hover:bg-gray-300 dark:hover:bg-[#1f2c2b]"
          >
            <FaArrowLeftLong className={`text-lg ${darkMode ? "text-white" : "text-gray-800"}`} />
          </div>
        )}
      </div>

      <div className="absolute top-2 right-3 flex gap-2 z-50">
        <div
          className={`rounded-full p-2 cursor-pointer shadow-md border ${
            darkMode
              ? "bg-[#1f2c2b] border-[#2c6f56] hover:bg-[#2c6f56]"
              : "bg-white border-gray-300 hover:bg-gray-200"
          } transition duration-200`}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <BsSun size={"1.8em"} color="#FFD700" /> : <BsMoon size={"1.8em"} color="#333" />}
        </div>
        <div
          className={`rounded-full p-2 cursor-pointer shadow-md border ${
            darkMode
              ? "bg-[#1f2c2b] border-[#2c6f56] hover:bg-[#2c6f56]"
              : "bg-white border-gray-300 hover:bg-gray-200"
          } transition duration-200`}
          onClick={handleLogout}
        >
          <BiLogOutCircle size={"2em"} color={darkMode ? "#fff" : "#333"} />
        </div>
      </div>

      {/* Header */}
      <div className={`w-full h-[240px] flex flex-col justify-center rounded-b-[20%] ${darkMode ? "bg-[#075E54]" : "bg-[#075E54]"}`}>
        <div className="px-10 font-bold text-2xl  text-yellow-400 uppercase ">chatly</div>
        <div className="w-full flex justify-between px-5 text-xl font-bold items-center mt-4">
          <div className="text-zinc-200">Hii, {userData?.name || "User"}</div>
          <div
            onClick={() => navigate("/profile")}
            className="w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer flex justify-center items-center shadow-md"
          >
            <img
              src={userData?.image || dp}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Search */}
        <div className="w-full mt-4 px-5">
          <div
            className={`w-full h-[45px] flex items-center gap-2 rounded-full overflow-hidden px-4 relative ${
              darkMode ? "bg-[#1f2c2b] text-white" : "bg-white text-gray-900"
            } shadow-md`}
          >
            <IoIosSearch
              size={"1.8em"}
              className={darkMode ? "text-gray-200" : "text-gray-500"}
            />
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              className="w-full h-full p-2 text-[17px] outline-none border-0 bg-transparent"
              type="text"
              placeholder="Search users..."
              onFocus={() => setSearch(true)}
            />
            {search && (
              <RxCross2
                size={"1.3em"}
                onClick={() => {
                  setSearch(false);
                  setInput("");
                  dispatch(setSearchData([]));
                }}
                className="cursor-pointer absolute right-3 text-gray-500"
              />
            )}
          </div>
        </div>
      </div>

      {/* Users List */}
      <div
        className={`w-full flex-1 overflow-auto px-5 py-2 ${darkMode ? "bg-[#121c1b]" : "bg-slate-200"}`}
      >
        {(search ? searchData : otherUserData).map((user) => (
          <div
            key={user._id}
            onClick={() => dispatch(setSelectedUser(user))}
            className={`flex items-center gap-3 p-2 rounded-lg  cursor-pointer transition ${
              darkMode ? "text-white hover:bg-[#2c6f56]" : "text-gray-900 hover:bg-gray-300"
            }`}
          >
            <div className="w-12 h-12 rounded-full   relative">
              <div className="w-full h-full rounded-full ">
                <img src={user.image || dp} alt={user.name} className="w-full h-full object-cover rounded-full" />
              </div>
              {onlineUsers?.includes(user._id) && (
                <span className="absolute bottom-1 right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>
              )}
            </div>
            <span className="font-semibold">{user.name || user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
