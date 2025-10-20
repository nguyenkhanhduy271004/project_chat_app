import express from 'express';
import { loginController, signOutController, signupController } from '../controllers/authController.js'

const router = express.Router();

router.post('/signup', signupController);

router.post('/signin', loginController);

router.post('/signout', signOutController);

export default router;