import React, { useState, useEffect } from 'react';
import { FaHeart, FaLock, FaUser, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Login = ({ onLogin }) => {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  
  // You can change this passcode to whatever you want
  const correctPasscode = import.meta.VITE_APP_PASSCODE || '280406';
  
  // Check if already logged in (from localStorage)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loveTimelineLoggedIn');
    if (isLoggedIn === 'true') {
      onLogin();
    }
  }, [onLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate API call delay
    setTimeout(() => {
      if (passcode === correctPasscode) {
        // Store login state in localStorage
        localStorage.setItem('loveTimelineLoggedIn', 'true');
        onLogin();
      } else {
        setError('Incorrect passcode. Please try again.');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      setLoading(false);
    }, 800);
  };

  const handleReset = () => {
    localStorage.removeItem('loveTimelineLoggedIn');
    setPasscode('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(80)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-pink-500/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Login Card */}
        <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl sm:rounded-4xl border border-pink-900/30 p-8 sm:p-10 shadow-2xl">
          {/* Floating Heart Animation */}
          {/* <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 border-2 border-pink-500/30 rounded-full"
          /> */}
          {/* <FaHeart className="text-2xl sm:text-3xl text-pink-500 absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> */}

          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <FaHeart className="text-5xl sm:text-6xl text-pink-500" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300 bg-clip-text text-transparent mb-2">
              Our Love Timeline
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              A journey through our memories
            </p>
          </div>

          {/* Login Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Passcode Input */}
            <div className="space-y-3">
              <label className="flex items-center text-sm sm:text-base font-medium text-gray-300">
                <FaLock className="mr-2 text-pink-400" />
                Enter Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className={`w-full px-5 py-4 bg-gray-900/70 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 text-white placeholder-gray-500 transition-all text-lg ${
                    shake ? 'border-red-500 animate-shake' : 'border-gray-700'
                  }`}
                  placeholder="••••••••"
                  required
                  autoFocus
                  disabled={loading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {loading ? (
                    <FaSpinner className="text-pink-500 animate-spin" />
                  ) : (
                    <FaHeart className="text-pink-500/50" />
                  )}
                </div>
              </div>
              
              {/* Hint */}
              <p className="text-xs text-gray-500 text-center mt-2">
                Hint: Our special date or a meaningful word
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-900/20 border border-red-700/30 rounded-xl p-4"
              >
                <p className="text-red-300 text-sm sm:text-base text-center">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || !passcode}
              className="w-full py-4 bg-gradient-to-r from-pink-600 via-pink-500 to-pink-400 text-white font-bold rounded-xl hover:from-pink-700 hover:via-pink-600 hover:to-pink-500 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Enter Our Timeline</span>
                  <FaArrowRight />
                </>
              )}
            </motion.button>

            {/* Reset Option */}
            <div className="text-center pt-4 border-t border-gray-700/50">
              <button
                type="button"
                onClick={handleReset}
                className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
              >
                Reset login
              </button>
            </div>
          </motion.form>

          {/* Couple Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 sm:mt-12 pt-6 border-t border-gray-700/50"
          >
            <div className="flex items-center justify-center space-x-4">
              <div className="text-right">
                <p className="text-lg font-semibold text-white">Joseph</p>
                {/* <p className="text-xs text-gray-400">Husband</p> */}
              </div>
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 bg-gradient-to-r from-pink-600 to-pink-400 rounded-full flex items-center justify-center"
                >
                  <FaHeart className="text-white" />
                </motion.div>
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold text-white">Cherish</p>
                {/* <p className="text-xs text-gray-400">Wife</p> */}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;