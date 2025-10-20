import Friend from '../models/Friend.js';
import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';


const sendFriendRequestHandler = async (user, data) => {

    try {
        const {to} = data;

        const toUser = await User.findById(to);

        if (!toUser) {
            return {status: 404, message: 'User not found.'};
        }

        if (to == user.id) {
            return {status: 400, message: 'Cannot send friend request to yourself.'};
        }

        const existingFriend = await FriendRequest.findOne({
            $or: [
                {from: user.id, to: to},
                {from: to, to: user.id}
            ]
        });

        if (existingFriend) {
            return {status: 400, message: 'Friend request already exists or you are already friends.'};
        }

        const newFriendRequest = await FriendRequest.create({
            from: user.id,
            to: to,
            status: 'pending'
        });

        return {status: 200, message: 'Friend request sent successfully.', data: newFriendRequest._id}; 

    } catch (error) {
        console.error('Error sending friend request:', error);
        return {status: 500, message: 'Failed to send friend request.'};
    }

}


const acceptFriendRequestHandler = async (user, requestId) => {
    

    try {
        
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return {status: 404, message: 'Friend request not found.'};
        }

        if (friendRequest.status !== 'pending') {

            return {status: 400, message: 'Friend request is not pending.'};
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        await Friend.create({
            userA: friendRequest.from,
            userB: friendRequest.to,
            status: 'accepted'
        });


        return {status: 200, message: 'Friend request accepted successfully.'};

    } catch (error) {
        console.error('Error accepting friend request:', error);
        return {status: 500, message: 'Failed to accept friend request.'};
    }

}

const declineFriendRequestHandler = async (requestId) => {

    try {
        
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return {status: 404, message: 'Friend request not found.'};
        }

        if (friendRequest.status !== 'pending') {
            
            return {status: 400, message: 'Friend request is not pending.'};
            
        }

        await FriendRequest.findByIdAndUpdate(requestId, {status: 'declined'});

        return {status: 200, message: 'Friend request declined successfully.'};

    } catch (error) {
        console.error('Error accepting friend request:', error);
        return {status: 500, message: 'Failed to accept friend request.'};
    }

}

const getListOfFriendsHandler = async (userId) => {

    try {
        
        const friends = await Friend.find({ $or: [ { userA: userId }, { userB: userId } ] });

        return {status: 200, message: 'Get list of friends successfully', data: friends};

    } catch (error) {
        
        console.error('Error getting list of friends:', error);
        return {status: 500, message: 'Failed to get list of friends.'};
    }

}

const getListRequestOfFriendsHandler = async (userId) => {

    try {
        
        const friendRequests = await FriendRequest.find({
            $or: [
                {from: userId},
                {to: userId}
            ],
            status: { $in: ['pending', 'accepted'] } 
        })

        return {status: 200, message: 'Get list of friend requests successfully', data: friendRequests};
    } catch (error) {
        console.error('Error getting list of friend requests:', error);
        return {status: 500, message: 'Failed to get list of friend requests.'};
    }

}
export {sendFriendRequestHandler, acceptFriendRequestHandler, declineFriendRequestHandler, getListOfFriendsHandler, getListRequestOfFriendsHandler};