"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import Link from "next/link";

interface HeroProps {
    onOpen: (type: "login" | "signup") => void;
}

export default function Hero({ onOpen }: HeroProps) {
    return (
        <motion.section
            className="relative bg-gray-950 overflow-hidden py-10 md:py-40"
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
                            For Cross-Media Storytelling
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto md:mx-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        In ink and breath, a hidden hope lingers—quiet as dawn between the margins, steady as a pulse beneath the paper, waiting to be heard. LiniAksara is a home for works carried from the writer’s heart to the reader’s light, a warm threshold where languages meet, where indie voices cross oceans and time zones to find their kin. The horizon widens, shall the breeze turn the first page?
                    </motion.p>

                    <motion.div
                        className="flex justify-center md:justify-start flex-wrap gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Link
                            href="/register"
                            className="flex items-center justify-center gap-2 btn-primary px-6 py-3 rounded-full shadow-lg font-semibold"
                        >
                            Start Journey
                        </Link>
                    </motion.div>
                </motion.div>

                {/* RIGHT - Hero Image */}
                <motion.div
                    className="flex-1 flex flex-col items-center relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <div className="relative w-[350px] aspect-square md:w-[400px] md:h-[400px]">
                        <Image
                            src="/hero.png"
                            alt="Maskot LiniAksara"
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
