const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    role: { type: String, default: 'member' },
    profileImage: { type: String },
    gym: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', default: null },
    membership: {
        duration: { type: String, enum: ['1 week', '1 month', '3 months', '6 months', '1 year'] },
        startDate: { type: Date },
        endDate: { type: Date },
    },
});

memberSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

memberSchema.methods.matchPassword = async function (enteredPassword) {
    try {
        if (!this.password || typeof this.password !== 'string') {
            throw new Error('Password is missing or invalid in the database');
        }
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        throw new Error(`Password comparison failed: ${error.message}`);
    }
};

module.exports = mongoose.model('Member', memberSchema);