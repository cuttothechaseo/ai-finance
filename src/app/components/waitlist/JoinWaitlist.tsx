"use client";

// Fixed version without useMemo import and with correct destructuring
import { useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WaitlistContext } from "@/app/contexts/WaitlistContext";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Glowing lock icon component
const GlowingLockIcon = () => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-white/40 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      {/* Lock icon */}
      <motion.div
        className="relative z-10 w-20 h-20 md:w-24 md:h-24 bg-[#1E3A8A]/20 rounded-full flex items-center justify-center shadow-md border border-white/20"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <svg
          className="w-10 h-10 md:w-12 md:h-12 text-white"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

// Modal component - moved outside of JoinWaitlist
const WaitlistModal = () => {
  const { isModalOpen, setIsModalOpen } = useContext(WaitlistContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    interest: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    university: "",
    interest: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Handle input changes with useCallback
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));
      // Clear error when user types
      if (formErrors[id as keyof typeof formErrors]) {
        setFormErrors((prev) => ({ ...prev, [id]: "" }));
      }
    },
    [formErrors]
  );

  // Validate form with useCallback
  const validateForm = useCallback(() => {
    let valid = true;
    const newErrors = { ...formErrors };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!formData.university.trim()) {
      newErrors.university = "University is required";
      valid = false;
    }

    if (!formData.interest) {
      newErrors.interest = "Please select your interest";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  }, [formData, formErrors]);

  // Handle form submission with useCallback
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Reset status
      setSubmitStatus({ type: null, message: "" });

      // Validate form
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        // Check if email already exists
        const { data: existingUser } = await supabase
          .from("waitlist")
          .select("email")
          .eq("email", formData.email)
          .single();

        if (existingUser) {
          setSubmitStatus({
            type: "error",
            message: "This email is already on the waitlist.",
          });
          setIsSubmitting(false);
          return;
        }

        // Insert data into waitlist table
        const { error } = await supabase.from("waitlist").insert([
          {
            name: formData.name,
            email: formData.email,
            university: formData.university,
            interest: formData.interest,
          },
        ]);

        if (error) {
          throw error;
        }

        // Success
        setSubmitStatus({
          type: "success",
          message:
            "Thank you for joining our waitlist! We'll notify you when premium features become available.",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          university: "",
          interest: "",
        });
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitStatus({
          type: "error",
          message: "An error occurred. Please try again later.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm]
  );

  // Use AnimatePresence to handle the modal animation
  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="min-h-screen px-4 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-white rounded-xl p-4 md:p-6 w-full max-w-sm z-50 shadow-lg border border-white/10 my-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-[#1E3A8A]/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-[#1E3A8A]"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="16" r="1" fill="currentColor" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-1 text-[#1E3A8A] text-center">
                  Join the Waitlist
                </h3>
                <p className="text-slate-600 mb-4 text-center text-sm">
                  Be the first to access our premium AI interview coaching
                  features.
                </p>

                <form className="space-y-3" onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium text-slate-600 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A] outline-none text-slate-800 text-sm placeholder:text-slate-400"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {formErrors.name && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-medium text-slate-600 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A] outline-none text-slate-800 text-sm placeholder:text-slate-400"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {formErrors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="university"
                      className="block text-xs font-medium text-slate-600 mb-1"
                    >
                      University
                    </label>
                    <input
                      type="text"
                      id="university"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A] outline-none text-slate-800 text-sm placeholder:text-slate-400"
                      placeholder="Your university"
                      value={formData.university}
                      onChange={handleChange}
                    />
                    {formErrors.university && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.university}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="interest"
                      className="block text-xs font-medium text-slate-600 mb-1"
                    >
                      I&apos;m interested in
                    </label>
                    <select
                      id="interest"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A] outline-none text-slate-800 text-sm"
                      value={formData.interest}
                      onChange={handleChange}
                    >
                      <option value="">Select your interest</option>
                      <option value="ib">Investment Banking</option>
                      <option value="pe">Private Equity</option>
                      <option value="re">Real Estate</option>
                      <option value="other">Other Finance Role</option>
                    </select>
                    {formErrors.interest && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.interest}
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{
                      filter: "brightness(1.05)",
                      scale: 1.02,
                    }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full py-2 px-4 bg-[#1E3A8A] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm mt-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Joining..." : "Join Waitlist"}
                  </motion.button>
                </form>

                {submitStatus.type === "success" && (
                  <p className="text-xs text-green-500 mt-3 text-center">
                    {submitStatus.message}
                  </p>
                )}

                {submitStatus.type === "error" && (
                  <p className="text-xs text-red-500 mt-3 text-center">
                    {submitStatus.message}
                  </p>
                )}

                {!submitStatus.type && (
                  <p className="text-xs text-slate-500 mt-3 text-center">
                    We&apos;ll notify you when premium features become
                    available. No spam, ever.
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function JoinWaitlist() {
  const { setIsModalOpen } = useContext(WaitlistContext);

  // Use useCallback for the click handler to prevent unnecessary re-renders
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);

  return (
    <section
      id="join-waitlist"
      className="py-16 relative overflow-hidden bg-[#59B7F2]"
    >
      {/* Cloud elements using CSS */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top Right Cloud */}
        <div className="absolute top-10 right-[10%] w-64 h-64">
          <div className="cloud-shape opacity-10">
            <div className="cloud-circle cloud-circle-1"></div>
            <div className="cloud-circle cloud-circle-2"></div>
            <div className="cloud-circle cloud-circle-3"></div>
          </div>
        </div>

        {/* Bottom Left Cloud */}
        <div className="absolute bottom-0 left-[20%] w-72 h-72">
          <div className="cloud-shape opacity-5">
            <div className="cloud-circle cloud-circle-1"></div>
            <div className="cloud-circle cloud-circle-2"></div>
            <div className="cloud-circle cloud-circle-3"></div>
          </div>
        </div>

        {/* Middle Left Cloud */}
        <div className="absolute top-[40%] left-0 w-48 h-48">
          <div className="cloud-shape opacity-15">
            <div className="cloud-circle cloud-circle-1"></div>
            <div className="cloud-circle cloud-circle-2"></div>
            <div className="cloud-circle cloud-circle-3"></div>
          </div>
        </div>

        {/* Cloud Styling */}
        <style jsx>{`
          .cloud-shape {
            position: relative;
            width: 100%;
            height: 100%;
          }
          .cloud-circle {
            position: absolute;
            background-color: white;
            border-radius: 50%;
          }
          .cloud-circle-1 {
            width: 50%;
            height: 50%;
            top: 25%;
            left: 10%;
          }
          .cloud-circle-2 {
            width: 60%;
            height: 60%;
            top: 30%;
            left: 30%;
          }
          .cloud-circle-3 {
            width: 50%;
            height: 50%;
            top: 25%;
            left: 50%;
          }
        `}</style>
      </div>

      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent opacity-80 z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-lg border border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Lock Icon */}
            <div className="flex-shrink-0">
              <GlowingLockIcon />
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Unlock{" "}
                <span className="text-[#B3E5FC]">Premium AI Coaching</span>{" "}
                (Coming Soon)
              </h2>

              <p className="text-white/90 text-lg mb-8">
                Early members get exclusive access to premium features,
                including voice-based AI interviews & personalized feedback.
              </p>

              <motion.button
                whileHover={{
                  filter: "brightness(1.05)",
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenModal}
                className="py-4 px-8 bg-white text-[#1E3A8A] text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center mb-6 sm:mb-8 md:mb-10"
              >
                <span className="relative z-10">
                  🚀 Join Waitlist for Premium Access
                </span>
              </motion.button>

              {/* Urgency indicators */}
              <motion.div
                className="md:text-left text-center max-w-xs mx-auto md:mx-0"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {/* Live counter */}
                <p className="text-white/80 text-xs sm:text-sm mb-3">
                  <span className="font-semibold text-white">142</span> students
                  have joined this week
                </p>

                {/* Progress bar */}
                <div className="w-full max-w-xs mx-auto md:mx-0 mb-2 bg-[#1E3A8A]/30 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className="bg-white h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "84%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
                <p className="text-white/80 text-xs font-medium">
                  <motion.span
                    className="font-semibold text-white"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    84%
                  </motion.span>{" "}
                  of early access spots are now filled
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <WaitlistModal />
    </section>
  );
}
