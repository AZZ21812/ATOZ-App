import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import type { SignUpData, SignInData, AuthResult, AuthError } from '../types/auth';

// Initialize Cognito User Pool
const poolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID!,
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID!,
};

export const userPool = new CognitoUserPool(poolData);

// Sign Up Function
export const signUp = async (data: SignUpData): Promise<CognitoUser> => {
  return new Promise((resolve, reject) => {
    const { username, email, password } = data;
    
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      }),
    ];

    userPool.signUp(username, password, attributeList, [], (err, result) => {
      if (err) {
        reject(err as AuthError);
        return;
      }
      resolve(result!.user);
    });
  });
};

// Sign In Function
export const signIn = async (data: SignInData): Promise<AuthResult> => {
  return new Promise((resolve, reject) => {
    const { username, password } = data;
    
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session: CognitoUserSession) => {
        resolve({
          success: true,
          session,
          user: cognitoUser,
        });
      },
      onFailure: (err: any) => {
        reject(err as AuthError);
      },
      mfaRequired: (challengeName: string, challengeParameters: any) => {
        resolve({
          success: false,
          challengeName: 'MFA_REQUIRED',
          user: cognitoUser,
          challengeParameters,
        });
      },
      newPasswordRequired: (userAttributes: any, requiredAttributes: any) => {
        resolve({
          success: false,
          challengeName: 'NEW_PASSWORD_REQUIRED',
          user: cognitoUser,
          userAttributes,
          requiredAttributes,
        });
      },
    });
  });
};

// Confirm Sign Up (Email Verification)
export const confirmSignUp = async (username: string, code: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err as AuthError);
        return;
      }
      resolve(result!);
    });
  });
};

// Get Current User Session
export const getCurrentSession = async (): Promise<{ user: CognitoUser; session: CognitoUserSession } | null> => {
  return new Promise((resolve, reject) => {
    const user = userPool.getCurrentUser();
    
    if (user) {
      user.getSession((err: any, session: CognitoUserSession) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ user, session });
      });
    } else {
      resolve(null);
    }
  });
};

// Sign Out
export const signOut = (): void => {
  const user = userPool.getCurrentUser();
  if (user) {
    user.signOut();
  }
};

// Resend Confirmation Code
export const resendConfirmationCode = async (username: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        reject(err as AuthError);
        return;
      }
      resolve(result!);
    });
  });
};

// Handle MFA Challenge
export const confirmMFA = async (user: CognitoUser, code: string): Promise<CognitoUserSession> => {
  return new Promise((resolve, reject) => {
    user.sendMFACode(code, {
      onSuccess: (session: CognitoUserSession) => {
        resolve(session);
      },
      onFailure: (err: any) => {
        reject(err as AuthError);
      },
    });
  });
};

// Set New Password
export const setNewPassword = async (user: CognitoUser, newPassword: string, userAttributes: any): Promise<CognitoUserSession> => {
  return new Promise((resolve, reject) => {
    user.completeNewPasswordChallenge(newPassword, {}, {
      onSuccess: (session: CognitoUserSession) => {
        resolve(session);
      },
      onFailure: (err: any) => {
        reject(err as AuthError);
      },
    });
  });
};