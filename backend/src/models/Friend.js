import mongoose from 'mongoose';

const FriendSchema = new mongoose.Schema({
    userA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {timestamps: true});

const Friend = mongoose.model('Friend', FriendSchema);

export default Friend;