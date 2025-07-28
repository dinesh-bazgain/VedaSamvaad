import React, { useEffect, useRef } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  });
  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* ----------------header--------------- */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={assets.profile_martin} alt="" className="w-8 rounded-full" />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          Martin Guptil
          <span className="w-3 h-3 rounded-full bg-green-400"></span>
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src="./src/assets/images/arrowIcon.png"
          alt=""
          className="md:hidden max-w-7"
        />
        <img
          src="./src/assets/images/infoIcon.png"
          alt=""
          className="max-md:hidden max-w-5"
        />
      </div>
      {/* -------------chat area--------------- */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messagesDummyData.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== "680f50e4f10f3cd28382ecf9" && "flex-row-reverse"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt="receiver"
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                  msg.senderId === "680f50e4f10f3cd28382ecf9"
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === "680f50e4f10f3cd28382ecf9"
                    ? assets.avatar_icon
                    : assets.profile_martin
                }
                alt="sender"
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>
      {/* --------------footer------------- */}
      <div className="absolute left-0 right-0 bottom-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-500 px-3 rounded-full">
          <input
            type="text"
            className="flex-1 text-sm p-3 text-white border-none placeholder-gray-200 rounded-lg outline-none"
            placeholder="Message.."
          />
          <input
            type="file"
            id="images"
            accept="image/jpeg, image/png"
            hidden
          />
          <label htmlFor="images">
            <img
              src="./src/assets/images/linkIcon.png"
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          src="./src/assets/images/sendIcon.png"
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src="./src/assets/images/logo.png" className="max-w-16" />
      <p className="text-lg font=medium text-white"> Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
