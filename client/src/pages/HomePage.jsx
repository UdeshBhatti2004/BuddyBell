import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFriendRequests,
  getOutGoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendFound from "../components/NoFriendFound";
import { capitialize } from "../lib/capitalize";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outGoingRequestIds, setOutGoingRequestIds] = useState(new Set());
  const [incomingRequestIds, setIncomingRequestIds] = useState(new Set());

  const { data: friendRequestsData = {} } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingRecommendedUsers } =
    useQuery({
      queryKey: ["recommendedUsers"],
      queryFn: getRecommendedUsers,
      onError: (error) =>
        toast.error(
          error.response?.data?.message || "Failed to fetch recommended users"
        ),
    });

  const { data: outGoingFriendReqs = [] } = useQuery({
    queryKey: ["outGoingFriendReqs"],
    queryFn: getOutGoingFriendReqs,
  });

  const { mutate: sendFriendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outGoingFriendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  useEffect(() => {
    const outGoingIds = new Set();
    outGoingFriendReqs.forEach((req) => outGoingIds.add(req.recipient._id));
    setOutGoingRequestIds(outGoingIds);

    const incomingIds = new Set();
    friendRequestsData?.incomingReqs?.forEach((req) =>
      incomingIds.add(req.sender._id)
    );
    setIncomingRequestIds(incomingIds);
  }, [outGoingFriendReqs, friendRequestsData]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6" >
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Friends Section */}
        <section className="bg-base-100 rounded-xl shadow-sm p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Your Friends</h2>
            <Link to="/notification" className="btn btn-outline btn-sm gap-2">
              <UsersIcon className="w-4 h-4" />
              Friend Requests
            </Link>
          </div>

          {loadingFriends ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : friends.length === 0 ? (
            <NoFriendFound />
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {friends.map((friend) => (
                <FriendCard
                  key={friend._id}
                  friend={friend}
                  showRemoveButton={false}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recommended Users Section */}
        <section className="bg-base-100 rounded-xl shadow-sm p-5">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Meet New Learners
            </h2>
            <p className="text-sm text-gray-500 max-w-md">
              Discover ideal language exchange partners based on your profile.
            </p>
          </div>

          {loadingRecommendedUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 shadow p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">
                No recommendations available
              </h3>
              <p className="text-sm text-gray-500">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outGoingRequestIds.has(user._id);
                const hasRequestBeenReceived = incomingRequestIds.has(user._id);
                const isDisabled =
                  hasRequestBeenSent || hasRequestBeenReceived || isPending;

                return (
                  <div
                    key={user._id}
                    className="bg-base-100 border border-base-300 rounded-xl shadow hover:shadow-md transition overflow-hidden"
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div className="avatar">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          <img src={user.profilePicture} alt={user.fullName} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold truncate">
                          {user.fullName}
                        </h3>
                        {user.location && (
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <MapPinIcon className="w-3 h-3 mr-1" />
                            {user.location}
                          </p>
                        )}
                        <div className="text-xs flex flex-wrap gap-2 mt-2">
                          <span className="badge badge-primary badge-xs">
                            {getLanguageFlag(user.nativeLanguage)}{" "}
                            {capitialize(user.nativeLanguage)}
                          </span>
                          <span className="badge badge-outline badge-xs">
                            {getLanguageFlag(user.learningLanguage)}{" "}
                            {capitialize(user.learningLanguage)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-4 text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                      {user.bio || "No bio provided."}
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        className={`btn btn-sm w-full ${
                          isDisabled ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => sendFriendRequestMutation(user._id)}
                        disabled={isDisabled}
                      >
                        {hasRequestBeenReceived ? (
                          <>
                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                            Requested You
                          </>
                        ) : hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="w-4 h-4 mr-2" />
                            Send Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
