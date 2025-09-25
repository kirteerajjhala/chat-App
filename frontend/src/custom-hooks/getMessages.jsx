import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "../redux/messageSlic";

const GetMessages = () => {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!selectedUser?._id) return; // Agar selectedUser undefined ho to exit

    const fetchMessages = async () => {
      try {
        const result = await axios.get(
          `http://localhost:8000/api/message/get/${selectedUser._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched messages: ", result.data);

        // Backend me messages 'data' field me hai
        dispatch(setMessages(result.data.data || []));
      } catch (error) {
        console.log("custom hook error:", error.response?.data || error.message);
      }
    };

    fetchMessages();
  }, [dispatch, token, selectedUser]);

  return null; // Hook khud render nahi karta
};

export default GetMessages;
