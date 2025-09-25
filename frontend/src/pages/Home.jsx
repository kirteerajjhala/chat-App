import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MessageArea from "../components/MessageArea";
import GetMessages from "../custom-hooks/getMessages";
import { useSelector } from "react-redux";

function Home() {
  GetMessages();
  const { selectedUser } = useSelector((state) => state.user);

  const [sidebarWidth, setSidebarWidth] = useState(500); // default sidebar width
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  return (
    <div className={`${darkMode ? "dark" : ""} w-full h-screen flex`}>
      {/* Desktop Sidebar */}
      <div
        className="hidden md:block h-full border-r border-gray-300 dark:border-gray-700 bg-[#f0f2f5] dark:bg-[#1f2c34] relative"
        style={{ width: sidebarWidth }}
      >
        <Sidebar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          sidebarWidth={sidebarWidth}
          mobile={false}
        />

        {/* Resize handle */}
        <div
          className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-transparent"
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = sidebarWidth;

            const onMouseMove = (e) => {
              const newWidth = startWidth + (e.clientX - startX);
              if (newWidth > 220 && newWidth < 500) {
                setSidebarWidth(newWidth);
              }
            };

            const onMouseUp = () => {
              document.removeEventListener("mousemove", onMouseMove);
              document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
          }}
        />
      </div>

      {/* Desktop Message Area */}
      <div className="hidden md:flex flex-1">
        {selectedUser ? (
          <MessageArea sidebarWidth={sidebarWidth} darkMode={darkMode} /> // ✅ Pass darkMode
        ) : (
          <div className="flex flex-1 items-center bg-slate-300 justify-center text-gray-500 dark:text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>

      {/* Mobile responsive view */}
      <div className="flex md:hidden w-full h-full">
        {!selectedUser ? (
          <Sidebar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            sidebarWidth={sidebarWidth}
            mobile={true}
          />
        ) : (
          <MessageArea sidebarWidth={sidebarWidth} darkMode={darkMode} /> // ✅ Pass darkMode
        )}
      </div>
    </div>
  );
}

export default Home;
