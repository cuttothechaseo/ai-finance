"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signUp } from "../lib/auth";
import Image from "next/image";

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
      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "An error occurred during signup");
    } finally {
      setIsLoading(false);
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

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/assets/logos/wallstreetai-logo.svg"
              alt="WallStreetAI Logo"
              width={70}
              height={70}
              className="mx-auto"
            />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-white/80">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#B3E5FC] hover:text-white transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-md py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-white/20">
          {error && (
            <div
              className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

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
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#DCEFFB]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-[#1E293B]">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-[#DCEFFB] rounded-lg shadow-sm bg-white text-sm font-medium text-[#1E293B] hover:bg-[#F8FAFC] transition-all duration-200 transform hover:translate-y-[-2px] active:translate-y-[0px]"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z"
                    fill="#34A853"
                  />
                </svg>
                Sign up with Google
              </button>
            </div>
          </div>

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
