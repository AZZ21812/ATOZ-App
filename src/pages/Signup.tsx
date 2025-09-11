import { useState } from "react";
import { signUp, confirmSignUp } from "aws-amplify/auth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [step, setStep] = useState<"signup" | "confirm">("signup");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email, // 👈 required to link email to the user
          },
        },
      });
      setStep("confirm");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmSignUp({
        username: email,
        confirmationCode,
      });
      alert("✅ Account confirmed! You can now login.");
      setStep("signup");
      setEmail("");
      setPassword("");
      setConfirmationCode("");
    } catch (err: any) {
      setError(err.message || "Confirmation failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {step === "signup" ? (
        <form
          onSubmit={handleSignup}
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4"
        >
          <h2 className="text-xl font-bold text-center">Sign Up</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleConfirm}
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4"
        >
          <h2 className="text-xl font-bold text-center">Confirm Account</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            type="text"
            placeholder="Confirmation Code"
            className="border p-2 rounded w-full"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Confirm
          </button>
        </form>
      )}
    </div>
  );
}
