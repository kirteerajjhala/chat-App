import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import dp from "../assets/emptyDp.webp";
function Receivermessage({image , message}) {
let {selectedUser} = useSelector((state)=>state.user)
    let scroll =useRef();
    useEffect(()=>{
        scroll?.current.scrollIntoView({behavior : "smooth"})
    } , [message ,image])
    
    const handleimageScroll = ()=>{
      scroll?.current.scrollIntoView({behavior : "smooth"})
    }
  return (
 <div ref={scroll} className="flex  items-start gap-[10px] ">
           <div
         key={selectedUser._id}
         className="w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer flex justify-center items-center bg-white  flex-shrink-0  "
       >
         <img
           src={selectedUser.image || dp}
           alt={selectedUser.name}
           className="w-full h-full object-cover"
         />
       </div>
       <div
         className="w-fit max-w-[500px] px-[20px]  py-[10px] text-[19px] 
     rounded-tl-none rounded-2xl relative left-0   
     bg-green-500  text-white gap-[10px] flex flex-col"
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
 
 
     </div>
  )
}

export default Receivermessage