'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for the NEW_PASSWORD_REQUIRED challenge
  const [showPasswordChallenge, setShowPasswordChallenge] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [session, setSession] = useState<string | null>(null);
  const [challengeUsername, setChallengeUsername] = useState<string | null>(null);
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Handle password update
      if (data.challenge === 'NEW_PASSWORD_REQUIRED') {
        setShowPasswordChallenge(true);
        setSession(data.session);
        setChallengeUsername(data.username);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError((error as Error).message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/new-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: challengeUsername,
          newPassword,
          session,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to set new password');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setError((error as Error).message || 'Failed to set new password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generated template for the login and password challenge forms
  // Will be replaced with MUI components later on
  if (showPasswordChallenge) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-6 text-center">Set New Password</h2>
        <p className="text-gray-600 mb-4 text-sm">
          You need to set a new password to continue. Please create a strong password.
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handlePasswordChallenge}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 text-sm font-medium mb-1">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              minLength={8}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              minLength={8}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300"
          >
            {isLoading ? 'Setting Password...' : 'Set New Password'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-center">Sign In</h2>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}