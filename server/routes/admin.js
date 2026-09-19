const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Novel = require('../models/Novel');
const Award = require('../models/Award');
const Vote = require('../models/Vote');

// Protect all admin routes
router.use(auth, admin);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalNovels = await Novel.countDocuments({ approvalStatus: 'approved' });
    const pendingNovels = await Novel.countDocuments({ approvalStatus: 'pending' });
    const activeAwards = await Award.countDocuments({ status: 'open' });

    res.json({
      stats: {
        totalUsers,
        totalNovels,
        pendingNovels,
        activeAwards,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
});

// GET /api/admin/pending-novels
router.get('/pending-novels', async (req, res) => {
  try {
    const pendingNovels = await Novel.find({ approvalStatus: 'pending' })
      .populate('author', 'name username email')
      .populate('chapters', 'chapterNumber title')
      .sort({ updatedAt: -1 });

    res.json({ pendingNovels });
  } catch (error) {
    console.error('Fetch pending novels error:', error);
    res.status(500).json({ message: 'Failed to fetch pending novels' });
  }
});

// POST /api/admin/novels/:id/approve
router.post('/novels/:id/approve', async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    novel.approvalStatus = 'approved';
    await novel.save();

    res.json({ message: 'Novel approved successfully and is now public', novel });
  } catch (error) {
    console.error('Approve novel error:', error);
    res.status(500).json({ message: 'Failed to approve novel' });
  }
});

// POST /api/admin/novels/:id/reject
router.post('/novels/:id/reject', async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    novel.approvalStatus = 'rejected';
    await novel.save();

    res.json({ message: 'Novel rejected', novel });
  } catch (error) {
    console.error('Reject novel error:', error);
    res.status(500).json({ message: 'Failed to reject novel' });
  }
});

// POST /api/admin/awards - Create a new award competition
router.post('/awards', async (req, res) => {
  try {
    const { title, genre, description, novels, status } = req.body;

    if (!title || !genre) {
      return res.status(400).json({ message: 'Title and genre are required' });
    }

    const award = new Award({
      title,
      genre,
      description: description || `Annual WriteUp ${genre} Awards competition`,
      novels: novels || [],
      status: status || 'upcoming',
      startDate: new Date(),
    });

    await award.save();

    res.status(201).json({ message: 'Award created successfully', award });
  } catch (error) {
    console.error('Create award error:', error);
    res.status(500).json({ message: 'Failed to create award' });
  }
});

// POST /api/admin/awards/:id/start - Start voting
router.post('/awards/:id/start', async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);
    if (!award) {
      return res.status(404).json({ message: 'Award not found' });
    }

    award.status = 'open';
    award.startDate = new Date();
    await award.save();

    res.json({ message: 'Voting is now open for this award', award });
  } catch (error) {
    console.error('Start award error:', error);
    res.status(500).json({ message: 'Failed to start voting' });
  }
});

// POST /api/admin/awards/:id/stop - Stop voting
router.post('/awards/:id/stop', async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);
    if (!award) {
      return res.status(404).json({ message: 'Award not found' });
    }

    award.status = 'closed';
    award.endDate = new Date();
    await award.save();

    res.json({ message: 'Voting has closed for this award', award });
  } catch (error) {
    console.error('Stop award error:', error);
    res.status(500).json({ message: 'Failed to stop voting' });
  }
});

// POST /api/admin/awards/:id/winner - Declare winner
router.post('/awards/:id/winner', async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);
    if (!award) {
      return res.status(404).json({ message: 'Award not found' });
    }

    let winnerNovelId = req.body.winnerNovelId;

    // If winnerNovelId is not explicitly provided, calculate based on highest votes
    if (!winnerNovelId) {
      const voteResults = await Vote.aggregate([
        { $match: { award: award._id } },
        { $group: { _id: '$novel', totalVotes: { $sum: 1 } } },
        { $sort: { totalVotes: -1 } },
        { $limit: 1 },
      ]);

      if (voteResults.length > 0) {
        winnerNovelId = voteResults[0]._id;
      } else if (award.novels.length > 0) {
        // Fallback to first novel if no votes were recorded
        winnerNovelId = award.novels[0];
      }
    }

    if (!winnerNovelId) {
      return res.status(400).json({ message: 'Cannot declare winner: no participating novels found' });
    }

    award.winner = winnerNovelId;
    award.status = 'winner_declared';
    award.endDate = new Date();
    await award.save();

    const populatedAward = await Award.findById(award._id)
      .populate('winner', 'title author coverImage')
      .populate('novels', 'title author coverImage');

    res.json({ message: 'Winner declared successfully!', award: populatedAward });
  } catch (error) {
    console.error('Declare winner error:', error);
    res.status(500).json({ message: 'Failed to declare winner' });
  }
});

// DELETE /api/admin/awards/:id - Delete award
router.delete('/awards/:id', async (req, res) => {
  try {
    await Vote.deleteMany({ award: req.params.id });
    await Award.findByIdAndDelete(req.params.id);
    res.json({ message: 'Award deleted successfully' });
  } catch (error) {
    console.error('Delete award error:', error);
    res.status(500).json({ message: 'Failed to delete award' });
  }
});

module.exports = router;
