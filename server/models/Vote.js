const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    award: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Award',
      required: true,
    },
    novel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Novel',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Crucial: A user can only vote once per award competition
voteSchema.index({ user: 1, award: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
