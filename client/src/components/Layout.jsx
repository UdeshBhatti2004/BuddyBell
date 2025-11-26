import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import SideBar from "./SideBar";

const Layout = ({ children, showSidebar = false }) => {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat/");

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Top Navbar (hide on /chat/:id) */}
      {!isChatPage && (
        <header className="w-full z-10">
          <Navbar />
        </header>
      )}

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (visible only on large screens) */}
        {showSidebar && !isChatPage && (
          <aside className="hidden lg:flex w-64 h-[calc(100vh-4rem)] sticky top-16 bg-base-300 border-r border-base-200 shadow-xl flex-col">
            <SideBar />
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 h-full overflow-y-auto bg-base-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
