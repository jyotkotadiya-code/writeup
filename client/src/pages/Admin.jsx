import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  BookOpen,
  Clock,
  Trophy,
  CheckCircle,
  XCircle,
  Play,
  Square,
  Award,
  PlusCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';

const GENRES = [
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

const Admin = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNovels: 0,
    pendingNovels: 0,
    activeAwards: 0,
  });
  const [pendingNovelsList, setPendingNovelsList] = useState([]);
  const [awardsList, setAwardsList] = useState([]);
  const [allApprovedNovels, setAllApprovedNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'awards'
  const [actionMessage, setActionMessage] = useState(null);

  // New Award Form State
  const [isCreatingAward, setIsCreatingAward] = useState(false);
  const [newAward, setNewAward] = useState({
    title: '',
    genre: 'Romance',
    description: '',
    novels: [],
    status: 'open',
  });
  const [awardSubmitting, setAwardSubmitting] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes, awardsRes, novelsRes] = await Promise.all([
        api.getAdminStats(),
        api.getPendingNovels(),
        api.getAwards(),
        api.getNovels({}),
      ]);

      setStats(statsRes.stats || {});
      setPendingNovelsList(pendingRes.pendingNovels || []);
      setAwardsList(awardsRes.awards || []);
      setAllApprovedNovels(novelsRes.novels || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Novel Approval Actions
  const handleApproveNovel = async (id, title) => {
    try {
      await api.approveNovel(id);
      setActionMessage(`"${title}" approved and published publicly!`);
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to approve novel');
    }
  };

  const handleRejectNovel = async (id, title) => {
    try {
      await api.rejectNovel(id);
      setActionMessage(`"${title}" rejected.`);
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to reject novel');
    }
  };

  // Award Actions
  const handleStartAward = async (id) => {
    try {
      await api.startAward(id);
      setActionMessage('Voting started for this competition.');
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to start voting');
    }
  };

  const handleStopAward = async (id) => {
    try {
      await api.stopAward(id);
      setActionMessage('Voting stopped.');
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to stop voting');
    }
  };

  const handleDeclareWinner = async (awardId) => {
    try {
      const res = await api.declareWinner(awardId);
      setActionMessage(`Winner declared successfully: "${res.award.winner?.title || 'Selected Novel'}"!`);
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to declare winner');
    }
  };

  const handleCreateAwardSubmit = async (e) => {
    e.preventDefault();
    setAwardSubmitting(true);
    try {
      await api.createAward(newAward);
      setActionMessage(`Award competition "${newAward.title}" created successfully!`);
      setIsCreatingAward(false);
      setNewAward({
        title: '',
        genre: 'Romance',
        description: '',
        novels: [],
        status: 'open',
      });
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to create award');
    } finally {
      setAwardSubmitting(false);
    }
  };

  const handleToggleNovelForAward = (novelId) => {
    setNewAward((prev) => {
      const exists = prev.novels.includes(novelId);
      return {
        ...prev,
        novels: exists ? prev.novels.filter((id) => id !== novelId) : [...prev.novels, novelId],
      };
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6">
      {/* Admin Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-white">
            Platform Management
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Review submissions, oversee genre awards, and monitor platform metrics.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="font-serif text-3xl font-bold text-zinc-900 dark:text-white">
            {stats.totalUsers}
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Approved Novels</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="font-serif text-3xl font-bold text-zinc-900 dark:text-white">
            {stats.totalNovels}
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Requests</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="font-serif text-3xl font-bold text-amber-600 dark:text-amber-400">
            {stats.pendingNovels}
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-purple-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Awards</span>
            <Trophy className="w-4 h-4" />
          </div>
          <div className="font-serif text-3xl font-bold text-purple-600 dark:text-purple-400">
            {stats.activeAwards}
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-zinc-400 hover:text-zinc-700">
            ✕
          </button>
        </div>
      )}

      {/* Management Navigation Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 flex space-x-8 text-sm font-medium">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-4 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'requests'
              ? 'border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-bold'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Publishing Requests ({pendingNovelsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('awards')}
          className={`pb-4 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'awards'
              ? 'border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-bold'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Award Competitions ({awardsList.length})</span>
        </button>
      </div>

      {/* TAB 1: Publishing Requests */}
      {activeTab === 'requests' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
              Novels Awaiting Approval
            </h2>
            <span className="text-xs text-zinc-500">
              Approved novels immediately appear on the public catalog.
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-36 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : pendingNovelsList.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#16161A] rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-zinc-800 dark:text-zinc-200">
                All caught up!
              </h3>
              <p className="text-xs text-zinc-500">
                There are no pending novel publishing requests waiting for review.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingNovelsList.map((novel) => (
                <div
                  key={novel._id}
                  className="p-6 rounded-2xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={novel.coverImage}
                      alt={novel.title}
                      className="w-16 h-22 object-cover rounded-xl border border-zinc-200 dark:border-zinc-700 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          {novel.genre}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          Submitted {new Date(novel.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-white">
                        {novel.title}
                      </h3>

                      <p className="text-xs text-zinc-500">
                        Author: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{novel.author?.name}</span> ({novel.author?.email}) • {novel.chapters?.length || 0} chapters
                      </p>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 max-w-xl pt-1">
                        {novel.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                    <button
                      onClick={() => handleRejectNovel(novel._id, novel.title)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleApproveNovel(novel._id, novel.title)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: Award Competitions */}
      {activeTab === 'awards' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
                Manage Genre Awards
              </h2>
              <p className="text-xs text-zinc-500">
                Create awards for any genre, manage voting windows, and declare official winners.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingAward(!isCreatingAward)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 shadow-sm transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isCreatingAward ? 'Cancel' : 'Create New Award'}</span>
            </button>
          </div>

          {/* New Award Form */}
          {isCreatingAward && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#16161A] border border-amber-500/30 shadow-lg space-y-6">
              <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Launch a New Genre Award</span>
              </h3>

              <form onSubmit={handleCreateAwardSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Award Competition Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Annual Romance Writing Awards"
                      value={newAward.title}
                      onChange={(e) => setNewAward({ ...newAward, title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Target Genre *
                    </label>
                    <select
                      value={newAward.genre}
                      onChange={(e) => setNewAward({ ...newAward, genre: e.target.value, novels: [] })}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white"
                    >
                      {GENRES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Award Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the rules, recognition, and theme of this genre tournament..."
                    value={newAward.description}
                    onChange={(e) => setNewAward({ ...newAward, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white"
                  />
                </div>

                {/* Participating Novels Selector */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Select Participating Novels ({newAward.genre})
                  </label>
                  <div className="max-h-48 overflow-y-auto p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 space-y-2">
                    {allApprovedNovels
                      .filter((n) => n.genre === newAward.genre)
                      .map((n) => {
                        const isSelected = newAward.novels.includes(n._id);
                        return (
                          <label
                            key={n._id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer text-xs"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleNovelForAward(n._id)}
                              className="rounded text-amber-600 focus:ring-amber-500"
                            />
                            <span className="font-semibold text-zinc-900 dark:text-white">{n.title}</span>
                            <span className="text-zinc-500">by {n.author?.name}</span>
                          </label>
                        );
                      })}
                    {allApprovedNovels.filter((n) => n.genre === newAward.genre).length === 0 && (
                      <p className="text-xs text-zinc-400 italic">
                        No approved novels found in {newAward.genre}. Novels from other genres can still be added later.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingAward(false)}
                    className="px-4 py-2 text-xs font-semibold text-zinc-500"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    loading={awardSubmitting}
                    size="md"
                    icon={Trophy}
                  >
                    Launch Award
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Awards List */}
          <div className="space-y-4">
            {awardsList.map((award) => (
              <div
                key={award._id}
                className="p-6 rounded-2xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                      {award.genre}
                    </span>
                    <span>•</span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                        award.status === 'open'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : award.status === 'winner_declared'
                          ? 'bg-amber-500/10 text-amber-600'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {award.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-white">
                    {award.title}
                  </h3>

                  <p className="text-xs text-zinc-500">
                    {award.novels?.length || 0} Participating Novels • {award.totalVotes || 0} Total Votes
                  </p>

                  {award.status === 'winner_declared' && award.winner && (
                    <div className="pt-1 flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Winner: {typeof award.winner === 'object' ? award.winner.title : 'Selected Novel'}</span>
                    </div>
                  )}
                </div>

                {/* Admin Status Controls */}
                <div className="flex flex-wrap items-center gap-2 self-end md:self-auto shrink-0">
                  {award.status === 'upcoming' && (
                    <button
                      onClick={() => handleStartAward(award._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Open Voting</span>
                    </button>
                  )}

                  {award.status === 'open' && (
                    <button
                      onClick={() => handleStopAward(award._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800 text-white hover:bg-zinc-900 dark:bg-zinc-700 cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>Stop Voting</span>
                    </button>
                  )}

                  {award.status !== 'winner_declared' && (
                    <button
                      onClick={() => handleDeclareWinner(award._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 cursor-pointer"
                      title="Automatically calculates novel with highest votes and declares winner"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Declare Winner</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Admin;
