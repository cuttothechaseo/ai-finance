"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

// Define partner types
type PartnerWithLogo = {
  name: string;
  hasLogo: true;
  logoPath: string;
  width: number;
  height: number;
  logo: string;
  shortName: string;
};

type PartnerWithoutLogo = {
  name: string;
  hasLogo: false;
  logo: string;
  shortName: string;
};

type Partner = PartnerWithLogo | PartnerWithoutLogo;

// Finance partners array with logo information
const financePartners: Partner[] = [
  {
    name: "Goldman Sachs",
    hasLogo: true,
    logoPath: "/assets/logos/partners/Goldman-Sachs-Logo-tumb.png",
    width: 150,
    height: 50,
    logo: "GS",
    shortName: "Goldman Sachs",
  },
  {
    name: "Morgan Stanley",
    hasLogo: true,
    logoPath: "/assets/logos/partners/Morgan-Stanley-Logo-tumb.png",
    width: 150,
    height: 50,
    logo: "MS",
    shortName: "Morgan Stanley",
  },
  {
    name: "JP Morgan",
    hasLogo: true,
    logoPath: "/assets/logos/partners/J.P.-Morgan-Chase-Logo-tumb.png",
    width: 150,
    height: 50,
    logo: "JPM",
    shortName: "JP Morgan",
  },
  {
    name: "BlackRock",
    hasLogo: true,
    logoPath: "/assets/logos/partners/BlackRock-Logo.png",
    width: 150,
    height: 50,
    logo: "BLK",
    shortName: "BlackRock",
  },
  {
    name: "KKR",
    hasLogo: true,
    logoPath: "/assets/logos/partners/KKR-Logo-thumb.png",
    width: 150,
    height: 50,
    logo: "KKR",
    shortName: "KKR",
  },
  {
    name: "UBS",
    hasLogo: true,
    logoPath: "/assets/logos/partners/UBS_Logo.png",
    width: 150,
    height: 50,
    logo: "UBS",
    shortName: "UBS",
  },
  {
    name: "Credit Suisse",
    hasLogo: true,
    logoPath: "/assets/logos/partners/Credit-Suisse-logo.png",
    width: 150,
    height: 50,
    logo: "CS",
    shortName: "Credit Suisse",
  },
  {
    name: "Deutsche Bank",
    hasLogo: true,
    logoPath: "/assets/logos/partners/deutsche-bank-logo-png-transparent.png",
    width: 150,
    height: 50,
    logo: "DB",
    shortName: "Deutsche Bank",
  },
  {
    name: "Barclays",
    hasLogo: true,
    logoPath: "/assets/logos/partners/Barclays-Logo.wine.png",
    width: 150,
    height: 50,
    logo: "BCS",
    shortName: "Barclays",
  },
  {
    name: "Bank of America",
    hasLogo: true,
    logoPath: "/assets/logos/partners/Bank-of-America-Logo-tumb.png",
    width: 150,
    height: 50,
    logo: "BAC",
    shortName: "Bank of America",
  },
  {
    name: "Merrill Lynch",
    hasLogo: true,
    logoPath: "/assets/logos/partners/Merrill-Lynch-logo.png",
    width: 150,
    height: 50,
    logo: "MER",
    shortName: "Merrill Lynch",
  },
  {
    name: "Citi",
    hasLogo: true,
    logoPath: "/assets/logos/partners/citi-logo-transparent.png",
    width: 150,
    height: 50,
    logo: "C",
    shortName: "Citi",
  },
  {
    name: "Evercore",
    hasLogo: true,
    logoPath: "/assets/logos/partners/Evercore.webp",
    width: 150,
    height: 50,
    logo: "EVR",
    shortName: "Evercore",
  },
];

// Duplicate the array to create a seamless loop
const allPartners = [
  ...financePartners,
  ...financePartners,
  ...financePartners,
];

export default function Partners() {
  const [currentPartners, setCurrentPartners] = useState<Partner[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // This ensures hydration doesn't cause issues with SSR
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== "undefined") {
      setIsClient(true);

      // Initialize with a random set of partners
      shufflePartners();

      // Set up the interval to shuffle partners every 7 seconds
      const interval = setInterval(() => {
        animatePartnerChange();
      }, 7000);

      // Clean up the interval on component unmount
      return () => clearInterval(interval);
    }
  }, []);

  // Function to handle the animation sequence
  const animatePartnerChange = () => {
    setIsAnimating(true);

    // Wait for fade-out animation to complete
    setTimeout(() => {
      shufflePartners();
      // Begin fade-in animation
      setIsAnimating(false);
    }, 500);
  };

  // Function to randomly select partners to display
  const shufflePartners = () => {
    const shuffled = [...financePartners].sort(() => 0.5 - Math.random());

    // Single row layout - determine how many logos to show based on screen width
    const logoCount =
      window.innerWidth < 640
        ? 3
        : window.innerWidth < 768
        ? 4
        : window.innerWidth < 1024
        ? 6
        : 8;

    setCurrentPartners(shuffled.slice(0, logoCount));
  };

  return (
    <section className="py-16 bg-[#59B7F2] relative overflow-hidden">
      <style jsx global>{`
        .logo-container {
          width: 150px !important;
          height: 50px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background-color: transparent !important;
        }

        .logo-uniform {
          width: auto !important;
          max-width: 150px !important;
          height: auto !important;
          max-height: 50px !important;
          object-fit: contain !important;
          transition: all 0.3s ease !important;
        }

        /* Apply different styles depending on image format */
        .logo-png,
        .logo-webp {
          filter: brightness(0) invert(1) !important;
          opacity: 0.9 !important;
        }

        .logo-jpg {
          background-color: white !important;
          border-radius: 8px !important;
          padding: 5px !important;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) !important;
        }

        .logo-uniform:hover {
          opacity: 1 !important;
          transform: scale(1.05);
        }

        .partner-container {
          width: 100%;
          max-width: 1400px;
          padding: 0 40px;
          margin: 0 auto;
          overflow: hidden;
        }

        .partner-row {
          display: flex;
          flex-wrap: nowrap;
          justify-content: center;
          align-items: center;
          gap: 4rem;
          margin: 0 auto;
          padding: 1rem 0;
        }

        @media (max-width: 1024px) {
          .partner-row {
            gap: 3rem;
          }
          .partner-container {
            padding: 0 30px;
          }
        }

        @media (max-width: 768px) {
          .partner-row {
            gap: 2rem;
          }
          .partner-container {
            padding: 0 20px;
          }
        }

        @media (max-width: 640px) {
          .partner-row {
            gap: 1.5rem;
          }
        }
      `}</style>

      <div className="container mx-auto px-4 mb-6 relative z-10">
        <h3 className="text-center text-white text-sm uppercase tracking-wider font-medium mb-8">
          Our students work at top financial institutions
        </h3>
      </div>

      <div className="partner-container relative z-10">
        {isClient && (
          <motion.div
            className="partner-row"
            initial={{ opacity: 1 }}
            animate={{ opacity: isAnimating ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            {currentPartners.map((partner, index) => (
              <motion.div
                key={`${partner.name}-${index}`}
                className="partner-item flex items-center justify-center flex-shrink-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                }}
              >
                {partner.hasLogo ? (
                  <div className="logo-container">
                    <Image
                      src={partner.logoPath}
                      alt={partner.name}
                      width={150}
                      height={50}
                      className={`logo-uniform ${
                        partner.logoPath.toLowerCase().endsWith(".jpg")
                          ? "logo-jpg"
                          : partner.logoPath.toLowerCase().endsWith(".webp")
                          ? "logo-webp"
                          : "logo-png"
                      }`}
                    />
                  </div>
                ) : (
                  <div className="h-[50px] flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#1E3A8A]/20 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {partner.logo}
                      </span>
                    </div>
                    <span className="text-white font-light text-xl tracking-wide whitespace-nowrap">
                      {partner.shortName}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
