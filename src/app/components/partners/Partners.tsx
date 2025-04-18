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
    logoPath: "/assets/logos/partners/Goldman-Sachs-Logo.png",
    width: 150,
    height: 50,
    logo: "GS",
    shortName: "Goldman Sachs",
  },
  {
    name: "Morgan Stanley",
    hasLogo: true,
    logoPath: "/assets/logos/partners/Morgan-Stanley-Logo.png",
    width: 150,
    height: 50,
    logo: "MS",
    shortName: "Morgan Stanley",
  },
  {
    name: "JP Morgan",
    hasLogo: true,
    logoPath: "/assets/logos/partners/jpmorgan-logo.png",
    width: 150,
    height: 50,
    logo: "JPM",
    shortName: "JP Morgan",
  },
  {
    name: "Blackstone",
    hasLogo: true,
    logoPath: "/assets/logos/partners/Blackstone-Logo.png",
    width: 150,
    height: 50,
    logo: "BX",
    shortName: "Blackstone",
  },
  {
    name: "BlackRock",
    hasLogo: true,
    logoPath: "/assets/logos/partners/blackrock-logo.svg",
    width: 150,
    height: 50,
    logo: "BLK",
    shortName: "BlackRock",
  },
  {
    name: "Evercore",
    hasLogo: true,
    logoPath: "/assets/logos/partners/evercore-logo.png",
    width: 150,
    height: 50,
    logo: "EVR",
    shortName: "Evercore",
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
    logoPath: "/assets/logos/partners/deutsche-bank-logo.png",
    width: 150,
    height: 50,
    logo: "DB",
    shortName: "Deutsche Bank",
  },
  {
    name: "Barclays",
    hasLogo: true,
    logoPath: "/assets/logos/partners/barclays-logo.png",
    width: 150,
    height: 50,
    logo: "BCS",
    shortName: "Barclays",
  },
  {
    name: "Bank of America",
    hasLogo: true,
    logoPath: "/assets/logos/partners/Bank-of-America-Logo.png",
    width: 150,
    height: 50,
    logo: "BAC",
    shortName: "Bank of America",
  },
];

// Duplicate the array to create a seamless loop
const allPartners = [
  ...financePartners,
  ...financePartners,
  ...financePartners,
];

export default function Partners() {
  const [isPaused, setIsPaused] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // This ensures hydration doesn't cause issues with SSR
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  return (
    <section className="py-16 bg-[#59B7F2] relative overflow-hidden">
      <style jsx global>{`
        .logo-uniform {
          width: 150px !important;
          height: 50px !important;
          object-fit: contain !important;
          filter: brightness(0) invert(1) !important;
          opacity: 0.9 !important;
        }

        .logo-uniform:hover {
          opacity: 1 !important;
          filter: brightness(0) invert(1) !important;
        }
      `}</style>

      <div className="container mx-auto px-4 mb-6 relative z-10">
        <h3 className="text-center text-white text-sm uppercase tracking-wider font-medium mb-8">
          Our students work at top financial institutions
        </h3>
      </div>

      <div className="max-w-full mx-auto relative z-10">
        <div
          className="overflow-hidden relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left gradient mask */}
          <div className="absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-[#59B7F2] to-transparent pointer-events-none"></div>

          {isClient && (
            <motion.div
              className="flex items-center"
              initial={{ x: "0%" }}
              animate={{ x: "-33.33%" }}
              transition={{
                repeat: Infinity,
                duration: 15,
                ease: "linear",
                repeatType: "loop",
                ...(isPaused && { playState: "paused" }),
              }}
            >
              {allPartners.map((partner, index) => (
                <motion.div
                  key={`${partner.name}-${index}`}
                  className="px-6 md:px-8 py-4 flex-shrink-0"
                  initial={{ opacity: 0.6 }}
                  whileInView={{ opacity: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{
                    opacity: 1,
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }}
                >
                  {partner.hasLogo ? (
                    // Display logo for firms with available logos
                    <div className="w-[150px] h-[50px] flex items-center justify-center">
                      <Image
                        src={partner.logoPath}
                        alt={partner.name}
                        width={150}
                        height={50}
                        className="logo-uniform object-contain transition-opacity duration-300"
                      />
                    </div>
                  ) : (
                    // Display text for firms without logos
                    <div className="w-[150px] h-[50px] flex items-center space-x-3">
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

          {/* Right gradient mask */}
          <div className="absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-[#59B7F2] to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
