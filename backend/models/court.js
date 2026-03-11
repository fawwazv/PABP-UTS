const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['Indoor', 'Outdoor'], default: 'Indoor' },
  pricePerHour: { type: Number, required: true },
  image: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model('Court', courtSchema);