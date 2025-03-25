import { NextResponse } from 'next/server';
import { respondToNewPasswordChallenge, processAuthResponse, getUserDetails } from '@/app/lib/cognito';

export const POST = async (request: Request) => {
  try {
    const { username, newPassword, session } = await request.json();

    if (!username || !newPassword || !session) {
      return NextResponse.json(
        { error: 'Missing required parameters' }, 
        { status: 400 }
      );
    }

    try {
      const challengeResponse = await respondToNewPasswordChallenge(username, newPassword, session);
      const result = processAuthResponse(challengeResponse);

      if (result.accessToken) {
        const user = await getUserDetails(result.accessToken);
        
        const nextResponse = NextResponse.json(
          { 
            message: 'Password updated successfully',
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
      } else if (result.challenge) {
        return NextResponse.json({ 
          challenge: result.challenge, 
          session: result.session,
          username: username
        }, { status: 200 });
      } else {
        console.error('Challenge response failed:', result.error);
        return NextResponse.json({ error: result.error || 'Failed to set new password' }, { status: 401 });
      }
    } catch (error) {
      console.error('Error during password challenge:', error);
      return NextResponse.json({ error: 'Failed to complete password challenge' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error processing new password request:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}