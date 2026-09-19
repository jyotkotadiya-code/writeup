import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Bookmark,
  BookOpen,
  Calendar,
  Trophy,
  ArrowRight,
  User,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const NovelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateLocalWishlist, updateLocalLikes } = useAuth();

  const [novel, setNovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [votingLoading, setVotingLoading] = useState(false);
  const [votedInAward, setVotedInAward] = useState(false);

  useEffect(() => {
    fetchNovelDetails();
  }, [id, user]);

  const fetchNovelDetails = async () => {
    try {
      const data = await api.getNovel(id);
      const n = data.novel;
      setNovel(n);
      setLikes(n.likes || 0);
      setWishlistCount(n.wishlistCount || 0);

      if (user) {
        setIsLiked((user.likedNovels || []).some((nid) => (typeof nid === 'object' ? nid._id === n._id : nid === n._id)));
        setIsWishlisted((user.wishlist || []).some((nid) => (typeof nid === 'object' ? nid._id === n._id : nid === n._id)));
      }
    } catch (err) {
      console.error('Failed to load novel details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const nextLiked = !isLiked;
      setIsLiked(nextLiked);
      setLikes((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));
      updateLocalLikes(novel._id, nextLiked);

      const res = await api.toggleLike(novel._id);
      setLikes(res.likes);
      setIsLiked(res.isLiked);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const nextWishlisted = !isWishlisted;
      setIsWishlisted(nextWishlisted);
      setWishlistCount((prev) => (nextWishlisted ? prev + 1 : Math.max(0, prev - 1)));
      updateLocalWishlist(novel._id, nextWishlisted);

      const res = await api.toggleWishlist(novel._id);
      setWishlistCount(res.wishlistCount);
      setIsWishlisted(res.isWishlisted);
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  const handleVote = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!novel.activeAward || novel.activeAward.status !== 'open') return;

    try {
      setVotingLoading(true);
      await api.voteAward(novel.activeAward._id, novel._id);
      setVotedInAward(true);
      setNovel((prev) => ({
        ...prev,
        awardVotes: (prev.awardVotes || 0) + 1,
      }));
      alert('Vote submitted successfully! Thank you for supporting the author.');
    } catch (err) {
      alert(err.message || 'Failed to submit vote');
    } finally {
      setVotingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 h-96 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
          <div className="md:col-span-8 space-y-4">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-3/4" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-1/2" />
            <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!novel) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Novel not found</h2>
        <Link to="/home" className="text-amber-600 underline text-sm mt-2 block">
          Return to home
        </Link>
      </div>
    );
  }

  const chapters = novel.chapters || [];
  const firstChapter = chapters[0];

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-4">
      {/* Back button */}
      <Link
        to="/home"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Explore</span>
      </Link>

      {/* Main Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Cover */}
        <div className="md:col-span-4 space-y-4">
          <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 relative">
            <img
              src={novel.coverImage}
              alt={novel.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <span
                className={`text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full backdrop-blur-md ${
                  novel.status === 'completed'
                    ? 'bg-emerald-600/90 text-white'
                    : 'bg-amber-600/90 text-white'
                }`}
              >
                {novel.status === 'completed' ? 'Completed' : 'Ongoing'}
              </span>
            </div>
          </div>

          {/* Quick stats panel */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-zinc-800/60">
              <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Chapters</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{chapters.length}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-zinc-800/60">
              <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /> Likes</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{likes}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-zinc-800/60">
              <span className="flex items-center gap-1.5"><Bookmark className="w-3.5 h-3.5" /> Wishlisted</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{wishlistCount}</span>
            </div>
            {novel.awardVotes > 0 && (
              <div className="flex justify-between items-center py-1">
                <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-amber-500" /> Award Votes</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">{novel.awardVotes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Meta & Actions */}
        <div className="md:col-span-8 space-y-6">
          <div className="space-y-2">
            <Link
              to={`/genres/${encodeURIComponent(novel.genre)}`}
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              {novel.genre}
            </Link>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white leading-tight">
              {novel.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 pt-1">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-zinc-400" />
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {novel.author?.name || 'Unknown Author'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>Published {new Date(novel.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {firstChapter ? (
              <Link
                to={`/novel/${novel._id}/chapter/${firstChapter._id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 shadow-sm transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Chapter 1</span>
              </Link>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed"
              >
                <span>No Chapters Yet</span>
              </button>
            )}

            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs border transition-all cursor-pointer ${
                isLiked
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400'
                  : 'bg-white dark:bg-[#16161A] border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-rose-600' : ''}`} />
              <span>{isLiked ? 'Liked' : 'Like'} ({likes})</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs border transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400'
                  : 'bg-white dark:bg-[#16161A] border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isWishlisted ? 'fill-current text-amber-600' : ''}`} />
              <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
            </button>

            {/* Award Vote Button (Conditional: only when novel is in active award) */}
            {novel.activeAward && novel.activeAward.status === 'open' && (
              <button
                onClick={handleVote}
                disabled={votingLoading || votedInAward}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Trophy className="w-4 h-4" />
                <span>{votedInAward ? 'Voted in Award' : 'Vote in Award'}</span>
              </button>
            )}
          </div>

          {/* Active Award Notice Banner */}
          {novel.activeAward && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                    Nominated in {novel.activeAward.title}
                  </h4>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                    Status: <span className="capitalize font-semibold">{novel.activeAward.status.replace('_', ' ')}</span>
                  </p>
                </div>
              </div>
              <Link
                to={`/awards/${novel.activeAward._id}`}
                className="text-xs font-semibold text-amber-700 dark:text-amber-300 underline shrink-0"
              >
                View Competition
              </Link>
            </div>
          )}

          {/* Description / Synopsis */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Synopsis
            </h3>
            <p className="font-serif text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {novel.description}
            </p>
          </div>
        </div>
      </div>

      {/* Chapters Section */}
      <section className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white">
            Chapters ({chapters.length})
          </h2>
          {novel.status === 'ongoing' && (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              More chapters coming soon
            </span>
          )}
        </div>

        {chapters.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#16161A] border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-sm">
            No chapters published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {chapters.map((ch) => (
              <Link
                key={ch._id}
                to={`/novel/${novel._id}/chapter/${ch._id}`}
                className="group p-4 rounded-xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 hover:border-amber-500/50 shadow-sm flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-mono text-xs font-semibold text-zinc-600 dark:text-zinc-300 group-hover:bg-amber-500/10 group-hover:text-amber-600 transition-colors">
                    {ch.chapterNumber}
                  </span>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {ch.title}
                    </h4>
                    <span className="text-[11px] text-zinc-400">
                      {new Date(ch.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all inline-flex items-center gap-1">
                  Read <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default NovelDetails;
