import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

interface RegistrationPageProps {
  setAuthPage: (page: 'login' | 'register') => void;
}

export default function RegistrationPage({ setAuthPage }: RegistrationPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const context = useContext(AppContext);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!username || !password) {
        setError("Username and password are required.");
        return;
    }
    const success = context?.register({ username, password });
    if (success) {
      alert('Registration successful! Please login.');
      setAuthPage('login');
    } else {
      setError('Username already exists.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">SHREEJI MOTERS</h1>
          <p className="text-gray-500">Create an Account</p>
        </div>
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label className="text-sm font-bold text-gray-600 block">Username</label>
            <input
              type="text"
              className="w-full p-3 mt-1 text-gray-800 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-600 block">Password</label>
            <input
              type="password"
              className="w-full p-3 mt-1 text-gray-800 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
           <div>
            <label className="text-sm font-bold text-gray-600 block">Confirm Password</label>
            <input
              type="password"
              className="w-full p-3 mt-1 text-gray-800 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full py-3 font-bold text-white bg-gray-700 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Register
            </button>
          </div>
        </form>
         <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button onClick={() => setAuthPage('login')} className="font-medium text-gray-800 hover:underline">
                    Login
                </button>
            </p>
        </div>
      </div>
    </div>
  );
}
