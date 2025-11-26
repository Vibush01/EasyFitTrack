const mongoose = require('mongoose');

const membershipRequestSchema = new mongoose.Schema({
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    gym: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
    requestedDuration: { type: String, enum: ['1 week', '1 month', '3 months', '6 months', '1 year'], required: true },
    status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MembershipRequest', membershipRequestSchema);