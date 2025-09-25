import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";

const useOtherUsers = () => {
  const dispatch = useDispatch();
  const otherUsers = useSelector((state) => state.user.otherUsers);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await axios.get(
          "http://localhost:8000/api/user/others",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("result : " , result.data.data)
        dispatch(setOtherUsers(result.data.data));


      } catch (error) {
        console.log("custom hook error:", error.response?.data || error.message);
      }
    };

    fetchUsers();
  }, [dispatch, token]);


  return otherUsers;
};

export default useOtherUsers;
