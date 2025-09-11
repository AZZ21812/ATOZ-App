// LoginForm.tsx
import { useState, type ChangeEvent } from "react";
import { Card } from "../components/Layout/ui/card";
import { Input } from "../components/Layout/ui/input";
import { Button } from "../components/Layout/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from 'react-router-dom';

import {
  signIn,
  confirmSignIn,
  verifyTOTPSetup,
  getCurrentUser,
  signOut,
  fetchAuthSession
} from "@aws-amplify/auth";

type ViewState = "login" | "mfa" | "totp-setup" | "authenticated";

export const LoginForm = () => {
  const [view, setView] = useState<ViewState>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [qrCodeUri, setQrCodeUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const clearError = () => setError(null);
  const navigate = useNavigate();


  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await signIn({ 
        username: email, 
        password,
        options: {
          authFlowType: 'USER_SRP_AUTH'
        }
      });
      console.log("Sign in result:", result);

      switch (result.nextStep.signInStep) {
        case "DONE":
          // User is fully authenticated
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          setView("authenticated");
          break;
          
        case "CONFIRM_SIGN_IN_WITH_TOTP_CODE":
          // User has TOTP already set up needs to enter code
          setView("mfa");
          break;
          
        case "CONTINUE_SIGN_IN_WITH_TOTP_SETUP":
          // First time login - need to set up TOTP
          try {
            // Use the totpSetupDetails from the sign-in result instead of calling setUpTOTP()
            const totpSetupDetails = result.nextStep.totpSetupDetails;
            if (totpSetupDetails) {
              const otpAuthUri = totpSetupDetails.getSetupUri("MyApp", email);
              setQrCodeUri(otpAuthUri.toString());
              setView("totp-setup");
            } else {
              throw new Error("TOTP setup details not available");
            }
          } catch (setupError: any) {
            console.error("TOTP setup error:", setupError);
            setError("Failed to set up authenticator: " + setupError.message);
          }
          break;
          
        default:
          console.log("Unhandled sign in step:", result.nextStep.signInStep);
          setError(`Unhandled authentication step: ${result.nextStep.signInStep}`);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2a: Confirm MFA login with authenticator code
  const handleConfirmMFA = async () => {
    if (!mfaCode || mfaCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await confirmSignIn({ 
        challengeResponse: mfaCode.trim() 
      });

      if (result.isSignedIn) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setView("authenticated");
        setMfaCode(""); 
        navigate('/dashboard');
        
      } else {
        setError("Authentication not complete. Please try again.");
      }
    } catch (err: any) {
      console.error("MFA confirmation error:", err);
      setError(err.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2b: Confirm TOTP setup (first time)
  const handleConfirmTOTPSetup = async () => {
    if (!mfaCode || mfaCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For initial TOTP setup, we just need to confirmSignIn with the code
      // The verifyTOTPSetup is handled automatically during this flow
      const result = await confirmSignIn({ 
        challengeResponse: mfaCode.trim() 
      });

      if (result.isSignedIn) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setView("authenticated");
        setMfaCode(""); // Clear the code
        alert("✅ Authenticator app linked successfully! You are now logged in.");
      } else {
        // If not fully signed in, there might be another step
        console.log("TOTP setup result:", result);
        setError("Setup not complete. Please try again.");
      }
    } catch (err: any) {
      console.error("TOTP setup error:", err);
      setError(err.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      handleReset();
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(err.message);
    }
  };

  // Reset form to initial state
  const handleReset = () => {
    setView("login");
    setEmail("");
    setPassword("");
    setMfaCode("");
    setQrCodeUri(null);
    setError(null);
    setUser(null);
  };

  // Handle back button
  const handleBack = () => {
    if (view === "mfa" || view === "totp-setup") {
      // If going back during auth flow, sign out to clean up session
      signOut().catch(console.error);
    }
    handleReset();
  };

  return (
    <Card className="p-6 max-w-md mx-auto mt-12 shadow-lg rounded-2xl">
      {view === "login" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Login</h2>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              clearError();
            }}
            className="mb-2"
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              clearError();
            }}
            className="mb-4"
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <Button 
            onClick={handleLogin} 
            className="w-full" 
            disabled={loading || !email || !password}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
        </div>
      )}

      {view === "mfa" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Enter Authenticator Code</h2>
          <p className="text-sm text-gray-600 mb-4">
            Open your authenticator app and enter the 6-digit code:
          </p>
          <Input
            type="text"
            placeholder="000000"
            value={mfaCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setMfaCode(value);
              clearError();
            }}
            className="mb-4 text-center text-lg tracking-widest"
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && mfaCode.length === 6 && handleConfirmMFA()}
          />
          <Button 
            onClick={handleConfirmMFA} 
            className="w-full mb-2" 
            disabled={loading || mfaCode.length !== 6}
          >
            {loading ? "Verifying..." : "Verify Code"}
          </Button>
          <Button 
            onClick={handleBack} 
            variant="outline" 
            className="w-full"
            disabled={loading}
          >
            Back to Login
          </Button>
        </div>
      )}

      {view === "totp-setup" && (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Setup Authenticator App</h2>
          <div className="mb-4">
            {qrCodeUri && (
              <div className="bg-white p-4 rounded-lg inline-block">
                <QRCodeCanvas value={qrCodeUri} size={180} />
              </div>
            )}
          </div>
          <div className="text-left mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Steps:</strong>
            </p>
            <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
              <li>Install an authenticator app (Google Authenticator, Authy, etc.)</li>
              <li>Scan the QR code above</li>
              <li>Enter the 6-digit code from your app below</li>
            </ol>
          </div>
          <Input
            type="text"
            placeholder="000000"
            value={mfaCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setMfaCode(value);
              clearError();
            }}
            className="mb-4 text-center text-lg tracking-widest"
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && mfaCode.length === 6 && handleConfirmTOTPSetup()}
          />
          <Button 
            onClick={handleConfirmTOTPSetup} 
            className="w-full mb-2" 
            disabled={loading || mfaCode.length !== 6}
          >
            {loading ? "Setting up..." : "Complete Setup"}
          </Button>
          <Button 
            onClick={handleBack} 
            variant="outline" 
            className="w-full"
            disabled={loading}
          >
            Back to Login
          </Button>
        </div>
      )}

      {view === "authenticated" && (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4 text-green-600">✅ Authenticated</h2>
          {user && (
            <div className="mb-4 text-left">
              <p className="text-sm text-gray-600">Welcome back!</p>
              <p className="text-sm font-medium">{user.username}</p>
              {user.userId && (
                <p className="text-xs text-gray-500">ID: {user.userId}</p>
              )}
            </div>
          )}
          <Button onClick={handleLogout} variant="secondary" className="w-full">
            Logout
          </Button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </Card>
  );
};