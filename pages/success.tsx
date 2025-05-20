import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/components/AuthProvider";
import { motion } from "framer-motion";

export default function Success() {
  const { refreshUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    refreshUser();
    const timeout = setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
    return () => clearTimeout(timeout);
  }, [refreshUser, router]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#59B7F2] overflow-hidden pt-20">
      <div className="container mx-auto px-4 py-16 text-center relative z-10">
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Payment Successful!
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          You now have Pro access. Redirecting to your dashboard...
        </motion.p>
        <motion.div
          className="flex justify-center mb-6 sm:mb-8 md:mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className="py-4 px-8 bg-white text-[#1E3A8A] text-lg font-semibold rounded-xl shadow-md flex items-center justify-center">
            🚀 Enjoy your new Pro features!
          </span>
        </motion.div>
      </div>
    </section>
  );
}
