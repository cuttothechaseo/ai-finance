"use client";

import { useState } from "react";

export default function SupportModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 text-gray-500"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
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
        <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2 text-center">
          Contact Support
        </h2>
        <p className="text-[#475569] mb-6 text-center">
          Have a question or need help? Fill out the form below and our team
          will get back to you soon.
        </p>
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
                className="w-full px-4 py-2 border border-[#B3E5FC]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#59B7F2] text-black placeholder:text-black"
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
                className="w-full px-4 py-2 border border-[#B3E5FC]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#59B7F2] text-black placeholder:text-black"
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
                className="w-full px-4 py-2 border border-[#B3E5FC]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#59B7F2] text-black placeholder:text-black"
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
        {error && (
          <div className="mt-4 bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
