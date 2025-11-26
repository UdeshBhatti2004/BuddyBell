import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, Bell } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import useStreamUserStatus from "../hooks/useAuthUser";

const navLinks = [
  { name: "Home", icon: <Home size={20} />, to: "/" },
  { name: "Friends", icon: <Users size={20} />, to: "/friends" },
  { name: "Notifications", icon: <Bell size={20} />, to: "/notification" },
];

const SideBar = () => {
  const { authUser } = useAuthUser();
  const isOnline = useStreamUserStatus(authUser?._id);

  return (
    <aside className="hidden lg:flex w-64 h-[calc(100vh-4rem)] sticky top-16 flex-col justify-between bg-base-200 border-r border-base-300 shadow-[inset_0_0_8px_#00000020] p-6">
      
      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm group transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "text-base-content hover:bg-base-300 hover:shadow-sm"
              }`
            }
          >
            <span className="transition-transform group-hover:scale-110">{link.icon}</span>
            <span className="tracking-wide">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="border-t border-base-300 pt-5 flex items-center gap-4">
        <div className="relative w-11 h-11">
          <img
            src={authUser?.profilePicture}
            alt="User"
            className="w-full h-full rounded-full object-cover border-2 border-primary"
          />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
              isOnline
                ? "bg-green-500 border-base-200 shadow-[0_0_6px_#4ade80]"
                : "bg-gray-400 border-base-200"
            }`}
            title={isOnline ? "Online" : "Offline"}
          />
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-base-content truncate">
            {authUser?.fullName || "User Name"}
          </h3>
          <p className={`text-xs ${isOnline ? "text-green-500" : "text-gray-400"}`}>
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
