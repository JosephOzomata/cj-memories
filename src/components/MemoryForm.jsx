import React, { useState, useRef } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaUpload, FaTimes, FaUser, FaHeart, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
// NO firebase/storage imports here

const MemoryForm = ({ addMemory, setActivePage }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    type: 'memory',
    tags: [],
    imageUrl: '',
    newTag: '',
    addedBy: 'cherish'
  });
  
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Cloudinary upload function
  // Cloudinary upload function
const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
  console.log('Cloudinary Config:', {
    cloudName: cloudName,
    uploadPreset: uploadPreset,
    hasCloudName: !!cloudName,
    hasUploadPreset: !!uploadPreset
  });
  
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing. Please check your .env file.');
  }
  
  const uploadData = new FormData();
  uploadData.append('file', file);
  uploadData.append('upload_preset', uploadPreset);
  uploadData.append('folder', 'memories');
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: uploadData,
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }
    
    const data = await response.json();
    console.log('Cloudinary upload successful:', data);
    return data.secure_url;
    
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  setUploading(true);
  
  let imageUrl = formData.imageUrl;
  const file = fileInputRef.current?.files[0];
  
  console.log('File selected:', file);
  console.log('Form data imageUrl:', formData.imageUrl);
  
  // Upload image to Cloudinary if a file is selected
  if (file) {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, GIF, WebP)');
        setUploading(false);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        setUploading(false);
        return;
      }
      
      console.log('Starting Cloudinary upload...');
      imageUrl = await uploadToCloudinary(file);
      console.log('Upload successful, URL:', imageUrl);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Error: ${error.message}`);
      setUploading(false);
      return;
    }
  } else {
    console.log('No file selected, using existing imageUrl or none');
  }
  
  const newMemory = {
    title: formData.title,
    description: formData.description,
    date: formData.date || new Date().toISOString().split('T')[0],
    location: formData.location || '',
    type: formData.type,
    tags: formData.tags,
    imageUrl: imageUrl,
    addedBy: formData.addedBy,
    createdAt: new Date().toISOString()
  };

  console.log('Creating new memory:', newMemory);
  
  // This calls the addMemory function from App.jsx
  // which will save to Firebase Firestore
  addMemory(newMemory);
  
  // Reset form
  setFormData({
    title: '',
    description: '',
    date: '',
    location: '',
    type: 'memory',
    tags: [],
    imageUrl: '',
    newTag: '',
    addedBy: 'cherish'
  });
  
  // Reset file input
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
  
  setUploading(false);
  setActivePage('timeline');
};

  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag.trim()],
        newTag: ''
      });
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Create a local URL for preview
      const url = URL.createObjectURL(file);
      setFormData({
        ...formData,
        imageUrl: url
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto px-2 sm:px-0"
    >
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-pink-900/30 p-4 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-block relative mb-3 sm:mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 sm:w-20 sm:h-20 border-2 border-pink-500/20 rounded-full"
            />
            <FaHeart className="text-3xl sm:text-5xl text-pink-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent mb-1 sm:mb-2">
            Capture a Memory
          </h2>
          {/* <p className="text-gray-400 text-sm sm:text-base">Add a special moment to your love story</p> */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Person Selection */}
          <div>
            <label className="flex items-center text-sm sm:text-base font-medium text-gray-300 mb-3 sm:mb-4">
              <FaUser className="mr-2 text-pink-400" />
              Who is adding this memory?
            </label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {['joseph', 'cherish'].map((person) => (
                <motion.button
                  key={person}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, addedBy: person })}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.addedBy === person
                      ? 'border-pink-500 bg-gradient-to-r from-pink-900/40 to-pink-800/20 shadow-lg'
                      : 'border-gray-700 bg-gray-800/50 hover:border-pink-900/50'
                  }`}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                      formData.addedBy === person 
                        ? 'bg-pink-600' 
                        : 'bg-gray-700'
                    }`}>
                      <span className="text-white font-bold text-sm sm:text-base">
                        {person.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className={`font-semibold text-sm sm:text-base ${
                        formData.addedBy === person ? 'text-pink-300' : 'text-gray-300'
                      }`}>
                        {person.charAt(0).toUpperCase() + person.slice(1)}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2 sm:mb-3">
              Memory Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 text-white placeholder-gray-500 transition-all text-sm sm:text-base"
              placeholder="Give this memory a beautiful title..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2 sm:mb-3">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 text-white placeholder-gray-500 transition-all resize-none text-sm sm:text-base"
              placeholder="Share the story behind this memory..."
            />
          </div>

          {/* Date and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="flex items-center text-sm sm:text-base font-medium text-gray-300 mb-2 sm:mb-3">
                <FaCalendarAlt className="mr-2 text-pink-400" />
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 text-white transition-all"
              />
            </div>

            <div>
              <label className="flex items-center text-sm sm:text-base font-medium text-gray-300 mb-2 sm:mb-3">
                <FaMapMarkerAlt className="mr-2 text-pink-400" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 text-white placeholder-gray-500 transition-all text-sm sm:text-base"
                placeholder="Where did this happen?"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2 sm:mb-3">
              Image (Optional)
            </label>
            
            {/* Image URL Input */}
            <div className="mb-3 sm:mb-4">
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 text-white placeholder-gray-500 transition-all text-sm sm:text-base"
                placeholder="Enter image URL (or upload below)..."
              />
            </div>

            {/* File Upload Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFileSelect}
                className="flex-1 px-4 py-3 bg-gray-800/50 text-gray-300 font-medium rounded-xl hover:bg-gray-700/70 border border-gray-700 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <FaUpload />
                <span>Upload Image File</span>
              </motion.button>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              <div className="text-xs text-gray-400 mt-2 sm:mt-0 sm:ml-4">
                <p>Supported: JPG, PNG, GIF</p>
                <p>Max size: 5MB</p>
              </div>
            </div>

            {/* Preview */}
            {formData.imageUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-300 mb-2">Preview:</p>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl border border-pink-900/30"
                />
              </div>
            )}
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2 sm:mb-3">
              Memory Type
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
              {[
                { id: 'memory', label: 'Memory', emoji: '💭' },
                { id: 'anniversary', label: 'Anniversary', emoji: '🎉' },
                { id: 'vacation', label: 'Trip', emoji: '✈️' },
                { id: 'celebration', label: 'Celebrate', emoji: '🎊' },
                { id: 'surprise', label: 'Surprise', emoji: '🎁' }
              ].map(({ id, label, emoji }) => (
                <motion.button
                  key={id}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData({ ...formData, type: id })}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                    formData.type === id
                      ? 'border-pink-500 bg-pink-900/30 text-white'
                      : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-pink-900/50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                    {/* <span className="text-lg sm:text-xl">{emoji}</span> */}
                    <span className="text-xs sm:text-sm font-medium">{label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center text-sm sm:text-base font-medium text-gray-300 mb-2 sm:mb-3">
              <FaTag className="mr-2 text-pink-400" />
              Tags
            </label>
            <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
              <input
                type="text"
                value={formData.newTag}
                onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-2 sm:py-3 bg-gray-900/70 backdrop-blur-sm border-2 border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 text-white placeholder-gray-500 transition-all text-sm sm:text-base"
                placeholder="Add tags..."
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddTag}
                className="px-4 py-2 sm:py-3 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold rounded-xl hover:from-pink-700 hover:to-pink-600 transition-all shadow-lg text-sm sm:text-base"
              >
                Add
              </motion.button>
            </div>
            
            {/* Tag List */}
            <div className="flex flex-wrap gap-2 min-h-10">
              {formData.tags.map((tag, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-pink-900/40 to-pink-800/40 backdrop-blur-sm text-pink-200 rounded-lg border border-pink-900/30 text-xs sm:text-sm"
                >
                  {/* <span className="mr-1">🏷️</span> */}
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-xs hover:text-white transition-colors"
                  >
                    <FaTimes />
                  </button>
                </motion.span>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-6 sm:pt-8 border-t border-gray-700/50">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePage('timeline')}
              className="px-6 py-3 bg-gray-800/50 text-gray-300 font-semibold rounded-xl hover:bg-gray-700/70 border border-gray-700 transition-all duration-300 text-sm sm:text-base order-2 sm:order-1"
              disabled={uploading}
            >
              ← Back
            </motion.button>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-pink-600 via-pink-500 to-pink-400 text-white font-bold rounded-xl hover:from-pink-700 hover:via-pink-600 hover:to-pink-500 transition-all duration-300 shadow-xl text-sm sm:text-base order-1 sm:order-2 flex items-center justify-center space-x-2 disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Save Memory</span>
                  {/* <span>✨</span> */}
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default MemoryForm;