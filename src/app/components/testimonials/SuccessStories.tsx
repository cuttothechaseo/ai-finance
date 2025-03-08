'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Testimonial type definition
type Testimonial = {
  id: string;
  quote: string;
  student: string;
  company: string;
};

export default function SuccessStories() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const testimonials: Testimonial[] = [
    {
      id: '1',
      quote: "The AI interview practice was incredibly realistic. I felt much more confident in my Superday and ended up with an offer from Goldman Sachs.",
      student: "Alex K.",
      company: "Goldman Sachs"
    },
    {
      id: '2',
      quote: "This platform helped me master technical questions I struggled with. The personalized feedback was like having a private tutor.",
      student: "Sophia L.",
      company: "Morgan Stanley"
    },
    {
      id: '3',
      quote: "After practicing with the AI interviewer, my real PE interviews felt familiar. I secured an associate position at Blackstone.",
      student: "Michael T.",
      company: "Blackstone"
    },
    {
      id: '4',
      quote: "The real-time feedback on my answers helped me refine my approach. I'm now working at my dream firm thanks to this platform.",
      student: "Emma R.",
      company: "JP Morgan"
    },
    {
      id: '5',
      quote: "The structured practice and analytics helped me identify my weak areas. I improved rapidly and landed a role at KKR.",
      student: "David W.",
      company: "KKR"
    }
  ];

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
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
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section id="success-stories" className="py-section relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Success <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">Stories</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how our platform has helped students land roles at top finance firms
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
                  opacity: { duration: 0.2 }
                }}
                className="w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0, 1, 2].map((offset) => {
                    const index = (currentIndex + offset) % testimonials.length;
                    return (
                      <div key={testimonials[index].id} className="bg-card p-6 rounded-xl">
                        <div className="flex text-yellow-400 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-primary">★</span>
                          ))}
                        </div>
                        <p className="text-gray-300 mb-6">&ldquo;{testimonials[index].quote}&rdquo;</p>
                        <div>
                          <p className="font-bold">{testimonials[index].student}</p>
                          <p className="text-primary text-sm">{testimonials[index].company}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentIndex === index ? "bg-primary" : "bg-gray-600"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 