import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Feather, Compass, Trophy, ArrowRight, PenTool } from 'lucide-react';
import api from '../services/api';
import NovelCard from '../components/NovelCard';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [featuredNovels, setFeaturedNovels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await api.getNovels({ sort: 'trending' });
        setFeaturedNovels((data.novels || []).slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured novels:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Give your idea a home',
      desc: "Put your premise into words, set the mood, and give your characters an honest place to begin.",
      icon: PenTool,
    },
    {
      num: '02',
      title: 'Share chapter by chapter',
      desc: "Publish as you write. Unhurried, draft by draft, sharing the journey with people who genuinely care.",
      icon: Feather,
    },
    {
      num: '03',
      title: 'Find your people',
      desc: "Connect with readers who stay up late for your next update, bookmark favorite scenes, and cheer you on.",
      icon: BookOpen,
    },
    {
      num: '04',
      title: 'Celebrate genre craft',
      desc: "Let readers champion your stories in community genre competitions judged by heartfelt readership.",
      icon: Trophy,
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>A quiet space for serialized fiction</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                Where stories find their <span className="italic font-normal text-amber-600 dark:text-amber-400">readers.</span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                Writing a book takes heart. Finding people who understand it shouldn't feel like fighting an algorithm. WriteUp is where authors share unhurried serialized fiction, and readers discover stories they'll truly remember.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <Link
                  to={isAuthenticated ? '/create-novel' : '/register'}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 shadow-sm transition-all"
                >
                  <span>Start Writing</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/home"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Novels</span>
                </Link>
              </div>
            </motion.div>

            {/* Right Visual: Animated Book Stack & Open Pages */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-5 relative flex items-center justify-center"
            >
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-amber-500/10 via-zinc-200/40 to-transparent dark:from-amber-500/5 dark:via-zinc-800/40 dark:to-transparent p-8 flex items-center justify-center border border-zinc-200/60 dark:border-zinc-800/60">
                {/* Floating Story Card 1 */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-6 right-6 w-48 p-4 rounded-2xl bg-white dark:bg-[#16161A] shadow-xl border border-zinc-200/80 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-amber-600 uppercase">
                    <Trophy className="w-3 h-3" /> Romance Award
                  </div>
                  <div className="font-serif font-bold text-xs text-zinc-900 dark:text-white mt-1 line-clamp-1">
                    Whispers of the Heart
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">42 Likes • Chapter 2</div>
                </motion.div>

                {/* Central Open Book Visual */}
                <motion.div
                  animate={{ rotate: [-1, 1, -1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-56 h-72 rounded-2xl bg-gradient-to-tr from-zinc-900 to-zinc-800 text-white p-6 shadow-2xl flex flex-col justify-between border border-zinc-700 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-mono">WRITEUP #01</span>
                    <BookOpen className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Fantasy</span>
                    <h2 className="font-serif text-xl font-bold mt-1 text-white">The Obsidian Crown</h2>
                    <p className="text-[11px] text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                      "When the ancient ward stones of Solaria shatter, the crown awakens with an insatiable hunger..."
                    </p>
                  </div>
                  <div className="text-[10px] text-zinc-400 border-t border-zinc-800 pt-3 flex justify-between">
                    <span>Arthur Vance</span>
                    <span>1,240 reads</span>
                  </div>
                </motion.div>

                {/* Floating Story Card 2 */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-6 left-6 w-44 p-3.5 rounded-2xl bg-white dark:bg-[#16161A] shadow-xl border border-zinc-200/80 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Feather className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[11px] font-medium text-zinc-800 dark:text-zinc-200">New Chapter</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">Sector 7 Static added</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Write. Publish. Be Discovered.
          </h3>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
            Designed for the craft of storytelling
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            A frictionless platform connecting authors and readers without algorithmic noise or subscription barriers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 rounded-2xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-400">{step.num}</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  {step.title}
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Featured Reads
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mt-1">
              Trending on WriteUp
            </h2>
          </div>
          <Link
            to="/home"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-zinc-200 dark:bg-zinc-800/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredNovels.map((novel) => (
              <NovelCard key={novel._id} novel={novel} />
            ))}
          </div>
        )}
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-zinc-900 dark:bg-zinc-900 text-white p-8 sm:p-14 border border-zinc-800 relative overflow-hidden text-center space-y-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          <h2 className="font-serif text-3xl sm:text-5xl font-bold max-w-2xl mx-auto leading-tight">
            Have a story waiting to be told?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Join WriteUp today. Write at your own pace, publish chapter-by-chapter, and connect directly with an enthusiastic community of readers.
          </p>
          <div className="pt-2">
            <Link
              to={isAuthenticated ? '/create-novel' : '/register'}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm bg-white text-zinc-900 hover:bg-zinc-100 transition-colors shadow-lg"
            >
              <span>Begin Your Story</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
