import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protectedRoute = async (req, res, next) => {



    try {
        
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access Denied: No Token Provided' });
        }


        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid Token' });
            }
            const user = await User.findById(decoded.userId).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User Not Found' });
            }

            req.user = user;
            next();
        });
        
    } catch (error) {
        console.error('Error in protectedRoute middleware:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default protectedRoute;