import React from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";

const HomePage = () => {
  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <Sidebar />
      <ChatContainer />
      <RightSidebar />
    </div>
  );
};

export default HomePage;
