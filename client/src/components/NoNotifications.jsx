import { BellOffIcon } from "lucide-react";

const NoNotifications = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
      <div className="bg-base-200 p-6 rounded-full mb-4 shadow-sm">
        <BellOffIcon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-base-content">You're all caught up!</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs">
        No new notifications right now. Check back later for updates from your friends!
      </p>
    </div>
  );
};

export default NoNotifications;
