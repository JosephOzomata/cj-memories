import React, { useRef, useEffect, useState } from 'react';
import { FaHeart, FaCalendarAlt, FaTags, FaUser, FaArrowLeft, FaArrowRight, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import TimelineMemory from './TimelineMemory';

const Timeline = ({ memories, onMemoryClick }) => {
  const timelineRef = useRef(null);
  const [activeYear, setActiveYear] = useState(null);
  const [years, setYears] = useState([]);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const uniqueYears = [...new Set(memories.map(m => new Date(m.date).getFullYear()))].sort((a, b) => a - b);
    setYears(uniqueYears);
    setActiveYear(null);
  }, [memories]);

  useEffect(() => {
    const checkScroll = () => {
      if (timelineRef.current) {
        if (isMobile) {
          // For vertical scroll on mobile
          const { scrollHeight, clientHeight, scrollTop } = timelineRef.current;
          setShowScrollButtons(scrollHeight > clientHeight);
          setMaxScroll(scrollHeight - clientHeight);
          setScrollPosition(scrollTop);
        } else {
          // For horizontal scroll on desktop/tablet
          const { scrollWidth, clientWidth, scrollLeft } = timelineRef.current;
          setShowScrollButtons(scrollWidth > clientWidth);
          setMaxScroll(scrollWidth - clientWidth);
          setScrollPosition(scrollLeft);
        }
      }
    };
    
    checkScroll();
    
    const handleScroll = () => {
      if (timelineRef.current) {
        if (isMobile) {
          setScrollPosition(timelineRef.current.scrollTop);
        } else {
          setScrollPosition(timelineRef.current.scrollLeft);
        }
      }
    };
    
    if (timelineRef.current) {
      timelineRef.current.addEventListener('scroll', handleScroll);
    }
    
    window.addEventListener('resize', checkScroll);
    return () => {
      if (timelineRef.current) {
        timelineRef.current.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [memories, isMobile]);

  const scrollLeft = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollUp = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollBy({ top: -300, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollBy({ top: 300, behavior: 'smooth' });
    }
  };

  const scrollToYear = (year) => {
    setActiveYear(year);
    if (timelineRef.current) {
      if (isMobile) {
        // For mobile vertical scroll, find the memory element and scroll to it
        const yearMemories = memories.filter(m => new Date(m.date).getFullYear() === year);
        if (yearMemories.length > 0) {
          // This is a simplified approach - you might want to adjust it
          timelineRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        // For desktop horizontal scroll
        const yearIndex = years.indexOf(year);
        if (yearIndex !== -1) {
          const scrollPosition = yearIndex * 320;
          timelineRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        }
      }
    }
  };

  const filteredMemories = activeYear === null 
    ? memories 
    : memories.filter(m => new Date(m.date).getFullYear() === activeYear);

  // Calculate fade opacity based on scroll position
  const getFadeOpacity = (isStart) => {
    if (isMobile) {
      // Vertical fade for mobile
      if (isStart && scrollPosition <= 0) return 0;
      if (isStart && scrollPosition <= 100) return scrollPosition / 100;
      if (!isStart && scrollPosition >= maxScroll) return 0;
      if (!isStart && scrollPosition >= maxScroll - 100) return (maxScroll - scrollPosition) / 100;
      return 1;
    } else {
      // Horizontal fade for desktop
      if (isStart && scrollPosition <= 0) return 0;
      if (isStart && scrollPosition <= 100) return scrollPosition / 100;
      if (!isStart && scrollPosition >= maxScroll) return 0;
      if (!isStart && scrollPosition >= maxScroll - 100) return (maxScroll - scrollPosition) / 100;
      return 1;
    }
  };

  return (
    <div className="relative">
      {/* Year Navigation */}
      <div className="mb-6 sm:mb-12">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300 bg-clip-text text-transparent">
              Our love journey
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">Scroll through our beautiful moments together</p>
          </div>
          
          {showScrollButtons && !isMobile && (
            <div className="hidden sm:flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollLeft}
                className="p-2 sm:p-3 bg-gray-800/70 backdrop-blur-sm border border-pink-900/30 rounded-xl hover:bg-gray-700/70 transition-colors"
              >
                <FaArrowLeft className="text-pink-400 text-sm sm:text-base" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollRight}
                className="p-2 sm:p-3 bg-gray-800/70 backdrop-blur-sm border border-pink-900/30 rounded-xl hover:bg-gray-700/70 transition-colors"
              >
                <FaArrowRight className="text-pink-400 text-sm sm:text-base" />
              </motion.button>
            </div>
          )}
        </div>

        {/* Year Tabs */}
        
      </div>

      {/* Timeline Container */}
      <div className="relative py-4 sm:py-20">
        {/* Timeline Line - Only show on desktop */}
        {!isMobile && (
          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 z-0">
            <div className="relative h-1 sm:h-1.5 mx-4 sm:mx-8">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/20 to-transparent blur-sm" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-900/50 via-pink-500 to-pink-900/50" />
              
              {/* Floating Hearts */}
              {filteredMemories.map((_, index) => {
                const position = (index + 0.5) / filteredMemories.length * 100;
                return (
                  <motion.div
                    key={index}
                    className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${position}%` }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    <FaHeart className="text-pink-500 text-base sm:text-lg drop-shadow-lg" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        

        {/* Memories Container */}
        <div
          ref={timelineRef}
          className={`
            ${isMobile 
              ? 'overflow-y-auto h-[60vh] flex flex-col space-y-6 px-4 scrollbar-hide' 
              : 'overflow-x-auto flex pb-12 px-2 sm:px-8 scrollbar-hide'
            }
            relative z-10
          `}
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            ...(isMobile ? {} : { display: 'flex' })
          }}
        >
          {isMobile ? (
            // Vertical layout for mobile
            <AnimatePresence>
              <div className="space-y-6">
                {filteredMemories.map((memory, index) => (
                  <motion.div 
                    key={memory.id} 
                    onClick={() => onMemoryClick(memory)}
                    className="cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`${index % 2 === 0 ? '' : ''}`}>
                      <TimelineMemory 
                        memory={memory} 
                        index={index} 
                        isAlternating={false}
                        isMobile={true}
                      />
                    </div>
                    
                    {/* Connecting line between memories on mobile */}
                    {index < filteredMemories.length - 1 && (
                      <div className="flex justify-center my-2">
                        <div className="h-8 w-0.5 bg-gradient-to-b from-pink-500/50 to-transparent" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          ) : (
            // Horizontal layout for desktop/tablet
            <div className="flex space-x-4 sm:space-x-8">
              <AnimatePresence>
                {filteredMemories.map((memory, index) => (
                  <div 
                    key={memory.id} 
                    onClick={() => onMemoryClick(memory)}
                    className="cursor-pointer"
                  >
                    <TimelineMemory 
                      memory={memory} 
                      index={index} 
                      isAlternating={true}
                      isMobile={false}
                    />
                  </div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-6 mt-8 sm:mt-16">
        {/* Stats cards remain the same */}
        <motion.div 
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-pink-900/30 shadow-lg"
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-pink-900/30 rounded-lg sm:rounded-xl">
              <FaHeart className="text-lg sm:text-2xl text-pink-500" />
            </div>
            <div>
              <p className="text-xl sm:text-3xl font-bold text-white">{memories.length}</p>
              <p className="text-gray-400 text-xs sm:text-sm">Memories</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-pink-900/30 shadow-lg"
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-pink-900/30 rounded-lg sm:rounded-xl">
              <FaCalendarAlt className="text-lg sm:text-2xl text-pink-500" />
            </div>
            <div>
              <p className="text-xl sm:text-3xl font-bold text-white">{years.length}</p>
              <p className="text-gray-400 text-xs sm:text-sm">Years</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-pink-900/30 shadow-lg"
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-pink-900/30 rounded-lg sm:rounded-xl">
              <FaUser className="text-lg sm:text-2xl text-pink-500" />
            </div>
            <div>
              <p className="text-xl sm:text-3xl font-bold text-white">
                {memories.filter(m => m.addedBy === 'joseph').length}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">By Joseph</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-pink-900/30 shadow-lg"
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-pink-900/30 rounded-lg sm:rounded-xl">
              <FaUser className="text-lg sm:text-2xl text-pink-500" />
            </div>
            <div>
              <p className="text-xl sm:text-3xl font-bold text-white">
                {memories.filter(m => m.addedBy === 'cherish').length}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">By Cherish</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Empty State */}
      {filteredMemories.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 sm:py-24"
        >
          <div className="relative inline-block mb-4 sm:mb-6">
            <FaHeart className="text-6xl sm:text-8xl text-pink-500/30" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <FaHeart className="text-3xl sm:text-4xl text-pink-500" />
            </motion.div>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-300 mb-2 sm:mb-3">
            {activeYear ? `No memories from ${activeYear}` : 'PLease connect to a good network and reload to view our memories 😅'}
          </h3>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto px-4">
            {activeYear 
              ? 'Try selecting a different year or add new memories for this year!'
              : 'Start your love story by adding your first memory!'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Timeline;