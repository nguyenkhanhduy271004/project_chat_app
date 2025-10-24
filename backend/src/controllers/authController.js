
import { googleLoginHandler, loginHandler, signOutHandler, signUpHandler } from "../services/authService.js"

const signupController = async (req, res) => {


    const response = await signUpHandler(req.body);

    return res.status(response.status).json({message: response.message});

}

const loginController = async (req, res) => {

    const response = await loginHandler(req.body);


    res.cookie('refreshToken', response.data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: parseInt(process.env.REFRESH_TOKEN_TTL)
    });

    return res.status(response.status).json({message: response.message, accessToken: response.data?.accessToken});
}

const signOutController = async (req, res) => {
    
    try {
        
        const token = req.cookies?.refreshToken;

        const response = await signOutHandler(token);

        if (response.status !== 200) {
            return res.status(response.status).json({message: response.message});
        }

        res.clearCookie('refreshToken');

        return res.sendStatus(204);
    } catch (error) {
        
        console.log('Error in sign out controller:', error);
        return res.status(500).json({message: 'Internal server error.'});
    }
}

const googleAuthCallbackController = async (req, res) => {
  const googleUser = req.user;
  const response = await googleLoginHandler(googleUser);

  if (response.status !== 200)
    return res.status(response.status).json({ message: response.message });

  res.cookie("refreshToken", response.data.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: parseInt(process.env.REFRESH_TOKEN_TTL),
  });

  return res.redirect(
    `${process.env.CLIENT_URL}/login/success?token=${response.data.accessToken}`
  );
};

export {signupController, loginController, signOutController, googleAuthCallbackController};