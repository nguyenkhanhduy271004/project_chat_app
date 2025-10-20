import express from 'express';
import { getMyInfoController, updateUserController, uploadAvatarController } from '../controllers/userController.js';
import { searchUserController } from '../controllers/userController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/me', getMyInfoController);

router.get('/search', searchUserController);

router.post('/uploadAvatar', upload.single('avatar'), uploadAvatarController);

router.patch("/me", updateUserController);

export default router;