"use client";

import Link from "next/link";
import {
  IoNewspaperOutline,
  IoPeopleOutline,
  IoChatbubblesOutline,
} from "react-icons/io5";

export default function ProfileSection() {
  const cards = [
    {
      href: "/resume/analyses",
      icon: <IoNewspaperOutline className="w-10 h-10 text-[#59B7F2] mb-4" />,
      title: "Resume Analyses",
      desc: "Get AI-powered feedback and improvement suggestions for your resume.",
      cta: "Analyze Resume",
    },
    {
      href: "/networking/messages",
      icon: <IoPeopleOutline className="w-10 h-10 text-[#59B7F2] mb-4" />,
      title: "Networking Messages",
      desc: "Generate and manage personalized networking messages for finance roles.",
      cta: "Go to Networking",
    },
    {
      href: "/interview-dashboard",
      icon: <IoChatbubblesOutline className="w-10 h-10 text-[#59B7F2] mb-4" />,
      title: "Mock Interviews",
      desc: "Practice with AI-powered mock interviews tailored for finance positions.",
      cta: "Start Practicing",
    },
  ];

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12 md:ml-0 ml-16">
      <div className="w-full max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#FFFF] mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-[#FFFF] text-lg">
            Jump into the tools that will help you break into finance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.href}
              className="flex flex-col items-center bg-white/90 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-8 text-center"
            >
              {card.icon}
              <h2 className="text-xl font-semibold text-[#1E3A8A] mb-2">
                {card.title}
              </h2>
              <p className="text-[#1E3A8A]/70 mb-6">{card.desc}</p>
              <Link
                href={card.href}
                className="mt-auto inline-block px-6 py-2 rounded-lg bg-[#59B7F2] text-white font-semibold shadow hover:bg-[#1E3A8A] transition-colors duration-200"
              >
                {card.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
