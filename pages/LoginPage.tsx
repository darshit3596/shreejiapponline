import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

interface LoginPageProps {
  setAuthPage: (page: 'login' | 'register') => void;
}

export default function LoginPage({ setAuthPage }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const context = useContext(AppContext);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = context?.login(username, password);
    if (success) {
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">SHREEJI MOTERS</h1>
          <p className="text-gray-500">Invoice & Inventory Login</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="text-sm font-bold text-gray-600 block">Username</label>
            <input
              type="text"
              className="w-full p-3 mt-1 text-gray-800 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-600 block">Password</label>
            <input
              type="password"
              className="w-full p-3 mt-1 text-gray-800 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full py-3 font-bold text-white bg-gray-700 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button onClick={() => setAuthPage('register')} className="font-medium text-gray-800 hover:underline">
                    Register
                </button>
            </p>
        </div>
      </div>
    </div>
  );
}
