"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Testimonial type definition
type Testimonial = {
  id: string;
  quote: string;
  student: string;
  company: string;
  profilePic?: string; // Optional profile picture path
};

export default function SuccessStories() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials: Testimonial[] = [
    {
      id: "1",
      quote:
        "The AI interview practice was incredibly realistic and gave me a sense of what to expect. I felt much more confident in my Superday and ended up with an offer from Goldman Sachs.",
      student: "Alex K.",
      company: "Goldman Sachs",
      profilePic: "/assets/testimonials/Alex-K.jpg?v=2",
    },
    {
      id: "2",
      quote:
        "This platform helped me master technical questions I previously struggled with. I gained so much confidence, aced my interviews, and ended up with an offer from Morgan Stanley.",
      student: "Sophia L.",
      company: "Morgan Stanley",
      profilePic: "/assets/testimonials/Sophia-L.jpg?v=2",
    },
    {
      id: "3",
      quote:
        "After using the mock interview platform, my real investment banking interviews felt extremely familiar. The confidence boost was invaluable, and I secured an analyst position at Blackstone.",
      student: "Michael T.",
      company: "Blackstone",
      profilePic: "/assets/testimonials/Michael-T.jpg?v=2",
    },
    {
      id: "4",
      quote:
        "The finance-specific mock interviews gave me insights I couldn't get anywhere else. I was thoroughly prepared for my interviews at JPMorgan.",
      student: "Jennifer C.",
      company: "JPMorgan",
      profilePic: "/assets/testimonials/Jennifer-C.jpg?v=2",
    },
    {
      id: "5",
      quote:
        "The resume optimization tool helped me highlight my relevant skills. I received multiple interview calls and accepted an offer from UBS.",
      student: "Daniel M.",
      company: "UBS",
      profilePic: "/assets/testimonials/Daniel-M.jpg?v=2",
    },
    {
      id: "6",
      quote:
        "I was struggling with case interviews until I found this platform. The personalized feedback helped me refine my approach and land a role at Merrill Lynch.",
      student: "Olivia P.",
      company: "Merrill Lynch",
      profilePic: "/assets/testimonials/Olivia-P.jpg?v=2",
    },
    {
      id: "7",
      quote:
        "The technical question database was extensive and covered everything that came up in my interviews. I'm now working at my dream company.",
      student: "Thomas R.",
      company: "Credit Suisse",
      profilePic: "/assets/testimonials/Thomas-R.jpg?v=2",
    },
    {
      id: "8",
      quote:
        "The networking guidance and industry insights were invaluable. I managed to connect with key professionals and secure a role at Deutsche Bank.",
      student: "Natalie H.",
      company: "Deutsche Bank",
      profilePic: "/assets/testimonials/Natalie-H.jpg?v=2",
    },
    {
      id: "9",
      quote:
        "The mock assessment center simulations were incredibly accurate. I felt prepared for every aspect of the Barclays hiring process thanks to this platform.",
      student: "James W.",
      company: "Evercore",
      profilePic: "/assets/testimonials/James-W.jpg?v=2",
    },
  ];

  // Group testimonials into sets of 3 for each slide
  const testimonialGroups = Array.from(
    { length: Math.ceil(testimonials.length / 3) },
    (_, i) => testimonials.slice(i * 3, i * 3 + 3)
  );

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialGroups.length);
  }, [testimonialGroups.length]);

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + testimonialGroups.length) % testimonialGroups.length
    );
  };

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        nextSlide();
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [isPaused, nextSlide]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section
      id="success-stories"
      className="py-16 relative bg-[#59B7F2] overflow-hidden"
    >
      {/* Cloud elements using CSS */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top Left Cloud */}
        <div className="absolute top-5 left-[5%] w-56 h-56">
          <div className="cloud-shape opacity-20">
            <div className="cloud-circle cloud-circle-1"></div>
            <div className="cloud-circle cloud-circle-2"></div>
            <div className="cloud-circle cloud-circle-3"></div>
          </div>
        </div>

        {/* Bottom Right Cloud */}
        <div className="absolute bottom-10 right-[10%] w-64 h-64">
          <div className="cloud-shape opacity-5">
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

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Success <span className="text-[#B3E5FC]">Stories</span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              See how our platform has helped students land roles at top finance
              firms
            </p>
          </motion.div>
        </div>

        <div
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Testimonial Carousel */}
          <div className="overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonialGroups[currentIndex].map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="bg-white p-6 rounded-xl border border-white/10 shadow-sm"
                    >
                      <p className="text-slate-700 mb-6">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                      <div className="flex items-center">
                        {testimonial.profilePic ? (
                          <div className="mr-4 flex-shrink-0">
                            <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-r from-[#1E3A8A]/40 to-[#B3E5FC]/40">
                              <Image
                                src={testimonial.profilePic}
                                alt={`${testimonial.student} profile`}
                                width={56}
                                height={56}
                                className="rounded-full object-cover w-full h-full border-2 border-white"
                              />
                            </div>
                          </div>
                        ) : null}
                        <div>
                          <p className="font-bold text-[#1E3A8A]">
                            {testimonial.student}
                          </p>
                          <p className="text-[#1E3A8A] text-sm">
                            {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <div className="flex space-x-2">
              {testimonialGroups.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-150 ${
                    currentIndex === index ? "bg-white" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white border border-white/10 shadow-sm text-[#1E3A8A] hover:bg-white/90 transition-colors duration-150"
                aria-label="Previous testimonial"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white border border-white/10 shadow-sm text-[#1E3A8A] hover:bg-white/90 transition-colors duration-150"
                aria-label="Next testimonial"
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
