import { NextResponse } from 'next/server';
import { initiateAuth, processAuthResponse, getUserDetails } from '@/app/lib/cognito';

export const POST = async (request: Request) => {
  try {
    const { username, password } = await request.json();

    try {
      const authResponse = await initiateAuth(username, password);
      const result = processAuthResponse(authResponse);

      if (result.accessToken) {
        const user = await getUserDetails(result.accessToken);
        
        const nextResponse = NextResponse.json(
          { 
            message: 'Login successful',
            user,
            challenge: null
          }
        );

        // Set HTTP-only cookies
        if (result.idToken) {
          nextResponse.cookies.set('idToken', result.idToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            path: '/' 
          });
        }
        
        if (result.accessToken) {
          nextResponse.cookies.set('accessToken', result.accessToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            path: '/' 
          });
        }
        
        if (result.refreshToken) {
          nextResponse.cookies.set('refreshToken', result.refreshToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            path: '/' 
          });
        }

        return nextResponse;
      } else if (result.challenge === 'NEW_PASSWORD_REQUIRED') {
        return NextResponse.json({ 
          challenge: result.challenge, 
          session: result.session,
          username: username
        }, { status: 200 });
      } else {
        console.error('Authentication failed:', result.error);
        return NextResponse.json({ error: result.error || 'Authentication failed' }, { status: 401 });
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      return NextResponse.json({ error }, { status: 401 });
    }
  } catch (error) {
    console.error('Error processing login request:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}