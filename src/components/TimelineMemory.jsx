import React from 'react';
import { FaHeart, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaImage } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TimelineMemory = ({ memory, index, isAlternating = true }) => {
  // Safe defaults to prevent errors
  const safeMemory = memory || {};
  const isEven = isAlternating ? index % 2 === 0 : true;
  const personName = safeMemory.addedBy || 'cherish';
  const personColor = personName === 'joseph' ? 'blue' : 'pink';
  
  // Safe access to all properties
  const imageUrl = safeMemory.imageUrl || '';
  const title = safeMemory.title || 'Untitled Memory';
  const description = safeMemory.description || '';
  const date = safeMemory.date || new Date().toISOString().split('T')[0];
  const location = safeMemory.location || '';
  const memoryType = safeMemory.type || 'memory';
  const tags = Array.isArray(safeMemory.tags) ? safeMemory.tags : [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex-shrink-0 w-72 sm:w-80 lg:w-96 mx-2 sm:mx-4"
    >
      {/* Connection Line - Alternating Position */}
      <div className={`relative ${isEven ? 'h-20 sm:h-24' : 'h-20 sm:h-24'}`}>
        {/* Top connection line for even cards */}
        {/* {isEven && ( */}
          <>
            <div className={`absolute left-1/2 top-0 w-1 h-8 sm:h-12 bg-gradient-to-b ${
              personName === 'joseph' 
                ? 'from-blue-500 to-transparent' 
                : 'from-pink-500 to-transparent'
            }`} />
            <motion.div
              whileHover={{ scale: 1.2, rotate: 15 }}
              className={`absolute left-1/2 top-8 sm:top-12 transform -translate-x-1/2 p-2 sm:p-3 rounded-full shadow-lg ${
                personName === 'joseph'
                  ? 'bg-gradient-to-br from-blue-600 to-blue-400'
                  : 'bg-gradient-to-br from-pink-600 to-pink-400'
              }`}
            >
              <div className="relative">
                <FaHeart className="text-white text-sm sm:text-lg" />
                <motion.div
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute inset-0 rounded-full ${
                    personName === 'joseph' ? 'bg-blue-500/30' : 'bg-pink-500/30'
                  }`}
                />
              </div>
            </motion.div>
          </>
        {/* )} */}

        {/* Bottom connection line for odd cards */}
        {/* {!isEven && (
          <>
            <motion.div
              whileHover={{ scale: 1.2, rotate: 15 }}
              className={`absolute left-1/2 bottom-8 sm:bottom-12 transform -translate-x-1/2 p-2 sm:p-3 rounded-full shadow-lg ${
                personName === 'joseph'
                  ? 'bg-gradient-to-br from-blue-600 to-blue-400'
                  : 'bg-gradient-to-br from-pink-600 to-pink-400'
              }`}
            >
              <div className="relative">
                <FaHeart className="text-white text-sm sm:text-lg" />
                <motion.div
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute inset-0 rounded-full ${
                    personName === 'joseph' ? 'bg-blue-500/30' : 'bg-pink-500/30'
                  }`}
                />
              </div>
            </motion.div>
            <div className={`absolute left-1/2 bottom-0 w-1 h-8 sm:h-12 bg-gradient-to-t ${
              personName === 'joseph' 
                ? 'from-blue-500 to-transparent' 
                : 'from-pink-500 to-transparent'
            }`} />
          </>
        )} */}
      </div>

      {/* Memory Card - Alternating Position */}
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className={`relative overflow-hidden rounded-xl sm:rounded-2xl border-2 backdrop-blur-sm ${
          personName === 'joseph'
            ? 'border-blue-900/30 bg-gradient-to-br from-gray-800/80 to-blue-900/20'
            : 'border-pink-900/30 bg-gradient-to-br from-gray-800/80 to-pink-900/20'
        } shadow-xl ${isEven ? 'mb-0' : 'mt-0'}`}
      >
        {/* Added By Badge */}
        <div className={`absolute top-2 sm:top-4 right-2 sm:right-4 px-2 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-xs sm:text-sm shadow-lg z-10 ${
          personName === 'joseph'
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
            : 'bg-gradient-to-r from-pink-600 to-pink-500 text-white'
        }`}>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <FaUser className="text-xs" />
            <span>{personName.charAt(0).toUpperCase()}</span>
          </div>
        </div>

        {/* Image Section */}
        {imageUrl && (
          <div className="h-40 sm:h-56 overflow-hidden relative">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
              }}
            />
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded-lg flex items-center space-x-1">
              <FaImage className="text-pink-400 text-xs" />
              <span className="text-xs text-white">Image</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        {/* Content Section */}
        <div className="p-3 sm:p-4 lg:p-6">
          {/* Type Badge */}
          <div className="mb-2 sm:mb-4">
            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
              memoryType === 'anniversary' 
                ? 'bg-pink-900/30 text-pink-300' 
                : 'bg-gray-700/50 text-gray-300'
            }`}>
              {memoryType.charAt(0).toUpperCase() + memoryType.slice(1)}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 leading-tight line-clamp-2">
            {title}
          </h3>

          <p className="text-gray-300 mb-3 sm:mb-6 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {description}
          </p>

          {/* Date and Location */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <FaCalendarAlt />
              <span>{new Date(date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
            
            {location && (
              <div className="flex items-center space-x-2 text-gray-400">
                <FaMapMarkerAlt />
                <span className="truncate max-w-[120px] sm:max-w-none">{location}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className={`px-2 py-1 rounded-lg text-xs font-medium truncate max-w-[80px] sm:max-w-none ${
                  personName === 'joseph'
                    ? 'bg-blue-900/30 text-blue-300'
                    : 'bg-pink-900/30 text-pink-300'
                }`}
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 rounded-lg text-xs bg-gray-700/50 text-gray-300">
                +{tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TimelineMemory;