import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { BookOpen, Feather, Menu, X, LogOut, User, PlusCircle, Shield, Library } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 py-1 px-3 rounded-lg ${
      isActive
        ? 'text-zinc-900 dark:text-white font-semibold bg-zinc-200/50 dark:bg-zinc-800'
        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/40'
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#F7F7F5]/90 dark:bg-[#0B0B0D]/90 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white group"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center transition-transform group-hover:scale-105">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-serif tracking-normal text-2xl font-bold">WriteUp</span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/home" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/genres" className={navLinkClass}>
              Genres
            </NavLink>
            <NavLink to="/awards" className={navLinkClass}>
              Awards
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
          </nav>

          {/* Desktop Right Controls */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/create-novel"
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-amber-600/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 hover:bg-amber-600/20 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Novel</span>
                </Link>

                <Link
                  to="/my-novels"
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  title="My Novels"
                >
                  <Library className="w-4 h-4" />
                  <span>My Novels</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 hover:bg-purple-500/20 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-[#F7F7F5] dark:bg-[#0B0B0D] px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            <NavLink
              to="/home"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Home
            </NavLink>
            <NavLink
              to="/genres"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Genres
            </NavLink>
            <NavLink
              to="/awards"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Awards
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              About
            </NavLink>
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-novel"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-600 dark:text-amber-400"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Novel</span>
                </Link>
                <Link
                  to="/my-novels"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  <Library className="w-4 h-4" />
                  <span>My Novels</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 dark:text-purple-400"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  <User className="w-4 h-4" />
                  <span>Profile ({user?.name})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-medium rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-medium rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
