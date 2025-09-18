import axios from "axios";

const API_BASE = "http://localhost:8080/api/auth";

// ------------------------
// Register
// ------------------------
export interface Register {
  username: string;
  password: string;
  options : any
}

export const register = (username: string, password: string, options:any)  => {
  const body: Register = { username, password, options};
  return axios.post(`${API_BASE}/register`, body, { withCredentials: true });
};

// ------------------------
// Login
// ------------------------
export interface LoginRequest {
  username: string;
  password: string;
  connectionId?: string; // optional for sending connectionId
}

export const login = (username: string, password: string ,connectionId?: string) => {
  const body: LoginRequest = { username, password, connectionId};
  return axios.post(`${API_BASE}/login`, body, { withCredentials: true });
};

// ------------------------
// MFA Verification
// ------------------------
export interface VerifyMfaRequest {
  username: string;
  code: string;
  session: string;
  connectionId?: string; // optional for sending connectionId
}

export const verifyMfa = (username: string, code: string, session: string,connectionId?:string) => {
  const body: VerifyMfaRequest = { username, code, session, connectionId};
  return axios.post(`${API_BASE}/mfa`, body, { withCredentials: true });
};

// ------------------------
// Password Reset Request
// ------------------------
export interface PasswordResetRequest {
  username: string;
}

export const requestPasswordReset = (username: string) => {
  const body: PasswordResetRequest = { username };
  return axios.post(`${API_BASE}/password-reset-request`, body, { withCredentials: true });
};

// ------------------------
// Confirm Password Reset
// ------------------------
export interface ConfirmPasswordResetRequest {
  username: string;
  code: string;
  newPassword: string;
}

export const confirmPasswordReset = (username: string, code: string, newPassword: string) => {
  const body: ConfirmPasswordResetRequest = { username, code, newPassword };
  return axios.post(`${API_BASE}/password-reset-confirm`, body, { withCredentials: true });
};

