import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

const ProfilePage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState("Dinesh Bajgain");
  const [bio, setBio] = useState("Web Developer");
  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-2xl rounded-lg shadow-lg w-5/6 max-w-2xl text-gray-300 border-2 border-gray-600 flex justify-between items-center max-sm:flex-col-reverse">
        {/* -----------------left---------------- */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg">Profile Details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : assets.avatar_icon
              }
              className={`w-12 h-12 ${selectedImg && "rounded-full"}`}
            />
            Upload Profile Picture
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name"
            className="p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            required
            className="p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={4}
          ></textarea>
          <button
            type="submit"
            className="bg-gradient-to-r from-[#C0353A] to-[#24366A] text-white p-2 rounded-full hover:opacity-90 transition-opacity mx-10 max-sm:mt-10"
          >
            Save Profile
          </button>
        </form>

        {/* -----------------right---------------- */}
        <img
          src="./src/assets/images/logo.png"
          className="max-w-40 w-50 h-15 aspect-square rounded-full mx-10 max-sm:mt-10"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
