import { useState } from "react";

// Dummy auth hook for now
export const useAuth = () => {
  // Replace this with real Cognito/session state later
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  return {
    isAuthenticated,
    login: () => setIsAuthenticated(true),
    logout: () => setIsAuthenticated(false),
  };
};
