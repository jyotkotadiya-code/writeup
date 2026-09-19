import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

const ChapterReader = () => {
  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState(null);
  const [previousChapter, setPreviousChapter] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reader typography preference: font size adjustment
  const [fontSize, setFontSize] = useState('text-lg'); // text-base, text-lg, text-xl

  useEffect(() => {
    fetchChapterData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [chapterId]);

  const fetchChapterData = async () => {
    setLoading(true);
    try {
      const data = await api.getChapter(chapterId);
      setChapter(data.chapter);
      setPreviousChapter(data.previousChapter);
      setNextChapter(data.nextChapter);
    } catch (err) {
      console.error('Failed to load chapter:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 space-y-6 animate-pulse">
        <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="space-y-3 pt-6">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Chapter not found</h2>
        <Link to={`/novel/${novelId}`} className="text-amber-600 underline text-sm mt-2 block">
          Back to novel
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 space-y-10">
      {/* Top Bar Navigation & Font Size Toggle */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <Link
          to={`/novel/${novelId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {chapter.novel?.title || 'Novel'}</span>
        </Link>

        {/* Text size controls */}
        <div className="flex items-center gap-1 bg-white dark:bg-[#16161A] border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setFontSize('text-base')}
            className={`px-2.5 py-1 rounded-lg ${fontSize === 'text-base' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'text-zinc-500'}`}
          >
            A-
          </button>
          <button
            onClick={() => setFontSize('text-lg')}
            className={`px-2.5 py-1 rounded-lg ${fontSize === 'text-lg' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'text-zinc-500'}`}
          >
            A
          </button>
          <button
            onClick={() => setFontSize('text-xl')}
            className={`px-2.5 py-1 rounded-lg ${fontSize === 'text-xl' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'text-zinc-500'}`}
          >
            A+
          </button>
        </div>
      </div>

      {/* Chapter Title & Header */}
      <header className="text-center space-y-3 pt-2">
        <span className="font-mono text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold">
          Chapter {chapter.chapterNumber}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">
          {chapter.title}
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          From{' '}
          <Link to={`/novel/${novelId}`} className="hover:underline font-medium text-zinc-700 dark:text-zinc-300">
            {chapter.novel?.title}
          </Link>
        </p>
      </header>

      {/* Chapter Body / Story Content */}
      <article className="prose prose-zinc dark:prose-invert max-w-none pt-4">
        <div className={`font-serif ${fontSize} leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-line space-y-6 select-text`}>
          {chapter.content}
        </div>
      </article>

      {/* End of Chapter Navigation Controls */}
      <div className="pt-12 mt-12 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {previousChapter ? (
          <Link
            to={`/novel/${novelId}/chapter/${previousChapter._id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#16161A] text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Chapter {previousChapter.chapterNumber}: {previousChapter.title}</span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        <Link
          to={`/novel/${novelId}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white py-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Chapter Index</span>
        </Link>

        {nextChapter ? (
          <Link
            to={`/novel/${novelId}/chapter/${nextChapter._id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <span>Chapter {nextChapter.chapterNumber}: {nextChapter.title}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <div className="text-xs text-zinc-400 italic">
            End of published chapters
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterReader;
