const ChatLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-green-100 to-green-200">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-green-800 tracking-wide">
          Connecting to chat...
        </span>
      </div>
    </div>
  );
};

export default ChatLoader;
