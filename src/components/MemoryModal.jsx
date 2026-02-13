import React from 'react';
import { FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaHeart, FaTag } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MemoryModal = ({ memory, onClose }) => {
  // Safe defaults
  const safeMemory = memory || {};
  const personName = safeMemory.addedBy || 'cherish';
  const imageUrl = safeMemory.imageUrl || '';
  const title = safeMemory.title || 'Untitled Memory';
  const description = safeMemory.description || '';
  const date = safeMemory.date || new Date().toISOString().split('T')[0];
  const location = safeMemory.location || '';
  const memoryType = safeMemory.type || 'memory';
  const tags = Array.isArray(safeMemory.tags) ? safeMemory.tags : [];
  const createdAt = safeMemory.createdAt || new Date().toISOString();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-2 border-pink-900/30 shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-0.5 right-2 z-10 p-3  rounded-xl border border-none transition-colors"
          >
            <FaTimes className="text-white text-lg" />
          </button>

          {/* Content */}
          <div className="overflow-y-auto max-h-[90vh]">
            {/* Image/Media Section */}
            {imageUrl && (
              <div className="relative h-64 sm:h-96">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Person Badge on Image */}
                <div className={`absolute top-4 left-4 px-4 py-2 rounded-full font-bold shadow-lg ${
                  personName === 'joseph'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                    : 'bg-gradient-to-r from-pink-600 to-pink-500 text-white'
                }`}>
                  <div className="flex items-center space-x-2">
                    <FaUser />
                    <span>{personName.charAt(0).toUpperCase() + personName.slice(1)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className="p-6 sm:p-8">
              {/* Type and Date Header */}
              <div className="flex flex-wrap items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className={`px-4 py-2 rounded-xl font-semibold ${
                    memoryType === 'anniversary' 
                      ? 'bg-pink-900/40 text-pink-300' 
                      : 'bg-gray-700/50 text-gray-300'
                  }`}>
                    {memoryType.charAt(0).toUpperCase() + memoryType.slice(1)}
                  </span>
                  
                  <div className="flex items-center space-x-2 text-gray-400">
                    <FaCalendarAlt />
                    <span className="font-medium">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>

                {location && (
                  <div className="flex items-center space-x-2 text-gray-400 mt-4 sm:mt-0">
                    <FaMapMarkerAlt />
                    <span className="font-medium">{location}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                {title}
              </h2>

              {/* Description */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>

              {/* Tags Section */}
              {tags.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <FaTag className="text-pink-400" />
                    <h3 className="text-xl font-semibold text-white">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-4 py-2 rounded-xl font-medium ${
                          personName === 'joseph'
                            ? 'bg-blue-900/30 text-blue-300 border border-blue-900/50'
                            : 'bg-pink-900/30 text-pink-300 border border-pink-900/50'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Info */}
              <div className="pt-6 border-t border-gray-700/50">
                <div className="flex flex-wrap items-center justify-between text-gray-400">
                  <div className="flex items-center space-x-2">
                    <FaUser className="text-pink-400" />
                    <span>Added by: <span className="font-semibold text-white">
                      {personName.charAt(0).toUpperCase() + personName.slice(1)}
                    </span></span>
                  </div>
                  
                  <div className="mt-2 sm:mt-0">
                    <span className="text-sm">
                      Added on {new Date(createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className={`absolute bottom-0 right-0 w-24 h-24 ${
            personName === 'joseph'
              ? 'bg-gradient-to-tl from-blue-600/10 to-transparent'
              : 'bg-gradient-to-tl from-pink-600/10 to-transparent'
          }`} />
          
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <FaHeart className={`text-4xl ${
              personName === 'joseph' ? 'text-blue-500/20' : 'text-pink-500/20'
            }`} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MemoryModal;