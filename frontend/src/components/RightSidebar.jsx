import React from "react";
import assets, { imagesDummyData } from "../assets/assets";

const RightSidebar = ({ selectedUser }) => {
  return (
    selectedUser && (
      <div
        className={`bg-[#8581B2]/10 text-white w-full relative overflow-y-scroll ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            className="w-20 aspecr-[1/1] rounded-full"
          />
          <h1 className="px-10 font-medium text-xl mx-auto flex items-center gap-2">
            <p className="w-3 h-3 rounded-full bg-green-400"></p>
            {selectedUser.fullName}
          </h1>
          <p className="px-10 mx-auto">{selectedUser.bio}</p>
        </div>
        <hr className="bg-[#ffffff50] my-4" />
        <div className="px-5 text-xs">
          <p>Media</p>
          <div className="mt-2 max-h-[300px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
            {imagesDummyData.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="cursor-pointer rounded"
              >
                <img src={url} className="h-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
        <button className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#24366A] to-[#C0353A] text-white border-none text-sm font-light px-20 py-2 rounded-full cursor-pointer">
          LogOut
        </button>
      </div>
    )
  );
};

export default RightSidebar;
