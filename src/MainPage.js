import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter } from "react-icons/fa";

function MainPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <h1 className="text-white text-4xl mb-6">Coming Soon</h1>
      <div className="flex space-x-4 text-white text-2xl mb-4">
        <a
          href="https://x.com/TheStableVegeta"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300 transition"
        >
          <FaTwitter />
        </a>
      </div>
    </div>
  );
}

export default MainPage;