const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  visitedAt: { type: Date, default: Date.now },
});

const urlSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  clicks: { type: Number, default: 0 },
  visits: [visitSchema],
}, { timestamps: true });

module.exports = mongoose.model('Url', urlSchema);