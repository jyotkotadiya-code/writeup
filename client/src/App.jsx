import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Home from './pages/Home';
import About from './pages/About';
import Genres from './pages/Genres';
import GenreDetails from './pages/GenreDetails';
import NovelDetails from './pages/NovelDetails';
import ChapterReader from './pages/ChapterReader';
import Awards from './pages/Awards';
import AwardDetails from './pages/AwardDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreateNovel from './pages/CreateNovel';
import MyNovels from './pages/MyNovels';
import Admin from './pages/Admin';
import { useAuth } from './context/AuthContext';

// Protected Route Wrapper for Authenticated Users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const isReaderPage = location.pathname.includes('/chapter/');

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5] dark:bg-[#0B0B0D] text-[#111111] dark:text-[#F5F5F5] transition-colors duration-200">
      {/* Hide standard navbar in distraction-free chapter reader */}
      {!isReaderPage && <Navbar />}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/genres/:genre" element={<GenreDetails />} />
          <Route path="/novel/:id" element={<NovelDetails />} />
          <Route path="/novel/:novelId/chapter/:chapterId" element={<ChapterReader />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/awards/:id" element={<AwardDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected User Pages */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-novel"
            element={
              <ProtectedRoute>
                <CreateNovel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-novels"
            element={
              <ProtectedRoute>
                <MyNovels />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Page */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      {!isReaderPage && <Footer />}
    </div>
  );
}

export default App;
