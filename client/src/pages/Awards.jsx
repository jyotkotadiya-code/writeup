import React, { useState, useEffect } from 'react';
import { Trophy, Sparkles, Filter } from 'lucide-react';
import api from '../services/api';
import AwardCard from '../components/AwardCard';

const Awards = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, open, winner_declared, closed

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const data = await api.getAwards();
      setAwards(data.awards || []);
    } catch (err) {
      console.error('Failed to fetch awards:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAwards = awards.filter((award) => {
    if (filter === 'open') return award.status === 'open';
    if (filter === 'winner_declared') return award.status === 'winner_declared';
    if (filter === 'closed') return award.status === 'closed' || award.status === 'upcoming';
    return true;
  });

  return (
    <div className="space-y-12 py-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-xs font-semibold text-amber-600 dark:text-amber-400">
          <Trophy className="w-3.5 h-3.5" />
          <span>Annual Literary Competitions</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
          Genre Awards
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Every genre on WriteUp has its own dedicated tournament. Read participating stories and cast your vote to celebrate outstanding independent writing.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-xl bg-white dark:bg-[#16161A] border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
          {[
            { key: 'all', label: 'All Competitions' },
            { key: 'open', label: 'Voting Open' },
            { key: 'winner_declared', label: 'Winners Declared' },
            { key: 'closed', label: 'Upcoming & Closed' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                filter === tab.key
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Awards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : filteredAwards.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#16161A] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
          <p className="font-serif text-lg font-bold text-zinc-700 dark:text-zinc-300">
            No active awards matching this filter.
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Check back soon as new seasonal competitions are announced!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAwards.map((award) => (
            <AwardCard key={award._id} award={award} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Awards;
