import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Vote, ArrowRight, CheckCircle2 } from 'lucide-react';

const AwardCard = ({ award }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Voting Open
          </span>
        );
      case 'winner_declared':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300">
            <Trophy className="w-3.5 h-3.5" />
            Winner Declared
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            Voting Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            Upcoming
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <div className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm hover:shadow-md transition-all duration-200 h-full">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {award.genre} Awards
            </span>
            {getStatusBadge(award.status)}
          </div>

          <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {award.title}
          </h3>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed line-clamp-2">
            {award.description}
          </p>

          {/* Winner Spotlight if declared */}
          {award.status === 'winner_declared' && award.winner && (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
              <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-zinc-900 dark:text-white">
                  Winner: {typeof award.winner === 'object' ? award.winner.title : 'Selected Novel'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer info & CTA */}
        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Ends: {formatDate(award.endDate)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Vote className="w-3.5 h-3.5" />
              <span>{award.totalVotes || 0} votes cast</span>
            </div>
          </div>

          <Link
            to={`/awards/${award._id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 transition-colors"
          >
            <span>{award.status === 'open' ? 'Vote Now' : 'View Award'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AwardCard;
