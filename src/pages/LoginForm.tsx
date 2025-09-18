  import { useEffect, useState, type ChangeEvent } from "react";
  import { Card } from "../components/Layout/ui/card";
  import { Input } from "../components/Layout/ui/input";
  import { Button } from "../components/Layout/ui/button";
  import { useNavigate } from "react-router-dom";
  import { Eye, EyeOff, ArrowLeft, Shield, Lock } from "lucide-react";
  import { login, verifyMfa, requestPasswordReset, confirmPasswordReset } from "../services/authapi";

  type ViewState = "login" | "mfa" | "password-reset-request" | "password-reset-confirm" | "authenticated";

  export const LoginForm = () => {
    const [view, setView] = useState<ViewState>("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mfaCode, setMfaCode] = useState("");
    const [session, setSession] = useState<string | null>(null);
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [connectionId, setConnectionId] = useState<string | null>(null);
    const [ws, setWs] = useState<WebSocket | null>(null);

    const navigate = useNavigate();
    const clearError = () => setError(null);

  
  // const initWebSocket = (idToken: string) => {
  //   const socket = new WebSocket(
  //     `wss://vrt9vxzrlg.execute-api.us-east-1.amazonaws.com/prod?idToken=${encodeURIComponent(idToken)}`
  //   );

  //   socket.onopen = () => console.log("WebSocket connected!");
  //   socket.onmessage = (event) => {
  //     try {
  //       const data = JSON.parse(event.data);
  //       if (data.connectionId) setConnectionId(data.connectionId);
  //       console.log("WebSocket message:", data);
  //     } catch (e) {
  //       console.warn("Invalid WebSocket message", event.data);
  //     }
  //   };
  //   socket.onclose = () => console.log("WebSocket disconnected");
  //   socket.onerror = (err) => console.error("WebSocket error", err);

  //   setWs(socket);
  // };

  /** --- Step 1: Login --- */
  const handleLogin = async () => {
    if (!username || !password) return setError("Enter username and password");
    setLoading(true); clearError();

    try {
      const res = await login(username, password, connectionId || undefined);
      const data = res.data;

      if (data.ChallengeName === "SOFTWARE_TOKEN_MFA" || data.mfaRequired) {
        setSession(data.session);
        setView("mfa");
      } else if (data.AuthenticationResult?.IdToken) {
        localStorage.setItem("idToken", data.AuthenticationResult.IdToken);
        setView("authenticated");
        navigate("/dashboard");
        //initWebSocket(data.AuthenticationResult.IdToken); // Connect WebSocket
      } else {
        setError("Login failed: unknown response");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally { setLoading(false); }
  };

  /** --- Step 2: Verify MFA --- */
  const handleVerifyMfa = async () => {
    if (!mfaCode || !session) return setError("Enter 6-digit code");
    setLoading(true); clearError();

    try {
      const res = await verifyMfa(username, mfaCode, session, connectionId || undefined);
      const data = res.data;

      if (data?.idToken) {
        localStorage.setItem("idToken", data.idToken);
        setView("authenticated");
        navigate("/dashboard");
       // initWebSocket(data.idToken); // Connect WebSocket after MFA
      } else {
        setError("Invalid MFA code");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "MFA verification failed");
    } finally { setLoading(false); }
  };

    /** --- Step 3: Request password reset --- */
    const handleRequestReset = async () => {
      if (!username) return setError("Enter username");
      setLoading(true); clearError();

      try {
        await requestPasswordReset(username);
        setView("password-reset-confirm");
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to send reset code");
      } finally { setLoading(false); }
    };

    /** --- Step 4: Confirm password reset --- */
    const handleConfirmReset = async () => {
      if (!resetCode || !newPassword || !confirmPassword) return setError("Complete all fields");
      if (newPassword !== confirmPassword) return setError("Passwords do not match");
      setLoading(true); clearError();

      try {
        await confirmPasswordReset(username, resetCode, newPassword);
        setView("login");
        setPassword("");
        setResetCode("");
        setNewPassword("");
        setConfirmPassword("");
        alert("Password reset successful! You can now login.");
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to reset password");
      } finally { setLoading(false); }
    };

    /** --- Reset form --- */
    const handleReset = () => {
      setUsername(""); setPassword(""); setMfaCode(""); setSession(null);
      setResetCode(""); setNewPassword(""); setConfirmPassword(""); setError(null);
      setView("login");
    };

    /** --- Navigate to register --- */
    const handleRegister = () => {
      navigate("/register");
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">F</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to FinanceHub</h1>
            <p className="text-gray-600">
              {view === "login" && "Sign in to access your account"}
              {view === "mfa" && "Enter your authentication code"}
              {view === "password-reset-request" && "Reset your password"}
              {view === "password-reset-confirm" && "Set your new password"}
              {view === "authenticated" && "Successfully signed in!"}
            </p>
          </div>

          {/* Main Card */}
          <Card className="bg-white shadow-xl border-0 rounded-2xl p-8">
            {/* Login */}
            {view === "login" && (
              <>
                <div className="flex items-center mb-6">
                  <Lock className="text-blue-600 mr-2" size={20} />
                  <h2 className="text-xl font-bold text-gray-900">Sign In</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username or Email</label>
                    <Input 
                      placeholder="Enter your username or email"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); clearError(); }}
                      className="h-12 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Input 
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); clearError(); }}
                        className="h-12 px-4 pr-12 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 mb-6">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <button 
                    onClick={() => setView("password-reset-request")}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button 
                  onClick={handleLogin}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mb-4"
                  disabled={loading || !username || !password}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center">
                  <p className="text-gray-600 mb-4">Don't have an account?</p>
                  <Button 
                    onClick={handleRegister}
                    variant="outline"
                    className="w-full h-12 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors"
                  >
                    Create Account
                  </Button>
                </div>
              </>
            )}

            {/* MFA */}
            {view === "mfa" && (
              <>
                <div className="flex items-center mb-6">
                  <Shield className="text-blue-600 mr-2" size={20} />
                  <h2 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h2>
                </div>
                
                <p className="text-gray-600 mb-6 text-center">
                  Enter the 6-digit code from your authenticator app
                </p>
                
                <div className="mb-6">
                  <Input
                    placeholder="000000"
                    value={mfaCode}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g,'').slice(0,6);
                      setMfaCode(v);
                      clearError();
                    }}
                    className="h-16 text-center text-2xl tracking-[0.5em] font-mono border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={6}
                  />
                </div>
                
                <Button 
                  onClick={handleVerifyMfa}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mb-4"
                  disabled={loading || mfaCode.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </Button>
                
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2" size={16} />
                  Back to Login
                </Button>
              </>
            )}

            {/* Password reset request */}
            {view === "password-reset-request" && (
              <>
                <div className="flex items-center mb-6">
                  <Lock className="text-blue-600 mr-2" size={20} />
                  <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Enter your username or email address and we'll send you a reset code.
                </p>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username or Email</label>
                  <Input 
                    placeholder="Enter your username or email"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); clearError(); }}
                    className="h-12 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
                
                <Button 
                  onClick={handleRequestReset}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mb-4"
                  disabled={loading || !username}
                >
                  {loading ? "Sending code..." : "Send Reset Code"}
                </Button>
                
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2" size={16} />
                  Back to Login
                </Button>
              </>
            )}

            {/* Password reset confirm */}
            {view === "password-reset-confirm" && (
              <>
                <div className="flex items-center mb-6">
                  <Lock className="text-blue-600 mr-2" size={20} />
                  <h2 className="text-xl font-bold text-gray-900">Set New Password</h2>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Enter the reset code and your new password.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reset Code</label>
                    <Input 
                      placeholder="Enter reset code"
                      value={resetCode}
                      onChange={(e) => { setResetCode(e.target.value); clearError(); }}
                      className="h-12 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <Input 
                        placeholder="Enter new password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); clearError(); }}
                        className="h-12 px-4 pr-12 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Input 
                        placeholder="Confirm new password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
                        className="h-12 px-4 pr-12 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleConfirmReset}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mb-4"
                  disabled={loading || !resetCode || !newPassword || !confirmPassword}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
                
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2" size={16} />
                  Back to Login
                </Button>
              </>
            )}

            {/* Authenticated */}
            {view === "authenticated" && (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl">✅</span>
                  </div>
                  <h2 className="text-xl font-bold text-green-600 mb-4">Successfully Signed In!</h2>
                  <p className="text-gray-600 mb-6">Redirecting to your dashboard...</p>
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center">
                <Shield className="mr-1" size={14} />
                256-bit SSL Encryption
              </span>
              <span>•</span>
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    );
  };