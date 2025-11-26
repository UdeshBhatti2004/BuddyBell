import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { register } from "../lib/api";
import { Eye, EyeOff } from "lucide-react";

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateEmojis = (count = 25) => {
  const list = [];
  while (list.length < count) {
    const x = getRandomInt(5, 90);
    const y = getRandomInt(5, 90);
    const tooClose = list.some((e) => {
      const dx = e.x - x;
      const dy = e.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 15;
    });
    if (!tooClose) {
      list.push({
        id: list.length,
        src: `/emoji/e${getRandomInt(1, 5)}.png`,
        x,
        y,
        rotation: getRandomInt(-30, 30),
        size: getRandomInt(50, 80),
      });
    }
  }
  return list;
};

const RegisterPage = () => {
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});
  const [emojis, setEmojis] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    setEmojis(generateEmojis());
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Registration successful!");
      navigate("/onboarding");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Registration failed.";
      toast.error(message);
    },
  });

  const handleRegister = (e) => {
    e.preventDefault();
    const { fullName, email, password } = registerData;
    const newErrors = {};

    if (!fullName) newErrors.fullName = "Full name is required.";
    if (!email) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    mutate(registerData);
  };

  return (
    <div className="h-screen w-full flex  bg-white text-gray-800 overflow-hidden">
      <Toaster position="top-center" />

      {/* Left: Emojis (hidden on mobile) */}
      <div className="w-1/2 hidden md:flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300">
        {emojis.map((emoji) => (
          <motion.img
            key={emoji.id}
            src={emoji.src}
            alt="emoji"
            drag
            dragMomentum={false}
            dragConstraints={{
              top: 0,
              left: 0,
              right: window.innerWidth / 2 - emoji.size,
              bottom: window.innerHeight - emoji.size,
            }}
            animate={{
              x: [0, getRandomInt(-30, 30)],
              y: [0, getRandomInt(-30, 30)],
              rotate: [emoji.rotation, emoji.rotation + getRandomInt(-45, 45)],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              left: `${emoji.x}%`,
              top: `${emoji.y}%`,
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
          <h1 className="text-6xl font-bold text-yellow-900 drop-shadow-md">Welcome!</h1>
          <p className="mt-3 text-lg font-medium text-yellow-800 max-w-md leading-relaxed">
            Let’s build your BuddyBell journey.
          </p>
        </div>
      </div>

      {/* Right: Register Form */}
      <div className="min-h-screen w-full flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2 leading-tight">
            Create your <span className="text-yellow-500">BuddyBell</span> account
          </h1>

          <p className="text-sm text-gray-500 text-center mb-6">
            Join us and get your tasks organized. It’s fast and free.
          </p>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Full Name */}
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={registerData.fullName}
                onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                required
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800 placeholder:text-gray-400"
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800 placeholder:text-gray-400"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col relative">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
                className="px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800 placeholder:text-gray-400"
              />
              <div
                className="absolute right-4 bottom-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg transition-all hover:bg-yellow-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {isPending ? "Registering..." : "Register"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-gray-400 my-2">
              <div className="h-px flex-1 bg-gray-300"></div>
              <span className="text-xs">or</span>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            {/* Login link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-yellow-600 font-medium hover:underline">
                Login here
              </a>
            </p>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-10">
            © {new Date().getFullYear()} <strong>BuddyBell</strong>. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
