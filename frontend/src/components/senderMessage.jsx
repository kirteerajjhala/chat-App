import React, { useEffect, useRef } from "react";

import dp from "../assets/emptyDp.webp";
import { useSelector } from "react-redux";
function SenderMessage({ image, message }) {
  const userData = useSelector((state) => state.user.userData?.data);
  let scroll = useRef();
  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  const handleimageScroll = () => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  };
  console.log("image : ", image);
  return (
    <div ref={scroll} className="flex  items-start gap-[10px] ">

      <div
        className="w-fit max-w-[500px] px-[20px]  py-[10px] text-[19px] 
    rounded-tr-none rounded-2xl relative right-0  ml-auto  bg-gray-500
     text-white gap-[10px] flex flex-col"
        ref={scroll}
      >
        {image && (
          <img
            src={image}
            alt=""
            className="w-[150px] rounded-lg "
            onLoad={handleimageScroll}
          />
        )}
        {message && <span>{message}</span>}
      </div>

          <div
        key={userData._id}
        className="w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer flex justify-center items-center bg-white  flex-shrink-0  "
      >
        <img
          src={userData.image || dp}
          alt={userData.name}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default SenderMessage;
