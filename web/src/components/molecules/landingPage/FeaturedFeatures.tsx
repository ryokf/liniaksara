"use client";

import { motion } from "framer-motion";
import { Features } from "@/constants/landing";
import Feature from "./Feature";

export default function FeaturedFeatures() {
  return (
    <motion.section
      id="Feature"
      className="relative bg-gray-50 dark:bg-gray-900 overflow-hidden py-24"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.h2
          className="text-3xl lg:text-4xl font-bold text-center text-gray-800 dark:text-white mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="gradient-text">LiniAksara</span> Featured Features
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {Features.map((feature, index) => (
            <Feature key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
