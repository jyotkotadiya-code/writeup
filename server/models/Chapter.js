const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema(
  {
    novel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Novel',
      required: true,
    },
    chapterNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Chapter title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Chapter content is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique chapter number per novel
chapterSchema.index({ novel: 1, chapterNumber: 1 }, { unique: true });

module.exports = mongoose.model('Chapter', chapterSchema);
