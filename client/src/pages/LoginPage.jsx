import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

// Utility functions
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateNonOverlappingEmojis = (count = 20) => {
  const emojis = [];
  let attempts = 0;

  while (emojis.length < count && attempts < count * 10) {
    const x = getRandomInt(5, 90);
    const y = getRandomInt(5, 90);
    const tooClose = emojis.some((e) => {
      const dx = e.x - x;
      const dy = e.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 12;
    });

    if (!tooClose) {
      emojis.push({
        id: emojis.length,
        src: `/emoji/e${getRandomInt(1, 5)}.webp`, // 🔹 Use WebP for faster load
        x,
        y,
        rotation: getRandomInt(-20, 20),
        size: getRandomInt(60, 90),
      });
    }
    attempts++;
  }

  return emojis;
};

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [emojis, setEmojis] = useState([]);
  const [isDesktop, setIsDesktop] = useState(false); // 🔹 start false, confirm later

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Detect device width only after mount (avoids hydration mismatch)
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsDesktop(true);
      setEmojis(generateNonOverlappingEmojis());
    }
  }, []);

  // Animate emojis only on desktop
  useEffect(() => {
    if (isDesktop) {
      const interval = setInterval(() => {
        setEmojis((prev) =>
          prev.map((emoji) => ({
            ...emoji,
            x: getRandomInt(5, 90),
            y: getRandomInt(5, 90),
            rotation: getRandomInt(0, 360),
          }))
        );
      }, 5000); // 🔹 update every 5s, lighter load
      return () => clearInterval(interval);
    }
  }, [isDesktop]);

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("Logged in successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Invalid credentials.";
      toast.error(message);
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    mutate(loginData);
  };

  return (
    <div className="h-screen w-full flex bg-white text-gray-800 overflow-hidden">
      {/* Left Emoji Panel - Render only if desktop confirmed */}
      {isDesktop && (
        <div className="w-1/2 hidden md:flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300">
          {emojis.map((emoji) => (
            <motion.img
              key={emoji.id}
              src={emoji.src}
              alt="emoji"
              loading="lazy" // 🔹 prevent eager load
              drag
              dragMomentum={false}
              animate={{
                left: `${emoji.x}%`,
                top: `${emoji.y}%`,
                rotate: emoji.rotation,
              }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              style={{
                position: "absolute",
                width: `${emoji.size}px`,
                height: "auto",
                cursor: "grab",
                zIndex: 90,
                opacity: 0.85,
                userSelect: "none",
              }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
          <div className="z-30 absolute inset-0 flex flex-col items-center justify-center text-center px-10">
            <h1 className="text-6xl font-bold text-yellow-900 drop-shadow-md">
              BuddyBell
            </h1>
            <p className="mt-3 text-lg font-medium text-yellow-800 max-w-md leading-relaxed">
              Your ultimate space to connect, chat, and vibe — anytime, anywhere.
            </p>
          </div>
        </div>
      )}

      {/* Right Login Form */}
      <div className="min-h-screen w-full bg-white flex items-center justify-center px-4 py-10">
        <Toaster />
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2 leading-tight">
            Login to <span className="text-yellow-500">BuddyBell</span>
          </h1>

          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your credentials to access your dashboard.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col relative">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
                className="px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800 placeholder:text-gray-400"
              />
              <div
                className="absolute right-4 bottom-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg transition-all hover:bg-yellow-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>

            <div className="flex items-center gap-3 text-gray-400 my-2">
              <div className="h-px flex-1 bg-gray-300"></div>
              <span className="text-xs">or</span>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <a
                href="/register"
                className="text-yellow-600 font-medium hover:underline"
              >
                Register here
              </a>
            </p>
          </form>

          <p className="text-center text-xs text-gray-400 mt-10">
            © {new Date().getFullYear()} <strong>BuddyBell</strong>. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
