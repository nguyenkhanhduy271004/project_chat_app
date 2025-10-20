
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/Session.js';

const signUpHandler = async (data) => {

    try {
        const {username, password, email, firstName, lastName} = data;

        if (!username || !password || !email || !firstName || !lastName) {
            return {status: 400, message: 'Username, password, email, first name and last name are required.'}
        }

        const existUser = await User.findOne({username});
        if (existUser) {
            return {status: 409, message: 'Username already exists.'}
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`
        })

        await newUser.save();

        return {status: 201, message: 'User registered successfully.'}
    } catch (error) {
        console.log('Error in signup:', error);
        return {status: 500, message: 'Internal server error.'}
    }


}

const loginHandler = async (data) => {
    
    try {
        
        const {username, password} = data;

        if (!username || !password) {
            return {status: 400, message: 'Username and password are required'}
        }

        const existUser = await User.findOne({username});

        if (!existUser) {
            return {status: 404, message: 'Username or password is incorrect'};
        }

        const isPasswordValid = await bcrypt.compare(password, existUser.password);

        if (!isPasswordValid) {
            return {status: 404, message: 'Username or password is incorrect'};
        }

        const accessToken = jwt.sign(
            {userId: existUser._id},
            process.env.JWT_SECRET,
            {expiresIn: process.env.ACCESS_TOKEN_TTL}   
        );


        const refreshToken = crypto.randomBytes(64).toString('hex');

        await Session.create({
            userId: existUser._id,
            refreshToken: refreshToken,
            expiresAt: new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_TTL))
        });


        return {status: 200, message: 'Login successfully', data: {accessToken, refreshToken}};
    } catch (error) {
        
        console.log('Error in login:', error);
        return {status: 500, message: 'Internal server error.'}
    }

}


const signOutHandler = async (refreshToken) => {


    try {
        await Session.deleteOne({refreshToken});
        return {status: 200, message: 'Signed out successfully.'};
    } catch (error) {
        console.log('Error in sign out:', error);
        return {status: 500, message: 'Internal server error.'};
    }
}

export { signUpHandler, loginHandler, signOutHandler };