import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Award, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const NovelCard = ({
  novel,
  showAwardVoting = false,
  awardId = null,
  awardStatus = null,
  hasUserVoted = false,
  userVotedNovelId = null,
  onVoteSuccess = () => {},
}) => {
  const { user, isAuthenticated, updateLocalWishlist, updateLocalLikes } = useAuth();
  const navigate = useNavigate();

  const [likes, setLikes] = useState(novel.likes || 0);
  const [isLiked, setIsLiked] = useState(() => {
    if (!user || !user.likedNovels) return false;
    return user.likedNovels.some((id) => (typeof id === 'object' ? id._id === novel._id : id === novel._id));
  });

  const [wishlistCount, setWishlistCount] = useState(novel.wishlistCount || 0);
  const [isWishlisted, setIsWishlisted] = useState(() => {
    if (!user || !user.wishlist) return false;
    return user.wishlist.some((id) => (typeof id === 'object' ? id._id === novel._id : id === novel._id));
  });

  const [votingLoading, setVotingLoading] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleVote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!awardId || awardStatus !== 'open' || hasUserVoted) return;

    try {
      setVotingLoading(true);
      await api.voteAward(awardId, novel._id);
      onVoteSuccess(novel._id);
    } catch (err) {
      alert(err.message || 'Failed to submit vote');
    } finally {
      setVotingLoading(false);
    }
  };

  const isCurrentNovelVoted = userVotedNovelId === novel._id;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col bg-white dark:bg-[#16161A] rounded-2xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Cover Image Container */}
      <Link to={`/novel/${novel._id}`} className="relative block aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={novel.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60'}
          alt={novel.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
          <span
            className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full backdrop-blur-md ${
              novel.status === 'completed'
                ? 'bg-emerald-600/90 text-white'
                : 'bg-amber-600/90 text-white'
            }`}
          >
            {novel.status === 'completed' ? 'Completed' : 'Ongoing'}
          </span>
          {novel.approvalStatus && novel.approvalStatus !== 'approved' && (
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-zinc-900/80 text-zinc-200">
              {novel.approvalStatus}
            </span>
          )}
        </div>

        {/* Quick Wishlist Button Top Right */}
        <button
          onClick={handleWishlist}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
            isWishlisted
              ? 'bg-amber-500 text-white'
              : 'bg-black/40 hover:bg-black/60 text-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Genre Pill Bottom Left */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white backdrop-blur-sm shadow-sm">
            {novel.genre}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/novel/${novel._id}`}>
            <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
              {novel.title}
            </h3>
          </Link>

          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
            by {typeof novel.author === 'object' ? novel.author?.name : 'Anonymous'}
          </p>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2.5 line-clamp-2 leading-relaxed">
            {novel.description}
          </p>
        </div>

        {/* Action Row & Stats */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          {/* Likes Toggle */}
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isLiked ? 'text-rose-600 fill-rose-600' : ''
              }`}
            />
            <span>{likes}</span>
          </button>

          {/* Chapters Count / Active Award indicator */}
          <div className="flex items-center gap-2">
            {novel.chapters?.length !== undefined && (
              <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                <BookOpen className="w-3 h-3" />
                {novel.chapters.length} {novel.chapters.length === 1 ? 'ch' : 'chs'}
              </span>
            )}

            {novel.inActiveAward && !showAwardVoting && (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full"
                title="Competing in active award"
              >
                <Award className="w-3 h-3" /> Award
              </span>
            )}
          </div>
        </div>

        {/* Optional Award Voting Section */}
        {showAwardVoting && (
          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
            <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Votes: <span className="text-amber-600 dark:text-amber-400">{novel.votesInAward ?? 0}</span>
            </div>

            {awardStatus === 'open' ? (
              <button
                onClick={handleVote}
                disabled={hasUserVoted || votingLoading}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  isCurrentNovelVoted
                    ? 'bg-emerald-600 text-white'
                    : hasUserVoted
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                    : 'bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900'
                }`}
              >
                {votingLoading ? 'Voting...' : isCurrentNovelVoted ? '✓ Voted' : hasUserVoted ? 'Voted' : 'Vote'}
              </button>
            ) : (
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 italic">Voting Closed</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NovelCard;
