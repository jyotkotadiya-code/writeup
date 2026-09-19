const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');
const Novel = require('../models/Novel');
const auth = require('../middleware/auth');

// GET /api/chapters/novel/:novelId - Get all chapters for a novel
router.get('/novel/:novelId', async (req, res) => {
  try {
    const chapters = await Chapter.find({ novel: req.params.novelId })
      .select('chapterNumber title createdAt')
      .sort({ chapterNumber: 1 });

    res.json({ chapters });
  } catch (error) {
    console.error('Fetch chapters error:', error);
    res.status(500).json({ message: 'Failed to fetch chapters' });
  }
});

// GET /api/chapters/:id - Get single chapter for reader with next/prev navigation
router.get('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate('novel', 'title author status coverImage');

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    // Find previous and next chapters
    const prevChapter = await Chapter.findOne({
      novel: chapter.novel._id,
      chapterNumber: chapter.chapterNumber - 1,
    }).select('_id chapterNumber title');

    const nextChapter = await Chapter.findOne({
      novel: chapter.novel._id,
      chapterNumber: chapter.chapterNumber + 1,
    }).select('_id chapterNumber title');

    res.json({
      chapter,
      previousChapter: prevChapter,
      nextChapter: nextChapter,
    });
  } catch (error) {
    console.error('Fetch chapter error:', error);
    res.status(500).json({ message: 'Failed to fetch chapter' });
  }
});

// POST /api/chapters/novel/:novelId - Add chapter to novel (Author only)
router.post('/novel/:novelId', auth, async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.novelId);

    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    if (novel.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to add chapters to this novel' });
    }

    const { title, content, chapterNumber } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Chapter title and content are required' });
    }

    // Auto determine chapterNumber if not passed
    let finalChapterNum = chapterNumber;
    if (!finalChapterNum) {
      const lastChapter = await Chapter.findOne({ novel: novel._id }).sort({ chapterNumber: -1 });
      finalChapterNum = lastChapter ? lastChapter.chapterNumber + 1 : 1;
    }

    const chapter = new Chapter({
      novel: novel._id,
      chapterNumber: finalChapterNum,
      title,
      content,
    });

    await chapter.save();

    // Push chapter to novel
    novel.chapters.push(chapter._id);
    await novel.save();

    res.status(201).json({ message: 'Chapter published successfully', chapter });
  } catch (error) {
    console.error('Create chapter error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A chapter with this number already exists' });
    }
    res.status(500).json({ message: 'Failed to add chapter' });
  }
});

// PUT /api/chapters/:id - Update chapter (Author only)
router.put('/:id', auth, async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate('novel');

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    if (chapter.novel.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to edit this chapter' });
    }

    const { title, content, chapterNumber } = req.body;
    if (title) chapter.title = title;
    if (content) chapter.content = content;
    if (chapterNumber) chapter.chapterNumber = chapterNumber;

    await chapter.save();

    res.json({ message: 'Chapter updated successfully', chapter });
  } catch (error) {
    console.error('Update chapter error:', error);
    res.status(500).json({ message: 'Failed to update chapter' });
  }
});

// DELETE /api/chapters/:id - Delete chapter (Author only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate('novel');

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    if (chapter.novel.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this chapter' });
    }

    // Pull from novel chapters
    await Novel.findByIdAndUpdate(chapter.novel._id, { $pull: { chapters: chapter._id } });
    await Chapter.findByIdAndDelete(chapter._id);

    res.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    console.error('Delete chapter error:', error);
    res.status(500).json({ message: 'Failed to delete chapter' });
  }
});

module.exports = router;
