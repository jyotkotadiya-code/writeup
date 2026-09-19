import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, PlusCircle, Image as ImageIcon, AlertCircle } from 'lucide-react';
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

const PRESET_COVERS = [
  { label: 'Fantasy / Magic', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80' },
  { label: 'Romance / Coastal', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80' },
  { label: 'Sci-Fi / Space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80' },
  { label: 'Mystery / Antique', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80' },
  { label: 'Horror / Atmospheric', url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&auto=format&fit=crop&q=80' },
];

const CreateNovel = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'Fantasy',
    coverImage: PRESET_COVERS[0].url,
    status: 'ongoing',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.createNovel(formData);
      // Navigate to writer dashboard to add chapters
      navigate('/my-novels', {
        state: { message: `"${formData.title}" created as draft. Now add your first chapter!` },
      });
    } catch (err) {
      setError(err.message || 'Failed to create novel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="space-y-2 mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          Author Studio
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
          Create a New Novel
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          Enter your story details. Your novel starts as a draft so you can add chapters before submitting for publication.
        </p>
      </div>

      <div className="bg-white dark:bg-[#16161A] p-6 sm:p-10 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Novel Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. The Obsidian Crown"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Genre & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Primary Genre *
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="ongoing">Ongoing (Regular chapter updates)</option>
                <option value="completed">Completed (Full story ready)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Synopsis / Description *
            </label>
            <textarea
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Introduce your world, protagonist, and central conflict to hook prospective readers..."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Cover Image URL
            </label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            {/* Presets */}
            <div className="pt-2">
              <span className="text-[11px] font-medium text-zinc-500 block mb-1.5">
                Or pick a preset book cover:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_COVERS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, coverImage: preset.url })}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      formData.coverImage === preset.url
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/my-novels')}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <Button
              type="submit"
              loading={loading}
              size="lg"
              icon={PlusCircle}
            >
              Create Novel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNovel;
