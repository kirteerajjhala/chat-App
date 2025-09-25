import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import dp from "../assets/emptyDp.webp";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";
import { IoSendSharp } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./senderMessage";
import Receivermessage from "./receivermessage";
import axios from "axios";
import { setMessages } from "../redux/messageSlic";
import GetMessages from "../custom-hooks/getMessages";

function MessageArea({ darkMode, sidebarWidth }) {
  const userData = useSelector((state) => state.user.userData?.data);
  const messages = useSelector((state) => state.message.messages);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const { socket, onlineUsers } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [frontendImg, setFrontendImg] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const image = useRef();

  // Custom hook
  GetMessages();

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImg(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    if (input.length === 0 && backendImage == null) return;
    e.preventDefault();
    try {
      const formData = new FormData();
      const token = localStorage.getItem("token");

      formData.append("message", input);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(
        `http://localhost:8000/api/message/send/${selectedUser._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInput("");
      setBackendImage(null);
      setFrontendImg(null);

      dispatch(setMessages([...messages, result.data.data]));
    } catch (error) {
      console.log("Error sending message:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess]));
    });
    return () => socket.off("newMessage");
  }, [messages, dispatch, socket]);

  // Jab koi user select nahi kiya ho
  if (!selectedUser) {
    return (
      <div
        style={{ width: `calc(100% - ${sidebarWidth}px)` }}
        className={`flex-1 h-full flex flex-col justify-center items-center ${
          darkMode ? "bg-[#111b21]" : "bg-gray-100"
        }`}
      >
        <h1 className={`font-bold text-[40px] ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
          Welcome to Chatly
        </h1>
        <span className={`font-semibold text-[20px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Select a user to start chatting
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ width: `calc(100% - ${sidebarWidth}px)`, transition: "all 0.3s ease" }}
      className={`relative flex-1 flex flex-col h-full ${
        darkMode ? "bg-[#111b21]" : "bg-slate-300"
      }`}
    >
      {/* Header */}
      <div
        className={`w-full h-[70px] flex items-center gap-4 px-5 shadow-md ${
          darkMode ? "bg-[#075E54] text-white" : "bg-[#075E54] text-gray-900"
        }`}
      >
        <div onClick={() => dispatch(setSelectedUser(null))} className="cursor-pointer">
          <FaArrowLeftLong className={`text-2xl ${darkMode ? "text-gray-200" : "text-zinc-700"}`} />
        </div>

        <div className="flex items-center gap-3 relative">
          <div className="w-[50px] h-[50px] rounded-full overflow-hidden relative">
            <img
              src={selectedUser?.image || dp}
              alt="dp"
              className="w-full h-full object-cover"
            />
            {onlineUsers?.includes(selectedUser?._id) && (
              <span
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2"
                style={{ borderColor: darkMode ? "#111b21" : "#fff" }}
              ></span>
            )}
          </div>
          <h1 className={`font-semibold text-[17px] ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
            {selectedUser?.name || selectedUser?.username || "User"}
          </h1>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.map((item, index) =>
          item.sender === userData?._id ? (
            <SenderMessage key={index} image={item.image} message={item.message} darkMode={darkMode} />
          ) : (
            <Receivermessage key={index} image={item.image} message={item.message} darkMode={darkMode} />
          )
        )}
      </div>

      {/* Emoji Picker */}
      {showPicker && (
        <div className="absolute bottom-[90px] left-5 z-50">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            theme={darkMode ? "dark" : "light"}
            emojiStyle="apple"
            suggestedEmojisMode="recent"
            width={290}
            height={390}
          />
        </div>
      )}

      {/* Input Box */}
      <div className="w-full px-5 py-3 h-fit flex items-center gap-2">
        {frontendImg && (
          <img
            src={frontendImg}
            alt=""
            className="w-[60px] h-[60px] rounded-lg shadow-md object-cover"
          />
        )}
        <form
          onSubmit={handleSendMessage}
          className={`flex-1 flex items-center gap-2 rounded-full px-4 py-2 shadow-sm ${
            darkMode ? "bg-[#202c33]" : "bg-[#e6e6e6]"
          }`}
        >
          <div
            onClick={() => setShowPicker((prev) => !prev)}
            className={`cursor-pointer p-2 rounded-full flex items-center justify-center ${
              darkMode ? "bg-green-500" : "bg-green-500"
            }`}
          >
            <MdOutlineEmojiEmotions size={"1.5em"} />
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={image}
            onChange={handleImage}
          />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
            className={`flex-1 outline-none text-[15px] ${
              darkMode ? "text-gray-200 placeholder-gray-400" : "text-gray-800 placeholder-gray-500"
            } bg-transparent`}
          />
          <div
            onClick={() => image.current.click()}
            className={`cursor-pointer p-2 rounded-full  font-extrabold  ${
              darkMode ? "  text-white bg-green-600 " : "bg-black  text-white"
              
            }`}
          >
            <CiImageOn size={"1.5em"} />
          </div>
          {(input.length > 0 || backendImage != null) && (
            <button
              type="submit"
              className="cursor-pointer p-2 rounded-full bg-[#25D366] flex items-center justify-center"
            >
              <IoSendSharp color="white" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default MessageArea;
