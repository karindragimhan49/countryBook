import React from 'react';
import { useUser } from '../contexts/UserContext';

function Dashboard() {
  const { user, logout } = useUser();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <h1 className="text-4xl font-extrabold mb-8">Welcome, <span className="text-indigo-400">{user?.username}</span></h1>
      <button
        onClick={logout}
        className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-full font-semibold shadow-lg transition-transform transform hover:scale-105"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
