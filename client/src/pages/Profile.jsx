import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Bookmark, BookOpen, PlusCircle, Trash2, Library, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import NovelCard from '../components/NovelCard';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('novels'); // 'novels' | 'wishlist'
  const [myNovels, setMyNovels] = useState([]);
  const [wishlistNovels, setWishlistNovels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const [novelsRes, meRes] = await Promise.all([
        api.getMyNovels(),
        api.getMe(),
      ]);
      setMyNovels(novelsRes.novels || []);
      setWishlistNovels(meRes.user?.wishlist || []);
    } catch (err) {
      console.error('Failed to load profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveWishlist = async (novelId) => {
    try {
      await api.toggleWishlist(novelId);
      setWishlistNovels((prev) => prev.filter((n) => n._id !== novelId));
      refreshUser();
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6">
      {/* Profile Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#16161A] border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-serif text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                {user.name}
              </h1>
              {user.role === 'admin' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 uppercase">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              @{user.username} • {user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/create-novel"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write New Story</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 flex space-x-8 text-sm font-medium">
        <button
          onClick={() => setActiveTab('novels')}
          className={`pb-4 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'novels'
              ? 'border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-bold'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Library className="w-4 h-4" />
          <span>My Published Stories ({myNovels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-4 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'wishlist'
              ? 'border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-bold'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Wishlist ({wishlistNovels.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : activeTab === 'novels' ? (
        <div>
          {myNovels.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#16161A] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
              <p className="font-serif text-lg font-bold text-zinc-700 dark:text-zinc-300">
                You haven't written any novels yet.
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                Bring your world and characters to life. Publish chapter-by-chapter and find your readers.
              </p>
              <div className="mt-4">
                <Link
                  to="/create-novel"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Your First Novel</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myNovels.map((novel) => (
                <div key={novel._id} className="relative group">
                  <NovelCard novel={novel} />
                  <div className="mt-2 flex justify-between items-center px-1">
                    <span className="text-[11px] font-mono uppercase text-zinc-400">
                      Approval: {novel.approvalStatus}
                    </span>
                    <Link
                      to="/my-novels"
                      className="text-xs font-semibold text-amber-600 hover:underline"
                    >
                      Manage Chapters &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {wishlistNovels.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#16161A] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
              <p className="font-serif text-lg font-bold text-zinc-700 dark:text-zinc-300">
                Your wishlist is empty.
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                Explore popular and trending novels, and click the bookmark icon to save them here for later.
              </p>
              <div className="mt-4">
                <Link
                  to="/home"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                >
                  Explore Novels
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistNovels.map((novel) => (
                <div key={novel._id} className="relative group">
                  <NovelCard novel={novel} />
                  <button
                    onClick={() => handleRemoveWishlist(novel._id)}
                    className="mt-2 w-full py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove from Wishlist</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
