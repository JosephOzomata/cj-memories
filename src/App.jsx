import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Timeline from './components/Timeline';
import MemoryForm from './components/MemoryForm';
import Login from './components/Login';
import MemoryModal from './components/MemoryModal';
import { collection, getDocs, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase/config';

function App() {
  const [memories, setMemories] = useState([]);
  const [activePage, setActivePage] = useState('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount
  useEffect(() => {
    const checkLogin = () => {
      const loggedIn = localStorage.getItem('loveTimelineLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
    };
    
    checkLogin();
    
    // Listen for storage changes (in case of multiple tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'loveTimelineLoggedIn') {
        setIsLoggedIn(e.newValue === 'true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch memories from Firebase (only if logged in)
  useEffect(() => {
    if (!isLoggedIn) return;
    
    const fetchMemories = async () => {
      try {
        setLoading(true);
        const memoriesRef = collection(db, 'memories');
        const q = query(memoriesRef, orderBy('date', 'asc'));
        
        // Real-time listener
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const memoriesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMemories(memoriesData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching memories:', error);
        setLoading(false);
      }
    };

    fetchMemories();
  }, [isLoggedIn]);

  const addMemory = async (newMemory) => {
    try {
      const memoriesRef = collection(db, 'memories');
      await addDoc(memoriesRef, newMemory);
    } catch (error) {
      console.error('Error adding memory:', error);
      alert('Error saving memory. Please try again.');
    }
  };

  const handleMemoryClick = (memory) => {
    setSelectedMemory(memory);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMemory(null);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('loveTimelineLoggedIn');
    setIsLoggedIn(false);
    // Also clear state
    setMemories([]);
    setActivePage('timeline');
    setSearchQuery('');
    setSelectedPerson('all');
  };

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = 
      memory.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      memory.date?.includes(searchQuery);
    
    const matchesPerson = selectedPerson === 'all' || memory.addedBy === selectedPerson;
    
    return matchesSearch && matchesPerson;
  });

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <Navbar 
        onSearch={setSearchQuery} 
        setActivePage={setActivePage}
        activePage={activePage}
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {loading && activePage === 'timeline' ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : activePage === 'timeline' ? (
          <Timeline 
            memories={filteredMemories} 
            onMemoryClick={handleMemoryClick}
          />
        ) : (
          <MemoryForm addMemory={addMemory} setActivePage={setActivePage} />
        )}
      </main>

      {/* Memory Modal */}
      {isModalOpen && selectedMemory && (
        <MemoryModal 
          memory={selectedMemory}
          onClose={handleCloseModal}
        />
      )}
      
      <footer className="text-center py-4 sm:py-6 px-3 border-t border-pink-900/30 bg-black/50">
        
        <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
          Joseph & Cherish • Since {memories.length > 0 ? new Date(memories[0].date).getFullYear() : '2025'}
        </p>
      </footer>
    </div>
  );
}

export default App;