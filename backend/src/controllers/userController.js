
import { getMyInfoHandler, searchUsersHandler, updateUserHandler, uploadAvatarHandler } from "../services/userService.js";

const getMyInfoController = async (req, res) => {
    
    const response = await getMyInfoHandler(req.user.id);

    return res.status(response.status).json({message: response.message, data: response.data});
}

const searchUserController = async (req, res) => {
    
    const username = req.query.username;
    const response = await searchUsersHandler(username);

    return res.status(response.status).json({message: response.message, data: response.data});
}


const uploadAvatarController = async (req, res) => {

    const userId = req.user.id;

    const avatarFile = req.file;
    const response = await uploadAvatarHandler(userId, avatarFile);

    return res.status(response.status).json({message: response.message, data: response.data});
}

const updateUserController = async (req, res) => {

    
    const userId = req.user.id;

    console.log("Updating user:", userId);

    const response = await updateUserHandler(userId, req.body);

    return res.status(response.status).json({message: response.message, data: response.data});
}

export {getMyInfoController, searchUserController, uploadAvatarController, updateUserController};