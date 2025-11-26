import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUserFriends } from '../lib/api';
import FriendCard from '../components/FriendCard';
import NoFriendFound from '../components/NoFriendFound';
import PageLoader from '../components/PageLoader';

const FriendsPage = () => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends,
  });

  if(isLoading) return <PageLoader />


  return (
    <div className="sm:px-6 lg:px-8 pt-8 min-h-[calc(100vh-4rem)] p-5 bg-base-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Your Friends</h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendFound />
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
