import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getFriendRequests,
  acceptFriendRequest,
  cancelFriendRequest,
} from '../lib/api';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import NoNotifications from '../components/NoNotifications';

const Notifications = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests,
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to load notifications');
    },
  });

  const { mutate: acceptRequest, isPending: accepting } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast.success('Friend request accepted');
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
    onError: () => toast.error('Failed to accept request'),
  });

  const { mutate: cancelRequest, isPending: rejecting } = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: () => {
      toast.success('Friend request rejected');
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
    onError: () => toast.error('Failed to reject request'),
  });

  const incomingReqs = data?.incomingReqs || [];
  const acceptedReqs = data?.acceptedReqs || [];
  const hasNotifications = incomingReqs.length > 0 || acceptedReqs.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-neutral-content mb-6">Notifications</h1>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : !hasNotifications ? (
        <NoNotifications />
      ) : (
        <>
          {/* Incoming Requests */}
          {incomingReqs.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-base-content">Friend Requests</h2>
              {incomingReqs.map((req) => (
                <div
                  key={req._id}
                  className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={req.sender.profilePicture}
                      alt={req.sender.fullName}
                      className="w-14 h-14 rounded-full object-cover border border-base-300"
                    />
                    <div className="flex-1">
                      <p className="text-base font-medium text-base-content">
                        {req.sender.fullName}{' '}
                        <span className="text-muted-foreground font-normal">sent you a request</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Native: {req.sender.nativeLanguage} • Learning: {req.sender.learningLanguage}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      className="btn btn-sm btn-primary flex-1"
                      disabled={accepting}
                      onClick={() => acceptRequest(req._id)}
                    >
                      {accepting ? 'Accepting...' : 'Accept'}
                    </button>
                    <button
                      className="btn btn-sm btn-outline flex-1"
                      disabled={rejecting}
                      onClick={() => cancelRequest(req._id)}
                    >
                      {rejecting ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Accepted Requests */}
          {acceptedReqs.length > 0 && (
            <section className="space-y-4 pt-6">
              <h2 className="text-xl font-semibold text-base-content">Accepted Requests</h2>
              {acceptedReqs.map((req) => (
                <div
                  key={req._id}
                  className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={req.recipient.profilePicture}
                      alt={req.recipient.fullName}
                      className="w-14 h-14 rounded-full object-cover border border-base-300"
                    />
                    <div>
                      <p className="text-base font-medium text-base-content">
                        {req.recipient.fullName}{' '}
                        <span className="text-muted-foreground font-normal">
                          accepted your request 🎉
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(req.updatedAt || req.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-success badge-sm w-max sm:ml-auto">New Friend</span>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Notifications;
