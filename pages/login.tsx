import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn } from "../lib/auth";
import Image from "next/image";
import { motion } from "framer-motion";

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

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      await signIn(formData.email, formData.password);
      // Redirect to dashboard on successful login
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F2D] bg-gradient-to-b from-[#0F0F2D] to-[#151538] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <div className="flex items-center">
              <Image
                src="/assets/logos/wallstreetai-logo.svg"
                alt="WallStreetAI Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="ml-2 text-xl font-semibold text-white">
                Wall Street AI
              </span>
            </div>
          </Link>
        </div>

        <motion.div
          className="bg-[#151538]/70 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-[#2A2A4A]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            <div className="text-center mb-6">
              <h5 className="text-[#A3A3A3] text-sm font-medium mb-1">
                Please enter your details
              </h5>
              <h2 className="text-white text-2xl font-bold">Welcome back</h2>
            </div>

            {error && (
              <div className="mb-6 bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

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
                  className="appearance-none block w-full px-3 py-3 border border-[#3A3A5A] rounded-lg shadow-sm placeholder-[#6C6C8A] bg-[#1E1E3F]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 focus:border-[#6C63FF] transition-all duration-200"
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
                  className="appearance-none block w-full px-3 py-3 border border-[#3A3A5A] rounded-lg shadow-sm placeholder-[#6C6C8A] bg-[#1E1E3F]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 focus:border-[#6C63FF] transition-all duration-200"
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
                    className="h-4 w-4 text-[#6C63FF] focus:ring-[#6C63FF] border-[#3A3A5A] rounded"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm text-[#A3A3A3]"
                  >
                    Remember for 30 days
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="#"
                    className="font-medium text-[#6C63FF] hover:text-[#8A7FFF] transition-colors"
                  >
                    Forgot password
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-[#6C63FF] hover:bg-[#5A52D5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C63FF] transform transition-all duration-200 hover:translate-y-[-2px] active:translate-y-[0px] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#2A2A4A]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#151538] text-[#A3A3A3]">
                    Or sign in with
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-[#2A2A4A] rounded-lg shadow-sm bg-white/5 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/10 transition-all duration-200 transform hover:translate-y-[-2px] active:translate-y-[0px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
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
                Sign in with Google
              </button>
            </div>

            <div className="mt-5 text-center text-sm">
              <p className="text-[#A3A3A3]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-[#6C63FF] hover:text-[#8A7FFF] transition-colors"
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
