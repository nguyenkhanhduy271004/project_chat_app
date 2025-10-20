import User from '../models/User.js';
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

const getMyInfoHandler = async (userId) => {

    try {
        const existUser = await User.findById(userId).select('-password -__v');

        if (!existUser) {
            return {status: 404, message: 'User not found.'}
        }
        return {status: 200, message: 'User info retrieved successfully.', data: existUser}

    } catch (error) {   
        console.log('Error in getUserInfo:', error);
        return {status: 500, message: 'Internal server error.'}
    }
}

const searchUsersHandler = async (username) => {
    try {
        
        const users = await User.find({username: { $regex: username, $options: 'i' }}).select('-password -__v');

        return {status: 200, message: 'Search users successfully.', data: users}
    } catch (error) {
        
        console.log('Error in search user:', error);
        return {status: 500, message: 'Internal server error.'}
    }
}

const uploadAvatarHandler = async (userId, avatarFile) => {

    try {
        
        if (!avatarFile) {
            return {status: 400, message: 'No avatar file provided.'}
        }

        const existUser = await User.findById(userId).select('avatarUrl avatarId');

        if (existUser?.avatarId) {
            try {
                await cloudinary.uploader.destroy(existUser.avatarId);

            } catch (error) {
                
                console.log('Error deleting previous avatar from Cloudinary:', error);
            }

        }

        const uploadResult = await cloudinary.uploader.upload(avatarFile.path, {
            folder: 'user_avatars',
            public_id: `avatar_${userId}`,  
            overwrite: true,                
            transformation: [{ width: 400, height: 400, crop: 'fill' }]
        });

        fs.unlinkSync(avatarFile.path);

        const updatedUser = await User.findByIdAndUpdate({_id: userId}, {
            avatarUrl: uploadResult.secure_url,
            avatarId: uploadResult.public_id
        }, {new: true}).select('-password -__v');

        return {status: 200, message: 'Avatar uploaded successfully.', data: updatedUser}

    } catch (error) {
        
        console.log('Error in upload avatar:', error);
        return {status: 500, message: 'Internal server error.'}
    }
   

}

const updateUserHandler = async (userId, data) => {


    const {bio, phone, email, displayName} = data;

    try {

        const existUser = await User.findByIdAndUpdate({_id: userId}, {
            bio,
            phone,
            email,
            displayName
        }, {new: true}).select('-password -__v');
        return {status: 200, message: 'User updated successfully.', data: existUser}
    } catch (error) {

        console.log('Error in update user:', error);
        return {status: 500, message: 'Internal server error.'}
    }
}
            

export { getMyInfoHandler, searchUsersHandler,  uploadAvatarHandler, updateUserHandler};