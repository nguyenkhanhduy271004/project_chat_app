import mongoose from 'mongoose';

const FriendRequestSchema = new mongoose.Schema({
    
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        maxlength: 500,
        required: false
    },
     status: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'blocked'],
        default: 'pending'
    }
}, {timestamps: true});


const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);

export default FriendRequest;