import { useState } from "react";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import { register} from "../services/authapi";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Shield, Lock, UserPlus, Mail } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [step, setStep] = useState<"signup" | "confirm">("signup");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await register({
        username: email,
        password,
        options: {
          userAttributes: {
            email, // required to link email to the user
          },
        },
      });
      setStep("confirm");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationCode) {
      setError("Please enter the confirmation code");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await confirmSignUp({
        username: email,
        confirmationCode,
      });
      alert("✅ Account confirmed! You can now login.");
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Confirmation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignup = () => {
    setStep("signup");
    setConfirmationCode("");
    setError("");
  };

  const handleBackToLogin = () => {
    navigate("/login");
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
            {step === "signup" && "Create your account to get started"}
            {step === "confirm" && "Verify your email address"}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-xl border-0 rounded-2xl p-8">
          {/* Signup Form */}
          {step === "signup" && (
            <>
              <div className="flex items-center mb-6">
                <UserPlus className="text-blue-600 mr-2" size={20} />
                <h2 className="text-xl font-bold text-gray-900">Create Account</h2>
              </div>
              
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    disabled={loading}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                )}

                <div className="flex items-start space-x-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mt-6"
                  disabled={loading || !email || !password}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="text-center mt-6">
                <p className="text-gray-600 mb-4">Already have an account?</p>
                <button
                  onClick={handleBackToLogin}
                  className="w-full h-12 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors flex items-center justify-center"
                >
                  Sign In
                </button>
              </div>
            </>
          )}

          {/* Confirmation Form */}
          {step === "confirm" && (
            <>
              <div className="flex items-center mb-6">
                <Mail className="text-blue-600 mr-2" size={20} />
                <h2 className="text-xl font-bold text-gray-900">Verify Email</h2>
              </div>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <p className="text-gray-600 mb-2">
                  We've sent a verification code to:
                </p>
                <p className="font-semibold text-gray-900">{email}</p>
              </div>

              <form onSubmit={handleConfirm} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="w-full h-16 text-center text-2xl tracking-[0.3em] font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value={confirmationCode}
                    onChange={(e) => { 
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setConfirmationCode(value); 
                      setError(""); 
                    }}
                    disabled={loading}
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Check your email for the verification code
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mt-6"
                  disabled={loading || !confirmationCode}
                >
                  {loading ? "Verifying..." : "Verify Account"}
                </button>
              </form>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={handleBackToSignup}
                  className="w-full h-12 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2" size={16} />
                  Back to Sign Up
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Didn't receive the code?{" "}
                    <button
                      onClick={() => {
                        // Resend logic would go here
                        alert("Resend functionality would be implemented here");
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Resend Code
                    </button>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

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
}