import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Feed from './components/Feed';
import Profile from './components/Profile';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('feed'); // 'feed' or 'profile'
  const [currentProfileId, setCurrentProfileId] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      document.body.classList.add('dashboard-open');
    } else {
      document.body.classList.remove('dashboard-open');
    }
  }, [user]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('feed');
  };

  return (
    <div className="App">
      {!user ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          {view === 'feed' ? (
            <Feed
              user={user}
              onLogout={handleLogout}
              onProfileClick={(profileId) => {
                const id = typeof profileId === 'string' ? profileId : user._id;
                setCurrentProfileId(id);
                setView('profile');
              }}
            />
          ) : (
            <Profile
              user={user}
              profileUserId={currentProfileId || user._id}
              onLogout={handleLogout}
              onBack={() => {
                setCurrentProfileId(null);
                setView('feed');
              }}
              onAddPost={() => {
                setCurrentProfileId(null);
                setView('feed');
              }}
              onProfileClick={(profileId) => {
                const id = typeof profileId === 'string' ? profileId : user._id;
                setCurrentProfileId(id);
                // stay in 'profile' view but with new ID
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
