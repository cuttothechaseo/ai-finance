import { motion } from 'framer-motion';
import { useState } from 'react';

// Finance partners array
const financePartners = [
  { name: 'Goldman Sachs', logo: 'GS', shortName: 'Goldman Sachs' },
  { name: 'Morgan Stanley', logo: 'MS', shortName: 'Morgan Stanley' },
  { name: 'JP Morgan', logo: 'JPM', shortName: 'JP Morgan' },
  { name: 'Blackstone', logo: 'BX', shortName: 'Blackstone' },
  { name: 'BlackRock', logo: 'BLK', shortName: 'BlackRock' },
  { name: 'Evercore', logo: 'EVR', shortName: 'Evercore' },
  { name: 'UBS', logo: 'UBS', shortName: 'UBS' },
  { name: 'Credit Suisse', logo: 'CS', shortName: 'Credit Suisse' },
  { name: 'Deutsche Bank', logo: 'DB', shortName: 'Deutsche Bank' },
  { name: 'Barclays', logo: 'BCS', shortName: 'Barclays' },
];

// Duplicate the array to create a seamless loop
const allPartners = [...financePartners, ...financePartners, ...financePartners];

export default function Partners() {
  const [isPaused, setIsPaused] = useState(false);
  
  return (
    <div className="py-16 bg-black border-t border-gray-900">
      <div className="max-w-full mx-auto">
        <div 
          className="overflow-hidden relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left gradient mask */}
          <div className="absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
          
          <motion.div 
            className="flex items-center"
            initial={{ x: "0%" }}
            animate={{ x: "-33.33%" }}
            transition={{ 
              repeat: Infinity,
              duration: 10,
              ease: "linear",
              repeatType: "loop",
              ...(isPaused && { playState: 'paused' })
            }}
          >
            {allPartners.map((partner, index) => (
              <motion.div
                key={`${partner.name}-${index}`}
                className="px-6 md:px-8 py-4 flex-shrink-0"
                initial={{ opacity: 0.7 }}
                whileHover={{ 
                  opacity: 1, 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{partner.logo}</span>
                  </div>
                  <span className="text-white font-light text-xl tracking-wide whitespace-nowrap">{partner.shortName}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Right gradient mask */}
          <div className="absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
} 