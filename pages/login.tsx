import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn, forgotPassword } from "@lib/auth";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showConfirmEmail, setShowConfirmEmail] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [forgotStatus, setForgotStatus] = useState<string>("");
  const [forgotLoading, setForgotLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRememberMeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setShowConfirmEmail(false);

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      await signIn(formData.email, formData.password);
      // Redirect to home page on successful login
      router.push("/");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message && err.message.toLowerCase().includes("confirm")) {
        setShowConfirmEmail(true);
        setError("");
      } else {
        setError(err.message || "Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForgotStatus("");
    if (!forgotEmail) {
      setForgotStatus("Please enter your email address.");
      return;
    }
    setForgotLoading(true);
    try {
      await forgotPassword(forgotEmail);
      setForgotStatus(
        "If an account with that email exists, a password reset link has been sent."
      );
    } catch (err: any) {
      setForgotStatus(err.message || "Failed to send reset email.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleError("");
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) setGoogleError(error.message);
    } catch (err: any) {
      setGoogleError(err.message || "Google sign-in failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#59B7F2] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cloud elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="absolute top-10 right-[10%] w-64 h-64 opacity-5"
          viewBox="0 0 200 200"
          fill="white"
        >
          <circle cx="60" cy="60" r="50" />
          <circle cx="100" cy="70" r="60" />
          <circle cx="140" cy="60" r="50" />
        </svg>

        <svg
          className="absolute bottom-0 left-[20%] w-72 h-72 opacity-5"
          viewBox="0 0 200 200"
          fill="white"
        >
          <circle cx="60" cy="60" r="50" />
          <circle cx="100" cy="70" r="60" />
          <circle cx="140" cy="60" r="50" />
        </svg>

        <svg
          className="absolute top-[40%] left-0 w-48 h-48 opacity-5"
          viewBox="0 0 200 200"
          fill="white"
        >
          <circle cx="60" cy="60" r="50" />
          <circle cx="100" cy="70" r="60" />
          <circle cx="140" cy="60" r="50" />
        </svg>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <div className="flex justify-center">
              <Image
                src="/assets/logos/wallstreetai-logo.svg"
                alt="WallStreetAI Logo"
                width={70}
                height={70}
                className="mx-auto"
              />
            </div>
          </Link>
        </div>

        <motion.div
          className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            <div className="text-center mb-6">
              <h5 className="text-[#1E293B] text-sm font-medium mb-1">
                Please enter your details
              </h5>
              <h2 className="text-[#1E3A8A] text-2xl font-bold">
                Welcome back
              </h2>
            </div>

            {error && (
              <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {showConfirmEmail && (
              <div className="mb-6 bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded-lg text-sm">
                Please check your email to confirm your signup before logging
                in.
              </div>
            )}

            {/* Google Sign In Button (restyled) */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center py-3 px-4 mb-4 border border-[#D1D5DB] rounded-lg shadow-sm text-sm font-semibold bg-white text-[#1E293B] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DB4437]/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                className="mr-2"
                aria-hidden="true"
              >
                <g>
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2045c0-.638-.0573-1.2518-.1636-1.8363H9v3.4818h4.8445c-.2082 1.1218-.8345 2.0736-1.7764 2.7136v2.2582h2.8727C16.3464 14.3464 17.64 11.9945 17.64 9.2045z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.4673-.8064 5.9564-2.1864l-2.8727-2.2582c-.7973.5345-1.8136.8491-3.0836.8491-2.3727 0-4.3846-1.6027-5.1045-3.7564H.8618v2.3364C2.3464 16.4327 5.4464 18 9 18z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.8955 10.6482c-.1818-.5345-.2864-1.1045-.2864-1.6482s.1045-1.1136.2864-1.6482V5.0155H.8618C.3127 6.1045 0 7.5045 0 9s.3127 2.8955.8618 3.9845l3.0337-2.3364z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.5791c1.3227 0 2.5045.4545 3.4364 1.3455l2.5773-2.5773C13.4645.8064 11.4273 0 9 0 5.4464 0 2.3464 1.5673.8618 4.0155l3.0337 2.3364C4.6155 5.1818 6.6273 3.5791 9 3.5791z"
                  />
                </g>
              </svg>
              <span className="font-medium" style={{ color: "#3c4043" }}>
                {googleLoading
                  ? "Signing in with Google..."
                  : "Sign in with Google"}
              </span>
            </button>
            {googleError && (
              <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                {googleError}
              </div>
            )}
            {/* OR Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="mx-3 text-gray-400 text-sm font-medium">or</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-[#DCEFFB] rounded-lg shadow-sm placeholder-slate-400 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/50 focus:border-[#1E3A8A] transition-all duration-200"
                  placeholder="Email address"
                />
              </div>

              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-[#DCEFFB] rounded-lg shadow-sm placeholder-slate-400 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/50 focus:border-[#1E3A8A] transition-all duration-200"
                  placeholder="Password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    className="h-4 w-4 text-[#1E3A8A] focus:ring-[#1E3A8A] border-[#DCEFFB] rounded"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm text-[#1E293B]"
                  >
                    Remember for 30 days
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword((v) => !v)}
                    className="font-medium text-[#1E3A8A] hover:text-[#1E3A8A]/80 transition-colors focus:outline-none"
                  >
                    Forgot password
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-[#1E3A8A] hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A8A]/50 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>

            {/* Forgot Password Modal/Inline Form */}
            {showForgotPassword && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <label
                    htmlFor="forgot_email"
                    className="block text-sm text-[#1E293B] mb-1"
                  >
                    Enter your email to reset your password:
                  </label>
                  <input
                    id="forgot_email"
                    name="forgot_email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="block w-full px-3 py-2 border border-[#DCEFFB] rounded-lg shadow-sm placeholder-slate-400 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/50 focus:border-[#1E3A8A] transition-all duration-200"
                    placeholder="Email address"
                    required
                  />
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-[#1E3A8A] hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A8A]/50 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {forgotLoading ? "Sending..." : "Send reset link"}
                  </button>
                  {forgotStatus && (
                    <div className="text-sm text-[#1E3A8A] mt-2">
                      {forgotStatus}
                    </div>
                  )}
                </form>
              </div>
            )}

            <div className="mt-5 text-center text-sm">
              <p className="text-[#1E293B]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-[#1E3A8A] hover:text-[#1E3A8A]/80 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
