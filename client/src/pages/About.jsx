import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, Compass, Users, Clapperboard, Award, Feather, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      {/* Editorial Header */}
      <section className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          Our Philosophy
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white leading-tight">
          Stories happen when someone refuses to forget them.
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          WriteUp is a quiet, comfortable publishing home for serialized literature. We believe stories belong to the people who write them and the readers who cherish them—unhurried, chapter by chapter.
        </p>
      </section>

      {/* Core Principle Pillar */}
      <section className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <Feather className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <p className="font-serif text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
            Writers create stories.
          </p>
          <p className="font-serif text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
            Readers discover stories.
          </p>
          <p className="font-serif text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
            Professionals discover writers.
          </p>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed pt-2">
          Great books don't start with marketing plans—they start with an honest sentence in front of a blank screen. WriteUp exists to give authors an unpretentious home to build an audience and open doors to lifelong creative careers.
        </p>
      </section>

      {/* The Industry Bridge Section */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
            Bridging Storytellers with Creative Professionals
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            WriteUp aims to serve as a launchpad where exceptional stories gain visibility not only from everyday readers, but from cultural innovators seeking fresh narrative properties.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-white mb-2">
              Book Publishers
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Discover proven literary talents whose serialized works have already demonstrated organic reader resonance and community dedication.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Clapperboard className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-white mb-2">
              Directors & Producers
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Scout original intellectual properties, screenplays, and multi-season concepts ripe for cinematic and television adaptation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-white mb-2">
              Literary Agents
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Find rising authors with unique voices who have honed their craft through real reader feedback, likes, and genre award triumphs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="p-8 sm:p-10 rounded-3xl bg-zinc-900 dark:bg-zinc-900 text-white text-center space-y-4 border border-zinc-800">
        <h3 className="font-serif text-2xl font-bold">Ready to embark on your writing journey?</h3>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Start your first chapter today or dive into hundreds of original serialized stories.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/create-novel"
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-white text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            Start Writing
          </Link>
          <Link
            to="/home"
            className="px-6 py-2.5 rounded-xl text-xs font-semibold border border-zinc-700 text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            Explore Library
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
