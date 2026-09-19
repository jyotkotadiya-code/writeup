const express = require('express');
const router = express.Router();
const Novel = require('../models/Novel');
const Chapter = require('../models/Chapter');
const User = require('../models/User');
const Award = require('../models/Award');
const Vote = require('../models/Vote');
const auth = require('../middleware/auth');

// GET /api/novels - Public approved novels with search, genre, sort
router.get('/', async (req, res) => {
  try {
    const { genre, search, sort = 'trending' } = req.query;

    let query = { approvalStatus: 'approved' };

    if (genre && genre !== 'All') {
      query.genre = genre;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    let novels = await Novel.find(query)
      .populate('author', 'name username')
      .populate('chapters', 'chapterNumber title');

    // If search also matched author name
    if (search && search.trim() !== '') {
      const searchLower = search.trim().toLowerCase();
      // If author matches, or title/desc matched
      novels = novels.filter(
        (n) =>
          n.title.toLowerCase().includes(searchLower) ||
          n.description.toLowerCase().includes(searchLower) ||
          (n.author && n.author.name.toLowerCase().includes(searchLower))
      );
    }

    // Get award votes count for each novel
    const votesAgg = await Vote.aggregate([
      { $group: { _id: '$novel', totalVotes: { $sum: 1 } } },
    ]);
    const votesMap = {};
    votesAgg.forEach((v) => {
      votesMap[v._id.toString()] = v.totalVotes;
    });

    // Check which novels are in active/open awards
    const openAwards = await Award.find({ status: 'open' }).select('novels genre title');
    const openAwardNovelIds = new Set();
    openAwards.forEach((a) => {
      a.novels.forEach((nid) => openAwardNovelIds.add(nid.toString()));
    });

    const novelsWithScores = novels.map((novel) => {
      const nObj = novel.toObject();
      const awardVotes = votesMap[novel._id.toString()] || 0;
      nObj.awardVotes = awardVotes;
      nObj.engagementScore = (novel.likes || 0) + (novel.wishlistCount || 0) + awardVotes;
      nObj.inActiveAward = openAwardNovelIds.has(novel._id.toString());
      return nObj;
    });

    // Sort
    if (sort === 'latest') {
      novelsWithScores.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'popular') {
      novelsWithScores.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
      // Trending (engagement score)
      novelsWithScores.sort((a, b) => b.engagementScore - a.engagementScore);
    }

    res.json({ novels: novelsWithScores });
  } catch (error) {
    console.error('Fetch novels error:', error);
    res.status(500).json({ message: 'Failed to fetch novels' });
  }
});

// GET /api/novels/my-novels - Protected: author's own novels
router.get('/my-novels', auth, async (req, res) => {
  try {
    const novels = await Novel.find({ author: req.user._id })
      .populate('chapters', 'chapterNumber title createdAt')
      .sort({ updatedAt: -1 });

    res.json({ novels });
  } catch (error) {
    console.error('Fetch my novels error:', error);
    res.status(500).json({ message: 'Failed to fetch your novels' });
  }
});

// GET /api/novels/:id - Novel details
router.get('/:id', async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id)
      .populate('author', 'name username')
      .populate({
        path: 'chapters',
        select: 'chapterNumber title createdAt',
        options: { sort: { chapterNumber: 1 } },
      });

    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    // Check award participation
    const activeAward = await Award.findOne({
      novels: novel._id,
      status: { $in: ['open', 'winner_declared'] },
    }).select('title genre status winner');

    const totalVotes = await Vote.countDocuments({ novel: novel._id });

    const novelData = novel.toObject();
    novelData.awardVotes = totalVotes;
    novelData.activeAward = activeAward;

    res.json({ novel: novelData });
  } catch (error) {
    console.error('Fetch novel error:', error);
    res.status(500).json({ message: 'Failed to fetch novel details' });
  }
});

// POST /api/novels - Create novel (draft)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, genre, coverImage, status } = req.body;

    if (!title || !description || !genre) {
      return res.status(400).json({ message: 'Title, description, and genre are required' });
    }

    const novel = new Novel({
      title,
      description,
      genre,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60',
      status: status || 'ongoing',
      approvalStatus: 'draft',
      author: req.user._id,
    });

    await novel.save();

    res.status(201).json({ message: 'Novel created as draft', novel });
  } catch (error) {
    console.error('Create novel error:', error);
    res.status(500).json({ message: 'Failed to create novel' });
  }
});

// PUT /api/novels/:id - Update novel (Author only)
router.put('/:id', auth, async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);

    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    if (novel.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to edit this novel' });
    }

    const { title, description, genre, coverImage, status } = req.body;

    if (title) novel.title = title;
    if (description) novel.description = description;
    if (genre) novel.genre = genre;
    if (coverImage) novel.coverImage = coverImage;
    if (status) novel.status = status;

    await novel.save();

    res.json({ message: 'Novel updated successfully', novel });
  } catch (error) {
    console.error('Update novel error:', error);
    res.status(500).json({ message: 'Failed to update novel' });
  }
});

// DELETE /api/novels/:id - Delete novel and its chapters
router.delete('/:id', auth, async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);

    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    if (novel.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this novel' });
    }

    // Delete associated chapters
    await Chapter.deleteMany({ novel: novel._id });
    // Remove from wishlists
    await User.updateMany({ wishlist: novel._id }, { $pull: { wishlist: novel._id } });
    // Remove novel
    await Novel.findByIdAndDelete(novel._id);

    res.json({ message: 'Novel and its chapters deleted successfully' });
  } catch (error) {
    console.error('Delete novel error:', error);
    res.status(500).json({ message: 'Failed to delete novel' });
  }
});

// POST /api/novels/:id/submit - Submit novel for admin approval
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);

    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    if (novel.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to submit this novel' });
    }

    novel.approvalStatus = 'pending';
    await novel.save();

    res.json({ message: 'Novel submitted for review', novel });
  } catch (error) {
    console.error('Submit novel error:', error);
    res.status(500).json({ message: 'Failed to submit novel for approval' });
  }
});

// POST /api/novels/:id/like - Toggle like
router.post('/:id/like', auth, async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    const userIdStr = req.user._id.toString();
    const alreadyLiked = novel.likedBy.some((id) => id.toString() === userIdStr);

    if (alreadyLiked) {
      // Unlike
      novel.likedBy = novel.likedBy.filter((id) => id.toString() !== userIdStr);
      novel.likes = Math.max(0, (novel.likes || 1) - 1);
      await User.findByIdAndUpdate(req.user._id, { $pull: { likedNovels: novel._id } });
    } else {
      // Like
      novel.likedBy.push(req.user._id);
      novel.likes = (novel.likes || 0) + 1;
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { likedNovels: novel._id } });
    }

    await novel.save();

    res.json({
      likes: novel.likes,
      isLiked: !alreadyLiked,
      message: alreadyLiked ? 'Novel unliked' : 'Novel liked',
    });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: 'Failed to update like status' });
  }
});

// POST /api/novels/:id/wishlist - Toggle wishlist
router.post('/:id/wishlist', auth, async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    const user = await User.findById(req.user._id);
    const novelIdStr = novel._id.toString();
    const alreadyWishlisted = user.wishlist.some((id) => id.toString() === novelIdStr);

    if (alreadyWishlisted) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter((id) => id.toString() !== novelIdStr);
      novel.wishlistCount = Math.max(0, (novel.wishlistCount || 1) - 1);
    } else {
      // Add to wishlist
      user.wishlist.push(novel._id);
      novel.wishlistCount = (novel.wishlistCount || 0) + 1;
    }

    await user.save();
    await novel.save();

    res.json({
      wishlistCount: novel.wishlistCount,
      isWishlisted: !alreadyWishlisted,
      message: alreadyWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
    });
  } catch (error) {
    console.error('Wishlist error:', error);
    res.status(500).json({ message: 'Failed to update wishlist' });
  }
});

module.exports = router;
