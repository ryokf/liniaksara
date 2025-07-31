"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

interface FeatureProps {
    icon: IconDefinition;
    title: string;
    description: string;
    index: number;
}

export default function Feature({ icon, title, description, index }: FeatureProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex flex-col items-center text-center p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 shadow-md hover:ring-1 hover:ring-primary/30 transition"
        >
            <FontAwesomeIcon
                icon={icon}
                className={`text-4xl mb-4 feature-icon-${(index % 4) + 1}`}
            />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {description}
            </p>
        </motion.div>
    );
}
