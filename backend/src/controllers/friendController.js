import { acceptFriendRequestHandler, getListOfFriendsHandler, getListRequestOfFriendsHandler, sendFriendRequestHandler } from "../services/friendService.js";


const sendFriendRequest = async (req, res) => {


    const response = await sendFriendRequestHandler(req.user, req.body);

    return res.status(response.status).json({
        message: response.message,
        data: response.data || null
    });


}

const acceptFriendRequest = async (req, res) => {

    const requestId = req.params.requestId;

    const response = await acceptFriendRequestHandler(req.user, requestId);

    return res.status(response.status).json({
        message: response.message,
        data: response.data || null
    });

}

const declineFriendRequest = async (req, res) => {

    const requestId = req.params.requestId;

    const response = await declineFriendRequest(requestId);

    return res.status(response.status).json({
        message: response.message,
        data: response.data || null
    });

}

const getListOfFriends = async (req, res) => {

    const response = await getListOfFriendsHandler(req.user.id);

    return res.status(response.status).json({
        message: response.message,
        data: response.data || null
    });
}

const getListRequestOfFriends = async (req, res) => {

    const response = await getListRequestOfFriendsHandler(req.user.id);

    return res.status(response.status).json({
        message: response.message,
        data: response.data || null
    });

}


export {sendFriendRequest, acceptFriendRequest, declineFriendRequest, getListOfFriends, getListRequestOfFriends};

