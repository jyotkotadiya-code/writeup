import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-[#F7F7F5] dark:bg-[#0B0B0D] mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                WriteUp
              </span>
            </Link>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Where stories find their readers. A creative publishing platform connecting writers chapter-by-chapter with passionate readers and industry opportunities.
            </p>
          </div>

          {/* Col 2: Discover */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Discover
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link to="/home" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  All Novels
                </Link>
              </li>
              <li>
                <Link to="/genres" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Explore Genres
                </Link>
              </li>
              <li>
                <Link to="/awards" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Genre Awards
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  About the Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Writers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              For Writers
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link to="/create-novel" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Publish a Story
                </Link>
              </li>
              <li>
                <Link to="/my-novels" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Chapter Management
                </Link>
              </li>
              <li>
                <Link to="/awards" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Genre Competitions
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Author Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Philosophy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Philosophy
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Designed with simplicity, high typography contrast, and distraction-free reading at its core. Built for storytellers.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                Crafted for writers & readers <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} WriteUp Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/home" className="hover:underline">Explore Stories</Link>
            <Link to="/awards" className="hover:underline">Competitions</Link>
            <Link to="/about" className="hover:underline">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
