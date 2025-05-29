"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signUp } from "@lib/auth";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

interface FormData {
  email: string;
  password: string;
  name: string;
  background: string;
}

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    background: "student", // Default value
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCheckEmail, setShowCheckEmail] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password || !formData.name) {
      setError("Please fill in all required fields");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.background
      );
      // Show check email message instead of redirecting
      setShowCheckEmail(true);
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
      setGoogleError(err.message || "Google sign up failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#59B7F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
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

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-md py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-white/20">
          <div className="flex flex-col items-center mb-6">
            <Link href="/">
              <Image
                src="/assets/logos/wallstreetai-logo.svg"
                alt="WallStreetAI Logo"
                width={70}
                height={70}
                className="mx-auto"
              />
            </Link>
            <h2 className="mt-4 text-center text-2xl font-bold text-[#1E3A8A]">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-[#1E3A8A]/80">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[#1E3A8A] hover:text-[#1E3A8A]/80 transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
          {showCheckEmail && (
            <div
              className="mb-6 bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded-lg relative"
              role="alert"
            >
              <span className="block sm:inline">
                Check your email to confirm your signup before logging in.
              </span>
            </div>
          )}
          {error && (
            <div
              className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
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
                ? "Signing up with Google..."
                : "Sign up with Google"}
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

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#1E293B]"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-[#DCEFFB] rounded-lg shadow-sm placeholder-slate-400 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/50 focus:border-[#1E3A8A] transition-all duration-200 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1E293B]"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-[#DCEFFB] rounded-lg shadow-sm placeholder-slate-400 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/50 focus:border-[#1E3A8A] transition-all duration-200 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1E293B]"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-[#DCEFFB] rounded-lg shadow-sm placeholder-slate-400 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/50 focus:border-[#1E3A8A] transition-all duration-200 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-1 text-xs text-[#1E293B]">
                Password must be at least 6 characters long
              </p>
            </div>

            <div>
              <label
                htmlFor="background"
                className="block text-sm font-medium text-[#1E293B]"
              >
                Background
              </label>
              <div className="mt-1">
                <select
                  id="background"
                  name="background"
                  value={formData.background}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-[#DCEFFB] rounded-lg shadow-sm bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/50 focus:border-[#1E3A8A] transition-all duration-200 sm:text-sm"
                >
                  <option value="student">Student</option>
                  <option value="recent_graduate">Recent Graduate</option>
                  <option value="professional">Finance Professional</option>
                  <option value="career_changer">Career Changer</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-[#1E3A8A] hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A8A]/50 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <p className="text-xs text-center text-[#1E293B]">
              By signing up, you agree to our{" "}
              <a href="#" className="text-[#1E3A8A] hover:text-[#1E3A8A]/80">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#1E3A8A] hover:text-[#1E3A8A]/80">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
