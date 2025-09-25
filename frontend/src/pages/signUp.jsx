import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await axios.post("http://localhost:8000/api/auth/signup", {
        username: userInfo.username,
        email: userInfo.email,
        password: userInfo.password,
      });

      dispatch(setUserData(response.data));
      toast.success("User registered successfully!");
      setUserInfo({ username: "", email: "", password: "" });
      setErrMsg("");
      navigate("/login");
    } catch (error) {
      console.error(error.message);
      setErrMsg(error.response?.data?.message || "Something went wrong");
      toast.error(error.response?.data?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen  bg-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="w-full h-36 flex items-center justify-center bg-[#075E54] rounded-b-[30%] shadow-lg">
          <h1 className="text-2xl md:text-3xl text-white font-bold tracking-tight">
            Welcome to <span className="text-yellow-400">Chatly</span>
          </h1>
        </div>

        {/* Form */}
        <form
          className="w-full flex flex-col gap-5 p-6"
          onSubmit={handleSignUp}
        >
          <input
            type="text"
            placeholder="Username"
            value={userInfo.username}
            onChange={(e) =>
              setUserInfo((prev) => ({ ...prev, username: e.target.value }))
            }
            className="w-full h-12 px-4 rounded-lg border-2 border-[#075E54] focus:border-[#128C7E] outline-none shadow-sm text-gray-700 transition"
          />

          <input
            type="email"
            placeholder="Email"
            value={userInfo.email}
            onChange={(e) =>
              setUserInfo((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full h-12 px-4 rounded-lg border-2 border-[#075E54] focus:border-[#128C7E] outline-none shadow-sm text-gray-700 transition"
          />

          <div className="w-full relative flex items-center border-2 border-[#075E54] rounded-lg overflow-hidden shadow-sm">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              value={userInfo.password}
              onChange={(e) =>
                setUserInfo((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full h-12 px-4 outline-none text-gray-700"
            />
            <span
              onClick={() => setShow((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#075E54] font-semibold select-none"
            >
              {show ? "Hide" : "Show"}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#075E54] hover:bg-[#128C7E] text-white font-semibold shadow-lg transition duration-300"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-center text-gray-600 mt-2">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-[#128C7E] font-bold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

          {errMsg && (
            <p className="text-red-500 text-center text-sm mt-1">{errMsg}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default SignUp;
