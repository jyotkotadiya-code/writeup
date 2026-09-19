import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Sparkles,
  Compass,
  Search,
  Zap,
  Ghost,
  Shield,
  Film,
  Hourglass,
  Scale,
  Smile,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';

const GENRE_ICONS = {
  Romance: Heart,
  Fantasy: Sparkles,
  'Science Fiction': Zap,
  Mystery: Search,
  Thriller: Compass,
  Horror: Ghost,
  Adventure: Shield,
  Drama: Film,
  'Historical Fiction': Hourglass,
  Crime: Scale,
  Comedy: Smile,
  'Young Adult': GraduationCap,
};

const GENRE_DESCRIPTIONS = {
  Romance: 'Love stories, emotional arcs, intimate connections, and destined soulmates.',
  Fantasy: 'Mythic realms, enchanted creatures, arcane lore, and sweeping epics.',
  'Science Fiction': 'Interstellar odysseys, cybernetic futures, and speculative technology.',
  Mystery: 'Puzzling crimes, detective chronicles, hidden motives, and clever twists.',
  Thriller: 'High-stakes suspense, relentless pacing, espionage, and razor-edge danger.',
  Horror: 'Supernatural chills, psychological dread, haunted corridors, and macabre lore.',
  Adventure: 'Daring expeditions, uncharted frontiers, relics, and survival quests.',
  Drama: 'Deep character studies, family sagas, moral dilemmas, and heartfelt moments.',
  'Historical Fiction': 'Past eras brought to life with period realism and sweeping events.',
  Crime: 'Underworld syndicates, heist masterminds, detectives, and moral shades of grey.',
  Comedy: 'Witty banter, satirical adventures, lighthearted escapades, and laughter.',
  'Young Adult': 'Coming of age, identity discovery, young rebellion, and first loves.',
};

const GenreCard = ({ genre, count = null }) => {
  const Icon = GENRE_ICONS[genre] || Sparkles;
  const description = GENRE_DESCRIPTIONS[genre] || 'Explore captivating stories in this genre.';

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/genres/${encodeURIComponent(genre)}`}
        className="group relative block p-6 rounded-2xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
      >
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-amber-500/10 group-hover:text-amber-600 dark:group-hover:text-amber-400">
            <Icon className="w-6 h-6" />
          </div>

          <span className="p-1 rounded-full text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>

        <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-4 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {genre}
        </h3>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed line-clamp-2">
          {description}
        </p>

        {count !== null && (
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            {count} {count === 1 ? 'novel' : 'novels'}
          </div>
        )}
      </Link>
    </motion.div>
  );
};

export default GenreCard;
export { GENRE_ICONS, GENRE_DESCRIPTIONS };
