import React from 'react';

const NoFriendFound = () => {
  return (
    <div className="flex items-center justify-center h-full w-full p-6">
      <div className="card bg-base-100 shadow-md rounded-box max-w-sm w-full text-center py-10 px-6">
        <h2 className="text-2xl font-semibold text-neutral-content mb-2">No Friends Yet</h2>
        <p className="text-sm text-base-content opacity-70">
          Looks like you haven't added any friends. Start connecting and make some!
        </p>
      </div>
    </div>
  );
};

export default NoFriendFound;
