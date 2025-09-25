import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const useCurrentUser = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData?.data);
const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // ✅ cookie-based authentication
        const result = await axios.get(
          "http://localhost:8000/api/user/current",
          { headers: { Authorization: `Bearer ${token}` } } // important!
        );
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log("custom hook error:", error.response?.data || error.message);
      }
    };

    fetchUser();
  }, [dispatch]);

  return userData;
};

export default useCurrentUser;
