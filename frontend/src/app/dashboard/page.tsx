'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Generated dashboard page template for early auth testing
// Will be replaced with home page
export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<{
    username: string;
    email?: string;
    cognitoSubId?: string;
    userAttributes?: Record<string, string>;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">User Profile</h2>
          {userData ? (
            <div>
              <p className="mb-2"><span className="font-medium">Username:</span> {userData.username}</p>
              {userData.email && (
                <p className="mb-2"><span className="font-medium">Email:</span> {userData.email}</p>
              )}
              {userData.cognitoSubId && (
                <p className="mb-2"><span className="font-medium">Cognito Sub ID:</span> {userData.cognitoSubId}</p>
              )}
              {userData.userAttributes && (
                <div>
                  <h3 className="text-lg font-semibold mt-4">User Attributes</h3>
                  <ul className="list-disc list-inside">
                    {Object.entries(userData.userAttributes).map(([key, value]) => (
                      <li key={key} className="mb-1">
                        <span className="font-medium">{key}:</span> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-4">Last login: {new Date().toLocaleString()}</p>
            </div>
          ) : (
            <p>No user data available</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Your Content</h3>
            <p className="text-gray-600">Manage and view your creator content.</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              View Content
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600">View your content performance metrics.</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}