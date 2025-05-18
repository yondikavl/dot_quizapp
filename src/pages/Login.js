import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#31ad0b]">
      <img src='/bg.svg' alt="Quiz" className="absolute bottom-0 w-full md:w-auto md:h-5/6 left-0 object-cover opacity-50 z-0" />
      <form onSubmit={handleSubmit} className="p-6 bg-gray-100 rounded-lg shadow-md text-center z-10">
        <img src="/logo.svg" alt="Logo" className="w-32 h-32 mx-auto mb-4" />
        <input
          type="text"
          placeholder="Input Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 px-4 py-2 w-full border rounded-md"
        />
        <button type="submit" className="w-full px-4 py-2 bg-[#31ad0b] text-white rounded-md">
          Start Quiz
        </button>
      </form>
    </div>
  );
};

export default Login;
