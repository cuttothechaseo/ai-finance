'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signUp } from '../lib/auth';
import Image from 'next/image';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    background: 'student' // Default value
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.name) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
      router.push('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F2D] bg-gradient-to-b from-[#0F0F2D] to-[#151538] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/">
            <Image 
              src="/assets/logos/wallstreetai-logo.svg" 
              alt="WallStreetAI Logo" 
              width={60} 
              height={60}
              className="mx-auto" 
            />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-[#A3A3A3]">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[#6C63FF] hover:text-[#8A7FFF] transition-colors duration-200">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#151538]/70 backdrop-blur-sm py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-[#2A2A4A]">
          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#A3A3A3]">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-[#3A3A5A] rounded-lg shadow-sm placeholder-[#6C6C8A] bg-[#1E1E3F]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 focus:border-[#6C63FF] transition-all duration-200 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#A3A3A3]">
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
                  className="appearance-none block w-full px-3 py-3 border border-[#3A3A5A] rounded-lg shadow-sm placeholder-[#6C6C8A] bg-[#1E1E3F]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 focus:border-[#6C63FF] transition-all duration-200 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#A3A3A3]">
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
                  className="appearance-none block w-full px-3 py-3 border border-[#3A3A5A] rounded-lg shadow-sm placeholder-[#6C6C8A] bg-[#1E1E3F]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 focus:border-[#6C63FF] transition-all duration-200 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-2 text-xs text-[#A3A3A3]">Password must be at least 6 characters long</p>
            </div>

            <div>
              <label htmlFor="background" className="block text-sm font-medium text-[#A3A3A3]">
                Your Background
              </label>
              <div className="mt-1">
                <select
                  id="background"
                  name="background"
                  value={formData.background}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-[#3A3A5A] rounded-lg shadow-sm bg-[#1E1E3F]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 focus:border-[#6C63FF] transition-all duration-200 sm:text-sm"
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
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-[#6C63FF] hover:bg-[#5A52D5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C63FF] transform transition-all duration-200 hover:translate-y-[-2px] active:translate-y-[0px] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2A2A4A]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#151538] text-[#A3A3A3]">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-[#2A2A4A] rounded-lg shadow-sm bg-white/5 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/10 transition-all duration-200 transform hover:translate-y-[-2px] active:translate-y-[0px]"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"/>
                  <path d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z" fill="#34A853"/>
                </svg>
                Sign up with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 