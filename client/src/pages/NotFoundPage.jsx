import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-base-100 px-6 animate-fade-in">
      {/* 404 Code */}
      <h1 className="text-7xl font-extrabold text-error mb-1 animate-bounce-slow">
        404
      </h1>

      {/* Message */}
      <h2 className="text-2xl md:text-3xl font-bold text-base-content mb-2">
        Page Not Found
      </h2>

      <p className="text-base-content/70 mb-8 max-w-md">
        Hmm... Looks like you're a bit lost. Let’s take you back home.
      </p>

      {/* Button */}
      <Link to="/" className="btn btn-primary animate-pop-in">
        Back to Home
      </Link>

      {/* Typing bubble animation */}
      <div className="mt-12 flex justify-center items-center gap-1">
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-150" />
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-300" />
      </div>
    </div>
  );
};

export default NotFoundPage;
