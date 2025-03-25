import { NextRequest, NextResponse } from 'next/server';
import { getUserDetails } from '@/app/lib/cognito';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
      const userDetails = await getUserDetails(accessToken);
      
      // Temporary for testing. Will be retrieving user data from database and storing in a UserContext eventually.
      const userData = {
        username: userDetails.Username,
        email: userDetails.UserAttributes?.find(attr => attr.Name === 'email')?.Value,
        cognitoSubId: userDetails.UserAttributes?.find(attr => attr.Name === 'sub')?.Value,
        userAttributes: userDetails.UserAttributes?.reduce((acc: Record<string, string>, attr) => {
          if (attr.Name && attr.Value) {
            acc[attr.Name] = attr.Value;
          }
          return acc;
        }, {}),
      };
      
      return NextResponse.json(userData);
    } catch (error) {
      console.error('Error getting user details:', error);
      return NextResponse.json({ error: 'Failed to get user details' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error in user API route:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}