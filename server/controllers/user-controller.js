import FriendRequest from "../models/friend-request-model.js";
import userModel from "../models/user-model.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await userModel.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude current user //$ne = not equals to
        { _id: { $nin: currentUser.friends } }, // exclude current user's friends //$nin = not in
        { isOnBoard: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await userModel.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePicture nativeLanguage learningLanguage");

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {

    const myId = req.user.id;

    const { id: recipientId } = req.params;
    

    if(myId === recipientId){
      return res.status(400).json({
        success : false,
        message : "you cannot send friend request to yourself"
      })
    }

    const recipient = await userModel.findById(recipientId);
    if(!recipient){
      return res.status(404).json({
        message : "Recipient not found"
      })
    }
    

    if(recipient.friends.includes(myId)){
      return res.status(400).json({
        success : false,
        message : "you are already friend with this user"
      })
    }

    const existingFriendRequest = await FriendRequest.findOne({
      // Condition for checking if the request is made by both sender or recipient
      $or : [
        {sender : myId, recipient : recipientId },
        {sender : recipientId, recipient : myId }
      ]
    })

    if(existingFriendRequest){
      return res.status(400).json({
        success : false,
        message : "Friend request already exists between you and this user"
      })
    }

    const friendRequest = await FriendRequest.create({
      sender : myId,
      recipient : recipientId
    })

    // 201 code : new resource has been created 
    res.status(201).json(friendRequest)
    

  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {

    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if(!friendRequest){
      return res.status(404).json({
        success : false,
        message : "Friend request not found."
      })
    }

    if(friendRequest.recipient.toString() !== req.user.id){
      return res.status(403).json({
        success : false,
        message : "You are not authorized to accept the request"
      })
    }

    friendRequest.status = "accepted";
    await friendRequest.save();


    // add each user to each others friend list array

    await userModel.findByIdAndUpdate(friendRequest.sender,{
      $addToSet : { friends: friendRequest.recipient},
    })

     await userModel.findByIdAndUpdate(friendRequest.recipient,{
      $addToSet : { friends: friendRequest.sender},
    })

    res.status(200).json({
      message : "Friend request accepted"
    })


  } catch (error) {
    console.error("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user._id,
      status: "pending",
    }).populate("sender", "fullName profilePicture nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
      sender: req.user._id,
      status: "accepted",
    }).populate("recipient", "fullName profilePicture");

    

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.error("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePicture nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.error("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const rejectFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Only recipient can reject
    if (request.recipient.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not allowed to reject this request" });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: "Friend request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};




export async function removeFriend(req, res) {
  try {
    const { id: friendId } = req.params;
    const currentUserId = req.user.id;

    const currentUser = await userModel.findById(currentUserId);
    const friend = await userModel.findById(friendId);

    if (!friend || !currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isFriend = currentUser.friends.includes(friendId);
    if (!isFriend) {
      return res.status(400).json({
        success: false,
        message: "User is not in your friends list.",
      });
    }

    // Remove each other from friends
    await userModel.findByIdAndUpdate(currentUserId, {
      $pull: { friends: friendId },
    });

    await userModel.findByIdAndUpdate(friendId, {
      $pull: { friends: currentUserId },
    });

    // ❌ Remove any existing FriendRequest between these two users (both directions)
    await FriendRequest.deleteMany({
      $or: [
        { sender: currentUserId, recipient: friendId },
        { sender: friendId, recipient: currentUserId },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Friend removed successfully and related friend request deleted.",
    });
  } catch (error) {
    console.error("Error in removeFriend controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}





