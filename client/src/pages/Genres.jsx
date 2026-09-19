import React, { useState, useEffect } from 'react';
import GenreCard from '../components/GenreCard';
import api from '../services/api';

const GENRE_LIST = [
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

const Genres = () => {
  const [genreCounts, setGenreCounts] = useState({});

  useEffect(() => {
    // Count novels per genre
    const fetchCounts = async () => {
      try {
        const data = await api.getNovels({});
        const counts = {};
        GENRE_LIST.forEach((g) => (counts[g] = 0));
        (data.novels || []).forEach((n) => {
          if (counts[n.genre] !== undefined) {
            counts[n.genre] += 1;
          }
        });
        setGenreCounts(counts);
      } catch (err) {
        console.error('Failed to load genre counts:', err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="space-y-12 py-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          Browse by Category
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
          Explore All Genres
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          From epic high fantasy and thrilling mysteries to heartwarming romances, discover the worlds that speak to your imagination.
        </p>
      </div>

      {/* Grid of 12 Genres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {GENRE_LIST.map((genre) => (
          <GenreCard
            key={genre}
            genre={genre}
            count={genreCounts[genre] ?? 0}
          />
        ))}
      </div>
    </div>
  );
};

export default Genres;
