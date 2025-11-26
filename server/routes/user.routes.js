import { Router } from "express";
import {
  getMyFriends,
  getRecommendedUsers,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendReqs,  
  removeFriend,            
  rejectFriendRequest
} from "../controllers/user-controller.js";

import { protectedRoute } from "../middleware/authMiddleware.js";

const router = Router();

// This will apply the protected route to all routes below
router.use(protectedRoute);

// Suggested people
router.get('/recommended', getRecommendedUsers);

// Friends
router.get('/friends', getMyFriends);

// Friend Requests
router.post('/friend-request/:id', sendFriendRequest);
router.post('/friend-request/:id/accept', acceptFriendRequest);

router.delete('/friend-request/:id/cancel',  (req, res, next) => {
  next();
} ,rejectFriendRequest);  
router.delete('/friend/:id/remove', removeFriend);                

// Friend Requests Lists
router.get('/friend-requests', getFriendRequests);
router.get('/outgoing-friend-requests', getOutgoingFriendReqs);

export default router;
