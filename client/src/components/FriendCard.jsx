import { Link } from "react-router-dom";
import { LANGUAGE_TO_FLAG } from "../configurations";
import useStreamUserStatus from "../hooks/useStreamUserStatus";

const FriendCard = ({ friend, onRemove, isRemoving, showRemoveButton = true }) => {
  const isOnline = useStreamUserStatus(friend._id); 

  return (
    <div className="border border-base-300 bg-base-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Mobile */}
      <div className="flex flex-col sm:hidden items-start p-4 gap-4 border-base-100 rounded-lg shadow-md">
  {/* Avatar and Name */}
  <div className="flex items-center gap-3 w-full">
    <div className="avatar shrink-0 relative">
      <div className="w-14 h-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
        <img
          src={friend.profilePicture}
          alt={friend.fullName}
          className="object-cover w-full h-full"
        />
      </div>
      <span
        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100 ${
          isOnline ? "bg-green-500" : "bg-gray-400"
        }`}
        title={isOnline ? "Online" : "Offline"}
      />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-base font-semibold truncate">{friend.fullName}</h3>
      <div className="text-sm flex flex-wrap gap-2 mt-1">
        <span className="badge badge-primary badge-sm">
          {getLanguageFlag(friend.nativeLanguage)} {friend.nativeLanguage}
        </span>
        <span className="badge badge-outline badge-sm">
          {getLanguageFlag(friend.learningLanguage)} {friend.learningLanguage}
        </span>
      </div>
    </div>
  </div>

  {/* Buttons */}
  <div className="flex gap-2 w-full">
    <Link to={`/chat/${friend._id}`} className="btn btn-sm btn-primary flex-1">
      Message
    </Link>
    {showRemoveButton && (
      <button
        className="btn btn-sm btn-outline btn-error flex-1"
        onClick={onRemove}
        disabled={isRemoving}
      >
        {isRemoving ? 'Removing...' : 'Remove'}
      </button>
    )}
  </div>
</div>


      {/* Desktop */}
      <div className="hidden sm:flex flex-col p-5 h-full justify-between">
        <div className="flex items-center gap-4 relative">
          <div className="avatar shrink-0 relative">
            <div className="w-14 h-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={friend.profilePicture}
                alt={friend.fullName}
                className="object-cover w-full h-full"
              />
            </div>
            <span
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-base-100 ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
              title={isOnline ? "Online" : "Offline"}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{friend.fullName}</h3>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="badge badge-primary badge-sm">
            {getLanguageFlag(friend.nativeLanguage)} Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline badge-sm">
            {getLanguageFlag(friend.learningLanguage)} Learning: {friend.learningLanguage}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
  <Link to={`/chat/${friend._id}`} className="btn btn-sm btn-primary flex-1">
    Message
  </Link>
  {showRemoveButton && (
    <button
      className="btn btn-sm btn-outline btn-error"
      onClick={onRemove}
      disabled={isRemoving}
    >
      {isRemoving ? 'Removing...' : 'Remove'}
    </button>
  )}
</div>

      </div>
    </div>
  );
};

export default FriendCard


export function getLanguageFlag(language) {
  if (!language) return null;
  const langLower = language.toLowerCase();
  const code = LANGUAGE_TO_FLAG[langLower];

  if (code) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${code}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
