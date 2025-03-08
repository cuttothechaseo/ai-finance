import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Large circle */}
      <motion.div 
        className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full border border-primary/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{ 
          background: 'radial-gradient(circle, rgba(108,43,217,0.05) 0%, rgba(30,30,46,0) 70%)'
        }}
      />
      
      {/* Spinning circles */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/10"
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 0.6, rotate: 360 }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      />
      
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/20"
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 0.7, rotate: -360 }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      />
      
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-primary/30"
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 0.8, rotate: 360 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      />
      
      {/* Glowing orbs */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-6 h-6 rounded-full bg-primary/30 blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 left-1/3 w-4 h-4 rounded-full bg-primary-light/30 blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      />
      
      <motion.div 
        className="absolute top-1/3 left-1/4 w-5 h-5 rounded-full bg-primary/20 blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, delay: 2 }}
      />
    </div>
  );
} 