const mongoose = require('mongoose');

const novelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      enum: [
        'Romance',
        'Fantasy',
        'Science Fiction',
        'Mystery',
        'Thriller',
        'Horror',
        'Adventure',
        'Drama',
        'Historical Fiction',
        'Crime',
        'Comedy',
        'Young Adult',
      ],
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60',
    },
    status: {
      type: String,
      enum: ['ongoing', 'completed'],
      default: 'ongoing',
    },
    approvalStatus: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected'],
      default: 'draft',
    },
    chapters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    wishlistCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual or helper calculation for trending engagement score: likes + wishlistCount
novelSchema.methods.getEngagementScore = function (awardVotes = 0) {
  return (this.likes || 0) + (this.wishlistCount || 0) + (awardVotes || 0);
};

module.exports = mongoose.model('Novel', novelSchema);
