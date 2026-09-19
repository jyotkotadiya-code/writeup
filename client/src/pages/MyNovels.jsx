import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  PlusCircle,
  Send,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Library,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';

const MyNovels = () => {
  const location = useLocation();
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedNovelId, setExpandedNovelId] = useState(null);
  const [toastMessage, setToastMessage] = useState(location.state?.message || null);

  // Chapter Modal state
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [activeNovelForChapter, setActiveNovelForChapter] = useState(null);
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [chapterForm, setChapterForm] = useState({
    title: '',
    content: '',
    chapterNumber: 1,
  });
  const [submittingChapter, setSubmittingChapter] = useState(false);
  const [chapterError, setChapterError] = useState(null);

  useEffect(() => {
    fetchMyNovels();
  }, []);

  const fetchMyNovels = async () => {
    try {
      const data = await api.getMyNovels();
      setNovels(data.novels || []);
      // If novels exist and none expanded, expand the first
      if (data.novels && data.novels.length > 0 && !expandedNovelId) {
        setExpandedNovelId(data.novels[0]._id);
      }
    } catch (err) {
      console.error('Failed to load my novels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForReview = async (novelId) => {
    try {
      await api.submitNovel(novelId);
      setToastMessage('Novel submitted for review! An administrator will evaluate it shortly.');
      fetchMyNovels();
    } catch (err) {
      alert(err.message || 'Failed to submit novel');
    }
  };

  const handleDeleteNovel = async (novelId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" and all its chapters?`)) return;
    try {
      await api.deleteNovel(novelId);
      setToastMessage(`Novel "${title}" deleted.`);
      fetchMyNovels();
    } catch (err) {
      alert(err.message || 'Failed to delete novel');
    }
  };

  // Chapter Management Handlers
  const handleOpenAddChapter = (novel) => {
    setActiveNovelForChapter(novel);
    setEditingChapterId(null);
    const nextChapterNum = (novel.chapters?.length || 0) + 1;
    setChapterForm({
      title: '',
      content: '',
      chapterNumber: nextChapterNum,
    });
    setChapterError(null);
    setIsChapterModalOpen(true);
  };

  const handleOpenEditChapter = async (novel, chapter) => {
    setActiveNovelForChapter(novel);
    setEditingChapterId(chapter._id);
    try {
      const data = await api.getChapter(chapter._id);
      setChapterForm({
        title: data.chapter.title,
        content: data.chapter.content,
        chapterNumber: data.chapter.chapterNumber,
      });
      setIsChapterModalOpen(true);
    } catch (err) {
      alert('Failed to load chapter for editing');
    }
  };

  const handleSaveChapter = async (e) => {
    e.preventDefault();
    setChapterError(null);
    setSubmittingChapter(true);

    try {
      if (editingChapterId) {
        await api.updateChapter(editingChapterId, chapterForm);
        setToastMessage('Chapter updated successfully!');
      } else {
        await api.addChapter(activeNovelForChapter._id, chapterForm);
        setToastMessage('New chapter published successfully!');
      }
      setIsChapterModalOpen(false);
      fetchMyNovels();
    } catch (err) {
      setChapterError(err.message || 'Failed to save chapter');
    } finally {
      setSubmittingChapter(false);
    }
  };

  const handleDeleteChapter = async (chapterId, chapterTitle) => {
    if (!window.confirm(`Are you sure you want to delete chapter "${chapterTitle}"?`)) return;
    try {
      await api.deleteChapter(chapterId);
      setToastMessage('Chapter deleted.');
      fetchMyNovels();
    } catch (err) {
      alert(err.message || 'Failed to delete chapter');
    }
  };

  const getApprovalBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" /> Approved & Public
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-3.5 h-3.5" /> Changes Requested
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Writer Studio
          </span>
          <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-white mt-1">
            Novel & Chapter Management
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Write chapters, manage publication requests, and oversee your stories.
          </p>
        </div>

        <Link
          to="/create-novel"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Novel</span>
        </Link>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-zinc-400 hover:text-zinc-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Novels List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-44 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : novels.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#16161A] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-4">
          <Library className="w-12 h-12 text-zinc-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-zinc-800 dark:text-zinc-200">
            No novels found in your studio
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            You haven’t created any novels yet. Start your journey by creating a novel draft!
          </p>
          <Link
            to="/create-novel"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Your Novel</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {novels.map((novel) => {
            const isExpanded = expandedNovelId === novel._id;
            const chapters = novel.chapters || [];

            return (
              <div
                key={novel._id}
                className="bg-white dark:bg-[#16161A] rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm overflow-hidden"
              >
                {/* Novel Card Bar */}
                <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={novel.coverImage}
                      alt={novel.title}
                      className="w-16 h-22 object-cover rounded-xl shadow-sm shrink-0 border border-zinc-200 dark:border-zinc-700"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                          {novel.genre}
                        </span>
                        <span>•</span>
                        <span className="text-xs capitalize text-zinc-500">{novel.status}</span>
                        <span>•</span>
                        {getApprovalBadge(novel.approvalStatus)}
                      </div>

                      <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
                        {novel.title}
                      </h2>

                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        {chapters.length} {chapters.length === 1 ? 'Chapter' : 'Chapters'} • {novel.likes || 0} Likes • {novel.wishlistCount || 0} Wishlist saves
                      </p>
                    </div>
                  </div>

                  {/* Novel Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
                    {/* Submit for approval button (if draft or rejected) */}
                    {(novel.approvalStatus === 'draft' || novel.approvalStatus === 'rejected') && (
                      <button
                        onClick={() => handleSubmitForReview(novel._id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors cursor-pointer"
                        title="Submit this novel to admins for public approval"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit for Approval</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenAddChapter(novel)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>+ Add Chapter</span>
                    </button>

                    <button
                      onClick={() => setExpandedNovelId(isExpanded ? null : novel._id)}
                      className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title={isExpanded ? 'Collapse Chapters' : 'Expand Chapters'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleDeleteNovel(novel._id, novel.title)}
                      className="p-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                      title="Delete Novel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Chapters Section (Collapsible) */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 sm:px-8 sm:pb-8 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30">
                    <div className="flex items-center justify-between py-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Chapters in this Novel
                      </h4>
                      <button
                        onClick={() => handleOpenAddChapter(novel)}
                        className="text-xs font-semibold text-amber-600 hover:underline"
                      >
                        + Add another chapter
                      </button>
                    </div>

                    {chapters.length === 0 ? (
                      <div className="p-6 text-center text-xs text-zinc-400 bg-white dark:bg-[#16161A] rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                        No chapters written yet. Click "+ Add Chapter" to publish chapter 1!
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {chapters.map((ch) => (
                          <div
                            key={ch._id}
                            className="p-3.5 rounded-xl bg-white dark:bg-[#16161A] border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                {ch.chapterNumber}
                              </span>
                              <div>
                                <h5 className="font-serif text-sm font-bold text-zinc-900 dark:text-white">
                                  {ch.title}
                                </h5>
                                <span className="text-[10px] text-zinc-400">
                                  Added {new Date(ch.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {novel.approvalStatus === 'approved' && (
                                <Link
                                  to={`/novel/${novel._id}/chapter/${ch._id}`}
                                  className="text-xs font-medium text-amber-600 hover:underline px-2"
                                >
                                  Read
                                </Link>
                              )}
                              <button
                                onClick={() => handleOpenEditChapter(novel, ch)}
                                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                title="Edit Chapter"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteChapter(ch._id, ch.title)}
                                className="p-1.5 text-zinc-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                title="Delete Chapter"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Chapter Creation & Editing Modal */}
      {isChapterModalOpen && activeNovelForChapter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#16161A] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  {activeNovelForChapter.title}
                </span>
                <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
                  {editingChapterId ? 'Edit Chapter' : 'Add New Chapter'}
                </h3>
              </div>
              <button
                onClick={() => setIsChapterModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {chapterError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{chapterError}</span>
              </div>
            )}

            <form onSubmit={handleSaveChapter} className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Chapter #
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={chapterForm.chapterNumber}
                    onChange={(e) =>
                      setChapterForm({ ...chapterForm, chapterNumber: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white font-mono"
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Chapter Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Cartographer's Compass"
                    value={chapterForm.title}
                    onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Chapter Story Text *
                </label>
                <textarea
                  rows={12}
                  required
                  placeholder="Paste or write your story paragraphs here..."
                  value={chapterForm.content}
                  onChange={(e) => setChapterForm({ ...chapterForm, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white font-serif leading-relaxed placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChapterModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-500"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  loading={submittingChapter}
                  size="md"
                  icon={BookOpen}
                >
                  {editingChapterId ? 'Save Changes' : 'Publish Chapter'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNovels;
