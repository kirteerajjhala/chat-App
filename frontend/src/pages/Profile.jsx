import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/emptyDp.webp";
import { CiCamera } from "react-icons/ci";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserData } from "../redux/userSlice";

function Profile() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(useSelector((state) => state.user.userData.data.name) || "");
  const [frontendImage, setFrontendImage] = useState(useSelector((state) => state.user.userData.data.image) || dp);
  const [backendImage, setBackendImage] = useState(null);

  const userData = useSelector((state) => state.user.userData.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const image = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setFrontendImage(url);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    if (backendImage) formData.append("image", backendImage);

    const token = localStorage.getItem("token");
    try {
      const result = await axios.put("http://localhost:8000/api/user/editProfile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setUserData(result.data));
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#009d8b] to-[#d0d6d5] flex flex-col items-center justify-start pt-20 px-4 md:px-0 select-none">
      {/* Back Button */}
      <div className="absolute top-6 left-5 flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <BsArrowLeftCircleFill className="text-3xl text-white hover:text-gray-200 transition" />
        <span className="text-white font-semibold tracking-tight hover:text-gray-200">Back to Home</span>
      </div>

      {/* Profile Image */}
      <div
        onClick={() => image.current.click()}
        className="relative mt-6 w-[180px] h-[180px] md:w-[200px] md:h-[200px] rounded-full border-4 border-white shadow-xl flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105"
      >
        <img
          src={frontendImage}
          alt="Profile"
          className="w-full h-full object-cover rounded-full"
        />
        <div className="absolute bottom-0 right-0 w-10 h-10 md:w-12 md:h-12 bg-green-600 rounded-full flex items-center justify-center shadow-md">
          <CiCamera className="text-white text-2xl md:text-3xl" />
        </div>
        <input type="file" accept="image/*" hidden ref={image} onChange={handleFileChange} />
      </div>

      {/* Form */}
      <form
        onSubmit={handleUpdateProfile}
        className="w-full max-w-md mt-8 flex flex-col gap-5 bg-white rounded-2xl p-6 shadow-lg"
      >
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-12 px-4 rounded-lg border-2 border-[#075E54] focus:border-[#128C7E] outline-none text-gray-700 text-lg shadow-sm transition"
        />
        <input
          type="text"
          readOnly
          value={userData.username}
          className="w-full h-12 px-4 rounded-lg border-2 border-gray-300 bg-gray-100 text-gray-500 text-lg outline-none shadow-sm"
        />
        <input
          type="email"
          readOnly
          value={userData.email}
          className="w-full h-12 px-4 rounded-lg border-2 border-gray-300 bg-gray-100 text-gray-500 text-lg outline-none shadow-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#075E54] hover:bg-[#128C7E] text-white font-semibold shadow-lg transition duration-300"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
