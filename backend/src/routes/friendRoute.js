import express from 'express';
import { acceptFriendRequest, declineFriendRequest, 
    getListOfFriends, getListRequestOfFriends, sendFriendRequest } from '../controllers/friendController.js';

const router = express.Router();


router.post('/requests', sendFriendRequest);

router.post('/requests/:requestId/accept', acceptFriendRequest);

router.post('/requests/:requestId/decline', declineFriendRequest);

router.get('/', getListOfFriends);

router.get('/requests', getListRequestOfFriends);


export default router;