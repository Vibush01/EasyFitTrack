const mongoose = require('mongoose');

const trainerScheduleSchema = new mongoose.Schema({
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    gym: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['available', 'booked'], default: 'available' },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TrainerSchedule', trainerScheduleSchema);