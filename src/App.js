import React, { useState } from 'react';
import QuizApp from './components/QuizApp';
import Login from './pages/Login';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  const handleLogin = (username) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {isLoggedIn ? (
        <>
          <button
            onClick={handleLogout}
            className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
          <QuizApp />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
