import React, { useState } from 'react';
import { FaSearch, FaHeart, FaPlus, FaHome, FaUser, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Navbar = ({ onSearch, setActivePage, activePage, selectedPerson, setSelectedPerson, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900/90 backdrop-blur-lg border-b border-pink-900/30 sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSecretClicks(c => {
                if (c + 1 === 5) {
                  setActivePage('add');
                  return 0;
                }
                return c + 1;
              });
            }}
          >
            <div className="relative">
              <FaHeart className="text-2xl sm:text-3xl text-pink-500 animate-pulse" />
            </div>
            <div className="sm:block">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300 bg-clip-text text-transparent tracking-tight">
                Joseph & Cherish
              </h1>
              <p className="text-xs text-gray-400 tracking-wider">LOVE TIMELINE</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-3 lg:space-x-6">
            {/* Search Bar */}
            <div className="relative w-48 lg:w-64">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-800/70 backdrop-blur-sm border border-pink-900/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 text-white placeholder-gray-400 text-sm"
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActivePage('timeline')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                  activePage === 'timeline'
                    ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70'
                }`}
              >
                <FaHome className="text-xs" />
                <span className="font-medium">Timeline</span>
              </motion.button>

              {/* Logout Button - Desktop */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-red-800/40 text-red-400 rounded-xl transition-all border border-red-900/30"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center space-x-2">
            {/* Mobile Logout Button (small icon only) */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 bg-red-900/30 rounded-lg border border-red-900/30"
            >
              <FaSignOutAlt className="text-red-300" />
            </motion.button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:text-white"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sm:hidden mt-4 space-y-4 pb-2"
          >
            {/* Person Filter Mobile */}
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Filter by:</span>
              <div className="flex bg-gray-800 rounded-lg p-1">
                {['all', 'joseph', 'cherish'].map((person) => (
                  <button
                    key={person}
                    onClick={() => {
                      setSelectedPerson(person);
                      setIsMenuOpen(false);
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      selectedPerson === person
                        ? 'bg-pink-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {person}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar Mobile */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search memories..."
                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-pink-900/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 text-white"
                onChange={(e) => onSearch(e.target.value)}
                onClick={() => setIsMenuOpen(false)}
              />
            </div>

            {/* Mobile Navigation Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setActivePage('timeline');
                  setIsMenuOpen(false);
                }}
                className={`py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  activePage === 'timeline'
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                <FaHome />
                <span>Timeline</span>
              </button>
              
              {/* Logout Button - Mobile Full Width */}
              <button
                onClick={handleLogout}
                className="py-2 rounded-lg transition-colors bg-white hover:bg-red-800/40 text-red-400 flex items-center justify-center space-x-2 border border-red-900/30"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;