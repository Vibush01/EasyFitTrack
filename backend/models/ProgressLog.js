const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema({
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    weight: { type: Number, required: true },
    muscleMass: { type: Number, required: true },
    fatPercentage: { type: Number, required: true },
    images: [{ type: String }], // Cloudinary URLs
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ProgressLog', progressLogSchema);