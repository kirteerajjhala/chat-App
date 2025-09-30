import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
import useCurrentUser from "./custom-hooks/getCurrentUser";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { useDispatch, useSelector } from "react-redux";
import useOtherUsers from "./custom-hooks/getOtherUser";
import { io } from "socket.io-client";
import { setOnlineUsers, setSocket } from "./redux/userSlice";

function App() {
  useOtherUsers();
  useCurrentUser();

  const userData = useSelector((state) => state.user.userData?.data);
  const { socket } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      // ✅ Backend se socket connect
      const socketio = io("http://localhost:8000", {
        query: { userId: userData?._id },
        transports: ["websocket"], // fallback issues avoid karne ke liye
      });

      dispatch(setSocket(socketio));

      // ✅ Online users listen
      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      // cleanup on unmount or userData change
      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else {
      // agar user logout ho jaye to socket close
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData, dispatch]); // ✅ dispatch ko bhi dependency me rakha

  return (
    <Routes>
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/profile" />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile"
        element={userData ? <Profile /> : <Navigate to="/signup" />}
      />
    </Routes>
  );
}

export default App;
