import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Calendar, Vote, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import NovelCard from '../components/NovelCard';
import { useAuth } from '../context/AuthContext';

const AwardDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [award, setAward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voteMessage, setVoteMessage] = useState(null);

  useEffect(() => {
    fetchAwardDetails();
  }, [id, user]);

  const fetchAwardDetails = async () => {
    try {
      const data = await api.getAward(id);
      setAward(data.award);
    } catch (err) {
      console.error('Failed to fetch award details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteSuccess = (votedNovelId) => {
    setVoteMessage('Vote cast successfully! Thank you for participating.');
    fetchAwardDetails();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 space-y-8 animate-pulse">
        <div className="h-6 w-36 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-44 bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!award) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Award competition not found</h2>
        <Link to="/awards" className="text-amber-600 underline text-sm mt-2 block">
          Return to Awards
        </Link>
      </div>
    );
  }

  const novels = award.novels || [];

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      {/* Back Link */}
      <Link
        to="/awards"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Awards</span>
      </Link>

      {/* Award Header Hero */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm relative overflow-hidden space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {award.genre} Category
          </span>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
              award.status === 'open'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : award.status === 'winner_declared'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            {award.status.replace('_', ' ')}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white">
          {award.title}
        </h1>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          {award.description}
        </p>

        {/* Competition Rules & Stats */}
        <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-1.5">
            <Vote className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{award.totalVotes}</span> total votes cast
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <span>Ends: {new Date(award.endDate || Date.now()).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="italic">Rules: Exactly 1 vote per user</span>
          </div>
        </div>

        {/* User Vote Status Notification */}
        {award.hasVoted && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>You have cast your vote in this competition. Thank you for supporting the authors!</span>
          </div>
        )}
      </div>

      {/* Prominent Winner Showcase Banner if Declared */}
      {award.status === 'winner_declared' && award.winner && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-28 rounded-xl overflow-hidden shadow-lg border border-amber-500/30 shrink-0">
            <img
              src={award.winner.coverImage}
              alt={award.winner.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Trophy className="w-4 h-4" /> Official Winner Declared
            </div>
            <h3 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white">
              {award.winner.title}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              by {award.winner.author?.name || 'Author'}
            </p>
            <div className="pt-2">
              <Link
                to={`/novel/${award.winner._id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 underline"
              >
                Read the Winning Novel &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Participating Novels List */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white">
            Participating Novels ({novels.length})
          </h2>
          <span className="text-xs text-zinc-500">
            Ranked by votes in this award
          </span>
        </div>

        {novels.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#16161A] border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-sm">
            No novels are currently competing in this award.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {novels.map((novel) => (
              <NovelCard
                key={novel._id}
                novel={novel}
                showAwardVoting={true}
                awardId={award._id}
                awardStatus={award.status}
                hasUserVoted={award.hasVoted}
                userVotedNovelId={award.votedNovelId}
                onVoteSuccess={handleVoteSuccess}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AwardDetails;
