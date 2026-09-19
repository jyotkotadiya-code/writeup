import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import NovelCard from '../components/NovelCard';
import { GENRE_ICONS, GENRE_DESCRIPTIONS } from '../components/GenreCard';
import { ArrowLeft, Sparkles, Filter } from 'lucide-react';

const GenreDetails = () => {
  const { genre } = useParams();
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('trending');

  const Icon = GENRE_ICONS[genre] || Sparkles;
  const description = GENRE_DESCRIPTIONS[genre] || 'Explore the best serialized stories in this category.';

  useEffect(() => {
    const fetchGenreNovels = async () => {
      setLoading(true);
      try {
        const data = await api.getNovels({ genre, sort: sortBy });
        setNovels(data.novels || []);
      } catch (err) {
        console.error('Failed to fetch genre novels:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreNovels();
  }, [genre, sortBy]);

  return (
    <div className="space-y-10 py-4">
      {/* Back Link */}
      <Link
        to="/genres"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Genres</span>
      </Link>

      {/* Genre Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Genre Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mt-1">
              {genre}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/60 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs shrink-0">
          <span className="px-2 text-zinc-400 font-medium">Sort:</span>
          {[
            { key: 'trending', label: 'Trending' },
            { key: 'latest', label: 'Latest' },
            { key: 'popular', label: 'Popular' },
          ].map((sortOption) => (
            <button
              key={sortOption.key}
              onClick={() => setSortBy(sortOption.key)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                sortBy === sortOption.key
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {sortOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Novels Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : novels.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#16161A] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
          <p className="font-serif text-lg font-bold text-zinc-700 dark:text-zinc-300">
            No novels found in {genre} yet.
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            Be the pioneering writer to publish the first chapter in this category!
          </p>
          <div className="mt-4">
            <Link
              to="/create-novel"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
            >
              Publish a Novel
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
    </div>
  );
};

export default GenreDetails;
