import React, { useState, useEffect, useRef } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { logout } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { Bell, HomeIcon, LogOut, UsersRound, Palette } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ThemeSelector from "./ThemeSelector";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [themeOpen, setThemeOpen] = useState(false);
  const [showDesktopTheme, setShowDesktopTheme] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [constraints, setConstraints] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  const themeRef = useRef(null);
  const mobileThemeRef = useRef(null);

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
      toast.success("You are logged out!");
      navigate("/login");
    },
  });

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    mutate();
  };

  useEffect(() => {
    const updateConstraints = () => {
      const padding = 16;
      const buttonSize = 56;
      const width = window.innerWidth;
      const height = window.innerHeight;

      setConstraints({
        top: -height + buttonSize + padding,
        bottom: 0,
        left: -width + buttonSize + padding,
        right: 0,
      });
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setShowDesktopTheme(false);
      }
      if (
        mobileThemeRef.current &&
        !mobileThemeRef.current.contains(event.target)
      ) {
        setThemeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="relative h-16 bg-accent-content px-4 sm:px-6 shadow-sm flex items-center justify-between border-b border-base-300 z-50 hidden md:flex">
        <Toaster position="top-center" reverseOrder={false} />
        <h1
          className="text-2xl sm:text-3xl font-bold text-primary cursor-pointer"
          onClick={() => navigate("/")}
        >
          BuddyBell
        </h1>

        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate("/notification")}
            className="cursor-pointer p-2 rounded-full hover:bg-base-300 transition"
            title="Notifications"
          >
            <Bell className="text-base-content" size={20} />
          </div>

          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setShowDesktopTheme(!showDesktopTheme)}
              className="p-2 rounded-full hover:bg-base-300"
              title="Select Theme"
            >
              <Palette size={20} />
            </button>

            <AnimatePresence>
              {showDesktopTheme && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 w-64 max-h-80 z-50 rounded-3xl"
                >
                  <ThemeSelector />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-9 w-9 rounded-full border-2 border-base-content overflow-hidden">
            <img
              src={authUser?.profilePicture}
              alt="User"
              className="h-full w-full object-cover"
            />
          </div>

          <div
            onClick={() => setShowLogoutDialog(true)}
            className="cursor-pointer p-2 rounded-full hover:bg-error/10 transition"
            title="Logout"
          >
            <LogOut className="text-base-content" size={20} />
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <motion.div
        drag
        dragConstraints={constraints}
        dragElastic={0.2}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-around w-[92%] max-w-md bg-white/30 backdrop-blur-lg border border-white/20 rounded-full shadow-xl p-2 md:hidden"
      >
        {[
          { icon: HomeIcon, onClick: () => navigate("/"), title: "Home" },
          {
            icon: Bell,
            onClick: () => navigate("/notification"),
            title: "Notifications",
          },
          {
            icon: UsersRound,
            onClick: () => navigate("/friends"),
            title: "Friends",
          },
          {
            icon: Palette,
            onClick: () => setThemeOpen(!themeOpen),
            title: "Themes",
          },
          {
            icon: LogOut,
            onClick: () => setShowLogoutDialog(true),
            title: "Logout",
          },
        ].map(({ icon: Icon, onClick, title }, idx) => (
          <motion.button
            key={idx}
            onClick={onClick}
            whileTap={{ scale: 0.85 }}
            className="flex-1 p-3 rounded-full hover:bg-white/20 transition-colors relative"
          >
            <Icon size={24} className="text-base-content" />
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-base-content/70 opacity-0 group-hover:opacity-100">
              {title}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Mobile Theme Selector Panel */}
      <AnimatePresence>
        {themeOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 w-72 max-h-80 overflow-y-auto bg-base-200 p-4 rounded-xl shadow-xl border border-base-300 z-50 md:hidden"
          >
            <ThemeSelector mobile onSelect={() => setThemeOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Dialog */}
      <AnimatePresence>
        {showLogoutDialog && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-base-100 border border-base-300 rounded-xl p-6 w-[90%] max-w-sm text-center shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
              <p className="text-base-content/70 mb-6">
                Are you sure you want to log out?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLogoutDialog(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="btn btn-error text-white"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
