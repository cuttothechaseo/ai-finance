"use client";

export default function TermsOfServicePage() {
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
          Terms of Service for Wall Street AI
        </h1>
      </div>
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <p className="text-white text-sm mb-4">Effective Date: May 29, 2025</p>
        <p className="text-white mb-6">
          Welcome to Wall Street AI! These Terms of Service ("Terms") govern
          your use of our website (wallstreetai.app) and services provided
          therein. By accessing or using our platform, you agree to these Terms.
        </p>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">1. Overview</h2>
        <p className="text-white mb-4">
          Wall Street AI provides AI-driven tools to assist users in preparing
          for careers in finance. Our platform offers:
        </p>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>AI-Powered Mock Interviews for finance roles.</li>
          <li>Detailed Interview Performance Analysis.</li>
          <li>Performance Tracking and Visual Reports.</li>
          <li>AI-Powered Resume Analysis.</li>
          <li>
            Networking Message Generator for LinkedIn, emails, and cover
            letters.
          </li>
          <li>Smart Resume and Cover Letter Builder.</li>
          <li>
            Lifetime access to all features upon one-time purchase (Pro users).
          </li>
        </ul>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          2. Account Registration
        </h2>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>
            You must provide accurate and complete information during
            registration.
          </li>
          <li>
            You are responsible for maintaining the confidentiality of your
            account credentials.
          </li>
          <li>
            You agree to notify us immediately of any unauthorized use of your
            account.
          </li>
        </ul>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          3. Usage Rights
        </h2>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>
            You are granted personal, non-transferable, non-exclusive access to
            our services.
          </li>
          <li>
            Sharing or distributing access to Wall Street AI's tools, content,
            or your account credentials is strictly prohibited.
          </li>
        </ul>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          4. Intellectual Property
        </h2>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>
            All content, services, and features provided by Wall Street AI are
            the exclusive property of Wall Street AI and are protected by
            copyright, trademark, and other intellectual property laws.
          </li>
          <li>
            You may not copy, reproduce, distribute, or create derivative works
            based on our content without explicit written permission.
          </li>
        </ul>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          5. Payment and Lifetime Access
        </h2>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>
            Users purchasing the Pro plan will receive lifetime access to all
            current and future features.
          </li>
          <li>
            Payment is a one-time fee; no recurring subscriptions are required.
          </li>
          <li>
            Prices and available features may change for new users without prior
            notice; however, your lifetime access will remain unaffected.
          </li>
        </ul>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          6. Refund Policy
        </h2>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>
            Full refunds are available within 7 days of purchase if you have
            accessed fewer than five mock interview sessions, fewer than two
            generated networking messages, or fewer than two Resume Analyses.
          </li>
          <li>
            To request a refund, contact{" "}
            <a href="mailto:support@wallstreetai.app" className="underline">
              support@wallstreetai.app
            </a>
            .
          </li>
        </ul>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          7. Data Privacy
        </h2>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>
            Your personal data, including your name, email, resume details, and
            interview data, are collected to provide personalized AI services.
          </li>
          <li>
            We securely store your data and comply with applicable privacy laws.
            Refer to our Privacy Policy for detailed information.
          </li>
        </ul>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          8. Disclaimer of Warranties
        </h2>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>
            Wall Street AI provides tools for interview preparation and career
            enhancement; however, we do not guarantee job placement or interview
            success.
          </li>
          <li>
            Our services are provided "as-is" without warranties of any kind,
            either express or implied.
          </li>
        </ul>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          9. Limitation of Liability
        </h2>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>
            Wall Street AI shall not be liable for any indirect, incidental,
            consequential, special, or exemplary damages arising from your use
            or inability to use our platform or services.
          </li>
        </ul>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          10. Governing Law
        </h2>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>
            These Terms are governed by the laws of the State of New York,
            United States, without regard to conflict of law principles.
          </li>
        </ul>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          11. Modifications
        </h2>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>We reserve the right to update these Terms periodically.</li>
          <li>
            Any substantial changes will be communicated via email and on our
            website.
          </li>
        </ul>
        <h2 className="text-xl font-bold text-white mt-8 mb-2">
          12. Contact Information
        </h2>
        <ul className="list-disc list-inside text-white mb-6 space-y-1">
          <li>
            If you have questions or concerns, please reach out to us at{" "}
            <a href="mailto:support@wallstreetai.app" className="underline">
              support@wallstreetai.app
            </a>
            .
          </li>
        </ul>
        <p className="text-white mt-8">
          By using Wall Street AI, you acknowledge and agree to comply with
          these Terms.
        </p>
      </div>
    </div>
  );
}
