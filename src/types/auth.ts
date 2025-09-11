export interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export interface SignInData {
  username: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  session?: any;
  user?: any;
  challengeName?: 'MFA_REQUIRED' | 'NEW_PASSWORD_REQUIRED';
  challengeParameters?: any;
  userAttributes?: any;
  requiredAttributes?: any;
}

export interface AuthError {
  message: string;
  code?: string;
}