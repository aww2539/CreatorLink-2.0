import { createHmac } from 'crypto';
import { 
  AuthFlowType, 
  CognitoIdentityProvider, 
  InitiateAuthCommandOutput,
  RespondToAuthChallengeCommandOutput,
  RespondToAuthChallengeCommand,
  ChallengeNameType,
} from '@aws-sdk/client-cognito-identity-provider';

// Initialize the Cognito service provider
const cognito = new CognitoIdentityProvider({
  region: process.env.AWS_REGION,
});

/**
 * Cognito requires a SECRET_HASH key with authentication requests
 * https://docs.aws.amazon.com/cognito/latest/developerguide/signing-up-users-in-your-app.html#cognito-user-pools-computing-secret-hash
 * Calculate the secret hash required for Cognito authentication
 */
export const calculateSecretHash = (username: string, clientId: string, clientSecret: string): string => {
  const hmac = createHmac('sha256', clientSecret);
  hmac.update(username + clientId);
  return hmac.digest('base64');
};

/**
 * Initiate authentication with Cognito
 */
export const initiateAuth = async (username: string, password: string): Promise<InitiateAuthCommandOutput> => {
  const clientId = process.env.COGNITO_CLIENT_ID;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('AWS Client ID or Secret not configured in environment variables.');
  }

  const secretHash = calculateSecretHash(username, clientId, clientSecret);

  const params = {
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: secretHash,
    },
  };

  return await cognito.initiateAuth(params);
};

/**
 * Handle the NEW_PASSWORD_REQUIRED challenge
 */
export const respondToNewPasswordChallenge = async (
  username: string, 
  newPassword: string, 
  session: string
): Promise<RespondToAuthChallengeCommandOutput> => {
  const clientId = process.env.COGNITO_CLIENT_ID;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('AWS Client ID or Secret not configured in environment variables.');
  }

  const secretHash = calculateSecretHash(username, clientId, clientSecret);

  const params = {
    ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
    ClientId: clientId,
    ChallengeResponses: {
      USERNAME: username,
      NEW_PASSWORD: newPassword,
      SECRET_HASH: secretHash,
    },
    Session: session
  };

  const command = new RespondToAuthChallengeCommand(params);
  return await cognito.send(command);
};

/**
 * Get user details from access token
 */
export const getUserDetails = async (accessToken: string) => {
  try {
    return await cognito.getUser({ AccessToken: accessToken });
  } catch (error) {
    console.error('Error getting user details:', error);
    throw error;
  }
};

export type AuthResult = {
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  challenge?: string;
  session?: string;
  error?: string;
};

/**
 * Process authentication response
 */
export const processAuthResponse = (response: InitiateAuthCommandOutput | RespondToAuthChallengeCommandOutput): AuthResult => {
  if (response.AuthenticationResult) {
    return {
      idToken: response.AuthenticationResult.IdToken,
      accessToken: response.AuthenticationResult.AccessToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
    };
  } else if (response.ChallengeName) {
    return {
      challenge: response.ChallengeName,
      session: response.Session
    };
  } else {
    return {
      error: 'Authentication failed with an unknown response'
    };
  }
};