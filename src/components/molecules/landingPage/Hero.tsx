"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface HeroProps {
    onOpen: (type: "login" | "signup") => void;
}

export default function Hero({ onOpen }: HeroProps) {
    return (
        <motion.section
            className="relative bg-white dark:bg-gray-950 overflow-hidden py-40"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-16">
                {/* LEFT - Text Content */}
                <motion.div
                    className="flex-1 space-y-6 text-center md:text-left md:pl-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.2,
                            },
                        },
                    }}
                >
                    <motion.h1
                        className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        An International Platform <br />
                        <span className="gradient-text">
                            For Original Works Made Without AI
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto md:mx-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        In every stroke and sentence, there is an unspoken hope. LiniAksara wanna be a home for works that come with writer&apos;s heart to reader. The infinite world is waiting to be tread, doesn&apos;t wind want to open this page?
                    </motion.p>

                    <motion.div
                        className="flex justify-center md:justify-start flex-wrap gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <button
                            onClick={() => onOpen("signup")}
                            className="flex items-center justify-center gap-2 btn-primary px-6 py-3 rounded-full shadow-lg"
                        >
                            Start Adventure
                        </button>

                        <button
                            onClick={() => onOpen("login")}
                            className="border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-white"
                        >
                            Home
                        </button>
                    </motion.div>
                </motion.div>

                {/* RIGHT - Hero Image */}
                <motion.div
                    className="flex-1 flex flex-col items-center relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <div className="relative w-[450px] h-[450px] md:w-[400px] md:h-[400px]">
                        <Image
                            src="/hero.png"
                            alt="Maskot Inkur"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    {/* Neon Line */}
                    <div className="w-3/4 h-[5px] mt-0 rounded-full gradient-bg animate-glow" />
                </motion.div>
            </div>
        </motion.section>
    );
}
