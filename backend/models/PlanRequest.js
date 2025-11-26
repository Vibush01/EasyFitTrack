const mongoose = require('mongoose');

const planRequestSchema = new mongoose.Schema({
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    gym: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
    requestType: { type: String, enum: ['workout', 'diet'], required: true },
    status: { type: String, enum: ['pending', 'approved', 'denied', 'fulfilled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PlanRequest', planRequestSchema);