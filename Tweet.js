const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    tweetContent: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Tweet', tweetSchema);
