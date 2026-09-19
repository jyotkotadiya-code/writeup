import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Flame, Sparkles, Filter, Trophy, ArrowRight } from 'lucide-react';
import api from '../services/api';
import NovelCard from '../components/NovelCard';
import GenreCard from '../components/GenreCard';

const GENRES = [
  'All',
  'Romance',
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Thriller',
  'Horror',
  'Adventure',
  'Drama',
  'Historical Fiction',
  'Crime',
  'Comedy',
  'Young Adult',
];

const Home = () => {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('trending'); // 'trending', 'latest', 'popular'
  const [activeAwards, setActiveAwards] = useState([]);

  useEffect(() => {
    fetchNovels();
  }, [selectedGenre, sortBy]);

  useEffect(() => {
    // Fetch active awards for spotlight
    api.getAwards()
      .then((data) => {
        const openOnes = (data.awards || []).filter((a) => a.status === 'open');
        setActiveAwards(openOnes);
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchNovels = async () => {
    setLoading(true);
    try {
      const data = await api.getNovels({
        genre: selectedGenre === 'All' ? undefined : selectedGenre,
        sort: sortBy,
        search: searchQuery,
      });
      setNovels(data.novels || []);
    } catch (err) {
      console.error('Failed to fetch novels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNovels();
  };

  // Trending novels (top 3 with highest engagement)
  const trendingNovels = [...novels]
    .sort((a, b) => (b.engagementScore || 0) - (a.engagementScore || 0))
    .slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Header Search Banner */}
      <section className="pt-6 pb-2">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
            Find something good to read tonight.
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Original serialized fiction published chapter by chapter by authors who love storytelling.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto pt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or keyword..."
              className="w-full pl-11 pr-24 py-3 rounded-2xl bg-white dark:bg-[#16161A] border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
            />
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-5" />
            <button
              type="submit"
              className="absolute right-2 top-3.5 px-4 py-1.5 text-xs font-semibold rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Active Award Alert Banner (if any) */}
      {activeAwards.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Voting is Open: {activeAwards[0].title}
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Cast your vote for nominated {activeAwards[0].genre} stories and support your favorite writers!
                </p>
              </div>
            </div>
            <Link
              to={`/awards/${activeAwards[0]._id}`}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shrink-0 inline-flex items-center gap-1.5"
            >
              <span>Go Vote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* Trending Novels Section */}
      {!searchQuery && selectedGenre === 'All' && trendingNovels.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white">
              Trending Novels
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {trendingNovels.map((novel) => (
              <NovelCard key={`trending-${novel._id}`} novel={novel} />
            ))}
          </div>
        </section>
      )}

      {/* Genre Fast Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Filter by Genre
            </span>
          </div>
          <Link
            to="/genres"
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
          >
            All 12 Genres &rarr;
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedGenre === g
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'bg-white dark:bg-[#16161A] text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </section>

      {/* All Novels Section with Sorting */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white">
              {selectedGenre === 'All' ? 'All Stories' : `${selectedGenre} Novels`}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Showing {novels.length} {novels.length === 1 ? 'novel' : 'novels'}
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 bg-white dark:bg-[#16161A] p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs self-start sm:self-auto">
            <span className="px-2 text-zinc-400 font-medium">Sort:</span>
            {[
              { key: 'trending', label: 'Trending' },
              { key: 'latest', label: 'Latest' },
              { key: 'popular', label: 'Most Liked' },
            ].map((sortOption) => (
              <button
                key={sortOption.key}
                onClick={() => setSortBy(sortOption.key)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  sortBy === sortOption.key
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {sortOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Novels Grid or Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : novels.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#16161A] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
            <p className="font-serif text-lg font-bold text-zinc-700 dark:text-zinc-300">
              No novels available yet.
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No stories matched "${searchQuery}". Try a different keyword or genre.`
                : 'Be the first writer to publish in this genre!'}
            </p>
            <div className="mt-4">
              <Link
                to="/create-novel"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
              >
                Publish a Story
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {novels.map((novel) => (
              <NovelCard key={novel._id} novel={novel} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
