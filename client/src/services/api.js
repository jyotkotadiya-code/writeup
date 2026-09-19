const API_URL = '/api';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('writeup_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || 'Something went wrong. Please try again.';
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  // Auth
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => apiRequest('/auth/me'),

  // Novels
  getNovels: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.genre) searchParams.append('genre', params.genre);
    if (params.search) searchParams.append('search', params.search);
    if (params.sort) searchParams.append('sort', params.sort);
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiRequest(`/novels${queryString}`);
  },
  getNovel: (id) => apiRequest(`/novels/${id}`),
  getMyNovels: () => apiRequest('/novels/my-novels'),
  createNovel: (novelData) => apiRequest('/novels', { method: 'POST', body: JSON.stringify(novelData) }),
  updateNovel: (id, novelData) => apiRequest(`/novels/${id}`, { method: 'PUT', body: JSON.stringify(novelData) }),
  deleteNovel: (id) => apiRequest(`/novels/${id}`, { method: 'DELETE' }),
  submitNovel: (id) => apiRequest(`/novels/${id}/submit`, { method: 'POST' }),
  toggleLike: (id) => apiRequest(`/novels/${id}/like`, { method: 'POST' }),
  toggleWishlist: (id) => apiRequest(`/novels/${id}/wishlist`, { method: 'POST' }),

  // Chapters
  getChapters: (novelId) => apiRequest(`/chapters/novel/${novelId}`),
  getChapter: (id) => apiRequest(`/chapters/${id}`),
  addChapter: (novelId, chapterData) =>
    apiRequest(`/chapters/novel/${novelId}`, { method: 'POST', body: JSON.stringify(chapterData) }),
  updateChapter: (id, chapterData) =>
    apiRequest(`/chapters/${id}`, { method: 'PUT', body: JSON.stringify(chapterData) }),
  deleteChapter: (id) => apiRequest(`/chapters/${id}`, { method: 'DELETE' }),

  // Awards
  getAwards: () => apiRequest('/awards'),
  getAward: (id) => apiRequest(`/awards/${id}`),
  voteAward: (awardId, novelId) =>
    apiRequest(`/awards/${awardId}/vote`, { method: 'POST', body: JSON.stringify({ novelId }) }),

  // Admin
  getAdminStats: () => apiRequest('/admin/stats'),
  getPendingNovels: () => apiRequest('/admin/pending-novels'),
  approveNovel: (id) => apiRequest(`/admin/novels/${id}/approve`, { method: 'POST' }),
  rejectNovel: (id) => apiRequest(`/admin/novels/${id}/reject`, { method: 'POST' }),
  createAward: (awardData) => apiRequest('/admin/awards', { method: 'POST', body: JSON.stringify(awardData) }),
  startAward: (id) => apiRequest(`/admin/awards/${id}/start`, { method: 'POST' }),
  stopAward: (id) => apiRequest(`/admin/awards/${id}/stop`, { method: 'POST' }),
  declareWinner: (id, winnerNovelId) =>
    apiRequest(`/admin/awards/${id}/winner`, { method: 'POST', body: JSON.stringify({ winnerNovelId }) }),
};

export default api;
