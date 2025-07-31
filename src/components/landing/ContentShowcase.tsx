"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ContentTypes } from "@/constants/landing";

export default function ContentShowcase() {
  return (
    <motion.section
      id="Content"
      className="bg-gray-50 dark:bg-gray-900 py-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-16">
          What Can You Discover on{" "}
          <span className="gradient-text">LiniAksara</span>?
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {ContentTypes.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <Image
                src={item.src}
                alt={item.title}
                width={400}
                height={300}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
