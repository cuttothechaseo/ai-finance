"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/dashboard/Sidebar";
import InterviewDashboardNavbar from "@/app/interview-dashboard/components/InterviewDashboardNavbar";

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      setSidebarOpen(window.innerWidth >= 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message.");
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#59B7F2]">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarOpen ? "md:pl-64" : "md:pl-20"
        } ${isMobile ? "pl-0" : ""}`}
      >
        <InterviewDashboardNavbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto bg-[#59B7F2] p-6">
          {/* Header Section with SVG Cloud Overlays */}
          <div
            className="relative w-full flex flex-col items-center justify-center pt-16 pb-12 mb-8"
            style={{ minHeight: "220px" }}
          >
            {/* Top Right SVG Cloud */}
            <svg
              className="absolute top-0 right-0 w-64 h-64 opacity-20 z-0 pointer-events-none select-none"
              viewBox="0 0 200 200"
              fill="white"
            >
              <circle cx="60" cy="60" r="50" />
              <circle cx="100" cy="70" r="60" />
              <circle cx="140" cy="60" r="50" />
            </svg>
            {/* Bottom Left SVG Cloud */}
            <svg
              className="absolute bottom-0 left-10 w-72 h-72 opacity-5 z-0 pointer-events-none select-none"
              viewBox="0 0 200 200"
              fill="white"
            >
              <circle cx="60" cy="60" r="50" />
              <circle cx="100" cy="70" r="60" />
              <circle cx="140" cy="60" r="50" />
            </svg>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 z-10 text-center">
              Contact Us
            </h1>
            <p className="text-white text-lg z-10 text-center max-w-2xl">
              Have a question, feedback, or need support? Fill out the form
              below and our team will get back to you soon.
            </p>
          </div>
          {/* Contact Form Section */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-[#B3E5FC]/30">
              {submitted ? (
                <div className="bg-green-100 border border-green-300 text-green-700 p-4 rounded-lg text-center">
                  Thank you for reaching out! We'll be in touch soon.
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-[#1E3A8A] mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#B3E5FC]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#59B7F2]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[#1E3A8A] mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#B3E5FC]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#59B7F2]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[#1E3A8A] mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#B3E5FC]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#59B7F2]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-[#1E3A8A] text-white font-semibold rounded-md hover:bg-[#59B7F2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
            {error && (
              <div className="mt-4 bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg text-center">
                {error}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
