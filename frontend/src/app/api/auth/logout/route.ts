import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // Clear all authentication cookies
    response.cookies.delete('idToken');
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    
    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}