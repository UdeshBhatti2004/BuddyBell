import React from "react";
import {  Video } from "lucide-react";

const CallButton = ({ handleVideoCall }) => {
  return (
    <button
      onClick={handleVideoCall}
      className="absolute top-4 right-4 z-5 flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium shadow-md transition duration-200"
    >
      <Video size={16} />
    </button>
  );
};

export default CallButton;
