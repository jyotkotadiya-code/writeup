const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Award = require('../models/Award');
const Novel = require('../models/Novel');
const Vote = require('../models/Vote');
const auth = require('../middleware/auth');

// Optional auth helper to inspect user without blocking unauthenticated visitors
const optionalAuth = (req) => {
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'writeup_default_secret_key');
      return decoded.id;
    } catch (e) {
      return null;
    }
  }
  return null;
};

// GET /api/awards - List all awards
router.get('/', async (req, res) => {
  try {
    const awards = await Award.find()
      .populate('novels', 'title coverImage author genre status')
      .populate('winner', 'title coverImage author')
      .sort({ createdAt: -1 });

    // Aggregate total votes per award
    const voteCounts = await Vote.aggregate([
      { $group: { _id: '$award', totalVotes: { $sum: 1 } } },
    ]);
    const awardVotesMap = {};
    voteCounts.forEach((v) => {
      awardVotesMap[v._id.toString()] = v.totalVotes;
    });

    const awardsWithStats = awards.map((award) => {
      const a = award.toObject();
      a.totalVotes = awardVotesMap[award._id.toString()] || 0;
      return a;
    });

    res.json({ awards: awardsWithStats });
  } catch (error) {
    console.error('Fetch awards error:', error);
    res.status(500).json({ message: 'Failed to fetch awards' });
  }
});

// GET /api/awards/:id - Single award details with live novel votes and user voting status
router.get('/:id', async (req, res) => {
  try {
    const award = await Award.findById(req.params.id)
      .populate({
        path: 'novels',
        populate: { path: 'author', select: 'name username' },
      })
      .populate({
        path: 'winner',
        populate: { path: 'author', select: 'name username' },
      });

    if (!award) {
      return res.status(404).json({ message: 'Award not found' });
    }

    // Get vote counts for all novels in this award
    const novelVotes = await Vote.aggregate([
      { $match: { award: award._id } },
      { $group: { _id: '$novel', count: { $sum: 1 } } },
    ]);

    const novelVoteMap = {};
    let totalAwardVotes = 0;
    novelVotes.forEach((v) => {
      novelVoteMap[v._id.toString()] = v.count;
      totalAwardVotes += v.count;
    });

    // Check if the current user has already voted
    const currentUserId = optionalAuth(req);
    let userVote = null;
    if (currentUserId) {
      userVote = await Vote.findOne({ award: award._id, user: currentUserId });
    }

    const awardObj = award.toObject();
    awardObj.totalVotes = totalAwardVotes;
    awardObj.hasVoted = !!userVote;
    awardObj.votedNovelId = userVote ? userVote.novel.toString() : null;

    // Attach vote counts to each participating novel
    awardObj.novels = awardObj.novels.map((novel) => ({
      ...novel,
      votesInAward: novelVoteMap[novel._id.toString()] || 0,
    }));

    // Sort novels by votes in this award
    awardObj.novels.sort((a, b) => b.votesInAward - a.votesInAward);

    res.json({ award: awardObj });
  } catch (error) {
    console.error('Fetch award details error:', error);
    res.status(500).json({ message: 'Failed to fetch award details' });
  }
});

// POST /api/awards/:id/vote - Cast vote in an active award
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { novelId } = req.body;

    if (!novelId) {
      return res.status(400).json({ message: 'Novel ID is required to vote' });
    }

    const award = await Award.findById(req.params.id);
    if (!award) {
      return res.status(404).json({ message: 'Award not found' });
    }

    if (award.status !== 'open') {
      return res.status(400).json({ message: 'Voting is not open for this award competition' });
    }

    // Check if novel is in the award
    const isParticipant = award.novels.some((n) => n.toString() === novelId.toString());
    if (!isParticipant) {
      return res.status(400).json({ message: 'Selected novel is not participating in this award' });
    }

    // Check if user already voted in this award
    const existingVote = await Vote.findOne({
      user: req.user._id,
      award: award._id,
    });

    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted in this award competition' });
    }

    const vote = new Vote({
      user: req.user._id,
      award: award._id,
      novel: novelId,
    });

    await vote.save();

    // Get new vote count for this novel
    const novelVotes = await Vote.countDocuments({ award: award._id, novel: novelId });

    res.json({
      message: 'Vote submitted successfully! Thank you for supporting the author.',
      novelId,
      novelVotes,
    });
  } catch (error) {
    console.error('Vote error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already voted in this award competition' });
    }
    res.status(500).json({ message: 'Failed to record vote' });
  }
});

module.exports = router;
