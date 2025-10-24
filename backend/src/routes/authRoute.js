import express from 'express';
import passport from "../libs/passport.js";
import { googleAuthCallbackController, loginController, signOutController, signupController } from '../controllers/authController.js'

const router = express.Router();

router.post('/signup', signupController);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthCallbackController
);


router.post('/signin', loginController);

router.post('/signout', signOutController);

export default router;