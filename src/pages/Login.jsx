import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import React from 'react';


function Login() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      const allUsers = JSON.parse(localStorage.getItem('users')) || {};
      const user = allUsers[username];

      if (user && user.password === password) {
        console.log('Login function called'); // Debugging log
        login(username); // Pass the username to the login function
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } else {
      setError('Both fields are required');
    }
  };

  const handleRegister = () => {
    if (username.trim() && password.trim()) {
      const allUsers = JSON.parse(localStorage.getItem('users')) || {};

      if (allUsers[username]) {
        setError('Username already exists');
      } else {
        allUsers[username] = { password, favorites: [] }; // Store password and initialize favorites
        localStorage.setItem('users', JSON.stringify(allUsers));
       
        login(username); // Pass the username to the login function
        navigate('/'); // Redirect to the home page
      }
    } else {
      setError('Both fields are required');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">
          {isRegister ? 'Register' : 'Login'}
        </h2>
        <input
          type="text"
          placeholder="Enter username"
          className="w-full p-2 mb-3 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {isRegister ? (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
            onClick={handleRegister}
          >
            Register
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            onClick={handleLogin}
          >
            Login
          </button>
        )}
        <p
          className="text-blue-500 text-sm mt-4 cursor-pointer"
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
        >
          {isRegister
            ? 'Already have an account? Login'
            : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
}

export default Login;
