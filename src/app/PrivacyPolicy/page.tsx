"use client";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#59B7F2]">
      {/* Cloud overlays */}
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
          Privacy Policy for Wall Street AI
        </h1>
      </div>
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <p className="text-white text-sm mb-4">Effective Date: May 29, 2025</p>
        <p className="text-white mb-6">
          Welcome to Wall Street AI! This Privacy Policy outlines how we
          collect, use, protect, and disclose your personal information. By
          using our website (wallstreetai.app), you agree to the terms described
          herein.
        </p>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          1. Information We Collect
        </h2>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>
            <span className="font-semibold">Account Information:</span> Your
            name, email address, and password during registration.
          </li>
          <li>
            <span className="font-semibold">Resume Data:</span> Uploaded
            resumes, including file name, type, size, and content.
          </li>
          <li>
            <span className="font-semibold">Interview Data:</span> Mock
            interview questions, user responses, scores, and AI-generated
            feedback.
          </li>
          <li>
            <span className="font-semibold">Networking Messages:</span>{" "}
            AI-generated networking messages, company/role/contact details, and
            message type.
          </li>
          <li>
            <span className="font-semibold">Usage Data:</span> Log data,
            including access times, device/browser information, and actions
            performed on the platform.
          </li>
          <li>
            <span className="font-semibold">Payment Information:</span> Payment
            transactions processed securely via Stripe. Wall Street AI does not
            store complete payment details.
          </li>
        </ul>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          2. Purpose of Data Collection
        </h2>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>
            <span className="font-semibold">Service Delivery:</span> To offer
            personalized AI-driven interview practice, resume analysis, and
            networking assistance.
          </li>
          <li>
            <span className="font-semibold">Performance Tracking:</span> To
            monitor user progress, generate performance reports, and provide
            tailored insights.
          </li>
          <li>
            <span className="font-semibold">Account Management:</span> For user
            authentication, account management, and customer support.
          </li>
          <li>
            <span className="font-semibold">Product Improvement:</span> To
            analyze usage patterns and enhance features and user experience.
          </li>
          <li>
            <span className="font-semibold">Communication:</span> To send
            updates, support responses, and important service notifications.
          </li>
        </ul>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          3. Data Sharing and Disclosure
        </h2>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>
            <span className="font-semibold">Third-Party Services:</span> Trusted
            providers like Supabase (database/storage), Stripe (payments), and
            email providers (notifications).
          </li>
          <li>
            <span className="font-semibold">Legal Compliance:</span> Information
            may be disclosed if required by law or to protect the safety and
            rights of Wall Street AI and its users.
          </li>
          <li>
            <span className="font-semibold">No Sale of Data:</span> We never
            sell your personal data to third parties.
          </li>
        </ul>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          4. Data Security
        </h2>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>
            <span className="font-semibold">Encryption:</span> Data is securely
            stored using Supabase's managed infrastructure, employing encryption
            at rest and in transit.
          </li>
          <li>
            <span className="font-semibold">Access Controls:</span> Access to
            user data is limited to authorized personnel only, with access
            regularly logged and monitored.
          </li>
        </ul>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          5. User Rights
        </h2>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>
            <span className="font-semibold">Access and Correction:</span> Users
            can access and update personal information via account settings.
          </li>
          <li>
            <span className="font-semibold">Data Deletion:</span> You may
            request deletion of your account and associated data by contacting{" "}
            <a href="mailto:support@wallstreetai.app" className="underline">
              support@wallstreetai.app
            </a>
            .
          </li>
          <li>
            <span className="font-semibold">Opt-Out:</span> Users can opt out of
            non-essential communications anytime.
          </li>
        </ul>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          6. Cookies and Tracking
        </h2>
        <p className="text-white mb-6">
          Our platform uses cookies and similar technologies for authentication,
          analytics, and enhancing user experience.
        </p>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          7. International Data Transfers
        </h2>
        <p className="text-white mb-6">
          Data may be stored and processed in the United States or other
          countries where our service providers, including Supabase, operate.
        </p>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          8. Children's Privacy
        </h2>
        <p className="text-white mb-6">
          Wall Street AI is not intended for individuals under the age of 16. We
          do not knowingly collect personal information from children below this
          age.
        </p>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          9. Changes to This Policy
        </h2>
        <p className="text-white mb-6">
          We may periodically update this Privacy Policy. Significant changes
          will be communicated via email and clearly indicated on our website.
        </p>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">10. Contact</h2>
        <p className="text-white mb-6">
          For privacy-related questions, concerns, or requests, please contact
          us at{" "}
          <a href="mailto:support@wallstreetai.app" className="underline">
            support@wallstreetai.app
          </a>
          .
        </p>
        <p className="text-white mt-8">
          By using Wall Street AI, you acknowledge your understanding and
          acceptance of this Privacy Policy.
        </p>
      </div>
    </div>
  );
}
