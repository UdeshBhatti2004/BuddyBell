import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { LANGUAGES } from "../configurations";

// Avatar generation
const styles = ["dylan", "notionists", "bottts", "adventurer", "avataaars", "thumbs"];
const avatarSeeds = Array.from({ length: 30 }, (_, i) => `avatar-${i + 1}`);
const generateAvatars = () => {
  const avatars = [];
  styles.forEach((style) => {
    avatarSeeds.forEach((seed) => {
      avatars.push({
        url: `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`,
        style,
        seed,
      });
    });
  });
  return avatars;
};
const avatarOptions = generateAvatars();

const OnBoardingPage = () => {
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePicture: authUser?.profilePicture || "",
  });

  const [errors, setErrors] = useState({});
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [filter, setFilter] = useState("all");

  const filteredAvatars =
    filter === "all" ? avatarOptions : avatarOptions.filter((a) => a.style === filter);

  const { mutate, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully.");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/login");
    },
    onError: () => toast.error("Onboarding failed. Please try again."),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    if (!formData.bio) newErrors.bio = "Bio is required.";
    if (!formData.nativeLanguage) newErrors.nativeLanguage = "Select native language.";
    if (!formData.learningLanguage) newErrors.learningLanguage = "Select learning language.";
    if (!formData.location) newErrors.location = "Location is required.";
    if (!formData.profilePicture) newErrors.profilePicture = "Please select an avatar.";
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
    mutate(formData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: `url("/bg.png")`,
        backgroundSize: "280%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* White overlay on mobile */}
      <div className="absolute inset-0 md:backdrop-blur-sm bg-white md:bg-transparent z-0" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-3xl bg-white/95 md:bg-white/90 shadow-2xl rounded-2xl p-5 sm:p-6 md:p-10">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-yellow-400">Buddy</span>
            <span className="text-white bg-yellow-500 px-3 py-1 ml-1 rounded-md shadow-md">
              Bell
            </span>
          </h1>
        </div>

        {/* Avatar Picker */}
        <div className="flex flex-col items-center mb-6">
          {formData.profilePicture ? (
            <img
              src={formData.profilePicture}
              alt="Avatar"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-yellow-500 shadow-md mb-2"
            />
          ) : (
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-dashed border-gray-400 flex items-center justify-center text-gray-500 mb-2 text-2xl font-bold">
              ?
            </div>
          )}
          <button
            className="text-sm font-medium text-yellow-600 hover:underline"
            onClick={() => setShowAvatarModal(true)}
          >
            Choose Avatar
          </button>
          {errors.profilePicture && (
            <p className="text-sm text-red-500 mt-1">{errors.profilePicture}</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400"
          />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Short Bio"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400"
          />
          {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              name="nativeLanguage"
              value={formData.nativeLanguage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Native Language</option>
              {LANGUAGES.map((lang, i) => (
                <option key={i} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            <select
              name="learningLanguage"
              value={formData.learningLanguage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Learning Language</option>
              {LANGUAGES.map((lang, i) => (
                <option key={i} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location (e.g. Berlin, Germany)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400"
          />
          {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2.5 rounded-md transition"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Finish Onboarding"}
          </button>
        </form>

        {/* Avatar Modal */}
        {showAvatarModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-yellow-700">Choose an Avatar</h3>
                <button
                  className="text-gray-500 hover:text-red-500 text-xl"
                  onClick={() => setShowAvatarModal(false)}
                >
                  ✕
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 text-sm rounded-md border ${
                    filter === "all"
                      ? "bg-yellow-400 text-white border-yellow-500"
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  All
                </button>
                {styles.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setFilter(s)}
                    className={`px-3 py-1 text-sm rounded-md border ${
                      filter === s
                        ? "bg-yellow-400 text-white border-yellow-500"
                        : "border-gray-300 text-gray-600"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4">
                {filteredAvatars.map((avatar) => (
                  <img
                    key={avatar.url}
                    src={avatar.url}
                    alt={avatar.seed}
                    className="w-16 h-16 rounded-full border-2 hover:border-yellow-500 cursor-pointer transition hover:scale-105"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        profilePicture: avatar.url,
                      }));
                      setShowAvatarModal(false);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnBoardingPage;
