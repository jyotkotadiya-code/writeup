const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema(
  {
    genre: {
      type: String,
      required: [true, 'Genre is required'],
    },
    title: {
      type: String,
      required: [true, 'Award title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    novels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Novel',
      },
    ],
    status: {
      type: String,
      enum: ['upcoming', 'open', 'closed', 'winner_declared'],
      default: 'upcoming',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Novel',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Award', awardSchema);
